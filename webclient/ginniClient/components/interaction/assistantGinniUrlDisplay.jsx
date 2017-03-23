import React from 'react';
import {Feed, Label} from 'semantic-ui-react';
import AssistantGinniMoreBlogsView from './assistantGinniMoreBlogsView';
import AssistantGinniOptions from './assistantGinniOptions';
import UnfurlLink from './unfurlLink';
import './chatcontainerstyle.css';
import CodeAssistant from '../../../Multi_Lingual/Wordings.json';

export default class AssistantGinniMixedReply extends React.Component {
  constructor(props) {
      super(props);
      this.displayMoreBlogs = this.displayMoreBlogs.bind(this);
  }
  displayMoreBlogs() {
    let ginniReply = [];
    let blogsResponseArray = this.props.blogs;
    blogsResponseArray.shift();
    blogsResponseArray.forEach((blog)=>{
      ginniReply.push(<AssistantGinniMoreBlogsView
        question={this.props.question} value={blog.value} likes={blog.likes} dislikes={blog.dislikes}/>);
    });
    this.props.handleGinniReply(ginniReply);
  }
  /* @threkashri: edited code for displaying more Blogs */
    render() {
      let blogUrl = this.props.blogs[0].value;
      return (
          <Feed id="ginniview">
              <Feed.Event>
                  <Feed.Content id = 'ginniviewKeyword'>
                      <Feed.Summary><UnfurlLink url ={blogUrl}/></Feed.Summary>
                      <Feed.Extra>
                        <Label.Group >
                            {this.props.blogs.length > 1
                                ? <Label onClick={this.displayMoreBlogs} basic color='orange' id='cursor'>
                                  View more blogs</Label>
                                : ''}
                        </Label.Group>
                      </Feed.Extra>
                      <AssistantGinniOptions question={this.props.question}
                        type='blog' value={blogUrl} likes={this.props.blogs[0].likes} dislikes={this.props.blogs[0].dislikes}/>
                  </Feed.Content>
              </Feed.Event>
          </Feed>
      );
    }
}
