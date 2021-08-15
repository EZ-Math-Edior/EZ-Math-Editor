import './App.css';
import React from 'react';
import Banner from './components/Banner';
import MultiChoice from './components/MultiChoice';
import MainEditor from './components/MainEditor';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

/****************************************
The entry point of our application
Components and sections of our design are separated through the react-router-dom
****************************************/


var tex = ""

class App extends React.PureComponent{







	render() {
		return (
			
			<div id = "content"> {/* Note div id and div class are not the same. div id should be unique to each .js file and div class can be reused to apply the same css style */}
				<Router>
				<Banner />
				<Switch>
					<Route path="/EZ-Math-Editor" component = {MainEditor} />
					<Route path="/EZ-Math-Tester" component = {MultiChoice} />
				</Switch>		
				</Router>
			</div>
		);
	}
}

export default App;
