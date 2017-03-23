import React from 'react';
import {Feed} from 'semantic-ui-react';
import './chatcontainerstyle.css';
import CodeAssistant from '../../../Multi_Lingual/Wordings.json';
export default class AssistantView extends React.Component {
    constructor(props) {
        super(props);
    }
    /* @threkashri: edited code for displaying Text */
    render() {
      return (
          <Feed id='assistantView'>
              <Feed.Event>
                  <Feed.Content id='assistantViewGenni'>
                      <Feed.Summary>{this.props.value}
                      </Feed.Summary>
                      <Feed.Meta/>
                  </Feed.Content>
              </Feed.Event>
          </Feed>

      );
    }
}
