import React, { useState, useEffect } from "react";
import {
  Card,
  CardMedia,
  Grid,
  Typography,
  Button,
  IconButton,
  Divider,
  Dialog,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Menu,
  Hidden,
  FormHelperText,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import ProfileLayout from "./ProfileLayout";
import axiosConfig from "../../../axiosConfig";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import BackgroundAddress from "../../../asset/images/backgroundAddress.png";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import axios from "axios";
import NoAddressImage from "../../../asset/images/NoAddress.png";
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';

const Addresses = () => {
  const [addreses, setAddresses] = useState([]);
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
  const [anchorEl, setAnchorEl] = useState(null);
  const openEditAndDeleteMenu = Boolean(anchorEl);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [isEdit, setIsEdit] = useState(false);

  const [kuwaitPhoneNumberRegex, setKuwaitRegex] = useState(/^(\+965[569]\d{7})$/);
  const [checkPhoneFormate, setCheckPhoneFormate] = useState(false);
  const [disableSave, setDisableSave] = useState(true);
  const [_disableSave, _setDisableSave] = useState(true);
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
    getAddresses();
  }, []);

  const getAddresses = () => {
    axiosConfig
      .get("/users/address", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setAddresses(res.data.addresses);
      })
      .catch((err) =>{
        if(err.response.data.error.status === 401){
          axiosConfig
              .post("/users/refresh_token", {
                refresh_token: localStorage.getItem("refreshToken"),
              })
              .then((res) => {
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
  };

  const handleClickOpenAddressDialog = () => {
    setOpenAddressDialog(true);
  };

  const handleCloseAddressDialog = () => {
    setOpenAddressDialog(false);
  };

  const handleChangeCountryName = (e) => {
    setCountry(e.target.value);
    axios.post("https://countriesnow.space/api/v0.1/countries/states", {
      country: e.target.value,
    }).then((res) => setStatesName(res.data.data.states));
  };

  const handleChangeStateName = (e) => {
    setState(e.target.value);
    axios.post("https://countriesnow.space/api/v0.1/countries/state/cities", {
      country: country,
      state: e.target.value,
    }).then((res) => setCities(res.data.data));
  };

  const checkAddress = (
    title,
    fullName,
    phone,
    address,
    apartment,
    country,
    state,
    city,
    zipCode,
    email
  ) => {
    if (
      title != "" &&
      fullName != "" &&
      phone &&
      address != "" &&
      apartment != "" &&
      country != "" &&
      state != "" &&
      city != "" &&
      zipCode != "" &&
      email != ""
    ) {
      setDisableSave(false);
    } else {
      setDisableSave(true);
    }
  };

  const addAddress = () => {
    _setDisableSave(false);
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
    
    axiosConfig.post("/users/address/add", addressObj, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      setOpenAddressDialog(false);
      getAddresses();
      _setDisableSave(true);
    }).catch((err) =>{
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

  const handleCloseDialogDelete = () => {
    setOpenDelete(false);
    setAnchorEl(null);
  };

  const clickDeleteAddress = () => {
    
    axiosConfig.delete(`/users/address/${selectedRow.id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then(() => {
      setOpenDelete(false);
      setAnchorEl(null);
      getAddresses();
    }).catch((err) =>{
      if(err.response.data.error.status === 401){
        axiosConfig
          .post("/users/refresh_token", {
            refresh_token: localStorage.getItem("refreshToken"),
          })
          .then((res) => {
            setShowMassage('Delete address has a problem!')
            setOpenMassage(true)
            localStorage.setItem("token", res.data.accessToken);
            localStorage.setItem("refreshToken", res.data.refreshToken);
            clickDeleteAddress();
          })
      }else{
        setShowMassage('Delete address has a problem!')
        setOpenMassage(true)
      }
    });
  };

  const handleClickEditAndDeleteMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseEditAndDeleteMenu = () => {
    setAnchorEl(null);
  };

  const handleClickEdit = () => {
    axios.post("https://countriesnow.space/api/v0.1/countries/states", {
      country: selectedRow.country,
    }).then((res) => {
      setStatesName(res.data.data.states);
    });

    axios.post("https://countriesnow.space/api/v0.1/countries/state/cities", {
      country: selectedRow.country,
      state: selectedRow.state,
    }).then((res) => setCities(res.data.data));

    checkAddress(
      selectedRow.title,
      selectedRow.full_name,
      kuwaitPhoneNumberRegex.test(selectedRow.phone),
      selectedRow.address,
      selectedRow.apartment,
      selectedRow.country,
      selectedRow.state,
      selectedRow.city,
      selectedRow.zip_code,
      selectedRow.email
    );
    setIsEdit(true);
    setOpenAddressDialog(true);
  };

  const handleClickDelete = () => {
    setOpenDelete(true);
  };

  const editAddress = () => {
    _setDisableSave(false);
    const addressObj = {
      title: title === "" ? selectedRow.title : title,
      full_name: fullName === "" ? selectedRow.full_name : fullName,
      phone: phone === "" ? selectedRow.phone : phone,
      address: address === "" ? selectedRow.address : address,
      apartment: apartment == "" ? selectedRow.apartment : apartment,
      country: country === "" ? selectedRow.country : country,
      state: state === "" ? selectedRow.state : state,
      city: city === "" ? selectedRow.city : city,
      zip_code: zipCode === "" ? selectedRow.zip_code : zipCode,
      email: email === "" ? selectedRow.email : email,
    };
    axiosConfig
      .put(`/users/address/${selectedRow.id}`, addressObj, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setOpenAddressDialog(false);
        setIsEdit(false);
        getAddresses();
        setAnchorEl(null);
        _setDisableSave(true);
      })
      .catch((err) =>{
        if(err.response.data.error.status === 401){
          axiosConfig
            .post("/users/refresh_token", {
              refresh_token: localStorage.getItem("refreshToken"),
            })
            .then((res) => {
              setShowMassage('Edit address has a problem!')
              setOpenMassage(true)
              localStorage.setItem("token", res.data.accessToken);
              localStorage.setItem("refreshToken", res.data.refreshToken);
              editAddress();
            })
        }else{
          setShowMassage('Edit address has a problem!')
          setOpenMassage(true)
        }
      });
  };

  const checkPhoneNumber = (e) => {
    if (kuwaitPhoneNumberRegex.test(e.target.value)) {
      return true;
    }
    return false;
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenMassage(false);
  };

  return (
    <ProfileLayout pageName="Address">
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
            justifyContent:'space-between'
          }}
        >
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
          
          <Grid  display='flex' justifyContent="flex-end" pr="41px">
            <Button color="White" sx={{bgcolor:"P.main",width:"34px",minWidth:"34px",height:"28px","&:hover":{bgcolor:"P.main"} }} 
            
            onClick={()=>{setOpenAddressDialog(true)}}
            >
            +
            </Button>


          </Grid>
        </Grid>
      </Hidden>
      <Hidden mdUp>
        <Grid display="flex" justifyContent="end">
          {addreses.length > 0 ? (
            <Button color="P" onClick={handleClickOpenAddressDialog}>
              Add Address +
            </Button>
          ) : (
            ""
          )}
        </Grid>
      </Hidden>
      <Grid
        xs={12}
        mb={1}
        bgcolor="White.main"
        sx={{
          borderRadius: "5px",
          paddingLeft: "38px",
          marginTop: "5px",
          marginLeft: {sm:"0", md:"35px"},
          padding: "12px 25px 50px 25px",
        }}
      >
        <Grid xs={12} display="flex" justifyContent="center">
          {addreses.length > 0 ? (
            <Grid
              xs={12}
              pl={"12px"}
              display="flex"
              flexWrap="wrap"
              justifyContent={addreses.length == 1 ? "center" : "space-between"}
            >
              {addreses.map((address, index) => {
                return (
                  <Grid
                    md={window.innerWidth > 750 ? 5.7 : 12}
                    xs={window.innerWidth > 750 ? 5.7 : 12}
                    border={1}
                    borderColor="gray"
                    m={2}
                    ml={0}
                    sx={{ backgroundImage: `url(${BackgroundAddress})` }}
                  >
                    <Grid
                      xs={12}
                      display="flex"
                      pb={1}
                      justifyContent="space-between"
                    >
                      <Typography variant="h3" p={1}>
                        {address.title}
                      </Typography>
                      <IconButton
                        aria-label="more"
                        id="demo-positioned-menu"
                        aria-controls={
                          openEditAndDeleteMenu
                            ? "demo-positioned-menu"
                            : undefined
                        }
                        aria-expanded={
                          openEditAndDeleteMenu ? "true" : undefined
                        }
                        aria-haspopup="true"
                        onClick={(event) => {
                          setSelectedRow(address);
                          if (address.phone === "") {
                            setCheckPhoneFormate(true);
                          } else {
                            setCheckPhoneFormate(
                              kuwaitPhoneNumberRegex.test(address.phone)
                            );
                          }
                          handleClickEditAndDeleteMenu(event);
                        }}
                      >
                        <MoreVertIcon color="Black" />
                      </IconButton>
                      
                      <Menu
                        id="demo-positioned-menu"
                        aria-labelledby="demo-positioned-button"
                        anchorEl={anchorEl}
                        open={openEditAndDeleteMenu}
                        onClose={handleCloseEditAndDeleteMenu}
                        anchorOrigin={{
                          vertical: "top",
                          horizontal: "right",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "right",
                        }}
                      >
                        <MenuItem onClick={handleClickEdit}>Edit</MenuItem>
                        <MenuItem onClick={handleClickDelete}>Delete</MenuItem>
                      </Menu>
                    </Grid>
                    <Grid xs={12} display="flex" flexDirection="column" p={1}>
                      <Grid display="flex" flexDirection="column">
                        <Typography variant="h10">{address.address}</Typography>
                        <Typography variant="h10" pt={1} pb={1}>
                          {address.city}, {address.country}
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
          ) : (
            <Grid
              xs={12}
              display="flex"
              alignItems="center"
              flexDirection="column"
            >
              <Grid p={2}>
                <Card sx={{ width: "90px", height: "90px" }}>
                  <CardMedia
                    component="img"
                    height="90"
                    image={NoAddressImage}
                  />
                </Card>
              </Grid>
              <Grid p={2} xs={9} textAlign="center">
                <Typography variant="h2">
                  You have no saved addresses. You can add addresses to shop
                  more quickly.{" "}
                </Typography>
              </Grid>
              <Grid p={2} style={{ color: "white" }}>
                <Button
                  variant="contained"
                  color="P"
                  onClick={handleClickOpenAddressDialog}
                >
                  Add Address
                </Button>
              </Grid>
            </Grid>
          )}
        </Grid>

        <Dialog
          open={openAddressDialog}
          fullWidth
          onClose={handleCloseAddressDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <Grid xs={12} style={{ width: "100%", minHeight: "500px" }}>
            <Grid xs={12} p={2}>
              <Typography variant="h3">
                {isEdit ? "Edit Address" : "Add Address"}
              </Typography>
            </Grid>
            <Divider />
            <Grid
              container
              spacing={2}
              xs={12}
              sx={{ display: "flex", margin: 0, paddingRight: 2 }}
              flexWrap="wrap"
            >
              <Grid item xs={window.innerWidth>500? 6:12}>
                <TextField
                  id="outlined-basic"
                  label="Title"
                  color="P"
                  fullWidth
                  defaultValue={isEdit ? selectedRow.title : ""}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    checkAddress(
                      e.target.value,
                      fullName,
                      phone,
                      address,
                      apartment,
                      country,
                      state,
                      city,
                      zipCode,
                      email
                    );
                  }}
                />
              </Grid>
              <Grid item xs={window.innerWidth>500? 6:12}>
                <TextField
                  id="outlined-basic"
                  label="Full Name"
                  color="P"
                  fullWidth
                  defaultValue={isEdit ? selectedRow.full_name : ""}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    checkAddress(
                      title,
                      e.target.value,
                      phone,
                      address,
                      apartment,
                      country,
                      state,
                      city,
                      zipCode,
                      email
                    );
                  }}
                />
              </Grid>
              <Grid item xs={window.innerWidth>500? 6:12}>
                <FormControl
                  sx={{ width: "100%" }}
                  error={phone === "" ? true : false}
                >
                  <TextField
                    id="outlined-basic"
                    label="Phone Number"
                    color="P"
                    fullWidth
                    defaultValue={isEdit ? selectedRow.phone : ""}
                    onChange={(e) => {
                      setPhone(checkPhoneNumber(e) ? e.target.value : "");
                      checkAddress(
                        title,
                        fullName,
                        kuwaitPhoneNumberRegex.test(e.target.value),
                        address,
                        apartment,
                        country,
                        state,
                        city,
                        zipCode,
                        email
                      );
                      if (e.target.value === "") {
                        setCheckPhoneFormate(true);
                      } else {
                        setCheckPhoneFormate(
                          kuwaitPhoneNumberRegex.test(e.target.value)
                        );
                      }
                    }}
                  />
                  

                  {checkPhoneFormate ? (
                    ""
                  ) : (
                    <FormHelperText
                      id="outlined-weight-helper-text"
                      sx={{ color: "red" }}
                    >
                      please write kowait format! like:+965********
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={window.innerWidth>500? 6:12}>
                <TextField
                  id="outlined-basic"
                  label="Email"
                  color="P"
                  fullWidth
                  defaultValue={isEdit ? selectedRow.email : ""}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    checkAddress(
                      title,
                      fullName,
                      phone,
                      address,
                      apartment,
                      country,
                      state,
                      city,
                      zipCode,
                      e.target.value
                    );
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="outlined-basic"
                  label="Address"
                  color="P"
                  fullWidth
                  defaultValue={isEdit ? selectedRow.address : ""}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    checkAddress(
                      title,
                      fullName,
                      phone,
                      e.target.value,
                      apartment,
                      country,
                      state,
                      city,
                      zipCode,
                      email
                    );
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="outlined-basic"
                  label="Apartment, suit, etc."
                  color="P"
                  fullWidth
                  defaultValue={isEdit ? selectedRow.apartment : ""}
                  onChange={(e) => {
                    setApartment(e.target.value);
                    checkAddress(
                      title,
                      fullName,
                      phone,
                      address,
                      e.target.value,
                      country,
                      state,
                      city,
                      zipCode,
                      email
                    );
                  }}
                />
              </Grid>
              <Grid item xs={window.innerWidth>450? 6:12}>
                <FormControl fullWidth color="P">
                  <InputLabel id="demo-simple-select-label">Country</InputLabel>
                  <Select
                    IconComponent={KeyboardArrowDownIcon}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Country"
                    defaultValue={isEdit ? selectedRow.country : ""}
                    onChange={(e) => {
                      handleChangeCountryName(e);
                      checkAddress(
                        title,
                        fullName,
                        phone,
                        address,
                        apartment,
                        e.target.value,
                        state,
                        city,
                        zipCode,
                        email
                      );
                    }}
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
              <Grid item xs={window.innerWidth>450? 6:12}>
                <FormControl fullWidth color="P">
                  <InputLabel id="demo-simple-select-label">State</InputLabel>
                  <Select
                    IconComponent={KeyboardArrowDownIcon}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="State"
                    defaultValue={isEdit ? selectedRow.state : ""}
                    onChange={(e) => {
                      handleChangeStateName(e);
                      checkAddress(
                        title,
                        fullName,
                        phone,
                        address,
                        apartment,
                        country,
                        e.target.value,
                        city,
                        zipCode,
                        email
                      );
                    }}
                  >
                    {statesName.map((state) => {
                      return (
                        <MenuItem value={state.name}>{state.name}</MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={window.innerWidth>450? 6:12}>
                <FormControl fullWidth color="P">
                  <InputLabel id="demo-simple-select-label">City</InputLabel>
                  <Select
                    IconComponent={KeyboardArrowDownIcon}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="City"
                    defaultValue={isEdit ? selectedRow.city : ""}
                    onChange={(e) => {
                      setCity(e.target.value);
                      checkAddress(
                        title,
                        fullName,
                        phone,
                        address,
                        apartment,
                        country,
                        state,
                        e.target.value,
                        zipCode,
                        email
                      );
                    }}
                  >
                    {cities.map((city) => {
                      return <MenuItem value={city}>{city}</MenuItem>;
                    })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={window.innerWidth>450? 6:12}>
                <TextField
                  id="outlined-basic"
                  label="Zip Code"
                  color="P"
                  fullWidth
                  defaultValue={isEdit ? selectedRow.zip_code : ""}
                  onChange={(e) => {
                    setZipCode(e.target.value);
                    checkAddress(
                      title,
                      fullName,
                      phone,
                      address,
                      apartment,
                      country,
                      state,
                      city,
                      e.target.value,
                      email
                    );
                  }}
                />
              </Grid>
            </Grid>
            <Grid
              xs={12}
              display="flex"
              justifyContent="end"
              pb={2}
              pr={1}
              pt={2}
            >
              <Grid p={1}>
                <Button
                  color="Black"
                  onClick={() => {
                    setOpenAddressDialog(false);
                    setIsEdit(false);
                    setAnchorEl(null);
                  }}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid p={1} style={{ color: "white" }}>
                {_disableSave ? (
                  <Button
                    disabled={disableSave}
                    color="Black"
                    variant="contained"
                    onClick={isEdit ? editAddress : addAddress}
                  >
                    {isEdit ? "Edit Address" : "Add Address"}
                  </Button>
                ) : (
                  <CircularProgress sx={{ width: 10, ml: 5 }} color="P" />
                )}
              </Grid>
            </Grid>
          </Grid>
        </Dialog>
        <Dialog
          open={openDelete}
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
              Are you sure you want to delete {selectedRow.title} address?
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
              variant="contained"
              color="P"
              sx={{ mt: 2, mb: 2, mr: 1, ml: 1, color: "white" }}
              onClick={clickDeleteAddress}
            >
              Delete
            </Button>
            <Button
              variant="outlined"
              color="G1"
              onClick={handleCloseDialogDelete}
              sx={{ mt: 2, mb: 2, mr: 1, ml: 1 }}
            >
              Cancel
            </Button>
          </Grid>
        </Dialog>
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
    </ProfileLayout>
  );
};

export default Addresses;
