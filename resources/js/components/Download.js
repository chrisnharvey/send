import React, { Component } from 'react';
import Encryption from '../lib/Encryption'
import { HashGet } from 'hashget'
import { Button, Progress, Spin } from 'antd';
import FileSaver from 'file-saver';
import { Redirect } from 'react-router'
import File from '../lib/File';

export default class Download extends Component {

    constructor(props) {
        super(props)

        this.getProgressFormat.bind(this)

        this.hash = new HashGet
        this.file = new File

        this.key = this.hash.getValue('k')
        this.salt = this.hash.getValue('s')
        this.identifier = props.match.params.identifier

        this.state = {
          state: 'loading'
        }
    }

    downloadFile() {
      this.file.download({
        path: this.state.path,
        key: this.key,
        salt: this.salt,
        onProgress: downloadPercent => {
          this.setState({
            state: 'downloading',
            downloadPercent
          })
        }
      }).then(file => {
        FileSaver.saveAs(
          new Blob([file], {type: "octet/stream"}),
          this.state.name
        )

        this.setState({
          state: 'complete'
        })
      })
    }

    componentDidMount() {
      this.file.get(this.identifier, this.key, this.salt).then(file => {

        this.setState({
          ...file,
          state: file.has_password ? 'password' : 'ready'
        })
    
      }, error => {
        console.error(error)
      })
    }

    getProgressFormat(percent) {
      if (percent == 100) {
        return <Spin tip="Decrypting" size="large" />
      } else {
        return `${percent}%`
      }
    }

    render() {
      switch (this.state.state) {
        case 'loading':
          return (
            <div style={{textAlign: 'center'}}>
              <Spin size="large" />
            </div>
          )

        case 'downloading':
          return (
            <div style={{textAlign: 'center'}}>
              <Progress type="circle" width={210} percent={this.state.downloadPercent} format={this.getProgressFormat} />
            </div>
          )

        case 'complete':
          return <Redirect to="/complete" />
      }

      return (
        <div>
          <h1 style={{textAlign: 'center'}}>{this.state.name}</h1>
          <p style={{textAlign: 'center'}}>Your friend has shared this file with you securely using Skygard Send.</p>
          <p style={{textAlign: 'center'}}>Skygard Send is a service that allows you to send files through a private link that automatically expires.
          Your files are encrypted in your browser before uploading, meaning only you, and people you share your link to
          can see the name and contents of your file.</p>

          <div style={{textAlign: 'center'}}>
            <Button type="primary" icon="download" size="large" onClick={this.downloadFile.bind(this)}>Download</Button>
          </div>
        </div>
      )
    }

}