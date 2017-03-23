import React from 'react';
import {Form, Dropdown, Input} from 'semantic-ui-react';

export default class IntentDropDown extends React.Component {
    constructor(props) {
        super(props);
        this.handleRelation = this.handleRelation.bind(this);
        this.handleConcept = this.handleConcept.bind(this);
    }
    handleRelation(e, {value}) {
        this.props.handleRelation(value);
    }
    handleConcept(e, {value}) {
        this.props.handleConcept(value);
    }
    render() {
        return (
            <Form>
                <Form.Field >
                  <label>
                      <h4>Existing Concept</h4>
                  </label>
                  <Input>
                      <Dropdown fluid options={this.props.concepts} placeholder='Concept'
                        search selection onChange={this.handleConcept} value={this.props.value2}/>
                  </Input>
                    <label>
                        <h4>Relation</h4>
                    </label>
                    <Input>
                        <Dropdown fluid options={this.props.relations} placeholder='Relation'
                          search selection onChange={this.handleRelation}
                          value={this.props.value1}/>
                    </Input>
                </Form.Field>
            </Form>
        );
    }
}
