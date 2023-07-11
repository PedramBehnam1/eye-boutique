import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import { BsBoxSeam, BsPerson } from "react-icons/bs";
import { FiHeart } from "react-icons/fi";
import { GoSettings } from "react-icons/go";
import {  MdOutlineLocationOn } from "react-icons/md";
import Footer from "../../../layout/footer";
import Header from "../../../layout/Header";
import { Avatar, Hidden, IconButton, Snackbar } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import axiosConfig from "../../../axiosConfig";
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';

const ProfileLayout = ({ className, children, pageName }) => {
  const [isRemoved, setIsRemoved] = useState(false);
  const[showCartPage,setShowCartPage]=useState(false)
  const [trigger,setTrigger] = useState(0)
  const [_trigger, _setTrigger] = useState(0);

  let history = useHistory();
  const location = useLocation();
  const loc = location.pathname.split("/");
  const [showMenu, setShowMenu] = useState(false);
  const [user, setUser] = useState();
  const [width, setWidth] = useState("");

  const [windowResizing, setWindowResizing] = useState(false);
  const [openMassage, setOpenMassage] = useState(false);
  const [showMassage, setShowMassage] = useState('');

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

  useEffect(() => {
    getUserInfo();
    setShowMenu(showMenu);
  }, [showMenu]);

  const activeItem = (e) => {
    const a = e.split("/");
    return a[3];
  };

  const menuItem = [
    {
      title: "Profile",
      path: "/home/profile/profile",
      icon: BsPerson,
    },
    {
      title: "Orders",
      path: "/home/profile/orders",
      icon: BsBoxSeam,
    },
    {
      title: "Wishlist",
      path: "/home/profile/wishlist",
      icon: FiHeart,
    },
    {
      title: "Addresses",
      path: "/home/profile/addresses",
      icon: MdOutlineLocationOn,
    },
    {
      title: "Change Password",
      path: "/home/profile/changepass",
      icon: GoSettings,
    },
  ];

  const style = {
    temp: {
      padding: 0,
      margin: 0,
      backgroundColor: "rgba(117, 117, 117, 0.1)",
      borderLeft: "2px solid #CB929B",
      height: "48px",
      span: {
        fontWeight: "700",
      },
      color: "#757575",
    },
    item: {
      color: "#757575",
    },
    padding: 0,
  };

  const getUserInfo = () => {
    axiosConfig
      .get("/users/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then((res) => {
        setUser(res.data.user);
      }).catch((err) =>{
        if(err.response.data.error.status === 401){
          axiosConfig
            .post("/users/refresh_token", {
              refresh_token: localStorage.getItem("refreshToken"),
            })
            .then((res) => {
              setShowMassage('Get user info has a problem!')
              setOpenMassage(true) 
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
    <Grid
      mt={5}
      xs={12}
      display="flex"
      flexWrap="wrap"
      sx={{ minHeight: "100vh" }}
    >
      <Header trigger={trigger} _trigger={_trigger} showShoppingCard={showCartPage} closeShowShoppingCard={()=>{setShowCartPage(false)}}
        isRemoved={(isRemoved) => {
          setIsRemoved(isRemoved)
        }}
        _trigger_={(trigger) => {
          setTrigger(trigger);
          _setTrigger(trigger);
        }}
      />

      <Hidden mdDown>
        <Grid
          container
          xs={12}
          md={12}
          sx={{
            display: "flex",
            padding: "100px",
            paddingLeft: { xl: "150px", lg: "100px", md: "50px" },
            paddingRight: { xl: "150px", lg: "100px", md: "50px" },
            backgroundColor: "GrayLight.main",
          }}
        >
          <Grid
            item
            xs={2}
            md={2}
            sx={{ width: "265px", padding: 0, margin: 0 }}
          >
            {user && (
              <Grid
                xs={12}
                backgroundColor="G1.main"
                style={{
                  borderRadius: "5px",
                  height:"65px",
                  margin: "0 0 5px 0",
                  padding: "8px 15px",
                }}
              >
                <Grid>
                  <Typography
                    variant="h33"
                    color="P3.main"
                    sx={{
                      fontSize: { xl: "18px", lg: "16px", md: "14px" },
                    }}
                  >
                    {user.first_name.charAt(0).toUpperCase() +
                      user.first_name.slice(1) +
                      " " +
                      user.last_name.charAt(0).toUpperCase() +
                      user.last_name.slice(1)}
                  </Typography>
                </Grid>
                <Grid display="flex" flexWrap="wrap" sx={{ width: "100%" }}>
                  <Typography
                    noWrap
                    color="P3.main"
                    variant="h16"
                    sx={{
                      fontSize: { xl: "14px", lg: "12px", md: "12px" },
                    }}
                  >
                    {window.innerWidth < 1030
                      ? user.email.substring(0, 15) +
                        " " +
                        user.email.substring(15, user.email.length)
                      : window.innerWidth < 1490
                      ? user.email.substring(0, 21) +
                        " " +
                        user.email.substring(21, user.email.length)
                      : user.email}
                  </Typography>
                </Grid>
              </Grid>
            )}

            <Grid item xs={12} md={12} sx={{ margin: 0, padding: 0 }}>
              <List sx={style} component="nav">
                <Grid
                  backgroundColor="P3.main"
                  style={{ borderRadius: "5px" }}
                  sx={{
                    padding: 0,
                    margin: "5px 0 0 0",
                    overflow: "hidden",
                  }}
                >
                  {menuItem.map((item) => (
                    <ListItem
                      style={{
                        paddingLeft: "18px",
                      }}
                      button
                      onClick={() => history.push(item.path)}
                      sx={
                        loc[3] == activeItem(item.path)
                          ? style.temp
                          : style.item
                      }
                    >
                      
                      <ListItemIcon>
                        {item.title == "Profile" ? (
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 22"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M13.71 11.71C14.6904 10.9387 15.406 9.88092 15.7572 8.68394C16.1085 7.48697 16.0779 6.21027 15.6698 5.03147C15.2617 3.85267 14.4963 2.83039 13.4801 2.10686C12.4639 1.38332 11.2474 0.994507 10 0.994507C8.75255 0.994507 7.53611 1.38332 6.51993 2.10686C5.50374 2.83039 4.73834 3.85267 4.33021 5.03147C3.92208 6.21027 3.89151 7.48697 4.24276 8.68394C4.59401 9.88092 5.3096 10.9387 6.29 11.71C4.61007 12.383 3.14428 13.4994 2.04889 14.9399C0.953495 16.3805 0.26956 18.0913 0.0699967 19.89C0.0555513 20.0213 0.0671132 20.1542 0.104022 20.2811C0.140931 20.4079 0.202464 20.5263 0.285108 20.6293C0.452016 20.8375 0.69478 20.9708 0.959997 21C1.22521 21.0292 1.49116 20.9518 1.69932 20.7849C1.90749 20.618 2.04082 20.3752 2.07 20.11C2.28958 18.1552 3.22168 16.3498 4.68822 15.0388C6.15475 13.7278 8.0529 13.003 10.02 13.003C11.9871 13.003 13.8852 13.7278 15.3518 15.0388C16.8183 16.3498 17.7504 18.1552 17.97 20.11C17.9972 20.3557 18.1144 20.5827 18.2991 20.747C18.4838 20.9114 18.7228 21.0015 18.97 21H19.08C19.3421 20.9698 19.5817 20.8373 19.7466 20.6313C19.9114 20.4252 19.9881 20.1624 19.96 19.9C19.7595 18.0962 19.0719 16.381 17.9708 14.9382C16.8698 13.4954 15.3969 12.3795 13.71 11.71ZM10 11C9.20887 11 8.43551 10.7654 7.77772 10.3259C7.11992 9.88636 6.60723 9.26164 6.30448 8.53074C6.00173 7.79983 5.92251 6.99557 6.07686 6.21964C6.2312 5.44372 6.61216 4.73099 7.17157 4.17158C7.73098 3.61217 8.44371 3.2312 9.21964 3.07686C9.99556 2.92252 10.7998 3.00173 11.5307 3.30448C12.2616 3.60724 12.8863 4.11993 13.3259 4.77772C13.7654 5.43552 14 6.20888 14 7C14 8.06087 13.5786 9.07828 12.8284 9.82843C12.0783 10.5786 11.0609 11 10 11Z"
                              fill="#757575"
                            />
                          </svg>
                        ) : item.title == "Orders" ? (
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 16 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M15 5H12V4C12 2.93913 11.5786 1.92172 10.8284 1.17157C10.0783 0.421427 9.06087 0 8 0C6.93913 0 5.92172 0.421427 5.17157 1.17157C4.42143 1.92172 4 2.93913 4 4V5H1C0.734784 5 0.48043 5.10536 0.292893 5.29289C0.105357 5.48043 0 5.73478 0 6V17C0 17.7956 0.316071 18.5587 0.87868 19.1213C1.44129 19.6839 2.20435 20 3 20H13C13.7956 20 14.5587 19.6839 15.1213 19.1213C15.6839 18.5587 16 17.7956 16 17V6C16 5.73478 15.8946 5.48043 15.7071 5.29289C15.5196 5.10536 15.2652 5 15 5ZM6 4C6 3.46957 6.21071 2.96086 6.58579 2.58579C6.96086 2.21071 7.46957 2 8 2C8.53043 2 9.03914 2.21071 9.41421 2.58579C9.78929 2.96086 10 3.46957 10 4V5H6V4ZM14 17C14 17.2652 13.8946 17.5196 13.7071 17.7071C13.5196 17.8946 13.2652 18 13 18H3C2.73478 18 2.48043 17.8946 2.29289 17.7071C2.10536 17.5196 2 17.2652 2 17V7H4V8C4 8.26522 4.10536 8.51957 4.29289 8.70711C4.48043 8.89464 4.73478 9 5 9C5.26522 9 5.51957 8.89464 5.70711 8.70711C5.89464 8.51957 6 8.26522 6 8V7H10V8C10 8.26522 10.1054 8.51957 10.2929 8.70711C10.4804 8.89464 10.7348 9 11 9C11.2652 9 11.5196 8.89464 11.7071 8.70711C11.8946 8.51957 12 8.26522 12 8V7H14V17Z"
                              fill="#757575"
                            />
                          </svg>
                        ) : item.title == "Wishlist" ? (
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 21 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M19.16 2C18.1 0.937205 16.6948 0.288538 15.1983 0.171168C13.7019 0.0537975 12.2128 0.475464 11 1.36C9.72766 0.413635 8.14399 -0.0154912 6.56792 0.159035C4.99185 0.333561 3.54044 1.09878 2.50597 2.30058C1.47151 3.50239 0.930823 5.05152 0.992802 6.63601C1.05478 8.2205 1.71482 9.72267 2.84 10.84L9.05 17.06C9.57002 17.5718 10.2704 17.8586 11 17.8586C11.7296 17.8586 12.43 17.5718 12.95 17.06L19.16 10.84C20.3276 9.66526 20.9829 8.07627 20.9829 6.42C20.9829 4.76372 20.3276 3.17473 19.16 2ZM17.75 9.46L11.54 15.67C11.4693 15.7414 11.3852 15.798 11.2925 15.8366C11.1999 15.8753 11.1004 15.8952 11 15.8952C10.8996 15.8952 10.8001 15.8753 10.7075 15.8366C10.6148 15.798 10.5307 15.7414 10.46 15.67L4.25 9.43C3.46576 8.62834 3.02661 7.55146 3.02661 6.43C3.02661 5.30853 3.46576 4.23165 4.25 3.43C5.04916 2.64099 6.12697 2.19857 7.25 2.19857C8.37303 2.19857 9.45085 2.64099 10.25 3.43C10.343 3.52373 10.4536 3.59812 10.5754 3.64889C10.6973 3.69966 10.828 3.7258 10.96 3.7258C11.092 3.7258 11.2227 3.69966 11.3446 3.64889C11.4664 3.59812 11.577 3.52373 11.67 3.43C12.4692 2.64099 13.547 2.19857 14.67 2.19857C15.793 2.19857 16.8708 2.64099 17.67 3.43C18.465 4.22115 18.9186 5.29219 18.9335 6.41368C18.9485 7.53518 18.5236 8.61793 17.75 9.43V9.46Z"
                              fill="#757575"
                            />
                          </svg>
                        ) : item.title == "Addresses" ? (
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z"
                              stroke="#757575"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
                              stroke="#757575"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        ) : item.title == "Change Password" ? (
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M18 6.18V1C18 0.734784 17.8946 0.48043 17.7071 0.292893C17.5196 0.105357 17.2652 0 17 0C16.7348 0 16.4804 0.105357 16.2929 0.292893C16.1054 0.48043 16 0.734784 16 1V6.18C15.4208 6.3902 14.9205 6.77363 14.5668 7.27816C14.2132 7.7827 14.0235 8.38388 14.0235 9C14.0235 9.61612 14.2132 10.2173 14.5668 10.7218C14.9205 11.2264 15.4208 11.6098 16 11.82V19C16 19.2652 16.1054 19.5196 16.2929 19.7071C16.4804 19.8946 16.7348 20 17 20C17.2652 20 17.5196 19.8946 17.7071 19.7071C17.8946 19.5196 18 19.2652 18 19V11.82C18.5792 11.6098 19.0795 11.2264 19.4332 10.7218C19.7868 10.2173 19.9765 9.61612 19.9765 9C19.9765 8.38388 19.7868 7.7827 19.4332 7.27816C19.0795 6.77363 18.5792 6.3902 18 6.18ZM17 10C16.8022 10 16.6089 9.94135 16.4444 9.83147C16.28 9.72159 16.1518 9.56541 16.0761 9.38268C16.0004 9.19996 15.9806 8.99889 16.0192 8.80491C16.0578 8.61093 16.153 8.43275 16.2929 8.29289C16.4327 8.15304 16.6109 8.0578 16.8049 8.01921C16.9989 7.98063 17.2 8.00043 17.3827 8.07612C17.5654 8.15181 17.7216 8.27998 17.8315 8.44443C17.9414 8.60888 18 8.80222 18 9C18 9.26522 17.8946 9.51957 17.7071 9.70711C17.5196 9.89464 17.2652 10 17 10ZM11 12.18V1C11 0.734784 10.8946 0.48043 10.7071 0.292893C10.5196 0.105357 10.2652 0 10 0C9.73478 0 9.48043 0.105357 9.29289 0.292893C9.10536 0.48043 9 0.734784 9 1V12.18C8.42085 12.3902 7.92046 12.7736 7.56684 13.2782C7.21322 13.7827 7.02352 14.3839 7.02352 15C7.02352 15.6161 7.21322 16.2173 7.56684 16.7218C7.92046 17.2264 8.42085 17.6098 9 17.82V19C9 19.2652 9.10536 19.5196 9.29289 19.7071C9.48043 19.8946 9.73478 20 10 20C10.2652 20 10.5196 19.8946 10.7071 19.7071C10.8946 19.5196 11 19.2652 11 19V17.82C11.5792 17.6098 12.0795 17.2264 12.4332 16.7218C12.7868 16.2173 12.9765 15.6161 12.9765 15C12.9765 14.3839 12.7868 13.7827 12.4332 13.2782C12.0795 12.7736 11.5792 12.3902 11 12.18ZM10 16C9.80222 16 9.60888 15.9414 9.44443 15.8315C9.27998 15.7216 9.15181 15.5654 9.07612 15.3827C9.00043 15.2 8.98063 14.9989 9.01921 14.8049C9.0578 14.6109 9.15304 14.4327 9.29289 14.2929C9.43274 14.153 9.61093 14.0578 9.80491 14.0192C9.99889 13.9806 10.2 14.0004 10.3827 14.0761C10.5654 14.1518 10.7216 14.28 10.8315 14.4444C10.9413 14.6089 11 14.8022 11 15C11 15.2652 10.8946 15.5196 10.7071 15.7071C10.5196 15.8946 10.2652 16 10 16ZM4 4.18V1C4 0.734784 3.89464 0.48043 3.7071 0.292893C3.51957 0.105357 3.26521 0 3 0C2.73478 0 2.48043 0.105357 2.29289 0.292893C2.10536 0.48043 2 0.734784 2 1V4.18C1.42085 4.3902 0.920458 4.77363 0.56684 5.27817C0.213221 5.7827 0.0235214 6.38388 0.0235214 7C0.0235214 7.61612 0.213221 8.2173 0.56684 8.72184C0.920458 9.22637 1.42085 9.6098 2 9.82V19C2 19.2652 2.10536 19.5196 2.29289 19.7071C2.48043 19.8946 2.73478 20 3 20C3.26521 20 3.51957 19.8946 3.7071 19.7071C3.89464 19.5196 4 19.2652 4 19V9.82C4.57915 9.6098 5.07954 9.22637 5.43316 8.72184C5.78678 8.2173 5.97647 7.61612 5.97647 7C5.97647 6.38388 5.78678 5.7827 5.43316 5.27817C5.07954 4.77363 4.57915 4.3902 4 4.18ZM3 8C2.80222 8 2.60888 7.94135 2.44443 7.83147C2.27998 7.72159 2.15181 7.56541 2.07612 7.38268C2.00043 7.19996 1.98063 6.99889 2.01921 6.80491C2.0578 6.61093 2.15304 6.43275 2.29289 6.29289C2.43274 6.15304 2.61093 6.0578 2.80491 6.01921C2.99889 5.98063 3.19996 6.00043 3.38268 6.07612C3.56541 6.15181 3.72159 6.27998 3.83147 6.44443C3.94135 6.60888 4 6.80222 4 7C4 7.26522 3.89464 7.51957 3.7071 7.70711C3.51957 7.89464 3.26521 8 3 8Z"
                              fill="#757575"
                            />
                          </svg>
                        ) : (
                          ""
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.title}
                        sx={{ marginLeft: "-20px" }}
                      />
                    </ListItem>
                  ))}
                </Grid>
                <Grid
                  backgroundColor="P3.main"
                  style={{ borderRadius: "5px" }}
                  sx={{ padding: 0, margin: "5px 0 0 0", overflow: "hidden" }}
                >
                  <ListItem
                    button
                    sx={{
                      paddingLeft: "18px",
                    }}
                    onClick={() => {
                      localStorage.removeItem("token", "refreshToken");
                      history.push("/");
                    }}
                  >
                    <ListItemIcon>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M16 17L21 12L16 7"
                          stroke="#757575"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M21 12H9"
                          stroke="#757575"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
                          stroke="#757575"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </ListItemIcon>
                    <ListItemText
                      sx={{ marginLeft: "-20px" }}
                      primary={
                        <Typography type="body2" style={{ color: "#757575" }}>
                          Log out
                        </Typography>
                      }
                    />
                  </ListItem>
                </Grid>
              </List>
            </Grid>
          </Grid>
          <Grid item xs={10} md={10}>
            {children}
          </Grid>
        </Grid>
      </Hidden>
      <Hidden mdUp>
        {showMenu ? (
          <Grid
            xs={12}
            backgroundColor="GrayLight.main"
            style={{
              width: "100%",
              margin: "30px 0 0 0",
            }}
          >
            <Grid
              xs={12}
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                height: "70px",
                backgroundColor: "G1.main",
                paddingLeft: "20px",
              }}
            >
              <Grid>
                <IconButton
                sx={{"&:hover" : {backgroundColor:"rgba(0,0,0,0)"}}}
                  onClick={() => {
                    history.push("/");
                  }}
                >
                  <Avatar
                    sx={{
                      backgroundColor: "G1.main",
                    }}
                  >
                    <ArrowBackIcon sx={{ color: "P3.main" }} />
                  </Avatar>
                </IconButton>
              </Grid>
              <Grid>
                <Grid>
                  <Typography variant= "menutitle" color="P3.main">
                    {user.first_name.charAt(0).toUpperCase() +
                      user.first_name.slice(1) +
                      " " +
                      user.last_name.charAt(0).toUpperCase() +
                      user.last_name.slice(1)}
                  </Typography>
                </Grid>
                <Grid>
                  <Typography
                    variant={window.innerWidth>320?"h16":"h15"}
                    color="P3.main"
                  >
                    {window.innerWidth < 1030
                      ? user.email.substring(0, 15) +
                        " " +
                        user.email.substring(15, user.email.length)
                      : window.innerWidth < 1490
                      ? user.email.substring(0, 21) +
                        " " +
                        user.email.substring(21, user.email.length)
                      : user.email}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid
              backgroundColor="GrayLight.main"
              sx={{
                padding: 0,
                margin: "5px 0 0 0",
                overflow: "hidden",
              }}
            >
              <Grid item xs={12} md={12} sx={{ margin: 0, padding: 0 }}>
                <List sx={style} component="nav">
                  <Grid
                    backgroundColor="P3.main"
                    sx={{
                      padding: "5px 0 0 0",
                      margin: "5px 0 0 0",
                      overflow: "hidden",
                    }}
                  >
                    {menuItem.map((item) => (
                      <ListItem
                        style={{
                          paddingLeft: "40px",
                        }}
                        button
                        onClick={() => {
                          setShowMenu(!showMenu);
                          history.push(item.path);
                        }}
                      >
                        <ListItemIcon>
                          {item.title == "Profile" ? (
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 20 22"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M13.71 11.71C14.6904 10.9387 15.406 9.88092 15.7572 8.68394C16.1085 7.48697 16.0779 6.21027 15.6698 5.03147C15.2617 3.85267 14.4963 2.83039 13.4801 2.10686C12.4639 1.38332 11.2474 0.994507 10 0.994507C8.75255 0.994507 7.53611 1.38332 6.51993 2.10686C5.50374 2.83039 4.73834 3.85267 4.33021 5.03147C3.92208 6.21027 3.89151 7.48697 4.24276 8.68394C4.59401 9.88092 5.3096 10.9387 6.29 11.71C4.61007 12.383 3.14428 13.4994 2.04889 14.9399C0.953495 16.3805 0.26956 18.0913 0.0699967 19.89C0.0555513 20.0213 0.0671132 20.1542 0.104022 20.2811C0.140931 20.4079 0.202464 20.5263 0.285108 20.6293C0.452016 20.8375 0.69478 20.9708 0.959997 21C1.22521 21.0292 1.49116 20.9518 1.69932 20.7849C1.90749 20.618 2.04082 20.3752 2.07 20.11C2.28958 18.1552 3.22168 16.3498 4.68822 15.0388C6.15475 13.7278 8.0529 13.003 10.02 13.003C11.9871 13.003 13.8852 13.7278 15.3518 15.0388C16.8183 16.3498 17.7504 18.1552 17.97 20.11C17.9972 20.3557 18.1144 20.5827 18.2991 20.747C18.4838 20.9114 18.7228 21.0015 18.97 21H19.08C19.3421 20.9698 19.5817 20.8373 19.7466 20.6313C19.9114 20.4252 19.9881 20.1624 19.96 19.9C19.7595 18.0962 19.0719 16.381 17.9708 14.9382C16.8698 13.4954 15.3969 12.3795 13.71 11.71ZM10 11C9.20887 11 8.43551 10.7654 7.77772 10.3259C7.11992 9.88636 6.60723 9.26164 6.30448 8.53074C6.00173 7.79983 5.92251 6.99557 6.07686 6.21964C6.2312 5.44372 6.61216 4.73099 7.17157 4.17158C7.73098 3.61217 8.44371 3.2312 9.21964 3.07686C9.99556 2.92252 10.7998 3.00173 11.5307 3.30448C12.2616 3.60724 12.8863 4.11993 13.3259 4.77772C13.7654 5.43552 14 6.20888 14 7C14 8.06087 13.5786 9.07828 12.8284 9.82843C12.0783 10.5786 11.0609 11 10 11Z"
                                fill="#757575"
                              />
                            </svg>
                          ) : item.title == "Orders" ? (
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 16 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M15 5H12V4C12 2.93913 11.5786 1.92172 10.8284 1.17157C10.0783 0.421427 9.06087 0 8 0C6.93913 0 5.92172 0.421427 5.17157 1.17157C4.42143 1.92172 4 2.93913 4 4V5H1C0.734784 5 0.48043 5.10536 0.292893 5.29289C0.105357 5.48043 0 5.73478 0 6V17C0 17.7956 0.316071 18.5587 0.87868 19.1213C1.44129 19.6839 2.20435 20 3 20H13C13.7956 20 14.5587 19.6839 15.1213 19.1213C15.6839 18.5587 16 17.7956 16 17V6C16 5.73478 15.8946 5.48043 15.7071 5.29289C15.5196 5.10536 15.2652 5 15 5ZM6 4C6 3.46957 6.21071 2.96086 6.58579 2.58579C6.96086 2.21071 7.46957 2 8 2C8.53043 2 9.03914 2.21071 9.41421 2.58579C9.78929 2.96086 10 3.46957 10 4V5H6V4ZM14 17C14 17.2652 13.8946 17.5196 13.7071 17.7071C13.5196 17.8946 13.2652 18 13 18H3C2.73478 18 2.48043 17.8946 2.29289 17.7071C2.10536 17.5196 2 17.2652 2 17V7H4V8C4 8.26522 4.10536 8.51957 4.29289 8.70711C4.48043 8.89464 4.73478 9 5 9C5.26522 9 5.51957 8.89464 5.70711 8.70711C5.89464 8.51957 6 8.26522 6 8V7H10V8C10 8.26522 10.1054 8.51957 10.2929 8.70711C10.4804 8.89464 10.7348 9 11 9C11.2652 9 11.5196 8.89464 11.7071 8.70711C11.8946 8.51957 12 8.26522 12 8V7H14V17Z"
                                fill="#757575"
                              />
                            </svg>
                          ) : item.title == "Wishlist" ? (
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 21 18"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M19.16 2C18.1 0.937205 16.6948 0.288538 15.1983 0.171168C13.7019 0.0537975 12.2128 0.475464 11 1.36C9.72766 0.413635 8.14399 -0.0154912 6.56792 0.159035C4.99185 0.333561 3.54044 1.09878 2.50597 2.30058C1.47151 3.50239 0.930823 5.05152 0.992802 6.63601C1.05478 8.2205 1.71482 9.72267 2.84 10.84L9.05 17.06C9.57002 17.5718 10.2704 17.8586 11 17.8586C11.7296 17.8586 12.43 17.5718 12.95 17.06L19.16 10.84C20.3276 9.66526 20.9829 8.07627 20.9829 6.42C20.9829 4.76372 20.3276 3.17473 19.16 2ZM17.75 9.46L11.54 15.67C11.4693 15.7414 11.3852 15.798 11.2925 15.8366C11.1999 15.8753 11.1004 15.8952 11 15.8952C10.8996 15.8952 10.8001 15.8753 10.7075 15.8366C10.6148 15.798 10.5307 15.7414 10.46 15.67L4.25 9.43C3.46576 8.62834 3.02661 7.55146 3.02661 6.43C3.02661 5.30853 3.46576 4.23165 4.25 3.43C5.04916 2.64099 6.12697 2.19857 7.25 2.19857C8.37303 2.19857 9.45085 2.64099 10.25 3.43C10.343 3.52373 10.4536 3.59812 10.5754 3.64889C10.6973 3.69966 10.828 3.7258 10.96 3.7258C11.092 3.7258 11.2227 3.69966 11.3446 3.64889C11.4664 3.59812 11.577 3.52373 11.67 3.43C12.4692 2.64099 13.547 2.19857 14.67 2.19857C15.793 2.19857 16.8708 2.64099 17.67 3.43C18.465 4.22115 18.9186 5.29219 18.9335 6.41368C18.9485 7.53518 18.5236 8.61793 17.75 9.43V9.46Z"
                                fill="#757575"
                              />
                            </svg>
                          ) : item.title == "Addresses" ? (
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z"
                                stroke="#757575"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
                                stroke="#757575"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>
                          ) : item.title == "Change Password" ? (
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M18 6.18V1C18 0.734784 17.8946 0.48043 17.7071 0.292893C17.5196 0.105357 17.2652 0 17 0C16.7348 0 16.4804 0.105357 16.2929 0.292893C16.1054 0.48043 16 0.734784 16 1V6.18C15.4208 6.3902 14.9205 6.77363 14.5668 7.27816C14.2132 7.7827 14.0235 8.38388 14.0235 9C14.0235 9.61612 14.2132 10.2173 14.5668 10.7218C14.9205 11.2264 15.4208 11.6098 16 11.82V19C16 19.2652 16.1054 19.5196 16.2929 19.7071C16.4804 19.8946 16.7348 20 17 20C17.2652 20 17.5196 19.8946 17.7071 19.7071C17.8946 19.5196 18 19.2652 18 19V11.82C18.5792 11.6098 19.0795 11.2264 19.4332 10.7218C19.7868 10.2173 19.9765 9.61612 19.9765 9C19.9765 8.38388 19.7868 7.7827 19.4332 7.27816C19.0795 6.77363 18.5792 6.3902 18 6.18ZM17 10C16.8022 10 16.6089 9.94135 16.4444 9.83147C16.28 9.72159 16.1518 9.56541 16.0761 9.38268C16.0004 9.19996 15.9806 8.99889 16.0192 8.80491C16.0578 8.61093 16.153 8.43275 16.2929 8.29289C16.4327 8.15304 16.6109 8.0578 16.8049 8.01921C16.9989 7.98063 17.2 8.00043 17.3827 8.07612C17.5654 8.15181 17.7216 8.27998 17.8315 8.44443C17.9414 8.60888 18 8.80222 18 9C18 9.26522 17.8946 9.51957 17.7071 9.70711C17.5196 9.89464 17.2652 10 17 10ZM11 12.18V1C11 0.734784 10.8946 0.48043 10.7071 0.292893C10.5196 0.105357 10.2652 0 10 0C9.73478 0 9.48043 0.105357 9.29289 0.292893C9.10536 0.48043 9 0.734784 9 1V12.18C8.42085 12.3902 7.92046 12.7736 7.56684 13.2782C7.21322 13.7827 7.02352 14.3839 7.02352 15C7.02352 15.6161 7.21322 16.2173 7.56684 16.7218C7.92046 17.2264 8.42085 17.6098 9 17.82V19C9 19.2652 9.10536 19.5196 9.29289 19.7071C9.48043 19.8946 9.73478 20 10 20C10.2652 20 10.5196 19.8946 10.7071 19.7071C10.8946 19.5196 11 19.2652 11 19V17.82C11.5792 17.6098 12.0795 17.2264 12.4332 16.7218C12.7868 16.2173 12.9765 15.6161 12.9765 15C12.9765 14.3839 12.7868 13.7827 12.4332 13.2782C12.0795 12.7736 11.5792 12.3902 11 12.18ZM10 16C9.80222 16 9.60888 15.9414 9.44443 15.8315C9.27998 15.7216 9.15181 15.5654 9.07612 15.3827C9.00043 15.2 8.98063 14.9989 9.01921 14.8049C9.0578 14.6109 9.15304 14.4327 9.29289 14.2929C9.43274 14.153 9.61093 14.0578 9.80491 14.0192C9.99889 13.9806 10.2 14.0004 10.3827 14.0761C10.5654 14.1518 10.7216 14.28 10.8315 14.4444C10.9413 14.6089 11 14.8022 11 15C11 15.2652 10.8946 15.5196 10.7071 15.7071C10.5196 15.8946 10.2652 16 10 16ZM4 4.18V1C4 0.734784 3.89464 0.48043 3.7071 0.292893C3.51957 0.105357 3.26521 0 3 0C2.73478 0 2.48043 0.105357 2.29289 0.292893C2.10536 0.48043 2 0.734784 2 1V4.18C1.42085 4.3902 0.920458 4.77363 0.56684 5.27817C0.213221 5.7827 0.0235214 6.38388 0.0235214 7C0.0235214 7.61612 0.213221 8.2173 0.56684 8.72184C0.920458 9.22637 1.42085 9.6098 2 9.82V19C2 19.2652 2.10536 19.5196 2.29289 19.7071C2.48043 19.8946 2.73478 20 3 20C3.26521 20 3.51957 19.8946 3.7071 19.7071C3.89464 19.5196 4 19.2652 4 19V9.82C4.57915 9.6098 5.07954 9.22637 5.43316 8.72184C5.78678 8.2173 5.97647 7.61612 5.97647 7C5.97647 6.38388 5.78678 5.7827 5.43316 5.27817C5.07954 4.77363 4.57915 4.3902 4 4.18ZM3 8C2.80222 8 2.60888 7.94135 2.44443 7.83147C2.27998 7.72159 2.15181 7.56541 2.07612 7.38268C2.00043 7.19996 1.98063 6.99889 2.01921 6.80491C2.0578 6.61093 2.15304 6.43275 2.29289 6.29289C2.43274 6.15304 2.61093 6.0578 2.80491 6.01921C2.99889 5.98063 3.19996 6.00043 3.38268 6.07612C3.56541 6.15181 3.72159 6.27998 3.83147 6.44443C3.94135 6.60888 4 6.80222 4 7C4 7.26522 3.89464 7.51957 3.7071 7.70711C3.51957 7.89464 3.26521 8 3 8Z"
                                fill="#757575"
                              />
                            </svg>
                          ) : (
                            ""
                          )}
                        </ListItemIcon>
                        <ListItemText
                          style={{ color: "#757575" }}
                          primary={item.title}
                        />
                        <Grid pr={3}>
                          <NavigateNextIcon color="G1" />
                        </Grid>
                      </ListItem>
                    ))}
                  </Grid>
                  <Grid
                    backgroundColor="P3.main"
                    sx={{
                      margin: "5px 0 50px 0",
                      overflow: "hidden",
                    }}
                  >
                    <ListItem
                      style={{
                        paddingLeft: "40px",
                      }}
                      button
                      onClick={() => {
                        localStorage.removeItem("token", "refreshToken");
                        history.push("/");
                      }}
                    >
                      <ListItemIcon>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M16 17L21 12L16 7"
                          stroke="#757575"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M21 12H9"
                          stroke="#757575"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
                          stroke="#757575"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography type="body2" style={{ color: "#757575" }}>
                            Log out
                          </Typography>
                        }
                      />
                    </ListItem>
                  </Grid>
                </List>
              </Grid>
            </Grid>
          </Grid>
        ) : (
          <Grid container md={12} xs={12}>
            <Grid
              xs={12}
              sx={{ backgroundColor: "GrayLight.main", marginTop: "35px" }}
            >
              <Grid
                xs={12}
                sx={{
                  height: "65px",
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: "15px",
                  backgroundColor: "P3.main",
                }}
              >
                <IconButton onClick={() => setShowMenu(!showMenu)} sx={{"&:hover" : {backgroundColor:"rgba(0,0,0,0)"}}}>
                  <Avatar
                    sx={{
                      backgroundColor: "P3.main",
                    }}
                  >
                    <ArrowBackIcon sx={{ color: "G1.main" }} />
                  </Avatar>
                </IconButton>
                {pageName == "Profile" ? (
                  <svg
                    width="25"
                    height="25"
                    viewBox="0 0 20 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.71 11.71C14.6904 10.9387 15.406 9.88092 15.7572 8.68394C16.1085 7.48697 16.0779 6.21027 15.6698 5.03147C15.2617 3.85267 14.4963 2.83039 13.4801 2.10686C12.4639 1.38332 11.2474 0.994507 10 0.994507C8.75255 0.994507 7.53611 1.38332 6.51993 2.10686C5.50374 2.83039 4.73834 3.85267 4.33021 5.03147C3.92208 6.21027 3.89151 7.48697 4.24276 8.68394C4.59401 9.88092 5.3096 10.9387 6.29 11.71C4.61007 12.383 3.14428 13.4994 2.04889 14.9399C0.953495 16.3805 0.26956 18.0913 0.0699967 19.89C0.0555513 20.0213 0.0671132 20.1542 0.104022 20.2811C0.140931 20.4079 0.202464 20.5263 0.285108 20.6293C0.452016 20.8375 0.69478 20.9708 0.959997 21C1.22521 21.0292 1.49116 20.9518 1.69932 20.7849C1.90749 20.618 2.04082 20.3752 2.07 20.11C2.28958 18.1552 3.22168 16.3498 4.68822 15.0388C6.15475 13.7278 8.0529 13.003 10.02 13.003C11.9871 13.003 13.8852 13.7278 15.3518 15.0388C16.8183 16.3498 17.7504 18.1552 17.97 20.11C17.9972 20.3557 18.1144 20.5827 18.2991 20.747C18.4838 20.9114 18.7228 21.0015 18.97 21H19.08C19.3421 20.9698 19.5817 20.8373 19.7466 20.6313C19.9114 20.4252 19.9881 20.1624 19.96 19.9C19.7595 18.0962 19.0719 16.381 17.9708 14.9382C16.8698 13.4954 15.3969 12.3795 13.71 11.71ZM10 11C9.20887 11 8.43551 10.7654 7.77772 10.3259C7.11992 9.88636 6.60723 9.26164 6.30448 8.53074C6.00173 7.79983 5.92251 6.99557 6.07686 6.21964C6.2312 5.44372 6.61216 4.73099 7.17157 4.17158C7.73098 3.61217 8.44371 3.2312 9.21964 3.07686C9.99556 2.92252 10.7998 3.00173 11.5307 3.30448C12.2616 3.60724 12.8863 4.11993 13.3259 4.77772C13.7654 5.43552 14 6.20888 14 7C14 8.06087 13.5786 9.07828 12.8284 9.82843C12.0783 10.5786 11.0609 11 10 11Z"
                      fill="#757575"
                    />
                  </svg>
                ) : pageName == "Orders" ? (
                  <svg
                    width="25"
                    height="25"
                    viewBox="0 0 16 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15 5H12V4C12 2.93913 11.5786 1.92172 10.8284 1.17157C10.0783 0.421427 9.06087 0 8 0C6.93913 0 5.92172 0.421427 5.17157 1.17157C4.42143 1.92172 4 2.93913 4 4V5H1C0.734784 5 0.48043 5.10536 0.292893 5.29289C0.105357 5.48043 0 5.73478 0 6V17C0 17.7956 0.316071 18.5587 0.87868 19.1213C1.44129 19.6839 2.20435 20 3 20H13C13.7956 20 14.5587 19.6839 15.1213 19.1213C15.6839 18.5587 16 17.7956 16 17V6C16 5.73478 15.8946 5.48043 15.7071 5.29289C15.5196 5.10536 15.2652 5 15 5ZM6 4C6 3.46957 6.21071 2.96086 6.58579 2.58579C6.96086 2.21071 7.46957 2 8 2C8.53043 2 9.03914 2.21071 9.41421 2.58579C9.78929 2.96086 10 3.46957 10 4V5H6V4ZM14 17C14 17.2652 13.8946 17.5196 13.7071 17.7071C13.5196 17.8946 13.2652 18 13 18H3C2.73478 18 2.48043 17.8946 2.29289 17.7071C2.10536 17.5196 2 17.2652 2 17V7H4V8C4 8.26522 4.10536 8.51957 4.29289 8.70711C4.48043 8.89464 4.73478 9 5 9C5.26522 9 5.51957 8.89464 5.70711 8.70711C5.89464 8.51957 6 8.26522 6 8V7H10V8C10 8.26522 10.1054 8.51957 10.2929 8.70711C10.4804 8.89464 10.7348 9 11 9C11.2652 9 11.5196 8.89464 11.7071 8.70711C11.8946 8.51957 12 8.26522 12 8V7H14V17Z"
                      fill="#757575"
                    />
                  </svg>
                ) : pageName == "WishList" ? (
                  <svg
                    width="25"
                    height="25"
                    viewBox="0 0 21 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19.16 2C18.1 0.937205 16.6948 0.288538 15.1983 0.171168C13.7019 0.0537975 12.2128 0.475464 11 1.36C9.72766 0.413635 8.14399 -0.0154912 6.56792 0.159035C4.99185 0.333561 3.54044 1.09878 2.50597 2.30058C1.47151 3.50239 0.930823 5.05152 0.992802 6.63601C1.05478 8.2205 1.71482 9.72267 2.84 10.84L9.05 17.06C9.57002 17.5718 10.2704 17.8586 11 17.8586C11.7296 17.8586 12.43 17.5718 12.95 17.06L19.16 10.84C20.3276 9.66526 20.9829 8.07627 20.9829 6.42C20.9829 4.76372 20.3276 3.17473 19.16 2ZM17.75 9.46L11.54 15.67C11.4693 15.7414 11.3852 15.798 11.2925 15.8366C11.1999 15.8753 11.1004 15.8952 11 15.8952C10.8996 15.8952 10.8001 15.8753 10.7075 15.8366C10.6148 15.798 10.5307 15.7414 10.46 15.67L4.25 9.43C3.46576 8.62834 3.02661 7.55146 3.02661 6.43C3.02661 5.30853 3.46576 4.23165 4.25 3.43C5.04916 2.64099 6.12697 2.19857 7.25 2.19857C8.37303 2.19857 9.45085 2.64099 10.25 3.43C10.343 3.52373 10.4536 3.59812 10.5754 3.64889C10.6973 3.69966 10.828 3.7258 10.96 3.7258C11.092 3.7258 11.2227 3.69966 11.3446 3.64889C11.4664 3.59812 11.577 3.52373 11.67 3.43C12.4692 2.64099 13.547 2.19857 14.67 2.19857C15.793 2.19857 16.8708 2.64099 17.67 3.43C18.465 4.22115 18.9186 5.29219 18.9335 6.41368C18.9485 7.53518 18.5236 8.61793 17.75 9.43V9.46Z"
                      fill="#757575"
                    />
                  </svg>
                ) : pageName == "Address" ? (
                  <svg
                    width="25"
                    height="25"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z"
                      stroke="#757575"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
                      stroke="#757575"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                ) : pageName == "Change Pass" ? (
                  <svg
                    width="25"
                    height="25"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18 6.18V1C18 0.734784 17.8946 0.48043 17.7071 0.292893C17.5196 0.105357 17.2652 0 17 0C16.7348 0 16.4804 0.105357 16.2929 0.292893C16.1054 0.48043 16 0.734784 16 1V6.18C15.4208 6.3902 14.9205 6.77363 14.5668 7.27816C14.2132 7.7827 14.0235 8.38388 14.0235 9C14.0235 9.61612 14.2132 10.2173 14.5668 10.7218C14.9205 11.2264 15.4208 11.6098 16 11.82V19C16 19.2652 16.1054 19.5196 16.2929 19.7071C16.4804 19.8946 16.7348 20 17 20C17.2652 20 17.5196 19.8946 17.7071 19.7071C17.8946 19.5196 18 19.2652 18 19V11.82C18.5792 11.6098 19.0795 11.2264 19.4332 10.7218C19.7868 10.2173 19.9765 9.61612 19.9765 9C19.9765 8.38388 19.7868 7.7827 19.4332 7.27816C19.0795 6.77363 18.5792 6.3902 18 6.18ZM17 10C16.8022 10 16.6089 9.94135 16.4444 9.83147C16.28 9.72159 16.1518 9.56541 16.0761 9.38268C16.0004 9.19996 15.9806 8.99889 16.0192 8.80491C16.0578 8.61093 16.153 8.43275 16.2929 8.29289C16.4327 8.15304 16.6109 8.0578 16.8049 8.01921C16.9989 7.98063 17.2 8.00043 17.3827 8.07612C17.5654 8.15181 17.7216 8.27998 17.8315 8.44443C17.9414 8.60888 18 8.80222 18 9C18 9.26522 17.8946 9.51957 17.7071 9.70711C17.5196 9.89464 17.2652 10 17 10ZM11 12.18V1C11 0.734784 10.8946 0.48043 10.7071 0.292893C10.5196 0.105357 10.2652 0 10 0C9.73478 0 9.48043 0.105357 9.29289 0.292893C9.10536 0.48043 9 0.734784 9 1V12.18C8.42085 12.3902 7.92046 12.7736 7.56684 13.2782C7.21322 13.7827 7.02352 14.3839 7.02352 15C7.02352 15.6161 7.21322 16.2173 7.56684 16.7218C7.92046 17.2264 8.42085 17.6098 9 17.82V19C9 19.2652 9.10536 19.5196 9.29289 19.7071C9.48043 19.8946 9.73478 20 10 20C10.2652 20 10.5196 19.8946 10.7071 19.7071C10.8946 19.5196 11 19.2652 11 19V17.82C11.5792 17.6098 12.0795 17.2264 12.4332 16.7218C12.7868 16.2173 12.9765 15.6161 12.9765 15C12.9765 14.3839 12.7868 13.7827 12.4332 13.2782C12.0795 12.7736 11.5792 12.3902 11 12.18ZM10 16C9.80222 16 9.60888 15.9414 9.44443 15.8315C9.27998 15.7216 9.15181 15.5654 9.07612 15.3827C9.00043 15.2 8.98063 14.9989 9.01921 14.8049C9.0578 14.6109 9.15304 14.4327 9.29289 14.2929C9.43274 14.153 9.61093 14.0578 9.80491 14.0192C9.99889 13.9806 10.2 14.0004 10.3827 14.0761C10.5654 14.1518 10.7216 14.28 10.8315 14.4444C10.9413 14.6089 11 14.8022 11 15C11 15.2652 10.8946 15.5196 10.7071 15.7071C10.5196 15.8946 10.2652 16 10 16ZM4 4.18V1C4 0.734784 3.89464 0.48043 3.7071 0.292893C3.51957 0.105357 3.26521 0 3 0C2.73478 0 2.48043 0.105357 2.29289 0.292893C2.10536 0.48043 2 0.734784 2 1V4.18C1.42085 4.3902 0.920458 4.77363 0.56684 5.27817C0.213221 5.7827 0.0235214 6.38388 0.0235214 7C0.0235214 7.61612 0.213221 8.2173 0.56684 8.72184C0.920458 9.22637 1.42085 9.6098 2 9.82V19C2 19.2652 2.10536 19.5196 2.29289 19.7071C2.48043 19.8946 2.73478 20 3 20C3.26521 20 3.51957 19.8946 3.7071 19.7071C3.89464 19.5196 4 19.2652 4 19V9.82C4.57915 9.6098 5.07954 9.22637 5.43316 8.72184C5.78678 8.2173 5.97647 7.61612 5.97647 7C5.97647 6.38388 5.78678 5.7827 5.43316 5.27817C5.07954 4.77363 4.57915 4.3902 4 4.18ZM3 8C2.80222 8 2.60888 7.94135 2.44443 7.83147C2.27998 7.72159 2.15181 7.56541 2.07612 7.38268C2.00043 7.19996 1.98063 6.99889 2.01921 6.80491C2.0578 6.61093 2.15304 6.43275 2.29289 6.29289C2.43274 6.15304 2.61093 6.0578 2.80491 6.01921C2.99889 5.98063 3.19996 6.00043 3.38268 6.07612C3.56541 6.15181 3.72159 6.27998 3.83147 6.44443C3.94135 6.60888 4 6.80222 4 7C4 7.26522 3.89464 7.51957 3.7071 7.70711C3.51957 7.89464 3.26521 8 3 8Z"
                      fill="#757575"
                    />
                  </svg>
                ) : (
                  ""
                )}
              </Grid>

              <div className={className}>{children}</div>
            </Grid>
          </Grid>
        )}
      </Hidden>
      <Footer />
                                                        
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

export default ProfileLayout;
