import React from 'react';
import {Form, Dropdown, Input} from 'semantic-ui-react';
import Axios from 'axios';
import Config from '../../../../config/url';
import './questionanswer.css';
export default class FilterData extends React.Component {
    constructor(props) {
        super(props);
        this.handleDropdownChange = this.handleDropdownChange.bind(this);
        this.state = {
            options: []
        };
    }
    // bind the dropdown with base intents from neo4j databse
    componentDidMount() {
        let url = Config.url + '/intent/baseIntents';
        Axios.get(url).then((response) => {
            let baseIntents = response.data.baseIntents;
            baseIntents.forEach((baseIntent) => {
                this.state.options.push({text: baseIntent, value: baseIntent});
            });
        }).catch((error) => {
            console.log(error);
        });
    }
    // function to handle dropdown change
    handleDropdownChange(e, {value}) {
      console.log(value);
      this.props.intent(value);
    }

    render() {
        return (

            <Form>
                <Form.Field >
                    <label>
                        <h4 id="dropdown">Choose Intent</h4>
                    </label>
                    <Input>
                        <Dropdown options={this.state.options} placeholder='Intent'
                        search selection onChange={this.handleDropdownChange}/>
                    </Input>
                </Form.Field>
            </Form>

        );
    }
}
