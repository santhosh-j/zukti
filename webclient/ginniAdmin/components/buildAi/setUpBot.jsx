import React from 'react';
import {Divider, Grid, Button, Icon} from 'semantic-ui-react';
import './buildAi.css';
import AddQuestionAnswerSet from './addQuestionAnswerSet';
import DisplayQAset from '../getquestionanswerset/displayqaset';
import BuildAI from './buildAI';
import UploadCSV from './uploadCSV';
import Pagination from '../getquestionanswerset/pagination';
import SetUp from '../../../Multi_Lingual/Wordings.json';
export default class QuestionSetDisplay extends React.Component {
    constructor() {
        super();
        this.state = {
            type: '',
            data: [],
            displayQuestionAnswer: []
        };
        this.addQuestionAnswerSet = this.addQuestionAnswerSet.bind(this);
        this.displayQuestionAnswerSet = this.displayQuestionAnswerSet.bind(this);
        this.uploadCsv = this.uploadCsv.bind(this);
    }

    //  function to add a Question answer set to display
    addQuestionAnswerSet() {
        this.setState({type: 'add'});
    }
    // function display question and answer
    displayQuestionAnswerSet(data) {
        this.setState({type: 'display'});
        this.setState({displayQuestionAnswer: <Pagination data={data}/>});
    }
    /* @santhosh: upload csv to add question and answers to neo4j graph */
    //  function to upload csv display
    uploadCsv() {
        this.setState({type: 'upload'});
    }

    render() {
        return (
            <div id="backgroundimage" style={{
                backgroundImage: "url('../../images/background.jpg')",
                height: '100%'
            }}>
                <Grid style={{
                    width: '95%',
                    margin: 'auto'
                }}>
                    <Grid.Row columns={1}/>
                    <Grid.Row columns={1}>
                        <div style={{
                            width: '100%'
                        }}>
                            <p id="textpara">
                                {SetUp.SetUp.Heading}
                              </p>
                            <Divider fitted/>
                        </div>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={6}>
                            <AddQuestionAnswerSet handlerAddQASet={this.addQuestionAnswerSet}/>
                        </Grid.Column>

                        <Grid.Column width={6}>
                            <DisplayQAset handlerdisplayQASet={this.displayQuestionAnswerSet}/>
                        </Grid.Column>
                        <Grid.Column width={4}>
                            <Button color = 'red' onClick = {this.uploadCsv}><Icon name='upload'/>Upload CSV File</Button>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        {(this.state.type === 'add')
                            ? (<BuildAI/>)
                            : (this.state.type === 'upload')
                                ? <UploadCSV/>
                                : (this.state.displayQuestionAnswer)}
                    </Grid.Row>
                </Grid>
            </div>
        );
    }
}
