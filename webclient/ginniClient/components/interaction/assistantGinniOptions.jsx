import React from 'react';
import {Feed, Popup, Icon, Label} from 'semantic-ui-react';
import Axios from 'axios';
import Cookie from 'react-cookie';

export default class AssistantGinniOptions extends React.Component {
    constructor(props) {
        super(props);
        // this.saveForReference = this.saveForReference.bind(this);
        this.state = {
            likeEnabled: false,
            dislikeEnabled: false,
            saved: false,
            likeDislikeMsg: ' ',
            email: ''
        };
        this.upvoteAnswer = this.upvoteAnswer.bind(this);
        this.downVoteAnswer = this.downVoteAnswer.bind(this);
        this.savedQuery = this.savedQuery.bind(this);
        this.getSiblings = this.getSiblings.bind(this);
        this.recommend = this.recommend.bind(this);
        this.revertFunction = this.revertFunction.bind(this);
    }

    recommend(recommendations) {
      this.props.onRecommend(recommendations);
    }

    /* @sangeetha: functions to recieve recommendations */
       getSiblings(keywords) {
         console.log(keywords);
         Axios.get('/recommendations/getSiblings', {
           params: {
             keywords: keywords
           }
         }).then((response) => {
           this.recommend(response.data.siblings[0]);
           console.log('recommendation results: ', response.data.siblings[0]);
         }).catch((error) => {
           console.log(error);
         });
       }

    //@sangeetha: passing keywords to fetch sibilings
    upvoteAnswer(type, value) {

          Axios.post('/qa/rateAnswer', {
              action:'liked' ,
              type: this.props.type,
              value: this.props.value,
              email: this.state.email
          }).then((response) => {
              console.log(response);
          }).catch((error) => {
              console.log(error);
          });
          //@Deepika: save the liked response in db
        Axios.post('/question/likeOrDislike',{
          liked: true,
          disliked: false,
          type: this.props.type,
          value: this.props.value
        }).then((response) => {
            console.log("called function successfully");
        }).catch((error) => {
            console.log(error);
        });

        this.setState({likeEnabled: true, dislikeEnabled: false});
        let recm = Cookie.load('recommendations');
        console.log('recm cookie: ', recm);
        if(recm === 'true') {
          this.getSiblings(this.props.keywords);
        }
      console.log('inside ginni option '+ this.props.type+this.props.value);
    }
    downVoteAnswer(type, value) {

          Axios.post('/qa/rateAnswer', {
              action: 'disliked',
              type: this.props.type,
              value: this.props.value,
              email: this.state.email
          }).then((response) => {
              console.log(response);
          }).catch((error) => {
              console.log(error);
          });
      //@Deepika: save the disliked response in db
      Axios.post('/question/likeOrDislike',{
        liked: false,
        disliked: true,
        type: this.props.type,
        value: this.props.value
      }).then((response) => {
          console.log(response);
      }).catch((error) => {
          console.log(error);
      });

      this.setState({dislikeEnabled: true, likeEnabled: false});


    }

    savedQuery(message)
    {
      let question = this.props.question;
      let savedResponse = this.props.value;
      let responseType = this.props.type;
      let date = new Date().toLocaleString();
      Axios.post('/bookmarks',
      {question: question, savedResponse: savedResponse, responseType: responseType, date: date}).
      then((response)=>{
        console.log(response);
      }).
      catch((error)=>{
        console.log(error);
      });
      this.setState({saved: true});
    }
    //@Deepika : response changed to normal mode in neo4j and db
    revertFunction(){

      if(this.state.likeEnabled === true && this.state.dislikeEnabled === false ){
        this.setState({likeEnabled: false, dislikeEnabled: false});
        console.log('like revertFunction entry');
        Axios.post('/qa/rateAnswer', {
            action:'like reverted' ,
            type: this.props.type,
            value: this.props.value,
            email: this.state.email
        }).then((response) => {
            console.log(response);
        }).catch((error) => {
            console.log(error);
        });
        Axios.post('/question/likeOrDislike',{
          liked: false,
          disliked: false,
          type: this.props.type,
          value: this.props.value
        }).then((response) => {
            console.log("called function successfully");
        }).catch((error) => {
            console.log(error);
        });
      }
      if(this.state.likeEnabled === false && this.state.dislikeEnabled === true ){
        this.setState({likeEnabled:false, dislikeEnabled: false});
        console.log('dislike revertFunction entry');
        Axios.post('/qa/rateAnswer', {
            action:'dislike reverted' ,
            type: this.props.type,
            value: this.props.value,
            email: this.state.email
        }).then((response) => {
            console.log(response);
        }).catch((error) => {
            console.log(error);
        });
        Axios.post('/question/likeOrDislike',{
          liked: false,
          disliked: false,
          type: this.props.type,
          value: this.props.value
        }).then((response) => {
            console.log("called function successfully");
        }).catch((error) => {
            console.log(error);
        });
      }
    }
    componentWillMount()
    {
      this.setState({ email: Cookie.load('email')});
      console.log('ginnioption user '+ this.state.email);
      console.log('in ginnioption '+ this.props.likes +' '+this.props.dislikes + typeof(this.props.likes)+ typeof(this.props.dislikes));
      if(this.props.likes == true && this.props.dislikes == false){
          this.setState({likeEnabled: this.props.likes, dislikeEnabled: this.props.dislikes});
          console.log('in ginnioption after will mount '+ this.state.likeEnabled +' '+this.state.dislikeEnabled);
      }
      if(this.props.likes == false && this.props.dislikes == true){
        this.setState({likeEnabled: this.props.likes, dislikeEnabled: this.props.dislikes});
        console.log('in ginnioption after will mount '+ this.state.likeEnabled +' '+this.state.dislikeEnabled);


      }
      if(this.props.likes == false && this.props.dislikes == false){
        this.setState({likeEnabled: this.props.likes, dislikeEnabled: this.props.dislikes});
        console.log('in ginnioption after will mount '+ this.state.likeEnabled +' '+this.state.dislikeEnabled);

      }

    }
    /* @threkashri: edited code for displaying option */
    render() {
        let likeDislikeMsg = this.state.likeDislikeMsg;
        console.log('in ginnioption within render '+ this.state.likeEnabled +' '+this.state.dislikeEnabled);
        return (

            <Feed.Meta>

                {!this.state.saved ? <Popup trigger={< Icon circular name = 'save' color = 'blue'
                   onClick={this.savedQuery} />} content='save this message' size='mini'/> : ''}
                {this.state.saved ? <Label as='a' inverted color='teal' circular>Saved</Label> : ''}
                 {!this.state.likeEnabled  &&  !this.state.dislikeEnabled
                    ? <Popup trigger={< Icon circular name = 'like outline' color = 'blue'
                      onClick = {this.upvoteAnswer
                        } />} content='like' size='mini'/>
                    : ''}
                {!this.state.likeEnabled  && !this.state.dislikeEnabled
                    ? <Popup trigger={< Icon circular name = 'dislike outline'
                       color = 'blue' onClick = {
                            this.downVoteAnswer
                        } />} content='dislike' size='mini'/>
                    : ''}
                    {this.state.likeEnabled  && !this.state.dislikeEnabled
                        ? <Popup trigger={< Icon circular name = 'thumbs up' color = 'green'
                            onClick = {
                                this.revertFunction
                            } />} content='already liked' size='mini'/>
                        : ''}
                        {this.state.likeEnabled  && !this.state.dislikeEnabled
                            ? <Popup trigger={< Icon circular name = 'dislike outline' color = 'blue'
                                onClick = {
                                    this.downVoteAnswer
                                } />} content='dislike' size='mini'/>
                            : ''}
                      {!this.state.likeEnabled  && this.state.dislikeEnabled
                                    ? <Popup trigger={< Icon circular name = 'like outline' color = 'blue'
                                        onClick = {
                                            this.upvoteAnswer
                                        } />} content='like' size='mini'/>
                                    : ''}
                    {!this.state.likeEnabled  && this.state.dislikeEnabled
                            ? <Popup trigger={< Icon circular name = 'thumbs down' color = 'red'
                                onClick = {
                                    this.revertFunction
                                } />} content='already disliked' size='mini'/>
                            : ''}

            </Feed.Meta>
        );
    }
}
