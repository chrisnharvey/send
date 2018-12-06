import React, { Component } from 'react';
import generatePassword from 'password-generator'
import { Icon, Upload as Uploader, Progress} from 'antd';
import Encryption from '../lib/Encryption'
import Api from '../lib/Api'
import File from '../lib/File';

const Dragger = Uploader.Dragger

export default class Upload extends Component {
  constructor(props) {
    super(props)

    this.uploadFile = this.uploadFile.bind(this)

    this.encryption = new Encryption
    this.api = new Api
    this.file = new File

    this.state = {
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
        this.props.success(file)
      })
    }
  }

  getUploadProgressComponent() {
    return (
      <Progress type="circle" width={210} percent={this.state.uploadPercent} format={percent => this.state.encrypting ? 'Encrypting' : `${percent}%`} />
    )
  }

  getUploadBoxComponent() {
    return (
      <Dragger disabled={this.state.uploaded} onChange={this.uploadFile} beforeUpload={() => false}>
        <p className="ant-upload-drag-icon">
        <Icon type="upload" />
        </p>
        <p className="ant-upload-text">{ this.state.uploaded ? this.state.file.name : 'Drag a file here or click to upload' }</p>
        <p className="ant-upload-hint">Max filesize: 500MB. Your file will be encrypted in your browser using the password below before upload.</p>
      </Dragger>
    )
  }

  render() {
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