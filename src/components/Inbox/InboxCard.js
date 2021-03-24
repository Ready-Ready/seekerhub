import { Card, Grid, CardContent, CardActions, Typography } from '@material-ui/core';
import { NavLink } from "react-router-dom";
import firebase from '../../firebase';
import { useAuth } from '../../Auth';
import { useState, useEffect } from 'react';

const InboxCard= (props) => {

    const { match } = props;
    const { params } = match;
    const { message_ID } = params;
    const [message, setMessage] = useState([]);
 
    const db = firebase.firestore();
    const { currentUser } = useAuth();

    const displayResource = (message) => {
  
        return (
            <>
            <Grid  item xs={12} sm={6}>
            <Card >
                <CardContent>
                    <Typography  color="textSecondary" gutterBottom>
                        Message Date: {message.createdAt}
                    </Typography>
                    <Typography  color="textSecondary" gutterBottom>
                        Message Content: {message.body}
                    </Typography>
                    
                    <CardActions>
                        <NavLink to={{pathname: `/programs/${message.toProgram}`}}>Learn More About This Program</NavLink>                      
                    </CardActions>                   
                </CardContent>
            </Card>
            </Grid>
             </>
        )    
    }

    useEffect(() => {
        const fetchMessage = async () => {
                const messageSnapshot = await db.collection("userSeekers").doc(currentUser.uid).collection("messages").doc(message_ID).get();
            
                const items = [];
                items.push({
                    body: messageSnapshot.data().body,
                    createdAt: new Date(messageSnapshot.data().createdAt.seconds * 1000).toLocaleDateString("en-US"),
                    id: messageSnapshot.id,
                    toProgram: messageSnapshot.data().toProgram,         
                    status: messageSnapshot.data().status              
                });

                setMessage(items[0]);  
        } 
        fetchMessage()
    }, [])
    
    return(
        
        <>
            <Grid container spacing={2} >
                    {displayResource(message)}
            </Grid>
        </>
    )
 
}

export default InboxCard;