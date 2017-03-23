import React, {Component} from 'react';
import LeftMenuContent from '../leftmenuPusherContent/leftmenuContent';
import {
    Sidebar,
    Segment,
    Image,
    Icon,
    Menu,
    Popup,
    Label,
    Dropdown
} from 'semantic-ui-react';
import Axios from 'axios';
import Cookie from 'react-cookie';
import {hashHistory} from 'react-router';
import Tour from "react-user-tour"
import './leftmenu.css';
import LeftMenuPage from '../../../Multi_Lingual/Wordings.json';
export default class LeftMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeItem: 'Build',
            details: '',
            email: '',
            firstname: '',
            lastname: '',
            usertype: false,
            name: '',
            photo: '',
            counter: 0,
            isTourActive: false,
      			tourStep: 1
        };
        this.onSubmitEmail = this.onSubmitEmail.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.getNotificationCount = this.getNotificationCount.bind(this);
        this.getUserInformation = this.getUserInformation.bind(this);
        this.retriveChat = this.retriveChat.bind(this);
        this.setTourState = this.setTourState.bind(this);
    }
    //  @Mayanka: call retriveChat to check history
    componentWillMount(){
      this.retriveChat();
    }
    //  @Mayanka: if chat history is empty start the user-tour
  setTourState() {
      if(this.state.tourFlag == 1)
      {
        this.setState({
          isTourActive: true,
          tourStep: 1
        });
      }
    }
    handleItemClick = ((e, {name}) => {
        if (this.state.activeItem === 'notifications') {
            let url = '/getbroadcastmessage/updateCount';
            this.state.counter = 0;
            Axios.post(url).then((response) => {}).catch((error) => {
                console.log(error);
            });
        }
        this.setState({activeItem: name, counter: this.state.counter});
    });
    componentDidMount() {
        this.getUserInformation();
        this.getNotificationCount();
        this.getDomainInformation();
        let socket = io();
        socket.on('update label', (data) => {
            this.state.counter = this.state.counter + 1;
            this.setState({counter: this.state.counter});
        });
    }
    getNotificationCount() {
        let url = '/getbroadcastmessage/count';
        Axios.get(url).then((response) => {
            this.setState({counter: response.data.count});
        }).catch((error) => {
            console.log(error);
        });
    }
    /* @Sindhujaadevi: To get the domain information */
    getDomainInformation(){
      let differentDomain = Cookie.load('differentDomain');
      if(!differentDomain){
        this.setState({activeItem:'Build'});
      }
      else{
          this.setState({activeItem:'ChatBot'});
          Cookie.remove('differentDomain');
      }
    }
    // to fetch the information about the user
    getUserInformation() {
        let self = this;
        Axios({
          url: '/userProfile',
          method: 'GET',
          data: 'json'}).then(function(response) {
            let authType = Cookie.load('authType');
            if (authType === 'facebook') {
                self.setState({name: response.data.user.facebook.displayName,
                  email: response.data.user.facebook.email,
                  photo: response.data.user.facebook.photos, usertype: false});
            } else if (authType === 'google') {
                self.setState({name: response.data.user.google.name,
                  email: response.data.user.google.email,
                  photo: response.data.user.google.photos, usertype: false});
            } else if (authType === 'local') {
                self.setState({name: response.data.user.local.name,
                email: response.data.user.local.email,
                photo: response.data.user.local.photos, usertype: true});
            }
        }).catch(function(error) {
            console.log(error);
        });
    }
    onSubmitEmail() {
        hashHistory.push('/profile');
    }
    // redirects to changepassword page
    onChangePassword() {
        hashHistory.push('/change');
    }
    retriveChat(e) {
      let flag = 0;
          Axios.get('/retriveChat').then((response) => {
            //  @Mayanka: chat history is empty if there's no response data
              if (response.data == null) {
            //  @Mayanka: set flag to one if history is empty
                flag = 1;
              }
              else{
                flag = 0;
              }this.setState({tourFlag: flag});
              if(flag == 1){
                this.setTourState();
              }
          }).catch((err) => {
          });

          }
  render() {
    //  @Mayanka: style element for user-tour
    const tourTitleStyle = {
    fontWeight: 700,
    fontSize: 20,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    color:'teal'
  };
  //  @Mayanka: style element for user-tour
  const tourMessageStyle = {
    fontSize: 16,
    paddingLeft: 10,
    paddingTop:10,
      color:'teal'
  };
        const activeItem = this.state.activeItem;
        const customername = this.state.name;
        let trigger;
        let authType = Cookie.load('authType');
        if (authType === 'local') {
            let profilepicture = Cookie.load('profilepicture');
            trigger = (
                <span>
                    <Image avatar src={require('../../../../webserver/images/' + profilepicture)}/>
                    {name = customername}
                </span>
            );
        } else if (authType === 'facebook') {
            trigger = (
                <span>
                    <Image avatar src={this.state.photo}/>
                    {name = customername}
                </span>
            );
        } else if (authType === 'google') {
            trigger = (
                <span>
                    <Image avatar src={this.state.photo}/>
                     {name = customername}
                </span>
            );
        }
        return (
            <div id="leftbarmenu">
                <Sidebar as={Menu} className='fixed' animation='slide along' width='thin'
                   visible={true} icon='labeled' vertical inverted>
                    <Menu.Item name='Genie' active={activeItem === 'Genie'}
                      onClick={this.handleItemClick}>
                        <a href="#/clienthome">
                            <Image src='../../images/ginianim.gif' size='tiny' avatar/></a>
                    </Menu.Item>
                    <Menu.Item name='Home' active={activeItem === 'Home'}
                      onClick={this.handleItemClick}>
                        <Icon name='home' color='teal'/>
                        {LeftMenuPage.LeftMenu.Menu1}
                    </Menu.Item>
                    <Menu.Item name='ChatBot' className="stop-1" active={activeItem === 'ChatBot'}
                      onClick={this.handleItemClick}>
                        <Icon name='discussions' color='teal'/>
                        {LeftMenuPage.LeftMenu.Menu2}
                    </Menu.Item>
                    <Menu.Item name='Bookmarks' active={activeItem === 'Bookmarks'}
                      onClick={this.handleItemClick}>
                        <Icon name='save' color='teal'/>
                        {LeftMenuPage.LeftMenu.Menu3}
                    </Menu.Item>
                    <Menu.Item name='notifications' active={activeItem === 'notifications'}
                      onClick={this.handleItemClick}>
                        <Label color='red' floating-left>{this.state.counter}</Label>
                        <Icon name='alarm' color='teal'/>
                        {LeftMenuPage.LeftMenu.Menu4}
                    </Menu.Item>

                </Sidebar>
                <Sidebar.Pusher id="sidebarpusher">
                    <Segment id="segmentleftbar">
                        <div id='topmenudiv'>
                            <Menu secondary>
                                <Menu.Item>
                                    <a href="#/clienthome">
                                        <Popup trigger={< Icon name = "arrow circle left"
                                          size = "large" circular color = 'black' />}
                                          content='Back' size='mini'/>
                                    </a>
                                </Menu.Item>
                                <Menu.Item position='right'>
                                  <h3>{this.props.params.domain.toUpperCase()}</h3>
                                </Menu.Item>
                                <Menu.Item position='right'>
                                    <Dropdown trigger={trigger} pointing='top right' icon={null}>
                                        <Dropdown.Menu >
                                            <Dropdown.Item text='Edit Profile' icon='user'
                                              disabled={(!this.state.usertype)}
                                              onClick={this.onSubmitEmail}/>
                                            <Dropdown.Item text='Change Password' icon='lock'
                                              disabled={(!this.state.usertype)}
                                              onClick={this.onChangePassword}/>
                                              <a href='#/logout'><Dropdown.Item text='Logout' icon='sign out'
                                                active={activeItem === 'LogOut'}
                                                disabled={(!this.state.usertype)}
                                                onClick={this.handleItemClick}/>
                                              </a>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Menu.Item>
                            </Menu>
                        </div>
                        <div id='leftmenucontentdiv'>
              <LeftMenuContent sidebarItemSelected={activeItem} domain={this.props.params.domain}/>
                        </div>
                    </Segment>
                </Sidebar.Pusher>
                <div style={{position: "absolute", top: 0}}>
             <Tour
               active={this.state.isTourActive}
               step={this.state.tourStep}
               onNext={(step) => this.setState({tourStep: step})}
               onBack={(step) => this.setState({tourStep: step})}
               onCancel={() => this.setState({isTourActive: false})}
               steps={[
                     {
                       step: 1,
                       selector: ".stop-1",
                       title: <div style={tourTitleStyle}>Knowledge Hub!!</div>,
                       body: <div style={tourMessageStyle}>Click Lets Explore & start asking your queries</div>
                     }
                 ]}
             />
          </div>
            </div>
        );
    }
}
