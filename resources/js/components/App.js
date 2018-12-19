import { BrowserRouter as Router, Route , Switch, Link} from "react-router-dom";
import React, { Component } from 'react';
import { Layout, Row, Col } from 'antd';
const { Header, Content, Footer } = Layout;
import Download from './Download'
import DownloadComplete from './DownloadComplete'
import UploadSuccess from './UploadSuccess'
import Upload from "./Upload";

export default class App extends Component {

  render() {
    return (
      <Router>
        <Layout className="layout">
          <Header style={{margin: '20px', textAlign: 'center', background: '#f0f2f5'}}>
            <Link to="/">
              <img src="/img/logo.png" />
            </Link>
          </Header>

          <Content style={{ padding: '0 24px', minHeight: 280 }} className="main-layout-content">
            <Row type="flex" justify="center" align="middle">
              <Col span={12} style={{background: '#fff', padding: '20px'}}>
                <Switch>
                  <Route path="/" exact component={Upload} />
                  <Route path="/share/:identifier" exact component={UploadSuccess} />
                  <Route path="/complete" exact component={DownloadComplete} />
                  <Route path="/:identifier" component={Download} />
                </Switch>
              </Col>
            </Row>
          </Content>

          <Footer className="footer" style={{ textAlign: "center" }}>
            Skygard Send is an Open Source project licensed under AGPLv3

            <div style={{marginTop: '10px'}}>
              <a href="https://gitlab.com/skygard/send" target="_blank">
                <img src="/img/icons/gitlab.svg" style={{width: '30px', marginRight: '10px'}} />
              </a>

              <a href="https://twitter.com/skygardio" target="_blank">
                <img src="/img/icons/twitter.svg" style={{width: '30px'}} />
              </a>
            </div>
          </Footer>
        </Layout>
      </Router>
    )
  }

}