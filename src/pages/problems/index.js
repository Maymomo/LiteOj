import React, {Component} from 'react';
import {connect} from 'dva';
import {Col, Row, Table, Input, Layout} from 'antd';
import axios from 'axios';
import {PROBLEMS_URL} from "@/api/api";

const Search = Input.Search;

const columns = [{
  title: 'PID',
  dataIndex: 'pid',
  sorter: function (row_1, row_2) {
    return row_1.pid > row_2.pid;
  },
  sortDirections: ['descend', 'ascend'],
}, {
  title: 'Name',
  dataIndex: 'name',
}, {
  title: 'Solved',
  dataIndex: 'solved',
}, {
  title: 'Rate',
  dataIndex: 'rate',
}
];

class ProblemsTable extends Component {
  state = {data: [], pagination: {pageSize: 15}, loading: false};

  componentDidMount() {
    this.fetch({page: 1});
  }

  fetch = (params = {}) => {
    this.setState({loading: true});
    axios.get(PROBLEMS_URL, {params: {page: params.page, capacity: 15}}
    ).then(response => {
      if (response.data.hasOwnProperty("errCode") && response.data.errCode === 0) {
        let msg = window.atob(response.data.message);
        msg = JSON.parse(msg);
        for (var i = 0; i < msg.data.length; i++) {
          let rate = 'N/A';
          if (msg.data[i].submit > 0) {
            rate = (100.0 * msg.data[i].solved / msg.data[i].submit).toFixed(2);
            rate = rate + "%";
          }
          msg.data[i].rate = rate;
        }
        this.setState({data: msg.data, loading: false, pagination: {total: msg.max_pages + 1}});
      } else {
        let msg = window.atob(response.data.message);
        msg = JSON.parse(msg);
        alert(msg);
      }
    }).catch((e) => {
        console.log(e);
      }
    )
  };
  handleTableChange = (pagination, filters, sorter) => {
    console.log(pagination, filters, sorter);
    this.fetch({page: pagination.current});
  };

  render() {
    return (
      <Layout style={{background: "white"}}>
        <Row style={{height: "50px", lineHeight: "50px"}}>
          <Col style={{float: "left", paddingLeft: "20px"}}><h3>Problems</h3></Col>
          <Col style={{float: "right", marginRight: "20px"}}>
            <Search
              placeholder="Search Problem"
              onSearch={value => console.log(value)}
              enterButton
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


function Problems(state) {
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

export default connect(states => {
  return {...states};
})(Problems);
