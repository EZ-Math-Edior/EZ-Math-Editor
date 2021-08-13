import React, { useEffect, useState, useRef, useCallback  }from 'react';
import '../App.css';
import { Modifier, EditorState, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import firebase from './firebase';
import "quill/dist/quill.snow.css"
import Quill from "quill"


//read docs for this, gives us everything for the toolbar options (set below)
const TOOLBAR_OPTIONS = [
	[{ header: [1, 2, 3, 4, 5, 6, false] }],
	[{ font: [] }],
	[{ list: "ordered" }, { list: "bullet" }],
	["bold", "italic", "underline"],
	[{ color: [] }, { background: [] }],
	[{ script: "sub" }, { script: "super" }],
	[{ align: [] }],
	["image", "blockquote", "code-block"],
	["clean"],
  ]

export default function RichTextEditor() {

	const [quill, setQuill] = useState()
	
	
	//firebase for backend
	function queryAndLoad () {
		firebase
		.firestore()
		.collection("user_data")
		.where("UID", "==", 1) //todo multi user support
		.get()
		.then((querySnapshot) => {
			//assume UIDs to be unique
			//if querySnapshot isn't empty, then we found the ID
			if(!querySnapshot.empty){ 
				this.loadIntoRTF(querySnapshot.docs[0].data().Data); //get [0] since theres only gonna be one
			}
		})
		.catch((e) => { console.log("error during query and load func")
		});
	}

	//inter-component communication via ref
	//rigged such that pressing button uploads data from firebase into the RTF doc itself
	function loadIntoRTF (data)  {
		console.log(data);
		//if loading overwrites whats on the RTF, alert for now
		// if(data !== this.getPlainText()){

		// 	this.dbToText(data);
		// }
	};

	//saves whatever is in RTF box to database
	function storeIntoDatabase () {
		const plaintext = this.getPlainText();
		firebase.firestore().collection("user_data")
		.where("UID", "==", 1) //todo multi user support
		.get()
		.then((querySnapshot) => {
			//assume UIDs to be unique
			//if querySnapshot isn't empty, then we found the ID
			if(!querySnapshot.empty){ 
				console.log(querySnapshot.docs[0].id);
				firebase.firestore().collection("user_data")
				.doc(querySnapshot.docs[0].id)
				.update({
					Data : plaintext
				})
				.catch((e) => { console.log("error turing update op")});
			}
		})
		.catch((e) => { console.log("error during store func")
		});
		
		alert("Saved to Database");
	}

	//this does some magic honestly
	//https://github.com/portexe/evernote-clone/blob/master/src/helpers.js
	function debounce(a,b,c){
		var d,e;
		return function(){
			function h(){
			d=null;
			c||(e=a.apply(f,g));
			}
			var f=this,g=arguments;
			return (clearTimeout(d),d=setTimeout(h,b),c&&!d&&(e=a.apply(f,g)),e)
		}
	}

	// function removeHTMLTags (str) {
	// 	return str.replace(/<[^>]*>?/gm, '');
	// };

	const update = useCallback(
		debounce(() => {
			console.log('updating database!')
		}, 1500),
		[]
	)

	//detect all text changes via listeners
	//todo: add to presenation - observer pattern
	useEffect(() => {
		//todo - figure out deltas
		const handler = (delta, oldDelta, source) => { 
			if (source !== 'user') return;
			//ass delta here
		}
		quill.on('text-change', handler);

		return () => {
			quill.off('text-change', handler);
		}
	}, [quill]) //only cakk if our quill state changes

	//as soon as div id container returns, it's gonna call useCallback and assign the wrapperRef
	//aka our wrapper input is defined
	const wrapperRef = useCallback((wrapper) => {
		if(wrapper == null) return //if bottom return hasn't shown up yet 
		wrapper.innerHTML = '' //resets our rendered elements
		const editor = document.createElement('div') //create a new div
		wrapper.append(editor); //shove that new stuff into the wrapper
		const q = new Quill(editor, { theme: "snow", modules: { toolbar: TOOLBAR_OPTIONS } }) 
		setQuill(q)
	}, []) 

	return <div className="container" ref= {wrapperRef}> </div>
}



//RTF editor - handles the direct operations per keystroke, as well as loading to and from the RTF doc itself
// export default class RichTextEditor extends Component{
// 	constructor(props){
// 		super(props);

// 		this.state = {
// 			editorState : {},
// 			editorState : EditorState.createEmpty(),
// 		};
// 	}

// 	componentDidMount(){ 
// 		this.queryAndLoad(); //on app start, load data from database
// 	}


// 	dbToText = (data) => {
// 		this.onEditorStateChange(EditorState.createWithContent(ContentState.createFromText(data)));
// 	}

// 	getPlainText = () => {
// 		return this.state.editorState.getCurrentContent().getPlainText();
// 	}


// 	//firebase for backend
// 	queryAndLoad = () => {
// 		firebase.firestore().collection("user_data")
// 		.where("UID", "==", 1) //todo multi user support
// 		.get()
// 		.then((querySnapshot) => {
// 			//assume UIDs to be unique
// 			//if querySnapshot isn't empty, then we found the ID
// 			if(!querySnapshot.empty){ 
// 				this.loadIntoRTF(querySnapshot.docs[0].data().Data); //get [0] since theres only gonna be one
// 			}
// 		})
// 		.catch((e) => { console.log("error during query and load func")
// 		});
// 	}

// 	//inter-component communication via ref
// 	//rigged such that pressing button uploads data from firebase into the RTF doc itself
// 	loadIntoRTF = (data) => {
// 		//if loading overwrites whats on the RTF, alert for now
// 		if(data !== this.getPlainText()){

// 			this.dbToText(data);
// 		}
// 	};

// 	//saves whatever is in RTF box to database
// 	storeIntoDatabase = () => {
// 		const plaintext = this.getPlainText();
// 		firebase.firestore().collection("user_data")
// 		.where("UID", "==", 1) //todo multi user support
// 		.get()
// 		.then((querySnapshot) => {
// 			//assume UIDs to be unique
// 			//if querySnapshot isn't empty, then we found the ID
// 			if(!querySnapshot.empty){ 
// 				console.log(querySnapshot.docs[0].id);
// 				firebase.firestore().collection("user_data")
// 				.doc(querySnapshot.docs[0].id)
// 				.update({
// 					Data : plaintext
// 				})
// 				.catch((e) => { console.log("error turing update op")});
// 			}
// 		})
// 		.catch((e) => { console.log("error during store func")
// 		});
		
// 		alert("Saved to Database");
// 	}

// 	//handles everytime the editor changes (ex. keystrokes)
// 	onEditorStateChange = (editorState) => {
// 		this.setState({editorState: editorState});
// 	}

// 	render(){
// 		return (
// 			<div>
// 				<div id="container">

// 				</div>
// 				{/* <Editor
// 					editorState={this.state.editorState}
// 					onEditorStateChange={this.onEditorStateChange}
// 					wrapperClassName="wrapper-class"
// 					editorClassName="editor-class"
// 					toolbarClassName="toolbar-class"
// 				/> */}
// 				<div class="btn-group">
// 					<button onClick={this.queryAndLoad}>Load from Database to RTF</button>
// 					<button onClick={this.storeIntoDatabase}>Save from RTF into Database</button>
// 					<button onClick={this.generatePDF} type="primary">get your pdf</button>
					
// 				</div>
// 			</div>
// 		)
// 	}
// }


