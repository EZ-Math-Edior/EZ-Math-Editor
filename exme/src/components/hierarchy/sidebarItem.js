  
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import itemStyles from './itemStyle';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DeleteIcon from '@material-ui/icons/Delete';

class SidebarItem extends React.Component {

    selectNote = (n, i) => this.props.selectNote(n, i);
    deleteNote = (n) => {
        // console.log("sdfs");
        if(window.confirm(`Are you sure you wanna delete ${n.title}`)){
            this.props.deleteNote(n);
        }
    }

    render() {

        const {index, note, classes, selectedNoteIndex} = this.props;

        return (
            <div> 
                <ListItem
                    className={classes.listItem}
                    selected={selectedNoteIndex === index}
                    alignItems="flex-start">
                    <div className={classes.textSection}
                        onClick={()=>this.selectNote(note, index)}>
                            {note.title}
                    </div>
                    <DeleteIcon 
                        className={classes.deleteIcon}
                        onClick= {() => this.deleteNote(note)}>
                    </DeleteIcon>
                </ListItem>
            </div>
        )
    }
}
export default withStyles(itemStyles)(SidebarItem);
