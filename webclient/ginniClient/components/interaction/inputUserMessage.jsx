import React from 'react';
import ReactDOM from 'react-dom';
import {Form} from 'semantic-ui-react';
import Axios from 'axios';
import AssistantGinniMixedReply from './assistantGinniMixedReply';
import AssistantGinniPlainText from './assistantGinniPlainText';
import AssistantGinniKeywordResponse from './assistantGinniKeywordResponse';
import LoadingDots from './loadingDots';
export default class InputUserMesaage extends React.Component {
    constructor(props) {
        super(props);
        this.handleUserInput = this.handleUserInput.bind(this);
    }
    handleUserInput(e) {
        e.preventDefault();
        let message = {};
        let ginniReply = [];
        message.value = ReactDOM.findDOMNode(this.refs.userInput).value;
        if(message.value.trim() === '') {
          return;
        }
        let socket = io();
        socket.emit('newQuery', {i: 1});
        message.time = new Date().toLocaleString();
        this.props.handlerUserReply(message);
        ReactDOM.findDOMNode(this.refs.userInput).value = '';
        let url = '/question/askQuestion';
        this.props.handleGinniReply([<LoadingDots/>]);
        Axios.post(url, {
            username: this.props.username,
            question: message
        }).then((response) => {
          //  @Mayanka: redirect to display warning message on abuse
          if(response.data.abuseCount > 0){
        console.log('abusinfcount and present '+response.data.abuseCount+response.data.abusePresent);
        ginniReply.push(<AssistantGinniMixedReply
          handleGinniReply={this.props.handleGinniReply} abuseCount={response.data.abuseCount} abusePresent={response.data.abusePresent} data={response.data}/>);
      }
      /* @Sindhujaadevi: if question is of other domain */
    else if(response.data.inOtherDomain == true){
      ginniReply.push(<AssistantGinniMixedReply
        handleGinniReply={this.props.handleGinniReply} question={message.value} inOtherDomain={response.data.inOtherDomain}
        differentDomain={response.data.differentDomain} data={response.data}/>);
    }
      //  @Mayanka: If no abuse found, further processing
      else  if (response.data) {
              //  @Mayanka: answer not found Message
                if(!response.data.isUnAnswered) {
                  // @sangeetha : keywords for question response recommendations
                      ginniReply.push(<AssistantGinniMixedReply
                        handleGinniReply={this.props.handleGinniReply} question={message.value}
                        data={response.data.answerObj} keywords={response.data.answerObj[0].keywords}/>);
                }
                //  @Mayanka: display answer

                /* @sangeetha: sending keywords for recommendations */
                  else{
                  response.data.answerObj.forEach((reply)=>{
                    ginniReply.push(<AssistantGinniPlainText value={reply.value}/>);
                    if(reply.keywordResponse) {
                      ginniReply.push(<AssistantGinniKeywordResponse
                        handleGinniReply={this.props.handleGinniReply} question={message.value}
                        keywords={reply.keywords}
                        data={reply}/>);
                    }
                  });
                }
            }
            this.props.handleGinniReply(ginniReply, true);
        }).catch((error) => {
            console.log(error);
        });
    }

    render() {
        return (
            <Form onSubmit={this.handleUserInput}>
                <input autoComplete="off" type='text' id='textinput'
                   name='userInput' ref='userInput' placeholder='Enter Your Queries'/>
            </Form>
        );
    }
}
