import React, { Component } from 'react';
import { Progress } from 'antd';

export default class DownloadComplete extends Component {

    render() {
      return (
        <div style={{textAlign: 'center'}}>
          <Progress type="circle" width={210} percent={100} />
        </div>
      )
    }

}