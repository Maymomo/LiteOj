import React, { Component } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import axios from 'axios';
import { REGISTER_URL, SCHOOLLIST_URL } from '@/api/api';
import {
  Form, Icon, Input, Button, Row, Col, Modal, Select,
} from 'antd';

const { TextArea } = Input;
const Option = Select.Option;

class RegisterForm extends Component {
  constructor() {
    super();
    this.state = {
      register_info:
        { message: '', submit: false, success: false },
      check_password: { status: 'success' },
      schools: [],
    };
    axios.get(SCHOOLLIST_URL).then(response => {
        let data = response.data;
        if (data.hasOwnProperty('errCode') && data.errCode === 0) {
          let msg = window.atob(data.message);
          let schools = JSON.parse(msg);
          this.setState({ schools: schools });
        } else {
          console.log('err not catch');
        }
      },
    ).catch(() => {
        console.log('err not catch2');
      },
    );
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        axios.post(REGISTER_URL,
          {
            username: values.username,
            password: values.password,
            nickname: values.nickname,
            email: values.email,
            description: values.description,
          },
        ).then(response => {
          let message = response.data;
          if (message.hasOwnProperty('errCode') && message.errCode !== 0) {
            this.setState({ register_info: { success: false, submit: true, message: 'Register Success' } });
          } else {
            this.setState({ register_info: { success: true, submit: true, message: message.message } });
          }
        }).catch(error => {
          this.setState({ register_info: { success: false, submit: true, message: error.toLocaleString() } });
        });
      } else {
        alert(err);
        router.push('/register');
      }
    });
  };


  checkPassword = (rule, value, callback) => {
    if (this.props.form.getFieldsValue(['password']).hasOwnProperty('password')) {
      if (!(this.props.form.getFieldsValue(['password']).password === value)) {
        this.setState({ check_password: { status: 'error' } });
        callback(rule);
      } else {
        this.setState({ check_password: { status: 'success' } });
        callback();
      }
    } else {
      this.setState({ check_password: { status: 'error' } });
      callback(rule);
    }
  };

  handleModalOk = () => {
    if (this.state.register_info.success) {
      router.push('/login');
    } else {
      router.push('/register');
    }
  };

  handleModalCancel = () => {
    router.push('/register');
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Form onSubmit={this.handleSubmit} className="login-form">
          <Form.Item>
            {getFieldDecorator('username', {
              rules: [{
                required: true, message: 'Username length is at least 6', min: 6,
              }],
            })(
              <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }}/>} placeholder="Username"/>,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [{
                required: true, message:
                  'Password length is at least 10', min: 10,
              }],
            })(
              <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }}/>} type="password"
                     placeholder="Password">
              </Input>,
            )}
          </Form.Item>
          <Form.Item validateStatus={this.state.check_password.status}>
            {getFieldDecorator('password_confirm', {
              rules: [{
                required: true, message:
                  'Confirm Password Error',
                validator: this.checkPassword,
              }],
            })(
              <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }}/>} type="password"
                     placeholder="Confirm Password">
              </Input>,
            )}
          </Form.Item>
          <Form.Item>
            {
              getFieldDecorator('email', {
                rules: [{ required: true, message: 'example@example.com', type: 'email' }],
              })(
                <Input prefix={<Icon type="edit" style={{ color: 'rgba(0,0,0,.25)' }}/>}
                       type="email"
                       placeholder="email">
                </Input>,
              )
            }
          </Form.Item>
          <Form.Item>
            {
              getFieldDecorator('nickname', {
                rules: [{
                  required: true, message:
                    'Nickname length is at least 10', min: 6,
                }],
              })(
                <Input prefix={<Icon type="edit" style={{ color: 'rgba(0,0,0,.25)' }}/>}
                       placeholder="Nickname"/>,
              )}
          </Form.Item>
          <Form.Item>
            <Select showSearch optionFilterProp="short" defaultValue="No school">
              {
                this.state.schools.map(function(data) {
                  return (<Option key={data.sid} value={data.sid} short={data.ShortName}>{data.Name} </Option>);
                })
              }
            </Select>
          </Form.Item>
          <Form.Item>
            {
              getFieldDecorator('description', {
                rules: [{ required: false, message: 'Enter the password twice differently' }],
              })(
                <TextArea prefix={<Icon type="edit" style={{ color: 'rgba(0,0,0,.25)' }}/>}
                          placeholder="Description"/>,
              )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button" block={true}>
              Register
            </Button>
          </Form.Item>
        </Form>
        <Modal title="Registration message" onOk={this.handleModalOk} onCancel={this.handleModalCancel}
               visible={this.state.register_info.submit}>
          {this.state.register_info.message}
        </Modal>
      </div>
    );
  }
}

const WrapperForm = Form.create()(RegisterForm);

function Register() {
  return (
    <Row type="flex" algin="center" style={{ height: '100%' }}>
      <Col md={10}/>
      <Col md={4}>
        <div style={{
          marginTop: '20%',
          borderRadius: '5%',
          background: 'white',
          padding: '10%',
          zIndex: '1px',
          width: '350px',
          boxShadow: '0px 0px 12px 2px rgba(0,0,0,0.42)',
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
})(Register);
