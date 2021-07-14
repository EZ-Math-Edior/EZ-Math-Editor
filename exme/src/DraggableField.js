import React, { Component } from 'react'
import { Rnd } from 'react-rnd'
export default class DraggableField extends Component {
   
    //ref to:
    //https://github.com/bokuweb/react-rnd
    //this ver might have limitations regarding our specific needs- but can be used as a mockup for now
    
    //these are also useful but idk how to combine them together
    //https://github.com/react-grid-layout/react-resizable
    //https://github.com/react-grid-layout/react-draggable


    constructor(props){
        super(props)
        //ex. what should a text box do given particular modes? when should it be editable etc.
        this.state = {
            draggable : true,
            scalable : true, 
            editable : true,
            locked: false
           
        }

        
    }
   

    // these could technically be a single function but why not be explicit
    onLock = () => {
        this.setState({
            draggable : false, 
            scalable : false
        })
    };

    onFree = () => {
        this.setState({
            draggable : true, 
            scalable : true
        })
    };

    //master function that flips it - just for demoing
    lockReverse = () => {
        if(this.state.locked){
            this.onFree();
            this.setState({
                locked : false
            })
            console.log("freed");
        } else {
            this.onLock();
            this.setState({
                locked : true
            })
            console.log("locked");

        }

        

        
    };


    render() {
        return (
            <Rnd
               disableDragging = {!this.state.draggable} //props can change at runtime
               enableResizing = {this.state.scalable}
                // cancel = ".cancel"
            >
                {/* todo: alternative to just some editable text?- may want to find a package/make a custom thing idk */}
                <div 
                    contentEditable= {this.state.editable} 
                    id = "textField"
                >	
                    This text can be dragged and edited
                </div>
             
            </Rnd>
        )
    }
}
