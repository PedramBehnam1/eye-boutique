import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import React from 'react';
import '../../asset/css/homePage/title.css'

const Lens = (props) => {
    return (
        <Grid item xs={12} textAlign='center'   p={3}>
            
            <Typography variant="h22" color='G1.main'> {props.title}</Typography>
                
        </Grid>
    )
}

export default Lens
