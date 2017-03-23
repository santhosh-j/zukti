import React from 'react';
import {Card, Radio, Button, Icon} from 'semantic-ui-react';
import Axios from 'axios';
import InputQuestion from './inputQuestion';
import ReplyContentInput from './replyContentInput';
export default class QuestionsAnswer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 'blog',
            question: '',
            texts: [' '],
            videos: [' '],
            blogs: [' '],
            noAnswerError: '',
            invalidQuestionError: ''
        };
        this.saveQuestionToState = this.saveQuestionToState.bind(this);
        this.saveAnswerToState = this.saveAnswerToState.bind(this);
        this.saveQuestionAnswer = this.saveQuestionAnswer.bind(this);
        this.removeAnswer = this.removeAnswer.bind(this);
    }
    handleChange = (e, {value}) => this.setState({value});

    // delete answer
    removeAnswer(type, index) {
      if(type === 'text') {
        this.state.texts.splice(index, 1);
        this.setState({texts: this.state.texts});
      }
      else if(type === 'video') {
        this.state.videos.splice(index, 1);
        this.setState({videos: this.state.videos});
      }
      else if(type === 'blog') {
        this.state.blogs.splice(index, 1);
        this.setState({blogs: this.state.blogs});
      }
    }
    // function to save question into State
    saveQuestionToState(question) {
        this.state.question = question;
    }
    saveAnswerToState(type, answer, i) {
        if (type === 'text') {
            this.state.texts[i] = answer;
            this.setState({texts: this.state.texts});
        } else if (type === 'video') {
            this.state.videos[i] = answer;
            this.setState({videos: this.state.videos});
        } else if (type === 'blog') {
            this.state.blogs[i] = answer;
            this.setState({blogs: this.state.blogs});
        }
    }
    /* fired when submit button is clicked in this function
    the question answer will be saved to neo4j */
    saveQuestionAnswer() {
        // perform validation first and then save it to graph DB
        let hasAnswer = this.state.texts[0].trim() === '' &&
        this.state.videos[0].trim() === '' && this.state.blogs[0].trim() === '';
        let hasQuestion = this.state.question.trim() === '';
          if(hasQuestion) {
          this.setState({errorMessage: 'The question must be valid'});
          return;
        }
        if(hasAnswer) {
          this.setState({errorMessage: 'There must be a atleast one answer'});
          return;
        }
        Axios.post('/qa/addQuestionAnswer', {question: this.state.question,
          texts: this.state.texts, videos: this.state.videos, blogs: this.state.blogs}).
        then((response)=> {
          this.setState({question: ' ', texts: [' '], videos: [' '], blogs: [' '],
          noAnswerError: '', invalidQuestionError: ''});
        }).
        catch((error)=>{
          console.log(error);
        });
    }
    render() {
        const styleFirstCardBoxInRow = {
            'margin-right': '0px',
            'width': '427%'
        };
        return (
                <Card fluid style={styleFirstCardBoxInRow}>
                    <Card.Content>
                        <Card.Meta
                          style={{color: 'black', fontSize: '15px', fontWeight: 'bold'}}>
                            If the user asks something similar to
                        </Card.Meta>
                        <Card.Description>
                  <InputQuestion handlerForsaveQuestionInParentState={this.saveQuestionToState}/>
                        </Card.Description>
                    </Card.Content>
                    <Card.Content>
                        <Card.Meta style={{color: 'black', fontSize: '15px', fontWeight: 'bold'}}>
                            Bot reply
                            <Radio label='Blog' name='radioGroup' value='blog'
                               checked={this.state.value === 'blog'} onChange={this.handleChange}/>
                            <Radio style={{
                                marginLeft: '5px'
                            }} label='Text' name='radioGroup' value='text'
                            checked={this.state.value === 'text'} onChange={this.handleChange}/>
                            <Radio label='Video' name='radioGroup' value='video'
                              checked={this.state.value === 'video'} onChange={this.handleChange}/>
                        </Card.Meta>
                        <Card.Description>
                            <ReplyContentInput texts={this.state.texts} videos={this.state.videos}
                              blogs={this.state.blogs} handlerRemoveAnswer={this.removeAnswer}
                              handlerForSaveAnswerToParentState ={this.saveAnswerToState}
                              replyContentType={this.state.value}/>
                          <p style={{color: 'red'}}>{this.state.errorMessage}</p>
                          <Button color='green' onClick={this.saveQuestionAnswer}
                             style={{marginLeft: '30%', marginRight: '30%', width: '30%'}} animated>
                            <Button.Content visible>SAVE</Button.Content>
                            <Button.Content hidden><Icon name='save'/></Button.Content>
                          </Button>
                        </Card.Description>
                    </Card.Content>
                </Card>
        );
    }
}
