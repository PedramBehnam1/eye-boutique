import React, { useEffect, useState } from "react";
import AdminLayout from "../../../layout/adminLayout";
import {
  Menu,
  Grid,
  MenuItem,
  Divider,
  Paper,
  Typography,
  Button,
  Dialog,
  IconButton,
  InputLabel,
  FormControl,
  Select,
  InputBase,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardMedia,
  List,
  ListItem,
  Snackbar
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axiosConfig from "../../../axiosConfig";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useHistory } from "react-router-dom";
import "../../../asset/css/homePage/hoverCard.css";
import moment from "moment";
import PrintIcon from "@mui/icons-material/Print";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MenuIcon from "@mui/icons-material/Menu";
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';

const Users = () => {
  const [users, setusers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const history = useHistory();
  const [pageName, setPageName] = useState("main");
  const [orderList, setOrderList] = useState([]);
  const [totalPrice, setTotalPrice] = useState("");
  const [haveOrder, setHaveOrder] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedRow, setSelectedRow] = useState({});
  const [selectedOrder, setSelectedOrder] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState({});
  const [openChangeStatus, setOpenChangeStatus] = useState(false);
  const [nameSort, setNameSort] = useState("1");
  const [joinedDateSort, setJoinedDateSort] = useState("");
  
  const [newStatus, setNewStatus] = useState();
  const [statusFilter, setStatusFilter] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [roles, setRoles] = useState([]);
  const [genders, setGenders] = useState([]);
  const [user, setUser] = useState("11");
  const [role, setRole] = useState("");
  const [openMassage, setOpenMassage] = useState(false);
  const [showMassage, setShowMassage] = useState('');

  useEffect(() => {
    getUserInfo();
  }, []);

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
            let _role = "";
            res.data.roles_list.map((role) => {
              if (role.id == user.role) {
                setRole(role.title);
                _role = role.title;
              }
            });
            if (_role != "admin" && _role != "super admin") {
              history.push("/");
            }
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

  useEffect(() => {
    refreshList();
    getRoles();
    getGenders();
  }, [searchValue, nameSort, joinedDateSort, statusFilter, orderList]);
  
  const refreshList = () => {
    let orderLength = [];
    axiosConfig
      .get(
        `/admin/users?alphabeticalSort=${nameSort}&joinedDateSort=${joinedDateSort}`
      )
      .then((res) => {
        let users = res.data.users.filter((u) =>
          u.cell.startsWith(searchValue)
        );
        users = users.filter((u) => u.first_name && u.status == 2);
        users = users.slice((currentPage - 1) * 20, currentPage * 20);
        setusers(users);
        res.data.users
          .filter((u) => u.cell.startsWith(searchValue))
          .map((user, index) => {
            axiosConfig
              .get("/users/order/all", {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              })
              .then((res) => {
                orderLength[user.id] = res.data.orders.filter(
                  (o) => o.user_id === user.id
                ).length;

                setHaveOrder(orderLength);
              })
              .catch((err) =>{
                if(err.response.data.error.status === 401){
                  axiosConfig
                    .post("/users/refresh_token", {
                      refresh_token: localStorage.getItem("refreshToken"),
                    })
                    .then((res) => {
                      localStorage.setItem("token", res.data.accessToken);
                      localStorage.setItem(
                        "refreshToken",
                        res.data.refreshToken
                      );
                      refreshList();
                    })
                }else{
                  setShowMassage('Get orders have a problem!')
                  setOpenMassage(true) 
                }
              });
          });
      });
  };

  const getRoles = () => {
    axiosConfig.get(`users/get_roles`).then((res) => {
      setRoles(res.data.roles_list);
    });
  };

  const getGenders = () => {
    axiosConfig.get(`users/get_genders`).then((res) => {
      setGenders(res.data.gender_list);
    });
  };


  const bread = [
    {
      title: "Users",
      href: "/admin/users",
    },
  ];

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenMassage(false);
  };
  const userSubMenu = () => {
    return (
      <Grid item xs={12} sx={{ width: "100%" }} p={0} mt={22.5}>
        {typeof selectedUser !== "string" ? (
          <Paper
            xs={12}
            sx={{
              boxShadow: "none",
              border: "1px solid #DCDCDC",
              borderRadius: "10px",
              paddingLeft: "22px",
              pr: "22px",
            }}
          >
            <Grid
              container
              xs={12}
              md={12}
              sx={{
                height: 55,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Grid item xs={8}>
                <Typography variant="menutitle" color="Black.main">
                  Informations
                </Typography>
              </Grid>
              <Grid
                item
                xs={2}
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <LocationOnIcon
                  sx={{ cursor: "pointer", mr: "14px" }}
                  color="G2"
                />
                <MenuIcon
                  sx={{ cursor: "pointer" }}
                  color="G2"
                  onClick={() => {
                    if (selectedUser) {
                      getUserOrders();
                      setPageName("info");
                    } else {
                      setShowMassage("select a user first!")
                      setOpenMassage(true)
                    }
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        ) : (
          ""
        )}
        {typeof selectedUser !== "string" ? (
          <Paper
            xs={12}
            sx={{
              border: "1px solid #DCDCDC",
              paddingLeft: "21px",
              paddingRight: "21px",
              paddingTop: "17px",
              paddingBottom: "17px",
              borderRadius: "10px",
            }}
          >
            <Grid
              container
              xs={12}
              sx={{
                minHeight: "280px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start",
                flexWrap: "wrap",
              }}
            >
              <Grid item xs={6} sx={{ display: "flex" }}>
                <Typography variant="h2" color="G2.main">
                  First Name:
                </Typography>
                <Typography variant="h2" color="G2.main">
                  {selectedUser.first_name}
                </Typography>
              </Grid>
              <Grid item xs={6} sx={{ display: "flex" }}>
                <Typography variant="h2" color="G2.main">
                  Last Name:
                </Typography>
                <Typography variant="h2" color="G2.main">
                  {selectedUser.last_name}
                </Typography>
              </Grid>
              <Grid item xs={6} sx={{ display: "flex" }}>
                <Typography variant="h2" color="G2.main">
                  Birthday:
                </Typography>
                <Typography variant="h2" color="G2.main">
                  {selectedUser.birthday.substring(0, 10)}
                </Typography>
              </Grid>
              <Grid item xs={6} sx={{ display: "flex" }}>
                <Typography variant="h2" color="G2.main">
                  Gender:
                </Typography>
                <Typography variant="h2" color="G2.main">
                  {genders[selectedUser.gender].title}
                </Typography>
              </Grid>
              <Grid item xs={6} sx={{ display: "flex" }}>
                <Typography variant="h2" color="G2.main">
                  Role:
                </Typography>
                <Typography variant="h2" color="G2.main">
                  {roles[selectedUser.role].title}
                </Typography>
              </Grid>
              <Grid item xs={6} sx={{ display: "flex" }}>
                <Typography variant="h2" color="G2.main">
                  Joined Date:
                </Typography>
                <Typography variant="h2" color="G2.main">
                  {selectedUser.createdAt.split("T")}
                </Typography>
              </Grid>
              <Grid item xs={12} sx={{ display: "flex" }}>
                <Typography variant="h2" color="G2.main">
                  Phone Number:
                </Typography>
                <Typography variant="h2" color="G2.main">
                  {selectedUser.cell}
                </Typography>
              </Grid>
              <Grid item xs={12} sx={{ display: "flex", flexWrap: "wrap" }}>
                <Typography variant="h2" color="G2.main">
                  Email:
                </Typography>
                <Typography variant="h2" color="G2.main">
                  {selectedUser.email.substring(0, 13) +
                    " " +
                    selectedUser.email.substring(13, selectedUser.email.lenght)}
                </Typography>
              </Grid>
              <Grid item xs={6} sx={{ display: "flex" }}>
                <Typography variant="h2" color="G2.main">
                  Last 10 items viewed
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        ) : (
          ""
        )}
      </Grid>
    );
  };

  const clickInfo = (user, statusId) => {
    axiosConfig
      .get("/users/order/all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setOrderList(
          res.data.orders
            .filter((o) => o.user_id === user.id)
            .filter((s) => s.status === statusId)
        );
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
                clickInfo(selectedUser, statusId);
              })
          }else{
            setShowMassage('Get orders have a problem!')
            setOpenMassage(true) 
          }
      });


    setSelectedUser(user);
  };

  const getUserOrders = () => {
    axiosConfig
      .get(`/users/user/${selectedUser.id}/card`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setTotalPrice(res.data.totalPrice);
        setOrderList(res.data.shoppingCard);
      });
  };
  

  const orderDetails = (id) => {
    axiosConfig
      .get(`/users/order/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setSelectedOrder(res.data.products);
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
                orderDetails();
              })
        }else{
          setShowMassage('Get order has a problem!')
          setOpenMassage(true) 
        }
      });
  };

  const getAddress = (id, addressId) => {
    axiosConfig.get(`/admin/users/address/${id}`).then((res) => {
      setSelectedAddress(res.data.address.filter((a) => a.id === addressId)[0]);
    });
  };

  const handleClickPrint = () => {
    var restorePage = document.body.innerHTML;
    var printContent = document.getElementById("print").innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = restorePage;
  };

  const changeStatus = (e) => {
    axiosConfig
      .put(`/admin/order/change_status/${selectedRow.id}`, {
        status: e.target.value,
      })
      .then((res) => {
        setNewStatus(e.target.value);
        setOpenChangeStatus(true);
      })
      .catch((err) => {
        setShowMassage('Change status order has a problem!')
        setOpenMassage(true) 
      });
  };


  const usersList = () => {
    return (
      <Grid
        container
        xs={12}
        display="flex"
        sx={{
          paddingLeft: { xs: 0, sm: 1 },
          paddingRight: { xs: 0, sm: 1 },
        }}
      >
        <Grid
          sx={{
            position: "sticky",
            top: 80,
            width: "100%",
            zIndex: 100,
          }}
        >
          <Paper
            style={{
              borderRadius: "10px",
              boxShadow: "none",
              border: "1px solid #DCDCDC",
            }}
          >
            <Grid
              xs={12}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              height="55px"
              pl={2}
            >
              <Typography variant="menutitle" color="Black.main">
                Users List
              </Typography>
              <Grid>
                <IconButton
                  aria-label="search"
                  aria-haspopup="true"
                  sx={{ margin: "0 15px 0 10px" }}
                >
                  <FilterListIcon color="G1" />
                </IconButton>

                <Menu
                  id="demo-positioned-date-menu"
                  aria-labelledby="demo-positioned-date-menu"
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  <Accordion elevation={0} sx={{ m: 0, mb: 0 }}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                      sx={{
                        m: 0,
                        mt: 0,
                        mb: 0,
                        pt: 0,
                        pb: 0,
                        minHeight: "50px",
                        maxHeight: "50px",
                      }}
                    >
                      <Grid container display={"flex"}>
                        <Typography>Sort</Typography>
                      </Grid>
                    </AccordionSummary>
                    <AccordionDetails sx={{ m: 0, mb: 0, pt: 0, pb: 0 }}>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion elevation={0}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Grid container display={"flex"}>
                        <Typography>Category</Typography>
                      </Grid>
                    </AccordionSummary>
                  </Accordion>
                </Menu>
              </Grid>
            </Grid>
          </Paper>
          <Paper
            item
            sm={12}
            md={12}
            style={{
              borderRadius: "10px",

              marginTop: "2px",
              boxShadow: "none",
              border: "1px solid #DCDCDC",
              alignContent: "center",
              alignItems: "center",
              minHeight: "48px",
              paddingRight: "30px",
              display: "flex",
              justifyContent: "end",
            }}
            display="flex"
            alignItems="center"
          >
            <Grid
              xs={5}
              display="flex"
              alignItems="center"
              justifyContent="end"
            >
              <Paper
                component="form"
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
                <IconButton sx={{ p: "10px" }} aria-label="search">
                  <SearchIcon color="G1.main" />
                </IconButton>
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="Search"
                  inputProps={{ "aria-label": "Search in List" }}
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
                    defaultValue={"name"}
                    label
                    sx={{
                      backgroundColor: "GrayLight2.main",
                      borderLeft: "1px dashed #9E9E9E",
                      overflow: "hidden",
                      height: "20px",
                      top: 0,
                      left: 1.6,
                      borderRadius: "0 0  10px 0",
                      width: "100px",
                      ".MuiSvgIcon-root": { color: "G2.main", padding: "3px" },
                    }}
                  >
                    <MenuItem value={"sku"}>
                      <Typography p={1.5} color="G2.main" variant="h15">
                        Item Code
                      </Typography>
                    </MenuItem>
                    <MenuItem value={"name"}>
                      <Typography p={1} color="G2.main" variant="h15">
                        Name
                      </Typography>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Paper>
            </Grid>
          </Paper>
          <Paper
            style={{
              borderRadius: "10px",
              marginTop: "15px",
              boxShadow: "none",
              border: "1px solid #DCDCDC",
            }}
            sx={{ backgroundColor: "P1.main", mb: "1px" }}
            elevation={0}
          >
            <Grid
              xs={12}
              p={2}
              display="flex"
              sx={{
                borderRadius: "10px",
                alignItems: "center",

                color: "G2.main",
              }}
            >
              <Grid xs={1}>
                <Typography variant="h1" color="Black.main">
                  Row
                </Typography>
              </Grid>
              <Grid
                xs={4}
                display="flex"
                alignItems="end"
              >
                
                <Typography variant="h1" color="Black.main">
                  Name
                </Typography>
              </Grid>
              <Grid xs={2}>
                <Typography variant="h1" color="Black.main">
                  Role
                </Typography>
              </Grid>
              <Grid xs={2}>
                <Typography variant="h1" color="Black.main">
                  Country
                </Typography>
              </Grid>
              <Grid
                xs={2}
                display="flex"
                alignItems="end"
                onClick={() =>
                  joinedDateSort === "-1" || joinedDateSort === ""
                    ? (setJoinedDateSort("1"), setNameSort(""))
                    : setJoinedDateSort("-1")
                }
              >
                <Typography variant="h1" color="Black.main">
                  Last Access
                </Typography>
                {joinedDateSort !== "" ? (
                  joinedDateSort === "-1" ? (
                    <ArrowDropUpIcon />
                  ) : (
                    <ArrowDropDownIcon />
                  )
                ) : (
                  ""
                )}
              </Grid>
              <Grid xs={2}></Grid>
            </Grid>
          </Paper>

          <Grid item xs={12} md={12}>
            <List sx={{ padding: 0 }}>
              {users.map((user, index) => {
                return (
                  <Paper elevation={0} sx={{ mb: "-1px" }}>
                    {user.first_name && user.status == 2 && (
                      <ListItem
                        xs={12}
                        onClick={() => {
                          userSubMenu(user);
                          clickInfo(user, 0);
                          setSelectedUser(user);
                        }}
                        sx={{
                          boxShadow: "none",
                          border: "1px solid #DCDCDC",
                          backgroundColor: "white",
                          cursor: "pointer",
                          height: "48px",
                          borderRadius: "10px",
                        }}
                      >
                        <Grid xs={1} sx={{ display: "flex" }} pl="14px">
                          <Typography variant="h2" color="G2.main">
                            {index + 1}
                          </Typography>
                        </Grid>
                        <Grid xs={4} sx={{ sbackgroundColor: "red" }}>
                          <Typography color="G2.main">
                            {user.first_name.charAt(0).toUpperCase() +
                              user.first_name.slice(1) +
                              " " +
                              user.last_name.charAt(0).toUpperCase() +
                              user.last_name.slice(1)}
                          </Typography>
                        </Grid>

                        <Grid xs={2}>
                          <Typography variant="h2" color="G2.main">
                            {roles[user.role] != undefined
                              ? roles[user.role].title
                              : ""}
                          </Typography>
                        </Grid>
                        <Grid xs={2}>
                          <Typography variant="h2" color="G2.main">
                            {user.country ? user.country : "No country"}
                          </Typography>
                        </Grid>
                        <Grid xs={2}>
                          <Typography variant="h2" color="G2.main">
                            {user.createdAt}
                          </Typography>
                        </Grid>
                        
                        <Grid
                          xs={2}
                          sx={{ display: "flex", justifyContent: "end" }}
                        >
                          <NavigateNextIcon color="G2" />
                        </Grid>
                      </ListItem>
                    )}
                  </Paper>
                );
              })}
            </List>
          </Grid>

        </Grid>
        <Grid item xs={4}>
          {userSubMenu()}
        </Grid>
      </Grid>
    );
  };

  const _handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenMassage(false);
  };

  return (
    <AdminLayout
      breadcrumb={pageName !== "main" ? bread : ""}
      pageName={
        pageName === "main"
          ? "Users"
          : selectedUser.first_name.charAt(0).toUpperCase() +
            selectedUser.first_name.slice(1) +
            " " +
            selectedUser.last_name.charAt(0).toUpperCase() +
            selectedUser.last_name.slice(1)
      }
    >
      <Grid container xs={12}>
        {pageName === "main" ? (
          usersList()
        ) : (
          <Grid item xs={12}>
            <Paper
              style={{
                borderRadius: "5px",
                boxShadow: "none",
                border: "1px solid #DCDCDC",
              }}
            >
              <Grid
                xs={12}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                height="55px"
                pl={2}
                pr={2}
              >
                <Typography variant="menutitle" color="Black.main">
                  {selectedUser.first_name.charAt(0).toUpperCase() +
                    selectedUser.first_name.slice(1) +
                    " " +
                    selectedUser.last_name.charAt(0).toUpperCase() +
                    selectedUser.last_name.slice(1)}{" "}
                  Orders
                </Typography>
                <Grid>
                  <Button
                    onClick={() => {
                      history.push({ pathname: "/admin/orderlist/add" });
                    }}
                    variant="contained"
                    color="P"
                    sx={{
                      color: "white",
                      width: 120,
                      padding: 0.5,
                      textTransform: "capitalize",
                    }}
                    startIcon={<AddIcon sx={{ marginRight: -0.5 }} />}
                  >
                    Add Order
                  </Button>
                </Grid>
              </Grid>
            </Paper>
            
            <Paper
              style={{
                marginTop: "2px",
                borderRadius: "5px",
                boxShadow: "none",
                border: "1px solid #DCDCDC",
              }}
            >
              <Grid
                container
                xs={12}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  height: "48px",
                }}
              >
                <Grid
                  item
                  xs={8}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "start",
                    paddingLeft: "15px",
                  }}
                >
                  <Typography mr={"36px"}>All Status</Typography>
                  <Typography mr={"36px"}>Order Canceled</Typography>
                  <Typography mr={"36px"}>Order Placed</Typography>
                  <Typography mr={"36px"}>Out For Delivery</Typography>
                  <Typography mr={"36px"}>Delivered</Typography>
                </Grid>
                <Grid
                  item
                  xs={4}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "end",
                  }}
                >
                  <Paper
                    component="form"
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
                    <IconButton sx={{ p: "10px" }} aria-label="search">
                      <SearchIcon color="G1.main" />
                    </IconButton>
                    <InputBase
                      sx={{ ml: 1, flex: 1 }}
                      placeholder="Search"
                      inputProps={{ "aria-label": "Search in List" }}
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
                        defaultValue={"name"}
                        label
                        sx={{
                          backgroundColor: "GrayLight2.main",
                          borderLeft: "1px dashed #9E9E9E",
                          overflow: "hidden",
                          height: "20px",
                          top: 0,
                          left: 1.6,
                          borderRadius: "0 0  10px 0",
                          width: "100px",
                          ".MuiSvgIcon-root": {
                            color: "G2.main",
                            padding: "3px",
                          },
                        }}
                      >
                        <MenuItem value={"sku"}>
                          <Typography p={1.5} color="G2.main" variant="h15">
                            Item Code
                          </Typography>
                        </MenuItem>
                        <MenuItem value={"name"}>
                          <Typography p={1} color="G2.main" variant="h15">
                            Name
                          </Typography>
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Paper>
                  <Grid item xs={1}>
                    <IconButton
                      aria-label="search"
                      aria-haspopup="true"
                    >
                      <FilterListIcon color="G1" />
                    </IconButton>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
            <Grid
              xs={12}
              p={2}
              display="flex"
              sx={{
                backgroundColor: "P1.main",
                color: "Black.main",
                marginTop: "10px",
                borderRadius: "5px",
                boxShadow: "none",
                border: "1px solid #DCDCDC",
              }}
            >
              <Grid xs={1}>
                <Typography variant="h1">Row</Typography>
              </Grid>
              <Grid xs={2} display="flex" alignItems="end">
                <Typography variant="h1">User</Typography>
              </Grid>
              <Grid xs={3}>
                <Typography variant="h1">Invoice Num.</Typography>
              </Grid>
              <Grid xs={2}>
                <Typography variant="h1">Date</Typography>
              </Grid>
              <Grid xs={2}>
                <Typography variant="h1">Order Status</Typography>
              </Grid>
              <Grid xs={2}>
                <Typography variant="h1">Price</Typography>
              </Grid>
            </Grid>

            {pageName != "details" ? (
              orderList.length != 0 ? (
                orderList.map((order, index) => {
                  return (
                    <>
                      <ListItem
                        onClick={() => {
                          setSelectedRow(order);
                          orderDetails(order.id);
                          setPageName("details");
                          getAddress(order.user_id, order.user_address_id);
                        }}
                        sx={{
                          boxShadow: "none",
                          border: "1px solid #DCDCDC",
                          backgroundColor: "white",
                          cursor: "pointer",
                          height: "48px",
                          borderRadius: "5px",
                        }}
                      >
                        <Grid
                          xs={0.95}
                          p={2}
                          pl={0.5}
                          item
                          className="counterList"
                        >
                          <Typography variant="menuitem" p={1} color="G2.main">
                            {index + 1}
                          </Typography>
                        </Grid>
                        <Grid item xs={2.06}>
                          <Typography variant="menuitem" p={1} color="G2.main">
                            {selectedUser.first_name.charAt(0).toUpperCase() +
                              selectedUser.first_name.slice(1) +
                              " " +
                              selectedUser.last_name.charAt(0).toUpperCase() +
                              selectedUser.last_name.slice(1)}
                          </Typography>
                        </Grid>
                        <Grid item xs={2.99} display="flex">
                          <Typography variant="menuitem" color="G2.main">
                            ord-
                          </Typography>
                          <Typography variant="menuitem" color="G2.main">
                            200
                          </Typography>
                        </Grid>
                        <Grid item xs={1.92}>
                          <Typography variant="menuitem" color="G2.main">
                            {moment(order.createdAt).format("YYYY/MM/DD")}
                          </Typography>
                        </Grid>
                        <Grid item xs={2.085}>
                          {order.status === 2 ? (
                            <Typography
                              variant="menuitem"
                              sx={{
                                backgroundColor: "LightGreen1.main",
                              }}
                              p={1}
                              borderRadius={1}
                              color="LightGreen.main"
                            >
                              Delivered
                            </Typography>
                          ) : order.status === -1 ? (
                            <Typography
                              variant="menuitem"
                              sx={{ backgroundColor: "P2.main" }}
                              p={1}
                              borderRadius={1}
                              color="Red.main"
                            >
                              Canceled
                            </Typography>
                          ) : order.status === 0 ? (
                            <Typography
                              variant="menuitem"
                              sx={{
                                backgroundColor: "paleGreen.main",
                              }}
                              p={1}
                              borderRadius={1}
                              color="Orange.main"
                            >
                              Order Placed
                            </Typography>
                          ) : order.status === 1 ? (
                            <Typography
                              variant="menuitem"
                              sx={{
                                backgroundColor: "paleGreen1.main",
                              }}
                              p={1}
                              borderRadius={1}
                              color="Yellow.main"
                            >
                              Out For Delivery
                            </Typography>
                          ) : (
                            ""
                          )}
                        </Grid>
                        <Grid item xs={1.53}>
                          <Typography variant="menuitem" color="G2.main">
                            {totalPrice} KWD
                          </Typography>
                        </Grid>

                        <Grid item xs={0.5} className="moreIcone">
                          <NavigateNextIcon color="G2" />
                        </Grid>
                      </ListItem>
                      {orderList.length - 1 === index ? (
                        ""
                      ) : (
                        <Divider color="red" />
                      )}
                    </>
                  );
                })
              ) : (
                <Grid display="flex" justifyContent="center" padding="10% 0">
                  <Typography>This User Has No Orders Yet!</Typography>
                </Grid>
              )
            ) : (
              <Paper sx={{ width: "100%", minHeight: "300px" }}>
                <Grid
                  xs={12}
                  borderBottom={1}
                  borderColor="G3.main"
                  display="flex"
                >
                  <Grid xs={9.5} p={3} textAlign="start">
                    <Typography variant="h3">Edit Order</Typography>
                  </Grid>
                  <Grid item xs={0.5} pt={3}>
                    <PrintIcon onClick={handleClickPrint} />
                  </Grid>
                  <Grid item xs={1.5} pt={2} pl={1}>
                    <FormControl>
                      <InputLabel id="demo-simple-select-label" color="P">
                        Status
                      </InputLabel>
                      {selectedRow.id && (
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          color="P"
                          onChange={changeStatus}
                          IconComponent={KeyboardArrowDownIcon}
                          defaultValue={parseInt(selectedRow.status)}
                          label="Status"
                          sx={{ minWidth: "150px", height: "40px" }}
                        >
                          <MenuItem value={-1}>Canceled</MenuItem>
                          <MenuItem value={0}>Order Placed</MenuItem>
                          <MenuItem value={1}>Out For Delivery</MenuItem>
                          <MenuItem value={2}>Delivered</MenuItem>
                        </Select>
                      )}
                    </FormControl>
                  </Grid>
                </Grid>
                <div id="print">
                  <Grid container p={2} xs={12} md={12}>
                    <Grid xs={9} item>
                      <Typography p={1} color="black">
                        {selectedUser.first_name.charAt(0).toUpperCase() +
                          selectedUser.first_name.slice(1) +
                          " " +
                          selectedUser.last_name.charAt(0).toUpperCase() +
                          selectedUser.last_name.slice(1)}
                      </Typography>
                    </Grid>
                    <Grid item xs={1} mr={1}>
                      <Typography p={1} color="black">
                        {moment(selectedRow.createdAt).format("YYYY/MM/DD")}
                      </Typography>
                    </Grid>
                    <Divider orientation="vertical" flexItem />
                    <Grid item xs={1} pl={1}>
                      <Typography p={1} color="black">
                        {selectedRow.code.split("ord-")}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Divider />
                  {selectedAddress.address && (
                    <>
                      <Grid container p={2} xs={12} md={12}>
                        <Grid xs={12} item>
                          <Typography p={1} variant="h2">
                            {`${selectedAddress.city}, ${selectedAddress.country}`}
                          </Typography>
                        </Grid>
                        <Grid xs={12} item>
                          <Typography p={1} variant="h2">
                            {selectedAddress.address.charAt(0).toUpperCase() +
                              selectedAddress.address.slice(1)}
                          </Typography>
                        </Grid>
                        <Grid xs={12} item>
                          <Typography p={1} variant="h2">
                            {selectedAddress.apartment.charAt(0).toUpperCase() +
                              selectedAddress.apartment.slice(1)}
                          </Typography>
                        </Grid>
                        <Grid xs={12} item>
                          <Grid container>
                            <Typography p={1} variant="h2">
                              {selectedAddress.zip_code
                                .charAt(0)
                                .toUpperCase() +
                                selectedAddress.zip_code.slice(1)}
                            </Typography>
                            <Typography p={1} variant="h2">
                              {selectedAddress.full_name
                                .charAt(0)
                                .toUpperCase() +
                                selectedAddress.full_name.slice(1)}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Divider />
                      <Grid container p={2} xs={12} md={12}>
                        <Grid container xs={5.5} md={5.5}>
                          <Grid container>
                            <Grid container justifyContent={"space-between"}>
                              <Typography p={1} color="G1.main" variant="h18">
                                Items ({selectedOrder.length}):
                              </Typography>
                              <Typography p={1} color="G1.main" variant="h18">
                                KWD {selectedRow.total_price}
                              </Typography>
                            </Grid>
                            <Grid container justifyContent={"space-between"}>
                              <Typography p={1} color="G1.main" variant="h18">
                                Shiping:
                              </Typography>
                              <Typography p={1} color="G1.main" variant="h18">
                                KWD 0
                              </Typography>
                            </Grid>
                            <Grid container justifyContent={"space-between"}>
                              <Typography p={1} color="G1.main" variant="h18">
                                Tax Collected:
                              </Typography>
                              <Typography p={1} color="G1.main" variant="h18">
                                KWD 0
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Divider orientation="vertical" flexItem />

                        <Grid container xs={6} md={6}>
                          <Grid container>
                            <Grid container justifyContent={"space-between"}>
                              <Typography p={1} color="G1.main" variant="h18">
                                Code title:
                              </Typography>
                            </Grid>
                            <Grid container justifyContent={"space-between"}>
                              <Typography p={1} color="G1.main" variant="h18">
                                Discount:
                              </Typography>
                              <Typography p={1} color="G1.main" variant="h18">
                                KWD 0
                              </Typography>
                            </Grid>
                            <Grid container justifyContent={"space-between"}>
                              <Typography p={1} variant="h7">
                                Order Total:
                              </Typography>
                              <Typography p={1} variant="h7">
                                KWD {selectedRow.total_price}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Divider />
                    </>
                  )}

                  <Grid>
                    {selectedOrder.map((product) => {
                      return (
                        <Grid xs={12} p={1} display="flex">
                          <Grid xs={1}>
                            <Card
                              sx={{
                                maxWidth: 82,
                                border: "none",
                                boxShadow: "none",
                              }}
                            >
                              <CardMedia
                                component="img"
                                height="82"
                                width="82"
                                image={
                                  axiosConfig.defaults.baseURL +
                                  product.product_group.file.image_url
                                }
                                className="image"
                              />
                            </Card>
                          </Grid>
                          <Grid xs={9} mt={2}>
                            <Grid>
                              <Typography ml={2} color="black" variant="h11">
                                {product.product_group.name !== undefined &&
                                product.product_group.products.length != 0
                                  ? product.product_group.products[0].sku !==
                                    null
                                    ? product.product_group.name.concat(
                                        " - ",
                                        product.product_group.products[0].sku
                                      )
                                    : product.product_group.name
                                  : product.product_group.name != undefined
                                  ? product.product_group.name
                                  : product.product_group.products.length !== 0
                                  ? product.product_group.products[0].sku !==
                                    null
                                    ? product.product_group.products[0].sku
                                    : ""
                                  : ""}
                              </Typography>
                            </Grid>
                            <Grid ml={2} mt={1} display="flex">
                              <Typography
                                variant="h10"
                                pl={1}
                                pr={1}
                                sx={{ color: "G1.main" }}
                              >
                                {product.product_group.products
                                  .filter((p) => p.id === product.product_id)[0]
                                  ["attributes"].filter((a) =>
                                    a.name.includes("color")
                                  ) != ""
                                  ? product.product_group.products
                                      .filter(
                                        (p) => p.id === product.product_id
                                      )[0]
                                      ["attributes"].filter((a) =>
                                        a.name.includes("color")
                                      )[0]["value"]
                                  : ""}
                              </Typography>
                              <Divider orientation="vertical" flexItem />
                              <Typography
                                variant="h10"
                                pl={1}
                                pr={1}
                                sx={{ color: "G1.main" }}
                              >
                                {product.quantity} QTY
                              </Typography>
                            </Grid>
                          </Grid>
                          <Grid item xs={2} display="flex" alignItems="end">
                            <Grid
                              item
                              xs={12}
                              display="flex"
                              justifyContent="flex-end"
                              pr={2}
                            >
                              <Typography>
                                {product.product_group.products.filter(
                                  (p) => p.id === product.product_id
                                )[0]["price"] * product.quantity}{" "}
                                KWD
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      );
                    })}
                    <Divider />
                  </Grid>
                </div>
                <Dialog
                  open={openChangeStatus}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <Grid
                    xs={12}
                    display="flex"
                    justifyContent="center"
                    mt={3}
                    mb={1}
                    ml={3}
                    mr={6}
                  >
                    <Typography>
                      Order status changed to{" "}
                      {newStatus === -1
                        ? '"Cancel"'
                        : newStatus === 0
                        ? '"Order Placed"'
                        : newStatus === 1
                        ? '"Out For Delivery"'
                        : '"delivered"'}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    paddingLeft={1}
                    paddingRight={1}
                    display="flex"
                    justifyContent="end"
                  >
                    <Button
                      variant="outlined"
                      color="G1"
                      onClick={() => window.location.reload()}
                      sx={{ mt: 2, mb: 2, mr: 1, ml: 1 }}
                    >
                      close
                    </Button>
                  </Grid>
                </Dialog>
              </Paper>
            )}
          </Grid>
        )}
                                                                    
        <Snackbar open={openMassage} autoHideDuration={6000} onClose={_handleClose}
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
    </AdminLayout>
  );
};

export default Users;
