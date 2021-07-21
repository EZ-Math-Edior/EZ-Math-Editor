import './App.css';
import React from 'react';
// import HideableText from './HideableText';
import TextField from './TextField'
import DraggableField from './DraggableField';
import jsPDF from 'jspdf';
import Home from './server/routes/Home';
import RichTextEditor from './server/routes/RichTextEditor';
import {BrowserRouter as Router, Route} from 'react-router-dom';

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
		this.lockElement = React.createRef(); //associates a jsx element with the component itself i think?
											//i.e. we can access a different component's member functions
		this.state = {}
	}

	sayHello = () => {
		/*var textField = document.getElementById("editor").addEventListener("input", function() {
		})*/

		alert(window.innerHeight + " " + window.innerWidth);
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
				<Route path="/EZ-Math-Editor" component={RichTextEditor} />
				<div class="btn-group">
					<button onClick={this.sayHello}>Btn1</button>
					<button onClick={this.lockTextBox}>Lock field</button>
					<button>Btn3</button>
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
