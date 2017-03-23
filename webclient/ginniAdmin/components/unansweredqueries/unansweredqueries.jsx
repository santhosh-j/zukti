import React from 'react';
import axios from 'axios';
import {Grid, Icon, Divider, Image} from 'semantic-ui-react';
import {Scrollbars} from 'react-custom-scrollbars';
let query = '';
export default class UnansweredQueries extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          question: '',
          detailNew: []
      };
  }
  componentDidMount() {
      axios({url: 'http://localhost:8080/viewquery', method: 'GET'}).then(function(msg) {
          this.setState({ detailNew: msg.data});
   }.bind(this)).catch(function(err) {
          console.log(err);
      });
  }
     render() {
         var user = this.state.detailNew.map(function(newsdata) {
        return (
          <div>
            <Grid >
                  <Grid.Row vertically>
                     <Grid.Column width={1} />
                        <Grid.Column width={14}>
                        <Grid>
                          <Grid.Column width={2}>
                            <Grid.Row />
                            <Grid.Row />
           <Image size='mini' style={{marginTop: '20%', marginLeft: '35%'}}
       src={require('../../../../webserver/images/defultImage.jpg')}/></Grid.Column>
                          <Grid.Column width={9}>
                            <Grid.Row/>
                            <h4 style={{color: 'blue'}}>{newsdata.username}</h4>
                            <Grid vertically>
                              <Grid.Row columns={2}>
                                <Grid.Column width={1}>
                            <Icon name='help circle' size='large' style={{color: 'red'}}/>
                          </Grid.Column>
                          <Grid.Column width={15}>
                          <h4>{newsdata.question}</h4><br/>
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                            <Grid.Row/>
                          </Grid.Column>
                          <Grid.Column width={5} style={{color: 'green'}}>
                            <Grid.Row/>
                          <h5>Keyword:<h4 style={{color: 'black'}}>{newsdata.keywords}</h4></h5>
                          <h5>Intent:<h4 style={{color: 'black'}}>{newsdata.intents}</h4></h5>
                          <Grid.Row/>
                          </Grid.Column>
                        </Grid>
</Grid.Column>
    </Grid.Row>
      </Grid>
    <Divider/>
    </div>
);
}.bind(this));
return(
<div style={{
    backgroundImage: 'url("../../images/background.jpg")', marginTop: '1%',
    height: '100%'
  }}>
<Grid divided='vertically'>
    <Grid.Row columns={3}>
      <Grid.Column width={1} />
     <Grid.Column width={14}>
        <Scrollbars renderTrackHorizontal={props => <div {...props}
          className="track-horizontal" style={{
            display: 'none',
            position: 'right'
        }}/>} autoHeight autoHeightMin={554}>
            <div style={{width: '98%', height: '50%'}} >
              <h3 style={{color: 'red', fontStyle: 'bold'}}>UNANSWERED QUERIES</h3>
              <Divider/>
                          {user}
             </div></Scrollbars>
                </Grid.Column>
             </Grid.Row>
          </Grid>
</div>
);
}
}
