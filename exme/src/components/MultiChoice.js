import React, { Component  }from 'react';
import '../App.css';
import { Modifier, EditorState, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Router } from 'react-router-dom';

//i converted into a component so we can use createRef
//effectively does the same thing + more as the previously functional component
//save functionality is a todo, but seems simple enough

export default class MultiChoice extends Component{
	constructor(props){
		super(props);

		this.state = {
			editorState : {},
			editorState : EditorState.createEmpty(),
		};
	}


	render(){
		return (
			<div class = "parentMCQ">
				Testing
				{/* <Router>
					<Route path="/EZ-Math-Tester"/>
					MAGIC
					<div class = "btns">
						<Button> return to normal mode </Button>
					</div>
				</Router> */}
				<div class="btn-group">
					<button> Create Test </button>
					<button> Load Test</button>
					<button onClick = { () => {
						this.props.history.push('/EZ-Math-Editor')
					}}> Switch to Editor Mode</button>

				</div>
			</div>

		)
	}
}


