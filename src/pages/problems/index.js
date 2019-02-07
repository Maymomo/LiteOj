import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Col, Row, Table, Input, Layout } from 'antd';
import axios from 'axios';
import { Link } from 'umi';
import { PROBLEM_URL, PROBLEMS_URL } from '@/api/api';

const Search = Input.Search;

const columns = [{
  title: 'PID',
  dataIndex: 'pid',
  sorter: function(row_1, row_2) {
    return row_1.pid > row_2.pid;
  },
  render: (pid, record) => {
    return (
      <Link style={{ color: '#495060' }} to={'probleminfo/' + pid}>{pid}</Link>
    );
  },
  sortDirections: ['descend', 'ascend'],
}, {
  title: 'Name',
  dataIndex: 'name',
  render: (name, record) => {
    return (
      <Link style={{ color: '#495060' }} to={'probleminfo/' + record.pid}>{name}</Link>
    );
  },
}, {
  title: 'Solved',
  dataIndex: 'solved',
}, {
  title: 'Rate',
  dataIndex: 'rate',
},
];

class ProblemsTable extends Component {
  state = { data: [], pagination: { pageSize: 15 }, loading: false };
  onSearch = false;

  componentDidMount() {
    this.fetchProblems({ page: 1 });
  }

  fetchProblem = (params = {}) => {
    this.setState({ loading: true });
    axios.get(PROBLEM_URL + params.pid,
    ).then(response => {
        if (!(response.data.hasOwnProperty('errCode') && response.data.errCode === 0)) {
          let msg = response.data.message;
          alert(msg);
        } else {
          let msg = window.atob(response.data.message);
          msg = JSON.parse(msg);
          let rate = 'N/A';
          if (msg.submit > 0) {
            rate = (100.0 * msg.solved / msg.data.submit).toFixed(2);
            rate = rate + '%';
          }
          msg.rate = rate;
          let data = [msg];
          this.setState({
            data: data,
            loading: false,
            pagination: { ...this.state.pagination, total: msg.max_pages + 1 },
          });
        }
      },
    ).catch((e) => {
        alert(e);
        router.push('/');
      },
    );
  };

  fetchProblems = (params = {}) => {
    this.setState({ loading: true });
    axios.get(PROBLEMS_URL, { params: { page: params.page, capacity: this.state.pagination.pageSize } },
    ).then(response => {
      if (response.data.hasOwnProperty('errCode') && response.data.errCode === 0) {
        let msg = window.atob(response.data.message);
        msg = JSON.parse(msg);
        for (let i = 0; i < msg.data.length; i++) {
          let rate = 'N/A';
          if (msg.data[i].submit > 0) {
            rate = (100.0 * msg.data[i].solved / msg.data[i].submit).toFixed(2);
            rate = rate + '%';
          }
          msg.data[i].rate = rate;
        }
        this.setState({
          data: msg.data,
          loading: false,
          pagination: { ...this.state.pagination, total: msg.max_pages + 1 },
        });
      } else {
        let msg = response.data.message;
        alert(msg);
      }
    }).catch((e) => {
        alert(e);
        router.push('/');
      },
    );
  };

  handleSearch = value => {
    let pid = parseInt(value);
    if (isNaN(pid)) {
      alert('Input a valid pid');
    } else {
      this.onSearch = true;
      this.fetchProblem({ pid: pid, page: 1 });
    }
  };

  handleSearchChange = e => {
    let value = e.target.value;
    if (this.onSearch === true && (value.length === 0 || isNaN(parseInt(value)))) {
      this.onSearch = false;
      this.fetchProblems({ page: 1 });
    }
  };

  handleTableChange = ({ pagination }) => {
    this.fetchProblems({ page: pagination.current });
  };

  render() {
    return (
      <Layout style={{ background: 'white' }}>
        <Row style={{ height: '50px', lineHeight: '50px' }}>
          <Col style={{ float: 'left', paddingLeft: '20px' }}><h3>Problems</h3></Col>
          <Col style={{ float: 'right', marginRight: '20px' }}>
            <Search
              placeholder="Search Problem"
              onSearch={this.handleSearch}
              enterButton
              onChange={this.handleSearchChange}
            />
          </Col>
        </Row>
        <Row>
          <Table
            bordered={true}
            columns={columns}
            dataSource={this.state.data}
            pagination={this.state.pagination}
            loading={this.state.loading}
            onChange={this.handleTableChange}>
          </Table>
        </Row>
      </Layout>
    );
  }
}


function Problems() {
  return (
    <Row>
      <Col md={3}/>
      <Col md={18}>
        <ProblemsTable/>
      </Col>
      <Col md={3}/>
    </Row>
  );
}

export default connect(state => {
  return state;
})(Problems);
