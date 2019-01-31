import { Component } from 'react';
import axios from 'axios';
import { STATUS_URL } from '@/api/api';
import React from 'react';
import Table from 'antd/es/table';
import { connect } from 'dva';
import Row from 'antd/es/grid/row';
import Col from 'antd/es/grid/col';
import { applyForEach } from 'umi/lib/runtimePlugin';
let languageEnum = new Map();
languageEnum.set(1,"C");



const columns = [{
  title: 'SubmitID',
  dataIndex: 'id',
  defaultSortOrder:'descend',
  sorter:(a,b)=>a.id-b.id,
  sortDirections: ['ascend','descend'],
}, {
  title: 'UserName',
  dataIndex: 'username',
  render:(text,record)=>(
    <span>
      <a href={record.uid}>{text}</a>
    </span>
  )
}, {
  title: 'SubmitTime',
  dataIndex: 'time',
  render:text=>(
    <span>
      <a>{Date(text*1000)}</a>
    </span>
  ),
}, {
  title: 'language',
  dataIndex: 'language',
  render:text=>(
    <span>
      <a>{languageEnum.get(text)}</a>
    </span>
  )
},{
  title:'ProlemName',
  dataIndex:"problemname",
  render:(text,record)=>(
    <span>
      <a href={record.pid}>{text}</a>
    </span>
  )
},{
  title:'TimeCost',
  dataIndex:"timecost",
},{
  title:"status",
  dataIndex:"status",
},
];

class StatusTable extends Component{
  constructor(){
    super();
    this.state={
      data:[],
      pagination:15,
      loading:false,
    };
  }
  componentDidMount(){
    this.fetch({page: 1});
  }
  fetch=(params={})=>{
    let state=this.state;
    state.loading=true;
    this.setState(state);
    axios.get(STATUS_URL,{params: {page: params.page, capacity: 15}}).then(
      response=>{
        if (response.data.hasOwnProperty("errCode")&&response.data.errCode===0)
        {
          let msg = JSON.parse(window.atob(response.data.message));
          this.setState({data: msg.data, loading: false, pagination: {total: msg.max_pages + 1}});
        }else{
          let msg = window.atob(response.data.message);
          msg = JSON.parse(msg);
          console.log(msg);
          alert(msg);
        }
      }
    ).catch((e)=>{
      console.log(e)
    })
  };
  handleTableChange = (pagination, filters, sorter) => {
    console.log(pagination, filters, sorter);
    this.fetch({page: pagination.current});
  };
  render() {
    return (
          <Table style={{background: "white"}}
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
function Status(state) {
  return (
    <Row>
      <Col md={3}/>
      <Col md={18}>
        <StatusTable/>
      </Col>
      <Col md={3}/>
    </Row>
  );
}

export default connect(states => {
  return {...states};
})(Status);
