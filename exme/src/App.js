import logo from './logo.svg';
import './App.css';

/****************************************
* TODO:
*	Stop editable text box from infinitely resizing
*	// Add text enhancement options...? (bold, italics, color, etc.)
*	UI design (where to put text box, how big is its max, default size, etc.)
*	how to handle math symbols, equations, etc.
*	text alignment justification
*	buttons/dropdown of options to do the above things
*
*
****************************************/

function DoSomething(){
	var hideField = document.getElementById("textSpan").value;
	console.log(hideField);
	document.execCommand('bold', true, hideField)
}


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          WELCOME TO THE EZ MATH EDITOR!
          Here is the line. Below should be a box to put text in..
          Edit <code>src/App.js</code> and save to reload.
        </p>
		<div contenteditable="true" id ="textSpan">
  		This text can be edited by the user.
		</div>
		<div class="btn-group">
		<button onClick = {() => DoSomething()}>
			Btn1
		</button>
		<button onClick = {() => DoSomething()}>Btn2</button>
		<button>Btn3</button>
		</div>
		</header>
		</div>
  );
}

export default App;
