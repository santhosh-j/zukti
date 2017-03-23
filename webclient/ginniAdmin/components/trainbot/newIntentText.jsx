import React from 'react';
import {Form, Divider, Button, Icon} from 'semantic-ui-react';
import Snackbar from 'material-ui/Snackbar';
import ReactDOM from 'react-dom';
import Axios from 'axios';
import Config from '../../../../config/url';
export default class NewIntentText extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          opensnackbar: false,
          snakbarmsg: ''
        };
        this.createNewIntent = this.createNewIntent.bind(this);
        this.addNewIntent = this.addNewIntent.bind(this);
    }
    addNewIntent(newIntent) {
      this.props.addNewIntent(newIntent);
    }
    createNewIntent(e) {
        e.preventDefault();
        // getting the value of new intent from text field
        let newIntent = ReactDOM.findDOMNode(this.refs.newIntent).value;

        //  checking for empty field since empty node is not required
        if (newIntent) {
            // clearing the input newSameAsIntent text field
            ReactDOM.findDOMNode(this.refs.newIntent).value = '';
            // ajax call for saving new intents in graph databse
            let url = Config.url + '/intent/createIntent';
            Axios.post(url, {NewIntent: newIntent}).then((response) => {
            }).catch((error) => {
                console.log(error);
            });
        } else {
            this.setState({opensnackbar: true, snakbarmsg: 'The field is empty'});
        }
        this.addNewIntent(newIntent);
    }
    handleRequestClose=()=>
    {
      this.setState({opensnackbar: false});
    };
    closeNewIntent=()=>{
      this.props.open();
    }

    // bind the dropdown with base intents from neo4j databse

    // function to handle dropdown change

    render() {
      const{open} = this.state;
        return (
            <Form >
                <Form.Field >
                    <h4>ADD A NEW INTENT
                    <Icon name='remove' color='red' size='large' style={{marginLeft: '55%'}}
                             onClick={this.closeNewIntent}/></h4>
                    <Divider/>
                    <label>
                        <h4>Enter The New Intent</h4>
                    </label>
                    <input autoComplete='off' type='text' ref='newIntent' placeholder='Add Intent'/>
                    <br/>
                    <br/>
                    <Button color="green" fluid onClick={this.createNewIntent}>
                        <Icon name='plus circle'>Add
                        </Icon>
                    </Button><br/>

                </Form.Field>
                <Snackbar open={this.state.opensnackbar} message={this.state.snakbarmsg}
                   autoHIdeDuration={400} onRequestClose={this.handleRequestClose}/>
            </Form>
        );
    }
}
