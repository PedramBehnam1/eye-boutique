import { Box, Button, Card, CardMedia, Checkbox, Dialog, Divider, FormControl, FormControlLabel, FormGroup, Grid, IconButton, InputLabel, MenuItem, Paper, Radio, RadioGroup, Select, TextField, Typography } from "@mui/material";
import React, { useState, useEffect, Fragment } from "react";
import axiosConfig from '../../../axiosConfig';
import AdminLayout from "../../../layout/adminLayout";
import moment from "moment";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import axios from "axios";
import Notification from '../../../layout/notification';
import ClearIcon from '@mui/icons-material/Clear';
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Link, useHistory } from "react-router-dom";
import SearchIcon from "@material-ui/icons/Search";
import Select1 from "react-select";


const AddOrder = () => {
    const [users, setusers] = useState([])
    const [selectedUser, setSelectedUser] = useState({});
    const bread = [
        {
            title: "Order",
            href: "/admin/orderlist",
        }
    ];

    const [openChangeStatus, setOpenChangeStatus] = useState(false);
    const [newStatus, setNewStatus] = useState();
    const [defaultUser, setDefaultUser] = useState(0);
    const [userStatus, setUserStatus] = useState(false);
    const [title, setTitle] = useState('');
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [apartment, setApartment] = useState('');
    const [email, setEmail] = useState('');
    const [statesName, setStatesName] = useState([]);
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [cities, setCities] = useState([]);
    const [city, setCity] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [status, setStaus] = useState(1);
    const [shoppingCart, setShoppingCart] = useState([]);
    const [totalPrice, setTotalPrice] = useState('');
    const [addresses, setAddresses] = useState([]);
    const [sort, setSort] = useState(-1);
    const [nameFilter, setNameFilter] = useState("");
    const [products, setProducts] = useState([]);
    const [count, setCount] = useState();
    const [categoryFilter, setCategoryFilter] = useState('category_id');
    const [searchFilter, setSearchFilter] = useState('name');
    const [notificationObj, setNotificationObj] = useState({
        open: false,
        type: 'success',
        message: ''
    })
    const [quantity, setQuantity] = useState(1);
    const [orders, setOrders] = useState([]);
    const [open, setOpen] = useState(false);
    const [addressId, setAddressesId] = useState(-1);
    const [paymentId, setPaymentId] = useState(1);
    const [payment, setPayment] = useState({});
    const [total_price, setTotal_Price] = useState("")
    const [isSelected, setIsSelected] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedAddProduct, setSelectedAddProduct] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    let history = useHistory();
    const [user, setUser] = useState("11");
    const [role, setRole] = useState('');

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
                            setNotificationObj({
                                open: true, type: 'error', message: `Get user info has a problem!`
                            })
                            setTimeout(
                                () => setNotificationObj({
                                    open: false,
                                    type: 'success',
                                    message: ''
                                }
                            ), 3000);
                            localStorage.setItem("token", res.data.accessToken);
                            localStorage.setItem("refreshToken", res.data.refreshToken);
                            getUserInfo();
                        })
                    }else{
                        setNotificationObj({
                            open: true, type: 'error', message: `Get user info has a problem!`
                        })
                        setTimeout(
                            () => setNotificationObj({
                                open: false,
                                type: 'success',
                                message: ''
                            }
                        ), 3000);
                    } 
            });
    };


    useEffect(() => {
        refreshList();
    }, [])
    useEffect(() => {
        users.length == 0 ? setUserStatus(true) : setUserStatus(false)
        setSelectedUser(users[defaultUser])

    }, [users])
    useEffect(() => {
        if (selectedUser != undefined) {
            getUserOrders();
        }
    }, [selectedUser])
    useEffect(() => {
        getProducts()

    }, [categoryFilter, nameFilter])


    const refreshList = () => {
        axiosConfig.get('/admin/users')
            .then(res => {

                setusers(res.data.users.filter(u => u.first_name != null && u.email != null))


            })


    };
    const getUserOrders = () => {
        axiosConfig.get(`/users/user/${selectedUser.id}/card`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },

        })
            .then(res => {
                setOrders(res.data.shoppingCard);
                setTotal_Price(res.data.total_price);

            })
    }
    const handleClickPrint = () => {
        var restorePage = document.body.innerHTML;
        var printContent = document.getElementById('print').innerHTML;
        document.body.innerHTML = printContent;
        window.print();
        document.body.innerHTML = restorePage;
    }



    const handleChangeCountryName = (e) => {
        setCountry(e.target.value)
        axios.post('https://countriesnow.space/api/v0.1/countries/states', {
            "country": e.target.value
        })
            .then(res => setStatesName(res.data.data.states))
    }

    const handleChangeStateName = (e) => {
        setState(e.target.value)
        axios.post('https://countriesnow.space/api/v0.1/countries/state/cities', {
            "country": country,
            "state": e.target.value
        })
            .then(res => setCities(res.data.data))
    }

    const getAddresses = () => {
        axiosConfig.get('/users/user/${selectedUser.id}/address')
            .then(res => {
                setAddresses(res.data.addresses)

            })
            .catch(err =>{
                if(err.response.data.error.status === 401) {
                axiosConfig.post('/users/refresh_token', { 'refresh_token': localStorage.getItem('refreshToken') })
                    .then(res => {
                        
                        setNotificationObj({
                            open: true, type: 'error', message: `Get addresses has a problem!`
                        })
                        setTimeout(
                            () => setNotificationObj({
                                open: false,
                                type: 'success',
                                message: ''
                            }
                        ), 3000);
                        localStorage.setItem('token', res.data.accessToken);
                        localStorage.setItem('refreshToken', res.data.refreshToken);
                        getAddresses();
                    })
                }else{
                    setNotificationObj({
                        open: true, type: 'error', message: `Get addresses has a problem!`
                    })
                    setTimeout(
                        () => setNotificationObj({
                            open: false,
                            type: 'success',
                            message: ''
                        }
                    ), 3000);
                }
            })

        axiosConfig.get('/users/card', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        })
            .then(res => {
                setShoppingCart(res.data.shoppingCard)
                setTotalPrice(res.data.total_price)


            })
            .catch(err =>{ 
                if(err.response.data.error.status === 401){
                axiosConfig.post('/users/refresh_token', { 'refresh_token': localStorage.getItem('refreshToken') })
                    .then(res => {
                        setNotificationObj({
                            open: true, type: 'error', message: `Get shopping carts have a problem!`
                        })
                        setTimeout(
                            () => setNotificationObj({
                                open: false,
                                type: 'success',
                                message: ''
                            }
                        ), 3000);
                        localStorage.setItem('token', res.data.accessToken);
                        localStorage.setItem('refreshToken', res.data.refreshToken);
                        getAddresses();
                    })
                }else{
                    setNotificationObj({
                        open: true, type: 'error', message: `Get shopping carts have a problem!`
                    })
                    setTimeout(
                        () => setNotificationObj({
                            open: false,
                            type: 'success',
                            message: ''
                        }
                    ), 3000);
                }
            })

    }

    const addAddress = () => {
        const addressObj = {
            "title": title,
            "full_name": fullName,
            "phone": phone,
            "address": address,
            "apartment": apartment,
            "country": country,
            "state": state,
            "city": city,
            "zip_code": zipCode,
            "email": email
        }

        axiosConfig.post(`users/user/${selectedUser.id}/address/add`, addressObj, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },

        }).then((res => {
            let id = (((res.data.persistedAddress.split("{")[1]).split(":")[1]).split(",")[0]);
            setAddressesId(id);
            setIsSelected(false);

            setNotificationObj({
                open: true, type: 'success', message: `Address Successfuly Added.`
            })
            setTimeout(
                () => setNotificationObj({
                    open: false,
                    type: 'success',
                    message: ''
                }
                ), 3000);
        }))
            .catch(err => {
                setNotificationObj({
                    open: true, type: 'error', message: `Add adrress has a problem!`
                })
                setTimeout(
                    () => setNotificationObj({
                        open: false,
                        type: 'success',
                        message: ''
                    }
                ), 3000);
            })
            .catch(err =>{ 
                setNotificationObj({
                    open: true, type: 'error', message: `${addAddress.title
                        } don't added`
                })
                setTimeout(
                () => setNotificationObj({
                    open: false,
                    type: 'success',
                    message: ''
                }
                ), 3000);
                if(err.response.data.error.status === 401) {
                    axiosConfig.post('/users/refresh_token', { 'refresh_token': localStorage.getItem('refreshToken') })
                        .then(res => {
                            localStorage.setItem('token', res.data.accessToken);
                            localStorage.setItem('refreshToken', res.data.refreshToken);
                            addAddress();
                        })
                }
            })
    }
    const getProductByPrice = (type) => {
        let numberOfPrice = sort.toString().split("=");
        let nameValue;
        let skuValue;
        if (type == "name") {
            nameValue = nameFilter;
            skuValue = "";
        } else {
            nameValue = "";
            skuValue = nameFilter;
        }
        axiosConfig.get(`/admin/product/all?limit=10&page=${currentPage}&language_id=1&sku=${skuValue}&name=${nameValue}&status=${status}&${categoryFilter}&price_sort=&date_sort=-1`)
            .then(res => {
                setProducts(res.data.products)
            })
    }
    const getProductByData = (type) => {
        let numberOfPrice = sort.toString().split("=");
        let nameValue;
        let skuValue;
        if (type == "name") {
            nameValue = nameFilter;
            skuValue = "";
        } else {
            nameValue = "";
            skuValue = nameFilter;
        }
        axiosConfig.get(`/admin/product/all?limit=10&page=${currentPage}&language_id=1&sku=${skuValue}&name=${nameValue}&status=${status}&${categoryFilter}&price_sort=&date_sort=-1`)
            .then(res => {
                setProducts(res.data.products)
            })
    }

    const getProducts = () => {
        if (searchFilter == "name") {
            getProductByData("name");
        } else {
            getProductByData("sku");
        }
        axiosConfig.get(`/admin/product/all?limit=15&page=1&status=1&language_id=1&${searchFilter}=${nameFilter}&${categoryFilter}`)
            .then(res => {
                setProducts(res.data.products)
                setCount(res.data.count)
            })

    }

    const addToCart = () => {
        if (users.length != 0) {
            if ((Object.keys(selectedAddProduct).length != 0)) {

                const orderObj = {
                    "product_id": selectedAddProduct[0],
                    "status": status,
                    "quantity": quantity
                }

                axiosConfig.post(`/users/user/${selectedUser.id}/card/add`, orderObj
                    , {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    })
                    .then((res) => {
                        setQuantity(1)
                        setNotificationObj({
                            open: true, type: 'success', message: `Add To Cart`
                        })
                        setTimeout(
                            () => setNotificationObj({
                                open: false,
                                type: 'success',
                                message: ''
                            }
                            ), 3000);
                        getUserOrders();
                        setOpenDialog(false)
                        setSelectedAddProduct([]);
                    })
                    .catch((err) => {
                        setNotificationObj({
                            open: true, type: 'error', message: `Add to cart has a problem!`
                        })
                        setTimeout(
                        () => setNotificationObj({
                            open: false,
                            type: 'success',
                            message: ''
                        }
                        ), 3000);
                    })
                    .catch(err =>{ 
                        
                        setNotificationObj({
                            open: true, type: 'error', message: `Add to cart has a problem!`
                        })
                        setTimeout(
                        () => setNotificationObj({
                            open: false,
                            type: 'success',
                            message: ''
                        }
                        ), 3000);
                        err.response.data.error.status === 401 &&(
                        axiosConfig.post('/users/refresh_token', { 'refresh_token': localStorage.getItem('refreshToken') })
                            .then(res => {
                                localStorage.setItem('token', res.data.accessToken);
                                localStorage.setItem('refreshToken', res.data.refreshToken);
                                addToCart();
                            })
                        )
                    })
            }
        }
    }

    const deleteOrder = (selectedOrder) => {
        axiosConfig.delete(`/users/user/${selectedUser.id}/card/${selectedOrder.product_id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },

        })
            .then(res => {
                setNotificationObj({
                    open: true, type: 'success', message: `${selectedOrder.product_group.name
                        } Deleted From Card`
                })
                setTimeout(
                    () => setNotificationObj({
                        open: false,
                        type: 'success',
                        message: ''
                    }
                    ), 3000);


                getUserOrders();
            })
    }
    const handleClickContinue = () => {
        const orderObj = {
            "payment_method_id": paymentId,
            "user_address_id": addressId

        }
        let sortedOrders;
        if (orders.length != 0 && addressId != -1) {
            axiosConfig.post(`users/user/${selectedUser.id}/order/create`, orderObj, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            })
                .then(res => {

                    let orderId = (((res.data.order.split("{")[1]).split(":")[1]).split(",")[0]);
                    let orderObj = {
                        "user_id": selectedUser.id,
                        "order_id": orderId,
                        "status": status
                    }

                    axiosConfig.put(`/admin/order/change_userorder_status`, orderObj)
                        .then((res) => {
                            setNewStatus(status);
                            setOpenChangeStatus(true);
                            setQuantity(1);
                            setTimeout(() => { window.location.reload() }, 2000)
                        })
                        .catch((err) => {
                            
                            setNotificationObj({
                                open: true, type: 'error', message: `Change status of order has a problem!`
                            })
                            setTimeout(
                            () => setNotificationObj({
                                open: false,
                                type: 'success',
                                message: ''
                            }
                            ), 3000);
                        })
                })
                .catch(err =>{
                    setNotificationObj({
                        open: true, type: 'error', message: `Add order has a problem!`
                    })
                    setTimeout(
                    () => setNotificationObj({
                        open: false,
                        type: 'success',
                        message: ''
                    }
                    ), 3000); 

                    err.response.data.error.status === 401 &&(
                    axiosConfig.post('/users/refresh_token', { 'refresh_token': localStorage.getItem('refreshToken') })
                        .then(res => {
                            localStorage.setItem('token', res.data.accessToken);
                            localStorage.setItem('refreshToken', res.data.refreshToken);
                            getAddresses();
                        })
                    )
                })
        } else {

            setQuantity(1);

        }

    }

    const handleChange = (e, product) => {
        const index = selectedAddProduct.indexOf(parseInt(e.target.value))
        if (index === -1) {

            setSelectedAddProduct([...selectedAddProduct, parseInt(e.target.value)])
        } else {
            setSelectedAddProduct(selectedAddProduct.filter(s => s !== parseInt(e.target.value)))
        }
    };
    let options = [];
    if (users.length != 0) {
        options = [
            { value: users[0].first_name.concat(" ", users[0].last_name), label: users[0].first_name.concat(" ", users[0].last_name) },
        ]
    }


    return (



        <AdminLayout breadcrumb={bread} pageName={"Add Order"}>
            <Paper sx={{ width: "100%", minHeight: "300px" }}>
                <Grid
                    xs={12}
                    borderBottom={1}
                    borderColor='G3.main'
                    display="flex"
                >
                    <Grid xs={10.1} p={3} textAlign="start">
                        <Typography variant="h3">Add Order</Typography>
                    </Grid>

                    <Grid item xs={1.5} pt={2} pl={2}>

                        <FormControl disabled={userStatus}>
                            <InputLabel id="demo-simple-select-label" color="P">
                                Status
                            </InputLabel>


                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                color="P"
                                onChange={(e) => setStaus(e.target.value)}
                                IconComponent={KeyboardArrowDownIcon}
                                defaultValue={status}
                                label="Status"
                                sx={{ minWidth: "150px", height: "40px" }}
                            >

                                <MenuItem value={-1}>Canceled</MenuItem>
                                <MenuItem value={0}>Order Placed</MenuItem>
                                <MenuItem value={1}>Out For Delivery</MenuItem>
                                <MenuItem value={2}>Delivered</MenuItem>
                            </Select>

                        </FormControl>
                    </Grid>
                </Grid>
                <div id='print'>
                    <Grid container p={2} xs={12} md={12} display="flex" justifyContent="space-between">
                        <Grid xs={3} item>
                            <Select1
                                className="basic-single"
                                classNamePrefix="select"
                                defaultValue={options.length != 0 && options[0].value}
                                onChange={(e) => {
                                    setDefaultUser(e.value); setIsSelected(true);
                                    setSelectedUser(users[e.id])
                                }}
                                displayEmpty
                                styles={{ maxWidth: "15%" }}
                                name="color"
                                options={users.map((o, i) => {
                                    return { id: i, value: o.first_name.concat(" ", o.last_name), label: o.first_name.concat(" ", o.last_name) };
                                })}
                            />

                        </Grid>
                        <Grid item mr={1}>
                            <Typography p={1} color="Black.main" display="flex">

                                <Box component="div" >Order Date:{"\u00a0\u00a0"} </Box>
                                {moment(new Date()).format('YYYY/MM/DD')}
                            </Typography>
                        </Grid>

                    </Grid>
                    <Divider />
                    {orders.map(card => (

                        <Grid display='flex' xs={12} style={{ border: "1px solid rgb(0 0 0 / 20%)", borderRadius: "5px" }} justifyContent='space-between'>

                            <Grid container display='flex' justifyContent='space-between' style={{ width: "40%" }} xs={8}>
                                <Card sx={{ maxWidth: 82, border: 'none', boxShadow: 'none', marginLeft: "2%" }} >
                                    <CardMedia
                                        component="img"
                                        height="82"
                                        image={card.product_group.file_urls === null ? '' : axiosConfig.defaults.baseURL + card.product_group.file_urls[0].image_url}
                                        className="image"
                                    />
                                </Card>
                                <Grid xs={10.5} style={{ paddingLleft: "3%" }} display="flex" >
                                    <Grid mt={3.2}>
                                        <Typography
                                            ml={2}
                                            color="Black.main"
                                            variant="h11"
                                        >
                                            {card.product_group.name !== undefined && card.product_group.products.length != 0 ? (card.product_group.products[0].sku !== null ? card.product_group.name.concat(" - ", card.product_group.products[0].sku) : card.product_group.name) : card.product_group.name != undefined ? card.product_group.name : card.product_group.products.length !== 0 ? card.product_group.products[0].sku !== null ? card.product_group.products[0].sku : "" : ""}

                                        </Typography>
                                    </Grid>

                                    <Grid ml={3} >
                                        <Grid mt={3.2}>
                                            <Typography
                                                ml={2}
                                                color="Black.main"
                                                variant="h11"
                                            >
                                                Quantity: {card.quantity}

                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>

                            </Grid>

                            <Grid>
                                <Grid mt={1.5} mr={1.5} style={{ paddingRight: "41%" }}>
                                    <FormControl>
                                        <IconButton color="inherit"
                                            className="form-control-feedback"
                                            style={{ padding: "0" }}
                                            onClick={() => deleteOrder(card)}

                                        >
                                            <ClearIcon
                                                ml={2}
                                                color="Black.main"
                                                variant="h11"

                                            />
                                        </IconButton>

                                    </FormControl>
                                </Grid>

                            </Grid>

                        </Grid>
                    ))}
                    <Divider />
                    <Grid xs={12} style={{ width: '702px', minHeight: '500px', marginLeft: "22%" }}>
                        <Grid xs={12} p={2}>
                            <Typography variant='h3' >Add Address</Typography>
                        </Grid>

                        <Grid container xs={12} p={1} display='flex' flexWrap='wrap' >
                            <Grid xs={6} p={1} >
                                <TextField
                                    id="outlined-basic"
                                    label="Title"
                                    color="P"
                                    fullWidth
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            "& > fieldset": (title) == "" ? { borderColor: "Red.main" } : { borderColor: "Black.main" },
                                        },
                                    }}
                                    onChange={(e) => setTitle(e.target.value)}
                                    disabled={userStatus}
                                />
                            </Grid>
                            <Grid xs={6} p={1}>
                                <TextField
                                    id="outlined-basic"
                                    label="Full Name"
                                    color="P"
                                    fullWidth
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            "& > fieldset": (fullName) == "" ? { borderColor: "Red.main" } : { borderColor: "Black.main" },
                                        },
                                    }}
                                    onChange={(e) => setFullName(e.target.value)}
                                    disabled={userStatus}
                                />
                            </Grid>
                            <Grid xs={6} p={1}>
                                <TextField
                                    id="outlined-basic"
                                    label="Phone Number"
                                    color="P"
                                    fullWidth
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            "& > fieldset": (phone) == "" ? { borderColor: "Red.main" } : { borderColor: "Black.main" },
                                        },
                                    }}
                                    onChange={(e) => setPhone(e.target.value)}
                                    disabled={userStatus}
                                />
                            </Grid>
                            <Grid xs={6} p={1}>
                                <TextField
                                    id="outlined-basic"
                                    label="Email"
                                    color="P"
                                    fullWidth
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            "& > fieldset": (email) == "" ? { borderColor: "Red.main" } : { borderColor: "Black.main" },
                                        },
                                    }}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={userStatus}
                                />
                            </Grid>
                            <Grid xs={12} p={1}>
                                <TextField
                                    id="outlined-basic"
                                    label="Address"
                                    color="P"
                                    fullWidth
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            "& > fieldset": (address) == "" ? { borderColor: "Red.main" } : { borderColor: "Black.main" },
                                        },
                                    }}
                                    onChange={(e) => setAddress(e.target.value)}
                                    disabled={userStatus}
                                />
                            </Grid>
                            <Grid xs={12} p={1}>
                                <TextField
                                    id="outlined-basic"
                                    label="Apartment, suit, etc."
                                    color="P"
                                    fullWidth
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            "& > fieldset": (apartment) == "" ? { borderColor: "Red.main" } : { borderColor: "Black.main" },
                                        },
                                    }}
                                    onChange={(e) => setApartment(e.target.value)}
                                    disabled={userStatus}
                                />
                            </Grid>
                            <Grid xs={6} p={1}>
                                <FormControl fullWidth color='P' disabled={userStatus}>
                                    <InputLabel id="demo-simple-select-label">Country</InputLabel>
                                    <Select
                                        IconComponent={KeyboardArrowDownIcon}
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label="Country"
                                        sx={{
                                            "& > fieldset": country == '' ? { borderColor: "Red.main" } : { borderColor: "Black.main" },
                                        }}
                                        onChange={handleChangeCountryName}
                                    >
                                        <MenuItem value={'United Arab Emirates'}>United Arab Emirates</MenuItem>
                                        <MenuItem value={'Kuwait'}>Kuwait</MenuItem>
                                        <MenuItem value={'Qatar'}>Qatar</MenuItem>
                                        <MenuItem value={'Bahrain'}>Bahrain</MenuItem>
                                        <MenuItem value={'Iran'}>Iran</MenuItem>

                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid xs={6} p={1}>
                                <FormControl fullWidth color='P' disabled={userStatus}>
                                    <InputLabel id="demo-simple-select-label">State</InputLabel>
                                    <Select
                                        IconComponent={KeyboardArrowDownIcon}
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label="State"
                                        sx={{
                                            "& > fieldset": state == '' ? { borderColor: "Red.main" } : { borderColor: "Black.main" },
                                        }}
                                        onChange={handleChangeStateName}
                                    >
                                        {statesName.map((state) => {
                                            return (
                                                <MenuItem value={state.name}>{state.name}</MenuItem>
                                            )
                                        })}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid xs={6} p={1}>
                                <FormControl fullWidth color='P' disabled={userStatus}>
                                    <InputLabel id="demo-simple-select-label">City</InputLabel>
                                    <Select
                                        IconComponent={KeyboardArrowDownIcon}
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label="City"
                                        sx={{
                                            "& > fieldset": city == '' ? { borderColor: "Red.main" } : { borderColor: "Black.main" },
                                        }}
                                        onChange={(e) => setCity(e.target.value)}
                                    >
                                        {cities.map((city) => {
                                            return (
                                                <MenuItem value={city}>{city}</MenuItem>
                                            )
                                        })}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid xs={6} p={1}>
                                <TextField
                                    id="outlined-basic"
                                    label="Zip Code"
                                    color="P"
                                    fullWidth
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            "& > fieldset": (zipCode) == "" ? { borderColor: "Red.main" } : { borderColor: "Black.main" },
                                        },
                                    }}
                                    onChange={(e) => setZipCode(e.target.value)}
                                    disabled={userStatus}
                                />
                            </Grid>
                        </Grid>
                        <Grid xs={12} display='flex' justifyContent='end' p={1} pr={2} pl={2}>

                            <Grid p={1} style={{ color: 'white' }} disabled={userStatus}>
                                <Button color='Black' variant='contained' onClick={addAddress} disabled={userStatus}>Add Address</Button>
                            </Grid>
                        </Grid>
                    </Grid>


                    <Grid>

                        <Divider />

                        <Grid display='flex' justifyContent="center" >

                            <Grid style={{ margin: "1.4% 0 1% 0%" }} p={1} sx={{ height: "40px" }}>
                                <TextField
                                    id="outlined-basic"
                                    label="Quantity"
                                    color="P"
                                    defaultValue={quantity}
                                    value={quantity}
                                    fullWidth
                                    onChange={(e) => (e.target.value != 0 && e.target.value > 0) && setQuantity(e.target.value)}
                                    disabled={userStatus}
                                    size="small"
                                />
                            </Grid>
                            <Grid p={1} style={{ color: 'white', margin: "1.4% 0 1% 0%" }} disabled={userStatus}>
                                <Button color='Black' variant="contained"
                                    onClick={() => setOpenDialog(true)}
                                >Add to cart</Button>
                            </Grid>
                        </Grid>



                    </Grid>
                </div>
                <Dialog
                    open={open}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"

                >
                    <Grid xs={12} display='flex' justifyContent='center' mt={3} mb={1} ml={3} mr={6}>
                        <Typography>
                            Order status changed to {newStatus === -1 ? '"Cancel"' : newStatus === 0 ? '"Order Placed"' :
                                newStatus === 1 ? '"Out For Delivery"' : '"delivered"'}
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

                        <Grid xs={12} p={0} mr={5}>
                            <Grid
                                xs={12}
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                            >
                                <Typography variant="h12">Payment Options</Typography>
                            </Grid>
                            <Grid xs={12} display="flex" flexWrap="wrap" pb={2}>
                                <Grid md={12} m={1} xs={12} borderColor="G3.main" >
                                    <Grid xs={12} display="flex" alignItems="center">
                                        <FormControl style={{ width: '100%' }}>
                                            <RadioGroup

                                                aria-labelledby="demo-radio-buttons-group-label"
                                                defaultValue={1}
                                                name="payment"
                                                onChange={(event) => {
                                                    setPaymentId(event.target.value)
                                                    event.persist();
                                                    setPayment(payment => ({
                                                        ...payment,
                                                        [event.target.name]: event.target.value
                                                    }));
                                                }}

                                            >

                                                <Grid
                                                    border={1}
                                                    borderColor="G3.main"
                                                    pt={1}
                                                    pl={2}
                                                    pr={2}
                                                    mb={1}
                                                    xs={12}
                                                >
                                                    <FormControlLabel
                                                        value={1}
                                                        control={<Radio color="P" />}
                                                        label="Credit Card"
                                                    />
                                                    <Grid display='flex' flexWrap='wrap' >
                                                        <Grid xs={12} p={1}>
                                                            <TextField id="outlined-basic" label="Card Number" variant="outlined" fullWidth />
                                                        </Grid>
                                                        <Grid xs={12} p={1}>
                                                            <TextField id="outlined-basic" label="Name On the Card" variant="outlined" fullWidth />
                                                        </Grid>
                                                        <Grid xs={6} p={1}>
                                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                                <DesktopDatePicker
                                                                    label="Date desktop"
                                                                    inputFormat="MM/yy"
                                                                    renderInput={(params) => <TextField {...params} />}
                                                                />
                                                            </LocalizationProvider>

                                                        </Grid>
                                                        <Grid xs={6} p={1}>
                                                            <TextField id="outlined-basic" label="Security Code" variant="outlined" fullWidth />
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                <Grid
                                                    xs={12}
                                                    border={1}
                                                    borderColor="G3.main"
                                                    pt={1}
                                                    pl={2}
                                                    pr={2}
                                                    mb={1}
                                                >
                                                    <FormControlLabel
                                                        value={2}
                                                        control={<Radio color="P" />}
                                                        label="Paypal"
                                                    />
                                                    {paymentId === '2' ?
                                                        <Typography mb={1}>
                                                            By clicking “Continue to Pay,” you will be redirected to
                                                            PayPal to complete your order.
                                                        </Typography>
                                                        :
                                                        ''
                                                    }
                                                </Grid>
                                                <Grid md={12} xs={12} display='flex' flexWrap='wrap'>
                                                    <Grid border={1}
                                                        borderColor="G3.main"
                                                        pt={1}
                                                        pl={2}
                                                        pr={2}
                                                        mb={1}
                                                        xs={12} sx={{ backgroundColor: 'G3.main' }} >
                                                        <Grid display='flex' flexWrap='wrap' >
                                                            <Grid xs={12} p={1}>
                                                                <Typography variant='h8'>Order Summery</Typography>
                                                            </Grid>

                                                            <Grid xs={6} p={1} display='flex' justifyContent="space-between">
                                                                <Typography variant='h18'>
                                                                    Items ({orders ? orders.length : 0}):
                                                                </Typography>
                                                                <Typography variant='h18'>
                                                                    KWD {total_price}
                                                                </Typography>
                                                            </Grid>
                                                            <Grid xs={6} p={1} display='flex' justifyContent="space-between">
                                                                <Typography variant='h18'>
                                                                    Shiping:
                                                                </Typography>
                                                                <Typography variant='h18'>
                                                                    KWD 0
                                                                </Typography>
                                                            </Grid>
                                                            <Grid xs={6} p={1} display='flex' justifyContent="space-between">
                                                                <Typography variant='h18'>
                                                                    Tax Collected:
                                                                </Typography>
                                                                <Typography variant='h18'>
                                                                    KWD 0
                                                                </Typography>
                                                            </Grid>

                                                            <Divider sx={{ height: "10%", width: "100%" }} />
                                                            <Grid xs={12} p={1} display='flex' justifyContent="center">

                                                                <Typography variant='h18' mr={4}>
                                                                    Order Total:{"\u00a0\u00a0"}
                                                                </Typography>
                                                                <Typography variant='h18'>
                                                                    KWD {total_price}
                                                                </Typography>
                                                            </Grid>
                                                            <Grid xs={12} p={1} display='flex' justifyContent="center">
                                                                <Grid xs={6}>
                                                                    <Button variant="contained" color='Black' style={{ color: 'white' }} fullWidth
                                                                        onClick={handleClickContinue}
                                                                    >
                                                                        Continue to Pay

                                                                    </Button>
                                                                </Grid>
                                                                <Grid xs={6} textAlign="end">
                                                                    <Button
                                                                        fullWidth
                                                                        variant="outlined"
                                                                        color="G1"
                                                                        onClick={() => setOpen(false)}
                                                                        sx={{ mb: 2, mr: 1, ml: 1 }}
                                                                    >
                                                                        close
                                                                    </Button>
                                                                </Grid>
                                                            </Grid>
                                                            <Grid xs={12} p={1} display='flex' justifyContent="center">

                                                                <Link href="#" underline="none" style={{ color: "#CB929B" }}>
                                                                    Do you have a discount code?
                                                                </Link>
                                                            </Grid>




                                                        </Grid>


                                                    </Grid>


                                                </Grid>
                                            </RadioGroup>

                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>

                    </Grid>
                </Dialog>
                <Dialog
                    open={openChangeStatus}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <Grid xs={12} display='flex' justifyContent='center' mt={3} mb={1} ml={3} mr={6}>
                        <Typography>
                            Order status changed to {newStatus === -1 ? '"Cancel"' : newStatus === 0 ? '"Order Placed"' :
                                newStatus === 1 ? '"Out For Delivery"' : '"delivered"'}
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
                            onClick={() => setOpenChangeStatus(false)}
                            sx={{ mt: 2, mb: 2, mr: 1, ml: 1 }}
                        >
                            close
                        </Button>
                    </Grid>
                </Dialog>
                <Dialog
                    fullWidth
                    maxWidth="md"
                    xs={12}
                    open={openDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    onClose={() => setOpenDialog(false)}
                >
                    <Grid item md={12} spacing={2} className='box' >
                        <Grid item md={4} display='flex' alignItems='center' pl={2} >
                            <Typography variant='menutitle'> Add Product</Typography>
                        </Grid>

                        <Grid item md={5} ml={3} style={{ display: 'flex', justifyContent: 'end' }} >
                            <Grid
                                className="form-group has-search"

                            >
                                <Typography className="fa fa-search ">
                                    <IconButton color="inherit"
                                        className="form-control-feedback"
                                        style={{ paddingTop: '29px' }}
                                    >
                                        <SearchIcon />
                                    </IconButton>
                                </Typography>
                                <FormControl
                                    color="P"
                                    style={{ minWidth: 80 }}
                                    variant="standard"
                                    size="small"
                                    hiddenLabel={true}
                                >
                                    <Select
                                        labelId="demo-simple-select-filled-label"
                                        id="demo-simple-select-filled"
                                        disableUnderline
                                        color="P"
                                        IconComponent={KeyboardArrowDownIcon}
                                        displayEmpty
                                        inputProps={{ "aria-label": "Without label" }}
                                        defaultValue={'name'}
                                        sx={{
                                            position: 'absolute', backgroundColor: 'G3.main', marginTop: '22px',
                                            marginLeft: '320px', borderTopRightRadius: '50px', borderBottomRightRadius: '50px', padding: '3px'
                                        }}
                                        onChange={(e) => setSearchFilter(e.target.value)}
                                    >
                                        <MenuItem value={'sku'}>
                                            <Typography p={1.5} variant='h15'>SKU</Typography>
                                        </MenuItem>
                                        <MenuItem value={'name'}>
                                            <Typography p={1} variant='h15'>Name</Typography>
                                        </MenuItem>
                                    </Select>
                                </FormControl>


                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search"
                                    style={{ backgroundColor: '#FFFFFF', width: '400px', margin: 0, border: '1px solid #DCDCDC' }}
                                    onChange={(e) => {
                                        setNameFilter(e.target.value)
                                    }
                                    }
                                />

                            </Grid>
                        </Grid>


                        <Grid item md={4} p={2} style={{ paddingTop: "2.3%" }}>
                            <FormControl
                                fullWidth
                            >
                                <InputLabel id="demo-simple-select-label" color='P' >Category</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    color='P'
                                    IconComponent={KeyboardArrowDownIcon}
                                    defaultValue={'category_id'}
                                    label="Category"
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                    sx={{ minWidth: "220px", height: "40px" }}
                                >
                                    <MenuItem value={'category_id'} >All</MenuItem>
                                    <MenuItem value={`category_id=${localStorage.getItem('Glass Sun Glass')}`} >Sunglasses</MenuItem>
                                    <MenuItem value={`category_id=${localStorage.getItem('Glass Eye Glass')}`} >Eye Glasses</MenuItem>
                                    <MenuItem value={`category_id=${localStorage.getItem('Contact Lens Color')}`} >Contact Lens - Color</MenuItem>
                                    <MenuItem value={`category_id=${localStorage.getItem('Contact Lens Toric')}`} >Contact Lens - Toric</MenuItem>
                                    <MenuItem value={`category_id=${localStorage.getItem('Contact Lens Single Vision')}`} >Contact Lens - Single Vision</MenuItem>
                                    <MenuItem value={`category_id=${localStorage.getItem('Lens Bifocal')}`} >Lens - Bifocal</MenuItem>
                                    <MenuItem value={`category_id=${localStorage.getItem('Lens Progressive')}`} >Lens - Progressive</MenuItem>
                                    <MenuItem value={`category_id=${localStorage.getItem('Lens Single Vision')}`} >Lens - Single Vision</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                    </Grid>
                    <Divider />
                    <Grid container p={2} xs={12}>
                        {products.map((product, index) => {
                            return (

                                <>

                                    {((product.name != null || product.name != undefined) || (product.products.length != 0 && product.products[0].sku != undefined)) &&

                                        <Grid container m={1} mr={2}>
                                            <Grid item xs={12} md={12}>
                                                <FormControl>
                                                    <FormGroup>
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox
                                                                    color='P'
                                                                    checked={selectedAddProduct.indexOf(product.products[0].id) > -1}
                                                                    onChange={(e) => (selectedAddProduct.length >= 1 ? (selectedAddProduct.indexOf(product.products[0].id) == 0 ? handleChange(e, product) : "") : handleChange(e, product))}
                                                                    value={product.products[0].id}
                                                                />
                                                            }

                                                            label={
                                                                <Grid display='flex'>
                                                                    <Grid>
                                                                        <Card sx={{ maxWidth: 82, border: 'none', boxShadow: 'none' }}>
                                                                            <CardMedia
                                                                                component="img"
                                                                                height="82"
                                                                                image={product.file_urls === null ? '' : axiosConfig.defaults.baseURL + product.file_urls[0]}
                                                                                className="image"
                                                                            />
                                                                        </Card>
                                                                    </Grid>
                                                                    <Grid>
                                                                        <Grid mt={1.5}>
                                                                            <Typography
                                                                                ml={2}
                                                                                color="Black.main"
                                                                                variant="h11"
                                                                            >
                                                                                {product.name !== undefined && product.products.length != 0 ? (product.products[0].sku !== null ? product.name.concat(" - ", product.products[0].sku) : product.name) : product.name != undefined ? product.name : product.products.length !== 0 ? product.products[0].sku !== null ? product.products[0].sku : "" : ""}

                                                                            </Typography>
                                                                        </Grid>

                                                                        <Grid ml={2} mt={1} display='flex' >
                                                                            <Typography variant='h10' pl={1} pr={1} sx={{ color: 'G1.main' }}>
                                                                                4232-1192
                                                                            </Typography>
                                                                            <Divider orientation="vertical" flexItem />
                                                                            {(product.products.length !== 0 && product.products[0].attributes !== undefined) &&
                                                                                <>
                                                                                    {product.products[0].attributes.find(b => b.name === "brand"
                                                                                        || b.name === "brand_contact_lens_color"
                                                                                        || b.name === 'brand_contact_lens_single_toric') ? <>
                                                                                        <Divider orientation="vertical" flexItem />
                                                                                        <Typography variant='h10' pl={1} pr={1} sx={{ color: 'G1.main' }}>

                                                                                            {
                                                                                                product.products[0].attributes.find(b => b.name === "brand"
                                                                                                    || b.name === "brand_contact_lens_color"
                                                                                                    || b.name === 'brand_contact_lens_single_toric').value
                                                                                            }
                                                                                        </Typography >
                                                                                    </>
                                                                                        : ''}
                                                                                    <Divider orientation="vertical" flexItem />
                                                                                    <Typography variant='h10' pl={1} pr={1} sx={{ color: 'G1.main' }}>
                                                                                        {product.category_id === parseInt(localStorage.getItem('Glass Sun Glass')) ? 'Sunglass' :
                                                                                            product.category_id === parseInt(localStorage.getItem('Glass Eye Glass')) ? 'Eye Glass' :
                                                                                                product.category_id === parseInt(localStorage.getItem('Contact Lens Toric')) ? 'Contact Lens Toric' :
                                                                                                    product.category_id === parseInt(localStorage.getItem('Lens Progressive')) ? 'Lens Progressive' :
                                                                                                        product.category_id === parseInt(localStorage.getItem('Lens Single Vision')) ? 'Lens Single Vision' :
                                                                                                            product.category_id === parseInt(localStorage.getItem('Contact Lens Single Vision')) ? 'Contact Lens Single Vision' :
                                                                                                                product.category_id === parseInt(localStorage.getItem('Lens Bifocal')) ? 'Lens Bifocal' :
                                                                                                                    product.category_id === parseInt(localStorage.getItem('Contact Lens Color')) ? 'Contact Lens Color' :
                                                                                                                        '?'
                                                                                        }
                                                                                    </Typography>
                                                                                    <Divider orientation="vertical" flexItem />
                                                                                    <Typography variant='h10' pl={1} pr={1} sx={{ color: 'G1.main' }}>
                                                                                        {product.products[0].attributes.find(b => b.name === "gender") ? product.products[0].attributes.find(b => b.name === "gender").value : 'Unisex'}
                                                                                    </Typography >

                                                                                </>
                                                                            }

                                                                            < Divider orientation="vertical" flexItem />
                                                                            <Typography variant='h10' pl={1} pr={1} sx={{ color: 'G1.main' }}>
                                                                                {(product.products).length} Types
                                                                            </Typography>
                                                                        </Grid>
                                                                    </Grid>

                                                                </Grid>
                                                            }
                                                        />
                                                    </FormGroup>
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    }</>
                            );
                        })}
                    </Grid>

                    <Grid
                        item
                        xs={12}
                        pr={2}
                        display="flex"
                        justifyContent="end"
                    >
                        <Button
                            variant="outlined"
                            color="G1"
                            onClick={() => { setSelectedAddProduct([]); setOpenDialog(false) }}
                            sx={{ mt: 2, mb: 2, mr: 1, ml: 1 }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="P"
                            sx={{
                                mt: 2,
                                mb: 2,
                                mr: 1,
                                ml: 1,
                                color: "white",
                            }}
                            onClick={() => addToCart()}
                        >
                            Add
                        </Button>
                    </Grid>
                </Dialog>
            </Paper >
            <Grid item xs={12} pt={2} display="flex" justifyContent="end">
                <Button
                    variant="outlined"
                    color="G1"
                    sx={{ mr: 1, ml: 1 }}
                    onClick={() => history.push("/admin/orderlist")}
                >
                    Cancel
                </Button>
                <Button
                    disabled={isSelected}
                    variant="contained"
                    color="P"
                    sx={{ mr: 1, ml: 1 }}
                    onClick={() => setOpen(true)}
                >
                    Submit
                </Button>
            </Grid>
            <Notification open={notificationObj.open} type={notificationObj.type} message={notificationObj.message} />
        </AdminLayout>

    )
}

export default AddOrder;