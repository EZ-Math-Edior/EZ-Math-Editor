import logo from './logo.svg';
import './App.css';
import React from 'react';
import HideableText from './HideableText';
import TextField from './TextField'
import DraggableField from './DraggableField';
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

class App extends React.Component{
	constructor(props){
		super(props);
		this.lockElement = React.createRef(); //associates a jsx element with the component itself i think? 
											//i.e. we can access a different component's member functions
	}

	sayHello = () => {
		/*var textField = document.getElementById("editor").addEventListener("input", function() {
		})*/
		alert("in button 1");
	}

	lockTextBox = () => { 
		this.lockElement.current.lockReverse();

	};

	render() {
		return (
			<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<p>
				WELCOME TO THE EZ MATH EDITOR!
				<HideableText text = "Bold italiasda underlien"/>

				</p>
				<div id ="editor">
					<p>
						<TextField/> 
					</p>
					<p>
						<DraggableField ref={this.lockElement}/> {/* this is how you associate a jsx element with the createRef in the constructor */}
					</p>

					
				</div>
				<div class="btn-group">
					<button onClick={this.sayHello}>Btn1</button>
					<button onClick={this.lockTextBox}>Lock field</button>
					<button>Btn3</button>
				</div>
				</header>
			</div>
		);
	}
}

export default App;
