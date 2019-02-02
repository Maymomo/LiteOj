import React, {Component} from 'react';
import {connect} from 'dva';
import {Col, Row} from 'antd';
import axios from 'axios';
import { PROBLEMINFO_URL } from '@/api/api';
import ReactMarkdown from 'react-markdown';

class ProblemInfo extends Component {
  constructor(){
    super();
    this.state={
      loading:false,
      name:"",
      author:"",
      submit:"",
      solved:"",
      timelimit:1000,
      memorylimit:256,
      description:"",
      input:"",
      output:"",
      simple_input:"",
      simple_output:"",
    }
  }

  componentDidMount() {
    this.fetchProblemInfo({pid: parseInt(1)});
  }
  fetchProblemInfo=(params={})=>{
    this.setState({loading:true});
    axios.get(PROBLEMINFO_URL+"/"+params.pid).then(response=>{
      if(response.data.hasOwnProperty("errCode")&&response.data.errCode===0)
      {
        let msg=JSON.parse(window.atob(response.data.message));
        this.setState({
          loading:false,
          name:msg.name,
          author:msg.audio,
          submit:msg.submit,
          solved:msg.solved,
          timelimit:msg.timelimit,
          memorylimit:msg.memorylimit,
          description:msg.description,
          input:msg.input,
          output:msg.output,
          simple_input:msg.simple_input,
          simple_output:msg.simple_output,
        });
      }else {
        alert("Error");
      }
    }).catch((e)=> {
      console.log(e);
      alert("No Info")
    });
  };
  render() {
    return (
      <layout>
        <row>
          <div style={{text_align:"center;"}}>
          <a>{this.state.name}</a>
          </div>
        </row>
        <row>
          <ReactMarkdown source={"# Description"}/>
          <ReactMarkdown source={this.state.description}/>
        </row>
        <row>
          <ReactMarkdown source={"# Input"}/>
          <ReactMarkdown source={this.state.input}/>
        </row>
        <row>
          <ReactMarkdown source={"# Output"}/>
          <ReactMarkdown source={this.state.output}/>
        </row>
        <row>
          <ReactMarkdown source={"# Example Input"}/>
          <ReactMarkdown source={this.state.simple_input}/>
        </row>
        <row>
          <ReactMarkdown source={"# Example Output"}/>
          <ReactMarkdown source={this.state.simple_output}/>
        </row>
      </layout>
    );
  }
}


function ProblemInfos(state) {
  return (
    <Row>
      <Col md={12}>
        <ProblemInfo/>
      </Col>
      <Col md={12}>

      </Col>
    </Row>
  );
}

export default connect(states => {
  return {...states};
})(ProblemInfos);
