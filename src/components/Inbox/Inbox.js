import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
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

        ref.onSnapshot(async (docs) => {
            const items = [];
            docs.forEach((doc) => {
                if(doc.data().createdAt){
                    items.push({
                        body: doc.data().body,
                        createdAt: new Date(doc.data().createdAt.seconds * 1000).toLocaleDateString("en-US")
                    });
                } else {
                    items.push({
                        body: doc.data().body,
                        createdAt: null
                    });                    
                }

            });
            setMessages(items);
            setLoading(false);
        })

    }
    
    useEffect(() => {
        getMessages();
    }, []);

    return (
        <div className={classes.root}>
            {loading ? <h1>Loading...</h1> : null}
            <Grid item xs={12} md={6}>
                <Typography variant="h6" className={classes.title}>
                    Inbox
                </Typography>
                <List dense={false}>
                    {messages.map(message => <InboxItem createdAt={message.createdAt} body={message.body} />)}
                </List>
            </Grid>
        </div>
    )
}