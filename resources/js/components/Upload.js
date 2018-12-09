import React, { Component } from 'react';
import { Icon, Upload as Uploader, Progress, Spin } from 'antd';
import Encryption from '../lib/Encryption'
import Api from '../lib/Api'
import File from '../lib/File';
import { Redirect } from 'react-router'

const Dragger = Uploader.Dragger

export default class Upload extends Component {
  constructor(props) {
    super(props)

    this.uploadFile = this.uploadFile.bind(this)
    this.getProgressFormat = this.getProgressFormat.bind(this)

    this.encryption = new Encryption
    this.api = new Api
    this.file = new File

    this.state = {
      error: false,
      uploading: false,
      encrypting: false,
      file: {}
    }
  }

  uploadFile(e) {
    if (e.fileList.length == 0) {
      this.setState({
        uploading: false,
        encrypting: false
      })
    } else {
      this.setState({
        uploading: true,
        encrypting: true
      })

      this.file.upload({
        name: e.fileList[0].name,
        file: e.fileList[0].originFileObj,
        onProgress: uploadPercent => {
          this.setState({
            uploadPercent
          })
        },
        onEncryptionComplete: () => {
          this.setState({
            encrypting: false
          })
        }
      }).then(file => {
        let files = window.sessionStorage.getItem('files')
        files = files ? JSON.parse(files) : {}

        files[file.identifier] = file

        window.sessionStorage.setItem('files', JSON.stringify(files))

        this.setState({
          success: true,
          file
        })
      }, () => {
        this.setState({
          error: true
        })
      })
    }
  }

  getProgressFormat(percent) {
    if (this.state.encrypting) {
      return <Spin tip="Encrypting" size="large" />
    } else if (percent == 100) {
      return <Spin tip="Processing" size="large" />
    } else {
      return `${percent}%`
    }
  }

  getUploadProgressComponent() {
    return (
      <div style={{textAlign: 'center'}}>
        <Progress type="circle" width={210} status={this.state.error ? 'exception' : 'normal'} percent={this.state.uploadPercent} format={this.state.error ? null : this.getProgressFormat} />
      </div>
    )
  }

  getUploadBoxComponent() {
    return (
      <Dragger disabled={this.state.uploaded} onChange={this.uploadFile} beforeUpload={() => false}>
        <p className="ant-upload-drag-icon">
        <Icon type="upload" />
        </p>
        <p className="ant-upload-text">{ this.state.uploaded ? this.state.file.name : 'Drag a file here or click to upload' }</p>
        <p className="ant-upload-hint">Max filesize: 500MB. Your file will be encrypted in your browser before upload.</p>
      </Dragger>
    )
  }

  render() {
    if (this.state.success) {
      return <Redirect to={`/share/${this.state.file.identifier}`} />
    }

    return (
      <div>
        <h1 style={{textAlign: 'center'}}>Send Files, Securely</h1>
        <p style={{textAlign: 'center'}}>Skygard Send is a service that allows you to send files through a private link that automatically expires.
          Your files are encrypted in your browser before uploading, meaning only you, and people you share your link to
          can see the name and contents of your file.</p>
        { this.state.uploading ? this.getUploadProgressComponent() : this.getUploadBoxComponent() }
      </div>
    )
  }
}