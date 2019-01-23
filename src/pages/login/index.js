import React, {Component} from 'react';
import {connect} from 'dva';
import router from "umi/router";
import axios from "axios";
import {Button, Col, Form, Icon, Input, Modal, Row} from "antd";
import {LOGIN_URL} from "@/api/api";


const {TextArea} = Input;


class LoginForm extends Component {

  state = {visible: false, login_message: ""};
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        axios.post(LOGIN_URL,
          values
        ).then(response => {
          let message = response.data;
          console.log(message);
          if (message.hasOwnProperty("errCode") && message.errCode === 0) {
            router.push("/");
          } else {
            let login_message;
            if (message.hasOwnProperty("message")) {
              login_message = message.message;
            } else {
              login_message = "Login Failed";
            }
            this.setState({visible: true, login_message: login_message});
          }
        }).catch(error => {
          this.setState({visible: true, login_message: error.toLocaleString()});
        });
      }
    });
  };
  handleModalOk = e => {
    this.setState({visible: false, login_message: " "});
  };
  handleModalCancel = e => {
    this.setState({visible: false, login_message: " "});
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <div>
        <Form onSubmit={this.handleSubmit} className="login-form">
          <Form.Item>
            {getFieldDecorator('username', {
              rules: [{required: true, message: 'Please input your username!', min: 6}],
            })(
              <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>} placeholder="Username"/>
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [{required: true, message: 'Please input your Password!', min: 10}],
            })(
              <Input prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>} type="password"
                     placeholder="Password"/>
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button" block={true}>
              Login
            </Button>
          </Form.Item>
        </Form>
        <Modal title="Login" onOk={this.handleModalOk} onCancel={this.handleModalCancel}
               visible={this.state.visible}>
          {this.state.login_message}
        </Modal>
      </div>
    );
  }
}

const WrapperForm = Form.create()(LoginForm);

function Login(state) {
  return (
    <Row type="flex" algin="center">
      <Col md={10}/>
      <Col md={4}>
        <div style={{
          marginTop: "50%",
          backgroundColor: "white",
          borderRadius: "5%",
          padding: "5%",
          zIndex: "1px",
          boxShadow: "-2px 2px 15px 3px rgba(0,0,0,0.42)"
        }}>
          <WrapperForm/>
        </div>
      </Col>
      <Col md={10}/>
    </Row>
  );
}

export default connect(state => {
  if (state.user.isLogin) {
    router.push('/');
  }
  return {
    ...state,
  };
})(Login);
