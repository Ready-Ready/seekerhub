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

const Program = (props) => {
    const classes = useStyles();
    const { match } = props;
    const { params } = match;
    const { program_ID } = params;
    const [programs, setPrograms] = useState([]);
    const [activeForm, setActiveForm] = useState(null);

    const [open, setOpen] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [formJSON, setFormJSON] = useState();
    const [formEditData, setFormEditData] = useState();

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
                                <Button variant="outlined" onClick={(e) => handleOpen(e, JSON.stringify(activeForm.schema))}>
                                    Register
                                </Button>  
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

    const handleOpen = (e, schema) => {
        console.log('in handleOpen, activeForm.schema is: ' + schema);

        e.preventDefault();
        setFormJSON(schema);
        setOpen(true);
    };
    
    const handleOpenEdit = (e, form, formID) => {
        e.preventDefault();
    }

    const displayForm = (form, handleOpen, handleOpenEdit) => {
        console.log('in displayForm');

        return (
            <Grid item xs={12} >
                <Card>
                    <CardContent>
                        <Typography variant="h5" component="h2">
                            FORM TYPE: {form.type}
                        </Typography>
                        <br />
                        <Typography variant="body2" component="p">
                            FORM STATUS: {form.status}
                        </Typography>
                        <CardActions>
                                <Button variant="outlined" onClick={(e) => handleOpen(e, JSON.stringify(form.schema))}>
                                    Preview Form
                                </Button>                                                                                                   
                        </CardActions>    
                    </CardContent>
                </Card>
            </Grid>
        )
    }

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