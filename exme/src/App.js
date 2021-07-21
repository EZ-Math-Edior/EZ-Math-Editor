import './App.css';
import React, {useEffect } from 'react';
// import HideableText from './HideableText';
// import TextField from './TextField'
import DraggableField from './DraggableField';
import jsPDF from 'jspdf';
import Home from './server/routes/Home';
import RichTextEditor from './server/routes/RichTextEditor';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import firebase from './firebase';
/****************************************
* TODO:
*	Stop editable text box from infinitely resizing
*	// Add text enhancement options...? (bold, italics, color, etc.)
*	UI design (where to put text box, how big is its max, default size, etc.)
*	how to handle math symbols, equations, etc.
*	text alignment justification
*	buttons/dropdown of options to do the above things
*	For editable text field to show up the <div> </div> must be nested in <header> </header>
*
* change state of child from parent (aka app) https://www.freecodecamp.org/news/react-changing-state-of-child-component-from-parent-8ab547436271/
****************************************/

class App extends React.PureComponent{
	constructor(props){
		super(props);		
		this.rtfRef = React.createRef();
		this.state = {
			data : ""
		};
		// console.log(this.state.qData);
	}

	//on app start, load data from database
	componentDidMount(){ 
		this.queryAndLoad();
	}

	//technically i should separate query and loading into state, but idk how
	//anyways, this queries the database, and then whatever comes out goes into the app's state
	//then it shoves said data into the RTF itself
	queryAndLoad = () => {
		firebase.firestore().collection("user_data")
		.where("UID", "==", 1)
		.get()
		.then((querySnapshot) => {
			const items = [];
			querySnapshot.forEach((doc) => {
				items.push(doc.data());
			});
			if(!querySnapshot.empty){
				this.setDataState(items[0].Data);
				this.storeIntoRTF();
			}
		})
		.catch((e) => { console.log("error during query and load func")
		});
	}

	setDataState = (qData) => {
		this.setState({data: qData});
	}

	//inter-component communication via ref
	storeIntoRTF = () => {
		this.rtfRef.current.storeIntoRTF(this.state.data);
	};

	returnData = () => {
		return this.state.data;
	}


	// generate pdf function
	generatePDF = () => {
		// new doc variable
		var doc = new jsPDF('l', 'pt', [window.innerWidth, window.innerHeight]);
		doc.html(document.querySelector("#content"), {
			callback: function(pdf) {
				pdf.save("yourPDF.pdf");
			}
		}
		);
	}

	

	
	render() {
		return (
			<div id = "content"> {/* Note div id and div class are not the same. div id should be unique to each .js file and div class can be reused to apply the same css style */}
				<Router>
				<Home />
				<Route 
					path="/EZ-Math-Editor" 
					render={() => (
						<RichTextEditor ref = {this.rtfRef} /> //use render rather than component to get ref, source: https://ui.dev/react-router-v4-pass-props-to-components/
					)}
					 />
				<div class="btn-group">
					<button onClick={this.queryAndLoad}>Load from Database to RTF</button>
					{/* <button onClick={this.saveIntoDatabase}>Store into Database</button> */}
					<button onClick={this.generatePDF} type="primary">get your pdf</button>
					<h1>{this.returnData()}</h1>
				</div>
				</Router>
			</div>
		);
	}
}

export default App;
