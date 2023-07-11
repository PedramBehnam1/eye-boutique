import React, { useState, useEffect } from "react";
import {
  Button, Grid, IconButton, List, ListItem, Menu, MenuItem, Paper, Typography, Switch, Dialog, FormControl, Select, InputBase, ListItemIcon, ListItemText, Divider, Snackbar,
} from "@mui/material";
import AdminLayout from "../../../layout/adminLayout";
import SearchIcon from "@material-ui/icons/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axiosConfig from "../../../axiosConfig";
import { useHistory } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import AddBlog from "./AddBlog";
import EditBlog from "./EditBlog";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import FilterListIcon from "@mui/icons-material/FilterList";
import Check from "@mui/icons-material/Check";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';


const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  let history = useHistory();
  const [pageName, setPageName] = useState("main");
  const [searchValue, setSearchValue] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const openMore = Boolean(anchorEl);
  const [anchorElSortDate, setAnchorElSortDate] = useState(null);
  const [anchorElSortName, setAnchorElSortName] = useState(null);
  const [selectedRow, setSelectedRow] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const [openRadio, setOpenRadio] = useState({ open: false });
  const [anchorElFilterVariant, setAnchorElFilterVariant] = useState(null);
  const openFilterVariant = Boolean(anchorElFilterVariant);
  const [anchorElFilter, setAnchorElFilter] = useState(null);
  const openFilter = Boolean(anchorElFilter);
  const [categoryFilterName, setCategoryFilterName] = useState("all");
  const [categoryFilterTypes, setCategoryFilterTypes] = useState([]);
  const [anchorElSort, setAnchorElSort] = useState(null);
  const openSort = Boolean(anchorElSort);
  const [sortFilterType, setSortFilterType] = useState("date");
  const [sort, setSort] = useState("date_sort=-1");
  const [user, setUser] = useState("11");
  const [role, setRole] = useState("");
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
            let role1 = "";
            res.data.roles_list.map((role) => {
              if (role.id == user.role) {
                setRole(role.title);
                role1 = role.title;
              }
            });
            if (role1 != "admin" && role1 != "super admin") {
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
        } else {
          setShowMassage("Get user info has a problem")
          setOpenMassage(true)
        }
      });
  };

  const bread = [
    {
      title: "Blog",
      href: "/admin/blog",
    },
  ];

  useEffect(() => {
    refreshList();
  }, [searchValue, categoryFilterName]);

  const refreshList = () => {
    axiosConfig.get("/admin/blog/all?title=&page=1&limit=20").then((res) => {
      let blogs = res.data.blogs.filter(
        (b) =>
          b.attributes.length != 0 &&
          b.attributes[0].value.includes(searchValue)
      );
      if (categoryFilterName == "Available") {
        blogs = blogs.filter((b) => b.status === 0);
      } else if (categoryFilterName == "Unavailable") {
        blogs = blogs.filter((b) => b.status === 1);
      }
      setBlogs([...blogs]);
    });
  };

  const handleClickEditAndDeleteMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClick = (event, blog) => {
    handleClickEditAndDeleteMenu(event);
    setSelectedRow(blog);
  };

  const deleteBrand = () => {
    axiosConfig
      .delete(`/admin/blog/${selectedRow.id}`)
      .then(() => {
        setOpenDelete(false);

        setAnchorEl(null);
        refreshList();
      })
      .catch((err) =>{
        setShowMassage("Delete brand has a problem")
        setOpenMassage(true)
      });
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickDelete = (status) => {
    setOpenRadio({ open: true });
    setAnchorEl(null);
    setOpenDelete(true);
  };

  const handleCloseDialogDelete = () => {
    setOpenDelete(false);
    setAnchorEl(null);
  };
  const handleClickEdit = (blogId, index) => {
    setAnchorEl(null);
    setPageName("edit Blog");
  };
  
  const sortDate = (type) => {
    let sortBlog;
    if (type == "Newest first") {
      sortBlog = blogs.sort((a, b) => {
        return new Date(b.create_date) - new Date(a.create_date);
      });
      setAnchorElSortDate(null);
    } else if (type == "Oldest first") {
      sortBlog = blogs.sort((a, b) => {
        return new Date(a.create_date) - new Date(b.create_date);
      });
      setAnchorElSortDate(null);
    } else if (type == "A_Z") {
      sortBlog = blogs.sort((a, b) =>
        a.attributes[0].value.toLocaleLowerCase() >
          b.attributes[0].value.toLocaleLowerCase()
          ? 1
          : -1
      );
      setAnchorElSortName(null);
    } else if (type == "Z_A") {
      sortBlog = blogs.sort((a, b) =>
        b.attributes[0].value.toLocaleLowerCase() >
          a.attributes[0].value.toLocaleLowerCase()
          ? 1
          : -1
      );
      setAnchorElSortName(null);
    }
    setBlogs(sortBlog);
  };

  const updateBlog = (blog) => {
    const blogObj = {
      file_id: blog.image,
      status: blog.status == 0 ? 1 : 0,
      create_date: blog.create_date,
      time: blog.time,
    };

    axiosConfig
      .put(`/admin/blog/blog_status/${blog.id}`, blogObj)
      .then((res) => {
      })
      .catch((err) => {
        setShowMassage("Update Blog has a problem")
        setOpenMassage(true)
      });
  };
  
  const _handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenMassage(false);
  };
  return (
    <AdminLayout
      breadcrumb={pageName !== "main" ? bread : ""}
      pageName={
        pageName === "main" ? "Blog" : pageName == "add" ? "Add Blog" : pageName
      }
    >
      {pageName === "main" ? (
        <Grid
          sx={{
            width: "100%",
            minHeight: "300px",
            mt: -0.1,

            paddingLeft: { xs: 0, sm: 1 },
            paddingRight: { xs: 0, sm: 1 },
          }}
        >
          <Grid container item xs={12}>
            <Grid
              item
              xs={12}
              md={12}
              sx={{
                position: "sticky",
                width: "100%",
                zIndex: 100,
                top: 78,
              }}
            >
              <Grid item xs={12} md={12} mt={0}>
                <Paper
                  style={{
                    boxShadow: "none",
                    border: "1px solid #DCDCDC",
                    borderRadius: "10px",
                  }}
                >
                  <Grid
                    xs={12}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    height="55px"
                    p={2}
                    pr="8px"
                  >
                    <Typography variant="menutitle" color="Black.main">
                      Blog List
                    </Typography>
                    <Button
                      variant="contained"
                      color="P"
                      className="addProductBtn"
                      style={{
                        color: "white",
                        height: "33px",
                        boxShadow: "none",
                      }}
                      onClick={() => setPageName("add")}
                      startIcon={<AddIcon />}
                    >
                      Add Blog
                    </Button>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
            <Grid
              item
              xs={12}
              mb={1}
              md={12}
              mt={0}
              sx={{
                position: "sticky",
                top: "137px",
                zIndex: 100,
                mb: "15px",
              }}
            >
              <Grid item xs={12} md={12} mt={0} sx={{}}>
                <Paper
                  item
                  sm={12}
                  md={12}
                  style={{
                    boxShadow: "none",
                    border: "1px solid #DCDCDC",
                    alignContent: "center",
                    alignItems: "center",
                    maxHeight: "48px",
                    borderRadius: "10px",
                    display: "flex",
                    justifyContent: "end",
                  }}
                  display="flex"
                  alignItems="center"
                >
                  <Grid
                    xs={5}
                    display="flex"
                    alignItems="center"
                    justifyContent="end"
                    pt="5px"
                    pb="5px"
                  >
                    <Paper
                      component="form"
                      sx={{
                        backgroundColor: "GrayLight2.main",
                        p: "2px 4px",
                        borderRadius: 3,
                        display: "flex",
                        alignItems: "center",
                        maxWidth: "300px",
                        height: "33px",
                        justifyContent: "space-between",
                        boxShadow: "none",
                      }}
                    >
                      <IconButton sx={{ p: "10px" }} aria-label="search">
                        <SearchIcon color="G1.main" />
                      </IconButton>
                      <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Search"
                        inputProps={{ "aria-label": "Search in List" }}
                        onChange={(e) => {
                          setSearchValue(
                            e.target.value.charAt(0).toUpperCase() +
                            e.target.value.slice(1)
                          );
                        }}
                      />
                      <FormControl
                        color="P"
                        variant="filled"
                        size="small"
                        hiddenLabel={true}
                      >
                        <Select
                          labelId="demo-simple-select-filled-label"
                          id="demo-simple-select-filled"
                          disableUnderline
                          IconComponent={KeyboardArrowDownIcon}
                          displayEmpty
                          inputProps={{ "aria-label": "Without label" }}
                          defaultValue={"name"}
                          label
                          sx={{
                            backgroundColor: "GrayLight2.main",
                            borderLeft: "1px dashed #9E9E9E",
                            overflow: "hidden",
                            height: "20px",
                            top: 0,
                            left: 1.6,
                            borderRadius: "0 0  10px 0",
                            width: "100px",
                            ".MuiSvgIcon-root": {
                              color: "G2.main",
                              padding: "3px",
                            },
                          }}
                        >
                          <MenuItem value={"name"}>
                            <Typography p={1} color="G2.main" variant="h15">
                              Name
                            </Typography>
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Paper>

                    <IconButton
                      aria-label="search"
                      aria-controls={
                        openFilter ? "demo-positioned-date-menu" : undefined
                      }
                      aria-haspopup="true"
                      aria-expanded={openFilter ? "true" : undefined}
                      onClick={(event) => {
                        setAnchorElFilter(event.currentTarget);
                      }}
                      sx={{ margin: "0 15px 0 10px", ml: "7px", mr: "7px" }}
                    >
                      <FilterListIcon color="G1" />
                    </IconButton>

                    <Menu
                      id="composition-button"
                      anchorEl={anchorElFilter}
                      open={openFilter}
                      onClose={() => setAnchorElFilter(null)}
                      MenuListProps={{
                        "aria-labelledby": "basic-button",
                      }}
                      sx={{ width: "247px", ml: -1.5 }}
                    >
                      <MenuItem
                        onClick={() => {
                          setCategoryFilterTypes([]);
                          setCategoryFilterName("all");
                        }}
                        sx={{
                          width: "227px",
                          padding: "5px 5px 5px 13px",
                          color: "G1.main",
                        }}
                      >
                        {categoryFilterName === "all" ? (
                          <>
                            <ListItemIcon>
                              <Check color="P" sx={{ padding: "3px" }} />
                            </ListItemIcon>
                            <Typography ml={-1}>All</Typography>
                          </>
                        ) : (
                          <ListItemText inset>
                            <Typography ml={-1}>All</Typography>
                          </ListItemText>
                        )}
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          setCategoryFilterTypes([]);
                          setCategoryFilterName("Available");
                        }}
                        sx={{
                          width: "227px",
                          padding: "5px 5px 5px 13px",
                          color: "G1.main",
                        }}
                      >
                        {categoryFilterName === "Available" ? (
                          <>
                            <ListItemIcon>
                              <Check color="P" sx={{ padding: "3px" }} />
                            </ListItemIcon>
                            <Typography ml={-1}>Available</Typography>
                          </>
                        ) : (
                          <ListItemText inset>
                            <Typography ml={-1}>Available</Typography>
                          </ListItemText>
                        )}
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          setCategoryFilterTypes([]);
                          setCategoryFilterName("Unavailable");
                        }}
                        sx={{
                          width: "227px",
                          padding: "5px 5px 5px 13px",
                          color: "G1.main",
                        }}
                      >
                        {categoryFilterName === "Unavailable" ? (
                          <>
                            <ListItemIcon>
                              <Check color="P" sx={{ padding: "3px" }} />
                            </ListItemIcon>
                            <Typography ml={-1}>Unavailable</Typography>
                          </>
                        ) : (
                          <ListItemText inset>
                            <Typography ml={-1}>Unavailable</Typography>
                          </ListItemText>
                        )}
                      </MenuItem>
                      <Divider
                        sx={{
                          width: "60%",
                          margin: "auto",
                          borderColor: "P.main",
                        }}
                      />
                      <MenuItem
                        aria-controls={
                          openSort ? "demo-positioned-date-menu" : undefined
                        }
                        aria-haspopup="true"
                        aria-expanded={openSort ? "true" : undefined}
                        onClick={(event) =>
                          setAnchorElSort(event.currentTarget)
                        }
                        sx={{ padding: "5px 5px 5px 13px", color: "G1.main" }}
                      >
                        <ListItemIcon>
                          <ArrowBackIosIcon color="P" sx={{ padding: "3px" }} />
                        </ListItemIcon>
                        Sort
                      </MenuItem>
                    </Menu>

                    <Menu
                      id="composition-button"
                      anchorEl={anchorElSort}
                      open={openSort}
                      onClose={() => setAnchorElSort(null)}
                      MenuListProps={{
                        "aria-labelledby": "basic-button",
                      }}
                      sx={{
                        width: "235px",
                        marginTop: "-40px",
                        marginLeft: "-206px",
                        boxShadow: "none",
                      }}
                    >
                      <Typography color="G1.main" variant="h30" p={2}>
                        {" "}
                        Sort By
                      </Typography>
                      <MenuItem
                        onClick={() => {
                          setSortFilterType("date");
                        }}
                        sx={{
                          padding: "7px 5px 5px 13px",
                          width: "235px",
                          color: "G1.main",
                        }}
                      >
                        {sortFilterType === "date" ? (
                          <>
                            <ListItemIcon>
                              <Check color="P" sx={{ padding: "3px" }} />
                            </ListItemIcon>
                            <Typography ml={-1}>Date</Typography>
                          </>
                        ) : (
                          <ListItemText inset>
                            <Typography ml={-1}>Date</Typography>
                          </ListItemText>
                        )}
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          setSortFilterType("title");
                        }}
                        sx={{
                          padding: "5px 5px 5px 13px",
                          width: "235px",
                          color: "G1.main",
                        }}
                      >
                        {sortFilterType === "title" ? (
                          <>
                            <ListItemIcon>
                              <Check color="P" sx={{ padding: "3px" }} />
                            </ListItemIcon>
                            <Typography ml={-1}>Title</Typography>
                          </>
                        ) : (
                          <ListItemText inset>
                            <Typography ml={-1}>Title</Typography>
                          </ListItemText>
                        )}
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          setSortFilterType("viewed");
                        }}
                        sx={{
                          padding: "5px 5px 5px 13px",
                          width: "235px",
                          color: "G1.main",
                        }}
                      >
                        {sortFilterType === "viewed" ? (
                          <>
                            <ListItemIcon>
                              <Check color="P" sx={{ padding: "3px" }} />
                            </ListItemIcon>
                            <Typography ml={-1}>Viewed</Typography>
                          </>
                        ) : (
                          <ListItemText inset>
                            <Typography ml={-1}>Viewed</Typography>
                          </ListItemText>
                        )}
                      </MenuItem>
                      <Divider
                        sx={{
                          width: "60%",
                          margin: "auto",
                          borderColor: "P.main",
                        }}
                      />
                      <Typography color="G1.main" variant="h30" p={2}>
                        {" "}
                        Sort Order
                      </Typography>

                      <MenuItem
                        onClick={() => {
                          if (sortFilterType === "title") {
                            setSort("title_sort=-1");
                            sortDate("Z_A");
                          } else if (sortFilterType === "date") {
                            setSort("date_sort=-1");
                            sortDate("Newest first");
                          } else {
                            setSort("viewed_sort=-1");
                          }
                          setAnchorElSort(null);
                          setAnchorElFilter(null);
                        }}
                        sx={{
                          padding: "7px 5px 5px 13px",
                          width: "235px",
                          color: "G1.main",
                        }}
                      >
                        {sort.toString().split("=")[1] === "-1" ? (
                          <>
                            <ListItemIcon>
                              <Check color="P" sx={{ padding: "3px" }} />
                            </ListItemIcon>
                            <Typography ml={-1}>
                              {sortFilterType === "viewed"
                                ? "Low to high"
                                : sortFilterType === "date"
                                  ? "Newest first"
                                  : "Z to A"}
                            </Typography>
                          </>
                        ) : (
                          <ListItemText inset>
                            <Typography ml={-1}>
                              {sortFilterType === "viewed"
                                ? "Low to high"
                                : sortFilterType === "date"
                                  ? "Newest first"
                                  : "Z to A"}
                            </Typography>
                          </ListItemText>
                        )}
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          if (sortFilterType === "title") {
                            setSort("title_sort=1");
                            sortDate("A_Z");
                          } else if (sortFilterType === "date") {
                            setSort("date_sort=1");
                            sortDate("Oldest first");
                          } else {
                            setSort("viewed_sort=1");
                          }
                          setAnchorElSort(null);
                          setAnchorElFilter(null);
                        }}
                        sx={{
                          padding: "5px 5px 5px 13px",
                          width: "235px",
                          color: "G1.main",
                        }}
                      >
                        {sort.toString().split("=")[1] === "1" ? (
                          <>
                            <ListItemIcon>
                              <Check color="P" sx={{ padding: "3px" }} />
                            </ListItemIcon>
                            <Typography ml={-1}>
                              {sortFilterType === "viewed"
                                ? "High to low"
                                : sortFilterType === "date"
                                  ? "Oldest first"
                                  : "A to Z"}
                            </Typography>
                          </>
                        ) : (
                          <ListItemText inset>
                            <Typography ml={-1}>
                              {sortFilterType === "viewed"
                                ? "High to low"
                                : sortFilterType === "date"
                                  ? "Oldest first"
                                  : "A to Z"}
                            </Typography>
                          </ListItemText>
                        )}
                      </MenuItem>
                    </Menu>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
            <Grid xs={12} style={{ minHeight: 390 }}>
              <List sx={{ p: 0 }}>
                <Paper
                  item
                  xs={12}
                  md={12}
                  sx={{
                    border: "1px solid #DCDCDC",
                    backgroundColor: "P1.main",
                    mb: "1px",
                    borderRadius: "10px",
                    height: "48px",
                  }}
                  elevation={0}
                >
                  <ListItem
                    key="row"
                    sx={{
                      pl: 2,
                      display: "flex",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    <Grid xs={0.95}>
                      <Typography
                        p={1}
                        pt={0}
                        pb={0}
                        color="black"
                        variant="h7"
                        sx={{ fontWeight: "bold" }}
                      >
                        Row
                      </Typography>
                    </Grid>
                    <Grid xs={1.37} display="flex">
                      <Grid display="flex">
                        <Typography
                          p={1}
                          pt={0}
                          pb={0}
                          color="black"
                          variant="h7"
                          sx={{ fontWeight: "bold" }}
                        >
                          Date
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid
                      xs={4}
                      display="flex"
                      alignItems="end"
                      pl={
                        window.innerWidth > 890
                          ? 0
                          : window.innerWidth > 764
                            ? "15px"
                            : "36px"
                      }
                    >
                      <Grid display="flex">
                        <Typography
                          p={1}
                          pt={0}
                          pb={0}
                          color="black"
                          variant="h7"
                          sx={{ fontWeight: "bold" }}
                        >
                          Title
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid xs={2.46}>
                      <Typography
                        p={1}
                        pt={0}
                        pb={0}
                        color="black"
                        variant="h7"
                        sx={{ fontWeight: "bold" }}
                      >
                        Viewed
                      </Typography>
                    </Grid>
                    <Grid xs={1}>
                      <Typography
                        p={1}
                        pt={0}
                        pb={0}
                        color="black"
                        variant="h7"
                        sx={{ fontWeight: "bold" }}
                      >
                        State
                      </Typography>
                    </Grid>
                  </ListItem>
                </Paper>
                <Grid item xs={12} md={12}>
                  {blogs &&
                    blogs.map((blog, index) => {
                      return (
                        <Paper
                          item
                          xs={12}
                          md={12}
                          sx={{
                            border: "1px solid #DCDCDC",
                            mb: "-1px",
                            borderRadius: "10px",
                            height: "48px",
                          }}
                          elevation={0}
                        >
                          <ListItem
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              height: "100%",
                            }}
                          >
                            <Grid
                              xs={1.03}
                              item
                              className="counterList"
                              pl="12px"
                            >
                              <Typography p={1} variant="h2" color="G2.main">
                                {index + 1}
                              </Typography>
                            </Grid>
                            <Grid
                              item
                              xs={1.36}
                              pl={window.innerWidth > 1011 ? 0 : "5px"}
                            >
                              <Typography variant="h2" color="G2.main">
                                {new Date(blog.create_date).getMonth() +
                                  "/" +
                                  new Date(blog.create_date).getDate() +
                                  "/" +
                                  new Date(blog.create_date).getFullYear()}
                              </Typography>
                            </Grid>
                            <Grid
                              item
                              xs={4.03}
                              pl={
                                window.innerWidth > 1011
                                  ? 0
                                  : window.innerWidth > 890
                                    ? "5px"
                                    : window.innerWidth > 764
                                      ? "20px"
                                      : "40px"
                              }
                            >
                              <Typography variant="h2" color="G2.main">
                                {!/\S/.test(blog.attributes[0].value) ||
                                  blog.attributes[0].value == null
                                  ? "Title is empty."
                                  : window.innerWidth > 1117
                                    ? blog.attributes[0].value
                                    : blog.attributes[0].value.length > 15
                                      ? blog.attributes[0].value.substring(0, 10) +
                                      "..."
                                      : blog.attributes[0].value}
                              </Typography>
                            </Grid>
                            <Grid item xs={2.32}>
                              <Typography variant="h2" color="G2.main">
                                123
                              </Typography>
                            </Grid>
                            <Grid item xs={1.26} textAlign="start">
                              <Switch
                                onClick={() => {
                                  updateBlog(blog);
                                }}
                                defaultChecked={
                                  blog.status === 0 ? true : false
                                }
                                color="P"
                              />
                            </Grid>
                            <Grid item xs={2} className="moreIcone">
                              <IconButton
                                aria-label="delete"
                                aria-controls={
                                  openMore ? "demo-positioned-menu" : undefined
                                }
                                aria-haspopup="true"
                                aria-expanded={openMore ? "true" : undefined}
                                onClick={(event) => {
                                  handleClick(event, blog);
                                }}
                              >
                                <MoreVertIcon color="G2" />
                              </IconButton>
                            </Grid>
                          </ListItem>
                        </Paper>
                      );
                    })}
                  <Menu
                    id="demo-positioned-menu"
                    aria-labelledby="demo-positioned-menu"
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
                    sx={{ boxShadow: "none" }}
                  >
                    <MenuItem onClick={handleClickEdit}>Edit</MenuItem>
                    <MenuItem onClick={handleClickDelete}>Delete</MenuItem>
                  </Menu>

                  {openRadio.open ? (
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
                          Are you sure you want to delete {selectedRow.title} ?
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
                          onClick={deleteBrand}
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
                  ) : (
                    ""
                  )}
                </Grid>
              </List>
            </Grid>
          </Grid>
        </Grid>
      ) : pageName == "add" ? (
        <AddBlog />
      ) : (
        <EditBlog id={selectedRow.id} />
      )}
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

export default Blog;
