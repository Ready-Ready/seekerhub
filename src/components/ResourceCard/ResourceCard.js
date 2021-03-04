import React, { useState } from 'react';
import { NavLink } from "react-router-dom"
import { Card, Grid, CardContent, CardActions, Typography, Button, Switch, FormGroup, FormControlLabel } from '@material-ui/core';
import { useAuth } from "../../Auth"
import firebase from '../../firebase';

const ResourceCard = ({ resource }) => {
  
    const { currentUser } = useAuth()
    var favorite = false;
    
    if (currentUser) 
    {
        if(currentUser.customData[0].favorite_programs.findIndex(a => a.programUID === resource.id)!==-1) 
            favorite = true;        
    }

    const [cardChecked, setCardChecked] =  useState(favorite ? true : false)

    const addFavorite = async () => 
    {
        const db = firebase.firestore();
        const programSnapshot = await db.collection("programs").where('id', '==', resource.id).get()
        var programDocId = programSnapshot.docs[0].id

        const newJson = {
            name: resource.name,
            programUID: resource.id,
            id: programDocId
        }
                   
        var userRef = db.collection("userSeekers").doc(currentUser.uid);
        userRef.update({
            favorite_programs: firebase.firestore.FieldValue.arrayUnion(newJson)
        });
    }

    const deleteFavorite = async () => 
    {
        const db = firebase.firestore();
        const programSnapshot = await db.collection("programs").where('id', '==', resource.id).get()
        var programDocId = programSnapshot.docs[0].id        

        let obj = { id: programDocId, name: resource.name, programUID: resource.id};
         
        var userRef = db.collection("userSeekers").doc(currentUser.uid);
        userRef.update({
            favorite_programs: firebase.firestore.FieldValue.arrayRemove(obj),  
        })
        .then((r) => console.log('Program removed from favorites.'));        
    }

    const toggleCardChecked = () => {
        setCardChecked((prev) => !prev);        

        var newSelection = !cardChecked
    
        if(favorite && !newSelection)
        {
             deleteFavorite();
            //favorite = false;  
        }
        else if(!favorite && newSelection) 
        { 
            addFavorite();
            //favorite = true;  
        }
    };
   
    return (
        <Grid  item xs={12} sm={6}>
            <Card >
                <CardContent>
                    <Typography variant="h5" component="h2">
                        {resource.name}
                    </Typography>
                    <Typography  color="textSecondary" gutterBottom>
                        A program of {resource.organizationName}
                    </Typography>
                    <Typography variant="body2" component="p">
                        {resource.description}
                    </Typography>
                    <Typography  color="textSecondary">
                        <br />
                        {resource.referral.website}
                    </Typography>
                    <CardActions>
                        <NavLink to={{pathname: `/programs/${resource.externalId}`}}>Learn More</NavLink>  

                        {currentUser ?
                        <>
                            <FormControlLabel
                            control={ <Switch checked={cardChecked} onChange={toggleCardChecked} color="primary" />}
                            label="Favorite"  />                           
                        </>
                        :null
                        }                       

                    </CardActions>  
                </CardContent>
            </Card>
        </Grid>

    )
}

export default ResourceCard;