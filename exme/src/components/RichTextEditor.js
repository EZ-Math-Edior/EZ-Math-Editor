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
			id : '',
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

	componentWillUnmount(){
		this.storeIntoDatabase();
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
		
	publishTest = async () => {
		var title =  prompt("Enter Test Name", "");
		const data = JSON.stringify( this.quill.current.editor.getContents());

		const test = {
			title: title,
			body: data
		};
		const newFromDB = await firebase
				.firestore()
				.collection("tests")
				.add({
					title: test.title,
					body: test.body,
				});
		const newID = newFromDB.id;
		alert("TEST KEY: " + newID);
	}
	

	render() {
		return (
			<div> 
			
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
		
				<div className="btn-group">
					<button onClick={this.generatePDF}>get your pdf</button> 
					<button onClick = { this.publishTest}> Publish Test</button>
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

