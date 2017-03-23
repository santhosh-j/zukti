import React from 'react';
import {Grid, Button} from 'semantic-ui-react';
import './applicationHome.css';
import {hashHistory} from 'react-router';
import LogoutPage from '../Multi_Lingual/Wordings.json';
export default class LogoutFile extends React.Component {
    constructor() {
        super();

        /* @ramvignesh: binding methods to this component */
        this.logIn = this.logIn.bind(this);
        this.signUp = this.signUp.bind(this);
    }
    /* @ramvignesh: redirecting to login page */
    logIn() {
        hashHistory.push('/login');
    }
    /* @ramvignesh: redirecting to signup page */
    signUp() {
        hashHistory.push('/signup');
    }
    render() {
        return (
            <div style={{
                backgroundImage: "url('../../images/intro-bg.gif')",
                width: '100%',
                height: '100%'
            }}>
                <Grid container={'true'} centered={'true'}>
                    <Grid.Row/>
                    <Grid.Row>
                        <Grid.Column width={2}>
                            <h1 id="genie">{LogoutPage.Logout.Heading1}</h1>
                        </Grid.Column>
                        <Grid.Column width={9}/>
                        <Grid.Column width={5}>
                            <h2>
                                {/* @ramvignesh: login button */}
                                <Button onClick={this.logIn} className="buttonlogin" circular style={{
                                    backgroundColor: 'white'
                                }}>
                                    LOGIN
                                </Button>
                                &nbsp;&nbsp;
                                {/* @ramvignesh: signup button */}
                                <Button onClick={this.signUp} className="buttonsignin" circular style={{
                                    backgroundColor: 'white'
                                }}>
                                    SIGNUP
                                </Button>
                            </h2>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row/>
                    <Grid.Row/>
                    <Grid.Row/>
                    <Grid.Row/>
                    <Grid.Row>
                        <Grid.Column style={{
                            textAlign: 'center'
                        }}>
                            <p id='head1'>{LogoutPage.Logout.Heading2}<br/>
                            </p>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row/>
                    <Grid.Row/>
                    <Grid.Row>
                        <h2 style={{
                            color: 'wheat'
                        }}>{LogoutPage.Logout.Heading3}</h2>
                    </Grid.Row>
                    <Grid.Row/>
                    <Grid.Row/>
                    <Grid.Row/>
                    <Grid.Row/>
                    <Grid.Row/>
                    <Grid.Row/>
                    <Grid.Row/>
                    <Grid.Row/>
                    <Grid.Row/>
                    <Grid.Row/>
                    <Grid.Row/>
                    <Grid.Row/>
                </Grid>
                <div style={{
                 position: 'absolute',
                 top: '0px',
                 left: '0px',
                 backgroundRepeat: 'no-repeat',
                 backgroundImage: "url('../../images/logo.gif')",
                 width: '50%',
                 height: '50%',
                 zIndex: 2
             }}></div>
            </div>
        );
    }
}
