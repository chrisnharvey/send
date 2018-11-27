import Axios from "axios";

export default class Api {

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
        response => resolve(response.data),
        response => reject(response)
      )
    })
		
	}

}