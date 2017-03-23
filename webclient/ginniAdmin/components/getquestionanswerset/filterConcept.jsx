import React from 'react';
import {Form, Dropdown, Input} from 'semantic-ui-react';
import Axios from 'axios';
import Config from '../../../../config/url';
import './questionanswer.css';
export default class FilterConcept extends React.Component {
    constructor(props) {
        super(props);
        this.handleDropdownChange = this.handleDropdownChange.bind(this);
        this.state = {
            options: []
        };
    }
    // show the dropdown with concepts from neo4j databse
    componentDidMount() {
        let url = Config.url + '/concept';
        Axios.get(url).then((response) => {
            let concepts = response.data.concepts;
            concepts.forEach((concepts) => {
                this.state.options.push({text: concepts, value: concepts});
            });
        }).catch((error) => {
            console.log(error);
        });
    }
    // function to handle dropdown change
    handleDropdownChange(e, {value}) {
      this.props.concept(value);
    }

    render() {
        return (
            <Form>
                <Form.Field >
                    <label>
                        <h4 id="dropdown">Choose Concept</h4>
                    </label>
                    <Input>
                        <Dropdown options={this.state.options} placeholder='Concept'
                        search selection onChange={this.handleDropdownChange}/>
                    </Input>
                </Form.Field>
            </Form>
        );
    }
}
