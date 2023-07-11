import {
  Box,
  Button,
  Card,
  CardMedia,
  Divider,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Modal,
  Snackbar,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import NavList from "../components/adminPage/navList";
import logo from "../asset/images/logoWhite.png";
import { useHistory } from "react-router-dom";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import axiosConfig from "../axiosConfig";
import Profile from "./profile";
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';

const AdminLayout = ({
  pageName,
  children,
}) => {
  const [windowResizing, setWindowResizing] = useState(false);
  let history = useHistory();
  const [openNotification, setOpenNotification] = useState(false);
  const [anchorElDiscount, setAnchorElDiscount] = useState(null);
  const openAdd = Boolean(anchorElDiscount);
  const [user, setUser] = useState("11");
  const [role, setRole] = useState("");
  const [openMassage, setOpenMassage] = useState(false);
  const [showMassage, setShowMassage] = useState('');

  const NotificationStyle = {
    position: "absolute",
    top: 0,
    right: 0,
    height: "100%",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
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

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    getUserInfo();
  }, []);



  const OpenNotification = () => {
    setOpenNotification(true);
  };

  const CloseNotification = () => {
    setOpenNotification(false);
  };

  const clickAddNewDiscont = (event) => {
    setAnchorElDiscount(event.currentTarget);
  };

  const handleCloseDiscount = (event) => {
    setAnchorElDiscount(null);
  };

  const getUserInfo = () => {
    axiosConfig
      .get("/users/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        
        let user = res.data.user;
        setUser(user);
        axiosConfig
          .get("/users/get_roles", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((res) => {
            res.data.roles_list.map((role) => {
              if (role.id == user.role) {
                setRole(role.title);
              }
            });
          });
          
      })
      .catch((err) =>{
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
    <>
      <Grid
        xs={12}
        backgroundColor="G1.main"
        minHeight="50px"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        p={1}
        ml={1}
        mr={1}
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <Grid
          xs={2}
          display="flex"
          justifyContent="center"
          height="48px"
          pt={1}
        >
          <Card
            style={{
              display: "flex",
              alignItems: "center",
              border: "none",
              boxShadow: "none",
              background: "none",
              cursor: "pointer",
              width: 160,
              height: 30,
            }}
          >
            <CardMedia
              component="img"
              sx={{ width: 150, height: 17 }}
              image={logo}
              alt="logo"
              onClick={() => history.push("/")}
            />
          </Card>
        </Grid>
        <Grid xs={10} display="flex" justifyContent="flex-end" pr="5px">
          <Button
          
            variant="contained"
            color="P"
            sx={{ color: "white", height: 43.7, marginRight: 1 }}
            style={{
              display: pageName == "Discounts" ? "initial" : "none",
              color: "white",
            }}
            onClick={clickAddNewDiscont}
          >
            + Add New discount
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorElDiscount}
            open={openAdd}
            onClose={handleCloseDiscount}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem
              onClick={() =>
                history.push({ pathname: "/admin/discounts/addDiscountCode" })
              }
            >
              Discount Code
            </MenuItem>
            <MenuItem
              onClick={() =>
                history.push({ pathname: "/admin/discounts/addAutoDiscount" })
              }
            >
              Auto Discount
            </MenuItem>
          </Menu>
          <Profile pageName={"admin"} />

          <NotificationsIcon
            style={{
              width: "40px",
              height: "40px",
              padding: "8px",
              paddingRight: "0",
              background: "none",
              boxShadow: "none",
              color: "white",
              borderRadius: "4px",
            }}
            onClick={OpenNotification}
          />
          <Modal
            open={openNotification}
            onClose={CloseNotification}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={NotificationStyle}>
              <Grid display={"flex"} p={2}>
                <Button
                  color="Black"
                  style={{ padding: "0" }}
                  onClick={CloseNotification}
                >
                  <CloseIcon />
                </Button>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Notification
                </Typography>
              </Grid>
              <Divider />
              <Grid container xs={12} p={1}>
                <Grid container xs={12}>
                  <Grid
                    item
                    xs={12}
                    display="flex"
                    justifyContent={"space-between"}
                  >
                    <Typography p={1}>Title</Typography>
                    <Typography variant="p" p={1}>
                      2021/03/04
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    display="flex"
                    justifyContent={"space-between"}
                  >
                    <Typography variant="p" p={1}>
                      Frames are measured by lens width, bridge width, and
                      temple length in millimeters. You can easily find your
                      size by referring.
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    display="flex"
                    justifyContent={"space-between"}
                  >
                    <Button variant="text" color="P">
                      <Typography variant="p" pr={2}>
                        Link to Page
                      </Typography>
                      <ArrowForwardIosIcon fontSize={"inherit"} />
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
              <Divider sx={{ width: "100%" }} />
              <Grid container xs={12} sx={{ backgroundColor: "#FAF4F5" }}>
                <Grid
                  item
                  xs={12}
                  display="flex"
                  justifyContent={"space-between"}
                >
                  <Typography p={1}>Title</Typography>
                  <Typography variant="p" p={1}>
                    2021/03/04
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  display="flex"
                  justifyContent={"space-between"}
                >
                  <Typography variant="p" p={1}>
                    Frames are measured by lens width
                  </Typography>
                </Grid>
              </Grid>
              <Divider sx={{ width: "100%" }} />
              <Grid container xs={12}>
                <Grid
                  item
                  xs={12}
                  display="flex"
                  justifyContent={"space-between"}
                >
                  <Typography p={1}>Title</Typography>
                  <Typography variant="p" p={1}>
                    2021/03/04
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  display="flex"
                  justifyContent={"space-between"}
                >
                  <Typography variant="p" p={1}>
                    Frames are measured by lens width
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Modal>
        </Grid>
      </Grid>
      <Grid
        container
        xs={12}
        sx={{ display: "flex" }}
        minHeight="100vh"
        backgroundColor="GrayLight.main"
        
        pt={0}
      >
        {role == "admin" || role == "super admin" ? (
          <Grid item xs={2} md={2} mt={2}>
            <NavList />
          </Grid>
        ) : (
          ""
        )}
        <Grid item md={10} xs={12} mt={2}>
          {children}
        </Grid>
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
    </>
  );
};

export default AdminLayout;
