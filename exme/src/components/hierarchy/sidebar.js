  
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import sidebarStyles from './sidebarStyle';
import List from '@material-ui/core/List';
import { Divider, Button } from '@material-ui/core';
import SidebarItem from './sidebarItem';

class Sidebar extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            addingNote: false,
            title: null
        };
    }

    createNoteSetup = () => {
        this.setState({ title: null, addingNote: !this.state.addingNote})
        // console.log("new note");
    }

    createNote = () => {
        this.props.createNote(this.state.title);
        this.setState({ title: null, addingNote : false});
    }

    updateTitle = (txt) => {
        this.setState({ title : txt })
    }   

    selectNote = (note, index) => {
        this.props.selectNote(note, index);
    }

    deleteNote = (note) => {

        this.props.deleteNote(note);

    }

    render() {
        const {notes, classes, selectedNoteIndex } = this.props

        if(notes){
            return ( //classes.sidbarContainer associates div with sidebarStyles
                // <div/>
                <div className={classes.sidebarContainer}> 
                    <Button onClick={this.createNoteSetup}
                            className ={classes.newNoteBtn}>
                                {!this.state.addingNote ? "new note" : "cancel"}
                    </Button>
                    {this.state.addingNote ? 
                    <div>
                        <input type="text"
                            className={classes.newNoteInput}
                            placeholder="Enter note title"
                            onKeyUp={(e) => this.updateTitle(e.target.value)}>
                        </input>  
                        <Button onClick={this.createNote}
                                className={classes.newNoteSubmitBtn}>
                                    Submit Note
                        </Button>

                    </div> : null
                    }
                    <List>
                        {
                            notes.map((e, i) => {
                                return(
                                    <div key={i}>
                                        <SidebarItem
                                            note={e}
                                            index={i}
                                            selectedNoteIndex={selectedNoteIndex}
                                            selectNote={this.selectNote}
                                            deleteNote={this.deleteNote}>

                                        </SidebarItem>
                                        <Divider></Divider>
                                    </div>
                                )
                            })
                        }
                    </List>
                </div>
            )
        } else {
            return(<div>Add a note!</div>);
        }
    } 

} export default withStyles(sidebarStyles)(Sidebar);
