import React, { Component } from 'react';

export default class UploadSuccess extends Component {
    render() {
        return (
            <div>
                <h2>Upload complete</h2>

                <p>URL: http://send.local/{this.props.data.identifier}#k={this.props.data.key}&s={this.props.data.salt}</p>
            </div>
        );
    }
}