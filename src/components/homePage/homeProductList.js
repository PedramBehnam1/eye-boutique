import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import axiosConfig from "../../axiosConfig";
import "../../asset/css/adminPage/addColor.css";
import "../../asset/css/homePage/hoverCard.css";
import Grid from "@mui/material/Grid";
import {
  Checkbox,
  Collapse,
  FormGroup,
  FormControlLabel,
  Fade,
  Backdrop,
  Snackbar,
  SvgIcon,
  DialogContent,
  Slide
} from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { Box } from "@mui/system";
import CardMedia from "@mui/material/CardMedia";
import Card from "@mui/material/Card";
import Recentlyviewed from "./recentlyviewed";
import No_Product_Image from "../../asset/images/No-Product-Image-v2.png";
import productHeadPic from "../../asset/images/productshead.png";
import Header from "../../layout/Header";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Footer from "../../layout/footer";
import FilterListIcon from "@mui/icons-material/FilterList";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import frameIcon from "../../asset/images/Vector.png";
import Scrollbars from "react-custom-scrollbars-2";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import "../../asset/css/homePage/homeProductList.css";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ProductMainList = () => {
  const [faqs, setFaqs] = useState([]);
  const [isRemoved, setIsRemoved] = useState(false);
  const[showCartPage,setShowCartPage]=useState(false)
  const [trigger,setTrigger] = useState(20);
  const [_trigger,_setTrigger] = useState(0)
  const [_trigger_, _setTrigger_] = useState(0);

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [_category, _setCategory] = useState("");
  const [gender, setGender] = useState("");
  const [type, setType] = useState("");
  const [filterProductsBy, setFilterProductsBy] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const location = useLocation();
  const [showMainVariant, setShowMainVariant] = useState("");
  const [imageGroup, setImageGroup] = useState("");
  const [imageGroupIndex, setImageGroupIndex] = useState("");
  const [PriceGroup, setPriceGroup] = useState("");
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [showOption, setShowOption] = useState("");
  const [_showOption, _setShowOption] = useState("");
  const [showSortOption, setShowSortOption] = useState("");
  const [showCategoryOption, setShowCategoryOption] = useState(true);
  const [loading, setLoading] = useState(true);
  let history = useHistory();
  const [showFilterList, setShowFilterList] = useState(false);
  const [loadingFavoriteProduct, setloadingFavoriteProduct] = useState("");
  const [sortProductBy, setSortProductBy] = useState("Newest First");
  const [numberOfVarients, setNumberOfVarients] = useState([]);
  const [generalAttributes, setGeneralAttributes] = useState([]);
  const [sideMainAttributes, setSideMainAttributes] = useState([]);
  const [mainAttributes, setMainAttributes] = useState([]);

  const [numberOfDots, setNumberOfDots] = useState([]);
  const [activeDot, setActiveDot] = useState(0);
  const [moblieSize, setMoblieSize] = useState(false);
  const [openMassage, setOpenMassage] = useState(false);
  const [showMassage, setShowMassage] = useState("");
  const [width, setWidth] = useState("");
  const [scrollY, setScrollY] = useState("");
  const [windowResizing, setWindowResizing] = useState(false);

  const getWindowWidth = () => {
    setWidth(window.innerWidth);
    if (window.innerWidth < 1017) {
      setMoblieSize(true);
    } else {
      setMoblieSize(false);
    }
  };

  const listenScrollEvent = () => {
    setScrollY(window.scrollY);
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
    window.addEventListener("scroll", listenScrollEvent);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    if (window.innerWidth < 1017) {
      setMoblieSize(true);
    } else {
      setMoblieSize(false);
    }
  }, []);
  useEffect(() => {
    refreshList();
  }, [
    location.state,
    trigger,
    filterProductsBy,
    sortProductBy,
  ]);

  const refreshList = () => {
    setLoading(true);
    let search = location.state ? location.state.search : "";
    let category = location.pathname
      .split("Products/")[1]
      .split("/")[0]
      .replace(/\s+/g, "");
    let type = location.pathname
      .split("Products/")[1]
      .split("/")
      [location.pathname.split("Products/")[1].split("/").length - 2].replace(
        /\s+/g,
        ""
      );
    let gender = location.pathname
      .split("Products/")[1]
      .split("/")
      [location.pathname.split("Products/")[1].split("/").length - 1].replace(
        /\s+/g,
        ""
      );
    _setCategory(category);
    setGender(gender);
    setType(type.replace(/\s+/g, ""));
    axiosConfig
      .get(
        `/admin/product/all?limit=10000&page=1&language_id=1&sku=&name=${""}&status=1&category_id=&price_sort=&date_sort=`
      )
      .then((res) => {
        let newProducts = res.data.products;
        setAllProducts(res.data.products);
        let s = "";
        s.charAt(0);

        axiosConfig.get("/admin/category/all").then((respond) => {
          setCategories(respond.data.categories);
          respond.data.categories.map((cat) => {
            if (cat.title.replace(/\s+/g, "") == category) {
              _setCategory(cat.title);
              category = cat.title;
            }
          });
          if (category === "All") {
          } else {
            if (
              !respond.data.categories.find((c) => c.title.includes(category))
            ) {
              newProducts = [];
            } else {
              const types = respond.data.categories.find((c) =>
                c.title.includes(category)
              ).types;

              const idArray = [];
              types.map((t) => idArray.push(t.id));
              const product = [];
              newProducts.map((p) => {
                for (let i = 0; i < idArray.length; i++) {
                  if (p.category_id === idArray[i]) {
                    product.push(p);
                  }
                }
              });

              if (category =="Sunglasses") {
                if (
                  gender === "All"
                ) {
                  newProducts = product;
                } else {
                  
                  newProducts = product.filter((p) =>
                    p.products[0].general_attributes.find(
                      (g) =>
                        g.value ===  gender 
                    )
                  );
                }
                
              }else{
                newProducts = product;
              }
              if (type !== "All") {
                newProducts = newProducts.filter((p) =>
                  p.products[0].general_attributes.find(
                    (g) => g.value.replace(/\s+/g, "") === type
                  )
                );
              }
            }
          }
          
          // filter
          let filterProducts = [];
          const _filterProducts = [];
          let result = true;
          let result1 = false;
          if (filterProductsBy.length > 0) {
            if (generalAttributes.length>0) {
              for (let j = 0; j < generalAttributes.length; j++) {
                if (j==0) {
                  newProducts.map((product) => {
                    for (
                      let i = 0;
                      i < product.products[0].general_attributes.length;
                      i++
                    ) {
                      
                        if (
                          product.products[0].general_attributes[i].value ===
                          generalAttributes[j].value  && product.products[0].general_attributes[i].title== generalAttributes[j].title
                        ) {
                          filterProducts.push(product);
                        } else {
                        }
                      
                    }
    
    
                  });
                }else{
                  filterProducts.map((product) => {
                    for (
                      let i = 0;
                      i < product.products[0].general_attributes.length;
                      i++
                    ) {
                      
                        if (
                          product.products[0].general_attributes[i].value ===
                          generalAttributes[j].value  && product.products[0].general_attributes[i].title== generalAttributes[j].title
                        ) {
                          result1=true
                        } else {
                        }
                      
                    }
                    if (!result1) {
                      filterProducts = filterProducts.filter(p=>p.id!=product.id)
                    }
                    result1=false;
                  });
  
                }
                
              }
            }

            if (sideMainAttributes.length>0) {
              if ( generalAttributes.length>0 ) {
                
                for (let j = 0; j < sideMainAttributes.length; j++) {
                  filterProducts.map(product=>{
                    for (
                      let i = 0;
                      i < product.products[0].side_main_attributes.length;
                      i++
                    ) {
                        if (
                          product.products[0].side_main_attributes[i].value ===
                          sideMainAttributes[j].value && product.products[0].side_main_attributes[i].title== sideMainAttributes[j].title
                        ) {
                          result1=true;
  
                        } else {
                        }
                      
                    }
                    if (!result1) {
                      filterProducts = filterProducts.filter(p=>p.id!=product.id)
                    }
                    result1=false;
                    
                  })
                }
                
              }else{
                for (let j = 0; j < sideMainAttributes.length; j++) {
                  if (j==0) {
                    newProducts.map(product=>{
                      for (
                        let i = 0;
                        i < product.products[0].side_main_attributes.length;
                        i++
                      ) {
                          if (
                            product.products[0].side_main_attributes[i].value ===
                            sideMainAttributes[j].value && product.products[0].side_main_attributes[i].title== sideMainAttributes[j].title
                          ) {
                            filterProducts.push(product)
                          } else {
                          }
                        
                      }
                      
                    })
                    
                  }else{
                    
                    filterProducts.map(product=>{
                      for (
                        let i = 0;
                        i < product.products[0].side_main_attributes.length;
                        i++
                      ) {
                          if (
                            product.products[0].side_main_attributes[i].value ===
                            sideMainAttributes[j].value&& product.products[0].side_main_attributes[i].title== sideMainAttributes[j].title
                          ) {
                            result1=true;
    
                          } else {
                          }
                        
                      }
                      if (!result1) {
                        filterProducts= filterProducts.filter(p=>p.id!=product.id)
                      }
                      result1=false;
                      
                    })
  
                    
                    
                  }
                }
  
              }
            }

            if (mainAttributes.length>0) {
              if ( generalAttributes.length>0 ||sideMainAttributes.length>0) {
                for (let j = 0; j < mainAttributes.length; j++) {
                  filterProducts.map(product=>{
                    for (
                      let i = 0;
                      i < product.products[0].main_attributes.length;
                      i++
                    ) {
                      if (
                        product.products[0].main_attributes[i].value ===
                        mainAttributes[j].value && product.products[0].main_attributes[i].title== mainAttributes[j].title
                      ) {
                        result1=true;
                      } else {
                      }
                    }
                    if (!result1) {
                      filterProducts = filterProducts.filter(p=>p.id!=product.id)
                    }
                    result1=false;
                    
                  })
                }
              }else{
  
                for (let j = 0; j < mainAttributes.length; j++) {
                  if (j==0) {
                    newProducts.map(product=>{
                      for (
                        let i = 0;
                        i < product.products[0].main_attributes.length;
                        i++
                      ) {
                          if (
                            product.products[0].main_attributes[i].value ===
                            mainAttributes[j].value  && product.products[0].main_attributes[i].title== mainAttributes[j].title
                          ) {
                            filterProducts.push(product)
                          } else {
                          }
                        
                      }
                      
                    })
                    
                  }else{
                    
                    filterProducts.map(product=>{
                      for (
                        let i = 0;
                        i < product.products[0].main_attributes.length;
                        i++
                      ) {
                          if (
                            product.products[0].main_attributes[i].value ===
                            mainAttributes[j].value && product.products[0].main_attributes[i].title== mainAttributes[j].title
                          ) {
                            result1=true;
    
                          } else {
                          }
                        
                      }
                      if (!result1) {
                        filterProducts = filterProducts.filter(p=>p.id!=product.id)
                      }
                      result1=false;
                      
                    })
  
                    
                    
                  }
                }
              }
            }
            
            if (filterProducts.length != 0) {
              for (let i = 0; i < filterProducts.length; i++) {
                for (let j = 0; j < _filterProducts.length; j++) {
                  if (filterProducts[i].id == _filterProducts[j].id) {
                    result = false;
                  }
                }
                if (result) {
                  _filterProducts.push(filterProducts[i]);
                }
                result = true;
              }
            }
            newProducts = _filterProducts;
          }

          setTimeout(() => {
            setLoading(false);
          }, 1000);
          if (showSortOption == "Sort by date") {
            setFilteredProducts(
              sortProductBy === "Newest First"
                ? newProducts
                : newProducts.reverse()
            );
          } else if (showSortOption == "Sort by price") {
            sortProductBy === "Low to High"
              ? setFilteredProducts(
                  newProducts.sort((a, b) =>
                    a.products[0].price < b.products[0].price ? -1 : 1
                  )
                )
              : setFilteredProducts(
                  newProducts.sort((a, b) =>
                    a.products[0].price < b.products[0].price ? 1 : -1
                  )
                );
          } else if (showSortOption == "Sort by name") {
            sortProductBy === "A - Z"
              ? setFilteredProducts(
                  newProducts.sort((a, b) =>
                    a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase()
                      ? 1
                      : -1
                  )
                )
              : setFilteredProducts(
                  newProducts.sort((a, b) =>
                    b.name.toLocaleLowerCase() > a.name.toLocaleLowerCase()
                      ? 1
                      : -1
                  )
                );
          } else {
            setFilteredProducts(newProducts);
          }
          setShowFilterList(filteredProducts.length === 0 ? false : showFilterList);
        });
        if (search != "") {
          newProducts = newProducts.filter((p) =>
            (
              p.name.charAt(0).toUpperCase() + p.name.slice(1).toLowerCase()
            ).includes(
              search.charAt(0).toUpperCase() + search.slice(1).toLowerCase()
            )
          );
        }
      });

    if (localStorage.getItem("token") !== undefined) {
      axiosConfig
        .get("/users/wishlist", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((respons) => {
          const favoriteArray = [];
          respons.data.products.map((p) => favoriteArray.push(p.id));
          setFavoriteProducts(favoriteArray);
        })
        .catch((err) =>{
          if(err.response.data.error.status === 401){
            axiosConfig
              .post("/users/refresh_token", {
                refresh_token: localStorage.getItem("refreshToken"),
              })
              .then((ress) => {
                localStorage.setItem("token", ress.data.accessToken);
                localStorage.setItem("refreshToken", ress.data.refreshToken);
                refreshList();
              })
          }else{
            setShowMassage('Get wishlists have a problem!')
            setOpenMassage(true)      
          }
        });
    }

  };

  const mainVariants = (index) => {
    const mainVariantsArray = [];
    filteredProducts[index].products.map((p) => {
      if (mainVariantsArray.length !== 0) {
        if (mainVariantsArray.find((m) => m === p.main_attributes[0].value)) {
        } else {
          mainVariantsArray.push(p.main_attributes[0].value);
        }
      } else {
        mainVariantsArray.push(p.main_attributes[0].value);
      }
    });
    return mainVariantsArray;
  };


  const getrecentlyViewed = () => {
    let recentlyViewedIds = JSON.parse(localStorage.getItem("recently_view"));
    let recentlyViewedIds2 = [];
    let recently_view = [];
    let res = false;
    let recent = "";
    allProducts.map((p) => {
      recentlyViewedIds2.map((rec) => {
        if (p.id == rec) {
          recently_view.push(p);
        }
      });
    });
    return recently_view;
  };

  const addToWishList = (id) => {
    if (localStorage.getItem("token")) {
      setloadingFavoriteProduct(id);
      axiosConfig
        .post(
          "/users/wishlist/add",
          { product_group_id: id },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then(() => {
          const _favoriteProducts = favoriteProducts;
          _favoriteProducts.push(id);
          setFavoriteProducts(_favoriteProducts);
          setloadingFavoriteProduct("");
          setShowMassage("Added To Wishlist!");
          setOpenMassage(true);
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
                addToWishList();
              })
          }else{
            setShowMassage('Add to wishlist has a problem!')
            setOpenMassage(true)      
          }
        });
    } else {
      setShowMassage("Please Login first!");
      setOpenMassage(true);
    }
  };

  const deleteFromWishList = (id) => {
    setloadingFavoriteProduct(id);
    axiosConfig
      .delete(`/users/wishlist/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(() => {
        let _favoriteProducts = favoriteProducts;
        _favoriteProducts = _favoriteProducts.filter((t) => t !== id);
        setFavoriteProducts(_favoriteProducts);
        setloadingFavoriteProduct("");
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
              deleteFromWishList();
              setShowMassage("Delted From Wishlist!");
              setOpenMassage(true);
            })
          }else{
            setShowMassage('Delete from wishlist has a problem!')
            setOpenMassage(true)
          }
      });
  };
  const findValueFromAttribute = (title) => {
    let filterProducts = [];
    let _generalAttributes = generalAttributes;
    let _sideMainAttributes = sideMainAttributes;
    let _mainAttributes = mainAttributes;
    
    if (
      title == "Front Color" ||
      title == "Lens Color" ||
      title == "Lens Properties"
    ) {
      filteredProducts.map((product) => {
        if (
          product.products[0].side_main_attributes.find(
            (a) => a.title === title
          ) !== undefined
        ) {
          filterProducts.push(
            product.products[0].side_main_attributes.find(
              (a) => a.title === title
            ).value
          );
        }
      });
    } else if (title == "Family" || title == "Color") {
      filteredProducts.map((product) => {
        if (
          product.products[0].main_attributes.find((a) => a.title === title) !==
          undefined
        ) {
          filterProducts.push(
            product.products[0].main_attributes.find((a) => a.title === title)
              .value
          );
        }
      });
    } else if(title == "Gender") {
      
      filteredProducts.map((product) => {
        if (gender=="All") {
          if (
            product.products[0].general_attributes.find(
              (a) => a.title === title
            ) !== undefined
          ) {
            filterProducts.push(
              product.products[0].general_attributes.find(
                (a) => a.title === title
              ).value
            );
          }
          
        }else{
          if (
            product.products[0].general_attributes.find(
              (a) => a.title === title
            ) !== undefined && product.products[0].general_attributes.find(
              (a) => a.value === gender
            ) !== undefined
          ) {
            filterProducts.push(
              product.products[0].general_attributes.find(
                (a) => a.title === title
              ).value
            );
          }

        }
      });
    }else{
      filteredProducts.map((product) => {
        if (
          product.products[0].general_attributes.find(
            (a) => a.title === title
          ) !== undefined 
        ) {
          filterProducts.push(
            product.products[0].general_attributes.find(
              (a) => a.title === title
            ).value
          );
        }
      });

    }

    let uniqueChars = [...new Set(filterProducts)];
    return (
      <Grid xs={12} pt={2}>
        <Grid
          xs={12}
          display="flex"
          pb={1.5}
          justifyContent="space-between"
          sx={{ borderBottom: "1px solid rgb(203, 146, 155, 0.2)" }}
          onClick={() => {
            if (showOption == title) {
              setTimeout(() => {
                _setShowOption("");
              }, 500);
            } else {
              setTimeout(() => {
                _setShowOption(title);
              }, 100);
            }
            setShowOption(showOption === title ? "" : title);
          }}
        >
          <Typography
            variant="h34"
            sx={
              window.innerWidth > 1016
                ? { color: "G1.main" }
                : { color: "P.main" }
            }
          >
            {title}
          </Typography>
          {showOption === title ? (
            <ExpandLess
              sx={
                window.innerWidth > 1016
                  ? { color: "GrayLight3.main" }
                  : { color: "White.main" }
              }
            />
          ) : (
            <ExpandMore
              sx={
                window.innerWidth > 1016
                  ? { color: "GrayLight3.main" }
                  : { color: "White.main" }
              }
            />
          )}
        </Grid>
        <Collapse in={showOption === title}>
          <Grid xs={12} pt={2}>
            {_showOption == "Type" ? (
              typeFilter(filterProducts, title, uniqueChars)
            ) : 
            _showOption == "Brand" ? (
              brandFilter(filterProducts, title, uniqueChars)
            ) : _showOption == "Shape" ? (
              shapeFilter(filterProducts, title, uniqueChars)
            ) : _showOption == "Lens Properties" ? (
              lensPropertiesFilter(filterProducts, title, uniqueChars)
            ) : _showOption == "Packaging" ? (
              packagingFilter(filterProducts, title, uniqueChars)
            ) : _showOption == "Material" ? (
              matrialFilter(filterProducts, title, uniqueChars)
            ) : _showOption == "Duration" ? (
              durationFilter(filterProducts, title, uniqueChars)
            ) :_showOption == "Gender"? 
              genderFilter(filterProducts, title, uniqueChars)
            :_showOption != " " ? (
              <FormGroup
                sx={{ color: "G2.main" }}
                value={uniqueChars}
                onChange={(e) => {
                  let _filterProductsBy = filterProductsBy;
                  if (
                    filterProductsBy.filter(
                      (f) => f.value === e.target.value && f.title === title
                    ).length === 0
                  ) {
                    _filterProductsBy.push({ title: title, value: e.target.value });
                    if (
                      title == "Front Color" ||
                      title == "Lens Color" ||
                      title == "Lens Properties"
                    ) {
                      _sideMainAttributes.push({ title: title, value: e.target.value })
                    }else if (title == "Family" || title == "Color") {
                      _mainAttributes.push({ title: title, value: e.target.value })
                    }else{
                      _generalAttributes.push({ title: title, value: e.target.value })
                    }
                  } else {
                    _filterProductsBy = _filterProductsBy.filter(
                      (t) => t.title !== title || t.value !== e.target.value
                    );
                    if (
                      title == "Front Color" ||
                      title == "Lens Color" ||
                      title == "Lens Properties"
                    ) {
                      _sideMainAttributes= _sideMainAttributes.filter(
                        (t) => t.title !== title || t.value !== e.target.value
                      );
                    }else if (title == "Family" || title == "Color") {
                      _mainAttributes = _mainAttributes.filter(
                        (t) => t.title !== title || t.value !== e.target.value
                      );
                    }else{
                      _generalAttributes= _generalAttributes.filter(
                        (t) => t.title !== title || t.value !== e.target.value
                      );
                    }
                  }
                    setSideMainAttributes(_sideMainAttributes)
                    setMainAttributes(_mainAttributes);  
                    setGeneralAttributes(_generalAttributes)
                    setFilterProductsBy(_filterProductsBy);
                    setTrigger(trigger + 1);
                }}
              >
                <Grid
                  container
                  xs={12}
                  md={12}
                  display="flex"
                  justifyContent="start"
                  alignItems="center"
                  flexWrap="wrap"
                >
                  {uniqueChars.map((a) => {
                    return (
                      <Grid
                        item
                        xs={
                          title == "Family" ||
                          title == "Manufacturer" ||
                          title == "Color"
                            ? 12
                            : 6
                        }
                        md={
                          title == "Temple Material"
                            ? window.innerWidth > 1184
                              ? 6
                              : window.innerWidth > 899
                              ? 12
                              : 6
                            : title == "Family" ||
                              title == "Manufacturer" ||
                              title == "Color"
                            ? 12
                            : 6
                        }
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Grid
                          xs={
                            title == "Family" ||
                            title == "Manufacturer" ||
                            title == "Color"
                              ? 12
                              : 12
                          }
                          md={
                            title == "Temple Material" ||
                            title == "Family" ||
                            title == "Manufacturer" ||
                            title == "Color"
                              ? 12
                              : window.innerWidth > 1380
                              ? 12
                              : window.innerWidth > 1220
                              ? 12
                              : window.innerWidth > 955
                              ? 12
                              : 12
                          }
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <Grid
                            xs={
                              title == "Family" ||
                              title == "Manufacturer" ||
                              title == "Color"
                                ? 1
                                : 3
                            }
                          >
                            <FormControlLabel
                              sx={{ marginBottom: 0 }}
                              value={a}
                              control={
                                <Checkbox
                                  checked={
                                    filterProductsBy.find(
                                      (f) => f.title === title && f.value === a
                                    ) !== undefined
                                  }
                                  color="P"
                                  size="small"
                                  sx={{ color: "GrayLight3.main" }}
                                />
                              }
                            />
                          </Grid>
                          <Grid
                            xs={
                              title == "Family" ||
                              title == "Manufacturer" ||
                              title == "Color"
                                ? 11
                                : 9
                            }
                          >
                            <Typography
                              pl={window.innerWidth>400? 0:"10px"}
                              variant={
                                title == "Front Color"
                                  ? window.innerWidth > 1184
                                    ? "h2"
                                    : "MontseratFS14"
                                  : title == "Family"
                                  ? window.innerWidth > 1475
                                    ? "h2"
                                    :(window.innerWidth>300? "MontseratFS14":"h21")
                                  : title == "Manufacturer" || title == "Color"
                                  ? "h2"
                                  : window.innerWidth > 1275
                                  ? "h2"
                                  : "MontseratFS14"
                              }
                              fontWeight="400"
                            >
                              {(window.innerWidth < 1350 &&
                                window.innerWidth > 1017) ||
                              window.innerWidth < 450
                                ? a.length > 28
                                  ? truncate(a, 25)
                                  : a
                                : a}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    );
                  })}
                </Grid>
              </FormGroup>
            ) : (
              ""
            )}
          </Grid>
        </Collapse>
      </Grid>
    );
  };

  const truncate = (value, num) => {
    return value.slice(0, num) + "...";
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenMassage(false);
    setShowFilterList(false);
  };
  function toCamelCase(str) {
    // Lower cases the string
    let result = str
      .toLowerCase()
      // Replaces any - or _ characters with a space
      .replace(/[-_]+/g, " ")
      // Removes any non alphanumeric characters
      .replace(/[^\w\s]/g, "")
      // Uppercases the first character in each group immediately following a space
      // (delimited by spaces)
      .replace(/ (.)/g, function ($1) {
        return $1.toUpperCase();
      })
      // Removes spaces
      .replace(/ /g, "");
    result = result.charAt(0).toUpperCase() + result.slice(1);
    return result;
  }

  const categoryFilter = (category) => {
    return (
      <Grid
        xs={12}
        display="flex"
        alignItems="center"
        onClick={() => {
          setFilterProductsBy([]);
          if (window.innerWidth < 1016) {
            setShowFilterList(false);
          }
          history.push({
            pathname: `/Products/${category.replace(/\s+/g, "")}/All/All`,
            state: {
              categoryName: category,
              genderName: "All",
              valueId: "All",
              search: location.state != undefined ? location.state.search : "",
            },
          });
        }}
        sx={{ cursor: "pointer", pt: "20px" }}
      >
        {category == "Clear Contact Lens" ? (
          <SvgIcon
            titleAccess="title"
            sx={{ fill: "red", color: "red" }}
            component={(componentProps) => (
              <svg
                width="17"
                height="12"
                viewBox="0 0 17 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.5 0C4.63636 0 1.33682 2.488 0 6C1.33682 9.512 4.63636 12 8.5 12C12.3636 12 15.6632 9.512 17 6C15.6632 2.488 12.3636 0 8.5 0ZM8.5 10C6.36727 10 4.63636 8.208 4.63636 6C4.63636 3.792 6.36727 2 8.5 2C10.6327 2 12.3636 3.792 12.3636 6C12.3636 8.208 10.6327 10 8.5 10Z"
                  fill={_category == category ? "#CB929B" : "#9E9E9E"}
                />
                <path
                  d="M3.5 6C3.5 8.48414 5.51586 10.5 8 10.5C10.4841 10.5 12.5 8.48414 12.5 6C12.5 3.51586 10.4841 1.5 8 1.5C5.51586 1.5 3.5 3.51586 3.5 6Z"
                  stroke="white"
                />
              </svg>
            )}
          />
        ) : category == "Color Contact Lens" ? (
          <SvgIcon
            titleAccess="title"
            sx={{ fill: "red", color: "red" }}
            component={(componentProps) => (
              <svg
                width="17"
                height="12"
                viewBox="0 0 17 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.5 0C4.63636 0 1.33682 2.488 0 6C1.33682 9.512 4.63636 12 8.5 12C12.3636 12 15.6632 9.512 17 6C15.6632 2.488 12.3636 0 8.5 0ZM8.5 10C6.36727 10 4.63636 8.208 4.63636 6C4.63636 3.792 6.36727 2 8.5 2C10.6327 2 12.3636 3.792 12.3636 6C12.3636 8.208 10.6327 10 8.5 10ZM8.5 3.6C7.21727 3.6 6.18182 4.672 6.18182 6C6.18182 7.328 7.21727 8.4 8.5 8.4C9.78273 8.4 10.8182 7.328 10.8182 6C10.8182 4.672 9.78273 3.6 8.5 3.6Z"
                  fill={_category == category ? "#CB929B" : "#9E9E9E"}
                />
              </svg>
            )}
          />
        ) : (
          <SvgIcon
            titleAccess="title"
            sx={{ fill: "red", color: "red" }}
            component={(componentProps) => (
              <svg
                width="25"
                height="10"
                viewBox="0 0 25 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.25 1.63134C7.0788 1.63134 7.87366 1.97446 8.45971 2.58522C9.04576 3.19598 9.375 4.02435 9.375 4.8881C9.375 5.75185 9.04576 6.58022 8.45971 7.19098C7.87366 7.80174 7.0788 8.14486 6.25 8.14486C5.4212 8.14486 4.62634 7.80174 4.04029 7.19098C3.45424 6.58022 3.125 5.75185 3.125 4.8881C3.125 4.02435 3.45424 3.19598 4.04029 2.58522C4.62634 1.97446 5.4212 1.63134 6.25 1.63134ZM10.3516 2.52206C9.88113 1.63501 9.15759 0.922403 8.28123 0.482992C7.40486 0.0435816 6.41904 -0.100878 5.46038 0.0696315C4.50172 0.240141 3.61769 0.717176 2.93077 1.43464C2.24385 2.1521 1.78806 3.07446 1.62656 4.07391H0.78125C0.57405 4.07391 0.375336 4.15969 0.228823 4.31238C0.08231 4.46507 0 4.67216 0 4.8881C0 5.10404 0.08231 5.31113 0.228823 5.46382C0.375336 5.61651 0.57405 5.70229 0.78125 5.70229H1.62656C1.82046 6.91206 2.44392 8.00155 3.3731 8.75431C4.30227 9.50708 5.46916 9.86805 6.64194 9.76549C7.81473 9.66294 8.90758 9.10437 9.7034 8.20076C10.4992 7.29715 10.9398 6.11462 10.9375 4.8881C10.9375 4.45623 11.1021 4.04204 11.3951 3.73666C11.6882 3.43128 12.0856 3.25972 12.5 3.25972C12.9144 3.25972 13.3118 3.43128 13.6049 3.73666C13.8979 4.04204 14.0625 4.45623 14.0625 4.8881C14.0602 6.11462 14.5008 7.29715 15.2966 8.20076C16.0924 9.10437 17.1853 9.66294 18.3581 9.76549C19.5308 9.86805 20.6977 9.50708 21.6269 8.75431C22.5561 8.00155 23.1795 6.91206 23.3734 5.70229H24.2188C24.426 5.70229 24.6247 5.61651 24.7712 5.46382C24.9177 5.31113 25 5.10404 25 4.8881C25 4.67216 24.9177 4.46507 24.7712 4.31238C24.6247 4.15969 24.426 4.07391 24.2188 4.07391H23.3734C23.2119 3.07446 22.7562 2.1521 22.0692 1.43464C21.3823 0.717176 20.4983 0.240141 19.5396 0.0696315C18.581 -0.100878 17.5951 0.0435816 16.7188 0.482992C15.8424 0.922403 15.1189 1.63501 14.6484 2.52206C14.0685 1.94881 13.2993 1.6299 12.5 1.63134C11.6687 1.63134 10.9125 1.97004 10.3516 2.52206ZM21.875 4.8881C21.875 5.75185 21.5458 6.58022 20.9597 7.19098C20.3737 7.80174 19.5788 8.14486 18.75 8.14486C17.9212 8.14486 17.1263 7.80174 16.5403 7.19098C15.9542 6.58022 15.625 5.75185 15.625 4.8881C15.625 4.02435 15.9542 3.19598 16.5403 2.58522C17.1263 1.97446 17.9212 1.63134 18.75 1.63134C19.5788 1.63134 20.3737 1.97446 20.9597 2.58522C21.5458 3.19598 21.875 4.02435 21.875 4.8881Z"
                  fill={_category == category ? "#CB929B" : "#9E9E9E"}
                />
                <circle
                  cx="5.97818"
                  cy="3.80435"
                  r="3.80435"
                  fill={_category == category ? "#CB929B" : "#9E9E9E"}
                />
                <circle
                  cx="19.0221"
                  cy="3.80435"
                  r="3.80435"
                  fill={_category == category ? "#CB929B" : "#9E9E9E"}
                />
              </svg>
            )}
          />
        )}
        <Typography
          pl="18px"
          variant={
            window.innerWidth > 980
              ? "h34"
              : window.innerWidth > 899
              ? "h32"
              : "h34"
          }
          fontWeight="400"
          sx={
            window.innerWidth > 1016
              ? {}
              : { color: _category == category ? "#CB929B" : "White.main" }
          }
        >
          {category}
        </Typography>
      </Grid>
    );
  };

  const typeFilter = (temp, title, uniqueChars) => {
    let result = uniqueChars.find((a) => a.replace(/\s+/g, "") == type);

    return uniqueChars.map((a) => {
      return (
        <Grid
          xs={12}
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="39px"
          mt="4px"
        >
          <Grid
            xs={5}
            bgcolor={
              type == a.replace(/\s+/g, "") 
                ? "P3.main"
                : "#F9F9F9"
            }
            display="flex"
            alignItems="center"
            pt="7px"
            pb="7px"
            borderRadius="8px"
            sx={[
              { cursor: "pointer" },
              window.innerWidth < 1016 && {
                width: "168px",
                display: "flex",
                justifyContent: "center",
              },
            ]}
          >
            <Grid
              display="flex"
              justifyContent="center"
              xs={result != undefined ? 10 : 12}
              onClick={() => {
                if (window.innerWidth < 1016) {
                  setShowFilterList(false);
                }
                history.push({
                  pathname: `/Products/${_category.replace(
                    /\s+/g,
                    ""
                  )}/${a.replace(/\s+/g, "")}/${gender}`,
                  state: {
                    categoryName: categories,
                    genderName: type,
                    valueId: gender,
                    search:
                      location.state != undefined ? location.state.search : "",
                  },
                });
              }}
            >
              <Typography
                color={
                  type == a.replace(/\s+/g, "")
                    ? "G1.main"
                    : "G2.main"
                }
                variant="h34"
              >
                {a}
              </Typography>
            </Grid>
            {result != undefined && (
              <Grid
                xs={2}
                onClick={() => {
                  if (window.innerWidth < 1016) {
                    setShowFilterList(false);
                  }
                  history.push({
                    pathname: `/Products/${_category.replace(
                      /\s+/g,
                      ""
                    )}/All/${gender}`,
                    state: {
                      categoryName: categories,
                      genderName: type,
                      valueId: gender,
                      search:
                        location.state != undefined
                          ? location.state.search
                          : "",
                    },
                  });
                }}
                sx={{
                  visibility:
                    a.replace(/\s+/g, "") == type ? "visible" : "hidden",
                }}
              >
                <SvgIcon
                  titleAccess="title"
                  onClick={() => {
                    history.push({
                      pathname: `/Products/${_category}/All/${gender}`,
                      state: {
                        categoryName: _category,
                        genderName: "All",
                        valueId: "All",
                        search:
                          location.state != undefined
                            ? location.state.search
                            : "",
                      },
                    });
                    setTrigger(trigger + 1);
                  }}
                  component={(componentProps) => (
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="7.5" cy="7.5" r="7" stroke="#9E9E9E" />
                      <path
                        d="M8.11643 7.49963L10.8707 4.74945C10.953 4.66712 10.9993 4.55545 10.9993 4.43902C10.9993 4.32258 10.953 4.21092 10.8707 4.12859C10.7884 4.04625 10.6767 4 10.5603 4C10.4439 4 10.3322 4.04625 10.2499 4.12859L7.5 6.88313L4.75012 4.12859C4.66779 4.04625 4.55614 4 4.43972 4C4.3233 4 4.21164 4.04625 4.12932 4.12859C4.04699 4.21092 4.00075 4.32258 4.00075 4.43902C4.00075 4.55545 4.04699 4.66712 4.12932 4.74945L6.88357 7.49963L4.12932 10.2498C4.08834 10.2904 4.05582 10.3388 4.03362 10.3921C4.01143 10.4454 4 10.5025 4 10.5602C4 10.618 4.01143 10.6751 4.03362 10.7284C4.05582 10.7817 4.08834 10.83 4.12932 10.8707C4.16996 10.9116 4.21831 10.9442 4.27159 10.9664C4.32486 10.9886 4.382 11 4.43972 11C4.49743 11 4.55457 10.9886 4.60785 10.9664C4.66112 10.9442 4.70948 10.9116 4.75012 10.8707L7.5 8.11612L10.2499 10.8707C10.2905 10.9116 10.3389 10.9442 10.3922 10.9664C10.4454 10.9886 10.5026 11 10.5603 11C10.618 11 10.6751 10.9886 10.7284 10.9664C10.7817 10.9442 10.83 10.9116 10.8707 10.8707C10.9117 10.83 10.9442 10.7817 10.9664 10.7284C10.9886 10.6751 11 10.618 11 10.5602C11 10.5025 10.9886 10.4454 10.9664 10.3921C10.9442 10.3388 10.9117 10.2904 10.8707 10.2498L8.11643 7.49963Z"
                        fill="#9E9E9E"
                      />
                    </svg>
                  )}
                />
              </Grid>
            )}
          </Grid>
        </Grid>
      );
    });
  };
  const brandFilter = (temp, title, uniqueChars) => {
    let _generalAttributes=generalAttributes;
    return uniqueChars.map((a) => {
      return (
        <Grid
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          pt="7px"
          pb="7px"
          sx={{ cursor: "pointer" }}
        >
          <Grid
            xs={12}
            alignItems="center"
            display="flex"
            justifyContent="start"
            onClick={() => {
              let _filterProductsBy = filterProductsBy;
              if (
                filterProductsBy.filter((f) => f.value === a && f.title === title)
                  .length === 0
              ) {
                _filterProductsBy.push({ title: title, value: a });
                _generalAttributes.push({ title: title, value: a });
                setGeneralAttributes(_generalAttributes)
                setFilterProductsBy(_filterProductsBy);
                setTrigger(trigger + 1);
              }
            }}
          >
            <SvgIcon
              titleAccess="title"
              component={(componentProps) => (
                <svg
                  width="22"
                  height="19"
                  viewBox="0 0 22 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21.476 4.56196C21.6305 3.98555 21.5592 3.37396 21.2778 2.86172C20.9964 2.34948 20.528 1.97856 19.9756 1.83054L14.9195 0.475778C14.1217 0.262038 13.2678 0.387784 12.5459 0.825355L2.47492 6.92668C1.75362 7.36497 1.22321 8.07851 1 8.91085C0.776792 9.74319 0.878997 10.6264 1.28421 11.3668L4.25233 16.7815C4.65816 17.5217 5.33425 18.0581 6.13191 18.2726C6.92956 18.4871 7.78344 18.3622 8.50571 17.9253L18.5832 11.8257C18.9411 11.6091 19.2558 11.3222 19.5093 10.9816C19.7628 10.6409 19.9502 10.2532 20.0607 9.84049L21.4751 4.56171L21.476 4.56196ZM20.0875 4.1899L18.6728 9.46966C18.5527 9.91784 18.266 10.3028 17.8775 10.5382L7.78489 16.6462C7.39635 16.8757 6.93945 16.9388 6.51345 16.8218C6.08746 16.7047 5.72677 16.417 5.50975 16.021L2.54137 10.6073C2.32323 10.2083 2.26822 9.73254 2.38837 9.28411C2.50853 8.83569 2.79406 8.45115 3.18246 8.2147L13.2535 2.11337C13.6421 1.87767 14.1017 1.80979 14.5313 1.92467L19.5874 3.27943C19.7715 3.32877 19.9276 3.45241 20.0214 3.62316C20.1152 3.7939 20.139 3.99777 20.0875 4.1899ZM17.5225 6.34963C17.5735 6.15936 17.5881 5.96133 17.5654 5.76685C17.5427 5.57236 17.4833 5.38523 17.3904 5.21614C17.2975 5.04705 17.173 4.89932 17.0241 4.78136C16.8751 4.66341 16.7046 4.57755 16.5223 4.52869C16.3399 4.47983 16.1493 4.46893 15.9613 4.49661C15.7734 4.52428 15.5917 4.58999 15.4267 4.68998C15.2617 4.78998 15.1167 4.92229 14.9998 5.07938C14.8829 5.23647 14.7965 5.41526 14.7455 5.60553C14.6425 5.9898 14.6901 6.39753 14.8777 6.73902C15.0653 7.08051 15.3775 7.3278 15.7458 7.42647C16.1141 7.52515 16.5081 7.46713 16.8413 7.26518C17.1745 7.06324 17.4196 6.7339 17.5225 6.34963V6.34963Z"
                    fill={
                      filterProductsBy.find((f) => f.title === title && f.value === a) !==
                      undefined
                        ? "#CB929B"
                        : "#F5E9EB"
                    }
                  />
                </svg>
              )}
            />
            <Typography
              variant={
                window.innerWidth > 950
                  ? "h34"
                  : window.innerWidth > 899
                  ? "h32"
                  : window.innerWidth>300? "h34":"h21"

              }
              fontWeight="400"
              color={
                filterProductsBy.find((f) => f.title === title && f.value === a) !==
                undefined
                  ? "G1.main"
                  : "G2.main"
              }
              pl="17px"
            >
              {a}
            </Typography>
          </Grid>
          <Grid
            pr="5px"
            onClick={() => {
              let _filterProductsBy = filterProductsBy;
              _filterProductsBy = _filterProductsBy.filter((t) => t.title !== title || t.value !== a);
              _generalAttributes= _generalAttributes.filter(
                (t) => t.title !== title || t.value !== a
              );
              setGeneralAttributes(_generalAttributes)
              setFilterProductsBy(_filterProductsBy);
              setTrigger(trigger + 1);
            }}
            sx={{
              visibility:
              filterProductsBy.find((f) => f.title === title && f.value === a) !==
                undefined
                  ? "visible"
                  : "hidden",
            }}
          >
            <SvgIcon
              titleAccess="title"
              component={(componentProps) => (
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="7.5" cy="7.5" r="7" stroke="#9E9E9E" />
                  <path
                    d="M8.11643 7.49963L10.8707 4.74945C10.953 4.66712 10.9993 4.55545 10.9993 4.43902C10.9993 4.32258 10.953 4.21092 10.8707 4.12859C10.7884 4.04625 10.6767 4 10.5603 4C10.4439 4 10.3322 4.04625 10.2499 4.12859L7.5 6.88313L4.75012 4.12859C4.66779 4.04625 4.55614 4 4.43972 4C4.3233 4 4.21164 4.04625 4.12932 4.12859C4.04699 4.21092 4.00075 4.32258 4.00075 4.43902C4.00075 4.55545 4.04699 4.66712 4.12932 4.74945L6.88357 7.49963L4.12932 10.2498C4.08834 10.2904 4.05582 10.3388 4.03362 10.3921C4.01143 10.4454 4 10.5025 4 10.5602C4 10.618 4.01143 10.6751 4.03362 10.7284C4.05582 10.7817 4.08834 10.83 4.12932 10.8707C4.16996 10.9116 4.21831 10.9442 4.27159 10.9664C4.32486 10.9886 4.382 11 4.43972 11C4.49743 11 4.55457 10.9886 4.60785 10.9664C4.66112 10.9442 4.70948 10.9116 4.75012 10.8707L7.5 8.11612L10.2499 10.8707C10.2905 10.9116 10.3389 10.9442 10.3922 10.9664C10.4454 10.9886 10.5026 11 10.5603 11C10.618 11 10.6751 10.9886 10.7284 10.9664C10.7817 10.9442 10.83 10.9116 10.8707 10.8707C10.9117 10.83 10.9442 10.7817 10.9664 10.7284C10.9886 10.6751 11 10.618 11 10.5602C11 10.5025 10.9886 10.4454 10.9664 10.3921C10.9442 10.3388 10.9117 10.2904 10.8707 10.2498L8.11643 7.49963Z"
                    fill="#9E9E9E"
                  />
                </svg>
              )}
            />
          </Grid>
        </Grid>
      );
    });
  };
  const packagingFilter = (temp, title, uniqueChars) => {
    let _generalAttributes = generalAttributes;
    return uniqueChars.map((a) => {
      return (
        <Grid
          xs={12}
          display="flex"
          justifyContent="start"
          alignItems="center"
          pt="7px"
          pb="7px"
          sx={{ cursor: "pointer" }}
        >
          <Grid
            xs={12}
            alignItems="center"
            display="flex"
            justifyContent="start"
            onClick={() => {
              let _filterProductsBy = filterProductsBy;
              if (
                filterProductsBy.filter((f) => f.value === a && f.title === title)
                  .length === 0
              ) {
                _filterProductsBy.push({ title: title, value: a });
                _generalAttributes.push({ title: title, value: a });
                setGeneralAttributes(_generalAttributes)
                setFilterProductsBy(_filterProductsBy);
                setTrigger(trigger + 1);
              }
            }}
          >
            <SvgIcon
              titleAccess="title"
              component={(componentProps) => (
                <svg
                  width="16"
                  height="18"
                  viewBox="0 0 16 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16 13.05C16 13.392 15.8133 13.689 15.5289 13.842L8.50667 17.838C8.36445 17.946 8.18667 18 8 18C7.81334 18 7.63556 17.946 7.49334 17.838L0.471114 13.842C0.328607 13.7662 0.209347 13.6523 0.126291 13.5126C0.0432338 13.373 -0.000443707 13.213 3.39844e-06 13.05V4.95C3.39844e-06 4.608 0.18667 4.311 0.471114 4.158L7.49334 0.162C7.63556 0.0540001 7.81334 0 8 0C8.18667 0 8.36445 0.0540001 8.50667 0.162L15.5289 4.158C15.8133 4.311 16 4.608 16 4.95V13.05ZM8 1.935L6.32 2.898L11.5556 5.949L13.2978 4.95L8 1.935ZM2.70222 4.95L8 7.965L9.74222 6.975L4.51556 3.915L2.70222 4.95ZM1.77778 12.519L7.11111 15.561V9.522L1.77778 6.489V12.519ZM14.2222 12.519V6.489L8.88889 9.522V15.561L14.2222 12.519Z"
                    fill={
                      filterProductsBy.find((f) => f.title === title && f.value === a) !==
                      undefined
                        ? "#CB929B"
                        : "#E0E0E0"
                    }
                  />
                </svg>
              )}
            />
            <Typography
              variant={
                window.innerWidth > 1231
                  ? "h34"
                  : window.innerWidth > 899
                  ? "MontseratFS14"
                  : window.innerWidth>346? "h34":"h21"
              }
              fontWeight="400"
              color={
                filterProductsBy.find((f) => f.title === title && f.value === a) !==
                undefined
                  ? "G1.main"
                  : "G2.main"
              }
              pl="17px"
            >
              {a}
            </Typography>
          </Grid>
          <Grid
            pr="5px"
            onClick={() => {
              let _filterProductsBy = filterProductsBy;
              _filterProductsBy = _filterProductsBy.filter((t) => t.title !== title || t.value !== a);
              _generalAttributes= _generalAttributes.filter(
                (t) => t.title !== title || t.value !== a
              );

              setGeneralAttributes(_generalAttributes)
              setFilterProductsBy(_filterProductsBy);
              setTrigger(trigger + 1);
            }}
            sx={{
              visibility:
              filterProductsBy.find((f) => f.title === title && f.value === a) !==
                undefined
                  ? "visible"
                  : "hidden",
            }}
          >
            <SvgIcon
              titleAccess="title"
              component={(componentProps) => (
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="7.5" cy="7.5" r="7" stroke="#9E9E9E" />
                  <path
                    d="M8.11643 7.49963L10.8707 4.74945C10.953 4.66712 10.9993 4.55545 10.9993 4.43902C10.9993 4.32258 10.953 4.21092 10.8707 4.12859C10.7884 4.04625 10.6767 4 10.5603 4C10.4439 4 10.3322 4.04625 10.2499 4.12859L7.5 6.88313L4.75012 4.12859C4.66779 4.04625 4.55614 4 4.43972 4C4.3233 4 4.21164 4.04625 4.12932 4.12859C4.04699 4.21092 4.00075 4.32258 4.00075 4.43902C4.00075 4.55545 4.04699 4.66712 4.12932 4.74945L6.88357 7.49963L4.12932 10.2498C4.08834 10.2904 4.05582 10.3388 4.03362 10.3921C4.01143 10.4454 4 10.5025 4 10.5602C4 10.618 4.01143 10.6751 4.03362 10.7284C4.05582 10.7817 4.08834 10.83 4.12932 10.8707C4.16996 10.9116 4.21831 10.9442 4.27159 10.9664C4.32486 10.9886 4.382 11 4.43972 11C4.49743 11 4.55457 10.9886 4.60785 10.9664C4.66112 10.9442 4.70948 10.9116 4.75012 10.8707L7.5 8.11612L10.2499 10.8707C10.2905 10.9116 10.3389 10.9442 10.3922 10.9664C10.4454 10.9886 10.5026 11 10.5603 11C10.618 11 10.6751 10.9886 10.7284 10.9664C10.7817 10.9442 10.83 10.9116 10.8707 10.8707C10.9117 10.83 10.9442 10.7817 10.9664 10.7284C10.9886 10.6751 11 10.618 11 10.5602C11 10.5025 10.9886 10.4454 10.9664 10.3921C10.9442 10.3388 10.9117 10.2904 10.8707 10.2498L8.11643 7.49963Z"
                    fill="#9E9E9E"
                  />
                </svg>
              )}
            />
          </Grid>
        </Grid>
      );
    });
  };
  const matrialFilter = (temp, title, uniqueChars) => {
    let _generalAttributes = generalAttributes;
    return uniqueChars.map((a) => {
      return (
        <Grid
          xs={12}
          display="flex"
          justifyContent="start"
          alignItems="center"
          pt="7px"
          pb="7px"
          sx={{ cursor: "pointer" }}
        >
          <Grid
            xs={12}
            display="flex"
            justifyContent="start"
            alignItems="center"
            onClick={() => {
              let _filterProductsBy = filterProductsBy;
              if (
                filterProductsBy.filter((f) => f.value === a && f.title === title)
                  .length === 0
              ) {
                _filterProductsBy.push({ title: title, value: a });
                _generalAttributes.push({ title: title, value: a });
                setGeneralAttributes(_generalAttributes)
                setFilterProductsBy(_filterProductsBy);
                setTrigger(trigger + 1);
              }
            }}
          >
            <SvgIcon
              titleAccess="title"
              component={(componentProps) => (
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 28 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14 26C20.6276 26 26 20.6276 26 14C26 7.3724 20.6276 2 14 2C7.3724 2 2 7.3724 2 14C2 20.6276 7.3724 26 14 26Z"
                    stroke={
                      filterProductsBy.find((f) => f.title === title && f.value === a) !==
                      undefined
                        ? "#CB929B"
                        : "#F5E9EB"
                    }
                    stroke-width="3"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M14 21.2C17.9762 21.2 21.2 17.9762 21.2 14"
                    stroke={
                      filterProductsBy.find((f) => f.title === title && f.value === a) !==
                      undefined
                        ? "#CB929B"
                        : "#F5E9EB"
                    }
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              )}
            />
            <Typography
              variant={
                window.innerWidth > 1270
                  ? "h34"
                  : window.innerWidth > 1013
                  ? "MontseratFS14"
                  : window.innerWidth>310? "h34":"h21"
              }
              fontWeight="400"
              color={
                filterProductsBy.find((f) => f.title === title && f.value === a) !==
                undefined
                  ? "G1.main"
                  : "G2.main"
              }
              pl="17px"
            >
              {(window.innerWidth < 1084 && window.innerWidth > 1017) ||
              window.innerWidth < 400
                ? a.length > 19
                  ? truncate(a, 15)
                  : a
                : a}
            </Typography>
          </Grid>

          <Grid
            pr="5px"
            onClick={() => {
              let _filterProductsBy = filterProductsBy;
              _filterProductsBy = _filterProductsBy.filter((t) => t.title !== title || t.value !== a);
              _generalAttributes= _generalAttributes.filter(
                (t) => t.title !== title || t.value !== a
              );

              setGeneralAttributes(_generalAttributes)
              setFilterProductsBy(_filterProductsBy);
              setTrigger(trigger + 1);
            }}
            sx={{
              visibility:
              filterProductsBy.find((f) => f.title === title && f.value === a) !==
                undefined
                  ? "visible"
                  : "hidden",
            }}
          >
            <SvgIcon
              titleAccess="title"
              component={(componentProps) => (
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="7.5" cy="7.5" r="7" stroke="#9E9E9E" />
                  <path
                    d="M8.11643 7.49963L10.8707 4.74945C10.953 4.66712 10.9993 4.55545 10.9993 4.43902C10.9993 4.32258 10.953 4.21092 10.8707 4.12859C10.7884 4.04625 10.6767 4 10.5603 4C10.4439 4 10.3322 4.04625 10.2499 4.12859L7.5 6.88313L4.75012 4.12859C4.66779 4.04625 4.55614 4 4.43972 4C4.3233 4 4.21164 4.04625 4.12932 4.12859C4.04699 4.21092 4.00075 4.32258 4.00075 4.43902C4.00075 4.55545 4.04699 4.66712 4.12932 4.74945L6.88357 7.49963L4.12932 10.2498C4.08834 10.2904 4.05582 10.3388 4.03362 10.3921C4.01143 10.4454 4 10.5025 4 10.5602C4 10.618 4.01143 10.6751 4.03362 10.7284C4.05582 10.7817 4.08834 10.83 4.12932 10.8707C4.16996 10.9116 4.21831 10.9442 4.27159 10.9664C4.32486 10.9886 4.382 11 4.43972 11C4.49743 11 4.55457 10.9886 4.60785 10.9664C4.66112 10.9442 4.70948 10.9116 4.75012 10.8707L7.5 8.11612L10.2499 10.8707C10.2905 10.9116 10.3389 10.9442 10.3922 10.9664C10.4454 10.9886 10.5026 11 10.5603 11C10.618 11 10.6751 10.9886 10.7284 10.9664C10.7817 10.9442 10.83 10.9116 10.8707 10.8707C10.9117 10.83 10.9442 10.7817 10.9664 10.7284C10.9886 10.6751 11 10.618 11 10.5602C11 10.5025 10.9886 10.4454 10.9664 10.3921C10.9442 10.3388 10.9117 10.2904 10.8707 10.2498L8.11643 7.49963Z"
                    fill="#9E9E9E"
                  />
                </svg>
              )}
            />
          </Grid>
        </Grid>
      );
    });
  };
  const durationFilter = (temp, title, uniqueChars) => {
    let _generalAttributes = generalAttributes;
    return uniqueChars.map((a) => {
      return (
        <Grid
          xs={12}
          display="flex"
          justifyContent="start"
          alignItems="center"
          pt="7px"
          pb="7px"
          sx={{ cursor: "pointer" }}
        >
          <Grid
            xs={12}
            display="flex"
            justifyContent="start"
            alignItems="center"
            onClick={() => {
              let _filterProductsBy = filterProductsBy;
              if (
                filterProductsBy.filter((f) => f.value === a && f.title === title)
                  .length === 0
              ) {
                _filterProductsBy.push({ title: title, value: a });
                _generalAttributes.push({ title: title, value: a });

                setGeneralAttributes(_generalAttributes)
                setFilterProductsBy(_filterProductsBy);
                setTrigger(trigger + 1);
              }
            }}
          >
            {a == "Daily" ? (
              <SvgIcon
                titleAccess="title"
                component={(componentProps) => (
                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 19 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.56225 13.6835V10.9523H8.24719V10.2279H5.56225V8.07617H8.48825V7.3518H4.75V13.6835H5.56225ZM9.47625 13.6835H10.279V10.6637C10.279 10.0059 10.5486 9.46792 11.4107 9.46792C11.5591 9.46792 11.7171 9.47267 11.8014 9.48573V8.7578C11.7015 8.74279 11.6007 8.73485 11.4998 8.73405C10.8086 8.73405 10.4417 9.11405 10.298 9.40736H10.2743V8.80886H9.47625V13.6835ZM12.8072 7.63561C12.8072 7.91823 13.0352 8.1403 13.3178 8.1403C13.3865 8.14362 13.4552 8.13295 13.5197 8.10894C13.5842 8.08493 13.6431 8.04807 13.693 8.00061C13.7428 7.95314 13.7824 7.89605 13.8095 7.8328C13.8366 7.76955 13.8506 7.70145 13.8506 7.63264C13.8506 7.56383 13.8366 7.49573 13.8095 7.43248C13.7824 7.36923 13.7428 7.31214 13.693 7.26467C13.6431 7.2172 13.5842 7.18035 13.5197 7.15634C13.4552 7.13232 13.3865 7.12166 13.3178 7.12498C13.2506 7.12435 13.1839 7.13712 13.1217 7.16256C13.0594 7.188 13.0029 7.22559 12.9553 7.27313C12.9078 7.32067 12.8702 7.37721 12.8448 7.43945C12.8193 7.50169 12.8066 7.56838 12.8072 7.63561ZM12.9188 13.6835H13.7168V8.80886H12.9188V13.6835Z"
                      fill={
                        filterProductsBy.find(
                          (f) => f.title === title && f.value === a
                        ) !== undefined
                          ? "#CB929B"
                          : "#757575"
                      }
                    />
                    <path
                      d="M4.15625 0C4.31372 0 4.46474 0.0625556 4.57609 0.173905C4.68744 0.285255 4.75 0.436278 4.75 0.59375V1.1875H14.25V0.59375C14.25 0.436278 14.3126 0.285255 14.4239 0.173905C14.5353 0.0625556 14.6863 0 14.8438 0C15.0012 0 15.1522 0.0625556 15.2636 0.173905C15.3749 0.285255 15.4375 0.436278 15.4375 0.59375V1.1875H16.625C17.2549 1.1875 17.859 1.43772 18.3044 1.88312C18.7498 2.32852 19 2.93261 19 3.5625V16.625C19 17.2549 18.7498 17.859 18.3044 18.3044C17.859 18.7498 17.2549 19 16.625 19H2.375C1.74511 19 1.14102 18.7498 0.695621 18.3044C0.250223 17.859 0 17.2549 0 16.625V3.5625C0 2.93261 0.250223 2.32852 0.695621 1.88312C1.14102 1.43772 1.74511 1.1875 2.375 1.1875H3.5625V0.59375C3.5625 0.436278 3.62506 0.285255 3.73641 0.173905C3.84776 0.0625556 3.99878 0 4.15625 0ZM1.1875 4.75V16.625C1.1875 16.9399 1.31261 17.242 1.53531 17.4647C1.75801 17.6874 2.06006 17.8125 2.375 17.8125H16.625C16.9399 17.8125 17.242 17.6874 17.4647 17.4647C17.6874 17.242 17.8125 16.9399 17.8125 16.625V4.75H1.1875Z"
                      fill={
                        filterProductsBy.find(
                          (f) => f.title === title && f.value === a
                        ) !== undefined
                          ? "#CB929B"
                          : "#757575"
                      }
                    />
                  </svg>
                )}
              />
            ) : a == "Weekly" ? (
              <SvgIcon
                titleAccess="title"
                component={(componentProps) => (
                  <svg
                    width="19"
                    height="20"
                    viewBox="0 0 19 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.0625 8.125C13.0625 7.95924 13.1251 7.80027 13.2364 7.68306C13.3478 7.56585 13.4988 7.5 13.6562 7.5H14.8438C15.0012 7.5 15.1522 7.56585 15.2636 7.68306C15.3749 7.80027 15.4375 7.95924 15.4375 8.125V9.375C15.4375 9.54076 15.3749 9.69973 15.2636 9.81694C15.1522 9.93415 15.0012 10 14.8438 10H13.6562C13.4988 10 13.3478 9.93415 13.2364 9.81694C13.1251 9.69973 13.0625 9.54076 13.0625 9.375V8.125ZM9.5 8.125C9.5 7.95924 9.56256 7.80027 9.6739 7.68306C9.78525 7.56585 9.93628 7.5 10.0938 7.5H11.2812C11.4387 7.5 11.5897 7.56585 11.7011 7.68306C11.8124 7.80027 11.875 7.95924 11.875 8.125V9.375C11.875 9.54076 11.8124 9.69973 11.7011 9.81694C11.5897 9.93415 11.4387 10 11.2812 10H10.0938C9.93628 10 9.78525 9.93415 9.6739 9.81694C9.56256 9.69973 9.5 9.54076 9.5 9.375V8.125ZM3.5625 11.875C3.5625 11.7092 3.62506 11.5503 3.73641 11.4331C3.84776 11.3158 3.99878 11.25 4.15625 11.25H5.34375C5.50122 11.25 5.65224 11.3158 5.76359 11.4331C5.87494 11.5503 5.9375 11.7092 5.9375 11.875V13.125C5.9375 13.2908 5.87494 13.4497 5.76359 13.5669C5.65224 13.6842 5.50122 13.75 5.34375 13.75H4.15625C3.99878 13.75 3.84776 13.6842 3.73641 13.5669C3.62506 13.4497 3.5625 13.2908 3.5625 13.125V11.875ZM7.125 11.875C7.125 11.7092 7.18756 11.5503 7.29891 11.4331C7.41026 11.3158 7.56128 11.25 7.71875 11.25H8.90625C9.06372 11.25 9.21475 11.3158 9.32609 11.4331C9.43744 11.5503 9.5 11.7092 9.5 11.875V13.125C9.5 13.2908 9.43744 13.4497 9.32609 13.5669C9.21475 13.6842 9.06372 13.75 8.90625 13.75H7.71875C7.56128 13.75 7.41026 13.6842 7.29891 13.5669C7.18756 13.4497 7.125 13.2908 7.125 13.125V11.875Z"
                      fill={
                        filterProductsBy.find(
                          (f) => f.title === title && f.value === a
                        ) !== undefined
                          ? "#CB929B"
                          : "#757575"
                      }
                    />
                    <path
                      d="M4.15625 0C4.31372 0 4.46475 0.065848 4.57609 0.183058C4.68744 0.300269 4.75 0.45924 4.75 0.625V1.25H14.25V0.625C14.25 0.45924 14.3126 0.300269 14.4239 0.183058C14.5353 0.065848 14.6863 0 14.8438 0C15.0012 0 15.1522 0.065848 15.2636 0.183058C15.3749 0.300269 15.4375 0.45924 15.4375 0.625V1.25H16.625C17.2549 1.25 17.859 1.51339 18.3044 1.98223C18.7498 2.45107 19 3.08696 19 3.75V17.5C19 18.163 18.7498 18.7989 18.3044 19.2678C17.859 19.7366 17.2549 20 16.625 20H2.375C1.74511 20 1.14102 19.7366 0.695621 19.2678C0.250223 18.7989 0 18.163 0 17.5V3.75C0 3.08696 0.250223 2.45107 0.695621 1.98223C1.14102 1.51339 1.74511 1.25 2.375 1.25H3.5625V0.625C3.5625 0.45924 3.62506 0.300269 3.73641 0.183058C3.84776 0.065848 3.99878 0 4.15625 0ZM1.1875 5V17.5C1.1875 17.8315 1.31261 18.1495 1.53531 18.3839C1.75801 18.6183 2.06006 18.75 2.375 18.75H16.625C16.9399 18.75 17.242 18.6183 17.4647 18.3839C17.6874 18.1495 17.8125 17.8315 17.8125 17.5V5H1.1875Z"
                      fill={
                        filterProductsBy.find(
                          (f) => f.title === title && f.value === a
                        ) !== undefined
                          ? "#CB929B"
                          : "#757575"
                      }
                    />
                  </svg>
                )}
              />
            ) : a == "Bi Weekly" ? (
              <SvgIcon
                titleAccess="title"
                component={(componentProps) => (
                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 19 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.5 0C8.25244 0 7.0171 0.245725 5.86451 0.723144C4.71191 1.20056 3.66464 1.90033 2.78249 2.78249C1.00089 4.56408 0 6.98044 0 9.5C0 12.0196 1.00089 14.4359 2.78249 16.2175C3.66464 17.0997 4.71191 17.7994 5.86451 18.2769C7.0171 18.7543 8.25244 19 9.5 19C12.0196 19 14.4359 17.9991 16.2175 16.2175C17.9991 14.4359 19 12.0196 19 9.5C19 8.25244 18.7543 7.0171 18.2769 5.86451C17.7994 4.71191 17.0997 3.66464 16.2175 2.78249C15.3354 1.90033 14.2881 1.20056 13.1355 0.723144C11.9829 0.245725 10.7476 0 9.5 0ZM9.5 1.9C11.5156 1.9 13.4487 2.70071 14.874 4.12599C16.2993 5.55126 17.1 7.48435 17.1 9.5C17.1 11.5156 16.2993 13.4487 14.874 14.874C13.4487 16.2993 11.5156 17.1 9.5 17.1V1.9Z"
                      fill={
                        filterProductsBy.find(
                          (f) => f.title === title && f.value === a
                        ) !== undefined
                          ? "#CB929B"
                          : "#757575"
                      }
                    />
                  </svg>
                )}
              />
            ) : a == "Monthly" ? (
              <SvgIcon
                titleAccess="title"
                component={(componentProps) => (
                  <svg
                    width="19"
                    height="20"
                    viewBox="0 0 19 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3.04039 14.165L3.68164 12.1625H6.03764L6.67889 14.165H7.53152L5.27764 7.5H4.45114L2.19727 14.165H3.04039ZM4.87389 8.50625L5.81914 11.475H3.90014L4.85014 8.50625H4.87389ZM11.6973 9.03375H10.8945V12.2125C10.8945 13.0275 10.4029 13.4912 9.70227 13.4912C9.0622 13.4912 8.53852 13.1837 8.53852 12.2262V9.03375H7.73577V12.4662C7.73577 13.6425 8.45539 14.2475 9.4612 14.2475C10.2402 14.2475 10.6998 13.8975 10.872 13.4912H10.904V14.165H11.6973V9.03375ZM14.3786 15.3412C13.7101 15.3412 13.298 14.9612 13.209 14.5462H12.3931C12.5048 15.4 13.1353 16.045 14.3739 16.045C15.4783 16.045 16.4473 15.3862 16.4473 14.0725V9.03375H15.6766V9.75625H15.654C15.4272 9.32125 14.8976 8.95625 14.235 8.95625C13.089 8.95625 12.2875 9.805 12.2875 11.3137V11.7387C12.2875 13.2762 13.0985 14.1162 14.235 14.1162C14.8976 14.1162 15.432 13.75 15.6267 13.3063H15.6505V14.0625C15.6505 14.8687 15.1481 15.3412 14.3786 15.3412ZM14.3881 9.67875C15.1576 9.67875 15.6493 10.3375 15.6493 11.3775V11.6937C15.6493 12.7537 15.1861 13.3987 14.3881 13.3987C13.5664 13.3987 13.0843 12.7587 13.0843 11.6937V11.3775C13.0843 10.2925 13.5664 9.67875 14.3881 9.67875Z"
                      fill={
                        filterProductsBy.find(
                          (f) => f.title === title && f.value === a
                        ) !== undefined
                          ? "#CB929B"
                          : "#757575"
                      }
                    />
                    <path
                      d="M4.15625 0C4.31372 0 4.46475 0.065848 4.57609 0.183058C4.68744 0.300269 4.75 0.45924 4.75 0.625V1.25H14.25V0.625C14.25 0.45924 14.3126 0.300269 14.4239 0.183058C14.5353 0.065848 14.6863 0 14.8438 0C15.0012 0 15.1522 0.065848 15.2636 0.183058C15.3749 0.300269 15.4375 0.45924 15.4375 0.625V1.25H16.625C17.2549 1.25 17.859 1.51339 18.3044 1.98223C18.7498 2.45107 19 3.08696 19 3.75V17.5C19 18.163 18.7498 18.7989 18.3044 19.2678C17.859 19.7366 17.2549 20 16.625 20H2.375C1.74511 20 1.14102 19.7366 0.695621 19.2678C0.250223 18.7989 0 18.163 0 17.5V3.75C0 3.08696 0.250223 2.45107 0.695621 1.98223C1.14102 1.51339 1.74511 1.25 2.375 1.25H3.5625V0.625C3.5625 0.45924 3.62506 0.300269 3.73641 0.183058C3.84776 0.065848 3.99878 0 4.15625 0ZM1.1875 5V17.5C1.1875 17.8315 1.31261 18.1495 1.53531 18.3839C1.75801 18.6183 2.06006 18.75 2.375 18.75H16.625C16.9399 18.75 17.242 18.6183 17.4647 18.3839C17.6874 18.1495 17.8125 17.8315 17.8125 17.5V5H1.1875Z"
                      fill={
                        filterProductsBy.find(
                          (f) => f.title === title && f.value === a
                        ) !== undefined
                          ? "#CB929B"
                          : "#757575"
                      }
                    />
                  </svg>
                )}
              />
            ) : a == "Quarterly" ? (
              <SvgIcon
                titleAccess="title"
                component={(componentProps) => (
                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 19 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.49899 19L10.4491 19L10.4491 10.4491L19 10.4491L19 9.49899C18.9996 7.62016 18.4422 5.78363 17.3981 4.22157C16.3541 2.65951 14.8704 1.44205 13.1346 0.723114C11.3988 0.00417071 9.48874 -0.183976 7.64599 0.182454C5.80324 0.548884 4.1105 1.45344 2.78177 2.78177C1.45344 4.1105 0.548883 5.80324 0.182452 7.64599C-0.183978 9.48874 0.00416822 11.3988 0.723111 13.1346C1.44205 14.8704 2.65951 16.3541 4.22157 17.3981C5.78363 18.4422 7.62016 18.9996 9.49899 19ZM4.12141 4.12141C5.12709 3.114 6.39546 2.40924 7.78206 2.08738C9.16868 1.76553 10.6178 1.83952 11.9644 2.30094C13.311 2.76235 14.501 3.59264 15.3988 4.69725C16.2967 5.80186 16.8663 7.1364 17.0428 8.54889L8.54889 8.54889L8.54889 17.0428C7.1364 16.8663 5.80186 16.2967 4.69725 15.3988C3.59264 14.501 2.76235 13.311 2.30093 11.9644C1.83952 10.6178 1.76553 9.16867 2.08738 7.78206C2.40923 6.39545 3.114 5.12709 4.12141 4.12141Z"
                      fill={
                        filterProductsBy.find(
                          (f) => f.title === title && f.value === a
                        ) !== undefined
                          ? "#CB929B"
                          : "#757575"
                      }
                    />
                  </svg>
                )}
              />
            ) : (
              ""
            )}
            <Typography
              variant="h34"
              fontWeight="400"
              color={
                filterProductsBy.find((f) => f.title === title && f.value === a) !==
                undefined
                  ? "G1.main"
                  : "G2.main"
              }
              pl="17px"
            >
              {a}
            </Typography>
          </Grid>

          <Grid
            pr="5px"
            onClick={() => {
              let _filterProductsBy = filterProductsBy;
              _filterProductsBy = _filterProductsBy.filter((t) => t.title !== title || t.value !== a);
              _generalAttributes= _generalAttributes.filter(
                (t) => t.title !== title || t.value !== a
              );

              setGeneralAttributes(_generalAttributes)
              setFilterProductsBy(_filterProductsBy);
              setTrigger(trigger + 1);
            }}
            sx={{
              visibility:
              filterProductsBy.find((f) => f.title === title && f.value === a) !==
                undefined
                  ? "visible"
                  : "hidden",
            }}
          >
            <SvgIcon
              titleAccess="title"
              component={(componentProps) => (
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="7.5" cy="7.5" r="7" stroke="#9E9E9E" />
                  <path
                    d="M8.11643 7.49963L10.8707 4.74945C10.953 4.66712 10.9993 4.55545 10.9993 4.43902C10.9993 4.32258 10.953 4.21092 10.8707 4.12859C10.7884 4.04625 10.6767 4 10.5603 4C10.4439 4 10.3322 4.04625 10.2499 4.12859L7.5 6.88313L4.75012 4.12859C4.66779 4.04625 4.55614 4 4.43972 4C4.3233 4 4.21164 4.04625 4.12932 4.12859C4.04699 4.21092 4.00075 4.32258 4.00075 4.43902C4.00075 4.55545 4.04699 4.66712 4.12932 4.74945L6.88357 7.49963L4.12932 10.2498C4.08834 10.2904 4.05582 10.3388 4.03362 10.3921C4.01143 10.4454 4 10.5025 4 10.5602C4 10.618 4.01143 10.6751 4.03362 10.7284C4.05582 10.7817 4.08834 10.83 4.12932 10.8707C4.16996 10.9116 4.21831 10.9442 4.27159 10.9664C4.32486 10.9886 4.382 11 4.43972 11C4.49743 11 4.55457 10.9886 4.60785 10.9664C4.66112 10.9442 4.70948 10.9116 4.75012 10.8707L7.5 8.11612L10.2499 10.8707C10.2905 10.9116 10.3389 10.9442 10.3922 10.9664C10.4454 10.9886 10.5026 11 10.5603 11C10.618 11 10.6751 10.9886 10.7284 10.9664C10.7817 10.9442 10.83 10.9116 10.8707 10.8707C10.9117 10.83 10.9442 10.7817 10.9664 10.7284C10.9886 10.6751 11 10.618 11 10.5602C11 10.5025 10.9886 10.4454 10.9664 10.3921C10.9442 10.3388 10.9117 10.2904 10.8707 10.2498L8.11643 7.49963Z"
                    fill="#9E9E9E"
                  />
                </svg>
              )}
            />
          </Grid>
        </Grid>
      );
    });
  };
  const shapeFilter = (temp, title, uniqueChars) => {
    let _generalAttributes = generalAttributes;
    return (
      <Grid
        xs={12}
        display="flex"
        justifyContent={
          uniqueChars > 1
            ? "start"
            : window.innerWidth > 1180
            ? "start"
            : "start"
        }
        alignItems="center"
        flexWrap="wrap"
        pt="7px"
        pb="7px"
      >
        {uniqueChars.map((a) => {
          return (
            <Grid
              xs={ window.innerWidth>330?4:6}
              md={
                window.innerWidth > 1080 ? 4 : window.innerWidth > 1016 ? 5 : 4
              }
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              pt="7px"
              pb="7px"
              sx={{ cursor: "pointer" }}
            >
              <Grid
                xs={12}
                display="flex"
                justifyContent="end"
                alignSelf="end"
                sx={{
                  paddingRight: {
                    sm: "20px",
                    md: window.innerWidth > 1016 ? "5px" : "80px",
                  },
                }}
              >
                <Grid
                  onClick={() => {
                    let _filterProductsBy = filterProductsBy;
                    _filterProductsBy = _filterProductsBy.filter(
                      (t) => t.title !== title || t.value !== a
                    );
                    _generalAttributes= _generalAttributes.filter(
                      (t) => t.title !== title || t.value !== a
                    );
                    setGeneralAttributes(_generalAttributes)
                    setFilterProductsBy(_filterProductsBy);
                    setTrigger(trigger + 1);
                  }}
                  sx={{
                    visibility:
                    filterProductsBy.find((f) => f.title === title && f.value === a) !==
                      undefined
                        ? "visible"
                        : "hidden",
                  }}
                >
                  <SvgIcon
                    titleAccess="title"
                    component={(componentProps) => (
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="7.5" cy="7.5" r="7" stroke="#9E9E9E" />
                        <path
                          d="M8.11643 7.49963L10.8707 4.74945C10.953 4.66712 10.9993 4.55545 10.9993 4.43902C10.9993 4.32258 10.953 4.21092 10.8707 4.12859C10.7884 4.04625 10.6767 4 10.5603 4C10.4439 4 10.3322 4.04625 10.2499 4.12859L7.5 6.88313L4.75012 4.12859C4.66779 4.04625 4.55614 4 4.43972 4C4.3233 4 4.21164 4.04625 4.12932 4.12859C4.04699 4.21092 4.00075 4.32258 4.00075 4.43902C4.00075 4.55545 4.04699 4.66712 4.12932 4.74945L6.88357 7.49963L4.12932 10.2498C4.08834 10.2904 4.05582 10.3388 4.03362 10.3921C4.01143 10.4454 4 10.5025 4 10.5602C4 10.618 4.01143 10.6751 4.03362 10.7284C4.05582 10.7817 4.08834 10.83 4.12932 10.8707C4.16996 10.9116 4.21831 10.9442 4.27159 10.9664C4.32486 10.9886 4.382 11 4.43972 11C4.49743 11 4.55457 10.9886 4.60785 10.9664C4.66112 10.9442 4.70948 10.9116 4.75012 10.8707L7.5 8.11612L10.2499 10.8707C10.2905 10.9116 10.3389 10.9442 10.3922 10.9664C10.4454 10.9886 10.5026 11 10.5603 11C10.618 11 10.6751 10.9886 10.7284 10.9664C10.7817 10.9442 10.83 10.9116 10.8707 10.8707C10.9117 10.83 10.9442 10.7817 10.9664 10.7284C10.9886 10.6751 11 10.618 11 10.5602C11 10.5025 10.9886 10.4454 10.9664 10.3921C10.9442 10.3388 10.9117 10.2904 10.8707 10.2498L8.11643 7.49963Z"
                          fill="#9E9E9E"
                        />
                      </svg>
                    )}
                  />
                </Grid>
              </Grid>
              <Grid
                display="flex"
                justifyContent="start"
                alignItems="center"
                pt={a == "Oval" ? "7px" : 0}
                onClick={() => {
                  let _filterProductsBy = filterProductsBy;
                  if (
                    filterProductsBy.filter((f) => f.value === a && f.title === title)
                      .length === 0
                  ) {
                    _filterProductsBy.push({ title: title, value: a });
                    _generalAttributes.push({ title: title, value: a });
                    setGeneralAttributes(_generalAttributes)
                    setFilterProductsBy(_filterProductsBy);
                    setTrigger(trigger + 1);
                  }
                }}
              >
                {a == "Square" ? (
                  <SvgIcon
                    titleAccess="title"
                    component={(componentProps) => (
                      <svg
                        version="1.0"
                        xmlns="http://www.w3.org/2000/svg"
                        width="58.000000pt"
                        height="58.000000pt"
                        viewBox="0 0 288.000000 288.000000"
                        preserveAspectRatio="xMidYMid meet"
                      >
                        <g
                          transform="translate(0.000000,288.000000) scale(0.100000,-0.100000)"
                          fill={
                            filterProductsBy.find(
                              (f) => f.title === title && f.value === a
                            ) !== undefined
                              ? window.innerWidth > 1016
                                ? "#000000"
                                : "#CB929B"
                              : "#9E9E9E"
                          }
                          stroke="none"
                        >
                          <path
                            d="M270 1870 c-140 -9 -152 -15 -165 -91 -15 -90 5 -141 76 -190 23 -16
                        24 -20 21 -151 -5 -216 25 -307 133 -406 92 -84 134 -96 370 -100 274 -5 351
                        12 448 98 46 41 89 110 109 175 5 16 13 79 18 138 12 156 28 172 160 172 134
                        -1 148 -16 160 -172 12 -161 47 -244 130 -316 98 -84 176 -100 446 -95 238 5
                        278 16 372 103 101 93 136 197 132 394 -3 156 -5 147 40 176 48 30 65 82 55
                        162 -11 89 -17 93 -190 103 -83 5 -258 10 -390 10 -291 0 -324 -7 -490 -94
                        -159 -84 -210 -100 -294 -93 -58 4 -85 15 -213 81 -204 105 -208 106 -533 104
                        -148 0 -326 -4 -395 -8z m772 -98 c96 -47 144 -116 169 -241 15 -80 7 -261
                        -16 -323 -23 -65 -94 -141 -163 -175 l-57 -28 -230 0 c-166 0 -240 4 -268 13
                        -63 23 -130 83 -167 153 l-35 64 0 170 c0 166 1 171 28 227 42 86 114 143 212
                        169 17 4 127 7 245 6 l216 -2 66 -33z m1379 11 c67 -31 116 -78 152 -147 l32
                        -61 0 -170 c0 -161 -1 -173 -25 -220 -31 -64 -98 -131 -158 -158 -44 -21 -62
                        -22 -282 -22 -226 0 -237 1 -288 24 -68 31 -144 113 -169 183 -28 80 -25 311
                        4 390 27 74 65 123 120 155 84 49 111 53 348 50 199 -3 224 -5 266 -24z"
                          />
                        </g>
                      </svg>
                    )}
                  />
                ) : a == "Round" ? (
                  <svg
                    version="1.1"
                    id="Layer_1"
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="58.000000pt"
                    height="58.000000pt"
                    viewBox="0 0 288 275"
                  >
                    <path
                      fill={
                        filterProductsBy.find(
                          (f) => f.title === title && f.value === a
                        ) !== undefined
                          ? window.innerWidth > 1016
                            ? "#000000"
                            : "#CB929B"
                          : "#9E9E9E"
                      }
                      opacity="1.000000"
                      stroke="none"
                      d="
                  M215.894684,83.000015 
                    C236.746750,83.550781 256.391022,96.562225 263.951172,118.393227 
                    C264.694183,120.538742 265.216217,122.195572 268.121033,122.162704 
                    C269.383575,122.148407 270.665405,123.839912 271.938477,124.756668 
                    C271.037720,125.940613 270.047302,127.068367 269.260437,128.323700 
                    C268.408691,129.682526 267.103088,131.159210 267.100494,132.586487 
                    C267.070770,149.036316 261.485962,163.069183 249.245041,174.199295 
                    C241.050064,181.650620 231.377563,185.630341 220.312836,187.149109 
                    C202.007660,189.661728 186.497101,183.892075 173.987122,171.189224 
                    C163.324585,160.362305 158.854065,146.602951 159.908875,131.124603 
                    C160.434570,123.410355 158.489899,121.488167 151.241135,119.079391 
                    C144.212387,116.743721 138.031647,118.903252 132.259232,122.543114 
                    C130.966629,123.358185 130.275803,125.790405 130.078171,127.563942 
                    C129.243744,135.052292 129.549164,142.770294 127.860321,150.037750 
                    C125.018967,162.264618 117.761528,172.085571 107.196442,178.843491 
                    C97.854538,184.819016 87.370575,188.339127 76.134857,187.930847 
                    C49.875275,186.976654 27.071814,168.971786 23.999260,141.936371 
                    C23.547354,137.960052 23.216484,133.969971 22.749014,129.156311 
                    C22.957689,129.234207 21.742407,129.090500 20.985447,128.425262 
                    C19.854555,127.431412 19.046358,126.070374 18.100885,124.865532 
                    C19.328131,123.912659 20.542568,122.942680 21.786053,122.011497 
                    C23.162985,120.980377 25.365456,120.267899 25.839161,118.931358 
                    C33.580936,97.088318 53.538067,82.603661 77.618584,82.772934 
                    C100.465401,82.933533 121.151245,98.906364 127.398628,117.622963 
                    C139.153931,109.763123 150.896149,109.721581 162.633591,117.666855 
                    C169.174698,99.516716 188.545380,81.037811 215.894684,83.000015 
                  M96.201271,93.062134 
                    C90.204948,91.708519 84.233612,89.367844 78.206886,89.215294 
                    C67.082603,88.933716 57.096012,92.417664 47.835896,99.365494 
                    C25.856144,115.856827 23.259033,150.124542 45.984688,169.616196 
                    C57.822971,179.769791 71.135109,182.811295 86.157776,180.054886 
                    C108.893784,175.883209 124.568985,155.930450 123.811958,134.124664 
                    C123.166862,115.542603 113.602631,101.873505 96.201271,93.062134 
                  M259.999176,135.492279 
                    C259.561218,131.419296 259.734192,127.164658 258.585815,123.302940 
                    C251.337311,98.928329 227.406372,84.540108 202.730881,90.290962 
                    C176.745300,96.347160 160.056458,121.929085 168.414551,148.787903 
                    C175.146530,170.421127 197.989395,184.553787 222.268021,180.300690 
                    C242.877869,176.690292 260.454865,155.812653 259.999176,135.492279 
                  z"
                    />
                  </svg>
                ) : a == "Rectangle" ? (
                  <SvgIcon
                    titleAccess="title"
                    component={(componentProps) => (
                      <svg
                        version="1.1"
                        id="Layer_1"
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        width="58.000000pt"
                        height="58.000000pt"
                        viewBox="0 0 284 288"
                      >
                        <path
                          fill={
                            filterProductsBy.find(
                              (f) => f.title === title && f.value === a
                            ) !== undefined
                              ? window.innerWidth > 1016
                                ? "#000000"
                                : "#CB929B"
                              : "#9E9E9E"
                          }
                          opacity="1.000000"
                          stroke="none"
                          d="
                        M36.524857,179.780762 
                          C22.545002,176.164642 18.678825,169.298218 17.008194,156.364685 
                          C16.608704,153.271942 16.342413,150.162201 15.978134,147.064575 
                          C15.903805,146.432526 15.820649,145.384644 15.478713,145.262131 
                          C7.815144,142.516571 12.027696,136.036392 11.166095,131.224136 
                          C11.015659,130.383911 12.485058,128.537567 13.450760,128.337845 
                          C17.578409,127.484230 18.758543,124.206062 20.475067,121.090836 
                          C24.612007,113.582924 32.202499,110.981117 39.742432,110.237976 
                          C51.776264,109.051933 63.953053,109.259918 76.072166,109.016975 
                          C83.232346,108.873436 90.417114,108.674095 97.554977,109.100281 
                          C103.395638,109.449005 109.205215,110.559296 114.989014,111.560555 
                          C122.901154,112.930267 125.471840,118.807869 126.422951,126.151085 
                          C137.588089,120.621712 148.536194,120.090363 158.640594,125.908165 
                          C160.761017,122.125282 162.108582,117.219078 165.324402,114.666603 
                          C168.746262,111.950562 173.848282,110.699043 178.375580,110.171448 
                          C186.393829,109.237022 194.534790,109.383568 202.619339,108.976952 
                          C206.223801,108.795662 209.812225,108.156288 213.414398,108.092896 
                          C227.071030,107.852554 240.747253,108.067497 253.919373,112.151321 
                          C259.073395,113.749245 263.712891,116.753525 266.352936,121.918503 
                          C267.776978,124.704498 269.188324,127.029907 272.477386,128.615570 
                          C274.464355,129.573502 275.982666,133.952194 275.694885,136.572403 
                          C275.318237,140.001755 275.558502,144.865250 270.759644,145.373367 
                          C269.599518,151.912354 268.844818,158.091980 267.361877,164.091599 
                          C264.890503,174.090256 257.527588,178.998718 247.888504,179.867340 
                          C234.751282,181.051193 221.517487,182.062088 208.354462,181.779633 
                          C197.626801,181.549454 186.892609,179.611252 176.256729,177.853165 
                          C169.643372,176.759964 164.812119,172.823318 162.035706,166.359634 
                          C159.255081,159.886124 156.647232,140.372421 158.765182,133.437088 
                          C150.340652,128.927856 141.479935,129.128113 132.549225,131.285583 
                          C129.367401,132.054245 127.847008,134.054123 127.823456,137.960495 
                          C127.780190,145.136414 127.246895,152.416046 125.889015,159.453934 
                          C123.462112,172.032532 118.135017,177.412064 105.374443,178.820007 
                          C89.994461,180.516998 74.490913,181.351181 59.018173,181.838028 
                          C51.679863,182.068924 44.288883,180.625931 36.524857,179.780762 
                        M48.076832,116.337029 
                          C45.037792,116.893700 41.932465,117.216034 38.972797,118.053284 
                          C31.635784,120.128830 25.075518,123.188339 23.878519,131.998520 
                          C22.407007,142.829193 22.032539,153.581497 25.564514,164.163681 
                          C27.229269,169.151474 30.611734,172.287384 35.686855,172.905258 
                          C43.678333,173.878159 51.755829,175.075424 59.756733,174.835876 
                          C74.068047,174.407410 88.386841,173.338226 102.631142,171.852661 
                          C113.404572,170.729095 117.621521,166.732056 118.874069,156.327820 
                          C119.940491,147.469620 120.259079,138.418823 119.806465,129.509232 
                          C119.355942,120.640579 118.191872,119.522659 109.167122,117.711998 
                          C101.642448,116.202286 93.891884,115.245064 86.226433,115.140755 
                          C73.807281,114.971764 61.375904,115.701927 48.076832,116.337029 
                        M170.967606,166.449554 
                          C173.044144,167.656174 175.009369,169.620575 177.215530,169.944672 
                          C190.132675,171.842178 203.067398,173.931381 216.073547,174.807999 
                          C225.597031,175.449890 235.309830,174.934402 244.809448,173.828552 
                          C254.905090,172.653336 259.593201,171.868362 261.842560,158.736771 
                          C263.087280,151.470245 262.856323,143.921249 262.951630,136.495224 
                          C263.065643,127.611320 258.742065,121.049973 250.072083,119.151184 
                          C240.387772,117.030235 230.408920,115.387817 220.530762,115.227013 
                          C206.703415,115.001923 192.818832,115.984192 179.027466,117.217987 
                          C174.711304,117.604118 168.578827,117.264290 167.522415,123.985352 
                          C165.293106,138.168777 163.738419,152.332855 170.967606,166.449554 
                        z"
                        />
                      </svg>
                    )}
                  />
                ) : a == "Pantos" ? (
                  <SvgIcon
                    titleAccess="title"
                    component={(componentProps) => (
                      <svg
                        version="1.1"
                        id="Layer_1"
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        width="58.000000pt"
                        height="58.000000pt"
                        viewBox="0 0 288 288"
                      >
                        <path
                          fill={
                            filterProductsBy.find(
                              (f) => f.title === title && f.value === a
                            ) !== undefined
                              ? window.innerWidth > 1016
                                ? "#000000"
                                : "#CB929B"
                              : "#9E9E9E"
                          }
                          opacity="1.000000"
                          stroke="none"
                          d="
                        M221.086639,198.008759 
                          C206.200775,200.514160 192.749863,197.549652 181.377319,188.621048 
                          C167.903900,178.043060 161.968323,163.170563 161.045776,146.282745 
                          C160.745590,140.787506 161.132156,135.256516 160.903534,129.754379 
                          C160.843704,128.314758 160.030106,126.437874 158.926529,125.584145 
                          C149.932220,118.626160 138.919418,118.906349 130.433243,126.230278 
                          C129.360275,127.156296 128.964645,129.546524 129.154984,131.151703 
                          C131.022568,146.901550 128.109024,161.662506 120.118332,175.327988 
                          C111.944611,189.306442 99.586990,196.156143 83.496368,198.189850 
                          C53.578815,201.971146 30.621479,183.896957 25.072599,155.728928 
                          C23.587925,148.192215 23.130039,140.453232 22.102655,131.999786 
                          C19.219387,131.999786 15.632477,131.976852 12.045979,132.005524 
                          C7.426963,132.042465 5.835645,129.851807 5.865026,125.217163 
                          C5.894418,120.580574 7.944350,118.992691 12.099710,118.999619 
                          C13.932463,119.002670 15.798960,119.220589 17.590965,118.949623 
                          C21.311571,118.387054 24.938070,117.673569 26.882479,113.674156 
                          C32.731304,101.643799 43.392990,95.943451 55.680271,93.244743 
                          C75.911316,88.801308 95.442238,90.432236 112.718765,103.074753 
                          C117.667747,106.696304 121.636276,111.657669 126.545143,116.487572 
                          C138.343552,109.982475 151.250290,109.560516 164.211609,117.120888 
                          C172.925629,103.161545 185.771545,95.140404 201.498245,92.436653 
                          C220.804062,89.117569 239.474335,91.120720 255.661713,103.542198 
                          C258.273651,105.546478 260.343781,108.650986 261.814697,111.661972 
                          C264.482849,117.123726 268.732941,119.129677 274.439575,119.002808 
                          C275.605286,118.976891 276.772125,118.995544 277.938385,119.000885 
                          C282.085358,119.019867 284.102417,120.628212 284.139801,125.248924 
                          C284.177673,129.925735 282.505463,132.031128 277.930817,132.003342 
                          C274.467682,131.982300 271.004303,131.999161 268.213226,131.999161 
                          C266.759857,141.672043 266.330261,151.123337 263.808105,159.978638 
                          C258.124695,179.933273 245.742844,193.708176 224.530701,197.949066 
                          C223.567688,198.141602 222.536453,197.992798 221.086639,198.008759 
                        M258.062256,154.626587 
                          C258.549866,152.753571 259.148865,150.901581 259.507172,149.004150 
                          C261.928070,136.184143 255.777679,119.657639 243.356720,113.194412 
                          C225.123947,103.707016 206.407455,103.593262 187.620956,111.808235 
                          C178.354431,115.860306 170.781677,122.242378 168.247360,132.051132 
                          C163.702866,149.639771 168.505646,165.601532 180.586258,178.880966 
                          C189.388763,188.556992 201.402603,190.941422 214.092667,191.045212 
                          C236.414413,191.227737 253.522858,177.465958 258.062256,154.626587 
                        M121.947075,157.048706 
                          C122.297188,151.141556 123.072746,145.221924 122.899857,139.330124 
                          C122.625664,129.985870 118.393158,122.486305 110.775787,116.954025 
                          C94.959000,105.466751 77.345665,103.687820 58.979477,108.173836 
                          C47.081619,111.079933 37.513378,117.408745 32.703144,129.623840 
                          C29.158335,138.625534 29.563581,147.458389 32.018391,156.472733 
                          C35.851383,170.547943 43.229515,181.896179 57.226151,187.591171 
                          C66.699722,191.445786 76.600334,192.013336 86.709549,190.047455 
                          C97.490189,187.951035 107.117744,183.947891 113.135468,174.232285 
                          C116.370453,169.009399 118.839493,163.312088 121.947075,157.048706 
                        z"
                        />
                      </svg>
                    )}
                  />
                ) : a == "Aviator" ? (
                  <SvgIcon
                    titleAccess="title"
                    component={(componentProps) => (
                      <svg
                        version="1.1"
                        id="Layer_1"
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        width="58.000000pt"
                        height="58.000000pt"
                        viewBox="0 0 258 275"
                      >
                        <path
                          fill={
                            filterProductsBy.find(
                              (f) => f.title === title && f.value === a
                            ) !== undefined
                              ? window.innerWidth > 1016
                                ? "#000000"
                                : "#CB929B"
                              : "#9E9E9E"
                          }
                          opacity="1.000000"
                          stroke="none"
                          d="
                      M1.000000,121.375000 
                        C5.718373,120.593948 7.627106,118.905396 8.312135,113.325615 
                        C10.201214,97.938438 18.144741,87.582558 35.122490,83.910835 
                        C47.920658,81.143021 60.540794,82.057816 73.302322,83.810097 
                        C76.165215,84.203201 79.285660,82.843979 82.266541,82.195053 
                        C83.493393,81.927971 84.651237,81.102577 85.863571,81.048447 
                        C95.290375,80.627563 104.720497,80.191467 114.154129,80.037575 
                        C124.360794,79.871071 134.574463,79.877289 144.781143,80.046013 
                        C153.381088,80.188187 161.993668,80.441605 170.562622,81.123833 
                        C173.692368,81.373009 176.680771,83.698013 179.789780,83.839073 
                        C184.855118,84.068909 190.022659,83.641739 195.047775,82.856476 
                        C208.906830,80.690781 222.186569,82.224396 234.517105,88.990219 
                        C242.336395,93.280701 245.982346,100.847466 247.944641,109.209892 
                        C248.724625,112.533806 248.934769,115.991425 249.297180,118.613037 
                        C251.436279,120.129295 253.197250,121.377533 254.958221,122.625763 
                        C253.571518,123.705910 252.184830,124.786064 251.344208,125.440857 
                        C248.513687,135.620483 246.423233,145.849533 242.812454,155.510361 
                        C236.896942,171.337616 219.142471,183.450226 201.736389,184.149979 
                        C187.665878,184.715652 174.820740,181.744049 164.103867,172.812805 
                        C158.161743,167.860733 152.881210,161.624008 148.804062,155.036911 
                        C142.256073,144.457947 137.223969,132.994919 138.060944,120.012680 
                        C138.266861,116.818588 139.014053,113.607796 139.921524,110.525116 
                        C140.822647,107.464005 140.035553,105.854424 137.102646,104.489807 
                        C129.670792,101.031952 123.005074,102.404350 116.590668,107.048111 
                        C123.356033,129.429886 114.329865,147.472870 100.997566,164.632385 
                        C86.186684,183.694931 60.278263,188.845001 39.801079,180.708923 
                        C24.016068,174.437134 14.451546,161.722794 10.116910,145.400543 
                        C8.410536,138.975128 7.766923,132.267456 6.654844,125.778702 
                        C4.989713,124.966736 3.280707,124.133369 1.285851,123.650002 
                        C1.000000,123.250000 1.000000,122.500000 1.000000,121.375000 
                      M199.607605,89.000748 
                        C195.348541,89.334053 191.034897,89.348671 186.841751,90.066849 
                        C178.047852,91.572998 169.068283,92.669975 160.623306,95.369064 
                        C149.855286,98.810623 142.512985,109.510963 143.249481,120.091476 
                        C143.965164,130.372757 147.016891,140.069611 152.887817,148.888702 
                        C160.047104,159.643127 167.467773,169.749893 180.170090,174.694839 
                        C202.068771,183.219910 225.252350,175.009979 236.000534,154.045731 
                        C242.240555,141.874634 243.079483,128.723343 241.716995,115.628860 
                        C240.933731,108.101143 238.772888,100.328247 231.234436,95.659081 
                        C221.732101,89.773529 211.206573,89.275452 199.607605,89.000748 
                      M76.606728,90.999649 
                        C75.009689,90.669083 73.415001,90.066032 71.815239,90.052284 
                        C61.621666,89.964661 51.404377,89.579483 41.238506,90.117004 
                        C29.151711,90.756096 18.587284,98.841621 16.435444,109.466827 
                        C15.042338,116.345604 14.746801,123.620049 15.139175,130.651367 
                        C15.985601,145.819260 20.953955,159.157806 33.464745,169.094284 
                        C48.398708,180.955338 68.111336,180.473526 83.024498,171.414322 
                        C97.873627,162.394012 106.567459,148.216278 111.656860,132.145218 
                        C114.302536,123.790825 115.039764,114.486191 109.801476,106.400574 
                        C102.270561,94.776138 90.194664,92.130630 76.606728,90.999649 
                      M95.083748,86.000412 
                        C94.048874,86.000412 93.014008,86.000412 93.199951,86.000412 
                        C99.824249,90.424622 107.052933,95.252487 114.906418,100.497643 
                        C123.839233,95.407448 133.843765,96.467552 143.663101,101.505379 
                        C148.955566,93.648979 156.549255,89.331757 164.946320,86.000282 
                        C141.949966,86.000282 118.953629,86.000282 95.083748,86.000412 
                      z"
                        />
                      </svg>
                    )}
                  />
                ) : a == "Navigator" ? (
                  <SvgIcon
                    titleAccess="title"
                    component={(componentProps) => (
                      <svg
                        version="1.1"
                        id="Layer_1"
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        width="58.000000pt"
                        height="58.000000pt"
                        viewBox="0 0 280 255"
                      >
                        <path
                          fill={
                            filterProductsBy.find(
                              (f) => f.title === title && f.value === a
                            ) !== undefined
                              ? window.innerWidth > 1016
                                ? "#000000"
                                : "#CB929B"
                              : "#9E9E9E"
                          }
                          opacity="1.000000"
                          stroke="none"
                          d="
                      M221.125061,178.008759 
                        C215.074188,178.342789 209.365906,179.529053 203.913589,178.800278 
                        C195.436157,177.667160 186.968842,175.761200 178.792358,173.229645 
                        C164.942581,168.941559 157.951080,157.789871 154.222168,144.856979 
                        C150.528152,132.045166 149.801102,118.803879 153.711304,105.671310 
                        C146.841156,102.086441 139.796326,102.281982 132.529190,103.951744 
                        C129.369827,104.677673 128.679672,106.353355 129.059006,109.224709 
                        C129.786987,114.735115 131.198135,120.320839 130.838959,125.777451 
                        C129.860565,140.641785 126.752411,154.896545 115.526817,166.010468 
                        C108.035194,173.427567 98.341331,176.039780 88.601097,177.770050 
                        C74.715775,180.236649 60.802032,179.256241 47.077106,175.622559 
                        C28.836155,170.793289 19.279652,158.286301 16.140112,140.472870 
                        C14.750504,132.588394 14.499401,124.481750 14.079645,116.457748 
                        C13.895595,112.939468 13.143123,110.219299 10.172108,107.948212 
                        C5.967045,104.733810 4.230534,94.081360 6.968651,89.382080 
                        C7.599339,88.299667 9.014933,87.284485 10.243427,87.005768 
                        C16.720945,85.536171 23.209057,83.530785 29.776688,83.151352 
                        C48.616974,82.062881 67.494240,81.219955 86.362518,81.090622 
                        C128.699066,80.800423 171.041565,80.731216 213.376205,81.138374 
                        C229.343628,81.291946 245.298676,82.970291 261.252228,84.058304 
                        C263.503479,84.211838 265.808319,84.710335 267.921204,85.497704 
                        C271.094910,86.680397 275.733154,86.635498 275.861877,91.355110 
                        C276.018768,97.107483 277.705078,103.522102 272.066315,107.907806 
                        C269.058838,110.246933 267.766998,112.987564 267.970428,116.754761 
                        C268.716553,130.570679 266.288757,143.684021 260.399872,156.369202 
                        C254.955322,168.097305 244.657776,172.417831 233.601624,175.887512 
                        C229.752975,177.095276 225.597641,177.325806 221.125061,178.008759 
                      M162.410889,144.934372 
                        C166.376663,157.490616 174.992813,165.257523 187.417435,168.958389 
                        C203.840836,173.850342 220.103378,172.843842 236.036652,166.896194 
                        C244.848434,163.606873 251.717606,158.353287 255.215393,148.831192 
                        C259.770844,136.429764 261.660797,123.789352 260.930237,110.746475 
                        C260.390839,101.115898 255.533646,93.999352 245.755005,91.771317 
                        C229.657944,88.103661 213.387390,87.427788 197.105072,88.229881 
                        C189.084686,88.624992 180.984680,90.762451 173.307770,93.288017 
                        C169.722366,94.467545 165.993484,97.865128 164.159363,101.249100 
                        C156.667160,115.072372 158.190857,129.647491 162.410889,144.934372 
                      M58.240875,88.989471 
                        C53.146008,89.329155 47.955055,89.177071 42.983597,90.148399 
                        C38.122520,91.098152 33.064819,92.478706 28.850409,94.957275 
                        C22.841122,98.491440 20.928185,105.124390 21.168726,111.590973 
                        C21.526993,121.222473 22.300077,130.955276 24.201105,140.381897 
                        C26.375679,151.164978 31.329647,161.074631 42.232277,165.509399 
                        C57.651131,171.781143 73.647881,174.166840 90.251808,170.049393 
                        C104.287910,166.568726 115.045357,159.686966 119.604843,145.090530 
                        C123.097328,133.909897 124.304558,122.548401 121.829552,111.151115 
                        C119.834190,101.962547 115.888092,93.808685 105.057884,91.909195 
                        C98.824097,90.815865 92.674614,88.711472 86.419731,88.394806 
                        C77.370445,87.936684 68.260025,88.686356 58.240875,88.989471 
                      M164.413788,88.919273 
                        C166.357468,85.639030 163.169739,87.078384 162.459824,87.073830 
                        C147.649475,86.978821 132.838333,87.001602 118.027420,87.030830 
                        C117.501289,87.031868 116.975769,87.336502 116.902054,87.359375 
                        C120.016830,90.812706 123.033600,94.157387 126.100975,97.558167 
                        C135.963120,94.889702 146.256546,95.414795 155.785126,97.518639 
                        C158.610535,94.494301 161.150101,91.775955 164.413788,88.919273 
                      z"
                        />
                      </svg>
                    )}
                  />
                ) : a == "Butterfly" ? (
                  <SvgIcon
                    titleAccess="title"
                    component={(componentProps) => (
                      <svg
                        version="1.1"
                        id="Layer_1"
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        width="58.000000pt"
                        height="58.000000pt"
                        viewBox="0 0 280 284"
                      >
                        <path
                          fill={
                            filterProductsBy.find(
                              (f) => f.title === title && f.value === a
                            ) !== undefined
                              ? window.innerWidth > 1016
                                ? "#000000"
                                : "#CB929B"
                              : "#9E9E9E"
                          }
                          opacity="1.000000"
                          stroke="none"
                          d="
                        M23.346363,93.014671 
                          C33.477856,93.004494 43.181236,92.442146 52.794754,93.132027 
                          C66.810867,94.137856 81.084663,93.639519 94.670067,98.078735 
                          C107.156342,102.158821 117.608749,109.132927 124.106544,120.782005 
                          C136.769623,118.127838 149.084564,118.223122 161.806488,120.734489 
                          C168.201035,110.003532 177.565125,102.077477 189.848740,98.830208 
                          C199.407196,96.303368 209.384613,94.877518 219.262756,94.161667 
                          C232.810455,93.179878 246.439758,93.151131 260.035431,93.104218 
                          C264.387085,93.089195 268.868439,93.896576 273.041412,95.154129 
                          C274.981537,95.738808 277.572845,98.195709 277.719971,99.981010 
                          C278.280457,106.781799 278.200867,113.668297 277.808411,120.491013 
                          C277.712616,122.156624 275.724335,123.930817 274.249359,125.258751 
                          C269.894135,129.179794 266.975616,133.777969 264.740814,139.309418 
                          C260.003174,151.035660 256.194336,163.388184 247.412842,173.019974 
                          C240.781311,180.293640 232.689606,185.507004 222.952408,187.500198 
                          C206.854904,190.795349 191.336731,189.931137 177.308212,180.071701 
                          C170.798111,175.496323 165.235641,170.190140 161.911392,162.741272 
                          C158.321106,154.696243 153.459412,147.431412 151.461151,138.398895 
                          C150.251556,132.931244 142.752762,136.968414 138.168732,136.177795 
                          C136.972473,135.971497 134.759048,137.631302 134.144333,138.958237 
                          C133.008804,141.409439 133.053223,144.391174 132.007553,146.902679 
                          C124.479744,164.983124 115.317963,181.778778 94.270210,186.944214 
                          C75.930420,191.445099 58.598152,190.085541 43.405910,177.061417 
                          C35.991955,170.705505 31.108473,162.780960 27.151243,154.170685 
                          C24.583752,148.584274 22.942060,142.571686 20.363302,136.991394 
                          C18.815443,133.641891 16.799610,130.128372 14.057033,127.785492 
                          C6.992008,121.750122 5.947280,114.442757 7.902714,106.060226 
                          C8.088099,105.265526 7.970670,104.400841 7.999402,103.568832 
                          C8.243345,96.504791 10.452007,94.348244 17.567228,93.964935 
                          C19.349268,93.868927 21.108416,93.347939 23.346363,93.014671 
                        M41.599606,106.929749 
                          C38.125881,111.151436 33.173840,114.842087 31.433664,119.686485 
                          C23.792789,140.957581 34.205818,161.771378 49.720760,173.794052 
                          C61.353889,182.808670 75.114342,183.781982 89.102364,180.958282 
                          C109.596848,176.821121 127.404442,157.394302 121.899673,134.314178 
                          C119.214371,123.055328 113.448303,113.919502 102.422783,108.741898 
                          C94.051819,104.810867 85.444443,102.679749 76.171455,101.787697 
                          C64.302429,100.645920 53.122498,102.231422 41.599606,106.929749 
                        M230.874527,102.380760 
                          C222.538071,102.254417 214.123474,101.355431 205.884079,102.188774 
                          C194.465729,103.343643 183.183502,106.562126 174.848831,114.882050 
                          C160.249115,129.455902 158.275574,152.082138 174.160172,168.456802 
                          C187.774734,182.491394 204.896866,184.763977 223.262421,180.272385 
                          C241.725327,175.757019 258.516602,151.425613 257.092285,132.147614 
                          C255.911423,116.165115 248.983124,104.851837 230.874527,102.380760 
z"
                        />
                      </svg>
                    )}
                  />
                ) : a == "Hexagon" ? (
                  <SvgIcon
                    titleAccess="title"
                    component={(componentProps) => (
                      <svg
                        version="1.1"
                        id="Layer_1"
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        width="58.000000pt"
                        height="58.000000pt"
                        viewBox="0 0 280 288"
                      >
                        <path
                          fill={
                            filterProductsBy.find(
                              (f) => f.title === title && f.value === a
                            ) !== undefined
                              ? window.innerWidth > 1016
                                ? "#000000"
                                : "#CB929B"
                              : "#9E9E9E"
                          }
                          opacity="1.000000"
                          stroke="none"
                          d="
                          M206.964020,99.957016 
                          C209.776611,100.255272 212.396927,100.105980 214.580368,101.010887 
                          C228.995834,106.985306 243.563599,112.687157 257.538025,119.580139 
                          C262.535309,122.045082 267.099213,123.026260 272.380371,123.082191 
                          C277.115021,123.132332 278.080780,126.474022 278.060089,130.611877 
                          C278.039429,134.756668 276.116821,136.228775 272.201752,136.032593 
                          C269.053558,135.874847 265.891144,136.000656 261.999237,136.000656 
                          C261.999237,144.760086 261.772736,153.354324 262.089172,161.928497 
                          C262.262848,166.634018 261.087433,169.239105 256.263733,171.134247 
                          C241.746857,176.837646 227.579269,183.427643 213.086380,189.196838 
                          C210.579559,190.194733 206.852020,189.596527 204.195358,188.503387 
                          C189.476486,182.446960 174.886353,176.072296 160.351624,169.583786 
                          C159.183670,169.062393 158.138168,166.874115 158.103622,165.434830 
                          C157.895844,156.776917 157.909622,148.110077 158.049728,139.449463 
                          C158.097610,136.489120 156.938736,135.438644 154.341721,133.753296 
                          C144.878525,127.612129 135.963242,128.753891 126.990875,134.140747 
                          C125.644569,134.949051 124.178825,136.868362 124.132896,138.316986 
                          C123.863777,146.804764 123.913475,155.306702 124.043045,163.801010 
                          C124.094322,167.162399 123.159836,168.868744 119.652542,170.315765 
                          C105.378815,176.204758 91.396088,182.795807 77.179642,188.830154 
                          C74.803574,189.838715 71.399231,190.349869 69.152702,189.427734 
                          C53.974289,183.197556 39.004616,176.460983 23.904501,170.036102 
                          C20.881144,168.749710 19.818501,167.005600 19.913273,163.678101 
                          C20.168932,154.701752 20.000732,145.713333 20.000732,136.000305 
                          C16.385921,136.000305 12.964020,135.925949 9.546880,136.021637 
                          C6.255152,136.113815 4.100931,135.192749 3.960118,131.384155 
                          C3.815108,127.462074 4.471945,122.796043 8.814376,123.294861 
                          C17.239952,124.262711 23.505384,119.811470 30.416273,116.877083 
                          C42.983360,111.541054 55.525879,106.134109 67.925140,100.423439 
                          C71.886955,98.598763 75.163399,99.829330 78.516136,101.258698 
                          C93.017464,107.440971 107.519180,113.631874 121.845032,120.202759 
                          C123.426659,120.928200 123.883308,124.106331 125.021042,126.479240 
                          C124.358955,126.446732 124.515015,126.499130 124.633789,126.453804 
                          C130.242233,124.313568 135.848541,120.492058 141.452713,120.495750 
                          C146.869522,120.499313 152.283707,124.442863 158.159653,126.843948 
                          C156.472000,120.930557 160.480301,119.756180 164.455765,118.091095 
                          C178.547775,112.188789 192.539780,106.047714 206.964020,99.957016 
                        M165.000244,159.117920 
                          C164.364380,162.636353 166.435135,163.911804 169.339478,165.132828 
                          C179.675888,169.478378 189.836151,174.245117 200.194336,178.535522 
                          C203.849457,180.049454 208.570251,182.495209 211.622711,181.354141 
                          C224.995834,176.355133 237.970764,170.274063 250.980896,164.345764 
                          C252.354202,163.719986 253.830688,161.539978 253.866928,160.047211 
                          C254.117569,149.726318 254.076050,139.395111 253.898911,129.071167 
                          C253.877258,127.809586 252.784561,125.902908 251.693054,125.424149 
                          C238.469543,119.624153 225.174362,113.984634 211.828232,108.471809 
                          C210.468246,107.910049 208.453354,107.960037 207.086533,108.538864 
                          C193.064621,114.476967 179.113815,120.583015 165.000137,126.704224 
                          C165.000137,137.225189 165.000137,147.711121 165.000244,159.117920 
                        M82.651443,111.933670 
                          C78.149956,110.385551 74.386780,106.134369 68.816086,108.592651 
                          C56.476196,114.038109 44.108459,119.425064 31.665562,124.629028 
                          C28.796131,125.829094 27.846832,127.370827 27.919342,130.460907 
                          C28.138098,139.783463 28.145624,149.117966 27.921560,158.440262 
                          C27.838558,161.893677 28.796152,163.736664 32.156509,165.123016 
                          C44.775143,170.328949 57.224174,175.944855 69.804947,181.245316 
                          C71.096680,181.789520 73.026672,181.691818 74.353096,181.145569 
                          C87.585457,175.696030 100.787254,170.167160 113.889389,164.414062 
                          C115.279282,163.803772 116.829140,161.638611 116.862015,160.162643 
                          C117.110237,149.016495 116.997536,137.862320 116.997536,126.726120 
                          C105.691414,121.793922 94.553406,116.935074 82.651443,111.933670 
                        z"
                        />
                      </svg>
                    )}
                  />
                ) : a == "Oval" ? (
                  <SvgIcon
                    titleAccess="title"
                    sx={{ pt: "3px" }}
                    component={(componentProps) => (
                      <svg
                        version="1.1"
                        id="Layer_1"
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        width="58.000000pt"
                        height="70px"
                        viewBox="0 0 290 250"
                      >
                        <path
                          fill={
                            filterProductsBy.find(
                              (f) => f.title === title && f.value === a
                            ) !== undefined
                              ? window.innerWidth > 1016
                                ? "#000000"
                                : "#CB929B"
                              : "#9E9E9E"
                          }
                          opacity="1.000000"
                          stroke="none"
                          d="
                      M73.296127,61.993759 
                        C90.238564,62.363724 105.886230,65.787468 119.812469,75.036575 
                        C122.604912,76.891167 124.946266,79.470573 127.330704,81.879044 
                        C129.147293,83.713928 130.270798,84.399956 133.107864,82.695877 
                        C141.998840,77.355499 151.538040,77.373375 160.940353,81.540573 
                        C163.594391,82.716881 165.353577,83.413528 167.790329,80.848465 
                        C177.062775,71.087776 189.224640,66.616943 201.981979,64.181755 
                        C210.330811,62.588078 218.992111,62.551929 227.526276,62.026657 
                        C241.090424,61.191795 252.873062,66.361656 262.403839,75.210083 
                        C279.215027,90.817635 277.068268,114.554222 262.100616,128.526520 
                        C252.018799,137.937897 239.982620,141.677017 226.657410,143.212067 
                        C210.694168,145.051025 195.135742,144.417999 180.574356,137.084366 
                        C163.030914,128.248825 155.872528,112.372314 160.215302,93.262497 
                        C160.601074,91.564987 160.182434,88.794846 159.030701,87.784561 
                        C152.385529,81.955566 140.780624,82.953415 135.001831,89.642410 
                        C134.247910,90.515083 133.795349,92.225006 134.075836,93.324539 
                        C136.672241,103.503265 135.727753,113.769112 130.460678,122.322151 
                        C125.807076,129.879013 118.524338,135.805054 109.601906,139.038422 
                        C96.035973,143.954514 82.258751,144.823029 67.976486,143.152466 
                        C56.232815,141.778809 45.121525,139.002914 35.736752,131.759705 
                        C18.267756,118.277077 14.069748,93.746613 30.626249,76.803810 
                        C39.515835,67.706810 50.162628,62.789097 62.767826,62.023754 
                        C66.111397,61.820747 69.477615,61.990681 73.296127,61.993759 
                      M189.566040,75.003426 
                        C185.029205,77.522118 180.004730,79.445625 176.055328,82.681335 
                        C167.385849,89.784172 162.806427,98.945587 166.086319,110.412758 
                        C168.411911,118.543465 174.188461,124.523972 181.025040,128.850250 
                        C192.391510,136.043106 205.576813,138.141510 218.616104,137.668137 
                        C227.855316,137.332718 237.299683,134.845184 246.084244,131.720688 
                        C257.662506,127.602531 268.414856,114.593117 268.052979,101.297722 
                        C267.715515,88.898834 257.466461,76.053810 243.912277,70.979431 
                        C232.521545,66.714989 220.959793,67.396011 209.447601,69.408768 
                        C202.959625,70.543106 196.712738,73.056221 189.566040,75.003426 
                      M39.080334,126.566673 
                        C40.892994,127.657211 42.641613,128.876144 44.528774,129.817307 
                        C56.241398,135.658646 68.536919,137.955154 81.699326,137.135239 
                        C94.686050,136.326279 106.997223,133.817230 117.396790,125.744934 
                        C123.683197,120.865326 128.456589,114.633461 129.029160,106.045792 
                        C130.000793,91.473091 120.701752,81.742676 108.563477,76.354942 
                        C94.986320,70.328529 80.666817,67.399994 65.671921,67.952225 
                        C52.281948,68.445358 41.210091,73.622902 32.765072,83.884422 
                        C27.906023,89.788635 26.002102,96.750587 26.878937,104.633148 
                        C27.867321,113.518532 32.359844,120.173767 39.080334,126.566673 
                      z"
                        />
                      </svg>
                    )}
                  />
                ) : a == "Irregular" ? (
                  <SvgIcon
                    titleAccess="title"
                    component={(componentProps) => (
                      <svg
                        version="1.1"
                        id="Layer_1"
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        width="58.000000pt"
                        height="58.000000pt"
                        viewBox="0 0 284 288"
                      >
                        <path
                          fill={
                            filterProductsBy.find(
                              (f) => f.title === title && f.value === a
                            ) !== undefined
                              ? window.innerWidth > 1016
                                ? "#000000"
                                : "#CB929B"
                              : "#9E9E9E"
                          }
                          opacity="1.000000"
                          stroke="none"
                          d="
                        M33.023026,176.348816 
                          C34.184433,176.839096 35.483452,177.635696 36.870193,178.773804 
                          C35.692158,178.295258 34.426395,177.475204 33.023026,176.348816 
                        z"
                        />
                      </svg>
                    )}
                  />
                ) : a == "Cat Eye" ? (
                  <SvgIcon
                    titleAccess="title"
                    component={(componentProps) => (
                      <svg
                        version="1.1"
                        id="Layer_1"
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        width="58.000000pt"
                        height="58.000000pt"
                        viewBox="0 0 284 284"
                      >
                        <path
                          fill={
                            filterProductsBy.find(
                              (f) => f.title === title && f.value === a
                            ) !== undefined
                              ? window.innerWidth > 1016
                                ? "#000000"
                                : "#CB929B"
                              : "#9E9E9E"
                          }
                          opacity="1.000000"
                          stroke="none"
                          d="
                      M215.728821,180.762726 
                        C201.477249,189.556747 186.727386,190.251221 171.649063,184.756836 
                        C164.658905,182.209702 159.847931,176.743591 156.126602,170.405609 
                        C153.658234,166.201614 151.537201,161.780441 148.885529,157.700287 
                        C144.524826,150.990448 136.090149,149.806488 130.851974,155.849411 
                        C126.088844,161.344330 122.478760,167.859970 118.528564,174.033264 
                        C112.849632,182.908203 104.068794,186.592545 94.311317,187.900360 
                        C77.014793,190.218689 62.352734,183.972687 50.481281,171.774612 
                        C40.646496,161.669250 33.464729,149.576370 28.016718,136.535950 
                        C25.592598,130.733536 21.951433,126.194023 16.089733,123.508553 
                        C12.549761,121.886757 7.973518,121.270683 7.961891,115.714607 
                        C7.949191,109.646454 10.960223,105.582893 15.889174,102.572083 
                        C26.369099,96.170540 37.634453,97.076187 48.842041,99.473396 
                        C68.388977,103.654335 85.506790,113.528824 102.710571,123.159882 
                        C110.081818,127.286461 117.487671,131.396240 125.120461,134.999649 
                        C135.651123,139.971115 146.147797,138.739822 156.191376,133.332916 
                        C170.251907,125.763489 184.010147,117.603188 198.281265,110.462166 
                        C213.576080,102.808884 229.496918,96.643143 247.156616,98.037910 
                        C256.370178,98.765594 264.416870,101.788773 268.515320,111.031830 
                        C270.710510,115.982498 269.793304,120.068970 264.777405,121.874420 
                        C254.211441,125.677567 250.222992,134.362732 245.829712,143.542221 
                        C238.861267,158.102249 230.109390,171.556732 215.728821,180.762726 
                      M230.028442,158.466293 
                        C232.507538,151.655502 235.255035,144.927719 237.393936,138.011719 
                        C239.765610,130.343048 236.173920,120.306503 223.521835,119.871773 
                        C203.294785,119.176750 185.121506,126.000351 168.049667,135.301285 
                        C155.380066,142.203812 151.920044,147.443405 157.100906,160.972809 
                        C160.908463,170.915955 167.404480,178.471649 178.290436,180.979034 
                        C198.833649,185.710815 219.290314,176.611603 230.028442,158.466293 
                      M111.539734,174.074051 
                        C116.664413,169.424789 119.671181,163.555130 121.545105,156.984222 
                        C123.486435,150.176956 121.165588,142.834396 115.311501,139.148758 
                        C110.259323,135.967972 105.167229,132.625381 99.663528,130.430832 
                        C85.385818,124.737740 71.129082,118.837555 55.127934,119.920670 
                        C43.495052,120.708107 38.280495,125.472534 40.006134,137.050262 
                        C42.789257,155.722900 51.492149,170.299484 69.408287,178.023712 
                        C83.787422,184.223022 97.905479,184.815674 111.539734,174.074051 
                      z"
                        />
                      </svg>
                    )}
                  />
                ) : (
                  <SvgIcon
                    titleAccess="title"
                    component={(componentProps) => (
                      <svg
                        version="1.1"
                        id="Layer_1"
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        width="58.000000pt"
                        height="58.000000pt"
                        viewBox="0 0 280 285"
                      >
                        <path
                          fill={
                            filterProductsBy.find(
                              (f) => f.title === title && f.value === a
                            ) !== undefined
                              ? window.innerWidth > 1016
                                ? "#000000"
                                : "#CB929B"
                              : "#9E9E9E"
                          }
                          opacity="1.000000"
                          stroke="none"
                          d="
                        M48.889206,188.045685 
                          C45.005108,185.276535 41.121010,182.507385 37.009689,179.085266 
                          C35.483452,177.635696 34.184433,176.839096 32.885418,176.042496 
                          C32.257999,175.276947 31.630583,174.511414 30.985222,173.018585 
                          C30.762220,170.834579 30.705601,169.337967 30.326559,167.928024 
                          C28.631716,161.623718 26.906561,155.326004 25.062838,149.064026 
                          C24.257523,146.328873 23.141508,143.685211 22.166588,141.000000 
                          C22.111149,139.837067 22.015137,138.674438 22.006813,137.511169 
                          C21.950348,129.622803 21.845798,129.869171 14.315918,126.491394 
                          C12.394259,125.629372 10.489126,122.792480 10.194737,120.641449 
                          C9.567824,116.060699 9.857816,111.329163 10.036626,106.669571 
                          C10.284242,100.216980 13.840961,97.060341 20.382334,96.991066 
                          C49.813557,96.679398 79.243958,96.271111 108.675819,96.055618 
                          C114.438652,96.013420 120.221222,96.527100 125.961815,97.108803 
                          C127.378899,97.252396 128.982895,98.396172 129.964706,99.540321 
                          C137.837646,108.714981 147.606369,108.573097 156.324127,99.726097 
                          C159.196976,96.810677 165.364090,96.207901 170.042191,96.157555 
                          C198.704361,95.849068 227.371643,95.961739 256.036896,96.047401 
                          C260.303253,96.060150 264.643341,96.303917 268.801331,97.159698 
                          C270.869629,97.585388 273.451202,99.224472 274.337219,101.031975 
                          C277.786224,108.067848 276.610504,115.646660 275.275360,122.945541 
                          C274.977753,124.572464 271.925171,126.096489 269.844574,126.904305 
                          C266.542358,128.186447 264.309631,128.095383 264.551086,133.728775 
                          C265.159882,147.932358 263.675262,162.466919 254.708145,174.380997 
                          C246.945770,184.694427 236.153275,190.952820 223.209335,192.977509 
                          C212.383499,194.670853 201.529266,194.970947 191.010178,191.464569 
                          C170.561096,184.648148 158.136475,170.770996 153.797379,149.381104 
                          C152.834351,144.633774 149.915176,139.783798 146.604523,136.162354 
                          C143.697174,132.982071 139.115921,134.208511 137.091949,138.175980 
                          C134.620865,143.019913 132.409607,148.157211 131.139771,153.421799 
                          C127.861885,167.011810 120.625473,177.552719 108.053909,185.011780 
                          C105.201843,185.495422 102.971085,185.628082 101.055565,186.474274 
                          C89.056534,191.775024 76.551971,191.771774 63.896770,190.244598 
                          C58.878872,189.639038 53.890839,188.786041 48.889206,188.045685 
                        M160.893524,132.436417 
                          C160.928284,137.445999 160.466629,142.518982 161.096909,147.452484 
                          C162.598068,159.202896 168.434448,168.789932 177.784897,175.887314 
                          C191.298462,186.144745 206.891312,188.234482 222.967072,184.712234 
                          C230.423676,183.078506 238.172745,180.107880 244.229370,175.632385 
                          C248.778625,172.270767 251.858002,165.885284 253.766922,160.230011 
                          C256.561523,151.950897 256.977386,143.243729 256.254181,134.231216 
                          C254.977386,118.319839 248.030716,113.514931 234.570938,111.273315 
                          C224.358109,109.572449 213.685471,109.561638 203.309235,110.228012 
                          C193.809631,110.838074 184.276474,112.774353 175.050034,115.225258 
                          C167.150375,117.323730 161.820969,122.808624 160.893524,132.436417 
                        M30.055735,151.997238 
                          C30.371428,153.252609 30.537504,154.569809 31.026690,155.753479 
                          C34.656845,164.537354 36.875935,173.694427 46.889164,178.808380 
                          C58.340786,184.656952 70.100227,186.954590 82.463554,185.833969 
                          C93.486282,184.834839 103.356544,180.555298 111.841728,172.855148 
                          C120.380035,165.106796 124.900177,155.406525 125.761948,144.515076 
                          C127.137131,127.134880 123.764603,118.222824 106.624832,113.470024 
                          C88.111931,108.336464 69.014107,107.495895 50.108238,111.220947 
                          C40.447517,113.124420 31.663624,117.701057 30.478468,129.164764 
                          C29.729548,136.408875 30.125790,143.771362 30.055735,151.997238 
                        z"
                        />
                      </svg>
                    )}
                  />
                )}
              </Grid>
              <Grid
                onClick={() => {
                  let _filterProductsBy = filterProductsBy;
                  if (
                    filterProductsBy.filter((f) => f.value === a && f.title === title)
                      .length === 0
                  ) {
                    _filterProductsBy.push({ title: title, value: a });
                    _generalAttributes.push({ title: title, value: a });
                  }
                  setGeneralAttributes(_generalAttributes)
                  setFilterProductsBy(_filterProductsBy);
                  setTrigger(trigger + 1);
                }}
              >
                <Typography
                  color={
                    filterProductsBy.find((f) => f.title === title && f.value === a) !==
                    undefined
                      ? "P.main"
                      : "G2.main"
                  }
                  variant={
                    window.innerWidth > 1275
                      ? "h34"
                      : window.innerWidth > 899
                      ? "h32"
                      : "h34"
                  }
                  fontWeight="400"
                >
                  {a}
                </Typography>
              </Grid>
            </Grid>
          );
        })}
      </Grid>
    );

  };
  const lensPropertiesFilter = (temp, title, uniqueChars) => {
    let _sideMainAttributes = sideMainAttributes;
    return (
      <Grid
        container
        xs={12}
        md={12}
        display="flex"
        justifyContent="start"
        alignItems="center"
        flexWrap="wrap"
      >
        {uniqueChars.map((a, index) => {
          return (
            <Grid
              item
              xs={window.innerWidth>371? 6:12}
              md={6}
              display="flex"
              justifyContent="center"
              alignItems="center"
              pt={(window.innerWidth<371 && index != 0)||(index != 0 && index != 1) ? "24px" : 0}
              sx={{cursor:'pointer'}}
            >
              <Grid
              
              onClick={() => {
                let _filterProductsBy = filterProductsBy;
                if (
                  filterProductsBy.filter((f) => f.value === a && f.title === title)
                    .length === 0
                ) {
                  _filterProductsBy.push({ title: title, value: a });
                  _sideMainAttributes.push({ title: title, value: a });
                  setSideMainAttributes(_sideMainAttributes)
                  setFilterProductsBy(_filterProductsBy);
                  setTrigger(trigger + 1);
                }
              }}
                xs={12}
                md={
                  window.innerWidth > 1380
                    ? 12
                    : window.innerWidth > 1220
                    ? 12
                    : window.innerWidth > 955
                    ? 12
                    : 12
                }
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Grid xs={3}>
                  <Grid
                    width="25px"
                    height="25px"
                    borderRadius="50px"
                    bgcolor={
                      filterProductsBy.find((f) => f.title === title && f.value === a) !==
                      undefined
                        ? "P.main"
                        : "P3.main"
                    }
                  ></Grid>
                </Grid>
                <Grid xs={9}>
                  <Typography
                    pl="10px"
                    color={
                      filterProductsBy.find((f) => f.title === title && f.value === a) !==
                      undefined
                        ? "G1.main"
                        : "#9E9E9E"
                    }
                    variant={
                      window.innerWidth > 1535
                        ? "h15"
                        : window.innerWidth > 1184
                        ? "h15"
                        : window.innerWidth > 955
                        ? "h15"
                        : window.innerWidth > 899
                        ? "h15"
                        :window.innerWidth > 445? "h2"
                        :"h21"
                    }
                    fontWeight="400"
                  >
                    {a}
                  </Typography>
                </Grid>
              </Grid>
              <Grid
              display='flex'
              alignItems='center'
                pr="10px"
                onClick={() => {
                  let _filterProductsBy = filterProductsBy;
                  _filterProductsBy = _filterProductsBy.filter((t) => t.title !== title || t.value !== a);
                  _sideMainAttributes= _sideMainAttributes.filter(
                    (t) => t.title !== title || t.value !== a
                  );

                  setSideMainAttributes(_sideMainAttributes)
                  setFilterProductsBy(_filterProductsBy);
                  setTrigger(trigger + 1);
                }}
                sx={{
                  visibility:
                  filterProductsBy.find((f) => f.title === title && f.value === a) !==
                    undefined
                      ? "visible"
                      : "hidden",
                }}
              >
                <SvgIcon
                  titleAccess="title"
                  component={(componentProps) => (
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="7.5" cy="7.5" r="7" stroke="#9E9E9E" />
                      <path
                        d="M8.11643 7.49963L10.8707 4.74945C10.953 4.66712 10.9993 4.55545 10.9993 4.43902C10.9993 4.32258 10.953 4.21092 10.8707 4.12859C10.7884 4.04625 10.6767 4 10.5603 4C10.4439 4 10.3322 4.04625 10.2499 4.12859L7.5 6.88313L4.75012 4.12859C4.66779 4.04625 4.55614 4 4.43972 4C4.3233 4 4.21164 4.04625 4.12932 4.12859C4.04699 4.21092 4.00075 4.32258 4.00075 4.43902C4.00075 4.55545 4.04699 4.66712 4.12932 4.74945L6.88357 7.49963L4.12932 10.2498C4.08834 10.2904 4.05582 10.3388 4.03362 10.3921C4.01143 10.4454 4 10.5025 4 10.5602C4 10.618 4.01143 10.6751 4.03362 10.7284C4.05582 10.7817 4.08834 10.83 4.12932 10.8707C4.16996 10.9116 4.21831 10.9442 4.27159 10.9664C4.32486 10.9886 4.382 11 4.43972 11C4.49743 11 4.55457 10.9886 4.60785 10.9664C4.66112 10.9442 4.70948 10.9116 4.75012 10.8707L7.5 8.11612L10.2499 10.8707C10.2905 10.9116 10.3389 10.9442 10.3922 10.9664C10.4454 10.9886 10.5026 11 10.5603 11C10.618 11 10.6751 10.9886 10.7284 10.9664C10.7817 10.9442 10.83 10.9116 10.8707 10.8707C10.9117 10.83 10.9442 10.7817 10.9664 10.7284C10.9886 10.6751 11 10.618 11 10.5602C11 10.5025 10.9886 10.4454 10.9664 10.3921C10.9442 10.3388 10.9117 10.2904 10.8707 10.2498L8.11643 7.49963Z"
                        fill="#9E9E9E"
                      />
                    </svg>
                  )}
                />
              </Grid>
            </Grid>
          );
        })}
      </Grid>     
    );
  };
  const genderFilter = (temp, title, uniqueChars) => {
    
    return (
      <Grid
        container
        xs={12}
        md={12}
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexWrap="wrap"
      >
        {uniqueChars.map(a=>{
          return(
            a==="Men"?
              <Grid
                xs={4}
                md={window.innerWidth > 1140 ? 4 : window.innerWidth < 1016 ? 4 : 5}
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                pt="7px"
                pb="7px"
                borderRadius="8px"
                sx={{ cursor: "pointer" }}
              >
                <Grid
                  container
                  xs={12}
                  md={12}
                  display="flex"
                  justifyContent="end"
                  sx={{ visibility: gender == a ? "visible" : "hidden" }}
                >
                  <Grid
                    xs={window.innerWidth > 613 ? 4 : 5}
                    md={window.innerWidth > 1013 ? 5 : 4}
                  ></Grid>
                  <Grid xs={4} md={window.innerWidth > 1013 ? 4 : 4}></Grid>
                  <Grid
                    xs={window.innerWidth > 613 ? 4 : 3}
                    md={window.innerWidth > 1013 ? 3 : 4}
                    onClick={() => {
                      if (window.innerWidth < 1016) {
                        setShowFilterList(false);
                      }
  
                      history.push({
                        pathname: `/Products/${_category}/${type}/All`,
                        state: {
                          categoryName: _category,
                          genderName: "All",
                          valueId: "All",
                          search:
                            location.state != undefined ? location.state.search : "",
                        },
                      });
                    }}
                  >
                    <SvgIcon
                      titleAccess="title"
                      onClick={() => {
                        history.push({
                          pathname: `/Products/${_category}/All/All`,
                          state: {
                            categoryName: _category,
                            genderName: "All",
                            valueId: "All",
                            search:
                              location.state != undefined
                                ? location.state.search
                                : "",
                          },
                        });
                        setTrigger(trigger + 1);
                      }}
                      component={(componentProps) => (
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 15 15"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle cx="7.5" cy="7.5" r="7" stroke={"#9E9E9E"} />
                          <path
                            d="M8.11643 7.49963L10.8707 4.74945C10.953 4.66712 10.9993 4.55545 10.9993 4.43902C10.9993 4.32258 10.953 4.21092 10.8707 4.12859C10.7884 4.04625 10.6767 4 10.5603 4C10.4439 4 10.3322 4.04625 10.2499 4.12859L7.5 6.88313L4.75012 4.12859C4.66779 4.04625 4.55614 4 4.43972 4C4.3233 4 4.21164 4.04625 4.12932 4.12859C4.04699 4.21092 4.00075 4.32258 4.00075 4.43902C4.00075 4.55545 4.04699 4.66712 4.12932 4.74945L6.88357 7.49963L4.12932 10.2498C4.08834 10.2904 4.05582 10.3388 4.03362 10.3921C4.01143 10.4454 4 10.5025 4 10.5602C4 10.618 4.01143 10.6751 4.03362 10.7284C4.05582 10.7817 4.08834 10.83 4.12932 10.8707C4.16996 10.9116 4.21831 10.9442 4.27159 10.9664C4.32486 10.9886 4.382 11 4.43972 11C4.49743 11 4.55457 10.9886 4.60785 10.9664C4.66112 10.9442 4.70948 10.9116 4.75012 10.8707L7.5 8.11612L10.2499 10.8707C10.2905 10.9116 10.3389 10.9442 10.3922 10.9664C10.4454 10.9886 10.5026 11 10.5603 11C10.618 11 10.6751 10.9886 10.7284 10.9664C10.7817 10.9442 10.83 10.9116 10.8707 10.8707C10.9117 10.83 10.9442 10.7817 10.9664 10.7284C10.9886 10.6751 11 10.618 11 10.5602C11 10.5025 10.9886 10.4454 10.9664 10.3921C10.9442 10.3388 10.9117 10.2904 10.8707 10.2498L8.11643 7.49963Z"
                            fill="#9E9E9E"
                          />
                        </svg>
                      )}
                    />
                  </Grid>
                </Grid>
  
                <Grid
                  onClick={() => {
                    if (window.innerWidth < 1016) {
                      setShowFilterList(false);
                    }
                    history.push({
                      pathname: `/Products/${_category}/All/${a}`,
                      state: {
                        categoryName: _category,
                        genderName: a,
                        valueId: "All",
                        search:
                          location.state != undefined ? location.state.search : "",
                      },
                    });
                    setTrigger(trigger + 1);
                  }}
                  bgcolor={
                    gender == "Men"
                      ? window.innerWidth > 1016
                        ? "P3.main"
                        : "P.main"
                      : "#F9F9F9"
                  }
                  borderRadius="52px"
                  width="68.16px"
                  height="68.16px"
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                >
                  <SvgIcon
                    titleAccess="title"
                    component={(componentProps) => (
                      <svg
                        width="23"
                        height="23"
                        viewBox="0 0 23 23"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8.60993 1.36222C6.68341 1.36222 3.72979 2.41852 4.7569 8.95988C4.77264 9.05879 4.79322 9.16574 4.8144 9.28017C5.00203 10.264 4.8144 9.28017 5.31313 12.4646C5.31313 12.4646 5.74988 15.4179 8.65351 15.4179C8.56786 15.8849 8.46043 16.348 8.33151 16.806C8.15538 17.4201 7.78618 17.8554 7.12646 18.0411C6.54542 18.2044 5.93653 18.3366 5.31313 18.4723C5.15273 18.5068 4.99113 18.5419 4.82893 18.5781C4.05118 18.7501 3.2583 18.9404 2.5556 19.2095C1.85109 19.4798 1.19621 19.8438 0.722905 20.3866C0.241125 20.9403 -0.0167116 21.6384 0.00084071 22.5112C0.00689322 22.7826 0.251414 23 0.551619 23H22.4484C22.7486 23 22.9931 22.7826 22.9992 22.5112C23.0167 21.6384 22.7595 20.9403 22.2771 20.3866C21.8044 19.8438 21.1489 19.4792 20.445 19.2095C19.7417 18.9398 18.9488 18.7495 18.1705 18.5776L17.6875 18.4723C17.0635 18.3366 16.4546 18.2044 15.8735 18.0411C15.2138 17.8554 14.8446 17.4201 14.6685 16.806C14.5144 16.2607 13.7084 15.2208 13.6181 14.6629C15.1313 13.5128 15.1285 13.4352 16.9582 12.0753L17.6875 10.3503C16.8286 9.56938 17.0725 10.2117 16.9582 6.7363C16.9582 1.95104 13.7467 -2.25461 8.60993 1.36222Z"
                          fill={
                            gender == a
                              ? window.innerWidth > 1016
                                ? "#757575"
                                : "#000000"
                              : "#9E9E9E"
                          }
                        />
                      </svg>
                    )}
                  />
                </Grid>
                <Typography
                  color={gender == a ? "P.main" : "G2.main"}
                  variant="h34"
                >
                  Men
                </Typography>
              </Grid>
            :a==="Women"?
              <Grid
                xs={window.innerWidth>310?4:6}
                md={window.innerWidth > 1140 ? 4 : window.innerWidth < 1016 ? 4 : 4}
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                pt="7px"
                pb="7px"
                borderRadius="8px"
                sx={{ cursor: "pointer" }}
              >
                <Grid
                  container
                  xs={12}
                  md={12}
                  display="flex"
                  justifyContent="end"
                  sx={{ visibility: gender == a ? "visible" : "hidden" }}
                >
                  <Grid
                    xs={window.innerWidth > 613 ? 4 : 5}
                    md={window.innerWidth > 1013 ? 5 : 4}
                  ></Grid>
                  <Grid xs={4} md={window.innerWidth > 1013 ? 4 : 4}></Grid>
                  <Grid
                    xs={window.innerWidth > 613 ? 4 : 3}
                    md={window.innerWidth > 1013 ? 3 : 4}
                    onClick={() => {
                      if (window.innerWidth < 1016) {
                        setShowFilterList(false);
                      }
                      history.push({
                        pathname: `/Products/${_category}/${type}/All`,
                        state: {
                          categoryName: _category,
                          genderName: "All",
                          valueId: "All",
                          search:
                            location.state != undefined ? location.state.search : "",
                        },
                      });
                      setTrigger(trigger + 1);
                    }}
                  >
                    <SvgIcon
                      titleAccess="title"
                      component={(componentProps) => (
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 15 15"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle cx="7.5" cy="7.5" r="7" stroke="#9E9E9E" />
                          <path
                            d="M8.11643 7.49963L10.8707 4.74945C10.953 4.66712 10.9993 4.55545 10.9993 4.43902C10.9993 4.32258 10.953 4.21092 10.8707 4.12859C10.7884 4.04625 10.6767 4 10.5603 4C10.4439 4 10.3322 4.04625 10.2499 4.12859L7.5 6.88313L4.75012 4.12859C4.66779 4.04625 4.55614 4 4.43972 4C4.3233 4 4.21164 4.04625 4.12932 4.12859C4.04699 4.21092 4.00075 4.32258 4.00075 4.43902C4.00075 4.55545 4.04699 4.66712 4.12932 4.74945L6.88357 7.49963L4.12932 10.2498C4.08834 10.2904 4.05582 10.3388 4.03362 10.3921C4.01143 10.4454 4 10.5025 4 10.5602C4 10.618 4.01143 10.6751 4.03362 10.7284C4.05582 10.7817 4.08834 10.83 4.12932 10.8707C4.16996 10.9116 4.21831 10.9442 4.27159 10.9664C4.32486 10.9886 4.382 11 4.43972 11C4.49743 11 4.55457 10.9886 4.60785 10.9664C4.66112 10.9442 4.70948 10.9116 4.75012 10.8707L7.5 8.11612L10.2499 10.8707C10.2905 10.9116 10.3389 10.9442 10.3922 10.9664C10.4454 10.9886 10.5026 11 10.5603 11C10.618 11 10.6751 10.9886 10.7284 10.9664C10.7817 10.9442 10.83 10.9116 10.8707 10.8707C10.9117 10.83 10.9442 10.7817 10.9664 10.7284C10.9886 10.6751 11 10.618 11 10.5602C11 10.5025 10.9886 10.4454 10.9664 10.3921C10.9442 10.3388 10.9117 10.2904 10.8707 10.2498L8.11643 7.49963Z"
                            fill="#9E9E9E"
                          />
                        </svg>
                      )}
                    />
                  </Grid>
                </Grid>
  
                <Grid
                  onClick={() => {
                    if (window.innerWidth < 1016) {
                      setShowFilterList(false);
                    }
                    history.push({
                      pathname: `/Products/${_category}/All/${a}`,
                      state: {
                        categoryName: _category,
                        genderName: a,
                        valueId: "All",
                        search:
                          location.state != undefined ? location.state.search : "",
                      },
                    });
                    setTrigger(trigger + 1);
                  }}
                  bgcolor={
                    gender == "Women"
                      ? window.innerWidth > 1016
                        ? "P3.main"
                        : "P.main"
                      : "#F9F9F9"
                  }
                  borderRadius="52px"
                  width="68.16px"
                  height="68.16px"
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                >
                  <SvgIcon
                    titleAccess="title"
                    component={(componentProps) => (
                      <svg
                        width="25"
                        height="26"
                        viewBox="0 0 25 26"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9.61161 2.15615C7.65479 2.15615 4.65469 3.27784 5.69796 10.2241C5.71395 10.3292 5.73485 10.4427 5.75637 10.5642C5.94695 11.609 4.88806 13.4201 3.01792 14.7536C4.28989 15.7904 7.45437 16.6331 9.65588 17.0819C9.56889 17.5778 9.45976 18.0696 9.32882 18.5559C9.14992 19.208 8.77491 19.6703 8.1048 19.8675C7.51462 20.0409 6.89616 20.1814 6.26294 20.3255C6.10002 20.3621 5.93588 20.3993 5.77112 20.4378C4.98113 20.6204 4.17578 20.8225 3.46203 21.1083C2.74643 21.3952 2.08124 21.7818 1.60049 22.3582C1.11113 22.9462 0.849236 23.6875 0.867065 24.6144C0.873213 24.9026 1.12158 25.1334 1.42651 25.1334H23.6678C23.9727 25.1334 24.2211 24.9026 24.2273 24.6144C24.2451 23.6875 23.9838 22.9462 23.4938 22.3582C23.0137 21.7818 22.3479 21.3946 21.6329 21.1083C20.9185 20.8219 20.1132 20.6198 19.3226 20.4372L18.832 20.3255C18.1982 20.1814 17.5797 20.0409 16.9895 19.8675C16.3194 19.6703 15.9444 19.208 15.7655 18.5559C15.609 17.977 15.4846 17.3899 15.393 16.7974C17.0762 16.2942 18.8652 15.3899 20.7237 13.9458L22.9981 12.616C22.1257 11.7868 18.2074 11.5534 18.0912 7.86291C18.0912 2.78141 14.8292 -1.68459 9.61161 2.15615Z"
                          fill={
                            gender == a
                              ? window.innerWidth > 1016
                                ? "#757575"
                                : "#000000"
                              : "#9E9E9E"
                          }
                        />
                      </svg>
                    )}
                  />
                </Grid>
                <Typography
                  color={gender == a ? "P.main" : "G2.main"}
                  variant="h34"
                >
                  Women
                </Typography>
              </Grid>
            :a==="Unisex"&&(
              <Grid
                xs={window.innerWidth>310?4:12}
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                pt="7px"
                pb="7px"
                borderRadius="8px"
                sx={{ cursor: "pointer" }}
              >
                <Grid
                  container
                  xs={12}
                  md={12}
                  display="flex"
                  justifyContent="end"
                  sx={{ visibility: gender == a ? "visible" : "hidden" }}
                  onClick={() => {
                    if (window.innerWidth < 1016) {
                      setShowFilterList(false);
                    }
                    history.push({
                      pathname: `/Products/${_category}/${type}/All`,
                      state: {
                        categoryName: _category,
                        genderName: "All",
                        valueId: "All",
                        search:
                          location.state != undefined ? location.state.search : "",
                      },
                    });
                    setTrigger(trigger + 1);
                  }}
                >
                  <Grid
                    xs={window.innerWidth > 613 ? 4 : 5}
                    md={window.innerWidth > 1013 ? 5 : 4}
                  ></Grid>
                  <Grid xs={4} md={window.innerWidth > 1013 ? 4 : 4}></Grid>
                  <Grid
                    xs={window.innerWidth > 613 ? 4 : 3}
                    md={window.innerWidth > 1013 ? 3 : 4}
                  >
                    <SvgIcon
                      titleAccess="title"
                      onClick={() => {
                        history.push({
                          pathname: `/Products/${_category}/All/All`,
                          state: {
                            categoryName: _category,
                            genderName: "All",
                            valueId: "All",
                            search:
                              location.state != undefined
                                ? location.state.search
                                : "",
                          },
                        });
                        setTrigger(trigger + 1);
                      }}
                      component={(componentProps) => (
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 15 15"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle cx="7.5" cy="7.5" r="7" stroke="#9E9E9E" />
                          <path
                            d="M8.11643 7.49963L10.8707 4.74945C10.953 4.66712 10.9993 4.55545 10.9993 4.43902C10.9993 4.32258 10.953 4.21092 10.8707 4.12859C10.7884 4.04625 10.6767 4 10.5603 4C10.4439 4 10.3322 4.04625 10.2499 4.12859L7.5 6.88313L4.75012 4.12859C4.66779 4.04625 4.55614 4 4.43972 4C4.3233 4 4.21164 4.04625 4.12932 4.12859C4.04699 4.21092 4.00075 4.32258 4.00075 4.43902C4.00075 4.55545 4.04699 4.66712 4.12932 4.74945L6.88357 7.49963L4.12932 10.2498C4.08834 10.2904 4.05582 10.3388 4.03362 10.3921C4.01143 10.4454 4 10.5025 4 10.5602C4 10.618 4.01143 10.6751 4.03362 10.7284C4.05582 10.7817 4.08834 10.83 4.12932 10.8707C4.16996 10.9116 4.21831 10.9442 4.27159 10.9664C4.32486 10.9886 4.382 11 4.43972 11C4.49743 11 4.55457 10.9886 4.60785 10.9664C4.66112 10.9442 4.70948 10.9116 4.75012 10.8707L7.5 8.11612L10.2499 10.8707C10.2905 10.9116 10.3389 10.9442 10.3922 10.9664C10.4454 10.9886 10.5026 11 10.5603 11C10.618 11 10.6751 10.9886 10.7284 10.9664C10.7817 10.9442 10.83 10.9116 10.8707 10.8707C10.9117 10.83 10.9442 10.7817 10.9664 10.7284C10.9886 10.6751 11 10.618 11 10.5602C11 10.5025 10.9886 10.4454 10.9664 10.3921C10.9442 10.3388 10.9117 10.2904 10.8707 10.2498L8.11643 7.49963Z"
                            fill="#9E9E9E"
                          />
                        </svg>
                      )}
                    />
                  </Grid>
                </Grid>
                <Grid
                  xs={12}
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                  onClick={() => {
                    if (window.innerWidth < 1016) {
                      setShowFilterList(false);
                    }
                    history.push({
                      pathname: `/Products/${_category}/All/${a}`,
                      state: {
                        categoryName: _category,
                        genderName: a,
                        valueId: "All",
                        search:
                          location.state != undefined ? location.state.search : "",
                      },
                    });
                    setTrigger(trigger + 1);
                  }}
                >
                  <Grid
                    bgcolor={
                      gender == a
                        ? window.innerWidth > 1016
                          ? "P3.main"
                          : "P.main"
                        : "#F9F9F9"
                    }
                    borderRadius="52px"
                    width="68.16px"
                    height="68.16px"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <SvgIcon
                      titleAccess="title"
                      component={(componentProps) => (
                        <svg
                          width="39"
                          height="23"
                          viewBox="0 0 39 23"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M24.6099 1.36222C22.6834 1.36222 19.7298 2.41852 20.7569 8.95988C20.7726 9.05879 20.7932 9.16574 20.8144 9.28017C21.002 10.264 20.8144 9.28017 21.3131 12.4646C21.3131 12.4646 21.7499 15.4179 24.6535 15.4179C24.5679 15.8849 24.4604 16.348 24.3315 16.806C24.1554 17.4201 23.7862 17.8554 23.1265 18.0411C22.5454 18.2044 21.9365 18.3366 21.3131 18.4723C21.1527 18.5068 20.9911 18.5419 20.8289 18.5781C20.0512 18.7501 19.2583 18.9404 18.5556 19.2095C17.8511 19.4798 17.1962 19.8438 16.7229 20.3866C16.2411 20.9403 15.9833 21.6384 16.0008 22.5112C16.0069 22.7826 16.2514 23 16.5516 23H38.4484C38.7486 23 38.9931 22.7826 38.9992 22.5112C39.0167 21.6384 38.7595 20.9403 38.2771 20.3866C37.8044 19.8438 37.1489 19.4792 36.445 19.2095C35.7417 18.9398 34.9488 18.7495 34.1705 18.5776L33.6875 18.4723C33.0635 18.3366 32.4546 18.2044 31.8735 18.0411C31.2138 17.8554 30.8446 17.4201 30.6685 16.806C30.5144 16.2607 29.7084 15.2208 29.6181 14.6629C31.1313 13.5128 31.1285 13.4352 32.9582 12.0753L33.6875 10.3503C32.8286 9.56938 33.0725 10.2117 32.9582 6.7363C32.9582 1.95104 29.7467 -2.25461 24.6099 1.36222Z"
                            fill={
                              gender == a
                                ? window.innerWidth > 1016
                                  ? "#757575"
                                  : "#000000"
                                : "#9E9E9E"
                            }
                          />
                          <path
                            d="M7.86124 1.36222C6.10225 1.36222 3.40546 2.41852 4.34326 8.95988C4.35763 9.05879 4.37641 9.16574 4.39576 9.28017C4.56707 10.264 3.61524 11.9695 1.93417 13.2253C3.07754 14.2017 5.92209 14.9952 7.90103 15.4179C7.82283 15.8849 7.72474 16.348 7.60703 16.806C7.44622 17.4201 7.10912 17.8553 6.50677 18.0411C5.97625 18.2044 5.42031 18.3366 4.85112 18.4723C4.70467 18.5068 4.55712 18.5419 4.40902 18.5781C3.6989 18.7501 2.97497 18.9404 2.33338 19.2095C1.69013 19.4798 1.09219 19.8437 0.660043 20.3866C0.220158 20.9403 -0.0152584 21.6384 0.000767605 22.5112C0.00629381 22.7826 0.229552 23 0.503652 23H20.4963C20.7704 23 20.9937 22.7826 20.9992 22.5112C21.0153 21.6384 20.7804 20.9403 20.34 20.3866C19.9084 19.8437 19.3099 19.4792 18.6672 19.2095C18.025 18.9398 17.3011 18.7495 16.5904 18.5776L16.1494 18.4723C15.5797 18.3366 15.0237 18.2044 14.4932 18.0411C13.8909 17.8553 13.5538 17.4201 13.393 16.806C13.2522 16.2607 13.1405 15.7079 13.0581 15.1499C14.5712 14.6761 16.1793 13.8245 17.8498 12.4646L19.8943 11.2123C19.1102 10.4314 15.588 10.2117 15.4835 6.7363C15.4835 1.95104 12.5513 -2.25461 7.86124 1.36222Z"
                            fill={
                              gender == a
                                ? window.innerWidth > 1016
                                  ? "#757575"
                                  : "#000000"
                                : "#9E9E9E"
                            }
                          />
                        </svg>
                      )}
                    />
                  </Grid>
                  <Typography
                    color={gender == a ? "P.main" : "G2.main"}
                    variant="h34"
                  >
                    Unisex
                  </Typography>
                </Grid>
              </Grid>
            )

          )
        })}
        
          
        
      </Grid>
    );

  };
  return (
    <Grid xs={12} md={12} overflow="hidden">
      <Grid>
        <Header trigger={_trigger} _trigger={_trigger_} showShoppingCard={showCartPage} closeShowShoppingCard={()=>{setShowCartPage(false)}}
          isRemoved={(isRemoved) => {
              setIsRemoved(isRemoved)
          }}
          _trigger_={(trigger) => {
              setTrigger(trigger);
              _setTrigger(trigger);
          }}
        />
        <Backdrop
          sx={{
            color: "White.main",
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
          open={loading}
        >
          <Box sx={{ m: 1, position: "relative" }}>
            <Card sx={{ background: "none", boxShadow: "none" }}>
              <CardMedia
                component="img"
                sx={{ width: "50%", margin: "auto" }}
                image={frameIcon}
              ></CardMedia>
            </Card>

            {loading && (
              <CircularProgress
                color="inherit"
                thickness={2}
                size={80}
                sx={{
                  position: "absolute",
                  top: -30,
                  left: 14,
                  zIndex: 1,
                }}
              />
            )}
          </Box>
        </Backdrop>
        <Grid
          item
          xs={12}
          md={12}
          sx={{
            width: "100%",
            backgroundColor: "black",
            overflow: "hidden",
            zIndex: 1000,
          }}
          height={window.innerWidth > 1048 ? "540px" : "300px"}
          position="relative"
        >
          <img
            src={productHeadPic}
            width={"100%"}
            height="100%"
            style={{
              objectFit: window.innerWidth > 1048 ? "cover" : "fill",
              opacity: 0.4,
            }}
          />
        </Grid>
        <Grid
          xs={12}
          backgroundColor="black"
          height="58px"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          pl={4}
          position={
            window.innerWidth > 1048
              ? window.scrollY > 474
                ? "fixed"
                : "relative"
              : window.scrollY > 229
              ? "fixed"
              : "relative"
          }
          width="100%"
          zIndex={1000}
          sx={
            window.innerWidth > 1048
              ? window.scrollY > 474
                ? { top: "58px" }
                : {}
              : window.scrollY > 229
              ? { top: "58px" }
              : {}
          }
        >
          <Grid xs={7}>
            <Typography
              variant={window.innerWidth > 776 ? "h41" :window.innerWidth>348? "h35": window.innerWidth>294?"h32":"h29"}
              fontWeight="500"
              color="White.main"
            >
              {(_category=="Sunglasses"? (gender +
                " " ):"")+(_category === "All" ? "Products" : _category)}                
            </Typography>
          </Grid>

          <Grid
            xs={5}
            display="flex"
            justifyContent="end"
            alignItems="center"
            pr={4}
          >
            
            <IconButton onClick={() => setShowFilterList(!showFilterList)}>
              <FilterListIcon sx={{ color: "White.main" }} />
            </IconButton>
          </Grid>
        </Grid>

        <Grid
          container
          xs={12}
          backgroundColor="GrayLight.main"
          flexDirection="row"
          display="flex"
          flexWrap="wrap"
          position="relative"
        >
          <Grid
            md={window.innerWidth > 1016 ? (showFilterList ? 9 : 12) : 12}
            xs={12}
            display="flex"
            flexWrap="wrap"
            sx={{
              transition: "all 0.5s",
              minHeight: filteredProducts && filteredProducts.length === 0 ? "300px" : "10px",
            }}
            style={
              window.innerWidth > 1048
                ? window.scrollY > 474
                  ? { marginTop: "72px" }
                  : {}
                : window.scrollY > 229
                ? { marginTop: "72px" }
                : {}
            }
          >
            {filteredProducts && filteredProducts.length === 0 ? (
              <Grid
                xs={12}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Typography>Not Found</Typography>
              </Grid>
            ) : (
              <Grid pl={1} container xs={12} spacing={1} pt={8}>
                {filteredProducts.map((product, index) => {
                  return (
                    <Grid
                      item
                      md={
                        window.innerWidth > 1016 ? (showFilterList ? 4 : 4) : 12
                      }
                      xs={12}
                      display="flex"
                    >
                      <Card
                        onMouseEnter={() => {
                          setShowMainVariant(index);
                          setNumberOfVarients(mainVariants(index));
                          let dots = [];
                          for (
                            let index1 = 0;
                            index1 <
                            Math.ceil(mainVariants(index).length / 4);
                            index1++
                          ) {
                            dots.push(index1);
                          }
                          setNumberOfDots(dots);
                        }}
                        onMouseLeave={() => {
                          setShowMainVariant("");
                        }}
                        sx={{
                          cursor: "pointer",
                          width: "100%",
                          border: "1px solid #DCDCDC",
                          borderRadius: "8px",
                          boxShadow: `${
                            index === showMainVariant ? "0.5px" : "none"
                          }`,
                          minHeight: "454px",
                          height: "454px",
                          elevation: 0,
                          ":hover": {
                            boxShadow: "0.25px -0.30px 2.5px 2.5px #5352521c",
                          },
                        }}
                      >
                        <Grid
                          xs={12}
                          display="grid"
                          justifyContent="end"
                          mt={2}
                          mr={2}
                        >
                          {loadingFavoriteProduct === product.id ? (
                            <CircularProgress color="P" />
                          ) : (
                            <IconButton
                              onClick={() =>
                                favoriteProducts.find((f) => f === product.id) ===
                                undefined
                                  ? addToWishList(product.id)
                                  : deleteFromWishList(product.id)
                              }
                              sx={{ margin: "auto" }}
                            >
                              {favoriteProducts.find((f) => f === product.id) !==
                              undefined ? (
                                <FavoriteIcon sx={{ color: "P.main" }} />
                              ) : (
                                <FavoriteBorderIcon
                                  sx={{ color: "GrayLight3.main" }}
                                />
                              )}
                            </IconButton>
                          )}
                        </Grid>
                        <CardMedia
                          onClick={() => {
                            let category = localStorage
                              .getItem(product.category_id)
                              .split("-")[0];
                            let type =
                              localStorage
                                .getItem(product.category_id)
                                .split("-")[1]
                                .trim() == ""
                                ? "All"
                                : localStorage
                                    .getItem(product.category_id)
                                    .split("-")[1]
                                    .trim()
                                    .replace(/\s+/g, "");
                            let gender = "";
                            if (category.includes("Contact Lens")) {
                              gender = "Unisex";
                            } else {
                              gender = product.products[0].general_attributes
                                .find((att) => att.title == "Gender")
                                .value.replace(/\s+/g, "");
                            }
                            category = category.replace(/\s+/g, "");
                            localStorage.setItem("Selected varient Id",'')
                            history.push({
                              pathname: `/Products/${category}/${type}/${gender}/${toCamelCase(
                                product.name
                              )}`,
                            });
                          }}
                          component="img"
                          sx={{
                            width:{xs:window.innerWidth>450?"400px":window.innerWidth>350?"300px":"250px" ,sm:"500px",md:showFilterList?"205px":(window.innerWidth>1017?"280px":"500px")} ,
                            height: "205px",
                            margin: "auto",
                          }}
                          image={
                            imageGroup !== ""
                              ? showMainVariant === index
                                ? imageGroup
                                : product.file_urls != undefined &&
                                  product.file_urls != null
                                ? axiosConfig.defaults.baseURL +
                                  product.file_urls[0]
                                : No_Product_Image
                              : product.file_urls != undefined &&
                                product.file_urls != null
                              ? axiosConfig.defaults.baseURL +
                                product.file_urls[0]
                              : No_Product_Image
                          }
                        />
                        <CardContent
                          sx={{
                            paddingTop: 0,
                            paddingBottom: "5px",
                            "&:last-child": { pb: 0 },
                          }}
                        >
                          <Grid sx={{ height: "98px", pt: "10px" }}>
                            <Fade in={showMainVariant === index}>
                              {numberOfVarients.length < 5 ? (
                                <Grid
                                  xs={12}
                                  display="flex"
                                  justifyContent="center"
                                  pb="10px"
                                  sx={{ cursor: "pointer" }}
                                >
                                  {mainVariants(index).map(
                                    (mainVariant, mainVariantIndex) => {

                                      return (
                                        <Card
                                        
                                          onClick={() => {
                                            let category = localStorage
                                              .getItem(product.category_id)
                                              .split("-")[0];
                                            let type =
                                              localStorage
                                                .getItem(product.category_id)
                                                .split("-")[1]
                                                .trim() == ""
                                                ? "All"
                                                : localStorage
                                                    .getItem(product.category_id)
                                                    .split("-")[1]
                                                    .trim()
                                                    .replace(/\s+/g, "");
                                            let gender = "";
                                            if (category.includes("Contact Lens")) {
                                              gender = "Unisex";
                                            } else {
                                              gender =
                                                product.products[0].general_attributes
                                                  .find((att) => att.title == "Gender")
                                                  .value.replace(/\s+/g, "");
                                            }
                                            category = category.replace(/\s+/g, "");
                                            let variant= product.products.find(
                                              (p) =>
                                                p.main_attributes[0]
                                                  .value === mainVariant
                                            )
                                            localStorage.setItem("Selected varient Id",variant.id)
                                            history.push({
                                              pathname: `/Products/${category}/${type}/${gender}/${toCamelCase(
                                                product.name
                                              )}`,
                                            });
                                          }}
                                          sx={{
                                            border: "1px solid #DCDCDC",
                                            borderRadius: "6px",
                                            width: "50px",
                                            boxShadow: `${
                                              mainVariantIndex ===
                                              imageGroupIndex
                                                ? "1px"
                                                : "none"
                                            }`,
                                            margin: "2px",
                                          }}
                                          onMouseEnter={() => {
                                            setImageGroupIndex(
                                              mainVariantIndex
                                            );
                                            setImageGroup(
                                              axiosConfig.defaults.baseURL +
                                                product.products.find(
                                                  (p) =>
                                                    p.main_attributes[0]
                                                      .value === mainVariant
                                                ).file_urls[0].image_url
                                            );
                                            setPriceGroup(
                                              product.products.find(
                                                (p) =>
                                                  p.main_attributes[0].value ===
                                                  mainVariant
                                              ).price
                                            );
                                          }}
                                          onMouseLeave={() => {
                                            setImageGroup("");
                                            setImageGroupIndex("");
                                            setPriceGroup("");
                                          }}
                                        >
                                          <CardMedia
                                            component="img"
                                            sx={{
                                              width: "90%",
                                              height: "90%",
                                              margin: "2px",
                                            }}
                                            image={
                                              product.products.find(
                                                (p) =>
                                                  p.main_attributes[0].value ===
                                                  mainVariant
                                              )?.file_urls.length === 0
                                                ? No_Product_Image
                                                : axiosConfig.defaults.baseURL +
                                                  product.products.find(
                                                    (p) =>
                                                      p.main_attributes[0]
                                                        .value === mainVariant
                                                  ).file_urls[0].image_url
                                            }
                                          />
                                        </Card>
                                      );
                                    }
                                  )}
                                </Grid>
                              ) : showMainVariant == index ? (
                                <Grid
                                  display="flex"
                                  flexDirection="column"
                                  xs={12}
                                  pb="10px"
                                >
                                  <Grid
                                    xs={12}
                                    md={12}
                                    display="flex"
                                    justifyContent="center"
                                    sx={{ cursor: "pointer" }}
                                  >
                                    {mainVariants(index).map(
                                      (mainVariant, mainVariantIndex) => {
                                        if (
                                          mainVariantIndex >= activeDot * 4 &&
                                          mainVariantIndex < (activeDot + 1) * 4
                                        ) {
                                          return (
                                            <Card
                                              onClick={() => {
                                                let category = localStorage
                                                  .getItem(product.category_id)
                                                  .split("-")[0];
                                                let type =
                                                  localStorage
                                                    .getItem(product.category_id)
                                                    .split("-")[1]
                                                    .trim() == ""
                                                    ? "All"
                                                    : localStorage
                                                        .getItem(product.category_id)
                                                        .split("-")[1]
                                                        .trim()
                                                        .replace(/\s+/g, "");
                                                let gender = "";
                                                if (category.includes("Contact Lens")) {
                                                  gender = "Unisex";
                                                } else {
                                                  gender =
                                                    product.products[0].general_attributes
                                                      .find(
                                                        (att) => att.title == "Gender"
                                                      )
                                                      .value.replace(/\s+/g, "");
                                                }
                                                category = category.replace(/\s+/g, "");
                                                let variant= product.products.find(
                                                  (p) =>
                                                    p.main_attributes[0]
                                                      .value === mainVariant
                                                )
                                                localStorage.setItem("Selected varient Id",variant.id)
                                                history.push({
                                                  pathname: `/Products/${category}/${type}/${gender}/${toCamelCase(
                                                    product.name
                                                  )}`,
                                                });
                                              }}
                                              sx={{
                                                border: "1px solid #DCDCDC",
                                                borderRadius: "6px",
                                                width: "50px",
                                                boxShadow: `${
                                                  mainVariantIndex ===
                                                  imageGroupIndex
                                                    ? "1px"
                                                    : "none"
                                                }`,
                                                margin: "2px",
                                              }}
                                              onMouseEnter={() => {
                                                setImageGroupIndex(
                                                  mainVariantIndex
                                                );
                                                setImageGroup(
                                                  axiosConfig.defaults.baseURL +
                                                    product.products.find(
                                                      (p) =>
                                                        p.main_attributes[0]
                                                          .value === mainVariant
                                                    ).file_urls[0].image_url
                                                );
                                                setPriceGroup(
                                                  product.products.find(
                                                    (p) =>
                                                      p.main_attributes[0]
                                                        .value === mainVariant
                                                  ).price
                                                );
                                              }}
                                              onMouseLeave={() => {
                                                setImageGroup("");
                                                setImageGroupIndex("");
                                                setPriceGroup("");
                                              }}
                                            >
                                              <CardMedia
                                                component="img"
                                                sx={{
                                                  width: "90%",
                                                  height: "90%",
                                                  margin: "2px",
                                                }}
                                                image={
                                                  product.products.find(
                                                    (p) =>
                                                      p.main_attributes[0]
                                                        .value === mainVariant
                                                  )?.file_urls.length === 0
                                                    ? No_Product_Image
                                                    : axiosConfig.defaults
                                                        .baseURL +
                                                      product.products.find(
                                                        (p) =>
                                                          p.main_attributes[0]
                                                            .value ===
                                                          mainVariant
                                                      ).file_urls[0].image_url
                                                }
                                              />
                                            </Card>
                                          );
                                        }
                                      }
                                    )}
                                  </Grid>
                                  <Grid
                                    xs={12}
                                    md={12}
                                    display="flex"
                                    justifyContent="center"
                                    alignSelf="center"
                                    pt="20px"
                                    spacing="50px"
                                    alignItems="center"
                                    container
                                    mt={0}
                                  >

                                    <Grid
                                      item
                                      xs={12}
                                      md={12}
                                      display="flex"
                                      justifyContent="center"
                                      className="dots"
                                    >
                                      {numberOfDots.length > 1 ? (
                                        activeDot == 0 ? (
                                          <Grid
                                            item
                                            xs={2}
                                            md={3}
                                            display="flex"
                                            justifyContent="flex-end"
                                            alignItems="center"
                                          >
                                            <KeyboardArrowLeftIcon color="G3" />
                                          </Grid>
                                        ) : (
                                          <Grid
                                            item
                                            xs={2}
                                            md={3}
                                            display="flex"
                                            justifyContent="flex-end"
                                            alignItems="center"
                                          >
                                            <KeyboardArrowLeftIcon
                                              item
                                              onClick={() => {
                                                setActiveDot(activeDot - 1);
                                              }}
                                            />
                                          </Grid>
                                        )
                                      ) : (
                                        ""
                                      )}

                                      {numberOfDots.length > 1 ? (
                                        <Grid
                                          item
                                          xs={8}
                                          sm={
                                            window.innerWidth > 731 ? 1.2 : 1.8
                                          }
                                          md={
                                            window.innerWidth > 1265
                                              ? 4
                                              : window.innerWidth > 1110
                                              ? 4
                                              : 5
                                          }
                                          spacing={
                                            window.innerWidth > 945 ? 0 : "50px"
                                          }
                                          display="flex"
                                          alignItems="center"
                                          justifyContent="center"
                                          sx={{
                                            maxWidth: {
                                              xs: "70px",
                                              md: "64px",
                                            },
                                          }}
                                          maxWidth={"55px"}
                                          flexWrap="wrap"
                                          pl={0}
                                        >
                                          {numberOfDots.map((n, index1) => {
                                            return activeDot == index1 ? (
                                              <Grid
                                                item
                                                xs={3}
                                                display="flex"
                                                justifyContent="center"
                                                onClick={() => {
                                                  setActiveDot(index1);
                                                }}
                                                height="10px"
                                              >
                                                <Grid
                                                  bgcolor="P.main"
                                                  borderRadius={"10px"}
                                                  width="8px"
                                                  height="8px"
                                                  pt="8px"
                                                ></Grid>
                                              </Grid>
                                            ) : (
                                              <Grid
                                                item
                                                xs={3}
                                                display="flex"
                                                justifyContent="center"
                                                onClick={() => {
                                                  setActiveDot(index1);
                                                }}
                                                height="10px"
                                              >
                                                <Grid
                                                  bgcolor="G3.main"
                                                  borderRadius={"10px"}
                                                  width="8px"
                                                  height="8px"
                                                  pt="8px"
                                                ></Grid>
                                              </Grid>
                                            );
                                          })}
                                        </Grid>
                                      ) : (
                                        ""
                                      )}
                                      {numberOfDots.length > 1 ? (
                                        numberOfDots.length - 1 != activeDot ? (
                                          <Grid
                                            item
                                            md={3}
                                            xs={2}
                                            display="flex"
                                            alignItems="center"
                                          >
                                            <KeyboardArrowRightIcon
                                              item
                                              onClick={() => {
                                                setActiveDot(activeDot + 1);
                                              }}
                                            />
                                          </Grid>
                                        ) : (
                                          <Grid
                                            item
                                            md={3}
                                            xs={2}
                                            display="flex"
                                            alignItems="center"
                                          >
                                            <KeyboardArrowRightIcon
                                              item
                                              color="G3"
                                            />
                                          </Grid>
                                        )
                                      ) : (
                                        ""
                                      )}
                                    </Grid>
                                  </Grid>
                                </Grid>
                              ) : (
                                <Grid
                                  display="flex"
                                  flexDirection="column"
                                  xs={12}
                                  pt="10px"
                                  pb="10px"
                                >
                                  <Grid
                                    xs={12}
                                    md={12}
                                    display="flex"
                                    justifyContent="center"
                                    sx={{ cursor: "pointer" }}
                                    onClick={() => {
                                      let category = localStorage
                                        .getItem(product.category_id)
                                        .split("-")[0];
                                      let type =
                                        localStorage
                                          .getItem(product.category_id)
                                          .split("-")[1]
                                          .trim() == ""
                                          ? "All"
                                          : localStorage
                                              .getItem(product.category_id)
                                              .split("-")[1]
                                              .trim()
                                              .replace(/\s+/g, "");
                                      let gender = "";
                                      if (category.includes("Contact Lens")) {
                                        gender = "Unisex";
                                      } else {
                                        gender =
                                          product.products[0].general_attributes
                                            .find(
                                              (att) => att.title == "Gender"
                                            )
                                            .value.replace(/\s+/g, "");
                                      }
                                      category = category.replace(/\s+/g, "");
                                      history.push({
                                        pathname: `/Products/${category}/${type}/${gender}/${toCamelCase(
                                          product.name
                                        )}`,
                                      });
                                    }}
                                  >
                                    {mainVariants(index).map(
                                      (mainVariant, mainVariantIndex) => {
                                        if (
                                          mainVariantIndex >= 0 * 4 &&
                                          mainVariantIndex < 1 * 4
                                        ) {
                                          return (
                                            <Card
                                              sx={{
                                                border: "1px solid #DCDCDC",
                                                borderRadius: "6px",
                                                width: "50px",
                                                boxShadow: `${
                                                  mainVariantIndex ===
                                                  imageGroupIndex
                                                    ? "1px"
                                                    : "none"
                                                }`,
                                                margin: "2px",
                                              }}
                                              onMouseEnter={() => {
                                                setImageGroupIndex(
                                                  mainVariantIndex
                                                );
                                                setImageGroup(
                                                  axiosConfig.defaults.baseURL +
                                                    product.products.find(
                                                      (p) =>
                                                        p.main_attributes[0]
                                                          .value === mainVariant
                                                    ).file_urls[0].image_url
                                                );
                                                setPriceGroup(
                                                  product.products.find(
                                                    (p) =>
                                                      p.main_attributes[0]
                                                        .value === mainVariant
                                                  ).price
                                                );
                                              }}
                                              onMouseLeave={() => {
                                                setImageGroup("");
                                                setImageGroupIndex("");
                                                setPriceGroup("");
                                              }}
                                            >
                                              <CardMedia
                                                component="img"
                                                sx={{
                                                  width: "90%",
                                                  height: "90%",
                                                  margin: "auto",
                                                }}
                                                image={
                                                  product.products.find(
                                                    (p) =>
                                                      p.main_attributes[0]
                                                        .value === mainVariant
                                                  )?.file_urls.length === 0
                                                    ? No_Product_Image
                                                    : axiosConfig.defaults
                                                        .baseURL +
                                                      product.products.find(
                                                        (p) =>
                                                          p.main_attributes[0]
                                                            .value ===
                                                          mainVariant
                                                      ).file_urls[0].image_url
                                                }
                                              />
                                            </Card>
                                          );
                                        }
                                      }
                                    )}
                                  </Grid>
                                  <Grid
                                    xs={12}
                                    md={12}
                                    display="flex"
                                    justifyContent="center"
                                    alignSelf="center"
                                    pt="20px"
                                    spacing="50px"
                                    alignItems="center"
                                    container
                                    mt={0}
                                  >

                                    <Grid
                                      item
                                      xs={12}
                                      md={12}
                                      display="flex"
                                      justifyContent="center"
                                      className="dots"
                                    >
                                      {numberOfDots.length > 1 ? (
                                        activeDot == 0 ? (
                                          <Grid
                                            item
                                            xs={2}
                                            md={3}
                                            display="flex"
                                            justifyContent="flex-end"
                                            alignItems="center"
                                          >
                                            <KeyboardArrowLeftIcon color="G3" />
                                          </Grid>
                                        ) : (
                                          <Grid
                                            item
                                            xs={2}
                                            md={3}
                                            display="flex"
                                            justifyContent="flex-end"
                                            alignItems="center"
                                          >
                                            <KeyboardArrowLeftIcon
                                              item
                                              onClick={() => {
                                                setActiveDot(activeDot - 1);
                                              }}
                                            />
                                          </Grid>
                                        )
                                      ) : (
                                        ""
                                      )}

                                      {numberOfDots.length > 1 ? (
                                        <Grid
                                          item
                                          xs={8}
                                          sm={
                                            window.innerWidth > 731 ? 1.2 : 1.8
                                          }
                                          md={
                                            window.innerWidth > 1265
                                              ? 4
                                              : window.innerWidth > 1110
                                              ? 4
                                              : 5
                                          }
                                          spacing={
                                            window.innerWidth > 945 ? 0 : "50px"
                                          }
                                          display="flex"
                                          alignItems="center"
                                          justifyContent="center"
                                          sx={{
                                            maxWidth: {
                                              xs: "70px",
                                              md: "64px",
                                            },
                                          }}
                                          maxWidth={"55px"}
                                          flexWrap="wrap"
                                          pl={0}
                                        >
                                          {numberOfDots.map((n, index1) => {
                                            return activeDot == index1 ? (
                                              <Grid
                                                item
                                                xs={3}
                                                display="flex"
                                                justifyContent="center"
                                                onClick={() => {
                                                  setActiveDot(index1);
                                                }}
                                                height="10px"
                                              >
                                                <Grid
                                                  bgcolor="P.main"
                                                  borderRadius={"10px"}
                                                  width="8px"
                                                  height="8px"
                                                  pt="8px"
                                                ></Grid>
                                              </Grid>
                                            ) : (
                                              <Grid
                                                item
                                                xs={3}
                                                display="flex"
                                                justifyContent="center"
                                                onClick={() => {
                                                  setActiveDot(index1);
                                                }}
                                                height="10px"
                                              >
                                                <Grid
                                                  bgcolor="G3.main"
                                                  borderRadius={"10px"}
                                                  width="8px"
                                                  height="8px"
                                                  pt="8px"
                                                ></Grid>
                                              </Grid>
                                            );
                                          })}
                                        </Grid>
                                      ) : (
                                        ""
                                      )}
                                      {numberOfDots.length > 1 ? (
                                        numberOfDots.length - 1 != activeDot ? (
                                          <Grid
                                            item
                                            md={3}
                                            xs={2}
                                            display="flex"
                                            alignItems="center"
                                          >
                                            <KeyboardArrowRightIcon
                                              item
                                              onClick={() => {
                                                setActiveDot(activeDot + 1);
                                              }}
                                            />
                                          </Grid>
                                        ) : (
                                          <Grid
                                            item
                                            md={3}
                                            xs={2}
                                            display="flex"
                                            alignItems="center"
                                          >
                                            <KeyboardArrowRightIcon
                                              item
                                              color="G3"
                                            />
                                          </Grid>
                                        )
                                      ) : (
                                        ""
                                      )}
                                    </Grid>
                                  </Grid>
                                </Grid>
                              )}
                            </Fade>
                          </Grid>
                          <Grid
                            xs={12}
                            display="flex"
                            justifyContent="center"
                            alignContent="center"
                            pt={1}
                            sx={{ cursor: "pointer" }}
                            onClick={() => {
                              let category = localStorage
                                .getItem(product.category_id)
                                .split("-")[0];
                              let type =
                                localStorage
                                  .getItem(product.category_id)
                                  .split("-")[1]
                                  .trim() == ""
                                  ? "All"
                                  : localStorage
                                      .getItem(product.category_id)
                                      .split("-")[1]
                                      .trim()
                                      .replace(/\s+/g, "");
                              let gender = "";
                              if (category.includes("Contact Lens")) {
                                gender = "Unisex";
                              } else {
                                gender = product.products[0].general_attributes
                                  .find((att) => att.title == "Gender")
                                  .value.replace(/\s+/g, "");
                              }
                              category = category.replace(/\s+/g, "");
                              history.push({
                                pathname: `/Products/${category}/${type}/${gender}/${toCamelCase(
                                  product.name
                                )}`,
                              });
                            }}
                          >
                            <Typography variant="h32">
                            {product.products[0].general_attributes.find(a=>a.title=="Brand").value}
                            </Typography>
                          </Grid>
                          <Grid
                            xs={12}
                            display="flex"
                            justifyContent="center"
                            alignContent="center"
                            pt="2px"
                            sx={{ cursor: "pointer" }}
                            onClick={() => {
                              let category = localStorage
                                .getItem(product.category_id)
                                .split("-")[0];
                              let type =
                                localStorage
                                  .getItem(product.category_id)
                                  .split("-")[1]
                                  .trim() == ""
                                  ? "All"
                                  : localStorage
                                      .getItem(product.category_id)
                                      .split("-")[1]
                                      .trim()
                                      .replace(/\s+/g, "");
                              let gender = "";
                              if (category.includes("Contact Lens")) {
                                gender = "Unisex";
                              } else {
                                gender = product.products[0].general_attributes
                                  .find((att) => att.title == "Gender")
                                  .value.replace(/\s+/g, "");
                              }
                              category = category.replace(/\s+/g, "");
                              history.push({
                                pathname: `/Products/${category}/${type}/${gender}/${toCamelCase(
                                  product.name
                                )}`,
                              });
                            }}
                          >
                            <Typography variant="h32">
                              {product.name}
                            </Typography>
                          </Grid>

                          <Grid
                            xs={12}
                            display="flex"
                            justifyContent="center"
                            alignContent="center"
                            height="40px"
                            sx={{ cursor: "pointer" }}
                            onClick={() => {
                              let category = localStorage
                                .getItem(product.category_id)
                                .split("-")[0];
                              let type =
                                localStorage
                                  .getItem(product.category_id)
                                  .split("-")[1]
                                  .trim() == ""
                                  ? "All"
                                  : localStorage
                                      .getItem(product.category_id)
                                      .split("-")[1]
                                      .trim()
                                      .replace(/\s+/g, "");
                              let gender = "";
                              if (category.includes("Contact Lens")) {
                                gender = "Unisex";
                              } else {
                                gender = product.products[0].general_attributes
                                  .find((att) => att.title == "Gender")
                                  .value.replace(/\s+/g, "");
                              }
                              category = category.replace(/\s+/g, "");
                              history.push({
                                pathname: `/Products/${category}/${type}/${gender}/${toCamelCase(
                                  product.name
                                )}`,
                              });
                            }}
                            pt="2px"
                          >
                            <Typography variant="h10">
                              {showMainVariant === index
                                ? ""
                                : mainVariants(index).length +
                                  " " +
                                  (product.products[0].main_attributes[0].title.includes("Color Code")?"Color":product.products[0].main_attributes[0].title )+
                                  (mainVariants(index).length > 1
                                    ? "s"
                                    : "")}
                            </Typography>
                            <Typography variant="h33">
                              {showMainVariant === index
                                ? PriceGroup === ""
                                  ? " "
                                  : PriceGroup + " KWD"
                                : " "}
                            </Typography>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </Grid>
          {window.innerWidth > 1016 && (
            <Grid
              md={window.innerWidth > 1016 ? 3 : 12}
              xs={12}
              p={1}
              display={showFilterList ? "flex" : "none"}
              justifyContent="center"
              sx={
                window.innerWidth > 1016
                  ? window.innerWidth > 1048
                    ? window.scrollY > 474
                      ? { mt: "-358px" }
                      : { pt: "60px" }
                    : window.scrollY > 230
                    ? { mt: "-110px" }
                    : { pt: "60px" }
                  : { pt: "60px" }
              }
            >
              <Grid
                xs={12}
                md={12}
                lg={12}
                display={showFilterList ? "flex" : "none"}
                justifyContent="center"
                sx={
                  window.innerWidth > 1016
                    ? window.innerWidth > 1048
                      ? window.scrollY > 474
                        ? window.scrollY < document.body.scrollHeight - 1150
                          ? { position: "fixed", width: "25%" }
                          : {
                              position: "absolute",
                              top: document.body.scrollHeight - 1460,
                            }
                        : { position: "absolute" }
                      : window.scrollY > 230
                      ? window.scrollY < document.body.scrollHeight - 1250
                        ? { position: "fixed", width: "30%" }
                        : {
                            position: "absolute",
                            top: document.body.scrollHeight - 1360,
                          }
                      : { position: "absolute" }
                    : {}
                }
                style={
                  window.innerWidth > 1016
                    ? window.innerWidth > 1048
                      ? { width: "28%" }
                      : window.scrollY > 230
                      ? { width: "30%" }
                      : { width: "28%" }
                    : {}
                }
              >
                <Grid
                  xs={
                    window.innerWidth > 1210
                      ? 10.2
                      : window.innerWidth > 1016
                      ? window.innerWidth > 1048
                        ? window.scrollY > 474
                          ? 10.2
                          : 11
                        : window.scrollY > 230
                        ? 10
                        : 11
                      : 9
                  }
                  sx={{
                    maxHeight:
                      window.innerWidth < 899
                        ? "500px"
                        : window.scrollY < document.body.scrollHeight - 1380
                        ? "500px"
                        : window.innerWidth > 940
                        ? "240px"
                        : "210px",
                    overflowY: "scroll",
                    pt: 0,
                    overflowX: "hidden",
                  }}
                >
                  {_category && (
                    <Grid
                      xs={12}
                      style={
                        window.innerWidth > 1048
                          ? window.scrollY > 474
                            ? { marginTop: 0 }
                            : {}
                          : window.scrollY > 229
                          ? { marginTop: 0 }
                          : {}
                      }
                    >
                      <Grid
                        xs={12}
                        display="flex"
                        pb={1.5}
                        justifyContent="space-between"
                        sx={{
                          borderBottom: "1px solid rgb(203, 146, 155, 0.2)",
                        }}
                        onClick={() =>
                          setShowCategoryOption(!showCategoryOption)
                        }
                      >
                        <Typography variant="h34" sx={{ color: "G1.main" }}>
                          Category
                        </Typography>
                        {showCategoryOption ? (
                          <ExpandLess sx={{ color: "GrayLight3.main" }} />
                        ) : (
                          <ExpandMore sx={{ color: "GrayLight3.main" }} />
                        )}
                      </Grid>
                      <Collapse in={showCategoryOption}>
                        <Grid
                          xs={12}
                          pt={2}
                          display="flex"
                          flexDirection="column"
                        >
                          <Grid
                            xs={12}
                            display="flex"
                            alignItems="center"
                            onClick={() => {
                              _setCategory("All");
                              setFilterProductsBy([]);
                              history.push({
                                pathname: `/Products/All/All/All`,
                                state: {
                                  categoryName: "All",
                                  genderName: "All",
                                  valueId: "All",
                                  search:
                                    location.state != undefined
                                      ? location.state.search
                                      : "",
                                },
                              });
                            }}
                            sx={{ cursor: "pointer" }}
                          >
                            <SvgIcon
                              titleAccess="title"
                              sx={{ fill: "red", color: "red" }}
                              component={(componentProps) => (
                                <svg
                                  style={{ color: "red" }}
                                  width="17"
                                  height="17"
                                  viewBox="0 0 17 17"
                                  fill="#CB929B"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M11.125 7.625C10.6438 7.625 10.2319 7.4535 9.8895 7.1105C9.5465 6.76808 9.375 6.35625 9.375 5.875V2.375C9.375 1.89375 9.5465 1.48162 9.8895 1.13862C10.2319 0.796208 10.6438 0.625 11.125 0.625H14.625C15.1062 0.625 15.5184 0.796208 15.8614 1.13862C16.2038 1.48162 16.375 1.89375 16.375 2.375V5.875C16.375 6.35625 16.2038 6.76808 15.8614 7.1105C15.5184 7.4535 15.1062 7.625 14.625 7.625H11.125ZM7.625 5.875C7.625 6.35625 7.45379 6.76808 7.11137 7.1105C6.76837 7.4535 6.35625 7.625 5.875 7.625H2.375C1.89375 7.625 1.48162 7.4535 1.13862 7.1105C0.796208 6.76808 0.625 6.35625 0.625 5.875V2.375C0.625 1.89375 0.796208 1.48162 1.13862 1.13862C1.48162 0.796208 1.89375 0.625 2.375 0.625H5.875C6.35625 0.625 6.76837 0.796208 7.11137 1.13862C7.45379 1.48162 7.625 1.89375 7.625 2.375V5.875ZM9.375 11.125C9.375 10.6438 9.5465 10.2316 9.8895 9.88863C10.2319 9.54621 10.6438 9.375 11.125 9.375H14.625C15.1062 9.375 15.5184 9.54621 15.8614 9.88863C16.2038 10.2316 16.375 10.6438 16.375 11.125V14.625C16.375 15.1062 16.2038 15.5184 15.8614 15.8614C15.5184 16.2038 15.1062 16.375 14.625 16.375H11.125C10.6438 16.375 10.2319 16.2038 9.8895 15.8614C9.5465 15.5184 9.375 15.1062 9.375 14.625V11.125ZM5.875 9.375C6.35625 9.375 6.76837 9.54621 7.11137 9.88863C7.45379 10.2316 7.625 10.6438 7.625 11.125V14.625C7.625 15.1062 7.45379 15.5184 7.11137 15.8614C6.76837 16.2038 6.35625 16.375 5.875 16.375H2.375C1.89375 16.375 1.48162 16.2038 1.13862 15.8614C0.796208 15.5184 0.625 15.1062 0.625 14.625V11.125C0.625 10.6438 0.796208 10.2316 1.13862 9.88863C1.48162 9.54621 1.89375 9.375 2.375 9.375H5.875Z"
                                    fill={
                                      _category == "All" ? "#CB929B" : "#9E9E9E"
                                    }
                                  />
                                </svg>
                              )}
                            />
                            <Typography
                              pl="18px"
                              variant={
                                window.innerWidth > 980
                                  ? "h34"
                                  : window.innerWidth > 900
                                  ? "h32"
                                  : "h34"
                              }
                              fontWeight="400"
                            >
                              All
                            </Typography>
                          </Grid>
                          {categories.map((cat) => {
                            return categoryFilter(cat.title);
                          })}
                        </Grid>
                      </Collapse>
                    </Grid>
                  )}
                  {_category === "Sunglasses" ? (
                    <>{findValueFromAttribute("Type")}</>
                  ) : (
                    ""
                  )}
                  

                  {_category === "Sunglasses" ? (
                    <>

                      {findValueFromAttribute("Gender")}
                      {findValueFromAttribute("Brand")}

                      {findValueFromAttribute("Age Range")}
                      {findValueFromAttribute("Shape")}
                      {findValueFromAttribute("Front Color")}
                      {findValueFromAttribute("Lens Color")}
                      {findValueFromAttribute("Lens Properties")}
                    </>
                  ) : _category.includes("Contact Lens") ||
                    _category.includes("Color") ||
                    _category.includes("Clear") ? (
                    <>
                      {" "}
                      {findValueFromAttribute("Type")}
                      {findValueFromAttribute("Manufacturer")}
                      {findValueFromAttribute("Brand")}
                      {findValueFromAttribute("Duration")}
                      {findValueFromAttribute("Material")}
                      {findValueFromAttribute("Packaging")}
                      {_category.includes("Color")
                        ? findValueFromAttribute("Color")
                        : findValueFromAttribute("Family")}
                    </>
                  ) : (
                    ""
                  )}


                  <Grid xs={12} pt={2}>
                    <Grid
                      xs={12}
                      display="flex"
                      pb={1.5}
                      justifyContent="space-between"
                      sx={{ borderBottom: "1px solid rgb(203, 146, 155, 0.2)" }}
                      onClick={() => {
                        showOption == "Sort"
                          ? setShowOption("")
                          : setShowOption("Sort");
                      }}
                    >
                      <Typography variant="h34" sx={{ color: "G1.main" }}>
                        Sort
                      </Typography>
                      {showOption === "Sort" ? (
                        <ExpandLess sx={{ color: "GrayLight3.main" }} />
                      ) : (
                        <ExpandMore sx={{ color: "GrayLight3.main" }} />
                      )}
                    </Grid>
                    <Collapse in={showOption === "Sort"}>
                      <Grid
                        xs={12}
                        pt={2}
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                      >
                        <Grid
                          xs={12}
                          md={12}
                          width="70%"
                          display="flex"
                          pb={1.5}
                          justifyContent="space-between"
                          sx={{
                            borderBottom: "1px solid rgb(203, 146, 155, 0.2)",
                          }}
                          onClick={() => {
                            showSortOption == "Sort by name"
                              ? setShowSortOption("")
                              : setShowSortOption("Sort by name");
                          }}
                          pt="8px"
                          pl="13px"
                        >
                          <Grid display="flex" alignItems="center">
                            <SvgIcon
                              titleAccess="title"
                              component={(componentProps) => (
                                <svg
                                  width="18"
                                  height="16"
                                  viewBox="0 0 18 16"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M12 12.0004L8 16.0004H18V12.0004H12ZM9.06 3.19038L0 12.2504V16.0004H3.75L12.81 6.94038L9.06 3.19038ZM2.92 14.0004H2V13.0804L9.06 6.00038L10 6.94038L2.92 14.0004ZM15.71 4.04038C16.1 3.65038 16.1 3.00038 15.71 2.63038L13.37 0.290383C13.1825 0.104375 12.9291 0 12.665 0C12.4009 0 12.1475 0.104375 11.96 0.290383L10.13 2.12038L13.88 5.87038L15.71 4.04038Z"
                                    fill="#757575"
                                  />
                                </svg>
                              )}
                            />
                            <Typography
                              variant="h34"
                              sx={{ color: "G1.main" }}
                              pl="11px"
                            >
                              Name
                            </Typography>
                          </Grid>
                          <Grid>
                            {showSortOption === "Sort by name" ? (
                              <ExpandLess sx={{ color: "GrayLight3.main" }} />
                            ) : (
                              <ExpandMore sx={{ color: "GrayLight3.main" }} />
                            )}
                          </Grid>
                        </Grid>
                        <Grid
                          xs={12}
                          md={12}
                          width="70%"
                          display="flex"
                          pb={1.5}
                          justifyContent="center"
                        >
                          <Collapse
                            in={showSortOption === "Sort by name"}
                            sx={{ width: "100%" }}
                          >
                            <Grid xs={12} pt={2} width="100%">
                              <FormGroup
                                sx={{ color: "G2.main" }}
                                onChange={(e) => {
                                  setSortProductBy(e.target.value);
                                }}
                              >
                                <FormControlLabel
                                  sx={{ marginBottom: 0, pl: "11px" }}
                                  value="A - Z"
                                  control={
                                    <Checkbox
                                      checked={
                                        sortProductBy == "A - Z" ? true : false
                                      }
                                      color="P"
                                      size="small"
                                      sx={{ color: "GrayLight3.main" }}
                                    />
                                  }
                                  label={
                                    <Typography variant="h2">A - Z</Typography>
                                  }
                                />
                                <FormControlLabel
                                  sx={{ marginBottom: 0, pl: "11px" }}
                                  value="Z - A"
                                  control={
                                    <Checkbox
                                      checked={
                                        sortProductBy == "Z - A" ? true : false
                                      }
                                      color="P"
                                      size="small"
                                      sx={{ color: "GrayLight3.main" }}
                                    />
                                  }
                                  label={
                                    <Typography variant="h2">Z - A</Typography>
                                  }
                                />
                              </FormGroup>
                            </Grid>
                          </Collapse>
                        </Grid>
                        <Grid
                          xs={12}
                          md={12}
                          width="70%"
                          display="flex"
                          pb={1.5}
                          justifyContent="space-between"
                          sx={{
                            borderBottom: "1px solid rgb(203, 146, 155, 0.2)",
                          }}
                          onClick={() => {
                            showSortOption == "Sort by date"
                              ? setShowSortOption("")
                              : setShowSortOption("Sort by date");
                          }}
                          pt="29px"
                          pl="13px"
                        >
                          <Grid display="flex" alignItems="center">
                            <SvgIcon
                              titleAccess="title"
                              component={(componentProps) => (
                                <svg
                                  width="18"
                                  height="20"
                                  viewBox="0 0 18 20"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M16.2 9.19091V3.63636C16.2 3.15415 16.0104 2.69169 15.6728 2.35071C15.3352 2.00974 14.8774 1.81818 14.4 1.81818H10.638C10.26 0.763636 9.27 0 8.1 0C6.93 0 5.94 0.763636 5.562 1.81818H1.8C0.81 1.81818 0 2.63636 0 3.63636V16.3636C0 16.8458 0.189642 17.3083 0.527208 17.6493C0.864773 17.9903 1.32261 18.1818 1.8 18.1818H7.299C8.433 19.3091 9.981 20 11.7 20C15.183 20 18 17.1545 18 13.6364C18 11.9 17.316 10.3364 16.2 9.19091ZM8.1 1.81818C8.595 1.81818 9 2.22727 9 2.72727C9 3.22727 8.595 3.63636 8.1 3.63636C7.605 3.63636 7.2 3.22727 7.2 2.72727C7.2 2.22727 7.605 1.81818 8.1 1.81818ZM1.8 16.3636V3.63636H3.6V5.45455H12.6V3.63636H14.4V7.89091C13.581 7.5 12.672 7.27273 11.7 7.27273H3.6V9.09091H7.29C6.75 9.60909 6.336 10.2273 6.012 10.9091H3.6V12.7273H5.472C5.427 13.0273 5.4 13.3273 5.4 13.6364C5.4 14.6182 5.625 15.5364 6.012 16.3636H1.8ZM11.7 18.1818C9.216 18.1818 7.2 16.1455 7.2 13.6364C7.2 11.1273 9.216 9.09091 11.7 9.09091C14.184 9.09091 16.2 11.1273 16.2 13.6364C16.2 16.1455 14.184 18.1818 11.7 18.1818ZM12.15 13.8636L14.724 15.4L14.049 16.5091L10.8 14.5455V10H12.15V13.8636Z"
                                    fill="#757575"
                                  />
                                </svg>
                              )}
                            />
                            <Typography
                              variant="h34"
                              sx={{ color: "G1.main" }}
                              pl="11px"
                            >
                              Date
                            </Typography>
                          </Grid>
                          <Grid>
                            {showSortOption === "Sort by date" ? (
                              <ExpandLess sx={{ color: "GrayLight3.main" }} />
                            ) : (
                              <ExpandMore sx={{ color: "GrayLight3.main" }} />
                            )}
                          </Grid>
                        </Grid>
                        <Grid
                          xs={12}
                          md={12}
                          width="70%"
                          display="flex"
                          pb={1.5}
                          justifyContent="center"
                        >
                          <Collapse
                            in={showSortOption === "Sort by date"}
                            sx={{ width: "100%" }}
                          >
                            <Grid xs={12} pt={2} width="100%">
                              <FormGroup
                                sx={{ color: "G2.main" }}
                                onChange={(e) => {
                                  setSortProductBy(e.target.value);
                                }}
                              >
                                <FormControlLabel
                                  sx={{ marginBottom: 0, pl: "11px" }}
                                  value="Newest First"
                                  control={
                                    <Checkbox
                                      checked={
                                        sortProductBy == "Newest First"
                                          ? true
                                          : false
                                      }
                                      color="P"
                                      size="small"
                                      sx={{ color: "GrayLight3.main" }}
                                    />
                                  }
                                  label={
                                    <Typography variant="h2">
                                      Newest First
                                    </Typography>
                                  }
                                />
                                <FormControlLabel
                                  sx={{ marginBottom: 0, pl: "11px" }}
                                  value="Oldest First"
                                  control={
                                    <Checkbox
                                      checked={
                                        sortProductBy == "Oldest First"
                                          ? true
                                          : false
                                      }
                                      color="P"
                                      size="small"
                                      sx={{ color: "GrayLight3.main" }}
                                    />
                                  }
                                  label={
                                    <Typography variant="h2">
                                      Oldest First
                                    </Typography>
                                  }
                                />
                              </FormGroup>
                            </Grid>
                          </Collapse>
                        </Grid>
                        <Grid
                          xs={12}
                          md={12}
                          width="70%"
                          display="flex"
                          pb={1.5}
                          justifyContent="space-between"
                          sx={{
                            borderBottom: "1px solid rgb(203, 146, 155, 0.2)",
                          }}
                          onClick={() => {
                            showSortOption == "Sort by price"
                              ? setShowSortOption("")
                              : setShowSortOption("Sort by price");
                          }}
                          pt="29px"
                          pl="13px"
                        >
                          <Grid display="flex" alignItems="center">
                            <SvgIcon
                              titleAccess="title"
                              component={(componentProps) => (
                                <svg
                                  width="20"
                                  height="16"
                                  viewBox="0 0 20 16"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M6 13H8V12H9C9.28333 12 9.521 11.904 9.713 11.712C9.90433 11.5207 10 11.2833 10 11V8C10 7.71667 9.90433 7.479 9.713 7.287C9.521 7.09567 9.28333 7 9 7H6V6H10V4H8V3H6V4H5C4.71667 4 4.479 4.09567 4.287 4.287C4.09567 4.479 4 4.71667 4 5V8C4 8.28333 4.09567 8.52067 4.287 8.712C4.479 8.904 4.71667 9 5 9H8V10H4V12H6V13ZM14 12.25L16 10.25H12L14 12.25ZM12 6H16L14 4L12 6ZM2 16C1.45 16 0.979333 15.8043 0.588 15.413C0.196 15.021 0 14.55 0 14V2C0 1.45 0.196 0.979333 0.588 0.588C0.979333 0.196 1.45 0 2 0H18C18.55 0 19.021 0.196 19.413 0.588C19.8043 0.979333 20 1.45 20 2V14C20 14.55 19.8043 15.021 19.413 15.413C19.021 15.8043 18.55 16 18 16H2ZM2 14H18V2H2V14Z"
                                    fill="#757575"
                                  />
                                </svg>
                              )}
                            />
                            <Typography
                              variant="h34"
                              sx={{ color: "G1.main" }}
                              pl="11px"
                            >
                              Price
                            </Typography>
                          </Grid>
                          <Grid>
                            {showSortOption === "Sort by price" ? (
                              <ExpandLess sx={{ color: "GrayLight3.main" }} />
                            ) : (
                              <ExpandMore sx={{ color: "GrayLight3.main" }} />
                            )}
                          </Grid>
                        </Grid>
                        <Grid
                          xs={12}
                          md={12}
                          width="70%"
                          display="flex"
                          pb={1.5}
                          justifyContent="center"
                        >
                          <Collapse
                            in={showSortOption === "Sort by price"}
                            sx={{ width: "100%" }}
                          >
                            <Grid xs={12} pt={2} width="100%">
                              <FormGroup
                                sx={{ color: "G2.main" }}
                                onChange={(e) => {
                                  setSortProductBy(e.target.value);
                                }}
                              >
                                <FormControlLabel
                                  sx={{ marginBottom: 0, pl: "11px" }}
                                  value="High to Low"
                                  control={
                                    <Checkbox
                                      checked={
                                        sortProductBy == "High to Low"
                                          ? true
                                          : false
                                      }
                                      color="P"
                                      size="small"
                                      sx={{ color: "GrayLight3.main" }}
                                    />
                                  }
                                  label={
                                    <Typography variant="h2">
                                      High to Low
                                    </Typography>
                                  }
                                />
                                <FormControlLabel
                                  sx={{ marginBottom: 0, pl: "11px" }}
                                  value="Low to High"
                                  control={
                                    <Checkbox
                                      checked={
                                        sortProductBy == "Low to High"
                                          ? true
                                          : false
                                      }
                                      color="P"
                                      size="small"
                                      sx={{ color: "GrayLight3.main" }}
                                    />
                                  }
                                  label={
                                    <Typography variant="h2">
                                      Low to High
                                    </Typography>
                                  }
                                />
                              </FormGroup>
                            </Grid>
                          </Collapse>
                        </Grid>
                        
                      </Grid>
                    </Collapse>
                  </Grid>

                </Grid>
              </Grid>
            </Grid>
          )}
          <Grid
            xs={12}
            md={12}
            display="flex"
            justifyContent="center"
            pt="328px"
          >
            <Typography color="G2.main" variant="h3">
              Recently Viewed
            </Typography>
          </Grid>
          {getrecentlyViewed().length != 0 && (
            <Recentlyviewed product={getrecentlyViewed()} />
          )}

          <Grid xs={12} mt={getrecentlyViewed().length == 0 ? "100px" : 0}>
            <Footer />
          </Grid>
        </Grid>

      </Grid>

      <Snackbar
        open={openMassage}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ pt: "65px" }}
      >
        <Grid
          display="flex"
          justifyContent="space-between"
          bgcolor="white"
          alignItems="center"
          height="44px"
          borderRadius="10px"
          sx={{ boxShadow: "0.5px 0.5px 1.5px 1px rgba(0, 0, 0, 0.16)" }}
        >
          <Typography pl="10px"> {showMassage}</Typography>
          <React.Fragment>
            <IconButton
              disabled
              aria-label="close"
              color="inherit"
              sx={{
                p: 0.5,
                pr: "14px",
                pl: "12px",
                "&:hover": { background: "none" },
                "&:active": { background: "none" },
                "&:focus": { background: "none" },
                "&:disabled": { background: "none", color: "Black.main" },
                cursor: "auto",
              }}
            >
              <ChatOutlinedIcon />
            </IconButton>
          </React.Fragment>
        </Grid>
      </Snackbar>
      
      <Dialog
        sx={{
          justifyContent: "center",
          paddingTop: "40vh",
          margin: 0,
          "& .MuiPaper-root": {
            backgroundColor: "rgba(0, 0, 0, 0.95)",
            borderRadius: "50px 50px 0 0",
            overflow: "hidden",
          },
        }}
        open={moblieSize && showFilterList}
        onClose={handleClose}
        disableScrollLock
        fullScreen
        TransitionComponent={Transition}
      >
        <DialogContent sx={{padding:0}}>
          <Scrollbars>
            <Grid
              xs={12}
              container
              sx={{
                padding: "0 40px 0 40px",
                backgroundColor: "rgba(0, 0, 0, 0.95)",
              }}
            >
              <Grid
                xs={12}
                display={showFilterList ? "flex" : "none"}
                justifyContent="center"
              >
                <Grid width="100%" >
                  <Grid
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "14px",
                      marginBottom: "24px",
                    }}
                    onClick={() => {
                      setShowFilterList(false);
                    }}
                  >
                    <svg
                      width="33"
                      height="22"
                      viewBox="0 0 33 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M14.3333 21.5H17.9167C18.9021 21.5 19.7083 20.6938 19.7083 19.7083C19.7083 18.7229 18.9021 17.9167 17.9167 17.9167H14.3333C13.3479 17.9167 12.5417 18.7229 12.5417 19.7083C12.5417 20.6938 13.3479 21.5 14.3333 21.5ZM0 1.79167C0 2.77708 0.80625 3.58333 1.79167 3.58333H30.4583C31.4437 3.58333 32.25 2.77708 32.25 1.79167C32.25 0.80625 31.4437 0 30.4583 0H1.79167C0.80625 0 0 0.80625 0 1.79167ZM7.16667 12.5417H25.0833C26.0687 12.5417 26.875 11.7354 26.875 10.75C26.875 9.76458 26.0687 8.95833 25.0833 8.95833H7.16667C6.18125 8.95833 5.375 9.76458 5.375 10.75C5.375 11.7354 6.18125 12.5417 7.16667 12.5417Z"
                        fill="#DCDCDC"
                      />
                    </svg>
                  </Grid>
                  {_category && (
                    <Grid
                      xs={12}
                      style={
                        window.innerWidth > 1048
                          ? window.scrollY > 474
                            ? { marginTop: 0 }
                            : {}
                          : window.scrollY > 229
                          ? { marginTop: 0 }
                          : {}
                      }
                    >
                      <Grid
                        xs={12}
                        display="flex"
                        pb={1.5}
                        justifyContent="space-between"
                        sx={{
                          borderBottom: "1px solid rgb(203, 146, 155, 0.2)",
                        }}
                        onClick={() =>
                          setShowCategoryOption(!showCategoryOption)
                        }
                      >
                        <Typography variant="h34" sx={{ color: "P.main" }}>
                          Category
                        </Typography>
                        {showCategoryOption ? (
                          <ExpandLess sx={{ color: "White.main" }} />
                        ) : (
                          <ExpandMore sx={{ color: "White.main" }} />
                        )}
                      </Grid>
                      <Collapse in={showCategoryOption}>
                        <Grid
                          xs={12}
                          pt={2}
                          display="flex"
                          flexDirection="column"
                        >
                          <Grid
                            xs={12}
                            display="flex"
                            alignItems="center"
                            onClick={() => {
                              _setCategory("All");
                              setFilterProductsBy([]);
                              if (window.innerWidth < 1016) {
                                setShowFilterList(false);
                              }
                              history.push({
                                pathname: `/Products/All/All/Unisex`,
                                state: {
                                  categoryName: "All",
                                  genderName: "All",
                                  valueId: "All",
                                  search:
                                    location.state != undefined
                                      ? location.state.search
                                      : "",
                                },
                              });
                            }}
                            sx={{ cursor: "pointer" }}
                          >
                            <svg
                              width="17"
                              height="17"
                              viewBox="0 0 17 17"
                              fill="red"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M11.125 7.625C10.6438 7.625 10.2319 7.4535 9.8895 7.1105C9.5465 6.76808 9.375 6.35625 9.375 5.875V2.375C9.375 1.89375 9.5465 1.48162 9.8895 1.13862C10.2319 0.796208 10.6438 0.625 11.125 0.625H14.625C15.1062 0.625 15.5184 0.796208 15.8614 1.13862C16.2038 1.48162 16.375 1.89375 16.375 2.375V5.875C16.375 6.35625 16.2038 6.76808 15.8614 7.1105C15.5184 7.4535 15.1062 7.625 14.625 7.625H11.125ZM7.625 5.875C7.625 6.35625 7.45379 6.76808 7.11137 7.1105C6.76837 7.4535 6.35625 7.625 5.875 7.625H2.375C1.89375 7.625 1.48162 7.4535 1.13862 7.1105C0.796208 6.76808 0.625 6.35625 0.625 5.875V2.375C0.625 1.89375 0.796208 1.48162 1.13862 1.13862C1.48162 0.796208 1.89375 0.625 2.375 0.625H5.875C6.35625 0.625 6.76837 0.796208 7.11137 1.13862C7.45379 1.48162 7.625 1.89375 7.625 2.375V5.875ZM9.375 11.125C9.375 10.6438 9.5465 10.2316 9.8895 9.88863C10.2319 9.54621 10.6438 9.375 11.125 9.375H14.625C15.1062 9.375 15.5184 9.54621 15.8614 9.88863C16.2038 10.2316 16.375 10.6438 16.375 11.125V14.625C16.375 15.1062 16.2038 15.5184 15.8614 15.8614C15.5184 16.2038 15.1062 16.375 14.625 16.375H11.125C10.6438 16.375 10.2319 16.2038 9.8895 15.8614C9.5465 15.5184 9.375 15.1062 9.375 14.625V11.125ZM5.875 9.375C6.35625 9.375 6.76837 9.54621 7.11137 9.88863C7.45379 10.2316 7.625 10.6438 7.625 11.125V14.625C7.625 15.1062 7.45379 15.5184 7.11137 15.8614C6.76837 16.2038 6.35625 16.375 5.875 16.375H2.375C1.89375 16.375 1.48162 16.2038 1.13862 15.8614C0.796208 15.5184 0.625 15.1062 0.625 14.625V11.125C0.625 10.6438 0.796208 10.2316 1.13862 9.88863C1.48162 9.54621 1.89375 9.375 2.375 9.375H5.875Z"
                                fill={
                                  _category == "All" ? "#CB929B" : "#9E9E9E"
                                }
                              />
                            </svg>
                            <Typography
                              pl="18px"
                              variant={
                                window.innerWidth > 980
                                  ? "h34"
                                  : window.innerWidth > 900
                                  ? "h32"
                                  : "h34"
                              }
                              fontWeight="400"
                              color={
                                _category == "All" ? "#CB929B" : "White.main"
                              }
                            >
                              All
                            </Typography>
                          </Grid>
                          {categories.map((cat) => {
                            return categoryFilter(cat.title);
                          })}
                          
                        </Grid>
                      </Collapse>
                    </Grid>
                  )}
                  
                  {_category === "Sunglasses" ? (
                    <>{findValueFromAttribute("Type")}</>
                  ) : (
                    ""
                  )}
                  {/* other filter */}

                  {_category === "Sunglasses" ? (
                    <>
                      {findValueFromAttribute("Gender")}
                      {findValueFromAttribute("Brand")}

                      {findValueFromAttribute("Age Range")}
                      {findValueFromAttribute("Shape")}
                      {findValueFromAttribute("Front Color")}
                      {findValueFromAttribute("Lens Color")}
                      {findValueFromAttribute("Lens Properties")}
                      <Grid sx={{ height: "20px" }}></Grid>
                    </>
                  ) : _category.includes("Contact Lens") ||
                    _category.includes("Color") ||
                    _category.includes("Clear") ? (
                    <>
                      {" "}
                      {findValueFromAttribute("Type")}
                      {findValueFromAttribute("Manufacturer")}
                      {findValueFromAttribute("Brand")}
                      {findValueFromAttribute("Duration")}
                      {findValueFromAttribute("Material")}
                      {findValueFromAttribute("Packaging")}
                      {_category.includes("Color")
                        ? findValueFromAttribute("Color")
                        : findValueFromAttribute("Family")}
                      <Grid sx={{ height: "20px" }}></Grid>
                    </>
                  ) : (
                    ""
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Scrollbars>
        </DialogContent>
      </Dialog>
    </Grid>
  );
};

export default ProductMainList;
