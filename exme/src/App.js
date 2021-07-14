import './App.css';
import React from 'react';
import HideableText from './HideableText';
import TextField from './TextField'
import DraggableField from './DraggableField';
import jsPDF from 'jspdf';
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
		this.state = {}
	}

	sayHello = () => {
		/*var textField = document.getElementById("editor").addEventListener("input", function() {
		})*/
		alert("in button 1");
	}

	lockTextBox = () => {
		this.lockElement.current.lockReverse();

	};
	// generate pdf function
	generatePDF = () => {
		// new doc variable
		var doc = new jsPDF('p', 'pt', 'a4');
		doc.html(document.querySelector("#editor"), {
			callback: function(pdf) {
				pdf.save("yourPDF.pdf");
			}
		}
	);
	}

	render() {
		return (
			<div className="App">
				<header className="App-header">
					<h1> {/* Note according to HTML conventions h1 is the most important header */}
					WELCOME TO THE EZ MATH EDITOR!
					</h1>
					<div id ="editor"> {/* Note div id and div class are not the same. div id should be unique to each .js file and div class can be reused to apply the same css style */}
						<p><TextField></TextField></p>
						<DraggableField ref={this.lockElement}/> {/* this is how you associate a jsx element with the createRef in the constructor */}
					</div>
					<div class="btn-group">
						<button onClick={this.sayHello}>Btn1</button>
						<button onClick={this.lockTextBox}>Lock field</button>
						<button>Btn3</button>
						<button onClick={this.generatePDF} type="primary">get your pdf</button>
					</div>
				</header>
			</div>
		);
	}
}

export default App;
