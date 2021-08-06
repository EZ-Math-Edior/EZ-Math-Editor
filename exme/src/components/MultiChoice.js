import React, { Component  }from 'react';
import './MultiChoice.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import firebase from './firebase';


//the router that presents the multiple choice testing
//handles a collection of questions and assesses the user
//data on these questions are pulled directly from the back end
export default class MultiChoice extends Component{
	constructor(props){
		super(props);

		this.state = {
			currQuestion : 0,
			currOption : "",
			currScore : 0,
			Questions : [],
			readyToDisplay : false
		};
	}

	//helper functions handle quiz logic
	//option refers to the content of the q itself
	flushData = () => {
		this.setState( {
			currQuestion : 0,
			currOption : "",
			currScore : 0,
			Questions : [],
			readyToDisplay : false
		} );

	}

	chooseOption = (option) => {
		// console.log("chose " + option);
		this.setState( {currOption : option} );
	}

	nextQuestion = () => {
		if (this.state.currOption === this.state.Questions[this.state.currQuestion].answer){
			console.log("right");
			this.incScore();
		} 
		let newQuestion = this.state.currQuestion + 1;
		this.setState({currQuestion : newQuestion});
		this.chooseOption("");

	}

	finishQuiz = () => {
		if (this.state.currOption === this.state.Questions[this.state.currQuestion].answer){
			console.log("right");
			this.incScore();
		}		
		console.log(this.state.currOption === this.state.Questions[this.state.currQuestion].answer)
		this.chooseOption(this.state.currOption);
		let newQuestion = this.state.currQuestion + 1;
		this.setState({currQuestion : newQuestion, readyToDisplay : false},() => {alert("you scored " + this.state.currScore + " out of " + this.state.Questions.length);} );

	}

	incScore = () => {
		let newScore = this.state.currScore+1;
		this.setState({currScore : newScore});
	}
	
	//stores all the questions into its array in state
	parseQuestions = (data) => {
		 data.split("\n").forEach( (elem) => {
			 let qSeg = elem.split(";;");
			 if(qSeg.length > 3){
				let prompt = "";
				let choices = []
				let answer = ""
				for(let i = 0; i < qSeg.length; ++i){ 
					if(i === 0) {
						prompt = qSeg[i];
					} else if (i === qSeg.length-1){
					   answer = choices[qSeg[i]-1];//load answer
					} else {
						choices.push(qSeg[i]);
					}
				}
			   //  console.log(prompt);
   
				this.addQuestion(prompt, choices, answer);
			 }
		
		 })
		 this.setState({readyToDisplay : true})
		 console.log(this.state.Questions);

	}

	//goes through the backend and gathers all the question data
	queryDB = () => {
		this.flushData();
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
			<div class = "content">
				    <div className="Quiz">
					<h1>{this.state.readyToDisplay && this.state.Questions[this.state.currQuestion].prompt}</h1>
					<h2>{this.state.readyToDisplay && "chose: " + this.state.currOption} </h2>
						 <div className="q-group">
						 {this.state.readyToDisplay && this.state.Questions[this.state.currQuestion].choices.map( (q, i) => { //for each choice, display a question
							 return (<button 
								key= {i}
							 	onClick={() => {
									 this.chooseOption(q);
								 }}>
									 {q}
								 </button>)
						 })}
							
						{this.state.readyToDisplay && this.state.currQuestion === this.state.Questions.length - 1 ? (
							<button onClick={this.finishQuiz} id="nextQuestion">
							Finish Quiz
							</button>
						) : this.state.readyToDisplay && this.state.currQuestion != this.state.Questions.length - 1 ? (
							<button onClick={this.nextQuestion} id="nextQuestion">
							Next Question
							</button>
						) :  ""}
						
						</div>
					</div>
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


