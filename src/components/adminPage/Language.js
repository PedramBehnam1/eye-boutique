import React, { useEffect, useState } from "react";
import AdminLayout from "../../layout/adminLayout";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { FormControlLabel, IconButton, Switch,Snackbar } from "@mui/material";
import axiosConfig from "../../axiosConfig";
import { useHistory } from "react-router-dom";
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';

const Language = () => {
  const [languages, setLanguages] = useState([]);
  const [state, setState] = useState({});
  let history = useHistory();
  const [user, setUser] = useState("11");
  const [role, setRole] = useState("");
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
        let user = res.data.user;
        setUser(user);
        axiosConfig
          .get("/users/get_roles", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((res) => {
            let _role = "";
            res.data.roles_list.map((role) => {
              if (role.id == user.role) {
                setRole(role.title);
                _role = role.title;
              }
            });
            if (_role != "admin" && _role != "super admin") {
              history.push("/");
            }
          });
      })
      .catch((err) =>{
        if (err.response.data.error.status === 401) {
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
          setShowMassage("Get user info has a problem!")
          setOpenMassage(true)
        }
      });
  };

  useEffect(() => {
    refreshList();
  }, []);

  const refreshList = () => {
    const test = [];
    axiosConfig.get("/admin/language/all").then((res) => {
      setLanguages(res.data.languages);
      res.data.languages.map((lan) => (test[lan.id] = lan.status));
      setState(test);
    });
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenMassage(false);
  };
  return (
    <AdminLayout breadcrumb="" pageName="Language">
      <Grid
        container
        sx={{
          paddingLeft: { xs: 0, sm: 1 },
          paddingRight: { xs: 0, sm: 1 },
        }}
      >
        <Grid item xs={12}>
          <Paper
            sx={{
              maxWidth: "100%",
              minHeight: "390px",
              mt: 0.2,
            }}
          >
            <Grid
              container
              item
              xs={12}
              p={2}
              alignItems="center"
              justifyContent="space-between"
            >
              <Grid item>
                <Typography variant="menutitle" pt={2} m={2} color="black">
                  language list
                </Typography>
              </Grid>
            </Grid>
            <Divider />
            <List sx={{ p: 0 }}>
              {languages.map((language, index) => {
                return (
                  <Grid>
                    <ListItem>
                      <Grid
                        container
                        item
                        alignItems="center"
                        justifyContent="space-between"
                        xs={12}
                        pl={3}
                        pr={3}
                        pt={1}
                        pb={1}
                      >
                        <Grid item direction="row">
                          <Box
                            sx={{ mr: 5 }}
                            display="inline"
                            justifyContent="flex-start"
                          >
                            <Typography variant="menuitem" color="black">
                              {index + 1}
                            </Typography>
                          </Box>
                          <Box display="inline" justifyContent="flex-start">
                            <Typography variant="menuitem" color="black">
                              {language.title.charAt(0).toUpperCase() +
                                language.title.slice(1)}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item>
                          <Box display="flex" justifyContent="flex-start">
                            <FormControlLabel
                              style={{ margin: 0 }}
                              labelPlacement="start"
                              control={
                                <Switch
                                  color="P"
                                  checked={state[language.id]}
                                  onChange={(e) => {
                                    setState({
                                      ...state,
                                      [e.target.name]: e.target.checked,
                                    });
                                    axiosConfig
                                      .put(`/admin/language/${language.id}`, {
                                        title: language.title,
                                        lable: language.label,
                                        status: e.target.checked,
                                      })
                                      .then(() => {
                                        refreshList();
                                      });
                                  }}
                                  name={language.id}
                                />
                              }
                            />
                          </Box>
                        </Grid>
                      </Grid>
                    </ListItem>
                    <Divider />
                  </Grid>
                );
              })}
            </List>
          </Paper>
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
    </AdminLayout>
  );
};

export default Language;
