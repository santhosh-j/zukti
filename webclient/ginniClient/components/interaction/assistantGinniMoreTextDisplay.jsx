import React from 'react';
import {Feed} from 'semantic-ui-react';
import AssistantGinniOptions from './assistantGinniOptions';
import CodeAssistant from '../../../Multi_Lingual/Wordings.json';

export default class AssistantGinniMoreTextView extends React.Component {
    // props validation
    constructor(props) {
        super(props);
    }
    /* @threkashri: edited code for displaying more text */
    render() {
      return (
        <Feed id="ginniview">
            <Feed.Event>
                <Feed.Content id = 'ginniviewKeyword'>
                    <Feed.Summary>{this.props.textValue}</Feed.Summary>
                    <Feed.Extra/>
                    <AssistantGinniOptions question={this.props.question}
                      type='text' value={this.props.textValue} likes={this.props.likes} dislikes={this.props.dislikes}/>
                </Feed.Content>
            </Feed.Event>
        </Feed>
    );
    }
}
