import React from 'react';
import {
    Divider,
    Grid
  } from 'semantic-ui-react';
  import './buildAi.css';
import QuestionAnswer from './questionsAnswer';
import AddQuestionAnswerSet from './addQuestionsAnswerSet';
import DisplayQAset from '../getquestionanswerset/displayqaset';
import Display from '../getquestionanswerset/displayaccordion';
export default class QuestionSetDisplay extends React.Component {
    constructor() {
        super();
        this.addQuestionAnswerSet = this.addQuestionAnswerSet.bind(this);
        this.displayQuestionAnswerSet = this.displayQuestionAnswerSet.bind(this);
        this.removeset = this.removeset.bind(this);
        this.state = {
           questionAnswerSet: [],
           type: '',
           displayQuestionAnswerSet: []
        };
    }
    // function to add a Question answer set to display
    addQuestionAnswerSet(id) {
        this.setState({type: 'add'});
        this.state.questionAnswerSet.push(
          <QuestionAnswer answerID={id} removeRuleBlockHandler={this.removeset}/>);
        this.setState({questionAnswerSet: this.state.questionAnswerSet});
    }
    // function to remove questionAnswerSet
    removeset(index) {
      this.state.questionAnswerSet.splice(index, 1);
      this.setState({questionAnswerSet: this.state.questionAnswerSet});
    }
    // display quaetion answer set
    displayQuestionAnswerSet(set)
    {
      set.map((que)=>{
      this.state.displayQuestionAnswerSet.push(
        <Display questions={que.questions} answers = {que.answers}/>);
      });
      this.setState({displayQuestionAnswerSet: this.state.displayQuestionAnswerSet});
      this.setState({type: 'display'});
      this.state.displayQuestionAnswerSet = [];
      }
    render() {
        return (
            <div style={{
                backgroundImage: "url('../../images/background.jpg')",
                height: '100%'
            }}>
                <Grid style={{
                    width: '95%',
                    margin: 'auto'
                }}>
                    <Grid.Row columns={1} />
                    <Grid.Row columns={1}>
                        <div style={{
                            width: '100%'
                        }}>
                        <p id="textpara">
                          It is a set of questions and the corresponding bot replies.
                          I will understand user questions similar to those you’ve set up
                          and reply with a appropiate answer.</p>
                            <Divider fitted/>
                        </div>
                    </Grid.Row>
                    <Grid.Row>
                      <Grid.Column width={8}>
                        <AddQuestionAnswerSet handlerAddQASet={this.addQuestionAnswerSet}/>
                        </Grid.Column>
                    <Grid.Column width={8}>
                        <DisplayQAset handlerdisplayQASet={this.displayQuestionAnswerSet}/>
                    </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                {this.state.type === 'add' ?
                this.state.questionAnswerSet : this.state.displayQuestionAnswerSet}
                    </Grid.Row>
                </Grid>
            </div>
        );
    }
}
