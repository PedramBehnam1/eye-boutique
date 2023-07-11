import React, { useEffect, useState } from "react";
import axiosConfig from "../../../axiosConfig";
import "../../../asset/css/adminPage/addColor.css";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import Menu from "@mui/material/Menu";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import CardMedia from "@mui/material/CardMedia";
import Card from "@mui/material/Card";
import { Checkbox, DialogActions, DialogContent, DialogTitle, FormControlLabel, FormGroup, ListItemIcon, ListItemText, Snackbar } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DeleteIcon from '@mui/icons-material/Delete';
import No_Product_Image from "../../../asset/images/No-Product-Image-v2.png";
import SellIcon from '@mui/icons-material/Sell';
import FilterListIcon from '@mui/icons-material/FilterList';
import Check from '@mui/icons-material/Check';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Scrollbars from "react-custom-scrollbars-2";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';



const AddTag = (props) => {
  const [open, setOpen] = useState(false);
  const [list, setList] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(props.edit);
  const [openProduct, setOpenProduct] = useState(false);
  const [products, setProducts] = useState([]);
  const [numberOfPage, setNumberOfPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [selectedProductArray, setSelectedProductArray] = useState([]);
  const [selectedProductVarientArray, setSelectedProductVarientArray] = useState([]);
  const [selectedProductVarients, setSelectedProductVarients] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('category_id');
  const [nameFilter, setNameFilter] = useState('');
  const [newTagName, setNewTagName] = useState('');
  const [newTagCode, setNewTagCode] = useState('');
  const [newTagDescription, setNewTagDescription] = useState('');
  const [selectedProductArrayEdit, setSelectedProductArrayEdit] = useState([]);
  const [selectedProductVarientArrayEdit, setSelectedProductVarientArrayEdit] = useState([]);
  const [editedFlag, setEditedFlag] = useState(false);
  const [selectedProductVarient, setSelectedProductVarient] = useState([]);
  const [_selectedProductVarient, set_SelectedProductVarient] = useState([]);
  const [isVariant, setIsVariant] = useState('');
  const [trigger, setTrigger] = useState('');
  const [expanded, setExpanded] = useState(true)
  const [isClicked, setIsClicked] = useState(false)
  const [anchorElFilter, setAnchorElFilter] = useState(null);
  const openFilter = Boolean(anchorElFilter);
  const [categoryFilterTypes, setCategoryFilterTypes] = useState([]);
  const [categoryFilterName, setCategoryFilterName] = useState('all');
  const [anchorElSort, setAnchorElSort] = useState(null);
  const openSort = Boolean(anchorElSort);
  const [sortFilterType, setSortFilterType] = useState('date');
  const [sort, setSort] = useState('date_sort=-1');
  const [showDetail, setShowDetail] = useState('');
  const [showSideVariant, setShowSideVariant] = useState('');
  const [fixDiv, setFixDiv] = useState(false);
  const [mainVariants, setMainVariants] = useState([]);
  const [selectedMainVariants, setSelectedMainVariants] = useState([]);
  const [_selectedMainVariants, set_SelectedMainVariants] = useState([]);
  const [sideVariants, setSideVariants] = useState([]);
  const [openMassage, setOpenMassage] = useState(false);
  const [showMassage, setShowMassage] = useState('');

  const bread = [
    {
      title: "Tag",
      href: "/admin/tag",
    },
  ];

  useEffect(() => {
    refreshList();
    productList();
    getProduct()
  }, [categoryFilter, nameFilter]);

  const productList = () => {
    axiosConfig.get(`/admin/product/all?limit=1000&page=1&language_id=1&status=1&${categoryFilter}&name=`
    )
      .then((res) => {
        let products = res.data.products;
        if (nameFilter != '') {
          products = products.filter(p => p.name.includes(nameFilter))
        }
        setProducts(products);
        setNumberOfPage(res.data?.total_pages);
      });
  };

  const refreshList = () => {
    axiosConfig
      .get("/admin/label/all")
      .then((res) => {
        setLoading(false);
        setList(res.data.labels);
      })
      .catch((error) => {
        setShowMassage('Get all label have a problem!')
        setOpenMassage(true)            
      });
  };

  const handleClickOpenDialogProducts = (inHeader) => {

    setOpen(true);
    setOpenProduct(true);
  };

  const addTagToProduct = async () => {
    setIsClicked(true);
    let selectedProducts;
    let selectedProductsVarients;
    let selectedVarients1 = [];

    if (isEdit) {
      selectedProducts = [...selectedProductArrayEdit, ...selectedProductArray];
      selectedProductsVarients = [...selectedProductVarientArrayEdit, ...selectedProductVarientArray, ..._selectedProductVarient];
    } else {
      selectedProducts = [...selectedProductArray]
      selectedProductsVarients = [...selectedProductVarientArray, ..._selectedProductVarient]
    }


    for (let i = 0; i < products.length; i++) {
      for (let j = 0; j < selectedProduct.length; j++) {
        if (products[i].id === selectedProduct[j]) {
          if (isEdit) {
            selectedProducts[selectedProducts.length] = { ...products[i] }
          } else {
            selectedProducts[selectedProducts.length] = { ...products[i] }
          }

        }
      }

      let variants = products[i].products
      for (let j = 0; j < selectedProductVarient.length; j++) {
        for (let k = 0; k < variants.length; k++) {
          if (variants[k].id == selectedProductVarient[j]) {
            if (isEdit) {
              selectedProductsVarients[selectedProductsVarients.length] = { ...variants[k] }
            } else {
              selectedProductsVarients[selectedProductsVarients.length] = { ...variants[k] }
            }
          }

        }

      }
    }

    let duplicateId = [];
    let variants = [...selectedVarients1];
    let _variants = [...selectedVarients1];


    await products.map(p => {
      let numberOfVarient = 0;
      let product_group_id = '';
      p.products.map(async v => {
        await selectedProductsVarients.map(vArray => {
          if (vArray.id == v.id) {
            variants = variants.filter(s => s.id !== v.id)
            variants.push(p.products.find(varient => varient.id == v.id))
            _variants = _variants.filter(s => s.id !== v.id)
            _variants.push(p.products.find(varient => varient.id == v.id))
          }
        })
        variants.map(vArray => {
          if (vArray.id === v.id) {
            numberOfVarient = numberOfVarient + 1;
          }
        })

        if (numberOfVarient % p.products.length == 0) {
          await p.products.map(v => {
            variants.map(selectedV => {
              if (v.id == selectedV.id) {
                product_group_id = selectedV.product_group_id;
                variants = variants.filter(s => s.id !== v.id)
              }
            })
          })
          if (product_group_id != '') {
            selectedProducts = selectedProducts.filter(s => s.id !== product_group_id)
            selectedProducts.push(products.find(p => p.id == product_group_id))
          }
        }
      })

    })

    set_SelectedProductVarient([..._variants])
    setSelectedProductArray(selectedProducts);
    setSelectedProductVarientArray(variants);
    setSelectedProduct([])
    setSelectedProductVarient([])
    setEditedFlag(true)
    setOpen(false);
    setOpenProduct(false);
    set_SelectedMainVariants([..._selectedMainVariants, ...selectedMainVariants])
    setSelectedMainVariants([])
  };


  const isLoading = () => {
    return (
      <Grid item xs={12} mt={2} mb={2} display="flex" justifyContent="center">
        <CircularProgress color="P" />
      </Grid>
    );
  };

  const handleChange = (e, variants, i) => {

    const index = selectedProduct.indexOf(parseInt(e.target.value))
    if (index === -1) {
      setSelectedProduct([...selectedProduct, parseInt(e.target.value)])
    } else {
      setSelectedProduct(selectedProduct.filter(s => s !== parseInt(e.target.value)))
    }
    let selectedVarients = [...selectedProductVarient];
    let productVarients = [...selectedProductVarients];
    variants.map((variant) => {
      const index1 = selectedVarients.indexOf(parseInt(variant.id))
      if (index1 === -1 && index === -1) {
        selectedVarients.push(parseInt(variant.id))
        productVarients.push(parseInt(variant.id))
      } else if (index1 != -1 && index != -1) {
        selectedVarients = selectedVarients.filter(s => s !== parseInt(variant.id))
        productVarients = productVarients.filter(s => s !== parseInt(variant.id))

      }
      setTrigger(trigger + 1)
    })
    setSelectedProductVarient(selectedVarients);
    setSelectedProductVarients(productVarients);

    const mainVariantsArray = []

    products[i].products.map(p => {
      if (mainVariantsArray.length !== 0) {
        if (mainVariantsArray.find(m => m === p.main_attributes[0].value)) {
        } else {
          mainVariantsArray.push(p.main_attributes[0].value)
        }
      } else {
        mainVariantsArray.push(p.main_attributes[0].value)
      }
    })

    if (index === -1) {

      setSelectedMainVariants([...selectedMainVariants, ...mainVariantsArray])
    } else {
      let mainVariantsArray2 = [...selectedMainVariants];
      mainVariantsArray.map(mVariant => {
        const index = mainVariantsArray2.indexOf(mVariant)
        if (index != -1) {
          mainVariantsArray2 = mainVariantsArray2.filter(mainVariant => mainVariant != mVariant)
        }
      })

      setSelectedMainVariants([...mainVariantsArray2])
    }
  };

  const handleCloseDialog = () => {
    setSelectedProduct([])
    setSelectedProductVarient([])
    setOpenProduct(false);
    setSelectedProduct('')
  };




  const addNewTag = () => {
    let product_group_ids = [];
    let product_ids = [];

    selectedProductArray.map(p => {
      product_group_ids.push(p.id);
    })
    _selectedProductVarient.map(v => {
      product_ids.push(v.id);
    })


    const newTagObj = {
      title: newTagName,
      code: newTagCode,
      description: newTagDescription,
      product_group_ids: product_group_ids,
      product_ids: product_ids
    }

    const editedTagObj = {
      title: newTagName === '' ? props.selectedTag.title : newTagName,
      code: newTagCode === '' ? props.selectedTag.code : newTagCode,
      description: newTagDescription === '' ? props.selectedTag.description : newTagDescription,
    }

    const editedProductObj = {
      label_id: props.selectedTag.id,
      product_group_ids: product_group_ids,
      product_group_ids_for_deletion: [],
      product_ids: product_ids,
      product_ids_for_deletion: [],
    }

    if (isEdit) {
      axiosConfig.put(`/admin/label/${props.selectedTag.id}`, editedTagObj)
        .then(res => {
          axiosConfig.post("/admin/label/assign", editedProductObj)
            .then(res => window.location.reload())


        })
    } else {
      axiosConfig.post('/admin/label/add', newTagObj)
        .then(res => {
          window.location.reload()
        })
    }

  }

  const handlechangeSearch = (e) => {
    setNameFilter(e.target.value)
  }

  const getProduct = () => {
    const productsId = [];
    if (props.selectedTag != undefined) {
      axiosConfig.get(`/admin/label/get_products?label_id=${props.selectedTag.id}`)
        .then(res => {
          if (isEdit) {
            let product_group_list = res.data.product_group_list;
            setSelectedProductArray(product_group_list);
            set_SelectedProductVarient(res.data.variants_list)
            setSelectedProductVarients(res.data.variants_list);
            let varients = [...res.data.variants_list];
            product_group_list.map(p => {
              p.products.map(variant => {
                varients = varients.filter(v => v.id != variant.id);
              })
            })


            setSelectedProductVarientArray(varients)
            res.data.product_group_list.map((product) => {
              productsId.push(product.id)
            })
          }
        })
    }
    if (!isEdit) {
      setSelectedProduct(productsId)
    }
  }


  const handleChangeVarient = (e, product, allVariants, mainVariants, mainVariant) => {
    setIsVariant(true)
    setTrigger(trigger + 1)
    let selectedProductV = [...selectedProductVarient]
    let index = selectedProductVarient.indexOf(parseInt(e.target.value))
    if (index === -1) {
      setSelectedProductVarient([...selectedProductVarient, parseInt(e.target.value)])
      setSelectedProductVarients([...selectedProductVarients, parseInt(e.target.value)])
      selectedProductV.push(parseInt(e.target.value))
    } else {
      setSelectedProductVarient(selectedProductVarient.filter(s => s !== parseInt(e.target.value)))
      setSelectedProductVarients(selectedProductVarients.filter(s => s !== parseInt(e.target.value)))
      selectedProductV = selectedProductV.filter(s => s !== parseInt(e.target.value))
    }
    index = 0;
    allVariants.map(v => {
      selectedProductV.map(selectedV => {
        if (v.id == selectedV) {
          index = index + 1;
        }
      })
    })
    const indexSelectedProduct = selectedProduct.indexOf(parseInt(product.id))
    if (indexSelectedProduct === -1 && allVariants.length == index) {
      setSelectedProduct([...selectedProduct, parseInt(product.id)])
    } else if (indexSelectedProduct != -1 && allVariants.length != index) {
      setSelectedProduct(selectedProduct.filter(s => s !== parseInt(product.id)))
    }

    index = 0;
    mainVariants.map(mVariant => {
      selectedProductV.map(selectedV => {
        if (mVariant.id == selectedV) {
          index = index + 1;
        }
      })
    })


    const indexSelectedMainVarient = selectedMainVariants.indexOf(mainVariant)
    if (indexSelectedMainVarient === -1 && mainVariants.length == index) {
      setSelectedMainVariants([...selectedMainVariants, mainVariant])
    } else if (indexSelectedMainVarient != -1 && mainVariants.length != index) {
      setSelectedMainVariants(selectedMainVariants.filter(mVariant => mVariant != mainVariant))
    }


  };


  const checkedProductIsSelected = (productId, variants) => {
    let result = true
    selectedProductArray.map(selectedP => {
      if (selectedP.id == productId && result) {
        result = false
      }
    })
    if (result) {
      let numberOfSelectedVarient = 0;

      variants.map(v => {
        selectedProductVarientArray.map(selectedV => {
          if (selectedV != null) {
            if (v.id == selectedV.id) {
              numberOfSelectedVarient = numberOfSelectedVarient + 1;
            }

          }
        })
      })


      if (numberOfSelectedVarient == 1 && numberOfSelectedVarient == variants.length) {
        result = false;
      }
    }
    return result;
  }
  const checkedVarientIsSelected = (varient) => {
    let result = true
    selectedProductVarientArray.map(selectedV => {
      if ((selectedV.id == varient.id && result)) {
        result = false
      }
    })
    if (result) {
      selectedProductArray.map(selectedP => {
        if (selectedP.id == varient.product_group_id && result) {
          result = false;
        }
      })
    }
    return result;
  }
  const deleteProductTag = async (product, variantId) => {
    let variants = [];
    if (variantId != '') {
      setSelectedProductVarients(selectedProductVarients.filter(varient => varient != variantId));
      setSelectedProductVarientArray(selectedProductVarientArray.filter(selectedV => selectedV.id != variantId))
      let variant2 = ''
      products.map(p => {
        p.products.map(v => {
          if (v.id == variantId) {
            variant2 = v;
          }
        })
      })

      set_SelectedMainVariants(_selectedMainVariants.filter(v => v != variant2.main_attributes[0].value))
    } else if (product != '') {
      let selectedVarients = [...selectedProductVarients]
      await product.products.map(async v => {
        await selectedVarients.map(selectedV => {
          if (selectedV == v.id) {

            selectedVarients = selectedVarients.filter(varient => varient != v.id);
          }
        })

        variants.push(v.id)
      })


      setSelectedProductVarients(selectedVarients)
      setSelectedProductArray(selectedProductArray.filter(p => p.id != product.id))

      axiosConfig.get(`/admin/product/all?limit=1000&page=1&language_id=1&status=1&${categoryFilter}&name=${nameFilter}`
      )
        .then((res) => {
          const mainVariantsArray = []
          const sideVariants = []
          let product1 = res.data.products.find(p => p.id == product.id)
          product1.products.map(p => {
            if (mainVariantsArray.length !== 0) {
              if (mainVariantsArray.find(m => m === p.main_attributes[0].value)) {
              } else {
                mainVariantsArray.push(p.main_attributes[0].value)
              }
            } else {
              mainVariantsArray.push(p.main_attributes[0].value)
            }
          })
          let _mainVariantsArray = [..._selectedMainVariants]
          mainVariantsArray.map(mainVariant => {
            _mainVariantsArray = _mainVariantsArray.filter(selectedMainVariant => selectedMainVariant != mainVariant)
          })
          set_SelectedMainVariants(_mainVariantsArray)
        });
    }

    let temp = {};
    if (isEdit) {
      if (variantId != '') {
        temp = {
          label_id: props.selectedTag.id,
          product_group_ids: [],
          product_group_ids_for_deletion: [],
          product_ids: [],
          product_ids_for_deletion: [variantId],
        };
      } else {
        temp = {
          label_id: props.selectedTag.id,
          product_group_ids: [],
          product_group_ids_for_deletion: [product.id],
          product_ids: [],
          product_ids_for_deletion: variants,
        };
      }

    }

    axiosConfig.post("/admin/label/assign", temp).then((response) => {
      if (response.data.status) {
        refreshList();
      }
    });

  }


  const countMainVariant = (index) => {
    const mainVariantsArray = [];
    products[index].products.map(p => {
      if (mainVariantsArray.length !== 0) {
        if (mainVariantsArray.find(m => m === p.main_attributes[0].value)) {
        } else {
          mainVariantsArray.push(p.main_attributes[0].value)
        }
      } else {
        mainVariantsArray.push(p.main_attributes[0].value)
      }
    })
    return mainVariantsArray.length
  }




  const handleChangeMainVarient = (mainVariant, variants, product) => {
    setTrigger(trigger + 1)
    setIsVariant(false)
    let index = selectedMainVariants.indexOf(mainVariant)

    if (index === -1) {
      setSelectedMainVariants([...selectedMainVariants, mainVariant])
    } else {
      setSelectedMainVariants(selectedMainVariants.filter(s => s !== mainVariant))
    }

    let selectedVarients = [...selectedProductVarient];
    let productVarients = [...selectedProductVarients];
    variants.map((variant) => {
      const index1 = selectedVarients.indexOf(parseInt(variant.id))
      if (index1 === -1 && index === -1) {
        selectedVarients.push(parseInt(variant.id))
        productVarients.push(parseInt(variant.id))
      } else if (index1 != -1 && index != -1) {
        selectedVarients = selectedVarients.filter(s => s !== parseInt(variant.id))
        productVarients = productVarients.filter(s => s !== parseInt(variant.id))

      }
      setTrigger(trigger + 1)
    })
    setSelectedProductVarient(selectedVarients);
    setSelectedProductVarients(productVarients);

    index = 0;
    product.products.map(v => {
      selectedVarients.map(selectedV => {
        if (v.id == selectedV) {
          index = index + 1;
        }
      })
    })

    const indexSelectedProduct = selectedProduct.indexOf(parseInt(product.id))
    if (indexSelectedProduct === -1 && product.products.length == index) {
      setSelectedProduct([...selectedProduct, parseInt(product.id)])
    } else if (indexSelectedProduct != -1 && product.products.length != index) {
      setSelectedProduct(selectedProduct.filter(s => s !== parseInt(product.id)))
    }

  };


  const seterTotalPrice = (varArray) => {
    let totalPrice = 0;
    let total = 0;
    varArray.map(v => {
      total = parseInt(v.stock) * parseFloat(v.price)
      totalPrice = totalPrice + total
    })
    return numberWithCommas(totalPrice)

  }

  function numberWithCommas(n) {
    var parts = n.toString().split(".");
    return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1].charAt(0) + (parts[1].charAt(1) ? parts[1].charAt(1) : '0') : ".00") + ' KWD';
  }

  const seterTotalStockVariant = (varArray) => {
    let totalStock = 0;
    let total = 0;
    varArray.map((v) => {
      total = parseInt(v.stock)
      totalStock = parseInt(totalStock) + total
    })
    return totalStock
  }


  const checkMainVarient = (mVariant) => {
    let result = true
    _selectedMainVariants.map(mainVariant => {
      if (mVariant == mainVariant && result) {
        result = false
      }
    })
    return result
  }

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenMassage(false);
  };
  return (
    <Grid breadcrumb={bread} pageName="Add Tag" >
      {loading ? (
        isLoading()
      ) : (
        <Grid xs={12} md={12} container spacing={2} className="main" mt={-3}>
          <Grid item xs={12} md={12} className="box boxItem">
            <Accordion defaultExpanded={true}
              className="accordionMain" sx={{width:'100%'}}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Grid item xs={12} className="numberAndTitle">
                  <Typography
                    align="center"
                    attribute="menuitem"
                    mt={0.5}
                    variant='menuitem'
                    color="Black.main"
                    fontWeight='bold'
                  >
                    Basic Informtion
                  </Typography>
                </Grid>
              </AccordionSummary>

              <AccordionDetails className="boxTitle">
                <Grid xs={12} md={12} display='flex' flexWrap='wrap'>
                  <Grid item xs={window.innerWidth > 750 ? 6 : 12} p={1}>
                    <TextField
                      label="Name Tag"
                      id="outlined-start-adornment"
                      fullWidth
                      color="P"
                      onChange={(e) => {
                        setNewTagName(e.target.value)
                      }}
                      defaultValue={isEdit ? props.selectedTag.title : ''}
                    />
                  </Grid>
                  <Grid item xs={window.innerWidth > 750 ? 6 : 12} p={1}>
                    <TextField
                      label="Code"
                      id="outlined-start-adornment"
                      fullWidth
                      color="P"
                      onChange={(e) => {
                        setNewTagCode(e.target.value)
                      }}
                      defaultValue={isEdit ? props.selectedTag.code : ''}
                    />
                  </Grid>

                </Grid>
                <Grid item xs={12} p={1}>
                  <TextField
                    label="Description"
                    id="outlined-start-adornment"
                    fullWidth
                    color="P"
                    onChange={(e) => {
                      setNewTagDescription(e.target.value)
                    }}
                    defaultValue={isEdit ? props.selectedTag.description : ''}
                  />
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
          <Grid item xs={12} md={12} className="box boxItem">
            <Accordion elevation={0} defaultExpanded={expanded} expanded={expanded} className="accordionMain" sx={{width:'100%'}}>
              <AccordionSummary
                expandIcon={
                  <IconButton sx={{ ml: -1 }} onClick={() => { setExpanded(!expanded) }}><ExpandMoreIcon /></IconButton>}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Grid item xs={12} className="numberAndTitle">
                  <Grid xs={12} display='flex' justifyContent='space-between' >
                    <Typography
                      align="center"
                      attribute="menuitem"
                      mt={0.5}
                      variant='menuitem'
                      color="Black.main"
                      fontWeight='bold'
                    >
                      Products
                    </Typography>
                    <Button
                      onClick={() => handleClickOpenDialogProducts(true)}
                      variant="contained"
                      color="P"
                      style={{ color: "white" }}
                      sx={{ mr: 2 }}
                      startIcon={<AddIcon />}
                    >
                      Add Products
                    </Button>
                  </Grid>

                </Grid>
              </AccordionSummary>

              <AccordionDetails className="boxTitle">
                <Grid item xs={12}>
                  {(selectedProductArrayEdit.length === 0 && selectedProductArray.length === 0) && (selectedProductVarientArrayEdit.length == 0 && selectedProductVarientArray.length == 0) ? (
                    <Grid
                      xs={12}
                      display="flex"
                      direction="column"
                      justifyContent="center"
                      alignItems='center'
                      minHeight={300}

                    >
                      <Typography variant="h2" pb={1} color="G1.main">
                        No products added
                      </Typography>
                      <Grid>
                        <Button
                          onClick={() => handleClickOpenDialogProducts(false)}
                          variant="contained"
                          color="P"
                          style={{ color: "white" }}
                          startIcon={<AddIcon />}
                        >
                          Add Products
                        </Button>

                      </Grid>
                    </Grid>
                  ) : (
                    <>
                      <Grid xs={12} display='flex' flexWrap='wrap' >
                        {(isEdit ? (selectedProductArray.length == 0 ? [...selectedProductArrayEdit] : [...Object.values(selectedProductArray)]) : selectedProductArray).map((product) => {
                          return (
                            <Grid xs={5.8} display='flex' p={2} m={1} border={1} borderColor='G3.main'>
                              {product === undefined ? '' :
                                <>
                                  <Grid xs={11} display='flex'>
                                    <Card sx={{ maxWidth: 82, border: 'none', boxShadow: 'none' }}>
                                      <CardMedia
                                        component="img"
                                        height="82"
                                        className="image"
                                      />
                                    </Card>
                                    <Grid>
                                      <Grid mt={1.5}>
                                        <Typography
                                          ml={2}
                                          color="black"
                                          variant="h11"
                                        >
                                          {product.name !== undefined && product.name}
                                        </Typography>
                                      </Grid>

                                      <Grid ml={2} mt={1} display='flex' >
                                        {(product.products.length !== 0 && product.products[0].attributes !== undefined) &&

                                          <>
                                            {product.products[0].attributes === undefined ? '' :
                                              product.products[0].attributes.find(b => b.name.toLowerCase() === "brand"
                                                || b.name === "brand_contact_lens_color"
                                                || b.name === 'brand_contact_lens_single_toric') ? <>
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
                                        {product.category_id != null &&
                                          <>
                                            {JSON.parse(localStorage.getItem('categories')).map(element => {
                                              if (product.category_id === element.id) {
                                                return (
                                                  <Grid>
                                                    <Divider orientation="vertical" flexItem />

                                                    <Typography style={{
                                                      whiteSpace: 'nowrap',
                                                      width: '80px',
                                                      overflow: 'hidden',
                                                      textOverflow: 'ellipsis'
                                                    }} variant='h10' pl={1} pr={1} sx={{ color: 'G1.main' }}>
                                                      {element.name}
                                                    </Typography>
                                                  </Grid>
                                                )
                                              }
                                            })}
                                          </>
                                        }

                                        < Divider orientation="vertical" flexItem />
                                        <Typography variant='h10' pl={1} pr={1} sx={{ color: 'G1.main' }}>
                                          {(product.products).length} Types
                                        </Typography>
                                        <Divider orientation="vertical" flexItem />
                                        <Typography variant='h10' pl={1} pr={1} sx={{ color: 'G1.main' }}>
                                          product group
                                        </Typography>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                  <Grid xs={1}>

                                    <IconButton>
                                      <DeleteIcon onClick={() => deleteProductTag(product, "")} />
                                    </IconButton>

                                  </Grid>
                                </>
                              }
                            </Grid>

                          )

                        })}



                        {(isEdit ? [...selectedProductVarientArrayEdit, ...Object.values(selectedProductVarientArray)] : selectedProductVarientArray).map((variant) => {

                          let product = variant != null ? products.find(b => b != undefined && (b.category_id === variant.category_id)) : undefined;
                          return (
                            product != undefined ?
                              (<Grid xs={5.8} display='flex' p={2} m={1} border={1} borderColor='G3.main'>
                                {(variant === undefined || variant == null) ? '' :
                                  <>
                                    <Grid xs={11} display='flex'>
                                      <Grid>
                                        <Grid mt={1.5}>
                                          <Typography
                                            ml={2}
                                            color="black"
                                            variant="h11"
                                          >
                                            {variant.sku}
                                          </Typography>
                                        </Grid>

                                        <Grid ml={2} mt={1} display='flex' >
                                          <Typography variant='h10' pl={1} pr={1} sx={{ color: 'G1.main' }}>
                                            4232-1192
                                          </Typography>
                                          {(variant.attributes !== undefined) &&
                                            <>
                                              <Divider orientation="vertical" flexItem />
                                              {variant.attributes.find(b => b.name === "brand"
                                                || b.name === "brand_contact_lens_color"
                                                || b.name === 'brand_contact_lens_single_toric') ? <>
                                                <Divider orientation="vertical" flexItem />
                                                <Typography variant='h10' pl={1} pr={1} sx={{ color: 'G1.main' }}>

                                                  {
                                                    variant.attributes.find(b => b.name === "brand"
                                                      || b.name === "brand_contact_lens_color"
                                                      || b.name === 'brand_contact_lens_single_toric').value
                                                  }
                                                </Typography >
                                              </>
                                                : ''}
                                              <Divider orientation="vertical" flexItem />
                                              <Typography variant='h10' pl={1} pr={1} sx={{ color: 'G1.main' }}>
                                                {variant.attributes.find(b => b.name === "gender") ? variant.attributes.find(b => b.name === "gender").value : 'Unisex'}
                                              </Typography >
                                            </>
                                          }
                                          {variant.category_id != null &&
                                            <>
                                              <Divider orientation="vertical" flexItem />
                                              {JSON.parse(localStorage.getItem('categories')).map(element => {
                                                if (variant.category_id === element.id) {
                                                  return element != undefined ? (
                                                    <Typography style={{
                                                      whiteSpace: 'nowrap',
                                                      width: '80px',
                                                      overflow: 'hidden',
                                                      textOverflow: 'ellipsis'
                                                    }} variant='h10' pl={1} pr={1} sx={{ color: 'G1.main' }}>
                                                      {element != undefined ? element.name : ''}
                                                    </Typography>
                                                  ) : ""
                                                }
                                              })}
                                            </>
                                          }

                                          {product !== undefined ? (product.name !== undefined ?
                                            <Grid display='flex'>
                                              <Divider orientation="vertical" flexItem />
                                              <Typography variant='h10' pl={1} pr={1} sx={{ color: 'G1.main' }}>
                                                {product.name}
                                              </Typography>
                                            </Grid>

                                            : "") : ""}
                                          <Divider orientation="vertical" flexItem />
                                          <Typography variant='h10' pl={1} pr={1} sx={{ color: 'G1.main' }}>
                                            variant
                                          </Typography>
                                        </Grid>

                                      </Grid>
                                    </Grid>
                                    <Grid xs={1}>

                                      <IconButton>
                                        <DeleteIcon onClick={() => deleteProductTag("", variant.id)} />
                                      </IconButton>

                                    </Grid>
                                  </>
                                }
                              </Grid>)
                              :
                              ""


                          )

                        })}
                      </Grid>
                      <Grid xs={12} display='flex' flexWrap='wrap' >

                      </Grid>

                    </>
                  )}
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
          <Grid item xs={12} md={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="outlined"
              color="G1"
              onClick={() => window.location.reload()}
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
              onClick={addNewTag}
              disabled={isEdit ? newTagCode === '' && newTagDescription === '' && newTagName === '' && !editedFlag ? true : false : newTagCode === '' || newTagDescription === '' || newTagName === '' ? true : false}
            >
              Save
            </Button>
          </Grid>
          <Dialog
            fullWidth
            maxWidth="md"
            xs={12}
            open={openProduct}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            onClose={handleCloseDialog}

          >
            <DialogTitle sx={{ bgcolor: "G3.main", ml: 0, mr: 0, pr: 0, pl: 0 }}>
              <Grid
                bgcolor="G3.main"
                ml="15px"
                mr="15px"
                sx={{ backgroundColor: 'G3.main' }}>
                <Paper item md={12} className='box' elevation={0}
                  top='0' left='0' right='0' overflow='hidden'
                  height='65px' borderColor='white' sx={[{ border: "0px solid white", pl: '10px', display: 'flex', flexDirection: window.innerWidth > 616 ? 'row' : 'column' }, window.innerWidth > 616 && { display: 'flex', justifyContent: 'space-between' }]}

                >
                  <Grid item md={6.5} display='flex' alignItems='center' pl="17px">
                    <Typography variant='menutitle'>Add Product</Typography>
                  </Grid>

                  <Grid display='flex'>
                    <Grid xs={11} display='flex' alignItems="center" justifyContent='end'>
                      <Paper
                        component="form"

                        sx={{
                          backgroundColor: 'GrayLight2.main',
                          p: "2px 4px",
                          borderRadius: 3,
                          display: "flex",
                          alignItems: "center",
                          maxWidth: "300px",
                          height: '33px',
                          justifyContent: 'space-between',
                          boxShadow: 'none'
                        }}

                      >

                        <IconButton sx={{ p: "10px" }} aria-label="search" >
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
                            defaultValue={'name'}
                            label
                            sx={{
                              '&:hover': { background: 'none' }, '&:active': { background: 'none' }, '&:focus': { background: 'none' },
                              backgroundColor: 'GrayLight2.main', borderLeft: '1px dashed #9E9E9E', overflow: "hidden", height: "20px", top: 0, left: 1.6,
                              borderRadius: '0 0  10px 0', width: "100px", '.MuiSvgIcon-root': { color: 'G2.main', padding: '3px' }
                            }}
                          >
                            <MenuItem value={'name'}>
                              <Typography p={1} color='G2.main' variant='h15'>Name</Typography>
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </Paper>
                    </Grid>
                    <Grid xs={0.7} ml={"28px"} mr={"16px"} display='flex' justifyContent='center' alignItems='start'>
                      <IconButton aria-label="search"
                        aria-controls={openFilter ? 'demo-positioned-date-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={openFilter ? 'true' : undefined}

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
                          'aria-labelledby': 'basic-button',
                        }}
                        sx={{ width: '247px' }}
                      >
                        <MenuItem
                          onClick={() => {
                            setCategoryFilterTypes([]);
                            setCategoryFilterName('all');
                          }}
                          sx={{ width: '227px', padding: '5px 5px 5px 13px', color: 'G1.main' }}
                        >
                          {categoryFilterName === 'all' ?
                            <>
                              <ListItemIcon >
                                <Check color='P' sx={{ padding: '3px' }} />
                              </ListItemIcon>
                              <Typography ml={-1}>All</Typography>
                            </>
                            :
                            <ListItemText inset >
                              <Typography ml={-1}>All</Typography>
                            </ListItemText>
                          }
                        </MenuItem>
                        {JSON.parse(localStorage.getItem('categories')).map((cat) => {
                          return (
                            <MenuItem
                              onClick={() => {
                                setCategoryFilterTypes(cat.types);
                                setCategoryFilterName(cat.title);
                              }}
                              sx={{ padding: '5px 5px 5px 13px', color: 'G1.main' }}
                            >
                              {categoryFilterName === cat.title ?
                                <>
                                  <ListItemIcon >
                                    <Check color='P' sx={{ padding: '3px' }} />
                                  </ListItemIcon>
                                  <Typography ml={-1}>{cat.title}</Typography>
                                </>
                                :
                                <ListItemText inset >
                                  <Typography ml={-1}>{cat.title}</Typography>
                                </ListItemText>
                              }
                            </MenuItem>
                          )
                        })}
                        <Divider
                          sx={{ width: '60%', margin: 'auto', borderColor: 'P.main' }}
                        />
                        <MenuItem
                          aria-controls={openSort ? 'demo-positioned-date-menu' : undefined}
                          aria-haspopup="true"
                          aria-expanded={openSort ? 'true' : undefined}
                          onClick={(event) => setAnchorElSort(event.currentTarget)
                          }
                          sx={{ padding: '5px 5px 5px 13px', color: 'G1.main', }}
                        >
                          <ListItemIcon >
                            <ArrowBackIosIcon color='P' sx={{ padding: '3px' }} />
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
                          'aria-labelledby': 'basic-button',
                        }}
                        sx={{ width: '235px', marginTop: '-40px', marginLeft: '-206px', boxShadow: 'none' }}
                      >
                        <Typography color='G1.main' variant='h30' p={2}> Sort By</Typography>
                        <MenuItem
                          onClick={() => {
                            setSortFilterType('stock');
                          }}
                          sx={{ padding: '7px 5px 5px 13px', width: '235px', color: 'G1.main' }}
                        >
                          {sortFilterType === 'stock' ?
                            <>
                              <ListItemIcon >
                                <Check color='P' sx={{ padding: '3px' }} />
                              </ListItemIcon>
                              <Typography ml={-1}>Available in Stock</Typography>
                            </>
                            :
                            <ListItemText inset >
                              <Typography ml={-1}>Available in Stock</Typography>
                            </ListItemText>
                          }
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            setSortFilterType('date');
                          }}
                          sx={{ padding: '5px 5px 5px 13px', width: '235px', color: 'G1.main' }}
                        >
                          {sortFilterType === 'date' ?
                            <>
                              <ListItemIcon >
                                <Check color='P' sx={{ padding: '3px' }} />
                              </ListItemIcon>
                              <Typography ml={-1}>Date</Typography>
                            </>
                            :
                            <ListItemText inset >
                              <Typography ml={-1}>Date</Typography>
                            </ListItemText>
                          }
                        </MenuItem>

                        <Divider
                          sx={{ width: '60%', margin: 'auto', borderColor: 'P.main' }}
                        />
                        <Typography color='G1.main' variant='h30' p={2}> Sort Order</Typography>

                        <MenuItem
                          onClick={() => {
                            if (sortFilterType === 'price') {
                              setSort('price_sort=1');
                            } else if (sortFilterType === 'date') {
                              setSort('date_sort=1');
                            } else {
                              setSort('stock_sort=1')
                            }
                            setAnchorElSort(null)
                            setAnchorElFilter(null)
                          }}
                          sx={{ padding: '7px 5px 5px 13px', width: '235px', color: 'G1.main' }}
                        >
                          {sort.toString().split("=")[1] === '1' ?
                            <>
                              <ListItemIcon >
                                <Check color='P' sx={{ padding: '3px' }} />
                              </ListItemIcon>
                              <Typography ml={-1}>{sortFilterType === 'price' ? 'Low to high' : sortFilterType === 'date' ? 'Oldest first' : 'Low to high'}</Typography>
                            </>
                            :
                            <ListItemText inset >
                              <Typography ml={-1}>{sortFilterType === 'price' ? 'Low to high' : sortFilterType === 'date' ? 'Oldest first' : 'Low to high'}</Typography>
                            </ListItemText>
                          }
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            if (sortFilterType === 'price') {
                              setSort('price_sort=-1');
                            } else if (sortFilterType === 'date') {
                              setSort('date_sort=-1');
                            } else {
                              setSort('stock_sort=-1')
                            }
                            setAnchorElSort(null)
                            setAnchorElFilter(null)
                          }}
                          sx={{ padding: '5px 5px 5px 13px', width: '235px', color: 'G1.main' }}
                        >
                          {sort.toString().split("=")[1] === '-1' ?
                            <>
                              <ListItemIcon >
                                <Check color='P' sx={{ padding: '3px' }} />
                              </ListItemIcon>
                              <Typography ml={-1}>{sortFilterType === 'price' ? 'High to low' : sortFilterType === 'date' ? 'Newest first' : 'High to low'}</Typography>
                            </>
                            :
                            <ListItemText inset >
                              <Typography ml={-1}>{sortFilterType === 'price' ? 'High to low' : sortFilterType === 'date' ? 'Newest first' : 'High to low'}</Typography>
                            </ListItemText>
                          }
                        </MenuItem>
                      </Menu>
                    </Grid>

                  </Grid>

                </Paper>
              </Grid>
            </DialogTitle>

            <DialogContent sx={{ height: "5010px", bgcolor: "G3.main", ml: 0, mr: 0, pr: 0, pl: 0 }}>
              <Scrollbars
                style={{ backgroundColor: '#E0E0E0' }}
              >

                <Grid p={0} mt="7px" ml="15px" mr="15px" xs={12}
                  sx={{ backgroundColor: 'G3.main' }}
                  display='flex' flexDirection='column'
                  left='0px' right='0px'

                >
                  {products.map((product, index) => {
                    let totalStock = 0
                    let variants = product.products
                    return (
                      <>
                        <Paper fullWidth sx={{ mb: index === showDetail ? 0 : "4px" }} elevation={0}>
                          <Grid container >
                            <Grid item xs={12} md={12} display='flex' pl={"24px"} >
                              <FormControl disabled={!checkedProductIsSelected(product.id, product.products)}>
                                <FormGroup>

                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        color='P'
                                        checked={checkedProductIsSelected(product.id, product.products) ? selectedProduct.indexOf(product.id) > -1 : true}
                                        onChange={(e) => { handleChange(e, variants, index); setIsVariant(false) }}
                                        value={product.id}
                                        style={{ paddingTop: '37px' }}
                                        sx={{ color: selectedProductVarient.indexOf(variants.id) > -1 ? "P.main" : "GrayLight3.main" }}
                                      />
                                    }
                                    label={
                                      ""
                                    }
                                  />
                                </FormGroup>
                              </FormControl>
                              <Grid xs={index === showDetail ? 12 : 11.05} >
                                <Accordion sx={{ boxShadow: 0, border: 0, borderTop: 0, ml: window.innerWidth > 620 ? "-27.5px" : "-25px" }}>
                                  <AccordionSummary
                                    expandIcon={<ExpandMoreIcon sx={{ mr: window.innerWidth > 950 ? "-22.1px" : window.innerWidth > 920 ? "-19px" : window.innerWidth > 903 ? "-15px" : window.innerWidth > 830 ? "-12px" : window.innerWidth > 790 ? "-9px" : "-5px" }} />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                    sx={{ border: 0, borderTop: 0 }}
                                    onClick={() => {
                                      setShowSideVariant('');
                                      const mainVariantsArray = []
                                      if (showDetail === index) {
                                        setShowDetail('');
                                        setFixDiv(false)
                                      } else {
                                        setShowDetail(index);
                                        products[index].products.map(p => {
                                          if (mainVariantsArray.length !== 0) {
                                            if (mainVariantsArray.find(m => m === p.main_attributes[0].value)) {
                                            } else {
                                              mainVariantsArray.push(p.main_attributes[0].value)
                                            }
                                          } else {
                                            mainVariantsArray.push(p.main_attributes[0].value)
                                          }
                                        })
                                        setMainVariants(mainVariantsArray);
                                        setFixDiv(true);
                                      }
                                    }}
                                  >

                                    <Grid display='flex' p={1} sx={{ border: 0, borderTop: 0 }}>


                                      <Grid sx={{ border: 0, borderTop: 0, pt: 1 }}>
                                        <Card sx={{ maxWidth: 100, border: 'none', boxShadow: 'none' }}>
                                          <CardMedia
                                            component="img"
                                            height="60"
                                            image={product.file_urls === null ? No_Product_Image : axiosConfig.defaults.baseURL + product.file_urls[0]}
                                            className="image"
                                          />
                                        </Card>
                                      </Grid>
                                      <Grid>
                                        <Grid mt={1.5} sx={{ display: "flex" }}>
                                          <Typography
                                            ml={2}
                                            color="black"
                                            variant="h11"
                                          >
                                            {product.arabic_name !== undefined && product.products.length != 0
                                              ? product.name
                                              : ""}
                                          </Typography>
                                          <Typography
                                            color="G2.main"
                                            ml={1}
                                            textTransform='uppercase'
                                          >
                                            {product.arabic_name !== undefined && product.products.length != 0
                                              ? "(" + (window.innerWidth > 630 ? product.arabic_name : (product.arabic_name.substring(0, 9) + "...")) + ")"
                                              : ""}
                                          </Typography>
                                        </Grid>

                                        <Grid ml={2} mt={1} display='flex' >
                                          {product.products.length !== 0 &&
                                            <>
                                              <Typography variant='h10' color='G1.main'>{window.innerWidth > 700 ? product.products[0].general_attributes.find(a => a.title === 'Brand').value : product.products[0].general_attributes.find(a => a.title === 'Brand').value.substring(0, 5) + "..."} </Typography>
                                              < Divider orientation="vertical" flexItem sx={{ ml: "8px" }} />
                                              <Typography variant='h10' color='G1.main' ml="8px">{window.innerWidth > 633 ? countMainVariant(index) + ' ' + product.products[0].main_attributes[0].title + (countMainVariant(index) > 1 ? 's' : '') : countMainVariant(index) + ' ' + product.products[0].main_attributes[0].title.substring(0, 5) + (countMainVariant(index) > 1 ? 's' : '')} </Typography>
                                              < Divider orientation="vertical" flexItem sx={{ ml: "8px" }} />
                                              <Typography variant='h10' color='G1.main' sx={{ ml: "8px" }}>
                                                {product.products.length === 0 ? (
                                                  "No variant(s) for this product!"
                                                ) : (
                                                  product.products.map((variant, index) => {
                                                    let variantStock = parseInt(variant.stock)
                                                    totalStock = totalStock + variantStock
                                                  }))}
                                                {<Typography variant='h10'>{window.innerWidth > 633 ? (totalStock + " item" + (totalStock > 1 ? 's' : '') + " in stock") : totalStock + " item" + (totalStock > 1 ? 's' : '')}</Typography>}
                                              </Typography>

                                            </>
                                          }

                                        </Grid>
                                      </Grid>


                                    </Grid>
                                  </AccordionSummary>

                                </Accordion>

                              </Grid>

                            </Grid>
                          </Grid>

                        </Paper>

                        {index === showDetail ?
                          <Paper sx={{ mb: "4px" }} style={{
                            boxShadow: 'none',
                            border: '1px solid #DCDCDC',
                          }}>
                            <Scrollbars style={{ width: '100%', height: (window.innerHeight / 3) }}>
                              <Grid xs={12} >
                                {mainVariants.map((mainVariant, indexVariant) => {
                                  return (
                                    <Grid xs={12} p={2} pl={0} pr={0} display={showSideVariant === '' ? 'flex' : mainVariant === showSideVariant ? 'flex' : 'none'}
                                      flexWrap='wrap'
                                    >

                                      <Grid xs={window.innerWidth > 855 ? 4 : 6} position={showSideVariant === '' ? '' : mainVariant === showSideVariant ? 'sticky' : ''}
                                        display='flex'
                                      >
                                        <Grid xs={0.4} ml={1} mt={2} mb={2}
                                          sx={{ top: '15%', height: "100px", width: '100%' }}>
                                        </Grid>
                                        <Grid xs={11.6}
                                          display='flex'
                                          flexWrap='wrap'
                                          style={{
                                            height: window.innerWidth > 575 ? '123px' : "150px",
                                            width: '100%',
                                            border: '1px solid #CB929B',
                                            borderRadius: '8px',
                                            marginLeft: '-3px',
                                            top: '7%'
                                          }}>
                                          <Grid
                                            xs={12}
                                            sx={{
                                              marginTop: '-13px',
                                              paddingLeft: '12px'
                                            }}
                                          >
                                            <Typography
                                              variant='h10'
                                              color='G1.main'
                                              sx={{
                                                backgroundColor: 'white',
                                                width: '100%',
                                                padding: '0 5px '
                                              }}
                                            >{mainVariant}</Typography>
                                          </Grid>

                                          <Grid xs={12} display='flex'
                                            flexDirection='column'
                                            justifyContent='center'
                                            p={1} pt={0}
                                          >
                                            <Grid display='flex' justifyContent='space-between'>
                                              <FormControl disabled={!checkMainVarient(mainVariant)}>
                                                <FormGroup>

                                                  <FormControlLabel
                                                    control={
                                                      <Checkbox
                                                        color='P'

                                                        checked={checkMainVarient(mainVariant) ? selectedMainVariants.indexOf(mainVariant) > -1 : true}
                                                        onChange={(e) => {
                                                          handleChangeMainVarient(mainVariant, product.products.filter(p => p.main_attributes[0].value === mainVariant), product);
                                                        }

                                                        }
                                                        value={mainVariant.id}
                                                        style={{ padding: '20px', paddingTop: "10px" }}
                                                        sx={{ color: selectedMainVariants.indexOf(mainVariant) > -1 ? "P.main" : "GrayLight3.main" }}
                                                      />
                                                    }
                                                    label={
                                                      ""
                                                    }
                                                  />
                                                </FormGroup>
                                              </FormControl>
                                              <Grid xs={11} mt="-4px" display='flex' flexDirection='column'>
                                                <Typography variant='h15' color='G1.main'>{window.innerWidth > 575 ? (mainVariant.substring(0, 18) + "has" + product.products.filter(p => p.main_attributes[0].value === mainVariant).length + "" + (product.products.filter(p => p.main_attributes[0].value === mainVariant).length > 1 ? 'Variants' : 'Variant')) : product.products.filter(p => p.main_attributes[0].value === mainVariant).length + " " + (product.products.filter(p => p.main_attributes[0].value === mainVariant).length > 1 ? 'Variants' : 'Variant')}</Typography>
                                                <Typography variant='h15' color='G1.main'>Total Price: {seterTotalPrice(product.products.filter(p => p.main_attributes[0].value === mainVariant))}</Typography>
                                                <Typography variant='h15' color='G1.main'>Available in Stock: {seterTotalStockVariant(product.products.filter(p => p.main_attributes[0].value === mainVariant))}</Typography>
                                              </Grid>

                                            </Grid>
                                          </Grid>
                                          <Grid xs={12} display='flex' justifyContent='flex-end'
                                            alignItems='end' >
                                            <IconButton onClick={() => {
                                              if (showSideVariant === mainVariant) {
                                                setShowSideVariant('');
                                              } else {
                                                setShowSideVariant(mainVariant);
                                                setSideVariants(product.products.filter(p => p.main_attributes[0].value === mainVariant))
                                              }
                                            }}
                                              sx={{ mt: "-35px" }}
                                            >
                                              <ArrowForwardIosIcon sx={{ color: 'P.main' }} />
                                            </IconButton>
                                          </Grid>
                                        </Grid>
                                      </Grid>


                                      {
                                        showSideVariant === '' ? '' :
                                          mainVariant === showSideVariant ?
                                            <Grid xs={window.innerWidth > 855 ? 8 : 6} display='flex' flexWrap='wrap' pl={0.5} width='100%' >
                                              {sideVariants.map(variants => {
                                                return (
                                                  <Grid md={5.2} xs={12} m={0.2} mt={4.25} style={{
                                                    border: '1px solid #DCDCDC',
                                                    borderRadius: '8px',
                                                    width: '100%',
                                                    height: '110px',

                                                  }}>
                                                    <Grid
                                                      xs={12}
                                                      sx={{
                                                        width: '100%',
                                                        marginTop: '-15px',
                                                        marginLeft: '10px',
                                                      }}
                                                    >
                                                      <Typography
                                                        sx={{
                                                          width: '100%',
                                                          backgroundColor: 'white',
                                                          padding: '2px'
                                                        }}
                                                        variant='h27'
                                                        color='G1.main'
                                                      >{variants.sku}</Typography>
                                                    </Grid>

                                                    <Grid container xs={12} display='flex'
                                                      flexDirection='column'
                                                      justifyContent='center'
                                                      p={1} pt={0}
                                                    >
                                                      <Grid display='flex'  >
                                                        <FormControl disabled={!checkedVarientIsSelected(variants)}>
                                                          <FormGroup>

                                                            <FormControlLabel
                                                              control={
                                                                <Checkbox
                                                                  color='P'
                                                                  checked={checkedVarientIsSelected(variants) ? selectedProductVarient.indexOf(variants.id) > -1 : true}
                                                                  onChange={(e) => {
                                                                    handleChangeVarient(e, product, product.products, product.products.filter(p => p.main_attributes[0].value === mainVariant), mainVariant);
                                                                    setIsVariant(true)
                                                                  }
                                                                  }
                                                                  value={variants.id}
                                                                  style={{ padding: '20px', paddingTop: "10px" }}
                                                                  sx={{ color: selectedProductVarient.indexOf(variants.id) > -1 ? "P.main" : "GrayLight3.main" }}
                                                                />
                                                              }
                                                              label={
                                                                ""
                                                              }
                                                            />
                                                          </FormGroup>
                                                        </FormControl>
                                                        <Grid xs={12} mt={"5px"} display='flex' flexDirection='column'>
                                                          <Typography variant='h15' color='G1.main' pt={1}>Unit Price: {numberWithCommas(variants.price)}</Typography>
                                                          <Typography variant='h15' color='G1.main' pt={1} alignItems='end'>Available in Stock: {variants.stock}</Typography>

                                                          <Grid display='flex' xs={12} pt={1} flexWrap='wrap'>
                                                            {variants.tags.length != 0 ? <SellIcon color="P" /> : ''}
                                                            {variants.tags ?

                                                              variants.tags.map((tag, index) => {
                                                                let flagAttribute = ''
                                                                let title = ''
                                                                list.map((tagsList, index) => {
                                                                  if (Object.values(tagsList).includes(tag.label_id)) {
                                                                    flagAttribute = index
                                                                  }
                                                                })
                                                                list[flagAttribute] ?
                                                                  list[flagAttribute].title !== null ||
                                                                    list[flagAttribute].length !== 0 ||
                                                                    list[flagAttribute].title !== undefined ||
                                                                    list[flagAttribute].title !== ''
                                                                    ? title = list[flagAttribute].title :
                                                                    title = 'null'
                                                                  : title = 'null'

                                                                return (

                                                                  index <= 1 ?
                                                                    index == 0 ?
                                                                      <Typography variant="h15" color='G2.main'>
                                                                        {title + ((variants.tags.length == 1) ? "" : ",")}
                                                                      </Typography>
                                                                      :
                                                                      <Typography variant="h15" color='G2.main'>
                                                                        {(title.substring(0, 10) + ((index == 1) && "") + "...")}
                                                                      </Typography>
                                                                    : ''

                                                                );
                                                              })
                                                              :
                                                              ""}

                                                          </Grid>
                                                        </Grid>
                                                      </Grid>

                                                    </Grid>
                                                  </Grid>
                                                )
                                              })}
                                            </Grid>
                                            : ''
                                      }
                                      {
                                        indexVariant === (mainVariants.length - 1) ? '' :
                                          <Grid xs={12} display={showSideVariant === '' ? '' : mainVariant === showSideVariant ? 'none' : ''} sx={{ borderBottom: '1px dashed #CB929B', margin: '30px 100px 0 100px' }}>
                                          </Grid>
                                      }
                                    </Grid>

                                  )
                                })}
                              </Grid>
                            </Scrollbars>
                          </Paper>
                          : showDetail === '' ? '' : ''
                        }

                      </>
                    );
                  })}
                </Grid>
              </Scrollbars>
            </DialogContent>
            <DialogActions sx={{ backgroundColor: 'G3.main' }}>
              <Grid
                item
                xs={12}
                pr={2}
                display="flex"
                flexDirection='column'
                justifyContent="end"
                textAlign='end'
                height='70px'
                left='0px' right='0px' overflow='hidden'
              >
                <Grid display='flex' justifyContent='end'>
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
        </Grid>
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

export default AddTag;
