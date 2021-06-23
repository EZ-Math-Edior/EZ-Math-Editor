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
****************************************/
function sayHello()
{
	/*var textField = document.getElementById("editor").addEventListener("input", function() {
		
	})*/
	alert("in button 1");
}

const textField1 = <TextField/> 
const draggableField1 = <DraggableField/>

function App() {
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
				{textField1}
			</p>
			<p>
				{draggableField1}
			</p>

			
		</div>
		<div class="btn-group">
			<button onClick={sayHello}>Btn1</button>
			<button>Btn2</button>
			<button>Btn3</button>
		</div>
		</header>
	</div>
  );
}

export default App;
