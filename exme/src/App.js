import './App.css';
import React from 'react';
// import HideableText from './HideableText';
// import TextField from './TextField'
import jsPDF from 'jspdf';
import Banner from './components/Banner';
import MultiChoice from './components/MultiChoice';
import MainEditor from './components/MainEditor';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import MathJax from 'react-mathjax';

/****************************************
The entry point of our application
Components and sections of our design are separated through the react-router-dom
****************************************/


var tex = ""

class App extends React.PureComponent{
	constructor(props){
		super(props);		
		
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
	
	// Convert text to latex
	//this belongs in its own class
	latexify = () => {
		//get the input
		var myInput = document.getElementById("latex");
		//update
		tex = myInput.value;
		myInput.value = "";
		this.forceUpdate();
	}
		

	render() {
		return (
			
			<div id = "content"> {/* Note div id and div class are not the same. div id should be unique to each .js file and div class can be reused to apply the same css style */}
				<Router>
				<Banner />
				<Switch>
					<Route path="/EZ-Math-Editor" component = {MainEditor} />
					<Route path="/EZ-Math-Tester" component = {MultiChoice} />
				</Switch>
				<div className="latex-group">
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
