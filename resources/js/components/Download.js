import React, { Component } from 'react';
import Encryption from '../lib/Encryption'
import { HashGet } from 'hashget'
import { Button, Progress } from 'antd';
import FileSaver from 'file-saver';
import { Redirect } from 'react-router'
import File from '../lib/File';

export default class Download extends Component {

    constructor(props) {
        super(props)

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

    render() {
      switch (this.state.state) {
        case 'loading':
          return 'Loading...'
        
        case 'password':
          return 'Enter password'

        case 'downloading':
          return (
            <div style={{textAlign: 'center'}}>
              <Progress type="circle" width={210} percent={this.state.downloadPercent} format={percent => percent == 100 ? 'Decrypting' : `${percent}%`} />
            </div>
          )

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