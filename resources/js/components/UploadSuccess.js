import React, { Component } from 'react';
import { Input } from 'antd';

const Search = Input.Search;

export default class UploadSuccess extends Component {

  constructor(props) {
    super(props)

    let files = window.sessionStorage.getItem('files')
    files = files ? JSON.parse(files) : {}

    this.file = files[props.match.params.identifier]

    this.state = {
      copyButtonText: 'Copy to clipboard'
    }
  }

  copyToClipboard(e) {
    this.urlField.input.select()

    document.execCommand('copy');

    this.setState({
      copyButtonText: 'Copied'
    })

    setTimeout(() => {
      this.setState({
        copyButtonText: 'Copy to clipboard'
      })
    }, 2000)
  }

  render() {
    return (
      <div>
        <h1 style={{textAlign: 'center'}}>Upload Complete</h1>
        <p style={{textAlign: 'center'}}>Your file has been uploaded successfully and will expire in 48 hours. You can share your file using the link below.</p>

        <Search
          value={`http://send.local/${this.file.identifier}#k=${this.file.key}&s=${this.file.salt}`}
          enterButton={this.state.copyButtonText}
          size="large"
          onSearch={this.copyToClipboard.bind(this)}
          ref={urlField => this.urlField = urlField}
          readOnly={true}
        />
      </div>
    );
  }

}