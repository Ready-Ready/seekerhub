import React, { useEffect, useState } from 'react';
import { NavLink } from "react-router-dom"
import { makeStyles } from '@material-ui/styles'
import {Grid, Card, CardContent, CardActions, Typography, Button } from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import firebase from '../../firebase';
import Form from '@rjsf/material-ui';
import { useAuth } from "../../Auth"

const useStyles = makeStyles({
    resourceContainer:{
        paddingTop: "20px",
        paddingLeft: "50px",
        paddingRight: "50px",
    },
    modal: {
        //display: 'flex',
        position: 'absolute',
        top: '20px',
        left: '20px',
        overflowY: 'scroll',
        height: '80%',
        width: '60%',
        display: 'block',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '5%'        
      },
    paper: {
        //backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        //boxShadow: theme.shadows[5],
        //padding: theme.spacing(2, 4, 3),
    }
})

const Program = (props) => {
    const { currentUser } = useAuth()
    const classes = useStyles();
    const { match } = props;
    const { params } = match;
    const { program_ID } = params;
    const [programs, setPrograms] = useState([]);
    const [activeForm, setActiveForm] = useState(null);
    const [programUID, setProgramUID] = useState();

    const [open, setOpen] = useState(false);
    const [formJSON, setFormJSON] = useState();
    const [formEditData, setFormEditData] = useState();

    const displayResource = (program, activeForm) => {
        if (activeForm) console.log('program is: ' + program.name + ', activeForm is: ' + activeForm.status);
    
        return (
        <>
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
                                <Button variant="outlined" onClick={(e) => handleOpen(e, activeForm.schema)}>
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

            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                timeout: 500,
                }}
                >
                <Fade in={open}>
                <Card>
                    <CardActions>
                        <Button variant="outlined" type="button" onClick={() => setOpen(false)}>
                            Close
                        </Button>
                    </CardActions>
                    <CardContent>          
                        <Typography variant="h5" component="h2">
                            Form Preview
                        </Typography>          
                        {formJSON?
                            <Form schema={formJSON} onSubmit={handleFormSubmit} />
                            :null
                        }
                    </CardContent>

                </Card>
                </Fade>
            </Modal>            
        </>
        )
    }

    const handleOpen = (e, schema) => {
        console.log('in handleOpen, activeForm.schema is: ' + schema);

        e.preventDefault();
        setFormJSON(schema);
        setOpen(true);
    };

    const handleFormSubmit = async (e) => {
        console.log('submitted json');
        console.dir(e.formData);
    
        const newJson = {
            form_data: e.formData,
            submittedByUser: String(currentUser.uid),
            submissionDateTime: Date().toLocaleString()
         }

        const db = firebase.firestore();                                  
        await db.collection("programs").doc(programUID).collection("forms").doc(activeForm.id).collection("submissions").add(newJson);
             
        setActiveForm(null);
        setOpen(false);
    }    

    const handleClose = () => {
        setOpen(false);
    };    
    
    useEffect(() => {
        const fetchProgram = async () => {
            const db = firebase.firestore()
            const programRef = db.collection("programs")
            const programSnapshot = await programRef.where('externalId', '==', program_ID).get()
            setProgramUID(programSnapshot.docs[0].id)
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
