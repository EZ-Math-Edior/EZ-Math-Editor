  
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

    createNote = () => {
        console.log("new note");
    }

    render() {
        const {notes, classes, selectedNoteIndex } = this.props

        return ( //classes.sidbarContainer associates div with sidebarStyles
            // <div/>
            <div className={classes.sidebarContainer}> 
            <Button onClick={this.createNote}
                    className ={classes.newNoteBtn}>
                        new note
            </Button>
            </div>
        )
    } 

} export default withStyles(sidebarStyles)(Sidebar);
