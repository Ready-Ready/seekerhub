import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, Grid, CardContent } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import firebase from '../../firebase';
import { useAuth } from '../../Auth';
import InboxItem from './InboxItem';

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      maxWidth: 752,
    },
    demo: {
      backgroundColor: theme.palette.background.paper,
    },
    title: {
      margin: theme.spacing(4, 0, 2),
    },
}));


export default function Inbox(){

    const classes = useStyles();

    const { currentUser } = useAuth();

    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    
    const getMessages = async () => {
        setLoading(true);
        const seekerRef = await firebase.firestore().collection("userSeekers").where('createdByUser', '==', currentUser.uid).get();
    
        const ref = firebase.firestore().collection("userSeekers").doc(seekerRef.docs[0].id).collection("messages").orderBy('createdAt', 'desc');

        const unsubscribe = ref.onSnapshot(async (docs) => {
            const items = [];
            docs.forEach((doc) => {
                if(doc.data().createdAt){
                    items.push({
                        body: doc.data().body,
                        createdAt: new Date(doc.data().createdAt.seconds * 1000).toLocaleDateString("en-US"),
                        id: doc.id,
                        toProgram: doc.data().toProgram,         
                        status: doc.data().status              
                    });

                } else {
                    items.push({
                        body: doc.data().body,
                        createdAt: null,
                        id: doc.id,
                        toProgram: doc.data().toProgram,
                        status: doc.data().status
                    }); 
                }

            });
            setMessages(items);
            setLoading(false);
        });
        return () => unsubscribe;
    }
    
    useEffect(() => {
        getMessages();
    });

    return (
        <Grid container spacing={0}>
            <Grid item xs={8} md={4}>
                <Card >
                    <CardContent>
                        <Typography variant="h6" className={classes.title}>
                            Inbox
                        </Typography>
                        <div className={classes.demo}>
                        <List dense={false}>
                                    {messages.map(message => <InboxItem isLoading={loading} key={message.id} id={message.id} toProgram={message.toProgram} status={message.status} createdAt={message.createdAt} body={message.body} userId = {currentUser.uid}/>)}
                        </List>
                        </div>
                    </CardContent>
                </Card>              
            </Grid>
        </Grid>
     )
}