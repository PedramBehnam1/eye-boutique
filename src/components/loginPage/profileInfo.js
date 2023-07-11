import React, { useState } from "react";
import {
  Grid,
  MenuItem,
  Paper,
  Typography,
  Input,
  Button,
  TextField,
  IconButton,
  InputLabel,
  FormControl,
  InputAdornment,
  Snackbar
} from "@mui/material";
import { useHistory } from "react-router-dom";
import axiosConfig from "../../axiosConfig.js";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "../../asset/css/loginPage/verifyByCell.css";

import Select from "@mui/material/Select";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';

const ProfileInfo = () => {
  let history = useHistory();
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    re_password: "",
    gender: "",
    birthdate: "",
  });

  const [error, setError] = useState(false);
  const [openMassage, setOpenMassage] = useState(false);
  const [showMassage, setShowMassage] = useState('');
  

  const handleSubmit = () => {
    if (
      user.first_name == "" ||
      user.last_name == "" ||
      user.email == "" ||
      user.password == "" ||
      user.re_password == "" ||
      user.password != user.re_password
    ) {
      setError(true);
    } else {
      axiosConfig
        .post("/users/update_user", user, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          
          history.push("/");
        })
        .catch((error) => {
          setShowMassage("error", error.response)
          setOpenMassage(true)
        })
        .catch((err) =>{
          if(err.response.data.error.status === 401){
            axiosConfig
              .post("/users/refresh_token", {
                refresh_token: localStorage.getItem("refreshToken"),
              })
              .then((res) => {
                setShowMassage('Update user has a problem!')
                setOpenMassage(true) 
                localStorage.setItem("token", res.data.accessToken);
                localStorage.setItem("refreshToken", res.data.refreshToken);
                handleSubmit();
              })
          }else{
            setShowMassage('Update user has a problem!')
            setOpenMassage(true) 
          }
        });
    }
  };
  
  const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
      return;
      }

      setOpenMassage(false);
  };

  return (
    <Grid
      container
      xs={12}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Paper
        style={{
          boxShadow: "none",
          borderRadius: "10px",
          width: "500px",
          backgroundColor: "#F5F5F5",
        }}
      >
        <Grid
          onClick={() => {
            history.push("/loginPage");
          }}
          sx={{
            display: "flex",
            justifyContent: "start",
            flexDirection: "row",
            alignItems: "center",
            height: "100px",
            paddingLeft: "30px",
            paddingRight: "30px",
            backgroundColor: "P.main",
            borderRadius: "10px",
            cursor: "pointer",
          }}
        >
          <ArrowBackIcon sx={{ color: "white", marginRight: "15px" }} />
          <Typography color="white" sx={{ fontSize: "20px" }}>
            Profile Info
          </Typography>
        </Grid>
        <Grid
          sx={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "start",
            borderRadius: "10px",
            marginTop: "3px",
            backgroundColor: "white",
            padding: "25px",
            width: "100%",
            minHeight: "400px",
          }}
        >
          <Grid xs={5.5}>
            <TextField
              id="standard-basic"
              variant="standard"
              label="First Name"
              color="G1"
              value={user.first_name}
              onChange={(e) => setUser({ ...user, first_name: e.target.value })}
              fullWidth
              error={error}
            />
          </Grid>
          <Grid xs={5.5}>
            <TextField
              id="standard-basic"
              variant="standard"
              label="Last Name"
              color="G1"
              value={user.last_name}
              onChange={(e) => setUser({ ...user, last_name: e.target.value })}
              fullWidth
              error={error}
            />
          </Grid>
          <Grid xs={5.5}>
            <TextField
              id="date"
              variant="standard"
              label="Birthday"
              type="date"
              sx={{ width: 220 }}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => setUser({ ...user, birthdate: e.target.value })}
            />
          </Grid>
          <Grid xs={5.5}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Gender</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                variant="standard"
                id="demo-simple-select"
                
                sx={{ marginTop: 2, borderBottom: "1px solid gray" }}
                disableUnderline
                inputProps={{ "aria-label": "Without label" }}
                
                onChange={(e) => {
                  setUser({ ...user, gender: e.target.value });
                }}
              >
                <MenuItem value={1}>Male</MenuItem>
                <MenuItem value={2}>Female</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid xs={12}>
            <TextField
              id="standard-basic"
              variant="standard"
              label="Email"
              type="email"
              color="G1"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              fullWidth
              error={error}
            />
          </Grid>
          <Grid xs={5.5}>
            <FormControl variant="standard">
              <InputLabel htmlFor="standard-adornment-password">
                Password
              </InputLabel>
              <Input
                id="standard-adornment-password"
                type={showPassword ? "text" : "password"}
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                error={error}
              />
            </FormControl>
          </Grid>
          <Grid xs={5.5}>
            <FormControl variant="standard">
              <InputLabel htmlFor="standard-adornment-password">
                Re-Password
              </InputLabel>
              <Input
                id="standard-adornment-password"
                type={showRePassword ? "text" : "password"}
                value={user.re_password}
                onChange={(e) => setUser({ ...user, re_password: e.target.value })}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowRePassword(!showRePassword)}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showRePassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                error={error}
              />
            </FormControl>
          </Grid>
          <Button
            variant="contained"
            color="primary"
            sx={{
              borderRadius: "10px",
              textTransform: "capitalize",
              fontWeight: 600,
              color: "white",
              backgroundColor: "gray",
              height: "40px",
              width: "330px",
              display: "flex",
              alignSelf: "center",
              margin: "auto",
              "&:hover": {
                backgroundColor: "#CB929B",
                color: "white",
              },
            }}
            onClick={() => {
              handleSubmit();
            }}
          >
            Next
          </Button>
        </Grid>
      </Paper>
                                                                    
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

export default ProfileInfo;
