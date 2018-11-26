import { BrowserRouter as Router, Route , Switch} from "react-router-dom";
import React, { Component } from 'react';
import { Layout, Row, Col } from 'antd';
const { Header, Content, Footer } = Layout;
import Home from './Home'
import Download from './Download'

export default class App extends Component {

	render() {
		return (
			<Router>
				<Layout className="layout">
					<Header style={{background: '#f0f2f5'}}>

					</Header>

					<Content style={{ padding: '0 24px', minHeight: 280 }} className="main-layout-content">
						<Row type="flex" justify="center" align="middle">
							<Col span={12} style={{background: '#fff', padding: '20px'}}>
								<Switch>
									<Route path="/" exact component={Home} />
									<Route path="/:identifier" component={Download} />
								</Switch>
							</Col>
						</Row>
					</Content>

					<Footer className="footer" style={{ textAlign: "center" }}>

					</Footer>
				</Layout>
			</Router>
		)
	}

}