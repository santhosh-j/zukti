/* @santhosh: search the chat history */
import React from 'react';
import {Button, Modal, Divider, List, Icon, Accordion} from 'semantic-ui-react';
import Config from '../../../../config/url';
import Axios from 'axios';
import Cookie from 'react-cookie';
import './chatcontainerstyle.css';
import Snackbar from 'material-ui/Snackbar';
import UnfurlLink from './unfurlLink';
import AssistantGinniMixedReply from './assistantGinniMixedReply';
import AssistantGinniPlainText from './assistantGinniPlainText';
import AssistantGinniKeywordResponse from './assistantGinniKeywordResponse';
let Beautify = require('js-beautify').js_beautify;
export default class ViewUserChat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            conversations: [],
            open: false,
            openSnackbar: false,
            snackbarMsg: '',
            searchValue: '',
            chat: []
        };
        // function to retrive chat of a given user
        this.getUserChats = this.getUserChats.bind(this);
    }

    show = (size) => () => this.setState({size, open: true})
    close = () => this.setState({open: false})
    /* @santhosh: search the chat history */
    getUserChats() {
        this.state.chat.splice(0, this.state.chat.length);
        if(this.props.messageHistort !== null && this.props.messageHistort.length !== 0
           && this.props.searchValue.trim() !== '') {
          let messageHistort = this.props.messageHistort;
          let conversations = messageHistort.data.chats;
          conversations.forEach((conversation) => {
            let searchcontent = this.props.searchValue.toLowerCase().trim();
            let isSearch = conversation.question.value.includes(searchcontent);
        if(isSearch) {
              if (conversation.isUnAnswered) {
                conversation.answerObj.forEach((answer, index) => {
                    if (answer.keywordResponse) {
                      if(answer.blog === undefined) {
                          let video = answer.video[0].value;
                          this.state.chat.push(
                                <Accordion>
                                    <Accordion.Title>
                                      <Icon name='dropdown' />
                                          {conversation.question.value} &nbsp;&nbsp;&nbsp;
                                          {conversation.question.time}
                                      </Accordion.Title>
                                  <Accordion.Content> <a title='click to open the video in new tab'
                                        href={video} target='_blank'> <UnfurlLink
                                          url ={video}/></a>
                                    </Accordion.Content>
                                </Accordion>
                          );
                      }
                      else {
                        let blog = answer.blog[0].value;
                        this.state.chat.push(
                              <Accordion>
                                  <Accordion.Title>
                                    <Icon name='dropdown' />
                                        {conversation.question.value} &nbsp;&nbsp;&nbsp;
                                        {conversation.question.time}
                                    </Accordion.Title>
                                  <Accordion.Content>
                                    <a title='click to open the blog in new tab'
                                      href={blog} target='_blank'><UnfurlLink url ={blog}/></a>
                                  </Accordion.Content>
                              </Accordion>
                        );
                      }
                    }
                });
              } else if(conversation.answerObj[0].text) {
                  let text = conversation.answerObj[0].text[0].value;
                  this.state.chat.push(
                        <Accordion>
                            <Accordion.Title>
                              <Icon name='dropdown' />
                                  {conversation.question.value} &nbsp;&nbsp;&nbsp;
                                  {conversation.question.time}
                                </Accordion.Title>
                            <Accordion.Content>
                              {text}
                            </Accordion.Content>
                        </Accordion>
                  );
                }
                else if (conversation.answerObj[0].image) {
                  let imageURL = conversation.answerObj[0].image[0].value;
                  this.state.chat.push(
                        <Accordion>
                            <Accordion.Title>
                              <Icon name='dropdown' />
                                  {conversation.question.value} &nbsp;&nbsp;&nbsp;
                                  {conversation.question.time}
                                </Accordion.Title>
                            <Accordion.Content>
                              <a title='click to open the image in new tab'
                                href={imageURL} target='_blank'><img src={imageURL}></img></a>
                            </Accordion.Content>
                        </Accordion>
                  );
              }
              else if(conversation.answerObj[0].code) {
                  let code = conversation.answerObj[0].code[0].value;
                  let value = Beautify(code, {indent_size: 1 });
                  this.state.chat.push(
                        <Accordion>
                            <Accordion.Title>
                              <Icon name='dropdown' />
                                  {conversation.question.value} &nbsp;&nbsp;&nbsp;
                                  {conversation.question.time}
                                </Accordion.Title>
                            <Accordion.Content>
                              <pre>{value}</pre>
                            </Accordion.Content>
                        </Accordion>
                  );
              }
            }
          });
            this.setState({open: true});
        } else if (this.props.searchValue.trim() === '') {
          this.setState({openSnackbar: true, snackbarMsg: 'Please specify something to search'});
        }
         else {
            this.setState({openSnackbar: true,
               snackbarMsg: 'No chats available with this specific user'});
        }
    }
    handleRequestClose = () => {
        this.setState({openSnackbar: false});
    };
    render() {
        const {open, size, chat} = this.state;

        return (
            <div>
                <Button content='Search'
                        basic color='blue'
                        onClick={this.getUserChats}></Button>
                <Modal size={size} open={open} onClose={this.close} closeIcon='close'>
                    <Modal.Header id='viewuserchat'>
                        <Icon name='search'/>
                        Search Result for "{this.props.searchValue}"
                    </Modal.Header>
                    <Modal.Content id='viewuserchatcontent'>
                        <b>{chat.length !== 0
                                ? chat
                                : 'No results found!!'}</b>
                    </Modal.Content>
                </Modal>
                <Snackbar open={this.state.openSnackbar} message={this.state.snackbarMsg}
                  autoHideDuration={4000} onRequestClose={this.handleRequestClose}/>
            </div>
        );
    }
}
