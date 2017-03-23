import React from 'react';
import Axios from 'axios';
import {
    Grid,
    Card,
    Feed,
    Statistic
} from 'semantic-ui-react';
import GraphData from './graphData';
let count = 0;
let count1 = 0;
export default class Info extends React.Component {
    constructor() {
        super();
        this.state = {
            name: [],
            email: [],
            detail: ' ',
            userinformation: [],
            countvalue: '0',
            countonline: '0',
            queryCount: 0
        };
    }
    componentDidMount() {
        let self = this;
        count = 0;
        count1 = 0;
        Axios({
          url: 'http://localhost:8080/viewall',
          method: 'GET'})
          .then((response)=> {
            count = response.data.length;
            self.setState({countvalue: count});
        }).catch(function(err) {
            console.log(err);
        });
        Axios({
          url: 'http://localhost:8080/viewallonlineuser', method: 'GET'}).then((response)=> {
              count1 = response.data.length;
            self.setState({countonline: count1});
        }).catch(function(err) {
            console.log(err);
        });

        Axios.get('http://localhost:8080/analytics').
        then((response)=>{
          this.state.queryCount = response.data.queryCount;
          this.setState({queryCount: this.state.queryCount});
        }).
        catch((error)=>{
          console.log(error);
        });
        //
        let socket = io();
        socket.on('incrementQueryCount', (data) => {
          this.state.queryCount = this.state.queryCount + 1;
          this.setState({queryCount: this.state.queryCount});
        });
        socket.on('userLoggedIncount', (data)=>{
          this.state.countonline = this.state.countonline + data.value;
          this.setState({countonline: this.state.countonline});
        })
    }
    render() {
        return (
          <div style={{background:"url('../../images/background.jpg')"}}>
            <Grid style={{
                width: '95%',
                margin: 'auto'
            }}>
                <Grid.Row>
                    <Card.Group className='container' stackable itemsPerRow={3}>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>
                                    Total No Of Users Registered
                                </Card.Header>
                            </Card.Content>
                            <Card.Content>
                                <Feed>
                                    <Feed.Event>
                                        <Feed.Content>
                                            <Feed.Summary>
                                                <Statistic>
                                                    <Statistic.Value>
                                                  <i className="inverted circular teal users icon"/>
                                                    <a>{this.state.countvalue}</a>
                                                    </Statistic.Value>
                                                    <Statistic.Label>Members</Statistic.Label>
                                                </Statistic>
                                            </Feed.Summary>
                                        </Feed.Content>
                                    </Feed.Event>
                                </Feed>
                            </Card.Content>
                        </Card>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>
                                    Number of users online
                                </Card.Header>
                            </Card.Content>
                            <Card.Content>
                                <Feed>
                                    <Feed.Event>
                                        <Feed.Content>
                                            <Feed.Summary>
                                                <Statistic>
                                                    <Statistic.Value>
                                                <i className="inverted circular green users icon"/>
                                                        <a>{this.state.countonline}</a>
                                                    </Statistic.Value>
                                                    <Statistic.Label>Members</Statistic.Label>
                                                </Statistic>
                                            </Feed.Summary>
                                        </Feed.Content>
                                    </Feed.Event>
                                </Feed>
                            </Card.Content>
                        </Card>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>
                                    Number of Queries Asked
                                </Card.Header>
                            </Card.Content>
                            <Card.Content>
                                <Feed>
                                    <Feed.Event>
                                        <Feed.Content>
                                            <Feed.Summary>
                                                <Statistic>
                                                    <Statistic.Value>
                                                <i className="inverted circular red idea icon"/>
                                                        <a>{this.state.queryCount}</a>
                                                    </Statistic.Value>
                                                    <Statistic.Label>Queries</Statistic.Label>
                                                </Statistic>
                                            </Feed.Summary>
                                        </Feed.Content>
                                    </Feed.Event>
                                </Feed>
                            </Card.Content>
                        </Card>
                    </Card.Group>
                </Grid.Row>
                <Grid.Row>
                    <GraphData/>
                </Grid.Row>
            </Grid>
          </div>
        );
    }
}
