import React, {Component} from 'react';
import { Col, Row, Select, Button, Modal,notification } from 'antd';
import axios from 'axios';
import { PROBLEMINFO_URL, SUBMIT_URL } from '@/api/api';
import ReactMarkdown from 'react-markdown';
import MonacoEditor from 'react-monaco-editor';
import FreeScrollbar from 'react-free-scrollbar/src';
const Option = Select.Option;
// or import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
// if shipping only a subset of the features & languages is desired
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
    this.fetchProblemInfo({pid:parseInt(this.props.pid)});
  }
  fetchProblemInfo=(params={})=>{
    this.setState({loading:true});
    console.log(params.pid);
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
      alert("No Info")
    });
  };
  render() {
    return (
      <div style={{height:document.body.clientHeight,margin:"0 15px"}}>
        <FreeScrollbar>
        <row>
          <div style={{textAlign:"center",fontSize:"30px"}}>
          {this.state.name}
          </div>
        </row>
        <row>
          <ReactMarkdown source={"## Description"}/>
          <ReactMarkdown source={this.state.description}/>
        </row>
        <row>
          <ReactMarkdown source={"## Input"}/>
          <ReactMarkdown source={this.state.input}/>
        </row>
        <row>
          <ReactMarkdown source={"## Output"}/>
          <ReactMarkdown source={this.state.output}/>
        </row>
        <row>
          <ReactMarkdown source={"## Example Input"}/>
          <ReactMarkdown source={this.state.simple_input}/>
        </row>
        <row>
          <ReactMarkdown source={"## Example Output"}/>
          <ReactMarkdown source={this.state.simple_output}/>
        </row>
        </FreeScrollbar>
      </div>
    );
  }
}
class SubmitForm extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      visible:false,
      code: '// type your code...',
      language:'cpp',
      language_post:'1',
      theme:'vs-dark',
      source:'',
    }
  }
  editorDidMount(editor, monaco) {
    console.log('editorDidMount', editor);
    editor.focus();
  }
  onChange(newValue, e) {
    this.state.source=newValue;
  }
  getLanguage(value){
    switch (value) {
      case 1:
      case 2:
      case 3:
        return 'cpp';
      default:
        return 'java';

    }
  }
  onSubmit(){
    let submitParams={
      language:this.state.language_post,
      source:window.btoa(this.state.source),
      problemid:this.props.pid,
    };
    axios.post(SUBMIT_URL,submitParams).then(response=>{
      if(response.data.hasOwnProperty("errCode"))
      {
        if(response.data.errCode===10300)
        {
            this.setState({visible:true});
        }else if(response.data.errCode===0){
            window.location.href="http://localhost:8081/status";
        }else{
          notification.open({
              message:"Error message",
              description:response.data.message,
              onClick:()=>{
                console.log(response.data);
              },

          });
        }
      }else {
        alert("Submit Error");
      }
    }).catch((e)=> {
        alert("Connect Error");
        console.log(e);
      }
    )
  }
  onLanguageChange(newValue)
  {
    this.setState({language:newValue,language_post:this.getLanguage(newValue)})
  }
  onThemeChange(newValue)
  {
    console.log(newValue);
    this.setState({theme:newValue})
  }
  onOkhandle=()=>{
    this.setState({visible:false});
    window.location.href="http://localhost:8081/login";
  };
  onCanclehandle=()=>{
    this.setState({visible:false});
  };
  render() {
    const code = this.state.code;
    const options = {
      selectOnLineNumbers: true
    };
    return (
      <div style={{height:document.body.clientHeight}}>
        <row>
          <div style={{textAlign:"center",fontSize:"30px"}}>
            Code
          </div>
        </row>
        <div style={{height:document.body.clientHeight*0.9,margin:"0 15px"}}>
          <FreeScrollbar>
          <MonacoEditor
            width="800"
            height={document.body.clientHeight*0.9}
            language={this.state.language}
            theme={this.state.theme}
            value={code}
            options={options}
            onChange={::this.onChange.bind(this)}
            editorDidMount={::this.editorDidMount}
          />
          </FreeScrollbar>
          Language:
          <Select defaultValue={"1"} onChange={this.onLanguageChange.bind(this)}>
            <Option key={"1"} value={"1"}>C</Option>
            <Option key={"2"} value={"2"}>C++</Option>
          </Select>
          Themes:
          <Select defaultValue={"vs-dark"} onChange={this.onThemeChange.bind(this)}>
            <Option key={"1"} value={"vs"}>Visual Studio</Option>
            <Option key={"2"} value={"vs-dark"}>Visual Studio Dark</Option>
            <Option key={"3"} value={"hc-black"}>High Contrast Dark</Option>
          </Select>
          <Button type="primary" onClick={this.onSubmit.bind(this)}>Submit</Button>
        </div>
        <Modal title={"login"} visible={this.state.visible} onOk={this.onOkhandle} onCancel={this.onCanclehandle}>
            You are not logged in.Click ok to login!
        </Modal>
      </div>
    );
  }
}
class ProblemInfoWrapper extends React.Component{
  render() {
    console.log(this.props.match.params.pid);
    return(
      <div style={{height:document.body.clientHeight}}>
        <Row>
          <Col md={12}>
            <ProblemInfo pid={this.props.match.params.pid}/>
          </Col>
          <Col md={12}>
            <SubmitForm pid={this.props.match.params.pid}/>
          </Col>
        </Row>
      </div>
    )
  }
}
export default ProblemInfoWrapper
