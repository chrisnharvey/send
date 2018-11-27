import React, { Component } from 'react';
import Encryption from '../lib/Encryption'
import { HashGet } from 'hashget'
import { Button, Progress } from 'antd';
import FileSaver from 'file-saver';
import { Redirect } from 'react-router'
import Api from '../lib/Api';


export default class Download extends Component {

    constructor(props) {
        super(props)

        this.hash = new HashGet
        this.encryption = new Encryption
        this.api = new Api

        this.key = this.hash.getValue('k')
        this.salt = this.hash.getValue('s')
        this.identifier = props.match.params.identifier

        this.state = {
          state: 'loading'
        }
    }

    getFile() {
      return new Promise((resolve, reject) => {
        this.encryption.getAuthKey(this.key, this.salt).then(authKey => {
          this.api.getFile(this.identifier, authKey).then(response => {
            resolve(response)
          })
        })
      })
    }

    downloadFile() {
      this.api.downloadFile(this.state.path, downloadPercent => {
        this.setState({
          state: 'downloading',
          downloadPercent
        })
      }).then(file => {
        // Start decrypting
        this.encryption.decryptFile(file, this.key, this.salt).then(decrypted => {
          // Open file dialog
          FileSaver.saveAs(
            new Blob([decrypted], {type: "octet/stream"}),
            this.state.name
          )

          this.setState({
            state: 'complete'
          })
        })
      })
    }

    componentDidMount() {
      this.getFile().then(data => {

        if (! data.has_password) {
          // This file doesn't have a password, so lets decrypt the filename
          this.encryption.decryptFileName(data.name, this.key, this.salt).then(decrypted => {
            this.setState({
              ...data,
              name: decrypted,
              state: 'ready'
            })
          })
        } else {
          this.setState({
            state: 'password'
          })
        }
      }, error => {
        console.error(error)
      })
    }

    render() {
      switch (this.state.state) {
        case 'loading':
          return 'Loading...'
        
        case 'password':
          return 'Enter password'

        case 'downloading':
          return <Progress type="circle" width={210} percent={this.state.downloadPercent} format={percent => percent == 100 ? 'Decrypting' : `${percent}%`} />

        case 'complete':
          return <Redirect to="/complete" />
      }

      return (
        <div>
          <p>{this.state.name}</p>
          <Button type="primary" icon="download" size="large" onClick={this.downloadFile.bind(this)}>Download</Button>
        </div>
      )
    }

}