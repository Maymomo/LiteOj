import React, {Component} from 'react';
import router from 'umi/router';
import {connect} from 'dva';
import axios from 'axios';

import {
  Form, Icon, Input, Button, Checkbox, Row, Col,
} from 'antd';

const {TextArea} = Input;


class RegisterForm extends Component {

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', {headers: {
            'Access-Control-Allow-Origin': '*',
          }}, values);
        axios.post("http://127.0.0.1:8082/authorize/register",
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
          {
            getFieldDecorator('nickname', {
              rules: [{required: true, message: "Please input your NickName!"}],
            })(
                <Input prefix={<Icon type="edit" style={{color: 'rgba(0,0,0,.25)'}}/>}
                placeholder="Nickname"/>
            )}
        </Form.Item>
        <Form.Item>
          {
            getFieldDecorator('description', {
              rules: [{required: false,}],
            })(
              <TextArea prefix={<Icon type="edit" style={{color: 'rgba(0,0,0,.25)'}}/>}
                     placeholder="Description"/>
            )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button" block={true}>
            Register
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

const WrapperForm = Form.create({name: 'normal_login'})(RegisterForm);

function Register(state) {
  return (
    <Row type="flex" algin="center" style={{height: "100%"}}>
      <Col md={10}/>
      <Col md={4}>
        <div style={{marginTop: "40%", backgroundColor: "white", borderRadius: "5%", padding: "5%", zIndex: "1px", boxShadow: "0px 0px 12px 2px rgba(0,0,0,0.42)"}} >
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
})(Register);
