import React from 'react';
import {
    Feed,
    Button,
    Label,
    Popup,
    Modal,
    Header,
    Icon
} from 'semantic-ui-react';
import Cookie from 'react-cookie';
import CodeAssistant from '../../../Multi_Lingual/Wordings.json';
export default class AssistantView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            siblingsArray: [],
            msg: '',
            open: true,
            flag: false
        };
        /* @Sangeetha: binding methods to this component */
        this.moreFunction = this.moreFunction.bind(this);
        this.setSiblingArray = this.setSiblingArray.bind(this);
        this.discardRecommend = this.discardRecommend.bind(this);
        this.continueRecommend = this.continueRecommend.bind(this);
        this.recommendationFunction = this.recommendationFunction.bind(this);
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
    }
    close()
    {
        this.setState({open: false, flag: false});
    }

    open()
    {
        this.setState({open: true});
    }

    componentDidMount()
    {
        this.setSiblingArray();
    }

    recommendationFunction()
    {
        this.setState({flag: true});
    }

    setSiblingArray()
    {
        let keywords = this.props.value;
        let keyArray = keywords.split(',');
        let sibling = [];
        let capArray = [];
        for(let j = 0; j < keyArray.length; j = j + 1)
        {
          capArray[j] = keyArray[j].charAt(0).toUpperCase() + keyArray[j].slice(1);
        }
        if (capArray.length > 3) {
            for (let i = 0; i < 3; i = i + 1) {
                sibling.push(capArray[i], ', ');
            }
            this.setState({siblingsArray: sibling, msg: '(more...)'});
        } else {
            this.setState({siblingsArray: keywords});
        }
    }

    moreFunction()
    {
        let keywords = this.props.value;
        let keyArray = keywords.split(',');
        let sibling = [];
        let capArray = [];
        for(let j = 0; j < keyArray.length; j = j + 1)
        {
          capArray[j] = keyArray[j].charAt(0).toUpperCase() + keyArray[j].slice(1);
        }
        for (let i = 0; i < capArray.length; i = i + 1) {
            if (capArray.length === i + 1) {
                sibling.push(capArray[i]);
            } else {
                sibling.push(capArray[i], ', ');
            }
        }

        this.setState({siblingsArray: sibling, msg: ''});
    }

    continueRecommend()
    {
        Cookie.save('recommendations', true);
        this.close();
    }

    discardRecommend()
    {
        Cookie.save('recommendations', false);
        this.close();
    }

    render()
    {
        const {open, active} = this.state;
        if (!this.state.flag) {
            return (
                <Feed id='assistantView'>
                    <Feed.Event>
                        <Feed.Content id='assistantViewGenni'>
                            <Feed.Summary>
                                <p style={{
                                    color: 'red'
                                }}>You can also read about :</p>
                                <ul>
                                    {this.state.siblingsArray}
                                    <a onClick={this.moreFunction}>{' '}{this.state.msg}{' '}
                                    </a>
                                </ul>
                                <a onClick ={this.recommendationFunction}>
                                    Turn Off Recommendations
                                </a>
                            </Feed.Summary>
                        </Feed.Content>
                    </Feed.Event>
                </Feed>
            );
        }

        if (this.state.flag) {
            return (
                <Modal open={this.open} close={this.close}>
                    <Header icon='alarm' content='Turn Off Recommendations'/>
                    <Modal.Content>
                        <p>Would you like to Turn Off Recommendations</p>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={this.continueRecommend} color='red'>
                            <Icon name='remove'/>
                            No
                        </Button>
                        <Button onClick={this.discardRecommend} color='green'>
                            <Icon name='checkmark'/>
                            Yes
                        </Button>
                    </Modal.Actions>
                </Modal>

            );
        }
    }
}
