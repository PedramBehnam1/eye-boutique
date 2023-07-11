import React, { useState } from 'react'
import '../../asset/css/homePage/menOrWomanPoster.css'
import Link from '@mui/material/Link';
import axiosConfig from '../../axiosConfig';
import {  Grid, Typography } from '@mui/material';
import sunglassIcon from '../../asset/images/sunglass.png'
import _sunglassIcon from '../../asset/images/_sunglass.png'
import _sunglassIcon_ from '../../asset/images/_sunglass_.png'
import frameIcon from '../../asset/images/frame.png'
import _frameIcon from '../../asset/images/_frame.png'
import _frameIcon_ from '../../asset/images/_frame_.png'
import accessoriesIcon from '../../asset/images/accessories.png'
import _accessoriesIcon from '../../asset/images/_accessories.png'
import _accessoriesIcon_ from '../../asset/images/_accessories_.png'
import { useHistory } from 'react-router-dom';



const Posters = (props) => {
    const [style, setStyle] = useState({ display: 'block' });
    const [isEntered, setIsEntered] = useState([false,false,false]);
    let history = useHistory()
    return (
        
        props.type == "gender"?
            (window.innerWidth>900?
                (props.banner.title== "Women"?
                    <Grid xs={12} md={12} display='flex'>
                        <Grid xs={4.5} md={4.5}  bgcolor="Black1.main" display='flex' justifyContent='center' style={{ alignItems: 'center',paddingBottom:0,paddingTop:0 ,height: '390px'}}> 
                            <Typography variant='h24' fontWeight='500' color='White.main'>{props.banner.title.toUpperCase()}</Typography>
                        </Grid>
                        <Grid xs={7.5} md={7.5} className="backImage" style={{ alignItems: 'center',paddingBottom:0,paddingTop:0 }}>
                            <img style={{ displayL: 'block', width: '100%', height: '390px', objectFit: 'cover' , filter: "grayscale(1)" }} src={axiosConfig.defaults.baseURL + props.banner.file.image_url} />

                            <Grid className="textIn" style={style} bgcolor='rgba(0, 0, 0, 0.7)'>

                                <Link
                                    color="inherit" underline="none" style={{ color: 'inherit', textDecoration: 'inherit' }}
                                    
                                >
                                    <h1 style={{ marginTop: "0" ,backgroundColor:"#9E9E9E",height:"153px",width:'2px',marginLeft:"116px"}} >
                                    </h1>
                                </Link>
                                {props.banner.sub_menu.map((menu,index) => {
                                    return (
                                        <Link
                                            onClick={()=>{history.push({pathname: `/Products/${menu.link}/All/${props.banner.link === '' ? 'Unisex' : props.banner.link}`
                                            ,state: {
                                                'categoryName': menu.link,
                                                'genderName': props.banner.link,
                                                'search': ''
                                            }
                                            })}}
                                            color="inherit" underline="none" style={{ color: 'inherit', textDecoration: 'inherit',display:'flex' }}
                                        >
                                            {index==0?
                                                <img
                                                onClick={()=>{history.push({pathname: `/Products/${menu.link}/All/${props.banner.link === '' ? 'Unisex' : props.banner.link}`
                                                ,state: {
                                                        'categoryName': menu.link,
                                                        'genderName': props.banner.link,
                                                        'search': ''
                                                    }
                                                    })}}
                                                    style={{ width: '43px',height:"20px",marginLeft:"97px",marginTop:"25px",cursor:'pointer'}}
                                                    
                                                    src={isEntered[index]?_sunglassIcon:sunglassIcon}
                                                    
                                                    onMouseEnter={() => {let list=[...isEntered]; list[index] =true; setIsEntered(list)}}
                                                    onMouseLeave={() => {let list=[...isEntered]; list[index] =false; setIsEntered(list)}}
                                                />
                                                
                                            :index==1?
                                                <img
                                                onClick={()=>{history.push({pathname: `/Products/${menu.link}/All/${props.banner.link === '' ? 'Unisex' : props.banner.link}`
                                                ,state: {
                                                        'categoryName': menu.link,
                                                        'genderName': props.banner.link,
                                                        'search': ''
                                                    }
                                                    })}}
                                                    style={{ width: '43px',height:"20px",marginLeft:"97px",marginTop:"40px",marginBottom:"43px",
                                                        filter: isEntered[index]?"invert(0%) sepia(0%) saturate(2%) hue-rotate(208deg) brightness(261%) contrast(101%)":"invert(70%) sepia(2%) saturate(0%) hue-rotate(8deg) brightness(143%) contrast(89%)"
                                                        ,
                                                        cursor:'pointer'
                                                    }}
                                                    src={isEntered[index]?frameIcon:_frameIcon}
                                                    onMouseEnter={() => {let list=[...isEntered]; list[index] =true; setIsEntered(list)}}
                                                    onMouseLeave={() => {let list=[...isEntered]; list[index] =false; setIsEntered(list)}}
                                                />
                                            :
                                                <img
                                                onClick={()=>{history.push({pathname: `/Products/${menu.link}/All/${props.banner.link === '' ? 'Unisex' : props.banner.link}`
                                                ,state: {
                                                        'categoryName': menu.link,
                                                        'genderName': props.banner.link,
                                                        'valueId': "Unisex",
                                                        'search': ''
                                                    }
                                                    })}}
                                                    style={{ width: '25px',height:"25px" ,marginLeft:'105px',fill: "red",
                                                        filter: isEntered[index]?"invert(0%) sepia(0%) saturate(2%) hue-rotate(208deg) brightness(261%) contrast(101%)":"invert(70%) sepia(2%) saturate(0%) hue-rotate(2deg) brightness(143%) contrast(89%)"
                                                        ,cursor:'pointer'
                                                    }}
                                                    src={isEntered[index]?accessoriesIcon:_accessoriesIcon}
                                                    onMouseEnter={() => {let list=[...isEntered]; list[index] =true; setIsEntered(list)}}
                                                    onMouseLeave={() => {let list=[...isEntered]; list[index] =false; setIsEntered(list)}}
                                                />
                                            }
                                            <p 
                                                
                                                onClick={()=>{history.push({pathname: `/Products/${menu.link}/All/${props.banner.link === '' ? 'Unisex' : props.banner.link}`
                                                ,state: {
                                                    'categoryName': menu.link,
                                                    'genderName': props.banner.link,
                                                    'valueId': "Unisex",
                                                    'search': ''
                                                }
                                                })}}

                                                
                                                style={{ marginBottom: "10px" ,marginLeft:index==2?"42px":"32px",marginTop:index==0?"23px":index==1?"39px":0,
                                                    color:isEntered[index]?"#FFFFFF":"#757575"
                                                    ,cursor:'pointer'
                                                }}
                                                    
                                                onMouseEnter={() => {let list=[...isEntered]; list[index] =true; setIsEntered(list)}}
                                                onMouseLeave={() => {let list=[...isEntered]; list[index] =false; setIsEntered(list)}}
                                                
                                            >
                                                {menu.title}
                                            </p>
                                        </Link>
                                    )
                                })}
                            </Grid>
                        </Grid>
                    </Grid>
                
                : 
                
                    <Grid xs={12} md={12} display='flex'>
                        <Grid xs={7.5} md={7.5} className="backImage" style={{ alignItems: 'center',paddingBottom:0,paddingTop:0 }}>
                            <img style={{ displayL: 'block', width: '100%', height: '390px', objectFit: 'cover' , filter: "grayscale(1)" }} src={axiosConfig.defaults.baseURL + props.banner.file.image_url} />

                            <Grid className="textIn" style={style} bgcolor='rgba(0, 0, 0, 0.7)' height='392px'>

                                <Link
                                    color="inherit" underline="none" style={{ color: 'inherit', textDecoration: 'inherit' }}
                                    
                                >
                                    <h1 style={{ marginTop: "0" ,backgroundColor:"#9E9E9E",height:"153px",width:'2px',marginLeft:"116px"}} >
                                    </h1>
                                </Link>
                                {props.banner.sub_menu.map((menu,index) => {
                                    return (
                                        <Link
                                            onClick={()=>{history.push({pathname: `/Products/${menu.link}/All/${props.banner.link === '' ? 'Unisex' : props.banner.link}`
                                            ,state: {
                                                'categoryName': menu.link,
                                                'genderName': props.banner.link,
                                                'search': ''
                                            }
                                            })}}
                                            color="inherit" underline="none" style={{ color: 'inherit', textDecoration: 'inherit',display:'flex' }}
                                        >
                                            {index==0?
                                                <img
                                                onClick={()=>{history.push({pathname: `/Products/${menu.link}/All/${props.banner.link === '' ? 'Unisex' : props.banner.link}`
                                                ,state: {
                                                        'categoryName': menu.link,
                                                        'genderName': props.banner.link,
                                                        'search': ''
                                                    }
                                                    })}}
                                                    style={{ width: '43px',height:"20px",marginLeft:"97px",marginTop:"25px",
                                                    cursor:'pointer'}}
                                                    
                                                    src={isEntered[index]?_sunglassIcon:sunglassIcon}
                                                    
                                                    onMouseEnter={() => {let list=[...isEntered]; list[index] =true; setIsEntered(list)}}
                                                    onMouseLeave={() => {let list=[...isEntered]; list[index] =false; setIsEntered(list)}}
                                                />
                                                
                                            :index==1?
                                                <img
                                                onClick={()=>{history.push({pathname: `/Products/${menu.link}/All/${props.banner.link === '' ? 'Unisex' : props.banner.link}`
                                                ,state: {
                                                        'categoryName': menu.link,
                                                        'genderName': props.banner.link,
                                                        'search': ''
                                                    }
                                                    })}}
                                                    style={{ width: '43px',height:"20px",marginLeft:"97px",marginTop:"40px",marginBottom:"43px",
                                                        filter: isEntered[index]?"invert(0%) sepia(0%) saturate(2%) hue-rotate(208deg) brightness(261%) contrast(101%)":"invert(70%) sepia(2%) saturate(0%) hue-rotate(2deg) brightness(143%) contrast(89%)"
                                                        ,
                                                        cursor:'pointer'
                                                    }}
                                                    src={isEntered[index]?frameIcon:_frameIcon}
                                                    onMouseEnter={() => {let list=[...isEntered]; list[index] =true; setIsEntered(list)}}
                                                    onMouseLeave={() => {let list=[...isEntered]; list[index] =false; setIsEntered(list)}}
                                                />
                                            :
                                                <img
                                                onClick={()=>{history.push({pathname: `/Products/${menu.link}/All/${props.banner.link === '' ? 'Unisex' : props.banner.link}`
                                                ,state: {
                                                        'categoryName': menu.link,
                                                        'genderName': props.banner.link,
                                                        'search': ''
                                                    }
                                                    })}}
                                                    style={{ width: '25px',height:"25px" ,marginLeft:'105px',fill: "red",
                                                        filter: isEntered[index]?"invert(0%) sepia(0%) saturate(2%) hue-rotate(208deg) brightness(261%) contrast(101%)":"invert(70%) sepia(2%) saturate(0%) hue-rotate(2deg) brightness(143%) contrast(89%)"
                                                        ,
                                                        cursor:'pointer'
                                                    }}
                                                    src={isEntered[index]?accessoriesIcon:_accessoriesIcon}
                                                    onMouseEnter={() => {let list=[...isEntered]; list[index] =true; setIsEntered(list)}}
                                                    onMouseLeave={() => {let list=[...isEntered]; list[index] =false; setIsEntered(list)}}
                                                />
                                            }
                                            <p 
                                                
                                                onClick={()=>{history.push({pathname: `/Products/${menu.link}/All/${props.banner.link === '' ? 'Unisex' : props.banner.link}/`
                                                ,state: {
                                                    'categoryName': menu.link,
                                                    'genderName': props.banner.link,
                                                    'search': ''
                                                }
                                                })}}
                                                style={{ marginBottom: "10px" ,marginLeft:index==2?"42px":"32px",marginTop:index==0?"23px":index==1?"39px":0,
                                                    color:isEntered[index]?"#FFFFFF":"#757575"
                                                    ,cursor:'pointer'
                                                }}
                                                    
                                                onMouseEnter={() => {let list=[...isEntered]; list[index] =true; setIsEntered(list)}}
                                                onMouseLeave={() => {let list=[...isEntered]; list[index] =false; setIsEntered(list)}}
                                                
                                            >
                                                {menu.title}
                                            </p>
                                        </Link>
                                    )
                                })}
                            </Grid>
                        </Grid>
                        <Grid xs={4.5} md={4.5} className="backImage" bgcolor="White.main" display='flex' justifyContent='center' style={{ alignItems: 'center' }}>
                            <Typography variant='h24' fontWeight='500' color='Black1.main'>{props.banner.title.toUpperCase()}</Typography>
                        </Grid>
                    
                    </Grid>)
            :
            (props.banner.title== "Women"?
            <Grid xs={12} md={12}>
                <Grid xs={12} md={12} className="backImage" style={{ alignItems: 'center' }}>
                    <img style={{ displayL: 'block', width: '100%', height: '420px', objectFit: 'cover', filter: "grayscale(1)" }} src={axiosConfig.defaults.baseURL + props.banner.file.image_url} />

                    <Grid className="textIn" style={style} bgcolor='rgba(0, 0, 0, 0.7)' pt="200px" height='421.5px'>

                        
                        {props.banner.sub_menu.map((menu,index) => {
                            return (
                                <Link
                                    color="inherit" underline="none" style={{ color: 'inherit', textDecoration: 'inherit',display:'flex' ,justifyContent:'start',textAlign:'end'}}
                                >
                                    {index==0?
                                        <img
                                        onClick={()=>{history.push({pathname: `/Products/${menu.link}/All/${props.banner.link === '' ? 'Unisex' : props.banner.link}`
                                        ,state: {
                                                    'categoryName': menu.link,
                                                    'genderName': props.banner.link,
                                                    'search': ''
                                                }
                                                })}}
                                            style={{ width: '43px',height:"20px",marginTop:"25px",marginLeft:"40px",cursor:'pointer'}}
                                            
                                            src={isEntered[index]?_sunglassIcon:sunglassIcon}
                                                
                                            onMouseEnter={() => {let list=[...isEntered]; list[index] =true; setIsEntered(list)}}
                                            
                                            onMouseLeave={() => {let list=[...isEntered]; list[index] =false; setIsEntered(list)}}
                                        />
                                        
                                    :index==1?
                                        <img
                                        onClick={()=>{history.push({pathname: `/Products/${menu.link}/All/${props.banner.link === '' ? 'Unisex' : props.banner.link}`
                                        ,state: {
                                                    'categoryName': menu.link,
                                                    'genderName': props.banner.link,
                                                    'search': ''
                                                }
                                                })}}
                                            
                                            style={{ width: '43px',height:"20px",marginTop:"40px",marginBottom:"43px",marginLeft:"40px",
                                                filter: isEntered[index]?"invert(0%) sepia(0%) saturate(2%) hue-rotate(208deg) brightness(111%) contrast(101%)":"invert(70%) sepia(2%) saturate(0%) hue-rotate(2deg) brightness(143%) contrast(89%)"
                                                ,cursor:'pointer'
                                            }}
                                            src={isEntered[index]?frameIcon:_frameIcon}
                                            onMouseEnter={() => {let list=[...isEntered]; list[index] =true; setIsEntered(list)}}
                                            
                                            onMouseLeave={() => {let list=[...isEntered]; list[index] =false; setIsEntered(list)}}
                                            />
                                    :
                                        <img
                                        onClick={()=>{history.push({pathname: `/Products/${menu.link}/All/${props.banner.link === '' ? 'Unisex' : props.banner.link}`
                                        ,state: {
                                                    'categoryName': menu.link,
                                                    'genderName': props.banner.link,
                                                    'search': ''
                                                }
                                                })}}
                                            style={{ width: '25px',height:"25px" ,marginLeft:"48px",
                                                filter: isEntered[index]?"invert(0%) sepia(0%) saturate(2%) hue-rotate(208deg) brightness(111%) contrast(101%)":"invert(70%) sepia(2%) saturate(0%) hue-rotate(2deg) brightness(143%) contrast(89%)"
                                                ,cursor:'pointer'
                                            }}
                                            src={isEntered[index]?accessoriesIcon:_accessoriesIcon}
                                            onMouseEnter={() => {let list=[...isEntered]; list[index] =true; setIsEntered(list)}}
                                           
                                            onMouseLeave={() => {let list=[...isEntered]; list[index] =false; setIsEntered(list)}}
                                        />
                                    }
                                    <p 
                                        onClick={()=>{history.push({pathname: `/Products/${menu.link}/All/${props.banner.link === '' ? 'Unisex' : props.banner.link}`})}}
                                        style={{ marginBottom: "10px" ,marginLeft:index==2?"33px":"22px",marginTop:index==0?"23px":index==1?"39px":0,
                                            color:isEntered[index]?"#FFFFFF":"#757575"
                                            ,cursor:'pointer'
                                        }}
                                        
                                        onMouseEnter={() => {let list=[...isEntered]; list[index] =true; setIsEntered(list)}}
                                        onMouseLeave={() => {let list=[...isEntered]; list[index] =false; setIsEntered(list)}}
                                    >
                                        {menu.title}
                                    </p>
                                </Link>
                            )
                        })}
                    </Grid>
                </Grid>
                <Grid height="80px" xs={12} md={12} className="backImage" bgcolor="rgba(0, 0, 0, 0.7)" display='flex' justifyContent='center' style={{ alignItems: 'center' }}>
                    <Typography variant='h38' color='White.main'>{props.banner.title.toUpperCase()}</Typography>
                </Grid>
            </Grid>
            
            :
            <Grid xs={12} md={12} >
                <Grid xs={12} md={12} className="backImage" style={{ alignItems: 'center' }} >
                    <img style={{ displayL: 'block', width: '100%', height: '420px', objectFit: 'cover', filter: "grayscale(1)" }} src={axiosConfig.defaults.baseURL + props.banner.file.image_url} />

                    <Grid className="textIn" style={style} bgcolor='rgba(255,255,255,0.7)' pt="200px" boxShadow={0}>

                        {props.banner.sub_menu.map((menu,index) => {
                            return (
                                <Link
                                    color="inherit" underline="none" style={{ color: 'inherit', textDecoration: 'inherit',display:'flex' ,justifyContent:'start',textAlign:'end'}}
                                >
                                    {index==0?
                                        <img
                                            
                                        onClick={()=>{history.push({pathname: `/Products/${menu.link}/All/${props.banner.link === '' ? 'Unisex' : props.banner.link}`
                                        ,state: {
                                                    'categoryName': menu.link,
                                                    'genderName': props.banner.link,
                                                    'search': ''
                                                }
                                                })}}
                                            style={{ width: '43px',height:"20px",marginLeft:"40px",marginTop:"25px",cursor:'pointer'}}
                                            
                                            src={isEntered[index]?_sunglassIcon:_sunglassIcon_}
                                                
                                            onMouseEnter={() => {let list=[...isEntered]; list[index] =true; setIsEntered(list)}}
                                            onMouseLeave={() => {let list=[...isEntered]; list[index] =false; setIsEntered(list)}}
                                        />
                                        
                                    :index==1?
                                        <img
                                        onClick={()=>{history.push({pathname: `/Products/${menu.link}/All/${props.banner.link === '' ? 'Unisex' : props.banner.link}`
                                        ,state: {
                                                    'categoryName': menu.link,
                                                    'genderName': props.banner.link,
                                                    'search': ''
                                                }
                                                })}}
                                            style={{ width: '43px',height:"20px",marginTop:"40px",marginBottom:"43px",marginLeft:"40px",
                                            filter: isEntered[index]?"invert(93%) sepia(80%) saturate(0%) hue-rotate(241deg) brightness(108%) contrast(101%)":"invert(0%) sepia(95%) saturate(21%) hue-rotate(2deg) brightness(101%) contrast(107%)"
                                            ,cursor:'pointer'}}
                                            src={_frameIcon_}
                                            onMouseEnter={() => {let list=[...isEntered]; list[index] =true; setIsEntered(list)}}
                                            onMouseLeave={() => {let list=[...isEntered]; list[index] =false; setIsEntered(list)}}
                                        />
                                    :
                                        <img
                                        onClick={()=>{history.push({pathname: `/Products/${menu.link}/All/${props.banner.link === '' ? 'Unisex' : props.banner.link}`
                                        ,state: {
                                                    'categoryName': menu.link,
                                                    'genderName': props.banner.link,
                                                    'search': ''
                                                }
                                            })}}
                                            style={{ width: '25px',height:"25px" ,marginLeft:"48px",
                                            filter: isEntered[index]?"invert(93%) sepia(80%) saturate(0%) hue-rotate(241deg) brightness(108%) contrast(101%)":"invert(0%) sepia(95%) saturate(21%) hue-rotate(2deg) brightness(101%) contrast(107%)"
                                            ,cursor:'pointer'}}
                                            src={_accessoriesIcon_}
                                            onMouseEnter={() => {let list=[...isEntered]; list[index] =true; setIsEntered(list)}}
                                            onMouseLeave={() => {let list=[...isEntered]; list[index] =false; setIsEntered(list)}}
                                        />
                                    }
                                    <p 
                                        onClick={()=>{history.push({pathname: `/Products/${menu.link}/All/${props.banner.link === '' ? 'Unisex' : props.banner.link}`})}}
                                        style={{ marginBottom: "10px" ,marginLeft:index==2?"33px":"22px",marginTop:index==0?"23px":index==1?"39px":0,
                                            color:isEntered[index]?"#FFFFFF":"#000000"
                                            ,cursor:'pointer'
                                        }}
                                        
                                        onMouseEnter={() => {let list=[...isEntered]; list[index] =true; setIsEntered(list)}}
                                        onMouseLeave={() => {let list=[...isEntered]; list[index] =false; setIsEntered(list)}}
                                    >
                                        {menu.title}
                                    </p>
                                </Link>
                            )
                        })}
                    </Grid>
                </Grid>
                <Grid height="80px" xs={12} md={12} className="backImage" bgcolor="White.main" display='flex' justifyContent='center' mt="-10px" style={{ alignItems: 'center' }}>
                    <Typography variant='h38' color='Black1.main'>{props.banner.title.toUpperCase()}</Typography>
                </Grid>
            </Grid>
            ))
        :
            (window.innerWidth>900?
                (props.banner.title== "Color"?
                <Grid xs={12} md={12} display='flex' 
                    sx={{cursor:'pointer'}}
                    onClick={()=>{history.push({pathname: `/Products/${props.banner.link+"ContactLens"}/All/All`
                    ,state: {
                        categoryName: props.banner.link+" Contact Lenses",
                        'genderName': "All",
                        'search': ''
                    }
                    })}}
                >
                    <Grid xs={9} md={9} className="backImage" style={{ alignItems: 'center' ,borderTopRightRadius:"50px"}} >
                        <img style={{ displayL: 'block', width: '100%', height: window.innerWidth>1280? '258px':window.innerWidth>960?"205px":window.innerWidth>930?"190px":"185px", objectFit: 'cover',objectPosition:window.innerWidth>1250?"10% 5%":"0 0",borderTopRightRadius:"50px" }} src={axiosConfig.defaults.baseURL + props.banner.file.image_url} />
                    </Grid>
                    
                    <Grid xs={3} md={3} className="backImage" bgcolor="Black1.main" display='flex' justifyContent='center' style={{ alignItems: 'center' }}
                        sx={{borderTopLeftRadius:"50px"}}
                    >
                        <Typography variant='h24' fontWeight='500' color='White.main'>{props.banner.title}</Typography>
                    </Grid>
                </Grid>
                
                :
                <Grid xs={12} md={12} display='flex' 
                    sx={{cursor:'pointer'}}
                    onClick={()=>{history.push({pathname: `/Products/${props.banner.link+"ContactLens"}/All/All`
                    ,state: {
                        categoryName: props.banner.link+" Contact Lenses",
                        'genderName': "All",
                        'search': ''
                    }
                    })}}
                >

                    <Grid xs={3} md={3} className="backImage" bgcolor="White.main" display='flex' justifyContent='center' style={{ alignItems: 'center' }}
                        sx={{borderBottomRightRadius:"50px"}}
                    >
                        <Typography variant='h24' fontWeight='500' color='Black1.main'>{props.banner.title}</Typography>
                    </Grid>
                    <Grid xs={9} md={9} className="backImage" style={{ alignItems: 'center' ,borderBottomLeftRadius:"50px"}}>
                        <img style={{ displayL: 'block', width: '100%', height: window.innerWidth>1280? '258px':window.innerWidth>960?"205px":window.innerWidth>930?"190px":"185px", objectFit: 'cover' ,borderBottomLeftRadius:"50px"}} src={axiosConfig.defaults.baseURL + props.banner.file.image_url} />

                        
                    </Grid>
                    
                </Grid>)
            :
                (props.banner.title== "Color"?
                <Grid xs={12} md={12} display='flex'
                    sx={{cursor:'pointer'}}
                    onClick={()=>{history.push({pathname: `/Products/${props.banner.link+"ContactLens"}/All/All`
                    ,state: {
                        categoryName: props.banner.link+" Contact Lenses",
                        'genderName': "All",
                        'search': ''
                    }
                    })}}
                >
                    <Grid xs={9} md={9} className="backImage" style={{ alignItems: 'center' ,borderTopRightRadius:"50px"}} >
                        <img style={{ displayL: 'block', width: '100%', height: window.innerWidth>855?'185px':window.innerWidth>767?'165px':window.innerWidth>745?"160px":window.innerWidth>628?"140px":"120px", objectFit: 'cover',borderTopRightRadius:"50px",objectPosition:"0 -1px" }} src={axiosConfig.defaults.baseURL + props.banner.file.image_url} />

                        
                    </Grid>
                    <Grid xs={3} md={3} className="backImage" bgcolor="Black1.main" display='flex' justifyContent='center' style={{ alignItems: 'center' }}
                        sx={{borderTopLeftRadius:"50px"}}
                    >
                        <Typography variant='h2' fontSize='22px' color='White.main'>{props.banner.title}</Typography>
                    </Grid>
                </Grid>
                
                :
                <Grid xs={12} md={12} display='flex'
                    sx={{cursor:'pointer'}}
                    onClick={()=>{history.push({pathname: `/Products/${props.banner.link+"ContactLens"}/All/All`
                    ,state: {
                        categoryName: props.banner.link+" Contact Lenses",
                        'genderName': "All",
                        'search': ''
                    }
                    })}}
                >
                    <Grid xs={3} md={3} className="backImage" bgcolor="White.main" display='flex' justifyContent='center' style={{ alignItems: 'center' }}
                        sx={{borderBottomRightRadius:"50px"}}
                    >
                        <Typography variant='h2' fontSize='22px' color='Black1.main'>{props.banner.title}</Typography>
                    </Grid>
                    <Grid xs={9} md={9} className="backImage" style={{ alignItems: 'center' ,borderBottomLeftRadius:"50px"}}>
                        <img style={{ displayL: 'block', width: '100%', height: window.innerWidth>855?'190px':window.innerWidth>767?'173px':window.innerWidth>745?"165px":window.innerWidth>628?"150px":"140px", objectFit: 'cover' ,borderBottomLeftRadius:"50px"}} src={axiosConfig.defaults.baseURL + props.banner.file.image_url} />
                    </Grid>
                    
                </Grid>)  
            )
    )
}

export default Posters