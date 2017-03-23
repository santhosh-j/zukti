import React from 'react';
import {Button, Image, Modal} from 'semantic-ui-react';
import {hashHistory} from 'react-router';
import './logout.css';
import Axios from 'axios';
import Cookie from 'react-cookie';
export default class Logout extends React.Component
{
    state = {
        open: true
    }
    close = () => hashHistory.push('/chat/'+Cookie.load('domain').toLowerCase());
    // all the cookies stored while login will be cleared and user will be logged out
    handleLogout()
    {
        Axios({
          method: 'GET',
          url: '/signout',
          data: 'json'})
          .then(function(response) {
            let socket = io();
            socket.emit('userLoginStatus', {value: -1}); // v1

            /* @ramvignesh: event to update the user list */
            socket.emit('updateUserList');

            Cookie.remove('authType');
            Cookie.remove('token');
            Cookie.remove('profilepicture');
            hashHistory.push('/logoutfile');
        }).catch(function(error) {});
        console.log(error);
    }
    render() {
        const {open} = this.state;
        return (
            <Modal open={open} onClose={this.close} closeOnRootNodeClick={false} size='small' basic>
                <Modal.Header id="logoutheader">
                    <Image src='../../images/logout.gif' size='tiny' avatar/>
                    Are You Sure?You want to Logout?
                </Modal.Header>
                <Modal.Content>
                    <Modal.Description id="logoutdescription">
                        <a href="#/logoutfile">
                      <Button size="small" color='blue' onClick={this.handleLogout.bind(this)}>
                              Yes</Button>
                        </a>&nbsp;&nbsp;&nbsp;&nbsp;
                        <Button size="small" color='red' onClick={this.close}>No</Button>
                    </Modal.Description>
                </Modal.Content>
            </Modal>
        );
    }
}
