import React, { Component  }from 'react';
import '../App.css';
import RichTextEditor from './RichTextEditor';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

//wraps rtf for organization purposes
export default class MainEditor extends Component{
	render(){
		return (
			<div>
				<RichTextEditor/>
				<div class="btn-group">
				<button onClick = { () => {
						this.props.history.push('/EZ-Math-Tester')
					}}> Switch to Test Mode</button>
				</div>

			</div>
		)
	}
}


