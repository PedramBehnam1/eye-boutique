import {
    Divider,
    Grid,
    Menu,
    Typography,
    SvgIcon,
    Card,
    CardMedia,
    Snackbar,
    IconButton
  } from "@mui/material";
  import React, { useState, useEffect } from "react";
  import { useHistory } from "react-router-dom";
  import axiosConfig from "../axiosConfig";
  import orderIcon from "../asset/images/order.png"
  import ShoppingCart from '../components/homePage/cart/ShoppingCart';
  import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
  import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
  import profile from '../asset/images/fi_user.png'
  import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
  
  const Profile = (props) => {
    const [windowResizing, setWindowResizing] = useState(false);
    let history = useHistory();
    const [anchorElAdmin, setAnchorElAdmin] = useState(null);
    let openAdmin = Boolean(anchorElAdmin);
    const [user, setUser] = useState("11");
    const [openCart, setOpenCart] = useState(false);
    const [counter, setCounter] = useState(0);
    const [role, setRole] = useState('');
    const [openMassage, setOpenMassage] = useState(false);
    const [showMassage, setShowMassage] = useState('');
  
    
    useEffect(() => {
      let timeout;
      const handleResize = () => {
        clearTimeout(timeout);
  
        setWindowResizing(true);
  
        timeout = setTimeout(() => {
          setWindowResizing(false);
        }, 200);
      };
      window.addEventListener("resize", handleResize);
  
      return () => window.removeEventListener("resize", handleResize);
    }, []);
  
    useEffect(()=>{
      getUserInfo();
    },[])
  
  
  
  
    
 
  
  
  
    const getUserInfo = () => {
      axiosConfig
        .get("/users/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          let user = res.data.user
          setUser(user);
          
          
          axiosConfig
            .get("/users/get_roles", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            }).then((res) => {
                res.data.roles_list.map(role=>{
                    if (role.id == user.role) {
                        setRole(role.title);
                    }
                })
            })
        })
        .catch((err) =>{
          if(err.response.data.error.status === 401){
            axiosConfig
                .post("/users/refresh_token", {
                  refresh_token: localStorage.getItem("refreshToken"),
                })
                .then((res) => {
                  localStorage.setItem("token", res.data.accessToken);
                  localStorage.setItem("refreshToken", res.data.refreshToken);
                  getUserInfo();
                })
            }else{
                setShowMassage('Get user info has a problem!')
                setOpenMassage(true) 
            }
        });
    };
  
    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
          return;
        }
    
        setOpenMassage(false);
    };
  
    return (
      <Grid sx={{cursor:"pointer"}}> 
      {!localStorage.getItem("token") ? 
        <Grid
        variant="contained"
        color="White"
        sx={{
        background: "none",
        color: "white",
        mt:"3px",
        pt:"2px",
        cursor:"pointer",
        display:'flex',
        flexDirection:'column',
        justifyContent:'space-around',
        alignItems:'center'
        }}
        aria-controls={openAdmin ? "basic-menu-admin" : undefined}
        aria-haspopup="true"
        aria-expanded={openAdmin ? "true" : undefined}
        onClick={(event) => setAnchorElAdmin(event.currentTarget) }
        
    >
        <SvgIcon
            titleAccess="title"
            sx={{fontSize:'50px',width:'100%',overflow:'hidden'}}
            {...props}
            component={(componentProps) => (
                <svg width="50px" height="10.5" viewBox="0 0 18 8.1" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M4.37133 2.8598C5.7042 1.98956 7.26134 1.51692 8.84285 1.50045C10.4239 1.48398 11.9514 1.92395 13.235 2.75403C14.5177 3.58359 15.502 4.76685 16.0703 6.15161L17.458 5.5821C16.7719 3.9105 15.5858 2.48799 14.0495 1.49448C12.5133 0.500968 10.6959 -0.0189346 8.82723 0.000527056C6.95856 0.0199882 5.12252 0.577933 3.55128 1.60381C1.98004 2.62969 0.74419 4.07742 0 5.76392L1.37233 6.36948C1.99707 4.95368 3.03865 3.72992 4.37133 2.8598Z" fill="white"/>
                </svg>
            )}
        />
        <Card
        elevation={0}
        sx={{ background: "rgba(0,0,0,0)" ,overflow:'visible'}}
        >
            <CardMedia
                sx={{ width: "16px",mt:'-6.5px', color: "white", cursor: "pointer" }}
                component="img"
                image={profile}
            ></CardMedia>
        </Card>
        <SvgIcon
            titleAccess="title"
            sx={{width:'40px'}}
            {...props}
            component={(componentProps) => (
                <svg width="50px" height="10.5" viewBox="0 0 18 8.2" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M13.0867 3.5097C11.7538 4.37995 10.1967 4.85259 8.61515 4.86906C7.03411 4.88553 5.50658 4.44555 4.22304 3.61547C2.9403 2.78592 1.95604 1.60266 1.38773 0.217899L4.81717e-05 0.787403C0.686074 2.45901 1.87221 3.88151 3.40847 4.87503C4.94472 5.86854 6.76209 6.38844 8.63078 6.36898C10.4994 6.34952 12.3355 5.79157 13.9067 4.7657C15.478 3.73982 16.7138 2.29209 17.458 0.605588L16.0857 2.84903e-05C15.4609 1.41582 14.4194 2.63959 13.0867 3.5097Z" fill="white"/>
                </svg>
            )}
        />
        </Grid>
        :
        <Grid
            variant="contained"
            color="White"
            sx={{
            background: "none",
            color: "white",
            cursor:"pointer",
            display:'flex',
            flexDirection:'column',
            justifyContent:'space-around',
            alignItems:'center'
            }}
            aria-controls={openAdmin ? "basic-menu-admin" : undefined}
            aria-haspopup="true"
            aria-expanded={openAdmin ? "true" : undefined}
            onClick={(event) => setAnchorElAdmin(event.currentTarget) }
            
        >
            <SvgIcon
                titleAccess="title"
                sx={{fontSize:'50px',width:'100%'}}
                {...props}
                component={(componentProps) => (
                    <svg width="50px" height="10" viewBox="0 0 18 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M4.37133 2.8598C5.7042 1.98956 7.26134 1.51692 8.84285 1.50045C10.4239 1.48398 11.9514 1.92395 13.235 2.75403C14.5177 3.58359 15.502 4.76685 16.0703 6.15161L17.458 5.5821C16.7719 3.9105 15.5858 2.48799 14.0495 1.49448C12.5133 0.500968 10.6959 -0.0189346 8.82723 0.000527056C6.95856 0.0199882 5.12252 0.577933 3.55128 1.60381C1.98004 2.62969 0.74419 4.07742 0 5.76392L1.37233 6.36948C1.99707 4.95368 3.03865 3.72992 4.37133 2.8598Z" fill="white"/>
                    </svg>
                )}
            />
            <Typography color="inherit" variant={user!='11'?"ProfileName":"h39" }  lineHeight={0.8}>{user!='11'? (user.first_name.charAt(0).toUpperCase()+""+user.last_name.charAt(0).toUpperCase()):'N/A'}</Typography> 
                    
            <SvgIcon
                titleAccess="title"
                sx={{width:'40px'}}
                {...props}
                component={(componentProps) => (
                    <svg width="50px" height="10" viewBox="0 0 18 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M13.0867 3.5097C11.7538 4.37995 10.1967 4.85259 8.61515 4.86906C7.03411 4.88553 5.50658 4.44555 4.22304 3.61547C2.9403 2.78592 1.95604 1.60266 1.38773 0.217899L4.81717e-05 0.787403C0.686074 2.45901 1.87221 3.88151 3.40847 4.87503C4.94472 5.86854 6.76209 6.38844 8.63078 6.36898C10.4994 6.34952 12.3355 5.79157 13.9067 4.7657C15.478 3.73982 16.7138 2.29209 17.458 0.605588L16.0857 2.84903e-05C15.4609 1.41582 14.4194 2.63959 13.0867 3.5097Z" fill="white"/>
                    </svg>
                )}
            />
        </Grid>
        
      }
        <Menu
            id="basic-menu-admin"
            anchorEl={anchorElAdmin}
            open={openAdmin}
            onClose={() => setAnchorElAdmin(null)}
            MenuListProps={{
            "aria-labelledby": "basic-button",
            }}
            sx={{ '.MuiPaper-root': { width: '300px' ,height:!localStorage.getItem("token")? "300px":( props.pageName=="home"?"470px" :"440px"),bgcolor:'GrayLight2.main'} }}
        >
            {!localStorage.getItem("token") ? (
                <Grid sx={{height:"270px" , display:'flex' , flexDirection:'column', justifyContent:'center',alignSelf:'center'}}>
                    <Grid width='100%' display='flex' justifyContent="center" textAlign='center' >
                        <Grid sx={{
                            width:"64px",
                            height:"64px",
                            backgroundColor:'P.main',
                            display:'flex' ,
                            alignItems:'center',
                            justifyContent:'center',
                            borderRadius:'30px'
                        }}>
                            <Typography variant="h31" fontSize="26px" color="White.main">N/A</Typography>
                        </Grid>
                    </Grid>
                    <Grid width='100%' display='flex' justifyContent="center" textAlign='center' mt="15px">
                        <Grid sx={{
                            display:'flex' ,
                            alignItems:'center',
                            justifyContent:'center'
                        }}>
                            <Typography variant="h28" fontSize="16px" color='G2.main' >Please login first..!</Typography>
                        </Grid>

                    </Grid>
                    <Grid sx={{width:'100%',display:'flex' , justifyContent:'center',mt:"15px"}}>
                        <Grid sx={{
                            width:"115px",
                            height:"35px",
                            backgroundColor:'G2.main',
                            display:'flex' ,
                            alignItems:'center',
                            justifyContent:'center',
                            borderRadius:'30px',
                            cursor:'pointer'
                        }}
                            onClick={() => {
                                
                                setAnchorElAdmin(null);
                                history.push("/loginPage")
                            }}
                        >
                            <Typography variant="h28" color="White.main">{!localStorage.getItem("token") ?"Sign in" :"Sign out"}</Typography>
                        </Grid>

                    </Grid>
                </Grid>
            ) : (
            <Grid >
                <Grid width='100%' display='flex' justifyContent="center" textAlign='center' mt="25px">
                    <Grid sx={{
                        width:"64px",
                        height:"64px",
                        backgroundColor:'P.main',
                        display:'flex' ,
                        alignItems:'center',
                        justifyContent:'center',
                        borderRadius:'30px'
                    }}>
                        <Typography variant="h31" fontSize={user!='11'?'30px':"26px"} color="White.main">{user!='11'? (user.first_name.charAt(0).toUpperCase()+""+user.last_name.charAt(0).toUpperCase()):'N/A'}</Typography>
                    </Grid>
                </Grid>
                <Grid width='100%' display='flex' justifyContent="center" textAlign='center' mt="15px">
                <Typography variant="h28" fontSize="16px" color='G2.main'>{user!='11'? (user.first_name+"  "+user.last_name):''}</Typography>
                </Grid>
                <Grid width='100%' display='flex' justifyContent="center"  >
                <Typography variant="h28" fontSize="16px" color='G2.main'>{user!='11'? (user.email):''}</Typography>
                </Grid>

                {
                    (props.pageName === "home"|| props.pageName ==="admin")&&(
                        <Grid width='100%' display='flex' justifyContent="center" textAlign='center' mt="25px">
                            <Grid sx={{
                                width:"115px",
                                height:"35px",
                                backgroundColor:'P.main',
                                display:'flex' ,
                                alignItems:'center',
                                justifyContent:'center',
                                borderRadius:'30px',
                                cursor:'pointer'
                            }}
                                onClick={() => history.push("/home/profile/profile")}
                            >
                                <Typography variant="h28" color="White.main">Account</Typography>
                            </Grid>
                        </Grid> 
                    )
                }
                
                {
                    (props.pageName === "home"|| props.pageName ==="profile")?(role == "super admin" || role == "admin") &&(
                        <Grid width='100%' display='flex' justifyContent="center" textAlign='center' mt={props.pageName ==="profile"?"25px":"4px"}>
                            <Grid sx={{
                                width:"115px",
                                height:"35px",
                                backgroundColor:'P.main',
                                display:'flex' ,
                                alignItems:'center',
                                justifyContent:'center',
                                borderRadius:'30px',
                                cursor:'pointer'
                            }}
                                onClick={() => history.push("/admin/product")}
                            >
                                <Typography variant="h28" color="White.main">Admin</Typography>
                            </Grid>
                        </Grid> 
                    ):""
                } 
                <Grid width='100%' display='flex' justifyContent="center" textAlign='center' mt="4px">
                <Grid sx={{
                    width:"115px",
                    height:"35px",
                    backgroundColor:'G2.main',
                    display:'flex' ,
                    alignItems:'center',
                    justifyContent:'center',
                    borderRadius:'30px',
                    cursor:'pointer'
                }}
                    onClick={() => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('refreshToken');
                        setAnchorElAdmin(null);
                        history.push("/loginPage")
                    }}
                >
                    <Typography variant="h28" color="White.main">{!localStorage.getItem("token") ?"Sign in" :"Sign out"}</Typography>
                </Grid>
                
                </Grid>  
                <Grid width='100%' display='flex' justifyContent="center" textAlign='center' mt="4px">
                <Divider  sx={{color:'red',width:"80%",backgroundColor:'P.main',mt:"30px"}} />
                </Grid>  
                
                <Grid width='100%' display='flex' justifyContent="center" textAlign='center' mt="17px" mb="12.5px">
                <Grid onClick={() => {setAnchorElAdmin(null);history.push({pathname:'/home/profile/orders'})}}
                    sx={{cursor:'pointer'}}
                >
                    <img src={orderIcon}  width="22px" height='22px'  />

                </Grid>
                <Grid sx={{ml:'10px',cursor:'pointer'}} onClick={() => {setAnchorElAdmin(null);history.push({pathname:'/home/profile/wishlist'})}}>
                    <FavoriteBorderOutlinedIcon   color="G2" />

                </Grid>
                <Grid sx={{ml:'10px',pr:"1px"}}>
                    <ModeCommentOutlinedIcon color="G2" />

                </Grid>
                
                </Grid>  
                <Grid width='100%' display='flex' justifyContent="center" textAlign='center'>
                <Divider  sx={{color:'red',width:"80%",backgroundColor:'P.main'}} />
                </Grid>
                <Grid width='100%' display='flex' justifyContent="center" textAlign='center' mt="40px">
                <Typography color="G2.main" fontSize="14px">Privacy Policy .Terms And Conditions</Typography>
                </Grid>  


            </Grid>
            )}
        </Menu>
        {localStorage.getItem('token') !=null&&(
            <ShoppingCart
                open={openCart}
                close={(temp) => setOpenCart(temp)}
                counter={(counter) => setCounter(counter)}
            />

        )}
                                                                
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
      </Grid>
    );
  };
  
  export default Profile;
  