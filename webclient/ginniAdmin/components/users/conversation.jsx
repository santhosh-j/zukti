import React from 'react';
import {Feed, Label} from 'semantic-ui-react';
import AssistantGinniUrlDisplay from './assistantGinniUrlDisplay';
import AssistantGinniVideoDisplay from './assistantGinniVideoDisplay';

export default class AssistantGinniMixedReply extends React.Component {
    // props validation
    static propTypes = {
        handleGinniReply: React.PropTypes.func.isRequired,
        data: React.PropTypes.object.isRequired
    };
    constructor(props) {
        super(props);
        // function to show videos url feteched from response
        this.displayVideoUrl = this.displayVideoUrl.bind(this);
        this.displayBlogUrl = this.displayBlogUrl.bind(this);
    }
    displayVideoUrl() {
      let ginniReply = [<AssistantGinniVideoDisplay message='Here are some videos'
        url={this.props.data.videoUrl}/>];
        this.props.handleGinniReply(ginniReply);
    }
    displayBlogUrl() {
        let ginniReply = [<AssistantGinniUrlDisplay message='Here are some blogs'
          url={this.props.data.blogUrl}/>];
        this.props.handleGinniReply(ginniReply);
    }
    render() {
        let text = this.props.data.textAnswer;
        return (
            <Feed id="ginniview">
                <Feed.Event>
                    <Feed.Label
           image='https://unnecessarynewsfromearth.files.wordpress.com/2016/11/computer-bot.jpg?w=700'/>
                    <Feed.Content>
                        <Feed.Summary date={this.props.data.time} user='Genie'/>
                        <Feed.Extra text>
                            {text}
                        </Feed.Extra>
                        <Feed.Extra>
                            <Label.Group color='blue'>
                                {this.props.data.blogUrl ?
                                  <Label onClick={this.displayBlogUrl}>Blogs</Label> : '' }
                                {this.props.data.videoUrl ?
                                  <Label onClick={this.displayVideoUrl}>Videos</Label> : ''}
                            </Label.Group>
                        </Feed.Extra>
                    </Feed.Content>
                </Feed.Event>
            </Feed>
        );
    }
}
