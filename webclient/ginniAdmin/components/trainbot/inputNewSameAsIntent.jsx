import React from 'react';
import ReactDOM from 'react-dom';
import Axios from 'axios';
import {Form, Button, Icon} from 'semantic-ui-react';
import Config from '../../../../config/url';
import Snackbar from 'material-ui/Snackbar';

export default class InputNewsSameAsIntent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          opensnackbar: false,
          snackbarMsg: ''
        };
        this.addNewSameAsIntent = this.addNewSameAsIntent.bind(this);
    }
    handleRequestClose=()=>{
      this.setState({opensnackbar: false});
    }
    addNewSameAsIntent(e) {
        e.preventDefault();
        // getting the value of new same as intent from text field
        let newSameAsIntent = ReactDOM.findDOMNode(this.refs.newSameAsIntent).value;
        // clearing the input newSameAsIntent text field
        ReactDOM.findDOMNode(this.refs.newSameAsIntent).value = '';
        // ajax call to save new sameas intent to the base Intent
        let url = Config.url + '/intent/addNewSameAsIntent';
        if(this.props.baseIntent !== '') {
        Axios.post(url, {
            baseIntent: this.props.baseIntent,
            newSameAsIntent: newSameAsIntent
        }).then((response) => {
            this.props.handlerAddNewIntent(newSameAsIntent);
        }).catch((error) => {
            console.log(error);
        });
    }
    else if (this.props.baseIntent === '') {
      this.setState({opensnackbar: true, snackbarMsg: 'Select base Intent First!'})
    }
  }
    render() {
        return (
            <Form onSubmit={this.addNewSameAsIntent}>
                <Form.Field>
                    <label>
                        <h4>Similar Intent</h4>
                    </label>
                    <input autoComplete='off' type='text' name='newSameAsIntent'
                      ref='newSameAsIntent' placeholder='Type new same as intent value'/>
                </Form.Field>
                <Button color="facebook" fluid onClick={this.addNewSameAsIntent}>
                    <Icon name='plus circle'>Add
                    </Icon>
                </Button>
                  <Snackbar open={this.state.opensnackbar} message={this.state.snackbarMsg}
                    autoHideDuration={1200} onRequestClose={this.handleRequestClose}/>
            </Form>
        );
    }
}
