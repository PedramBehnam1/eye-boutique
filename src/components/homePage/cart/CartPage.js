import React, { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardMedia,
  Checkbox,
  Dialog,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  Hidden,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  SvgIcon,
  Backdrop,
  styled ,
  Snackbar,
  IconButton,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import axiosConfig from "../../../axiosConfig";
import Header from "../../../layout/Header";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import axios from "axios";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import CheckIcon from "@mui/icons-material/Check";
import { useHistory } from "react-router-dom";
import LogoWhite from "../../../asset/images/EBLogo.png";
import CloseIcon from '@mui/icons-material/Close';
import "../../../asset/css/textFeild.css"
import backgroundAddress from "../../../asset/images/backgroundAddress.png";
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';

const CartPage = () => {

  const [width, setWidth] = useState("");
  const [windowResizing, setWindowResizing] = useState(false);

  const getWindowWidth = () => {
    setWidth(window.innerWidth);
  };
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
    window.addEventListener("resize", getWindowWidth);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const steps = ["Cart", "Shipping", "Payment"];
  const [activeStep, setActiveStep] = useState(0);
  const [selectedValueRadioShipping, setSelectedValueRadioShipping] = useState("1");
  const [selectedValueRadioBilling, setSelectedValueRadioBilling] = useState(
    `${parseInt(selectedValueRadioShipping) + 1}`
  );
  const [addresses, setAddresses] = useState([]);
  const [openAddressDialog, setOpenAddressDialog] = useState(false);
  const [cities, setCities] = useState([]);
  const [statesName, setStatesName] = useState([]);
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [title, setTitle] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [apartment, setApartment] = useState("");
  const [email, setEmail] = useState("");
  const [billing, setBilling] = useState(true);
  const [shoppingCart, setShoppingCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState("");
  const [addressesId, setAddressesId] = useState("");
  const [payment, setPayment] = useState({});
  const [paymentId, setPaymentId] = useState(1);
  const [successfullyMessage, setSuccessfullyMessage] = useState(false);
  const [categories,setCategories] = useState([])
  const [loading, setLoading] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [giftWrap, setGiftWrap] = useState(false);
  const [giftMassage, setGiftMassage] = useState(false);
  const [openMassage,setOpenMassage]=useState(false)
  const [_massage,_setMassage]=useState('')

  const [isRemoved, setIsRemoved] = useState(false);
  const [showCartPage,setShowCartPage]=useState(false)
  const [trigger,setTrigger] = useState(0)
  const [_trigger, _setTrigger] = useState(0);

  const [_openMassage, _setOpenMassage] = useState(false);
  const [showMassage, setShowMassage] = useState('');
  let history = useHistory();

  useEffect(() => {
    setLoading(true)
    categoryList();
    getAddresses();
  }, [_trigger,trigger]);

  const getAddresses = () => {
    
    setLoading(true)
    axiosConfig
      .get("/users/address", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    }).then((res) => {
      setAddresses(res.data.addresses);
      
    }).catch((err) =>{
      if(err.response.data.error.status === 401){
        axiosConfig.post("/users/refresh_token", {
          refresh_token: localStorage.getItem("refreshToken"),
        }).then((res) => {
          setShowMassage('Get addresses have a problem!')
          setOpenMassage(true) 
          localStorage.setItem("token", res.data.accessToken);
          localStorage.setItem("refreshToken", res.data.refreshToken);
          getAddresses();
        })
      }else{
        setShowMassage('Get addresses have a problem!')
        setOpenMassage(true)
      }
    });

    axiosConfig
    .get("/users/card", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      setShoppingCart(res.data.shoppingCard);
      setTotalPrice(res.data.total_price);
      setLoading(false)
    }).catch((err) =>{
      if(err.response.data.error.status === 401){
        axiosConfig
          .post("/users/refresh_token", {
            refresh_token: localStorage.getItem("refreshToken"),
          })
          .then((res) => {
            setShowMassage('Get shoppingCarts have a problem!')
            setOpenMassage(true)
            localStorage.setItem("token", res.data.accessToken);
            localStorage.setItem("refreshToken", res.data.refreshToken);
            getAddresses();
          })
      }else{
        setShowMassage('Get shoppingCarts have a problem!')
        setOpenMassage(true)
      } 
    });
  };


  const handleClickOpenAddressDialog = () => {
    setOpenAddressDialog(true);
  };

  const handleCloseAddressDialog = () => {
    setOpenAddressDialog(false);
    setOpenMassage(false)
  };

  const handleChangeCountryName = (e) => {
    setCountry(e.target.value);
    axios
      .post("https://countriesnow.space/api/v0.1/countries/states", {
        country: e.target.value,
      })
      .then((res) => setStatesName(res.data.data.states));
  };

  const handleChangeStateName = (e) => {
    setState(e.target.value);
    axios
      .post("https://countriesnow.space/api/v0.1/countries/state/cities", {
        country: country,
        state: e.target.value,
      })
      .then((res) => setCities(res.data.data));
  };
  const deleteFromCart = (id) => {
    axiosConfig
      .delete(`/users/card/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        _setTrigger(_trigger+1)
        setTrigger(_trigger+1)
        step1();
      }).catch((err) =>{
        if(err.response.data.error.status === 401){
          axiosConfig
            .post("/users/refresh_token", {
              refresh_token: localStorage.getItem("refreshToken"),
            })
            .then((res) => {
              setShowMassage('Delete from shoppingCart has a problem!')
              setOpenMassage(true)
              localStorage.setItem("token", res.data.accessToken);
              localStorage.setItem("refreshToken", res.data.refreshToken);
              deleteFromCart();
            })
        }else{
          setShowMassage('Delete from shoppingCart has a problem!')
          setOpenMassage(true)
        } 
      });
  };

  const addAddress = () => {
    const addressObj = {
      title: title,
      full_name: fullName,
      phone: phone,
      address: address,
      apartment: apartment,
      country: country,
      state: state,
      city: city,
      zip_code: zipCode,
      email: email,
    };
    axiosConfig
      .post("/users/address/add", addressObj, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setOpenAddressDialog(false);
        getAddresses();
      })
      .catch((err) => {
        setShowMassage('Add address has a problem!')
        setOpenMassage(true)
      })
      .catch((err) =>{
        if(err.response.data.error.status === 401){
         axiosConfig
              .post("/users/refresh_token", {
                refresh_token: localStorage.getItem("refreshToken"),
              })
              .then((res) => {
                setShowMassage('Add address has a problem!')
                setOpenMassage(true)
                localStorage.setItem("token", res.data.accessToken);
                localStorage.setItem("refreshToken", res.data.refreshToken);
                addAddress();
              })
        }else{
          setShowMassage('Add address has a problem!')
          setOpenMassage(true)
        } 
      });
  };

  const handleClickContinue = () => {
    
    if (activeStep === 2) {
      const orderObj = {
        payment_method_id: paymentId,
        user_address_id: addressesId,
      };

      axiosConfig
      .post("/users/order/create", orderObj, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then((res) => {
        setSuccessfullyMessage(true);
        setOpenMassage(true)
        _setMassage("Added Succesfully")
      }).catch((err) =>{
        if(err.response.data.error.status === 401){
          axiosConfig
            .post("/users/refresh_token", {
              refresh_token: localStorage.getItem("refreshToken"),
            })
            .then((res) => {
              setShowMassage('Add Order has a problem!')
              setOpenMassage(true)
              localStorage.setItem("token", res.data.accessToken);
              localStorage.setItem("refreshToken", res.data.refreshToken);
              getAddresses();
            })
        }else{
          setShowMassage('Add Order has a problem!')
          setOpenMassage(true)
        }
      });
    } else {
      setActiveStep(activeStep + 1);
    }
  };

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

  const DecreaseCartItem = (product_id, current_quantity) => {
    if (current_quantity == 1) {
      setShowMassage("Use delete icon to remove item from cart!")
      _setOpenMassage(true)
    } else {
      setLoading(true);

      const cartObj = {
        product_id: product_id,
        quantity: 1,
      };
      axiosConfig
        .post("/users/card/decrease", cartObj, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          getAddresses()
          _setTrigger(_trigger+1)
          setTrigger(_trigger+1)
          
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
    if (current_quantity+1 > 10) {
      setShowMassage("You can not add more than 10 items to your cart!")
      _setOpenMassage(true)
    } else {
      setLoading(true);
      const cartObj = {
        product_id: product_id,
        quantity: 1,
      };
      axiosConfig.post("/users/card/add", cartObj, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then((res) => {
        getAddresses();
        _setTrigger(_trigger+1)
        setTrigger(_trigger+1)

      }).catch((err) => {
        setShowMassage('Increase cart item has a problem!')
        setOpenMassage(true)
      }).catch((err) =>{
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
  const CardContentNoPadding = styled(CardContent)(`
    padding: 0;
    &:last-child {
      padding-bottom: 0;
    }
  `);
  const step1 = () => {
    return (
      <>
        <Hidden mdDown>
          <Grid xs={12} display="flex" flexWrap="wrap">

            <Grid md={11} xs={12}>
              <Grid xs={12} display='flex' justifyContent='center' alignItems='center' bgcolor="P3.main"  height="55px" borderRadius="5px" mb="1px" mr={window.innerWidth>899? 0:"16px"} ml={window.innerWidth>899? 0:"16px"}>
                <Typography color='Black.main' variant="h37">My Orders</Typography>
              </Grid>
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

                  let categoryName = category.title.split(' ')[0];

                  let color = product.attributes.find(a => a.name ===  ('Color' ))?.value;
                  let spericalPower = product.attributes.find(a => a.name === ('Spherical Power'))?.value ;
                  let clyndrycalPower = product.attributes.find(a => a.name === ('Cylindrical  Power'))?.value;
                  let axis = product.attributes.find(a => a.name === ('Axis'))?.value;
                  return (
                    <>
                      <Grid xs={12} bgcolor={"rgba(33, 33, 33, 50)"} mt={"4px"} borderRadius="5px" mr={window.innerWidth>899? 0:"16px"} ml={window.innerWidth>899? 0:"16px"}>
                        <Grid bgcolor="rgba(117, 117, 117, 0.25)" xs={12}  height="228px">
                          <Grid height="100%" xs={12} display="flex" alignItems='center' sx={{background: "rgba(203, 146, 155, 0.08)"
                          ,borderRadius:'5px'}}> 
                            <Grid xs={window.innerWidth>530? (window.innerWidth>680?4 :6):3} md={6} lg={6} display="flex" justifyContent='center' alignItems="center">
                              <Card
                              sx={{ display: "flex", border: "none", boxShadow: "none" ,mt:"4px"}}
                              >
                                <CardMedia
                                  component="img"
                                  sx={{ width: "147px" }}
                                  height="110"
                                  image={
                                    axiosConfig.defaults.baseURL +
                                    cart.product_file_urls[0].image_url
                                  }
                                />
                              </Card>
                            </Grid>
                            <Grid xs={12} height="100%" >
                              <CardContent style={{ width: "100%" }} sx={{pt:"33px",pl:0,height:"100%",pb:0,}} >
                                <Grid xs={12} pt={0} pl="24px">
                                  <Typography variant="h8" color="White.main">
                                    {cart.product_group.name}
                                  </Typography>
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
                                  {category.title == 'Sunglasses'?
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
                                        <Typography variant="h10" pl="14px" sx={{fontSize:{xl:"16px",lg:"16px",md:window.innerWidth>1110? "16px":window.innerWidth>1010?'14px':window.innerWidth>980?"12px":"11px",xs:"12px"},fontWeight:'400'}}>
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
                                        <Typography variant="h10" pl="14px" sx={{fontSize:{xl:"16px",lg:"16px",md:window.innerWidth>1110? "16px":window.innerWidth>1010?'14px':window.innerWidth>980?"12px":"11px",xs:"12px"},fontWeight:'400'}}>
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
                                        <Typography variant="h10" pl="14px" sx={{fontSize:{xl:"16px",lg:"16px",md:window.innerWidth>1110? "16px":window.innerWidth>1010?'14px':window.innerWidth>980?"12px":"11px",xs:"12px"},fontWeight:'400'}}>
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
                                        <Typography variant="h10" pl="14px"  sx={{fontSize:{xl:"16px",lg:"16px",md:window.innerWidth>1110? "16px":window.innerWidth>1010?'14px':window.innerWidth>980?"12px":"11px",xs:"12px"},fontWeight:'400'}}>
                                          {categoryName+' . '+category.type}
                                        </Typography>
                                      </Grid>
                                      <Grid xs={12} display='flex' alignItems='center' pt="9px" >
                                        <SvgIcon
                                                                                        
                                          titleAccess="title"
                                          component={(componentProps) => (
                                            <svg width="15" height="17" viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                              <path d="M6 0.500001C5.62858 0.221433 5.18692 0.0517978 4.72451 0.0101029C4.26211 -0.031592 3.79723 0.0563008 3.38197 0.263933C2.9667 0.471565 2.61746 0.790733 2.37337 1.18567C2.12929 1.58061 2 2.03572 2 2.5V4H1C0.734783 4 0.48043 4.10536 0.292893 4.29289C0.105357 4.48043 0 4.73478 0 5V13C0 13.7957 0.316071 14.5587 0.87868 15.1213C1.44129 15.6839 2.20435 16 3 16H7.53L6.551 15H3C2.46957 15 1.96086 14.7893 1.58579 14.4142C1.21071 14.0391 1 13.5304 1 13V5H7V7.052C7.16779 7.01738 7.33867 6.99995 7.51 7H8V5H11V7.077C11.366 7.17 11.709 7.345 12 7.591V5C12 4.73478 11.8946 4.48043 11.7071 4.29289C11.5196 4.10536 11.2652 4 11 4H10V2.5C10 2.03572 9.87071 1.58061 9.62663 1.18567C9.38254 0.790733 9.0333 0.471565 8.61803 0.263933C8.20277 0.0563008 7.73789 -0.031592 7.27549 0.0101029C6.81308 0.0517978 6.37142 0.221433 6 0.500001ZM3 2.5C3 2.10218 3.15803 1.72065 3.43934 1.43934C3.72064 1.15804 4.10218 1 4.5 1C4.89782 1 5.27936 1.15804 5.56066 1.43934C5.84196 1.72065 6 2.10218 6 2.5V4H3V2.5ZM6.667 1.252C6.89291 1.10115 7.15554 1.01447 7.42686 1.00123C7.69818 0.987981 7.968 1.04866 8.20753 1.17679C8.44706 1.30492 8.64729 1.49569 8.78686 1.72874C8.92643 1.96178 9.0001 2.22836 9 2.5V4H7V2.5C7 2.046 6.879 1.62 6.667 1.252ZM6.432 13.449C6.15523 13.1664 6.00015 12.7866 6 12.391V9.511C5.99987 9.31262 6.03883 9.11616 6.11465 8.93284C6.19048 8.74953 6.30169 8.58295 6.44192 8.44262C6.58214 8.3023 6.74865 8.19099 6.93192 8.11504C7.11518 8.03909 7.31162 8 7.51 8H10.383C10.786 8 11.172 8.161 11.455 8.447L14.562 11.587C14.703 11.7294 14.8144 11.8984 14.8895 12.0842C14.9647 12.27 15.0022 12.4688 14.9999 12.6692C14.9976 12.8696 14.9554 13.0676 14.876 13.2516C14.7965 13.4355 14.6813 13.6019 14.537 13.741L11.59 16.578C11.3035 16.8541 10.9195 17.0058 10.5216 17C10.1238 16.9941 9.74434 16.8313 9.466 16.547L6.432 13.449ZM8 10.75C8 10.9489 8.07902 11.1397 8.21967 11.2803C8.36032 11.421 8.55109 11.5 8.75 11.5C8.94891 11.5 9.13968 11.421 9.28033 11.2803C9.42098 11.1397 9.5 10.9489 9.5 10.75C9.5 10.5511 9.42098 10.3603 9.28033 10.2197C9.13968 10.079 8.94891 10 8.75 10C8.55109 10 8.36032 10.079 8.21967 10.2197C8.07902 10.3603 8 10.5511 8 10.75Z" fill="#CB929B"/>
                                            </svg>
        
                                          )}
                                        />
                                        <Typography variant="h10" pl="17px" sx={{fontSize:{xl:"16px",lg:"16px",md:window.innerWidth>1110? "16px":window.innerWidth>1010?'14px':window.innerWidth>980?"12px":"11px",xs:"12px"},fontWeight:'400'}}>
                                          {brand}
                                        </Typography>
                                      </Grid>
                                      <Grid xs={12} display='flex' alignItems='center' pt="11px" pl="1px" >
                                        <SvgIcon
                                                                                        
                                          titleAccess="title"
                                          component={(componentProps) => (
                                            <svg width="10" height="17" viewBox="0 0 10 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                              <path d="M0 0H10V5.1L6.66667 8.5L10 11.9V17H0V11.9L3.33333 8.5L0 5.1V0ZM8.33333 12.325L5 8.925L1.66667 12.325V15.3H8.33333V12.325ZM5 8.075L8.33333 4.675V1.7H1.66667V4.675L5 8.075ZM3.33333 3.4H6.66667V4.0375L5 5.7375L3.33333 4.0375V3.4Z" fill="#CB929B"/>
                                            </svg>
        
                                          )}
                                        />
                                        <Typography variant="h10" pl="23px" sx={{fontSize:{xl:"16px",lg:"16px",md:window.innerWidth>1110? "16px":window.innerWidth>1010?'14px':window.innerWidth>980?"12px":"11px",xs:"12px"},fontWeight:'400'}}>
                                          {duration}
                                        </Typography>
                                      </Grid>
                                      <Grid xs={12} display='flex' alignItems='center' pt="11px" pl="1px" >
                                        <SvgIcon
                                                                                        
                                          titleAccess="title"
                                          component={(componentProps) => (
                                            <svg width="15" height="17" viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                              <path d="M14.8485 4.26642H14.8413C14.7378 4.08621 14.5914 3.93592 14.4159 3.82962L8.06973 0.150211C7.89648 0.0516893 7.70168 0 7.50362 0C7.30557 0 7.11077 0.0516893 6.93752 0.150211L0.591394 3.81482C0.412203 3.91875 0.262938 4.06943 0.158703 4.25161C0.158703 4.25258 0.158517 4.25354 0.158154 4.25444C0.157792 4.25534 0.157261 4.25616 0.156591 4.25684C0.155921 4.25753 0.155126 4.25808 0.154251 4.25845C0.153377 4.25882 0.152439 4.25901 0.151492 4.25901V4.27382C0.0505255 4.44847 -0.00185452 4.64819 5.01522e-05 4.85127V12.1509C0.000414772 12.3619 0.0553521 12.5691 0.159248 12.7512C0.263144 12.9333 0.412272 13.0838 0.591394 13.1873L6.93752 16.8519C7.09729 16.9414 7.27492 16.9921 7.45675 17H7.55771C7.73708 16.9909 7.91212 16.9403 8.06973 16.8519L14.4159 13.1873C14.5931 13.0823 14.7404 12.9312 14.8429 12.7493C14.9455 12.5674 14.9996 12.361 15 12.1509V4.85127C15.001 4.64597 14.9488 4.44408 14.8485 4.26642ZM7.50002 1.18667L13.2548 4.50332L11.0409 5.79148L5.22839 2.49704L7.50002 1.18667ZM7.56492 7.81998L1.75966 4.50332L4.04571 3.18554L9.86539 6.47999L7.56492 7.81998ZM1.15389 5.51016L6.988 8.84903L6.93031 15.4897L1.15389 12.1509V5.51016ZM8.08415 15.4823L8.14184 8.84903L10.4567 7.49423V10.3149C10.4567 10.4719 10.5175 10.6226 10.6257 10.7337C10.7339 10.8447 10.8806 10.9071 11.0337 10.9071C11.1867 10.9071 11.3334 10.8447 11.4416 10.7337C11.5498 10.6226 11.6106 10.4719 11.6106 10.3149V6.82054L13.8461 5.51757V12.1509L8.08415 15.4823Z" fill="#CB929B"/>
                                            </svg>
                                          )}
                                        />
                                        <Typography variant="h10" pl="17px" sx={{fontSize:{xl:"16px",lg:"16px",md:window.innerWidth>1110? "16px":window.innerWidth>1010?'14px':window.innerWidth>980?"12px":"11px",xs:"12px"},fontWeight:'400'}}>
                                          {packagings}
                                        </Typography>
                                      </Grid>
                                    </Grid>
                                  }
                                  {category.title == 'Sunglasses'?
                                    <Grid
                                      item
                                      xs={6}
                                      color="white"
                                      display='flex'
                                      flexDirection='column'
                                    >
                                      <Grid xs={12} display='flex' alignItems='center' pt="12px" >
                                        <Typography variant="h10" sx={{fontSize:{xl:"16px",lg:"16px",md:window.innerWidth>1110? "16px":window.innerWidth>1010?'14px':window.innerWidth>980?"12px":"11px",xs:"12px"},fontWeight:'400'}}>
                                          {"Front color: "+frontColor}
                                        </Typography>
                                      </Grid>
                                      <Grid xs={12} display='flex' alignItems='center' pt="11px" >
                                        <Typography variant="h10" sx={{fontSize:{xl:"16px",lg:"16px",md:window.innerWidth>1110? "16px":window.innerWidth>1010?'14px':window.innerWidth>980?"12px":"11px",xs:"12px"},fontWeight:'400'}}>
                                          {"Lens Color: "+lensColor}
                                        </Typography>
                                      </Grid>
                                      <Grid xs={12} display='flex' alignItems='center' pt="9px" >
                                        <Typography variant="h10" sx={{fontSize:{xl:"16px",lg:"16px",md:window.innerWidth>1110? "16px":window.innerWidth>1010?'14px':window.innerWidth>980?"12px":"11px",xs:"12px"},fontWeight:'400'}}>
                                          {"Lens Properties: "+lensProperties}
                                        </Typography>
                                      </Grid>
                                    </Grid>
                                  :
                                    (category.title.includes("Color")?
                                      <Grid
                                        item
                                        xs={6}
                                        color="white"
                                        display='flex'
                                        flexDirection='column'
                                      >
                                        <Grid xs={12} display='flex' alignItems='center' pt="12px" >
                                          <Typography variant="h10" sx={{fontSize:{xl:"16px",lg:"16px",md:window.innerWidth>1110? "16px":window.innerWidth>1010?'14px':window.innerWidth>980?"12px":"11px",xs:"12px"},fontWeight:'400'}}>
                                            {"Color: "+color}
                                          </Typography>
                                        </Grid>
                                        <Grid xs={12} display='flex' alignItems='center' pt="9px">
                                          <Typography variant="h10" sx={{fontSize:{xl:"16px",lg:"16px",md:window.innerWidth>1110? "16px":window.innerWidth>1010?'14px':window.innerWidth>980?"12px":"11px",xs:"12px"},fontWeight:'400'}}>
                                            {"Spherical: "+spericalPower}
                                          </Typography>
                                        </Grid>
                                        <Grid xs={12} display='flex' alignItems='center' pt="11px" >
                                          <Typography variant="h10" sx={{fontSize:{xl:"16px",lg:"16px",md:window.innerWidth>1110? "16px":window.innerWidth>1010?'14px':window.innerWidth>980?"12px":"11px",xs:"12px"},fontWeight:'400'}}>
                                            {"Cylindrical Power: "+clyndrycalPower}
                                          </Typography>
                                        </Grid>
                                        <Grid xs={12} display='flex' alignItems='center' pt="11px" >
                                          <Typography variant="h10" sx={{fontSize:{xl:"16px",lg:"16px",md:window.innerWidth>1110? "16px":window.innerWidth>1010?'14px':window.innerWidth>980?"12px":"11px",xs:"12px"},fontWeight:'400'}}>
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
                                        sx={{pl:{md:window.innerWidth>980?"5px":0}}}
                                      >
                                        <Grid xs={12} display='flex' alignItems='center' pt="12px">
                                          <Typography variant="h10" sx={{fontSize:{xl:"16px",lg:"16px",md:window.innerWidth>1110? "16px":window.innerWidth>1010?'14px':window.innerWidth>980?"12px":"11px",xs:"12px"},fontWeight:'400'}}>
                                            {"Spherical: "+spericalPower}
                                          </Typography>
                                        </Grid>
                                      </Grid>
                                    
                                    )
                                  }
                                  
                                </Grid>
                              </CardContent>
                            </Grid>      
                          </Grid>


                        </Grid>

                      </Grid>
                      <Grid xs={12} bgcolor={"rgba(33, 33, 33, 50)"} mt="2px" borderRadius="5px" mr={window.innerWidth>899? 0:"16px"} ml={window.innerWidth>899? 0:"16px"}>
                        <Grid
                          xs={12}
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          bgcolor="rgba(203, 146, 155, 0.35)"
                        >
                          <Grid xs={1}></Grid>
                          <Grid xs={6} display="flex" alignItems='center'>
                            <Typography variant="h3" color="White.main">
                              {cart.product_price} KWD
                            </Typography>
                          </Grid>
                          <Grid
                            xs={6}
                            display="flex"
                            alignItems="center"
                            justifyContent="end"
                            pt="15px"
                            pb="15px"
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
                          <Grid xs={1}></Grid>
                        </Grid>
                      </Grid>
                    </>
                  );
                })}
            </Grid>
            
              {loading&&(
                <Backdrop
                  sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 ,display:'flex',justifyContent:'center'}}
                  open={loading}
                >
                  <Card
                    elevation={0}
                    sx={{ background: "rgba(0,0,0,0)" }}
                  >
                    <CardMedia
                      sx={{ width: "202px", color: "white", cursor: "pointer" }}
                      component="img"
                      image={LogoWhite}
                    ></CardMedia>
                  </Card>
                </Backdrop>

              )}
          </Grid>
        </Hidden>
        <Hidden mdUp>
          <Grid xs={12} display="flex" flexWrap="wrap">

            <Grid md={11} xs={12}>
              <Grid xs={12} display='flex' justifyContent='center' alignItems='center' bgcolor="P3.main"  height="55px" borderRadius="5px" mb="1px" mr={window.innerWidth>899? 0:"16px"} ml={window.innerWidth>899? 0:"16px"}>
                <Typography color='Black.main' variant="h37">My Orders</Typography>
              </Grid>
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


                  let color = product.attributes.find(a => a.name ===  ('Color' ))?.value;
                  let spericalPower = product.attributes.find(a => a.name === ('Spherical Power'))?.value ;
                  let clyndrycalPower = product.attributes.find(a => a.name === ('Cylindrical  Power'))?.value;
                  let axis = product.attributes.find(a => a.name === ('Axis'))?.value;
                  return (
                    <>
                      <Grid xs={12} bgcolor={"rgba(33, 33, 33, 50)"} mt={"4px"} borderRadius="5px" mr={"16px"} ml={"16px"}>
                        <Grid bgcolor="rgba(117, 117, 117, 0.25)" xs={12}  height="350px" display='flex' alignItems='center'>
                          <Grid height="100%" xs={12} display="flex" flexDirection='column' justifyContent='center'  sx={{background: "rgba(203, 146, 155, 0.08)"
                          ,borderRadius:'5px'}}> 
                            <Grid xs={12} display="flex" justifyContent='center' alignItems="center" maxHeight="110px">
                              <Card
                              sx={{ display: "flex", border: "none", boxShadow: "none" ,mt:"4px",maxHeight:'110px'}}
                              >
                                <CardMedia
                                  component="img"
                                  sx={{ width: "147px",maxHeight:'110px' }}
                                  height="110px"
                                  image={
                                    axiosConfig.defaults.baseURL +
                                    cart.product_file_urls[0].image_url
                                  }
                                />
                              </Card>
                            </Grid>
                            <CardContentNoPadding style={{ width: "100%" }} sx={{pt:0,pl:0,pb:0,'.css-o6o9s3-MuiCardContent-root:last-child':{paddingBottom:0}}} >
                              <Grid xs={12} pt='8px' display='flex'justifyContent='center'>
                                <Typography variant="h7" color="White.main">
                                  {cart.product_group.name}
                                </Typography>
                              </Grid>
                              <Grid 
                                container
                                xs={12}
                                sx={{
                                  display: "flex",
                                  justifyContent: "start",
                                  flexWrap:'wrap',
                                  alignItems: "center",
                                }}
                              >
                                {category.title == 'Sunglasses'?
                                  <Grid
                                    item
                                    xs={12}
                                    color="white"
                                    display='flex'
                                    padding="0 20px 0 20px"
                                    justifyContent='center'
                                    alignItems='center'
                                    pt="16px"
                                    gap={window.innerWidth>400?'50px':window.innerWidth>350?"30px":"25px"}
                                  >
                                    <Grid display='flex' flexDirection='column' justifyContent='center'  alignItems='center' >
                                      <SvgIcon
                                                                                      
                                        titleAccess="title"
                                        component={(componentProps) => (
                                          <svg width="15" height="17" viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6 0.500001C5.62858 0.221433 5.18692 0.0517978 4.72451 0.0101029C4.26211 -0.031592 3.79723 0.0563008 3.38197 0.263933C2.9667 0.471565 2.61746 0.790733 2.37337 1.18567C2.12929 1.58061 2 2.03572 2 2.5V4H1C0.734783 4 0.48043 4.10536 0.292893 4.29289C0.105357 4.48043 0 4.73478 0 5V13C0 13.7957 0.316071 14.5587 0.87868 15.1213C1.44129 15.6839 2.20435 16 3 16H7.53L6.551 15H3C2.46957 15 1.96086 14.7893 1.58579 14.4142C1.21071 14.0391 1 13.5304 1 13V5H7V7.052C7.16779 7.01738 7.33867 6.99995 7.51 7H8V5H11V7.077C11.366 7.17 11.709 7.345 12 7.591V5C12 4.73478 11.8946 4.48043 11.7071 4.29289C11.5196 4.10536 11.2652 4 11 4H10V2.5C10 2.03572 9.87071 1.58061 9.62663 1.18567C9.38254 0.790733 9.0333 0.471565 8.61803 0.263933C8.20277 0.0563008 7.73789 -0.031592 7.27549 0.0101029C6.81308 0.0517978 6.37142 0.221433 6 0.500001ZM3 2.5C3 2.10218 3.15803 1.72065 3.43934 1.43934C3.72064 1.15804 4.10218 1 4.5 1C4.89782 1 5.27936 1.15804 5.56066 1.43934C5.84196 1.72065 6 2.10218 6 2.5V4H3V2.5ZM6.667 1.252C6.89291 1.10115 7.15554 1.01447 7.42686 1.00123C7.69818 0.987981 7.968 1.04866 8.20753 1.17679C8.44706 1.30492 8.64729 1.49569 8.78686 1.72874C8.92643 1.96178 9.0001 2.22836 9 2.5V4H7V2.5C7 2.046 6.879 1.62 6.667 1.252ZM6.432 13.449C6.15523 13.1664 6.00015 12.7866 6 12.391V9.511C5.99987 9.31262 6.03883 9.11616 6.11465 8.93284C6.19048 8.74953 6.30169 8.58295 6.44192 8.44262C6.58214 8.3023 6.74865 8.19099 6.93192 8.11504C7.11518 8.03909 7.31162 8 7.51 8H10.383C10.786 8 11.172 8.161 11.455 8.447L14.562 11.587C14.703 11.7294 14.8144 11.8984 14.8895 12.0842C14.9647 12.27 15.0022 12.4688 14.9999 12.6692C14.9976 12.8696 14.9554 13.0676 14.876 13.2516C14.7965 13.4355 14.6813 13.6019 14.537 13.741L11.59 16.578C11.3035 16.8541 10.9195 17.0058 10.5216 17C10.1238 16.9941 9.74434 16.8313 9.466 16.547L6.432 13.449ZM8 10.75C8 10.9489 8.07902 11.1397 8.21967 11.2803C8.36032 11.421 8.55109 11.5 8.75 11.5C8.94891 11.5 9.13968 11.421 9.28033 11.2803C9.42098 11.1397 9.5 10.9489 9.5 10.75C9.5 10.5511 9.42098 10.3603 9.28033 10.2197C9.13968 10.079 8.94891 10 8.75 10C8.55109 10 8.36032 10.079 8.21967 10.2197C8.07902 10.3603 8 10.5511 8 10.75Z" fill="#CB929B"/>
                                          </svg>
                                        )}
                                      />
                                      <Typography variant="h10"   sx={window.innerWidth>350?{}:{fontSize:'12px'}}>
                                        {brand}
                                      </Typography>
                                    </Grid>
                                    <Grid display='flex' flexDirection='column' justifyContent='center'  alignItems='center'>
                                      <SvgIcon
                                                                                      
                                        titleAccess="title"
                                        component={(componentProps) => (
                                          <svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6.25 0C3.84125 0 1.875 1.96625 1.875 4.375C1.875 5.88125 2.64375 7.22 3.80875 8.00813C1.57938 8.96438 0 11.175 0 13.75H1.25C1.25 10.9812 3.48125 8.75 6.25 8.75C9.01875 8.75 11.25 10.9812 11.25 13.75H12.5C12.5 11.175 10.9206 8.96375 8.69125 8.0075C9.286 7.60627 9.77328 7.06531 10.1104 6.43202C10.4475 5.79873 10.6242 5.09243 10.625 4.375C10.625 1.96625 8.65875 0 6.25 0ZM6.25 1.25C7.98312 1.25 9.375 2.64188 9.375 4.375C9.375 6.10812 7.98312 7.5 6.25 7.5C4.51688 7.5 3.125 6.10812 3.125 4.375C3.125 2.64188 4.51688 1.25 6.25 1.25Z" fill="#CB929B"/>
                                          </svg>

                                        )}
                                      />
                                      <Typography variant="h10"  sx={window.innerWidth>350?{}:{fontSize:'12px'}}>
                                        {gender}
                                      </Typography>
                                    </Grid>
                                    <Grid  display='flex' flexDirection='column' justifyContent='center'  alignItems='center'>
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
                                      <Typography variant="h10"  sx={window.innerWidth>350?{}:{fontSize:'12px'}}>
                                        {type}
                                      </Typography>
                                    </Grid>
                                  </Grid>
                                :
                                  <Grid
                                    item
                                    xs={12}
                                    color="white"
                                    pt="16px"
                                    display='flex'
                                    justifyContent='center'
                                    alignItems='center'
                                    gap={window.innerWidth>400?'50px':window.innerWidth>350?"40px":"25px"}
                                  >
                                    
                                    <Grid display='flex' flexDirection='column' justifyContent='center'  alignItems='center'>
                                      <SvgIcon
                                                                                      
                                        titleAccess="title"
                                        component={(componentProps) => (
                                          <svg width="15" height="17" viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6 0.500001C5.62858 0.221433 5.18692 0.0517978 4.72451 0.0101029C4.26211 -0.031592 3.79723 0.0563008 3.38197 0.263933C2.9667 0.471565 2.61746 0.790733 2.37337 1.18567C2.12929 1.58061 2 2.03572 2 2.5V4H1C0.734783 4 0.48043 4.10536 0.292893 4.29289C0.105357 4.48043 0 4.73478 0 5V13C0 13.7957 0.316071 14.5587 0.87868 15.1213C1.44129 15.6839 2.20435 16 3 16H7.53L6.551 15H3C2.46957 15 1.96086 14.7893 1.58579 14.4142C1.21071 14.0391 1 13.5304 1 13V5H7V7.052C7.16779 7.01738 7.33867 6.99995 7.51 7H8V5H11V7.077C11.366 7.17 11.709 7.345 12 7.591V5C12 4.73478 11.8946 4.48043 11.7071 4.29289C11.5196 4.10536 11.2652 4 11 4H10V2.5C10 2.03572 9.87071 1.58061 9.62663 1.18567C9.38254 0.790733 9.0333 0.471565 8.61803 0.263933C8.20277 0.0563008 7.73789 -0.031592 7.27549 0.0101029C6.81308 0.0517978 6.37142 0.221433 6 0.500001ZM3 2.5C3 2.10218 3.15803 1.72065 3.43934 1.43934C3.72064 1.15804 4.10218 1 4.5 1C4.89782 1 5.27936 1.15804 5.56066 1.43934C5.84196 1.72065 6 2.10218 6 2.5V4H3V2.5ZM6.667 1.252C6.89291 1.10115 7.15554 1.01447 7.42686 1.00123C7.69818 0.987981 7.968 1.04866 8.20753 1.17679C8.44706 1.30492 8.64729 1.49569 8.78686 1.72874C8.92643 1.96178 9.0001 2.22836 9 2.5V4H7V2.5C7 2.046 6.879 1.62 6.667 1.252ZM6.432 13.449C6.15523 13.1664 6.00015 12.7866 6 12.391V9.511C5.99987 9.31262 6.03883 9.11616 6.11465 8.93284C6.19048 8.74953 6.30169 8.58295 6.44192 8.44262C6.58214 8.3023 6.74865 8.19099 6.93192 8.11504C7.11518 8.03909 7.31162 8 7.51 8H10.383C10.786 8 11.172 8.161 11.455 8.447L14.562 11.587C14.703 11.7294 14.8144 11.8984 14.8895 12.0842C14.9647 12.27 15.0022 12.4688 14.9999 12.6692C14.9976 12.8696 14.9554 13.0676 14.876 13.2516C14.7965 13.4355 14.6813 13.6019 14.537 13.741L11.59 16.578C11.3035 16.8541 10.9195 17.0058 10.5216 17C10.1238 16.9941 9.74434 16.8313 9.466 16.547L6.432 13.449ZM8 10.75C8 10.9489 8.07902 11.1397 8.21967 11.2803C8.36032 11.421 8.55109 11.5 8.75 11.5C8.94891 11.5 9.13968 11.421 9.28033 11.2803C9.42098 11.1397 9.5 10.9489 9.5 10.75C9.5 10.5511 9.42098 10.3603 9.28033 10.2197C9.13968 10.079 8.94891 10 8.75 10C8.55109 10 8.36032 10.079 8.21967 10.2197C8.07902 10.3603 8 10.5511 8 10.75Z" fill="#CB929B"/>
                                          </svg>
      
                                        )}
                                      />
                                      <Typography variant="h10" sx={window.innerWidth>350?{}:{fontSize:'12px'}}>
                                        {brand}
                                      </Typography>
                                    </Grid>
                                    <Grid display='flex' flexDirection='column' justifyContent='center'  alignItems='center'>
                                      <SvgIcon
                                                                                      
                                        titleAccess="title"
                                        component={(componentProps) => (
                                          <svg width="10" height="17" viewBox="0 0 10 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M0 0H10V5.1L6.66667 8.5L10 11.9V17H0V11.9L3.33333 8.5L0 5.1V0ZM8.33333 12.325L5 8.925L1.66667 12.325V15.3H8.33333V12.325ZM5 8.075L8.33333 4.675V1.7H1.66667V4.675L5 8.075ZM3.33333 3.4H6.66667V4.0375L5 5.7375L3.33333 4.0375V3.4Z" fill="#CB929B"/>
                                          </svg>
      
                                        )}
                                      />
                                      <Typography variant="h10"  sx={window.innerWidth>350?{}:{fontSize:'12px'}}>
                                        {duration}
                                      </Typography>
                                    </Grid>
                                    <Grid display='flex' flexDirection='column' justifyContent='center'  alignItems='center'>
                                      <SvgIcon
                                                                                      
                                        titleAccess="title"
                                        component={(componentProps) => (
                                          <svg width="15" height="17" viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M14.8485 4.26642H14.8413C14.7378 4.08621 14.5914 3.93592 14.4159 3.82962L8.06973 0.150211C7.89648 0.0516893 7.70168 0 7.50362 0C7.30557 0 7.11077 0.0516893 6.93752 0.150211L0.591394 3.81482C0.412203 3.91875 0.262938 4.06943 0.158703 4.25161C0.158703 4.25258 0.158517 4.25354 0.158154 4.25444C0.157792 4.25534 0.157261 4.25616 0.156591 4.25684C0.155921 4.25753 0.155126 4.25808 0.154251 4.25845C0.153377 4.25882 0.152439 4.25901 0.151492 4.25901V4.27382C0.0505255 4.44847 -0.00185452 4.64819 5.01522e-05 4.85127V12.1509C0.000414772 12.3619 0.0553521 12.5691 0.159248 12.7512C0.263144 12.9333 0.412272 13.0838 0.591394 13.1873L6.93752 16.8519C7.09729 16.9414 7.27492 16.9921 7.45675 17H7.55771C7.73708 16.9909 7.91212 16.9403 8.06973 16.8519L14.4159 13.1873C14.5931 13.0823 14.7404 12.9312 14.8429 12.7493C14.9455 12.5674 14.9996 12.361 15 12.1509V4.85127C15.001 4.64597 14.9488 4.44408 14.8485 4.26642ZM7.50002 1.18667L13.2548 4.50332L11.0409 5.79148L5.22839 2.49704L7.50002 1.18667ZM7.56492 7.81998L1.75966 4.50332L4.04571 3.18554L9.86539 6.47999L7.56492 7.81998ZM1.15389 5.51016L6.988 8.84903L6.93031 15.4897L1.15389 12.1509V5.51016ZM8.08415 15.4823L8.14184 8.84903L10.4567 7.49423V10.3149C10.4567 10.4719 10.5175 10.6226 10.6257 10.7337C10.7339 10.8447 10.8806 10.9071 11.0337 10.9071C11.1867 10.9071 11.3334 10.8447 11.4416 10.7337C11.5498 10.6226 11.6106 10.4719 11.6106 10.3149V6.82054L13.8461 5.51757V12.1509L8.08415 15.4823Z" fill="#CB929B"/>
                                          </svg>
                                        )}
                                      />
                                      <Typography variant="h10"  sx={window.innerWidth>350?{}:{fontSize:'12px'}}>
                                        {packagings}
                                      </Typography>
                                    </Grid>
                                  </Grid>
                                }
                                {category.title == 'Sunglasses'?
                                  <Grid
                                    item
                                    xs={12}
                                    color="white"
                                    display='flex'
                                    flexDirection='column'
                                    pl="30px"
                                  >
                                    <Grid xs={12} display='flex' alignItems='center' pt="12px" >
                                      <Typography variant="h10" >
                                        {"Front color:"+frontColor}
                                      </Typography>
                                    </Grid>
                                    <Grid xs={12} display='flex' alignItems='center' pt="11px" >
                                      <Typography variant="h10" >
                                        {"Lens Color: "+lensColor}
                                      </Typography>
                                    </Grid>
                                    <Grid xs={12} display='flex' alignItems='center' pt="9px" >
                                      <Typography variant="h10" >
                                        {"Lens Properties: "+lensProperties}
                                      </Typography>
                                    </Grid>
                                  </Grid>
                                :
                                  (category.title.includes("Color")?
                                    <Grid
                                      item
                                      xs={12}
                                      color="white"
                                      display='flex'
                                      flexDirection='column'
                                      pl="30px"
                                    >
                                      <Grid xs={12} display='flex' alignItems='center' pt="12px" >
                                        <Typography variant="h10" >
                                          {"Color: "+color}
                                        </Typography>
                                      </Grid>
                                      <Grid xs={12} display='flex' alignItems='center' pt="9px">
                                        <Typography variant="h10" >
                                          {"Spherical: "+spericalPower}
                                        </Typography>
                                      </Grid>
                                      <Grid xs={12} display='flex' alignItems='center' pt="11px" >
                                        <Typography variant="h10" >
                                          {"Cylindrical Power: "+clyndrycalPower}
                                        </Typography>
                                      </Grid>
                                      <Grid xs={12} display='flex' alignItems='center' pt="11px" >
                                        <Typography variant="h10" >
                                          {"Axis: "+axis}
                                        </Typography>
                                      </Grid>
                                    </Grid>
                                  :
                                    <Grid
                                      item
                                      xs={12}
                                      color="white"
                                      display='flex'
                                      flexDirection='column'
                                      pl="30px"
                                    >
                                      <Grid xs={12} display='flex' alignItems='center' pt="12px">
                                        <Typography variant="h10" >
                                          {"Spherical: "+spericalPower}
                                        </Typography>
                                      </Grid>
                                    </Grid>
                                  
                                  )
                                }
                                
                              </Grid>
                            </CardContentNoPadding>
                          </Grid>


                        </Grid>

                      </Grid>
                      <Grid xs={12} bgcolor={"rgba(33, 33, 33, 50)"} mt="2px" borderRadius="5px" mr={window.innerWidth>899? 0:"16px"} ml={window.innerWidth>899? 0:"16px"}>
                        <Grid
                          xs={12}
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          bgcolor="rgba(203, 146, 155, 0.35)"
                        >
                          <Grid xs={1}></Grid>
                          <Grid xs={6} display="flex" alignItems='center'>
                            <Typography variant="h3" color="White.main">
                              {cart.product_price} KWD
                            </Typography>
                          </Grid>
                          <Grid
                            xs={6}
                            display="flex"
                            alignItems="center"
                            justifyContent="end"
                            pt="15px"
                            pb="15px"
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
                          <Grid xs={1}></Grid>
                        </Grid>
                      </Grid>
                    </>
                  );
                })}
            </Grid>
            
              {loading&&(
                <Backdrop
                  sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 ,display:'flex',justifyContent:'center'}}
                  open={loading}
                >
                  <Card
                    elevation={0}
                    sx={{ background: "rgba(0,0,0,0)" }}
                  >
                    <CardMedia
                      sx={{ width: "202px", color: "white", cursor: "pointer" }}
                      component="img"
                      image={LogoWhite}
                    ></CardMedia>
                  </Card>
                </Backdrop>

              )}
          </Grid>
        </Hidden>
      </>
    );
  };
  const step2 = () => {
    return (
      <Grid
        xs={12}
        p={1}
        mr={5}
        sx={{
          mr: window.innerWidth>900?5:1,
          ml: window.innerWidth>900?0:1
        }}
      >
        <Grid
          xs={12}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          bgcolor="P3.main"
          borderRadius="5px"
          height="55px"
        >
          <Hidden mdDown>
            <Grid xs={window.innerWidth>1179?6:3}></Grid>
            <Grid xs={6} display="flex" justifyContent='center' alignItems="center">
              <Typography variant="h37">Shipping Address</Typography>
            </Grid>
            <Grid xs={window.innerWidth>1179?6:3} display='flex' justifyContent="flex-end" pr="41px">
              <Button color="White" sx={{bgcolor:"P.main",width:"34px",minWidth:"34px",height:"28px","&:hover":{bgcolor:"P.main"}
              
              }} 
              
              onClick={handleClickOpenAddressDialog}>
              +
              </Button>


            </Grid>

          </Hidden>
          <Hidden mdUp>
          <Grid xs={12} display="flex" justifyContent='center' alignItems="center" ml={1} mr={1}>
            <Typography variant="h37">Shipping Address</Typography>
          </Grid>
          </Hidden>
        </Grid>
        <Grid xs={12} display="flex" flexWrap="wrap" pb={2}>
          {addresses.map((address, index) => {
            return (
              <Grid md={12} m={1} ml={0} mr={0} xs={12} border={1} borderColor="#E0E0E0" pl="20px" 
              sx={{ backgroundImage: `url(${backgroundAddress})` }}>
                <Grid display="flex" alignItems="center">
                  <Radio
                    checked={selectedValueRadioShipping === `${index + 1}`}
                    onClick={() => setAddressesId(address.id)}
                    onChange={(event) => {
                      setSelectedValueRadioShipping(event.target.value);
                    }}
                    value={`${index + 1}`}
                    name="radio-buttons"
                    color="P"
                  />

                  {!addressesId ? setAddressesId(addresses[0].id) : ""}
                  <Typography variant="menutitle">{address.title}</Typography>
                </Grid>
                <Grid display="flex" flexDirection="column" p={1}>
                  <Grid display="flex" flexDirection="column">
                    <Typography variant="h10">{address.address}</Typography>
                    <Typography variant="h10" pt={1} pb={1}>
                      {address.country}, {address.city}
                    </Typography>
                  </Grid>
                  <Grid display="flex">
                    <Typography variant="h10" pr={1}>
                      {address.zip_code}
                    </Typography>
                    <Divider orientation="vertical" flexItem color="gray" />
                    <Typography variant="h10" pl={1}>
                      {address.full_name}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            );
          })}
        </Grid>
        <Divider />
        <Grid xs={12} p={1} pr={window.innerWidth>900?0:0} pl={window.innerWidth>900?0:0}>
          <Grid xs={12}>
            <Checkbox
              color="P"
              checked={billing}
              onChange={(event) => {
                setBilling(event.target.checked);
              }}
            />
            <Typography variant="h10">
              My billing and shipping addresses are the same.
            </Typography>
          </Grid>
          {!billing ? (
            <Grid xs={12} >
              <Grid
                xs={12}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                bgcolor="P3.main"
                borderRadius="5px"
                height="55px"
              >
                <Hidden mdDown>
                  <Grid xs={window.innerWidth>1179?6:3}></Grid>
                  <Grid xs={6} display="flex" justifyContent='center' alignItems="center">
                    <Typography variant="h37">Billing Address</Typography>
                  </Grid>
                  <Grid xs={window.innerWidth>1179?6:3} display='flex' justifyContent="flex-end" pr="41px">
                    <Button color="White" sx={{bgcolor:"P.main",width:"34px",minWidth:"34px",height:"28px","&:hover":{bgcolor:"P.main"}
                    
                    }} 
                    
                    >
                    +
                    </Button>


                  </Grid>

                </Hidden>
                <Hidden mdUp>
                    <Grid xs={12} display="flex" justifyContent='center' alignItems="center">
                      <Typography variant="h37">Billing Address</Typography>
                    </Grid>
                </Hidden>

              </Grid>
              
              <Grid xs={12} display="flex" flexWrap="wrap" pb={2}>
                {addresses.map((address, index) => {
                  return selectedValueRadioShipping === `${index + 1}` ? (
                    ""
                  ) : (
                    <Grid
                      md={12}
                      m={1}
                      ml={0}
                      mr={0}
                      xs={12}
                      pl="20px"
                      border={1}
                      borderColor="#E0E0E0"
                      sx={{ backgroundImage: `url(${backgroundAddress})` }}
                    >
                      <Grid display="flex" alignItems="center">
                        <Radio
                          checked={selectedValueRadioBilling === `${index + 1}`}
                          onChange={(event) => {
                            setSelectedValueRadioBilling(event.target.value);
                          }}
                          value={`${index + 1}`}
                          name="radio-buttons"
                          color="P"
                        />
                        <Typography variant="menutitle">
                          {address.title}
                        </Typography>
                      </Grid>
                      <Grid display="flex" flexDirection="column" p={1}>
                        <Grid display="flex" flexDirection="column">
                          <Typography variant="h10">
                            {address.address}
                          </Typography>
                          <Typography variant="h10" pt={1} pb={1}>
                            {address.country}, {address.city}
                          </Typography>
                        </Grid>
                        <Grid display="flex">
                          <Typography variant="h10" pr={1}>
                            {address.zip_code}
                          </Typography>
                          <Divider
                            orientation="vertical"
                            flexItem
                            color="gray"
                          />
                          <Typography variant="h10" pl={1}>
                            {address.full_name}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>
          ) : (
            ""
          )}
        </Grid>
      </Grid>
    );
  };
  const step3 = () => {
    return (
      <Grid xs={12} p={0} mr={window.innerWidth>899?5:0} pr={window.innerWidth>899?0:"16px"} pl={window.innerWidth>899?0:"16px"}>
        <Grid
          xs={12}
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="55px"
          bgcolor="P3.main"
        >
          <Typography variant="h12">Payment Options</Typography>
        </Grid>
        <Grid xs={12} display="flex" flexWrap="wrap" pb={2}>
          <Grid md={12} mt={1} xs={12} borderColor="#E0E0E0">
            <Grid xs={12} display="flex" alignItems="center">
              <FormControl style={{ width: "100%" }}>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  defaultValue={1}
                  name="payment"
                  onChange={(event) => {
                    setPaymentId(event.target.value);
                    event.persist();
                    setPayment((payment) => ({
                      ...payment,
                      [event.target.name]: event.target.value,
                    }));
                  }}

                >
                  <Grid border={1}
                    borderColor="#E0E0E0"
                    pt={1}
                    pl={2}
                    pr={2}
                    mb={1}
                    xs={12}
                    bgcolor="#1b1b1be8"
                    borderRadius="5px"
                  >
                    
                    <FormControlLabel
                      value={1}
                      control={<Radio color="P" sx={{".css-hyxlzm":{color:paymentId==1?"P.main":"White.main"}}}/>}
                      label="Credit Card"
                      sx={{color:"White.main"}}
                    />
                    {paymentId==1&&(
                    <Grid display="flex" flexWrap="wrap">
                      <Grid xs={12} p={1}>
                        <TextField
                          id="outlined-basic"
                          label="Card Number"
                          variant="outlined"
                          fullWidth
                          InputLabelProps={{
                            sx: { color: 'White.main' },
                          }}
                          inputProps={{ style: {  color: 'white' } }}
                          sx={{'& .MuiOutlinedInput-notchedOutline':{borderColor: 'white'},'&:hover':{ borderColor: 'white'},
                          "& .MuiOutlinedInput-root:hover": {
                            "& > fieldset": {
                              borderColor: "white"
                            }
                          },
                          "& .MuiOutlinedInput-root.Mui-focused": {
                            "& > fieldset": {
                              borderColor: "P.main"
                            }
                          }}}
                          color="P"
                        />
                      </Grid>
                      <Grid xs={12} p={1}>
                        <TextField
                          id="outlined-basic"
                          label="Name On the Card"
                          variant="outlined"
                          fullWidth
                          InputLabelProps={{
                            sx: { color: 'White.main' },
                          }}
                          inputProps={{ style: {  color: 'white' } }}
                          sx={{'& .MuiOutlinedInput-notchedOutline':{borderColor: 'white'},'&:hover':{ borderColor: 'white'},
                          "& .MuiOutlinedInput-root:hover": {
                            "& > fieldset": {
                              borderColor: "white"
                            }
                          },
                          "& .MuiOutlinedInput-root.Mui-focused": {
                            "& > fieldset": {
                              borderColor: "P.main"
                            }
                          }}}
                          color="P"
                        />
                      </Grid>
                      <Grid xs={window.innerWidth>500?6:12} p={1}>
                        <LocalizationProvider dateAdapter={AdapterDateFns} >
                          <DesktopDatePicker
                          
                            OpenPickerButtonProps={{
                              sx: { color: "White.main" },
                            }}
                          
                            label="Date desktop"
                            inputFormat="MM/yy"
                            
                            renderInput={(params) => <TextField {...params} 
                            InputLabelProps={{
                              sx: { color: 'White.main' },
                            }}
                            inputProps={{ style: {  color: 'white' } }}
                            sx={{'& .MuiOutlinedInput-notchedOutline':{borderColor: 'white'},'&:hover':{ borderColor: 'white'},
                            "& .MuiOutlinedInput-root:hover": {
                              "& > fieldset": {
                                borderColor: "white"
                              }
                            },
                            "& .MuiOutlinedInput-root.Mui-focused": {
                              "& > fieldset": {
                                borderColor: "P.main"
                              }
                            }}}
                            color="P"
                            />}
                          />
                        </LocalizationProvider>
                      </Grid>
                      <Grid xs={window.innerWidth>500?6:12}  p={1}>
                        <TextField
                          id="outlined-basic"
                          label="Security Code"
                          variant="outlined"
                          fullWidth
                          InputLabelProps={{
                            sx: { color: 'White.main' },
                          }}
                          inputProps={{ style: {  color: 'white' } }}
                          sx={{'& .MuiOutlinedInput-notchedOutline':{borderColor: 'white'},'&:hover':{ borderColor: 'white'},
                          "& .MuiOutlinedInput-root:hover": {
                            "& > fieldset": {
                              borderColor: "white"
                            }
                          },
                          "& .MuiOutlinedInput-root.Mui-focused": {
                            "& > fieldset": {
                              borderColor: "P.main",

                            }
                          }}}
                          color="P"
                        />
                      </Grid>
                    </Grid>)}

                  </Grid>
                  <Grid
                    xs={12}
                    border={1}
                    borderColor="#1b1b1be8"
                    pt={1}
                    pl={2}
                    pr={2}
                    mb={1}
                    bgcolor="Black.main"
                    borderRadius="5px"
                  >
                    
                    <FormControlLabel
                      value={2}
                      control={<Radio color="P" sx={{".css-hyxlzm":{color:paymentId==2?"P.main":"White.main"},".css-81t37a-MuiTypography-root":{color:"white"}}}/>}
                      label="Paypal"
                      sx={{color:"White.main"}}
                    />
                    {paymentId === "2" ? (
                      <Typography mb={1} color="White.main">
                        By clicking “Continue to Pay,” you will be redirected to
                        PayPal to complete your order.
                      </Typography>
                    ) : (
                      ""
                    )}

                  </Grid>
                  
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };
  const description = [step1(), step2(), step3()];
  
  const useStyles = makeStyles((theme) => ({
    root: {
      "& 	.Mui-active": { color: "black !important" },
      "& .Mui-completed": { color: "#CB929B !important" },
    },
    
    
  }));
  const c = useStyles();

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    _setOpenMassage(false);
  };

  return (
    <Grid>
      <Header trigger={trigger} _trigger={_trigger} showShoppingCard={showCartPage} closeShowShoppingCard={()=>{setShowCartPage(false)}}
          isRemoved={(isRemoved) => {
              setIsRemoved(isRemoved)
          }}
          _trigger_={(trigger) => {
            setTrigger(trigger);
            _setTrigger(trigger);
          }}
      />
      {successfullyMessage ? (
        <Grid
          xs={12}
          pt={14}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Grid
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexWrap="wrap"
            style={{
              backgroundColor: "white",
              height: "245px",
              width: "554px",
            }}
          >
            <Grid>
              <Grid xs={12} p={1} display="flex" justifyContent="center">
                <Avatar sx={{ bgcolor: "#D2F5DE" }}>
                  <CheckIcon color="Black" />
                </Avatar>
              </Grid>
              <Grid xs={12} p={1} display="flex" justifyContent="center">
                <Typography>Your order has been successfully!</Typography>
              </Grid>
              <Grid xs={12} p={1} display="flex" justifyContent="center">
                <Button
                  variant="contained"
                  color="Black"
                  style={{ color: "white" }}
                  onClick={() => history.push("/")}
                >
                  Done
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <Grid
          xs={12}
          paddingTop={10}
          container
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "row",
            flexWrap: "wrap",
            minHeight: "100vh",
          }}
        >
          <Grid md={10} xs={12} pt="105px" pb="60px">
            <Stepper
              activeStep={activeStep}
              className={c.root}
              alternativeLabel
            >
              {steps.map((step) => {
                return (
                  <Step key={step}>
                    <StepLabel>{step}</StepLabel>
                  </Step>
                );
              })}
            </Stepper>
          </Grid>

          <Grid md={11} xs={12} display="flex" flexWrap="wrap">
            <Grid md={8} xs={12}>
              {description[activeStep]}
            </Grid>
            <Grid md={4} xs={12} style={{ width: "314px", height: "314px" }} pr={window.innerWidth>899? 0:"16px"} pl={window.innerWidth>899? 0:"16px"} pt={window.innerWidth>899? 0:"16px"}>
              <Grid p={2} pb={0} style={{ background: window.innerWidth>899?"rgba(224, 224, 224, 0.19)" :"rgba(224, 224, 224, 0.29)"}} borderRadius="5px">
                <Grid xs={12}>
                  <Typography variant="h8" fontWeight="bold">Order Summery</Typography>
                </Grid>
                <Grid
                  xs={12}
                  pt={2}
                  pb={2}
                  display="flex"
                  style={{ color: "#757575" }}
                  justifyContent="space-between"
                >
                  <Grid xs={6}>
                    <Typography variant="h18">
                      Items ({shoppingCart ? shoppingCart.length : 0}):
                    </Typography>
                  </Grid>
                  <Grid xs={6} textAlign="end">
                    <Typography variant="h18">KWD {totalPrice}</Typography>
                  </Grid>
                </Grid>
                <Grid
                  xs={12}
                  pb={2}
                  display="flex"
                  style={{ color: "#757575" }}
                  justifyContent="space-between"
                >
                  <Grid xs={6}>
                    <Typography variant="h18">Discount:</Typography>
                  </Grid>
                  <Grid xs={6} textAlign="end">
                    <Typography variant="h18">KWD (0)</Typography>
                  </Grid>
                </Grid>
                
                <Grid
                  xs={12}
                  pb={2}
                  display="flex"
                  style={{ color: "#757575" }}
                  justifyContent="space-between"
                >
                  <Grid xs={6}>
                    <Typography variant="h18" color="P.main"> Discount code:</Typography>
                  </Grid>
                  <Grid xs={6} textAlign="end" display='flex' justifyContent='flex-end'>
                    <Grid xs={6} border="1px solid #E0E0E0" borderRadius="10px" display='flex' justifyContent='flex-end' pr="5px">
                      <SvgIcon
                                                                                      
                        titleAccess="title"
                        component={(componentProps) => (
                          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.3164 14.5846C10.3709 14.8445 10.2045 15.1014 9.94105 15.1349C8.76438 15.2847 7.56564 15.0827 6.49844 14.5487C5.28746 13.9427 4.31706 12.9449 3.74502 11.7175C3.17299 10.4901 3.03297 9.10535 3.34772 7.78831C3.66247 6.47126 4.41349 5.29941 5.47866 4.46329C6.54383 3.62717 7.86051 3.17596 9.21463 3.18301C10.5687 3.19006 11.8807 3.65496 12.9371 4.50213C13.9935 5.34929 14.7322 6.5289 15.0333 7.84915C15.2985 9.01265 15.2101 10.2251 14.7851 11.3325C14.69 11.5804 14.4009 11.6811 14.1614 11.5664C13.9219 11.4517 13.8231 11.1652 13.9144 10.9158C14.2478 10.0055 14.3127 9.01473 14.0957 8.06292C13.8429 6.95426 13.2226 5.9637 12.3355 5.25231C11.4484 4.54092 10.3467 4.15052 9.20962 4.1446C8.07253 4.13868 6.96687 4.51758 6.07241 5.2197C5.17795 5.92181 4.5473 6.90585 4.28299 8.01182C4.01868 9.11779 4.13627 10.2806 4.61662 11.3113C5.09697 12.342 5.91185 13.1799 6.92875 13.6887C7.80179 14.1256 8.77966 14.2978 9.74311 14.1901C10.007 14.1606 10.2619 14.3247 10.3164 14.5846Z" fill="#757575"/>
                            <mask id="path-2-inside-1_2196_3526" fill="white">
                            <path d="M12.8392 7.11594C12.7929 7.07926 12.7378 7.05015 12.6771 7.03028C12.6164 7.01041 12.5513 7.00018 12.4855 7.00018C12.4198 7.00018 12.3547 7.01041 12.294 7.03028C12.2333 7.05015 12.1782 7.07926 12.1319 7.11594L8.42116 10.0352L6.86215 8.80648C6.81408 8.76999 6.75733 8.7413 6.69514 8.72204C6.63295 8.70279 6.56654 8.69335 6.49971 8.69425C6.43288 8.69516 6.36693 8.70641 6.30562 8.72734C6.24432 8.74827 6.18886 8.77849 6.14242 8.81626C6.09598 8.85403 6.05947 8.89862 6.03496 8.94748C6.01045 8.99634 5.99843 9.04851 5.99959 9.10102C6.00074 9.15353 6.01505 9.20534 6.0417 9.25351C6.06834 9.30167 6.1068 9.34524 6.15488 9.38173L8.06752 10.8844C8.11382 10.9211 8.16891 10.9502 8.22961 10.9701C8.2903 10.99 8.3554 11.0002 8.42116 11.0002C8.48691 11.0002 8.55201 10.99 8.61271 10.9701C8.67341 10.9502 8.72849 10.9211 8.7748 10.8844L12.8392 7.69119C12.8897 7.65455 12.9301 7.61007 12.9577 7.56057C12.9853 7.51106 12.9995 7.45761 12.9995 7.40356C12.9995 7.34952 12.9853 7.29606 12.9577 7.24656C12.9301 7.19706 12.8897 7.15258 12.8392 7.11594Z"/>
                            </mask>
                            <path d="M12.8392 7.11594C12.7929 7.07926 12.7378 7.05015 12.6771 7.03028C12.6164 7.01041 12.5513 7.00018 12.4855 7.00018C12.4198 7.00018 12.3547 7.01041 12.294 7.03028C12.2333 7.05015 12.1782 7.07926 12.1319 7.11594L8.42116 10.0352L6.86215 8.80648C6.81408 8.76999 6.75733 8.7413 6.69514 8.72204C6.63295 8.70279 6.56654 8.69335 6.49971 8.69425C6.43288 8.69516 6.36693 8.70641 6.30562 8.72734C6.24432 8.74827 6.18886 8.77849 6.14242 8.81626C6.09598 8.85403 6.05947 8.89862 6.03496 8.94748C6.01045 8.99634 5.99843 9.04851 5.99959 9.10102C6.00074 9.15353 6.01505 9.20534 6.0417 9.25351C6.06834 9.30167 6.1068 9.34524 6.15488 9.38173L8.06752 10.8844C8.11382 10.9211 8.16891 10.9502 8.22961 10.9701C8.2903 10.99 8.3554 11.0002 8.42116 11.0002C8.48691 11.0002 8.55201 10.99 8.61271 10.9701C8.67341 10.9502 8.72849 10.9211 8.7748 10.8844L12.8392 7.69119C12.8897 7.65455 12.9301 7.61007 12.9577 7.56057C12.9853 7.51106 12.9995 7.45761 12.9995 7.40356C12.9995 7.34952 12.9853 7.29606 12.9577 7.24656C12.9301 7.19706 12.8897 7.15258 12.8392 7.11594Z" fill="#757575"/>
                            <path d="M12.1319 7.11594L12.7502 7.90188L12.7528 7.8998L12.1319 7.11594ZM8.42116 10.0352L7.80214 10.8206L8.42059 11.3081L9.03947 10.8212L8.42116 10.0352ZM6.86215 8.80648L7.48117 8.0211L7.47399 8.01544L7.4667 8.00991L6.86215 8.80648ZM6.15488 9.38173L6.77267 8.59539L6.76609 8.59022L6.75943 8.58516L6.15488 9.38173ZM8.06752 10.8844L8.68845 10.1006L8.68532 10.0981L8.06752 10.8844ZM8.7748 10.8844L8.15699 10.0981L8.15387 10.1006L8.7748 10.8844ZM12.8392 7.69119L12.2523 6.88151L12.2366 6.89288L12.2214 6.90485L12.8392 7.69119ZM13.4601 6.33207C13.3139 6.21627 13.152 6.13353 12.9882 6.0799L12.366 7.98066C12.3235 7.96676 12.2718 7.94225 12.2182 7.8998L13.4601 6.33207ZM12.9882 6.0799C12.8241 6.02619 12.6538 6.00018 12.4855 6.00018V8.00018C12.4488 8.00018 12.4087 7.99463 12.366 7.98066L12.9882 6.0799ZM12.4855 6.00018C12.3173 6.00018 12.147 6.02619 11.9829 6.0799L12.6051 7.98066C12.5624 7.99463 12.5223 8.00018 12.4855 8.00018V6.00018ZM11.9829 6.0799C11.819 6.13353 11.6571 6.21627 11.511 6.33207L12.7528 7.8998C12.6992 7.94225 12.6475 7.96676 12.6051 7.98066L11.9829 6.0799ZM11.5136 6.33L7.80285 9.24931L9.03947 10.8212L12.7502 7.90187L11.5136 6.33ZM9.04017 9.24987L7.48117 8.0211L6.24314 9.59185L7.80214 10.8206L9.04017 9.24987ZM7.4667 8.00991C7.31868 7.89757 7.1557 7.81781 6.99091 7.76678L6.39937 9.6773C6.35896 9.66479 6.30947 9.64241 6.2576 9.60304L7.4667 8.00991ZM6.99091 7.76678C6.82591 7.7157 6.65494 7.69205 6.48612 7.69435L6.5133 9.69416C6.47814 9.69464 6.43999 9.68988 6.39937 9.6773L6.99091 7.76678ZM6.48612 7.69435C6.31731 7.69664 6.14665 7.72493 5.98247 7.78099L6.62878 9.67369C6.5872 9.68788 6.54844 9.69368 6.5133 9.69416L6.48612 7.69435ZM5.98247 7.78099C5.8185 7.83698 5.65687 7.92218 5.51144 8.04046L6.7734 9.59206C6.72086 9.63479 6.67014 9.65956 6.62878 9.67369L5.98247 7.78099ZM5.51144 8.04046C5.36574 8.15897 5.2349 8.31213 5.1411 8.49912L6.92881 9.39583C6.88403 9.48511 6.82623 9.5491 6.7734 9.59206L5.51144 8.04046ZM5.1411 8.49912C5.04655 8.68764 4.99493 8.9007 4.99983 9.12304L6.99935 9.079C7.00193 9.19632 6.97436 9.30504 6.92881 9.39583L5.1411 8.49912ZM4.99983 9.12304C5.00472 9.34523 5.06555 9.55478 5.16667 9.73757L6.91673 8.76944C6.96456 8.85591 6.99677 8.96183 6.99935 9.079L4.99983 9.12304ZM5.16667 9.73757C5.26699 9.91893 5.40211 10.0658 5.55033 10.1783L6.75943 8.58516C6.81149 8.62468 6.86969 8.68442 6.91673 8.76944L5.16667 9.73757ZM5.53708 10.1681L7.44972 11.6708L8.68532 10.0981L6.77267 8.59539L5.53708 10.1681ZM7.44659 11.6683C7.59278 11.7841 7.75466 11.8668 7.91852 11.9205L8.54069 10.0197C8.58316 10.0336 8.63486 10.0581 8.68845 10.1006L7.44659 11.6683ZM7.91852 11.9205C8.0826 11.9742 8.2529 12.0002 8.42116 12.0002V10.0002C8.45791 10.0002 8.498 10.0057 8.54069 10.0197L7.91852 11.9205ZM8.42116 12.0002C8.58941 12.0002 8.75971 11.9742 8.92379 11.9205L8.30163 10.0197C8.34431 10.0057 8.38441 10.0002 8.42116 10.0002V12.0002ZM8.92379 11.9205C9.08765 11.8668 9.24954 11.7841 9.39573 11.6683L8.15387 10.1006C8.20745 10.0581 8.25916 10.0336 8.30163 10.0197L8.92379 11.9205ZM9.3926 11.6708L13.457 8.47753L12.2214 6.90485L8.157 10.0981L9.3926 11.6708ZM13.426 8.50087C13.5824 8.38757 13.7257 8.23662 13.8311 8.0475L12.0842 7.07363C12.1345 6.98352 12.1971 6.92152 12.2523 6.88151L13.426 8.50087ZM13.8311 8.0475C13.9375 7.85666 13.9995 7.63647 13.9995 7.40356H11.9995C11.9995 7.27874 12.033 7.16547 12.0842 7.07363L13.8311 8.0475ZM13.9995 7.40356C13.9995 7.17066 13.9375 6.95047 13.8311 6.75962L12.0842 7.7335C12.033 7.64165 11.9995 7.52838 11.9995 7.40356H13.9995ZM13.8311 6.75962C13.7257 6.57051 13.5824 6.41956 13.426 6.30625L12.2523 7.92562C12.1971 7.88561 12.1345 7.8236 12.0842 7.7335L13.8311 6.75962Z" fill="#9E9E9E" mask="url(#path-2-inside-1_2196_3526)"/>
                          </svg>
                        )}
                      />
                    

                    </Grid>
                  </Grid>
                </Grid>
                <Divider />
                <Grid
                  xs={12}
                  pb={2}
                  display="flex"
                  style={{ color: "#757575" }}
                  justifyContent="space-between"
                  pt="23px"
                >
                  <Grid xs={6}>
                    <Typography variant="h18">Tax Collected:</Typography>
                  </Grid>
                  <Grid xs={6} textAlign="end">
                    <Typography variant="h18">KWD 0</Typography>
                  </Grid>
                </Grid>

                {activeStep>0?
                <>
                  <Grid
                    xs={12}
                    pb={2}
                    display="flex"
                    style={{ color: "#757575" }}
                    justifyContent="space-between"
                  >
                    <Grid xs={6}>
                      <Typography variant="h18">Shipping:</Typography>
                    </Grid>
                  </Grid>
                  {giftWrap&&(
                    <Grid
                      xs={12}
                      pb={2}
                      display="flex"
                      style={{ color: "#757575" }}
                      justifyContent="space-between"
                    >
                      <Grid xs={6}>
                        <Typography variant="h18">Gift wrap:</Typography>
                      </Grid>
                      <Grid xs={6} textAlign="end">
                        <Typography variant="h18">KWD 2</Typography>
                      </Grid>
                    </Grid>

                  )}
                </>
                :""}
                <Grid
                  xs={12}
                  pt={2}
                  display="flex"
                  justifyContent="space-between"
                  flexWrap="wrap"
                  pl="10px"
                  pr="10px"
                  
                >
                  <Hidden mdUp>
                    <Grid
                      md={12}
                      xs={12}
                      display="flex" justifyContent='center'
                      alignItems='center' height="50px"
                      sx={{background: isHover?"linear-gradient(0deg, rgba(203, 146, 155, 0.35), rgba(203, 146, 155, 0.35)), linear-gradient(0deg, rgba(203, 146, 155, 0.1), rgba(203, 146, 155, 0.1)), #212121"
                      :"linear-gradient(0deg, rgba(203, 146, 155, 0.1), rgba(203, 146, 155, 0.1)), linear-gradient(0deg, rgba(117, 117, 117, 0.35), rgba(117, 117, 117, 0.35)), #212121"
                      ,borderRadius: "25px 25px 0px 0px",cursor:'pointer'}}
                      onMouseEnter={()=>{setIsHover(true)}}
                      onMouseLeave={()=>{setIsHover(false)}}
                    >
                      {isHover?
                        <Button
                        disabled={addressesId == 0 && activeStep === 1 ? true : false}
                        sx={{backgroundColor:"initial",textTransform:'none'}}
                        style={{ color: "white" }}
                        fullWidth
                        onClick={()=>handleClickContinue()}
                        
                        onMouseEnter={()=>{setIsHover(true)}}
                      >
                        {activeStep === 0
                          ? "Continue to Shipping"
                          : activeStep === 1
                          ? "Continue to Payment"
                          : "Continue to Pay"}
                        <Hidden mdDown>
                          {activeStep === 2 ? "" : " Options"}
                        </Hidden>
                      </Button>
                      :
                      <Grid onMouseEnter={()=>{setIsHover(true)}}>
                        <Typography variant="h8" color="White.main" onMouseEnter={()=>{setIsHover(true)}}>
                          Total: KWD {totalPrice}
                        </Typography>

                      </Grid>
                      }

                    </Grid>
                  </Hidden>
                  <Hidden mdDown>
                    <Grid md={12} display="flex" justifyContent='center'
                    alignItems='center' height="50px"
                    sx={{background: isHover?"linear-gradient(0deg, rgba(203, 146, 155, 0.35), rgba(203, 146, 155, 0.35)), linear-gradient(0deg, rgba(203, 146, 155, 0.1), rgba(203, 146, 155, 0.1)), #212121"
                      :"linear-gradient(0deg, rgba(203, 146, 155, 0.1), rgba(203, 146, 155, 0.1)), linear-gradient(0deg, rgba(117, 117, 117, 0.35), rgba(117, 117, 117, 0.35)), #212121"
                    ,borderRadius: "25px 25px 0px 0px",cursor:'pointer'
                    }}  
                    onMouseEnter={()=>{setIsHover(!isHover)}}
                    onMouseLeave={()=>{setIsHover(false)}}
                    
                    >
                      {isHover?
                        <Button
                          sx={{backgroundColor:"initial",textTransform:'none'}}
                          style={{ color: "white" }}
                          fullWidth
                          onClick={handleClickContinue}
                        >
                          {activeStep === 0
                            ? "Continue to Shipping"
                            : activeStep === 1
                            ? "Continue to Payment"
                            : "Continue to Pay"}
                          <Hidden mdDown>
                            {activeStep === 2 ? "" : " Options"}
                          </Hidden>
                        </Button>
                      :  
                        <Typography variant="h8" color="White.main">
                          Total: KWD {totalPrice}
                        </Typography>
                      }
                      
                    </Grid>
                  </Hidden>
                </Grid>
              </Grid>
              {activeStep>0&&(
                <>
                  <Grid p={2} pt={0}  pb={0} height="55px" style={{ background: window.innerWidth>899?"rgba(224, 224, 224, 0.19)" :"rgba(224, 224, 224, 0.29)"}} borderRadius="5px"
                    display='flex'  alignItems="center" mt="20px"
                  >
                    <Grid xs={12} display='flex' alignItems="center" height="100%">
                      <Typography variant="h8" fontWeight="bold">Purchase details</Typography>
                    </Grid>
                  </Grid>
                  <Grid p={2}   style={{ background: window.innerWidth>899?"rgba(224, 224, 224, 0.19)" :"rgba(224, 224, 224, 0.29)"}} borderRadius="5px"
                    mt="5px" pt="17px" pb="42px"
                  >
                    <Grid xs={12} >
                      <Typography variant="h8" fontWeight="bold">Gift</Typography>
                    </Grid>
                    <Grid xs={12} display="flex" alignItems='center' pt="13px">
                      <Grid width="20px" height="20px" border={giftWrap?"2px solid #CB929B":"2px solid #9E9E9E"} display='flex' justifyContent='center' alignItems="center" borderRadius= "5px" onClick={()=>{setGiftWrap(!giftWrap) }}> <Grid p="2px" bgcolor={giftWrap?"P.main":"White.main"} sx={{cursor:'pointer'}} height="12px" width="12px" borderRadius= "3px"></Grid> </Grid>
                      <Typography variant="h7" color="G1.main" pl="19px">Gift wrap ( 2$)</Typography>
                    </Grid>
                    <Grid xs={12} display="flex" alignItems='center'pt="13px">
                      <Grid width="20px" height="20px" border={giftMassage?"2px solid #CB929B":"2px solid #9E9E9E"} display='flex' justifyContent='center' alignItems="center" borderRadius= "5px" onClick={()=>{setGiftMassage(!giftMassage) }}> <Grid p="2px" bgcolor={giftMassage?"P.main":"White.main"} sx={{cursor:'pointer'}} height="12px" width="12px" borderRadius= "3px"></Grid> </Grid>
                      <Typography variant="h7" color="G1.main" pl="19px">Gift Message</Typography>
                    </Grid>
                    {giftMassage&&(
                      <Grid xs={12} display="flex" justifyContent='center' alignItems='center'pt="20px">
                          <TextField id="outlined-attribute"
                            color='P'
                            label="Gift Message"
                            variant='outlined'
                            fullWidth
                          >
                        </TextField>
                      </Grid>

                    )}
                  </Grid>
                  <Grid xs={12} height="50px" ></Grid>
                </>

              )}
            </Grid>
          </Grid>
          {window.innerWidth>899?""
          :
          (activeStep==0?
            <Grid xs={12} md={12} height="50px" ></Grid>
          :"")
          
          }
          <Dialog
            open={openAddressDialog}
            onClose={handleCloseAddressDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <Grid xs={12} style={{ width: "702px", minHeight: "500px" }} bgcolor="Black.main">
              <Grid xs={12} p={2} display='flex' justifyContent='space-between'>
                <Typography variant="h3" color="P.main">Add Address</Typography>
                <CloseIcon onClick={()=>{setOpenAddressDialog(false);}} color="White" sx={{cursor:'pointer'}}/>
              </Grid>
              <Divider />
              <Grid xs={12} p={1} display="flex" flexWrap="wrap">
                <Grid xs={6} p={1}>
                  <TextField
                    className="textField"
                    id="outlined-basic"
                    label="Title"
                    InputLabelProps={{
                      sx: { color: 'White.main' },
                    }}
                    inputProps={{ style: {  color: 'white',WebkitBoxShadow:"0 0 0 1000px #232121 inset",WebkitTextFillColor:'white' } }}
                    sx={{'& .MuiOutlinedInput-notchedOutline':{borderColor: 'white'},'&:hover':{ borderColor: 'white'},
                    "& .MuiOutlinedInput-root:hover": {
                      "& > fieldset": {
                        borderColor: "white"
                      }
                    },
                    "& .MuiOutlinedInput-root.Mui-focused": {
                      "& > fieldset": {
                        borderColor: "P.main"
                      }
                    ,
                    }}}
                    color="P"
                    fullWidth
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </Grid>
                <Grid xs={6} p={1}>
                  <TextField
                    id="outlined-basic"
                    label="Full Name"
                    InputLabelProps={{
                      sx: { color: 'White.main' },
                    }}
                    inputProps={{ style: {  color: 'white' ,WebkitBoxShadow:"0 0 0 1000px #232121 inset",WebkitTextFillColor:'white' } }}
                    sx={{'& .MuiOutlinedInput-notchedOutline':{borderColor: 'white'},'&:hover':{ borderColor: 'white'},
                    "& .MuiOutlinedInput-root:hover": {
                      "& > fieldset": {
                        borderColor: "white"
                      }
                    },
                    "& .MuiOutlinedInput-root.Mui-focused": {
                      "& > fieldset": {
                        borderColor: "P.main"
                      }
                    }}}
                    color="P"
                    fullWidth
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </Grid>
                <Grid xs={6} p={1}>
                  <TextField
                    id="outlined-basic"
                    label="Phone Number"
                    InputLabelProps={{
                      sx: { color: 'White.main'},
                    }}
                    inputProps={{ style: {  color: 'white' ,WebkitBoxShadow:"0 0 0 1000px #232121 inset",WebkitTextFillColor:'white'  } }}
                    sx={{'& .MuiOutlinedInput-notchedOutline':{borderColor: 'white'},'&:hover':{ borderColor: 'white'},
                    "& .MuiOutlinedInput-root:hover": {
                      "& > fieldset": {
                        borderColor: "white"
                      }
                    },
                    "& .MuiOutlinedInput-root.Mui-focused": {
                      "& > fieldset": {
                        borderColor: "P.main"
                      }
                    }}}
                    color="P"
                    fullWidth
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </Grid>
                <Grid xs={6} p={1}>
                  <TextField
                    id="outlined-basic"
                    label="Email"
                    InputLabelProps={{
                      sx: { color: 'White.main'  },
                    }}
                    inputProps={{ style: {  color: 'white' ,WebkitBoxShadow:"0 0 0 1000px #232121 inset",WebkitTextFillColor:'white'} }}
                    sx={{'& .MuiOutlinedInput-notchedOutline':{borderColor: 'white'},'&:hover':{ borderColor: 'white'},
                    "& .MuiOutlinedInput-root:hover": {
                      "& > fieldset": {
                        borderColor: "white"
                      }
                    },
                    "& .MuiOutlinedInput-root.Mui-focused": {
                      "& > fieldset": {
                        borderColor: "P.main"
                      }
                    }}}
                    color="P"
                    fullWidth
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Grid>
                <Grid xs={12} p={1}>
                  <TextField
                    id="outlined-basic"
                    label="Address"
                    InputLabelProps={{
                      sx: { color: 'White.main' },
                    }}
                    inputProps={{ style: {  color: 'white' ,WebkitBoxShadow:"0 0 0 1000px #232121 inset",WebkitTextFillColor:'white' } }}
                    sx={{'& .MuiOutlinedInput-notchedOutline':{borderColor: 'white'},'&:hover':{ borderColor: 'white'},
                    "& .MuiOutlinedInput-root:hover": {
                      "& > fieldset": {
                        borderColor: "white"
                      }
                    },
                    "& .MuiOutlinedInput-root.Mui-focused": {
                      "& > fieldset": {
                        borderColor: "P.main"
                      }
                    }}}
                    color="P"
                    fullWidth
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </Grid>
                <Grid xs={12} p={1}>
                  <TextField
                    id="outlined-basic"
                    label="Apartment, suit, etc."
                    InputLabelProps={{
                      sx: { color: 'White.main' },
                    }}
                    inputProps={{ style: {  color: 'white',WebkitBoxShadow:"0 0 0 1000px #232121 inset",WebkitTextFillColor:'white' } }}
                    sx={{'& .MuiOutlinedInput-notchedOutline':{borderColor: 'white'},'&:hover':{ borderColor: 'white'},
                    "& .MuiOutlinedInput-root:hover": {
                      "& > fieldset": {
                        borderColor: "white"
                      }
                    },
                    "& .MuiOutlinedInput-root.Mui-focused": {
                      "& > fieldset": {
                        borderColor: "P.main"
                      }
                    }
                  }}
                    color="P"
                    fullWidth
                    onChange={(e) => setApartment(e.target.value)}
                  />
                </Grid>
                <Grid xs={6} p={1}>
                  <FormControl fullWidth color="P">
                    <InputLabel id="demo-simple-select-label" sx={{color:'White.main'}}>
                      Country
                    </InputLabel>
                    <Select
                      IconComponent={KeyboardArrowDownIcon}
                      
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Country"
                      inputProps={{ style: {  color: 'white' } }}
                      sx={{color:"White.main",'& .MuiOutlinedInput-notchedOutline':{borderColor: 'white'},'&:hover .MuiOutlinedInput-notchedOutline':{borderColor: 'white'},
                      '& .MuiSvgIcon-root': {
                          color: 'white'
                      }}}
                      onChange={handleChangeCountryName}
                    >
                      <MenuItem value={"United Arab Emirates"}>
                        United Arab Emirates
                      </MenuItem>
                      <MenuItem value={"Kuwait"}>Kuwait</MenuItem>
                      <MenuItem value={"Qatar"}>Qatar</MenuItem>
                      <MenuItem value={"Bahrain"}>Bahrain</MenuItem>
                      <MenuItem value={"Iran"}>Iran</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid xs={6} p={1}>
                  <FormControl fullWidth color="P">
                    <InputLabel id="demo-simple-select-label" sx={{color:'White.main'}}>State</InputLabel>
                    <Select
                      IconComponent={KeyboardArrowDownIcon}
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="State"
                      inputProps={{ style: {  color: 'white' } }}
                      sx={{color:"White.main",'& .MuiOutlinedInput-notchedOutline':{borderColor: 'white'},'&:hover .MuiOutlinedInput-notchedOutline':{borderColor: 'white'},
                      '& .MuiSvgIcon-root': {
                          color: 'white'
                      }}}
                      onChange={handleChangeStateName}
                    >
                      {statesName.map((state) => {
                        return (
                          <MenuItem value={state.name}>{state.name}</MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid xs={6} p={1}>
                  <FormControl fullWidth color="P">
                    <InputLabel id="demo-simple-select-label" sx={{color:'White.main'}}>City</InputLabel>
                    <Select
                      IconComponent={KeyboardArrowDownIcon}
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="City"
                      inputProps={{ style: {  color: 'white' } }}
                      sx={{color:"White.main",'& .MuiOutlinedInput-notchedOutline':{borderColor: 'white'},'&:hover .MuiOutlinedInput-notchedOutline':{borderColor: 'white'},
                      '& .MuiSvgIcon-root': {
                          color: 'white'
                      }}}
                      onChange={(e) => setCity(e.target.value)}
                    >
                      {cities.map((city) => {
                        return <MenuItem value={city}>{city}</MenuItem>;
                      })}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid xs={6} p={1}>
                  <TextField
                    id="outlined-basic"
                    label="Zip Code"
                    InputLabelProps={{
                      sx: { color: 'White.main'  },
                    }}
                    inputProps={{ style: {  color: 'white',WebkitBoxShadow:"0 0 0 1000px #232121 inset",WebkitTextFillColor:'white' } }}
                    sx={{'& .MuiOutlinedInput-notchedOutline':{borderColor: 'white'},'&:hover':{ borderColor: 'white'},
                    "& .MuiOutlinedInput-root:hover": {
                      "& > fieldset": {
                        borderColor: "white"
                      }
                    },
                    "& .MuiOutlinedInput-root.Mui-focused": {
                      "& > fieldset": {
                        borderColor: "P.main"
                      }
                    }
                  }}
                    color="P"
                    fullWidth
                    onChange={(e) => setZipCode(e.target.value)}
                  />
                </Grid>
              </Grid>
              <Grid
                xs={12}
                display="flex"
                justifyContent="center"
                p={1}
                pr={2}
                pl={2}
              >
                <Grid p={1} style={{ color: "white" }} bgcolor="Black.main">
                  <Button
                    sx={{boxShadow:0,"&:hover":{boxShadow:0},"&:focus":{boxShadow:0},color:'P.main'}}
                    color="Black"
                    variant="contained"
                    onClick={addAddress}
                    
                    
                  >
                    Add Address
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Dialog>
          <Dialog
            open={openMassage}
            onClose={handleCloseAddressDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <Grid xs={12} display="flex" flexDirection='column' justifyContent='space-between' alignItems='center' style={{ width: "351px",minHeight:"210px" }} bgcolor="Black.main">
              <Grid display='flex' justifyContent='end' xs={12} pt="19px" pr="27px" alignSelf="end">
                <CloseIcon color="White" sx={{color:"White.main",cursor:'pointer'}} onClick={()=>{handleCloseAddressDialog()}}/>
              </Grid>
              <Grid xs={12}   display='flex' justifyContent='center'  ><Typography color="White.main" variant="h28">{_massage}</Typography></Grid>
              <Grid height="20%" display='flex' justifyContent='center' pb="15px" ><Typography onClick={()=>{handleCloseAddressDialog()}} sx={{cursor:'pointer'}} color="P.main" variant="h28">Done</Typography> </Grid>
            </Grid>
          </Dialog>
          {activeStep === 3 ? <Grid>Security</Grid> : ""}
        </Grid>
      )}
                                                                    
      <Snackbar open={_openMassage} autoHideDuration={6000} onClose={handleClose}
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

export default CartPage;
