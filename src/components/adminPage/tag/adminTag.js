import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axiosConfig from "../../../axiosConfig";
import AdminLayout from "../../../layout/adminLayout";
import "../../../asset/css/adminPage/addColor.css";
import AddTag from "./adminAddTag";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import CardMedia from "@mui/material/CardMedia";
import Card from "@mui/material/Card";
import {
  Accordion,
  AccordionSummary,
  Checkbox,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  ListItemIcon,
  ListItemText,
  Snackbar
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import No_Product_Image from "../../../asset/images/No-Product-Image-v2.png";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SellIcon from "@mui/icons-material/Sell";
import FilterListIcon from "@mui/icons-material/FilterList";
import Scrollbars from "react-custom-scrollbars-2";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Check from "@mui/icons-material/Check";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';

const Tag = (props) => {
  const [open, setOpen] = useState(false);
  const [openProduct, setOpenProduct] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const [list, setList] = useState([]);
  const openMore = Boolean(anchorEl);
  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedTag, setSelectedTag] = useState({
    title: "",
    code: "",
  });
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [selectedProductArray, setSelectedProductArray] = useState([]);
  const [selectedProductVarient, setSelectedProductVarient] = useState([]);
  const [selectedProductVarientArray, setSelectedProductVarientArray] =
    useState([]);
  const [numberOfPage, setNumberOfPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState("category_id");
  const [nameFilter, setNameFilter] = useState("");
  const [pageName, setPageName] = useState("main");
  const [searchValue, setSearchValue] = useState("");
  const [isVariant, setIsVariant] = useState("");
  const [trigger, setTrigger] = useState("");
  const [windowResizing, setWindowResizing] = useState(false);
  const [_width, set_Width] = useState("");
  const [showSideVariant, setShowSideVariant] = useState("");
  const [showDetail, setShowDetail] = useState("");
  const [fixDiv, setFixDiv] = useState(false);
  const [mainVariants, setMainVariants] = useState([]);
  const [sortFilterType, setSortFilterType] = useState("date");
  const [sortFilterTypeTag, setSortFilterTypeTag] = useState("name");
  const [sideVariants, setSideVariants] = useState([]);
  const [selectedMainVariants, setSelectedMainVariants] = useState([]);
  const [anchorElFilter, setAnchorElFilter] = useState(null);
  const [anchorElFilterTag, setAnchorElFilterTag] = useState(null);
  const openFilter = Boolean(anchorElFilter);
  const openFilterTag = Boolean(anchorElFilterTag);
  const [categoryFilterTypes, setCategoryFilterTypes] = useState([]);
  const [categoryFilterName, setCategoryFilterName] = useState("all");
  const [categoryFilterTypesTag, setCategoryFilterTypesTag] = useState([]);
  const [categoryFilterNameTag, setCategoryFilterNameTag] = useState("all");
  const [anchorElSort, setAnchorElSort] = useState(null);
  const openSort = Boolean(anchorElSort);
  const [anchorElSortTag, setAnchorElSortTag] = useState(null);
  const openSortTag = Boolean(anchorElSortTag);
  const [sort, setSort] = useState("date_sort=-1");
  const [sortTag, setSortTag] = useState("date_sort=-1");
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
          setShowMassage('Get profile info has a problem!')
          setOpenMassage(true)
        }
      });
  };

  const getWindowWidth = () => {
    set_Width(window.innerWidth);
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

  let history = useHistory();

  useEffect(() => {
    refreshList();
    productList();
  }, [categoryFilter, nameFilter, searchValue]);

  const refreshList = () => {
    axiosConfig
      .get("/admin/label/all")
      .then((res) => {
        setLoading(false);

        let tags = res.data.labels.filter((l) =>
          (l.title.charAt(0).toUpperCase() + l.title.slice(1)).includes(
            searchValue.charAt(0).toUpperCase() + searchValue.slice(1)
          )
        );
        tags = tags.sort((a, b) =>
          a.title.toLocaleLowerCase() > b.title.toLocaleLowerCase() ? 1 : -1
        );
        setList(tags);
      })
      .catch((error) => {
        setShowMassage('Get tags have a problem!')
        setOpenMassage(true)
      });
    axiosConfig
      .get("/admin/label/get_products?label_id=47")
      .then((response) => {
        if (response.data.status) {
        }
      });
  };
  const productList = () => {
    axiosConfig
      .get(
        `/admin/product/all?limit=1000&page=1&language_id=1&status=1&${categoryFilter}&name=`
      )
      .then((res) => {
        let products = res.data.products;
        if (nameFilter != "") {
          products = products.filter((p) => p.name.includes(nameFilter));
        }
        setProducts(products);
        setNumberOfPage(res.data?.total_pages);
      });
  };

 

  const handleClickOpenDialogProducts = () => {
    setOpen(true);
    setOpenProduct(true);
  };
  const handleCloseDialog = () => {
    setSelectedProduct([]);
    setSelectedProductVarient([]);
    setOpenProduct(false);
    setAnchorEl(null);
  };

  const handleChange = (e, variants, i) => {
    setTrigger(trigger + 1);
    setIsVariant(false);
    const index = selectedProduct.indexOf(parseInt(e.target.value));
    const product = products.find((p) => p.id == e.target.value);

    if (index === -1) {
      setSelectedProduct([...selectedProduct, parseInt(e.target.value)]);
      if (variants.length != 1) {
        setSelectedProductArray([
          ...selectedProductArray,
          parseInt(e.target.value),
        ]);
      }
    } else {
      setSelectedProduct(
        selectedProduct.filter((s) => s !== parseInt(e.target.value))
      );
      if (variants.length != 1) {
        setSelectedProductArray(
          selectedProductArray.filter((s) => s !== parseInt(e.target.value))
        );
      }
    }
    let selectedVarients = [...selectedProductVarient];
    let selectedVarientsArray = [...selectedProductVarientArray];
    variants.map((variant) => {
      const index1 = selectedVarients.indexOf(parseInt(variant.id));
      if (index1 === -1 && index === -1) {
        selectedVarients.push(parseInt(variant.id));
        selectedVarientsArray.push(parseInt(variant.id));
      } else if (index1 != -1 && index != -1) {
        selectedVarients = selectedVarients.filter(
          (s) => s !== parseInt(variant.id)
        );
        selectedVarientsArray = selectedVarientsArray.filter(
          (s) => s !== parseInt(variant.id)
        );
      }
      setTrigger(trigger + 1);
    });
    setSelectedProductVarient(selectedVarients);
    setSelectedProductVarientArray(selectedVarientsArray);

    const mainVariantsArray = [];

    products[i].products.map((p) => {
      if (mainVariantsArray.length !== 0) {
        if (mainVariantsArray.find((m) => m === p.main_attributes[0].value)) {
        } else {
          mainVariantsArray.push(p.main_attributes[0].value);
        }
      } else {
        mainVariantsArray.push(p.main_attributes[0].value);
      }
    });

    if (index === -1) {
      setSelectedMainVariants([...selectedMainVariants, ...mainVariantsArray]);
    } else {
      let mainVariantsArray2 = [...selectedMainVariants];
      mainVariantsArray.map((mVariant) => {
        const index = mainVariantsArray2.indexOf(mVariant);
        if (index != -1) {
          mainVariantsArray2 = mainVariantsArray2.filter(
            (mainVariant) => mainVariant != mVariant
          );
        }
      });

      setSelectedMainVariants([...mainVariantsArray2]);
    }
  };

  const handleChangeMainVarient = (mainVariant, variants, product) => {
    setTrigger(trigger + 1);
    setIsVariant(false);
    let index = selectedMainVariants.indexOf(mainVariant);

    if (index === -1) {
      setSelectedMainVariants([...selectedMainVariants, mainVariant]);

    } else {
      setSelectedMainVariants(
        selectedMainVariants.filter((s) => s !== mainVariant)
      );

    }
    let selectedVarients = [...selectedProductVarient];
    let selectedVarientsArray = [...selectedProductVarientArray];
    variants.map((variant) => {
      const index1 = selectedVarients.indexOf(parseInt(variant.id));
      if (index1 === -1 && index === -1) {
        selectedVarients.push(parseInt(variant.id));
        selectedVarientsArray.push(parseInt(variant.id));
      } else if (index1 != -1 && index != -1) {
        selectedVarients = selectedVarients.filter(
          (s) => s !== parseInt(variant.id)
        );
        selectedVarientsArray = selectedVarientsArray.filter(
          (s) => s !== parseInt(variant.id)
        );
      }
      setTrigger(trigger + 1);
    });
    setSelectedProductVarient(selectedVarients);
    setSelectedProductVarientArray(selectedVarientsArray);

    index = 0;
    product.products.map((v) => {
      selectedVarients.map((selectedV) => {
        if (v.id == selectedV) {
          index = index + 1;
        }
      });
    });

    const indexSelectedProduct = selectedProduct.indexOf(parseInt(product.id));
    if (indexSelectedProduct === -1 && product.products.length == index) {
      setSelectedProduct([...selectedProduct, parseInt(product.id)]);
      if (index > 1) {
        setSelectedProductArray([
          ...selectedProductArray,
          parseInt(product.id),
        ]);
      }
    } else if (indexSelectedProduct != -1 && product.products.length != index) {
      setSelectedProduct(
        selectedProduct.filter((s) => s !== parseInt(product.id))
      );
      setSelectedProductArray(
        selectedProductArray.filter((s) => s !== parseInt(product.id))
      );
    }
  };

  const handleChangeVarient = (e, product, variants, mainVariant) => {
    setIsVariant(true);
    setTrigger(trigger + 1);
    let selectedProductV = [...selectedProductVarient];
    let index = selectedProductVarient.indexOf(parseInt(e.target.value));
    let index1 = 0;
    variants.map((v) => {
      selectedProductV.map((selectedV) => {
        if (v.id == selectedV) {
          index1 = index1 + 1;
        }
      });
    });
    if (index === -1) {
      index1 = index1 + 1;
    } else {
      index1 = index1 - 1;
    }
    if (index === -1) {
      setSelectedProductVarient([
        ...selectedProductVarient,
        parseInt(e.target.value),
      ]);
      selectedProductV.push(parseInt(e.target.value));

      if (variants.length != index1 || variants.length == 1) {
        //add varient to this array
        setSelectedProductVarientArray([
          ...selectedProductVarientArray,
          parseInt(e.target.value),
        ]);
      }
    } else {
      setSelectedProductVarient(
        selectedProductVarient.filter((s) => s !== parseInt(e.target.value))
      );
      selectedProductV = selectedProductV.filter(
        (s) => s !== parseInt(e.target.value)
      );
      if (variants.length != index1 || variants.length == 1) {
        setSelectedProductVarientArray(
          selectedProductVarientArray.filter(
            (s) => s !== parseInt(e.target.value)
          )
        );
      }
    }
    index = 0;
    variants.map((v) => {
      selectedProductV.map((selectedV) => {
        if (v.id == selectedV) {
          index = index + 1;
        }
      });
    });
    const indexSelectedProduct = selectedProduct.indexOf(parseInt(product.id));
    if (indexSelectedProduct === -1 && variants.length == index) {
      setSelectedProduct([...selectedProduct, parseInt(product.id)]);
      if (index > 1) {
        setSelectedProductArray([
          ...selectedProductArray,
          parseInt(product.id),
        ]);
      }
    } else if (indexSelectedProduct != -1 && variants.length != index) {
      setSelectedProduct(
        selectedProduct.filter((s) => s !== parseInt(product.id))
      );
      setSelectedProductArray(
        selectedProductArray.filter((s) => s !== parseInt(product.id))
      );
    }

    const mainVariants = product.products.filter(
      (p) => p.main_attributes[0].value === mainVariant
    );
    index = 0;
    mainVariants.map((mVariant) => {
      selectedProductV.map((selectedV) => {
        if (mVariant.id == selectedV) {
          index = index + 1;
        }
      });
    });

    const indexSelectedMainVarient = selectedMainVariants.indexOf(mainVariant);
    if (indexSelectedMainVarient === -1 && mainVariants.length == index) {
      setSelectedMainVariants([...selectedMainVariants, mainVariant]);
    } else if (indexSelectedMainVarient != -1 && mainVariants.length != index) {
      setSelectedMainVariants(
        selectedMainVariants.filter((mVariant) => mVariant != mainVariant)
      );
    }
  };

  const addTagToProduct = (e) => {
    let variants = [...selectedProductVarientArray];
    const temp = {
      label_id: selectedTag.id,
      product_group_ids: Object.values(selectedProduct),
      product_group_ids_for_deletion: [],
      product_ids: Object.values(selectedProductVarient),
      product_ids_for_deletion: [],
    };
    axiosConfig.post("/admin/label/assign", temp).then((response) => {
      if (response.data.status) {
        refreshList();
        setOpenProduct(false);
        setAnchorEl(null);
      }
    });

    setSelectedProductArray([]);
    setSelectedProduct([]);
    setSelectedProductVarient([]);
    setSelectedProductVarientArray([]);
    setSelectedMainVariants([]);
    setOpenProduct(false);
    setAnchorEl(null);
  };

  const isLoading = () => {
    return (
      <Grid item xs={12} mt={2} mb={2} display="flex" justifyContent="center">
        <CircularProgress color="P" />
      </Grid>
    );
  };

  const handleClick = (event, color) => {
    setAnchorEl(event.currentTarget);
    setSelectedTag(color);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickEdit = () => {
    setIsEdit(true);
    setPageName("add");
  };

  const handleClickDelete = () => {
    setOpenDelete(true);
  };

  const deleteTag = () => {
    axiosConfig
      .delete(`/admin/label/${selectedTag.id}`)
      .then((res) => {
        if (res.data) {
          setOpenDelete(false);
          setAnchorEl(null);
          refreshList();
        }
      })
      .catch((err) => {
        setShowMassage('Delete tag has a problem!')
        setOpenMassage(true)
      });
  };

  const handleCloseDialogDelete = () => {
    setOpenDelete(false);
    setAnchorEl(null);
  };

  const handlechangeSearch = (e) => {
    setNameFilter(e.target.value);
  };



  const bread = [
    {
      title: "Tag",
      href: "/admin/tag",
    },
  ];

  useEffect(() => {
  }, [isVariant]);


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

  const seterTotalStockVariant = (varArray) => {
    let totalStock = 0;
    let total = 0;
    varArray.map((v) => {
      total = parseInt(v.stock);
      totalStock = parseInt(totalStock) + total;
    });
    return totalStock;
  };

  const sortDate = (type, categoryType) => {
    let tags;
    if (categoryType == "name") {
      if (type == "A_Z") {
        tags = list.sort((a, b) =>
          a.title.toLocaleLowerCase() > b.title.toLocaleLowerCase() ? 1 : -1
        );
        setAnchorElSortTag(null);
      } else if (type == "Z_A") {
        tags = list.sort((a, b) =>
          b.title.toLocaleLowerCase() > a.title.toLocaleLowerCase() ? 1 : -1
        );
        setAnchorElSortTag(null);
      }
    } else if (categoryType == "code") {
      if (type == "A_Z") {
        tags = list.sort((a, b) =>
          a.code.toLocaleLowerCase() > b.code.toLocaleLowerCase() ? 1 : -1
        );
        setAnchorElSortTag(null);
      } else if (type == "Z_A") {
        tags = list.sort((a, b) =>
          b.code.toLocaleLowerCase() > a.code.toLocaleLowerCase() ? 1 : -1
        );
        setAnchorElSortTag(null);
      }
    } else {
      if (type == "high to low") {
        tags = list.sort((a, b) =>
          b.variant_count > a.variant_count ? 1 : -1
        );
        setAnchorElSortTag(null);
      } else if (type == "Low to high") {
        tags = list.sort((a, b) =>
          a.variant_count > b.variant_count ? 1 : -1
        );
        setAnchorElSortTag(null);
      }
    }

    setList(tags);
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
      pageName={pageName === "main" ? "Tag" : isEdit ? "Edit Tag" : "Add Tag"}
    >
      {pageName === "main" ? (
        <Grid
          sx={{
            paddingLeft: { xs: 0, sm: 1 },
            paddingRight: { xs: 0, sm: 1 },
          }}
        >
          <Grid
            item
            xs={12}
            md={12}
            sx={{
              position: "sticky",
              width: "100%",
              zIndex: 100,
              top: 80,
            }}
          >
            <Grid xs={12}>
              <Paper
                style={{
                  boxShadow: "none",
                  border: "1px solid #DCDCDC",
                  borderRadius: "5px",
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
                    Tag
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
                  >
                    Add Tag
                  </Button>

                </Grid>
              </Paper>

              <Grid
                xs={12}
                backgroundColor="GrayLight.main"
                height="2px"
                sx={{
                  width: "100%",
                  zIndex: 100,
                }}
              ></Grid>
            </Grid>

            <Grid
              item
              xs={12}
              md={12}
              sx={{
                position: "sticky",
                width: "100%",
                zIndex: 100,
                bgcolor: "GrayLight.main",
                top: "140px",
              }}
            >
              <Grid
                item
                xs={12}
                mb={1}
                md={12}
                mt={0}
                sx={{
                  position: "sticky",
                  top: "139px",
                  mb: "15px",
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
                    borderRadius: "5px",
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
                          setSearchValue(e.target.value);
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
                      aria-haspopup="true"
                      onClick={(event) => {
                        setAnchorElFilterTag(event.currentTarget);
                      }}
                      sx={{ margin: "0 15px 0 10px", ml: "7px", mr: "7px" }}
                    >
                      <FilterListIcon color="G1" />
                    </IconButton>

                    <Menu
                      id="composition-button"
                      anchorEl={anchorElFilterTag}
                      open={openFilterTag}
                      onClose={() => setAnchorElFilterTag(null)}
                      MenuListProps={{
                        "aria-labelledby": "basic-button",
                      }}
                      sx={{ width: "247px", ml: -1.5 }}
                    >
                      <MenuItem
                        onClick={() => {
                          setCategoryFilterTypesTag([]);
                          setCategoryFilterNameTag("all");
                        }}
                        sx={{
                          width: "227px",
                          padding: "5px 5px 5px 13px",
                          color: "G1.main",
                        }}
                      >
                        {categoryFilterNameTag === "all" ? (
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
                      <Divider
                        sx={{
                          width: "60%",
                          margin: "auto",
                          borderColor: "P.main",
                        }}
                      />
                      <MenuItem
                        aria-controls={
                          openSortTag ? "demo-positioned-date-menu" : undefined
                        }
                        aria-haspopup="true"
                        aria-expanded={openSortTag ? "true" : undefined}
                        onClick={(event) =>
                          setAnchorElSortTag(event.currentTarget)
                        }
                        sx={{ padding: "5px 5px 5px 13px", color: "G1.main" }}
                      >
                        <ListItemIcon>
                          <ArrowBackIosIcon color="P" sx={{ padding: "3px" }} />
                        </ListItemIcon>
                        Sort by
                      </MenuItem>
                    </Menu>

                    <Menu
                      id="composition-button"
                      anchorEl={anchorElSortTag}
                      open={openSortTag}
                      onClose={() => setAnchorElSortTag(null)}
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
                          setSortFilterTypeTag("name");
                        }}
                        sx={{
                          padding: "7px 5px 5px 13px",
                          width: "235px",
                          color: "G1.main",
                        }}
                      >
                        {sortFilterTypeTag === "name" ? (
                          <>
                            <ListItemIcon>
                              <Check color="P" sx={{ padding: "3px" }} />
                            </ListItemIcon>
                            <Typography ml={-1}>Name</Typography>
                          </>
                        ) : (
                          <ListItemText inset>
                            <Typography ml={-1}>Name</Typography>
                          </ListItemText>
                        )}
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          setSortFilterTypeTag("code");
                        }}
                        sx={{
                          padding: "5px 5px 5px 13px",
                          width: "235px",
                          color: "G1.main",
                        }}
                      >
                        {sortFilterTypeTag === "code" ? (
                          <>
                            <ListItemIcon>
                              <Check color="P" sx={{ padding: "3px" }} />
                            </ListItemIcon>
                            <Typography ml={-1}>Code</Typography>
                          </>
                        ) : (
                          <ListItemText inset>
                            <Typography ml={-1}>Code</Typography>
                          </ListItemText>
                        )}
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          setSortFilterTypeTag("assigned products");
                        }}
                        sx={{
                          padding: "5px 5px 5px 13px",
                          width: "235px",
                          color: "G1.main",
                        }}
                      >
                        {sortFilterTypeTag === "assigned products" ? (
                          <>
                            <ListItemIcon>
                              <Check color="P" sx={{ padding: "3px" }} />
                            </ListItemIcon>
                            <Typography ml={-1}>Assigned products</Typography>
                          </>
                        ) : (
                          <ListItemText inset>
                            <Typography ml={-1}>Assigned products</Typography>
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
                          if (sortFilterTypeTag === "name") {
                            setSortTag("title_sort=-1");
                            sortDate("A_Z", "name");
                          } else if (sortFilterTypeTag === "code") {
                            setSortTag("date_sort=-1");
                            sortDate("A_Z", "code");
                          } else {
                            setSortTag("viewed_sort=-1");
                            sortDate("Low to high", "assigned products");
                          }
                          setAnchorElSortTag(null);
                          setAnchorElFilterTag(null);
                        }}
                        sx={{
                          padding: "7px 5px 5px 13px",
                          width: "235px",
                          color: "G1.main",
                        }}
                      >
                        {sortTag.toString().split("=")[1] === "-1" ? (
                          <>
                            <ListItemIcon>
                              <Check color="P" sx={{ padding: "3px" }} />
                            </ListItemIcon>
                            <Typography ml={-1}>
                              {sortFilterTypeTag === "name"
                                ? "A to Z"
                                : sortFilterTypeTag === "code"
                                  ? "A to Z"
                                  : "Low to high"}
                            </Typography>
                          </>
                        ) : (
                          <ListItemText inset>
                            <Typography ml={-1}>
                              {sortFilterTypeTag === "name"
                                ? "A to Z"
                                : sortFilterTypeTag === "code"
                                  ? "A to Z"
                                  : "Low to high"}
                            </Typography>
                          </ListItemText>
                        )}
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          if (sortFilterTypeTag === "name") {
                            setSortTag("title_sort=1");
                            sortDate("Z_A", "name");
                          } else if (sortFilterTypeTag === "code") {
                            setSortTag("date_sort=1");
                            sortDate("Z_A", "code");
                          } else {
                            setSortTag("viewed_sort=1");
                            sortDate("high to low", "assigned products");
                          }
                          setAnchorElSortTag(null);
                          setAnchorElFilterTag(null);
                        }}
                        sx={{
                          padding: "5px 5px 5px 13px",
                          width: "235px",
                          color: "G1.main",
                        }}
                      >
                        {sortTag.toString().split("=")[1] === "1" ? (
                          <>
                            <ListItemIcon>
                              <Check color="P" sx={{ padding: "3px" }} />
                            </ListItemIcon>
                            <Typography ml={-1}>
                              {sortFilterTypeTag === "name"
                                ? "Z to A"
                                : sortFilterTypeTag === "code"
                                  ? "Z to A"
                                  : "High to low"}
                            </Typography>
                          </>
                        ) : (
                          <ListItemText inset>
                            <Typography ml={-1}>
                              {sortFilterTypeTag === "name"
                                ? "Z to A"
                                : sortFilterTypeTag === "code"
                                  ? "Z to A"
                                  : "High to low"}
                            </Typography>
                          </ListItemText>
                        )}
                      </MenuItem>
                    </Menu>
                  </Grid>
                </Paper>
              </Grid>

              <Grid
                item
                xs={12}
                md={12}
                sx={{
                  position: "sticky",
                  width: "100%",
                  zIndex: 100,
                  bgcolor: "GrayLight.main",
                }}
              >
                <Paper
                  item
                  xs={12}
                  md={12}
                  sx={{
                    border: "1px solid #DCDCDC",
                    backgroundColor: "P1.main",
                    mb: "1px",
                    borderRadius: "5px",
                    height: "48px",
                  }}
                  elevation={0}
                >
                  <Grid
                    key="row"
                    sx={{
                      pl: 2,
                      display: "flex",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    <Grid item sx={{ width: "7.6%" }}>
                      <Typography
                        p={1}
                        color="black"
                        variant="h7"
                        sx={{ fontWeight: "bold" }}
                      >
                        Row
                      </Typography>
                    </Grid>
                    <Grid
                      sx={{ width: "22.71%" }}
                      pl={
                        window.innerWidth > 1550
                          ? 0
                          : window.innerWidth > 1450
                            ? "1px"
                            : window.innerWidth > 1200
                              ? "2px"
                              : window.innerWidth > 880
                                ? "3px"
                                : "6px"
                      }
                    >
                      <Typography
                        variant="h7"
                        sx={{ fontWeight: "bold" }}
                        p={1}
                      >
                        Name
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      sx={{
                        width:
                          window.innerWidth > 910
                            ? "45.6%"
                            : window.innerWidth > 764
                              ? "40%"
                              : window.innerWidth > 670
                                ? "35%"
                                : window.innerWidth > 601
                                  ? "30%"
                                  : "25%",
                      }}
                      pl={window.innerWidth > 880 ? 0 : "3px"}
                    >
                      <Typography
                        variant="h7"
                        sx={{ fontWeight: "bold" }}
                        p={1}
                      >
                        Code
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      sx={{
                        width:
                          window.innerWidth > 910
                            ? "19.5%"
                            : window.innerWidth > 764
                              ? "24.5%"
                              : window.innerWidth > 670
                                ? "29.5%"
                                : window.innerWidth > 601
                                  ? "34.5%"
                                  : "39.5%",
                      }}
                    >
                      <Typography
                        variant="h7"
                        sx={{ fontWeight: "bold" }}
                        p={1}
                      >
                        Assign products
                      </Typography>
                    </Grid>

                    <Grid
                      item
                      xs={0.5}
                      className="moreIcone"
                      sx={{ backgroundColor: "rgb(203, 146, 155, 0.0)" }}
                    >
                      <IconButton
                        aria-label="delete"
                        aria-controls={
                          openMore ? "demo-positioned-menu" : undefined
                        }
                        aria-haspopup="true"
                        aria-expanded={openMore ? "true" : undefined}
                        sx={{
                          color: "rgb(203, 146, 155, 0.0)",
                          cursor: "auto",
                          ":hover": {
                            backgroundColor: "rgb(203, 146, 155, 0.0)",
                          },
                          ":focus": {
                            backgroundColor: "rgb(203, 146, 155, 0.0)",
                          },
                        }}
                      >
                        <MoreVertIcon
                          sx={{
                            color: "rgb(203, 146, 155, 0.0)",
                            ":hover": { color: "rgb(203, 146, 155, 0.0)" },
                            ":focus": { color: "rgb(203, 146, 155, 0.0)" },
                            pl: 0.3,
                          }}
                        />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
          <Grid xs={12} md={12} sx={{ width: "100%", minHeight: "405px" }}>
            <Grid
              item
              xs={12}
              md={12}
              container
              spacing={0}
              display="flex"
              justifyContent="space-between"
            >

              <Grid item xs={12} md={12}>
                <Grid xs={12} style={{ minHeight: 390 }}>
                  <List sx={{ p: 0 }}>
                    {loading
                      ? isLoading()
                      : list.map((tag, index) => {
                        return (
                          <Paper
                            item
                            xs={12}
                            md={12}
                            sx={{
                              border: "1px solid #DCDCDC",
                              mb: "-1px",
                              borderRadius: "5px",
                              height: "48px",
                            }}
                            elevation={0}
                          >
                            <ListItem key={tag.id} sx={{ pl: 2 }}>
                              <Grid item width="6.8%" ml={1.3}>
                                <Typography
                                  variant="h7"
                                  p={1}
                                  color="G2.main"
                                >
                                  {index + 1}
                                </Typography>
                              </Grid>
                              <Grid item width="23.23%">
                                <Typography
                                  p={1}
                                  variant={
                                    window.innerWidth > 880 ? "h7" : "h10"
                                  }
                                  color="G2.main"
                                >
                                  {window.innerWidth > 880
                                    ? tag.title.charAt(0).toUpperCase() +
                                    tag.title.slice(1)
                                    : tag.title.length > 11
                                      ? window.innerWidth > 576
                                        ? tag.title.charAt(0).toUpperCase() +
                                        tag.title.slice(1).substring(0, 8) +
                                        ".."
                                        : tag.title.charAt(0).toUpperCase() +
                                        tag.title.slice(1).substring(0, 5) +
                                        ".."
                                      : tag.title.charAt(0).toUpperCase() +
                                      tag.title.slice(1)}
                                </Typography>
                              </Grid>
                              <Grid
                                item
                                width={
                                  window.innerWidth > 910
                                    ? "46%"
                                    : window.innerWidth > 880
                                      ? "41%"
                                      : window.innerWidth > 764
                                        ? "39.6%"
                                        : window.innerWidth > 670
                                          ? "34%"
                                          : window.innerWidth > 601
                                            ? "28.5%"
                                            : "23.5%"
                                }
                              >
                                <Typography
                                  align="right"
                                  p={1}
                                  color="G2.main"
                                  variant="h7"
                                >
                                  {tag.code.charAt(0).toUpperCase() +
                                    tag.code.slice(1)}
                                </Typography>
                              </Grid>
                              <Grid
                                item
                                width={
                                  window.innerWidth > 910
                                    ? "19%"
                                    : window.innerWidth > 880
                                      ? "24%"
                                      : window.innerWidth > 764
                                        ? "24.7%"
                                        : window.innerWidth > 670
                                          ? "30.5%"
                                          : window.innerWidth > 601
                                            ? "36%"
                                            : "41%"
                                }
                              >
                                <Typography
                                  align="right"
                                  p={1}
                                  color="G2.main"
                                  variant="h7"
                                >
                                  {tag.variant_count == 0
                                    ? tag.variant_count + " Product"
                                    : tag.variant_count + " Products"}
                                </Typography>
                              </Grid>
                              <Grid item xs={0.5} className="moreIcone">
                                <IconButton
                                  sx={{
                                    mr:
                                      window.innerWidth < 900
                                        ? -0.25
                                        : window.innerWidth < 1400
                                          ? -0.1
                                          : window.innerWidth < 1550
                                            ? -0.2
                                            : window.innerWidth < 1800
                                              ? -0.4
                                              : window.innerWidth < 2000
                                                ? -0.7
                                                : -0.4,
                                  }}
                                  aria-label="delete"
                                  aria-controls={
                                    openMore
                                      ? "demo-positioned-menu"
                                      : undefined
                                  }
                                  aria-haspopup="true"
                                  aria-expanded={
                                    openMore ? "true" : undefined
                                  }
                                  onClick={(event) => handleClick(event, tag)}
                                >
                                  <MoreVertIcon
                                    color="G2.main"
                                    sx={{ fontSize: "16px" }}
                                  />
                                </IconButton>
                              </Grid>
                            </ListItem>
                          </Paper>
                        );
                      })}
                  </List>
                </Grid>
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
                  <MenuItem onClick={handleClickEdit}>Edit</MenuItem>
                  <MenuItem onClick={handleClickOpenDialogProducts}>
                    Assign Product
                  </MenuItem>
                  <MenuItem onClick={handleClickDelete}>Delete</MenuItem>
                </Menu>
                <Dialog
                  fullWidth
                  maxWidth="md"
                  xs={12}
                  open={openProduct}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                  onClose={handleCloseDialog}
                >
                  <DialogTitle
                    sx={{ bgcolor: "G3.main", ml: 0, mr: 0, pr: 0, pl: 0 }}
                  >
                    <Grid
                      bgcolor="G3.main"
                      ml="15px"
                      mr="15px"
                      sx={{ backgroundColor: "G3.main" }}
                    >
                      <Paper
                        item
                        md={12}
                        className="box"
                        elevation={0}
                        top="0"
                        left="0"
                        right="0"
                        overflow="hidden"
                        height="65px"
                        borderColor="white"
                        sx={[
                          {
                            border: "0px solid white",
                            pl: "10px",
                            display: "flex",
                            flexDirection:
                              window.innerWidth > 616 ? "row" : "column",
                          },
                          window.innerWidth > 616 && {
                            display: "flex",
                            justifyContent: "space-between",
                          },
                        ]}
                      >
                        <Grid
                          item
                          xs={window.innerWidth > 616 ? 12 : 12}
                          md={window.innerWidth > 616 ? 12 : 12}
                          display="flex"
                          alignItems="center"
                          pl="17px"
                        >
                          <Typography variant="menutitle">
                            Add Product
                          </Typography>
                        </Grid>

                        <Grid
                          display="flex"
                          xs={window.innerWidth > 616 ? "auto" : 12}
                        >
                          <Grid
                            xs={11}
                            display="flex"
                            alignItems="center"
                            justifyContent="end"
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
                              <IconButton
                                sx={{ p: "10px" }}
                                aria-label="search"
                              >
                                <SearchIcon color="G1.main" />
                              </IconButton>
                              <InputBase
                                sx={{ ml: 1, flex: 1 }}
                                placeholder="Search"
                                inputProps={{ "aria-label": "Search in List" }}
                                onChange={handlechangeSearch}
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
                                    ".MuiSvgIcon-root": {
                                      color: "G2.main",
                                      padding: "3px",
                                    },
                                  }}
                                >
                                  <MenuItem value={"name"}>
                                    <Typography
                                      p={1}
                                      color="G2.main"
                                      variant="h15"
                                    >
                                      Name
                                    </Typography>
                                  </MenuItem>
                                </Select>
                              </FormControl>
                            </Paper>
                          </Grid>
                          <Grid
                            xs={0.7}
                            ml={"28px"}
                            mr={"16px"}
                            display="flex"
                            justifyContent="center"
                            alignItems="start"
                          >
                            <IconButton
                              aria-label="search"
                              aria-controls={
                                openFilter
                                  ? "demo-positioned-date-menu"
                                  : undefined
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
                                      <Check
                                        color="P"
                                        sx={{ padding: "3px" }}
                                      />
                                    </ListItemIcon>
                                    <Typography ml={-1}>All</Typography>
                                  </>
                                ) : (
                                  <ListItemText inset>
                                    <Typography ml={-1}>All</Typography>
                                  </ListItemText>
                                )}
                              </MenuItem>
                              {JSON.parse(
                                localStorage.getItem("categories")
                              ).map((cat) => {
                                return (
                                  <MenuItem
                                    onClick={() => {
                                      setCategoryFilterTypes(cat.types);
                                      setCategoryFilterName(cat.title);
                                    }}
                                    sx={{
                                      padding: "5px 5px 5px 13px",
                                      color: "G1.main",
                                    }}
                                  >
                                    {categoryFilterName === cat.title ? (
                                      <>
                                        <ListItemIcon>
                                          <Check
                                            color="P"
                                            sx={{ padding: "3px" }}
                                          />
                                        </ListItemIcon>
                                        <Typography ml={-1}>
                                          {cat.title}
                                        </Typography>
                                      </>
                                    ) : (
                                      <ListItemText inset>
                                        <Typography ml={-1}>
                                          {cat.title}
                                        </Typography>
                                      </ListItemText>
                                    )}
                                  </MenuItem>
                                );
                              })}
                              <Divider
                                sx={{
                                  width: "60%",
                                  margin: "auto",
                                  borderColor: "P.main",
                                }}
                              />
                              <MenuItem
                                aria-controls={
                                  openSort
                                    ? "demo-positioned-date-menu"
                                    : undefined
                                }
                                aria-haspopup="true"
                                aria-expanded={openSort ? "true" : undefined}
                                onClick={(event) =>
                                  setAnchorElSort(event.currentTarget)
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
                                      <Check
                                        color="P"
                                        sx={{ padding: "3px" }}
                                      />
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
                                      <Check
                                        color="P"
                                        sx={{ padding: "3px" }}
                                      />
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
                                      <Check
                                        color="P"
                                        sx={{ padding: "3px" }}
                                      />
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
                        </Grid>
                      </Paper>
                    </Grid>
                  </DialogTitle>
                  <DialogContent
                    sx={{
                      height: "5010px",
                      bgcolor: "G3.main",
                      ml: 0,
                      mr: 0,
                      pr: 0,
                      pl: 0,
                    }}
                  >
                    <Scrollbars style={{ backgroundColor: "#E0E0E0" }}>
                      <Grid
                        p={0}
                        mt="7px"
                        ml="15px"
                        mr="15px"
                        xs={12}
                        sx={{ backgroundColor: "G3.main" }}
                        display="flex"
                        flexDirection="column"
                        left="0px"
                        right="0px"
                      >
                        {products.map((product, index) => {
                          let totalStock = 0;
                          let variants = product.products;
                          return (
                            <>
                              <Paper
                                fullWidth
                                sx={{ mb: index === showDetail ? 0 : "4px" }}
                                elevation={0}
                              >
                                <Grid container>
                                  <Grid
                                    item
                                    xs={12}
                                    md={12}
                                    display="flex"
                                    pl={"24px"}
                                  >
                                    <FormControl>
                                      <FormGroup>
                                        <FormControlLabel
                                          control={
                                            <Checkbox
                                              color="P"
                                              checked={
                                                selectedProduct.indexOf(
                                                  product.id
                                                ) > -1
                                              }
                                              onChange={(e) => {
                                                handleChange(
                                                  e,
                                                  variants,
                                                  index
                                                );
                                                setIsVariant(false);
                                              }}
                                              value={product.id}
                                              style={{ paddingTop: "37px" }}
                                              sx={{
                                                color:
                                                  selectedProductVarient.indexOf(
                                                    variants.id
                                                  ) > -1
                                                    ? "P.main"
                                                    : "GrayLight3.main",
                                              }}
                                            />
                                          }
                                          label={""}
                                        />
                                      </FormGroup>
                                    </FormControl>
                                    <Grid
                                      xs={index === showDetail ? 12 : 11.05}
                                    >
                                      <Accordion
                                        sx={{
                                          boxShadow: 0,
                                          border: 0,
                                          borderTop: 0,
                                          ml:
                                            window.innerWidth > 620
                                              ? "-27.5px"
                                              : "-25px",
                                        }}
                                      >
                                        <AccordionSummary
                                          expandIcon={
                                            <ExpandMoreIcon
                                              sx={{
                                                mr:
                                                  window.innerWidth > 950
                                                    ? "-22.1px"
                                                    : window.innerWidth > 920
                                                      ? "-19px"
                                                      : window.innerWidth > 903
                                                        ? "-15px"
                                                        : window.innerWidth > 830
                                                          ? "-12px"
                                                          : window.innerWidth > 790
                                                            ? "-9px"
                                                            : "-5px",
                                              }}
                                            />
                                          }
                                          aria-controls="panel1a-content"
                                          id="panel1a-header"
                                          sx={{ border: 0, borderTop: 0 }}
                                          onClick={() => {
                                            setShowSideVariant("");
                                            const mainVariantsArray = [];
                                            if (showDetail === index) {
                                              setShowDetail("");
                                              setFixDiv(false);
                                            } else {
                                              setShowDetail(index);
                                              products[index].products.map(
                                                (p) => {
                                                  if (
                                                    mainVariantsArray.length !==
                                                    0
                                                  ) {
                                                    if (
                                                      mainVariantsArray.find(
                                                        (m) =>
                                                          m ===
                                                          p.main_attributes[0]
                                                            .value
                                                      )
                                                    ) {
                                                    } else {
                                                      mainVariantsArray.push(
                                                        p.main_attributes[0]
                                                          .value
                                                      );
                                                    }
                                                  } else {
                                                    mainVariantsArray.push(
                                                      p.main_attributes[0].value
                                                    );
                                                  }
                                                }
                                              );
                                              setMainVariants(
                                                mainVariantsArray
                                              );
                                              setFixDiv(true);
                                            }
                                          }}
                                        >
                                          <Grid
                                            display="flex"
                                            p={1}
                                            sx={{ border: 0, borderTop: 0 }}
                                          >
                                            <Grid
                                              sx={{
                                                border: 0,
                                                borderTop: 0,
                                                pt: 1,
                                              }}
                                            >
                                              <Card
                                                sx={{
                                                  maxWidth: 100,
                                                  border: "none",
                                                  boxShadow: "none",
                                                }}
                                              >
                                                <CardMedia
                                                  component="img"
                                                  height="60"
                                                  image={
                                                    product.file_urls === null
                                                      ? No_Product_Image
                                                      : axiosConfig.defaults
                                                        .baseURL +
                                                      product.file_urls[0]
                                                  }
                                                  className="image"
                                                />
                                              </Card>
                                            </Grid>
                                            <Grid>
                                              <Grid
                                                mt={1.5}
                                                sx={{ display: "flex" }}
                                              >
                                                <Typography
                                                  ml={2}
                                                  color="black"
                                                  variant="h11"
                                                >

                                                  {product.name !== undefined &&
                                                    product.products.length != 0
                                                    ? product.name
                                                    : ""}
                                                </Typography>
                                                <Typography
                                                  color="G2.main"
                                                  ml={1}
                                                  textTransform="uppercase"
                                                >
                                                  {product.arabic_name !==
                                                    undefined &&
                                                    product.products.length != 0
                                                    ? "(" +
                                                    (window.innerWidth > 630
                                                      ? product.arabic_name
                                                      : product.arabic_name.substring(
                                                        0,
                                                        9
                                                      ) + "...") +
                                                    ")"
                                                    : ""}
                                                </Typography>
                                              </Grid>

                                              <Grid
                                                ml={2}
                                                mt={1}
                                                display="flex"
                                              >
                                                {product.products.length !==
                                                  0 && (
                                                    <>
                                                      <Typography
                                                        variant="h10"
                                                        color="G1.main"
                                                      >
                                                        {window.innerWidth > 700
                                                          ? product.products[0].general_attributes.find(
                                                            (a) =>
                                                              a.title ===
                                                              "Brand"
                                                          ).value
                                                          : product.products[0].general_attributes
                                                            .find(
                                                              (a) =>
                                                                a.title ===
                                                                "Brand"
                                                            )
                                                            .value.substring(
                                                              0,
                                                              5
                                                            ) + "..."}{" "}
                                                      </Typography>
                                                      <Divider
                                                        orientation="vertical"
                                                        flexItem
                                                        sx={{ ml: "8px" }}
                                                      />
                                                      <Typography
                                                        variant="h10"
                                                        color="G1.main"
                                                        ml="8px"
                                                      >
                                                        {window.innerWidth > 633
                                                          ? countMainVariant(
                                                            index
                                                          ) +
                                                          " " +
                                                          product.products[0]
                                                            .main_attributes[0]
                                                            .title +
                                                          (countMainVariant(
                                                            index
                                                          ) > 1
                                                            ? "s"
                                                            : "")
                                                          : countMainVariant(
                                                            index
                                                          ) +
                                                          " " +
                                                          product.products[0].main_attributes[0].title.substring(
                                                            0,
                                                            5
                                                          ) +
                                                          (countMainVariant(
                                                            index
                                                          ) > 1
                                                            ? "s"
                                                            : "")}{" "}
                                                      </Typography>
                                                      <Divider
                                                        orientation="vertical"
                                                        flexItem
                                                        sx={{ ml: "8px" }}
                                                      />
                                                      <Typography
                                                        variant="h10"
                                                        color="G1.main"
                                                        sx={{ ml: "8px" }}
                                                      >
                                                        {product.products
                                                          .length === 0
                                                          ? "No variant(s) for this product!"
                                                          : product.products.map(
                                                            (
                                                              variant,
                                                              index
                                                            ) => {
                                                              let variantStock =
                                                                parseInt(
                                                                  variant.stock
                                                                );
                                                              totalStock =
                                                                totalStock +
                                                                variantStock;
                                                            }
                                                          )}
                                                        {
                                                          <Typography variant="h10">
                                                            {window.innerWidth >
                                                              633
                                                              ? totalStock +
                                                              " item" +
                                                              (totalStock > 1
                                                                ? "s"
                                                                : "") +
                                                              " in stock"
                                                              : totalStock +
                                                              " item" +
                                                              (totalStock > 1
                                                                ? "s"
                                                                : "")}
                                                          </Typography>
                                                        }
                                                      </Typography>

                                                    </>
                                                  )}

                                              </Grid>
                                            </Grid>
                                          </Grid>
                                        </AccordionSummary>
                                      </Accordion>
                                    </Grid>
                                  </Grid>
                                </Grid>

                              </Paper>

                              {index === showDetail ? (
                                <Paper
                                  sx={{ mb: "4px" }}
                                  style={{
                                    boxShadow: "none",
                                    border: "1px solid #DCDCDC",
                                  }}
                                >
                                  <Scrollbars
                                    style={{
                                      width: "100%",
                                      height: window.innerHeight / 3,
                                    }}
                                  >
                                    <Grid xs={12}>
                                      {mainVariants.map(
                                        (mainVariant, indexVariant) => {
                                          return (
                                            <Grid
                                              xs={12}
                                              p={2}
                                              pl={0}
                                              pr={0}
                                              display={
                                                showSideVariant === ""
                                                  ? "flex"
                                                  : mainVariant ===
                                                    showSideVariant
                                                    ? "flex"
                                                    : "none"
                                              }
                                              flexWrap="wrap"
                                            >

                                              <Grid
                                                xs={
                                                  window.innerWidth > 855
                                                    ? 4
                                                    : 6
                                                }
                                                position={
                                                  showSideVariant === ""
                                                    ? ""
                                                    : mainVariant ===
                                                      showSideVariant
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
                                                    top: "15%",
                                                    height: "100px",
                                                    width: "100%",
                                                  }}
                                                ></Grid>
                                                <Grid
                                                  xs={11.6}
                                                  display="flex"
                                                  flexWrap="wrap"
                                                  style={{
                                                    height:
                                                      window.innerWidth > 575
                                                        ? "123px"
                                                        : "150px",
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
                                                        backgroundColor:
                                                          "white",
                                                        width: "100%",
                                                        padding: "0 5px ",
                                                      }}
                                                    >
                                                      {mainVariant}
                                                    </Typography>
                                                  </Grid>

                                                  <Grid
                                                    xs={12}
                                                    display="flex"
                                                    flexDirection="column"
                                                    justifyContent="center"
                                                    p={1}
                                                    pt={0}
                                                  >
                                                    <Grid
                                                      display="flex"
                                                      justifyContent="space-between"
                                                    >
                                                      <FormControl>
                                                        <FormGroup>
                                                          <FormControlLabel
                                                            control={
                                                              <Checkbox
                                                                color="P"
                                                                checked={
                                                                  selectedMainVariants.indexOf(
                                                                    mainVariant
                                                                  ) > -1
                                                                }
                                                                onChange={(
                                                                  e
                                                                ) => {
                                                                  handleChangeMainVarient(
                                                                    mainVariant,
                                                                    product.products.filter(
                                                                      (p) =>
                                                                        p
                                                                          .main_attributes[0]
                                                                          .value ===
                                                                        mainVariant
                                                                    ),
                                                                    product
                                                                  );
                                                                }}
                                                                value={
                                                                  mainVariant.id
                                                                }
                                                                style={{
                                                                  padding:
                                                                    "20px",
                                                                  paddingTop:
                                                                    "10px",
                                                                }}
                                                                sx={{
                                                                  color:
                                                                    selectedMainVariants.indexOf(
                                                                      mainVariant
                                                                    ) > -1
                                                                      ? "P.main"
                                                                      : "GrayLight3.main",
                                                                }}
                                                              />
                                                            }
                                                            label={""}
                                                          />
                                                        </FormGroup>
                                                      </FormControl>
                                                      <Grid
                                                        xs={11}
                                                        mt="-4px"
                                                        display="flex"
                                                        flexDirection="column"
                                                      >
                                                        <Typography
                                                          variant="h15"
                                                          color="G1.main"
                                                        >
                                                          {window.innerWidth >
                                                            575
                                                            ? mainVariant.substring(
                                                              0,
                                                              18
                                                            ) +
                                                            "has" +
                                                            product.products.filter(
                                                              (p) =>
                                                                p
                                                                  .main_attributes[0]
                                                                  .value ===
                                                                mainVariant
                                                            ).length +
                                                            "" +
                                                            (product.products.filter(
                                                              (p) =>
                                                                p
                                                                  .main_attributes[0]
                                                                  .value ===
                                                                mainVariant
                                                            ).length > 1
                                                              ? "Variants"
                                                              : "Variant")
                                                            : product.products.filter(
                                                              (p) =>
                                                                p
                                                                  .main_attributes[0]
                                                                  .value ===
                                                                mainVariant
                                                            ).length +
                                                            " " +
                                                            (product.products.filter(
                                                              (p) =>
                                                                p
                                                                  .main_attributes[0]
                                                                  .value ===
                                                                mainVariant
                                                            ).length > 1
                                                              ? "Variants"
                                                              : "Variant")}
                                                        </Typography>
                                                        <Typography
                                                          variant="h15"
                                                          color="G1.main"
                                                        >
                                                          Total Price:{" "}
                                                          {seterTotalPrice(
                                                            product.products.filter(
                                                              (p) =>
                                                                p
                                                                  .main_attributes[0]
                                                                  .value ===
                                                                mainVariant
                                                            )
                                                          )}
                                                        </Typography>
                                                        <Typography
                                                          variant="h15"
                                                          color="G1.main"
                                                        >
                                                          Available in Stock:{" "}
                                                          {seterTotalStockVariant(
                                                            product.products.filter(
                                                              (p) =>
                                                                p
                                                                  .main_attributes[0]
                                                                  .value ===
                                                                mainVariant
                                                            )
                                                          )}
                                                        </Typography>
                                                      </Grid>
                                                    </Grid>
                                                  </Grid>
                                                  <Grid
                                                    xs={12}
                                                    display="flex"
                                                    justifyContent="flex-end"
                                                    alignItems="end"
                                                  >
                                                    <IconButton
                                                      onClick={() => {
                                                        if (
                                                          showSideVariant ===
                                                          mainVariant
                                                        ) {
                                                          setShowSideVariant(
                                                            ""
                                                          );
                                                        } else {
                                                          setShowSideVariant(
                                                            mainVariant
                                                          );
                                                          setSideVariants(
                                                            product.products.filter(
                                                              (p) =>
                                                                p
                                                                  .main_attributes[0]
                                                                  .value ===
                                                                mainVariant
                                                            )
                                                          );
                                                        }
                                                      }}
                                                      sx={{ mt: "-35px" }}
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
                                              ) : mainVariant ===
                                                showSideVariant ? (
                                                <Grid
                                                  xs={
                                                    window.innerWidth > 855
                                                      ? 8
                                                      : 6
                                                  }
                                                  display="flex"
                                                  flexWrap="wrap"
                                                  pl={0.5}
                                                  width="100%"
                                                >
                                                  {sideVariants.map(
                                                    (variants) => {
                                                      return (
                                                        <Grid
                                                          md={5.2}
                                                          xs={12}
                                                          m={0.2}
                                                          mt={4.25}
                                                          style={{
                                                            border:
                                                              "1px solid #DCDCDC",
                                                            borderRadius: "8px",
                                                            width: "100%",
                                                            height: "110px",
                                                          }}
                                                        >
                                                          <Grid
                                                            xs={12}
                                                            sx={{
                                                              width: "100%",
                                                              marginTop:
                                                                "-15px",
                                                              marginLeft:
                                                                "10px",
                                                            }}
                                                          >
                                                            <Typography
                                                              sx={{
                                                                width: "100%",
                                                                backgroundColor:
                                                                  "white",
                                                                padding: "2px",
                                                              }}
                                                              variant="h27"
                                                              color="G1.main"
                                                            >
                                                              {variants.sku}
                                                            </Typography>
                                                          </Grid>
                                                          <Grid
                                                            container
                                                            xs={12}
                                                            display="flex"
                                                            flexDirection="column"
                                                            justifyContent="center"
                                                            p={1}
                                                            pt={0}
                                                          >
                                                            <Grid display="flex">
                                                              <FormControl>
                                                                <FormGroup>
                                                                  <FormControlLabel
                                                                    control={
                                                                      <Checkbox
                                                                        color="P"
                                                                        checked={
                                                                          selectedProductVarient.indexOf(
                                                                            variants.id
                                                                          ) > -1
                                                                        }
                                                                        onChange={(
                                                                          e
                                                                        ) => {
                                                                          handleChangeVarient(
                                                                            e,
                                                                            product,
                                                                            product.products,
                                                                            mainVariant
                                                                          );
                                                                          setIsVariant(
                                                                            true
                                                                          );
                                                                        }}
                                                                        value={
                                                                          variants.id
                                                                        }
                                                                        style={{
                                                                          padding:
                                                                            "20px",
                                                                          paddingTop:
                                                                            "10px",
                                                                        }}
                                                                        sx={{
                                                                          color:
                                                                            selectedProductVarient.indexOf(
                                                                              variants.id
                                                                            ) >
                                                                              -1
                                                                              ? "P.main"
                                                                              : "GrayLight3.main",
                                                                        }}
                                                                      />
                                                                    }
                                                                    label={""}
                                                                  />
                                                                </FormGroup>
                                                              </FormControl>
                                                              <Grid
                                                                xs={12}
                                                                mt={"5px"}
                                                                display="flex"
                                                                flexDirection="column"
                                                              >
                                                                <Typography
                                                                  variant="h15"
                                                                  color="G1.main"
                                                                  pt={1}
                                                                >
                                                                  Unit Price:{" "}
                                                                  {numberWithCommas(
                                                                    variants.price
                                                                  )}
                                                                </Typography>
                                                                <Typography
                                                                  variant="h15"
                                                                  color="G1.main"
                                                                  pt={1}
                                                                  alignItems="end"
                                                                >
                                                                  Available in
                                                                  Stock:{" "}
                                                                  {
                                                                    variants.stock
                                                                  }
                                                                </Typography>

                                                                <Grid
                                                                  display="flex"
                                                                  xs={12}
                                                                  pt={1}
                                                                  flexWrap="wrap"
                                                                >
                                                                  {variants.tags
                                                                    .length !=
                                                                    0 ? (
                                                                    <SellIcon color="P" />
                                                                  ) : (
                                                                    ""
                                                                  )}
                                                                  {variants.tags
                                                                    ? variants.tags.map(
                                                                      (
                                                                        tag,
                                                                        index
                                                                      ) => {

                                                                        let flagAttribute =
                                                                          "";
                                                                        let title =
                                                                          "";
                                                                        list.map(
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
                                                                        list[
                                                                          flagAttribute
                                                                        ]
                                                                          ? list[
                                                                            flagAttribute
                                                                          ]
                                                                            .title !==
                                                                            null ||
                                                                            list[
                                                                              flagAttribute
                                                                            ]
                                                                              .length !==
                                                                            0 ||
                                                                            list[
                                                                              flagAttribute
                                                                            ]
                                                                              .title !==
                                                                            undefined ||
                                                                            list[
                                                                              flagAttribute
                                                                            ]
                                                                              .title !==
                                                                            ""
                                                                            ? (title =
                                                                              list[
                                                                                flagAttribute
                                                                              ]
                                                                                .title)
                                                                            : (title =
                                                                              "null")
                                                                          : (title =
                                                                            "null");

                                                                        return index <=
                                                                          1 ? (
                                                                          index ==
                                                                            0 ? (
                                                                            <Typography
                                                                              variant="h15"
                                                                              color="G2.main"
                                                                            >
                                                                              {title +
                                                                                (variants
                                                                                  .tags
                                                                                  .length ==
                                                                                  1
                                                                                  ? ""
                                                                                  : ",")}
                                                                            </Typography>
                                                                          ) : (
                                                                            <Typography
                                                                              variant="h15"
                                                                              color="G2.main"
                                                                            >
                                                                              {title.substring(
                                                                                0,
                                                                                10
                                                                              ) +
                                                                                (index ==
                                                                                  1 &&
                                                                                  "") +
                                                                                "..."}
                                                                            </Typography>
                                                                          )
                                                                        ) : (
                                                                          ""
                                                                        );
                                                                      }
                                                                    )
                                                                    : ""}
                                                                </Grid>
                                                              </Grid>


                                                            </Grid>
                                                          </Grid>
                                                        </Grid>
                                                      );
                                                    }
                                                  )}
                                                </Grid>
                                              ) : (
                                                ""
                                              )}
                                              {indexVariant ===
                                                mainVariants.length - 1 ? (
                                                ""
                                              ) : (
                                                <Grid
                                                  xs={12}
                                                  display={
                                                    showSideVariant === ""
                                                      ? ""
                                                      : mainVariant ===
                                                        showSideVariant
                                                        ? "none"
                                                        : ""
                                                  }
                                                  sx={{
                                                    borderBottom:
                                                      "1px dashed #CB929B",
                                                    margin:
                                                      "30px 100px 0 100px",
                                                  }}
                                                ></Grid>
                                              )}
                                            </Grid>
                                          );
                                        }
                                      )}
                                    </Grid>
                                  </Scrollbars>
                                </Paper>
                              ) : showDetail === "" ? (
                                ""
                              ) : (
                                ""
                              )}
                            </>
                          );
                        })}
                      </Grid>
                    </Scrollbars>
                  </DialogContent>

                  <DialogActions sx={{ backgroundColor: "G3.main" }}>
                    <Grid
                      item
                      xs={12}
                      pr={2}
                      display="flex"
                      flexDirection="column"
                      justifyContent="end"
                      textAlign="end"
                      height="70px"
                      left="0px"
                      right="0px"
                      overflow="hidden"
                    >
                      <Grid display="flex" justifyContent="end">
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
                          onClick={addTagToProduct}
                        >
                          Add
                        </Button>
                      </Grid>
                    </Grid>
                  </DialogActions>
                </Dialog>
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
                      Are you sure you want to delete {selectedTag.title} ?
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
                      onClick={deleteTag}
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

              </Grid>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <AddTag edit={isEdit} selectedTag={selectedTag} />
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

export default Tag;
