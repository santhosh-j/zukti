import React from 'react';
import Embedly from 'react-embedly';

export default class UnfurlLink extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return(
      <Embedly url={this.props.url} apiKey="73f538bb83f94560a044bc6f0f33c5f6"/>
    );
  }
}
