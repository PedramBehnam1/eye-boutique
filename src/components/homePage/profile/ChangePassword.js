import React, { useState, useEffect } from "react";
import ProfileLayout from "./ProfileLayout";
import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Hidden,
  Snackbar,
  Alert,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import axiosConfig from "../../../axiosConfig";
import { useHistory } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";

const ChangePassword = () => {
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [reNewPass, setreNewPass] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showReNewPassword, setShowReNewPassword] = useState(false);
  const [WrongOldPass, setWrongOldPass] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [showMassage, setShowMassage] = useState('');
  
  const [width, setWidth] = useState("");
  const [windowResizing, setWindowResizing] = useState(false);
  const history = useHistory();
  
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

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSuccessClose = () => {
    setOpenSuccess(false);
    setShowMassage("Password changed successfully!")
  };
  const action = (
    <React.Fragment>
      <Button color="secondary" size="small" onClick={handleSuccessClose}>
        Login
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleSuccessClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  const changePass = () => {
    const passObj = {
      password: newPass,
      re_password: reNewPass,
      old_password: oldPass,
    };

    axiosConfig
      .post("/users/change_pass", passObj, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => history.push("/"))
      .catch(
        (error) =>
          error.response.data.error.code === "104" ? setWrongOldPass(true) : ""
      )
      .catch((err) =>{
        if(err.response.data.error.status === 401){
         axiosConfig
          .post("/users/refresh_token", {
            refresh_token: localStorage.getItem("refreshToken"),
          })
          .then((res) => {
            setShowMassage('Change pass has a problem!');
            setOpenSuccess(true)
            localStorage.setItem("token", res.data.accessToken);
            localStorage.setItem("refreshToken", res.data.refreshToken);
            changePass();
          })
        }else{
          setShowMassage('Change pass has a problem!')
          setOpenSuccess(true)
        }
      });
  };

  return (
    <ProfileLayout pageName="Change Pass">
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
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6.18V1C18 0.734784 17.8946 0.48043 17.7071 0.292893C17.5196 0.105357 17.2652 0 17 0C16.7348 0 16.4804 0.105357 16.2929 0.292893C16.1054 0.48043 16 0.734784 16 1V6.18C15.4208 6.3902 14.9205 6.77363 14.5668 7.27816C14.2132 7.7827 14.0235 8.38388 14.0235 9C14.0235 9.61612 14.2132 10.2173 14.5668 10.7218C14.9205 11.2264 15.4208 11.6098 16 11.82V19C16 19.2652 16.1054 19.5196 16.2929 19.7071C16.4804 19.8946 16.7348 20 17 20C17.2652 20 17.5196 19.8946 17.7071 19.7071C17.8946 19.5196 18 19.2652 18 19V11.82C18.5792 11.6098 19.0795 11.2264 19.4332 10.7218C19.7868 10.2173 19.9765 9.61612 19.9765 9C19.9765 8.38388 19.7868 7.7827 19.4332 7.27816C19.0795 6.77363 18.5792 6.3902 18 6.18ZM17 10C16.8022 10 16.6089 9.94135 16.4444 9.83147C16.28 9.72159 16.1518 9.56541 16.0761 9.38268C16.0004 9.19996 15.9806 8.99889 16.0192 8.80491C16.0578 8.61093 16.153 8.43275 16.2929 8.29289C16.4327 8.15304 16.6109 8.0578 16.8049 8.01921C16.9989 7.98063 17.2 8.00043 17.3827 8.07612C17.5654 8.15181 17.7216 8.27998 17.8315 8.44443C17.9414 8.60888 18 8.80222 18 9C18 9.26522 17.8946 9.51957 17.7071 9.70711C17.5196 9.89464 17.2652 10 17 10ZM11 12.18V1C11 0.734784 10.8946 0.48043 10.7071 0.292893C10.5196 0.105357 10.2652 0 10 0C9.73478 0 9.48043 0.105357 9.29289 0.292893C9.10536 0.48043 9 0.734784 9 1V12.18C8.42085 12.3902 7.92046 12.7736 7.56684 13.2782C7.21322 13.7827 7.02352 14.3839 7.02352 15C7.02352 15.6161 7.21322 16.2173 7.56684 16.7218C7.92046 17.2264 8.42085 17.6098 9 17.82V19C9 19.2652 9.10536 19.5196 9.29289 19.7071C9.48043 19.8946 9.73478 20 10 20C10.2652 20 10.5196 19.8946 10.7071 19.7071C10.8946 19.5196 11 19.2652 11 19V17.82C11.5792 17.6098 12.0795 17.2264 12.4332 16.7218C12.7868 16.2173 12.9765 15.6161 12.9765 15C12.9765 14.3839 12.7868 13.7827 12.4332 13.2782C12.0795 12.7736 11.5792 12.3902 11 12.18ZM10 16C9.80222 16 9.60888 15.9414 9.44443 15.8315C9.27998 15.7216 9.15181 15.5654 9.07612 15.3827C9.00043 15.2 8.98063 14.9989 9.01921 14.8049C9.0578 14.6109 9.15304 14.4327 9.29289 14.2929C9.43274 14.153 9.61093 14.0578 9.80491 14.0192C9.99889 13.9806 10.2 14.0004 10.3827 14.0761C10.5654 14.1518 10.7216 14.28 10.8315 14.4444C10.9413 14.6089 11 14.8022 11 15C11 15.2652 10.8946 15.5196 10.7071 15.7071C10.5196 15.8946 10.2652 16 10 16ZM4 4.18V1C4 0.734784 3.89464 0.48043 3.7071 0.292893C3.51957 0.105357 3.26521 0 3 0C2.73478 0 2.48043 0.105357 2.29289 0.292893C2.10536 0.48043 2 0.734784 2 1V4.18C1.42085 4.3902 0.920458 4.77363 0.56684 5.27817C0.213221 5.7827 0.0235214 6.38388 0.0235214 7C0.0235214 7.61612 0.213221 8.2173 0.56684 8.72184C0.920458 9.22637 1.42085 9.6098 2 9.82V19C2 19.2652 2.10536 19.5196 2.29289 19.7071C2.48043 19.8946 2.73478 20 3 20C3.26521 20 3.51957 19.8946 3.7071 19.7071C3.89464 19.5196 4 19.2652 4 19V9.82C4.57915 9.6098 5.07954 9.22637 5.43316 8.72184C5.78678 8.2173 5.97647 7.61612 5.97647 7C5.97647 6.38388 5.78678 5.7827 5.43316 5.27817C5.07954 4.77363 4.57915 4.3902 4 4.18ZM3 8C2.80222 8 2.60888 7.94135 2.44443 7.83147C2.27998 7.72159 2.15181 7.56541 2.07612 7.38268C2.00043 7.19996 1.98063 6.99889 2.01921 6.80491C2.0578 6.61093 2.15304 6.43275 2.29289 6.29289C2.43274 6.15304 2.61093 6.0578 2.80491 6.01921C2.99889 5.98063 3.19996 6.00043 3.38268 6.07612C3.56541 6.15181 3.72159 6.27998 3.83147 6.44443C3.94135 6.60888 4 6.80222 4 7C4 7.26522 3.89464 7.51957 3.7071 7.70711C3.51957 7.89464 3.26521 8 3 8Z"
              fill="#757575"
            />
          </svg>
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
        <Grid
          container
          xs={12}
          sx={{
            display: "flex",
            flexDirection: "row",
            paddingTop: "20px",
            margin: 0,
          }}
          spacing={2}
        >
          <Grid item xs={12}>
            <FormControl
              error={WrongOldPass}
              color="P"
              fullWidth
              variant="outlined"
              label="Old Password"
            >
              <InputLabel htmlFor="outlined-adornment-password" label="Old Password">
                Old Password
              </InputLabel>
              <OutlinedInput
                label="Old Password"
                id="outlined-adornment-password"
                type={showOldPassword ? "text" : "password"}
                value={oldPass}
                onChange={(e) => {
                  setOldPass(e.target.value);
                  setWrongOldPass(false);
                }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showOldPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              <FormHelperText id="outlined-weight-helper-text">
                {WrongOldPass ? "Old Password Wrong!" : ""}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={window.innerWidth>500?6:12}>
            <FormControl
              error={newPass === "" ? false : newPass.length > 7 ? false : true}
              color="P"
              fullWidth
              variant="outlined"
              label="New Password"
            >
              <InputLabel htmlFor="outlined-adornment-password" label="New Password">
                New Password
              </InputLabel>
              <OutlinedInput
                label="New Password"
                id="outlined-adornment-password"
                type={showNewPassword ? "text" : "password"}
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Grid>
          <Grid item xs={window.innerWidth>500?6:12}>
            <FormControl
              error={
                reNewPass === "" ? false : reNewPass === newPass ? false : true
              }
              color="P"
              fullWidth
              variant="outlined"
              label="Re - New Password"
              
            >
              
              <InputLabel htmlFor="pass" label="Re - New Password">Re - New Password</InputLabel>
              <OutlinedInput
                label="Re - New Password"
                id="pass"
                labelWidth={10}
                type={showReNewPassword ? "text" : "password"}
                value={reNewPass}
                onChange={(e) => setreNewPass(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowReNewPassword(!showReNewPassword)}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showReNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                
              >
              </OutlinedInput>
              <FormHelperText id="outlined-weight-helper-text">
                {reNewPass === ""
                  ? ""
                  : reNewPass === newPass
                  ? ""
                  : "Password Do Not Match!"}
              </FormHelperText>
            </FormControl>
          </Grid>
        </Grid>
      </Grid>
      <Grid xs={12} display="flex" justifyContent="end">
        <Grid
          style={{ color: "white" }}
          mb={window.innerWidth > 900 ? 0 : "50px"}
        >
          <Button
            color="P"
            variant="contained"
            disabled={
              oldPass === "" ||
              reNewPass === "" ||
              newPass === "" ||
              newPass !== reNewPass ||
              WrongOldPass
            }
            onClick={changePass}
          >
            Save Changes
          </Button>
        </Grid>
      </Grid>
      <Snackbar
        open={openSuccess}
        autoHideDuration={6000}
        onClose={handleSuccessClose}
        action={action}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          {showMassage}
        </Alert>
      </Snackbar>
    </ProfileLayout>
  );
};

export default ChangePassword;
