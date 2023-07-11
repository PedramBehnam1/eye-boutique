import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import axiosConfig from "../axiosConfig";
import {
  Grid,
  AppBar,
  Typography,
  Hidden,
  IconButton,
  SwipeableDrawer,
  List,
  ListItemButton,
  Card,
  CardMedia,
  Badge,
  Collapse,
  Fade,
  Paper,
  Snackbar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import LogoBlack from "../asset/images/logoBlack.png";
import LogoWhite from "../asset/images/EBLogo.png";
import SearchIcon from "@material-ui/icons/Search";
import ShoppingCart from "../components/homePage/cart/ShoppingCart";
import "../asset/css/header.css";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import Profile from "./profile";
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';

const HeaderOtherPage = (props) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openSubMenuMen, setOpenSubMenuMen] = useState(false);
  const [openSubMenuWoman, setOpenSubMenuWoman] = useState(false);
  const [openSubMenuLens, setOpenSubMenuLens] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [counter, setCounter] = useState(0);
  let location = useLocation();
  let history = useHistory();
  const [backgroundColor, setBackgroundColor] = useState("rgba(0,0,0,0.71)");
  const [backdropFilter, setBackdropFilter] = useState("blur(64px)");
  const [showMenu, setShowMenu] = useState(false);
  const [showSubMenu, setShowSubMenu] = useState("");
  const [openSearchBox, setOpenSearchBox] = useState(false);
  const [_openSearchBox, _setOpenSearchBox] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [mainBanner, setMainBanner] = useState([]);
  const [clicked, setClicked] = useState("");
  const [shoppingCart, setShoppingCart] = useState([]);
  const [badge, setBadgeCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState("");
  const [totalDiscount, setTotalDiscount] = useState("");
  const [clickedButton, setClickedButton] = useState("");
  const [trigger, setTrigger] = useState(0);
  const [openMassage, setOpenMassage] = useState(false);
  const [showMassage, setShowMassage] = useState('');


  const listenScrollEvent = () => {
    if (window.scrollY > 400) {
      if (window.location.pathname == "/") {
        setBackgroundColor("rgba(0,0,0,0.71)");
      } else {
        setBackgroundColor("rgba(0,0,0,0.71)");
      }
      setBackdropFilter("blur(64px)");
    } else {
      setBackgroundColor("rgba(0,0,0,0.71)");
      setBackdropFilter("blur(64px)");
    }
    if (window.scrollY > 0) {
      setShowMenu(false);
    } else {
      if (window.location.pathname == "/") {
        setShowMenu(true);
      } else {
        setShowMenu(false);
      }
    }
  };

  useEffect(() => {
    if (window.location.pathname == "/") {
      if (window.scrollY > 0) {
        setShowMenu(false);
      } else {
        setShowMenu(true);
      }
    }
  }, []);

  useEffect(() => {
    refreshMenu();
    window.addEventListener("scroll", listenScrollEvent);
    listItem();
  }, [searchValue, trigger, props._trigger,props.trigger]);

  useEffect(() => {
    setTimeout(() => {
      setOpenSearchBox(searchValue != "" ? true : false);
    }, 5000);
  }, [_openSearchBox, searchValue]);

  useEffect(() => {
    if (
      window.location.pathname.includes("/Products/All/All/Unisex")
    ) {
      history.push({
        pathname: "/Products/All/All/Unisex",
        state: {
          genderName: "All",
          categoryName: "All",
          search: "",
        },
      });
    }
  }, []);

  const refreshMenu = () => {
    axiosConfig.get("admin/content/all").then((res) => {
      setMainBanner(res.data.data.banners.filter((b) => b.main_banner));
      if (window.location.pathname == "/") {
        props.banners(res.data.data.banners);
        props.timer(res.data.data.timerDelay[0].timer);
        props.sliders(res.data.data.sliders.filter((s) => !s.is_mobile));
      }
    });
  };



  const clickedMenu = (categoryId, valueId, genderName) => {
    
    history.push({
      pathname: `/Products/${categoryId}/All/${
        genderName === "" ? "All" : genderName
      }`,
      state: {
        categoryName: categoryId,
        genderName: genderName,
        valueId: valueId,
        search: "",
      },
    });
  };

  const listItem = () => {
    if (localStorage.getItem("token")) {
      axiosConfig
        .get("/users/card", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          setShoppingCart(res.data.shoppingCard);
          setTotalPrice(res.data.total_price);
          setTotalDiscount(res.data.total_discount);
          let badgeCount = 0
          res.data.shoppingCard.map((cartItem)=>{
            badgeCount += cartItem.quantity
          })
          setBadgeCount(badgeCount)
        })
        .catch((err) => {
          setShowMassage('Get shopping carts have a problem!')
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
              setShowMassage('Get shopping carts have a problem!')
              setOpenMassage(true) 
            }
        });
    }
    return {
      shoppingCart: shoppingCart,
      totalPrice: totalPrice,
      totalDiscount: totalDiscount,
    };
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenMassage(false);
  };
  return (
    <Grid xs={12} display="flex" container>
      <Grid xs={12} display="flex">
        <AppBar
          onMouseEnter={() => setShowMenu(true)}
          onMouseLeave={() => {
            setShowMenu(false);
            setShowSubMenu("");
          }}
          color="inherit"
          xs={12}

          style={{
            backgroundColor:
              window.location.pathname.includes("/home/productlist/All") ||
              window.location.pathname.includes("/home/productlist/Men") ||
              window.location.pathname.includes("/home/productlist/Women")
                ? "rgba(0,0,0,0.9)"
                : `${backgroundColor}`,
            color: "white",
            height: "58px",
          }}
        >
          <Grid
            xs={12}
            container
            display="flex"
            height="58px"
            justifyContent="center"
            alignItems="center"
            flexWrap="wrap"
            sx={{ backdropFilter: `${backdropFilter}` }}
          >
            <Grid
              xs={
                window.innerWidth > 1470
                ? 4
                : window.innerWidth > 1410
                ? 4.25
                : window.innerWidth > 1350
                ? 4.5
                : window.innerWidth > 1305
                ? 4.75
                : window.innerWidth > 1165
                ? 5
                : window.innerWidth > 900
                ? 4.75
                : window.innerWidth == 900
                ? 4
                : window.innerWidth > 784
                ? 6
                : 4
              }
              display="flex"
              justifyContent="start"
              alignItems="center"
            >
              <Hidden mdUp>
                <IconButton onClick={() => setOpenDrawer(true)}>
                  <MenuIcon sx={{ color: "white" }} />
                </IconButton>

                <Grid
                  height="58px"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Card
                    elevation={0}
                    sx={{ background: "rgba(0,0,0,0)" }}
                  >
                    <CardMedia
                      sx={{ width: 145, color: "white", cursor: "pointer" }}
                      component="img"
                      image={LogoWhite}
                      onClick={() => history.push("/")}
                    ></CardMedia>
                  </Card>
                </Grid>
              </Hidden>
            </Grid>
            {window.innerWidth >= 900 && (
              <Grid
                xs={
                window.innerWidth > 1470
                  ? 4
                  : window.innerWidth > 1410
                  ? 3.5
                  : window.innerWidth > 1350
                  ? 3
                  : window.innerWidth > 1305
                  ? 2.5
                  : window.innerWidth > 1165
                  ? 2
                  : 2.25
                }
                height="58px"
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Card
                  elevation={0}
                  sx={{ background: "rgba(0,0,0,0)" }}
                >
                  <CardMedia
                    sx={{ width: 145, color: "white", cursor: "pointer" }}
                    component="img"
                    image={LogoWhite}
                    onClick={() => history.push("/")}
                  ></CardMedia>
                </Card>
              </Grid>
            )}
            <Grid
              xs={
                window.innerWidth > 1470
                ? 4
                : window.innerWidth > 1410
                ? 4.25
                : window.innerWidth > 1350
                ? 4.5
                : window.innerWidth > 1305
                ? 4.75
                : window.innerWidth > 1165
                ? 5
                : window.innerWidth > 900
                ? 4.75
                : window.innerWidth == 900
                ? 4.3
                : window.innerWidth > 800
                ? 6
                : window.innerWidth > 784
                ? 6
                : 8
              }
              display="flex"
              justifyContent="end"
              alignItems="center"
              flexWrap="wrap"
              pr={
                window.innerWidth > 1177
                  ? 3
                  : window.innerWidth > 980
                  ? 3
                  : window.innerWidth == 900
                  ? 0
                  : 1
              }
              mr={window.innerWidth == 900 ? "-70px" : 0}
            >
              <Grid
                md={window.innerWidth > 903 ? 7 : 6.5}
                xs={
                window.innerWidth > 800
                  ? 7
                  : window.innerWidth > 784
                  ? 7.5
                  : window.innerWidth > 622
                  ? 7
                  : window.innerWidth > 563
                  ? 7
                  : 5
                }
                display="flex"
                justifyContent="end"
                alignItems="center"
              >
                <Collapse
                  orientation="horizontal"
                  in={openSearchBox}
                  sx={{ pr: window.innerWidth > 563 ? 0 : "5px" }}
                >
                  <Paper
                    sx={{
                      backgroundColor: "GrayLight2.main",
                      p: "2px 4px",
                      borderRadius: 3,
                      display: "flex",
                      alignItems: "center",
                      maxWidth: "300px",
                      height: "33px",
                      justifyContent: "space-between",
                      boxShadow: "none",
                    }}
                  >
                    <IconButton
                      sx={{ p: "10px" }}
                      aria-label="search"
                      onClick={() => {
                        history.push({
                          pathname: `/Products/${
                            location.state
                              ? location.state.categoryName === ""
                                ? "All"
                                : location.state.categoryName
                              : "All"
                          }/All/${
                            location.state
                              ? location.state.genderName === ""
                                ? "Unisex"
                                : location.state.genderName
                              : "Unisex"
                          }`,
                          state: {
                            genderName: location.state
                              ? location.state.genderName === ""
                                ? "Unisex"
                                : location.state.genderName
                              : "Unisex",
                            categoryName: location.state
                              ? location.state.categoryName === ""
                                ? "All"
                                : location.state.categoryName
                              : "All",
                            search: searchValue,
                          },
                        });
                      }}
                      color="red"
                    >
                      <SearchIcon color="G1.main" />
                    </IconButton>
                    <input
                      style={{
                        flex: 1,
                        border: "none",
                        background: "none",
                        width: "100%",
                        outline: "none",
                        "&:focus": {
                          outline: "none",
                        },
                      }}
                      defaultValue={location.state ? location.state.search : ""}
                      onKeyDown={(e) => {
                        if (e.keyCode == 13) {
                          setSearchValue(e.target.value);
                          history.push({
                            pathname: `/Products/${
                              location.state
                                ? location.state.categoryName === ""
                                  ? "All"
                                  : location.state.categoryName
                                : "All"
                            }/All/${
                              location.state
                                ? location.state.genderName === ""
                                  ? "Unisex"
                                  : location.state.genderName
                                : "Unisex"
                            }`,
                            state: {
                              genderName: location.state
                                ? location.state.genderName === ""
                                  ? "Unisex"
                                  : location.state.genderName
                                : "Unisex",
                              categoryName: location.state
                                ? location.state.categoryName === ""
                                  ? "All"
                                  : location.state.categoryName
                                : "All",
                              search: e.target.value,
                            },
                          });
                        }
                      }}
                      placeholder="Search"
                      InputProps={{
                        disableUnderline: false,
                      }}
                      onChange={(e) => {
                        setSearchValue(e.target.value);
                      }}
                      inputProps={{ "aria-label": "Search in List" }}
                    />
                  </Paper>
                </Collapse>
                {window.innerWidth > 563 ? (
                  <React.Fragment>
                    <Fade in={!openSearchBox}>
                      <IconButton
                        color="inherit"
                        onClick={() => {
                          setOpenSearchBox(true);
                          _setOpenSearchBox(!_openSearchBox);
                        }}
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 17 17"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M7.79167 13.4583C10.9213 13.4583 13.4583 10.9213 13.4583 7.79167C13.4583 4.66205 10.9213 2.125 7.79167 2.125C4.66205 2.125 2.125 4.66205 2.125 7.79167C2.125 10.9213 4.66205 13.4583 7.79167 13.4583Z"
                            stroke="white"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M14.8752 14.875L11.7939 11.7938"
                            stroke="white"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </IconButton>
                    </Fade>
                  </React.Fragment>
                ) : !openSearchBox ? (
                  <React.Fragment>
                    <Fade in={!openSearchBox}>
                      <IconButton
                        color="inherit"
                        onClick={() => {
                          setOpenSearchBox(true);
                          _setOpenSearchBox(!_openSearchBox);
                        }}
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 17 17"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M7.79167 13.4583C10.9213 13.4583 13.4583 10.9213 13.4583 7.79167C13.4583 4.66205 10.9213 2.125 7.79167 2.125C4.66205 2.125 2.125 4.66205 2.125 7.79167C2.125 10.9213 4.66205 13.4583 7.79167 13.4583Z"
                            stroke="white"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M14.8752 14.875L11.7939 11.7938"
                            stroke="white"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </IconButton>
                    </Fade>
                  </React.Fragment>
                ) : (
                  ""
                )}
              </Grid>
              <Grid
                md={window.innerWidth > 1110 ? 1.1 : 1.1}
                xs={1}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 27 27"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.10393 18.1868L7.1036 18.1865C5.40715 16.49 4.4541 14.1892 4.4541 11.79C4.4541 9.39089 5.40715 7.09002 7.1036 5.39357C8.80004 3.69713 11.1009 2.74408 13.5 2.74408C15.8992 2.74408 18.2 3.69713 19.8965 5.39357C21.5855 7.08257 22.5343 9.37332 22.5343 11.7619C22.5343 14.1505 21.5855 16.4412 19.8965 18.1302L19.8958 18.1309L13.9221 24.1271L13.9213 24.1279C13.8632 24.1865 13.7941 24.233 13.7179 24.2647C13.6417 24.2965 13.5601 24.3128 13.4775 24.3128C13.395 24.3128 13.3133 24.2965 13.2372 24.2647C13.161 24.233 13.0919 24.1865 13.0338 24.1279L13.0327 24.1268L7.10393 18.1868ZM13.1457 22.3916L13.5 22.7474L13.8544 22.3916L18.995 17.2284C18.9951 17.2283 18.9952 17.2283 18.9952 17.2282C20.0807 16.1416 20.8197 14.7577 21.1188 13.2512C21.4179 11.7447 21.2637 10.1832 20.6756 8.76434C20.0875 7.34543 19.0919 6.13273 17.8147 5.27954C16.5375 4.42635 15.036 3.97098 13.5 3.97098C11.9641 3.97098 10.4626 4.42635 9.18539 5.27954C7.90819 6.13273 6.9126 7.34543 6.32449 8.76434C5.73638 10.1833 5.58214 11.7447 5.88127 13.2512C6.18039 14.7577 6.91938 16.1416 8.00486 17.2282C8.00493 17.2283 8.005 17.2283 8.00508 17.2284L13.1457 22.3916ZM16.63 8.74204L16.6299 8.7421L16.6361 8.74822C17.0422 9.14939 17.3637 9.62791 17.5817 10.1555C17.7996 10.6829 17.9095 11.2486 17.9051 11.8192C17.896 12.6754 17.6343 13.51 17.1529 14.2182C16.6713 14.9265 15.9912 15.4769 15.198 15.8002C14.4048 16.1235 13.5338 16.2054 12.6943 16.0355C11.8549 15.8657 11.0843 15.4518 10.4791 14.8458C9.66438 14.0285 9.20686 12.9215 9.20686 11.7675C9.20686 10.6141 9.66394 9.50761 10.478 8.69045C10.8842 8.28865 11.3657 7.97105 11.895 7.75591C12.4248 7.54055 12.992 7.4321 13.5639 7.43679C14.1358 7.44147 14.7011 7.55921 15.2273 7.78322C15.7535 8.00723 16.2302 8.33309 16.63 8.74204ZM15.7575 13.9521L16.5956 13.1013H16.3264C16.53 12.694 16.644 12.2432 16.6549 11.7793L16.655 11.7793L16.655 11.7686C16.6566 11.0452 16.4068 10.3437 15.9484 9.78404C15.49 9.22439 14.8514 8.84136 14.1419 8.70042C13.4323 8.55948 12.6958 8.6694 12.0583 9.01137C11.4209 9.35334 10.9219 9.90613 10.6469 10.5752C10.3719 11.2443 10.3378 11.9882 10.5505 12.6796C10.7632 13.3711 11.2095 13.9672 11.8131 14.366C12.4167 14.7648 13.14 14.9416 13.8595 14.8661C14.579 14.7906 15.2499 14.4675 15.7575 13.9521Z"
                    fill="white"
                    stroke="white"
                  />
                </svg>

              </Grid>
              {window.innerWidth < 800 ? (
                <Grid
                  xs={
                    window.innerWidth > 784
                    ? 0.15
                    : window.innerWidth > 640
                    ? 0.05
                    : window.innerWidth > 619
                    ? 0.2
                    : window.innerWidth > 569
                    ? 0.15
                    : window.innerWidth > 540
                    ? 0.18
                    : 0.3
                  }
                ></Grid>
              ) : (
                ""
              )}
              {!localStorage.getItem("token") ? (
                ""
              ) : (
                <>
                  <Grid
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {localStorage.getItem("token") != null ? (
                      <>
                      
                        {shoppingCart.length > 0 ? (
                          <IconButton
                          color="inherit"
                          onClick={() => setOpenCart(true)}
                          >
                            
                            <Badge
                              color="P"
                              badgeContent={
                                
                                badge != undefined ? badge : ""
                              }
                            >
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M4.8 12.8C3.92 12.8 3.208 13.52 3.208 14.4C3.208 15.28 3.92 16 4.8 16C5.68 16 6.4 15.28 6.4 14.4C6.4 13.52 5.68 12.8 4.8 12.8ZM0 0V1.6H1.6L4.48 7.672L3.4 9.632C3.272 9.856 3.2 10.12 3.2 10.4C3.2 11.28 3.92 12 4.8 12H14.4V10.4H5.136C5.024 10.4 4.936 10.312 4.936 10.2L4.96 10.104L5.68 8.8H11.64C12.24 8.8 12.768 8.472 13.04 7.976L15.904 2.784C15.968 2.672 16 2.536 16 2.4C16 1.96 15.64 1.6 15.2 1.6H3.368L2.616 0H0ZM12.8 12.8C11.92 12.8 11.208 13.52 11.208 14.4C11.208 15.28 11.92 16 12.8 16C13.68 16 14.4 15.28 14.4 14.4C14.4 13.52 13.68 12.8 12.8 12.8Z"
                                  fill="white"
                                />
                              </svg>
                            </Badge>
                          </IconButton>
                        ) : (
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 25 25"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M25 23.6032L3.04663 1.6498L2.19974 0.802904L1.39683 0L0 1.39683L4.82842 6.22525L7.25913 11.3506L5.77431 14.0453C5.59833 14.3533 5.49934 14.7162 5.49934 15.1012C5.49934 16.311 6.48922 17.3009 7.69908 17.3009H15.9041L17.4219 18.8187C16.872 19.2147 16.509 19.8636 16.509 20.6005C16.509 21.8104 17.4879 22.8003 18.6978 22.8003C19.4347 22.8003 20.0836 22.4373 20.4795 21.8764L23.6032 25L25 23.6032ZM8.16102 15.1012C8.00704 15.1012 7.88605 14.9802 7.88605 14.8262L7.91905 14.6942L8.90893 12.9015H11.5046L13.7044 15.1012H8.16102ZM17.1029 12.9015C17.9278 12.9015 18.6538 12.4505 19.0277 11.7686L22.9652 4.63044C23.0532 4.47646 23.0972 4.28949 23.0972 4.10251C23.0972 3.49758 22.6023 3.00264 21.9974 3.00264H7.19314L17.1029 12.9015ZM7.69908 18.4008C6.48922 18.4008 5.51034 19.3907 5.51034 20.6005C5.51034 21.8104 6.48922 22.8003 7.69908 22.8003C8.90893 22.8003 9.89881 21.8104 9.89881 20.6005C9.89881 19.3907 8.90893 18.4008 7.69908 18.4008Z"
                              fill="white"
                            />
                          </svg>
                        )}
                        <ShoppingCart
                          open={openCart||props.showShoppingCard}
                          close={(temp) => {setOpenCart(temp); props.closeShowShoppingCard(false)}}
                          counter={(counter) => setCounter(counter)}
                          clicked={(_trigger) => {
                            setTrigger(_trigger+trigger);
                            props._trigger_(_trigger+trigger)
                          }}
                          isRemoved={(isRemoved) => {
                            props.isRemoved(isRemoved)
                            
                          }}
                        />
                      </>
                    ) : (
                      <Grid>
                        <Typography>asdas</Typography>
                      </Grid>
                    )}
                  </Grid>
                </>
              )}

              <Grid
                lg={1.5}
                md={1.5}
                sm={1.5}
                xs={1.5}
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{ cursor: "pointer" }}
              >
                <Profile
                  pageName={
                    window.location.pathname.includes("/home/profile")
                      ? "profile"
                      : "home"
                  }
                />
              </Grid>
            </Grid>
          </Grid>

          <Hidden mdDown>
            <Fade in={showMenu}>
              <Grid
                xs={12}
                display="flex"
                flexWrap="wrap"
                justifyContent="center"
                height="58px"
              >
                <Hidden mdDown>
                  <Grid
                    xs={12}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    style={{
                      width: "100%",
                      backdropFilter: "blur(32px)",
                    }}
                    sx={{ backgroundColor: "rgba(158, 158, 158, 0.5)" }}
                    // color={window.scrollY < 400 ? "white" : "G1.main"}
                    height="58px"
                  >
                    {mainBanner.map((banner, index) => {
                      return (
                        <Grid
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <ListItemButton
                            style={{
                              display: "inherit",
                              backgroundColor: "transparent",
                            }}
                            onMouseEnter={() => {
                              setShowSubMenu(index);
                              setClicked(banner.title);
                            }}
                            onMouseLeave={() => setClicked("")}
                          >
                            <Grid display="flex" justifyContent="space-between">
                              <Typography
                                variant="h10"
                                color={
                                  clicked == "Men" && banner.title == clicked
                                    ? "White.main"
                                    : clicked == "Women" &&
                                      banner.title == clicked
                                    ? "White.main"
                                    : "Black1.main"
                                }
                              >
                                {banner.title}
                              </Typography>
                              {showSubMenu === index ? (
                                <ExpandLess
                                  sx={{ mt: "-2px" }}
                                  color={
                                    clicked == "Men" && banner.title == clicked
                                      ? "White"
                                      : clicked == "Women" &&
                                        banner.title == clicked
                                      ? "White"
                                      : "Black1"
                                  }
                                />
                              ) : (
                                <ExpandMore
                                  sx={{ mt: "-2px" }}
                                  color={
                                    clicked == "Men" && banner.title == clicked
                                      ? "White"
                                      : clicked == "Women" &&
                                        banner.title == clicked
                                      ? "White"
                                      : "Black1"
                                  }
                                />
                              )}
                            </Grid>
                          </ListItemButton>
                        </Grid>
                      );
                    })}
                    <Grid
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <ListItemButton
                        style={{
                          display: "inherit",
                          backgroundColor: "transparent",
                        }}
                        onMouseEnter={() => {
                          setShowSubMenu(2);
                          setClicked("Contact Lenses");
                        }}
                        onMouseLeave={() => setClicked("")}
                      >
                        <Grid display="flex" justifyContent="space-between">
                          <Typography
                            variant="h10"
                            color={
                              clicked == "Contact Lenses"
                                ? "White.main"
                                : "Black1.main"
                            }
                          >
                            Contact Lenses
                          </Typography>
                          {showSubMenu === 2 ? (
                            <ExpandLess
                              sx={{ mt: "-2px" }}
                              color={
                                clicked == "Contact Lenses" ? "White" : "Black1"
                              }
                            />
                          ) : (
                            <ExpandMore
                              sx={{ mt: "-2px" }}
                              color={
                                clicked == "Contact Lenses" ? "White" : "Black1"
                              }
                            />
                          )}
                        </Grid>
                      </ListItemButton>
                    </Grid>
                    <Grid
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <ListItemButton
                        onMouseEnter={() => {
                          setShowSubMenu("");
                          setClicked("EB Magazine");
                        }}
                        onClick={() => {
                          history.push({ pathname: "/home/ebMagazine" });
                        }}
                        onMouseLeave={() => setClicked("")}
                        style={{
                          display: "inherit",
                          backgroundColor: "transparent",
                        }}
                      >
                        <Typography
                          variant="h10"
                          color={
                            clicked == "EB Magazine"
                              ? "White.main"
                              : "Black1.main"
                          }
                        >
                          EB Magazine
                        </Typography>
                      </ListItemButton>
                    </Grid>
                    <Grid
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <ListItemButton
                        onMouseEnter={() => {
                          setShowSubMenu("");
                          setClicked("About EB");
                        }}
                        onClick={() => history.push("/home/aboutus")}
                        onMouseLeave={() => {
                          setClicked("");
                        }}
                        style={{
                          display: "inherit",
                          backgroundColor: "transparent",
                        }}
                      >
                        <Typography
                          variant="h10"
                          color={
                            clicked == "About EB" ? "White.main" : "Black1.main"
                          }
                        >
                          About EB
                        </Typography>
                      </ListItemButton>
                    </Grid>
                  </Grid>
                  <Fade in={showSubMenu !== ""}>
                    <Grid xs={12}>
                      <Grid
                        xs={12}
                        display="flex"
                        flexWrap="wrap"
                        color={window.scrollY < 400 ? "white" : "G1.main"}
                      >
                        <Grid
                          xs={3}
                          sx={{
                            width: "100%",
                            backdropFilter: "blur(32px)",
                            margin: "1px 0",
                          }}
                          backgroundColor={
                            window.scrollY < 400
                              ? "rgba(158, 158, 158, 0.5)"
                              : "rgba(158, 158, 158, 0.5)"
                          }
                          opacity={window.scrollY < 400 ? "0.1" : "1"}
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <Typography variant="h17" color="Black1.main">
                            {showSubMenu === 2
                              ? "Contact Lenses"
                              : mainBanner[showSubMenu]?.title}
                          </Typography>
                        </Grid>
                        <Grid xs={8.98}>
                          {showSubMenu !== 2 ? (
                            <>
                              {showSubMenu === ""
                                ? ""
                                : mainBanner[showSubMenu]?.sub_menu.map(
                                    (menu) => {
                                      return (
                                        <Grid
                                          xs={12}
                                          sx={{
                                            width: "100%",
                                            backdropFilter: "blur(32px)",
                                            margin: "1px 0 1px 1px",
                                          }}
                                          backgroundColor={
                                            window.scrollY < 400
                                              ? "rgba(158, 158, 158, 0.5)"
                                              : "rgba(158, 158, 158, 0.5)"
                                          }
                                          opacity={
                                            window.scrollY < 400 ? "0.1" : "1"
                                          }
                                          display="flex"
                                          flexWrap="wrap"
                                          justifyContent="center"
                                          alignItems="center"
                                        >
                                          <ListItemButton
                                            sx={{ paddingLeft: "20px" }}
                                            style={{
                                              display: "inherit",
                                              backgroundColor: "transparent",
                                            }}
                                            onClick={() =>
                                              clickedMenu(
                                                menu.title,
                                                "Unisex",
                                                mainBanner[showSubMenu]?.title
                                              )
                                            }
                                            onMouseEnter={() => {
                                              setClicked(menu.title);
                                            }}
                                            onMouseLeave={() => {
                                              setClicked("");
                                            }}
                                          >
                                            <FiberManualRecordIcon
                                              sx={{ padding: "8px" }}
                                              color={
                                                clicked == menu.title
                                                  ? "White"
                                                  : "Black1"
                                              }
                                            />
                                            <Typography
                                              color={
                                                clicked == menu.title
                                                  ? "White.main"
                                                  : "Black1.main"
                                              }
                                            >
                                              {menu.title}
                                            </Typography>
                                          </ListItemButton>
                                        </Grid>
                                      );
                                    }
                                  )}
                            </>
                          ) : (
                            <>
                              <Grid
                                xs={12}
                                sx={{
                                  width: "100%",
                                  backdropFilter: "blur(32px)",
                                  margin: "1px 0 1px 1px",
                                }}
                                backgroundColor={
                                  window.scrollY < 400
                                    ? "rgba(158, 158, 158, 0.5)"
                                    : "rgba(158, 158, 158, 0.5)"
                                }
                                opacity={window.scrollY < 400 ? "0.1" : "1"}
                                display="flex"
                                flexWrap="wrap"
                                justifyContent="center"
                                alignItems="center"
                                height={37}
                              >
                                <ListItemButton
                                  sx={{ paddingLeft: "20px" }}
                                  style={{
                                    display: "inherit",
                                    backgroundColor: "transparent",
                                  }}
                                  onClick={() =>
                                    clickedMenu("ClearContactLens", "All", "")
                                  }
                                  onMouseEnter={() => {
                                    setClicked("Clear Contact Lens");
                                  }}
                                  onMouseLeave={() => {
                                    setClicked("");
                                  }}
                                >
                                  <FiberManualRecordIcon
                                    sx={{ padding: "8px" }}
                                    color={
                                      clicked == "Clear Contact Lens"
                                        ? "White"
                                        : "Black1"
                                    }
                                  />
                                  <Typography
                                    color={
                                      clicked == "Clear Contact Lens"
                                        ? "White.main"
                                        : "Black1.main"
                                    }
                                  >
                                    Clear
                                  </Typography>
                                </ListItemButton>
                              </Grid>
                              <Grid
                                xs={12}
                                sx={{
                                  width: "100%",
                                  backdropFilter: "blur(32px)",
                                  margin: "1px 0 1px 1px",
                                }}
                                backgroundColor={
                                  window.scrollY < 400
                                    ? "rgba(158, 158, 158, 0.5)"
                                    : "rgba(158, 158, 158, 0.5)"
                                }
                                opacity={window.scrollY < 400 ? "0.1" : "1"}
                                display="flex"
                                flexWrap="wrap"
                                justifyContent="center"
                                alignItems="center"
                                height={37}
                              >
                                <ListItemButton
                                  sx={{ paddingLeft: "20px" }}
                                  style={{
                                    display: "inherit",
                                    backgroundColor: "transparent",
                                  }}
                                  onClick={() =>
                                    clickedMenu("ColorContactLens", "All", "")
                                  }
                                  onMouseEnter={() => {
                                    setClicked("Color Contact Lens");
                                  }}
                                  onMouseLeave={() => {
                                    setClicked("");
                                  }}
                                >
                                  <FiberManualRecordIcon
                                    sx={{ padding: "8px" }}
                                    color={
                                      clicked == "Color Contact Lens"
                                        ? "White"
                                        : "Black1"
                                    }
                                  />
                                  <Typography
                                    color={
                                      clicked == "Color Contact Lens"
                                        ? "White.main"
                                        : "Black1.main"
                                    }
                                  >
                                    Color
                                  </Typography>
                                </ListItemButton>
                              </Grid>
                            </>
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Fade>
                </Hidden>
              </Grid>
            </Fade>
          </Hidden>
        </AppBar>

        <Hidden mdUp>
          <SwipeableDrawer
            open={openDrawer}
            onClose={() => setOpenDrawer(false)}
          >
            <Grid
              xs={12}
              display="flex"
              flexDirection="column"
              backgroundColor="G3.main"
              height={window.innerHeight}
            >
              <Grid
                xs={12}
                display="flex"
                alignItems="center"
                width="300px"
                height="71px"
                maxHeight="71px"
                sx={{ borderBottom: "1px solid #9E9E9E" }}
              >
                
                <Grid
                  xs={12}
                  display="flex"
                  flexWrap="wrap"
                  p={2}
                  pl="16px"
                  pt={3}
                >
                  <Grid xs={6}>
                    <CardMedia
                      height="22px"
                      component="img"
                      image={LogoBlack}
                    ></CardMedia>
                  </Grid>
                </Grid>
              </Grid>
              <List sx={{ bgcolor: "G3.main" }}>
                <ListItemButton
                  style={{
                    display: "inherit",
                    margin: "14px 0",
                    marginBottom: openSubMenuMen ? 0 : "14px",
                  }}
                  onClick={() => setOpenSubMenuMen(!openSubMenuMen)}
                >
                  <Grid display="flex" justifyContent="space-between">
                    <Typography
                      variant={
                        location.state?.genderName === "Men"
                          ? "h32"
                          : openSubMenuMen
                          ? "h32"
                          : "h10"
                      }
                    >
                      Men
                    </Typography>
                    {openSubMenuMen ? <ExpandLess /> : <ExpandMore />}
                  </Grid>
                </ListItemButton>
                <Collapse in={openSubMenuMen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItemButton
                      sx={{
                        margin: "0",
                        marginTop: "13px",
                        "&:hover": {
                          background: "none",
                          backgroundColor: "#F5EFF0",
                        },
                      }}
                      onClick={() => {
                        setClickedButton("SunglassMen");
                        clickedMenu("Sunglasses", "All", "Men");
                        setOpenDrawer(false);
                        setOpenSubMenuMen(false);
                      }}
                      onMouseEnter={() => {
                        setClickedButton("SunglassMen");
                      }}
                      onMouseLeave={() => {
                        setClickedButton("");
                      }}
                    >
                      {" "}
                      <Typography
                        color={
                          location.state?.genderName === "Men"
                            ? location.state?.categoryName === "Sunglasses"
                              ? "P.main"
                              : clickedButton == "SunglassMen"
                              ? "P.main"
                              : "G1.main"
                            : clickedButton == "SunglassMen"
                            ? "P.main"
                            : "G1.main"
                        }
                        variant={
                          location.state?.genderName === "Men"
                            ? location.state?.categoryName === "Sunglasses"
                              ? "h18"
                              : "h10"
                            : "h10"
                        }
                      >
                        Sunglasses
                      </Typography>
                    </ListItemButton>
                    <ListItemButton
                      sx={{
                        margin: "0",
                        marginBottom: "0",
                        "&:hover": {
                          background: "none",
                          backgroundColor: "#F5EFF0",
                        },
                      }}
                      onClick={() => {
                        setClickedButton("FrameMen");
                        clickedMenu("Optical", "All", "Men");
                        setOpenDrawer(false);
                        setOpenSubMenuMen(false);
                      }}
                      onMouseEnter={() => {
                        setClickedButton("FrameMen");
                      }}
                      onMouseLeave={() => {
                        setClickedButton("");
                      }}
                    >
                      {" "}
                      <Typography
                        color={
                          location.state?.genderName === "Men"
                            ? location.state?.categoryName === "Frames"
                              ? "P.main"
                              : clickedButton == "FrameMen"
                              ? "P.main"
                              : "G1.main"
                            : clickedButton == "FrameMen"
                            ? "P.main"
                            : "G1.main"
                        }
                        variant={
                          location.state?.genderName === "Men"
                            ? location.state?.categoryName === "Frames"
                              ? "h18"
                              : "h10"
                            : "h10"
                        }
                      >
                        Optical
                      </Typography>
                    </ListItemButton>
                    <ListItemButton
                      sx={{
                        margin: "13px 0",
                        marginTop: 0,
                        "&:hover": {
                          background: "none",
                          backgroundColor: "#F5EFF0",
                        },
                      }}
                      onClick={() => {
                        setClickedButton("AccessoryMen");
                        clickedMenu("Accessory", "All", "Men");
                        setOpenDrawer(false);
                        setOpenSubMenuMen(false);
                      }}
                      onMouseEnter={() => {
                        setClickedButton("AccessoryMen");
                      }}
                      onMouseLeave={() => {
                        setClickedButton("");
                      }}
                    >
                      <Typography
                        color={
                          location.state?.genderName === "Men"
                            ? location.state?.categoryName === "Accessory"
                              ? "P.main"
                              : clickedButton == "AccessoryMen"
                              ? "P.main"
                              : "G1.main"
                            : clickedButton == "AccessoryMen"
                            ? "P.main"
                            : "G1.main"
                        }
                        variant={
                          location.state?.genderName === "Men"
                            ? location.state?.categoryName === "Accessory"
                              ? "h18"
                              : "h10"
                            : "h10"
                        }
                      >
                        Accessory
                      </Typography>
                    </ListItemButton>
                  </List>
                </Collapse>
                <ListItemButton
                  style={{
                    display: "inherit",
                    margin: "14px 0",
                    marginBottom: openSubMenuWoman ? 0 : "14px",
                  }}
                  onClick={() => setOpenSubMenuWoman(!openSubMenuWoman)}
                >
                  <Grid display="flex" justifyContent="space-between">
                    <Typography
                      variant={
                        location.state?.genderName === "Women"
                          ? "h32"
                          : openSubMenuWoman
                          ? "h32"
                          : "h10"
                      }
                    >
                      Women
                    </Typography>
                    {openSubMenuWoman ? <ExpandLess /> : <ExpandMore />}
                  </Grid>
                </ListItemButton>
                <Collapse in={openSubMenuWoman} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItemButton
                      sx={{
                        margin: "0",
                        marginTop: "13px",
                        "&:hover": {
                          background: "none",
                          backgroundColor: "#F5EFF0",
                        },
                      }}
                      onClick={() => {
                        setClickedButton("SunglassWomen");
                        clickedMenu("Sunglasses", "All", "Women");
                        setOpenDrawer(false);
                        setOpenSubMenuWoman(false);
                      }}
                      onMouseEnter={() => {
                        setClickedButton("SunglassWomen");
                      }}
                      onMouseLeave={() => {
                        setClickedButton("");
                      }}
                    >
                      <Typography
                        color={
                          location.state?.genderName === "Women"
                            ? location.state?.categoryName === "Sunglasses"
                              ? "P.main"
                              : clickedButton == "SunglassWomen"
                              ? "P.main"
                              : "G1.main"
                            : clickedButton == "SunglassWomen"
                            ? "P.main"
                            : "G1.main"
                        }
                        variant={
                          location.state?.genderName === "Women"
                            ? location.state?.categoryName === "Sunglasses"
                              ? "h18"
                              : "h10"
                            : "h10"
                        }
                      >
                        Sunglasses
                      </Typography>
                    </ListItemButton>
                    <ListItemButton
                      sx={{
                        margin: "0",
                        marginBottom: "0",
                        "&:hover": {
                          background: "none",
                          backgroundColor: "#F5EFF0",
                        },
                      }}
                      onClick={() => {
                        setClickedButton("FrameWomen");
                        clickedMenu("Optical", "All", "Women");
                        setOpenDrawer(false);
                        setOpenSubMenuWoman(false);
                      }}
                      onMouseEnter={() => {
                        setClickedButton("FrameWomen");
                      }}
                      onMouseLeave={() => {
                        setClickedButton("");
                      }}
                    >
                      <Typography
                        color={
                          location.state?.genderName === "Women"
                            ? location.state?.categoryName === "Frames"
                              ? "P.main"
                              : clickedButton == "FrameWomen"
                              ? "P.main"
                              : "G1.main"
                            : clickedButton == "FrameWomen"
                            ? "P.main"
                            : "G1.main"
                        }
                        variant={
                          location.state?.genderName === "Women"
                            ? location.state?.categoryName === "Frames"
                              ? "h18"
                              : "h10"
                            : "h10"
                        }
                      >
                        Optical
                      </Typography>
                    </ListItemButton>
                    <ListItemButton
                      sx={{
                        margin: "13px 0",
                        marginTop: 0,
                        "&:hover": {
                          background: "none",
                          backgroundColor: "#F5EFF0",
                        },
                      }}
                      onClick={() => {
                        setClickedButton("AccessoryWomen");
                        clickedMenu("Accessory", "All", "Women");
                        setOpenDrawer(false);
                        setOpenSubMenuWoman(false);
                      }}
                      onMouseEnter={() => {
                        setClickedButton("AccessoryWomen");
                      }}
                      onMouseLeave={() => {
                        setClickedButton("");
                      }}
                    >
                      <Typography
                        color={
                          location.state?.genderName === "Women"
                            ? location.state?.categoryName === "Accessory"
                              ? "P.main"
                              : clickedButton == "AccessoryWomen"
                              ? "P.main"
                              : "G1.main"
                            : clickedButton == "AccessoryWomen"
                            ? "P.main"
                            : "G1.main"
                        }
                        variant={
                          location.state?.genderName === "Women"
                            ? location.state?.categoryName === "Accessory"
                              ? "h18"
                              : "h10"
                            : "h10"
                        }
                      >
                        Accessory
                      </Typography>
                    </ListItemButton>
                  </List>
                </Collapse>
                <ListItemButton
                  style={{
                    display: "inherit",
                    margin: "14px 0",
                    marginBottom: openSubMenuLens ? 0 : "14px",
                  }}
                  onClick={() => setOpenSubMenuLens(!openSubMenuLens)}
                >
                  <Grid display="flex" justifyContent="space-between">
                    <Typography
                      color={
                        location.state?.categoryName === "color"
                          ? "P.main"
                          : "Black.main"
                      }
                      variant={
                        location.state?.categoryName === "Color"
                          ? "h18"
                          : location.state?.categoryName === "Clear"
                          ? "h18"
                          : openSubMenuLens
                          ? "h32"
                          : "h10"
                      }
                    >
                      Contact Lenses
                    </Typography>
                    {openSubMenuLens ? <ExpandLess /> : <ExpandMore />}
                  </Grid>
                </ListItemButton>
                <Collapse in={openSubMenuLens} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItemButton
                      sx={{
                        margin: "0",
                        marginTop: "13px",
                        "&:hover": {
                          background: "none",
                          backgroundColor: "#F5EFF0",
                        },
                      }}
                      onClick={() => {
                        setClickedButton("Clear");
                        clickedMenu("ClearContactLens", "All", "");
                        setOpenDrawer(false);
                        setOpenSubMenuLens(false);
                      }}
                      onMouseEnter={() => {
                        setClickedButton("Clear");
                      }}
                      onMouseLeave={() => {
                        setClickedButton("");
                      }}
                    >
                      <Typography
                        color={
                          location.state?.categoryName === "Clear"
                            ? "P.main"
                            : clickedButton == "Clear"
                            ? "P.main"
                            : "G1.main"
                        }
                        variant={
                          location.state?.categoryName === "Clear"
                            ? "h18"
                            : "h10"
                        }
                      >
                        Clear
                      </Typography>
                    </ListItemButton>
                    <ListItemButton
                      sx={{
                        margin: "13px 0",
                        marginTop: 0,
                        "&:hover": {
                          background: "none",
                          backgroundColor: "#F5EFF0",
                        },
                      }}
                      onClick={() => {
                        setClickedButton("Color");
                        clickedMenu("ColorContactLens", "All", "");
                        setOpenDrawer(false);
                        setOpenSubMenuLens(false);
                      }}
                      onMouseEnter={() => {
                        setClickedButton("Color");
                      }}
                      onMouseLeave={() => {
                        setClickedButton("");
                      }}
                    >
                      <Typography
                        color={
                          location.state?.categoryName === "Color"
                            ? "P.main"
                            : clickedButton == "Color"
                            ? "P.main"
                            : "G1.main"
                        }
                        variant={
                          location.state?.categoryName === "Color"
                            ? "h18"
                            : "h10"
                        }
                      >
                        Color
                      </Typography>
                    </ListItemButton>
                  </List>
                </Collapse>
                <ListItemButton
                  onClick={() => {
                    setClickedButton("EB Magazine");
                    history.push("/home/ebMagazine");
                  }}
                  sx={{
                    mb: "14px",
                    "&:hover": {
                      background: "none",
                      backgroundColor: "#F5EFF0",
                    },
                  }}
                  onMouseEnter={() => {
                    setClickedButton("EB Magazine");
                  }}
                  onMouseLeave={() => {
                    setClickedButton("");
                  }}
                >
                  <Typography
                    variant={
                      window.location.pathname === "/home/ebMagazine"
                        ? "h32"
                        : "h10"
                    }
                    sx={{
                      color:
                        clickedButton == "EB Magazine"
                          ? "P.main"
                          : "Black.main",
                    }}
                  >
                    EB Magazine
                  </Typography>
                </ListItemButton>
                <ListItemButton
                  onClick={() => {
                    setClickedButton("About EB");
                    history.push("/home/aboutus");
                  }}
                  onMouseEnter={() => {
                    setClickedButton("About EB");
                  }}
                  onMouseLeave={() => {
                    setClickedButton("");
                  }}
                  sx={{
                    "&:hover": {
                      background: "none",
                      backgroundColor: "#F5EFF0",
                    },
                  }}
                >
                  <Typography
                    variant={
                      window.location.pathname === "/home/aboutus"
                        ? "h32"
                        : "h10"
                    }
                    sx={{
                      color:
                        clickedButton == "About EB" ? "P.main" : "Black.main",
                    }}
                  >
                    About EB
                  </Typography>
                </ListItemButton>
              </List>
            </Grid>
          </SwipeableDrawer>
        </Hidden>
      </Grid>
                                                              
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

export default HeaderOtherPage;
