import React, {Component} from 'react';
import {connect} from 'dva';
import {Col, Row, Table} from 'antd';
import axios from 'axios';
import {PROBLEMS_URL} from "@/api/api";

const columns = [{
  title: 'ID',
  dataIndex: 'pid',
  sorter: true,
}, {
  title: 'Name',
  dataIndex: 'name',
}, {
  title: 'submit',
  dataIndex: 'submit',
}, {
  title: 'solved',
  dataIndex: 'solved',
},
];

class ProblemsTable extends Component {
  state = {data: [], pagination: {pageSize: 15}, loading: false};

  componentDidMount() {
    this.fetch({page: 1});
  }

  fetch = (params= {}) => {
    this.setState({loading: true});
    axios.get(PROBLEMS_URL, {params: {page: params.page, capacity: 15}}
    ).then(response => {
      if (response.data.hasOwnProperty("errCode") && response.data.errCode === 0) {
        let msg = window.atob(response.data.message);
        msg = JSON.parse(msg);
        this.setState({data: msg.data, loading: false, pagination: {total: msg.max_pages + 1}});
      } else {
        let msg = window.atob(response.data.message);
        msg = JSON.parse(msg);
        alert(msg);
      }
    }).catch((e) =>
    {
      console.log(e);
    }
  )
  };
  handleTableChange = (pagination, filters, sorter) => {
    this.fetch({page: pagination.current});
  };

  render() {
    return (
      <Table
        style={{background: "white"}}
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


function Problems(state) {
  return (
    <Row>
      <Col md={3}/>
      <Col md={18}>
        <div>
          <ProblemsTable/>
        </div>
      </Col>
      <Col md={3}/>
    </Row>
  );
}

export default connect(states => {
  return {...states};
})(Problems);
