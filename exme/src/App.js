import './App.css';
import React, {useEffect } from 'react';
// import HideableText from './HideableText';
import TextField from './TextField'
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
		this.lockElement = React.createRef(); //associates a jsx element with the component itself i think?
											//i.e. we can access a different component's member functions
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
				this.loadDataToState(items[0].Data);
			}
		})
		.catch((e) => { console.log("error getting docs")
		});
	}

	loadDataToState = (qData) => {
		this.setState({data: qData});
	}
	
	returnData = () => {
		return this.state.data;
	}

	lockTextBox = () => {
		this.lockElement.current.lockReverse();

	};
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
				<Route path="/EZ-Math-Editor" component={RichTextEditor} />
				<div class="btn-group">
					<button onClick={this.queryAndLoad}>Btn1</button>
					<button onClick={this.lockTextBox}>Lock field</button>
					<button>Btn3</button>
					<button onClick={this.generatePDF} type="primary">get your pdf</button>
					<h1>{this.returnData()}</h1>
				</div>
				</Router>
			</div>
		);
	}
}

export default App;
