import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axiosConfig from '../../axiosConfig'
import {
    Button, Grid, IconButton, Menu, MenuItem,
    Typography, Box, Modal, Divider, Dialog
} from "@mui/material";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import Avatar from '@mui/material/Avatar';
import Link from '@mui/material/Link';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from '@mui/icons-material/Close';
import ErrorIcon from '@mui/icons-material/Error';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from "@mui/icons-material/Add";


const NotificationStyle = {
    position: 'absolute',
    top: 0,
    right: 0,
    height: '100%',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
};

const TopAdmin = (props) => {
    const [openNotification, setOpenNotification] = useState(false);
    const [openError, setOpenError] = useState({ open: false, message: '' });
    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorElDiscount, setAnchorElDiscount] = useState(null);
    const openAdd = Boolean(anchorElDiscount);
    const [addPage, setAddPage] = useState(0);
    let history = useHistory();
    const open = Boolean(anchorEl);
    const [anchorElAdmin, setAnchorElAdmin] = useState(null);
    let openAdmin = Boolean(anchorElAdmin);


    const OpenNotification = () => {
        setOpenNotification(true);
    };

    const CloseNotification = () => {
        setOpenNotification(false);
    };



    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClickAddNewProduct = (event) => {
        setAnchorEl(event.currentTarget);
    }

    function handleClickB(event) {
        event.preventDefault();
    }

    const selectAdd = (e) => {
        axiosConfig.get(`/admin/product/add/${e.target.value}`)
            .then(res => {
                let attributeList = res.data.data.attributes;
                if (res.data.data.attributes.length !== 0) {
                    if (res.data.data.attributes.filter(a => a.is_parent).length === 0) {
                        setOpenError({ open: true, message: "You cannot add products from this category because it doesn't have main variant" })
                    } else {
                        history.push({
                            pathname: '/admin/product/add',
                            state: {
                                categoryId: e.target.value
                            }
                        })
                    }
                } else {
                    setOpenError({ open: true, message: "You cannot add products from this category because it doesn't have attributes" })
                }
                setAnchorEl(null)
            })
    }

    const handleClose = (event) => {
        setAddPage(event.target.value)
        setAnchorEl(null);
    };
    const notNull = () => {
        return (
            <Breadcrumbs
                separator={<NavigateNextIcon color='Black' />}
                aria-label="breadcrumb"
            >

                {props.breadcrumb.map(({ title, href }) => {
                    return (
                        <Link underline="hover" variant='h2' color="black" href={href}>
                            {title}
                        </Link>
                    )
                })}

                <Typography color="text.primary" variant='h1'>
                    {props.pageName}
                </Typography>
            </Breadcrumbs>
        )
    }
    const isNull = () => {
        return (
            <Typography color="text.primary" variant='h1'>
                {props.pageName}
            </Typography>
        )
    }

    const [windowResizing, setWindowResizing] = useState(false);

    useEffect(() => {
        let timeout;
        const handleResize = () => {
            clearTimeout(timeout);

            setWindowResizing(true);

            timeout = setTimeout(() => {
                setWindowResizing(false);
            }, 200);
        }
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const changeXsByWindowWidth = () => {

        return window.innerWidth > 6000 ? 11.87 : window.innerWidth > 5389 ? 11.88 : window.innerWidth > 5200 ? 11.89 : window.innerWidth >= 5184 ? 11.889 : window.innerWidth >= 4940 ? 11.9 : window.innerWidth >= 4608 ? 11.902 : window.innerWidth > 4600 ? 11.905 : window.innerWidth >= 4243 ? 11.91 : window.innerWidth >= 3916 ? 11.92 : window.innerWidth >= 3735 ? 11.93 : window.innerWidth >= 3480 ? 11.94 : window.innerWidth > 3480 ? 11.91 : window.innerWidth > 3080 ? 11.94 : window.innerWidth >= 3072 ? 11.95 : window.innerWidth > 2760 ? 11.97 : window.innerWidth > 2444 ? 11.98 : window.innerWidth > 2254 ? 11.99 : 12
    }

    const changeMarginByWindowWidth = () => {

        return window.innerWidth >= 2174 ? -3 : window.innerWidth > 2172 ? 0 : window.innerWidth > 2143 ? -3 : window.innerWidth >= 2140 ? -2.6 : window.innerWidth >= 2136 ? -4 : window.innerWidth >= 2096 ? -5 : window.innerWidth >= 2048 ? -7.4 : window.innerWidth >= 1940 ? -7.2 : window.innerWidth >= 1868 ? -8 : window.innerWidth > 1756 ? -11 : window.innerWidth > 1700 ? -12 : window.innerWidth > 1656 ? -12 : window.innerWidth >= 1404 ? -14 : window.innerWidth >= 1403 ? -13 : window.innerWidth >= 1308 ? -15 : window.innerWidth >= 1228 ? -18 : window.innerWidth > 1206 ? -16 : window.innerWidth >= 1200 ? -17 : -12
    }

    const changeMarginOfAtrributesByWindowWidth = () => {

        return window.innerWidth >= 6500 ? 39 : window.innerWidth >= 6144 ? 37 : window.innerWidth >= 6000 ? 35 : window.innerWidth >= 5750 ? 33 : window.innerWidth >= 5500 ? 30 : window.innerWidth >= 5250 ? 24.5 : window.innerWidth >= 5000 ? 21 : window.innerWidth >= 4700 ? 16 : window.innerWidth >= 4600 ? 20 : window.innerWidth >= 4500 ? 14 : window.innerWidth >= 4250 ? 10 : window.innerWidth >= 4100 ? 11 : window.innerWidth >= 4000 ? 7 : window.innerWidth >= 3900 ? 4 : window.innerWidth >= 3800 ? 5 : window.innerWidth >= 3700 ? 3 : window.innerWidth >= 3500 ? 0 : window.innerWidth >= 3250 ? -5 : window.innerWidth >= 3200 ? -4 : window.innerWidth >= 3100 ? -6 : window.innerWidth >= 3050 ? -6 : window.innerWidth >= 3000 ? -7 : window.innerWidth >= 2950 ? -6 : window.innerWidth >= 2900 ? -9
            : window.innerWidth >= 2800 ? -13 : window.innerWidth >= 2750 ? -10 : window.innerWidth >= 2600 ? -13 : window.innerWidth >= 2500 ? -15 : window.innerWidth >= 2450 ? -16 : window.innerWidth >= 2400 ? -15.5 : window.innerWidth >= 2304 ? -15
                : window.innerWidth >= 2250 ? -18 : window.innerWidth >= 2170 ? -18.2 : window.innerWidth >= 2100 ? -18 : window.innerWidth >= 2050 ? -19 : window.innerWidth >= 2000 ? -20 : window.innerWidth >= 1920 ? -19 : window.innerWidth >= 1900 ? -20.7 : window.innerWidth >= 1850 ? -21 : window.innerWidth >= 1800 ? -23.5 : window.innerWidth >= 1750 ? -25.5 : window.innerWidth >= 1706 ? -23 : window.innerWidth >= 1700 ? -25.3 : window.innerWidth >= 1536 ? -24 : window.innerWidth >= 1500 ? -26 : window.innerWidth >= 1450 ? -30 :
                    window.innerWidth >= 1390 ? -27 : window.innerWidth >= 1350 ? -28.4 : window.innerWidth >= 1300 ? -31.1 : window.innerWidth >= 1250 ? -32.8 : window.innerWidth >= 1228 ? -30 : window.innerWidth >= 1208 ? -30.5 : window.innerWidth >= 1100 ? -35 : window.innerWidth >= 1050 ? -37 : window.innerWidth >= 1396 ? -36 : window.innerWidth >= 1024 ? -31 : window.innerWidth >= 1000 ? -37.3 : window.innerWidth >= 900 ? -38.5 : window.innerWidth >= 870 ? -35 : window.innerWidth >= 800 ? -39 : window.innerWidth >= 770 ? -35 : window.innerWidth >= 700 ? -41 : 0
    }

    const clickAddNewDiscont = (event) => {
        setAnchorElDiscount(event.currentTarget);

    }

    const handleCloseDiscount = (event) => {
        setAnchorElDiscount(null);
    };
    return (
        <Grid item xs={(props.pageName == "Products" || props.pageName == "Attributes") ? 12 : changeXsByWindowWidth()} style={{ marginLeft: props.pageName == "Products" ? '-11px' : props.pageName == "Attributes" ? "-11px" : "-10px" }}>

            <div className='right'>
                <div className='Breadcrumbs' display='flex' >
                    <IconButton pr={2} onClick={() => history.goBack()}>
                        <ArrowBackIcon color='Black' />
                    </IconButton>
                    {props.breadcrumb == '' ? isNull() : notNull()}
                </div>
                <div style={{ marginRight: props.pageName == "Products" ? 1.5 : (props.pageName == "Attributes") ? changeMarginOfAtrributesByWindowWidth() : changeMarginByWindowWidth() }}>
                    <Button
                        variant="contained"
                        color="P"
                        sx={{ color: "white", height: 43.7, marginRight: 1 }}
                        style={{ display: props.pageName == "Discounts" ? 'initial' : 'none', color: "white" }}
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
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        <MenuItem
                            onClick={() => history.push({ pathname: '/admin/discounts/addDiscountCode' })}
                        >
                            Discount Code
                        </MenuItem>
                        <MenuItem
                            onClick={() => history.push({ pathname: '/admin/discounts/addAutoDiscount' })}
                        >
                            Auto Discount
                        </MenuItem>
                    </Menu>

                    {props.pageName == "Tag" &&
                        <Button
                            variant="contained"
                            color="P"
                            onClick={() => history.push("/admin/tag/addtag")}
                            style={{ color: 'white', height: 43.7, marginRight: 6.4, textTransform: 'none' }}
                            startIcon={<AddIcon />}
                        >
                            Add Tag
                        </Button>
                    }
                    {props.pageName == "Blog" &&
                        <Button
                            variant="contained"
                            color="P"
                            style={{ color: 'white', height: 43.7, marginRight: 6.4, textTransform: 'none' }}
                            onClick={() => history.push({ pathname: '/admin/blog/addblog' })}
                            startIcon={<AddIcon />}
                        >
                            Add Blog
                        </Button>
                    }
                    <Button variant="contained"
                        color="P"
                        className='addProductBtn'
                        style={{ display: props.pageName == "Attributes" ? 'initial' : 'none', color: "white" }}
                        onClick={() => localStorage.setItem("isClickedAttribute", true)}
                    >
                        Add Attribute
                    </Button>
                    <Button variant="contained"
                        color="P"
                        className='addProductBtn'
                        style={{ display: `${props.showAddBtn}`, color: "white" }}
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClickAddNewProduct}
                    >
                        Add New product
                    </Button>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        {JSON.parse(localStorage.getItem('categories')).map((category) => {
                            return (
                                <MenuItem value={category.id} onClick={selectAdd}>{category.name}</MenuItem>
                            )
                        })}
                    </Menu>
                    <Button
                        variant="contained"
                        color="White"
                        className='addProductBtn'
                        endIcon={<ExpandMoreIcon />}
                        startIcon={<Avatar sx={{ width: 24, height: 24 }}> </Avatar>}
                        aria-controls={openAdmin ? 'basic-menu-admin' : undefined}
                        aria-haspopup="true"
                        aria-expanded={openAdmin ? 'true' : undefined}
                        onClick={(event) => setAnchorElAdmin(event.currentTarget)}
                    >
                        Admin
                    </Button>
                    <Menu
                        id="basic-menu-admin"
                        anchorEl={anchorElAdmin}
                        open={openAdmin}
                        onClose={() => setAnchorElAdmin(null)}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        {!localStorage.getItem('token') ? '' :
                            <Grid>
                                <MenuItem onClick={() => history.push('/home/profile/profile')}>Profile</MenuItem>
                                <MenuItem onClick={() => {
                                    localStorage.removeItem('token');
                                    setAnchorElAdmin(null);
                                    history.push('/')
                                }}>Log Out</MenuItem>

                            </Grid>
                        }


                    </Menu>
                    <Button
                        variant="contained"
                        color="White"
                        className='addProductBtn'
                        size="small"
                        style={{ padding: '0' }}
                        onClick={OpenNotification}
                    >
                        <NotificationsNoneIcon />
                    </Button>
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
                                    style={{ padding: '0' }}
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
                                    <Grid item xs={12} display="flex" justifyContent={"space-between"}>
                                        <Typography p={1}>
                                            Title
                                        </Typography>
                                        <Typography variant="p" p={1}>
                                            2021/03/04
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} display="flex" justifyContent={"space-between"}>
                                        <Typography variant="p" p={1}>
                                            Frames are measured by lens width, bridge width, and temple length in millimeters. You can easily find your size by referring.
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} display="flex" justifyContent={"space-between"}>
                                        <Button
                                            variant="text"
                                            color="P"
                                        >
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
                                <Grid item xs={12} display="flex" justifyContent={"space-between"}>
                                    <Typography p={1}>
                                        Title
                                    </Typography>
                                    <Typography variant="p" p={1}>
                                        2021/03/04
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} display="flex" justifyContent={"space-between"} >
                                    <Typography variant="p" p={1}>
                                        Frames are measured by lens width
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Divider sx={{ width: "100%" }} />
                            <Grid container xs={12} >
                                <Grid item xs={12} display="flex" justifyContent={"space-between"}>
                                    <Typography p={1}>
                                        Title
                                    </Typography>
                                    <Typography variant="p" p={1}>
                                        2021/03/04
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} display="flex" justifyContent={"space-between"} >
                                    <Typography variant="p" p={1}>
                                        Frames are measured by lens width
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    </Modal>
                </div>

            </div>
            <Dialog
                open={openError.open}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <Grid xs={12} display='flex' justifyContent='center' mt={3} mb={1} ml={3} mr={6}>
                    <ErrorIcon color='error' />
                    <Typography pl={1}>
                        {openError.message}
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
                        onClick={() => {
                            setOpenError({ open: false, message: '' });
                            setAnchorEl(null);
                        }}
                        sx={{ mt: 2, mb: 2, mr: 1, ml: 1 }}
                    >
                        Close
                    </Button>
                </Grid>
            </Dialog>
        </Grid>
    )
}

export default TopAdmin
