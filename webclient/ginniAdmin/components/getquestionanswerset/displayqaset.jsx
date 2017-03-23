import React from 'react';
import Axios from 'axios';
import {Button, Icon} from 'semantic-ui-react';
import Config from '../../../../config/url';

export default class DisplayQAset extends React.Component {
    constructor(props) {
        super(props);
        this.displayQuestionSetBlock = this.displayQuestionSetBlock.bind(this);
    }
    displayQuestionSetBlock() {
        let questions = [];
        let answers = [];
        let url = Config.url + '/getknowledge';
        Axios.get(url).then((response) => {
            // separate questions and answers
            let questionset = response.data.questionanswerSet;

            let set = [];
            questionset.map((data, index) => {
                let blogArray = [],
                    textArray = [],
                    videoArray = [];
                data._fields[1].map((data1, i) => {
                    if (data1[0] === 'blog') {
                        blogArray.push(data1[1])
                    }
                });
                data._fields[1].map((data1, i) => {
                    if (data1[0] === 'text') {
                        textArray.push(data1[1]);
                    }
                });
                data._fields[1].map((data1, i) => {
                    if (data1[0] === 'video') {
                        videoArray.push(data1[1]);
                    }
                });
                set.push({
                    questions: data._fields[0],
                    answers: {
                        blogs: blogArray,
                        texts: textArray,
                        videos: videoArray
                    }
                });
            });
            this.props.handlerdisplayQASet(set);
        }).catch((error) => {
            console.log(error);
        });
    }
    render() {
        return (
            <div >
                <Button onClick={this.displayQuestionSetBlock} color='red'>
                  <Icon name='find'/>Display Question Answer Set</Button>
            </div>
        );
    }
}
