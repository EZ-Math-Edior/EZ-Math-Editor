import React, { Component  }from 'react';
// import '../styles.css';
import '../App.css';

import RichTextEditor from './RichTextEditor';
import Sidebar from './hierarchy/sidebar';
import SidebarItem from './hierarchy/sidebarItem';
import firebase from './firebase';

//wraps rtf such that the button groups are organized by hierarchies
export default class MainEditor extends Component{

	constructor(){
		super();
		this.state = {
			selectedNoteIndex: null,
			selectedNote: null,
			notes: null
		}

	}

	componentDidMount = () => {
		firebase
		.firestore()
		.collection("notes")
		.onSnapshot(su => {
			const notes = su.docs.map(doc => {
				const data = doc.data();
				data['id'] = doc.id;
				return data;
			});
			console.log(notes);
			this.setState({notes: notes});
		});
		
	}

	selectNote = (note, index) => {
		this.setState({selectedNoteIndex : index, selectedNote : note});
	}

	deleteNote = (note) => {

	}

	createNote = () => {

	}

	render(){
		return (
			<div>
				<Sidebar
					selectedNoteIndex = {this.state.selectedNoteIndex}
					notes = {this.state.notes}
					selectNote = {this.selectNote}
					deleteNote = {this.deleteNote}
					createNote = {this.createNote}
				/>
				{this.state.selectedNote ? 
				<RichTextEditor
					selectedNoteIndex={this.state.selectedNoteIndex}
					selectedNote={this.state.selectedNote}
					notes={this.state.notes}/>
				: null
				}
				<div className="btn-group">
				<button onClick = { () => {
						this.props.history.push('/EZ-Math-Tester')
					}}> Switch to Test Mode</button>
				</div>
				

			</div>
		)
	}
}


