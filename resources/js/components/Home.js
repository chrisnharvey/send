import React, { Component } from 'react';
import Upload from './Upload'
import UploadSuccess from './UploadSuccess'

export default class Home extends Component {
    constructor(props) {
        super(props)

        this.uploadSuccess = this.uploadSuccess.bind(this)

        this.state = {
            uploadSuccess: false,
            uploadData: {}
        }
    }

    uploadSuccess(data) {
        this.setState({
            uploadSuccess: true,
            uploadData: data
        })
    }

    render() {
        return (
            <div>
                <h1 style={{textAlign: 'center'}}>Send Files, Securely</h1>
                {this.state.uploadSuccess ? <UploadSuccess data={this.state.uploadData} /> : <Upload success={this.uploadSuccess} />}
            </div>
        );
    }
}