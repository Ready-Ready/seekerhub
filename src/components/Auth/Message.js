import React, {useState, useEffect, useRef} from 'react';
import { useAuth } from "../../Auth"
import { AppBar,
         Toolbar,
         Typography,
         Button,
         IconButton,
         makeStyles,
         Snackbar
         }
         from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert';
import MenuIcon from '@material-ui/icons/Menu'
  
function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      '& > * + *': {
        marginTop: theme.spacing(2),
      },
    },
}));

export default function Message(){

    const { currentMessages } = useAuth();

    const classes = useStyles();
    const [open, setOpen] = useState(false);

    const [messageRef, setMessageRef] = useState('');

    useEffect(() => {
        if(currentMessages){
            setMessageRef(currentMessages.notification.body);
            setOpen(true);
        }
    }, [currentMessages]);    
    
    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
  
      setOpen(false);
    };

    return (

        <div>
        {open?
            <Alert severity="info">
                {messageRef} 
                <Button variant="outlined" onClick={handleClose}>Close</Button>
            </Alert>
            :null
        }
        </div>

    )
}