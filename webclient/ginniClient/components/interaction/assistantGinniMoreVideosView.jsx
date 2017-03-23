import React from 'react';
import {Feed, Label, Modal} from 'semantic-ui-react';
import UnfurlLink from './unfurlLink';
import AssistantGinniOptions from './assistantGinniOptions';
import CodeAssistant from '../../../Multi_Lingual/Wordings.json';
import ReactPlayer from 'react-player';



export default class AssistantGinniMoreVideosView extends React.Component {
    // props validation
    constructor(props) {
        super(props);
        this.playVideo = this.playVideo.bind(this);
    }
    playVideo() {
        let videoUrl = this.props.value;
    }
    /* @threkashri: edited code for displaying more Videos */
    render() {
      return (
        <Feed id="ginniview">
            <Feed.Event>
                <Feed.Content id = 'ginniviewKeyword'>
                    <Feed.Summary><UnfurlLink url={this.props.value}/></Feed.Summary>
                    <Modal
                      id='videomodal'
                      closeOnRootNodeClick={false} closeIcon='close' trigger={<Label onClick={this.playVideo} basic color='orange' id='cursor'>Play video</Label>}>
                      <Feed id='assistantView'>
                        <Feed.Event>
                          <Feed.Content>
                              <Feed.Extra >
                                <ReactPlayer id='video' height={455} width={810} url={this.props.value} playing={false} controls={true}/>
                              </Feed.Extra>
                          </Feed.Content>
                        </Feed.Event>
                      </Feed>
                    </Modal>
                    <AssistantGinniOptions question={this.props.question} type='video' value={this.props.value} likes={this.props.likes} dislikes={this.props.dislikes}/>
                </Feed.Content>
            </Feed.Event>
        </Feed>
    );
    }
}
