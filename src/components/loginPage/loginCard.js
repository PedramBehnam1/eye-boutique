import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Link, useHistory } from "react-router-dom";
import axiosConfig from "../../axiosConfig";
import "../../asset/css/loginCard.css";
import TextField from "@mui/material/TextField";
import OrWith from "./OrWith";
import SubmitBtn from "./submitBtn";
import { Typography, Grid, Snackbar, IconButton } from "@mui/material";
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';

const LoginCard = () => {
  const [value, setValue] = useState({
    cellphone: "",
    password: "",
  });
  const [error, setError] = useState(false);
  const [errorMSG, setErrorMSG] = useState(false);
  let history = useHistory();
  const [openMassage, setOpenMassage] = useState(false);
  const [showMassage, setShowMassage] = useState('');

  useEffect(() => {}, [errorMSG]);
  const handleSubmit = () => {
    if (value !== "") {
      axiosConfig
        .post(`/users/authenticate`, value)
        .then((response) => {
          
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("refreshToken", response.data.refreshToken);
          history.push("/");
        })
        .catch(function (error) {
          setErrorMSG(true);
          if (error.response.data.error.code === 104) {
            setError(true);
            setShowMassage('invalid password')
            setOpenMassage(true)
          } else if (error.response.data.error.code === 100) {
            setShowMassage('Invalid phone number, no user found with this cellphone')
            setOpenMassage(true)
            setErrorMSG(true);
          } else if (error.response.data.error.code === 101) {
            setShowMassage('The user not verified')
            setOpenMassage(true)
            localStorage.setItem(
              "token",
              error.response.data.error.field.accessToken
            );
            setErrorMSG(true);

            setTimeout(() => {
              history.push("/verifyByCell");
            }, 2000);
          } else if (error.response.data.error.code === 102) {
            setShowMassage('The user not updated profile info')
            setOpenMassage(true)
            localStorage.setItem(
              "token",
              error.response.data.error.field.accessToken
            );
            setTimeout(() => {
              history.push("/profileInfo");
            }, 2000);
          }
        });
    }
  };
  
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenMassage(false);
  };

  return (
    <Grid>
      
      <Grid sx={{ marginBottom: "50px" }}>
        <Typography variant="MontseratFS16">
          Use Phone Number To Login
        </Typography>
      </Grid>
      <Typography variant="MontseratFS14">Mobile Number</Typography>
      <TextField
        id="standard-basic"
        variant="standard"
        value={value.cellphone}
        onChange={(e) => setValue({ ...value, cellphone: e.target.value })}
        fullWidth
        color="G1"
        placeholder="EX +98 912 1234"
        type="number"
      />
      {errorMSG ? (
        <Typography color="red">Wrong username or password</Typography>
      ) : (
        <Typography> </Typography>
      )}

      <TextField
        id="standard-password-input"
        variant="standard"
        type="password"
        label="Password"
        color="G1"
        value={value.password}
        onChange={(e) => setValue({ ...value, password: e.target.value })}
        fullWidth
        sx={{ marginTop: "20px" }}
        error={error}
      />

      <SubmitBtn value={value} text="Continue" onClick={handleSubmit} />
      <Typography sx={{ marginTop: "20px" }}>
        By continuing, you agree to Eye boutique's
        <Link href="" underline="none" className="linkColor">
          {" "}
          Conditions of Use
        </Link>{" "}
        and{" "}
        <Link href="" underline="none" className="linkColor">
          Privacy Notice
        </Link>
        .
      </Typography>

      <OrWith />                                                        
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

export default LoginCard;
