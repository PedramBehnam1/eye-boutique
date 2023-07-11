import React, { useEffect, useState } from 'react'
import axiosConfig from '../../axiosConfig.js';
import OrWith from './OrWith';
import SubmitBtn from './submitBtn';
import NumberSelector from './numberSelector';
import { BrowserRouter as Router, Link, useHistory } from "react-router-dom";
import {Snackbar,Grid,Typography,IconButton} from '@mui/material';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';

const SignUp = () => {

    const valueChangeListener = (value) => {
        setCellphone(value);
    }
    const [cellphone, setCellphone] = useState();
    const [token, setToken] = useState();
    
    let history = useHistory();
    const [error , setError] = useState(false);
    const [errorMessage , setErrorMessage] = useState('');
    const [openMassage, setOpenMassage] = useState(false);
    const [showMassage, setShowMassage] = useState('');

    const handleSubmit = () => {

        axiosConfig.post('/users/register_by_cell', { cellphone })
            .then((response) => {

                setToken((response.data.accessToken).toString().split(" ").pop());
                localStorage.clear();
                localStorage.setItem('token', (response.data.accessToken).toString().split(" ").pop());
                localStorage.setItem('cellphone', cellphone);
                localStorage.setItem('code', response.data.token)
                history.push('/verifyByCell');

            })
            .catch((error) => {
                setError(true);
                setErrorMessage(error.response.data.error.message)
                
                setShowMassage(error.response.data.error.message)
                setOpenMassage(true)  

            })

    };

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
          return;
        }
    
        setOpenMassage(false);
      };

    return (
        <div>
            <NumberSelector valueChangeListener={valueChangeListener} error={error} errorMessage={errorMessage}/>

            <SubmitBtn text="Login" value={cellphone} onClick={handleSubmit} />

            <OrWith />

                                                        
            <Snackbar open={openMassage} autoHideDuration={6000} onClose={handleClose}
                anchorOrigin={{ vertical:'top', horizontal:'right' }}
                sx={{pt:"65px"}}
            >
                <Grid display='flex' justifyContent='space-between' bgcolor='white' alignItems='center' height="44px" borderRadius="10px" sx={{boxShadow: "0.5px 0.5px 1.5px 1px rgba(0, 0, 0, 0.16)"}}>
                    <Typography pl="10px"> {showMassage}</Typography>
                    <React.Fragment >
                        <IconButton
                        disabled
                        aria-label="close"
                        color="inherit"
                        sx={{ p: 0.5 ,pr:"14px", pl:'12px',"&:hover": { background: "none" },"&:active": { background: "none" },
                        "&:focus": { background: "none" },"&:disabled": { background: "none",color:'Black.main' } ,cursor:'auto'}}
                        >
                            <ChatOutlinedIcon />
                        </IconButton>
                    </React.Fragment>
                </Grid>
            </Snackbar>
        </div>
    )


}

export default SignUp
