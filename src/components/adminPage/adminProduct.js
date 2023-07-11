import React, { useState, useEffect } from "react";
import AdminLayout from "../../layout/adminLayout";
import axiosConfig from "../../axiosConfig";
import Grid from "@mui/material/Grid";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import CardMedia from "@mui/material/CardMedia";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { useHistory } from "react-router-dom";
import {
  FormControl,
  Checkbox,
  FormControlLabel,
  FormGroup,
  CircularProgress,
  ListItemIcon,
  Select,
  ListItemText,
} from "@mui/material";
import SearchIcon from "@material-ui/icons/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ErrorIcon from "@mui/icons-material/Error";
import { TabContext } from "@material-ui/lab";
import No_Product_Image from "../../asset/images/No-Product-Image-v2.png";
import SellIcon from "@mui/icons-material/Sell";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import FilterListIcon from "@mui/icons-material/FilterList";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Pagination,
  Paper,
  Menu,
  Divider,
  MenuItem,
  Dialog,
  Button,
  Snackbar
} from "@mui/material";
import { Scrollbars } from "react-custom-scrollbars-2";
import Check from "@mui/icons-material/Check";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';




const AdminProduct = () => {
  const [products, setProducts] = useState([]);
  const [sort, setSort] = useState("date_sort=-1");
  const [currentPage, setCurrentPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const openEditAndDeleteMenu = Boolean(anchorEl);
  const [openDelete, setOpenDelete] = useState(false);
  const [openDeleteProduct, setOpenDeleteProduct] = useState(false);
  const [selectedRow, setSelectedRow] = useState("");
  let history = useHistory();
  const [categoryFilter, setCategoryFilter] = useState("category_id");
  const [nameFilter, setNameFilter] = useState("");
  const [countPage, setCountPage] = useState();
  const [status, setStatus] = useState(1);
  const [searchFilter, setSearchFilter] = useState("name");
  const [orderedFlag, setOrderedFlag] = useState(false);
  const [openRadio, setOpenRadio] = useState({ status: 1, open: false });
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [selectedProductRow, setSelectedProductRow] = useState([]);
  const [valueTab, setValueTab] = useState("1");
  const [checked, setChecked] = useState([]);
  const [trigger, setTrigger] = useState(false);
  const [tags, setTags] = useState([]);

  const [openAcordianDetail, setOpenAcordionDetail] = useState([]);
  const [anchorElAddProdut, setAnchorElAddProduct] = useState(null);
  const open = Boolean(anchorElAddProdut);
  const [addPage, setAddPage] = useState(0);
  const [openError, setOpenError] = useState({ open: false, message: "" });
  const [showDetail, setShowDetail] = useState("");
  const [showSideVariant, setShowSideVariant] = useState("");
  const [mainVariants, setMainVariants] = useState([]);
  const [sideVariants, setSideVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fixDiv, setFixDiv] = useState(false);
  const [anchorElFilter, setAnchorElFilter] = useState(null);
  const openFilter = Boolean(anchorElFilter);
  const [anchorElSort, setAnchorElSort] = useState(null);
  const openSort = Boolean(anchorElSort);
  const [sortFilterType, setSortFilterType] = useState("date");
  const [category, setCategory] = useState([]);
  const [categoryFilterName, setCategoryFilterName] = useState("all");
  const [categoryFilterTypes, setCategoryFilterTypes] = useState([]);
  const [anchorElFilterVariant, setAnchorElFilterVariant] = useState(null);
  const openFilterVariant = Boolean(anchorElFilterVariant);
  const [anchorElSortVariant, setAnchorElSortVariant] = useState(null);
  const openSortVariant = Boolean(anchorElSortVariant);
  const [sortFilterTypeVariant, setSortFilterTypeVariant] = useState("price");
  const [sortFilterVariant, setSortFilterVariant] = useState("low");
  const [searchValue, setSearchValue] = useState("");
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
        }else{
          setShowMassage("Get user info has a problem!")
          setOpenMassage(true) 
        }
      });
  };

  useEffect(() => {
    refreshList();
    tagList();
  }, [
    currentPage,
    categoryFilter,
    nameFilter,
    status,
    sort,
    trigger,
    categoryFilterTypes,
  ]);

  const selectAdd = (e) => {
    axiosConfig.get(`/admin/product/add/${e.target.value}`).then((res) => {
      let attributeList = res.data.data.attributes;
      if (res.data.data.attributes.length !== 0) {
        if (res.data.data.attributes.filter((a) => a.is_parent).length === 0) {
          setOpenError({
            open: true,
            message:
              "You cannot add products from this category because it doesn't have main variant",
          });
        } else {
          history.push({
            pathname: "/admin/product/add",
            state: {
              categoryId: e.target.value,
            },
          });
        }
      } else {
        setOpenError({
          open: true,
          message:
            "You cannot add products from this category because it doesn't have attributes",
        });
      }
      setAnchorEl(null);
    });
  };

  const productPermanentDelete = (selectedRow) => {
    axiosConfig
      .delete(`/admin/product/delete_product/${selectedRow.id}`)
      .then(() => {
        setOpenDeleteProduct(false);
        setTrigger((prev) => !prev);
      })
      .catch((err) => {
        
        setShowMassage("Delete product has a problem!")
        setOpenMassage(true) 
      });
  };

  const isLoading = () => {
    return (
      <Grid
        item
        xs={12}
        height="100%"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress color="P" />
      </Grid>
    );
  };

  const tagList = () => {
    axiosConfig
      .get("/admin/label/all")
      .then((res) => {
        setTags(res.data.labels);
      })
      .catch((error) => {
        setShowMassage("Tag list have a problem!")
        setOpenMassage(true)
      });
  };

  const getProductByPrice = (type) => {
    setLoading(false);
    let numberOfPrice = sort.toString().split("=");
    let nameValue;
    let skuValue;
    if (type == "name") {
      nameValue = nameFilter;
      skuValue = "";
    } else {
      nameValue = "";
      skuValue = nameFilter;
    }
    axiosConfig
      .get(
        `/admin/product/all?limit=10000&page=${currentPage}&language_id=1&sku=${skuValue}&name=${nameValue}&status=${status}&${categoryFilter}&price_sort=${parseInt(
          numberOfPrice[1]
        )}&date_sort=`
      )
      .then((res) => {
        if (categoryFilterName === "all") {
          if (sort === "stock_sort=1") {
            sortedProduct("low to high", res.data.products);
          } else if (sort === "stock_sort=-1") {
            sortedProduct("high to low", res.data.products);
          } else {
            setProducts(res.data.products);
            setAnchorElFilter(null);
          }
        } else {
          seterCategory(res.data.products);
          setAnchorElFilter(null);
        }
        setCountPage(res.data.count);
        setLoading(false);
      });
  };
  const getProductByData = (type) => {
    setLoading(true);
    let numberOfPrice = sort.toString().split("=");
    let nameValue;
    let skuValue;
    if (type == "name") {
      nameValue = nameFilter;
      skuValue = "";
    } else {
      nameValue = "";
      skuValue = nameFilter;
    }
    axiosConfig
      .get(
        `/admin/product/all?limit=10000&page=${currentPage}&language_id=1&sku=&name=&status=${status}&${categoryFilter}&price_sort=&date_sort=${parseInt(
          numberOfPrice[1]
        )}`
      )
      .then((res) => {
        let allProducts = res.data.products;
        if (nameFilter !== "") {
          if (type === "name") {
            allProducts = allProducts.filter((p) =>
              p.name.toLowerCase().includes(nameFilter.toLowerCase())
            );
          } else {
            allProducts = allProducts.filter((p) =>
              p.products.find((pr) =>
                pr.sku.toLowerCase().includes(nameFilter.toLowerCase())
              )
            );
          }
        }
        if (categoryFilterName === "all") {
          if (sort === "stock_sort=1") {
            sortedProduct("low to high", allProducts);
          } else if (sort === "stock_sort=-1") {
            sortedProduct("high to low", allProducts);
          } else {
            setProducts(allProducts);
            setAnchorElFilter(null);
          }
        } else {
          seterCategory(allProducts);
          setAnchorElFilter(null);
        }
        setCountPage(res.data.count);
        setLoading(false);
      });
  };

  const refreshList = () => {
    if (searchFilter == "name") {
      if (sort.toString().includes("price_sort")) {
        getProductByPrice("name");
      } else if (sort.toString().includes("date_sort")) {
        getProductByData("name");
      } else {
        getProductByPrice("name");
      }
    } else {
      if (sort.toString().includes("price_sort")) {
        getProductByPrice("sku");
      } else if (sort.toString().includes("date_sort")) {
        getProductByData("sku");
      } else getProductByData("sku");
    }
    axiosConfig.get("/admin/category/all").then((res) => {
      setCategory(res.data.categories);
    });
  };

  const handleChange = (event, value) => {
    setCurrentPage(value);
    window.scroll(0, 0);
  };

  const handleClickEditAndDeleteMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseEditAndDeleteMenu = () => {
    setAnchorEl(null);
  };

  const handleClickDelete = (status) => {
    setOpenRadio({ status: status, open: true });
    setAnchorEl(null);
  };

  const handleCloseDialogDelete = () => {
    setOpenDelete(false);
    setAnchorEl(null);
  };

  const handleClose = (event) => {
    setAddPage(event.target.value);
    setAnchorElAddProduct(null);
  };

  const deleteProduct = () => {
    let lastIndex;
    selectedProduct.map((product) => {
      lastIndex = product;
      axiosConfig
        .delete(`/admin/product/${product}`)
        .then(() => {
          if (selectedProduct[selectedProduct.length - 1] == lastIndex) {
            setOpenDelete(false);
            setAnchorEl(null);
            refreshList();
            setChecked([]);
            setSelectedProduct([]);
          }
        })
        .catch((err) => {
          setShowMassage("Delete product has a problem!")
          setOpenMassage(true)
        });
    });

    axiosConfig
      .delete(`/admin/product/${selectedRow.id}`)
      .then(() => {
        setOpenDelete(false);
        setAnchorEl(null);
        refreshList();
      })
      .catch((err) => {
        setShowMassage("Delete product has a problem!")
        setOpenMassage(true)
      });
  };

  const handleChangeSelectedProduct = (e, productRow) => {
    const index = selectedProduct.indexOf(parseInt(e.target.value));
    if (index === -1) {
      setSelectedProduct([...selectedProduct, parseInt(e.target.value)]);
      setSelectedProductRow([...selectedProductRow, productRow]);
      checked.push(-1);
    } else {
      setSelectedProduct(
        selectedProduct.filter((s) => s !== parseInt(e.target.value))
      );
      let x = selectedProductRow.filter((s) => s.id !== productRow.id);
      setSelectedProductRow(
        selectedProductRow.filter((s) => s.id !== parseInt(productRow.id))
      );
      checked.pop();
    }
  };

  const changeStatus = () => {
    const changeObj = {
      status: openRadio.status,
      product_group_ids: selectedProduct,
    };

    axiosConfig
      .post("/admin/product/change_status", changeObj)
      .then((res) => {
        setOpenRadio({ status: 1, open: false });
        setSelectedProduct([]);
        setSelectedRow([]);
        refreshList();
        setChecked([]);
      })
      .catch((err) => {
        
        setShowMassage("Change status has a problem!")
        setOpenMassage(true)
      });
  };

  

  const selectedProductNames = () => {
    let names = [];

    selectedProductRow.map((row) => {
      if (row.name !== undefined && row.products.length != 0) {
        if (row.products[0].sku !== null) {
          names.push(row.name.concat(" - ", row.products[0].sku));
        } else names.push(row.name);
      } else if (row.name != undefined) {
        names.push(row.name);
      } else if (row.products.length !== 0) {
        if (row.products[0].sku !== null) {
          names.push(row.products[0].sku);
        }
      }
    });
    return names;
  };

  

  const handleClickAddNewProduct = (event) => {
    setAnchorElAddProduct(event.currentTarget);
  };

  const countMainVariant = (index) => {
    const mainVariantsArray = [];
    products[index].products.map((p) => {
      if (mainVariantsArray.length !== 0) {
        if (mainVariantsArray.find((m) => m === p.main_attributes[0].value)) {
        } else {
          mainVariantsArray.push(p.main_attributes[0].value);
        }
      } else {
        mainVariantsArray.push(p.main_attributes[0].value);
      }
    });
    return mainVariantsArray.length;
  };

  const seterTotalPrice = (varArray) => {
    let totalPrice = 0;
    let total = 0;
    varArray.map((v) => {
      total = parseInt(v.stock) * parseFloat(v.price);
      totalPrice = totalPrice + total;
    });
    return numberWithCommas(totalPrice);
  };

  const seterTotalStockVariant = (varArray) => {
    let totalStock = 0;
    let total = 0;
    varArray.map((v) => {
      total = parseInt(v.stock);
      totalStock = parseInt(totalStock) + total;
    });
    return totalStock;
  };

  function numberWithCommas(n) {
    var parts = n.toString().split(".");
    return (
      parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
      (parts[1]
        ? "." +
        parts[1].charAt(0) +
        (parts[1].charAt(1) ? parts[1].charAt(1) : "0")
        : ".00") +
      " KWD"
    );
  }

  function seterCategory(productsArray) {
    const idArray = [];
    categoryFilterTypes.map((t) => idArray.push(t.id));
    const product = [];

    productsArray.map((p) => {
      for (let i = 0; i < idArray.length; i++) {
        if (p.category_id === idArray[i]) {
          product.push(p);
        }
      }
    });
    if (sort === "stock_sort=1") {
      sortedProduct("low to high", product);
    } else if (sort === "stock_sort=-1") {
      sortedProduct("high to low", product);
    } else {
      setProducts(product);
    }
    setAnchorElFilter(null);
  }

  function sortedProduct(type, productsArray) {
    const productTotalStock = [];
    productsArray.map((row, index) => {
      let totalStock = 0;
      row.products.map((variant) => {
        let variantStock = parseInt(variant.stock);
        totalStock = totalStock + variantStock;
        productTotalStock[index] = { product: row, totalStock: totalStock };
      });
    });

    const sortedArray = productTotalStock.sort((a, b) => {
      return b.totalStock - a.totalStock;
    });

    const productSorted = [];
    sortedArray.map((s) => productSorted.push(s.product));
    setProducts(
      type === "low to high" ? productSorted.reverse() : productSorted
    );
    setAnchorElFilter(null);
    setAnchorElSort(null);
  }

  const sortedVariant = () => {
    let sortedArray = [];
    if (sortFilterTypeVariant === "price") {
      sortedArray = sideVariants.sort((a, b) => {
        return b.price - a.price;
      });
    } else {
      sortedArray = sideVariants.sort((a, b) => {
        return b.stock - a.stock;
      });
    }
    if (sortFilterVariant === "high") {
      setSideVariants(sortedArray.reverse());
    } else {
      setSideVariants(sortedArray);
    }
    setAnchorElFilterVariant(null);
    setAnchorElSortVariant(null);
  };

  const _handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenMassage(false);
  };
  return (
    <AdminLayout>
      <Grid
        xs={12}
        sx={{
          bgcolor: 'GrayLight.main',
          position: "sticky",
          top: 64,
          width: "100%",
          zIndex: 100,
          paddingLeft: { xs: 0, sm: 1 },
          paddingRight: { xs: 0, sm: 1 },
          mt: "-16px",
          pt: "16px"
        }}
      >
        <Grid xs={12}>
          <Paper
            style={{
              boxShadow: "none",
              border: "1px solid #DCDCDC",
            }}
          >
            <Grid
              xs={12}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              height="55px"
              p={2}
              pr={window.innerWidth > 1199 ? 2 : 1}
            >
              <Typography variant="menutitle" color="Black.main">
                Product List
              </Typography>

              <Button
                variant="contained"
                color="P"
                className="addProductBtn"
                style={{ color: "white", height: "33px", boxShadow: "none" }}
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClickAddNewProduct}
              >
                Add New product
              </Button>
              <Menu
                id="basic-menu"
                anchorEl={anchorElAddProdut}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                {JSON.parse(localStorage.getItem("categories")).map(
                  (category) => {
                    return (
                      <MenuItem value={category.id} onClick={selectAdd}>
                        {category.name}
                      </MenuItem>
                    );
                  }
                )}
              </Menu>

            </Grid>
          </Paper>
        </Grid>
        <Grid
          item
          xs={12}
          md={12}
          mt={0}
          sx={{
            position: "sticky",
            top: 139,
            width: "100%",
            zIndex: 100,
            mt: "2px"
          }}
        >
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
              display: "flex",
              justifyContent: "end",
            }}
            display="flex"
            alignItems="center"
          >
            <Grid
              item
              display="flex"
              pl={2}
              alignItems="center"
              height="42px"
              justifyContent="start"
            >
              <Grid
                display="flex"
                alignItems="center"
                flexDirection="column"
                mr={1.5}
              >
                <Typography
                  variant="h28"
                  color="G1.main"
                  display="flex"
                  alignItems="center"
                  height="42px"
                >
                  {categoryFilterName === "all"
                    ? "All Product"
                    : categoryFilterName}
                </Typography>
                <Grid
                  xs={10}
                  borderBottom={2}
                  borderColor="P.main"
                  width="72px"
                  height="14px"
                ></Grid>
              </Grid>
              <Grid height="18px" sx={{ borderLeft: "1px dashed #9E9E9E" }}>
                {" "}
              </Grid>
              <TabContext value={valueTab}>
                <Grid xs={4}>
                  <FormControl
                    color="P"
                    variant="filled"
                    size="small"
                    hiddenLabel={true}
                  >
                    <Select
                      disableUnderline
                      IconComponent={KeyboardArrowDownIcon}
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                      defaultValue={1}
                      label
                      sx={{
                        overflow: "hidden",
                        height: "100%",
                        "&:hover": { background: "none" },
                        "&:active": { background: "none" },
                        "&:focus": { background: "none" },
                        width: "100%",
                        background: "none",
                        borderRadius: 0,
                        ".MuiSvgIcon-root": {
                          color: "G2.main",
                          padding: "3px",
                        },
                      }}
                      onChange={(e) => {
                        setStatus(e.target.value);
                        setValueTab(e.target.value);
                        setOpenRadio({ status: e.target.value, open: false });
                        setChecked([]);
                        setSelectedProduct([]);
                        setSelectedProductRow([]);
                      }}
                    >
                      <MenuItem value={1} color="P.main">
                        <Typography color="G2.main" variant="h29">
                          Shown Product
                        </Typography>
                      </MenuItem>
                      <MenuItem value={0} color="P.main">
                        <Typography color="G2.main" variant="h29">
                          Hidden Product
                        </Typography>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

              </TabContext>
            </Grid>
            {window.innerWidth > 610 && (
              <Grid xs={3}>
                {checked.length > 0 ? (
                  <>
                    {status == 1 && (
                      <Button
                        variant="contained"
                        color="P"
                        sx={{ color: "White.main" }}
                        onClick={() => setOpenDelete(true)}
                      >
                        Hide
                      </Button>
                    )}
                    {status != 1 && (
                      <Button
                        variant="contained"
                        color="P"
                        sx={{ mt: 2, mb: 2, mr: 1, ml: 1, color: "White.main" }}
                        onClick={() => {
                          handleClickDelete(status == 1 ? "0" : "1");
                        }}
                      >
                        {status == 1 ? "" : "Show"}
                      </Button>
                    )}
                  </>
                ) : (
                  ""
                )}
              </Grid>

            )}
            <Grid
              xs={6}
              sm={window.innerWidth > 640 ? 6 : 12}
              display="flex"
              alignItems="center"
              justifyContent="end"

              pr={window.innerWidth > 780 ? 0 : window.innerWidth > 730 ? "5px" : window.innerWidth > 680 ? "7px" : window.innerWidth > 640 ? "9px" : window.innerWidth > 610 ? "11px" : window.innerWidth > 510 ? "15px" : "22px"}
            >
              <Paper
                component="form"
                sx={{
                  backgroundColor: "GrayLight2.main",
                  p: "2px 4px",
                  borderRadius: 3,
                  display: "flex",
                  alignItems: "center",
                  maxWidth: window.innerWidth > 644 ? "300px" : "250px",
                  height: "33px",
                  justifyContent: "space-between",
                  boxShadow: "none",
                }}
              >
                <IconButton
                  sx={{ p: "10px" }}
                  aria-label="search"
                  onClick={() => setNameFilter(searchValue)}
                >
                  <SearchIcon color="G1.main" />
                </IconButton>
                <input
                  style={{
                    flex: 1,
                    border: "none",
                    background: "none",
                    width: "100%",
                    outline: "none",
                    "&:focus": {
                      outline: "none",
                    },
                  }}
                  onKeyDown={(e) => {
                    if (e.keyCode == 13) {
                      setNameFilter(e.target.value);
                    }
                  }}
                  placeholder="Search"
                  inputProps={{ "aria-label": "Search in List" }}
                  onChange={(e) => setSearchValue(e.target.value)}
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
                      "&:hover": { background: "none" },
                      "&:active": { background: "none" },
                      "&:focus": { background: "none" },
                      backgroundColor: "GrayLight2.main",
                      borderLeft: "1px dashed #9E9E9E",
                      overflow: "hidden",
                      height: "20px",
                      top: 0,
                      left: 1.6,
                      borderRadius: "0 0  10px 0",
                      width: "100px",
                      ".MuiSvgIcon-root": { color: "G2.main", padding: "3px" },
                    }}
                    onChange={(e) => setSearchFilter(e.target.value)}
                  >
                    <MenuItem value={"sku"}>
                      <Typography p={1} color="G2.main" variant="h15">
                        Item Code
                      </Typography>
                    </MenuItem>
                    <MenuItem value={"name"}>
                      <Typography p={1} color="G2.main" variant="h15">
                        Name
                      </Typography>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Paper>
            </Grid>
            <Grid
              xs={0.7}
              display="flex"
              justifyContent="center"
              alignItems="start"
              sx={{
                pr: {
                  xl: 0,
                  lg: window.innerWidth > 1414 ? 0 : window.innerWidth > 1372 ? "3px" : window.innerWidth > 1330 ? "5px" : window.innerWidth > 1298 ? "8px" : window.innerWidth > 1214 ? "11px" : "14px"
                  , md: window.innerWidth > 1118 ? "3px" : window.innerWidth > 970 ? "5px" : "7px",
                  sm: window.innerWidth > 780 ? "5px" : window.innerWidth > 730 ? "8px" : window.innerWidth > 680 ? "11px" : window.innerWidth > 640 ? "13px" : window.innerWidth > 610 ? "15px" : "19px"
                  , xs: window.innerWidth > 510 ? "20px" : "22px"
                }
              }}
            >
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
                sx={{ width: "247px" }}
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
                {category.map((cat) => {
                  return (
                    <MenuItem
                      onClick={() => {
                        setCategoryFilterTypes(cat.types);
                        setCategoryFilterName(cat.title);
                      }}
                      sx={{ padding: "5px 5px 5px 13px", color: "G1.main" }}
                    >
                      {categoryFilterName === cat.title ? (
                        <>
                          <ListItemIcon>
                            <Check color="P" sx={{ padding: "3px" }} />
                          </ListItemIcon>
                          <Typography ml={-1}>{cat.title}</Typography>
                        </>
                      ) : (
                        <ListItemText inset>
                          <Typography ml={-1}>{cat.title}</Typography>
                        </ListItemText>
                      )}
                    </MenuItem>
                  );
                })}
                <Divider
                  sx={{ width: "60%", margin: "auto", borderColor: "P.main" }}
                />
                <MenuItem
                  aria-controls={
                    openSort ? "demo-positioned-date-menu" : undefined
                  }
                  aria-haspopup="true"
                  aria-expanded={openSort ? "true" : undefined}
                  onClick={(event) => setAnchorElSort(event.currentTarget)}
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
                    setSortFilterType("stock");
                  }}
                  sx={{
                    padding: "7px 5px 5px 13px",
                    width: "235px",
                    color: "G1.main",
                  }}
                >
                  {sortFilterType === "stock" ? (
                    <>
                      <ListItemIcon>
                        <Check color="P" sx={{ padding: "3px" }} />
                      </ListItemIcon>
                      <Typography ml={-1}>Available in Stock</Typography>
                    </>
                  ) : (
                    <ListItemText inset>
                      <Typography ml={-1}>Available in Stock</Typography>
                    </ListItemText>
                  )}
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setSortFilterType("date");
                  }}
                  sx={{
                    padding: "5px 5px 5px 13px",
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

                <Divider
                  sx={{ width: "60%", margin: "auto", borderColor: "P.main" }}
                />
                <Typography color="G1.main" variant="h30" p={2}>
                  {" "}
                  Sort Order
                </Typography>

                <MenuItem
                  onClick={() => {
                    if (sortFilterType === "price") {
                      setSort("price_sort=1");
                    } else if (sortFilterType === "date") {
                      setSort("date_sort=1");
                    } else {
                      setSort("stock_sort=1");
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
                  {sort.toString().split("=")[1] === "1" ? (
                    <>
                      <ListItemIcon>
                        <Check color="P" sx={{ padding: "3px" }} />
                      </ListItemIcon>
                      <Typography ml={-1}>
                        {sortFilterType === "price"
                          ? "Low to high"
                          : sortFilterType === "date"
                            ? "Oldest first"
                            : "Low to high"}
                      </Typography>
                    </>
                  ) : (
                    <ListItemText inset>
                      <Typography ml={-1}>
                        {sortFilterType === "price"
                          ? "Low to high"
                          : sortFilterType === "date"
                            ? "Oldest first"
                            : "Low to high"}
                      </Typography>
                    </ListItemText>
                  )}
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    if (sortFilterType === "price") {
                      setSort("price_sort=-1");
                    } else if (sortFilterType === "date") {
                      setSort("date_sort=-1");
                    } else {
                      setSort("stock_sort=-1");
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
                  {sort.toString().split("=")[1] === "-1" ? (
                    <>
                      <ListItemIcon>
                        <Check color="P" sx={{ padding: "3px" }} />
                      </ListItemIcon>
                      <Typography ml={-1}>
                        {sortFilterType === "price"
                          ? "High to low"
                          : sortFilterType === "date"
                            ? "Newest first"
                            : "High to low"}
                      </Typography>
                    </>
                  ) : (
                    <ListItemText inset>
                      <Typography ml={-1}>
                        {sortFilterType === "price"
                          ? "High to low"
                          : sortFilterType === "date"
                            ? "Newest first"
                            : "High to low"}
                      </Typography>
                    </ListItemText>
                  )}
                </MenuItem>
              </Menu>
            </Grid>

          </Paper>
        </Grid>
      </Grid>
      <Grid container spacing={0} display="flex" justifyContent="space-between" sx={{
        paddingLeft: { xs: 0, sm: 1 },
        paddingRight: { xs: 0, sm: 1 },
      }}>
        <Grid
          item
          xs={12}
          display="flex"
          alignContent="flex-start"
          flexWrap="wrap"
          mt="7px"
          minHeight="425px"
        >
          {loading ? (
            isLoading()
          ) : products.length === 0 ? (
            <Grid
              xs={12}
              display="flex"
              alignItems="center"
              justifyContent="center"
              height="100%"
            >
              No products were found
            </Grid>
          ) : (
            products.map((productRow, index) => {
              let totalStock = 0;
              let isClick = "";
              return (
                <Grid
                  xs={12}
                  sx={
                    fixDiv
                      ? index === showDetail
                        ? {
                          position: "sticky",
                          width: "100%",
                          zIndex: 100,
                        }
                        : { display: "none" }
                      : ""
                  }
                >
                  <Paper
                    style={{
                      boxShadow: "none",
                      border: "1px solid #DCDCDC",
                      marginTop: "8px",
                      zIndex: index === showDetail ? 100 : 0,
                    }}
                    sx={
                      index === showDetail
                        ? ""
                        : {
                          "&:hover": {
                            backgroundColor: "rgba(203, 146, 155, 0.001)",
                          },
                        }
                    }
                  >
                    <Grid xs={12} display="flex" pt={2} pb={2}>
                      <Grid xs={0.6} display="flex" alignItems="start">
                        <Checkbox
                          color="P"
                          checked={selectedProduct.indexOf(productRow.id) > -1}
                          onChange={(e) =>
                            handleChangeSelectedProduct(e, productRow)
                          }
                          value={productRow.id}
                          sx={{
                            color: "GrayLight3.main",
                            padding: "16px 0 16px 16px",
                          }}
                        />
                      </Grid>
                      <Grid
                        xs={11.9}
                        display="flex"
                        flexWrap="wrap"
                        alignItems="center"
                        onClick={() => {
                          setShowSideVariant("");
                          const mainVariantsArray = [];
                          if (showDetail === index) {
                            setShowDetail("");
                            setFixDiv(false);
                          } else {
                            setShowDetail(index);
                            products[index].products.map((p) => {
                              if (mainVariantsArray.length !== 0) {
                                if (
                                  mainVariantsArray.find(
                                    (m) => m === p.main_attributes[0].value
                                  )
                                ) {
                                } else {
                                  mainVariantsArray.push(
                                    p.main_attributes[0].value
                                  );
                                }
                              } else {
                                mainVariantsArray.push(
                                  p.main_attributes[0].value
                                );
                              }
                            });
                            setMainVariants(mainVariantsArray);
                            setFixDiv(true);
                          }
                        }}
                      >
                        <Grid xs={10.2}>
                          <Grid xs={12}>
                            <Typography color="Black.main" variant="h26">
                              {productRow.name !== undefined &&
                                productRow.products.length != 0
                                ? productRow.name
                                : ""}
                            </Typography>
                            <Typography
                              color="G2.main"
                              mt={0.5}
                              textTransform="uppercase"
                              variant="h16"
                            >
                              {productRow.arabic_name !== undefined &&
                                productRow.products.length != 0
                                ? " (" + productRow.arabic_name + ") "
                                : ""}
                            </Typography>
                          </Grid>
                          {productRow.products[0] && (
                            <Grid xs={12} display="flex" flexWrap="wrap">
                              <Typography variant="h10" color="G1.main">
                                {
                                  productRow.products[0].general_attributes.find(
                                    (a) => a.title === "Brand"
                                  ).value
                                }{" "}
                              </Typography>
                              <Typography color="G3.main" pl={0.5} pr={0.5}>
                                {" "}
                                |{" "}
                              </Typography>
                              <Typography variant="h10" color="G1.main">
                                {countMainVariant(index) +
                                  " " +
                                  productRow.products[0].main_attributes[0]
                                    .title +
                                  (countMainVariant(index) > 1 ? "s" : "")}{" "}
                              </Typography>
                              <Typography color="G3.main" pl={0.5} pr={0.5}>
                                {" "}
                                |{" "}
                              </Typography>
                              <Typography variant="h10" color="G1.main">
                                {productRow.products.length === 0
                                  ? "No variant(s) for this product!"
                                  : productRow.products.map(
                                    (variant, index) => {
                                      let variantStock = parseInt(
                                        variant.stock
                                      );
                                      totalStock = totalStock + variantStock;
                                    }
                                  )}
                                {
                                  <Typography variant="h10">
                                    {" "}
                                    {totalStock} item{totalStock > 1 ? "s" : ""}{" "}
                                    in stock
                                  </Typography>
                                }
                              </Typography>
                              {productRow.tags.length === 0 ? (
                                ""
                              ) : (
                                <>
                                  <Typography color="G3.main" pl={0.5} pr={0.5}>
                                    {" "}
                                    |{" "}
                                  </Typography>
                                  <Typography variant="h10" color="G1.main">
                                    Tag: {productRow.tags.length}
                                  </Typography>
                                </>
                              )}
                              {!productRow.discount ? (
                                ""
                              ) : (
                                <>
                                  <Typography color="G3.main" pl={0.5} pr={0.5}>
                                    {" "}
                                    |{" "}
                                  </Typography>
                                  <Typography variant="h10" color="G1.main">
                                    Discount Code:{" "}
                                  </Typography>
                                </>
                              )}
                            </Grid>
                          )}
                        </Grid>
                        <Grid xs={1.6}>
                          <Card
                            sx={{
                              maxWidth: 84,
                              border: "none",
                              boxShadow: "none",
                              marginLeft: 2,
                            }}
                          >
                            <CardMedia
                              component="img"
                              height="82"
                              width="82"
                              image={
                                productRow.file_urls.length === 0
                                  ? No_Product_Image
                                  : axiosConfig.defaults.baseURL +
                                  productRow.file_urls[0]
                              }
                              className="image"
                            />
                          </Card>
                        </Grid>
                      </Grid>
                      <Grid xs={0.7} display="flex" justifyContent="center">
                        <IconButton
                          aria-label="delete"
                          aria-controls={
                            openEditAndDeleteMenu
                              ? "demo-positioned-menu"
                              : undefined
                          }
                          aria-haspopup="true"
                          aria-expanded={
                            openEditAndDeleteMenu ? "true" : undefined
                          }
                          onClick={(event) => {
                            handleClickEditAndDeleteMenu(event);
                            setSelectedRow(productRow);

                            isClick = "click";
                          }}
                        >
                          <MoreVertIcon
                            sx={{ color: "G2.main", marginRight: "10px" }}
                          />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Paper>
                  {index === showDetail ? (
                    <Paper
                      style={{
                        boxShadow: "none",
                        border: "1px solid #DCDCDC",
                        marginTop: "2px",
                      }}
                    >
                      <Scrollbars
                        style={{
                          width: "100%",
                          height: window.innerHeight / 2,
                        }}
                      >
                        <Grid xs={12}>
                          {mainVariants.map((mainVariant, indexVariant) => {
                            return (
                              <Grid
                                xs={12}
                                p={2}
                                pl={0}
                                pr={0}
                                display={
                                  showSideVariant === ""
                                    ? "flex"
                                    : mainVariant === showSideVariant
                                      ? "flex"
                                      : "none"
                                }
                                flexWrap="wrap"
                              >
                                <Grid
                                  xs={12}
                                  display="flex"
                                  justifyContent="end"
                                  mt={-4}
                                  height="35px"
                                >
                                  <Grid xs={11.3}></Grid>
                                  <Grid
                                    xs={0.7}
                                    display="flex"
                                    justifyContent="center"
                                  >
                                    {showSideVariant === "" ? (
                                      ""
                                    ) : mainVariant === showSideVariant ? (
                                      <IconButton
                                        aria-controls={
                                          openFilterVariant
                                            ? "demo-positioned-date-menu"
                                            : undefined
                                        }
                                        aria-haspopup="true"
                                        aria-expanded={
                                          openFilterVariant ? "true" : undefined
                                        }
                                        onClick={(event) => {
                                          setAnchorElFilterVariant(
                                            event.currentTarget
                                          );
                                        }}
                                        sx={{ top: 22 }}
                                      >
                                        <FilterListIcon
                                          sx={{ color: "GrayLight3.main" }}
                                        />
                                      </IconButton>
                                    ) : (
                                      ""
                                    )}
                                  </Grid>

                                  <Menu
                                    id="composition-button"
                                    anchorEl={anchorElFilterVariant}
                                    open={openFilterVariant}
                                    onClose={() =>
                                      setAnchorElFilterVariant(null)
                                    }
                                    MenuListProps={{
                                      "aria-labelledby": "basic-button",
                                    }}
                                    sx={{ width: "247px" }}
                                  >
                                    <MenuItem
                                      sx={{
                                        width: "227px",
                                        padding: "5px 5px 5px 13px",
                                        color: "G1.main",
                                      }}
                                    >
                                      <ListItemText inset>
                                        <Typography ml={-1}>All</Typography>
                                      </ListItemText>
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
                                        openSortVariant
                                          ? "demo-positioned-date-menu"
                                          : undefined
                                      }
                                      aria-haspopup="true"
                                      aria-expanded={
                                        openSortVariant ? "true" : undefined
                                      }
                                      onClick={(event) =>
                                        setAnchorElSortVariant(
                                          event.currentTarget
                                        )
                                      }
                                      sx={{
                                        padding: "5px 5px 5px 13px",
                                        color: "G1.main",
                                      }}
                                    >
                                      <ListItemIcon>
                                        <ArrowBackIosIcon
                                          color="P"
                                          sx={{ padding: "3px" }}
                                        />
                                      </ListItemIcon>
                                      Sort
                                    </MenuItem>
                                  </Menu>
                                  <Menu
                                    id="composition-button"
                                    anchorEl={anchorElSortVariant}
                                    open={openSortVariant}
                                    onClose={() => setAnchorElSortVariant(null)}
                                    MenuListProps={{
                                      "aria-labelledby": "basic-button",
                                    }}
                                    sx={{
                                      width: "235px",
                                      marginLeft: "-206px",
                                      boxShadow: "none",
                                    }}
                                  >
                                    <Typography
                                      color="G1.main"
                                      variant="h30"
                                      p={2}
                                    >
                                      {" "}
                                      Sort By
                                    </Typography>
                                    <MenuItem
                                      onClick={() => {
                                        setSortFilterTypeVariant("stock");
                                      }}
                                      sx={{
                                        padding: "7px 5px 5px 13px",
                                        width: "235px",
                                        color: "G1.main",
                                      }}
                                    >
                                      {sortFilterTypeVariant === "stock" ? (
                                        <>
                                          <ListItemIcon>
                                            <Check
                                              color="P"
                                              sx={{ padding: "3px" }}
                                            />
                                          </ListItemIcon>
                                          <Typography ml={-1}>
                                            Available in Stock
                                          </Typography>
                                        </>
                                      ) : (
                                        <ListItemText inset>
                                          <Typography ml={-1}>
                                            Available in Stock
                                          </Typography>
                                        </ListItemText>
                                      )}
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        setSortFilterTypeVariant("price");
                                      }}
                                      sx={{
                                        padding: "5px 5px 5px 13px",
                                        width: "235px",
                                        color: "G1.main",
                                      }}
                                    >
                                      {sortFilterTypeVariant === "price" ? (
                                        <>
                                          <ListItemIcon>
                                            <Check
                                              color="P"
                                              sx={{ padding: "3px" }}
                                            />
                                          </ListItemIcon>
                                          <Typography ml={-1}>Price</Typography>
                                        </>
                                      ) : (
                                        <ListItemText inset>
                                          <Typography ml={-1}>Price</Typography>
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
                                    <Typography
                                      color="G1.main"
                                      variant="h30"
                                      p={2}
                                    >
                                      {" "}
                                      Sort Order
                                    </Typography>

                                    <MenuItem
                                      onClick={() => {
                                        sortedVariant();
                                        setSortFilterVariant("low");
                                      }}
                                      sx={{
                                        padding: "7px 5px 5px 13px",
                                        width: "235px",
                                        color: "G1.main",
                                      }}
                                    >
                                      {sortFilterVariant === "low" ? (
                                        <>
                                          <ListItemIcon>
                                            <Check
                                              color="P"
                                              sx={{ padding: "3px" }}
                                            />
                                          </ListItemIcon>
                                          <Typography ml={-1}>
                                            Low to high
                                          </Typography>
                                        </>
                                      ) : (
                                        <ListItemText inset>
                                          <Typography ml={-1}>
                                            Low to high
                                          </Typography>
                                        </ListItemText>
                                      )}
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        setSortFilterVariant("high");
                                        sortedVariant();
                                      }}
                                      sx={{
                                        padding: "5px 5px 5px 13px",
                                        width: "235px",
                                        color: "G1.main",
                                      }}
                                    >
                                      {sortFilterVariant === "high" ? (
                                        <>
                                          <ListItemIcon>
                                            <Check
                                              color="P"
                                              sx={{ padding: "3px" }}
                                            />
                                          </ListItemIcon>
                                          <Typography ml={-1}>
                                            High to low
                                          </Typography>
                                        </>
                                      ) : (
                                        <ListItemText inset>
                                          <Typography ml={-1}>
                                            High to low
                                          </Typography>
                                        </ListItemText>
                                      )}
                                    </MenuItem>
                                  </Menu>
                                </Grid>
                                <Grid
                                  xs={3.3}
                                  position={
                                    showSideVariant === ""
                                      ? ""
                                      : mainVariant === showSideVariant
                                        ? "sticky"
                                        : ""
                                  }
                                  display="flex"
                                >
                                  <Grid
                                    xs={0.4}
                                    ml={1}
                                    mt={2}
                                    mb={2}
                                    sx={{
                                      borderLeftStyle: "solid",
                                      top: "15%",
                                      borderLeft: "2px solid black",
                                      borderColor: "P.main",
                                      height: 145,
                                      width: "100%",
                                    }}
                                  ></Grid>
                                  <Grid
                                    xs={11.6}
                                    display="flex"
                                    flexWrap="wrap"
                                    style={{
                                      height: "180px",
                                      width: "100%",
                                      border: "1px solid #CB929B",
                                      borderRadius: "8px",
                                      marginLeft: "-3px",
                                      top: "7%",
                                    }}
                                  >
                                    <Grid
                                      xs={12}
                                      sx={{
                                        marginTop: "-13px",
                                        paddingLeft: "12px",
                                      }}
                                    >
                                      <Typography
                                        variant="h10"
                                        color="G1.main"
                                        sx={{
                                          backgroundColor: "white",
                                          width: "100%",
                                          padding: "0 5px ",
                                        }}
                                      >
                                        {mainVariant}
                                      </Typography>
                                    </Grid>
                                    <Grid
                                      xs={10.5}
                                      display="flex"
                                      justifyContent="end"
                                    >
                                      <Grid
                                        display="flex"
                                        justifyContent="center"
                                        alignItems="center"
                                        sx={{
                                          border: "1px solid #DCDCDC",
                                          borderRadius: "8px",
                                          width: "135px",
                                          height: 85,
                                        }}
                                      >
                                        <Card
                                          sx={{
                                            width: 75,
                                            boxShadow: "none",
                                            border: "none",
                                            height: 75,
                                          }}
                                        >
                                          <CardMedia
                                            component="img"
                                            height="75"
                                            width="75"
                                            image={
                                              productRow.products.find(
                                                (p) =>
                                                  p.main_attributes[0].value ===
                                                  mainVariant
                                              )?.file_urls.length === 0
                                                ? No_Product_Image
                                                : axiosConfig.defaults.baseURL +
                                                productRow.products.find(
                                                  (p) =>
                                                    p.main_attributes[0]
                                                      .value === mainVariant
                                                ).file_urls[0].image_url
                                            }
                                          />
                                        </Card>
                                      </Grid>
                                    </Grid>
                                    <Grid xs={1.5} mt={-1.5}>
                                      <IconButton>
                                        <MoreVertIcon
                                          sx={{ color: "GrayLight3.main" }}
                                        />
                                      </IconButton>
                                    </Grid>
                                    <Grid
                                      xs={10.5}
                                      display="flex"
                                      flexDirection="column"
                                      justifyContent="end"
                                      p={1}
                                    >
                                      <Typography variant="h15" color="G1.main">
                                        {mainVariant} has{" "}
                                        {
                                          productRow.products.filter(
                                            (p) =>
                                              p.main_attributes[0].value ===
                                              mainVariant
                                          ).length
                                        }{" "}
                                        {productRow.products.filter(
                                          (p) =>
                                            p.main_attributes[0].value ===
                                            mainVariant
                                        ).length > 1
                                          ? "Variants"
                                          : "Variant"}
                                      </Typography>
                                      <Typography variant="h15" color="G1.main">
                                        Total Price:{" "}
                                        {seterTotalPrice(
                                          productRow.products.filter(
                                            (p) =>
                                              p.main_attributes[0].value ===
                                              mainVariant
                                          )
                                        )}
                                      </Typography>
                                      <Typography variant="h15" color="G1.main">
                                        Available in Stock:{" "}
                                        {seterTotalStockVariant(
                                          productRow.products.filter(
                                            (p) =>
                                              p.main_attributes[0].value ===
                                              mainVariant
                                          )
                                        )}
                                      </Typography>
                                    </Grid>
                                    <Grid
                                      xs={1.5}
                                      display="flex"
                                      alignItems="end"
                                    >
                                      <IconButton
                                        onClick={() => {
                                          if (showSideVariant === mainVariant) {
                                            setShowSideVariant("");
                                          } else {
                                            setShowSideVariant(mainVariant);
                                            setSideVariants(
                                              productRow.products.filter(
                                                (p) =>
                                                  p.main_attributes[0].value ===
                                                  mainVariant
                                              )
                                            );
                                          }
                                        }}
                                      >
                                        <ArrowForwardIosIcon
                                          sx={{ color: "P.main" }}
                                        />
                                      </IconButton>
                                    </Grid>
                                  </Grid>
                                </Grid>

                                {showSideVariant === "" ? (
                                  ""
                                ) : mainVariant === showSideVariant ? (
                                  <Grid
                                    xs={8.7}
                                    display="flex"
                                    flexWrap="wrap"
                                    pl={0.5}
                                    width="100%"
                                  >
                                    {sideVariants.map((variants) => {
                                      return (
                                        <Grid
                                          md={3.9}
                                          xs={12}
                                          m={0.2}
                                          mt={4.25}
                                          style={{
                                            border: "1px solid #DCDCDC",
                                            borderRadius: "8px",
                                            width: "100%",
                                            height: "148px",
                                          }}
                                        >
                                          <Grid
                                            xs={12}
                                            sx={{
                                              width: "100%",
                                              marginTop: "-15px",
                                              marginLeft: "10px",
                                            }}
                                          >
                                            <Typography
                                              sx={{
                                                width: "100%",
                                                backgroundColor: "white",
                                                padding: "2px",
                                              }}
                                              variant="h27"
                                              color="G1.main"
                                            >
                                              {variants.sku}
                                            </Typography>
                                          </Grid>
                                          <Grid
                                            xs={12}
                                            display="flex"
                                            justifyContent="end"
                                          >
                                            <IconButton
                                              sx={{ marginTop: "-8px" }}
                                            >
                                              <MoreVertIcon
                                                sx={{
                                                  color: "GrayLight3.main",
                                                }}
                                              />
                                            </IconButton>
                                          </Grid>
                                          <Grid
                                            xs={12}
                                            display="flex"
                                            flexDirection="column"
                                            justifyContent="end"
                                            p={1}
                                            pb={0}
                                            pt={0}
                                            minHeight="55%"
                                          >
                                            <Typography
                                              variant="h15"
                                              color="G1.main"
                                              pt={1}
                                            >
                                              Unit Price:{" "}
                                              {numberWithCommas(variants.price)}
                                            </Typography>
                                            {variants.discount ? (
                                              <Typography
                                                variant="h15"
                                                color="G1.main"
                                                pt={1}
                                              >
                                                Discount1:{" "}
                                              </Typography>
                                            ) : (
                                              ""
                                            )}
                                            {variants.tags.length > 0 ? (
                                              <Typography
                                                variant="h15"
                                                color="G1.main"
                                                pt={1}
                                              >
                                                {" "}
                                                Tag: {variants.tags.length}
                                              </Typography>
                                            ) : (
                                              ""
                                            )}
                                          </Grid>
                                          <Grid
                                            xs={12}
                                            display="flex"
                                            m={1}
                                            mt={-0.7}
                                            justifyContent="end"
                                          >
                                            <Typography
                                              variant="h15"
                                              color="G1.main"
                                              pt={1}
                                              alignItems="end"
                                            >
                                              Available in Stock:{" "}
                                              {variants.stock}
                                            </Typography>
                                          </Grid>
                                        </Grid>
                                      );
                                    })}
                                  </Grid>
                                ) : (
                                  ""
                                )}
                                {indexVariant === mainVariants.length - 1 ? (
                                  ""
                                ) : (
                                  <Grid
                                    xs={12}
                                    display={
                                      showSideVariant === ""
                                        ? ""
                                        : mainVariant === showSideVariant
                                          ? "none"
                                          : ""
                                    }
                                    sx={{
                                      borderBottom: "1px dashed #CB929B",
                                      margin: "30px 100px 0 100px",
                                    }}
                                  ></Grid>
                                )}
                              </Grid>
                            );
                          })}
                        </Grid>
                      </Scrollbars>
                    </Paper>
                  ) : showDetail === "" ? (
                    ""
                  ) : (
                    ""
                  )}
                </Grid>
              );
            })
          )}
        </Grid>

        {2 > 1 ? (
          ""
        ) : (
          <Grid
            item
            xs={12}
            display="flex"
            flexDirection="column"
            mt={1}
            minHeight="425px"
          >
            {products != undefined ? (
              products.length === 0 ? (
                <Grid
                  ml={1}
                  p={6}
                  display="flex"
                  alignItems="center"
                  item
                  md={12}
                  spacing={2}
                  className="box"
                  justifyContent="center"
                >
                  No products were found
                </Grid>
              ) : (
                products.map((productRow, index) => {
                  //get variant list
                  let variants = productRow.products;
                  let totalStock = 0;
                  //show product main details
                  let isClick = "";
                  return (
                    <>
                      {(productRow.name != null ||
                        productRow.name != undefined ||
                        (productRow.products.length != 0 &&
                          productRow.products[0].sku != undefined)) && (
                          <Paper
                            style={{
                              boxShadow: "none",
                              border: "1px solid #DCDCDC",
                              margin: "1px",
                            }}
                          >
                            <Grid display="flex">
                              <FormControl
                                sx={{
                                  pl: 2,
                                  mt:
                                    openAcordianDetail[index] != undefined
                                      ? openAcordianDetail[index]
                                        ? 2.5
                                        : 1.9
                                      : 1.9,
                                }}
                              >
                                <FormGroup>
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        color="P"
                                        checked={
                                          selectedProduct.indexOf(productRow.id) >
                                          -1
                                        }
                                        onChange={(e) =>
                                          handleChangeSelectedProduct(
                                            e,
                                            productRow
                                          )
                                        }
                                        value={productRow.id}
                                        sx={{ color: "GrayLight3.main" }}
                                      />
                                    }
                                    label={""}
                                  />
                                </FormGroup>
                              </FormControl>
                              <Grid xs={12} alignItems="center" ml={-3.3}>
                                <Accordion
                                  elevation={0}
                                  defaultExpanded={
                                    anchorEl != null ? false : false
                                  }
                                  expanded={
                                    openAcordianDetail[index] != undefined
                                      ? openAcordianDetail[index]
                                        ? true
                                        : false
                                      : false
                                  }
                                >
                                  <AccordionSummary
                                    expandIcon={
                                      <IconButton
                                        sx={{
                                          ml:
                                            openAcordianDetail[index] != undefined
                                              ? openAcordianDetail[index]
                                                ? -1
                                                : 0
                                              : 0,
                                          mr:
                                            openAcordianDetail[index] != undefined
                                              ? openAcordianDetail[index]
                                                ? 0
                                                : -1
                                              : -1,
                                          color: "Black.main",
                                        }}
                                        onClick={() => {
                                          let accordion = [...openAcordianDetail];
                                          if (accordion[index] != undefined) {
                                            accordion[index] = !accordion[index];
                                          } else accordion[index] = true;

                                          setOpenAcordionDetail(accordion);
                                        }}
                                      >
                                        <ExpandMoreIcon />
                                      </IconButton>
                                    }
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                    sx={{ minHeight: 110 }}
                                    onClick={() => {
                                      if (isClick == "") {
                                        let accordion = [...openAcordianDetail];
                                        if (accordion[index] != undefined) {
                                          accordion[index] = !accordion[index];
                                        } else accordion[index] = true;

                                        setOpenAcordionDetail(accordion);
                                      }
                                      isClick = "";
                                    }}
                                  >
                                    <Grid container mt={1} display={"flex"}>
                                      <Grid item xs={12} sx={{ display: "flex" }}>
                                        <Typography
                                          color="Black.main"
                                          variant="h11"
                                        >
                                          {productRow.name !== undefined &&
                                            productRow.products.length != 0
                                            ? productRow.name
                                            : ""}
                                        </Typography>
                                        <Typography
                                          color="G2.main"
                                          mt={0.5}
                                          textTransform="uppercase"
                                          variant="italic"
                                        >
                                          {productRow.arabic_name !== undefined &&
                                            productRow.products.length != 0
                                            ? "(" + productRow.arabic_name + ")"
                                            : ""}
                                        </Typography>
                                      </Grid>
                                      <Grid
                                        item
                                        xs={12}
                                        display="flex"
                                        alignItems={"center"}
                                      >
                                        {productRow.products[0] && (
                                          <>
                                            {productRow.products[0].attributes !=
                                              undefined && (
                                                <>

                                                  {productRow.products[0].attributes.find(
                                                    (b) =>
                                                      b.name === "Brand" ||
                                                      b.name === "brand" ||
                                                      b.name ===
                                                      "brand_contact_lens_color" ||
                                                      b.name ===
                                                      "brand_contact_lens_single_toric"
                                                  ) ? (
                                                    <>
                                                      <Typography
                                                        variant="h10"
                                                        pl={1}
                                                        pr={1}
                                                        color="G1.main"
                                                      >
                                                        {
                                                          productRow.products[0].attributes.find(
                                                            (b) =>
                                                              b.name === "Brand" ||
                                                              b.name === "brand" ||
                                                              b.name ===
                                                              "brand_contact_lens_color" ||
                                                              b.name ===
                                                              "brand_contact_lens_single_toric"
                                                          ).value
                                                        }
                                                      </Typography>
                                                    </>
                                                  ) : (
                                                    <Typography
                                                      variant="h10"
                                                      pl={1}
                                                      pr={1}
                                                      color="P.main"
                                                    >
                                                      No brand
                                                    </Typography>
                                                  )}
                                                </>
                                              )}
                                          </>
                                        )}
                                        <Divider
                                          orientation="vertical"
                                          variant="middle"
                                          sx={{ height: 0.5, marginTop: 1.5 }}
                                        />

                                        <Typography
                                          variant="h10"
                                          pl={1}
                                          pr={1}
                                          color="G1.main"
                                        >
                                          {productRow.products.length === 0
                                            ? "No Variants"
                                            : productRow.products.length === 1
                                              ? productRow.products.length +
                                              " Variant"
                                              : productRow.products.length >= 2
                                                ? productRow.products.length +
                                                " Variants"
                                                : "Failed to load variants"}
                                        </Typography>

                                        <Divider
                                          orientation="vertical"
                                          variant="middle"
                                          sx={{ height: 0.5, marginTop: 1.5 }}
                                        />
                                        <Typography
                                          variant="h10"
                                          pl={1}
                                          pr={1}
                                          display="flex"
                                          color="G1.main"
                                        >
                                          {variants.length === 0
                                            ? "No variant(s) for this product!"
                                            : variants.map((variant, index) => {
                                              let variantStock = parseInt(
                                                variant.stock
                                              );
                                              totalStock =
                                                totalStock + variantStock;
                                            })}
                                          {totalStock <= 100 ? (
                                            <Typography color="Orange1.main">
                                              {" "}
                                              Total in stock: {totalStock}{" "}
                                            </Typography>
                                          ) : (
                                            <Typography>
                                              {" "}
                                              Total in stock: {totalStock}{" "}
                                            </Typography>
                                          )}
                                        </Typography>
                                      </Grid>
                                      <Grid
                                        sx={{
                                          position: "absolute",
                                          top: 5,
                                          right: -25,
                                        }}
                                      >
                                        {openRadio.open ? (
                                          ""
                                        ) : (
                                          <Grid
                                            item
                                            xs={2}
                                            className="moreIcone"
                                            display="flex"
                                            alignItems="center"
                                          >
                                            <IconButton
                                              aria-label="delete"
                                              aria-controls={
                                                openEditAndDeleteMenu
                                                  ? "demo-positioned-menu"
                                                  : undefined
                                              }
                                              aria-haspopup="true"
                                              aria-expanded={
                                                openEditAndDeleteMenu
                                                  ? "true"
                                                  : undefined
                                              }
                                              onClick={(event) => {
                                                handleClickEditAndDeleteMenu(
                                                  event
                                                );
                                                setSelectedRow(productRow);

                                                isClick = "click";
                                              }}
                                            >
                                              <MoreVertIcon color="Black" />
                                            </IconButton>
                                          </Grid>
                                        )}
                                      </Grid>
                                    </Grid>
                                    <Grid
                                      xs={6}
                                      sx={{
                                        direction: "rtl",
                                        marginRight: 5,
                                        display: "flex",
                                      }}
                                    >
                                      {productRow.file_urls.map(
                                        (image, index) => {
                                          return (
                                            <Card
                                              sx={{
                                                maxWidth: 82,
                                                border: "none",
                                                boxShadow: "none",
                                                marginLeft: 2,
                                              }}
                                            >
                                              <CardMedia
                                                component="img"
                                                height="82"
                                                width="82"
                                                image={
                                                  image === null
                                                    ? No_Product_Image
                                                    : axiosConfig.defaults
                                                      .baseURL + image.image_url
                                                }
                                                className="image"
                                              />
                                            </Card>
                                          );
                                        }
                                      )}
                                    </Grid>
                                  </AccordionSummary>
                                  <AccordionDetails>
                                    <Grid ml={3}>
                                      <Typography color="P.main">
                                        {" "}
                                        Created at: {productRow.createdAt}{" "}
                                      </Typography>
                                    </Grid>
                                    <Grid
                                      xs={6}
                                      sx={{
                                        marginLeft: 2,
                                        marginTop: 2,
                                        display: "flex",
                                      }}
                                    >
                                      {productRow.tags
                                        ? productRow.tags.map((tag, index) => {
                                          let flagAttribute = "";
                                          let title = "";
                                          tags.map((tagsList, index) => {
                                            if (
                                              Object.values(tagsList).includes(
                                                tag.label_id
                                              )
                                            ) {
                                              flagAttribute = index;
                                            }
                                          });
                                          tags[flagAttribute]
                                            ? tags[flagAttribute].title !==
                                              null ||
                                              tags[flagAttribute].length !==
                                              0 ||
                                              tags[flagAttribute].title !==
                                              undefined ||
                                              tags[flagAttribute].title !== ""
                                              ? (title =
                                                tags[flagAttribute].title)
                                              : (title = "null")
                                            : (title = "null");
                                          return (
                                            <Grid
                                              sx={{
                                                display: "flex",
                                                alignItems: "center",
                                              }}
                                            >
                                              <SellIcon
                                                color="P"
                                                sx={{
                                                  marginRight: 1,
                                                  marginLeft: 1,
                                                }}
                                              />
                                              <Typography>{title}</Typography>
                                            </Grid>
                                          );
                                        })
                                        : ""}
                                    </Grid>
                                    <Grid pl={3} mt={2} xs={12}>
                                      {variants.map((variant, index) => {
                                        return (
                                          <Grid xs={12}>

                                            <Grid xs={12}>
                                              <Accordion
                                                elevation={0}
                                                defaultExpanded={false}
                                                sx={{ width: "100%" }}
                                              >
                                                <AccordionSummary>
                                                  <Grid
                                                    sx={{
                                                      display: "flex",
                                                      justifyContent:
                                                        "space-between",
                                                      width: "100%",
                                                    }}
                                                  >
                                                    <Typography color={"P.main"}>
                                                      Variant {index + 1}
                                                    </Typography>
                                                    {variant.tags
                                                      ? variant.tags.map(
                                                        (tag, index) => {
                                                          let flagAttribute =
                                                            "";
                                                          let title = "";
                                                          tags.map(
                                                            (
                                                              tagsList,
                                                              index
                                                            ) => {
                                                              if (
                                                                Object.values(
                                                                  tagsList
                                                                ).includes(
                                                                  tag.label_id
                                                                )
                                                              ) {
                                                                flagAttribute =
                                                                  index;
                                                              }
                                                            }
                                                          );
                                                          tags[flagAttribute]
                                                            ? tags[
                                                              flagAttribute
                                                            ].title !==
                                                              null ||
                                                              tags[
                                                                flagAttribute
                                                              ].length !== 0 ||
                                                              tags[
                                                                flagAttribute
                                                              ].title !==
                                                              undefined ||
                                                              tags[
                                                                flagAttribute
                                                              ].title !== ""
                                                              ? (title =
                                                                tags[
                                                                  flagAttribute
                                                                ].title)
                                                              : (title = "null")
                                                            : (title = "null");
                                                          return (
                                                            <Grid
                                                              sx={{
                                                                display: "flex",
                                                                alignItems:
                                                                  "center",
                                                              }}
                                                            >
                                                              <SellIcon color="P" />
                                                              <Typography
                                                                sx={{
                                                                  marginRight: 1,
                                                                  marginLeft: 1,
                                                                }}
                                                              >
                                                                {title}
                                                              </Typography>
                                                            </Grid>
                                                          );
                                                        }
                                                      )
                                                      : ""}
                                                  </Grid>
                                                </AccordionSummary>
                                                <AccordionDetails
                                                  sx={{
                                                    borderLeft: 1,
                                                    borderColor: "P.main",
                                                  }}
                                                >
                                                  <Grid xs={12}>
                                                    <Grid xs={12}>
                                                      <Typography color="Black.main">
                                                        Item Code:
                                                        {variant.sku !== null
                                                          ? " " + variant.sku
                                                          : "No Item Code for this variant!"}
                                                      </Typography>
                                                    </Grid>
                                                    <Grid
                                                      item
                                                      xs={4}
                                                      alignItems={"center"}
                                                    >
                                                      <Typography
                                                        sx={{ display: "flex" }}
                                                        color="Black.main"
                                                      >
                                                        <Typography mr={1}>
                                                          Unit Price:
                                                        </Typography>
                                                        {variant.price !== null
                                                          ? " " +
                                                          variant.price +
                                                          " KWD"
                                                          : "No price for this variant!"}
                                                      </Typography>
                                                    </Grid>
                                                    <Grid
                                                      item
                                                      xs={4}
                                                      alignItems={"center"}
                                                    >
                                                      <Typography
                                                        sx={{ display: "flex" }}
                                                        color="Black.main"
                                                      >
                                                        <Typography mr={1}>
                                                          In Stock:
                                                        </Typography>
                                                        {variant.stock !== null
                                                          ? " " + variant.stock
                                                          : "No stock for this variant!"}
                                                      </Typography>
                                                    </Grid>
                                                  </Grid>
                                                  {variant.file_urls == null ||
                                                    variant.file_urls == "" ? (
                                                    ""
                                                  ) : (
                                                    <Grid>
                                                      <Accordion
                                                        elevation={0}
                                                        defaultExpanded={false}
                                                      >
                                                        <AccordionSummary>
                                                          <InsertPhotoIcon
                                                            sx={{
                                                              color: "P.main",
                                                            }}
                                                          />
                                                          <Typography
                                                            color={"P.main"}
                                                          >
                                                            Pictures
                                                          </Typography>
                                                        </AccordionSummary>
                                                        <AccordionDetails>
                                                          <Grid
                                                            sx={{
                                                              display: "flex",
                                                            }}
                                                          >
                                                            {variant.file_urls.map(
                                                              (image, index) => {
                                                                return (
                                                                  <Card
                                                                    sx={{
                                                                      maxWidth: 82,
                                                                      border:
                                                                        "none",
                                                                      boxShadow:
                                                                        "none",
                                                                      marginRight: 2,
                                                                    }}
                                                                  >
                                                                    <CardMedia
                                                                      component="img"
                                                                      height="82"
                                                                      width="82"
                                                                      image={
                                                                        image ===
                                                                          null
                                                                          ? No_Product_Image
                                                                          : axiosConfig
                                                                            .defaults
                                                                            .baseURL +
                                                                          image.image_url

                                                                      }
                                                                      className="image"
                                                                    />
                                                                  </Card>
                                                                );
                                                              }
                                                            )}
                                                          </Grid>
                                                        </AccordionDetails>
                                                      </Accordion>
                                                    </Grid>
                                                  )}
                                                  {variant.description == null ||
                                                    variant.description == "" ? (
                                                    ""
                                                  ) : (
                                                    <Grid item display="flex">
                                                      <Accordion
                                                        elevation={0}
                                                        defaultExpanded={false}
                                                        sx={{
                                                          width: "100%",
                                                          border: 0,
                                                        }}
                                                      >
                                                        <AccordionSummary>
                                                          <DescriptionOutlinedIcon
                                                            sx={{
                                                              color: "P.main",
                                                            }}
                                                          />
                                                          <Typography
                                                            color={"P.main"}
                                                          >
                                                            Description
                                                          </Typography>
                                                        </AccordionSummary>
                                                        <AccordionDetails>
                                                          <Grid display="flex">
                                                            <Typography
                                                              ml={1}
                                                              color="Black.main"
                                                              variant="h10"
                                                            >
                                                              {variant.description !==
                                                                null ||
                                                                variant.description !==
                                                                "" ||
                                                                variant.description !==
                                                                undefined
                                                                ? " " +
                                                                variant.description
                                                                : "No description for this variant!"}
                                                            </Typography>
                                                          </Grid>
                                                        </AccordionDetails>
                                                      </Accordion>
                                                    </Grid>
                                                  )}
                                                </AccordionDetails>
                                              </Accordion>
                                            </Grid>
                                          </Grid>
                                        );
                                      })}
                                    </Grid>
                                  </AccordionDetails>
                                </Accordion>
                              </Grid>
                            </Grid>

                          </Paper>
                        )}
                    </>
                  );
                })
              )
            ) : (
              <Grid
                ml={1}
                p={6}
                display="flex"
                alignItems="center"
                item
                md={12}
                spacing={2}
                className="box"
                justifyContent="center"
              >
                No products were found
              </Grid>
            )}
          </Grid>
        )}
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
          <MenuItem
            onClick={() => {
              history.push({
                pathname: "/admin/product/editProduct",
                state: { detail: selectedRow.id },
              });
            }}
          >
            Edit
          </MenuItem>
          <MenuItem onClick={() => setOpenDeleteProduct(true)}>Delete</MenuItem>
        </Menu>

        <Grid mr={3} xs={12} display="flex" justifyContent="space-between">
          {products != undefined ? (
            products.length > 10000 ? (
              <Pagination
                count={Math.ceil(countPage / 10000)}
                color="P"
                page={currentPage}
                onChange={handleChange}
              />
            ) : (
              ""
            )
          ) : (
            ""
          )}
          {openRadio.open ? (
            <Dialog open={openRadio.open}>
              <Grid
                xs={12}
                display="flex"
                justifyContent="center"
                mt={3}
                mb={1}
                ml={3}
                mr={6}
              >
                {orderedFlag ? <ErrorIcon color="error" /> : ""}
                <Typography>
                  {orderedFlag
                    ? `${selectedProduct} cannot be deleted because an order has been placed from it`
                    : `Are you sure you want ${status == 1 ? "Hidden" : "show"
                    } ${selectedProductNames()}`}
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
                {orderedFlag ? (
                  ""
                ) : (
                  <Button
                    variant="contained"
                    color="P"
                    sx={{ mt: 2, mb: 2, mr: 1, ml: 1, color: "white" }}
                    onClick={changeStatus}
                  >
                    Done
                  </Button>
                )}
                <Button
                  variant="outlined"
                  color="G1"
                  onClick={() => {
                    setOpenRadio({ status: 1, open: false });
                  }}
                  sx={{ mt: 2, mb: 2, mr: 1, ml: 1, borderColor: "P.main" }}
                >
                  {orderedFlag ? "Close" : "Cancel"}
                </Button>
              </Grid>
            </Dialog>
          ) : (
            ""
          )}
        </Grid>
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
          {orderedFlag ? <ErrorIcon color="error" /> : ""}
          <Typography>
            {orderedFlag
              ? `${selectedProduct} cannot be deleted because an order has been placed from it`
              : `Are you sure you want to hide ${selectedProductNames()}`}
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
          {orderedFlag ? (
            ""
          ) : (
            <Button
              variant="contained"
              color="P"
              sx={{ mt: 2, mb: 2, mr: 1, ml: 1, color: "white" }}
              onClick={deleteProduct}
            >
              Delete
            </Button>
          )}
          <Button
            variant="outlined"
            color="G1"
            onClick={handleCloseDialogDelete}
            sx={{ mt: 2, mb: 2, mr: 1, ml: 1, borderColor: "P.main" }}
          >
            {orderedFlag ? "Close" : "Cancel"}
          </Button>
        </Grid>
      </Dialog>
      <Dialog
        open={openDeleteProduct}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Grid xs={12} justifyContent="center" mt={3} mb={1} ml={3} mr={6}>
          <Typography>
            <Typography variant="h1">Warning!</Typography> Are you sure you want
            to delete {selectedRow.name}?
          </Typography>
          <Typography>
            This will completly delete the product from database!
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
            onClick={() => {
              productPermanentDelete(selectedRow);
            }}
          >
            Delete
          </Button>
          <Button
            variant="outlined"
            color="G1"
            onClick={() => {
              setOpenDeleteProduct(false);
              setSelectedRow([]);
              setAnchorEl(null);
            }}
            sx={{ mt: 2, mb: 2, mr: 1, ml: 1, borderColor: "P.main" }}
          >
            Cancel
          </Button>
        </Grid>
      </Dialog>

      <Dialog
        open={openError.open}
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
          <ErrorIcon color="error" />
          <Typography pl={1}>{openError.message}</Typography>
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
              setOpenError({ open: false, message: "" });
              setAnchorEl(null);
            }}
            sx={{ mt: 2, mb: 2, mr: 1, ml: 1 }}
          >
            Close
          </Button>
        </Grid>
      </Dialog>
      
                                                                    
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

export default AdminProduct;