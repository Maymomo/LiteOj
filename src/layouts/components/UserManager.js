import React, {Component} from 'react';
import {connect} from 'dva';
import {Button, Modal} from "antd";
import router from 'umi/router';


class UserManger extends Component {

  render() {
    if (this.props.isLogin) {
      return (
        <div>
          {this.props.username}
        </div>
      )
    } else {
      return (
        <div>
          <Button htmlType="button" style={{marginRight: "10px"}} onClick={() => {
            router.push("/login");
          }}>
            Login
          </Button>
          <Button htmlType="button" onClick={() => {
            router.push("/register");
          }}>
            Register
          </Button>
        </div>
      )
    }
  }
}

function

mapStateToLoginIfo(state) {
  if (state.user.isLogin) {
    return {
      ...state,
      isLogin: true,
      username: state.user.username,
    }
  } else {
    return {
      ...state,
      isLogin: false,
    }
  }
}

export default connect(mapStateToLoginIfo)(UserManger);
