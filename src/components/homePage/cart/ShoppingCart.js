import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  Grid,
  Typography,
  Button,
  IconButton,
  Card,
  CardMedia,
  SwipeableDrawer,
  Avatar,
  SvgIcon,
  Backdrop,
  Snackbar,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import axiosConfig from "../../../axiosConfig";
import logoWhite from "../../../asset/images/EBLogo.png";
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';


const ShoppingCart = (props) => {
  const [shoppingCart, setShoppingCart] = useState([]);
  let history = useHistory();
  const [totalPrice, setTotalPrice] = useState("");
  const [totalDiscount, setTotalDiscount] = useState("");
  const [trigger, setTrigger] = useState(0);
  const [loading, setLoading] = useState(false);
  const [categories,setCategories] = useState([])
  const [badge, setBadgeCount] = useState(0);
  const [openMassage, setOpenMassage] = useState(false);
  const [showMassage, setShowMassage] = useState('');

  useEffect(() => {
   if (props.open) {
    listItem();
    categoryList();
    
   }
  }, [props.open]);
  const categoryList = () => {
    axiosConfig.get('/admin/category/all')
      .then(res => {
        res.data.categories.map((category) => {
          category.types.map((cat) => {
            categories.push({id:cat.id, title: category.title , type: cat.title});
          })
        })
      })
  }
  
  useEffect(() => {
    shoppingCart.length > 0
      ? props.counter(shoppingCart.length)
      : props.counter(0);
  }, [shoppingCart]);

  const listItem = () => {
      
    setLoading(true);
    localStorage.getItem("token")
      ? axiosConfig
          .get("/users/card", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((res) => {
            setShoppingCart(res.data.shoppingCard);
            setTotalPrice(res.data.total_price);
            setTotalDiscount(res.data.totalDiscount);
            let badgeCount = 0
            res.data.shoppingCard.map((cartItem)=>{
              badgeCount += cartItem.quantity
            })
            setBadgeCount(badgeCount)
            
            setTimeout(()=>{
              setLoading(false)
            },3000)
          })
          .catch((err) => {
            setShowMassage('Get cards have a problem!')
            setOpenMassage(true) 
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
                  listItem();
                })
              }else{
                setShowMassage('Get cards have a problem!')
                setOpenMassage(true) 
              }
          })
      : setShoppingCart(null);
  };



  const deleteFromCart = (id) => {
    setLoading(true);
    
    axiosConfig
      .delete(`/users/card/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        listItem();
        setTrigger(trigger+1)
        props.isRemoved(true)
        props.clicked(trigger+1)
        setTimeout(()=>{
          setLoading(false)

        },3000)
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
              deleteFromCart();
            })
          }else{
            setShowMassage('delete from cart has a problem!')
            setOpenMassage(true) 
          }
      });
  };

  const DecreaseCartItem = (product_id, current_quantity) => {
    if (current_quantity == 1) {
      setShowMassage("Use delete icon to remove item from cart!")
      setOpenMassage(true)
    } else {
      setLoading(true);

      const cardObj = {
        product_id: product_id,
        quantity: 1,
      };
      axiosConfig
        .post("/users/card/decrease", cardObj, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          listItem();
          setTrigger(trigger+1)
          props.clicked(trigger+1)
          
          setTimeout(()=>{
            setLoading(false)

          },3000)
        })
        .catch((err) => {
          setShowMassage('Decrease cart item has a problem!')
          setOpenMassage(true)
        })
        .catch((err) =>{
          if(err.response.data.error.status === 401){
            axiosConfig
                .post("/users/refresh_token", {
                  refresh_token: localStorage.getItem("refreshToken"),
                })
                .then((res) => {
                  setShowMassage('Decrease cart item has a problem!')
                  setOpenMassage(true)
                  localStorage.setItem("token", res.data.accessToken);
                  localStorage.setItem("refreshToken", res.data.refreshToken);
                  IncreaseCartItem();
                })
          }else{
            setShowMassage('Decrease cart item has a problem!')
            setOpenMassage(true)
          }
        });
    }
  };
  const IncreaseCartItem = (product_id, current_quantity) => {
    if (current_quantity > 10) {
      setShowMassage("Use delete icon to remove item from cart!")
      setOpenMassage(true)
    } else {
      setLoading(true);
      const cardObj = {
        product_id: product_id,
        quantity: 1,
      };
      axiosConfig
        .post("/users/card/add", cardObj, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          listItem();
          setTrigger(trigger+1)
          props.clicked(trigger+1)
        })
        .catch((err) => {
          setShowMassage('Increase cart item has a problem!')
          setOpenMassage(true)
        })
        .catch((err) =>{
          if(err.response.data.error.status === 401){
            axiosConfig
              .post("/users/refresh_token", {
                refresh_token: localStorage.getItem("refreshToken"),
              })
              .then((res) => {
                setShowMassage('Increase cart item has a problem!')
                setOpenMassage(true)
                localStorage.setItem("token", res.data.accessToken);
                localStorage.setItem("refreshToken", res.data.refreshToken);
                IncreaseCartItem();
              })
          }else{
            setShowMassage('Increase cart item has a problem!')
            setOpenMassage(true)
          }
        });
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenMassage(false);
  };
  return (
    <SwipeableDrawer
      open={props.open}
      onClose={() => props.close(false)}
      anchor={"right"}
      sx={{
        "& .css-1160xiw-MuiPaper-root-MuiDrawer-paper": {
          backgroundColor: "rgba(0,0,0,0.95)",
        },
      }}
    >
      <Grid
        xs={12}
        display="flex"
        flexDirection="column"
        p={0}
        style={{
          backgroundColor: "rgba(203,146,155,0.1)",
          paddingLeft: "18px",
        }}
      >
        <Grid
          p={1}
          container
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "70px",
            padding: 0,
            boxShadow: "none",
          }}
        >
          <Grid item sx={{ display: "flex", alignItems: "center" }}>
            {shoppingCart.length > 0 && (
              <Avatar
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginRight: "12px",
                  width: "26px",
                  height: "26px",
                  bgcolor: "#2B2B2B",
                  fontWeight:'700',
                  fontSize: "16px",
                }}
              >
                {shoppingCart !== undefined || shoppingCart !== null
                  ? badge != undefined ? badge : ""
                  : "0"}
              </Avatar>
            )}

            <Typography variant="h17" color="white">
              Shopping Cart
            </Typography>
          </Grid>
          <Grid item>
            <IconButton onClick={() => props.close(false)}>
              <CloseIcon sx={{ color: "white" }} />
            </IconButton>
          </Grid>
        </Grid>
        {shoppingCart.length > 0 ? (
          <Grid
            xs={12}
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            pr="18px"
            style={{ height: "100%" }}

          >
            <Grid>
              {shoppingCart &&
                shoppingCart.map((cart) => {
                  let category = categories.find(c=>c.id==cart.product_group.category_id )

                  let varientId = cart.product_id
                  let product = cart.product_group.products.find((v)=>v.id == varientId)

                  let brand=product.attributes.find(a => a.name ===  ('Brand' ))?.value;
                  let gender=product.attributes.find(a => a.name ===  ('Gender' ))?.value;
                  let type=product.attributes.find(a => a.name ===  ('Type' ))?.value;
                  
                  let frontColor=product.attributes.find(a => a.name ===  'Front Color' )?.value;
                  let lensColor=product.attributes.find(a => a.name ===  'Lens Color' )?.value;
                  let lensProperties=product.attributes.find(a => a.name ===  'Lens Properties' )?.value;
                  let duration=product.attributes.find(a => a.name === ('Duration'))?.value;
                  let packagings=product.attributes.find(a => a.name === ('Packaging'))?.value.split('contains')[1].toString().trim();
                  let categoryName = '';
                  if (categories.length!=0) {
                    categoryName = category.title.split(' ')[0];
                    
                  }

                  let color = product.attributes.find(a => a.name ===  ('Color' ))?.value;
                  let spericalPower = product.attributes.find(a => a.name === ('Spherical Power'))?.value ;
                  let clyndrycalPower = product.attributes.find(a => a.name === ('Cylindrical  Power'))?.value;
                  let axis = product.attributes.find(a => a.name === ('Axis'))?.value;
                  
                  return (
                    <Grid
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "start",
                        marginBottom: "10px",
                      }}
                    >
                      <Grid
                        container
                        xs={12}
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "start",
                          justifyContent: "space-between",
                          width: "100%",
                          height: "150px",
                          backgroundColor: "rgba(117, 117, 117, 0.35)",
                          borderRadius: "15px 15px 15px 15px",
                          overflow: "hidden",
                          width: "400px",
                        }}
                      >
                        <Grid
                          container
                          xs={12}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "start",
                            paddingLeft: "25px",
                            paddingRight: "65px"
                          }}
                        >
                          <Grid
                            item
                            xs={10}
                            color="white"
                            sx={{
                              alignSelf:'end'
                            }}
                          >
                            <Grid xs={12}>
                              <Typography variant="menuitem">
                                {cart.product_group.name}
                              </Typography>
                            </Grid>
                          </Grid>
                          <Grid
                            item
                            xs={2}
                            sx={{
                              maxHeight: "100px",
                            }}
                          >
                            <Card
                              sx={{
                                display: "flex",
                                borderRadius: "0px 0px 20px 20px",
                                height: "96px",
                                width: "90px",
                                boxShadow: "none",
                              }}
                            >
                              <CardMedia
                                component="img"
                                image={
                                  axiosConfig.defaults.baseURL +
                                  cart.product_file_urls[0].image_url
                                }
                              />
                            </Card>
                          </Grid>
                        </Grid>
                        <Grid
                          container
                          xs={12}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "start",
                            paddingLeft: "25px",
                            pb:"32px"
                          }}
                        >
                          {category!=''&&category!=undefined?(category.title == 'Sunglasses'?
                            <Grid
                              item
                              xs={6}
                              color="white"
                              display='flex'
                              flexDirection='column'
                            >
                              <Grid xs={12} display='flex' alignItems='center' pt="12px">
                                <SvgIcon
                                                                                
                                  titleAccess="title"
                                  component={(componentProps) => (
                                    <svg width="15" height="17" viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M6 0.500001C5.62858 0.221433 5.18692 0.0517978 4.72451 0.0101029C4.26211 -0.031592 3.79723 0.0563008 3.38197 0.263933C2.9667 0.471565 2.61746 0.790733 2.37337 1.18567C2.12929 1.58061 2 2.03572 2 2.5V4H1C0.734783 4 0.48043 4.10536 0.292893 4.29289C0.105357 4.48043 0 4.73478 0 5V13C0 13.7957 0.316071 14.5587 0.87868 15.1213C1.44129 15.6839 2.20435 16 3 16H7.53L6.551 15H3C2.46957 15 1.96086 14.7893 1.58579 14.4142C1.21071 14.0391 1 13.5304 1 13V5H7V7.052C7.16779 7.01738 7.33867 6.99995 7.51 7H8V5H11V7.077C11.366 7.17 11.709 7.345 12 7.591V5C12 4.73478 11.8946 4.48043 11.7071 4.29289C11.5196 4.10536 11.2652 4 11 4H10V2.5C10 2.03572 9.87071 1.58061 9.62663 1.18567C9.38254 0.790733 9.0333 0.471565 8.61803 0.263933C8.20277 0.0563008 7.73789 -0.031592 7.27549 0.0101029C6.81308 0.0517978 6.37142 0.221433 6 0.500001ZM3 2.5C3 2.10218 3.15803 1.72065 3.43934 1.43934C3.72064 1.15804 4.10218 1 4.5 1C4.89782 1 5.27936 1.15804 5.56066 1.43934C5.84196 1.72065 6 2.10218 6 2.5V4H3V2.5ZM6.667 1.252C6.89291 1.10115 7.15554 1.01447 7.42686 1.00123C7.69818 0.987981 7.968 1.04866 8.20753 1.17679C8.44706 1.30492 8.64729 1.49569 8.78686 1.72874C8.92643 1.96178 9.0001 2.22836 9 2.5V4H7V2.5C7 2.046 6.879 1.62 6.667 1.252ZM6.432 13.449C6.15523 13.1664 6.00015 12.7866 6 12.391V9.511C5.99987 9.31262 6.03883 9.11616 6.11465 8.93284C6.19048 8.74953 6.30169 8.58295 6.44192 8.44262C6.58214 8.3023 6.74865 8.19099 6.93192 8.11504C7.11518 8.03909 7.31162 8 7.51 8H10.383C10.786 8 11.172 8.161 11.455 8.447L14.562 11.587C14.703 11.7294 14.8144 11.8984 14.8895 12.0842C14.9647 12.27 15.0022 12.4688 14.9999 12.6692C14.9976 12.8696 14.9554 13.0676 14.876 13.2516C14.7965 13.4355 14.6813 13.6019 14.537 13.741L11.59 16.578C11.3035 16.8541 10.9195 17.0058 10.5216 17C10.1238 16.9941 9.74434 16.8313 9.466 16.547L6.432 13.449ZM8 10.75C8 10.9489 8.07902 11.1397 8.21967 11.2803C8.36032 11.421 8.55109 11.5 8.75 11.5C8.94891 11.5 9.13968 11.421 9.28033 11.2803C9.42098 11.1397 9.5 10.9489 9.5 10.75C9.5 10.5511 9.42098 10.3603 9.28033 10.2197C9.13968 10.079 8.94891 10 8.75 10C8.55109 10 8.36032 10.079 8.21967 10.2197C8.07902 10.3603 8 10.5511 8 10.75Z" fill="#CB929B"/>
                                    </svg>
                                  )}
                                />
                                <Typography variant="h10" pl="14px">
                                  {brand}
                                </Typography>
                              </Grid>
                              <Grid xs={12} display='flex' alignItems='center' pt="9px" pl="1px">
                                <SvgIcon
                                                                                
                                  titleAccess="title"
                                  component={(componentProps) => (
                                    <svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M6.25 0C3.84125 0 1.875 1.96625 1.875 4.375C1.875 5.88125 2.64375 7.22 3.80875 8.00813C1.57938 8.96438 0 11.175 0 13.75H1.25C1.25 10.9812 3.48125 8.75 6.25 8.75C9.01875 8.75 11.25 10.9812 11.25 13.75H12.5C12.5 11.175 10.9206 8.96375 8.69125 8.0075C9.286 7.60627 9.77328 7.06531 10.1104 6.43202C10.4475 5.79873 10.6242 5.09243 10.625 4.375C10.625 1.96625 8.65875 0 6.25 0ZM6.25 1.25C7.98312 1.25 9.375 2.64188 9.375 4.375C9.375 6.10812 7.98312 7.5 6.25 7.5C4.51688 7.5 3.125 6.10812 3.125 4.375C3.125 2.64188 4.51688 1.25 6.25 1.25Z" fill="#CB929B"/>
                                    </svg>

                                  )}
                                />
                                <Typography variant="h10" pl="14px">
                                  {gender}
                                </Typography>
                              </Grid>
                              <Grid xs={12} display='flex' alignItems='center' pt="11px" ml="-1.5px">
                                <SvgIcon
                                                                                
                                  titleAccess="title"
                                  component={(componentProps) => (
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M14.397 11.625C13.4231 13.623 11.3723 15 9.00001 15C6.62776 15 4.57689 13.623 3.60339 11.625H2.77951C3.80326 14.049 6.20326 15.75 9.00001 15.75C11.7968 15.75 14.1964 14.049 15.2205 11.625H14.397ZM4.64289 4.875C5.73639 3.72 7.28401 3 9.00001 3C10.716 3 12.2636 3.72 13.3571 4.875H14.3434C13.1089 3.27825 11.1746 2.25 9.00001 2.25C6.82539 2.25 4.89114 3.27825 3.65664 4.875H4.64289ZM5.62501 9C6.03939 9 6.37501 8.58 6.37501 8.0625C6.37501 7.545 6.03939 7.125 5.62501 7.125C5.21064 7.125 4.87501 7.545 4.87501 8.0625C4.87501 8.58 5.21064 9 5.62501 9ZM13.125 8.0625C13.125 8.58 12.7894 9 12.375 9C11.9606 9 11.625 8.58 11.625 8.0625C11.625 7.545 11.9606 7.125 12.375 7.125C12.7894 7.125 13.125 7.545 13.125 8.0625Z" fill="#CB929B"/>
                                      <path fill-rule="evenodd" clip-rule="evenodd" d="M8.50613 7.2675C8.5179 7.14506 8.51462 7.02164 8.49638 6.9H9.50362C9.48538 7.02164 9.4821 7.14506 9.49387 7.2675L9.70837 9.5175C9.74382 9.88891 9.91641 10.2338 10.1924 10.4848C10.4685 10.7358 10.8282 10.8749 11.2013 10.875H14.25C14.6478 10.875 15.0294 10.717 15.3107 10.4357C15.592 10.1544 15.75 9.77283 15.75 9.375V7.5H16.125V5.625H10.9875C10.5285 5.625 10.1213 5.82975 9.8475 6.15H8.1525C8.0119 5.98508 7.83712 5.85271 7.64027 5.76206C7.44342 5.6714 7.22922 5.62464 7.0125 5.625H1.875V7.5H2.25V9.375C2.25 9.77283 2.40804 10.1544 2.68934 10.4357C2.97064 10.717 3.35218 10.875 3.75 10.875H6.79875C7.17185 10.8749 7.53152 10.7358 7.80756 10.4848C8.08359 10.2338 8.25618 9.88891 8.29163 9.5175L8.50613 7.2675ZM3.75 6.375C3.55109 6.375 3.36032 6.45402 3.21967 6.59467C3.07902 6.73532 3 6.92609 3 7.125V9.375C3 9.57391 3.07902 9.76468 3.21967 9.90533C3.36032 10.046 3.55109 10.125 3.75 10.125H6.79875C6.98527 10.1249 7.16506 10.0553 7.30304 9.92983C7.44101 9.80433 7.52728 9.63192 7.545 9.44625L7.7595 7.19625C7.76943 7.09219 7.7575 6.98721 7.72447 6.88803C7.69144 6.78885 7.63805 6.69767 7.56771 6.62035C7.49737 6.54302 7.41165 6.48125 7.31603 6.439C7.22042 6.39674 7.11703 6.37495 7.0125 6.375H3.75ZM10.2405 7.19625C10.2306 7.09219 10.2425 6.98721 10.2755 6.88803C10.3086 6.78885 10.362 6.69767 10.4323 6.62035C10.5026 6.54302 10.5884 6.48125 10.684 6.439C10.7796 6.39674 10.883 6.37495 10.9875 6.375H14.25C14.4489 6.375 14.6397 6.45402 14.7803 6.59467C14.921 6.73532 15 6.92609 15 7.125V9.375C15 9.57391 14.921 9.76468 14.7803 9.90533C14.6397 10.046 14.4489 10.125 14.25 10.125H11.2013C11.0147 10.1249 10.8349 10.0553 10.697 9.92983C10.559 9.80433 10.4727 9.63192 10.455 9.44625L10.2405 7.19625Z" fill="#CB929B"/>
                                      <path d="M11.0063 12.5389C11.0524 12.5216 11.0947 12.4955 11.1307 12.4619C11.1668 12.4283 11.1958 12.388 11.2163 12.3431C11.2367 12.2983 11.2481 12.2499 11.2499 12.2007C11.2516 12.1515 11.2436 12.1024 11.2264 12.0562C11.2092 12.0101 11.183 11.9678 11.1494 11.9318C11.1158 11.8957 11.0755 11.8667 11.0307 11.8462C10.9858 11.8258 10.9374 11.8144 10.8882 11.8126C10.839 11.8109 10.7899 11.8189 10.7438 11.8361C9.97126 12.1241 9.42114 12.2659 8.91489 12.2719C8.41726 12.2782 7.92939 12.1537 7.28551 11.8485C7.19561 11.8059 7.09247 11.8008 6.9988 11.8343C6.90512 11.8678 6.82858 11.9371 6.78601 12.027C6.74345 12.1169 6.73834 12.22 6.77181 12.3137C6.80529 12.4074 6.87461 12.4839 6.96451 12.5265C7.67326 12.8621 8.27664 13.0297 8.92426 13.0219C9.56289 13.014 10.2113 12.8351 11.0059 12.5389H11.0063Z" fill="#CB929B"/>
                                    </svg>
                                  )}
                                />
                                <Typography variant="h10" pl="14px">
                                  {type}
                                </Typography>
                              </Grid>
                            </Grid>
                          :
                            <Grid
                              item
                              xs={6}
                              color="white"
                              display='flex'
                              flexDirection='column'
                            >
                              <Grid xs={12} display='flex' alignItems='center' pt="12px">
                                <SvgIcon
                                                                                
                                  titleAccess="title"
                                  component={(componentProps) => (
                                    <svg width="17" height="12" viewBox="0 0 17 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M8.5 0C4.63636 0 1.33682 2.488 0 6C1.33682 9.512 4.63636 12 8.5 12C12.3636 12 15.6632 9.512 17 6C15.6632 2.488 12.3636 0 8.5 0ZM8.5 10C6.36727 10 4.63636 8.208 4.63636 6C4.63636 3.792 6.36727 2 8.5 2C10.6327 2 12.3636 3.792 12.3636 6C12.3636 8.208 10.6327 10 8.5 10ZM8.5 3.6C7.21727 3.6 6.18182 4.672 6.18182 6C6.18182 7.328 7.21727 8.4 8.5 8.4C9.78273 8.4 10.8182 7.328 10.8182 6C10.8182 4.672 9.78273 3.6 8.5 3.6Z" fill="#CB929B"/>
                                    </svg>
                                  )}
                                />
                                <Typography variant="h10" pl="14px">
                                  {categoryName+' . '+category.type}
                                </Typography>
                              </Grid>
                              <Grid xs={12} display='flex' alignItems='center' pt="9px">
                                <SvgIcon
                                                                                
                                  titleAccess="title"
                                  component={(componentProps) => (
                                    <svg width="15" height="17" viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M6 0.500001C5.62858 0.221433 5.18692 0.0517978 4.72451 0.0101029C4.26211 -0.031592 3.79723 0.0563008 3.38197 0.263933C2.9667 0.471565 2.61746 0.790733 2.37337 1.18567C2.12929 1.58061 2 2.03572 2 2.5V4H1C0.734783 4 0.48043 4.10536 0.292893 4.29289C0.105357 4.48043 0 4.73478 0 5V13C0 13.7957 0.316071 14.5587 0.87868 15.1213C1.44129 15.6839 2.20435 16 3 16H7.53L6.551 15H3C2.46957 15 1.96086 14.7893 1.58579 14.4142C1.21071 14.0391 1 13.5304 1 13V5H7V7.052C7.16779 7.01738 7.33867 6.99995 7.51 7H8V5H11V7.077C11.366 7.17 11.709 7.345 12 7.591V5C12 4.73478 11.8946 4.48043 11.7071 4.29289C11.5196 4.10536 11.2652 4 11 4H10V2.5C10 2.03572 9.87071 1.58061 9.62663 1.18567C9.38254 0.790733 9.0333 0.471565 8.61803 0.263933C8.20277 0.0563008 7.73789 -0.031592 7.27549 0.0101029C6.81308 0.0517978 6.37142 0.221433 6 0.500001ZM3 2.5C3 2.10218 3.15803 1.72065 3.43934 1.43934C3.72064 1.15804 4.10218 1 4.5 1C4.89782 1 5.27936 1.15804 5.56066 1.43934C5.84196 1.72065 6 2.10218 6 2.5V4H3V2.5ZM6.667 1.252C6.89291 1.10115 7.15554 1.01447 7.42686 1.00123C7.69818 0.987981 7.968 1.04866 8.20753 1.17679C8.44706 1.30492 8.64729 1.49569 8.78686 1.72874C8.92643 1.96178 9.0001 2.22836 9 2.5V4H7V2.5C7 2.046 6.879 1.62 6.667 1.252ZM6.432 13.449C6.15523 13.1664 6.00015 12.7866 6 12.391V9.511C5.99987 9.31262 6.03883 9.11616 6.11465 8.93284C6.19048 8.74953 6.30169 8.58295 6.44192 8.44262C6.58214 8.3023 6.74865 8.19099 6.93192 8.11504C7.11518 8.03909 7.31162 8 7.51 8H10.383C10.786 8 11.172 8.161 11.455 8.447L14.562 11.587C14.703 11.7294 14.8144 11.8984 14.8895 12.0842C14.9647 12.27 15.0022 12.4688 14.9999 12.6692C14.9976 12.8696 14.9554 13.0676 14.876 13.2516C14.7965 13.4355 14.6813 13.6019 14.537 13.741L11.59 16.578C11.3035 16.8541 10.9195 17.0058 10.5216 17C10.1238 16.9941 9.74434 16.8313 9.466 16.547L6.432 13.449ZM8 10.75C8 10.9489 8.07902 11.1397 8.21967 11.2803C8.36032 11.421 8.55109 11.5 8.75 11.5C8.94891 11.5 9.13968 11.421 9.28033 11.2803C9.42098 11.1397 9.5 10.9489 9.5 10.75C9.5 10.5511 9.42098 10.3603 9.28033 10.2197C9.13968 10.079 8.94891 10 8.75 10C8.55109 10 8.36032 10.079 8.21967 10.2197C8.07902 10.3603 8 10.5511 8 10.75Z" fill="#CB929B"/>
                                    </svg>

                                  )}
                                />
                                <Typography variant="h10" pl="17px">
                                  {brand}
                                </Typography>
                              </Grid>
                              <Grid xs={12} display='flex' alignItems='center' pt="11px" pl="1px">
                                <SvgIcon
                                                                                
                                  titleAccess="title"
                                  component={(componentProps) => (
                                    <svg width="10" height="17" viewBox="0 0 10 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M0 0H10V5.1L6.66667 8.5L10 11.9V17H0V11.9L3.33333 8.5L0 5.1V0ZM8.33333 12.325L5 8.925L1.66667 12.325V15.3H8.33333V12.325ZM5 8.075L8.33333 4.675V1.7H1.66667V4.675L5 8.075ZM3.33333 3.4H6.66667V4.0375L5 5.7375L3.33333 4.0375V3.4Z" fill="#CB929B"/>
                                    </svg>

                                  )}
                                />
                                <Typography variant="h10" pl="23px">
                                  {duration}
                                </Typography>
                              </Grid>
                              <Grid xs={12} display='flex' alignItems='center' pt="11px" pl="1px">
                                <SvgIcon
                                                                                
                                  titleAccess="title"
                                  component={(componentProps) => (
                                    <svg width="15" height="17" viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M14.8485 4.26642H14.8413C14.7378 4.08621 14.5914 3.93592 14.4159 3.82962L8.06973 0.150211C7.89648 0.0516893 7.70168 0 7.50362 0C7.30557 0 7.11077 0.0516893 6.93752 0.150211L0.591394 3.81482C0.412203 3.91875 0.262938 4.06943 0.158703 4.25161C0.158703 4.25258 0.158517 4.25354 0.158154 4.25444C0.157792 4.25534 0.157261 4.25616 0.156591 4.25684C0.155921 4.25753 0.155126 4.25808 0.154251 4.25845C0.153377 4.25882 0.152439 4.25901 0.151492 4.25901V4.27382C0.0505255 4.44847 -0.00185452 4.64819 5.01522e-05 4.85127V12.1509C0.000414772 12.3619 0.0553521 12.5691 0.159248 12.7512C0.263144 12.9333 0.412272 13.0838 0.591394 13.1873L6.93752 16.8519C7.09729 16.9414 7.27492 16.9921 7.45675 17H7.55771C7.73708 16.9909 7.91212 16.9403 8.06973 16.8519L14.4159 13.1873C14.5931 13.0823 14.7404 12.9312 14.8429 12.7493C14.9455 12.5674 14.9996 12.361 15 12.1509V4.85127C15.001 4.64597 14.9488 4.44408 14.8485 4.26642ZM7.50002 1.18667L13.2548 4.50332L11.0409 5.79148L5.22839 2.49704L7.50002 1.18667ZM7.56492 7.81998L1.75966 4.50332L4.04571 3.18554L9.86539 6.47999L7.56492 7.81998ZM1.15389 5.51016L6.988 8.84903L6.93031 15.4897L1.15389 12.1509V5.51016ZM8.08415 15.4823L8.14184 8.84903L10.4567 7.49423V10.3149C10.4567 10.4719 10.5175 10.6226 10.6257 10.7337C10.7339 10.8447 10.8806 10.9071 11.0337 10.9071C11.1867 10.9071 11.3334 10.8447 11.4416 10.7337C11.5498 10.6226 11.6106 10.4719 11.6106 10.3149V6.82054L13.8461 5.51757V12.1509L8.08415 15.4823Z" fill="#CB929B"/>
                                    </svg>
                                  )}
                                />
                                <Typography variant="h10" pl="17px">
                                  {packagings}
                                </Typography>
                              </Grid>
                            </Grid>)
                            
                          :''}
                          {category!=''&&category!=undefined?(category.title == 'Sunglasses'?
                            <Grid
                              item
                              xs={6}
                              color="white"
                              display='flex'
                              flexDirection='column'
                            >
                              <Grid xs={12} display='flex' alignItems='center' pt="12px">
                                <Typography variant="h10">
                                  {"Front color:"+frontColor}
                                </Typography>
                              </Grid>
                              <Grid xs={12} display='flex' alignItems='center' pt="11px">
                                <Typography variant="h10" >
                                  {"Lens Color:"+lensColor}
                                </Typography>
                              </Grid>
                              <Grid xs={12} display='flex' alignItems='center' pt="9px">
                                <Typography variant="h10" >
                                  {"Lens Properties:"+lensProperties}
                                </Typography>
                              </Grid>
                            </Grid>
                          :(category.title.includes("Color")?
                              <Grid
                                item
                                xs={6}
                                color="white"
                                display='flex'
                                flexDirection='column'
                              >
                                <Grid xs={12} display='flex' alignItems='center' pt="12px">
                                  <Typography variant="h10" >
                                    {"Color: "+color}
                                  </Typography>
                                </Grid>
                                <Grid xs={12} display='flex' alignItems='center' pt="9px">
                                  <Typography variant="h10" >
                                    {"Spherical: "+spericalPower}
                                  </Typography>
                                </Grid>
                                <Grid xs={12} display='flex' alignItems='center' pt="11px">
                                  <Typography variant="h10" >
                                    {"Cylindrical Power: "+clyndrycalPower}
                                  </Typography>
                                </Grid>
                                <Grid xs={12} display='flex' alignItems='center' pt="11px" >
                                  <Typography variant="h10">
                                    {"Axis: "+axis}
                                  </Typography>
                                </Grid>
                              </Grid>
                            :
                              <Grid
                                item
                                xs={6}
                                color="white"
                                display='flex'
                                flexDirection='column'
                              >
                                <Grid xs={12} display='flex' alignItems='center' pt="12px">
                                  <Typography variant="h10" >
                                    {"Spherical: "+spericalPower}
                                  </Typography>
                                </Grid>
                              </Grid>
                            
                            ))
                            :''
                          }
                        </Grid>


                      </Grid>
                      <Grid
                        container
                        xs={12}
                        sx={{
                          display: "flex",
                          alignSelf: "end",
                          background: "rgba(203, 146, 155, 0.35)",
                          marginTop: "5px",
                          minHeight: "54px",
                          maxHeight: "54px",
                          borderRadius: "10px",
                        }}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Grid item xs={6} display='flex' justifyContent='center'>
                          <Typography variant="menutitle" color="white">
                            {cart.product_price} KWD
                          </Typography>
                        </Grid>
                        <Grid
                        item
                          xs={6}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          >
                            <Grid
                              sx={{
                                minWidth: "80px",
                                width: "90px",
                                height: "28px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                flexDirection: "row",
                                backgroundColor: "black",
                                borderRadius: "8px",
                                overflow: "hidden",
                                color: "P.main",
                              }}
                            >
                              <button
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  textAlign: "center",
                                  width: "28px",
                                  height: "28px",
                                  display: "flex",
                                  flexDirection: "column",
                                  backgroundColor: "black",
                                  color: "white",
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  DecreaseCartItem(
                                    cart.product_id,
                                    cart.quantity
                                  );
                                }}
                              >
                                -
                              </button>
                              <Typography color="white">
                                {cart.quantity}
                              </Typography>
                              <button
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  textAlign: "center",
                                  width: "28px",
                                  height: "28px",
                                  display: "flex",
                                  flexDirection: "column",
                                  backgroundColor: "black",
                                  color: "#CB929B",
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  IncreaseCartItem(
                                    cart.product_id,
                                    cart.quantity
                                  );
                                }}
                              >
                                +
                              </button>
                            </Grid>
                          <Grid
                            onClick={() => deleteFromCart(cart.product_id)}
                            sx={{
                              marginLeft: "15px",
                              marginTop: "4px",
                              cursor: "pointer",
                            }}
                          >
                            <svg
                              width="11"
                              height="15"
                              viewBox="0 0 11 15"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M2.92857 3.6V2.3C2.92857 1.95522 3.06403 1.62456 3.30515 1.38076C3.54627 1.13696 3.87329 1 4.21429 1H6.78571C7.12671 1 7.45373 1.13696 7.69485 1.38076C7.93597 1.62456 8.07143 1.95522 8.07143 2.3V3.6M10 3.6V12.7C10 13.0448 9.86454 13.3754 9.62342 13.6192C9.3823 13.863 9.05528 14 8.71429 14H2.28571C1.94472 14 1.6177 13.863 1.37658 13.6192C1.13546 13.3754 1 13.0448 1 12.7V3.6H10Z"
                                stroke="#CB929B"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  );
                })}
            </Grid>
            <Grid>
              <Grid
                xs={12}
                sx={{
                  border: "1px solid white",
                  borderRadius: "8px",
                  padding: "20px 20px 0 20px",
                  display: "flex",
                  flexDirection: "column",
                  marginBottom: "25px",
                }}
              >
                <Grid display="flex" justifyContent="space-between">
                  <Typography variant="h18" sx={{ color: "G1.main" }}>
                    Items ({badge != undefined ? badge : ""}):
                  </Typography>
                  <Typography variant="h18" sx={{ color: "G1.main" }}>
                    {totalPrice} KWD
                  </Typography>
                </Grid>
                <Grid display="flex" justifyContent="space-between">
                  <Typography variant="h18" sx={{ color: "G1.main" }}>
                    Discount:
                  </Typography>
                  <Typography variant="h18" sx={{ color: "G1.main" }}>
                    {totalDiscount != null ? totalDiscount : 0} KWD
                  </Typography>
                </Grid>
                <Grid display="flex" justifyContent="space-between">
                  <Typography variant="h8" color="white">
                    Order Total:
                  </Typography>
                  <Typography variant="h8" color="white">
                    {totalPrice} KWD
                  </Typography>
                </Grid>
                <Grid
                  xs={12}
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button
                    variant="h8"
                    sx={{
                      background: "rgba(203, 146, 155, 0.35)",
                      width: "160px",
                      borderRadius: "15px 15px 0 0",
                      textTransform: "capitalize",
                      color: "white",
                      marginTop: "20px",
                      fontSize:'18px',
                      '&:hover':{bgcolor:"rgba(203, 146, 155, 0.35)"}
                    }}
                    onClick={() => history.push("/home/cartpage")}
                  >
                    Checkout
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            {loading&&(
              <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 ,display:'flex',justifyContent:'end',pr:"138px"}}
                open={loading}
              >
                <Card
                  elevation={0}
                  sx={{ background: "rgba(0,0,0,0)" }}
                >
                  <CardMedia
                    sx={{ width: "202px", color: "white", cursor: "pointer" }}
                    component="img"
                    image={logoWhite}
                  ></CardMedia>
                </Card>
              </Backdrop>

            )}
          </Grid>
        ) : (
          <Grid>
            <Grid
              minHeight="390px"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Typography variant="h2" color="white">
                No items in cart
              </Typography>
            </Grid>
          </Grid>
        )}
                                                                  
        <Snackbar open={openMassage} autoHideDuration={6000} onClose={handleClose}
            anchorOrigin={{ vertical:'top', horizontal:'left' }}
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
    </SwipeableDrawer>
  );
};

export default ShoppingCart;
