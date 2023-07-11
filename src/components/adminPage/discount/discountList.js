import React, {  useState, useEffect } from "react";
import {
  Grid,
  IconButton,
  List,
  ListItem,
  Menu,
  MenuItem,
  Paper,
  Typography,
  FormControl,
  Select,
  InputBase,
  Snackbar,
} from "@mui/material";
import SearchIcon from "@material-ui/icons/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axiosConfig from "../../../axiosConfig";
import { useHistory } from "react-router-dom";
import Divider from "@mui/material/Divider";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AdminLayout from "../../../layout/adminLayout";
import AutoDiscount from './AutoDiscount';
import DiscountCode from "./DiscountCode";
import FilterListIcon from '@mui/icons-material/FilterList';
import { CircularProgress, ListItemIcon, ListItemText } from "@material-ui/core";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Check } from "@material-ui/icons";
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';


const DiscountList = () => {
  const bread = [
    {
      title: "Discount",
      href: "/admin/discounts",
    },
  ];

  
  const [anchorElMore, setAnchorElMore] = useState(null);
  const openEditAndDeleteMenu = Boolean(anchorElMore);
  const openDialog = Boolean(anchorElMore);
  const [pageName, setPageName] = useState('list');
  const [discounts , setDiscounts] = useState([]);
  const [_discounts , _setDiscounts] = useState([]);
  const[selectedDiscount , setSelectedDiscount] = useState([]);
  const [anchorElStatus, setAnchorElStatus] = useState(null);
  const openStatusMenu = Boolean(anchorElStatus);
  const [anchorElSortTag, setAnchorElSortTag] = useState(null);
  const openSortTag = Boolean(anchorElSortTag);
  const [sortFilterTypeTag, setSortFilterTypeTag] = useState('Rule name');
  const [sortTag, setSortTag] = useState('date_sort=-1');
  let history = useHistory();
  const[searchValue,setSearchValue] = useState("");
  const [user, setUser] = useState("11");
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [openMassage, setOpenMassage] = useState(false);
  const [showMassage, setShowMassage] = useState('');
  
  useEffect( ()=>{
    getUserInfo();
  },[])

  const getUserInfo =  () => {
    axiosConfig
      .get("/users/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then( (res) => {

        let user =res.data.user; 
        setUser(user);
        axiosConfig
        .get("/users/get_roles", {
          headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }).then((res) => {
          let role1 ="";
          res.data.roles_list.map(role=>{
            if (role.id == user.role) {
              setRole(role.title);
              role1 = role.title;
            }
          })
          if (role1 != "admin" && role1!= "super admin") {
            history.push("/")
          }
        })

      })
      .catch((err) =>{
        if(err.response.data.error.status === 401){
          axiosConfig
            .post("/users/refresh_token", {
            refresh_token: localStorage.getItem("refreshToken"),
            })
            .then((res) => {
            setShowMassage('Get user info has a problem!');
            setOpenMassage(true)
            localStorage.setItem("token", res.data.accessToken);
            localStorage.setItem("refreshToken", res.data.refreshToken);
            getUserInfo();
            })
        }else{
          setShowMassage('Get user info has a problem!');
          setOpenMassage(true)
        } 
      });
  };

  useEffect(() => {
    refreshPage();
  }, [searchValue]);

  const refreshPage = ()=>{
    axiosConfig.get("/admin/discount/all")
    .then((res) => {
      let discounts = res.data.discounts;
      _setDiscounts(discounts)
      setLoading(false);

      discounts = res.data.discounts.filter(d => (d.name.charAt(0).toUpperCase() + d.name.slice(1)).includes(searchValue.charAt(0).toUpperCase() + searchValue.slice(1)));
      setDiscounts(discounts);
    })
    .catch(err =>{ 
      if(err.response.data.error.status === 401) {
      axiosConfig.post('/users/refresh_token', { 'refresh_token': localStorage.getItem('refreshToken') })
        .then(res => {
          setShowMassage('Get discount list have a problem!');
          setOpenMassage(true)
          localStorage.setItem('token', res.data.accessToken);
          localStorage.setItem('refreshToken', res.data.refreshToken);
          refreshPage();
        })
      }else{
        setShowMassage('Get discount list have a problem!');
        setOpenMassage(true)
      }
    })
  }


  const handleCloseEditAndDeleteMenu = () => {
    setAnchorElMore(null);
    
  };

  const removeDiscount = () => {
    axiosConfig.delete(`/admin/discount/${selectedDiscount.id}`)
    .then(() => {
       
      refreshPage();
      handleCloseEditAndDeleteMenu()
    })
    .catch(err =>{
      setShowMassage('remove discount has a problem!');
      setOpenMassage(true)
    })
  };

const openMenuStatus = (event)=>{
  setAnchorElStatus(event.currentTarget)
}
const isLoading = () => {
  return (
    <Grid item xs={12} mt={2} mb={2} display="flex" justifyContent="center">
      <CircularProgress color="P" />
    </Grid>
  );
};
  const listPage = (
    <Grid>
      <Grid item xs={12} md={12} sx={{
        position: 'sticky',
        width: '100%',
        zIndex: 100,
        top: 80,
      }}>
        
        <Grid
          xs={12}
        >
          <Paper 
            style={{
              boxShadow: 'none',
              border: '1px solid #DCDCDC',
              borderRadius:"5px",
            }}>  
            
            <Grid xs={12} display='flex' alignItems='center' justifyContent='space-between' height='55px' p={2} pr="8px" >
              <Typography variant='menutitle' color='Black.main'>
                Discounts List
              </Typography>
              
            </Grid>
          </Paper>
            
          <Grid xs={12} backgroundColor='GrayLight.main' height='2px'  
          sx={{
            width: '100%',
            zIndex: 100,
          }} >

          </Grid>
        </Grid>  
        
        <Grid item xs={12} md={12} sx={{
          position: 'sticky',
          width: '100%',
          zIndex: 100,
          bgcolor:'GrayLight.main',
          top: "140px",
          }}>
          <Grid item xs={12} mb={1} md={12} mt={0} sx={{
              position: 'sticky',
              top: "139px",
              mb:"15px"
          }}>
            <Paper item sm={12} md={12}
              style={{
                boxShadow: 'none',
                border: '1px solid #DCDCDC',
                alignContent: "center", alignItems: "center",
                maxHeight: '48px',
                borderRadius:"5px",
                display: 'flex',
                justifyContent: 'end',
              }}

              display='flex'
              alignItems='center'
                
            >
              
              <Grid xs={5} display='flex' alignItems="center" justifyContent='end' pt="5px" pb="5px">
                <Paper
                  component="form"

                  sx={{
                    backgroundColor: 'GrayLight2.main',
                    p: "2px 4px",
                    borderRadius: 3,
                    display: "flex",
                    alignItems: "center",
                    maxWidth: "300px",
                    height: '33px',
                    justifyContent: 'space-between',
                    boxShadow: 'none',
                  }}

                >

                  <IconButton sx={{ p: "10px" }} aria-label="search" >
                    <SearchIcon color="G1.main" />
                  </IconButton>
                  <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Search"
                    inputProps={{ "aria-label": "Search in List" }}
                    onChange={(e) => { setSearchValue(e.target.value) }}
                  />
                  <FormControl
                    color="P"
                    variant="filled"
                    size="small"
                    hiddenLabel={true}
                  >
                    <Select
                        labelId="demo-simple-select-filled-label"
                        id="demo-simple-select-filled"
                        disableUnderline
                        IconComponent={KeyboardArrowDownIcon}
                        displayEmpty
                        inputProps={{ "aria-label": "Without label" }}
                        defaultValue={'name'}
                        label
                        sx={{
                            backgroundColor: 'GrayLight2.main', borderLeft: '1px dashed #9E9E9E', overflow: "hidden", height: "20px", top: 0, left: 1.6,
                            borderRadius: '0 0  10px 0', width: "100px", '.MuiSvgIcon-root': { color: 'G2.main', padding: '3px' }
                        }}
                    >
                      <MenuItem value={'name'}>
                        <Typography p={1} color='G2.main' variant='h15'>Name</Typography>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Paper>

                <IconButton aria-label="search"
                  
                  aria-haspopup="true"
                  onClick={(event) => {openMenuStatus(event) }}
                  sx={{ margin: '0 15px 0 10px',ml:"7px",mr:"7px" }}
                >
                  <FilterListIcon color="G1" />
                </IconButton>

                <Menu
                id="demo-positioned-date-menu"
                anchorEl={anchorElStatus}
                open={openStatusMenu}
                onClose={()=>setAnchorElStatus(null)}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
                sx={{ width: '247px' ,ml:-1.5}}
              >
                
                <MenuItem onClick={()=>{
                  setDiscounts(_discounts);
                }}>All</MenuItem>
                <MenuItem onClick={()=>{
                  setDiscounts(_discounts.filter(d=>d.type=="Percentage"));
                }}>Percentage</MenuItem>
                <MenuItem onClick={()=>{
                  setDiscounts(_discounts.filter(d=>d.type=="Fixed amount"));
                }}>Fixed amount</MenuItem>
                <MenuItem onClick={()=>{
                  setDiscounts(_discounts.filter(d=>d.type=="Buy X Get Y"));
                }}>Buy X Get Y</MenuItem>
                <MenuItem onClick={()=>{
                  
                  setDiscounts(_discounts.filter(d=>(new Date(d.end_date).getTime())>=(new Date().getTime())));
                }}>Active date</MenuItem>
                <Divider sx={{ width: '60%', margin: 'auto', borderColor: 'P.main' }} />
                <MenuItem
                    aria-controls={openSortTag ? 'demo-positioned-date-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={openSortTag ? 'true' : undefined}
                    onClick={(event) => setAnchorElSortTag(event.currentTarget)
                    }
                    sx={{ padding: '5px 5px 5px 13px', color: 'G1.main', }}
                >
                  <ListItemIcon >
                    <ArrowBackIosIcon color='P' sx={{ padding: '3px' }} />
                  </ListItemIcon>
                  Sort
                </MenuItem>
                </Menu>    

              
                <Menu
                  id="composition-button"
                  anchorEl={anchorElSortTag}
                  open={openSortTag}
                  onClose={() => setAnchorElSortTag(null)}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}
                  sx={{ width: '235px', marginTop: '-10px', marginLeft: '-170px', boxShadow: 'none' }}
                >
                  <Typography color='G1.main' variant='h30' p={2} pt="2px"> Sort By</Typography>
                  <MenuItem
                    onClick={() => {
                      setSortFilterTypeTag('Rule name');
                    }}
                    sx={{ padding: '7px 5px 5px 8px', width: '250px', color: 'G1.main' }}
                  >
                      {sortFilterTypeTag === 'Rule name' ?
                        <>
                          <ListItemIcon >
                            <Check color='P' sx={{ padding: '3px' }} />
                          </ListItemIcon>
                          <Typography ml={-1}>Rule name</Typography>
                        </>
                        :
                        <ListItemText inset >
                          <Typography ml={-1}>Rule name</Typography>
                        </ListItemText>
                      }
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setSortFilterTypeTag('code');
                    }}
                    sx={{ padding: '5px 5px 5px 8px', width: '250px', color: 'G1.main' }}
                  >
                      {sortFilterTypeTag === 'code' ?
                        <>
                          <ListItemIcon >
                            <Check color='P' sx={{ padding: '3px' }} />
                          </ListItemIcon>
                          <Typography ml={-1}>Code</Typography>
                        </>
                        :
                        <ListItemText inset >
                          <Typography ml={-1}>Code</Typography>
                        </ListItemText>
                      }
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setSortFilterTypeTag('assigned products');
                    }}
                    sx={{ padding: '5px 5px 5px 8px', width: '250px', color: 'G1.main' }}
                  >
                    {sortFilterTypeTag === 'assigned products' ?
                      <>
                        <ListItemIcon >
                          <Check color='P' sx={{ padding: '3px' }} />
                        </ListItemIcon>
                        <Typography ml={-1}>Assigned products</Typography>
                      </>
                      :
                      <ListItemText inset >
                        <Typography ml={-1}>Assigned products</Typography>
                      </ListItemText>
                    }
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setSortFilterTypeTag('Start date');
                    }}
                    sx={{ padding: '5px 5px 5px 8px', width: '250px', color: 'G1.main' }}
                  >
                      {sortFilterTypeTag === 'Start date' ?
                        <>
                          <ListItemIcon >
                            <Check color='P' sx={{ padding: '3px' }} />
                          </ListItemIcon>
                          <Typography ml={-1}>Start date</Typography>
                        </>
                        :
                        <ListItemText inset >
                          <Typography ml={-1}>Start date</Typography>
                        </ListItemText>
                      }
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setSortFilterTypeTag('Expire date');
                    }}
                    sx={{ padding: '5px 5px 5px 8px', width: '250px', color: 'G1.main' }}
                  >
                      {sortFilterTypeTag === 'Expire date' ?
                        <>
                          <ListItemIcon >
                            <Check color='P' sx={{ padding: '3px' }} />
                          </ListItemIcon>
                          <Typography ml={-1}>Expire date</Typography>
                        </>
                        :
                        <ListItemText inset >
                          <Typography ml={-1}>Expire date</Typography>
                        </ListItemText>
                      }
                  </MenuItem>
                  
                  <Divider sx={{ width: '60%', margin: 'auto', borderColor: 'P.main' }}/>
                  <Typography color='G1.main' variant='h30' p={2} pt="5px" > Sort Order</Typography>

                  <MenuItem
                      onClick={() => {
                        if (sortFilterTypeTag === 'Rule name') {
                          setSortTag('title_sort=-1');
                          setDiscounts(_discounts.sort((a, b) =>
                            a.name > b.name ? 1 : -1
                          ))
                        } else if (sortFilterTypeTag === 'code') {
                          setSortTag("date_sort=-1")
                          setDiscounts(_discounts.sort((a, b) =>
                            a.code > b.code ? 1 : -1
                          ))
                        } else if(sortFilterTypeTag== "assigned products"){
                          setSortTag('title_sort=-1');
                          setDiscounts(_discounts.sort((a, b) =>
                            (b.x_product!= null?[b.x_product].length:0) > (a.x_product!= null?[a.x_product].length:0) ? 1 : -1
                          ))
                        }else if (sortFilterTypeTag== "Start date") {
                          
                          setSortTag('title_sort=-1');
                          setDiscounts(_discounts.sort((a, b) =>
                            (new Date(b.start_date).getTime()) > (new Date(a.start_date).getTime()) ? 1 : -1
                          ))
                        }else {
                          setSortTag('viewed_sort=-1')
                          setDiscounts(_discounts.sort((a, b) =>
                            (new Date(b.end_date).getTime()) > (new Date(a.end_date).getTime()) ? 1 : -1
                          ))
                        }
                        setAnchorElSortTag(null)
                        setAnchorElStatus(null);
                      }}
                      sx={{ padding: '7px 5px 5px 8px', width: '250px', color: 'G1.main' }}
                  >
                      {sortTag.toString().split("=")[1] === '-1' ?
                          <>
                              <ListItemIcon >
                                  <Check color='P' sx={{ padding: '3px' }} />
                              </ListItemIcon>
                              <Typography ml={-1}>{sortFilterTypeTag === 'Rule name' ? 'A to Z' : sortFilterTypeTag === 'code' ? 'A to Z' :sortFilterTypeTag === 'assigned products'? 'High to Low': sortFilterTypeTag ==='Start date'? 'Newest first':'Newest first'}</Typography>
                          </>
                          :
                          <ListItemText inset >
                            <Typography ml={-1}>{sortFilterTypeTag === 'Rule name' ? 'A to Z' : sortFilterTypeTag === 'code' ? 'A to Z' :sortFilterTypeTag === 'assigned products'? 'High to Low': sortFilterTypeTag ==='Start date'? 'Newest first':'Newest first'}</Typography>
                          </ListItemText>
                      }
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      if (sortFilterTypeTag === 'Rule name') {
                        setSortTag('title_sort=1');
                        setDiscounts(discounts.sort((a, b) =>
                          b.name > a.name ? 1 : -1
                        ))
                      } else if (sortFilterTypeTag === 'code') {
                        setSortTag("date_sort=1")
                        setDiscounts(_discounts.sort((a, b) =>
                          b.code > a.code ? 1 : -1
                        ))
                      }else if (sortFilterTypeTag== "assigned products") {
                        setSortTag("date_sort=1")
                        setDiscounts(_discounts.sort((a, b) =>
                          (a.x_product!= null?[a.x_product].length:0) > (b.x_product!= null?[b.x_product].length:0) ? 1 : -1
                        ))
                      }else if (sortFilterTypeTag== "Start date") {
                        
                        setSortTag('title_sort=1');
                        setDiscounts(_discounts.sort((a, b) =>
                          (new Date(a.start_date).getTime()) > (new Date(b.start_date).getTime()) ? 1 : -1
                        ))
                      }else {
                        setSortTag('viewed_sort=1')
                        setDiscounts(_discounts.sort((a, b) =>
                          (new Date(a.end_date).getTime()) > (new Date(b.end_date).getTime()) ? 1 : -1
                        ))
                      }
                      setAnchorElSortTag(null)
                      setAnchorElStatus(null);
                    }}
                    sx={{ padding: '5px 5px 5px 8px', width: '250px', color: 'G1.main' }}
                  >
                    {sortTag.toString().split("=")[1] === '1' ?
                      <>
                          <ListItemIcon >
                            <Check color='P' sx={{ padding: '3px' }} />
                          </ListItemIcon>
                          <Typography ml={-1}>{sortFilterTypeTag === 'Rule name' ? 'Z to A' : sortFilterTypeTag === 'code' ? 'Z to A' :sortFilterTypeTag === 'assigned products'? 'Low to High': sortFilterTypeTag ==='Start date'? 'Oldest first':'Oldest first'}</Typography>
                      </>
                      :
                      <ListItemText inset >
                        <Typography ml={-1}>{sortFilterTypeTag === 'Rule name' ? 'Z to A' : sortFilterTypeTag === 'code' ? 'Z to A' :sortFilterTypeTag === 'assigned products'? 'Low to High': sortFilterTypeTag ==='Start date'? 'Oldest first':'Oldest first'}</Typography>
                      </ListItemText>
                    }
                  </MenuItem>
                </Menu>
              </Grid>

            </Paper>

          </Grid>

                  

          <Grid item xs={12} md={12}  sx={{
            position: 'sticky',
            width: '100%',
            zIndex: 100,
            bgcolor:'GrayLight.main'
          }}>
            <Paper item xs={12} md={12} sx={{border:"1px solid #DCDCDC" , backgroundColor:"P1.main",mb:'1px',borderRadius:"5px",height:'48px'} } elevation={0}> 
              <Grid  key='row' sx={{ pl: 2 ,display:'flex',alignItems:'center',height:'100%'}}>
                <Grid item   sx={{width:'7.6%'}}
                >
                  <Typography p={1} color="black" variant="h7" sx={{fontWeight:'bold'}}>
                    Row
                  </Typography>
                </Grid>
                <Grid  sx={{width:'22.71%'}}>
                  <Typography variant="h7" sx={{fontWeight:'bold'}} p={1} >
                  Name
                  </Typography>
                </Grid>
                <Grid item sx={{width:'35.6%'}}>
                  <Typography
                    variant="h7" 
                    sx={{fontWeight:'bold'}} 
                    p={1}
                  >
                    Code
                  </Typography>
                </Grid>
                <Grid item  sx={{width:'11.5%'}}>
                  <Typography
                    variant="h7" 
                    sx={{fontWeight:'bold'}} 
                    p={1}
                  >
                    Assign products
                  </Typography>
                </Grid>
                <Grid item  sx={{width:'7.5%'}}>
                  <Typography
                    variant="h7" 
                    sx={{fontWeight:'bold'}} 
                    p={1}
                  >
                    Start Date
                  </Typography>
                </Grid>
                <Grid item  sx={{width:'8.5%'}}>
                  <Typography
                    variant="h7" 
                    sx={{fontWeight:'bold'}} 
                    p={1}
                  >
                    Expire Date
                  </Typography>
                </Grid>
                <Grid item xs={0.5} className="moreIcone"  sx={{backgroundColor:'rgb(203, 146, 155, 0.0)'}}>
                  <IconButton
                    aria-label="delete"
                    
                    aria-haspopup="true"
                    sx={{color:"rgb(203, 146, 155, 0.0)",cursor:'auto' ,":hover": {backgroundColor:"rgb(203, 146, 155, 0.0)" },':focus':{backgroundColor:"rgb(203, 146, 155, 0.0)"}}}
                  >
                    <MoreVertIcon sx={{color:"rgb(203, 146, 155, 0.0)",":hover": {color:"rgb(203, 146, 155, 0.0)" },':focus':{color:"rgb(203, 146, 155, 0.0)"} ,pl:0.3}} />
                  </IconButton>
                </Grid>
                
              </Grid>
            </Paper>
          </Grid>

        </Grid>
      </Grid>
      <Grid xs={12} md={12} sx={{ width: "100%", minHeight: '283px' }} >
        <Grid
          item
          xs={12}
          md={12} 
          container spacing={0} display='flex' justifyContent='space-between'
        >
          <Grid item xs={12} md={12}  >
            <Grid xs={12} style={{ minHeight: '280px' }}>
              <List sx={{ p: 0 }}>
                
                {loading
                  ? isLoading()
                  : discounts.map((discount, index) => {
                    return (
                      <Paper item xs={12} md={12} sx={{border:"1px solid #DCDCDC",mb:'-1px', borderRadius:'5px',height:"48px"}} elevation={0} >
                        <ListItem key={discount.id} sx={{ pl: 2 }}>
                          <Grid item  width="6.8%" ml={1.3}>
                            <Typography variant="h7"  p={1} color="G2.main">
                              {index + 1}
                            </Typography>
                          </Grid>
                          <Grid item  width="23.23%" >
                            <Typography p={1}  variant="h7"  color="G2.main">
                              {discount.name}
                            </Typography>
                          </Grid>
                          <Grid item  width="36%" display="flex"> 
                            
                            <Typography
                              align="right"
                              p={1} 
                              color="G2.main"
                              variant="h7" 
                            >
                              {discount.code}
                            </Typography>
                          </Grid>
                          <Grid item  width="11.5%">
                            <Typography
                              align="right"
                              p={1} 
                              color="G2.main"
                              variant="h7" 
                            >
                              
                              {discount.x_product!= null?[discount.x_product].length:0}
                            </Typography>
                          </Grid>
                          <Grid item  width="7.5%">
                            <Typography
                              align="right"
                              p={1} 
                              color="G2.main"
                              variant="h7" 
                            >
                              
                              {new Date(discount.start_date).getFullYear()+"/"+new Date(discount.start_date).getMonth()+"/"+new Date(discount.start_date).getDate()}
                            </Typography>
                          </Grid>
                          <Grid item  width="10.1%">
                            <Typography
                              align="right"
                              p={1} 
                              color="G2.main"
                              variant="h7" 
                            >
                              
                              {new Date(discount.end_date).getFullYear()+"/"+new Date(discount.end_date).getMonth()+"/"+new Date(discount.end_date).getDate()}
                            </Typography>
                          </Grid>
                          <Grid item xs={0.5} className="moreIcone"  >
                            <IconButton
                            sx={{mr: window.innerWidth<900?-0.25:window.innerWidth<1400?-0.1 :window.innerWidth<1550? -0.2:window.innerWidth<1800?-0.4:window.innerWidth<2000?-0.7 :-0.4}}
                              aria-label="delete"
                              id="demo-positioned-menu"
                              aria-controls={
                                openEditAndDeleteMenu ? "demo-positioned-menu" : undefined
                              }
                              aria-expanded={openEditAndDeleteMenu ? "true" : undefined}
                              aria-haspopup="true"
                              onClick={(e)=>{
                                setAnchorElMore(e.currentTarget);
                                setSelectedDiscount(discount);
                              }}
                            >
                              <MoreVertIcon color="G2.main" sx={{fontSize:'16px' }}/>
                            </IconButton>
                          </Grid>
                        </ListItem>
                      </Paper>
                    );
                  })}
              </List>
            </Grid>
            <Menu
              id="demo-positioned-menu"
              aria-labelledby="demo-positioned-button"
              anchorEl={anchorElMore}
              open={openDialog}
              onClose={handleCloseEditAndDeleteMenu}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <MenuItem >
                Edit
              </MenuItem>
              <MenuItem onClick={removeDiscount}>
                Delete
              </MenuItem>
            </Menu>
            
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenMassage(false);
  };


  return (
    <AdminLayout breadcrumb={bread} pageName="Discounts">
      {pageName === 'list' ? listPage : pageName === 'code' ? <DiscountCode/> : <AutoDiscount/>}
                                                                    
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
    </AdminLayout>
  );
};

export default DiscountList;
