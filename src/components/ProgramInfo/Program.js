import React, { useEffect, useState } from 'react';
import { NavLink } from "react-router-dom"
import { makeStyles } from '@material-ui/styles'
import {Grid, Card, CardContent, CardActions, Typography, Button } from '@material-ui/core';
import firebase from '../../firebase';
import Form from '@rjsf/material-ui';


const useStyles = makeStyles({
    resourceContainer:{
        paddingTop: "20px",
        paddingLeft: "50px",
        paddingRight: "50px",
    }
})



const displayResource = (program, activeForm) => {
    if (activeForm) console.log('program is: ' + program.name + ', activeForm is: ' + activeForm.status);

    return (
        
        <Grid item xs={12} >
            <Card>
                <CardContent>
                    <Typography variant="h5" component="h2">
                        {program.name}
                    </Typography>
                    <Typography  color="textSecondary" gutterBottom>
                        A program of {program.organizationName}
                        <br />
                    </Typography>
                    <Typography variant='subtitle2'>
                        Program Description:
                    </Typography>
                    
                    <Typography variant="body2" component="p">
                        {program.description}
                    </Typography>
                    <br />
                    <Typography variant='subtitle2'>
                        Program Eligibility:
                    </Typography>
                    <Typography variant="body2" component="p">
                        {program.program_eligibility}
                        
                    </Typography>
                    <br />
                    <Typography variant='subtitle2'>
                        Referral Process:
                    </Typography>
                    <Typography variant="body2" component="p">
                        {program.referral.process}
                    
                    </Typography>
                    <br />
                    <Typography variant='subtitle2'>
                        Referral Contact:
                    </Typography>
                    <Typography variant="body2" component="p">
                        {program.referral.contact}
                        
                    </Typography>
                    <br />
                    <Typography variant='subtitle2'>
                        Referral Email:
                    </Typography>
                    <Typography variant="body2" component="p">
                        {program.referral.email}
                        
                    </Typography>
                    <br />
                    <Typography variant='subtitle2'>
                        Referral Phone:
                    </Typography>
                    <Typography variant="body2" component="p">
                        {program.referral.phone}
                        
                    </Typography>
                    <br />

                    <Typography  color="textSecondary">
                        <br />
                        {program.referral.website}
                        <br />
                    </Typography>
                    <CardActions>

                        {activeForm ?
                        <>
                            <NavLink to={{pathname: `/`}}>Register</NavLink>
                        </>
                        :null
                        }                        
                        
                        <NavLink to={{pathname: `/`}}>Back</NavLink>
                    </CardActions>    
                </CardContent>
            </Card>
        </Grid>        
    )
}

const Program = (props) => {
    const classes = useStyles();
    const { match } = props;
    const { params } = match;
    const { program_ID } = params;
    const [programs, setPrograms] = useState([]);
    const [activeForm, setActiveForm] = useState(null);

    useEffect(() => {
        const fetchProgram = async () => {
            const db = firebase.firestore()
            const programRef = db.collection("programs")
            const programSnapshot = await programRef.where('externalId', '==', program_ID).get()
            setPrograms(programSnapshot.docs.map(doc => doc.data()))

            const formSnapshot = await db.collection("programs").doc(programSnapshot.docs[0].id).collection("forms").where('status', '==', 'active').where('type', '==', 'registration').get();

            console.log('This program has ' + formSnapshot.docs.length + ' active registration forms');
            
            const allForms = [];
            formSnapshot.docs.forEach(doc => {
                let currentID = doc.id;
                let formObj = { ...doc.data(), 'id': currentID};
                allForms.push(formObj);
            });
            setActiveForm(allForms[0]);
        }
        fetchProgram()

    }, [program_ID])

    return(
        
        <>
            <Grid container spacing={2} className={classes.resourceContainer}>
                    {programs.map((program) =>(
                        displayResource(program, activeForm)
                    )
                    )}

            </Grid>


        </>
    )
}

export default Program;