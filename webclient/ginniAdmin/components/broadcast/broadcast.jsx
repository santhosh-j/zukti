import React from 'react';
import {
    Grid,
    Header
} from 'semantic-ui-react';
import Axios from 'axios';
import ContentType from './contentType';
import {Scrollbars} from 'react-custom-scrollbars';
import Embedly from 'react-embedly';
import MessageView from './messageView';
import NoFeedMessage from './noFeedMessage';
import Config from '../../../../config/url';
export default class BroadCast extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: []
        };
        this.processInputNotification = this.processInputNotification.bind(this);
    }
    componentDidMount() {
        let url = Config.url + '/getbroadcastmessage';
        Axios.get(url).then((response) => {
            this.state.messages = response.data.map((msg, index) => {
                let msgContentView = this.processInputNotification(msg.value);
                return <MessageView key={index} date={msg.date}
                  username={msg.username} dispData={msgContentView}/>;
            });
            this.state.messages.reverse();
            this.setState({messages: this.state.messages});
        }).catch((error) => {
            console.log(error);
        });
    }
    displayInputContent = (username, content, date) => {
        let msgContentView = this.processInputNotification(content);
        this.state.messages.unshift(
          <MessageView key={this.state.messages.length - 1} date={date}
            username={username} dispData={msgContentView}/>);
        this.setState({messages: this.state.messages});
    }
    processInputNotification(content) {
    let urlRegex = /(\b(?:(https?|ftp):\/\/)?((?:www\d{0,3}\.)?([a-z0-9.-]+\.(?:[a-z]{2,4}|museum|travel)(?:\/[^\/\s]+)*))\b)/gi;
        let match = content.match(urlRegex);
        let inputTokens = content.split(' ');
        let str = [];
        match = match || [];
        inputTokens.forEach((item) => {
            if (match.indexOf(item) > -1) {
                str.push(
                    <div>
                        <Embedly url={item} apiKey="73f538bb83f94560a044bc6f0f33c5f6"/>
                        <a>{item}</a>
                    </div>
                );
            } else {
                str.push(item + ' ');
            }
        });
        return str;
    }
    render() {
        return (
            <div style={{
  backgroundImage: "url('http://exploretheme.com/wp-content/uploads/2015/03/restaurant-icons.jpg')",
                height: '100%'
            }}>
                <Grid columns={2} style={{
                    width: '100%',
                    'margin-left': '5px',
                    margin: 'auto'
                }} divided>
                    <Grid.Row>
                        <Grid.Column width={7}>
                            <Header as='h1' color='blue'>Send Message</Header>
                            <ContentType handlercontent={this.displayInputContent}/>
                        </Grid.Column>
                        <Grid.Column style={{
                            'margin-top': '20px'
                        }} width={9}>
                            <div>
                                <Scrollbars renderTrackHorizontal={props =>
                                  <div {...props} className="track-horizontal" style={{
                                    display: 'none',
                                    position: 'right',
                                    minHeight: '516px'
                                }}/>} autoHeight autoHeightMin={550}>
                                    <div id='messageChat'>
                                        {this.state.messages.length === 0
                                            ? <NoFeedMessage/>
                                            : ''}
                                        {this.state.messages}
                                    </div>
                                </Scrollbars>
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        );
    }
}
