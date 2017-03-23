import React from 'react';
import {Feed, Image} from 'semantic-ui-react';
import Axios from 'axios';
export default class MessageView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          photo: '',
          name: '',
          email: ''
        };
          }
    componentDidMount() {
      let self = this;
      Axios({
          url: 'http://192.168.1.55:8081/userProfile',
          method: 'GET',
          data: 'json'
        }).then(function (response) {
          self.setState(
            {photo: require('../../../../webserver/images/' + response.data.user.local.photos)});
            })
         .catch(function (error) {
              console.log(error);
        });
    }
    render() {
        return (
            <Feed>
                <Feed.Event>
                        <Image avatar src={this.state.photo}/>
                    <Feed.Content>
                        <Feed.Summary>
                            <Feed.User style={{marginLeft: '10px'}}>{this.props.username}</Feed.User>
                            <Feed.Date style={{marginLeft: '10px'}}>{this.props.date}</Feed.Date>
                        </Feed.Summary>
                        <Feed.Extra text style={{marginLeft: '20px'}}>
                            {this.props.dispData}
                        </Feed.Extra>
                    </Feed.Content>
                </Feed.Event>
            </Feed>
        );
    }
}
