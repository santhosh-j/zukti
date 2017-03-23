import React from 'react';

import Sample from '../../components/sample';

// This is a view layout, hence avoid putting any business logic
export default class Home extends React.Component {
	render () {
		return <Sample message='React Sample'/>;
	}
}
