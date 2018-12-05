import Api from './Api';
import Encryption from './Encryption';

export default class File {
  constructor() {
    this.api = new Api
    this.encryption = new Encryption
  }

  get(identifier, key, salt) {
    return new Promise((resolve, reject) => {
      // Get the auth key based on the key and salt
      this.encryption.getAuthKey(key, salt).then(authKey => {
        // Get the file details from the API
        this.api.getFile(identifier, authKey).then(file => {
          // If the file has no password, decrypt the filename
          if (! file.has_password) {
            this.encryption.decryptFileName(file.name, key, salt).then(decrypted => {
              file.name = decrypted

              resolve(file)
            })
          } else {

            resolve(file)

          }
        })
      })
    })
  }

  download({path, key, salt, password, onProgress, onDownloadComplete}) {
    return new Promise((resolve, reject) => {
      this.api.downloadFile(path, onProgress).then(file => {
        if (onDownloadComplete) {
          onDownloadComplete(file)
        }

        // Start decrypting
        this.encryption.decryptFile(file, key, salt, password).then(decrypted => {
          resolve(decrypted)
        })
      })
    })
  }

  upload({name, file, password, onEncryptionComplete, onProgress}) {
    return new Promise((resolve, reject) => {
      this.encryption.encryptFileObject(name, file, password).then(encryptionData => {
        if (onEncryptionComplete) {
          onEncryptionComplete()
        }

        this.api.uploadFile(encryptionData.fileName, encryptionData.fileContents, encryptionData.authKey, onProgress).then(fileData => {
          resolve({
            ...fileData,
            ...encryptionData
          })
        })
      })
    })
    
  }
}