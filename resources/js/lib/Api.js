import Axios from "axios";

export default class Api {

  getFile(identifier, authKey) {
    return new Promise((resolve, reject) => {
      Axios.get(`/api/files/${identifier}?auth_key=${authKey}`).then(response => {
        resolve(response.data.data)
      }, response => {
        reject(response)
      })
    })
  }

  downloadFile(path, onProgress) {
    return new Promise((resolve, reject) => {
      Axios.get(path, {
        responseType: 'arraybuffer',
        onDownloadProgress: (e) => {
          if (! onProgress) {
            return;
          }

          onProgress(
            (Math.floor((e.loaded / e.total) * 100))
          )
        }
      }).then(response => resolve(response.data))
    })
  }

	uploadFile(name, file, authKey) {

		// Instantiate a new FormData object
		let formData = new FormData

		// Add our data to it
		formData.append('name', name)
		formData.append('file', file)
		formData.append('auth_key', authKey)

    return new Promise((resolve, reject) => {
      // Actually upload our encrypted file to the server
      Axios.post('/api/files',
        formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      ).then(
        response => resolve(response.data.data),
        response => reject(response)
      )
    })
		
	}

}