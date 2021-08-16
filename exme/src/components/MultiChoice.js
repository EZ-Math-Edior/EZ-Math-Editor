import React, { Component  }from 'react';
import './MultiChoice.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import firebase from './firebase';
import  MathJax from 'react-mathjax';
//the router that presents the multiple choice testing
//handles a collection of questions and assesses the user
//data on these questions are pulled directly from the back end
export default class MultiChoice extends Component{
	constructor(props){
		super(props);

		this.state = {
			currQuestion : 0,
			currScore : 0,
			startedTest : false,
			finishedTest : false,
			questions : []
		};
	}


	onAnswerChosen = (isCorrect) => {
		if(isCorrect){
			const oldScore = this.state.currScore;
			this.setState({currScore: oldScore+1})
		}

		const nextQuestion = this.state.currQuestion + 1;
		if(nextQuestion < this.state.questions.length) {
			this.setState({currQuestion : nextQuestion})
		} else {
			this.setState({finishedTest : true}, () => {
				this.onTestFinish();
			})
		}
	}

	onTestFinish = () => {

	}

	onTestInit = () => {
		this.queryTestDB();
		// this.setState({startedTest : true});
	}

	//stores all the questions into its array in state
	parseQuestions = (data) => {
		console.log(data);
		var content = JSON.parse(data).ops[0].insert;
		console.log(content);

		content.split("\n").forEach( (elem) => {
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

	queryTestDB = () => {
		var key = prompt("Enter test key: ");
		if(!key) return;
		firebase
			.firestore()
			.collection("tests")
			.doc(key)
			.get()
			.then((doc) => {
				if(doc.exists){
					this.testSetup(doc.data().title, doc.data().body); //get [0] since theres only gonna be one

				} else{
					console.log("no data found");
				}
			})
			.catch((e) => { console.log("error during query and load func")
			});

	}

	testSetup = (title, body) => {
		console.log(title);
		console.log(body);
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
			<div className = "mcapp">
				{this.state.startedTest ? (
					  this.state.finishedTest ? (
					 		<div className='score-section'>
					 			You scored {this.state.score} out of {this.state.questions.length}
					 		</div>
					 	) : (
					 		<>
					 			<div className = "question-section">
					 				<div classsName='question-count'>
					 					<span> Question {this.state.currQuestion + 1} </span> of {this.state.questions.length}
					 				</div>
					 				<div className="question-text">{this.state.questions[this.state.currQuestion].prompt}</div>
					 			</div>
					 			<div className='answer-section'>
					 				{this.state.questions[this.state.questions].answerOptions.map((answerOption) => (
					 					<button onClick={() => this.onAnswerChosen(answerOption.isCorrect)}>{answerOption.answerText}</button>
					 				))}
					 			</div>
					 		</>
							
					 	) 
			) : ( 
				<div className = "start-button" >
					<button onClick = {this.onTestInit}> Start Quiz </button>
				</div>
				
			)}
				<div className="btn-group">
					<button onClick = { () => {
						this.props.history.push('/EZ-Math-Editor')
					}}> Switch to Editor Mode</button>

				</div>
			</div>


			// <div className = "content">
			// 	    <div className="Quiz">
			// 		<h1>{this.state.readyToDisplay && this.state.Questions[this.state.currQuestion].prompt}</h1>
			// 		<h2>{this.state.readyToDisplay && "chose: " + this.state.currOption} </h2>
			// 			 <div className="q-group">
			// 			 {this.state.readyToDisplay && this.state.Questions[this.state.currQuestion].choices.map( (q, i) => { //for each choice, display a question
			// 				 return (<button 
			// 					key= {i}
			// 				 	onClick={() => {
			// 						 this.chooseOption(q);
			// 					 }}>
			// 						 {q}
			// 					 </button>)
			// 			 })}
							
			// 			{this.state.readyToDisplay && this.state.currQuestion === this.state.Questions.length - 1 ? (
			// 				<button onClick={this.finishQuiz} id="nextQuestion">
			// 				Finish Quiz
			// 				</button>
			// 			) : this.state.readyToDisplay && this.state.currQuestion != this.state.Questions.length - 1 ? (
			// 				<button onClick={this.nextQuestion} id="nextQuestion">
			// 				Next Question
			// 				</button>
			// 			) :  ""}
						
			// 			</div>
			// 		</div>
			// 	<div className="btn-group">
			// 		<button onClick = {this.queryDB}> Load Test</button>
			// 		<button onClick = { () => {
			// 			this.props.history.push('/EZ-Math-Editor')
			// 		}}> Switch to Editor Mode</button>

			// 	</div>
			// </div>

		)
	}
}


