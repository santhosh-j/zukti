import React from 'react';
import {Button, Modal, Divider, List, Icon} from 'semantic-ui-react';
import Config from '../../../../config/url';
import Axios from 'axios';
import './viewUserChat.css';
import Snackbar from 'material-ui/Snackbar';
export default class ViewUserChat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            conversations: [],
            open: false,
            openSnackbar: false,
            snackbarMsg: ''
        };
        // function to retrive chat of a given user
        this.getUserChats = this.getUserChats.bind(this);
    }
    show = (size) => () => this.setState({size, open: true})
    close = () => this.setState({open: false})

    getUserChats() {
        let url = Config.url + '/retriveChat?email=' + this.props.userEmail;
        Axios.get(url).then((response) => {
            this.setState({conversations: response.data.chats});
            this.setState({open: true});
        }).catch((error) => {
            this.setState({openSnackbar: true, snackbarMsg: 'No chats available with this specific user'});
        });
    }
    handleRequestClose = () => {
        this.setState({openSnackbar: false});
    };
    render() {
        const {open, size} = this.state;
        let chats = this.state.conversations.map((conversation) => {
            return (
                <div>
                    <List as='ol'>
                        <List.Item as='li' value='?'>
                            {conversation.question.value}&nbsp;&nbsp;&nbsp; {conversation.question.time}</List.Item>
                        <Divider/>
                    </List>
                </div>
            );
        });
        return (
            <div>
                <Button color='green' onClick={this.getUserChats} circular>
                    <Icon name='history'/>CHATS</Button>
                <Modal size={size} open={open} onClose={this.close} closeIcon='close'>
                    <Modal.Header id='viewuserchat'>
                        <Icon name='question circle outline'/>
                        QUESTIONS ASKED
                    </Modal.Header>
                    <Modal.Content id='viewuserchatcontent'>
                        <b>{chats
                                ? chats
                                : 'hiiii'}</b>
                    </Modal.Content>
                </Modal>
                <Snackbar open={this.state.openSnackbar} message={this.state.snackbarMsg} autoHideDuration={4000} onRequestClose={this.handleRequestClose}/>
            </div>
        );
    }
}
