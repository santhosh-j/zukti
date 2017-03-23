import React from 'react';
import {Form, Dropdown, Input} from 'semantic-ui-react';

export default class allConcept extends React.Component {
    constructor(props) {
        super(props);
        this.handleConcept = this.handleConcept.bind(this);
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
                          search selection onChange={this.handleConcept} value={this.props.value}/>
                    </Input>
                    <br/>
                </Form.Field>
            </Form>
        );
    }
}
allConcept.propTypes = {
  concepts: React.PropTypes.array,
  handleConcept: React.PropTypes.function,
  value: React.PropTypes.string
};
