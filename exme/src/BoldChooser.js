/*class BoldChooser extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			boldState = false
		}	
	}
	toggle(e){
		this.setState({
			boldState = !boldState
		})
	}
	render(){
		return(
			<div>
				<input type = "button"
				id = "boldBtn"
				onclick={this.toggle.bind(this)}
				></input>
				<span
					id = "textSpan"
					style = {this.boldState ? {fontweight : 'bold'} : {fontweight : 'normal'}}
				>
					{this.props.text}
				</span>
			</div>
		)
	}
}

React.render(
	<div>
		<BoldChooser 
	</div>
)*/