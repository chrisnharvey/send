import pbkdf2 from 'pbkdf2'
import generatePassword from 'password-generator'

export default class Encryption {
  constructor() {
    window.openpgp.initWorker({ path:'/js/openpgp.worker.min.js' }) 
  }

  deriveKey(from, salt, rounds = 5000) {
    return new Promise((resolve) => {
      pbkdf2.pbkdf2(from, salt, rounds, 64, 'sha256', (err, derivedKey) => {
        resolve(derivedKey.toString('hex'))
      })
    })
  }

  encryptFileObject(name, fileObject, password) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader

      reader.onload = () => {
        this.encrypt(name, reader.result, password).then(response => {
          resolve(response)
        })
      }

      reader.readAsArrayBuffer(fileObject)
    })
  }

  encrypt(name, contents, password) {
    return new Promise((resolve) => {
      // Generate a key and salt
      let key = generatePassword()
      let salt = generatePassword()

      // Encryption password is the generated key if no password was defined
      password = password ? password : key

      let authKeyPromise = this.deriveKey(key, salt)
      let encryptionKeyPromise = this.deriveKey(password, salt, 5001)

      Promise.all([authKeyPromise, encryptionKeyPromise]).then(keys => {
        let [authKey, encryptionKey] = keys

        let fileNamePromise = window.openpgp.encrypt({
          message: window.openpgp.message.fromText(name),
          passwords: [encryptionKey],
          armor: true
        }).then(ciphertext => {
          return ciphertext.data
        })
  
        let fileContentsPromise = window.openpgp.encrypt({
          message: window.openpgp.message.fromBinary(new Uint8Array(contents)),
          passwords: [encryptionKey],
          armor: false
        }).then(ciphertext => {
          return new Blob([
            ciphertext.message.packets.write()
          ], {
            type: "application/octet-stream"
          })
        })

        return Promise.all([fileNamePromise, fileContentsPromise]).then((encryptedData) => {
          let [fileName, fileContents] = encryptedData

          resolve({
            fileName,
            fileContents,
            authKey,
            encryptionKey,
            key,
            salt
          })
        })
      })
    })
  }

  decryptFileName(name, key, salt, password) {
    return this.decrypt({encrypted: name, key, salt, password})
  }

  decryptFile(contents, key, salt, password) {
    return this.decrypt({encrypted: contents, key, salt, password, format: 'binary'})
  }

  decrypt({encrypted, key, salt, password, format = 'utf8'}) {
    return new Promise((resolve, reject) => {
      password = password ? password : key

      this.deriveKey(password, salt, 5001).then(encryptionKey => {
        let readMessage;

        if (format == 'binary') {
          readMessage = window.openpgp.message.read(new Uint8Array(encrypted))
        } else {
          readMessage = window.openpgp.message.readArmored(encrypted)
        }

        readMessage.then((message) => {
          window.openpgp.decrypt({
            message,
            format,
            passwords: [encryptionKey],
          }).then(decrypted => {
            resolve(decrypted.data)
          })
        })
      })

    })
  }

  generateKeypair(password) {
    let options = {
      userIds: [{ name:'', email:'' }],
      numBits: 2048,
      passphrase: password
    }

    return new Promise((resolve) => {
      window.openpgp.generateKey(options).then(function(keypair) {
        resolve({
          public: keypair.publicKeyArmored,
          private: keypair.privateKeyArmored
        })
      })
    })
  }

  parsePrivateKey(key, password) {
    return this.parseKey(key)[0].decrypt(password)
  }

  parseKey(key) {
    window.openpgp.key.readArmored(key).keys
  }
}