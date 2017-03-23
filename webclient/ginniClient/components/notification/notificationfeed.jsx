import React from 'react';
import {Feed, Image} from 'semantic-ui-react';
import './notifications.css';
import Axios from 'axios';
export default class Notificationfeed extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          photo: '',
          name: '',
          email: ''
        };
    }
    componentDidMount() {
      let self=this;
      Axios({
          method: 'post',
          url: '/admindetails',
          data: {data: self.props.msgSenderemail}
        }).then(function (response) {
          self.setState({photo: require('../../../../webserver/images/' +
           response.data[0].local.photos)});
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
                            <Feed.User id="messagesender">{this.props.msgSender}</Feed.User>
                            <Feed.Date id="senderdate">{this.props.date}</Feed.Date>
                        </Feed.Summary>
                        <Feed.Extra id="notification">
                            {this.props.dispData}
                        </Feed.Extra>
                    </Feed.Content>
                </Feed.Event>
            </Feed>
        );
    }
}
