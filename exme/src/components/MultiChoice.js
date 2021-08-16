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
			key : null,
			title : "",
			currQuestion : 0,
			currScore : 0,
			startedTest : false,
			finishedTest : false,
			questions : [],
			averageScore : 0,
			totalTakers : 0
		};
	}

	flush = () => {
		this.setState({
			key : null,
			title : "",
			currQuestion : 0,
			currScore : 0,
			startedTest : false,
			finishedTest : false,
			questions : [],
			averageScore : 0,
			totalTakers : 0
		}); 
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
		//modify master data
		//increment takers by 1
		//increment score by successes
		firebase
			.firestore()
			.collection("tests")
			.doc(this.state.key)
			.get()
			.then((doc) => {
				if(doc.exists){
					this.updateMaster(doc.data().sumScore, doc.data().sumTakers); //get [0] since theres only gonna be one
				} else{
					alert("test not found!");
				}
			})
			.catch((e) => { console.log("error during query and load func")
			});
	}

	updateMaster = (currCorrect, currTakers) => {
		const newScore = currCorrect + this.state.currScore;
		const newTakers = currTakers + 1;

		const avg = Math.round( (newScore / (newTakers * this.state.questions.length)) * 100) / 100;
		this.setState({averageScore : avg, totalTakers : newTakers}, () => {
			firebase
			.firestore()
			.collection("tests")
			.doc(this.state.key)
			.update({
				sumScore : newScore,
				sumTakers : newTakers
			}).catch((e) => { console.log("error turing update op")});
	
		})

	}

	onTestInit = () => {
		this.queryTestDB();
		// this.setState({startedTest : true});
	}

	//stores all the questions into its array in state
	//for now don't support formulas
	//yQiP6IOm4rdyhE2RCXBv
	parseQuestions = (data) => {
		console.log(data);
		var arr = JSON.parse(data).ops.map(ins => {
			return ins.insert;

		}); //list of inserts
		
		var content = "";
		arr.forEach(elem => {
			// console.log(elem);
			if(!elem.formula){
				content += elem;
			} else {
				console.log(elem);
			}
		})

		// const content = JSON.parse(data).ops[0].insert
		// console.log(content)
		content.split("\n").forEach( (elem) => {
			console.log(elem)
			let qSeg = elem.split(";;");
			 
			 if(qSeg.length > 3){
				let prompt = "";
				let choices = []
				for(let i = 0; i < qSeg.length; ++i){ 
					console.log(qSeg[i])
					if(i === 0) {
						prompt = qSeg[i];
					} else if (i === qSeg.length-1){
						choices[qSeg[i]-1].isCorrect = true;
					} else {
						choices.push({answerText: qSeg[i], isCorrect: false});
					}
				}
   
				console.log(prompt);
				console.log(choices);
				this.addQuestion(prompt, choices);
			 }
		
		 })
		 console.log(this.state.questions);

		 if(this.state.questions.length === 0){
			 alert("invalid test")
			 this.flush();
		 } else {
			this.setState({startedTest : true})
		 }

	
	}

	queryTestDB = () => {
		var key = prompt("Enter test key: ");
		if(!key) return;
		this.setState({key : key})
		firebase
			.firestore()
			.collection("tests")
			.doc(key)
			.get()
			.then((doc) => {
				if(doc.exists){
					this.testSetup(doc.data().title, doc.data().body); //get [0] since theres only gonna be one

				} else{
					alert("test not found!");
				}
			})
			.catch((e) => { console.log("error during query and load func")
			});

	}

	testSetup = (title, body) => {
		this.setState({title : title}, () => {
			this.parseQuestions(body);
		})
	}

	//adds a question to the question container
	addQuestion = (prompt, choices) => {
		var temp = this.state.questions;
		var question = {
			prompt : prompt,
			choices : choices
		}

		temp.push(question)
		this.setState({
			questions : temp
		})
	}



	render(){
		return (
			<div className = "mcapp">
				{this.state.startedTest ? 
					<div className='title-section'>
						{this.state.title}
					</div>: null}
				{this.state.startedTest ?  ( 
					  this.state.finishedTest ? (
					 		<div className='score-section'>
					 			You scored {this.state.currScore} out of {this.state.questions.length} 
								<br/>
								Average Score: {this.state.averageScore}
								<br/>
								Total Takers: {this.state.totalTakers}
					 		</div>
					 	) : (
					 		<>
					 			<div className = "question-section">
					 				<div className='question-count'>
					 					<span> Question {this.state.currQuestion + 1} </span> of {this.state.questions.length}
					 				</div>
					 				<div className="question-text">{this.state.questions[this.state.currQuestion].prompt}</div>
					 			</div>
					 			<div className='answer-section'>
					 				{this.state.questions[this.state.currQuestion].choices.map((answerOption, i) => (
					 					<div class = 'btnwrap' key = {i} >
										 <button onClick={() => this.onAnswerChosen(answerOption.isCorrect)}>{answerOption.answerText}</button>
										</div>
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


