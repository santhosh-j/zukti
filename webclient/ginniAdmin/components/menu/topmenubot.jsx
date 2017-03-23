import React from 'react';
import Axios from 'axios';
import Cookie from 'react-cookie';
import {hashHistory} from 'react-router';
import {
    Menu,
    Dropdown,
    Image,
    Icon,
    Popup
} from 'semantic-ui-react';
import TopmenuPage from '../../../Multi_Lingual/Wordings.json';
export default class TopMenuBot extends React.Component {
    constructor() {
        super();
        this.state = {
            firstname: '',
            usertype: false
        };
    }
    // get user details from the server
    componentDidMount() {
        let self = this;
        Axios({url: 'http://localhost:8080/userProfile',
        method: 'GET', data: 'json'}).then(function(response) {
            let authType = Cookie.load('authType');
            if (authType === 'local') {
          self.setState({name: response.data.user.local.name,
            email: response.data.user.local.email,
            photo: response.data.user.local.photos, usertype: true});
            }
        }).catch(function(error) {
            console.log(error);
        });
    }
    onSubmitEmail() {
        hashHistory.push('/adminprofile');
    }
    render() {
        const customername = this.state.name;
        let profilepicture = Cookie.load('profilepicture');
        const trigger =(
            <span>
                <Image avatar src={require('../../../../webserver/images/'
                 + profilepicture)}/>
                  {name = customername}
            </span>
        );
        return (

            <div style={{
                width: '99%',
                backgroundColor: '#4a8e9b'
            }}>
                <Menu secondary>
                    <Menu.Item>
                        <a href="#/adminhome">
                        <Popup trigger={< Icon name = "arrow circle left" size = "large"
                           circular color = 'black' />} content='Back' size='mini'/>
                        </a>
                    </Menu.Item>
                    <Menu.Item position='right'/>
                    <Menu.Item/>
                    <Menu.Item/>
                    <Menu.Item/>
                    <Menu.Item >
                        <h3>{TopmenuPage.Topmenu.Heading}</h3>
                    </Menu.Item>
                    <Menu.Item position='right'>
                        <Dropdown trigger={trigger} pointing='top right' icon={null}>
                            <Dropdown.Menu >
                                <a href='#/adminprofile'>
                              <Dropdown.Item text='Edit Profile'
                                disabled={(!this.state.usertype)} icon='user'
                                 onClick={this.onSubmitEmail}/></a>
                                 <a href='#/log'>
                                   <Dropdown.Item text='Logout'
                                     disabled={!this.state.usertype} icon='sign out'/>
                                 </a>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Menu.Item>
                </Menu>
            </div>

        );
    }

}
