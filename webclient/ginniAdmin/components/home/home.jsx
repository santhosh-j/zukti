import React from 'react';
import {Image, Icon, Divider, Grid, Popup} from 'semantic-ui-react';
import {hashHistory} from 'react-router';
import Axios from 'axios';
import Cookie from 'react-cookie';
import './homestyle.css';
import AdminHomePage from '../../../Multi_Lingual/Wordings.json';
export default class FrontPage extends React.Component {

  constructor() {
      super();
      this.onSubmitEmail = this.onSubmitEmail.bind(this);
  }
    componentDidMount()
    {
        this.getUserProfile();
    }
    /* if the user clicks logout it clears all
    the cookies which is stored when user login and redirect to apphome */
    handleLogout()
    {
        Axios({
          method: 'GET',
          url: 'http://localhost:8080/signout',
          data: 'json'})
          .then(function(response) {
            Cookie.remove('authType');
            Cookie.remove('token');
            hashHistory.push('/');
        }).catch(function(error) {
            console.log(error);
        });
    }
    // redirects to react home page
    //Set the loggedinDomainStatus to the Admin @ Deepika
    onSubmitEmail(e) {
      console.log(Cookie.load('email')+" in home.jsx onSubmitEmail");
      let socket = io();
      switch(e.target.alt) {
        case 'react':
        Axios({
                method: 'PUT',
                url: '/user/setlogindomain',
                data: { email: Cookie.load('email'), domain: 'react'}
              }).then(function (response) {
                console.log(response+" :response");
                console.log(`Admin current domain: ${e.target.alt}`);
              })
               .catch(function (error) {
                   console.log(error);
              });
          Cookie.save('domain','REACT');
          console.log(Cookie.load('domain'));
          socket.emit('updateUserList');

          hashHistory.push('/react');
          break;
        case 'design pattern':
        Axios({
                method: 'PUT',
                url: '/user/setlogindomain',
                data: { email: Cookie.load('email'), domain: 'design pattern'}
              }).then(function (response) {
                console.log(`Admin current domain: ${e.target.alt}`);
              })
               .catch(function (error) {
                   console.log(error);
              });
              Cookie.save('domain','DESIGN PATTERN');
              console.log(Cookie.load('domain'));
              socket.emit('updateUserList');
              hashHistory.push('/design_pattern');
          break;
        default:
          break;
      }
    }
    render() {
        return (
            <div style={{
                backgroundImage: "url('../../images/homepage.jpg')"
            }}>
                <Grid>
                    <Grid.Row/>
                    <Grid.Row>
                        <Grid.Column width={2}/>
                        <Grid.Column width={10}/>
                        <Grid.Column width={4}>
                            <Popup offset={-140} positioning='left center'
                              trigger={< center > <Icon name='sign out' size='large'
                                inverted id='iconstyle' onClick={this.handleLogout.bind(this)}/>
                                < /center>} content='Logout'/>
                        </Grid.Column>
                    </Grid.Row>
                    <Divider horizontal inverted>
                        <h2 id='sparkleadmin'>{AdminHomePage.AdminHome.Heading1} &nbsp;&nbsp;{AdminHomePage.AdminHome.Heading2} &nbsp;&nbsp;
                        </h2>
                    </Divider>
                    <Grid.Row divided vertically>
                        <Grid.Column width={2}/>
                        <Grid.Column width={4} centered={'true'}>
                            <Grid.Row>
                                <center>
                                    <Image className="imagepointer" src='../../images/react.jpg'
                                    size='small' alt='react' avatar onClick={this.onSubmitEmail}/>
                                </center>
                            </Grid.Row>
                            <Grid.Row>
                                <center>
                                  <h2 className="heading1" onClick={this.onSubmitEmail}>
                                      {AdminHomePage.AdminHome.Topic1}</h2>
                                </center>
                            </Grid.Row>
                        </Grid.Column>
                        <Grid.Column width={4}>
                            <Grid.Row>
                                <center>
                                    <Image src='../../images/designlogo.png' size='small' alt='design pattern' avatar onClick={this.onSubmitEmail.bind(this)}/>
                                </center>
                            </Grid.Row>
                            <Grid.Row>
                                <center>
                                    <h2 className="heading2" onClick={this.onSubmitEmail.bind(this)}>{AdminHomePage.AdminHome.Topic2}</h2>
                                </center>
                            </Grid.Row>
                        </Grid.Column>
                        <Grid.Column width={4}>
                            <Grid.Row>
                                <center>
                                    <Image src='../../images/java.jpg' size='small' avatar/>
                                </center>
                            </Grid.Row>
                            <Grid.Row>
                                <center>
                                    <h2 className="heading3">{AdminHomePage.AdminHome.Topic3}</h2>
                                </center>
                            </Grid.Row>
                        </Grid.Column>
                        <Grid.Column width={2}/>
                    </Grid.Row>
                    <Grid.Row divided vertically>
                        <Grid.Column width={2}/>
                        <Grid.Column width={4}>
                            <Grid.Row>
                                <center>
                                    <Image src='../../images/js.jpg' size='small' avatar/>
                                </center>
                            </Grid.Row>
                            <Grid.Row>
                                <center>
                                    <h2 className="heading4">{AdminHomePage.AdminHome.Topic4}</h2>
                                </center>
                            </Grid.Row>
                        </Grid.Column>
                        <Grid.Column width={4}>
                            <Grid.Row>
                                <center>
                                    <Image src='../../images/node.jpg' size='small' avatar/>
                                </center>
                            </Grid.Row>
                            <Grid.Row>
                                <center>
                                    <h2 className="heading5">{AdminHomePage.AdminHome.Topic5}</h2>
                                </center>
                            </Grid.Row>
                        </Grid.Column>
                        <Grid.Column width={4}>
                            <Grid.Row>
                                <center>
                                    <Image src='../../images/plus2.jpg' size='small' avatar/>
                                </center>
                            </Grid.Row>
                            <Grid.Row>
                                <center>
                                    <h2 className="heading6">{AdminHomePage.AdminHome.Topic6}</h2>
                                </center>
                            </Grid.Row>
                        </Grid.Column>
                        <Grid.Column width={2}/>
                    </Grid.Row>
                    <Grid.Row/>
                    <Grid.Row/>
                    <Grid.Row/>
                    <Grid.Row/><br/><br/>
                </Grid>
            </div>
        );
    }
}
