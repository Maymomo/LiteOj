import styles from './index.css';
import React from "react";
import {Layout, Row, Col, Menu} from 'antd';
import {Link} from 'umi'
import UserManger from "./components/UserManager";
import {connect} from "dva";
import withRouter from 'umi/withRouter';

const {
  Header, Content, Footer
} = Layout;

function BasicLayout(props) {
  if (props.location.pathname.toString().includes('/probleminfo',0)) {
    return <div>{ props.children }</div>;
  }
  return <Layout className="layout" style={{ height: "100vh" }}>
    <Header className={styles.header}>
      <Row>
        <Col md={4}/>
        <Col md={2}>
          <div style={{ textAlign: "center" }}>
            LiteOj
          </div>
        </Col>
        <Col md={12}>
          <Menu theme="light" mode="horizontal" defaultSelectedKeys={['1']} style={{ lineHeight: "64px" }}>
            <Menu.Item key="1">
              <Link to="/">
                Home
              </Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/problems">
                Problems
              </Link>
            </Menu.Item>
            <Menu.Item key="3">
              <Link to="/rank">
                Rank
              </Link>
            </Menu.Item>
            <Menu.Item key="4">
              <Link to="/status">
                Status
              </Link>
            </Menu.Item>
            <Menu.Item key="5">
              <Link to="/contest">
                Contests
              </Link>
            </Menu.Item>
            <Menu.Item key="6">
              <Link to="/FAQ">
                FAQ
              </Link>
            </Menu.Item>
            <Menu.Item key="7">
              <Link to="/about">
                About
              </Link>
            </Menu.Item>
          </Menu>
        </Col>
        <Col md={6} style={{ lineHeight: "64px" }}>
          <UserManger {...props.state}/>
        </Col>
      </Row>
    </Header>
    <Content className={styles.content}>
      {props.children}
    </Content>
    <Footer style={{ textAlign: "center" }}>
      京ICP备15062075号-x
      Powered by OnlineJudge Version: 20181215-9a50c
    </Footer>
  </Layout>;
}

export default withRouter(connect(state => {
  return state;
})(BasicLayout));
