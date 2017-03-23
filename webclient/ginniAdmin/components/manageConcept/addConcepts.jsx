import React from 'react';
import {Form, Grid, Button, Icon, Divider} from 'semantic-ui-react';
import ConceptDropdown from './conceptDropdown';
import './manageConcept.css';
import Config from '../../../../config/url';
import Axios from 'axios';
import Snackbar from 'material-ui/Snackbar';

export default class AddConcept extends React.Component {
    constructor(props) {
        super(props);
        this.getConcept = this.getConcept.bind(this);
        this.getRelation = this.getRelation.bind(this);
        this.createNewConcept = this.createNewConcept.bind(this);
        this.state = {
            relationValue: '',
            conceptValue: '',
            opensnackbar: false,
            snackbarMsg: '',
            relations: [],
            concepts: [],
            graph: <span></span>
        };
    }
    // @vibakar: bind the dropdown with all concepts and relationships from neo4j databse
    componentDidMount() {
        let url = Config.url + '/concept/rc';
        Axios.get(url).then((response) => {
            let relations = response.data.rc._fields[0];
            let concepts = response.data.rc._fields[1];

            relations.forEach((relation) => {
                this.state.relations.push({text: relation, value: relation});
            });

            concepts.forEach((concept) => {
                this.state.concepts.push({text: concept, value: concept});
            });
        }).catch((error) => {
            console.log(error);
        });
    }
    getConcept(concept) {
        this.setState({conceptValue: concept});
        localStorage.setItem("query", "match (n:concept)-[r]-(m:concept) where n.name = '" + concept + "' return n,r,m");
        let tempUrl  = 'http://192.168.1.55:8081/graphie?concept='+concept;
        this.setState({
            graph: <frameset>
                    <frame src={tempUrl}/>
                </frameset>
        });
    }
    getRelation(relation) {
        this.setState({relationValue: relation});
    }
    handleopen = () => {
        this.setState({open: true});
    }
    handleclose = () => {
        this.setState({open: false});
    }
    handleRequestClose = () => {
        this.setState({opensnackbar: false});
    };
    createNewConcept(e) {
        e.preventDefault();

        // @vibakar: getting the value of new concept from text field
        let newConceptText = this.refs.newConceptText.value;
        let existingConcept = this.state.conceptValue;
        let relation = this.state.relationValue;

        // @vibakar: checking for empty field since empty node is not required
        if (newConceptText && existingConcept && relation) {
            // @vibakar: saving new concept in graph databse
            let url = Config.url + '/concept/createConcept';
            Axios.post(url, {
                newConcept: newConceptText,
                relationship: relation,
                oldConcept: existingConcept
            }).then((response) => {
                console.log(JSON.stringify(response.data));
                if (response.data.saved) {
                    let conceptsCopy = this.state.concepts;
                    conceptsCopy.push({text: newConceptText, value: newConceptText});
                    this.setState({concepts: conceptsCopy});
                }

                // @vibakar: clearing the input fields
                this.refs.newConceptText.value = '';
                this.setState({relationValue: ''});
                this.setState({conceptValue: ''});
                localStorage.setItem("query", "match (n:concept)-[r]-(m:concept) where n.name = '" + existingConcept + "' return n,r,m");
                this.setState({
                  graph: <span></span>
                })
                this.setState({
                    graph: <frameset>
                            <frame src='http://192.168.1.55:8081/graphie'/>
                        </frameset>
                });
            }).catch((error) => {
                console.log(error);
            });
        } else {
            this.setState({opensnackbar: true, snackbarMsg: 'Please fill all the fields'});
        }
    }
    // Adding The New Concept To The Existing Concept @ Deepika
    render() {
        return (
            <div style={{
                backgroundImage: 'url(\'../../images/background.jpg\')',
                height: '100%'
            }}>

                <Grid>
                    <Grid.Column width={1}/>
                    <Grid.Column width={6}>
                        <Grid.Row/>
                        <Grid.Row textAlign='center'>
                            <Grid.Column width={5}>
                                <h4>ADD NEW CONCEPT</h4>
                            </Grid.Column>
                            <Divider/>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={5}/>
                            <Grid.Column width={6}>
              <ConceptDropdown relations={this.state.relations} concepts={this.state.concepts}
                handleRelation={this.getRelation} handleConcept={this.getConcept}
                value1={this.state.relationValue} value2={this.state.conceptValue}/>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={5}/>
                            <Grid.Column width={6}>
                                <Form>
                                    <Form.Field>
                                        <label>
                                            <h4>New Concept Name</h4>
                                        </label>
        <input autoComplete='off' type='text' ref='newConceptText' placeholder='Type Concept Name'/>
                                    </Form.Field>
                                </Form>
                            </Grid.Column>
                        </Grid.Row>
                        <br/>
                        <Grid.Row>
                <Button color="facebook" fluid large onClick={this.createNewConcept}>Add</Button>

                        </Grid.Row>
                        <br/>
                        <Grid.Row/>
                        <Grid.Row>
                            <Grid.Column width={5}/>
                            <Grid.Column width={6}/>
                        </Grid.Row>
                        <Grid.Row/>
                    </Grid.Column>
                    <Grid.Column width={8}>
                        <Grid.Row/> {this.state.graph}
                    </Grid.Column>
                </Grid>
                <Snackbar open={this.state.opensnackbar} message={this.state.snackbarMsg} autoHIdeDuration={400} onRequestClose={this.handleRequestClose}/>
            </div>
        );
    }
}
