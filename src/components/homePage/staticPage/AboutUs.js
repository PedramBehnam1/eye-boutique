import React from 'react'
import { Card, CardMedia, Divider, Grid, Hidden, Typography } from '@mui/material';
import Image from '../../../asset/images/Rectangle 238.png';
import Header from '../../../layout/Header';
import Footer from '../../../layout/footer';
import { useState } from 'react';


const AboutUs = () => {
    const [isRemoved, setIsRemoved] = useState(false);
    const[showCartPage,setShowCartPage]=useState(false)
    const [trigger,setTrigger] = useState(0)
    const [_trigger, _setTrigger] = useState(0);

    return (
        <Grid xs={12} >
            <Header trigger={trigger} _trigger={_trigger} showShoppingCard={showCartPage} closeShowShoppingCard={()=>{setShowCartPage(false)}}
            isRemoved={(isRemoved) => {
                setIsRemoved(isRemoved)
            }}
            _trigger_={(_trigger) => {
                setTrigger(_trigger+trigger);
                _setTrigger(_trigger+trigger);
            }}/>
            <Grid xs={12} display='flex' alignItems='center' justifyContent='center'
                style={{ minHeight: '280px', backgroundImage: 'linear-gradient(180deg, #CB929B 0%, rgba(203, 146, 155, 0) 88.81%)' }}>
                <Typography variant='h19'>ABOUT EYE Boutique GROUP</Typography>
            </Grid>
            <Grid xs={12} display='flex'  justifyContent='center'  flexWrap='wrap'>
                <Grid xs={6} md={4} display='flex' justifyContent='center'>
                    <Card pb={1} sx={{background:'none', maxWidth: 458, height: 332, boxShadow: "none", border: 0 }}>
                        <CardMedia
                            component="img"
                            image={Image}
                        />
                    </Card>
                </Grid>
                <Grid p={2} xs={6}  md={4} display='flex' flexDirection='column'  alignItems='center' justifyContent='center' flexWrap='wrap' alignContent='center'>
                    <Typography sx={{ lineHeight: 1.7,width:430 }} p={1} variant='h2'>Eye Boutique is a family of brands and businesses, making it possible for customers around the world to express themselves through fashion and design and to choose a more sustainable lifestyle.
                    </Typography>

                    <Typography sx={{ lineHeight: 1.7,width:430 }} p={1} variant='h2'>
                        We create value for people and society in general by delivering our customer offering and developing with a focus on sustainable and profitable growth.</Typography>
                </Grid>
            </Grid>
            
            <Hidden lgDown>
                <Grid xs={12} pt={3} display='flex' flexDirection='row' justifyContent='center'>
                    <Grid xs={12} md={8} p={1} >
                        <Typography sx={{ lineHeight: 1.7,width:940 }} p={1} variant='h2'>Eye Boutique is a family of brands and businesses, making it possible for customers around the world to express themselves through fashion and design and to choose a more sustainable lifestyle. We create value for people and society in general by delivering our customer offering and developing with a focus on sustainable and profitable growth.
                        </Typography>

                            
                    </Grid>
                </Grid>
            </Hidden>
            <Hidden mdDown lgUp >
                <Grid xs={12} pt={3} display='flex' flexDirection='row' justifyContent='center'flexWrap='wrap'>
                    <Grid xs={12} md={8} p={1} >
                        <Typography sx={{ lineHeight: 1.7,width:895}} p={1} variant='h2'>Eye Boutique is a family of brands and businesses, making it possible for customers around the world to express themselves through fashion and design and to choose a more sustainable lifestyle. We create value for people and society in general by delivering our customer offering and developing with a focus on sustainable and profitable growth.
                        </Typography>

                            
                    </Grid> 
                </Grid>
            </Hidden>

            <Hidden smDown mdUp>
                <Grid xs={12} pt={3} display='flex' flexDirection='row' justifyContent='center'>
                    <Grid xs={12} md={8} p={1} >
                        <Typography sx={{ lineHeight: 1.7,width:430 }} p={1} variant='h2'>Eye Boutique is a family of brands and businesses, making it possible for customers around the world to express themselves through fashion and design and to choose a more sustainable lifestyle. We create value for people and society in general by delivering our customer offering and developing with a focus on sustainable and profitable growth.
                        </Typography>

                            
                    </Grid>
                </Grid>
            </Hidden>
            
            <Divider />
            <Grid xs={12}  >
                <Grid xs={12} style={{ minHeight: '150px' }} display='flex' alignItems='center' justifyContent='center' >
                    <Typography variant='h12'>Eye Boutique Stores</Typography>
                </Grid>
                <Grid xs={12} display='flex' justifyContent='center' flexWrap='wrap' mb={25}>
                    <Grid xs={12} md={4}  display='flex' justifyContent='center'  flexWrap='wrap'>
                        <Card pb={1} sx={{background:'none', maxWidth: 361, height: 262, boxShadow: "none", border: 0 }}>
                            <CardMedia
                                component="img"
                                image={Image}
                            />
                        </Card>
                        <Grid xs={10.1} pt={1} pb={15} display='flex' flexWrap='wrap' textAlign='center' justifyContent='center'>
                            <Typography p={1} variant='h11'>Store 1</Typography>
                            <Typography pt={1.2} sx={{ lineHeight: 1.7, color: 'G1.main' }} variant='h10'>Eye Bouique is a family of brands and businesses, making it possible for customers around the world to express themselves through fashion and design</Typography>
                        </Grid>
                    </Grid>
                    <Grid xs={12} md={4}  display='flex' justifyContent='center'  flexWrap='wrap'>
                        <Card pb={1} sx={{background:'none', maxWidth: 361, height: 262, boxShadow: "none", border: 0 }}>
                            <CardMedia
                                component="img"
                                image={Image}
                            />
                        </Card>
                        <Grid xs={10.1} pt={1} pb={15} display='flex' flexWrap='wrap' textAlign='center' justifyContent='center'>
                            <Typography p={1} variant='h11'>Store 1</Typography>
                            <Typography pt={1.2} sx={{ lineHeight: 1.7, color: 'G1.main' }} variant='h10'>Eye Bouique is a family of brands and businesses, making it possible for customers around the world to express themselves through fashion and design</Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Footer />
        </Grid >
    )
}

export default AboutUs