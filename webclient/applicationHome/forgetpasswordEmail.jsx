import React from 'react';
import {Grid, Button} from 'semantic-ui-react';
import './applicationHome.css';
import ForgetPasswordEmail from '../Multi_Lingual/Wordings.json';
export default class ForgetpasswordEmail extends React.Component {
    constructor() {
        super();
    }
    render() {
        return (
            <div style={{
                backgroundImage: "url('../../images/homes.jpg')"
            }}>
                <Grid container={'true'} centered={'true'}>
                    <Grid.Row/>
                    <Grid.Row>
                        <Grid.Column width={2}>
                            <h1 id="genie">{ForgetPasswordEmail.ForgetPasswordemail.Heading1}</h1>
                        </Grid.Column>
                        <Grid.Column width={9}/>
                        <Grid.Column width={5}>
                            <h2>
                                <Button className="buttonlogin" circular style={{
                                    backgroundColor: 'white'
                                }}>
                                    <a href="#/login" id="head" style={{
                                        color: 'black'
                                    }}>LOGIN</a>
                                </Button>
                                &nbsp;&nbsp;<Button className="buttonsignin" circular style={{
                backgroundColor: 'white'
            }}>
                                    <a href="#/signup" id="head" style={{
                                        color: 'black'
                                    }}>SIGNUP</a>
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
                            <p id='head1'>{ForgetPasswordEmail.ForgetPasswordemail.Heading2}<br/>
                                <h3 id='head4'>{ForgetPasswordEmail.ForgetPasswordemail.Heading3}</h3>
                                <h1 id='head4'>{ForgetPasswordEmail.ForgetPasswordemail.Heading4}</h1>
                            </p>
                        </Grid.Column>
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
                    <Grid.Row/>
                    <Grid.Row/>
                    <Grid.Row/>
                </Grid>
            </div>
        );
    }
}
