import React, { Component  }from 'react';
import '../App.css';
import RichTextEditor from './RichTextEditor';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import DraggableField from './DraggableField'

//wraps rtf such that the button groups are organized by hierarchies
export default class MainEditor extends Component{
	render(){
		return (
			<div>
				<RichTextEditor/>
				<div className="btn-group">
				<button onClick = { () => {
						this.props.history.push('/EZ-Math-Tester')
					}}> Switch to Test Mode</button>
				{/* <button onClick = { () => {
					
				}}> Summon Text Box </button> */}
				</div>
				

			</div>
		)
	}
}


