import React from 'react';
export default class App1 extends React.Component {
	constructor () {
		super();
	}
		render () {
		return (
			<div>
				{this.props.children}
			</div>
		);
	}
}
/* end of class*/
