import React from 'react';
import {Feed, Icon} from 'semantic-ui-react';
import {Popup, Comment} from 'semantic-ui-react';
import Embedly from 'react-embedly';
import Snackbar from 'material-ui/Snackbar';
import Axios from 'axios';

export default class AssistantGinniMixedReply extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        openSnackbar: false,
        snackbarMsg: ''
      };
        this.savedquery = this.savedquery.bind(this);
  }
  handleRequestClose = () => {
      this.setState({openSnackbar: false});
  };
  savedquery(message)
    {
      this.setState({openSnackbar: true, snackbarMsg: 'saved for reference'});
          Axios({
              url: ' http://localhost:8080/clientinformation',
              method: 'get'
          }).then(function(response) {
                    Axios({
                      url: 'http://localhost:8080/savequery/answeredquery',
                      method:'POST',
                      data: {email: response.data[0].local.email,
                            savedquery: {question: '', answer: message}}
                    }).then(function(msg) {
                        console.log(msg);
                    }).catch(function(err) {
                        console.log(err);
                    });

          }).catch(function(err) {
             console.log(err);
          });
        }
    render() {
      const {open} = this.state;
        return (
            <Feed id="ginniview">
                <Feed.Event>
                    <Feed.Label image='../../images/user2.jpg'/>
                    <Feed.Content>
                        <Feed.Summary date={new Date().toLocaleString()} user='Genie'/>
                        <Feed.Extra text>
                            {this.props.message}
                        </Feed.Extra>
                        <Feed.Extra images>
                      <Embedly url={this.props.url} apiKey="73f538bb83f94560a044bc6f0f33c5f6"/>
                        </Feed.Extra>
                        <Feed.Meta>
                        <Popup trigger={< Icon circular name = 'flag' color = 'green' />}
                        content='Flag' size='mini'/>
                            <Popup trigger={< Icon circular name = 'star' color = 'yellow'
                              onClick={()=>{this.savedquery(this.props.url) }} />}
                              content='star this message' size='mini'/>
                            <Popup trigger={< Icon circular name = 'like outline' color = 'blue' />}
                            content='Like' size='mini'/>
                          <Popup trigger={< Icon circular name = 'dislike outline' color = 'blue'/>}
                             content='Dislike' size='mini'/>
                            <Popup trigger={< Icon circular name = 'delete' color = 'red' />}
                            content='Delete' size='mini'/>
                            <Comment.Action>Reply</Comment.Action>
                        </Feed.Meta>
                    </Feed.Content>
                </Feed.Event>
                <Snackbar open={this.state.openSnackbar} message={this.state.snackbarMsg}
                  autoHideDuration={1000} onRequestClose={this.handleRequestClose}/>
            </Feed>
        );
    }
}
