import React, { useState, useEffect } from "react";
import axiosConfig from "../../../axiosConfig";

import {
  FormControl,
  Button,
  Card,
  Dialog,
  CardMedia,
  Menu,
  MenuItem,
  Paper,
  Typography,
  Grid,
  InputLabel,
  Select,
  Box,
  Tab,
  InputBase,
  IconButton,
  List,
  ListItem,
  Stack,
  TextField,
  ListItemIcon,
  ListItemText,
  Snackbar
} from "@mui/material";

import AdminLayout from "../../../layout/adminLayout";
import SearchIcon from "@material-ui/icons/Search";
import { useHistory } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Divider from "@mui/material/Divider";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import moment from "moment";
import PrintIcon from "@mui/icons-material/Print";
import AddIcon from "@mui/icons-material/Add";
import { TabContext, TabList } from "@material-ui/lab";
import FilterListIcon from "@mui/icons-material/FilterList";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Check from '@mui/icons-material/Check';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [_orders, set_Orders] = useState([]);
  const [selectedRow, setSelectedRow] = useState({});
  const [pageName, setPageName] = useState("list");
  const [selectedOrder, setSelectedOrder] = useState([]);
  const [name, setName] = useState("");
  const [selectedAddress, setSelectedAddress] = useState({});
  const [searchValue, setSearchValue] = useState("");
  const [openChangeStatus, setOpenChangeStatus] = useState(false);
  const [newStatus, setNewStatus] = useState();
  const [valueTab, setValueTab] = useState("All");
  const [status, setStatus] = useState(1);
  const [openRadio, setOpenRadio] = useState({ status: 1, open: false });
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [selectedProductRow, setSelectedProductRow] = useState([]);
  const [checked, setChecked] = useState([]);
  const [sort, setSort] = useState("date_sort=-1");
  const [expandedProduct, setExpandedProduct] = React.useState(false);
  const [anchorElSortDate, setAnchorElSortDate] = useState(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState(new Date());
  const [categoryFilterTypes, setCategoryFilterTypes] = useState([]);
  const [categoryFilterName, setCategoryFilterName] = useState('all');
  const [anchorElSort, setAnchorElSort] = useState(null);
  const openSort = Boolean(anchorElSort);
  const [sortFilterType, setSortFilterType] = useState('date');
  const [filterType, setfilterType] = useState('name');
  const [user, setUser] = useState("11");
  const [role, setRole] = useState('');
  const [openMassage, setOpenMassage] = useState(false);
  const [showMassage, setShowMassage] = useState('');

  useEffect(() => {
    getUserInfo();
  }, [])
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
          }).then((res) => {
            let role1 = "";
            res.data.roles_list.map(role => {
              if (role.id == user.role) {
                setRole(role.title);
                role1 = role.title;
              }
            })
            if (role1 != "admin" && role1 != "super admin") {
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


  let history = useHistory();

  useEffect(() => {
    refreshList();
  }, [searchValue]);

  const refreshList = () => {
    axiosConfig
      .get("/users/order/all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setFromDate(res.data.orders[0].createdAt)
        let sortedOrders = res.data.orders.sort(
          (a, b) =>
            new Date(...b.createdAt.split("/")) -
            new Date(...a.createdAt.split("/"))
        );
        let filteredVlue;
        if (filterType == "name") {
          filteredVlue = sortedOrders.filter(o => getName(o.user_id).includes(searchValue))
        } else {

          filteredVlue = sortedOrders.filter((o) =>
            o.code.startsWith(`ord-${searchValue}`)
          );
        }

        setOrders(filteredVlue);
        set_Orders(filteredVlue);
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
            refreshList();
          })
        }else{
          setShowMassage('Get all order have a problem!')
          setOpenMassage(true)
        } 
      });
  };

  function getName(id) {
    let fullName = "";
    axiosConfig.get(`/admin/users/${id}`).then((res) => {
      setName(
        (fullName =
          res.data.user.first_name.charAt(0).toUpperCase() +
          res.data.user.first_name.slice(1) +
          " " +
          res.data.user.last_name.charAt(0).toUpperCase() +
          res.data.user.last_name.slice(1))
      );
    });
    fullName = name;
    return fullName;
  }

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
        setShowMassage('Change status of order has a problem!')
        setOpenMassage(true)
      });
  };


  const bread = [
    {
      title: "Order",
      href: "/admin/orderlist",
    },
  ];

  const openSortDate = (event) => {
    setAnchorElSortDate(event.currentTarget);
  };

  const openSortMenu = Boolean(anchorElSortDate);
  
  const handleChangeFromDate = (newValue) => {
    if (new Date(newValue).getTime() > new Date(toDate).getTime()) {
      if (new Date(newValue).getFullYear() != new Date(toDate).getFullYear()
        || new Date(newValue).getMonth() != new Date(toDate).getMonth()
        || new Date(newValue).getDate() != new Date(toDate).getDate()) {
        setShowMassage("Please from Date be smaller than your to Date.")
        setOpenMassage(true)
      } else {
        setFromDate(newValue);
        let sortedOrders = orders.filter(
          (o) =>
            (new Date(o.createdAt).getTime() >=
              new Date(newValue).getTime()) && (new Date(o.createdAt).getFullYear() == new Date(fromDate).getFullYear() &&
                new Date(o.createdAt).getMonth() == new Date(fromDate).getMonth() &&
                new Date(o.createdAt).getDate() == new Date(fromDate).getDate())
        );
        set_Orders(sortedOrders)
        setToDate(newValue);
      }
    } else {
      setFromDate(newValue);
      let sortedOrders = orders.filter(
        (o) =>
          new Date(o.createdAt).getTime() >=
          new Date(newValue).getTime() && ((new Date(o.createdAt).getTime() <=
            new Date(toDate).getTime()) || (new Date(o.createdAt).getFullYear() == new Date(toDate).getFullYear() &&
              new Date(o.createdAt).getMonth() == new Date(toDate).getMonth() &&
              new Date(o.createdAt).getDate() == new Date(toDate).getDate()))
      );
      set_Orders(sortedOrders)
    }

  };
  const handleChangeToDate = (newValue) => {



    if (new Date(fromDate).getTime() > new Date(newValue).getTime()) {
      if (new Date(fromDate).getFullYear() != new Date(newValue).getFullYear()
        || new Date(fromDate).getMonth() != new Date(newValue).getMonth()
        || new Date(fromDate).getDate() != new Date(newValue).getDate()) {
        setShowMassage("Please from Date be smaller than your to Date.")
        setOpenMassage(true)

      } else {
        let sortedOrders = orders.filter(
          (o) =>
            (new Date(o.createdAt).getTime() >=
              new Date(fromDate).getTime()) && (new Date(o.createdAt).getFullYear() == new Date(newValue).getFullYear() &&
                new Date(o.createdAt).getMonth() == new Date(newValue).getMonth() &&
                new Date(o.createdAt).getDate() == new Date(newValue).getDate())
        );
        set_Orders(sortedOrders)
        setToDate(newValue);
      }
    } else {
      let sortedOrders = orders.filter(
        (o) =>
          (new Date(o.createdAt).getTime() >=
            new Date(fromDate).getTime()) && ((new Date(o.createdAt).getTime() <
              new Date(newValue).getTime()) || (new Date(o.createdAt).getFullYear() == new Date(newValue).getFullYear() &&
                new Date(o.createdAt).getMonth() == new Date(newValue).getMonth() &&
                new Date(o.createdAt).getDate() == new Date(newValue).getDate()))
      );
      set_Orders(sortedOrders)
      setToDate(newValue);
    }
  };
  
  const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
      return;
      }

      setOpenMassage(false);
  };
  return (
    <AdminLayout
      breadcrumb={pageName === "list" ? "" : bread}
      pageName={pageName === "list" ? "Order" : "Order Edit"}
    >
      {pageName === "list" ? (
        <Grid xs={12}>
          <Grid
            xs={12}
            sx={{
              position: "sticky",
              top: 80,
              width: "100%",
              zIndex: 100,
              bgcolor: 'GrayLight.main'
            }}
          >
            <Grid xs={12}>
              <Paper
                style={{
                  borderRadius: "5px",
                  boxShadow: "none",
                  border: "1px solid #DCDCDC",

                }}
              >
                <Grid
                  xs={12}
                  sx={{
                    width: "100%",
                    justifyContent: "space-between",
                    display: "flex",
                    alignItems: "center",
                    height: 55,
                    paddingLeft: 3,
                  }}
                >
                  <Grid item xs={5}>
                    <Typography variant="menutitle" color="Black.main">
                      Orders List
                    </Typography>
                  </Grid>
                  <Grid
                    container
                    xs={7}
                    sx={{
                      width: "100%",
                      justifyContent: "end",
                      display: "flex",
                      alignItems: "center",
                      paddingLeft: 3,
                      paddingRight: 0,
                    }}
                  >
                    <Grid item xs={6} display='flex' justifyContent='space-between'>
                      <Grid xs={1}></Grid>
                      <Grid item xs={5}>
                        <LocalizationProvider dateAdapter={AdapterDateFns} >
                          <Stack direction="row" spacing={4}  >
                            <DesktopDatePicker
                              label="From Date"
                              inputFormat="yyyy/MM/dd"
                              value={fromDate}
                              onChange={handleChangeFromDate}

                              renderInput={(params) => <TextField id="outlined-basic" size='small' color='P'{...params} />}
                              color='P'
                            />
                          </Stack>
                        </LocalizationProvider>

                      </Grid>
                      <Grid item xs={5} mr="20px" ml='20px'>
                        <LocalizationProvider dateAdapter={AdapterDateFns} >
                          <Stack direction="row" spacing={4}  >
                            <DesktopDatePicker
                              label="To Date"
                              inputFormat="yyyy/MM/dd"
                              value={toDate}
                              onChange={handleChangeToDate}

                              renderInput={(params) => <TextField id="outlined-basic" size='small' color='P'{...params} />}
                              color='P'
                            />

                          </Stack>
                        </LocalizationProvider>

                      </Grid>
                    </Grid>

                    <Grid >
                      <Button
                        onClick={() => {
                          history.push({ pathname: "/admin/orderlist/add" });
                        }}
                        variant="contained"
                        color="P"
                        sx={{
                          color: "white",
                          width: 120,
                          paddingTop: 0.5,
                          paddingBottom: 0.5,
                          paddingLeft: 0.5,
                          paddingRight: 0.5
                        }}

                        startIcon={<AddIcon />}
                      >
                        Add Order
                      </Button>
                    </Grid>
                    <Grid >
                      <IconButton
                        aria-label="search"
                        aria-controls={
                          openSortMenu ? "demo-positioned-date-menu" : undefined
                        }
                        aria-haspopup="true"
                        aria-expanded={openSortMenu ? "true" : undefined}
                        onClick={(event) => {
                          openSortDate(event);
                        }}
                        sx={{ mr: '11px', ml: '9px' }}
                      >
                        <FilterListIcon color="G1" />
                      </IconButton>
                      <Menu
                        id="demo-positioned-date-menu"
                        aria-labelledby="demo-positioned-date-menu"
                        anchorEl={anchorElSortDate}
                        open={openSortMenu}
                        onClose={() => setAnchorElSortDate(null)}
                        anchorOrigin={{
                          vertical: "top",
                          horizontal: "right",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "right",
                        }}
                      >
                        <MenuItem
                          onClick={() => {
                            setCategoryFilterTypes([]);
                            setCategoryFilterName('all');
                            set_Orders(orders);
                            setValueTab("All")
                          }}
                          sx={{ width: '227px', padding: '5px 5px 5px 13px', color: 'G1.main' }}
                        >
                          {categoryFilterName === 'all' ?
                            <>
                              <ListItemIcon >
                                <Check color='P' sx={{ padding: '3px' }} />
                              </ListItemIcon>
                              <Typography ml={-1}>All</Typography>
                            </>
                            :
                            <ListItemText inset >
                              <Typography ml={-1}>All</Typography>
                            </ListItemText>
                          }
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            setCategoryFilterTypes([]);
                            setCategoryFilterName('Order Canceled');
                            set_Orders(_orders.filter(o => o.status == -1))
                            setValueTab("Order Canceled")
                          }}
                          sx={{ width: '227px', padding: '5px 5px 5px 13px', color: 'G1.main' }}
                        >
                          {categoryFilterName === 'Order Canceled' ?
                            <>
                              <ListItemIcon >
                                <Check color='P' sx={{ padding: '3px' }} />
                              </ListItemIcon>
                              <Typography ml={-1}>Order Canceled</Typography>
                            </>
                            :
                            <ListItemText inset >
                              <Typography ml={-1}>Order Canceled</Typography>
                            </ListItemText>
                          }
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            setCategoryFilterTypes([]);
                            setCategoryFilterName('Order Placed');
                            set_Orders(orders.filter(o => o.status == 0))
                            setValueTab("Order Placed")
                          }}
                          sx={{ width: '227px', padding: '5px 5px 5px 13px', color: 'G1.main' }}
                        >
                          {categoryFilterName === 'Order Placed' ?
                            <>
                              <ListItemIcon >
                                <Check color='P' sx={{ padding: '3px' }} />
                              </ListItemIcon>
                              <Typography ml={-1}>Order Placed</Typography>
                            </>
                            :
                            <ListItemText inset >
                              <Typography ml={-1}>Order Placed</Typography>
                            </ListItemText>
                          }
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            setCategoryFilterTypes([]);
                            setCategoryFilterName('Out for Delivery');
                            set_Orders(orders.filter(o => o.status == 1))
                            setValueTab("Out for Delivery")
                          }}
                          sx={{ width: '227px', padding: '5px 5px 5px 13px', color: 'G1.main' }}
                        >
                          {categoryFilterName === 'Out for Delivery' ?
                            <>
                              <ListItemIcon >
                                <Check color='P' sx={{ padding: '3px' }} />
                              </ListItemIcon>
                              <Typography ml={-1}>Out for Delivery</Typography>
                            </>
                            :
                            <ListItemText inset >
                              <Typography ml={-1}>Out for Delivery</Typography>
                            </ListItemText>
                          }
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            setCategoryFilterTypes([]);
                            setCategoryFilterName('Delivered');
                            set_Orders(orders.filter(o => o.status == 2))
                            setValueTab("Delivered")
                          }}
                          sx={{ width: '227px', padding: '5px 5px 5px 13px', color: 'G1.main' }}
                        >
                          {categoryFilterName === 'Delivered' ?
                            <>
                              <ListItemIcon >
                                <Check color='P' sx={{ padding: '3px' }} />
                              </ListItemIcon>
                              <Typography ml={-1}>Delivered</Typography>
                            </>
                            :
                            <ListItemText inset >
                              <Typography ml={-1}>Delivered</Typography>
                            </ListItemText>
                          }
                        </MenuItem>
                        <Divider
                          sx={{ width: '60%', margin: 'auto', borderColor: 'P.main' }}
                        />
                        <MenuItem
                          aria-controls={openSort ? 'demo-positioned-date-menu' : undefined}
                          aria-haspopup="true"
                          aria-expanded={openSort ? 'true' : undefined}
                          onClick={(event) => setAnchorElSort(event.currentTarget)
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
                        anchorEl={anchorElSort}
                        open={openSort}
                        onClose={() => setAnchorElSort(null)}
                        MenuListProps={{
                          'aria-labelledby': 'basic-button',
                        }}
                        sx={{ width: '235px', marginTop: '-40px', marginLeft: '-206px', boxShadow: 'none' }}
                      >
                        <MenuItem
                          onClick={() => {
                            setSortFilterType('date');
                          }}
                          sx={{ padding: '7px 5px 5px 13px', width: '235px', color: 'G1.main' }}
                        >
                          {sortFilterType === 'date' ?
                            <>
                              <ListItemIcon >
                                <Check color='P' sx={{ padding: '3px' }} />
                              </ListItemIcon>
                              <Typography ml={-1}>Date</Typography>
                            </>
                            :
                            <ListItemText inset >
                              <Typography ml={-1}>Date</Typography>
                            </ListItemText>
                          }
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            setSortFilterType('Users');
                          }}
                          sx={{ padding: '5px 5px 5px 13px', width: '235px', color: 'G1.main' }}
                        >
                          {sortFilterType === 'Users' ?
                            <>
                              <ListItemIcon >
                                <Check color='P' sx={{ padding: '3px' }} />
                              </ListItemIcon>
                              <Typography ml={-1}>Users</Typography>
                            </>
                            :
                            <ListItemText inset >
                              <Typography ml={-1}>Users</Typography>
                            </ListItemText>
                          }
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            setSortFilterType('Total Price');
                          }}
                          sx={{ padding: '5px 5px 5px 13px', width: '235px', color: 'G1.main' }}
                        >
                          {sortFilterType === 'Total Price' ?
                            <>
                              <ListItemIcon >
                                <Check color='P' sx={{ padding: '3px' }} />
                              </ListItemIcon>
                              <Typography ml={-1}>Total Price</Typography>
                            </>
                            :
                            <ListItemText inset >
                              <Typography ml={-1}>Total Price</Typography>
                            </ListItemText>
                          }
                        </MenuItem>
                        <Divider
                          sx={{ width: '60%', margin: 'auto', borderColor: 'P.main' }}
                        />
                        <Typography color='G1.main' variant='h30' p={2}> Sort Order</Typography>

                        <MenuItem
                          onClick={() => {
                            if (sortFilterType === 'Users') {
                              setSort('title_sort=-1');
                              set_Orders(orders.sort((a, b) =>
                                getName(a.user_id) > getName(b.user_id) ? 1 : -1
                              ))

                            } else if (sortFilterType === 'date') {
                              setSort("date_sort=-1")
                              set_Orders(orders.sort((a, b) => {
                                return new Date(b.createdAt) - new Date(a.createdAt);
                              }))
                            } else {
                              setSort('viewed_sort=-1')
                              set_Orders(orders.sort((a, b) =>
                                a.total_price < b.total_price ? -1 : 1
                              ))

                            }
                            setAnchorElSort(null)
                            setAnchorElSortDate(null)
                          }}
                          sx={{ padding: '7px 5px 5px 13px', width: '235px', color: 'G1.main' }}
                        >
                          {sort.toString().split("=")[1] === '-1' ?
                            <>
                              <ListItemIcon >
                                <Check color='P' sx={{ padding: '3px' }} />
                              </ListItemIcon>
                              <Typography ml={-1}>{sortFilterType === 'Total Price' ? 'Low to high' : sortFilterType === 'date' ? 'Newest first' : 'Z to A'}</Typography>
                            </>
                            :
                            <ListItemText inset >
                              <Typography ml={-1}>{sortFilterType === 'Total Price' ? 'Low to high' : sortFilterType === 'date' ? 'Newest first' : 'Z to A'}</Typography>
                            </ListItemText>
                          }
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            if (sortFilterType === 'Users') {
                              setSort('title_sort=1');
                              set_Orders(orders.sort((a, b) =>
                                getName(b.user_id) > getName(a.user_id) ? 1 : -1
                              ))
                            } else if (sortFilterType === 'date') {
                              setSort("date_sort=1")
                              set_Orders(orders.sort((a, b) => {
                                return new Date(a.createdAt) - new Date(b.createdAt);
                              }))
                            } else {
                              setSort('viewed_sort=1')
                              set_Orders(orders.sort((a, b) =>
                                a.total_price < b.total_price ? 1 : -1
                              ))
                            }
                            setAnchorElSort(null)
                            setAnchorElSortDate(null)
                          }}
                          sx={{ padding: '5px 5px 5px 13px', width: '235px', color: 'G1.main' }}
                        >
                          {sort.toString().split("=")[1] === '1' ?
                            <>
                              <ListItemIcon >
                                <Check color='P' sx={{ padding: '3px' }} />
                              </ListItemIcon>
                              <Typography ml={-1}>{sortFilterType === 'Total Price' ? 'High to low' : sortFilterType === 'date' ? 'Oldest first' : 'A to Z'}</Typography>
                            </>
                            :
                            <ListItemText inset >
                              <Typography ml={-1}>{sortFilterType === 'Total Price' ? 'High to low' : sortFilterType === 'date' ? 'Oldest first' : 'A to Z'}</Typography>
                            </ListItemText>
                          }
                        </MenuItem>
                      </Menu>
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>


            </Grid>
            <Grid
              sx={{
                borderRadius: "5px",

                marginTop: "2px",
                backgroundColor: "white",
                boxShadow: "none",
                border: "1px solid #DCDCDC",
              }}
              item
              md={12}
              display="flex"
              justifyContent="space-between"
            >
              <TabContext value={valueTab}>
                <Box
                >
                  <TabList
                    onChange={(e, newValue) => {
                      setStatus(newValue);
                      setValueTab(newValue);
                      setOpenRadio({ status: newValue, open: false });
                      setChecked([]);
                      setSelectedProduct([]);
                      setSelectedProductRow([]);
                    }}
                    style={{ width: valueTab != "All" ? (valueTab == "Order Canceled" ? "283px" : (valueTab == "Order Placed" ? "246px" : valueTab == "Out for Delivery" ? "280px" : "197px")) : "183px" }}
                  >
                    <Tab sx={{ textTransform: "none" }} label={valueTab == "All" ? "All" : valueTab} value="0" />
                  </TabList>
                </Box>
              </TabContext>

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
                  mr: "17px",
                  mt: "7px",
                  mb: "7px"
                }}

              >

                <IconButton sx={{ p: "10px" }} aria-label="search" >
                  <SearchIcon color="G1.main" />
                </IconButton>
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="Search"
                  inputProps={{ "aria-label": "Search in List" }}
                  onChange={(e) => { setSearchValue(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1)) }}
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
                    <MenuItem onClick={() => setfilterType("name")} value={'name'}>
                      <Typography p={1} color='G2.main' variant='h15'>Name</Typography>
                    </MenuItem>
                    <MenuItem onClick={() => setfilterType("code")} value={'code'}>
                      <Typography p={1} color='G2.main' variant='h15'>Code</Typography>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Paper>
            </Grid>
            <Grid
              container
              xs={12}
              p={2}
              pt={0}
              pb={0}
              display="flex"
              sx={{
                borderRadius: "5px",
                marginTop: "15px",
                backgroundColor: "#F5E9EB",
                display: "flex",
                boxShadow: "none",
                border: "1px solid #DCDCDC",
                height: '48px'
              }}
              alignItems="center"
            >

              <Grid item xs={1}>
                <Typography color="black" variant="h7" sx={{ fontWeight: 'bold' }}>
                  Row
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography color="black" variant="h7" sx={{ fontWeight: 'bold' }} >
                  User
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography color="black" variant="h7" sx={{ fontWeight: 'bold' }}>
                  Code
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography color="black" variant="h7" sx={{ fontWeight: 'bold' }}>
                  Date
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography color="black" variant="h7" sx={{ fontWeight: 'bold' }}>
                  Order Status
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography color="black" variant="h7" sx={{ fontWeight: 'bold' }}>
                  Price
                </Typography>
              </Grid>
              <Grid item xs={0.5}>
                {" "}
              </Grid>
            </Grid>
          </Grid>

          <Grid xs={12} md={12} sx={{ width: "100%", minHeight: '405px' }} >
            <Grid
              item
              xs={12}
              md={12}
              container spacing={0} display='flex' justifyContent='space-between'
            >
              <Grid xs={12} style={{ minHeight: 390 }}>


                <Grid item xs={12} md={12}>
                  <List sx={{ p: 0 }}>
                    {_orders.map((order, index) => {
                      return (
                        <Paper item xs={12} md={12} sx={{ border: "1px solid #DCDCDC", mb: '-1px', borderRadius: '5px', height: "48px" }} elevation={0} >
                          <ListItem
                            onClick={() => {
                              setSelectedRow(order);
                              orderDetails(order.id);
                              setPageName("details");
                              getAddress(order.user_id, order.user_address_id);
                            }}
                            key={order.id}
                          >
                            <Grid xs={12} pt="3px" container sx={{ display: "flex", alignItems: "center" }}>
                              <Grid item xs={0.94} p={1} pt={0} pb={0}>
                                <Typography
                                  variant="h7"
                                  p={1}
                                  color="G2.main"
                                >
                                  {index + 1}
                                </Typography>
                              </Grid>
                              <Grid item xs={2.06}>
                                <Typography
                                  variant="h7"
                                  p={1}
                                  color="G2.main"
                                >
                                  {getName(order.user_id)}
                                </Typography>
                              </Grid>
                              <Grid item xs={2}>
                                <Typography variant="h7" color="G2.main">
                                  {order.code.split("ord-")}
                                </Typography>
                              </Grid>

                              <Grid item xs={2}>
                                <Typography variant="h7" color="G2.main">
                                  {moment(order.createdAt).format("YYYY/MM/DD")}
                                </Typography>
                              </Grid>
                              <Grid item xs={2}>
                                {order.status === 2 ? (
                                  <Typography
                                    variant="menuitem"
                                    sx={{ backgroundColor: "LightGreen1.main" }}
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
                                    sx={{ backgroundColor: "paleGreen.main" }}
                                    p={1}
                                    borderRadius={1}
                                    color="Orange.main"
                                  >
                                    Order Placed
                                  </Typography>
                                ) : order.status === 1 ? (
                                  <Typography
                                    variant="menuitem"
                                    sx={{ backgroundColor: "paleGreen1.main" }}
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
                              <Grid item xs={2}>
                                <Typography variant="h7" color="G2.main">
                                  {order.total_price} KWD
                                </Typography>
                              </Grid>

                              <Grid item xs={0.5} className="moreIcone">
                                <NavigateNextIcon color="G2" />
                              </Grid>
                            </Grid>
                          </ListItem>
                        </Paper>
                      );
                    })}
                  </List>
                </Grid>
                <Grid mt={2}>
                </Grid>
              </Grid>

            </Grid>
          </Grid>
        </Grid>
      ) : (
        <Paper sx={{ width: "100%", minHeight: "300px" }}>
          <Grid
            xs={12}
            style={{ borderBottom: "1px solid #DCDCDC" }}
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
            <Grid
              container
              p={2}
              xs={12}
              md={12}
              justifyContent="space-between"
            >
              <Grid xs={9} item>
                <Typography p={1} color="black">
                  {getName(selectedRow.user_id)}
                </Typography>
              </Grid>
              <Grid item xs={2} display="flex" pl={3.7}>
                <Grid mr={1}>
                  <Typography p={1} color="black">
                    {moment(selectedRow.createdAt).format("YYYY/MM/DD")}
                  </Typography>
                </Grid>
                <Divider orientation="vertical" flexItem />
                <Grid pl={1}>
                  <Typography p={1} color="black">
                    {selectedRow.code.split("ord-")}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Divider />
            {selectedAddress && (
              <>
                <Grid container p={2} xs={12} md={12}>
                  <Grid xs={12} item>
                    <Typography p={1} variant="h2">
                      {selectedAddress.city != undefined
                        ? `${selectedAddress.city}, ${selectedAddress.country}`
                        : ""}
                    </Typography>
                  </Grid>
                  <Grid xs={12} item>
                    <Typography p={1} variant="h2">
                      {selectedAddress.address != undefined
                        ? selectedAddress.address.charAt(0).toUpperCase() +
                        selectedAddress.address.slice(1)
                        : ""}
                    </Typography>
                  </Grid>
                  <Grid xs={12} item>
                    <Typography p={1} variant="h2">
                      {selectedAddress.apartment != undefined
                        ? selectedAddress.apartment.charAt(0).toUpperCase() +
                        selectedAddress.apartment.slice(1)
                        : ""}
                    </Typography>
                  </Grid>
                  <Grid xs={12} item>
                    <Grid container>
                      <Typography p={1} variant="h2">
                        {selectedAddress.zip_code != undefined
                          ? selectedAddress.zip_code.charAt(0).toUpperCase() +
                          selectedAddress.zip_code.slice(1)
                          : ""}
                      </Typography>
                      <Typography p={1} variant="h2">
                        {selectedAddress.full_name != undefined
                          ? selectedAddress.full_name.charAt(0).toUpperCase() +
                          selectedAddress.full_name.slice(1)
                          : ""}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </>
            )}
            {selectedOrder && selectedRow && (
              <>
                <Divider />

                <Grid container p={2} xs={12} md={12}>
                  <Grid container xs={5.5} md={5.5}>
                    <Grid container>
                      <Grid container justifyContent={"space-between"}>
                        <Typography p={1} color="Gray" variant="h18">
                          Items ({selectedOrder.length}):
                        </Typography>
                        <Typography p={1} color="Gray" variant="h18">
                          KWD {selectedRow.total_price}
                        </Typography>
                      </Grid>
                      <Grid container justifyContent={"space-between"}>
                        <Typography p={1} color="Gray" variant="h18">
                          Shipping:
                        </Typography>
                        <Typography p={1} color="Gray" variant="h18">
                          KWD 0
                        </Typography>
                      </Grid>
                      <Grid container justifyContent={"space-between"}>
                        <Typography p={1} color="Gray" variant="h18">
                          Tax Collected:
                        </Typography>
                        <Typography p={1} color="Gray" variant="h18">
                          KWD 0
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Divider orientation="vertical" flexItem />

                  <Grid container xs={6} md={6}>
                    <Grid container>
                      <Grid container justifyContent={"space-between"}>
                        <Typography p={1} color="Gray" variant="h18">
                          Code title:
                        </Typography>
                      </Grid>
                      <Grid container justifyContent={"space-between"}>
                        <Typography p={1} color="Gray" variant="h18">
                          Discount:
                        </Typography>
                        <Typography p={1} color="Gray" variant="h18">
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

            <Grid container xs={12} pl={2}>
              {selectedOrder.map((product) => {
                return (
                  <Grid xs={6} p={1} display="flex">
                    <Grid xs={1}>
                      <Card
                        sx={{ width: 82, border: "none", boxShadow: "none" }}
                      >
                        <CardMedia
                          component="img"
                          height="82"
                          width="82"
                          image={
                            product.product_file_urls !== null &&
                              product.product_file_urls !== undefined
                              ? axiosConfig.defaults.baseURL +
                              product.product_file_urls[0].image_url
                              : ""
                          }
                          className="image"
                        />
                      </Card>
                    </Grid>
                    <Grid xs={9} mt={2}>
                      <Grid>
                        <Typography ml={2} color="black" variant="h11">
                          {product.product_group.name} -{" "}
                          {product.product_group.products[0].sku}
                        </Typography>
                      </Grid>
                      <Grid ml={2} mt={1} display="flex">
                        <Typography
                          variant="h10"
                          pl={1}
                          pr={1}
                          sx={{ color: "#757575" }}
                        >
                          QTY: {product.quantity}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid item xs={2} display="flex" alignItems="center">
                      <Grid
                        item
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                        pr={2}
                      >
                        <Typography>
                          {product.product_group.products.filter(
                            (p) => p.id === product.product_id
                          )[0]["price"] * product.quantity}
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

export default OrderList;
