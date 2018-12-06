import React, { Component } from 'react';

export default class UploadSuccess extends Component {
  render() {
    return (
      <div>
        <h1 style={{textAlign: 'center'}}>Upload Complete</h1>
        <p style={{textAlign: 'center'}}>Your file has been uploaded successfully and will expire in 48 hours. You can share your file using the link below.</p>

        <p>URL: http://send.local/{this.props.data.identifier}#k={this.props.data.key}&s={this.props.data.salt}</p>
      </div>
    );
  }
}