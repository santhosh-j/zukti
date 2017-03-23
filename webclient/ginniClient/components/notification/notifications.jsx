import React from 'react';
import Notificationfeed from './notificationfeed';
import Config from '../../../../config/url';
import axios from 'axios';
import Embedly from 'react-embedly';
import {Grid} from 'semantic-ui-react';
import {Scrollbars} from 'react-custom-scrollbars';
import './notifications.css';
import NotificationsPage from '../../../Multi_Lingual/Wordings.json';
export default class Notifications extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: []
        };
        this.processInputNotification = this.processInputNotification.bind(this);
    }
    componentDidMount() {
        let socket = io();
        let url = Config.url + '/getbroadcastmessage';
        axios.get(url).then((response) => {
            this.state.messages = response.data.map((msg, index)=>{
              let msgContentView = this.processInputNotification(msg.value);
              return <Notificationfeed key={index} date={msg.date}
                msgSender={msg.username} dispData={msgContentView} msgSenderemail={msg.email}/>;
            });
            this.state.messages.reverse();
            this.setState({messages: this.state.messages});
        }).catch((error) => {
            console.log(error);
        });
        socket.on('update label', (data) => {
            let msgContentView = this.processInputNotification(data.value);
            this.state.messages.unshift(
              <Notificationfeed key={this.state.messages.length - 1} date={data.date}
                msgSender={data.username} dispData={msgContentView}/>);
            this.setState({messages: this.state.messages});
        });
    }
    processInputNotification(value) {
      let urlRegex = /(\b(?:(https?|ftp):\/\/)?((?:www\d{0,3}\.)?([a-z0-9.-]+\.(?:[a-z]{2,4}|museum|travel)(?:\/[^\/\s]+)*))\b)/gi;
      let match = value.match(urlRegex);
      let inputTokens = value.split(' ');
      let str = [];
      match = match || [];
      inputTokens.forEach((item)=> {
          if(match.indexOf(item) > -1) {
            str.push(<div>
                <Embedly url={item} apiKey="73f538bb83f94560a044bc6f0f33c5f6"/><a>{item}</a>
            </div>);
          }
          else{
            str.push(item + ' ');
          }
        });
      return str;
    }
    render() {
        return (
            <div style={{
                backgroundImage: "url('../../images/background.jpg')",
                marginTop: '1%',
                height: '100%'
            }}>

                <Grid divided='vertically'>

                    <Grid.Row columns={3}>
                      <Grid.Column width={1} />
                      <Grid.Column width={13}>
          <Scrollbars renderTrackHorizontal={props => <div {...props} className="track-horizontal"
                style={{
                  display: 'none',
                  position: 'right'
              }}/>} autoHeight autoHeightMin={555}>
                  <div style={{width: '98%', height: '50%'}} >
                    <h3 style={{color: 'black', textAlign: 'center'}}>{NotificationsPage.Notifications.Heading}</h3>
                                {this.state.messages}
      </div></Scrollbars>
                      </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        );
    }
}
