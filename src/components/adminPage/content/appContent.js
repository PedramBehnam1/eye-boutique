import React from 'react'
import AdminLayout from '../../../layout/adminLayout';
import { Grid , Typography } from '@mui/material';


const AppContent = () => {
    const boxStyle = {
        border:' 1px solid #DCDCDC',
        borderRadius: '5px',
        backgroundColor:'White.main',
    }
    return(
        <AdminLayout breadcrumb='' pageName="'App Content">
            <Grid xs={12} display='flex' flexWrap='wrap' flexDirection='column'>
                <Grid xs={12} width='100%' display='flex' sx={boxStyle}>
                    <Typography>App Content</Typography>
                </Grid>
                <Grid xs={12} width='100%' display='flex' backgroundColor='White.main'>
                    <Typography>App Content</Typography>
                </Grid>
            </Grid>
        </AdminLayout> 
    )
}

export default AppContent