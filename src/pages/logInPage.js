import React, {  useState } from "react";
import logoWhite from "../asset/images/logoWhite.png";
import "../asset/css/logInPage.css";
import LoginOrSingupTitle from "../components/loginPage/loginOrSingupTitle";
import {
  Grid,
  Paper,
  Typography,
  Button,
  TextField,
  IconButton,
  Snackbar,
  InputAdornment,
  Card,
  CardMedia,
} from "@mui/material";
import axiosConfig from "../axiosConfig";
import { BrowserRouter as Router, useHistory } from "react-router-dom";


import {
  getCountries,
  getCountryCallingCode,
} from "react-phone-number-input/input";
import en from "react-phone-number-input/locale/en.json";
import PropTypes from "prop-types";


import facebookIcon from "../asset/images/facebookIcon.png";
import appleIcon from "../asset/images/appleIcon.png";
import googleIcon from "../asset/images/googleIcon.png";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';

const LogInPage = (props) => {
  const [page, setPage] = useState("loginLandingPage");
  const [country, setCountry] = useState("IR");
  const [token, setToken] = useState();
  const [phoneValue, setPhoneValue] = useState();

  const [value, setValue] = useState({
    cellphone: "",
    password: "",
  });
  const [error, setError] = useState(false);
  const [errorMSG, setErrorMSG] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [openMassage, setOpenMassage] = useState(false);
  const [showMassage, setShowMassage] = useState('');

  let history = useHistory();

  const CountrySelect = ({ value, onChange, labels, ...rest }) => (
    <select
      {...rest}
      value={value}
      onChange={(event) => onChange(event.target.value || undefined)}
    >
      <option value="">{labels["ZZ"]}</option>
      {getCountries().map((country) => (
        <option key={country} value={country}>
          {labels[country]}
        </option>
      ))}
    </select>
  );
  CountrySelect.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    labels: PropTypes.objectOf(PropTypes.string).isRequired,
  };

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
          setShowMassage("Wrong username / password!")
          setOpenMassage(true)
          setErrorMSG(true);
          if (error.response.data.error.code === 104) {
            setError(true);
            setShowMassage("invalid password")
            setOpenMassage(true)
          } else if (error.response.data.error.code === 100) {
            setShowMassage("'Invalid phone number, no user found with this cellphone'")
            setOpenMassage(true)
            setErrorMSG(true);
          } else if (error.response.data.error.code === 101) {
            setShowMassage("The user not verified")
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
            setShowMassage("The user not updated profile info")
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
  
  const handleRegisterByCell = () => {
    let cellphone = getCountryCallingCode(country) + phoneValue;
    axiosConfig
      .post("/users/register_by_cell", { cellphone })
      .then((response) => {
        setToken(response.data.accessToken.toString().split(" ").pop());
        localStorage.clear();
        localStorage.setItem(
          "token",
          response.data.accessToken.toString().split(" ").pop()
        );
        localStorage.setItem("cellphone", cellphone);
        localStorage.setItem("code", response.data.token);
        history.push("/verifyByCell");
      })
      .catch((error) => {
        setShowMassage("This Phone Number Already Exists.")
        setOpenMassage(true)
        setError(true);
        setErrorMessage(error.response.data.error.message);
      });
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenMassage(false);
  };
  return (
    <Grid
      xs={12}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      {page === "loginLandingPage" ? (
        <Paper
          style={{
            boxShadow: "none",
            borderRadius: "10px",
            width: "500px",
            backgroundColor: "#F5F5F5",
          }}
        >
          <Grid
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
              height: "195px",
              backgroundColor: "Gray",
              borderRadius: "10px",
            }}
          >
            <Card
              style={{
                border: "none",
                boxShadow: "none",
                background: "none",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CardMedia
              
                component="img"
                image={logoWhite}
                alt="logo"
                sx={{ width: "160px", height: "20px", objectFit: "contain" ,cursor:'pointer'}}
                onClick={()=>{history.push({pathname:'/'})}}
              />
            </Card>
            <Typography mt={"10px"} color="#9E9E9E">
              Eye Boutique slogan
            </Typography>
          </Grid>
          <Grid
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
              borderRadius: "10px",
              marginTop: "3px",
              backgroundColor: "white",
              padding: "35px",
              minHeight: "400px",
            }}
          >
            <Grid
              sx={{
                width: "320px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
                alignItems: "center",
              }}
            >
              <Grid
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingTop: "35px",
                  alignItems: "center",
                  width: "320px",
                }}
              >
                <Button
                  sx={{
                    borderRadius: "50px",
                    border: "1px solid #E0E0E0",
                    textTransform: "capitalize",
                    backgroundColor: "P.main",
                    height: "40px",
                    width: "152px",
                    "&:hover": {
                      backgroundColor: "gray",
                      color: "white",
                      border: "1px solid gray",
                    },
                  }}
                  variant="contained"
                  onClick={() => {
                    setPage("Login");
                  }}
                >
                  Login
                </Button>
                <Button
                  sx={{
                    borderRadius: "50px",
                    border: "1px solid #E0E0E0",
                    textTransform: "capitalize",
                    fontWeight: 600,
                    color: "P.main",
                    height: "40px",
                    width: "152px",
                    "&:hover": {
                      border: "1px solid gray",
                    },
                    "&:hover": {
                      border: "1px solid gray",
                    },
                  }}
                  variant="outlined"
                  onClick={() => {
                    setPage("SignUp");
                  }}
                >
                  Sign up
                </Button>
              </Grid>
              <Grid
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  marginTop: "16px",
                }}
              >
                <Button
                  disabled
                  sx={{
                    borderRadius: "50px",
                    marginBottom: "5px",
                    border: "1px solid #E0E0E0",
                    textTransform: "capitalize",
                    fontWeight: 600,
                    color: "Black.main",
                    height: "40px",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    "&:hover": {
                      border: "1px solid gray",
                    },
                  }}
                  variant="outlined"
                  onClick={() => {
                    setPage("SignUp");
                  }}
                >
                  <IconButton sx={{ position: "absolute", left: 10 }}>
                    <img
                      src={facebookIcon}
                      style={{
                        width: "24px",
                        height: "24px",
                      }}
                    />
                  </IconButton>
                  Continue with Facebook
                </Button>
                <Button
                  disabled
                  sx={{
                    borderRadius: "50px",
                    marginBottom: "5px",
                    border: "1px solid #E0E0E0",
                    textTransform: "capitalize",
                    fontWeight: 600,
                    color: "Black.main",
                    height: "40px",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    "&:hover": {
                      border: "1px solid gray",
                    },
                  }}
                  variant="outlined"
                  onClick={() => {
                    setPage("SignUp");
                  }}
                >
                  <IconButton sx={{ position: "absolute", left: 10 }}>
                    <img
                      src={googleIcon}
                      style={{
                        width: "24px",
                        height: "24px",
                      }}
                    />
                  </IconButton>
                  Continue with Google
                </Button>
                <Button
                  disabled
                  sx={{
                    borderRadius: "50px",
                    marginBottom: "5px",
                    border: "1px solid #E0E0E0",
                    textTransform: "capitalize",
                    fontWeight: 600,
                    color: "Black.main",
                    height: "40px",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    "&:hover": {
                      border: "1px solid gray",
                    },
                  }}
                  variant="outlined"
                  onClick={() => {
                    setPage("SignUp");
                  }}
                >
                  <IconButton sx={{ position: "absolute", left: 10 }}>
                    <img
                      src={appleIcon}
                      style={{
                        width: "24px",
                        height: "26px",
                      }}
                    />
                  </IconButton>
                  Continue with Apple
                </Button>
              </Grid>
            </Grid>
            <Typography
              sx={{
                width: "320px",
                textAlign: "center",
                fontSize: "14px",
              }}
            >
              By continuing, you agree to Eye boutique's{" "}
              <span style={{ color: "#CB929B" }}>Conditions</span> of Use and
              <span style={{ color: "#CB929B", marginLeft: "3px" }}>
                Privacy Notice
              </span>
              .
            </Typography>
          </Grid>
        </Paper>
      ) : (
        ""
      )}

      {page === "Login" ? (
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
              setPage("loginLandingPage");
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
              Login
            </Typography>
          </Grid>
          <Grid
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "start",
              alignItems: "start",
              borderRadius: "10px",
              marginTop: "3px",
              backgroundColor: "white",
              padding: "25px",
              width: "100%",
              minHeight: "400px",
            }}
          >
            <Typography>Mobile Number / Email</Typography>
            <TextField
              placeholder="EX: 98 923 6069"
              id="outlined-error-helper-text"
              
              variant="standard"
              sx={{
                width: "100% ",
                "& label.Mui-focused": {
                  color: "black",
                },
                "& .MuiInput-underline:after": {
                  borderBottomColor: "#CB929B",
                },
              }}
              type="number"
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              value={value.cellphone}
              onChange={(e) =>
                setValue({ ...value, cellphone: e.target.value })
              }
            />
            <Button
              variant="contained"
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
                marginTop: "35px",
                "&:hover": {
                  backgroundColor: "P.main",
                  color: "white",
                  border: "1px solid white",
                },
              }}
              disabled={value.cellphone !== "" ? false : true}
              onClick={() => {
                setPage("password");
              }}
            >
              Continue
            </Button>
          </Grid>
        </Paper>
      ) : (
        ""
      )}
      {page === "password" ? (
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
              setPage("Login");
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
              Password
            </Typography>
          </Grid>
          <Grid
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "start",
              alignItems: "start",
              borderRadius: "10px",
              marginTop: "3px",
              backgroundColor: "white",
              padding: "25px",
              width: "100%",
              minHeight: "400px",
            }}
          >
            <Typography>Please enter your account password</Typography>
            <TextField
              placeholder="Password"
              id="outlined-error-helper-text"
              variant="standard"
              type="password"
              sx={{
                width: "100% ",
                "& label.Mui-focused": {
                  color: "black",
                },
                "& .MuiInput-underline:after": {
                  borderBottomColor: "#CB929B",
                },
              }}
              value={value.password}
              onChange={(e) => setValue({ ...value, password: e.target.value })}
            />
            <Typography sx={{ marginTop: "13px", color: "P.main" }}>
              Send a one-time password
            </Typography>
            <Typography sx={{ marginTop: "13px", color: "P.main" }}>
              Forget password?
            </Typography>
            <Button
              variant="contained"
              disabled={value.password !== "" ? false : true}
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
                marginTop: "35px",
                "&:hover": {
                  backgroundColor: "P.main",
                  color: "white",
                  border: "1px solid white",
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
      ) : (
        ""
      )}
      {page === "SignUp" ? (
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
              setPage("loginLandingPage");
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
              Sign Up
            </Typography>
          </Grid>
          <Grid
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "start",
              alignItems: "start",
              borderRadius: "10px",
              marginTop: "3px",
              backgroundColor: "white",
              padding: "25px",
              width: "100%",
              minHeight: "400px",
            }}
          >
            <Button
              sx={{
                borderRadius: "50px",
                textTransform: "capitalize",
                fontWeight: 600,
                color: "white",
                backgroundColor: "gray",
                border: "1px solid gray",
                height: "40px",
                width: "330px",
                display: "flex",
                alignSelf: "center",
                marginTop: "35px",

                "&:hover": {
                  border: "1px solid gray",
                },
              }}
              variant="outlined"
              onClick={() => {
                setPage("SignUpWithPhone");
              }}
              disabled
            >
              Sign Up With Email
            </Button>
            <Button
              sx={{
                borderRadius: "50px",
                textTransform: "capitalize",
                fontWeight: 600,
                color: "gray",
                backgroundColor: "white",
                border: "1px solid gray",
                height: "40px",
                width: "330px",
                display: "flex",
                alignSelf: "center",
                marginTop: "35px",

                "&:hover": {
                  border: "1px solid gray",
                },
              }}
              variant="outlined"
              onClick={() => {
                setPage("SignUpWithPhone");
              }}
            >
              Sign Up With Phone Number
            </Button>
          </Grid>
        </Paper>
      ) : (
        ""
      )}
      {page === "SignUpWithPhone" ? (
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
              setPage("SignUp");
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
              Sign Up
            </Typography>
          </Grid>

          <Grid
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "start",
              alignItems: "start",
              borderRadius: "10px",
              marginTop: "3px",
              backgroundColor: "white",
              padding: "25px",
              width: "100%",
              minHeight: "400px",
            }}
          >
            <Typography>Country</Typography>
            <CountrySelect
              className="country"
              labels={en}
              value={country}
              onChange={setCountry}
            />
            <TextField
              id="standard-basic"
              type="number"
              label="Number"
              onInput={(e) => {
                e.target.value = Math.max(0, parseInt(e.target.value))
                  .toString()
                  .slice(0, 10);
              }}
              sx={{
                marginTop: "33px",
                "& label.Mui-focused": {
                  color: "black",
                },
                "& .MuiInput-underline:after": {
                  borderBottomColor: "#CB929B",
                },
              }}
              variant="standard"
              value={phoneValue}
              onChange={(e) => {
                setPhoneValue(e.target.value);
              }}
              error={props.error}
              helperText={props.errorMessage}
              fullWidth
              InputProps={{
                maxLength: 11,
                startAdornment: (
                  <InputAdornment position="start">
                    +{getCountryCallingCode(country)} |{" "}
                  </InputAdornment>
                ),
              }}
            />
            
            <Button
              disabled={
                phoneValue !== undefined && phoneValue.length === 10
                  ? false
                  : true
              }
              sx={{
                borderRadius: "5px",
                textTransform: "capitalize",
                fontWeight: 600,
                color: "white",
                backgroundColor: "gray",
                border: "1px solid gray",
                height: "40px",
                width: "330px",
                display: "flex",
                alignSelf: "center",
                marginTop: "35px",

                "&:hover": {
                  border: "1px solid gray",
                  color: "gray",
                },
              }}
              variant="outlined"
              onClick={() => {
                handleRegisterByCell();
              }}
            >
              Sign Up
            </Button>
          </Grid>
        </Paper>
      ) : (
        ""
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
    </Grid>
  );
};

export default LogInPage;
