import React, { Component  }from 'react';
import '../../App.css';
import { Modifier, EditorState, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import firebase from '../firebase';
import RichTextEditor from '../RichTextEditor';



export default class MultiChoiceSubmitter extends Component{
	constructor(props){
		super(props);

		this.state = {
			Questions : [],
		};
	}

	//adds a question to the question container
	addQuestion = (prompt, choices, answer) => {
		var temp = this.state.Questions;
		var question = {
			prompt : prompt,
			choices : choices,
			answer : answer
		}
		temp.push(question)
		this.setState({
			Questions : temp
		})
	}

	render() {
		return (
			<div>
				<RichTextEditor/>
			</div>
		)
	}


}


