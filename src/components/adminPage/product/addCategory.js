import React, { useEffect, useState } from "react";
import axiosConfig from "../../../axiosConfig";
import AdminLayout from "../../../layout/adminLayout";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import "../../../asset/css/adminPage/addCategory.css";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import AddIcon from "@mui/icons-material/Add";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CircularProgress from '@mui/material/CircularProgress';
import DeleteIcon from '@mui/icons-material/Delete';
import Autocomplete from '@mui/material/Autocomplete';
import Menu from '@mui/material/Menu';
import ErrorIcon from '@mui/icons-material/Error';
import { Alert, Snackbar } from "@mui/material";
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { useHistory } from "react-router-dom";



const AddCategory = () => {
  const [openAtt, setOpenAtt] = useState({ open: false, type: '' });
  const [openCategory, setOpenCategory] = useState(false);
  const [subType, setSubType] = useState();
  const [category, setCategory] = useState([]);
  const [type, setType] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState({ title: '' });
  const [loading, setLoading] = useState(true);
  const [attributesMenu, setAttributesMenu] = useState({ display: 'none', typeObj: '' });
  const [isEdit, setIsEdit] = useState(false);
  const [allAttributes, setAllAttributes] = useState([]);
  const [newAttributeId, setNewAttributeId] = useState('');
  const [newCategoryId, setNewCategoryId] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedDeletedAttr, setSelectedDeletedAttr] = useState('');
  const [selectedDeletedCategory, setSelectedDeletedCategory] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCategoryFlag, setSelectedCategoryFlag] = useState(true);
  const [openDeleteError, setOpenDeleteError] = useState(false);
  const [_step, set_Step] = useState(0);
  const openEditAndDeleteMenu = Boolean(anchorEl);
  const [anchorElCategory, setAnchorElCategory] = useState(null);
  const openEditAndDeleteCategory = Boolean(anchorElCategory);
  const [showTypeMenu, setShowTypeMenu] = useState({ display: 'none', category: '', name: '' });
  const [errorMessage, setErrorMessage] = useState({ message: '' })
  const [disabledSave, setDisabledSave] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState({ message: '', open: false });
  const [disabled, setDisabled] = useState(false);
  const [showMoreMainVarient, setShowMoreMainVarient] = useState(false);
  const [showMoreVarient, setShowMoreVarient] = useState([]);
  const [showMoreAddAtt, setShowMoreAddAtt] = useState([]);
  const [clicked, setClicked] = useState(0);
  const [width, setWidth] = useState('');
  const [selectedIndexs, setSelectedIndexs] = useState([]);
  const [selectedTypeIndexs, setSelectedTypeIndexs] = useState([]);
  const [user, setUser] = useState("11");
  const [role, setRole] = useState('');
  let history = useHistory();
  useEffect(() => {
    getUserInfo();
  }, [])
  const getUserInfo = async () => {
    await axiosConfig
      .get("/users/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(async (res) => {
        let user = res.data.user;
        setUser(user);
        await axiosConfig
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
        if(err.response.data.error.status === 401){
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
          setShowSuccessMessage({ message: 'Get user info has a problem!', open: true });
        }
      });
  };



  const getWindowWidth = () => {
    setWidth(window.innerWidth)
  }

  useEffect(() => {
    window.addEventListener('resize', getWindowWidth)
  }, [])

  useEffect(() => {
    categoryList();
  }, [subType, type, showTypeMenu, attributesMenu])

  const handleClickOpenDialogCategory = () => {
    setOpenCategory(true);

  };

  const handleCloseDialogCategory = () => {
    setOpenCategory(false);
    setIsEdit(false)
    setDisabledSave(false);
  };


  const handleClickOpenDialogAtt = (type) => {

    axiosConfig.get('/admin/category/attributes')
      .then(res => {
        if (type === 'main') {
          setAllAttributes((res.data.attributes.filter(a => a.is_parent)));
          setOpenAtt({ open: true, type: 'main' });
        }
        if (type === 'variant') {
          setAllAttributes((res.data.attributes.filter(a => a.is_variant).filter(b => !b.is_parent)));
          setOpenAtt({ open: true, type: 'variant' });
        }
        if (type === 'attribute') {
          setAllAttributes((res.data.attributes.filter(a => !a.is_variant)));
          setOpenAtt({ open: true, type: 'attribute' });
        }
      })
  };

  const handleClicChangeDialogAtt = (type, attribute, category) => {

    axiosConfig.get('/admin/category/attributes')
      .then(res => {

        if (type === 'ChangeMain') {
          setAllAttributes((res.data.attributes.filter(a => a.is_parent)));
          setSelectedDeletedAttr(attribute)
          setSelectedDeletedCategory(category.id)
          setOpenAtt({ open: true, type: 'ChangeMain' });

        }

      })
  };

  const handleCloseDialogAtt = () => {
    setOpenAtt({ open: false, type: '' });
    setDisabledSave(false);
    setNewAttributeId('');
  };



  const categoryList = () => {
    axiosConfig.get('/admin/category/all')
      .then(res => {
        setLoading(false)
        setCategory(res.data.categories)
        let categorArray = [];
        res.data.categories.map((category) => {
          category.types.map((cat) => {
            categorArray.push({ id: cat.id, name: category.title + " - " + cat.title });
            localStorage.setItem(category.title + " " + cat.title, cat.id);
            localStorage.setItem(cat.id, category.title + " " + cat.title);
          });

        });
        localStorage.setItem("categories", JSON.stringify(categorArray));
      })
  }


  const addNewCategory = async () => {
    setDisabled(true)
    setDisabled(true)

    setDisabled(true)
    await axiosConfig.post('/admin/category/add', newCategoryName)
      .then(res => {
        setShowSuccessMessage({ message: newCategoryName.title + ' Saved Successfully!', open: true });
        setOpenCategory(false);
        setDisabled(false)
        setDisabled(false)
        axiosConfig.get(`/admin/category/${selectedCategory.id}`)
          .then(res => {
            setLoading(false)
            setDisabled(false)
            setDisabled(false)
            if (newCategoryName.parent_id !== undefined) {
              setShowTypeMenu({ display: 'block', category: res.data.categories, name: selectedCategory.title })
            }
            setSubType('')
          })
          .catch(err => {
            setShowSuccessMessage({ message: 'Get category has a problem!', open: true });
          })
      })
      .catch(err => {
        setShowSuccessMessage({ message: 'Add category has a problem!', open: true });
      })
    setDisabled(false)
  }

  const editCategory = () => {
    setDisabled(true)
    setDisabled(true)
    const categoryObj = {
      title: newCategoryName.title,
      slug: newCategoryName.title,
      status: 1
    }
    axiosConfig.put(`/admin/category/${selectedCategory.id}`, categoryObj)
      .then(res => {
        setShowSuccessMessage({ message: selectedCategory.title + ' Edited Successfully!', open: true });
        setOpenCategory(false);
        setDisabled(false)
        setDisabled(false)
        axiosConfig.get(`/admin/category/${selectedCategory.id}`)
          .then(res => {
            setLoading(false)
            setShowTypeMenu({ display: 'block', category: res.data.categories, name: selectedCategory.title })
            setSubType('')
          })
          .catch(err => {
            setShowSuccessMessage({ message: 'Get category has a problem!', open: true });
          })

        setIsEdit(false);
        handleCloseEditAndDeleteCategory()
        categoryList();
      })
      .catch(err => {
        setOpenCategory(false);
        setDisabled(false)
        setOpenDeleteError(true);
        setErrorMessage({ message: 'You cannot edit ' + selectedCategory.title + ' because ' + err.response.data.error })
      })
  }

  const editType = () => {
    setDisabled(true)
    setDisabled(true)
    const typeObj = {
      parent_id: selectedCategory.id,
      title: newCategoryName.title,
      slug: newCategoryName.title,
      status: 1
    }

    axiosConfig.put(`/admin/category/${newCategoryId.id}`, typeObj)
      .then(res => {
        setShowSuccessMessage({ message: newCategoryName.title + ' Edited Successfully!', open: true });
        setOpenCategory(false);
        setDisabled(false)
        setDisabled(false)
        axiosConfig.get(`/admin/category/${selectedCategory.id}`)
          .then(res => {
            setLoading(false)
            setShowTypeMenu({ display: 'block', category: res.data.categories, name: selectedCategory.title })
            setSubType('')
            handleCloseEditAndDeleteMenu();

          })
          .catch(err => {
            setShowSuccessMessage({ message: 'Get category has a problem!', open: true });
          })
        setIsEdit(false);
        handleCloseEditAndDeleteCategory()
        categoryList();
      })
      .catch(err => {
        setShowSuccessMessage({ message: 'Edit category has a problem!', open: true });
      })
    setDisabled(false)
    setDisabled(false)
  }

  const handleClickDelete = (attribute, category) => {
    setSelectedDeletedAttr(attribute)
    setSelectedDeletedCategory(category.id)
    setOpenDelete(true)
  }

  const handleClickDeleteCategory = () => {
    setOpenDelete(true)
  }

  const handleCloseDialogDelete = () => {
    setSelectedDeletedAttr('');
    setOpenDelete(false)
    setAnchorEl(null)
    handleCloseEditAndDeleteCategory();
    setDisabledSave(false);
  }

  const addNewAttributes = (attribute, categor) => {
    let result = [];
    newAttributeId.map(att => {
      result.push(att.id)
    })
    const categoryObj = {
      "category_id": newCategoryId.id,
      "attribute_id": result
    }

    let mainVarientAttributes = attributesMenu.typeObj.attributes.filter(a => a.is_parent);
    if (openAtt.type === 'ChangeMain' && mainVarientAttributes.length != 0) {

      deleteAttribute()
    }


    axiosConfig.post('/admin/category/add_category_attribute', categoryObj)
      .then(res => {
        setShowSuccessMessage({ message: newAttributeId.label + ' Saved Successfully!', open: true });
        setOpenAtt({ open: false, type: '' });
        categoryList();
        setNewAttributeId('');
        axiosConfig.get(`/admin/category/${selectedCategory.id}`)
          .then(res => {
            setAttributesMenu({ display: 'flex', typeObj: res.data.categories.find(t => t.id === newCategoryId.id) })
            setShowTypeMenu({ display: 'block', category: res.data.categories, name: selectedCategory.title })
          })
          .catch(err => {
            setShowSuccessMessage({ message: 'Get category has a problem!', open: true });
          })
      })
      .catch(err => {
        setOpenDelete(false);
        handleCloseEditAndDeleteCategory();
      })
      .catch(err => {
        setShowSuccessMessage({ message: 'Add category has a problem!', open: true });
      })
  }

  const deleteAttribute = () => {
    axiosConfig.delete('/admin/category/remove_category_attribute', {
      data: {
        category_id: selectedDeletedCategory,
        attribute_id: selectedDeletedAttr.id
      }
    })
      .then((res) => {
        setShowSuccessMessage({ message: selectedDeletedAttr.label + ' Deleted Successfully!', open: true });
        handleCloseEditAndDeleteCategory()
        categoryList();
        setSelectedDeletedAttr('');
        axiosConfig.get(`/admin/category/${selectedCategory.id}`)
          .then(res => {
            setAttributesMenu({ display: 'flex', typeObj: res.data.categories.find(t => t.id === newCategoryId.id) })
            setShowTypeMenu({ display: 'block', category: res.data.categories, name: selectedCategory.title })
          })
          .catch(err =>{
            setShowSuccessMessage({ message: 'Get category has a problem!', open: true });
          })
        setOpenDelete(false)
      })
      .catch((err) => {
        setOpenDelete(false);
        setOpenDeleteError(true);
        setErrorMessage({ message: err.response.data.error })
      })
  }

  const deleteCategory = () => {
    axiosConfig.delete(`/admin/category/${selectedCategory.id}`)
      .then(res => {
        setShowSuccessMessage({ message: selectedCategory.title + ' Deleted Successfully!', open: true });
        categoryList();
        setOpenDelete(false)
        handleCloseEditAndDeleteCategory()
        setAttributesMenu({ display: 'none', typeObj: '' })
        setShowTypeMenu({ display: 'none', category: '', name: '' })
      })
      .catch(err => {
        setOpenDelete(false);
        setOpenDeleteError(true);
        setErrorMessage({ message: err.response.data.error })
      })
  }

  const deleteType = () => {
    axiosConfig.delete(`/admin/category/delete_type/${newCategoryId.id}`, {
      data: {
        parent_id: selectedCategory.id
      }
    })
      .then(res => {
        setShowSuccessMessage({ message: newCategoryId.title + ' Deleted Successfully!', open: true });
        categoryList();
        setOpenDelete(false)
        axiosConfig.get(`/admin/category/${selectedCategory.id}`)
          .then(res => {
            setLoading(false)
            if (res.data.categories.length > 0) {
              setShowTypeMenu({ display: 'block', category: res.data.categories, name: selectedCategory.title })
            } else {
              setShowTypeMenu({ display: 'none', category: '', name: '' })
            }
            setAttributesMenu({ display: 'none', typeObj: '' })

          })
          .catch(err =>{
            setShowSuccessMessage({ message: 'Get category has a problem!', open: true });
          })
        handleCloseEditAndDeleteMenu();
      })
      .catch(err => {
        setOpenDelete(false);
        setOpenDeleteError(true);
        handleCloseEditAndDeleteCategory();
        setErrorMessage({ message: err.response.data.error })
      })
  }

  const isLoading = () => {
    return (
      <Grid item xs={12} mt={2} mb={2} display='flex' justifyContent='center'>
        <CircularProgress color='P' />
      </Grid>
    )
  }
  const handleClickEditAndDeleteMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseEditAndDeleteMenu = () => {
    setAnchorEl(null);
  };

  const bread = [
    {
      title: "Products",
      href: "/admin/product",
    },
  ];

  const handleClickEditAndDeleteCategory = (event) => {
    setAnchorElCategory(event.currentTarget);
  };
  const handleCloseEditAndDeleteCategory = () => {
    setAnchorElCategory(null);
  };

  const clickEditCategory = () => {
    setSelectedCategoryFlag(true);
    setIsEdit(true);
    handleClickOpenDialogCategory()
  }

  const clickEditType = () => {
    setSelectedCategoryFlag(false);
    setIsEdit(true);
    handleClickOpenDialogCategory()
  }

  const showMoreValues = (type) => {
    let result = [];
    if (type == 'mainVarient') {
      setShowMoreMainVarient(true)
    } else if (type == 'varient') {
      attributesMenu.typeObj.attributes.filter(a => a.is_variant).filter(p => !p.is_parent).map((att, index) => {
        if (att.values.length <= 5) {
          result[index] = false
        } else {
          result[index] = true
        }
      })
      setShowMoreVarient(result)
      setClicked(clicked + 1)
    } else if (type == 'addAtt') {
      attributesMenu.typeObj.attributes.filter(a => !a.is_variant).map((att, index) => {
        if (att.values.length <= 5) {
          result[index] = false
        } else {
          result[index] = true
        }
      })
      setShowMoreAddAtt(result);
      setClicked(clicked + 1)
    }
  }

  const showLess = (type, index) => {
    let result = [];
    if (type == 'mainVarient') {
      setShowMoreMainVarient(false)
    } else if (type == 'varient') {
      result = showMoreVarient;
      result[index] = false;
      setShowMoreVarient(result)
      setClicked(clicked + 1)
    } else if (type == 'addAtt') {
      result = showMoreAddAtt;
      result[index] = false;
      setShowMoreAddAtt(result)
      setClicked(clicked + 1)
    }
  }
  useEffect(() => {

  }, [clicked + 1])


  const checkIsDisabaled = (title, type) => {
    let result = false;
    if (type == 'attribute') {
      attributesMenu.typeObj.attributes.filter(a => !a.is_variant).map(selectedAtt => {
        if (result == false) {
          if (selectedAtt.title === title) {

            result = true
          } else {
            result = false
          }
        }
      })
    } else if (type == 'variant') {
      attributesMenu.typeObj.attributes.filter(a => a.is_variant).filter(p => !p.is_parent).map(selectedAtt => {
        if (result == false) {
          if (selectedAtt.title === title) {

            result = true
          } else {
            result = false
          }
        }
      })
    } else if (type == 'main' || type == 'ChangeMain') {
      (attributesMenu.typeObj.attributes.filter(a => a.is_parent)).map(selectedAtt => {
        if (result == false) {
          if (selectedAtt.title === title) {

            result = true
          } else {
            result = false
          }
        }
      })
    }
    return result;
  }

  const flexWrapOrFlexByWidth = () => {
    return window.innerWidth >= 733 ? null : 'wrap'

  }

  return (

    <AdminLayout breadcrumb={bread} pageName="Categories">
      {loading ? isLoading() :
        <Grid container spacing={2}>
          <Grid item lg={3.5} sm={12} md={6} xs={12}>
            <Paper elevation={5} sx={{ mt: 0.37 }}>
              <MenuList sx={{
                padding: '0'
              }}>
                <Grid item xs={12} p={2} display='flex' justifyContent='space-between'>
                  <Grid mt={0.5}>
                    <Typography variant="menutitle" color="Black.main">
                      Categories
                    </Typography>
                  </Grid>
                  <Grid>
                    <Button
                      onClick={() => {
                        setSelectedCategoryFlag(true)
                        handleClickOpenDialogCategory()
                      }}
                      variant="contained"
                      color="P"
                      sx={{ color: "White.main", textTransform: 'none' }}
                      startIcon={<AddIcon />}

                    >
                      Add Category
                    </Button>
                  </Grid>
                </Grid>
                <Divider />

                {category.map((categoryName, index) => {
                  let isClickedMoreIcon = false;
                  return (
                    <MenuItem
                      style={categoryName.id === selectedCategory.id ? ((category.length - 1) === index ? { backgroundColor: 'rgba(76, 73, 75, 0.19)', opacity: 1, padding: 16, borderBottom: 'none' } : { backgroundColor: 'rgba(76, 73, 75, 0.19)', opacity: 1, padding: 16, borderBottom: 'solid 1px rgba(0, 0, 0, 0.12)' }) : ((category.length - 1) === index ? { opacity: 1, padding: 16, borderBottom: 'none' } : { opacity: 1, padding: 16, borderBottom: 'solid 1px rgba(0, 0, 0, 0.12)' })}
                      onClick={() => {
                        let indexs = [...selectedIndexs];
                        if (isClickedMoreIcon != true) {
                          indexs[index] = false;
                          indexs.map((i, index1) => {
                            if (index != index1) {
                              indexs[index1] = true;

                            }
                          })
                          setSelectedTypeIndexs([]);
                          setSelectedIndexs(indexs)
                          setShowMoreVarient([])
                          setShowMoreAddAtt([])
                          setClicked(clicked + 1);
                          setSelectedCategory(categoryName)
                          setSelectedCategoryFlag(true);
                          setAttributesMenu({ display: 'none', typeObj: '' })
                          axiosConfig.get(`/admin/category/${categoryName.id}`)
                            .then(res => {
                              setLoading(false)
                              setShowTypeMenu({ display: 'block', category: res.data.categories, name: categoryName.title })
                            })
                            .catch(err =>{
                              setShowSuccessMessage({ message: 'Get category has a problem!', open: true });
                            })
                        }
                      }}
                    >
                      <Typography variant="menuitem" mr={2} color="Black.main">
                        {index + 1}
                      </Typography>
                      <ListItemText >
                        <Typography variant="menuitem" color="Black.main">
                          {categoryName.title.charAt(0).toUpperCase() + categoryName.title.slice(1)}
                        </Typography>
                      </ListItemText>
                      <Grid className="moreIcone">
                        <IconButton
                          aria-label="more"
                          id="demo-positioned-menu"
                          aria-controls={openEditAndDeleteCategory ? 'demo-positioned-menu' : undefined}
                          aria-expanded={openEditAndDeleteCategory ? 'true' : undefined}
                          aria-haspopup="true"
                          onClick={
                            (event) => {
                              isClickedMoreIcon = true
                              handleClickEditAndDeleteCategory(event);
                              setSelectedCategory(categoryName)
                            }
                          }
                        >
                          <MoreVertIcon color='Black' />
                        </IconButton>
                      </Grid>
                      <IconButton
                        onClick={
                          (event) => {
                            let indexs = [...selectedIndexs];
                            if (selectedIndexs[index] == false) {
                              indexs[index] = true;
                              isClickedMoreIcon = true
                              setShowTypeMenu({ display: 'none', category: '', name: '' })
                              setAttributesMenu({ display: 'none', typeObj: '' })
                            } else {
                              indexs[index] = false;
                              indexs.map((i, index1) => {
                                if (index != index1) {
                                  indexs[index1] = true;

                                }
                              })
                            }
                            setShowMoreVarient([])
                            setShowMoreAddAtt([])
                            setSelectedTypeIndexs([]);
                            setSelectedIndexs(indexs)
                            setClicked(clicked + 1);
                          }
                        }
                      >
                        {selectedIndexs[index] == undefined || selectedIndexs[index] ? <NavigateNextIcon color='Black' />
                          :
                          <KeyboardArrowLeftIcon color='Black' />
                        }
                      </IconButton>
                    </MenuItem>

                  )
                })}
                <Menu
                  id="demo-positioned-menu"
                  aria-labelledby="demo-positioned-button"
                  anchorEl={anchorElCategory}
                  open={openEditAndDeleteCategory}
                  onClose={handleCloseEditAndDeleteCategory}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  <MenuItem onClick={clickEditCategory}>Edit</MenuItem>
                  <MenuItem onClick={handleClickDeleteCategory}>Delete</MenuItem>
                </Menu>
              </MenuList>
            </Paper>
          </Grid>
          <Grid item lg={3.5} md={6} sm={12} xs={12} pt={1} display={showTypeMenu.display} sx={{ mt: 0.37 }}>
            <Paper elevation={5} sx={{ width: "100%" }}>
              <MenuList sx={{ width: "100%" }} disablePadding>
                <Box
                  display="flex"
                  xs={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Grid item xs={12} p={2} display='flex' justifyContent='space-between'>
                    <Grid mt={0.5}>
                      <Typography variant="menutitle" color="Black.main">
                        Types
                      </Typography>
                    </Grid>
                    <Grid>
                      <Button
                        onClick={() => {
                          setSelectedCategoryFlag(false)
                          handleClickOpenDialogCategory()
                          set_Step(2);
                        }}
                        variant="contained"
                        color="P"
                        style={{ color: "white", textTransform: 'none' }}
                        startIcon={<AddIcon />}

                      >
                        Add Type
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
                <Divider />
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
                  <MenuItem onClick={clickEditType} >Edit</MenuItem>
                  <MenuItem onClick={handleClickDeleteCategory}>Delete</MenuItem>
                </Menu>
                {showTypeMenu.category.length > 0 ? showTypeMenu.category.map((typeName, index) => {
                  let isClickedMoreIcon = false;
                  return (
                    <MenuItem
                      style={{ opacity: 1, padding: 16, borderBottom: 'solid 1px rgba(0, 0, 0, 0.12)' }}
                      onClick={() => {
                        let indexs = [...selectedTypeIndexs];
                        if (isClickedMoreIcon != true) {
                          indexs[index] = false;
                          indexs.map((i, index1) => {
                            if (index != index1) {
                              indexs[index1] = true;
                            }
                          })
                          setSelectedTypeIndexs(indexs)
                          setShowMoreVarient([])
                          setShowMoreAddAtt([])
                          setClicked(clicked + 1);
                          setNewCategoryId(typeName)
                          setAttributesMenu({ display: 'flex', typeObj: typeName })
                          setSelectedCategoryFlag(false);
                        }
                      }}
                    >
                      <ListItemText

                      >
                        <Typography variant="menuitem" mr={2} color="black">
                          {typeName.title == null ? '???' : typeName.title.charAt(0).toUpperCase() + typeName.title.slice(1)}

                        </Typography>
                      </ListItemText>
                      <Grid className="moreIcone">
                        <IconButton
                          aria-label="more"
                          id="demo-positioned-menu"
                          aria-controls={openEditAndDeleteMenu ? 'demo-positioned-menu' : undefined}
                          aria-expanded={openEditAndDeleteMenu ? 'true' : undefined}
                          aria-haspopup="true"
                          onClick={
                            (event) => {
                              isClickedMoreIcon = true
                              handleClickEditAndDeleteMenu(event)
                            }
                          }
                        >
                          <MoreVertIcon color='Black' />
                        </IconButton>
                      </Grid>
                      <IconButton
                        aria-label="more"
                        id="demo-positioned-menu"
                        aria-controls={openEditAndDeleteMenu ? 'demo-positioned-menu' : undefined}
                        aria-expanded={openEditAndDeleteMenu ? 'true' : undefined}
                        aria-haspopup="true"
                        onClick={
                          (event) => {
                            let indexs = [...selectedTypeIndexs];
                            if (selectedTypeIndexs[index] == false) {
                              indexs[index] = true;
                              isClickedMoreIcon = true
                              setAttributesMenu({ display: 'none', typeObj: '' })
                            } else {
                              indexs[index] = false;
                              indexs.map((i, index1) => {
                                if (index != index1) {
                                  indexs[index1] = true;
                                }
                              })
                            }
                            setSelectedTypeIndexs(indexs)
                            setClicked(clicked + 1);
                          }
                        }
                      >
                        {selectedTypeIndexs[index] == undefined || selectedTypeIndexs[index] ? <NavigateNextIcon color='Black' />
                          :
                          <KeyboardArrowLeftIcon color='Black' />
                        }
                      </IconButton>
                    </MenuItem>
                  )
                })
                  :
                  <Grid display='flex' height='80px' alignItems='center' justifyContent='center'>
                    <Typography variant="menuitem" mr={2} color="Black.main">
                      No type in category '{showTypeMenu.name}'
                    </Typography>
                  </Grid>
                }
              </MenuList>
            </Paper>
          </Grid>
          <Grid item lg={5} sm={12} md={12} sx={{ mt: 0.37 }} display={attributesMenu.display}>
            <Paper elevation={5} sx={{ width: "100%", minHeight: "550px" }}>
              <MenuList sx={{ width: "100%" }} disablePadding>
                <Grid
                  item
                  xs={12}
                  m={1}
                  ml={0}
                  mt={2.7}
                  mb={2.3}
                  display="flex"
                  justifyContent="space-between"
                  alignItems='end'
                  pl={2}
                >
                  <Grid item mb={0} style={{
                    whiteSpace: 'nowrap',
                    width: '199px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    <Typography variant="menutitle" pt={0} color="Black.main">
                      {attributesMenu.typeObj === '' ? '' : 'Attributes ' + attributesMenu.typeObj.title.charAt(0).toUpperCase() + attributesMenu.typeObj.title.slice(1)}
                    </Typography>
                  </Grid>
                </Grid>
                <Divider />
              </MenuList>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "start",
                  p: 1,
                  width: "100%",
                }}
              >
                <Grid item xs={12} >
                  {attributesMenu.typeObj !== '' &&
                    <>
                      <Typography color='G1.main' variant='h3' pl={1}>Main Variant:</Typography>
                      <Grid item xs={12}>
                        {attributesMenu.typeObj.attributes.filter(a => a.is_parent).length === 0 ?
                          <Grid xs={12} display="flex" direction='column' textAlign='center' p={2}>
                            <Typography variant="h10" pb={1} color="G1.main">
                              There Are No Main Variant Attributes!
                            </Typography>
                            <Grid >
                              <Button
                                onClick={() => handleClickOpenDialogAtt('main')}
                                variant="contained"
                                color="P"
                                sx={{ color: "White.main" }}
                                startIcon={<AddIcon />}
                              >
                                Add Main Variant
                              </Button>
                            </Grid>
                          </Grid>
                          : attributesMenu.typeObj.attributes.filter(a => a.is_parent).map((att, index) => {
                            return (
                              <Grid item xs={12} pt={1} pb={1} >
                                <Grid item xs={12} pl={0.1} m={1} ml={0} display='flex' justifyContent='space-between' >

                                  <Grid item m={1} ml={0} display='flex' flexWrap='wrap' pl={1}>
                                    <Typography variant="h11" color='Black.main' >
                                      {!att.title ? '' : att.title.charAt(0).toUpperCase() + att.title.slice(1)}

                                    </Typography>
                                    <Typography color="G2.main" ml={(!att.title || att.title == '') ? 0 : 1}
                                      variant="italic"
                                      textTransform='capitalize'
                                    >
                                      ({!att.label ? '' : att.label.charAt(0).toUpperCase() + att.label.slice(1)})
                                    </Typography>

                                  </Grid>
                                  <Grid>

                                    <IconButton onClick={() => handleClicChangeDialogAtt('ChangeMain', att, attributesMenu.typeObj)}
                                    >
                                      <ChangeCircleIcon />
                                    </IconButton>

                                  </Grid>

                                </Grid>
                                <Grid ml={1} height={70} sx={showMoreMainVarient ? { overflow: 'auto' } : { overflow: 'hidden', height: '45' }} xs={12}>
                                  {att.values.map((valueAtt, index) => {
                                    return showMoreMainVarient ? (
                                      <Grid item xs={12} display='inline' >
                                        <Chip
                                          label={valueAtt.value}
                                          variant="outlined"
                                          sx={{ padding: '5px', margin: '4px' }}
                                        />

                                      </Grid>
                                    ) : index < 2 && (
                                      <Grid item xs={12} display='inline' >
                                        <Chip
                                          label={valueAtt.value}
                                          variant="outlined"
                                          sx={{ padding: '5px', margin: '4px' }}
                                        />

                                      </Grid>
                                    )
                                  })}

                                </Grid>
                                {(att.values.length > 5 && showMoreMainVarient == false) && (
                                  <Button

                                    color="P"
                                    onClick={() => showMoreValues('mainVarient')}
                                    sx={{ textTransform: 'none' }}
                                  >
                                    More Item
                                  </Button>
                                )}
                                {(showMoreMainVarient && att.values.length > 5) && (
                                  <Button

                                    color="P"
                                    onClick={() => showLess('mainVarient')}
                                  >
                                    Less item
                                  </Button>
                                )}
                                {attributesMenu.typeObj.attributes.filter(p => p.is_parent).length - 1 === index ? '' : <Divider />}
                              </Grid>

                            )
                          })
                        }

                      </Grid>
                      <Divider />
                      <Grid xs={12}>
                        <Grid display='flex' justifyContent='space-between' p={1} sx={{ flexWrap: window.innerWidth > 712 ? null : 'wrap' }}>
                          <Typography color='G1.main' pt={1} variant='h3'>Variants:</Typography>

                          {attributesMenu.typeObj.attributes.filter(a => a.is_variant).filter(p => !p.is_parent).length !== 0 ?
                            <Grid >

                              <Button
                                onClick={() => handleClickOpenDialogAtt('variant')}
                                variant="contained"
                                color="P"
                                sx={{ color: "White.main", textTransform: 'none' }}
                                startIcon={<AddIcon />}

                              >
                                Add Variant
                              </Button>
                            </Grid>
                            : ''}
                        </Grid>

                        {attributesMenu.typeObj.attributes.filter(a => a.is_variant).filter(p => !p.is_parent).length === 0 ?
                          <Grid xs={12} display="flex" direction='column' textAlign='center' p={2}>
                            <Typography variant="h10" pb={1} color="G1.main">
                              There Are No Variants!
                            </Typography>
                            <Grid display='flex' direction='row' justifyContent='center'>


                              <Button
                                disabled={attributesMenu.typeObj.attributes.filter(a => a.is_parent).length === 0}
                                onClick={() => handleClickOpenDialogAtt('variant')}
                                variant="contained"
                                color="P"
                                sx={{ color: "White.main", "&.Mui-disabled": { backgroundColor: 'P.main', color: "White.main" } }}
                                startIcon={<AddIcon />}
                              >
                                Add Variant
                              </Button>
                            </Grid>
                          </Grid>
                          :
                          attributesMenu.typeObj.attributes.filter(a => a.is_variant).filter(p => !p.is_parent).map((att, index) => {
                            return (
                              <Grid item xs={12}   >
                                <Grid item xs={12} pl={1.2} pt={1} pb={1} m={1} ml={0} display='flex' justifyContent='space-between' >
                                  <Grid item xs={12} m={1} ml={0} display='flex'  >
                                    <Typography variant="h11" color='Black.main' >
                                      {(!att.title || att.title == '') ? '' : att.title.charAt(0).toUpperCase() + att.title.slice(1)}
                                    </Typography>
                                    <Typography color="G2.main" ml={(!att.title || att.title == '') ? 0 : 1}
                                      variant="italic"
                                      textTransform='capitalize'
                                    >
                                      ({!att.label ? '' : att.label.charAt(0).toUpperCase() + att.label.slice(1)})
                                    </Typography>
                                  </Grid>
                                  <IconButton onClick={() => handleClickDelete(att, attributesMenu.typeObj)
                                  }>
                                    <DeleteIcon />
                                  </IconButton>

                                </Grid>
                                <Grid ml={1} sx={[showMoreVarient[index] ? { overflow: 'auto', height: 70 } : { overflow: 'hidden', height: 55 }, (showMoreVarient[index] && att.values.length > 5) && { mb: 2 }]}>
                                  {att.values.map((valueAtt, index1) => {
                                    return showMoreVarient[index] ? (
                                      <Grid item xs={12} display='inline' >
                                        <Chip
                                          label={valueAtt.value}
                                          variant="outlined"
                                          sx={{ padding: '5px', margin: '4px', marginBottom: 2 }}
                                        />

                                      </Grid>
                                    ) : index1 < 5 && (
                                      <Grid item xs={12} display='inline' >
                                        <Chip
                                          label={valueAtt.value}
                                          variant="outlined"
                                          sx={{ padding: '5px', margin: '4px', marginBottom: 2 }}
                                        />

                                      </Grid>
                                    )
                                  })}
                                </Grid>

                                {(att.values.length > 5) && (
                                  showMoreVarient[index] ?
                                    <Button
                                      color="P"
                                      onClick={() => showLess('varient', index)}
                                    >
                                      Less item
                                    </Button>
                                    :
                                    <Button
                                      color="P"
                                      onClick={() => {
                                        let items = [...showMoreVarient]
                                        items[index] = true
                                        setShowMoreVarient(items);
                                        setClicked(clicked + 1);
                                      }}
                                      sx={{ textTransform: 'none' }}
                                    >
                                      More Item
                                    </Button>
                                )}
                                {attributesMenu.typeObj.attributes.filter(a => a.is_variant).filter(p => !p.is_parent).length - 1 === index ? '' : <Divider />}
                              </Grid>

                            )
                          })
                        }
                      </Grid>
                      <Divider />
                      <Grid xs={12}>
                        <Grid display='flex' justifyContent='space-between' p={1} sx={{ flexWrap: flexWrapOrFlexByWidth() }} >
                          <Typography color='G1.main' pt={1} variant='h3'>Additional Attributes:</Typography>
                          {attributesMenu.typeObj.attributes.filter(a => !a.is_variant).length !== 0 ?
                            <Grid >

                              <Button
                                onClick={() => handleClickOpenDialogAtt('attribute')}
                                variant="contained"
                                color="P"
                                sx={{ color: "White.main", padding: '8px', textTransform: 'none' }}
                                startIcon={<AddIcon />}

                              >
                                Add Attribute
                              </Button>
                            </Grid>
                            : ''}
                        </Grid>
                        {attributesMenu.typeObj.attributes.filter(a => !a.is_variant).length === 0 ?
                          <Grid xs={12} display="flex" direction='column' textAlign='center' p={2}>
                            <Typography variant="h10" pb={1} color="G1.main">
                              There Are No Additional Attributes!
                            </Typography>
                            <Grid >
                              <Button
                                disabled={attributesMenu.typeObj.attributes.filter(a => a.is_parent).length === 0}
                                onClick={() => handleClickOpenDialogAtt('attribute')}
                                variant="contained"
                                color="P"
                                sx={{ color: "White.main", "&.Mui-disabled": { backgroundColor: 'P.main', color: "White.main" } }}
                                startIcon={<AddIcon />}
                              >
                                Add Additional Attribute
                              </Button>
                            </Grid>
                          </Grid>

                          :
                          attributesMenu.typeObj.attributes.filter(a => !a.is_variant).map((att, index) => {
                            return (
                              <Grid item xs={12} >
                                <Grid item xs={12} m={1} ml={0} display='flex' justifyContent='space-between' >
                                  <Grid item xs={12} m={1} ml={0} display='flex'  >
                                    <Typography variant="h11" pl={1.1} color='Black.main' >
                                      {(!att.title || att.title == '') ? '' : att.title.charAt(0).toUpperCase() + att.title.slice(1)}

                                    </Typography>
                                    <Typography color="G2.main" ml={(!att.title || att.title == '') ? 0 : 1} textTransform='capitalize'
                                      variant="italic"
                                    >
                                      ({!att.label ? '' : att.label.charAt(0).toUpperCase() + att.label.slice(1)})
                                    </Typography>
                                  </Grid>
                                  <IconButton onClick={() => handleClickDelete(att, attributesMenu.typeObj)
                                  }>
                                    <DeleteIcon />
                                  </IconButton>

                                </Grid>
                                <Grid ml={1} sx={showMoreAddAtt[index] ? { overflow: 'auto', height: 55 } : att.values.length > 0 ? { overflow: 'hidden', height: 50 } : { overflow: 'hidden', height: 25 }}>
                                  {att.values.map((valueAtt, index1) => {
                                    return showMoreAddAtt[index] ? (
                                      <Grid item xs={12} display='inline' >
                                        <Chip
                                          label={valueAtt.value}
                                          variant="outlined"
                                          sx={{ padding: '5px', margin: '4px', marginBottom: 2 }}
                                        />

                                      </Grid>
                                    ) : index1 < 5 && (
                                      <Grid item xs={12} display='inline' >
                                        <Chip
                                          label={valueAtt.value}
                                          variant="outlined"
                                          sx={{ padding: '5px', margin: '4px', marginBottom: 2 }}
                                        />

                                      </Grid>
                                    )
                                  })}
                                </Grid>



                                {(att.values.length > 5) && (
                                  showMoreAddAtt[index] ?
                                    <Button

                                      color="P"
                                      onClick={() => showLess('addAtt', index)}
                                    >
                                      Less item
                                    </Button>
                                    :
                                    <Button
                                      color="P"
                                      onClick={() => {
                                        let items = [...showMoreAddAtt]
                                        items[index] = true
                                        setShowMoreAddAtt(items);
                                        setClicked(clicked + 1);
                                      }}
                                      sx={{ textTransform: 'none' }}
                                    >
                                      More Item
                                    </Button>
                                )}
                                {attributesMenu.typeObj.attributes.filter(a => !a.is_variant).length - 1 === index ? '' : <Divider />}
                              </Grid>

                            )
                          })
                        }
                      </Grid>
                    </>


                  }
                </Grid>
              </Box>
            </Paper>
          </Grid>

          <Dialog
            maxWidth="lg"
            open={openAtt.open}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <Grid item xs={12} display='flex' justifyContent='center' m={2}>
              <Typography variant="menutitle" color="Black.main" style={{ width: '400px' }}>
                {openAtt.type === 'main' ?
                  'Add Main Variant' : openAtt.type === 'ChangeMain' ? 'Change Main Variant' : openAtt.type === 'variant' ?
                    'Add Variants' : openAtt.type === 'attribute' ? 'Add Additional Attributes' : ''}
              </Typography>
            </Grid>
            <Grid item xs={12} display='flex' justifyContent='center' m={1} mb={25}>
              <Autocomplete
                id="country-select-demo"
                disablePortal
                options={allAttributes}
                disableCloseOnSelect
                getOptionLabel={(option) => option.label}
                renderOption={(props, option) => (
                  <MenuItem disabled={checkIsDisabaled(option.title, openAtt.type)} display='block' justifyContent='space-between' style={{ justifyContent: 'space-between' }} m={0} mt={1} mb={1}{...props}>
                    <Grid >
                      <Typography variant='h2' >
                        {(option.title.charAt(0).toUpperCase() + option.title.slice(1)).replace('_', ' ').length <= 17 ?
                          (option.title.charAt(0).toUpperCase() + option.title.slice(1)).replace('_', ' ') :
                          (option.title.charAt(0).toUpperCase() + option.title.slice(1)).replace('_', ' ').substring(0, 17) + "..."
                        }

                      </Typography>
                    </Grid>
                    <Grid  >
                      <Typography variant="h10" color='G2.main' >
                        {option.label.length <= 17 ? option.label : option.label.substring(0, 17) + '...'}
                      </Typography>
                    </Grid>
                  </MenuItem>
                )}
                multiple
                onChange={(event, value) => {
                  if (value !== null) {
                    setDisabledSave(false);
                    const attributes = attributesMenu.typeObj.attributes;
                    const parentAttribute = attributes.find(a => a.is_parent);
                    const variantAttribute = attributes.find(a => a.is_variant);
                    attributes.forEach(attribute => {
                      if (value[value.length - 1] != undefined) {
                        if (attribute.id === value[value.length - 1].id) {
                          setOpenDeleteError(true);
                          setErrorMessage({ message: value.title + ' is already assigned to this type!' });
                          value.pop(value.length - 1)
                        }

                      }

                      if (parentAttribute) {
                        if (value.is_parent) {
                          setOpenDeleteError(true);
                          setErrorMessage({ message: 'A main variant is already assigned!' });
                        }
                      }

                    })
                    if (value.length != 0) {
                      setDisabledSave(false)
                    } else {
                      setDisabledSave(true)
                    }
                    setNewAttributeId(value)
                  }
                }}
                sx={{ width: 350 }}
                renderInput={(params) => <TextField  {...params} label="Attribute" color='P' />}
              />
            </Grid>

            <Grid
              item
              xs={12}
              paddingLeft={1}
              paddingRight={1}
              display="flex"
              justifyContent="end"
            >
              <Divider />
              <Button
                variant="outlined"
                color="G1"
                onClick={handleCloseDialogAtt}
                sx={{ mt: 2, mb: 2, mr: 1, ml: 1 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="P"
                sx={{ mt: 2, mb: 2, mr: 1, ml: 1, color: "White.main" }}
                onClick={addNewAttributes}
                disabled={disabledSave || newAttributeId.length == 0}
              >
                save
              </Button>
            </Grid>
          </Dialog>
          <Dialog
            open={openCategory}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <Grid item xs={12} display='flex' justifyContent='start' m={2}>
              <Typography variant="menutitle" color="Black.main">
                {isEdit ? 'Edit' : 'Add'} {!selectedCategoryFlag ? 'Type' : 'Category'}
              </Typography>
            </Grid>
            <Grid item xs={12} display='flex' justifyContent='center' style={{ width: '400px' }}>
              <Grid item xs={12} p={2}>
                <TextField
                  id="outlined-basic"
                  label={!selectedCategoryFlag ? 'Add Type' : "Category Name"}
                  color="P"
                  fullWidth
                  defaultValue={isEdit ? selectedCategoryFlag ? selectedCategory.title : newCategoryId.title : ''}
                  error={disabledSave}
                  helperText={disabledSave ? newCategoryName.title + ' is already declared' : ''}
                  onChange={(e) => {
                    if (!selectedCategoryFlag) {
                      const attributes = showTypeMenu.category;
                      setDisabledSave(false)
                      attributes.forEach(a => {
                        if (e.target.value === (a.title).toLowerCase()) {
                          setDisabledSave(true);
                        }

                      })
                      setNewCategoryName({
                        title: e.target.value,
                        parent_id: selectedCategory.id
                      })
                    } else {
                      setDisabledSave(false)
                      category.forEach(c => {
                        if (e.target.value === (c.title).toLowerCase()) {
                          setDisabledSave(true);
                        }
                      })
                      setNewCategoryName({
                        title: e.target.value,
                      })
                    }
                  }}
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
              <Divider />
              <Button
                variant="outlined"
                color="G1"
                onClick={handleCloseDialogCategory}
                sx={{ mt: 2, mb: 2, mr: 1, ml: 1 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="P"
                sx={{ mt: 2, mb: 2, mr: 1, ml: 1, color: "white" }}
                disabled={isEdit ? (newCategoryName.title == '' || disabledSave || disabled) : (newCategoryName.title == '' || disabled)}
                onClick={isEdit ? (selectedCategoryFlag ? editCategory : editType) : addNewCategory}
              >
                {isEdit ? 'Edit' : 'Save'}
              </Button>
            </Grid>
          </Dialog>
          <Dialog
            open={openDelete}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <Grid xs={12} display='flex' justifyContent='center' mt={3} mb={1} ml={3} mr={6}>
              <Typography>
                Are you sure you want to delete {selectedDeletedAttr !== '' ? selectedDeletedAttr.label : selectedCategoryFlag ? selectedCategory.title : newCategoryId.title}?
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
                sx={{ mt: 2, mb: 2, mr: 1, ml: 1, color: "White.main" }}
                onClick={selectedDeletedAttr !== '' ? deleteAttribute : selectedCategoryFlag ? deleteCategory : deleteType}
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
          <Dialog
            open={openDeleteError}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <Grid xs={12} display='flex' justifyContent='center' mt={3} mb={1} ml={3} mr={6}>
              <ErrorIcon color='error' />
              <Typography pl={1}>
                {errorMessage.message}
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
                variant="outlined"
                color="G1"
                onClick={() => {
                  setOpenDeleteError(false)
                  handleCloseEditAndDeleteCategory()
                }}
                sx={{ mt: 2, mb: 2, mr: 1, ml: 1 }}
              >
                Close
              </Button>
            </Grid>
          </Dialog>
          <Snackbar
            open={showSuccessMessage.open}
            autoHideDuration={5000}
            onClose={() => {
              setShowSuccessMessage(false)
            }}
          >
            <Alert onClose={() => setShowSuccessMessage(false)} severity="success" sx={{ width: '100%' }}>
              {showSuccessMessage.message}
            </Alert>
          </Snackbar>
        </Grid>
      }
    </AdminLayout >
  );
};

export default AddCategory;
