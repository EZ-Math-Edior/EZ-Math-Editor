import React, { Component  }from 'react';
import '../../App.css';
import { Modifier, EditorState, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

//i converted into a component so we can use createRef
//effectively does the same thing + more as the previously functional component
//save functionality is a todo, but seems simple enough

export default class RichTextEditor extends Component{
	constructor(props){
		super(props);

		this.state = {
			editorState : {},
			editorState : EditorState.createEmpty(),
		};
	}

	dbToText = (data) => {
		this.onEditorStateChange(EditorState.createWithContent(ContentState.createFromText(data)));
	}


	//todo
	getPlainText = () => {
		return this.state.editorState.getCurrentContent().getPlainText();
	}
	textToDb = () => {
		// console.log("saving into database...");
		// console.log(this.state.editorState.getCurrentContent().getPlainText());

	}
	
	onEditorStateChange = (editorState) => {
		this.setState({editorState: editorState});
	}

	render(){
		return (
			<div>
				<Editor
					editorState={this.state.editorState}
					onEditorStateChange={this.onEditorStateChange}
					wrapperClassName="wrapper-class"
					editorClassName="editor-class"
					toolbarClassName="toolbar-class"
				/>
			</div>
		)
	}
}


