import React from 'react';

export default class App extends React.Component {
	constructor () {
		super();
	}

	componentDidMount()
	{

	}

	render () {
		return (
			<div>
				{this.props.children}
			</div>
		);
	}
}
// end of class
