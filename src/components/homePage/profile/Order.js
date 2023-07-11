import React, { useState, useEffect } from "react";
import ProfileLayout from "./ProfileLayout";
import {
  Card,
  CardMedia,
  Divider,
  Grid,
  Hidden,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Snackbar,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axiosConfig from "../../../axiosConfig";
import moment from "moment";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useHistory } from "react-router-dom";
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';

const Order = () => {
  const [page, setPage] = useState("list");
  const [orders, setOrders] = useState([]);
  const [selectedRow, setSelectedRow] = useState({});
  const [selectedOrder, setSelectedOrder] = useState([]);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState({});
  const [ordersFilter, setOrdersFilter] = useState("");
  const [openAcordianDetail, setOpenAcordionDetail] = useState([]);

  const [width, setWidth] = useState("");
  const [windowResizing, setWindowResizing] = useState(false);
  const [openMassage, setOpenMassage] = useState(false);
  const [showMassage, setShowMassage] = useState('');

  let history = useHistory();


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
    refreshList();
  }, []);

  const refreshList = () => {
    axiosConfig
      .get("/users/order/all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setOrders(res.data.orders);
      })
      .catch((err) =>{
        if(err.response.data.error.status === 401){
          axiosConfig
            .post("/users/refresh_token", {
              refresh_token: localStorage.getItem("refreshToken"),
            })
            .then((res) => {
              setShowMassage('Get orders have a problem!')
              setOpenMassage(true) 
              localStorage.setItem("token", res.data.accessToken);
              localStorage.setItem("refreshToken", res.data.refreshToken);
              refreshList();
            })
        }else{
          setShowMassage('Get orders have a problem!')
          setOpenMassage(true) 
        }
      });
  };


  const orderDetails = (id) => {
    axiosConfig
      .get(`/users/order/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then((res) => {
        setSelectedOrder(res.data.products);
        setSelectedOrderDetails(res.data.order);
      }).catch((err) =>{
        if(err.response.data.error.status === 401){
          axiosConfig
            .post("/users/refresh_token", {
              refresh_token: localStorage.getItem("refreshToken"),
            })
            .then((res) => {
              setShowMassage('Get order has a problem!')
              setOpenMassage(true) 
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

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenMassage(false);
  };

  return (
    <ProfileLayout pageName="Orders">
      {page === "list" ? (
        <>
            <Hidden mdDown>
                <Grid
                    xs={12}
                    sx={{
                    height: "65px",
                    borderRadius: "5px",
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: "38px",
                    marginLeft: "35px",
                    backgroundColor: "P3.main",
                    }}
                >
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
                </Grid>
                <Grid
                    container
                    xs={12}
                    sx={{
                    width: "100%",
                    paddingLeft: "35px",
                    }}
                >
                    <Grid
                    xs={12}
                    container
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "157px",
                        marginTop: "5px",
                        backgroundColor: "White.main",
                        borderRadius: "5px",
                        gap: "30px",
                    }}
                    >
                    <Grid
                        sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "20px",
                        cursor: "pointer",
                        }}
                        onClick={() => {
                        setOrdersFilter("In Progress");
                        }}
                    >
                        <svg
                        width="35"
                        height="35"
                        viewBox="0 0 41 41"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        >
                        <path
                            d="M14.7347 14.5209H7.0472C6.59412 14.5209 6.1596 14.3409 5.83923 14.0206C5.51885 13.7002 5.33887 13.2657 5.33887 12.8126V5.12508C5.33887 4.672 5.51885 4.23748 5.83923 3.91711C6.1596 3.59673 6.59412 3.41675 7.0472 3.41675C7.50028 3.41675 7.9348 3.59673 8.25517 3.91711C8.57555 4.23748 8.75553 4.672 8.75553 5.12508V11.1042H14.7347C15.1878 11.1042 15.6223 11.2842 15.9427 11.6046C16.263 11.925 16.443 12.3595 16.443 12.8126C16.443 13.2657 16.263 13.7002 15.9427 14.0206C15.6223 14.3409 15.1878 14.5209 14.7347 14.5209Z"
                            fill={ordersFilter == "In Progress" ? "#CB929B" : "#757575"}
                        />
                        <path
                            d="M35.8749 22.2083C35.4218 22.2083 34.9873 22.0283 34.6669 21.7079C34.3465 21.3875 34.1665 20.953 34.1665 20.4999C34.1678 17.4925 33.1764 14.5687 31.3462 12.1823C29.516 9.79582 26.9493 8.08018 24.0444 7.30158C21.1395 6.52297 18.0588 6.72494 15.2804 7.87613C12.5019 9.02732 10.1812 11.0634 8.67819 13.6683C8.4512 14.0605 8.07773 14.3464 7.63993 14.4631C7.20214 14.5799 6.73589 14.518 6.34375 14.291C5.95161 14.064 5.66571 13.6905 5.54893 13.2528C5.43215 12.815 5.49407 12.3487 5.72106 11.9566C7.60066 8.7009 10.5022 6.15652 13.9754 4.71817C17.4487 3.27983 21.2995 3.02792 24.9306 4.00153C28.5616 4.97514 31.7698 7.11984 34.0575 10.1029C36.3453 13.086 37.5846 16.7406 37.5832 20.4999C37.5832 20.953 37.4032 21.3875 37.0828 21.7079C36.7625 22.0283 36.3279 22.2083 35.8749 22.2083ZM33.953 37.5833C33.4999 37.5833 33.0654 37.4033 32.745 37.0829C32.4246 36.7626 32.2446 36.328 32.2446 35.875V29.8958H26.2655C25.8124 29.8958 25.3779 29.7158 25.0575 29.3954C24.7371 29.0751 24.5571 28.6405 24.5571 28.1875C24.5571 27.7344 24.7371 27.2999 25.0575 26.9795C25.3779 26.6591 25.8124 26.4791 26.2655 26.4791H33.953C34.4061 26.4791 34.8406 26.6591 35.161 26.9795C35.4813 27.2999 35.6613 27.7344 35.6613 28.1875V35.875C35.6613 36.328 35.4813 36.7626 35.161 37.0829C34.8406 37.4033 34.4061 37.5833 33.953 37.5833Z"
                            fill={ordersFilter == "In Progress" ? "#CB929B" : "#757575"}
                        />
                        <path
                            d="M20.5003 37.5834C15.9712 37.578 11.6291 35.7764 8.42658 32.5738C5.22401 29.3713 3.42242 25.0292 3.41699 20.5001C3.41699 20.047 3.59698 19.6125 3.91735 19.2921C4.23773 18.9717 4.67225 18.7917 5.12533 18.7917C5.5784 18.7917 6.01292 18.9717 6.3333 19.2921C6.65367 19.6125 6.83366 20.047 6.83366 20.5001C6.83236 23.5075 7.82374 26.4313 9.65396 28.8178C11.4842 31.2042 14.0509 32.9198 16.9558 33.6985C19.8607 34.4771 22.9414 34.2751 25.7198 33.1239C28.4982 31.9727 30.819 29.9367 32.322 27.3317C32.4344 27.1375 32.5839 26.9674 32.7621 26.831C32.9402 26.6947 33.1435 26.5947 33.3602 26.5369C33.577 26.4791 33.8031 26.4645 34.0255 26.494C34.2479 26.5236 34.4623 26.5966 34.6564 26.709C34.8506 26.8214 35.0207 26.971 35.1571 27.1491C35.2935 27.3272 35.3934 27.5305 35.4512 27.7473C35.5091 27.964 35.5236 28.1901 35.4941 28.4125C35.4646 28.6349 35.3915 28.8493 35.2791 29.0435C33.7766 31.6341 31.6215 33.7858 29.0285 35.2842C26.4355 36.7826 23.4951 37.5753 20.5003 37.5834Z"
                            fill={ordersFilter == "In Progress" ? "#CB929B" : "#757575"}
                        />
                        </svg>
                        <Typography variant="h28" color="#757575">
                        In Progress
                        </Typography>
                    </Grid>
                    <Divider
                        orientation="vertical"
                        sx={{ height: "35px" }}
                        color="#F5E9EB"
                    />
                    <Grid
                        sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "20px",
                        cursor: "pointer",
                        }}
                        onClick={() => {
                        setOrdersFilter("Delivered");
                        }}
                    >
                        <svg
                        width="40"
                        height="40"
                        viewBox="0 0 40 42"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        >
                        <path
                            d="M20 3.5C19.6667 3.5 19.3333 3.675 19 3.85L5.83333 11.55C5.33333 11.9 5 12.425 5 13.125V28.875C5 29.575 5.33333 30.1 5.83333 30.45L19 38.15C19.3333 38.325 19.6667 38.5 20 38.5C20.3333 38.5 20.6667 38.325 21 38.15L22.5 37.275C22 36.225 21.8333 35 21.6667 33.775V22.05L31.6667 16.1V22.75C32.8333 22.75 34 22.925 35 23.275V13.125C35 12.425 34.6667 11.9 34.1667 11.55L21 3.85C20.6667 3.675 20.3333 3.5 20 3.5ZM20 7.35L30 13.125L26.6667 15.05L16.8333 9.1L20 7.35ZM13.5 11.025L23.3333 17.15L20 19.075L10 13.125L13.5 11.025ZM8.33333 16.1L18.3333 22.05V33.775L8.33333 27.825V16.1ZM35.5 27.65L29.5 33.95L26.8333 31.15L25 33.25L29.6667 38.5L37.6667 30.1L35.5 27.65Z"
                            fill={ordersFilter == "Delivered" ? "#CB929B" : "#757575"}
                        />
                        </svg>
                        <Typography variant="h28" color="#757575">
                        Delivered
                        </Typography>
                    </Grid>
                    <Divider
                        orientation="vertical"
                        sx={{ height: "35px" }}
                        color="#F5E9EB"
                    />

                    <Grid
                        sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "20px",
                        cursor: "pointer",
                        }}
                        onClick={() => {
                        setOrdersFilter("Returned");
                        }}
                    >
                        <svg
                        width="40"
                        height="40"
                        viewBox="0 0 43 34"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        >
                        <path
                            d="M10.6547 31.6987C13.0447 31.6987 14.9822 29.7992 14.9822 27.456C14.9822 25.1129 13.0447 23.2134 10.6547 23.2134C8.26464 23.2134 6.32715 25.1129 6.32715 27.456C6.32715 29.7992 8.26464 31.6987 10.6547 31.6987Z"
                            stroke={ordersFilter == "Returned" ? "#CB929B" : "#757575"}
                            stroke-width="4"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                        <path
                            d="M32.2924 31.6987C34.6824 31.6987 36.6199 29.7992 36.6199 27.456C36.6199 25.1129 34.6824 23.2134 32.2924 23.2134C29.9023 23.2134 27.9648 25.1129 27.9648 27.456C27.9648 29.7992 29.9023 31.6987 32.2924 31.6987Z"
                            stroke={ordersFilter == "Returned" ? "#CB929B" : "#757575"}
                            stroke-width="4"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                        <path
                            d="M6.32751 27.456H2V4.12133C2 3.55872 2.22797 3.01915 2.63375 2.62132C3.03953 2.2235 3.58989 2 4.16376 2H23.6376V14.728H12.8188L17.1463 18.9706M17.1463 10.4853L12.8188 14.728M14.9825 27.456H27.9651M23.6376 4.12133H34.4564L40.9476 14.728V27.456H36.6201"
                            stroke={ordersFilter == "Returned" ? "#CB929B" : "#757575"}
                            stroke-width="4"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                        </svg>
                        <Typography variant="h28" color="#757575">
                        Returned
                        </Typography>
                    </Grid>
                    <Divider
                        orientation="vertical"
                        sx={{ height: "35px" }}
                        color="#F5E9EB"
                    />

                    <Grid
                        sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "20px",
                        cursor: "pointer",
                        }}
                        onClick={() => {
                        setOrdersFilter("Canceled");
                        }}
                    >
                        <svg
                        width="40"
                        height="40"
                        viewBox="0 0 41 42"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        >
                        <path
                            d="M14.5956 29.4L20.4996 23.352L26.4036 29.4L28.6996 27.048L22.7956 21L28.6996 14.952L26.4036 12.6L20.4996 18.648L14.5956 12.6L12.2996 14.952L18.2036 21L12.2996 27.048L14.5956 29.4ZM20.4996 37.8C18.2309 37.8 16.0989 37.3587 14.1036 36.4761C12.1083 35.5947 10.3726 34.398 8.89661 32.886C7.42061 31.374 6.25238 29.596 5.39193 27.552C4.53038 25.508 4.09961 23.324 4.09961 21C4.09961 18.676 4.53038 16.492 5.39193 14.448C6.25238 12.404 7.42061 10.626 8.89661 9.11395C10.3726 7.60195 12.1083 6.40467 14.1036 5.52211C16.0989 4.64067 18.2309 4.19995 20.4996 4.19995C22.7683 4.19995 24.9003 4.64067 26.8956 5.52211C28.8909 6.40467 30.6266 7.60195 32.1026 9.11395C33.5786 10.626 34.7468 12.404 35.6073 14.448C36.4688 16.492 36.8996 18.676 36.8996 21C36.8996 23.324 36.4688 25.508 35.6073 27.552C34.7468 29.596 33.5786 31.374 32.1026 32.886C30.6266 34.398 28.8909 35.5947 26.8956 36.4761C24.9003 37.3587 22.7683 37.8 20.4996 37.8ZM20.4996 34.44C24.1623 34.44 27.2646 33.138 29.8066 30.534C32.3486 27.93 33.6196 24.752 33.6196 21C33.6196 17.248 32.3486 14.07 29.8066 11.466C27.2646 8.86195 24.1623 7.55995 20.4996 7.55995C16.8369 7.55995 13.7346 8.86195 11.1926 11.466C8.65061 14.07 7.37961 17.248 7.37961 21C7.37961 24.752 8.65061 27.93 11.1926 30.534C13.7346 33.138 16.8369 34.44 20.4996 34.44Z"
                            fill={ordersFilter == "Canceled" ? "#CB929B" : "#757575"}
                        />
                        </svg>
                        <Typography variant="h28" color="#757575">
                        Canceled
                        </Typography>
                    </Grid>
                    </Grid>
                    {orders.map((order, index) => {
                    let isClick = "";
                    let status = -1;
                    if (ordersFilter=="In Progress") {
                        status = 0;
                    }else if (ordersFilter=="Delivered") {
                        status = 2;
                    }else if (ordersFilter=="Returned") {
                        status = 1;
                    }   


                    if (order.status == status) {
                        return (
                        <Grid
                            xs={12}
                            bgcolor="GrayLight.main"
                            sx={{
                            borderRadius: "5px",
                            marginTop: "5px",
                            }}
                        >
                            <Accordion
                            
                            elevation={0}
                            onClick={() => {
                                setSelectedRow(order);
                                orderDetails(order.id);
                                getAddress(order.user_id, order.user_address_id);
                            }}
                            defaultExpanded={false}
                            sx={{
                                backgroundColor: "GrayLight.main",
                                borderRadius: "5px",
                                padding: 0,
                                "&: .css-sh22l5-MuiButtonBase-root-MuiAccordionSummary-root":
                                {
                                    padding: 0,
                                    borderRadius: "5px",
                                },
                            }}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    sx={{
                                    borderRadius: "5px",
                                    backgroundColor: "White.main",
                                    }}
                                    onClick={() => {
                                        if (isClick == "") {
                                            let accordion = [...openAcordianDetail];
                                            if (accordion[index] != undefined) {
                                            accordion[index] = !accordion[index];
                                            } else accordion[index] = true;

                                            setOpenAcordionDetail(accordion);
                                        }
                                        isClick = "";
                                    }}
                                >
                                    <Grid
                                    xs={6}
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "start",
                                        justifyContent: "center",
                                        gap: "10px",
                                        paddingLeft: "37px",
                                        borderRadius: "5px",
                                    }}
                                    >
                                    <Typography
                                        variant="h35"
                                        sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        color: "G1.main",
                                        }}
                                    >
                                        Order Code:
                                        <Typography
                                            variant="h33"
                                            sx={{
                                                fontWeight: 400,
                                                color: "G2.main",
                                                marginLeft: "5px",
                                            }}
                                        >
                                            {order.code.split("ord-")}
                                        </Typography>
                                    </Typography>
                                    <Typography
                                        variant="h35"
                                        sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        color: "G1.main",
                                        }}
                                    >
                                        Date:
                                        <Typography
                                        variant="h33"
                                        sx={{
                                            fontWeight: 400,
                                            color: "G2.main",
                                            marginLeft: "5px",
                                        }}
                                        >
                                        {moment(order.createdAt).format("YYYY/MM/DD")}
                                        </Typography>
                                    </Typography>
                                    </Grid>
                                    <Grid xs={6}>
                                        <Typography
                                            variant="h35"
                                            sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            color: "G1.main",
                                            }}
                                        >
                                            Total Price:
                                            <Typography
                                            variant="h33"
                                            sx={{
                                                fontWeight: 400,
                                                color: "G2.main",
                                                marginLeft: "5px",
                                            }}
                                            >
                                            {order.total_price} KWD
                                            </Typography>
                                        </Typography>
                                    </Grid>
                                </AccordionSummary>
                                <AccordionDetails
                                    sx={{
                                    padding: 0,
                                    marginTop: "2px",
                                    }}
                                >
                                    <Grid
                                    sx={{
                                        backgroundColor: "#F9F9F9",
                                        border: "1px solid #E0E0E0",
                                        borderRadius: "5px",
                                        height: "140px",
                                    }}
                                    >
                                        <Grid
                                            xs={12}
                                            container
                                            sx={{
                                            display: "flex",
                                            flexDirection: "row",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            height: "140px",
                                            borderRadius: "5px",
                                            gap: "30px",
                                            }}
                                        >
                                            <Grid
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                gap: "20px",
                                                cursor: "pointer",
                                            }}
                                            >
                                            <svg
                                                width="35"
                                                height="35"
                                                viewBox="0 0 41 41"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                d="M8.54167 35.875C7.60208 35.875 6.79746 35.5407 6.12779 34.8722C5.45926 34.2025 5.125 33.3979 5.125 32.4583V15.375C5.125 14.4354 5.45926 13.6308 6.12779 12.9611C6.79746 12.2926 7.60208 11.9583 8.54167 11.9583H15.375V15.375H8.54167V32.4583H32.4583V15.375H25.625V11.9583H32.4583C33.3979 11.9583 34.2025 12.2926 34.8722 12.9611C35.5407 13.6308 35.875 14.4354 35.875 15.375V32.4583C35.875 33.3979 35.5407 34.2025 34.8722 34.8722C34.2025 35.5407 33.3979 35.875 32.4583 35.875H8.54167ZM20.5 27.3333L13.6667 20.5L16.0583 18.1083L18.7917 20.799V0H22.2083V20.799L24.9417 18.1083L27.3333 20.5L20.5 27.3333Z"
                                                fill="#757575"
                                                />
                                            </svg>
                                            <Typography variant="h28" color="#757575">
                                                Order Placed
                                            </Typography>
                                            </Grid>
                                            <Divider
                                            orientation="horizontal"
                                            sx={{ width: "100px", marginTop: "-40px" }}
                                            color="#F5E9EB"
                                            />
                                            <Grid
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                gap: "20px",
                                                cursor: "pointer",
                                            }}
                                            >
                                            <svg
                                                width="35"
                                                height="35"
                                                viewBox="0 0 48 48"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                d="M6 24H24V27H6V24ZM3 16.5H18V19.5H3V16.5Z"
                                                fill="#757575"
                                                />
                                                <path
                                                d="M44.8785 24.909L40.3785 14.409C40.263 14.1391 40.0708 13.9091 39.8258 13.7475C39.5807 13.5859 39.2936 13.4998 39 13.5H34.5V10.5C34.5 10.1022 34.342 9.72064 34.0607 9.43934C33.7794 9.15804 33.3978 9 33 9H9.00001V12H31.5V30.834C30.8165 31.2309 30.2183 31.7592 29.74 32.3884C29.2617 33.0176 28.9126 33.7352 28.713 34.5H19.287C18.9219 33.086 18.0537 31.8537 16.845 31.0341C15.6363 30.2145 14.1702 29.8638 12.7215 30.0478C11.2728 30.2318 9.94091 30.9379 8.97553 32.0337C8.01015 33.1294 7.47754 34.5396 7.47754 36C7.47754 37.4604 8.01015 38.8706 8.97553 39.9663C9.94091 41.0621 11.2728 41.7682 12.7215 41.9522C14.1702 42.1362 15.6363 41.7855 16.845 40.9659C18.0537 40.1463 18.9219 38.914 19.287 37.5H28.713C29.0393 38.7874 29.7856 39.9292 30.8337 40.7448C31.8818 41.5604 33.1719 42.0032 34.5 42.0032C35.8281 42.0032 37.1182 41.5604 38.1663 40.7448C39.2145 39.9292 39.9607 38.7874 40.287 37.5H43.5C43.8978 37.5 44.2794 37.342 44.5607 37.0607C44.842 36.7794 45 36.3978 45 36V25.5C45.0001 25.2968 44.9587 25.0957 44.8785 24.909ZM13.5 39C12.9067 39 12.3267 38.8241 11.8333 38.4944C11.34 38.1648 10.9554 37.6962 10.7284 37.1481C10.5013 36.5999 10.4419 35.9967 10.5577 35.4147C10.6734 34.8328 10.9591 34.2982 11.3787 33.8787C11.7983 33.4591 12.3328 33.1734 12.9147 33.0576C13.4967 32.9419 14.0999 33.0013 14.6481 33.2284C15.1962 33.4554 15.6648 33.8399 15.9944 34.3333C16.3241 34.8266 16.5 35.4067 16.5 36C16.4992 36.7954 16.1829 37.558 15.6205 38.1204C15.058 38.6829 14.2954 38.9992 13.5 39ZM34.5 16.5H38.01L41.226 24H34.5V16.5ZM34.5 39C33.9067 39 33.3267 38.8241 32.8333 38.4944C32.34 38.1648 31.9554 37.6962 31.7284 37.1481C31.5013 36.5999 31.4419 35.9967 31.5577 35.4147C31.6734 34.8328 31.9591 34.2982 32.3787 33.8787C32.7983 33.4591 33.3328 33.1734 33.9147 33.0576C34.4967 32.9419 35.0999 33.0013 35.6481 33.2284C36.1962 33.4554 36.6648 33.8399 36.9944 34.3333C37.3241 34.8266 37.5 35.4067 37.5 36C37.4992 36.7954 37.1829 37.558 36.6205 38.1204C36.058 38.6829 35.2954 38.9992 34.5 39ZM42 34.5H40.287C39.9566 33.2151 39.2092 32.0763 38.1619 31.2619C37.1146 30.4475 35.8267 30.0037 34.5 30V27H42V34.5Z"
                                                fill="#757575"
                                                />
                                            </svg>
                                            <Typography variant="h28" color="#757575">
                                                Post
                                            </Typography>
                                            </Grid>
                                            <Divider
                                            orientation="horizontal"
                                            sx={{ width: "100px", marginTop: "-40px" }}
                                            color="#F5E9EB"
                                            />
                                            <Grid
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                gap: "20px",
                                                cursor: "pointer",
                                            }}
                                            >
                                            <svg
                                                width="35"
                                                height="35"
                                                viewBox="0 0 40 42"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                d="M20 3.5C19.6667 3.5 19.3333 3.675 19 3.85L5.83333 11.55C5.33333 11.9 5 12.425 5 13.125V28.875C5 29.575 5.33333 30.1 5.83333 30.45L19 38.15C19.3333 38.325 19.6667 38.5 20 38.5C20.3333 38.5 20.6667 38.325 21 38.15L22.5 37.275C22 36.225 21.8333 35 21.6667 33.775V22.05L31.6667 16.1V22.75C32.8333 22.75 34 22.925 35 23.275V13.125C35 12.425 34.6667 11.9 34.1667 11.55L21 3.85C20.6667 3.675 20.3333 3.5 20 3.5ZM20 7.35L30 13.125L26.6667 15.05L16.8333 9.1L20 7.35ZM13.5 11.025L23.3333 17.15L20 19.075L10 13.125L13.5 11.025ZM8.33333 16.1L18.3333 22.05V33.775L8.33333 27.825V16.1ZM35.5 27.65L29.5 33.95L26.8333 31.15L25 33.25L29.6667 38.5L37.6667 30.1L35.5 27.65Z"
                                                fill="#757575"
                                                />
                                            </svg>

                                            <Typography variant="h28" color="#757575">
                                                Delivered
                                            </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid
                                    sx={{
                                        backgroundColor: "White.main",
                                        borderRadius: "5px",
                                        marginTop: "2px",
                                        padding: "27px 37px",
                                    }}
                                    >
                                        
                                        <Grid xs={12} display='flex' justifyContent='center' alignItems='center'>
                                            <Grid xs={12} display='flex' justifyContent='center' alignItems='center' flexWrap='wrap'>
                                                <Grid xs={6} display="flex" justifyContent='end' >
                                                    <Grid width="212px" height="42px" borderRadius="5px" display="flex" justifyContent='center' alignItems='center'  sx={{background: "rgba(245, 233, 235, 0.5)"}}>
                                                        <Typography variant="h35" color="G1.main">Tracking Number</Typography>
                                                    </Grid>
                                                </Grid>
                                                <Grid xs={6} >
                                                    <Grid width="212px" height="42px" borderRadius="5px" display="flex" justifyContent='center'  alignItems='center'  ml="1px" sx={{background: "rgba(245, 233, 235, 0.5)"}}>
                                                        -
                                                    </Grid>
                                                </Grid>
                                                <Grid xs={6} mt="1px" display="flex" justifyContent='end' alignItems='center'>
                                                    <Grid width="212px" height="42px" borderRadius="5px" display="flex" justifyContent='center'  alignItems='center' sx={{background: "rgba(245, 233, 235, 0.5)"}}>
                                                        <Typography variant="h35" justifyContent='center'  color="G1.main">Delivered to Post</Typography>
                                                    </Grid>
                                                </Grid>
                                                <Grid xs={6} mt="1px" >
                                                    <Grid width="212px" height="42px" borderRadius="5px" ml="1px" display="flex" justifyContent='center'  alignItems='center'  sx={{background: "rgba(245, 233, 235, 0.5)"}}>
                                                        -
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>
                            
                            <Divider />
                        </Grid>
                        );
                    }else if (ordersFilter =="") {
                        
                        return (
                            <Grid
                                xs={12}
                                bgcolor="GrayLight.main"
                                sx={{
                                borderRadius: "5px",
                                marginTop: "5px",
                                }}
                            >
                                <Accordion
                                
                                elevation={0}
                                onClick={() => {
                                    setSelectedRow(order);
                                    orderDetails(order.id);
                                    getAddress(order.user_id, order.user_address_id);
                                }}
                                defaultExpanded={false}
                                sx={{
                                    backgroundColor: "GrayLight.main",
                                    borderRadius: "5px",
                                    padding: 0,
                                    "&: .css-sh22l5-MuiButtonBase-root-MuiAccordionSummary-root":
                                    {
                                        padding: 0,
                                        borderRadius: "5px",
                                    }
                                }}
                                >
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        sx={{
                                        borderRadius: "5px",
                                        backgroundColor: "White.main",
                                        }}
                                        onClick={() => {
                                            if (isClick == "") {
                                                let accordion = [...openAcordianDetail];
                                                if (accordion[index] != undefined) {
                                                    accordion[index] = !accordion[index];
                                                } else accordion[index] = true;
                    
                                                setOpenAcordionDetail(accordion);
                                            }
                                            isClick = "";
                                        }}
                                    >
                                        <Grid
                                        xs={6}
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "start",
                                            justifyContent: "center",
                                            gap: "10px",
                                            paddingLeft: "37px",
                                            borderRadius: "5px",
                                        }}
                                        >
                                        <Typography
                                            variant="h35"
                                            sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            color: "G1.main",
                                            }}
                                        >
                                            Order Code:
                                            <Typography
                                            variant="h35"
                                            sx={{
                                                fontWeight: 400,
                                                color: "G2.main",
                                                marginLeft: "5px",
                                            }}
                                            >
                                            {order.code.split("ord-")}
                                            </Typography>
                                        </Typography>
                                        <Typography
                                            variant="h35"
                                            sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            color: "G1.main",
                                            }}
                                        >
                                            Date:
                                            <Typography
                                            variant="h35"
                                            sx={{
                                                fontWeight: 400,
                                                color: "G2.main",
                                                marginLeft: "5px",
                                            }}
                                            >
                                            {moment(order.createdAt).format("YYYY/MM/DD")}
                                            </Typography>
                                        </Typography>
                                        </Grid>
                                        <Grid xs={6}>
                                        <Typography
                                            variant="h35"
                                            sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            color: "G1.main",
                                            }}
                                        >
                                            Total Price:
                                            <Typography
                                            variant="h35"
                                            sx={{
                                                fontWeight: 400,
                                                color: "G2.main",
                                                marginLeft: "5px",
                                            }}
                                            >
                                            {order.total_price} KWD
                                            </Typography>
                                        </Typography>
                                        </Grid>
                                    </AccordionSummary>
                                    <AccordionDetails
                                        sx={{
                                        padding: 0,
                                        marginTop: "2px",
                                        }}
                                    >
                                        <Grid
                                        sx={{
                                            backgroundColor: "#F9F9F9",
                                            border: "1px solid #E0E0E0",
                                            borderRadius: "5px",
                                            height: "140px",
                                        }}
                                        >
                                            <Grid
                                                xs={12}
                                                container
                                                sx={{
                                                display: "flex",
                                                flexDirection: "row",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                height: "140px",
                                                borderRadius: "5px",
                                                gap: "30px",
                                                }}
                                            >
                                                <Grid
                                                sx={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    gap: "20px",
                                                    cursor: "pointer",
                                                }}
                                                >
                                                <svg
                                                    width="35"
                                                    height="35"
                                                    viewBox="0 0 41 41"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                    d="M8.54167 35.875C7.60208 35.875 6.79746 35.5407 6.12779 34.8722C5.45926 34.2025 5.125 33.3979 5.125 32.4583V15.375C5.125 14.4354 5.45926 13.6308 6.12779 12.9611C6.79746 12.2926 7.60208 11.9583 8.54167 11.9583H15.375V15.375H8.54167V32.4583H32.4583V15.375H25.625V11.9583H32.4583C33.3979 11.9583 34.2025 12.2926 34.8722 12.9611C35.5407 13.6308 35.875 14.4354 35.875 15.375V32.4583C35.875 33.3979 35.5407 34.2025 34.8722 34.8722C34.2025 35.5407 33.3979 35.875 32.4583 35.875H8.54167ZM20.5 27.3333L13.6667 20.5L16.0583 18.1083L18.7917 20.799V0H22.2083V20.799L24.9417 18.1083L27.3333 20.5L20.5 27.3333Z"
                                                    fill="#757575"
                                                    />
                                                </svg>
                                                <Typography variant="h28" color="#757575">
                                                    Order Placed
                                                </Typography>
                                                </Grid>
                                                <Divider
                                                orientation="horizontal"
                                                sx={{ width: "100px", marginTop: "-40px" }}
                                                color="#F5E9EB"
                                                />
                                                <Grid
                                                sx={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    gap: "20px",
                                                    cursor: "pointer",
                                                }}
                                                >
                                                <svg
                                                    width="35"
                                                    height="35"
                                                    viewBox="0 0 48 48"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                    d="M6 24H24V27H6V24ZM3 16.5H18V19.5H3V16.5Z"
                                                    fill="#757575"
                                                    />
                                                    <path
                                                    d="M44.8785 24.909L40.3785 14.409C40.263 14.1391 40.0708 13.9091 39.8258 13.7475C39.5807 13.5859 39.2936 13.4998 39 13.5H34.5V10.5C34.5 10.1022 34.342 9.72064 34.0607 9.43934C33.7794 9.15804 33.3978 9 33 9H9.00001V12H31.5V30.834C30.8165 31.2309 30.2183 31.7592 29.74 32.3884C29.2617 33.0176 28.9126 33.7352 28.713 34.5H19.287C18.9219 33.086 18.0537 31.8537 16.845 31.0341C15.6363 30.2145 14.1702 29.8638 12.7215 30.0478C11.2728 30.2318 9.94091 30.9379 8.97553 32.0337C8.01015 33.1294 7.47754 34.5396 7.47754 36C7.47754 37.4604 8.01015 38.8706 8.97553 39.9663C9.94091 41.0621 11.2728 41.7682 12.7215 41.9522C14.1702 42.1362 15.6363 41.7855 16.845 40.9659C18.0537 40.1463 18.9219 38.914 19.287 37.5H28.713C29.0393 38.7874 29.7856 39.9292 30.8337 40.7448C31.8818 41.5604 33.1719 42.0032 34.5 42.0032C35.8281 42.0032 37.1182 41.5604 38.1663 40.7448C39.2145 39.9292 39.9607 38.7874 40.287 37.5H43.5C43.8978 37.5 44.2794 37.342 44.5607 37.0607C44.842 36.7794 45 36.3978 45 36V25.5C45.0001 25.2968 44.9587 25.0957 44.8785 24.909ZM13.5 39C12.9067 39 12.3267 38.8241 11.8333 38.4944C11.34 38.1648 10.9554 37.6962 10.7284 37.1481C10.5013 36.5999 10.4419 35.9967 10.5577 35.4147C10.6734 34.8328 10.9591 34.2982 11.3787 33.8787C11.7983 33.4591 12.3328 33.1734 12.9147 33.0576C13.4967 32.9419 14.0999 33.0013 14.6481 33.2284C15.1962 33.4554 15.6648 33.8399 15.9944 34.3333C16.3241 34.8266 16.5 35.4067 16.5 36C16.4992 36.7954 16.1829 37.558 15.6205 38.1204C15.058 38.6829 14.2954 38.9992 13.5 39ZM34.5 16.5H38.01L41.226 24H34.5V16.5ZM34.5 39C33.9067 39 33.3267 38.8241 32.8333 38.4944C32.34 38.1648 31.9554 37.6962 31.7284 37.1481C31.5013 36.5999 31.4419 35.9967 31.5577 35.4147C31.6734 34.8328 31.9591 34.2982 32.3787 33.8787C32.7983 33.4591 33.3328 33.1734 33.9147 33.0576C34.4967 32.9419 35.0999 33.0013 35.6481 33.2284C36.1962 33.4554 36.6648 33.8399 36.9944 34.3333C37.3241 34.8266 37.5 35.4067 37.5 36C37.4992 36.7954 37.1829 37.558 36.6205 38.1204C36.058 38.6829 35.2954 38.9992 34.5 39ZM42 34.5H40.287C39.9566 33.2151 39.2092 32.0763 38.1619 31.2619C37.1146 30.4475 35.8267 30.0037 34.5 30V27H42V34.5Z"
                                                    fill="#757575"
                                                    />
                                                </svg>
                                                <Typography variant="h28" color="#757575">
                                                    Post
                                                </Typography>
                                                </Grid>
                                                <Divider
                                                orientation="horizontal"
                                                sx={{ width: "100px", marginTop: "-40px" }}
                                                color="#F5E9EB"
                                                />
                                                <Grid
                                                sx={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    gap: "20px",
                                                    cursor: "pointer",
                                                }}
                                                >
                                                <svg
                                                    width="35"
                                                    height="35"
                                                    viewBox="0 0 40 42"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                    d="M20 3.5C19.6667 3.5 19.3333 3.675 19 3.85L5.83333 11.55C5.33333 11.9 5 12.425 5 13.125V28.875C5 29.575 5.33333 30.1 5.83333 30.45L19 38.15C19.3333 38.325 19.6667 38.5 20 38.5C20.3333 38.5 20.6667 38.325 21 38.15L22.5 37.275C22 36.225 21.8333 35 21.6667 33.775V22.05L31.6667 16.1V22.75C32.8333 22.75 34 22.925 35 23.275V13.125C35 12.425 34.6667 11.9 34.1667 11.55L21 3.85C20.6667 3.675 20.3333 3.5 20 3.5ZM20 7.35L30 13.125L26.6667 15.05L16.8333 9.1L20 7.35ZM13.5 11.025L23.3333 17.15L20 19.075L10 13.125L13.5 11.025ZM8.33333 16.1L18.3333 22.05V33.775L8.33333 27.825V16.1ZM35.5 27.65L29.5 33.95L26.8333 31.15L25 33.25L29.6667 38.5L37.6667 30.1L35.5 27.65Z"
                                                    fill="#757575"
                                                    />
                                                </svg>
                    
                                                <Typography variant="h28" color="#757575">
                                                    Delivered
                                                </Typography>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid
                                        sx={{
                                            backgroundColor: "White.main",
                                            borderRadius: "5px",
                                            marginTop: "2px",
                                            padding: "27px 37px",
                                        }}
                                        >
                                            <Grid xs={12} display='flex' justifyContent='center' alignItems='center' flexWrap='wrap'>
                                                <Grid xs={6} display="flex" justifyContent='end' >
                                                    <Grid width="212px" height="42px" borderRadius="5px" display="flex" justifyContent='center' alignItems='center'  sx={{background: "rgba(245, 233, 235, 0.5)"}}>
                                                        <Typography variant="h35" color="G1.main">Tracking Number</Typography>
                                                    </Grid>
                                                </Grid>
                                                <Grid xs={6} >
                                                    <Grid width="212px" height="42px" borderRadius="5px" display="flex" justifyContent='center'  alignItems='center'  ml="1px" sx={{background: "rgba(245, 233, 235, 0.5)"}}>
                                                        -
                                                    </Grid>
                                                </Grid>
                                                <Grid xs={6} mt="1px" display="flex" justifyContent='end' alignItems='center'>
                                                    <Grid width="212px" height="42px" borderRadius="5px" display="flex" justifyContent='center'  alignItems='center' sx={{background: "rgba(245, 233, 235, 0.5)"}}>
                                                        <Typography variant="h35" justifyContent='center'  color="G1.main">Delivered to Post</Typography>
                                                    </Grid>
                                                </Grid>
                                                <Grid xs={6} mt="1px" >
                                                    <Grid width="212px" height="42px" borderRadius="5px" ml="1px" display="flex" justifyContent='center'  alignItems='center'  sx={{background: "rgba(245, 233, 235, 0.5)"}}>
                                                        -
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </AccordionDetails>
                                </Accordion>
                            </Grid>
                        );
                    } 
                    })}
                </Grid>
            </Hidden>
            <Hidden mdUp>
                <Grid
                    container
                    xs={12}
                >
                    <Grid
                    xs={12}
                    md={12}
                    container
                    sx={{
                        display: "flex",
                        flexDirection:'column',
                        justifyContent: "center",
                        alignItems: "center",
                        height:'250px',
                        marginTop: "4px",
                        backgroundColor: "White.main",
                    }}
                    >
                        
                        <Grid width="280px" height="48px">
                            <Grid
                                xs={12}
                                md={12}
                                sx={[{
                                display: "flex",
                                alignItems: "center",
                                cursor: "pointer",
                                },ordersFilter == "In Progress"&&{background:"rgba(117, 117, 117, 0.1)"}]}
                                onClick={() => {
                                setOrdersFilter("In Progress");
                                }}
                            >
                                <Divider
                                    orientation="vertical"
                                    sx={{ height: "48px",width:"3px", mr:"19px",border:0 }}
                                    color={ordersFilter == "In Progress"?"#CB929B":"#F5E9EB"} 
                                    
                                />
                                <svg
                                width="35"
                                height="35"
                                viewBox="0 0 41 41"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                >
                                <path
                                    d="M14.7347 14.5209H7.0472C6.59412 14.5209 6.1596 14.3409 5.83923 14.0206C5.51885 13.7002 5.33887 13.2657 5.33887 12.8126V5.12508C5.33887 4.672 5.51885 4.23748 5.83923 3.91711C6.1596 3.59673 6.59412 3.41675 7.0472 3.41675C7.50028 3.41675 7.9348 3.59673 8.25517 3.91711C8.57555 4.23748 8.75553 4.672 8.75553 5.12508V11.1042H14.7347C15.1878 11.1042 15.6223 11.2842 15.9427 11.6046C16.263 11.925 16.443 12.3595 16.443 12.8126C16.443 13.2657 16.263 13.7002 15.9427 14.0206C15.6223 14.3409 15.1878 14.5209 14.7347 14.5209Z"
                                    fill={ordersFilter == "In Progress" ? "#CB929B" : "#757575"}
                                />
                                <path
                                    d="M35.8749 22.2083C35.4218 22.2083 34.9873 22.0283 34.6669 21.7079C34.3465 21.3875 34.1665 20.953 34.1665 20.4999C34.1678 17.4925 33.1764 14.5687 31.3462 12.1823C29.516 9.79582 26.9493 8.08018 24.0444 7.30158C21.1395 6.52297 18.0588 6.72494 15.2804 7.87613C12.5019 9.02732 10.1812 11.0634 8.67819 13.6683C8.4512 14.0605 8.07773 14.3464 7.63993 14.4631C7.20214 14.5799 6.73589 14.518 6.34375 14.291C5.95161 14.064 5.66571 13.6905 5.54893 13.2528C5.43215 12.815 5.49407 12.3487 5.72106 11.9566C7.60066 8.7009 10.5022 6.15652 13.9754 4.71817C17.4487 3.27983 21.2995 3.02792 24.9306 4.00153C28.5616 4.97514 31.7698 7.11984 34.0575 10.1029C36.3453 13.086 37.5846 16.7406 37.5832 20.4999C37.5832 20.953 37.4032 21.3875 37.0828 21.7079C36.7625 22.0283 36.3279 22.2083 35.8749 22.2083ZM33.953 37.5833C33.4999 37.5833 33.0654 37.4033 32.745 37.0829C32.4246 36.7626 32.2446 36.328 32.2446 35.875V29.8958H26.2655C25.8124 29.8958 25.3779 29.7158 25.0575 29.3954C24.7371 29.0751 24.5571 28.6405 24.5571 28.1875C24.5571 27.7344 24.7371 27.2999 25.0575 26.9795C25.3779 26.6591 25.8124 26.4791 26.2655 26.4791H33.953C34.4061 26.4791 34.8406 26.6591 35.161 26.9795C35.4813 27.2999 35.6613 27.7344 35.6613 28.1875V35.875C35.6613 36.328 35.4813 36.7626 35.161 37.0829C34.8406 37.4033 34.4061 37.5833 33.953 37.5833Z"
                                    fill={ordersFilter == "In Progress" ? "#CB929B" : "#757575"}
                                />
                                <path
                                    d="M20.5003 37.5834C15.9712 37.578 11.6291 35.7764 8.42658 32.5738C5.22401 29.3713 3.42242 25.0292 3.41699 20.5001C3.41699 20.047 3.59698 19.6125 3.91735 19.2921C4.23773 18.9717 4.67225 18.7917 5.12533 18.7917C5.5784 18.7917 6.01292 18.9717 6.3333 19.2921C6.65367 19.6125 6.83366 20.047 6.83366 20.5001C6.83236 23.5075 7.82374 26.4313 9.65396 28.8178C11.4842 31.2042 14.0509 32.9198 16.9558 33.6985C19.8607 34.4771 22.9414 34.2751 25.7198 33.1239C28.4982 31.9727 30.819 29.9367 32.322 27.3317C32.4344 27.1375 32.5839 26.9674 32.7621 26.831C32.9402 26.6947 33.1435 26.5947 33.3602 26.5369C33.577 26.4791 33.8031 26.4645 34.0255 26.494C34.2479 26.5236 34.4623 26.5966 34.6564 26.709C34.8506 26.8214 35.0207 26.971 35.1571 27.1491C35.2935 27.3272 35.3934 27.5305 35.4512 27.7473C35.5091 27.964 35.5236 28.1901 35.4941 28.4125C35.4646 28.6349 35.3915 28.8493 35.2791 29.0435C33.7766 31.6341 31.6215 33.7858 29.0285 35.2842C26.4355 36.7826 23.4951 37.5753 20.5003 37.5834Z"
                                    fill={ordersFilter == "In Progress" ? "#CB929B" : "#757575"}
                                />
                                </svg>
                                <Typography variant="h28" color="#757575" ml="32px">
                                In Progress
                                </Typography>
                            </Grid>
                        </Grid>
                        
                        <Grid width="280px" height="48px">
                            <Grid
                            
                                xs={12}
                                sx={[{
                                display: "flex",
                                alignItems: "center",
                                cursor: "pointer",
                                },ordersFilter == "Delivered"&&{background:"rgba(117, 117, 117, 0.1)"}]}
                                onClick={() => {
                                    setOrdersFilter("Delivered");
                                }}
                            >
                                <Divider
                                    orientation="vertical"
                                    sx={{ height: "48px",width:"3px", mr:"16px" ,border:0}}
                                    color={ordersFilter == "Delivered"?"#CB929B":"#F5E9EB"} 
                                />
                                <svg
                                width="40"
                                height="40"
                                viewBox="0 0 40 42"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M20 3.5C19.6667 3.5 19.3333 3.675 19 3.85L5.83333 11.55C5.33333 11.9 5 12.425 5 13.125V28.875C5 29.575 5.33333 30.1 5.83333 30.45L19 38.15C19.3333 38.325 19.6667 38.5 20 38.5C20.3333 38.5 20.6667 38.325 21 38.15L22.5 37.275C22 36.225 21.8333 35 21.6667 33.775V22.05L31.6667 16.1V22.75C32.8333 22.75 34 22.925 35 23.275V13.125C35 12.425 34.6667 11.9 34.1667 11.55L21 3.85C20.6667 3.675 20.3333 3.5 20 3.5ZM20 7.35L30 13.125L26.6667 15.05L16.8333 9.1L20 7.35ZM13.5 11.025L23.3333 17.15L20 19.075L10 13.125L13.5 11.025ZM8.33333 16.1L18.3333 22.05V33.775L8.33333 27.825V16.1ZM35.5 27.65L29.5 33.95L26.8333 31.15L25 33.25L29.6667 38.5L37.6667 30.1L35.5 27.65Z"
                                        fill={ordersFilter == "Delivered" ? "#CB929B" : "#757575"}
                                    />
                                </svg>
                                <Typography variant="h28" color="#757575" ml="30px">
                                Delivered
                                </Typography>
                            </Grid>

                        </Grid>
                        <Grid width="280px" height="48px">
                            <Grid
                                xs={12}
                                sx={[{
                                display: "flex",
                                alignItems: "center",
                                cursor: "pointer",
                                },ordersFilter == "Returned"&&{background:"rgba(117, 117, 117, 0.1)"}]}
                                onClick={() => {
                                    setOrdersFilter("Returned");
                                }}
                            >
                                <Divider
                                    orientation="vertical"
                                    sx={{ height: "48px",width:"3px", mr:"15px" ,border:0}}
                                    color={ordersFilter == "Returned"?"#CB929B":"#F5E9EB"} 
                                />
                                <svg
                                width="40"
                                height="40"
                                viewBox="0 0 43 34"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                >
                                <path
                                    d="M10.6547 31.6987C13.0447 31.6987 14.9822 29.7992 14.9822 27.456C14.9822 25.1129 13.0447 23.2134 10.6547 23.2134C8.26464 23.2134 6.32715 25.1129 6.32715 27.456C6.32715 29.7992 8.26464 31.6987 10.6547 31.6987Z"
                                    stroke={ordersFilter == "Returned" ? "#CB929B" : "#757575"}
                                    stroke-width="4"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                                <path
                                    d="M32.2924 31.6987C34.6824 31.6987 36.6199 29.7992 36.6199 27.456C36.6199 25.1129 34.6824 23.2134 32.2924 23.2134C29.9023 23.2134 27.9648 25.1129 27.9648 27.456C27.9648 29.7992 29.9023 31.6987 32.2924 31.6987Z"
                                    stroke={ordersFilter == "Returned" ? "#CB929B" : "#757575"}
                                    stroke-width="4"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                                <path
                                    d="M6.32751 27.456H2V4.12133C2 3.55872 2.22797 3.01915 2.63375 2.62132C3.03953 2.2235 3.58989 2 4.16376 2H23.6376V14.728H12.8188L17.1463 18.9706M17.1463 10.4853L12.8188 14.728M14.9825 27.456H27.9651M23.6376 4.12133H34.4564L40.9476 14.728V27.456H36.6201"
                                    stroke={ordersFilter == "Returned" ? "#CB929B" : "#757575"}
                                    stroke-width="4"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                                </svg>
                                <Typography variant="h28" color="#757575" ml="32px">
                                Returned
                                </Typography>
                            </Grid>

                        </Grid>
                        <Grid width="280px" height="48px">
                            <Grid
                                xs={12}
                                sx={[{
                                display: "flex",
                                alignItems: "center",
                                cursor: "pointer",
                                },ordersFilter == "Canceled"&&{background:"rgba(117, 117, 117, 0.1)"}]}
                                onClick={() => {
                                    setOrdersFilter("Canceled");
                                }}
                            >
                                <Divider
                                    orientation="vertical"
                                    sx={{ height: "48px",width:"3px", mr:"15px",border:0 }}
                                    color={ordersFilter == "Canceled"?"#CB929B":"#F5E9EB"} 
                                />
                                <svg
                                width="40"
                                height="40"
                                viewBox="0 0 41 42"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                >
                                <path
                                    d="M14.5956 29.4L20.4996 23.352L26.4036 29.4L28.6996 27.048L22.7956 21L28.6996 14.952L26.4036 12.6L20.4996 18.648L14.5956 12.6L12.2996 14.952L18.2036 21L12.2996 27.048L14.5956 29.4ZM20.4996 37.8C18.2309 37.8 16.0989 37.3587 14.1036 36.4761C12.1083 35.5947 10.3726 34.398 8.89661 32.886C7.42061 31.374 6.25238 29.596 5.39193 27.552C4.53038 25.508 4.09961 23.324 4.09961 21C4.09961 18.676 4.53038 16.492 5.39193 14.448C6.25238 12.404 7.42061 10.626 8.89661 9.11395C10.3726 7.60195 12.1083 6.40467 14.1036 5.52211C16.0989 4.64067 18.2309 4.19995 20.4996 4.19995C22.7683 4.19995 24.9003 4.64067 26.8956 5.52211C28.8909 6.40467 30.6266 7.60195 32.1026 9.11395C33.5786 10.626 34.7468 12.404 35.6073 14.448C36.4688 16.492 36.8996 18.676 36.8996 21C36.8996 23.324 36.4688 25.508 35.6073 27.552C34.7468 29.596 33.5786 31.374 32.1026 32.886C30.6266 34.398 28.8909 35.5947 26.8956 36.4761C24.9003 37.3587 22.7683 37.8 20.4996 37.8ZM20.4996 34.44C24.1623 34.44 27.2646 33.138 29.8066 30.534C32.3486 27.93 33.6196 24.752 33.6196 21C33.6196 17.248 32.3486 14.07 29.8066 11.466C27.2646 8.86195 24.1623 7.55995 20.4996 7.55995C16.8369 7.55995 13.7346 8.86195 11.1926 11.466C8.65061 14.07 7.37961 17.248 7.37961 21C7.37961 24.752 8.65061 27.93 11.1926 30.534C13.7346 33.138 16.8369 34.44 20.4996 34.44Z"
                                    fill={ordersFilter == "Canceled" ? "#CB929B" : "#757575"}
                                />
                                </svg>
                                <Typography variant="h28" color="#757575" ml="33px">
                                    Canceled
                                </Typography>
                            </Grid>

                        </Grid>


                    </Grid>
                    {orders.map((order, index) => {
                        let isClick = "";
                        let status = -1;
                        if (ordersFilter=="In Progress") {
                            status = 0;
                        }else if (ordersFilter=="Delivered") {
                            status = 2;
                        }else if (ordersFilter=="Returned") {
                            status = 1;
                        }   


                    if (order.status == status) {
                        return (
                        <Grid
                            xs={12}
                            bgcolor="GrayLight.main"
                            sx={{
                            borderRadius: "5px",
                            marginTop: "5px",
                            }}
                        >
                            <Accordion
                            
                            elevation={0}
                            onClick={() => {
                                setSelectedRow(order);
                                orderDetails(order.id);
                                getAddress(order.user_id, order.user_address_id);
                            }}
                            defaultExpanded={false}
                            sx={{
                                backgroundColor: "GrayLight.main",
                                borderRadius: "5px",
                                padding: 0,
                                "&: .css-sh22l5-MuiButtonBase-root-MuiAccordionSummary-root":
                                {
                                    padding: 0,
                                    borderRadius: "5px",
                                }
                            }}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    sx={{
                                    borderRadius: "5px",
                                    backgroundColor: "White.main",
                                    }}
                                    onClick={() => {
                                    if (isClick == "") {
                                        let accordion = [...openAcordianDetail];
                                        if (accordion[index] != undefined) {
                                        accordion[index] = !accordion[index];
                                        } else accordion[index] = true;
            
                                        setOpenAcordionDetail(accordion);
                                    }
                                    isClick = "";
                                    }}
                                >
                                    <Grid
                                    xs={12}
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "start",
                                        justifyContent: "center",
                                        gap: "11px",
                                        paddingLeft: "10px",
                                        borderRadius: "5px",
                                    }}
                                    >
                                    <Typography
                                        variant="h35"
                                        sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        color: "G1.main",
                                        }}
                                    >
                                        Order Code:
                                        <Typography
                                        variant="h35"
                                        sx={{
                                            fontWeight: 400,
                                            color: "G2.main",
                                            marginLeft: "5px",
                                        }}
                                        >
                                        {order.code.split("ord-")}
                                        </Typography>
                                    </Typography>
                                    <Typography
                                        variant="h35"
                                        sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        color: "G1.main",
                                        }}
                                    >
                                        Date:
                                        <Typography
                                        variant="h35"
                                        sx={{
                                            fontWeight: 400,
                                            color: "G2.main",
                                            marginLeft: "5px",
                                        }}
                                        >
                                        {moment(order.createdAt).format("YYYY/MM/DD")}
                                        </Typography>
                                    </Typography>
                                    <Typography
                                        variant="h35"
                                        sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        color: "G1.main",
                                        }}
                                    >
                                        Total Price:
                                        <Typography
                                        variant="h35"
                                        sx={{
                                            fontWeight: 400,
                                            color: "G2.main",
                                            marginLeft: "5px",
                                        }}
                                        >
                                        {order.total_price} KWD
                                        </Typography>
                                    </Typography>
                                    </Grid>
                                </AccordionSummary>
                                <AccordionDetails
                                    sx={{
                                    padding: 0,
                                    marginTop: "2px",
                                    }}
                                >
                                    <Grid
                                    sx={{
                                        backgroundColor: "#F9F9F9",
                                        border: "1px solid #E0E0E0",
                                        borderRight:0,
                                        borderLeft:0,
                                        height: "140px",
                                    }}
                                    >
                                        <Grid
                                            xs={12}
                                            container
                                            sx={{
                                            display: "flex",
                                            flexDirection: "row",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            height: "140px",
                                            borderRadius: "5px",
                                            gap: {xs:"2px",sm:"10px"},
                                            }}
                                        >
                                            <Grid
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                gap: "20px",
                                                cursor: "pointer",
                                            }}
                                            >
                                            <svg
                                                width="35"
                                                height="35"
                                                viewBox="0 0 41 41"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                d="M8.54167 35.875C7.60208 35.875 6.79746 35.5407 6.12779 34.8722C5.45926 34.2025 5.125 33.3979 5.125 32.4583V15.375C5.125 14.4354 5.45926 13.6308 6.12779 12.9611C6.79746 12.2926 7.60208 11.9583 8.54167 11.9583H15.375V15.375H8.54167V32.4583H32.4583V15.375H25.625V11.9583H32.4583C33.3979 11.9583 34.2025 12.2926 34.8722 12.9611C35.5407 13.6308 35.875 14.4354 35.875 15.375V32.4583C35.875 33.3979 35.5407 34.2025 34.8722 34.8722C34.2025 35.5407 33.3979 35.875 32.4583 35.875H8.54167ZM20.5 27.3333L13.6667 20.5L16.0583 18.1083L18.7917 20.799V0H22.2083V20.799L24.9417 18.1083L27.3333 20.5L20.5 27.3333Z"
                                                fill="#757575"
                                                />
                                            </svg>
                                            <Typography variant="h28" color="#757575" >
                                                Order Placed
                                            </Typography>
                                            </Grid>
                                            
                                            <Divider
                                            orientation="horizontal"
                                            sx={{ width:window.innerWidth>422? "100px":window.innerWidth>365?"70px":"30px", marginTop: "-40px" }}
                                            color="#F5E9EB"
                                            />
                                            <Grid
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                gap: "20px",
                                                cursor: "pointer",
                                            }}
                                            >
                                            <svg
                                                width="35"
                                                height="35"
                                                viewBox="0 0 48 48"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                d="M6 24H24V27H6V24ZM3 16.5H18V19.5H3V16.5Z"
                                                fill="#757575"
                                                />
                                                <path
                                                d="M44.8785 24.909L40.3785 14.409C40.263 14.1391 40.0708 13.9091 39.8258 13.7475C39.5807 13.5859 39.2936 13.4998 39 13.5H34.5V10.5C34.5 10.1022 34.342 9.72064 34.0607 9.43934C33.7794 9.15804 33.3978 9 33 9H9.00001V12H31.5V30.834C30.8165 31.2309 30.2183 31.7592 29.74 32.3884C29.2617 33.0176 28.9126 33.7352 28.713 34.5H19.287C18.9219 33.086 18.0537 31.8537 16.845 31.0341C15.6363 30.2145 14.1702 29.8638 12.7215 30.0478C11.2728 30.2318 9.94091 30.9379 8.97553 32.0337C8.01015 33.1294 7.47754 34.5396 7.47754 36C7.47754 37.4604 8.01015 38.8706 8.97553 39.9663C9.94091 41.0621 11.2728 41.7682 12.7215 41.9522C14.1702 42.1362 15.6363 41.7855 16.845 40.9659C18.0537 40.1463 18.9219 38.914 19.287 37.5H28.713C29.0393 38.7874 29.7856 39.9292 30.8337 40.7448C31.8818 41.5604 33.1719 42.0032 34.5 42.0032C35.8281 42.0032 37.1182 41.5604 38.1663 40.7448C39.2145 39.9292 39.9607 38.7874 40.287 37.5H43.5C43.8978 37.5 44.2794 37.342 44.5607 37.0607C44.842 36.7794 45 36.3978 45 36V25.5C45.0001 25.2968 44.9587 25.0957 44.8785 24.909ZM13.5 39C12.9067 39 12.3267 38.8241 11.8333 38.4944C11.34 38.1648 10.9554 37.6962 10.7284 37.1481C10.5013 36.5999 10.4419 35.9967 10.5577 35.4147C10.6734 34.8328 10.9591 34.2982 11.3787 33.8787C11.7983 33.4591 12.3328 33.1734 12.9147 33.0576C13.4967 32.9419 14.0999 33.0013 14.6481 33.2284C15.1962 33.4554 15.6648 33.8399 15.9944 34.3333C16.3241 34.8266 16.5 35.4067 16.5 36C16.4992 36.7954 16.1829 37.558 15.6205 38.1204C15.058 38.6829 14.2954 38.9992 13.5 39ZM34.5 16.5H38.01L41.226 24H34.5V16.5ZM34.5 39C33.9067 39 33.3267 38.8241 32.8333 38.4944C32.34 38.1648 31.9554 37.6962 31.7284 37.1481C31.5013 36.5999 31.4419 35.9967 31.5577 35.4147C31.6734 34.8328 31.9591 34.2982 32.3787 33.8787C32.7983 33.4591 33.3328 33.1734 33.9147 33.0576C34.4967 32.9419 35.0999 33.0013 35.6481 33.2284C36.1962 33.4554 36.6648 33.8399 36.9944 34.3333C37.3241 34.8266 37.5 35.4067 37.5 36C37.4992 36.7954 37.1829 37.558 36.6205 38.1204C36.058 38.6829 35.2954 38.9992 34.5 39ZM42 34.5H40.287C39.9566 33.2151 39.2092 32.0763 38.1619 31.2619C37.1146 30.4475 35.8267 30.0037 34.5 30V27H42V34.5Z"
                                                fill="#757575"
                                                />
                                            </svg>
                                            <Typography variant="h28" color="#757575">
                                                Post
                                            </Typography>
                                            </Grid>
                                            <Divider
                                            orientation="horizontal"
                                            sx={{ width:window.innerWidth>422? "100px":window.innerWidth>365?"70px":"30px", marginTop: "-40px" }}
                                            color="#F5E9EB"
                                            />
                                            <Grid
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                gap: "20px",
                                                cursor: "pointer",
                                            }}
                                            >
                                            <svg
                                                width="35"
                                                height="35"
                                                viewBox="0 0 40 42"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                d="M20 3.5C19.6667 3.5 19.3333 3.675 19 3.85L5.83333 11.55C5.33333 11.9 5 12.425 5 13.125V28.875C5 29.575 5.33333 30.1 5.83333 30.45L19 38.15C19.3333 38.325 19.6667 38.5 20 38.5C20.3333 38.5 20.6667 38.325 21 38.15L22.5 37.275C22 36.225 21.8333 35 21.6667 33.775V22.05L31.6667 16.1V22.75C32.8333 22.75 34 22.925 35 23.275V13.125C35 12.425 34.6667 11.9 34.1667 11.55L21 3.85C20.6667 3.675 20.3333 3.5 20 3.5ZM20 7.35L30 13.125L26.6667 15.05L16.8333 9.1L20 7.35ZM13.5 11.025L23.3333 17.15L20 19.075L10 13.125L13.5 11.025ZM8.33333 16.1L18.3333 22.05V33.775L8.33333 27.825V16.1ZM35.5 27.65L29.5 33.95L26.8333 31.15L25 33.25L29.6667 38.5L37.6667 30.1L35.5 27.65Z"
                                                fill="#757575"
                                                />
                                            </svg>
                
                                            <Typography variant="h28" color="#757575">
                                                Delivered
                                            </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid
                                    sx={{
                                        backgroundColor: "White.main",
                                        marginTop: "8px",
                                        padding: "27px 37px",
                                    }}
                                    >
                                        <Grid xs={12} display='flex' justifyContent='center' alignItems='center' flexWrap='wrap'>
                                            <Grid xs={6} display="flex" justifyContent='end' >
                                                <Grid width={window.innerWidth>452?"212px":"200px"} height="42px" borderRadius="5px" display="flex" justifyContent='center' alignItems='center'  sx={{background: "rgba(245, 233, 235, 0.5)"}}>
                                                    <Typography variant="h35" color="G1.main">Tracking Number</Typography>
                                                </Grid>
                                            </Grid>
                                            <Grid xs={6} >
                                                <Grid width={window.innerWidth>452?"212px":"200px"} height="42px" borderRadius="5px" display="flex" justifyContent='center'  alignItems='center'  ml="1px" sx={{background: "rgba(245, 233, 235, 0.5)"}}>
                                                    -
                                                </Grid>
                                            </Grid>
                                            <Grid xs={6} mt="1px" display="flex" justifyContent='end' alignItems='center'>
                                                <Grid width={window.innerWidth>452?"212px":"200px"} height="42px" borderRadius="5px" display="flex" justifyContent='center'  alignItems='center' sx={{background: "rgba(245, 233, 235, 0.5)"}}>
                                                    <Typography variant="h35" justifyContent='center'  color="G1.main">Delivered to Post</Typography>
                                                </Grid>
                                            </Grid>
                                            <Grid xs={6} mt="1px" >
                                                <Grid width={window.innerWidth>452?"212px":"200px"} height="42px" borderRadius="5px" ml="1px" display="flex" justifyContent='center'  alignItems='center'  sx={{background: "rgba(245, 233, 235, 0.5)"}}>
                                                    -
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>
                        </Grid>
                        );
                    }else if (ordersFilter =="") {
                        
                        return (
                            <Grid
                                xs={12}
                                bgcolor="GrayLight.main"
                                sx={{
                                borderRadius: "5px",
                                marginTop: "5px",
                                }}
                            >
                                <Accordion
                                
                                elevation={0}
                                onClick={() => {
                                    setSelectedRow(order);
                                    orderDetails(order.id);
                                    getAddress(order.user_id, order.user_address_id);
                                }}
                                defaultExpanded={false}
                                sx={{
                                    backgroundColor: "GrayLight.main",
                                    borderRadius: "5px",
                                    padding: 0,
                                    "&: .css-sh22l5-MuiButtonBase-root-MuiAccordionSummary-root":
                                    {
                                        padding: 0,
                                        borderRadius: "5px",
                                    }
                                }}
                                >
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        sx={{
                                        borderRadius: "5px",
                                        backgroundColor: "White.main",
                                        }}
                                        onClick={() => {
                                        if (isClick == "") {
                                            let accordion = [...openAcordianDetail];
                                            if (accordion[index] != undefined) {
                                            accordion[index] = !accordion[index];
                                            } else accordion[index] = true;
                
                                            setOpenAcordionDetail(accordion);
                                        }
                                        isClick = "";
                                        }}
                                    >
                                        <Grid
                                        xs={12}
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "start",
                                            justifyContent: "center",
                                            gap: "11px",
                                            paddingLeft: "10px",
                                            borderRadius: "5px",
                                        }}
                                        >
                                        <Typography
                                            variant="h35"
                                            sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            color: "G1.main",
                                            }}
                                        >
                                            Order Code:
                                            <Typography
                                            variant="h35"
                                            sx={{
                                                fontWeight: 400,
                                                color: "G2.main",
                                                marginLeft: "5px",
                                            }}
                                            >
                                            {order.code.split("ord-")}
                                            </Typography>
                                        </Typography>
                                        <Typography
                                            variant="h35"
                                            sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            color: "G1.main",
                                            }}
                                        >
                                            Date:
                                            <Typography
                                            variant="h35"
                                            sx={{
                                                fontWeight: 400,
                                                color: "G2.main",
                                                marginLeft: "5px",
                                            }}
                                            >
                                            {moment(order.createdAt).format("YYYY/MM/DD")}
                                            </Typography>
                                        </Typography>
                                        <Typography
                                            variant="h35"
                                            sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            color: "G1.main",
                                            }}
                                        >
                                            Total Price:
                                            <Typography
                                            variant="h35"
                                            sx={{
                                                fontWeight: 400,
                                                color: "G2.main",
                                                marginLeft: "5px",
                                            }}
                                            >
                                            {order.total_price} KWD
                                            </Typography>
                                        </Typography>
                                        </Grid>
                                    </AccordionSummary>
                                    <AccordionDetails
                                        sx={{
                                        padding: 0,
                                        marginTop: "2px",
                                        }}
                                    >
                                        <Grid
                                        sx={{
                                            backgroundColor: "#F9F9F9",
                                            border: "1px solid #E0E0E0",
                                            borderRight:0,
                                            borderLeft:0,
                                            height: "140px",
                                        }}
                                        >
                                            <Grid
                                                xs={12}
                                                container
                                                sx={{
                                                display: "flex",
                                                flexDirection: "row",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                height: "140px",
                                                borderRadius: "5px",
                                                gap: {xs:"2px",sm:"10px"},
                                                }}
                                            >
                                                <Grid
                                                sx={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    gap: "20px",
                                                    cursor: "pointer",
                                                }}
                                                >
                                                <svg
                                                    width="35"
                                                    height="35"
                                                    viewBox="0 0 41 41"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                    d="M8.54167 35.875C7.60208 35.875 6.79746 35.5407 6.12779 34.8722C5.45926 34.2025 5.125 33.3979 5.125 32.4583V15.375C5.125 14.4354 5.45926 13.6308 6.12779 12.9611C6.79746 12.2926 7.60208 11.9583 8.54167 11.9583H15.375V15.375H8.54167V32.4583H32.4583V15.375H25.625V11.9583H32.4583C33.3979 11.9583 34.2025 12.2926 34.8722 12.9611C35.5407 13.6308 35.875 14.4354 35.875 15.375V32.4583C35.875 33.3979 35.5407 34.2025 34.8722 34.8722C34.2025 35.5407 33.3979 35.875 32.4583 35.875H8.54167ZM20.5 27.3333L13.6667 20.5L16.0583 18.1083L18.7917 20.799V0H22.2083V20.799L24.9417 18.1083L27.3333 20.5L20.5 27.3333Z"
                                                    fill="#757575"
                                                    />
                                                </svg>
                                                <Typography variant="h28" color="#757575">
                                                    Order Placed
                                                </Typography>
                                                </Grid>
                                                <Divider
                                                orientation="horizontal"
                                                sx={{width:window.innerWidth>422? "100px":window.innerWidth>365?"70px":"30px", marginTop: "-40px" }}
                                                color="#F5E9EB"
                                                />
                                                <Grid
                                                sx={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    gap: "20px",
                                                    cursor: "pointer",
                                                }}
                                                >
                                                <svg
                                                    width="35"
                                                    height="35"
                                                    viewBox="0 0 48 48"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                    d="M6 24H24V27H6V24ZM3 16.5H18V19.5H3V16.5Z"
                                                    fill="#757575"
                                                    />
                                                    <path
                                                    d="M44.8785 24.909L40.3785 14.409C40.263 14.1391 40.0708 13.9091 39.8258 13.7475C39.5807 13.5859 39.2936 13.4998 39 13.5H34.5V10.5C34.5 10.1022 34.342 9.72064 34.0607 9.43934C33.7794 9.15804 33.3978 9 33 9H9.00001V12H31.5V30.834C30.8165 31.2309 30.2183 31.7592 29.74 32.3884C29.2617 33.0176 28.9126 33.7352 28.713 34.5H19.287C18.9219 33.086 18.0537 31.8537 16.845 31.0341C15.6363 30.2145 14.1702 29.8638 12.7215 30.0478C11.2728 30.2318 9.94091 30.9379 8.97553 32.0337C8.01015 33.1294 7.47754 34.5396 7.47754 36C7.47754 37.4604 8.01015 38.8706 8.97553 39.9663C9.94091 41.0621 11.2728 41.7682 12.7215 41.9522C14.1702 42.1362 15.6363 41.7855 16.845 40.9659C18.0537 40.1463 18.9219 38.914 19.287 37.5H28.713C29.0393 38.7874 29.7856 39.9292 30.8337 40.7448C31.8818 41.5604 33.1719 42.0032 34.5 42.0032C35.8281 42.0032 37.1182 41.5604 38.1663 40.7448C39.2145 39.9292 39.9607 38.7874 40.287 37.5H43.5C43.8978 37.5 44.2794 37.342 44.5607 37.0607C44.842 36.7794 45 36.3978 45 36V25.5C45.0001 25.2968 44.9587 25.0957 44.8785 24.909ZM13.5 39C12.9067 39 12.3267 38.8241 11.8333 38.4944C11.34 38.1648 10.9554 37.6962 10.7284 37.1481C10.5013 36.5999 10.4419 35.9967 10.5577 35.4147C10.6734 34.8328 10.9591 34.2982 11.3787 33.8787C11.7983 33.4591 12.3328 33.1734 12.9147 33.0576C13.4967 32.9419 14.0999 33.0013 14.6481 33.2284C15.1962 33.4554 15.6648 33.8399 15.9944 34.3333C16.3241 34.8266 16.5 35.4067 16.5 36C16.4992 36.7954 16.1829 37.558 15.6205 38.1204C15.058 38.6829 14.2954 38.9992 13.5 39ZM34.5 16.5H38.01L41.226 24H34.5V16.5ZM34.5 39C33.9067 39 33.3267 38.8241 32.8333 38.4944C32.34 38.1648 31.9554 37.6962 31.7284 37.1481C31.5013 36.5999 31.4419 35.9967 31.5577 35.4147C31.6734 34.8328 31.9591 34.2982 32.3787 33.8787C32.7983 33.4591 33.3328 33.1734 33.9147 33.0576C34.4967 32.9419 35.0999 33.0013 35.6481 33.2284C36.1962 33.4554 36.6648 33.8399 36.9944 34.3333C37.3241 34.8266 37.5 35.4067 37.5 36C37.4992 36.7954 37.1829 37.558 36.6205 38.1204C36.058 38.6829 35.2954 38.9992 34.5 39ZM42 34.5H40.287C39.9566 33.2151 39.2092 32.0763 38.1619 31.2619C37.1146 30.4475 35.8267 30.0037 34.5 30V27H42V34.5Z"
                                                    fill="#757575"
                                                    />
                                                </svg>
                                                <Typography variant="h28" color="#757575">
                                                    Post
                                                </Typography>
                                                </Grid>
                                                <Divider
                                                orientation="horizontal"
                                                sx={{ width:window.innerWidth>422? "100px":window.innerWidth>365?"70px":"30px", marginTop: "-40px" }}
                                                color="#F5E9EB"
                                                />
                                                <Grid
                                                sx={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    gap: "20px",
                                                    cursor: "pointer",
                                                }}
                                                >
                                                <svg
                                                    width="35"
                                                    height="35"
                                                    viewBox="0 0 40 42"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                    d="M20 3.5C19.6667 3.5 19.3333 3.675 19 3.85L5.83333 11.55C5.33333 11.9 5 12.425 5 13.125V28.875C5 29.575 5.33333 30.1 5.83333 30.45L19 38.15C19.3333 38.325 19.6667 38.5 20 38.5C20.3333 38.5 20.6667 38.325 21 38.15L22.5 37.275C22 36.225 21.8333 35 21.6667 33.775V22.05L31.6667 16.1V22.75C32.8333 22.75 34 22.925 35 23.275V13.125C35 12.425 34.6667 11.9 34.1667 11.55L21 3.85C20.6667 3.675 20.3333 3.5 20 3.5ZM20 7.35L30 13.125L26.6667 15.05L16.8333 9.1L20 7.35ZM13.5 11.025L23.3333 17.15L20 19.075L10 13.125L13.5 11.025ZM8.33333 16.1L18.3333 22.05V33.775L8.33333 27.825V16.1ZM35.5 27.65L29.5 33.95L26.8333 31.15L25 33.25L29.6667 38.5L37.6667 30.1L35.5 27.65Z"
                                                    fill="#757575"
                                                    />
                                                </svg>
                    
                                                <Typography variant="h28" color="#757575">
                                                    Delivered
                                                </Typography>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid
                                        sx={{
                                            backgroundColor: "White.main",
                                            marginTop: "8px",
                                            padding: "27px 37px",
                                        }}
                                        >
                                            <Grid xs={12} display='flex' justifyContent='center' alignItems='center' flexWrap='wrap'>
                                                <Grid xs={6} display="flex" justifyContent='end' >
                                                    <Grid width={window.innerWidth>452?"212px":"200px"} height="42px" borderRadius="5px" display="flex" justifyContent='center' alignItems='center'  sx={{background: "rgba(245, 233, 235, 0.5)"}}>
                                                        <Typography variant="h35" color="G1.main">Tracking Number</Typography>
                                                    </Grid>
                                                </Grid>
                                                <Grid xs={6} >
                                                    <Grid width={window.innerWidth>452?"212px":"200px"} height="42px" borderRadius="5px" display="flex" justifyContent='center'  alignItems='center'  ml="1px" sx={{background: "rgba(245, 233, 235, 0.5)"}}>
                                                        -
                                                    </Grid>
                                                </Grid>
                                                <Grid xs={6} mt="1px" display="flex" justifyContent='end' alignItems='center'>
                                                    <Grid width={window.innerWidth>452?"212px":"200px"} height="42px" borderRadius="5px" display="flex" justifyContent='center'  alignItems='center' sx={{background: "rgba(245, 233, 235, 0.5)"}}>
                                                        <Typography variant="h35" justifyContent='center'  color="G1.main">Delivered to Post</Typography>
                                                    </Grid>
                                                </Grid>
                                                <Grid xs={6} mt="1px" >
                                                    <Grid width={window.innerWidth>452?"212px":"200px"} height="42px" borderRadius="5px" ml="1px" display="flex" justifyContent='center'  alignItems='center'  sx={{background: "rgba(245, 233, 235, 0.5)"}}>
                                                        -
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </AccordionDetails>
                                </Accordion>
                            </Grid>
                        );
                    } 
                    })}
                </Grid>
                
            </Hidden>
        </>
      ) : (
        <Grid
          xs={12}
          mb={1}
          bgcolor="White.main"
          sx={{
            borderRadius: "5px",
            paddingLeft: "38px",
            marginTop: "5px",
            marginLeft: "35px",
            padding: "12px 25px 50px 25px",
          }}
        >
          <Grid
            xs={12}
            display="flex"
            justifyContent="space-between"
            p={2}
            alignItems="center"
          >
            <ArrowBackIcon
              sx={{ color: "Black", marginRight: "15px" }}
              onClick={() => {
                history.push("/home/profile/profile");
              }}
            />
            <Grid xs={8} display="flex" alignItems="center">
              <Typography variant="h2" pr={2}>
                Order created At:{" "}
                {moment(selectedOrderDetails.createdAt).format("YYYY/MM/DD")}
              </Typography>
              <Typography variant="h2">
                Order Code:{" "}
                {selectedOrderDetails.code !== undefined
                  ? selectedOrderDetails.code.split("ord-")
                  : ""}
              </Typography>
            </Grid>
            <Grid
              xs={4}
              sx={{ display: "flex", justifyContent: "end" }}
              color="Golden.main"
              textAlign="end"
            >
              <Grid
                xs={6}
                sx={{
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "center",
                }}
              >
                <Typography pr={2} variant="h16">
                  {" "}
                  {selectedOrderDetails.code !== undefined
                    ? selectedOrderDetails.code.split("ord-")
                    : ""}
                </Typography>
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{ height: 0.5, alignSelf: "center" }}
                />
                {selectedOrderDetails.status === "delivered" ? (
                  <Typography
                    variant="h16"
                    p={1}
                    borderRadius={1}
                    color="LightGreen.main"
                  >
                    Delivered
                  </Typography>
                ) : selectedOrderDetails.status === "order canceled" ? (
                  <Typography
                    variant="h16"
                    p={1}
                    borderRadius={1}
                    color="Red.main"
                  >
                    Canceled
                  </Typography>
                ) : selectedOrderDetails.status === "order placed" ? (
                  <Typography
                    variant="h16"
                    p={1}
                    borderRadius={1}
                    color="Orange.main"
                  >
                    Order Placed
                  </Typography>
                ) : selectedOrderDetails.status === "out for delivery" ? (
                  <Typography
                    variant="h16"
                    p={1}
                    borderRadius={1}
                    color="Yellow.main"
                  >
                    Out For Delivery
                  </Typography>
                ) : (
                  <Typography
                    variant="h16"
                    p={1}
                    borderRadius={1}
                    color="Yellow.main"
                  >
                    order placed
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Grid>
          <Divider />
          <Grid xs={12}>
            {selectedAddress !== undefined &&
            selectedAddress.address !== undefined ? (
              <Grid>
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
                        {selectedAddress.zip_code.charAt(0).toUpperCase() +
                          selectedAddress.zip_code.slice(1)}
                      </Typography>
                      <Typography p={1} variant="h2">
                        {selectedAddress.full_name.charAt(0).toUpperCase() +
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
              </Grid>
            ) : (
              ""
            )}
            <Grid>
              {selectedOrder.map((product) => {
                return (
                  <>
                    <Grid xs={12} p={1} pl={0} pr={0} display="flex">
                      {window.innerWidth > 700 && (
                        <Grid
                          xs={
                            window.innerWidth > 1300
                              ? 1
                              : window.innerWidth > 1200
                              ? 1
                              : window.innerWidth > 1100
                              ? 1.2
                              : 1.5
                          }
                        >
                          <Card
                            sx={{
                              maxWidth: "182px",
                              border: "none",
                              boxShadow: "none",
                            }}
                          >
                            <CardMedia
                              component="img"
                              height="82px"
                              width="182px"
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
                      )}
                      <Grid
                        xs={
                          window.innerWidth > 1300
                            ? 10
                            : window.innerWidth > 700
                            ? 8
                            : 9
                        }
                        mt={2}
                      >
                        <Grid>
                          <Typography ml={2} color="black" variant="h11">
                            {product.product_group.name}
                          </Typography>
                        </Grid>
                        {window.innerWidth > 700 && (
                          <Grid ml={2} mt={1} display="flex">
                            <Typography
                              variant="h10"
                              pl={1}
                              pr={1}
                              sx={{ color: "G1.main" }}
                            >
                              Unit Price: {product.product_price}
                            </Typography>
                            <Divider orientation="vertical" flexItem />
                            <Typography
                              variant="h10"
                              pl={1}
                              pr={1}
                              sx={{ color: "G1.main" }}
                            >
                              QTY: {product.quantity}
                            </Typography>
                          </Grid>
                        )}
                      </Grid>
                      <Grid
                        item
                        xs={window.innerWidth > 700 ? 2 : 3}
                        display="flex"
                        alignItems="center"
                      >
                        <Grid
                          item
                          xs={12}
                          display="flex"
                          justifyContent="flex-end"
                          pr={2}
                        >
                          <Typography>
                            {product.product_price * product.quantity} KWD
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    {window.innerWidth < 700 && (
                      <Grid
                        xs={12}
                        display="flex"
                        alignItems="center"
                        pl="16px"
                      >
                        <Grid
                          xs={
                            window.innerWidth > 632
                              ? 1.7
                              : window.innerWidth > 546
                              ? 2
                              : 2.3
                          }
                        >
                          <Card
                            sx={{
                              maxWidth: "182px",
                              border: "none",
                              boxShadow: "none",
                            }}
                          >
                            <CardMedia
                              component="img"
                              height="82px"
                              width="182px"
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
                        <Grid
                          xs="auto"
                          ml={2}
                          mt={1}
                          display="flex"
                          alignItems="center"
                        >
                          <Typography
                            variant="h10"
                            pl={1}
                            pr={1}
                            sx={{ color: "G1.main" }}
                          >
                            Unit Price: {product.product_price}
                          </Typography>
                          <Divider
                            orientation="vertical"
                            flexItem
                            sx={{ height: "20px", alignSelf: "center" }}
                          />
                          <Typography
                            variant="h10"
                            pl={1}
                            pr={1}
                            sx={{ color: "G1.main" }}
                          >
                            QTY: {product.quantity}
                          </Typography>
                        </Grid>
                      </Grid>
                    )}
                  </>
                );
              })}

              <Divider />
            </Grid>
          </Grid>
        </Grid>
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
      
    </ProfileLayout>
  );
};

export default Order;
