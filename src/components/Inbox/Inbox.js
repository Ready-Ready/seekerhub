import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, Grid, CardContent, Box, AppBar, Tabs, Tab } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import firebase from '../../firebase';
import { useAuth } from '../../Auth';
import InboxItem from './InboxItem';
import PropTypes from 'prop-types';
import InboxIcon from '@material-ui/icons/Inbox';
import ArchiveIcon from '@material-ui/icons/Archive';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`scrollable-force-tabpanel-${index}`}
        aria-labelledby={`scrollable-force-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
  };
  
  function a11yProps(index) {
    return {
      id: `scrollable-force-tab-${index}`,
      'aria-controls': `scrollable-force-tabpanel-${index}`,
    };
  }

  
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
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const classes = useStyles();

    const { currentUser } = useAuth();

    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const [aMessages, setAMessages] = useState([]);
    
    const getMessages = async () => {
        setLoading(true);
        const seekerRef = await firebase.firestore().collection("userSeekers").where('createdByUser', '==', currentUser.uid).get();
    
        const msgRef = firebase.firestore().collection("userSeekers").doc(seekerRef.docs[0].id).collection("messages"); //.where('status', '!=', 'archived').orderBy('status', 'desc').orderBy('createdAt', 'desc');
    
        const unsubscribe = msgRef.onSnapshot(async (docs) => {
            const items = [];
            const aItems = [];

            docs.forEach((doc) => {
                if(doc.data().createdAt){
                    if(doc.data().status !== 'archived')
                    {
                        items.push({
                        body: doc.data().body,
                        createdAt: new Date(doc.data().createdAt.seconds * 1000).toLocaleDateString("en-US"),
                        id: doc.id,
                        toProgram: doc.data().toProgram,         
                        status: doc.data().status});
                    }
                    else
                    {
                        aItems.push({
                        body: doc.data().body,
                        createdAt: new Date(doc.data().createdAt.seconds * 1000).toLocaleDateString("en-US"),
                        id: doc.id,
                        toProgram: doc.data().toProgram,         
                        status: doc.data().status});
                    }   

                } else {
                    if(doc.data().status !== 'archived')
                    {
                        items.push({
                        body: doc.data().body,
                        createdAt: null,
                        id: doc.id,
                        toProgram: doc.data().toProgram,
                        status: doc.data().status}); 
                    }
                    else
                    {
                        aItems.push({
                        body: doc.data().body,
                        createdAt: null,
                        id: doc.id,
                        toProgram: doc.data().toProgram,
                        status: doc.data().status});
                    }
                }

            });
            setMessages(items);
            setAMessages(aItems);

            setLoading(false);
        });
        return () => unsubscribe;
    }
    
    useEffect(() => {
        getMessages();
    });

    return (
       
      <div className={classes.root}>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
          <Tab label="Active" icon={<InboxIcon />} {...a11yProps(0)} />
          <Tab label="Archived" icon={<ArchiveIcon />} {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
      <Grid container spacing={0}>
            <Grid item xs={32} md={16}>
                <Card >
                    <CardContent>
                        <div className={classes.demo}>
                        <List dense={false}>
                                    {messages.map(message => <InboxItem isLoading={loading} key={message.id} id={message.id} toProgram={message.toProgram} status={message.status} createdAt={message.createdAt} body={message.body} userId = {currentUser.uid}/>)}
                        </List>
                        </div>
                    </CardContent>
                </Card>              
            </Grid>
        </Grid>
      </TabPanel>
      <TabPanel value={value} index={1}>
      <Grid container spacing={0}>
            <Grid item xs={32} md={16}>
                <Card >
                    <CardContent>
                        <div className={classes.demo}>
                        <List dense={false}>
                                    {aMessages.map(aMessage => <InboxItem isLoading={loading} key={aMessage.id} id={aMessage.id} toProgram={aMessage.toProgram} status={aMessage.status} createdAt={aMessage.createdAt} body={aMessage.body} userId = {currentUser.uid}/>)}
                        </List>
                        </div>
                    </CardContent>
                </Card>              
            </Grid>
        </Grid>
      </TabPanel>    
    </div>
     )
}