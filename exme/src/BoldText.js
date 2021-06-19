class BoldText extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			boldState : false
		};
		this.boldText = this.boldText.bind(this);
	}
	boldText(e){
		this.setState({
			boldState = !boldState
		})
	}
	render(){
		return(
			<div>
				<input type = "button"
				id = "boldBtn"
				onClick={this.boldText}
				></input>
			</div>
		)
	}
}