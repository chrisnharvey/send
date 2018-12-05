import React, { Component } from 'react';
import generatePassword from 'password-generator'
import { Icon, Upload as Uploader, Input, Button, Checkbox, Row } from 'antd';
import Encryption from '../lib/Encryption'
import Api from '../lib/Api'
import File from '../lib/File';

const Dragger = Uploader.Dragger

export default class Upload extends Component {
  constructor(props) {
    super(props)

    this.submit = this.submit.bind(this)
    this.fileChanged = this.fileChanged.bind(this)
    this.passwordChanged = this.passwordChanged.bind(this)
    this.addPasswordChanged = this.addPasswordChanged.bind(this)

    this.encryption = new Encryption
    this.api = new Api
    this.file = new File

    this.state = {
      uploading: false,
      uploaded: false,
      submitButtonMessage: 'Upload',
      addPassword: false,
      password: '',//generatePassword(12, false),
      file: {}
    }
  }

  submit() {
    this.setState({
      uploading: true,
      submitButtonMessage: 'Encrypting...'
    })

    this.file.upload({
      name: this.state.file.name,
      file: this.state.file.originFileObj,
      password: this.state.password,
      onEncryptionComplete: () => {
        this.setState({
          submitButtonMessage: 'Uploading..'
        })
      }
    }).then(file => {
      console.log(file)
      this.props.success(file)
    })
  }

  fileChanged(e) {
    if (e.fileList.length == 0) {
      this.setState({
        file: {},
        uploaded: false
      })
    } else {
      this.setState({
        file: e.fileList[0],
        uploaded: true
      })
    }
  }

  passwordChanged(e) {
    this.setState({
      password: e.target.value
    })
  }

  addPasswordChanged(e) {
    this.setState({
      addPassword: e.target.checked
    })
  }

  render() {
    return (
      <div>
        <Dragger disabled={this.state.uploaded} onChange={this.fileChanged} beforeUpload={() => false}>
          <p className="ant-upload-drag-icon">
          <Icon type="upload" />
          </p>
          <p className="ant-upload-text">{ this.state.uploaded ? this.state.file.name : 'Drag a file here or click to upload' }</p>
          <p className="ant-upload-hint">Max filesize: 500MB. Your file will be encrypted in your browser using the password below before upload.</p>
        </Dragger>

        <Row type="flex" justify="center">
          <Checkbox style={{marginTop: '10px'}} checked={this.state.addPassword} onChange={this.addPasswordChanged}>Add a password?</Checkbox>
        </Row>

        <Row type="flex" justify="center">
          <Input hidden={!this.state.addPassword} style={{width: 200, marginTop:'10px'}} size="large" placeholder="Enter a password" value={this.state.password} onChange={this.passwordChanged} />
        </Row>

        <Row type="flex" justify="center">
          <Button disabled={!this.state.uploaded} style={{marginTop:'10px'}} type="primary" size="large" loading={this.state.uploading} onClick={this.submit}>
            {this.state.submitButtonMessage}
          </Button>
        </Row>
      </div>
    )
  }
}