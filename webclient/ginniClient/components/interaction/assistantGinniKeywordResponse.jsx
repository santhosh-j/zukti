import React from 'react';
import {Feed, Label, Modal} from 'semantic-ui-react';
import AssistantGinniUrlDisplay from './assistantGinniUrlDisplay';
import AssistantGinniVideoDisplay from './assistantGinniVideoDisplay';
import AssistantGinniOptions from './assistantGinniOptions';
import UnfurlLink from './unfurlLink';
import CodeAssistant from '../../../Multi_Lingual/Wordings.json';
import AssistantGinniMoreVideosView from './assistantGinniMoreVideosView';
import AssistantGinniRecommendation from './assistantGinniRecommendation'
import AssistantView from './assistantGinniPlainText';

import ReactPlayer from 'react-player';



export default class AssistantGinniMixedReply extends React.Component {
    constructor(props) {
        super(props);
        this.displayVideos = this.displayVideos.bind(this);
        this.displayMoreVideos = this.displayMoreVideos.bind(this);
        this.displayBlogs = this.displayBlogs.bind(this);
        this.playVideo = this.playVideo.bind(this);
        this.displayRecommendations = this.displayRecommendations.bind(this);
    }
    /* @sundaresan: video display */
    displayMoreVideos() {
        let ginniReply = [];
        let videosResponseArray = this.props.data.video;
        videosResponseArray.shift();
        videosResponseArray.forEach((video) => {
            ginniReply.push(<AssistantGinniMoreVideosView handleGinniReply={this.props.handleGinniReply} question={this.props.question} value={video.value} likes={video.likes} dislikes={video.dislikes}/>);
        });
        this.props.handleGinniReply(ginniReply);
    }
    displayVideos() {
        let ginniReply = [];
        let videos = this.props.data.video.map((item, index)=>{
            return {value: item.value, likes: item.likes, dislikes: item.dislikes};
          });
        videos.shift();
        ginniReply.push(<AssistantGinniVideoDisplay
          question={this.props.question}
          handleGinniReply={this.props.handleGinniReply} videos={videos}/>);
        this.props.handleGinniReply(ginniReply);
    }
    displayBlogs() {
        let ginniReply = [];
        let blogs = this.props.data.blog.map((item, index)=>{
              return {value: item.value, likes: item.likes, dislikes:item.dislikes};
          });
        blogs.shift();
        ginniReply.push(<AssistantGinniUrlDisplay
          question={this.props.question} handleGinniReply={this.props.handleGinniReply}
          blogs={blogs}/>);
        this.props.handleGinniReply(ginniReply);
    }
    /* @yuvashree: added function to play video on clicking the button */
    playVideo() {
      console.log(this.props.data.video[0].value);
      let videoUrl = this.props.data.video[0].value;
        console.log(videoUrl);
    }
    /* @sangeetha: added function to display recommendations */
      displayRecommendations(recommendations) {
        if(recommendations != ''){
       let relatedTopics = recommendations.toLocaleString();
        this.props.handleGinniReply([<AssistantGinniRecommendation value={relatedTopics}/>]);
      }
    }

    render() {
      /* @yuvashree: edited code for displaying videos */
      if(this.props.data.blog === undefined)
      {
        let video = this.props.data.video[0].value;
        return (
          <Feed id="ginniview">
              <Feed.Event>
                  <Feed.Content id = 'ginniviewKeyword'>
                      <Feed.Extra>
                        <UnfurlLink url ={video} />
                          <Label.Group>

                                  <Modal
                                    id='videomodal'
                                    closeOnRootNodeClick={false}
                                    closeIcon='close'
                                    trigger={<Label onClick={this.playVideo} basic color = 'orange' id = 'cursor' > Play video </Label>}>
                                      <Feed id='assistantView'>
                                          <Feed.Event>
                                              <Feed.Content>
                                                  <Feed.Extra >
                                                      <ReactPlayer id='video' height={455} width={810} url={this.props.data.video[0].value} playing={false} controls={true}/>
                                                  </Feed.Extra>
                                              </Feed.Content>
                                          </Feed.Event>
                                      </Feed>
                                  </Modal>
                                  {this.props.data.video.length - 1 > 0
                                      ? <Label onClick={this.displayMoreVideos}
                                        basic color='orange' id='cursor'>View More Videos</Label>
                                      : ''}
                                  <AssistantGinniOptions question={this.props.question}
                                    type='video' value={video} likes ={this.props.data.video[0].likes}
                                    dislikes ={this.props.data.video[0].dislikes}
                                    keywords={this.props.keywords} onRecommend={this.displayRecommendations}/>
                          </Label.Group>
                      </Feed.Extra>
                  </Feed.Content>
              </Feed.Event>
            </Feed>
            );
            }
            /* @yuvashree: edited code for displaying blogs */
            else {
              /* @Sangeetha: keyword Response recommendations  */
              let blog = this.props.data.blog[0].value;
              return (
                <Feed id="ginniview">
              <Feed.Event>
                  <Feed.Content id = 'ginniviewKeyword'>
                      <Feed.Summary> <UnfurlLink url ={blog}/></Feed.Summary>
                      <Feed.Extra>
                          <Label.Group>
                              {this.props.data.blog.length - 1 > 0
                                  ? <Label onClick={this.displayBlogs}
                                    basic color='orange' id='cursor'>Blogs</Label>
                                  : ''}
                              {this.props.data.video
                                  ? <Label onClick={this.displayVideos}
                                    basic color='orange' id='cursor'>Videos</Label>
                                  : ''}
                                  <AssistantGinniOptions question={this.props.question}
                                    type='blog' value={blog} likes ={this.props.data.blog[0].likes} dislikes ={this.props.data.blog[0].dislikes}
                                    responseValue ={this.props.response}
                                    keywords={this.props.keywords}
                                      onRecommend={this.displayRecommendations}/>
                          </Label.Group>
                      </Feed.Extra>
                  </Feed.Content>
              </Feed.Event>
            </Feed>
                  );
            }
    }
}
