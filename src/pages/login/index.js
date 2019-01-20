import React, {Component} from 'react';
import {connect} from 'dva';
import router from "umi/router";
import axios from "axios";
import {Button, Col, Form, Icon, Input, Row} from "antd";


const {TextArea} = Input;





class LoginForm extends Component {

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        axios.post("/authorize/register",
          values
        ).then(response =>  {
          console.log(response)
        }).catch(error => {
          console.log(error);
        });
      }
    });
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [{required: true, message: 'Please input your username!'}],
          })(
            <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>} placeholder="Username"/>
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{required: true, message: 'Please input your Password!'}],
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
    );
  }
}

const WrapperForm = Form.create()(LoginForm);

function Login(state) {
  return (
    <Row type="flex" algin="center">
      <Col md={10}/>
      <Col md={4}>
        <div style={{marginTop: "50%", backgroundColor: "white", borderRadius: "5%", padding: "5%", zIndex: "1px", boxShadow: "-2px 2px 15px 3px rgba(0,0,0,0.42)"}} >
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
