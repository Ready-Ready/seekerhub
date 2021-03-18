import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import FolderIcon from '@material-ui/icons/Folder';

export default function InboxItem(props){
    return (
        <ListItem>
            <ListItemIcon>
                <FolderIcon />
            </ListItemIcon>
            <ListItemText
            primary={props.createdAt}
            secondary={props.body}
            />
        </ListItem>
    )
}