import React, { Component  }from 'react';
import '../../App.css';
import { Modifier, EditorState, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

//i converted into a component so we could createRef for inter-component communcation
//effectively does the same thing + more as the previously functional component
export default class RichTextEditor extends Component{
	constructor(props){
		super(props);

		this.state = {
			editorState : {},
			editorState : EditorState.createEmpty(),
		};
	}

	storeIntoRTF = (data) => {
		this.onEditorStateChange(EditorState.createWithContent(ContentState.createFromText(data)));
	}


	//todo
	saveIntoDatabase = () => {
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

// const RichTextEditor = () => {
// 	const [editorState, setEditorState] = useState( () => EditorState.createEmpty(), );


// 	return (
// 		<div>
// 			<Editor
// 				editorState={editorState}
// 				onEditorStateChange={setEditorState}
// 				wrapperClassName="wrapper-class"
// 				editorClassName="editor-class"
// 				toolbarClassName="toolbar-class"
// 			/>
// 		</div>
// 	)
// }

