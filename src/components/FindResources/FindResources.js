
import React, { useState, useEffect } from 'react';
import firebase from 'firebase';
import SearchBox from "../SearchBox/SearchBox";
import ResourceGrid from "../ResourceGrid/ResourceGrid";
import { Grid, Switch } from '@material-ui/core';
import { useAuth } from "../../Auth"

const FindResource = () => {
    const { currentUser } = useAuth()
    const[resources, setResources] = useState([]);
    const[isLoading, setIsLoading] = useState(true);
    const [query, setQuery] = useState('')

    const [checked, setChecked] = React.useState(false);

    const toggleChecked = () => {
        setChecked((prev) => !prev);        
    };

    useEffect(() => {
              
        const fetchResources = async () =>{
            setIsLoading(true)
            const db = firebase.firestore()
            const data = await db.collection("programs").orderBy("name").startAt(query).endAt(query + "\uf8ff").get()

            if (currentUser!=null && checked)
            {
                const myData = data.docs.filter((doc, dIdx) => {
  
                    if(currentUser.customData[0].favorite_programs.findIndex(a => a.id === doc.id)!==-1) {
                        return true;
                    } else {
                        return false;
                    }
                });
                setResources(myData.map(doc => doc.data()));
            }
            else setResources(data.docs.map(doc => doc.data()))    
                          
            
            setIsLoading(false)

        }
        fetchResources()
    }, [query, checked])

    return (
        <div className="container">
            <SearchBox getQuery={(q) => setQuery(q)} />
           
            {currentUser?
                <Grid component="label" container spacing={0} alignItems="center" justify="center">
                    <Grid item>All Programs</Grid>
                    <Grid item>
                        <Switch checked={checked} onChange={toggleChecked} color="primary" />
                    </Grid>
                    <Grid item>My Favorite</Grid>
                </Grid>

            :null
            }

            <ResourceGrid isLoading={isLoading} resources={resources} />
        </div>
    )
}

export default FindResource