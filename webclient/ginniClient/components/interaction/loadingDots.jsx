import React from 'react';
import {Feed} from 'semantic-ui-react';
import {ThreeBounce} from 'better-react-spinkit';
import './chatcontainerstyle.css';
import CodeAssistant from '../../../Multi_Lingual/Wordings.json';

export default class LoadingDots extends React.Component {
    constructor(props) {
        super(props);
    }
    /* @threkashri: edited code for loadingDots */
    render() {
      return (
          <Feed id='assistantView'>
              <Feed.Event>
                  <Feed.Content>
                      <Feed.Summary>
                        <ThreeBounce timingFunction='linear'
                           duration='1.5s' gutter={8} size={15} color='brown' />
                      </Feed.Summary>
                      <Feed.Like>
                      </Feed.Like>
                  </Feed.Content>
              </Feed.Event>
          </Feed>

      );
    }
}
