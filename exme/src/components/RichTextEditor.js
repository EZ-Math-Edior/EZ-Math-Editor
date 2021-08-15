import React, { useEffect, useState, useRef, useCallback  }from 'react';
import '../App.css';
import { saveAs } from 'file-saver';
import { pdfExporter } from 'quill-to-pdf';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import firebase from './firebase';
import "quill/dist/quill.snow.css"
import Quill from "quill"
import ReactQuill from 'react-quill';
import katex from "katex";

import "katex/dist/katex.css";

import "./jquery";
import "mathquill/build/mathquill.js";
import "mathquill/build/mathquill.css";

import mathquill4quill from "mathquill4quill";
import "mathquill4quill/mathquill4quill.css";
import { ContactlessOutlined } from '@material-ui/icons';
window.katex = katex;

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
	['formula'],
	["clean"],
  ]

export default class RichTextEditor extends React.Component {

	constructor(props){
		super(props);
		this.quill = React.createRef();

		this.state = {
			id : ''
		}
	}

	componentDidMount(){
		const enableMathQuillFormulaAuthoring = mathquill4quill({ Quill, katex });
		enableMathQuillFormulaAuthoring(
		  this.quill.current.editor,
		  this.props.options
		);
		this.setState({
			id : this.props.selectedNote.id
		}, () => { this.queryAndLoad() } )
		
	}

	componentDidUpdate(){
		if(this.props.selectedNote.id !== this.state.id){
			console.log("switching note");
			this.setState({
				id : this.props.selectedNote.id
			}, () => { this.queryAndLoad() } )
			
		}
	}


	//firebase for backend
	queryAndLoad = () => {
		console.log(this.props.selectedNote.id);
		firebase
			.firestore()
			.collection("notes")
			.doc(this.props.selectedNote.id)
			.get()
			.then((doc) => {
				if(doc.exists){
				this.loadIntoRTF(doc.data().body); //get [0] since theres only gonna be one
					
				} else{
					console.log("no data found");
				}
			})
			.catch((e) => { console.log("error during query and load func")
			});

	}
	

	//inter-component communication via ref
	//rigged such that pressing button uploads data from firebase into the RTF doc itself
	loadIntoRTF = (data) => {
		console.log(data);
		this.quill.current.editor.setContents(JSON.parse(data));
	}

	//saves whatever is in RTF box to database
	storeIntoDatabase = () => {
		const data = JSON.stringify( this.quill.current.editor.getContents());
		// console.log(data);
		firebase
		.firestore()
		.collection("notes")
		.doc(this.props.selectedNote.id)
		.update({
			body : data
		}).catch((e) => { console.log("error turing update op")});

	}


	generatePDF = async () => {
		const delta = this.quill.current.editor.getContents(); // gets the Quill delta
		const pdfAsBlob = await pdfExporter.generatePdf(delta); // converts to PDF
		saveAs(pdfAsBlob, 'pdf-export.pdf'); // downloads from the browser
	}

	//extremely inneficient - saves at every change
	onEditorUpdate = debounce( () => {
		console.log("saved");
		this.storeIntoDatabase();
	}, 1500);
		
	

	render() {
		return (
			<div> 
				<div className="container"> 
					<ReactQuill
						ref = {this.quill}
						id="editor"
						modules={{
							formula: true,
							toolbar: TOOLBAR_OPTIONS
						}}
						theme="snow"
						onChange={this.onEditorUpdate}
					/>
				</div>

				<div className="btn-group">
					<button onClick={this.queryAndLoad}>Load from Database to RTF</button>
					<button onClick={this.storeIntoDatabase}>Save from RTF into Database</button>
					{/* <button onClick={wipeData}>Wipe Data</button> */}
					<button onClick={this.generatePDF}>get your pdf</button> 
					
				</div>
			</div>
		)
	}
}

	//https://github.com/portexe/evernote-clone/blob/master/src/helpers.js
	export function debounce (a,b,c) { //cancels a function everytime deboucne is called, until a window of time is long enough
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

  /*
export default function RichTextEditor() {

	const [quill, setQuill] = useState(null)
	const [loaded, setLoaded] = useState(false)

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
		console.log(data);
		
		quill.setContents(JSON.parse(data));
		//if loading overwrites whats on the RTF, alert for now
		// if(data !== this.getPlainText()){
			// console.log(123);
		// 	this.dbToText(data);
		// }
	};

	function wipeData () {

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
					Data : "test"
				})
				.catch((e) => { console.log("error turing update op")});
			}
		})
		.catch((e) => { console.log("error during store func")
		});

		window.location.reload();

	}

	//saves whatever is in RTF box to database
	function storeIntoDatabase () {
		const data = JSON.stringify(quill.getContents());
		// console.log(data);

		firebase.firestore().collection("user_data")
		.where("UID", "==", 1) //todo multi user support
		.get()
		.then((querySnapshot) => {
			//assume UIDs to be unique
			//if querySnapshot isn't empty, then we found the ID
			if(!querySnapshot.empty){ 
				// console.log(querySnapshot.docs[0].id);
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

	async function generatePDF ()  {
		const delta = quill.getContents(); // gets the Quill delta
		const pdfAsBlob = await pdfExporter.generatePdf(delta); // converts to PDF
		saveAs(pdfAsBlob, 'pdf-export.pdf'); // downloads from the browser
	}

	//detect all changes to quill var via listeners
	//todo: add to presenation - observer pattern
	//for now, not used
	useEffect(() => {
		if ( quill == null) return

		//todo - figure out deltas
		const handler = (delta, oldDelta, source) => { 
			if (source !== 'user') return;
			// console.log(delta);
			storeIntoDatabase();
			// changes = changes.compose(delta);
		}
		quill.on('text-change', handler);
	
		return () => {
			quill.off('text-change', handler);
		}
	}, [quill]) //only cakk if our quill state changes
	

	// function asdf(q){
	// 	setQuill(q)
	// 	setLoaded(true)
	// 	while(quill === null && loaded === false){
	// 		console.log("idk");
	// 	}
		
	// 	queryAndLoad()
	// }

	//our on component mount
	//as soon as div id container returns, it's gonna call useCallback and assign the wrapperRef
	//aka our wrapper input is defined
	const wrapperRef = useCallback((wrapper) => {
		if(wrapper == null) return //if bottom return hasn't shown up yet 
		wrapper.innerHTML = '' //resets our rendered elements
		const editor = document.createElement('div') //create a new div
		wrapper.append(editor); //shove that new stuff into the wrapper
		const q = new Quill(editor, { theme: "snow", formula: true, modules: { toolbar: TOOLBAR_OPTIONS } }) 
		setQuill(q)
		
		console.log("rtf mounted")
	}, []) 
	queryAndLoad();
	
	// useEffect( () => {
	// 	queryAndLoad()
	// }, [])

	 //so the set state has time to finish (setQuill op)
	// var enableMathQuillFormulaAuthoring = mathquill4quill();
	// enableMathQuillFormulaAuthoring(quill);

	return (
		<div> 
			<div className="container" ref= {wrapperRef}> </div>

			<div className="btn-group">
				<button onClick={queryAndLoad}>Load from Database to RTF</button>
				<button onClick={storeIntoDatabase}>Save from RTF into Database</button>
				<button onClick={wipeData}>Wipe Data</button>
				<button onClick={generatePDF}>get your pdf</button>
				
			</div>
		</div>
	)
}

 */
