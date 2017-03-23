import React from 'react';
import ReactDOM from 'react-dom';
import Axios from 'axios';
import {Form} from 'semantic-ui-react';
import Config from '../../../../config/url';

export default class InputQuestion extends React.Component {
    constructor(props) {
        super(props);
        this.isValidQuestion = this.isValidQuestion.bind(this);
        this.state = {
          errorMessage: ''
        };
    }

    // to add a new question to ai rule and then store it
    isValidQuestion(e) {
        e.preventDefault();
        // getting the value of question from text field
        let question = ReactDOM.findDOMNode(this.refs.question).value;
        // ajax call to save question in a specifc question set
        let url = Config.url + '/qa/verifyQuestion';
        Axios.post(url, {question: question}).then((response) => {
            if (!response.data.isValidQuestion) {
                this.setState({errorMessage: response.data.errorMessage});
            } else {
                this.props.handlerForsaveQuestionInParentState(question);
                this.setState({errorMessage: ''});
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    render() {
        return (
            <Form onSubmit={this.isValidQuestion}>
                <Form.Field>
                    <input onBlur={this.isValidQuestion} autoComplete="off"
                      type='text' name='question' ref='question' style={{
                        width: '90%',
                        'margin-bottom': '8px'
                    }} placeholder='the question must have a keyword and an intent'/>
                </Form.Field>
                <p style={{color: 'red'}}>{this.state.errorMessage}</p>
            </Form>
        );
    }
}
