import React from 'react';
import TextAnswer from './answerContentType/textAnswer';
import VideoAnswer from './answerContentType/videoAnswer';
import BlogAnswer from './answerContentType/blogAnswer';
export default class ReplyContentInput extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        switch (this.props.replyContentType) {
            case 'text':
                {
              return <TextAnswer texts={this.props.texts} handlerRemoveAnswer={this.props.handlerRemoveAnswer} handlerForSaveAnswerToParentState={this.props.handlerForSaveAnswerToParentState} />
                }
            case 'video':
                {
                    return <VideoAnswer videos={this.props.videos} handlerRemoveAnswer={this.props.handlerRemoveAnswer} handlerForSaveAnswerToParentState={this.props.handlerForSaveAnswerToParentState}/>
                }
            case 'blog':
                {
                  return <BlogAnswer blogs={this.props.blogs} handlerRemoveAnswer={this.props.handlerRemoveAnswer} handlerForSaveAnswerToParentState={this.props.handlerForSaveAnswerToParentState}/>
                }
        }
    }
}
