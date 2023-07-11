import React, { useEffect, useState } from "react";
import axiosConfig from "../../../axiosConfig";
import AdminLayout from "../../../layout/adminLayout";
import "../../../asset/css/adminPage/addColor.css";
import SwitchCust from "./SwitchCust";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import Typography from "@mui/material/Typography";
import { ChromePicker } from "react-color";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import { Box } from "@mui/system";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import { Snackbar } from "@mui/material";

const AddColor = () => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [value, setValue] = useState({ title: "", code: "" });
  const [list, setList] = useState([]);
  const [OpenPicker, setOpenPicker] = useState("none");
  const openMore = Boolean(anchorEl);
  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedColor, setSelectedColor] = useState({
    title: "",
    code: "",
  });
  const [openMassage, setOpenMassage] = useState(false);
  const [showMassage, setShowMassage] = useState('');


  useEffect(() => {
    refreshList();
  }, []);

  const refreshList = () => {
    axiosConfig
      .get("/admin/color/all")
      .then((res) => {
        setLoading(false);
        setList(res.data.colors);
      })
      .catch((error) =>{ 
        setShowMassage('Get all colors have a problem!')
        setOpenMassage(true)
      });
  };

  const addColor = () => {
    
    axiosConfig.post("/admin/color/add", value).then((response) => {
      
      if (response.data.status) {
        refreshList();
        setOpen(false);
      }
    });
  };

  const isLoading = () => {
    return (
      <Grid item xs={12} mt={2} mb={2} display="flex" justifyContent="center">
        <CircularProgress color="P" />
      </Grid>
    );
  };

  const handleChange = (event) => {
    setValue({ ...value, [event.target.id]: event.target.value });
  };

  const handleClickOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setIsEdit(false);
    setOpen(false);
    setAnchorEl(null);
  };

  const handleClick = (event, color) => {
    setAnchorEl(event.currentTarget);
    setSelectedColor(color);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangeComplete = (color) => {
    setValue({ ...value, code: color.hex });
  };

  const handleClickEdit = () => {
    setIsEdit(true);
    setOpen(true);
  };

  const editColor = () => {
    
    axiosConfig.put(`/admin/color/${selectedColor.id}`, value)
      .then(res => {
        if (res.data) {
          setIsEdit(false);
          setOpen(false);
          setAnchorEl(null);
          refreshList();
        }
      })
      .catch(err => {
        setShowMassage('Edit color has a problem!')
        setOpenMassage(true)
      })
  }

  const handleClickDelete = () => {
    setOpenDelete(true)
    
  }

  const deleteColor = () => {
    axiosConfig.delete(`/admin/color/${selectedColor.id}`)
      .then(res => {
        if (res.data) {
          setOpenDelete(false);
          setAnchorEl(null);
          refreshList();
        }
      })
      .catch(err =>{
        setShowMassage('Delete color has a problem!')
        setOpenMassage(true)
      })
  }

  const handleCloseDialogDelete = () => {
    setOpenDelete(false)
    setAnchorEl(null)
  }

  const bread = [
    {
      title: "Products",
      href: "/admin/product",
    },
  ];

  const _handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenMassage(false);
  };
  return (
    <AdminLayout breadcrumb={bread} pageName="Colors">
      <Grid container spacing={2} className="main">
        <Grid
          item
          xs={12}
          className="box"
          style={{ display: "flex", flexDirection: "column", padding: "0" }}
        >
          <Grid item xs={12} className="addColorBox" alignItems="center">
            <div className="addColorTitle">
              <Typography variant="menutitle" color="black">
                Colors List
              </Typography>
            </div>
            <Box display="flex" justifyContent="flex-end">
              <Paper
                component="form"
                sx={{
                  p: "2px 4px",
                  mr: 2,
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  minWidth: "200px"
                }}
              >
                <IconButton sx={{ p: "10px" }} aria-label="search">
                  <SearchIcon color="G1" />
                </IconButton>
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="Search in List"
                  inputProps={{ "aria-label": "Search in List" }}
                />
              </Paper>
              <div>
                <Button
                  variant="contained"
                  color="P"
                  onClick={handleClickOpenDialog}
                  startIcon={<AddIcon />}
                >
                  Add Color
                </Button>
                <Dialog
                  open={open}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <Grid item xs={12} p={3} >
                    <Typography variant="menutitle"  color="black">
                      {isEdit ? "Edit Color" : "Add Color"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} className="textFields">
                    <TextField
                      id="title"
                      label="Color Name"
                      color="P"
                      fullWidth
                      sx={{ pb: 2 }}
                      defaultValue={isEdit ? selectedColor.title : ""}
                      onChange={handleChange}
                    />
                    <TextField
                      id="code"
                      label="Hex Color Code"
                      color="P"
                      fullWidth
                      defaultValue={isEdit ? selectedColor.code : ""}
                      onClick={() => setOpenPicker("flex")}
                      onChange={handleChange}
                    />
                    <Grid
                      item
                      xs={12}
                      display={OpenPicker}
                      justifyContent={"center"}
                      pt={2}
                    >
                      <ChromePicker
                        color={value.code}
                        onChangeComplete={handleChangeComplete}
                      />
                    </Grid>
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
                      onClick={handleCloseDialog}
                      sx={{ mt: 2, mb: 2, mr: 1, ml: 1 }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      color="P"
                      sx={{ mt: 2, mb: 2, mr: 1, ml: 1, color: "white" }}
                      onClick={isEdit ? editColor : addColor}
                      disabled={value.title == "" || value.code == ""}
                    >
                      save
                    </Button>
                  </Grid>
                </Dialog>
              </div>
            </Box>
          </Grid>
          <Divider />
          <Grid item xs={12} md={12}>
            <List sx={{ p: 0 }}>
              {loading
                ? isLoading()
                : list.map((color, index) => {
                  return (
                    <>
                      <ListItem key={color.id} sx={{ pl: 2 }}>
                        <Grid item className="counterList">
                          <Typography variant="menuitem" p={1} color="black">
                            {index + 1}
                          </Typography>
                        </Grid>

                        <Grid item xs={1}>
                          <div
                            style={{ backgroundColor: `${color.code}` }}
                            className="colorDiv"
                          ></div>
                        </Grid>
                        <Grid item xs={1}>
                          <Typography variant="menuitem" p={1} color="black">
                            {color.title}
                          </Typography>
                        </Grid>
                        <Grid item xs={5} className="hexText">
                          <Typography
                            variant="menuitem"
                            align="right"
                            p={1}
                            color="black"
                          >
                            {color.code}
                          </Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <SwitchCust />
                        </Grid>
                        <Grid item xs={2} className="moreIcone">
                          <IconButton
                            aria-label="delete"
                            aria-controls={
                              openMore ? "demo-positioned-menu" : undefined
                            }
                            aria-haspopup="true"
                            aria-expanded={openMore ? "true" : undefined}
                            onClick={(event) => handleClick(event, color)}
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
                            <MenuItem onClick={handleClickDelete}>Delete</MenuItem>
                          </Menu>
                        </Grid>
                      </ListItem>
                      <Divider />
                    </>
                  );
                })}
            </List>
            <Dialog
              open={openDelete}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <Grid xs={12} display='flex' justifyContent='center' mt={3} mb={1} ml={3} mr={6}>
                <Typography>
                  Are you sure you want to delete {selectedColor.title} ?
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
                  onClick={deleteColor}
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
            <Box sx={{ pt: 2, pb: 2, pr: 2, pl: 1 }}>
              <Stack spacing={2}>
                <Pagination count={4} color="P" />
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Grid>
                                                              
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
    </AdminLayout>
  );
};

export default AddColor;
