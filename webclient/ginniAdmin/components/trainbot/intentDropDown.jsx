import React from 'react';
import {Form, Dropdown, Input} from 'semantic-ui-react';
import Axios from 'axios';
import Config from '../../../../config/url';
export default class IntentDropDown extends React.Component {
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
        let url = Config.url + '/intent/getSameAsIntents?baseIntent=' + value;
        Axios.get(url).then((response) => {
            let sameAsIntents = response.data.sameAsIntents;
            // pass this to trainbot.jsx using function handler passed in props
            this.props.handlerForSameAsIntents(value, sameAsIntents);
        }).catch((error) => {
            console.log(error);
        });
    }

    render() {
        return (
            <Form>
                <Form.Field >
                    <label>
                        <h4>Choose Existing Intent</h4>
                    </label>
                    <Input>
                        <Dropdown fluid options={this.state.options} placeholder='Intent'
                        search selection onChange={this.handleDropdownChange}/>
                    </Input>
                </Form.Field>
            </Form>
        );
    }
}
