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

import MathJax from 'react-mathjax';

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


var tex = ""

class App extends React.PureComponent{
	constructor(props){
		super(props);		
		this.rtfRef = React.createRef(); //to communicate via app buttons
		
	}

	componentDidMount(){ 
		this.queryAndLoad(); //on app start, load data from database
	}

	//technically i should separate query and loading into the RTF doc, but idk how
	//anyways, this queries the database, and then whatever comes out goes into the app's state
	//then it shoves said data into the RTF itself
	
	//also, partly cause this is a mockup/laziness I used firebase for backend since its super easy to set up. I currently created my own firebase to test and i'll add you guys via email
	queryAndLoad = () => {
		firebase.firestore().collection("user_data")
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
	//rigged such that pressing button uploads stuff from firebase into the RTF doc itself
	loadIntoRTF = (data) => {
		//if loading overwrites whats on the RTF, alert for now
		if(data !== this.rtfRef.current.getPlainText()){

			this.rtfRef.current.dbToText(data);
		}
	};

	//i deem below spaghetti
	//saves whatever in RTF box to database
	storeIntoDatabase = () => {
		const plaintext = this.rtfRef.current.getPlainText();
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
				 //get [0] since theres only gonna be one
			}
		})
		.catch((e) => { console.log("error during store func")
		});
		
		alert("Saved to Database");
	}

	// returnData = () => {
	// 	return this.state.data;
	// }

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

	// Convert text to latex
	latexify = () => {
		//get the input
		var myInput = document.getElementById("latex");
		//update
		tex = tex+myInput.value+" ";
		myInput.value = "";
		this.forceUpdate();
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
					<button onClick={this.storeIntoDatabase}>Save from RTF into Database</button>
					<button onClick={this.generatePDF} type="primary">get your pdf</button>
				</div>
				<div class="latex-group">
					<label><br /><br /><br />Enter text to convert to LaTeX formula<br /></label>
					<input type="text" name="latex" id="latex"/>
					<button onClick={this.latexify}>Convert</button>
					<br /><MathJax.Provider>
					<output name="latexOut" id="latexOut">
						<MathJax.Node inline formula={tex} />
					</output>
					</MathJax.Provider>
				</div>
				
				
				</Router>
			</div>
		);
	}
}

export default App;
