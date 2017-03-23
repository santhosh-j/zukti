import React from 'react';
import {
    Button,
    Icon,
    Header,
    Form,
    Grid,
    Divider,
    Menu,
    Dimmer,
    Image
} from 'semantic-ui-react';
import validator from 'validator';
import {hashHistory} from 'react-router';
import './forgotpassword.css';
import Axios from 'axios';
import ForgetPasswordPage from '../Multi_Lingual/Wordings.json';
export default class ForgotPassword extends React.Component
{
    constructor() {
        super();
        // setting the default values for some state variables
        this.state = {
            email: ' ',
            checkmail: false,
            erroremail: false,
            errormessageemail: '',
            userexists: ''
        };
        this.onSubmitData = this.onSubmitData.bind(this);
    }
    handleOpen = () => this.setState({active: true})
    handleClose = () => this.setState({active: false})
    // sending the email verification for reset password
    onSubmitData(e, value) {
        e.preventDefault();
        Axios({
            url: '/forgetpassword',
            method: 'post',
            data: {
                email: value.formData.email
            }
        }).then(function(response) {
          // If the mail sent to user successfully then it redirects to forgetmail page
            hashHistory.push('/forgetmail');
        }).catch(function(error) {
        // In case if the mail not sent to user then it redirects to mailnotsend page
            hashHistory.push('/mailnotsend');
        });
    }
    // validating the emailid entered by user
    ChangeEmail = (event) => {
        this.setState({email: event.target.value});
        // check whether the user is alreay exists or not
        if (event.target.value.length >= 1) {
            if (validator.isEmail(event.target.value)) {
                 let self = this;
                Axios({
                    url: '/checkuser',
                    method: 'POST',
                    data: {
                        email: event.target.value
                    }
                }).then(function(response) {
                  // checks whether the emailid already exist
                    if (response.data.userexists) {
                        self.setState({userexists: ' '});
                        self.setState({checkmail: true});
                    } else {
                        self.setState({userexists: 'No such mail exist, Please sign up'});
                        self.setState({checkmail: false});
                    }
                }).catch(function(error) {
                });
                // In case the entered emailid is valid
                this.setState({erroremail: false});
                this.setState({errormessageemail: false});
            } else {
              // shows error if emailid is not valid
                this.setState({erroremail: true});
                this.setState({errormessageemail: 'Enter valid email, including \@\ '});
            }
        }
    }
    render() {
        const {active} = this.state;
        return (
            <div style={{
                backgroundImage: "url('../../images/intro-bg.jpg')",
                height: '100%'
            }}>
                <br/><br/>
                <Grid columns={3}>
                    <Grid.Column width={5}>
                        <Menu fixed='top' style={{
                            background: 'transparent'
                        }} secondary>
                            <Menu.Item>
                                <h1 style={{
                                    fontFamily: 'monospace',
                                    color: 'white'
                                }}>{ForgetPasswordPage.ForgetPassword.Heading1}</h1>
                            </Menu.Item>
                            <Menu.Menu position='right'>
                                <Menu.Item>
                                    <Button circular id='loginsignup'>
                                        <a href="#/login" style={{
                                            color: 'white'
                                        }}>Login</a>
                                    </Button>
                                    &nbsp;&nbsp;<Button circular id='loginsignup'>
                                        <a href="#/signup" style={{
                                            color: 'white'
                                        }}>Signup</a>
                                    </Button>
                                </Menu.Item>
                            </Menu.Menu>
                        </Menu>
                    </Grid.Column>
                    <Grid.Column Width={6} id="gridstyle">
                        <Header id="headerstylefor">
                            <h2 id='request'><Icon name='mail' id='mailicon'/>{ForgetPasswordPage.ForgetPassword.Heading2}</h2>
                        </Header>
                        <Divider/>
                        <p id="textstyle">
                            <h4 style={{
                                color: 'white',
                                fontStyle: 'italic'
                            }}>{ForgetPasswordPage.ForgetPassword.Heading3}</h4>
                        </p>
                        <Form onSubmit={this.onSubmitData}>
                            <Form.Field id="forgotfield">
                                <Form.Input placeholder='email id' name="email" icon='mail outline'
                                  iconPosition='left' onChange={this.ChangeEmail.bind(this)}
                                  error={this.state.erroremail} required/>
                                <p style={{
                                    color: 'red',
                                    textAlign: 'center'
                                }}>{this.state.userexists}</p>
                                <p style={{
                                    color: 'red',
                                    textAlign: 'center'
                                }}>{this.state.errormessageemail}</p>
                            </Form.Field>
                            <Button type='submit' id='buttonstylefor' onClick={this.handleOpen}
                              circular disabled= {(!this.state.email) || (!this.state.checkmail)}>
                              Send</Button>
                            <Dimmer active={active} onClickOutside={this.handleClose} page>

                                <Header as='h2' icon inverted>
                                    <Image src='../images/mail.gif' size='small'/><br/><br/>
                                    <Header.Subheader>Hold a moment to get mail</Header.Subheader>
                                </Header>
                            </Dimmer>
                        </Form>
                    </Grid.Column>
                    <Grid.Column width={5}/>
                </Grid>
            </div>
        );
    }
}
