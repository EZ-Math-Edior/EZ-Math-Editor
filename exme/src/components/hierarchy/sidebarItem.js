  
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
// import styles from './sidebar.css';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DeleteIcon from '@material-ui/icons/Delete';

export default class SidebarItem extends React.Component {

    constructor(props){
        super(props);
    }

    render() {
        return (
            <div> This is sidebar item</div>
        )
    }
}