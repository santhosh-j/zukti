import React from 'react';
import { Button, Divider } from 'semantic-ui-react';
export default class CardDisplay extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return(
      <div>
            <h4>
              {this.props.data}
            </h4>
        <Divider/>
  </div>
);
  }

}
