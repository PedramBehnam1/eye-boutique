import React, { useEffect, useState } from "react";
import AdminLayout from "../../../layout/adminLayout";
import axiosConfig from "../../../axiosConfig";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import AddIcon from "@mui/icons-material/Add";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import CircularProgress from "@mui/material/CircularProgress";
import { FormControlLabel, Switch, Snackbar } from "@mui/material";
import { useHistory } from "react-router-dom";
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';

const Faq = () => {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState({})
  const [anchorEl, setAnchorEl] = useState(null);
  const [value, setValue] = useState({ question: "", answer: "", status: '' });
  const [list, setList] = useState([]);
  const openMore = Boolean(anchorEl);
  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState({
    title: "",
    code: "",
  });
  const [searchValue, setSearchValue] = useState('');
  let history = useHistory();
  const [user, setUser] = useState("11");
  const [role, setRole] = useState('');
  const [openMassage, setOpenMassage] = useState(false);
  const [showMassage, setShowMassage] = useState('');

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
        } else {
          setShowMassage("Get user info has a problem!")
          setOpenMassage(true)
        }
      });
  };


  useEffect(() => {
    refreshList();
  }, [searchValue]);

  const bread = [
    {
      title: "Content",
      href: "",
    },
  ];



  const handleClickOpenDialog = () => {
    setIsEdit(false);
    setOpen(true);
  };
  const handleCloseDialog = () => {
    setOpen(false);
    setAnchorEl(false)
  };
  const isLoading = () => {
    return (
      <Grid item xs={12} mt={2} mb={2} display="flex" justifyContent="center">
        <CircularProgress color="P" />
      </Grid>
    );
  };

  const handleChange = (event) => {
    setValue({ ...value, [event.target.id]: event.target.value, status: true });
  };

  const handleClick = (event, faq) => {
    setAnchorEl(event.currentTarget);
    setSelectedFaq(faq);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickEdit = () => {
    setIsEdit(true);
    setOpen(true);
  };

  const refreshList = () => {
    const newFaqArray = []
    axiosConfig
      .get("/admin/faq/all")
      .then((res) => {
        setLoading(false);
        setList(res.data.faqs.filter(f => f.question.includes(searchValue)));

        (res.data.faqs).map((f) => newFaqArray[f.id] = f.status)
        setStatus(newFaqArray)
      })
      .catch((error) => {
        setShowMassage("Get faq list have a problem!")
        setOpenMassage(true)
      });
  };


  const addFAQ = () => {
    axiosConfig.post("/admin/faq/add", value).then((response) => {
      if (response.data.status) {
        refreshList();
        setOpen(false);
      }
    });
  };

  const editFaq = () => {
    axiosConfig.put(`/admin/faq/${selectedFaq.id}`, value)
      .then(() => {
        setSelectedFaq({
          title: "",
          code: "",
        })
        refreshList();
        setOpen(false);
        setAnchorEl(null)
      })
      .catch(err => {
        setShowMassage("Update faq has a problem!")
        setOpenMassage(true)
      })
  }

  const handleClickDelete = () => {
    setOpenDelete(true);
  };

  const handleCloseDialogDelete = () => {
    setOpenDelete(false);
    setAnchorEl(null);
  };

  const deleteFaq = () => {
    axiosConfig
      .delete(`/admin/faq/${selectedFaq.id}`)
      .then((res) => {
        if (res.data) {
          setOpenDelete(false);
          setAnchorEl(null);
          refreshList();
        }
      })
      .catch((err) => {
        
        setShowMassage("Delete faq has a problem!")
        setOpenMassage(true)
      });
  }

  const _handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenMassage(false);
  };
  return (
    <AdminLayout breadcrumb={bread} pageName="FAQ">
      <Grid container>
        <Grid item xs={12}>
          <Paper sx={{ maxWidth: "100%", minHeight: "500px", mt: 2 }}>
            <Grid
              container
              item
              xs={12}
              pt={2}
              pb={2}
              pl={1}
              pr={1}
              alignItems="center"
              justifyContent="space-between"
            >
              <Grid item>
                <Typography variant="menutitle" pt={2} m={2} color="black">
                  FAQ List
                </Typography>
              </Grid>
              <Grid item>
                <Box display="flex" justifyContent="flex-end">
                  <Paper
                    component="form"
                    sx={{
                      p: "2px 4px",
                      mr: 5,
                      borderRadius: 10,
                      display: "flex",
                      alignItems: "center",
                      minWidth: "400px",
                      height: '36px'
                    }}
                  >
                    <IconButton sx={{ p: "10px" }} aria-label="search">
                      <SearchIcon color="G1" />
                    </IconButton>
                    <InputBase
                      sx={{ ml: 1, flex: 1 }}
                      placeholder="Search in List"
                      inputProps={{ "aria-label": "Search in List" }}
                      onChange={(e) => {
                        setSearchValue(e.target.value)
                      }}
                    />
                  </Paper>
                  <Grid pr={1} style={{ color: 'white' }}>
                    <Button
                      variant="contained"
                      color="P"
                      onClick={handleClickOpenDialog}
                      startIcon={<AddIcon />}
                      style={{ height: '35px' }}
                    >
                      Add
                    </Button>
                  </Grid>

                  <Dialog
                    open={open}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <Grid item xs={12} pt={3} pl={3}>
                      <Typography variant="menutitle" color="Black.main">
                        {isEdit ? "Edit Question" : "Add New Question"}
                      </Typography>
                    </Grid>
                    <Divider />
                    <Grid item xs={12} pr={3} pt={3} pl={3}>
                      <TextField
                        id="question"
                        label="Question"
                        color="P"
                        defaultValue={isEdit ? selectedFaq.question : ''}
                        onChange={handleChange}

                        fullWidth
                        multiline
                        sx={{ pb: 4 }}
                      />
                      <TextField
                        id="answer"
                        label="Answer"
                        color="P"
                        defaultValue={isEdit ? selectedFaq.answer : ''}
                        onChange={handleChange}

                        fullWidth
                        multiline
                        rows={5}
                        sx={{ pb: 5 }}
                      />
                    </Grid>

                    <Divider />
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
                        className="btnBox1"
                        onClick={handleCloseDialog}
                        sx={{ mt: 2, mb: 2, mr: 1, ml: 1 }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        color="P"
                        onClick={isEdit ? editFaq : addFAQ}
                        sx={{ mt: 2, mb: 2, mr: 1, ml: 1, color: "white" }}
                        disabled={value.question == "" || value.answer == ""}
                      >
                        save
                      </Button>
                    </Grid>
                  </Dialog>
                </Box>
              </Grid>
            </Grid>
            <Divider />
            <Grid item xs={12}>
              <List sx={{ p: 0 }}>
                {loading
                  ? isLoading()
                  : list.map((faq, index) => {
                    return (
                      <>
                        <ListItem key={faq.id} sx={{ pl: 2 }}>
                          <Grid item className="counterList">
                            <Typography
                              variant="menuitem"
                              p={1}
                              color="Black.main"
                            >
                              {index + 1}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              variant="menuitem"
                              p={1}
                              color="Black.main"
                            >
                              {faq.question.charAt(0).toUpperCase() + faq.question.slice(1)}
                            </Typography>
                          </Grid>
                          {status &&
                            <Grid item xs={5} textAlign='end'>
                              <FormControlLabel labelPlacement="start" control={<Switch
                                color='P'
                                checked={status[faq.id]}
                                onChange={(e) => {
                                  setStatus({
                                    ...status,
                                    [e.target.name]: e.target.checked,
                                  });
                                  axiosConfig.put(`/admin/faq/${faq.id}`, {
                                    "question": faq.question,
                                    "answer": faq.answer,
                                    "status": e.target.checked
                                  }).then(() => {
                                    refreshList()
                                  })
                                }}
                                name={faq.id}
                              />} label="Available" />
                            </Grid>
                          }
                          <Grid item xs={1.5} className="moreIcone">
                            <IconButton
                              aria-label="delete"
                              aria-controls={
                                openMore ? "demo-positioned-menu" : undefined
                              }
                              aria-haspopup="true"
                              aria-expanded={openMore ? "true" : undefined}
                              onClick={(event) => handleClick(event, faq)}
                            >
                              <MoreVertIcon color="Black" />
                            </IconButton>
                            <Menu
                              id="demo-positioned-menu"
                              aria-labelledby="demo-positioned-button"
                              anchorEl={anchorEl}
                              open={openMore}
                              onClose={handleClose}
                              anchorOrigin={{
                                vertical: "top",
                                horizontal: "right",
                              }}
                              transformOrigin={{
                                vertical: "top",
                                horizontal: "right",
                              }}
                            >
                              <MenuItem onClick={handleClickEdit}>
                                Edit
                              </MenuItem>
                              <MenuItem onClick={handleClickDelete}>
                                Delete
                              </MenuItem>
                            </Menu>
                          </Grid>
                        </ListItem>
                        <Divider />
                      </>
                    );
                  })}
              </List>
            </Grid>
          </Paper>
        </Grid>
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
              Are you sure you want to delete {selectedFaq.question} ?
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
              onClick={deleteFaq}
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
      </Grid >
                                                                  
      <Snackbar open={openMassage} autoHideDuration={6000} onClose={_handleClose}
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
    </AdminLayout >
  );
};

export default Faq;
