import React from 'react';

export default class TextField extends React.Component {
	render() {
		return (
		<div contenteditable="true" id = "textField">	
			This text can be edited by the user.
		</div>
		);
	}
}