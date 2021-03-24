import React from 'react';
import { ListItem, IconButton, ListItemText, ListItemAvatar, ListItemSecondaryAction, Typography, Tooltip } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import FolderIcon from '@material-ui/icons/Folder';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import ArchiveIcon from '@material-ui/icons/Archive';
import { useHistory } from "react-router-dom";
import firebase from '../../firebase';

export default function InboxItem(props){

  const db = firebase.firestore();

  const history = useHistory();

  const openMessage = () => {
      //set message status to read if it is unread
      if (props.status==="unread") {
        var messageRef = db.collection("userSeekers").doc(props.userId).collection("messages").doc(props.id);  
        messageRef.update({status: "read"});
      }

      history.push('/messages/'+props.id);
  }

 

    return (
       <ListItem button divider="true" onClick={() => openMessage()}>         
          <ListItemAvatar>
          {props.status === "unread" ?
              <>
                <Avatar>
                  <FolderIcon />  
                </Avatar>
              </>
              :
              <>
                <Avatar>
                  <FolderOpenIcon />  
                </Avatar>
              </>
          }
          </ListItemAvatar> 

          {props.status === "unread" ?
              <>
                  <ListItemText         
                    primary={
                      <Typography style={{ fontStyle: "bold" }}>
                        {props.createdAt}
                      </Typography>
                    }
                    secondary={
                      <Typography style={{ fontStyle: "bold" }}>
                        {props.body}
                      </Typography>}
                  />                             
              </>
              :
              <>
                  <ListItemText         
                    primary={props.createdAt}
                    secondary={props.body}
                  />                             
              </>
              }   
                      
          <ListItemSecondaryAction>
            <Tooltip title="Archive">
              <IconButton edge="end" aria-label="archive">
                <ArchiveIcon />
              </IconButton>
            </Tooltip>
          </ListItemSecondaryAction>
      </ListItem> 
    )
}


        