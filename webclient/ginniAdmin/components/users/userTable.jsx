import React from 'react';
import {Grid, Divider, Icon} from 'semantic-ui-react';
import Axios from 'axios';
import ViewUserChat from './viewUserChat';
import './userTable.css';
import {Scrollbars} from 'react-custom-scrollbars';
import UserAvatar from './userAvatar';
export default class UserTable extends React.Component
{
    constructor() {
        super();
        this.state = {
            name: [],
            email: [],
            userinformation: [],
            admininDomainName: '',
            sentimentColor: {},
        };


    }

    componentDidMount() {
        let self = this;
        let socket = io();

        // populating the user list for the first time
        Axios({url: 'http://192.168.1.55:8081/viewall', method: 'GET'}).then(function(response) {
            self.setState({userinformation: response.data});
            // console.log(JSON.stringify(response.data));
        });
        //@Deepika: To Get the Admin Details
        Axios({url: 'http://192.168.1.55:8081/adminProfile', method: 'GET'}).then(function(response){
          self.setState({admininDomainName: response.data[0].local.loggedinDomain});
          // console.log('Admindtails'+ response.data[0].local.loggedinDomain);
        });

       // @deepika: updating the user list on login or logout
        socket.on('update userlist', function() {
            Axios({url: 'http://192.168.1.55:8081/viewall', method: 'GET'}).then(function(response) {
                self.setState({userinformation: response.data});
                // console.log(response.data);
            });
         });
        /* @keerthana: Sentiment Color Code */
        var sentimentArray = this.state.sentimentColor;
        let con = this;
        socket.on('sentiment score', function(data) {
            // console.log('user' + JSON.stringify(data));
            let email = data.email;
            if (data.score == 0) {
                sentimentArray[email] = 'black';
            } else if (data.score == 1) {
                sentimentArray[email] = 'olive';
            } else if (data.score == 2) {
                sentimentArray[email] = 'teal';
            } else if (data.score == 3) {
                sentimentArray[email] = 'blue';
            } else if (data.score > 3) {
                sentimentArray[email] = 'violet';
            } else if (data.score == -1) {
                sentimentArray[email] = 'yellow';
            } else if (data.score == -2) {
                sentimentArray[email] = 'orange';
            } else if (data.score == -3) {
                sentimentArray[email] = 'red';
            } else if (data.score < -3) {
                sentimentArray[email] = 'brown';
            }
            con.setState({sentimentColor: sentimentArray});
            // console.log(sentimentArray);
        });
    }
    render() {

        let user = this.state.userinformation.map(function(newsdata, index) {
          if(newsdata.local.domain.indexOf(this.state.admininDomainName) != -1){

           let textStyle = {
                paddingTop: '7px',
                paddingLeft: '2px'
            };
            let authType = '';
            let email = '';
            let photo = '';
            let name = '';
            /* @santhosh - view online user updated for google and facebook */
            if(newsdata.facebook !== undefined)
            {
              authType = newsdata.facebook.authType;
              email = newsdata.facebook.email;
              photo = newsdata.facebook.photos;
              name = newsdata.facebook.displayName;
            }
            else if(newsdata.google !== undefined)
            {
              authType = newsdata.google.authType;
              email = newsdata.google.email;
              photo = newsdata.google.photos;
              name = newsdata.google.name;
            }
            else {
              authType = newsdata.local.authType;
              email = newsdata.local.email;
              photo = newsdata.local.photos;
              name = newsdata.local.name;
            }
            return (
                <div id='eachcardstyle' key={index}>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={3}>
                              <UserAvatar loginStatus={newsdata.local.loggedinStatus} authType={authType} photo={photo} name={name} email={email}></UserAvatar>
                            </Grid.Column>
                            <Grid.Column width={4}>
                                <div style={textStyle}>
                                    <h4>
                                        <b style={{
                                            margin: '0px'
                                        }}>{name}</b>
                                    </h4>
                                </div>
                            </Grid.Column>
                            <Grid.Column width={5}>
                                <div style={textStyle}>
                                    <b style={{
                                        color: 'blue'
                                    }}>{email}</b>
                                </div>
                            </Grid.Column>
                            <Grid.Column width={3}>
                                <div>
                                    <ViewUserChat userEmail={email}/>
                                </div>
                            </Grid.Column>
                            <Grid.Column width={1}>
                                <div style={{
                                    paddingTop: '5px'
                                }}>
                                {/* @keerthana:Sentiment icon for each user */}
                                    <Icon name='circle' size='large' color={this.state.sentimentColor[email]}/>
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>
            );
          }
        }.bind(this));
        return (
            <div style={{
                backgroundImage: 'url("../../images/background.jpg")',
                marginTop: '1%',
                height: '100%'
            }}>
                <Grid divided='vertically'>
                    <Grid.Row columns={3}>
                        <Grid.Column width={1}></Grid.Column>
                        <Grid.Column width={14}>
                            <Scrollbars renderTrackHorizontal={props => <div {...props} className="track-horizontal" style={{
                                display: 'none',
                                position: 'right'
                            }}/>} autoHeight autoHeightMin={554}>
                                <div style={{
                                    width: '98%',
                                    height: '50%'
                                }}>
                                    <h3 style={{
                                        color: 'red',
                                        fontStyle: 'bold'
                                    }}>USER DETAILS</h3>
                                    <Divider/>
                                    {/* @keerthana:Sentiment Indicator Chart display */}
                                    <Grid>
                                      <Grid.Row>
                                          <Grid.Column width={1}></Grid.Column>
                                          <Grid.Column width={1}></Grid.Column>
                                          <Grid.Column width={2}>
                                              <h3>Sentiment</h3>
                                          </Grid.Column>
                                          <Grid.Column width={1}>
                                              <Icon name='circle' size='large' color='violet'> 4</Icon>
                                          </Grid.Column>
                                          <Grid.Column width={1}>
                                              <Icon name='circle' size='large' color='blue'> 3</Icon>
                                          </Grid.Column>
                                          <Grid.Column width={1}>
                                              <Icon name='circle' size='large' color='teal'> 2</Icon>
                                          </Grid.Column>
                                          <Grid.Column width={1}>
                                              <Icon name='circle' size='large' color='olive'> 1</Icon>
                                          </Grid.Column>
                                          <Grid.Column width={1}>
                                              <Icon name='circle' size='large' color='black'> 0</Icon>
                                          </Grid.Column>
                                          <Grid.Column width={1}>
                                              <Icon name='circle' size='large' color='yellow'> -1</Icon>
                                          </Grid.Column>
                                          <Grid.Column width={1}>
                                              <Icon name='circle' size='large' color='orange'> -2</Icon>
                                          </Grid.Column>
                                          <Grid.Column width={1}>
                                              <Icon name='circle' size='large' color='red'> -3</Icon>
                                          </Grid.Column>
                                          <Grid.Column width={1}>
                                              <Icon name='circle' size='large' color='brown'> -4</Icon>
                                          </Grid.Column>
                                      </Grid.Row>
                                    </Grid>
                                    <br/><br/>
                                     {user}
                                </div>
                            </Scrollbars>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>

        );
    }
}
