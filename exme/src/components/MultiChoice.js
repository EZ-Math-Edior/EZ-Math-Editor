import React, { Component  }from 'react';
import '../App.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import firebase from './firebase';


//i converted into a component so we can use createRef
//effectively does the same thing + more as the previously functional component
//save functionality is a todo, but seems simple enough

export default class MultiChoice extends Component{
	constructor(props){
		super(props);

		this.state = {
			currQuestion : 0,
			currOption : "",
			currScore : 0,
			Questions : [],
		};
	}

	//helper functions handle quiz logic
	chooseOption = (option) => {
		this.setState( {currOption : option} );
	}

	nextQuestion = () => {
		//if answer is correct, add to score
		//if end of quiz, show grade
	}

	startQuiz = () => {

	}

	//data is just a long string - parse for questions
	//stores all the questions into its array in state
	parseQuestions = (data) => {
		 data.split("\n").forEach( (elem) => {
			 let qSeg = data.split(" ");
			 let prompt = "";
			 let choices = []
			 let answer = ""
			 for(let i = 0; i < qSeg.length; ++i){ 
				 if(i == 0) {
					 prompt = qSeg[i];
				 } else if (i === qSeg.length-1){
					answer = choices[qSeg[i]];//load answer
				 } else {
					 choices.push(qSeg[i]);
				 }
			 }
			 this.addQuestion({prompt, choices, answer});
		 })
		this.startQuiz();
	}

	//goes through the backend and gathers all the question data
	queryDB = () => {
		console.log("querying");
		firebase.firestore().collection("user_data")
		.where("UID", "==", 1) //todo multi user support
		.get()
		.then((querySnapshot) => {
			//assume UIDs to be unique
			//if querySnapshot isn't empty, then we found the ID
			if(!querySnapshot.empty){ 
				this.parseQuestions(querySnapshot.docs[0].data().Data); //get [0] since theres only gonna be one
			}
		})
		.catch((e) => { console.log("error during query and load func")
		});
	}

	//adds a question to the question container
	addQuestion = (prompt, choices, answer) => {
		var temp = this.state.Questions;
		var question = {
			prompt : prompt,
			choices : choices,
			answer : answer
		}
		temp.push(question)
		this.setState({
			Questions : temp
		})
	}

	render(){
		return (
			<div class = "MCQ">
				<div class="btn-group">
					<button onClick = {this.queryDB}> Load Test</button>
					<button onClick = { () => {
						this.props.history.push('/EZ-Math-Editor')
					}}> Switch to Editor Mode</button>

				</div>
			</div>

		)
	}
}


