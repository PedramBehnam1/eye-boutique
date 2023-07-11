import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Hidden,
  Alert,
  Snackbar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useHistory } from "react-router-dom";
import ProfileLayout from "./ProfileLayout";
import axiosConfig from "../../../axiosConfig";
import FavoriteIcon from "@mui/icons-material/Favorite";
import NoProductImage from "../../../asset/images/No-Product-Image-v2.png";
import CircularProgress from "@mui/material/CircularProgress";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const WishList = () => {
  const [products, setProducts] = useState([]);
  const [favorite, setFavorite] = useState([]);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [showMainVariant, setShowMainVariant] = useState("");
  const [loadingFavorite, setloadingFavorite] = useState("");
  const [openMassage, setOpenMassage] = useState(false);
  const [showMassage, setShowMassage] = useState('');
  const[trigger,setTrigger]=useState()

  let history = useHistory();

  useEffect(() => {
    refreshList();
  }, [trigger]);

  const addToWishList = (id) => {
    if (localStorage.getItem("token")) {
    setloadingFavorite(id);
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
        const _favorite = favorite;
        _favorite.push(id);
        setFavorite(_favorite);
        setloadingFavorite("");
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
          setShowMassage('Add to wishList has a problem!')
          setOpenMassage(true)  
        }
      });
    }else{
      setShowMassage("Please Login first!");
      setOpenMassage(true);
    }
  };


  const handleSuccessClose = () => {
    setOpenSuccess(false);
  };
  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleSuccessClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  const refreshList = () => {
    axiosConfig
      .get("/users/wishlist", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setProducts(res.data.products);
        const favoriteArray = [];
        res.data.products.map((p) => favoriteArray.push(p.id));
        setFavorite(favoriteArray);
      })
      .catch((err) =>{
        if(err.response.data.error.status === 401){
          axiosConfig
              .post("/users/refresh_token", {
                refresh_token: localStorage.getItem("refreshToken"),
              })
              .then((res) => {
                setShowMassage('Get wishLists have a problem!')
                setOpenMassage(true)
                localStorage.setItem("token", res.data.accessToken);
                localStorage.setItem("refreshToken", res.data.refreshToken);
                refreshList();
              })
          }else{
            setShowMassage('Get wishLists have a problem!')
            setOpenMassage(true)
          }
      });
  };

  const deleteFromWishList = (id) => {
    if (localStorage.getItem("token")) {
      setloadingFavorite(id);
      axiosConfig.delete(`/users/wishlist/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then(() => {
        let _favorite = favorite;
        _favorite = _favorite.filter((t) => t !== id);
        setFavorite(_favorite);
        setloadingFavorite("");
        setTrigger(trigger+1);
      }).catch((err) =>{
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
            setShowMassage('Delete from wishLists has a problem!')
            setOpenMassage(true)
          }
      });
    }else{
      setShowMassage("Please Login first!");
      setOpenMassage(true);
    }
  };

  

  function toCamelCase(str) {
    // Lower cases the string
    let result = str.toLowerCase()
      // Replaces any - or _ characters with a space 
      .replace( /[-_]+/g, ' ')
      // Removes any non alphanumeric characters 
      .replace( /[^\w\s]/g, '')
      // Uppercases the first character in each group immediately following a space 
      // (delimited by spaces) 
      .replace( / (.)/g, function($1) { return $1.toUpperCase(); })
      // Removes spaces 
      .replace( / /g, '' );
      result = result.charAt(0).toUpperCase() + result.slice(1);
      return result;
  }
  return (
    <ProfileLayout pageName="WishList">
      <Hidden mdDown>
        <Grid
          xs={12}
          sx={{
            height: "65px",
            borderRadius: "5px",
            display: "flex",
            alignItems: "center",
            paddingLeft: "38px",
            marginLeft: "35px",
            backgroundColor: "P3.main",
          }}
        >
          <svg
            width="25"
            height="25"
            viewBox="0 0 21 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19.16 2C18.1 0.937205 16.6948 0.288538 15.1983 0.171168C13.7019 0.0537975 12.2128 0.475464 11 1.36C9.72766 0.413635 8.14399 -0.0154912 6.56792 0.159035C4.99185 0.333561 3.54044 1.09878 2.50597 2.30058C1.47151 3.50239 0.930823 5.05152 0.992802 6.63601C1.05478 8.2205 1.71482 9.72267 2.84 10.84L9.05 17.06C9.57002 17.5718 10.2704 17.8586 11 17.8586C11.7296 17.8586 12.43 17.5718 12.95 17.06L19.16 10.84C20.3276 9.66526 20.9829 8.07627 20.9829 6.42C20.9829 4.76372 20.3276 3.17473 19.16 2ZM17.75 9.46L11.54 15.67C11.4693 15.7414 11.3852 15.798 11.2925 15.8366C11.1999 15.8753 11.1004 15.8952 11 15.8952C10.8996 15.8952 10.8001 15.8753 10.7075 15.8366C10.6148 15.798 10.5307 15.7414 10.46 15.67L4.25 9.43C3.46576 8.62834 3.02661 7.55146 3.02661 6.43C3.02661 5.30853 3.46576 4.23165 4.25 3.43C5.04916 2.64099 6.12697 2.19857 7.25 2.19857C8.37303 2.19857 9.45085 2.64099 10.25 3.43C10.343 3.52373 10.4536 3.59812 10.5754 3.64889C10.6973 3.69966 10.828 3.7258 10.96 3.7258C11.092 3.7258 11.2227 3.69966 11.3446 3.64889C11.4664 3.59812 11.577 3.52373 11.67 3.43C12.4692 2.64099 13.547 2.19857 14.67 2.19857C15.793 2.19857 16.8708 2.64099 17.67 3.43C18.465 4.22115 18.9186 5.29219 18.9335 6.41368C18.9485 7.53518 18.5236 8.61793 17.75 9.43V9.46Z"
              fill="#757575"
            />
          </svg>
        </Grid>
      </Hidden>
      <Grid
        xs={12}
        mb={1}
        bgcolor="White.main"
        sx={{
          borderRadius: "5px",
          paddingLeft: "38px",
          marginTop: "5px",
          marginLeft: { sm: "0", md: "35px" },
          padding: "12px 25px 50px 25px",
        }}
      >
        {products.length === 0 ? (
          <Grid
            minHeight="390px"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Typography variant="h2">Your wishlist is empty!</Typography>
          </Grid>
        ) : (
          <Grid
            container
            spacing={2}
            display="flex"
            flexWrap="wrap"
            sx={{ margin: 0 }}
            justifyContent={products.length == 1 ? "center" : "flex-start"}
          >
            {products.map((product, index) => {
                return (
                <Grid
                  item
                  md={4}
                  xs={12}
                  display="flex"
                >
                  <Card
                  onMouseEnter={() => {
                    setShowMainVariant(index); 
                  }}
                  onMouseLeave={() => {setShowMainVariant("");}}
                  sx={{
                      cursor: "pointer",
                      width: "100%",
                      border: "1px solid #DCDCDC",
                      borderRadius: "8px",
                      boxShadow: `${
                      index === showMainVariant ? "0.5px" : "none"
                      }`,
                      minHeight: "360px",
                      height:'360px',
                      elevation:0,
                      ':hover':{boxShadow:'0.25px -0.30px 2.5px 2.5px #5352521c'}
                  }}
                  
                  >
                    <Grid
                        xs={12}
                        display="grid"
                        justifyContent="end"
                        mt={2}
                        mr={2}
                    >
                        {loadingFavorite === product.id ? (
                        <CircularProgress color="P" />
                        ) : (
                        <IconButton
                            onClick={() =>{
                            favorite.find((f) => f === product.id) ===
                            undefined
                                ? addToWishList(product.id)
                                : deleteFromWishList(product.id)
                                refreshList()
                            }}
                            sx={{ margin: "auto" }}
                        >
                            {favorite.find((f) => f === product.id) !==
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
                      onClick={() =>{
                      let category = localStorage.getItem(product.category_id).split("-")[0];
                      let type = localStorage.getItem(product.category_id).split("-")[1].trim()==""?"All": localStorage.getItem(product.category_id).split("-")[1].trim().replace(/\s+/g, '');
                      let gender = ""
                      if (category.includes("Contact Lens")) {
                          gender = "Unisex"
                      }else{
                          gender = product.products[0].attributes.find((att)=>att.name =='Gender').value.replace(/\s+/g, '');
                      }
                      category = category.replace(/\s+/g, '');
                      history.push({ pathname: `/Products/${category}/${type}/${gender}/${toCamelCase(product.name)}`
                      })
                      }}
                      component="img"
                      sx={{ width: "205px",height:"205px", margin: "auto" }}
                      image={
                        (  
                          (product.file_urls != undefined &&
                            product.file_urls != null)
                          ? 
                            axiosConfig.defaults.baseURL +
                            product.file_urls[0].image_url
                          : NoProductImage
                        )
                          
                      }
                    />
                    <CardContent
                        sx={{ paddingTop: 0, paddingBottom: "5px",'&:last-child': { pb: 0 }}}
                    >
                      
                      <Grid
                      xs={12}
                      display="flex"
                      justifyContent="center"
                      alignContent="center"
                      pt="60px"
                      sx={{cursor:'pointer'}}
                      onClick={() =>{
                        let category = localStorage.getItem(product.category_id).split("-")[0];
                        let type = localStorage.getItem(product.category_id).split("-")[1].trim()==""?"All": localStorage.getItem(product.category_id).split("-")[1].trim().replace(/\s+/g, '');
                        let gender = ""
                        if (category.includes("Contact Lens")) {
                          gender = "Unisex"
                        }else{
                          gender = product.products[0].attributes.find((att)=>att.name =='Gender').value.replace(/\s+/g, '');
                        }
                        category = category.replace(/\s+/g, '');
                        history.push({ pathname: `/Products/${category}/${type}/${gender}/${toCamelCase(product.name)}`})
                      }}
                      >
                      <Typography variant="h32">
                          {product.name}
                      </Typography>
                      </Grid>

                    </CardContent>
                  </Card>
                </Grid>
                );
            })}
          </Grid>
        )}
        <Snackbar
          open={openSuccess}
          autoHideDuration={6000}
          onClose={handleSuccessClose}
          action={action}
        >
          <Alert severity="success" sx={{ width: "100%" }}>
            successfully removed
          </Alert>
        </Snackbar>
      </Grid>
    </ProfileLayout>
  );
};

export default WishList;
