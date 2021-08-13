import React, { useEffect, useState, useRef, useCallback  }from 'react';
import '../App.css';
import { Modifier, EditorState, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import firebase from './firebase';
import "quill/dist/quill.snow.css"
import Quill, { Delta } from "quill"


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
				// console.log(querySnapshot.docs[0].data().Data)
				loadIntoRTF(querySnapshot.docs[0].data().Data); //get [0] since theres only gonna be one
			}
		})
		.catch((e) => { console.log("error during query and load func")
		});
	}

	//inter-component communication via ref
	//rigged such that pressing button uploads data from firebase into the RTF doc itself
	function loadIntoRTF (data)  {
		// console.log(data);
		quill.setContents(JSON.parse(data));
		//if loading overwrites whats on the RTF, alert for now
		// if(data !== this.getPlainText()){
			// console.log(123);

		// 	this.dbToText(data);
		// }
	};

	//saves whatever is in RTF box to database
	function storeIntoDatabase () {
		const data = JSON.stringify(quill.getContents());
		console.log(data);

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
					Data : data
				})
				.catch((e) => { console.log("error turing update op")});
			}
		})
		.catch((e) => { console.log("error during store func")
		});
		
		// alert("Saved to Database");
	}

	// useEffect(() => {
	// }, []);

	//detect all text changes via listeners
	//todo: add to presenation - observer pattern
	//for now, not used
	useEffect(() => {
		if ( quill == null) return

		//todo - figure out deltas
		const handler = (delta, oldDelta, source) => { 
			if (source !== 'user') return;
			console.log(delta);
			storeIntoDatabase();
			// changes = changes.compose(delta);
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
	queryAndLoad(); //so the set state has time to finish (setQuill op)


	return (
		<div> 
			<div className="container" ref= {wrapperRef}> </div>

			<div className="btn-group">
				<button onClick={queryAndLoad}>Load from Database to RTF</button>
				<button onClick={storeIntoDatabase}>Save from RTF into Database</button>
				{/* <button onClick={this.generatePDF} type="primary">get your pdf</button> */}
				
			</div>
		</div>
	)
}


