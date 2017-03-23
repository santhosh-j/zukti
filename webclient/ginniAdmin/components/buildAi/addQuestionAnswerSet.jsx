import React from 'react';
import {Button, Icon} from 'semantic-ui-react';
export default class AddQuestionsAnswerSet extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div >
                <Button onClick={this.props.handlerAddQASet} color='red'>
                  <Icon name='plus'/>Add Question Answer Set</Button>
            </div>
        );
    }
}
