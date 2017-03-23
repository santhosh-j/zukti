import React from 'react';
import {Feed, Label, Modal} from 'semantic-ui-react';
import AssistantGinniMoreVideosView from './assistantGinniMoreVideosView';
import AssistantGinniOptions from './assistantGinniOptions';
import UnfurlLink from './unfurlLink';
import './chatcontainerstyle.css';
import CodeAssistant from '../../../Multi_Lingual/Wordings.json';
import ReactPlayer from 'react-player';

export default class AssistantGinniMixedReply extends React.Component {
    constructor(props) {
        super(props);
        this.displayMoreVideos = this.displayMoreVideos.bind(this);
        this.playVideo = this.playVideo.bind(this);
    }
    playVideo() {
        let videoUrl = this.props.videos[0].value;
    }
    displayMoreVideos() {
        let ginniReply = [];
        let videosResponseArray = this.props.videos;
        videosResponseArray.shift();
        videosResponseArray.forEach((video) => {
            ginniReply.push(<AssistantGinniMoreVideosView handleGinniReply={this.props.handleGinniReply} question={this.props.question} value={video.value} likes={video.likes} dislikes={video.dislikes}/>);
        });
        this.props.handleGinniReply(ginniReply);
    }
    /* @threkashri: edited code for displaying Video */
    render() {
        let videoUrl = this.props.videos[0].value;
        return (
              <Feed id="ginniview">
                  <Feed.Event>
                      <Feed.Content id = 'ginniviewKeyword'>
                          <Feed.Summary><UnfurlLink url ={videoUrl}/></Feed.Summary>
                          <Feed.Extra>
                              <Label.Group>
                                      <Modal
                                        id='videomodal'
                                        closeOnRootNodeClick={false} closeIcon='close' trigger = {<Label onClick={this.playVideo} basic color='orange' id='cursor'>Play video</Label>}>
                                        <Feed id='assistantView'>
                                          <Feed.Event>
                                              <Feed.Content>
                                                  <Feed.Extra >
                                                    <ReactPlayer id='video' height={455} width={810} url={this.props.videos[0].value} playing={false} controls={true}/>
                                                  </Feed.Extra>
                                              </Feed.Content>
                                          </Feed.Event>
                                        </Feed>
                                      </Modal>
                                      {this.props.videos.length > 1
                                          ? <Label onClick={this.displayMoreVideos} basic color='orange' id='cursor'>
                                                  View more videos</Label>
                                          : ''}
                              </Label.Group>
                          </Feed.Extra>
                          <AssistantGinniOptions question={this.props.question} type='video' value={videoUrl} likes={this.props.videos[0].likes} dislikes ={this.props.videos[0].dislikes}/>
                      </Feed.Content>
                  </Feed.Event>
              </Feed>
          );
    }
}
