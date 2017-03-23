import React from 'react';
import {Button, Icon, Modal, Form} from 'semantic-ui-react';
import {hashHistory} from 'react-router';
import Axios from 'axios';
import validator from 'validator';
import './changepassword.css';
import Cookie from 'react-cookie';
import ChangePasswordPage from '../../../Multi_Lingual/Wordings.json';
export default class ChangePassword extends React.Component {
    constructor(props) {
        super(props);
        // setting default values to the state variables
        this.state = {
            email: '',
            errormessage: '',
            errormessagepassword: '',
            repassword: '',
            errorrepassword: false,
            errorpassword: false,
            password: '',
            confirmpassword: false,
            verifypassword: false
        };
        this.passwordchange = this.passwordchange.bind(this);
    }
    state = {
        open: true
    }
    show = (trigger) => () => this.setState({dimmer, open: true})
    handleOpen = (e) => this.setState({modalOpen: true})
    // validation for password field
    ChangePassword = (event) => {
        this.setState({password: event.target.value});
        // console.log(event.target.value)
        let points = event.target.value.length;
        let password_info = event.target.value;
        let has_letter = new RegExp('[a-z]');
        let has_caps = new RegExp('[A-Z]');
        let has_numbers = new RegExp('[0-9]');
        if (event.target.value.length > 4) {
            if (has_letter.test(password_info) && points >= 6 && has_caps.test(password_info) && has_numbers.test(password_info)) {
                this.setState({errorpassword: false});
                this.setState({errormessagepassword: false});
                this.setState({verifypassword: true});
            } else {
                this.setState({errorpassword: true});
                this.setState({verifypassword: false});
                this.setState({errormessagepassword:
                  'Password should contain numbers,letters(A&a) and minimum length is  6'});
            }
        }
    }
    // validation for confirmpassword
    ChangeRepassword = (event) => {
        this.setState({repassword: event.target.value});
        if (event.target.value.length > 4) {
            if (validator.equals(event.target.value, this.state.password)) {
                // checking equality between password and confirmpassword
                this.setState({errorrepassword: false});
                this.setState({errormessage: false});
                this.setState({confirmpassword: true});
            } else {
                this.setState({confirmpassword: false});
                this.setState({errorrepassword: true});
                this.setState({errormessage: 'Password not matched'});
            }
        }
    }
    close = () => hashHistory.push('/chat/'+Cookie.load('domain').toLowerCase());
    /* function is used to send the new password to the server
    and it will be updated in the user database*/
    passwordchange(e, value) {
        e.preventDefault();
        Axios({
            url: '/resetpassword',
            method: 'put',
            data: {
                password: value.formData.password
            }
        }).then(function(msg) {
            hashHistory.push('/chat/'+Cookie.load('domain').toLowerCase());
            console.log('/chat/'+Cookie.load('domain').toLowerCase());
        }).catch(function(error) {
            console.log(error);
        });
    }
    render() {
        const {open, trigger, closeOnRootNodeClick} = this.state
        return (
            <div>
                <Modal trigger={trigger} open={true} onClose={this.close}
                  closeOnRootNodeClick={false} size='small' closeIcon="close">
                    <Modal.Header id="headerchange">
                        <h1>{ChangePasswordPage.ChangePassword.Heading}</h1>
                    </Modal.Header>
                    <Modal.Content>
                        <Form onSubmit={this.passwordchange.bind(this)}>
                            <Form.Field width={8} id='forminput'>
                                <Form.Input placeholder='new password' type='password'
                                   name='password' icon='lock' iconPosition='left'
                                    onChange={this.ChangePassword.bind(this)}/>
                                <p id="errormessages">{this.state.errormessagepassword}</p>
                            </Form.Field>
                            <Form.Field width={8} id='forminput'>
                                <Form.Input type='password' placeholder='confirm password'
                                  name='confirmpassword' icon='lock' iconPosition='left'
                                   onChange={this.ChangeRepassword.bind(this)}/>
                                <p id="errormessages">{this.state.errormessage}</p>
                            </Form.Field><br/>
                            <Form.Field>
                                <a href="#/chat">
                                    <Button color='green' type='submit'
                                      disabled={(!this.state.password) || (!this.state.repassword) ||
                                        (!this.state.verifypassword) || (!this.state.confirmpassword)}
                                        inverted id='resetbutton'>
                                        <Icon name='checkmark'/>
                                        Reset
                                    </Button>
                                </a>
                            </Form.Field>
                        </Form>
                    </Modal.Content>
                </Modal>
            </div>
        );
    }
}
