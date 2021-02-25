import React from 'react';
import { NavLink } from "react-router-dom"
import { Card, Grid, CardContent, CardActions, Typography, Button, Switch, FormControlLabel } from '@material-ui/core';
import { useAuth } from "../../Auth"

const ResourceCard = ({ resource }) => {
    
    const { currentUser } = useAuth()
    var checked = false;

    if (currentUser) 
    {
        if(currentUser.customData[0].favorite_programs.findIndex(a => a.programUID === resource.id)!==-1) 
        {
            checked = true; 
        }   
    }

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

                        {currentUser && currentUser.mode == 'all' ?
                        <>
                            <FormControlLabel
                            control={ <Switch checked={checked} />}
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