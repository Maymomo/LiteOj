import { Component } from 'react';
import axios from 'axios';
import { STATUS_URL } from '@/api/api';
import React from 'react';
import Table from 'antd/es/table';
import { connect } from 'dva';
import {router} from 'umi/router';
import { Link } from 'umi';
import { Layout, Row, Col } from 'antd';

let languageEnum = new Map();
languageEnum.set(1, 'C');


function toDateTime(secs) {
  let t = new Date(1970, 0, 1); // Epoch
  t.setSeconds(secs * 1000);
  return t;
}

const columns = [{
  title: 'SubmitID',
  dataIndex: 'id',
  defaultSortOrder: 'descend',
  sorter: (a, b) => a.id - b.id,
  sortDirections: ['ascend', 'descend'],
}, {
  title: 'UserName',
  dataIndex: 'username',
  render: (text, record) => (
    <Link to={'probleminfo/' + record.uid}>{text}</Link>
  ),
}, {
  title: 'SubmitTime',
  dataIndex: 'time',
  render: text => (
    <span>
      {toDateTime(text).toDateString()}
    </span>
  ),
}, {
  title: 'language',
  dataIndex: 'language',
  render: text => (
    <span>
      {languageEnum.get(text)}
    </span>
  ),
}, {
  title: 'ProlemName',
  dataIndex: 'problemname',
  render: (text, record) => (
    <Link to={'probleminfo/' + record.pid}>{text}</Link>
  ),
}, {
  title: 'TimeCost',
  dataIndex: 'timecost',
}, {
  title: 'status',
  dataIndex: 'status',
},
];

class StatusTable extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      pagination: { pageSize: 15 },
      loading: false,
    };
  }

  componentDidMount() {
    this.fetch({ page: 1 });
  }

  fetch = (params = {}) => {
    let state = this.state;
    state.loading = true;
    this.setState(state);
    axios.get(STATUS_URL, { params: { page: params.page, capacity: this.state.pagination.pageSize } }).then(
      response => {
        if (response.data.hasOwnProperty('errCode') && response.data.errCode === 0) {
          let msg = JSON.parse(window.atob(response.data.message));
          this.setState({
            data: msg.data,
            loading: false,
            pagination: { ...this.state.pagination, total: msg.max_pages },
          });
        } else {
          let msg = window.atob(response.data.message);
          msg = JSON.parse(msg);
          alert(msg);
        }
      },
    ).catch((e) => {
      alert(e);
      router.push("/");
    });
  };
  handleTableChange = ({ pagination }) => {
    console.log(pagination);
    this.fetch({ page: pagination.current });
  };

  render() {
    return (
      <Table style={{ background: 'white' }}
             bordered={true}
             columns={columns}
             dataSource={this.state.data}
             pagination={this.state.pagination}
             loading={this.state.loading}
             onChange={this.handleTableChange}>
      </Table>
    );
  }
}

function Status() {
  return (
    <Layout>
      <Row>
        <Col md={3}/>
        <Col md={18}>
          <StatusTable/>
        </Col>
        <Col md={3}/>
      </Row>
    </Layout>
  );
}

export default connect(states => {
  return { ...states };
})(Status);
