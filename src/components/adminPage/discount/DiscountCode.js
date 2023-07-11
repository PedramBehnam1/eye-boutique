import React, {  useState, useEffect } from "react";
import {
  Button, Card, CardMedia, Grid, IconButton,  Menu, MenuItem, Paper, Typography,  Select, TextField, Divider, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, InputAdornment, Checkbox, FormGroup, Stack, Dialog, Box, InputBase,  DialogTitle, DialogContent, DialogActions, Snackbar,
} from "@mui/material";
import SearchIcon from "@material-ui/icons/Search";
import axiosConfig from "../../../axiosConfig";
import { useHistory } from "react-router-dom";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AdminLayout from "../../../layout/adminLayout";
import { DesktopDatePicker, LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import ClearIcon from '@mui/icons-material/Clear';
import FilterListIcon from '@mui/icons-material/FilterList';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';

const DiscountCode = () => {

  const [openDialog, setOpenDialog] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [checkType, setCheckType] = useState('Percentage');
  const [CheckApplies, setCheckApplies] = useState('');
  const [CheckAppliesGets, setCheckAppliesGets] = useState('');
  const [checkCustomer, setCheckCustomer] = useState('Everyone');
  const [checkConditionX, setCheckConditionX] = useState('');
  const [startDateAndTime, setStartDateAndTime] = useState(new Date());
  const [checkDate, setCheckDate] = useState(false);
  const [endDateAndTime, setEndDateAndTime] = useState(new Date());
  const [ruleName, setRuleName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [quantityBuys, setQuantityBuys] = useState('');
  const [quantityGets, setQuantityGets] = useState('');
  const [discountValue, setDiscountValue] = useState('');
  const [requirementValue, setRequirementValue] = useState('');

  const [categoryFilter, setCategoryFilter] = useState('');
  const [products, setProducts] = useState([]);
  const [searchFilter, setSearchFilter] = useState('name');
  const [nameFilter, setNameFilter] = useState("");
  const [selectedAddProduct, setSelectedAddProduct] = useState([]);
  const [selectedProductsIds, setSelectedProductsIds] = useState([]);
  const [selectedAddProductGets, setSelectedAddProductGets] = useState([]);
  const [selectedProductsIdsGets, setSelectedProductsIdsGets] = useState([]);
  const [selectedSpecificProducts, setSelectedSpecificProducts] = useState([]);
  const [selectedCollectionsProducts, setSelectedCollectionsProducts] = useState([]);
  const [selectedSpecificProductsGets, setSelectedSpecificProductsGets] = useState([]);
  const [selectedCollectionsProductsGets, setSelectedCollectionsProductsGets] = useState([]);
  
  const [categoryId, setCategoryId] = useState([])
  const [selectedCategoryId, setSelectedCategoryId] = useState([])
  const [categoryIdGets, setCategoryIdGets] = useState([])
  const [selectedCategoryIdGets, setSelectedCategoryIdGets] = useState([])
  const [users, setusers] = useState([]);
  const [userIds, setUserIds] = useState([]);
  const [userIdsGets, setUserIdsGets] = useState([]);
  const [userGroupId, setUserGroupId] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [selectedUserGroupId, setSelectedUserGroupId] = useState([]);
  const [selectedGroupUsers, setSelectedGroupUsers] = useState([]);
  const [selectedCustomersUsers, setSelectedCustomersUsers] = useState([]);
  const [selectedCustomersUsersGets, setSelectedCustomersUsersGets] = useState([]);

  const [valueCheckBoxGets, setValueCheckBoxGets] = useState([0]);
  const [usageLimit, setUsageLimit] = useState(0);
  const [_usageLimit, _setUsageLimit] = useState(0);
  const [valueUsageLimit, setValueUsageLimit] = useState('');
  const [_valueUsageLimit, _setValueUsageLimit] = useState('0');
  const [status, setStatus] = useState(true);
  const [filteredUser, setFilteredUser] = useState([]);
  const [openDialogY, setOpenDialogY] = useState(false);

  const [filterVluesProduct, setFilterValusProducts] = useState([]);
  const [filterVluesGets, setFilterValusGets] = useState([]);
  const [filterVluesEligibility, setFilterValusEeligibility] = useState([]);
  const [discountValuesStatus, setDiscountValueStatus] = useState(false)
  const [quantityGetsStatus, setQuantityGetsStatus] = useState(false);
  const [requirements, setRequirements] = useState("");
  const [anchorElSortDate, setAnchorElSortDate] = useState(null);
  const openSortMenu = Boolean(anchorElSortDate);
  let history = useHistory();
  const englishAlphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
  const [user, setUser] = useState("11");
  const [role, setRole] = useState('');
  const [openMassage, setOpenMassage] = useState(false);
  const [showMassage, setShowMassage] = useState('');
  
  useEffect( ()=>{
    getUserInfo();
  },[])

  const getUserInfo =  () => {
    axiosConfig.get("/users/profile", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then( (res) => {
      
      let user =res.data.user; 
      setUser(user);
      axiosConfig
      .get("/users/get_roles", {
      headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      }).then((res) => {
          let _role ="";
          res.data.roles_list.map(role=>{
            if (role.id == user.role) {
              setRole(role.title);
              _role = role.title;
            }
          })
          if (_role != "admin" && _role!= "super admin") {
            history.push("/")
          }
      })
    
    }).catch((err) =>{
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


  const handleChangeStartDateAndTime = (newValue) => {
    setStartDateAndTime(newValue);
  };

  const handleChangeEndDateAndTime = (newValue) => {
    setEndDateAndTime(newValue);
  };

  const getProducts = () => {
    axiosConfig.get(`/admin/product/all?limit=15&page=1&status=1&language_id=1&${searchFilter}=${nameFilter}&${categoryFilter}`)
    .then(res => {
      setProducts(res.data.products)


    })

  }

  useEffect(() => {

    getProducts();
    if (CheckAppliesGets == "Customer List Y") {

      setFilteredUser(users.filter(user => (user.first_name.concat(" ", user.last_name)).includes(nameFilter)))
    }
  }, [categoryFilter, nameFilter])
  


  const handleClickOpenDialog = (type) => {
    if (type == "buys" || type == "Applies") {
      setOpenDialog(true);

    } else {
      if (CheckAppliesGets == "Customer List Y") {

        getUsers();
        setOpenDialogY(true);
      } else
        setOpenDialogY(true);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setOpenDialogY(false);
    setSelectedAddProduct([])
    setCategoryId([])
    setSelectedAddProductGets([])
    setCategoryIdGets([])
    setSelectedUserIds([]);
    setSelectedUserGroupId([])
  };

  const AddDialog = () => {
    setOpenAdd(true);
    getUsers();
  };

  const getUsers = () => {
    axiosConfig.get('/admin/users').then(res => {
      setusers(res.data.users.filter(u => u.first_name != null && u.email != null))
      setFilteredUser(res.data.users.filter(u => u.first_name != null && u.email != null));
    })
  };

  const AddCloseDialog = () => {
    setOpenAdd(false);
    setSelectedUserIds([])
    setSelectedUserGroupId([])
  };

  const handleChange = (e, product) => {

    const index = selectedAddProduct.indexOf(parseInt(e.target.value))
    if (index === -1) {

      setSelectedAddProduct([...selectedAddProduct, parseInt(e.target.value)])
      setCategoryId([...categoryId, Object.values(product)[1]])
    } else {
      setSelectedAddProduct(selectedAddProduct.filter(s => s !== parseInt(e.target.value)))
      setCategoryId(categoryId.filter(s => s !== Object.values(product)[1]))
    }
  };

  const handleChangeY = (e, product) => {

    const index = selectedAddProductGets.indexOf(parseInt(e.target.value))

    if (index === -1) {

      setSelectedAddProductGets([...selectedAddProductGets, parseInt(e.target.value)])
      setCategoryIdGets([...categoryIdGets, Object.values(product)[1]])
    } else {
      setSelectedAddProductGets(selectedAddProductGets.filter(s => s !== parseInt(e.target.value)))
      setCategoryIdGets(categoryIdGets.filter(s => s !== Object.values(product)[1]))
    }
  };


  const selectProducts = (type) => {

    if (CheckApplies == "Specific products" && (type == "buys" || type == "Aplies")) {

      let addProducts = selectedAddProduct;
      addProducts = addProducts.map(String)
      
      let _products = [];
      setSelectedProductsIds(addProducts);
      products.map((p) => {
        selectedAddProduct.map((id) => {
          if (id === p.id) {
            _products.push(p);
          }
        });
      });
      setSelectedSpecificProducts(_products)
      setFilterValusProducts(_products);
    } else if (CheckApplies == "Specific collections" && (type == "buys" || type == "Aplies")) {

      let categories = categoryId.map(String);
      setSelectedCategoryId(categories);
      let _products = [];
      products.map((p) => {
        selectedAddProduct.map((id) => {
          if (id === p.id) {
            _products.push(p);
          }
        });
      });
      setSelectedCollectionsProducts(_products)
      setFilterValusProducts(_products);
    } else if (CheckAppliesGets == "Specific products" && type == "Gets") {
      let addProducts = selectedAddProductGets;
      addProducts = addProducts.map(String)
      
      let _products = [];
      setSelectedProductsIdsGets(addProducts)
      products.map((p) => {
        selectedAddProductGets.map((id) => {
          if (id === p.id) {
            _products.push(p);
          }
        });
      });
      setSelectedSpecificProductsGets(_products)
      setFilterValusGets(_products);
    } else if (CheckAppliesGets == "Specific collections" && type == "Gets") {
      let categories = categoryIdGets.map(String);
      setSelectedCategoryIdGets(categories);
      let _products = [];
      products.map((p) => {
        selectedAddProductGets.map((id) => {
          if (id === p.id) {
            _products.push(p);
          }
        });
      });
      setSelectedCollectionsProductsGets(_products)
      setFilterValusGets(_products);
    }

    handleCloseDialog();
  }

  const handleChangeUser = (e, user) => {

    const index = selectedUserIds.indexOf(parseInt(e.target.value))
    if (index === -1) {
      setSelectedUserIds([...selectedUserIds, parseInt(e.target.value)])
      setSelectedUserGroupId([...selectedUserGroupId, user.id.toString()])
    } else {
      setSelectedUserIds(selectedUserIds.filter(s => s !== parseInt(e.target.value)))
      setSelectedUserGroupId(selectedUserGroupId.filter(s => s !== user.toString()))
    }
  };


  const selectUser = (type) => {


    if (checkCustomer == "Specific customers" && type != "Gets") {
      let addUser = selectedUserIds;
      addUser = addUser.map(String)
      let _users = [];
      setUserIds(addUser);
      users.map((u) => {
        selectedUserIds.map((id) => {
          if (id === u.id) {
            _users.push(u);
          }
        });
      });
      setSelectedCustomersUsers(_users)
      setFilterValusEeligibility(_users)

    } else if (checkCustomer == "Specific Group" && type != "Gets") {

      let group_id = selectedUserGroupId.map(String);
      setUserGroupId(group_id);
      let _users = [];
      users.map((p) => {
        selectedUserIds.map((id) => {
          if (id === p.id) {
            _users.push(p);
          }
        });
      });
      setSelectedGroupUsers(_users)
      setFilterValusEeligibility(_users)
    } else if (CheckAppliesGets == "Customer List Y") {

      let addUser = selectedUserIds;
      addUser = addUser.map(String)
      let _users = [];
      setUserIdsGets(addUser);
      users.map((u) => {
        selectedUserIds.map((id) => {
          if (id === u.id) {
            _users.push(u);
          }
        });
      });
      setSelectedCustomersUsersGets(_users)
      setFilterValusGets(_users);
    }

    AddCloseDialog();
    handleCloseDialog();
  }

  const addDiscount = () => {
    let discountObj = {
      "name": ruleName,
      "description": description,
      "code": code,
      "type": checkType,
      "x_quantity": checkType === "Buy X Get Y" ? quantityBuys : '',
      "value": checkType !== "Buy X Get Y" ? discountValue : "",
      "customer_application_type": CheckApplies,
      "product_group_ids": CheckApplies == "Specific collections" ? selectedCategoryId : '',
      "product_ids": CheckApplies == "Specific products" ? selectedProductsIds : '',
      "y_quantity": checkType === "Buy X Get Y" ? quantityGets : '',
      "y_type": checkType === "Buy X Get Y" ? CheckAppliesGets : '',
      "y_product_group_ids": (checkType === "Buy X Get Y" && CheckAppliesGets == "Specific collections") ? selectedCategoryIdGets : [],
      "y_product_ids": (checkType === "Buy X Get Y" && CheckAppliesGets == "Specific products") ? selectedProductsIdsGets : '',
      "eligibility_type": checkCustomer,
      "min_requirement": requirements,
      "min_requirement_value": requirementValue,
      "discount_limit": valueUsageLimit != '' ? valueUsageLimit : '',
      "discount_usage_per_customer": _valueUsageLimit != '' ? _valueUsageLimit : '',
      "customer_group_id": checkCustomer == "Specific Group" ? userGroupId : '',
      "customers": checkCustomer == "Specific customers" ? userIds : '',
      "start_date": startDateAndTime,
      "end_date": endDateAndTime,
    }

    axiosConfig.post('/admin/discount/add', discountObj
      , {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then((res) => {
        
        history.push({pathname:"/admin/discounts"})


      })
      .catch((err) => {
        setShowMassage('Add discount has a problem!')
        setOpenMassage(true)
      })
      .catch(err =>{ 
        if(err.response.data.error.status === 401) {
          axiosConfig.post('/users/refresh_token', { 'refresh_token': localStorage.getItem('refreshToken') })
            .then(res => {
              setShowMassage('Add discount has a problem!')
              setOpenMassage(true)
              localStorage.setItem('token', res.data.accessToken);
              localStorage.setItem('refreshToken', res.data.refreshToken);
              addDiscount();
            })
        }else{
          setShowMassage('Add discount has a problem!')
          setOpenMassage(true)
        }
      })

  }

  const checkWichArray = (type) => {
    if ((CheckAppliesGets == "Specific collections" && (type == "Gets")) || ((CheckApplies == "Specific collections" && (type == "buys" || type == "Applies")))) {
      if (type == "Gets") {
        return selectedCollectionsProductsGets
      } else
        return selectedCollectionsProducts

    } else if ((CheckAppliesGets == "Specific products" && type == "Gets") || (CheckApplies == "Specific products" && (type == "buys" || type == "Applies"))) {

      if (type == "Gets" && CheckAppliesGets == "Specific products") {
        return selectedSpecificProductsGets
      } else {

        return selectedSpecificProducts
      }
    } else if ((checkCustomer == "Specific Group" && type == "eligibility") || (checkCustomer == "Specific customers" && type == "eligibility")) {
      if (checkCustomer == "Specific Group")
        return selectedGroupUsers
      else
        return selectedCustomersUsers
    } else {
      return selectedCustomersUsersGets
    }
  }
  
  const checkProducts = (product) => {

    if (CheckAppliesGets != "Customer List Y") {
      if ((product.name != null || product.name != undefined) || (product.products.length != 0 && product.products[0].sku != undefined))
        return true;
    } else if (CheckAppliesGets == "Customer List Y") {
      return true
    }
    return false;
  }

  const deleteProducts = (type, selectedRow) => {
    let result = false;
    if (type == "buys" || type == "Apllies") {
      if (CheckApplies == "Specific collections") {
        let collectionsProducts = selectedCollectionsProducts.filter(product => selectedRow.id != product.id);
        collectionsProducts.map(p => {
          if (p.category_id == selectedRow.category_id) {
            result = true
          }
          result = false;
        })
        setSelectedCollectionsProducts(collectionsProducts)
        setFilterValusProducts(collectionsProducts);
        if (result == false) {
          setSelectedCategoryId(selectedCategoryId.filter(cat => cat != selectedRow.category_id));
        }
      } else if (CheckApplies == "Specific products") {
        let specificProducts = selectedSpecificProducts.filter(product => selectedRow.id != product.id);
        setFilterValusProducts(specificProducts);
        setSelectedSpecificProducts(specificProducts);
        setSelectedProductsIds(selectedProductsIds.filter(id => id != selectedRow.id))

      }
    } else if (type == "Gets") {
      if (CheckAppliesGets == "Specific collections") {
        let products = filterVluesGets.filter(product => selectedRow.id != product.id);
        products.map(p => {
          if (p.category_id == selectedRow.category_id) {
            result = true
          }
          result = false;
        })
        setSelectedCollectionsProductsGets(products);
        setFilterValusGets(products);
        if (result == false) {
          setSelectedCategoryIdGets(selectedCategoryIdGets.filter(cat => cat != selectedRow.category_id));
        }
      } else if (CheckAppliesGets == "Specific products") {
        let products = filterVluesGets.filter(product => selectedRow.id != product.id);
        setFilterValusGets(products);
        setSelectedSpecificProductsGets(products)
        setSelectedProductsIdsGets(selectedProductsIdsGets.filter(id => id != selectedRow.id))

      } else if (CheckAppliesGets == "Customer List Y") {
        let products = filterVluesGets.filter(user => selectedRow.id != user.id);
        setFilterValusGets(products);
        setSelectedCustomersUsersGets(products)
        setUserIdsGets(userIdsGets.filter(id => id != selectedRow.id))
      }
    } else if (type == "eligibility") {
      if (checkCustomer == "Specific Group") {
        setSelectedGroupUsers([]);
        setUserGroupId([]);
        setFilterValusEeligibility([])

      } else if (checkCustomer == "Specific customers") {
        let users = filterVluesEligibility.filter(user => selectedRow.id != user.id);
        setSelectedCustomersUsers(users);
        setUserIds(userIds.filter(id => id != selectedRow.id));
        setFilterValusEeligibility(users)
      }
    }
  }

  const bread = [
    {
      title: "Discount",
      href: "/admin/discounts",
    },
  ];

  const openSortDate = (event)=>{
      setAnchorElSortDate(event.currentTarget)
  }

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenMassage(false);
  };
  return (
    <AdminLayout breadcrumb={bread} pageName="Add Discount Code">
      <Grid display={"flex"}>
        <Grid xs={9} pr={2}>
          <Paper sx={{ width: "100%", minHeight: "300px" }}>
            <Grid
              xs={12}
              borderBottom={1}
              borderColor='G3.main'
              display="flex"
            >
              <Grid xs={12} p={3} textAlign="start">
                <Typography variant="h3">Discount Code</Typography>
              </Grid>
            </Grid>
            <Grid container xs={12} md={12} p={3}>
              <Grid item xs={12} display='flex' justifyContent='space-between'>
                <Typography pb={2} variant="h1">Discount</Typography>
                <Button sx={{color:"P.main"}} onClick={()=>{
                    const randomNumber = parseInt((Math.random()*(10-(-1)))+(-1))
                    const randomNumber2 = parseInt((Math.random()*(10-(-1)))+(-1))
                    const randomNumber3 = parseInt((Math.random()*(10-(-1)))+(-1))
                    
                    const randomCharacter = englishAlphabet[parseInt((Math.random()*(25-(-1)))+(-1))]
                    const randomCharacter2 = englishAlphabet[parseInt((Math.random()*(25-(-1)))+(-1))]
                    const randomCharacter3 = englishAlphabet[parseInt((Math.random()*(25-(-1)))+(-1))]

                    setCode(randomCharacter+''+randomCharacter2+''+randomCharacter3+'-'+randomNumber+''+randomNumber2+''+randomNumber3)
                    }}
                >
                    Discount Code
                </Button>
              </Grid>
              <Grid xs={12} display='flex' >
                <Grid item xs={6} pr={1}>
                  <TextField
                    margin="normal"
                    name="Rule Name"
                    label="Rule Name"
                    type="text"
                    id="RuleName"
                    fullWidth
                    color='P'
                    value={ruleName}
                    onChange={(e) => {
                      setRuleName(e.target.value)
                    }}
                  />
                </Grid>
                <Grid item xs={6} >
                  <TextField
                    margin="normal"
                    name="Rule Name"
                    label="Code"
                    type="text"
                    id="Code"
                    fullWidth
                    color='P'
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value)
                    }}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="normal"
                  name="Description"
                  label="Description"
                  type="text"
                  id="Description"
                  fullWidth
                  color='P'
                  onChange={(e) => {
                    setDescription(e.target.value)
                  }}
                />
              </Grid>
            </Grid>
            <Divider />
            <Grid container xs={12} md={12} p={3}>
              <Grid>
                <FormControl>
                  <FormLabel id="demo-radio-buttons-group-label" >
                    <Typography pb={1} variant="h1" color='black'>Types</Typography>
                  </FormLabel>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    value={checkType}
                    name="radio-buttons-group"
                    onChange={(e, value) => {
                      setCheckType(value);
                      setFilterValusGets([])
                      setFilterValusProducts([])

                      setStatus(true)
                    }}
                  >
                    <FormControlLabel
                      value="Percentage"
                      control={<Radio color="P" />}
                      label="Percentage"
                    />
                    <FormControlLabel
                      value="Fixed amount"
                      control={<Radio color="P" />}
                      label="Fixed amount"
                    />
                    <FormControlLabel
                      value="Buy X Get Y"
                      control={<Radio color="P" />}
                      label="Buy X Get Y"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
            <Divider />
            {checkType === "Buy X Get Y" ?
              <Grid container xs={12} md={12} pt={3} pr={3} pl={3}>
                <Grid container xs={12} md={12}>
                  <Grid xs={12}>
                    <FormControl >
                      <FormLabel id="demo-radio-buttons-group-label">
                        <Typography pb={1} color='Black.main' variant="h1"> Customer buys</Typography>
                      </FormLabel>
                    </FormControl>
                    <Grid xs={12} display='flex' >
                      <Grid xs={6}>
                        <TextField
                          margin="normal"
                          name="Quantity"
                          label="Quantity"
                          type="text"
                          id="Quantity"
                          value={quantityBuys}
                          fullWidth
                          color='P'
                          onChange={(e) => {
                            (e.target.value != 0 && e.target.value > 0 && (/^[0-9]+$/.test(e.target.value))) ? setQuantityBuys(e.target.value) : setQuantityBuys("");
                            ((Number(e.target.value)) == String(e.target.value) && (/^[0-9]+$/.test(e.target.value))) ? (e.target.value > 0 ? setStatus(false) : setStatus(true)) : setStatus(true);

                          }}
                        />
                      </Grid>
                    </Grid>

                    <FormControl>

                      <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        name="radio-buttons-group"

                        value={CheckApplies}
                        onChange={(e, value) => {
                          setCheckApplies(value)
                          setSelectedProductsIds([]);
                          setSelectedCollectionsProducts([]);
                          setSelectedSpecificProducts([])
                          setSelectedCategoryId([]);
                          setFilterValusProducts([]);

                        }

                        }
                      >
                        <FormControlLabel
                          value="All Products"
                          control={<Radio color="P" />}
                          label="All Products"
                        />
                        <FormControlLabel
                          value="Specific collections"
                          control={<Radio color="P" />}
                          label="Specific collections"
                        />
                        <FormControlLabel
                          value="Specific products"
                          control={<Radio color="P" />}
                          label="Specific products"
                        />
                      </RadioGroup>
                    </FormControl>


                  </Grid>
                </Grid>

                <Grid container xs={12} md={12} mt={2} pb={1}>

                  {CheckApplies === '' || CheckApplies === 'All Products' ? '' :
                    <Grid xs={12}>
                      <Divider sx={{ width: "100%" }} />
                      <Grid xs={12} display='flex'>
                        <Grid
                          className="form-group has-search"
                          xs={8}
                        >
                          <Typography className="fa fa-search ">
                            <IconButton color="inherit"
                              className="form-control-feedback"
                              style={{ paddingTop: '29px' }}

                            >
                              <SearchIcon />
                            </IconButton>
                          </Typography>
                          <FormControl
                            color="P"
                            style={{ minWidth: 80 }}
                            variant="standard"
                            size="small"
                            hiddenLabel={true}
                          >
                          </FormControl>


                          <input
                            type="text"
                            className="form-control"
                            placeholder="Search"
                            style={{ backgroundColor: '#FFFFFF', width: '100%', margin: 0, border: '1px solid #DCDCDC' }}
                            onChange={(e) => { let temp = checkWichArray("buys").filter(p => (p.name).includes(e.target.value.toUpperCase())); setFilterValusProducts(temp); }}
                          />


                        </Grid>
                        <Grid xs={3} pt={2.5} textAlign='end'>
                          <Button onClick={() => handleClickOpenDialog("buys")} color='P' variant="text">{CheckApplies == "Specific collections" ? "Add Category" : "Add Product"}</Button>
                        </Grid>

                      </Grid>

                      {filterVluesProduct.map(product => {

                        return (



                          <Grid display='flex' xs={12} style={{ border: "1px solid rgb(0 0 0 / 20%)", borderRadius: "5px" }} justifyContent='space-between'>
                            <Grid display='flex' justifyContent='space-between'>
                              <Card sx={{ maxWidth: 82, border: 'none', boxShadow: 'none' }} >
                                <CardMedia
                                  component="img"
                                  height="82"
                                  image={product.file === null ? '' : axiosConfig.defaults.baseURL + product.file_urls[0]}
                                  className="image"
                                />
                              </Card>
                              <Grid >
                                <Grid mt={1.5}>
                                  <Typography
                                    ml={2}
                                    color="Black.main"
                                    variant="h11"
                                  >
                                    {product.name !== undefined && product.products.length != 0 ? (product.products[0].sku !== null ? product.name.concat(" - ", product.products[0].sku) : product.name) : product.name != undefined ? product.name : product.products.length !== 0 ? product.products[0].sku !== null ? product.products[0].sku : "" : ""}

                                  </Typography>
                                </Grid>

                              </Grid>
                            </Grid>

                            <Grid>
                              <Grid mt={1.5} >
                                <FormControl>
                                  <IconButton color="inherit"
                                    className="form-control-feedback"
                                    style={{ padding: "0" }}
                                    onClick={() => deleteProducts("buys", product)}
                                  >
                                    <ClearIcon
                                      ml={2}
                                      color="Black"
                                      variant="h11"

                                    />
                                  </IconButton>

                                </FormControl>
                              </Grid>

                            </Grid>

                          </Grid>



                        )
                      })
                      }
                      <Dialog
                        fullWidth
                        maxWidth="md"
                        xs={12}
                        open={openDialog}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                        onClose={handleCloseDialog}
                      >
                        <DialogTitle>
                          <Grid item md={12} spacing={2} className='box' sx={{border:"0px solid white"}} display='flex' justifyContent='space-between'>
                            <Grid item md={4} display='flex' alignItems='center' >
                              <Typography variant='menutitle'> {CheckApplies == "Specific collections" ? "Add Collection" : "Add Product"}</Typography>
                            </Grid>

                            <Grid display='flex'>
                              <Box display="flex" justifyContent="flex-end" alignItems='center'>
                                <Paper
                                  component="form"
                                  sx={{
                                    p: "2px 4px",
                                    mr: 2,
                                    borderRadius: 10,
                                    display: "flex",
                                    alignItems: "center",
                                    minWidth: "200px",
                                    height: '36px'
                                  }}
                                >
                                  <IconButton sx={{ p: "10px" }} aria-label="search" >
                                    <SearchIcon color="G1" />
                                  </IconButton>
                                  <InputBase
                                    sx={{ ml: 1, flex: 1 }}
                                    placeholder="Search in List"
                                    inputProps={{ "aria-label": "Search in List" }}
                                    onChange={(e) => { setNameFilter(e.target.value) }}
                                  />
                                </Paper>
                              </Box>

                              <IconButton  aria-label="search" 
                                    aria-controls={openSortMenu ? 'demo-positioned-date-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={openSortMenu ? 'true' : undefined}
                                    onClick={(event) => {openSortDate(event) }}
                                    sx={{height:40,mr:-1.5}}        
                                            
                                >
                                  <FilterListIcon color="G1" />
                              </IconButton>   
                                  
                              <Menu
                                  id="demo-positioned-date-menu"
                                  aria-labelledby="demo-positioned-date-menu"
                                  anchorEl={anchorElSortDate}
                                  open={openSortMenu}
                                  onClose={()=>setAnchorElSortDate(null)}
                                  
                                  anchorOrigin={{
                                      vertical: 'top',
                                      horizontal: 'right',
                                  }}
                                  transformOrigin={{
                                      vertical: 'top',
                                      horizontal: 'right',
                                  }}
                                  sx={{mt:3,ml:6}}
                              >

                                      
                                {JSON.parse(localStorage.getItem('categories')).map((category) => {
                                    return (
                                        <MenuItem onClick={()=>{setCategoryFilter(`category_id=${category.id}`);
                                            setAnchorElSortDate(null)
                                        }} >{category.name}</MenuItem>
                                    )
                                })}
                                  
                              
                              </Menu>
                            </Grid>    

                          </Grid>
                        </DialogTitle>
                        <Divider />
                        <DialogContent>
                          <Grid container p={2} pt={0} pl={0} xs={12}>
                            {products.map((product, index) => {
                              let totalStock = 0 
                              let variants = product.products
                              return (
                                <>
                                  {((product.name != null || product.name != undefined) || (product.products.length != 0 && product.products[0].sku != undefined)) &&
                                    <Grid container m={1} mt={0} ml={0}  mr={2}>
                                      <Grid item xs={12} md={12}>
                                        <FormControl>
                                          <FormGroup>
                                            <FormControlLabel
                                              control={
                                                <Checkbox
                                                  color='P'
                                                  checked={selectedAddProduct.indexOf(product.id) > -1}
                                                  onChange={(e) => handleChange(e, product)}
                                                  value={product.id}
                                                />
                                              }

                                              label={
                                                <Grid display='flex'>
                                                  <Grid>
                                                    <Card sx={{ maxWidth: 82, border: 'none', boxShadow: 'none' }}>
                                                      <CardMedia
                                                        component="img"
                                                        height="82"
                                                        image={product.file === null ? '' : axiosConfig.defaults.baseURL + product.file_urls[0]}
                                                        className="image"
                                                      />
                                                    </Card>
                                                  </Grid>
                                                  <Grid>
                                                    <Grid mt={1.5} sx={{display:"flex"}}>
                                                      <Typography
                                                        ml={2}
                                                        color="black"
                                                        variant="h11"
                                                      >
                                                        {product.name !== undefined && product.products.length != 0
                                                        ? product.name
                                                        : ""}
                                                      </Typography>
                                                      <Typography
                                                        color="G2.main"
                                                        ml={1}
                                                        textTransform='uppercase'
                                                        variant="italic"
                                                      >
                                                      {product.arabic_name !== undefined && product.products.length != 0
                                                          ? "(" + product.arabic_name + ")"
                                                          : ""}
                                                      </Typography>
                                                    </Grid>


                                                    <Grid ml={2} mt={1} display='flex' >
                                                      {product.products.length !== 0 &&
                                                        <>
                                                          
                                                          
                                                          {product.products[0].attributes === undefined ? '' :
                                                            product.products[0].attributes.find(b => b.name.toLowerCase() === "brand"
                                                              || b.name === "brand_contact_lens_color"
                                                              || b.name === 'brand_contact_lens_single_toric') !== undefined ? <>
                                                              <Typography variant='h10' pl={1} pr={1} sx={{ color: 'G1.main' }}>

                                                                {
                                                                  product.products[0].attributes.find(b => b.name.toLowerCase() === "brand"
                                                                    || b.name === "brand_contact_lens_color"
                                                                    || b.name === 'brand_contact_lens_single_toric').value 
                                                                }
                                                              </Typography >
                                                            </>
                                                          : ''}
                                                              

                                                        </>
                                                      }

                                                      < Divider orientation="vertical" flexItem />
                                                      <Typography variant='h10' pl={1} pr={1} sx={{ color: 'G1.main' }}>
                                                        {product.products.length === 0 ? "No Variants" : product.products.length === 1 ? product.products.length + " Variant" : product.products.length >= 2 ? product.products.length + " Variants" : "Failed to load variants"}
                                                      </Typography>
                                                      < Divider orientation="vertical" flexItem />
                                                      <Typography variant="h10" pl={1} pr={1} display="flex" color='G1.main'>
                                                                            
                                                        {variants.length === 0 ? (
                                                            "No variant(s) for this product!"
                                                        ) : (
                                                        variants.map((variant, index) => {
                                                            let variantStock = parseInt(variant.stock) 
                                                            totalStock = totalStock + variantStock
                                                        }))}
                                                        {totalStock <= 100 ? <Typography color='Orange1.main'> Total in stock: {totalStock} </Typography> : <Typography> Total in stock: {totalStock} </Typography>}
                                                      </Typography>

                                                    </Grid>
                                                    
                                                  </Grid>

                                                </Grid>
                                              }
                                            />
                                          </FormGroup>
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  }</>
                              );
                            })}
                          </Grid>
                        </DialogContent>
                        <DialogActions>
                          <Grid
                            item
                            xs={12}
                            pr={2}
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
                              sx={{
                                mt: 2,
                                mb: 2,
                                mr: 1,
                                ml: 1,
                                color: "white",
                              }}
                              onClick={() => selectProducts("buys")}
                            >
                              Save
                            </Button>
                          </Grid>
                        </DialogActions>    
                      </Dialog>

                      <Grid mb={3} mt={3}>
                        <Divider />
                      </Grid>
                      {checkType == "Buy X Get Y" &&
                        <Grid>
                          <FormControl disabled={(selectedProductsIds.length === 0 ? (selectedCategoryId.length === 0 ? true : false) : false)}>

                            <FormLabel id="demo-radio-buttons-group-label" >
                              <Typography pb={1} variant="h1" color='Black.main'>Conditions for X</Typography>
                            </FormLabel>
                            <RadioGroup
                              aria-labelledby="demo-radio-buttons-group-label"
                              value={checkConditionX}
                              name="radio-buttons-group"
                              onChange={(e, value) => {
                                setCheckConditionX(value)
                              }}

                            >
                              <FormControlLabel
                                value="X includes all the items."
                                control={<Radio color="P" />}
                                label="X includes all the items."
                              />
                              <FormControlLabel
                                value="X includes any of the items."
                                control={<Radio color="P" />}
                                label="X includes any of the items."
                              />
                            </RadioGroup>
                          </FormControl>
                        </Grid>
                      }

                    </Grid>
                  }
                </Grid>

                <Grid container xs={12} mb={3} ml={-3} display='flex'>
                  <Divider sx={{ height: "15px", width: "105%" }} />
                </Grid>

                <FormControl >
                  <FormLabel id="demo-radio-buttons-group-label">
                    <Typography pb={1} color='Black.main' variant="h1"> Customer gets</Typography>
                  </FormLabel>
                </FormControl>

                <Grid xs={12} display='flex' >
                  <Grid xs={6}>
                    <TextField
                      margin="normal"
                      name="Quantity"
                      label="Quantity"
                      type="number"
                      id="Quantity"
                      value={quantityGets}
                      disabled={status == false ? discountValuesStatus : status}
                      fullWidth
                      color='P'
                      onChange={(e) => {
                        ((e.target.value != 0 && e.target.value > 0) && (/^[0-9]+$/.test(e.target.value))) ? setQuantityGets(e.target.value) : setQuantityGets("");
                        ((Number(e.target.value)) == String(e.target.value) && (/^[0-9]+$/.test(e.target.value))) ? (e.target.value > 0 ? setQuantityGetsStatus(true) : setQuantityGetsStatus(false)) : setQuantityGetsStatus(false);

                      }}
                    />
                  </Grid>
                </Grid>
                <FormControl disabled={status == false ? discountValuesStatus : status}>

                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    name="radio-buttons-group"

                    value={CheckAppliesGets}
                    onChange={(e, value) => {
                      setCheckAppliesGets(value)
                      setSelectedProductsIdsGets([]);
                      setSelectedCollectionsProductsGets([]);
                      setSelectedSpecificProductsGets([])
                      setSelectedCategoryIdGets([]);
                      setFilterValusGets([]);
                    }

                    }
                  >

                    <FormControlLabel
                      value="Specific collections"
                      control={<Radio color="P" />}
                      label="Specific collections"
                    />
                    <FormControlLabel
                      value="Specific products"
                      control={<Radio color="P" />}
                      label="Specific products"
                    />
                    <FormControlLabel
                      value="Customer List Y"
                      control={<Radio color="P" />}
                      label="Customer List Y"
                      style={{ display: "none!immportant" }}
                      hidden={true}
                    />
                  </RadioGroup>
                </FormControl>

                <Grid container xs={12} md={12} mt={2} pb={1}>

                  {CheckAppliesGets === '' || CheckAppliesGets === 'All Products' ? '' :
                    <Grid xs={12}>
                      <Divider sx={{ width: "100%" }} />
                      <Grid xs={12} display='flex'>
                        <Grid
                          className="form-group has-search"
                          xs={8}
                        >
                          <Typography className="fa fa-search ">
                            <IconButton color="inherit"
                              className="form-control-feedback"
                              style={{ paddingTop: '29px' }}
                            >
                              <SearchIcon />
                            </IconButton>
                          </Typography>
                          <FormControl
                            color="P"
                            style={{ minWidth: 80 }}
                            variant="standard"
                            size="small"
                            hiddenLabel={true}
                          >
                          </FormControl>


                          <input
                            type="text"
                            className="form-control"
                            placeholder="Search"
                            style={{ backgroundColor: '#FFFFFF', width: '100%', margin: 0, border: '1px solid #DCDCDC' }}
                            onChange={(e) => { let temp = checkWichArray("Gets").filter(p => (CheckAppliesGets != "Customer List Y" ? p.name.toUpperCase() : p.first_name.concat(" ", p.last_name).toUpperCase()).includes(e.target.value.toUpperCase())); setFilterValusGets(temp); }}
                          />

                        </Grid>
                        <Grid xs={3} pt={2.5} textAlign='end'>
                          <Button onClick={() => handleClickOpenDialog("Gets")} color='P' variant="text">{CheckAppliesGets == "Specific collections" ? "Add Category" : (CheckAppliesGets == "Specific products" ? "Add Product" : "Add User")}</Button>
                        </Grid>

                      </Grid>

                      {filterVluesGets.map(slectedRow => {

                        return (



                          <Grid display='flex' xs={12} style={{ border: "1px solid rgb(0 0 0 / 20%)", borderRadius: "5px" }} justifyContent='space-between'>

                            <Grid display='flex' justifyContent='space-between'>
                              {(CheckAppliesGets == "Specific collections" || CheckAppliesGets == "Specific products") ?
                                <Card sx={{ maxWidth: 82, border: 'none', boxShadow: 'none' }} >
                                  <CardMedia
                                    component="img"
                                    height="82"
                                    image={slectedRow.file === null ? '' : axiosConfig.defaults.baseURL + slectedRow.file_urls[0]}
                                    className="image"
                                  />
                                </Card>
                                : ""}
                              <Grid >
                                <Grid mt={1.5}>
                                  <Typography
                                    ml={2}
                                    color="Black.main"
                                    variant="h11"
                                  >
                                    {(CheckAppliesGets == "Specific collections" || CheckAppliesGets == "Specific products") ? (slectedRow.name !== undefined && slectedRow.products.length != 0 ? (slectedRow.products[0].sku !== null ? slectedRow.name.concat(" - ", slectedRow.products[0].sku) : slectedRow.name) : slectedRow.name != undefined ? slectedRow.name : slectedRow.products.length !== 0 ? slectedRow.products[0].sku !== null ? slectedRow.products[0].sku : "" : "")
                                      :
                                      slectedRow.first_name.concat(" ", slectedRow.last_name)
                                    }

                                  </Typography>
                                </Grid>

                              </Grid>
                            </Grid>

                            <Grid>
                              <Grid mt={1.5} >
                                <FormControl>
                                  <IconButton color="inherit"
                                    className="form-control-feedback"
                                    style={{ padding: "0" }}
                                    onClick={() => deleteProducts("Gets", slectedRow)}
                                  >
                                    <ClearIcon
                                      ml={2}
                                      color="Black"
                                      variant="h11"

                                    />
                                  </IconButton>

                                </FormControl>
                              </Grid>

                            </Grid>

                          </Grid>



                        )
                      })
                      }

                      <Dialog
                        fullWidth
                        maxWidth="md"
                        xs={12}
                        open={openDialogY}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                        onClose={handleCloseDialog}
                      >
                        <DialogTitle>
                          <Grid item md={12} spacing={2} mr={0} className='box' sx={{border:"0px solid white"}} display="flex"  justifyContent='space-between'>
                            <Grid item md={4} display='flex' alignItems='center' >
                              <Typography variant='menutitle'> {CheckAppliesGets == "Specific collections" ? "Add Collection" : (CheckAppliesGets == "Specific products" ? "Add Product" : "Add User")}</Typography>
                            </Grid>

                            <Grid display="flex" mr={-7.4}>
                              <Box display="flex" justifyContent="flex-end" alignItems='center'>
                                <Paper
                                  component="form"
                                  sx={{
                                    p: "2px 4px",
                                    mr: 2,
                                    borderRadius: 10,
                                    display: "flex",
                                    alignItems: "center",
                                    minWidth: "200px",
                                    height: '36px'

                                  }}
                                >
                                  <IconButton sx={{ p: "10px" }} aria-label="search" >
                                    <SearchIcon color="G1" />
                                  </IconButton>
                                  <InputBase
                                    sx={{ ml: 1, flex: 1 }}
                                    placeholder="Search in List"
                                    inputProps={{ "aria-label": "Search in List" }}
                                    onChange={(e) => { setNameFilter(e.target.value) }}
                                  />
                                </Paper>
                              </Box>
                              {CheckAppliesGets != "Customer List Y" ?
                                <Grid item md={4} p={0} pr={0} >
                                  <IconButton  aria-label="search" 
                                      aria-controls={openSortMenu ? 'demo-positioned-date-menu' : undefined}
                                      aria-haspopup="true"
                                      aria-expanded={openSortMenu ? 'true' : undefined}
                                      onClick={(event) => {openSortDate(event) }}
                                      sx={{height:40}}        
                                              
                                  >
                                    <FilterListIcon color="G1" />
                                  </IconButton>   
                                    
                                  <Menu
                                      id="demo-positioned-date-menu"
                                      aria-labelledby="demo-positioned-date-menu"
                                      anchorEl={anchorElSortDate}
                                      open={openSortMenu}
                                      onClose={()=>setAnchorElSortDate(null)}
                                      
                                      anchorOrigin={{
                                          vertical: 'top',
                                          horizontal: 'right',
                                      }}
                                      transformOrigin={{
                                          vertical: 'top',
                                          horizontal: 'right',
                                      }}
                                      sx={{mt:3,ml:6}}
                                  >

                                          
                                    {JSON.parse(localStorage.getItem('categories')).map((category) => {
                                        return (
                                            <MenuItem onClick={()=>{setCategoryFilter(`category_id=${category.id}`);
                                                setAnchorElSortDate(null)
                                            }} >{category.name}</MenuItem>
                                        )
                                    })}
                                      
                                  
                                  </Menu>
                                </Grid>
                                : ""}

                            </Grid>
                          </Grid>
                          
                        </DialogTitle>
                        <Divider />
                        <DialogContent>
                          <Grid container p={2} pt={0} pl={0} xs={12} >

                            {(CheckAppliesGets != "Customer List Y" ? products : filteredUser).map((selectedRow, index) => {
                              let totalStock = 0 
                              let variants = selectedRow.products
                              return (
                                <>
                                  {checkProducts(selectedRow) &&
                                    <Grid container m={1} mt={0} mr={2}>
                                      <Grid item xs={12} md={12}>
                                        <FormControl>
                                          <FormGroup>
                                            <FormControlLabel
                                              control={
                                                <Checkbox
                                                  color='P'
                                                  checked={(CheckAppliesGets === "Customer List Y" ? selectedUserIds : selectedAddProductGets).indexOf(selectedRow.id) > -1}
                                                  onChange={(e) => (CheckAppliesGets != "Customer List Y" ? handleChangeY(e, selectedRow) : handleChangeUser(e, selectedRow))}
                                                  value={selectedRow.id}
                                                />
                                              }

                                              label={
                                                <Grid display='flex'>

                                                  {CheckAppliesGets != "Customer List Y" ?
                                                    <Grid>
                                                      <Card sx={{ maxWidth: 82, border: 'none', boxShadow: 'none' }}>
                                                        <CardMedia
                                                          component="img"
                                                          height="82"
                                                          image={selectedRow.file === null ? '' : axiosConfig.defaults.baseURL + selectedRow.file_urls[0]}
                                                          className="image"
                                                        />
                                                      </Card>
                                                    </Grid>
                                                    : ""}
                                                  <Grid>
                                                    <Grid mt={1.5} sx={{display:"flex"}}>
                                                      <Typography
                                                        ml={2}
                                                        color="black"
                                                        variant="h11"
                                                      >
                                                        {selectedRow.name !== undefined && selectedRow.products.length != 0
                                                        ? selectedRow.name
                                                        : ""}
                                                      </Typography>
                                                      <Typography
                                                        color="G2.main"
                                                        ml={1}
                                                        textTransform='uppercase'
                                                        variant="italic"
                                                      >
                                                      {selectedRow.arabic_name !== undefined && selectedRow.products.length != 0
                                                          ? "(" + selectedRow.arabic_name + ")"
                                                          : ""}
                                                      </Typography>
                                                    </Grid>

                                                    <Grid ml={2} mt={1} display='flex' >
                                                      {selectedRow.products.length !== 0 &&
                                                        <>
                                                          
                                                          {selectedRow.products[0].attributes === undefined ? '' :
                                                            selectedRow.products[0].attributes.find(b => b.name.toLowerCase() === "brand"
                                                              || b.name === "brand_contact_lens_color"
                                                              || b.name === 'brand_contact_lens_single_toric') !== undefined ? <>
                                                              <Typography variant='h10' pl={1} pr={1} sx={{ color: 'G1.main' }}>

                                                                {
                                                                  selectedRow.products[0].attributes.find(b => b.name.toLowerCase() === "brand"
                                                                    || b.name === "brand_contact_lens_color"
                                                                    || b.name === 'brand_contact_lens_single_toric').value 
                                                                }
                                                              </Typography >
                                                            </>
                                                          : ''}

                                                        </>
                                                      }

                                                      < Divider orientation="vertical" flexItem />
                                                      <Typography variant='h10' pl={1} pr={1} sx={{ color: 'G1.main' }}>
                                                        {selectedRow.products.length === 0 ? "No Variants" : selectedRow.products.length === 1 ? selectedRow.products.length + " Variant" : selectedRow.products.length >= 2 ? selectedRow.products.length + " Variants" : "Failed to load variants"}
                                                      </Typography>
                                                      < Divider orientation="vertical" flexItem />
                                                      <Typography variant="h10" pl={1} pr={1} display="flex" color='G1.main'>
                                                                            
                                                        {variants.length === 0 ? (
                                                            "No variant(s) for this product!"
                                                        ) : (
                                                        variants.map((variant, index) => {
                                                            let variantStock = parseInt(variant.stock) 
                                                            totalStock = totalStock + variantStock
                                                        }))}
                                                        {totalStock <= 100 ? <Typography color='Orange1.main'> Total in stock: {totalStock} </Typography> : <Typography> Total in stock: {totalStock} </Typography>}
                                                      </Typography>

                                                    </Grid>
                                                  </Grid>

                                                </Grid>
                                              }
                                            />
                                          </FormGroup>
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  }</>
                              );
                            })}
                          </Grid>
                        </DialogContent>
                        <DialogActions>
                          <Grid
                            item
                            xs={12}
                            pr={2}
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
                              sx={{
                                mt: 2,
                                mb: 2,
                                mr: 1,
                                ml: 1,
                                color: "white",
                              }}
                              onClick={(e) => { CheckAppliesGets != "Customer List Y" ? selectProducts("Gets") : selectUser("Gets") }}
                            >
                              Save
                            </Button>
                          </Grid>
                        </DialogActions>    
                      </Dialog>

                      <Grid mb={3} mt={3}>
                        <Divider />
                      </Grid>

                      <Grid>

                        <FormControl>
                          <FormGroup sx={{ display: "flex" }}>
                            <FormControlLabel disabled={(selectedProductsIdsGets.length === 0 ? (selectedCategoryIdGets.length === 0 ? true : false) : false)}
                              control={
                                <Checkbox
                                  color='P'
                                  checked={valueCheckBoxGets}
                                  onChange={(e) => { e.target.value == 0 ? setValueCheckBoxGets(1) : setValueCheckBoxGets(0) }}
                                  value={valueCheckBoxGets}
                                />
                              }

                              label={
                                <Grid display='flex'>
                                  <Grid>


                                    <Grid mt={1} display='flex' style={{ width: "120%" }}>
                                      <Typography variant='h10' sx={{ color: 'G1.main' }} style={{ width: "166%", paddingTop: "3%" }}>
                                        Y includes the item/items that have
                                      </Typography>
                                      <FormControl fullWidth color='P'>

                                        <Select
                                          value="the lowest"
                                          IconComponent={KeyboardArrowDownIcon}
                                          labelId="demo-simple-select-label"
                                          id="demo-simple-select"
                                        >
                                          <MenuItem value={'the lowest'}>the lowest</MenuItem>
                                        </Select>
                                      </FormControl>
                                      <Typography variant='h10' sx={{ color: 'G1.main'  }} ml={2} style={{ paddingTop: "3%" }}>
                                        price
                                      </Typography>

                                    </Grid>

                                  </Grid>

                                </Grid>
                              }
                            />
                          </FormGroup>

                          <FormGroup sx={{ display: "flex" }}>
                            <FormControlLabel disabled={(selectedProductsIdsGets.length === 0 ? (selectedCategoryIdGets.length === 0 ? true : false) : false)}
                              control={
                                <Checkbox
                                  color='P'
                                  checked={valueCheckBoxGets}
                                  onChange={(e) => { e.target.value == 0 ? setValueCheckBoxGets(1) : setValueCheckBoxGets(0) }}
                                  value={valueCheckBoxGets}
                                />
                              }

                              label={
                                <Grid display='flex'>
                                  <Grid>


                                    <Grid mt={1} display='flex' style={{ width: "120%" }}>
                                      <Typography variant='h10' sx={{ color: 'G1.main' }} style={{ width: "166%", paddingTop: "3%" }}>
                                        Y includes the item/items that have
                                      </Typography>
                                      <FormControl fullWidth color='P'>

                                        <Select
                                          value="the lowest"
                                          IconComponent={KeyboardArrowDownIcon}
                                          labelId="demo-simple-select-label"
                                          id="demo-simple-select"
                                          style={{}}
                                        >
                                          <MenuItem value={'the lowest'}>the lowest</MenuItem>
                                        </Select>
                                      </FormControl>
                                      <Typography variant='h10' sx={{ color: 'G1.main' }} ml={2} style={{ paddingTop: "3%" }}>
                                        price
                                      </Typography>

                                    </Grid>

                                  </Grid>

                                </Grid>
                              }
                            />
                          </FormGroup>
                        </FormControl>
                      </Grid>


                    </Grid>
                  }
                </Grid>

              </Grid>
              : ""}
            <Grid container xs={12} md={12} pt={3} pr={3} pl={3} style={{ display: checkType === "Buy X Get Y" ? "none" : "" }}>

              <Grid container xs={12} md={12} >
                <Grid item xs={12}>
                  <Typography pb={1} variant="h1">{checkType === "Buy X Get Y" ? "At a Discounted Value" : "Value"}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} mt={3}>
                  <TextField
                    label="Discount Value"
                    id="outlined-start-adornment"
                    fullWidth
                    value={discountValue}
                    color='P'
                    disabled={checkType == "Buy X Get Y" ? (status == false ? quantityGetsStatus : status) : !status}

                    onChange={(e) => {

                      ((e.target.value != 0 && e.target.value > 0) && (/^[0-9]+$/.test(e.target.value))) ? setDiscountValue(e.target.value) : setDiscountValue("");
                      ((Number(e.target.value)) == String(e.target.value) && (/^[0-9]+$/.test(e.target.value))) ? (e.target.value > 0 ? setDiscountValueStatus(true) : setDiscountValueStatus(false)) : setDiscountValueStatus(false);
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="start">{checkType === 'Percentage' ? '%' : 'KWD'}</InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
              {checkType !== "Buy X Get Y" ?
                <Grid container xs={12} md={12} ml={-3} display='flex'>
                  <Divider sx={{ height: "15px", width: "107%" }} />
                </Grid>
                : ""}
              {checkType !== "Buy X Get Y" ?
                <Grid container xs={12} md={12} mt={2} pb={1}>
                  <Grid>
                    <FormControl>
                      <FormLabel id="demo-radio-buttons-group-label">
                        <Typography pb={1} color='Black.main' variant="h1"> Applies to</Typography>
                      </FormLabel>

                      <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        name="radio-buttons-group"

                        value={CheckApplies}
                        onChange={(e, value) => {
                          setCheckApplies(value)
                          setFilterValusProducts([])
                        }
                        }
                      >
                        <FormControlLabel
                          value="Specific collections"
                          control={<Radio color="P" />}
                          label="Specific collections"
                        />
                        <FormControlLabel
                          value="Specific products"
                          control={<Radio color="P" />}
                          label="Specific products"
                        />
                      </RadioGroup>
                    </FormControl>

                  </Grid>

                  {CheckApplies === '' || CheckApplies === 'All Products' ? '' :
                    <Grid xs={12}>
                      <Divider sx={{ width: "100%" }} />
                      <Grid xs={12} display='flex'>
                        <Grid
                          className="form-group has-search"
                          xs={8}
                        >
                          <Typography className="fa fa-search ">
                            <IconButton color="inherit"
                              className="form-control-feedback"
                              style={{ paddingTop: '29px' }}
                            >
                              <SearchIcon />
                            </IconButton>
                          </Typography>
                          <FormControl
                            color="P"
                            style={{ minWidth: 80 }}
                            variant="standard"
                            size="small"
                            hiddenLabel={true}
                          >
                          </FormControl>


                          <input
                            type="text"
                            className="form-control"
                            placeholder="Search"
                            style={{ backgroundColor: '#FFFFFF', width: '100%', margin: 0, border: '1px solid #DCDCDC' }}
                            onChange={(e) => { let temp = checkWichArray("Applies").filter(p => (p.name.toUpperCase()).includes(e.target.value.toUpperCase())); setFilterValusProducts(temp); }}
                          />

                        </Grid>
                        <Grid xs={3} pt={2.5} textAlign='end'>
                          <Button onClick={() => handleClickOpenDialog("Applies")} color='P' variant="text">{CheckApplies == "Specific collections" ? "Add Category" : "Add Product"}</Button>
                        </Grid>

                      </Grid>

                      {filterVluesProduct.map(product => {

                        return (



                          <Grid display='flex' xs={12} style={{ border: "1px solid rgb(0 0 0 / 20%)", borderRadius: "5px" }} justifyContent='space-between'>
                            <Grid display='flex' justifyContent='space-between'>
                              <Card sx={{ maxWidth: 82, border: 'none', boxShadow: 'none' }} >
                                <CardMedia
                                  component="img"
                                  height="82"
                                  image={product.file === null ? '' : axiosConfig.defaults.baseURL + product.file_urls[0]}
                                  className="image"
                                />
                              </Card>
                              <Grid >
                                <Grid mt={1.5}>
                                  <Typography
                                    ml={2}
                                    color="Black.main"
                                    variant="h11"
                                  >
                                    {product.name !== undefined && product.products.length != 0 ? (product.products[0].sku !== null ? product.name.concat(" - ", product.products[0].sku) : product.name) : product.name != undefined ? product.name : product.products.length !== 0 ? product.products[0].sku !== null ? product.products[0].sku : "" : ""}

                                  </Typography>
                                </Grid>

                              </Grid>
                            </Grid>

                            <Grid>
                              <Grid mt={1.5} >
                                <FormControl>
                                  <IconButton color="inherit"
                                    className="form-control-feedback"
                                    style={{ padding: "0" }}
                                    onClick={() => deleteProducts("buys", product)}
                                  >
                                    <ClearIcon
                                      ml={2}
                                      color="Black"
                                      variant="h11"

                                    />
                                  </IconButton>

                                </FormControl>
                              </Grid>

                            </Grid>

                          </Grid>



                        )
                      })
                      }
                      <Dialog
                        fullWidth
                        maxWidth="md"
                        xs={12}
                        open={openDialog}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                        onClose={handleCloseDialog}
                      >
                        <DialogTitle>
                          <Grid item md={12} spacing={2} className='box' borderColor='white' sx={{border:"0px solid white"}} display="flex" justifyContent="space-between">
                            <Grid item md={4} display='flex' alignItems='center'   >
                              <Typography variant='menutitle'> {CheckApplies == "Specific collections" ? "Add Collection" : "Add Product"}</Typography>
                            </Grid>


                            <Grid item md={4} p={2} pr={0} display='flex'>
                              <Box display="flex" justifyContent="flex-end" alignItems='center'>
                                <Paper
                                  component="form"
                                  sx={{
                                    p: "2px 4px",
                                    mr: 2,
                                    borderRadius: 10,
                                    display: "flex",
                                    alignItems: "center",
                                    minWidth: "200px",
                                    height: '36px'
                                  }}
                                >
                                  <IconButton sx={{ p: "10px" }} aria-label="search" >
                                    <SearchIcon color="G1" />
                                  </IconButton>
                                  <InputBase
                                    sx={{ ml: 1, flex: 1 }}
                                    placeholder="Search in List"
                                    inputProps={{ "aria-label": "Search in List" }}
                                    onChange={(e) => { setNameFilter(e.target.value) }}
                                  />
                                </Paper>
                              </Box>
                              

                              <IconButton  aria-label="search" 
                                  aria-controls={openSortMenu ? 'demo-positioned-date-menu' : undefined}
                                  aria-haspopup="true"
                                  aria-expanded={openSortMenu ? 'true' : undefined}
                                  onClick={(event) => {openSortDate(event) }}
                                  sx={{height:40,mr:-1.5}}        
                                          
                              >
                                <FilterListIcon color="G1" />
                              </IconButton>   
                                
                              <Menu
                                  id="demo-positioned-date-menu"
                                  aria-labelledby="demo-positioned-date-menu"
                                  anchorEl={anchorElSortDate}
                                  open={openSortMenu}
                                  onClose={()=>setAnchorElSortDate(null)}
                                  
                                  anchorOrigin={{
                                      vertical: 'top',
                                      horizontal: 'right',
                                  }}
                                  transformOrigin={{
                                      vertical: 'top',
                                      horizontal: 'right',
                                  }}
                                  sx={{mt:3,ml:6}}
                              >

                                      
                                {JSON.parse(localStorage.getItem('categories')).map((category) => {
                                    return (
                                        <MenuItem onClick={()=>{setCategoryFilter(`category_id=${category.id}`);
                                            setAnchorElSortDate(null)
                                        }} >{category.name}</MenuItem>
                                    )
                                })}
                                  
                              
                              </Menu>   
                            </Grid>

                          </Grid>
                          
                        </DialogTitle>
                        <Divider />
                        <DialogContent>
                          <Grid container p={2} pt={0} xs={12}>
                            {products.map((product, index) => {
                              let totalStock = 0 
                              let variants = product.products
                              return (
                                <>
                                  {((product.name != null || product.name != undefined) || (product.products.length != 0 && product.products[0].sku != undefined)) &&
                                    <Grid container m={1} mr={2}>
                                      <Grid item xs={12} md={12}>
                                        <FormControl>
                                          <FormGroup>
                                            <FormControlLabel
                                              control={
                                                <Checkbox
                                                  color='P'
                                                  checked={selectedAddProduct.indexOf(product.id) > -1}
                                                  onChange={(e) => handleChange(e, product)}
                                                  value={product.id}
                                                />
                                              }

                                              label={
                                                <Grid display='flex'>
                                                  <Grid>
                                                    <Card sx={{ maxWidth: 82, border: 'none', boxShadow: 'none' }}>
                                                      <CardMedia
                                                        component="img"
                                                        height="82"
                                                        image={product.file === null ? '' : axiosConfig.defaults.baseURL + product.file_urls[0]}
                                                        className="image"
                                                      />
                                                    </Card>
                                                  </Grid>
                                                  <Grid>
                                                    <Grid mt={1.5} sx={{display:"flex"}}>
                                                      <Typography
                                                        ml={2}
                                                        color="black"
                                                        variant="h11"
                                                      >
                                                        
                                                        {product.name !== undefined && product.products.length != 0
                                                        ? product.name
                                                        : ""}
                                                      </Typography>
                                                      <Typography
                                                        color="G2.main"
                                                        ml={1}
                                                        textTransform='uppercase'
                                                        variant="italic"
                                                      >

                                                      {product.arabic_name !== undefined && product.products.length != 0
                                                          ? "(" + product.arabic_name + ")"
                                                          : ""}
                                                      </Typography>
                                                    </Grid>

                                                    <Grid ml={2} mt={1} display='flex' >
                                                      {product.products.length !== 0 &&
                                                        <>
                                                          {product.products[0].attributes === undefined ? '' :
                                                            product.products[0].attributes.find(b => b.name.toLowerCase() === "brand"
                                                              || b.name === "brand_contact_lens_color"
                                                              || b.name === 'brand_contact_lens_single_toric') !== undefined ? <>
                                                              <Typography variant='h10' pl={1} pr={1} sx={{ color: 'G1.main' }}>

                                                                {
                                                                  product.products[0].attributes.find(b => b.name.toLowerCase() === "brand"
                                                                    || b.name === "brand_contact_lens_color"
                                                                    || b.name === 'brand_contact_lens_single_toric').value 
                                                                }
                                                              </Typography >
                                                            </>
                                                          : ''}
                                                              

                                                        </>
                                                      }

                                                      < Divider orientation="vertical" flexItem />
                                                      <Typography variant='h10' pl={1} pr={1} sx={{ color: 'G1.main' }}>
                                                        {product.products.length === 0 ? "No Variants" : product.products.length === 1 ? product.products.length + " Variant" : product.products.length >= 2 ? product.products.length + " Variants" : "Failed to load variants"}
                                                      </Typography>
                                                      < Divider orientation="vertical" flexItem />
                                                      <Typography variant="h10" pl={1} pr={1} display="flex" color='G1.main'>
                                                                            
                                                        {variants.length === 0 ? (
                                                            "No variant(s) for this product!"
                                                        ) : (
                                                        variants.map((variant, index) => {
                                                            let variantStock = parseInt(variant.stock) 
                                                            totalStock = totalStock + variantStock
                                                        }))}
                                                        {totalStock <= 100 ? <Typography color='Orange1.main'> Total in stock: {totalStock} </Typography> : <Typography> Total in stock: {totalStock} </Typography>}
                                                      </Typography>

                                                    </Grid>
                                                    
                                                  </Grid>

                                                </Grid>
                                              }
                                            />
                                          </FormGroup>
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  }</>
                              );
                            })}
                          </Grid>
                        </DialogContent>
                        <DialogActions>
                          <Grid
                            item
                            xs={12}
                            pr={2}
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
                              sx={{
                                mt: 2,
                                mb: 2,
                                mr: 1,
                                ml: 1,
                                color: "white",
                              }}
                              onClick={() => selectProducts("Aplies")}
                            >
                              Save
                            </Button>
                          </Grid>
                        </DialogActions>
                      </Dialog>
                    </Grid>
                  }
                </Grid>
                : ""}
            </Grid>
            <Grid container xs={12} >
              <Divider sx={{ height: "15px", width: "100%" }} />
            </Grid>
            <Grid container m={3} mt={1} mr={2} >
              <Grid xs={12} md={12} mt={2} pb={1} display="flex" flexDirection="column">
                <Grid>
                  <FormControl>
                    <FormLabel id="demo-radio-buttons-group-label">
                      <Typography pb={1} color='black' variant="h1"> Minimum requirements</Typography>
                    </FormLabel>
                  </FormControl>
                </Grid>

                <Grid>
                  <FormControl>
                    <RadioGroup
                      aria-labelledby="demo-radio-buttons-group-label"
                      name="radio-buttons-group"

                      value={requirements}
                      onChange={(e, value) => {
                        setRequirements(value);
                        setRequirementValue('');
                      }

                      }
                    >
                      
                      <FormControlLabel
                        value="Minimum purchase amount "
                        control={<Radio color="P" />}
                        label="Minimum purchase amount "
                      />
                    </RadioGroup>
                  </FormControl>

                </Grid>
                {requirements === 'Minimum purchase amount ' &&
                  <Grid item xs={6} >
                    <TextField
                      label="Value"
                      id="outlined-start-adornment"
                      fullWidth
                      value={requirementValue}
                      color='P'

                      onChange={(e) => {

                        ((e.target.value != 0 && e.target.value > 0) && (/^[0-9]+$/.test(e.target.value))) ? setRequirementValue(e.target.value) : setRequirementValue("");
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="start">{'KWD'}</InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                }
                <Grid>
                  <FormControl>
                    <RadioGroup
                      aria-labelledby="demo-radio-buttons-group-label"
                      name="radio-buttons-group"

                      value={requirements}
                      onChange={(e, value) => {
                        setRequirements(value)
                        setRequirementValue('');
                      }

                      }
                    >

                      <FormControlLabel
                        value="Minimum quabtity of items"
                        control={<Radio color="P" />}
                        label="Minimum quabtity of items"
                      />
                    </RadioGroup>
                  </FormControl>

                </Grid>
                {requirements === 'Minimum quabtity of items' &&
                  <Grid item xs={6} >
                    <TextField
                      label="value"
                      id="outlined-start-adornment"
                      fullWidth
                      value={requirementValue}
                      color='P'

                      onChange={(e) => {

                        ((e.target.value != 0 && e.target.value > 0) && (/^[0-9]+$/.test(e.target.value))) ? setRequirementValue(e.target.value) : setRequirementValue("");
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="start">{'KWD'}</InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                }
              </Grid>
            </Grid>
            <Grid container xs={12} md={12}>
              <Grid container xs={12} md={12} mt={3}>
                <Divider sx={{ height: "1px", width: "100%" }} />
              </Grid>
              <Grid container xs={12} md={12} p={3} pb={1}>
                <Grid>
                  <FormControl>
                    <FormLabel id="demo-radio-buttons-group-label" color="G1">
                      <Typography pb={1} color='Black.main' variant="h1">Customer eligibility</Typography>
                    </FormLabel>
                    <RadioGroup
                      aria-labelledby="demo-radio-buttons-group-label"
                      name="radio-buttons-group"
                      value={checkCustomer}
                      onChange={(e, value) => {
                        setCheckCustomer(value);
                      }}
                    >
                      <FormControlLabel
                        value="Everyone"
                        control={<Radio color="P" />}
                        label="Everyone"
                      />
                      <FormControlLabel
                        value="Specific Group"
                        control={<Radio color="P" />}
                        label="Specific Group"
                      />
                      <FormControlLabel
                        value="Specific customers"
                        control={<Radio color="P" />}
                        label="Specific customers"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                {checkCustomer === 'Everyone' ? '' :

                  <Grid xs={12}>
                    <Divider sx={{ width: "100%" }} />
                    <Grid xs={12} display='flex'>
                      <Grid
                        className="form-group has-search"
                        xs={8}
                      >
                        <Typography className="fa fa-search ">
                          <IconButton color="inherit"
                            className="form-control-feedback"
                            style={{ paddingTop: '29px' }}
                          >
                            <SearchIcon />
                          </IconButton>
                        </Typography>
                        <FormControl
                          color="P"
                          style={{ minWidth: 80 }}
                          variant="standard"
                          size="small"
                          hiddenLabel={true}
                        >
                        </FormControl>


                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search"
                          style={{ backgroundColor: '#FFFFFF', width: '100%', margin: 0, border: '1px solid #DCDCDC' }}
                          onChange={(e) => { let temp = checkWichArray("eligibility").filter(u => (u.first_name.concat(" ", u.last_name).toUpperCase()).includes(e.target.value.toUpperCase())); setFilterValusEeligibility(temp); }}

                        />

                      </Grid>
                      <Grid xs={3} pt={2.5} textAlign='end'>
                        <Button onClick={AddDialog} color='P' variant="text">{checkCustomer === "Specific Group" ? "Add Group" : "Add Customer"}</Button>
                      </Grid>
                    </Grid>

                    {filterVluesEligibility.map(user => {
                      return (
                        <Grid display='flex' xs={12} style={{ border: "1px solid rgb(0 0 0 / 20%)", borderRadius: "5px" }} justifyContent='space-between'>
                          <Grid mt={1.5}>
                            <Typography
                              ml={2}
                              color="Black.main"
                              variant="h11"
                            >
                              {user.first_name.concat(" - ", user.last_name)}

                            </Typography>
                          </Grid>

                          <Grid mt={1.5} >
                            <FormControl>
                              <IconButton color="inherit"
                                className="form-control-feedback"
                                style={{ padding: "0" }}
                                onClick={() => deleteProducts("eligibility", user)}
                              >
                                <ClearIcon
                                  ml={2}
                                  color="Black.main"
                                  variant="h11"

                                />
                              </IconButton>
                            </FormControl>
                          </Grid>
                        </Grid>




                      )
                    })
                    }

                  </Grid>

                }
                <Dialog
                  fullWidth
                  maxWidth="md"
                  xs={12}
                  open={openAdd}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                  onClose={AddCloseDialog}
                >
                  <DialogTitle>
                    <Grid item md={12} spacing={2} className='box' sx={{border:"0px solid white"}}>
                      <Grid item md={4} display='flex' alignItems='center' >
                        <Typography variant='menutitle'> {checkCustomer === "Specific Group" ? "Add Group" : "Add Customer"}</Typography>
                      </Grid>

                    </Grid>
                  </DialogTitle>
                  <Divider />

                  <DialogContent>
                    <Grid container p={2} pt={0} pl={0} xs={12}>

                      {users.map((user) => {
                        return (


                          <Grid container m={1} mr={2} mt={0}>
                            <Grid item xs={12} md={12}>
                              <FormControl>
                                <FormGroup>
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        color='P'
                                        checked={selectedUserIds.indexOf(user.id) > -1}
                                        onChange={(e) => checkCustomer === 'Specific Group' ? (selectedUserIds.length >= 1 ? (selectedUserIds.indexOf(user.id) == 0 ? handleChangeUser(e, user) : "") : handleChangeUser(e, user)) : handleChangeUser(e, user)}
                                        value={user.id}
                                      />
                                    }

                                    label={
                                      <Grid display='flex'>

                                        <Grid>
                                          <Grid mt={1.5}>
                                            <Typography
                                              ml={2}
                                              color="Black.main"
                                              variant="h11"
                                            >
                                              {user.first_name.concat(" - ", user.last_name)}

                                            </Typography>
                                          </Grid>

                                          <Grid ml={1} mt={1} display='flex' >
                                            <Typography variant='h10' pl={1} pr={1} sx={{ color: 'G1.main' }}>
                                              {user.email}
                                            </Typography>
                                          </Grid>
                                        </Grid>

                                      </Grid>
                                    }
                                  />
                                </FormGroup>
                              </FormControl>
                            </Grid>
                          </Grid>

                        );
                      })}
                    </Grid>
                  </DialogContent>
                  <DialogActions>
                    <Grid
                      item
                      xs={12}
                      pr={2}
                      display="flex"
                      justifyContent="end"
                    >
                      <Button
                        variant="outlined"
                        color="G1"
                        onClick={AddCloseDialog}
                        sx={{ mt: 2, mb: 2, mr: 1, ml: 1 }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        color="P"
                        sx={{
                          mt: 2,
                          mb: 2,
                          mr: 1,
                          ml: 1,
                          color: "white",
                        }}
                        onClick={selectUser}
                      >
                        Save
                      </Button>
                    </Grid>
                  </DialogActions>      
                </Dialog>
              </Grid>
            </Grid>
            <Grid container xs={12} >
              <Divider sx={{ height: "15px", width: "100%" }} />
            </Grid>
            <Grid container m={3} mt={1} mr={2} >
              <Grid xs={12} md={12} mt={2} pb={1} display="flex" flexDirection="column">

                <FormControl>
                  <FormLabel id="demo-radio-buttons-group-label" >
                    <Typography pb={1} variant="h1" color='Black.main'>Usage limits</Typography>
                  </FormLabel>
                  <FormGroup sx={{ display: "flex" }}>

                    <FormControlLabel
                      control={
                        <Checkbox
                          color='P'
                          checked={usageLimit}
                          onChange={(e) => { (e.target.value == 0 ? setUsageLimit(1) : setUsageLimit(0)); setValueUsageLimit(''); setValueUsageLimit('') }}
                          value={usageLimit}
                        />
                      }

                      label={
                        <Grid display='flex'>
                          <Grid>


                            <Grid mt={-1} display='flex' style={{ width: "120%" }}>
                              <Typography variant='h10' sx={{ color: 'G1.main' }} style={{ width: "166%", paddingTop: "3%" }}>
                                Limit number of times this discount can be used in total
                              </Typography>

                            </Grid>

                          </Grid>

                        </Grid>
                      }
                    />
                  </FormGroup>
                  {usageLimit === 1 &&
                    <Grid item xs={6} >
                      <TextField
                        label="value"
                        id="outlined-start-adornment"
                        fullWidth
                        value={valueUsageLimit}
                        color='P'

                        onChange={(e) => {
                          ((e.target.value != 0 && e.target.value > 0) && (/^[0-9]+$/.test(e.target.value))) ? setValueUsageLimit(e.target.value) : setValueUsageLimit("");
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="start">{'KWD'}</InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  }
                  <FormGroup sx={{ display: "flex" }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          color='P'
                          checked={_usageLimit}
                          onChange={(e) => { (e.target.value == 0 ? _setUsageLimit(1) : _setUsageLimit(0)); _setValueUsageLimit('') }}
                          value={_usageLimit}
                        />
                      }

                      label={
                        <Grid display='flex'>
                          <Grid>


                            <Grid mt={-1} display='flex' style={{ width: "120%" }}>
                              <Typography variant='h10' sx={{ color: 'G1.main' }} style={{ width: "166%", paddingTop: "3%" }}>
                                Limit to one use per customer
                              </Typography>


                            </Grid>

                          </Grid>

                        </Grid>
                      }
                    />
                  </FormGroup>
                </FormControl>
                {_usageLimit === 1 &&
                  <Grid item xs={6} >
                    <TextField
                      label="value"
                      id="outlined-start-adornment"
                      fullWidth
                      value={_valueUsageLimit}
                      color='P'

                      onChange={(e) => {

                        ((e.target.value != 0 && e.target.value > 0) && (/^[0-9]+$/.test(e.target.value))) ? _setValueUsageLimit(e.target.value) : _setValueUsageLimit("");
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="start">{'KWD'}</InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                }

              </Grid>
            </Grid>




            <Grid container xs={12} md={12}>
              <Grid container xs={12} md={12}>
                <Divider sx={{ height: "1px", width: "100%" }} />
              </Grid>
              <Grid container xs={12} md={12} p={3}>
                <Grid item xs={12} md={12}>
                  <Typography pb={5} variant="h1">Active Dates</Typography>
                </Grid>
                <Grid
                  container
                  xs={12}
                  md={12}
                  spacing={1}
                  justifyContent="space-between"
                >
                  <LocalizationProvider dateAdapter={AdapterDateFns} >
                    <Stack direction="row" spacing={4}>
                      <DesktopDatePicker
                        label="Start Date"
                        inputFormat="MM/dd/yyyy"
                        value={startDateAndTime}
                        onChange={handleChangeStartDateAndTime}
                        renderInput={(params) => <TextField color='P'{...params} />}
                        color='P'
                      />
                      <TimePicker
                        label="Start Time"
                        value={startDateAndTime}
                        onChange={handleChangeStartDateAndTime}
                        renderInput={(params) => <TextField color='P'{...params} />}
                      />
                    </Stack>
                  </LocalizationProvider>
                  <Grid item xs={12} md={6} mt={2}>
                    <FormControlLabel
                      control={<Checkbox color="P" />}
                      label="Set end date"
                      value={checkDate}
                      onChange={(e) => {
                        setCheckDate(!checkDate)
                      }}
                    />
                  </Grid>
                </Grid>
                {checkDate ? <LocalizationProvider dateAdapter={AdapterDateFns} >
                  <Stack pt={1} direction="row" spacing={4}>
                    <DesktopDatePicker
                      label="End Date"
                      inputFormat="MM/dd/yyyy"
                      value={endDateAndTime}
                      onChange={handleChangeEndDateAndTime}
                      renderInput={(params) => <TextField color='P'{...params} />}
                      color='P'
                    />
                    <TimePicker
                      label="End Time"
                      value={startDateAndTime}
                      onChange={handleChangeEndDateAndTime}
                      renderInput={(params) => <TextField color='P'{...params} />}
                    />
                  </Stack>
                </LocalizationProvider> : ''}

              </Grid>
            </Grid>
          </Paper>
          <Grid
            xs={12}
            display="flex"
            justifyContent="flex-end"
            p={1}
            pr={2}
            pl={2}
            pt={4}
          >
            <Grid>
              <Button color="Black" variant="outlined"
                onClick={() => window.location.reload()}
              >
                Cancel
              </Button>
            </Grid>
            <Grid ml={1}>
              <Button
                color="P"
                variant="contained"
                ml={4}
                sx={{ color: "white" }}
                onClick={addDiscount}
              >
                Save
              </Button>
            </Grid>
          </Grid>
        </Grid>


        <Grid xs={3}>
          <Paper sx={{ width: "100%", minHeight: "300px", padding: "20px" }}>
            <Typography variant="h1" mb={2}>
              Summary
            </Typography>
            
            {!ruleName ?
              <Typography variant="p">No information entered yet.</Typography>
              :
              <Grid display='flex' pt={1} flexWrap='wrap'>
                <Grid xs={12} pb={2}>
                  <Typography variant='h2'>{ruleName}</Typography>
                </Grid>
                {discountValue !== '' ?
                  <>
                    <Grid xs={12} pb={1} display='flex'>
                      <Grid pr={1}>
                        <FiberManualRecordIcon style={{ width: '6px', height: '6px' }} />
                      </Grid>
                      <Typography variant='h2'>{discountValue} {checkType === 'Percentage' ? '%' : 'KWD'} off for {CheckApplies === 'All Products' ? 'all products' : CheckApplies === 'Specific collections' ? 'specific collections' : 'specific products'}</Typography>
                    </Grid>
                    <Grid xs={12} pb={1} display='flex'>
                      <Grid pr={1}>
                        <FiberManualRecordIcon style={{ width: '6px', height: '6px' }} />
                      </Grid>
                      <Typography variant='h2'>For {checkCustomer === 'Everyone' ? 'everyone' : checkCustomer === 'Specific Group' ? 'specific group' : 'specific customers'}</Typography>
                    </Grid>
                  </>
                  : ''
                }
              </Grid>

            }
            


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

export default DiscountCode;
