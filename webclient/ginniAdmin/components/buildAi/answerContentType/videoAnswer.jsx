import React from 'react';
import {TextArea, Form, Button, Icon, Popup} from 'semantic-ui-react';

export default class videoAnswer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          emptyInput: false
        };
        this.getInputData = this.getInputData.bind(this);
        this.addNewAnswer = this.addNewAnswer.bind(this);
        this.removeAnswer = this.removeAnswer.bind(this);
    }
    getInputData(e, data) {
        this.setState({emptyInput: false});
        this.props.handlerForSaveAnswerToParentState('video', data.value, data.id);
    }
    removeAnswer(e, data) {
      let index = data.id;
      this.props.handlerRemoveAnswer('video', index);
    }
    addNewAnswer() {
      if(this.props.videos[this.props.videos.length-1].trim() === '') {
        this.setState({emptyInput: true});
      }
      else{
        this.setState({emptyInput: false});
        this.props.handlerForSaveAnswerToParentState('video', '', this.props.videos.length);
      }
    }
    render() {
      let inputs = this.props.videos.map((input,index)=> {
        console.log(index+'index');
        return (
          <div>
          <TextArea style={{width: '90%', marginBottom: '8px'}} value={input}
            id={index} onChange={this.getInputData} placeholder='enter a video url' autoHeight />
          {this.props.videos.length === 1 ? '' :
          <Button id={index} onClick={this.removeAnswer}
            style={{marginLeft: '2%', backgroundColor: 'white', color: 'red'}}>
            <Icon name='minus' circular/></Button>}
          </div>
        );
      });
        return (
            <div>
              <Form>
                {inputs}
              </Form>
              <Popup offset={10} inverted positioning='left center'
                trigger={<Button onClick={this.addNewAnswer} icon
                  style={{backgroundColor: 'white', color: 'blue', marginLeft: '85%'}}>
                  <Icon name='plus' circular/></Button>} content='Add' size='mini'/>
              {this.state.emptyInput ? <p style={{color: 'red'}}>
                Fill the above input field first</p> : ''}
            </div>
        );
    }
}
