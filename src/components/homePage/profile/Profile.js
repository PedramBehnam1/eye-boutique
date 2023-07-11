import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import ProfileLayout from "./ProfileLayout";
import {
  Button,
  CircularProgress,
  Hidden,
  Typography,
  Snackbar,
  IconButton
} from "@mui/material";
import TextField from "@mui/material/TextField";
import axiosConfig from "../../../axiosConfig";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';

const Profile = () => {
  const [user, setUser] = useState("11");
  const [newUser, setNewUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    birthday: "",
    gender: 0,
    role: "",
  });
  const [disabledSave, setDisabledSave] = useState(false);
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
        setUser(res.data.user);
        setNewUser({ ...newUser, birthday: res.data.user.birthday });
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

  const editUser = () => {
    setDisabledSave(true);
    
    const userObj = {
      first_name:
        newUser.first_name === "" ? user.first_name : newUser.first_name,
      last_name: newUser.last_name === "" ? user.last_name : newUser.last_name,
      email: newUser.email === "" ? user.email : newUser.email,
      birthday: newUser.birthday === "" ? user.birthday : newUser.birthday,
    };

    axiosConfig
      .put(`/users/profile/`, userObj, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        getUserInfo();
        setDisabledSave(false);
      }).catch((err) =>{
        if(err.response.data.error.status === 401){
          axiosConfig
            .post("/users/refresh_token", {
              refresh_token: localStorage.getItem("refreshToken"),
            })
            .then((res) => {
              setShowMassage('Edit user has a problem!')
              setOpenMassage(true) 
              localStorage.setItem("token", res.data.accessToken);
              localStorage.setItem("refreshToken", res.data.refreshToken);
              editUser();
            })
        }else{
          setShowMassage('Edit user has a problem!')
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
    <ProfileLayout pageName="Profile">
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
            viewBox="0 0 20 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.71 11.71C14.6904 10.9387 15.406 9.88092 15.7572 8.68394C16.1085 7.48697 16.0779 6.21027 15.6698 5.03147C15.2617 3.85267 14.4963 2.83039 13.4801 2.10686C12.4639 1.38332 11.2474 0.994507 10 0.994507C8.75255 0.994507 7.53611 1.38332 6.51993 2.10686C5.50374 2.83039 4.73834 3.85267 4.33021 5.03147C3.92208 6.21027 3.89151 7.48697 4.24276 8.68394C4.59401 9.88092 5.3096 10.9387 6.29 11.71C4.61007 12.383 3.14428 13.4994 2.04889 14.9399C0.953495 16.3805 0.26956 18.0913 0.0699967 19.89C0.0555513 20.0213 0.0671132 20.1542 0.104022 20.2811C0.140931 20.4079 0.202464 20.5263 0.285108 20.6293C0.452016 20.8375 0.69478 20.9708 0.959997 21C1.22521 21.0292 1.49116 20.9518 1.69932 20.7849C1.90749 20.618 2.04082 20.3752 2.07 20.11C2.28958 18.1552 3.22168 16.3498 4.68822 15.0388C6.15475 13.7278 8.0529 13.003 10.02 13.003C11.9871 13.003 13.8852 13.7278 15.3518 15.0388C16.8183 16.3498 17.7504 18.1552 17.97 20.11C17.9972 20.3557 18.1144 20.5827 18.2991 20.747C18.4838 20.9114 18.7228 21.0015 18.97 21H19.08C19.3421 20.9698 19.5817 20.8373 19.7466 20.6313C19.9114 20.4252 19.9881 20.1624 19.96 19.9C19.7595 18.0962 19.0719 16.381 17.9708 14.9382C16.8698 13.4954 15.3969 12.3795 13.71 11.71ZM10 11C9.20887 11 8.43551 10.7654 7.77772 10.3259C7.11992 9.88636 6.60723 9.26164 6.30448 8.53074C6.00173 7.79983 5.92251 6.99557 6.07686 6.21964C6.2312 5.44372 6.61216 4.73099 7.17157 4.17158C7.73098 3.61217 8.44371 3.2312 9.21964 3.07686C9.99556 2.92252 10.7998 3.00173 11.5307 3.30448C12.2616 3.60724 12.8863 4.11993 13.3259 4.77772C13.7654 5.43552 14 6.20888 14 7C14 8.06087 13.5786 9.07828 12.8284 9.82843C12.0783 10.5786 11.0609 11 10 11Z"
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
        <Typography variant="h8" sx={{ marginLeft: "10px" }}>
          Basic Info
        </Typography>
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
          <Grid item xs={12} md={6}>
            {user.first_name && (
              <>
                <TextField
                  id="outlined-basic"
                  label="First Name"
                  color="P"
                  fullWidth
                  defaultValue={user.first_name}
                  onChange={(event) => {
                    setNewUser({ ...newUser, first_name: event.target.value });
                  }}
                />
              </>
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            {user.last_name && (
              <TextField
                id="outlined-basic"
                label="Last Name"
                color="P"
                fullWidth
                defaultValue={user.last_name}
                onChange={(event) => {
                  setNewUser({ ...newUser, last_name: event.target.value });
                }}
              />
            )}
          </Grid>

          {user.birthdate && (
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  color="P"
                  label="Birthday"
                  value={newUser.birthday}
                  format="DD-MM-YYYY"
                  disabled
                  renderInput={(params) => (
                    <TextField {...params} color="P" fullWidth />
                  )}
                />
              </LocalizationProvider>
            </Grid>
          )}

          <Grid item xs={12} md={6}>
            {user.gender && (
              <>
                <TextField
                  id="outlined-basic"
                  label="Gender"
                  color="P"
                  disabled
                  fullWidth
                  defaultValue={
                    user.gender == 1
                      ? "Male"
                      : user.gender == 2
                      ? "Female"
                      : "Prefer not to say"
                  }
                />
              </>
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            {user.role && (
              <>
                <TextField
                  id="outlined-basic"
                  label="Role"
                  color="P"
                  disabled
                  fullWidth
                  defaultValue={
                    user.role == 1
                    ? "Super Admin"
                    : user.role == 2
                    ? "Admin"
                    : "User"
                  }
                />
              </>
            )}
          </Grid>
        </Grid>
      </Grid>

      <Grid
        xs={12}
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
        >
          <Typography variant="h8" sx={{ marginLeft: "10px" }}>
            Contact Info
          </Typography>
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
            <Grid item xs={12} md={6}>
              {user.email && (
                <TextField
                  id="outlined-basic"
                  label="Email"
                  color="P"
                  fullWidth
                  defaultValue={user.email}
                  onChange={(event) => {
                    setNewUser({ ...newUser, email: event.target.value });
                  }}
                />
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              {user.cell && (
                <TextField
                  id="outlined-basic"
                  label="Phone Number"
                  color="P"
                  disabled
                  fullWidth
                  defaultValue={"+" + user.cell}
                />
              )}
            </Grid>
          </Grid>

          <Grid
            xs={12}
            display="flex"
            justifyContent="start"
            sx={{
              marginTop: "20px",
              marginLeft:"16px"
            }}
          >
            <Grid style={{ color: "white" }}>
              {!disabledSave && (
                <Button
                  color="P"
                  variant="contained"
                  disabled={user === newUser}
                  onClick={() => {
                    editUser();
                  }}
                >
                  Save Changes
                </Button>
              )}
              {disabledSave && (
                <CircularProgress sx={{ width: 10, ml: 5 }} color="P" />
              )}
            </Grid>
          </Grid>
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
    </ProfileLayout>
  );
};

export default Profile;
