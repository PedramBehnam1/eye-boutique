import React from 'react'
import { Card, CardMedia, Grid, Typography } from '@mui/material'
import Header from '../../../layout/Header'
import Footer from '../../../layout/footer'
import image1 from '../../../asset/images/GUCCI.png'
import image2 from '../../../asset/images/TOM FORD.png'
import image3 from '../../../asset/images/NICOLA WANS.png'
import image4 from '../../../asset/images/NNM.png'

const brandPage = () => {
    
    const cardArray = [
        {
            src: image1,
            title: 'GUCCI'
        },
        {
            src: image2,
            title: 'TOM FORD'
        },
        {
            src: image3,
            title: 'NICOLA WANS'
        },
        {
            src: image4,
            title: 'NNM'
        }
    ]
    return (
        <Grid xs={12}>
            <Header />
            <Grid xs={12} pt={8} display='flex' flexWrap='wrap'>
                {cardArray.map((card) => {
                    return (
                        <Grid xs={6} style={{ position: 'relative' }}>
                            <Card sx={{ boxShadow: 'none', borderRadius: '0px' }}>
                                <CardMedia component="img"
                                    height='100%'
                                    width='100%'
                                    image={card.src}
                                    />
                            </Card>
                            <Typography style={{
                                position: 'absolute', top: '45%' , width: '100%', textAlign: 'center'
                            }} variant='h23' color='white'>{card.title}</Typography>
                        </Grid>
                    )
                })}
            </Grid>



            <Footer />
        </Grid>
    )
}

export default brandPage