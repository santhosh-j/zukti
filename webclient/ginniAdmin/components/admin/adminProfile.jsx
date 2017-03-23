import React from 'react';
import {
    Button,
    Image,
    Modal,
    Divider,
    Form,
    Icon
} from 'semantic-ui-react';
import {hashHistory} from 'react-router';
import Dropzone from 'react-dropzone';
import Axios from 'axios';
import validator from 'validator';
import Cookie from 'react-cookie';
import './adminProfile.css';
const request = require('superagent');
export default class ClientProfile extends React.Component
{
    constructor(props) {
        super(props);
        // setting the default values for some state variables
        this.state = {
            allFiles: [],
            email: '',
            firstname: '',
            lastname: '',
            photo: '',
            changeImage: true
        };
        this.OnSubmitData = this.OnSubmitData.bind(this);
        this.show = this.show.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.saveImage = this.saveImage.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
    }
    // to set the image for preview
    onDrop(files)
    {
        files.forEach((file) => {
            this.state.allFiles.push(file);
        });
        this.setState({changeImage: false});
        this.setState({allFiles: this.state.allFiles[0]});
    }
    // to save the image in server
    uploadImage()
    {
        let photo = new FormData();
        photo.append('IMG', this.state.allFiles);
        let self = this;
        // sending the image to server
        request.post('/upload').send(photo).end(function(err, resp) {
            if (err) {
                console.error(err);
            } else {
                self.saveImage(resp.text);
              return resp;
            }
        });
    }
    // to save the image name in database in which the image already saved in server
    saveImage(image) {
        Axios({
            method: 'POST',
            url: 'http://localhost:8080/uploadImage',
            data: {
                data: image
            }
        }).then(function(response) {
            hashHistory.push('/chat/'+Cookie.load('domain').lowerCase());
        }).catch(function(err) {
            console.log(err);
        });
    }
    // if user profile updated successfully it redirects to react page
    profile()
    {
      console.log(Cookie.load('domain').toLowerCase());


          hashHistory.push('/'+Cookie.load('domain').toLowerCase());
        
    }
    // get the information about the user like fetches emailid
    componentDidMount() {
        let self = this;
        Axios({
          url: ' http://localhost:8080/clientinformation',
          method: 'get'})
          .then(function(response) {
            self.setState({email: response.data[0].local.email});
        }).catch(function(err) {
          console.log(err);
        });
    }
    // edited details will be sent to server
    OnSubmitData(e, value) {
        const self = this;
        e.preventDefault();
        Axios({
            url: ' http://localhost:8080/updateprofile',
            method: 'put',
            data: {
                email: this.state.email,
                firstname: value.formData.firstName,
                lastname: value.formData.lastName
            }
        }).then(function(msg) {
            show('small');
        }).catch(function(err) {
            console.log(err);
        });
    }
    show = (size) => () => this.setState({size, open: true})
    onOpenClick = () => {
        this.refs.dropzone.open();
    }
    /* function to attach the file to the server*/
    dropHandler = (file) => {
        let photo = new FormData();
        photo.append('IMG', file[0]);
        this.setState({file: file});
    }
    close = () => hashHistory.push('/react');
    // validation for firstname
    ChangeFirst = (event) => {
        this.setState({firstname: event.target.value});
        if (validator.isAlpha(event.target.value)) {
            this.setState({errorfirst: false});
            this.setState({errormessagefirst: false});
        } else {
            this.setState({errorfirst: true});
            this.setState({errormessagefirst: 'Enter a valid name'});
        }
    }
    // validation for lastname
    ChangeLast = (event) => {
        this.setState({lastname: event.target.value});
        if (validator.isAlpha(event.target.value)) {
            this.setState({errorlast: false});
            this.setState({errormessagelast: false});
        } else {
            this.setState({errorlast: true});
            this.setState({errormessagelast: 'Enter a valid name'});
        }
    }
    render() {
        let imagechange = null;
        const {open, size} = this.state;
        let profilepicture = Cookie.load('profilepicture');
        if (this.state.changeImage) {
            imagechange = (<Image src={require('../../../../webserver/images/'
            + profilepicture)} size='large' style={{
                height: 204
            }}/>);
        } else {
            imagechange = (<Image src={this.state.allFiles.preview} style={{
                height: 204
            }}/>);
        }
        return (
            <Modal size='small' open={true} onClose={this.close}
              closeOnRootNodeClick={false} closeIcon='close'>
                <Modal.Header id="updateheader"><Icon name='user'/>Edit Profile</Modal.Header>
                <Modal.Content image>
                    <Image wrapped size='medium'>
                        <Dropzone ref='dropzone' multiple={false} default={'../../images/user.png'}
                        accept={'image/*'} onDrop={this.onDrop}>
                            {imagechange}
                        </Dropzone><br/>
                        <Button primary onClick={this.uploadImage}>
                            Change Photo
                        </Button>
                    </Image>
                    <Modal.Description id="clientmodal">
                        <Form onSubmit={this.OnSubmitData}>
                            <Form.Field>
                                <label>First Name</label>
                            </Form.Field>
                            <Form.Input name="firstName" onChange={this.ChangeFirst}
                              placeholder='First Name'/>
                            <Form.Field>
                                <label>Last Name</label>
                                <Form.Input name="lastName" onChange={this.ChangeLast.bind(this)}
                                  placeholder='Last Name'/>
                            </Form.Field>
                            <Form.Field>
                                <label>Email</label>
                                <Form.Input placeholder='email' name="email"
                                  value={this.state.email} disabled/>
                                <Divider/>
                            </Form.Field>
                            <Button onClick={this.show('small')}
                              disabled={(!this.state.firstname) || (!this.state.lastname)}
                              color='blue' type='submit'>Save</Button>
                        </Form>
                        <Modal size={size} open={open}>
                            <Modal.Header>
                                <h2>
                                    <Image src='../../images/thumb.gif' size="small" avatar/>
                                    Updated Suceessfully</h2>
                            </Modal.Header>
                            <Modal.Actions>
                                <Button color='gray' onClick={this.profile.bind(this)}>
                                    <Button.Content visible>
                                      <Icon name='thumbs up'/>Ok</Button.Content>
                                </Button>
                            </Modal.Actions>
                        </Modal>
                    </Modal.Description>
                </Modal.Content>
            </Modal>
        );
    }
}
