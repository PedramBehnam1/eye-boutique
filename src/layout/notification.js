import React, { useState , useEffect } from 'react'
import { Snackbar } from '@mui/material'
import MuiAlert from '@mui/material/Alert';

const Notification = (props) => {

    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    return (
        <Snackbar open={props.open} autoHideDuration={5000}  >
            <Alert severity={props.type === "success" ? "success" : "error"} sx={{ width: '100%' }}>
                {props.message}
            </Alert>
        </Snackbar>)
}

export default Notification