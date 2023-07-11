import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";

import "../../asset/css/homePage/newProduct.css";
import "swiper/swiper-bundle.min.css";
import "swiper/swiper.min.css";
import SwiperCore,{ Pagination,Navigation } from "swiper";
import { CardContent, Hidden,Fade, Box} from "@mui/material";
import Typography from "@mui/material/Typography";
import axiosConfig from "../../axiosConfig";
import No_Product_Image from "../../asset/images/No-Product-Image-v2.png";
import "../../asset/css/styles2.css";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';




const NewProducts = (props) => {
  let history = useHistory();
  const [products, setProducts] = useState([]);
  const [newestProducts, setNewestProducts] = useState([]);
  const [imageGroup, setImageGroup] = useState("");
  const [indexOfMainVariant, setIndexOfMainVariant] = useState("");
  const [indexofImageGroup, setIndexOfImageGroup] = useState("");
  const [PriceGroup, setPriceGroup] = useState("");
  const [numberOfVarients, setNumberOfVarients] = useState([]);
  const [numberOfDots, setNumberOfDots] = useState([]);
  const [isHover, setIsHover] = useState(false);
  const [activeDot, setActiveDot] = useState(0);

  useEffect(() => {
    refreshList();
    
  }, []);

  useEffect(() => {
    if (products.length != 0) {
      
      threeProductByCreatedAt();
    }
    
  }, [products]);
   const refreshList = () => {

    axiosConfig.get(`/admin/product/all?limit=1000&page=1&language_id=1&status=1&category_id&name=`
    )
      .then((res) => {
          setProducts(res.data.products);
        });

        
  };

 const threeProductByCreatedAt= () =>{
   
  let sortedProducts = [...products].sort((a, b) => a.createdAt - b.createdAt);
  sortedProducts = [...sortedProducts].filter((product) => (((product.status == 1) &&(product.name != null ||product.name != undefined) || (product.products.length != 0 && product.products[0].sku !=undefined))))
  
  const treeSortedProducts = [...sortedProducts].slice(0,3);  

  setNewestProducts([...treeSortedProducts]);
 }

 

 const mainVariants = (index) => {
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
  return mainVariantsArray;
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
  const desktopSize = () => {
    return (
      <Swiper className="mySwiper" slidesPerView={window.innerWidth>1205?3:3} spaceBetween={35}  style={{minHeight: "540px",height:"600px"}} >
        {newestProducts.map((product,index) => {
          return(
            <>
              {((product.name != null ||product.name != undefined) || (product.products.length != 0 && product.products[0].sku !=undefined)) &&
              <SwiperSlide style={{paddingBottom:'50px' ,minHeight: "500px"}}  >
                <Box >
                  <Card 
                    onMouseEnter={() => { setIndexOfMainVariant(index); setNumberOfVarients(mainVariants(index));
                      let dots = []
                      for (let index1 = 0; index1 < Math.ceil(mainVariants(index).length/4); index1++) {
                        dots.push(index1)  
                      }
                      setNumberOfDots(dots);
                      setIsHover(true)
                      
                    }}
                    onMouseLeave={() => {setIndexOfMainVariant([]);setIsHover(false)}}
                    sx={{ maxWidth: window.innerWidth>1207?"360px":"320px" , width:"360px",boxShadow:0,borderWidth:0,cursor:'pointer',border: "1px solid #DCDCDC",
                    borderRadius: "8px",
                    minHeight: window.innerWidth>1207?"420px":"450px",mt:"20px",
                    height:"410px",
                    elevation:0,
                    ':hover':{boxShadow:'0.25px -0.50px 2.5px 2.5px #5352521c'},
                    pb:"5px"
                    }} 
                    className="card"
                    
                    elevation={0}
                  
                  >
                    <CardMedia 
                      onClick={()=>{
                        let category = localStorage.getItem(product.category_id).split("-")[0];
                        let type = localStorage.getItem(product.category_id).split("-")[1].trim()==""?"All": localStorage.getItem(product.category_id).split("-")[1].trim().replace(/\s+/g, '');
                        let gender = ""
                        if (category.includes("Contact Lens")) {
                          gender = "Unisex"
                        }else{
                          gender = product.products[0].general_attributes.find((att)=>att.title =='Gender').value.replace(/\s+/g, '');
                        }
                        category = category.replace(/\s+/g, '');
                        history.push({ pathname: `/Products/${category}/${type}/${gender}/${toCamelCase(product.name)}`
                        })
                      }} 
                      component="img"
                      image={
                        imageGroup !== "" 
                          ? (indexOfMainVariant === index  )
                            ? imageGroup
                            : (product.file_urls != undefined &&
                              product.file_urls != null)
                              ? axiosConfig.defaults.baseURL +
                                product.file_urls[0]
                            : No_Product_Image
                          : (product.file_urls != undefined &&
                            product.file_urls != null)
                          ? 
                            axiosConfig.defaults.baseURL +
                            product.file_urls[0]
                          : No_Product_Image
                      }
                      style={{ width: "60%",margin: "auto" ,paddingTop:"20px" }}
                    
                    />
                    <CardContent style={{padding:0,paddingTop:"10px"}}>
                      
                      <Grid sx={{height:"98px"}}>
                        <Fade in={indexOfMainVariant === index} >
                          {numberOfVarients.length<5?
                            <Grid
                              xs={12}
                              display="flex"
                              justifyContent="center"
                              pt="10px"
                              pb="20px"
                              onClick={()=>{
                                
                                let category = localStorage.getItem(product.category_id).split("-")[0];
                                let type = localStorage.getItem(product.category_id).split("-")[1].trim()==""?"All": localStorage.getItem(product.category_id).split("-")[1].trim().replace(/\s+/g, '');
                                let gender = ""
                                if (category.includes("Contact Lens")) {
                                  gender = "Unisex"
                                }else{
                                  gender = product.products[0].general_attributes.find((att)=>att.title =='Gender').value.replace(/\s+/g, '');
                                }
                                category = category.replace(/\s+/g, '');
                                history.push({ pathname: `/Products/${category}/${type}/${gender}/${toCamelCase(product.name)}`})
                              }} 
                              sx={{cursor:'pointer'}}
                              
                            >
                              {mainVariants(index).map(
                                (mainVariant, mainVariantIndex) => {
                                  return (
                                    <Card
                                      sx={{
                                        border: "1px solid #DCDCDC",
                                        borderRadius: "6px",
                                        width: "50px",
                                        boxShadow: `${
                                          mainVariantIndex === indexofImageGroup
                                            ? "1px"
                                            : "none"
                                        }`,
                                        margin: "2px",
                                      }}
                                      onMouseEnter={() => {
                                        setIndexOfImageGroup(mainVariantIndex);
                                        setImageGroup(
                                          axiosConfig.defaults.baseURL +
                                            product.products.find(
                                              (p) =>
                                                p.main_attributes[0].value ===
                                                mainVariant
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
                                        setIndexOfImageGroup("");
                                        setPriceGroup("");
                                      }}
                                    >
                                      <CardMedia
                                        component="img"
                                        sx={{
                                          width: "90%",
                                          height: "90%",
                                          margin: "auto",
                                          p:"2px"
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
                                                  p.main_attributes[0].value ===
                                                  mainVariant
                                              ).file_urls[0].image_url
                                        }
                                      />
                                    </Card>
                                  );
                                }
                              )}
                            </Grid>
                            :
                            (isHover?(
                              <Grid display="flex" flexDirection='column' xs={12} 
                                pb="10px"
                              >
                                <Grid xs={12} md={12} display="flex" justifyContent="center"
                                sx={{cursor:'pointer'}}
                                  onClick={()=>{
                                    
                                    let category = localStorage.getItem(product.category_id).split("-")[0];
                                    let type = localStorage.getItem(product.category_id).split("-")[1].trim()==""?"All": localStorage.getItem(product.category_id).split("-")[1].trim().replace(/\s+/g, '');
                                    let gender = ""
                                    if (category.includes("Contact Lens")) {
                                      gender = "Unisex"
                                    }else{
                                      gender = product.products[0].general_attributes.find((att)=>att.title =='Gender').value.replace(/\s+/g, '');
                                    }
                                    category = category.replace(/\s+/g, '');
                                    history.push({ pathname: `/Products/${category}/${type}/${gender}/${toCamelCase(product.name)}`})
                                  }} 
                                >
                                  {mainVariants(index).map(
                                    (mainVariant, mainVariantIndex) => {
                                      if ((mainVariantIndex>=(activeDot*4)) && (mainVariantIndex<((activeDot+1)*4))) {
                                        return (
                                          <Card
                                            sx={{
                                              border: "1px solid #DCDCDC",
                                              borderRadius: "6px",
                                              width: "50px",
                                              boxShadow: `${
                                                mainVariantIndex === indexofImageGroup
                                                  ? "1px"
                                                  : "none"
                                              }`,
                                              margin: "2px",
                                            }}
                                            onMouseEnter={() => {
                                              setIndexOfImageGroup(mainVariantIndex);
                                              setImageGroup(
                                                axiosConfig.defaults.baseURL +
                                                  product.products.find(
                                                    (p) =>
                                                      p.main_attributes[0].value ===
                                                      mainVariant
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
                                              setIndexOfImageGroup("");
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
                                                    p.main_attributes[0].value ===
                                                    mainVariant
                                                )?.file_urls.length === 0
                                                  ? No_Product_Image
                                                  : axiosConfig.defaults.baseURL +
                                                    product.products.find(
                                                      (p) =>
                                                        p.main_attributes[0].value ===
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
                                <Grid  xs={12} md={12} display="flex" justifyContent='center' alignSelf='center' pt="20px" spacing="50px"  alignItems='center' container mt={0}>
                                  
                                    <Grid item xs={12} md={12} display="flex" justifyContent='center' className="dots">
                                      {
                                        numberOfDots.length>1?
                                          (activeDot==0?
                                            <Grid  item xs={2} md={3} display="flex" justifyContent='flex-end' alignItems='center'>
                                              <KeyboardArrowLeftIcon  color="G3"/>
                                            </Grid>
                                            :
                                            <Grid  item xs={2} md={3} display="flex" justifyContent='flex-end' alignItems='center'>
                                              <KeyboardArrowLeftIcon item onClick={()=>{setActiveDot(activeDot-1)}}/>
                                            </Grid>
                                          ) 
                                        :
                                          ""
                                      }

                                    {numberOfDots.length>1?
                                      <Grid   item xs={8} sm={window.innerWidth>731?1.2:1.8} md={window.innerWidth>1265?4:window.innerWidth>1110?4:5} spacing={window.innerWidth>945?0 :"50px"} display='flex' alignItems='center' justifyContent='center' sx={{maxWidth:{xs:"70px", md:"64px"}}} maxWidth={"55px"} flexWrap='wrap' pl={0}>
                                        {numberOfDots.map((n,index1)=>{
                                          return(
                                            activeDot== index1?
                                              <Grid item xs={3}  display='flex' justifyContent='center' onClick={()=>{setActiveDot(index1)}}  height="10px"><Grid bgcolor="P.main" borderRadius={"10px"} width="8px" height="8px" pt="8px"></Grid></Grid>
                                            :
                                              <Grid item xs={3} display='flex' justifyContent='center'  onClick={()=>{setActiveDot(index1)}}   height="10px"><Grid bgcolor="G3.main" borderRadius={"10px"} width="8px" height="8px" pt="8px"></Grid></Grid>
                                          )
                                              
                                        })}
                                      </Grid>
                                      :
                                      ""
                                    }
                                    {
                                      numberOfDots.length>1?
                                        ((numberOfDots.length-1)!=activeDot?
                                        <Grid  item md={3} xs={2} display="flex" alignItems='center'>
                                          <KeyboardArrowRightIcon item onClick={()=>{setActiveDot(activeDot+1)}}/>
                                        </Grid>
                                        :
                                        <Grid  item md={3} xs={2} display="flex" alignItems='center'>
                                          <KeyboardArrowRightIcon item color="G3"/>
                                        </Grid>
                                        )
                                        :
                                      ""
                                    }
                                    </Grid>

                                </Grid>
                              </Grid>)
                            :<Grid  ></Grid>)
                          }
                        </Fade>

                      </Grid>
                      <Typography gutterBottom variant="h1" align="center" 
                        onClick={()=>{
                          
                          let category = localStorage.getItem(product.category_id).split("-")[0];
                          let type = localStorage.getItem(product.category_id).split("-")[1].trim()==""?"All": localStorage.getItem(product.category_id).split("-")[1].trim().replace(/\s+/g, '');
                          let gender = ""
                          if (category.includes("Contact Lens")) {
                            gender = "Unisex"
                          }else{
                            gender = product.products[0].general_attributes.find((att)=>att.title =='Gender').value.replace(/\s+/g, '');
                          }
                          category = category.replace(/\s+/g, '');
                          history.push({ pathname: `/Products/${category}/${type}/${gender}/${toCamelCase(product.name)}`})
                        }} 
                        sx={{cursor:'pointer'}}
                      >
                        {product.products[0].general_attributes.find(a=>a.title=="Brand").value}
                      </Typography>
                      <Typography gutterBottom variant="h1" align="center" 
                        onClick={()=>{
                          
                          let category = localStorage.getItem(product.category_id).split("-")[0];
                          let type = localStorage.getItem(product.category_id).split("-")[1].trim()==""?"All": localStorage.getItem(product.category_id).split("-")[1].trim().replace(/\s+/g, '');
                          let gender = ""
                          if (category.includes("Contact Lens")) {
                            gender = "Unisex"
                          }else{
                            gender = product.products[0].general_attributes.find((att)=>att.title =='Gender').value.replace(/\s+/g, '');
                          }
                          category = category.replace(/\s+/g, '');
                          history.push({ pathname: `/Products/${category}/${type}/${gender}/${toCamelCase(product.name)}`})
                        }} 
                        sx={{cursor:'pointer'}}
                      >
                        {product.name}
                      </Typography>

                      <Grid
                        xs={12}
                        display="flex"
                        justifyContent="center"
                        alignContent="center"
                        height='40px'
                        flexWrap='wrap'
                        onClick={()=>{
                              
                          let category = localStorage.getItem(product.category_id).split("-")[0];
                          let type = localStorage.getItem(product.category_id).split("-")[1].trim()==""?"All": localStorage.getItem(product.category_id).split("-")[1].trim().replace(/\s+/g, '');
                          let gender = ""
                          if (category.includes("Contact Lens")) {
                            gender = "Unisex"
                          }else{
                            gender = product.products[0].general_attributes.find((att)=>att.title =='Gender').value.replace(/\s+/g, '');
                          }
                          category = category.replace(/\s+/g, '');
                          history.push({ pathname: `/Products/${category}/${type}/${gender}/${toCamelCase(product.name)}`})
                        }} 
                        sx={{cursor:'pointer'}}
                      >
                        <Typography variant="h10">
                          {indexOfMainVariant === index
                            ? ""
                            : mainVariants(index).length +
                              " " +
                              (product.products[0].main_attributes[0].title.includes("Color Code")?"Color":product.products[0].main_attributes[0].title )+
                              (mainVariants(index).length > 1 ? "s" : "")}
                        </Typography>
                        <Typography variant="h33">
                          {indexOfMainVariant === index
                            ? PriceGroup === ""
                              ? " "
                              : PriceGroup + " KWD"
                            : " "}
                        </Typography>
                        <Grid xs={12} height="20px"  width='100%'></Grid>
                      </Grid>
                    </CardContent>
                  </Card>

                </Box>
              </SwiperSlide>
            }
            </>
          );
        })}
      </Swiper>
    );
  };

  const mobileSize = () => {
    SwiperCore.use([Pagination,Navigation]);
    return (
      <Swiper className="mySwiper1" style={{minHeight: "540px",height:"600px"}} 
        pagination={{
          clickable: true,
        }}
        navigation={true}
        mousewheel={true}
        modules={[Pagination]}
      >
        {
          products.length!=0&&(
              products.map((product,index) => {
                if (index<8) {
                  return(
                      
                    <SwiperSlide style={{paddingBottom:'50px' ,minHeight: "500px"}}  
                    >
                      <Card 
                        onMouseEnter={() => {setIndexOfMainVariant(index);setNumberOfVarients(mainVariants(index));
                          let dots = []
                          for (let index1 = 0; index1 < Math.ceil(mainVariants(index).length/4); index1++) {
                            dots.push(index1)  
                          }
                          setNumberOfDots(dots);
                          setIsHover(true)
                          
                        }}
                        onMouseLeave={() => {setIndexOfMainVariant("");setIsHover(false)}}
                        sx={{ maxWidth:window.innerWidth>430? "400px" :window.innerWidth>350? "280px":"250px" , width:window.innerWidth>430? "400px":window.innerWidth>350? "280px":"250px",boxShadow:0,borderWidth:0,cursor:'pointer',border: "1px solid #DCDCDC",
                        borderRadius: "8px",
                        minHeight: "422px",mt:"20px",
                        height:window.innerWidth>430?"482px":"450px",
                        ':hover':{boxShadow:'0.25px -0.50px 2.5px 2.5px #5352521c'}
                        }} 
                        className="card"
                      >
                        {window.innerWidth>430?
                          <CardMedia 
                            component="img"
                            image={
                              imageGroup !== ""
                                ? indexOfMainVariant === index
                                  ? imageGroup
                                  : (product.file_urls != undefined &&
                                    product.file_urls != null)
                                    ? axiosConfig.defaults.baseURL +
                                      product.file_urls
                                  : No_Product_Image
                                :  (product.file_urls != undefined &&
                                  product.file_urls != null)
                                ? 
                                  axiosConfig.defaults.baseURL +
                                  product.file_urls[0]
                                : No_Product_Image
                            }
                            style={{ width: "280px",height:"280px",margin: "auto"  }}
                            sx={{pt:"16px"}}
                            onClick={()=>{
                              
                              let category = localStorage.getItem(product.category_id).split("-")[0];
                              let type = localStorage.getItem(product.category_id).split("-")[1].trim()==""?"All": localStorage.getItem(product.category_id).split("-")[1].trim().replace(/\s+/g, '');
                              let gender = ""
                              if (category.includes("Contact Lens")) {
                                gender = "Unisex"
                              }else{
                                gender = product.products[0].general_attributes.find((att)=>att.title =='Gender').value.replace(/\s+/g, '');
                              }
                              category = category.replace(/\s+/g, '');
                              history.push({ pathname: `/Products/${category}/${type}/${gender}/${toCamelCase(product.name)}`})
                            }} 
                          />
                          :
                          <CardMedia 
                            component="img"
                            image={
                              imageGroup !== ""
                                ? indexOfMainVariant === index
                                  ? imageGroup
                                  : (product.file_urls != undefined &&
                                    product.file_urls != null)
                                    ? axiosConfig.defaults.baseURL +
                                      product.file_urls
                                  : No_Product_Image
                                :  (product.file_urls != undefined &&
                                  product.file_urls != null)
                                ? 
                                  axiosConfig.defaults.baseURL +
                                  product.file_urls[0]
                                : No_Product_Image
                            }
                            style={{ width: "200px",height:"200px",margin: "auto"  }}
                            sx={{pt:"16px"}}
                            onClick={()=>{
                              
                              let category = localStorage.getItem(product.category_id).split("-")[0];
                              let type = localStorage.getItem(product.category_id).split("-")[1].trim()==""?"All": localStorage.getItem(product.category_id).split("-")[1].trim().replace(/\s+/g, '');
                              let gender = ""
                              if (category.includes("Contact Lens")) {
                                gender = "Unisex"
                              }else{
                                gender = product.products[0].general_attributes.find((att)=>att.title =='Gender').value.replace(/\s+/g, '');
                              }
                              category = category.replace(/\s+/g, '');
                              history.push({ pathname: `/Products/${category}/${type}/${gender}/${toCamelCase(product.name)}`})
                            }} 
                          />

                        }
                        <CardContent style={{padding:0,paddingTop:"4px"}}>
                          <Grid sx={{height:"98px"}}>
                            <Fade in={indexOfMainVariant === index}>
                            {numberOfVarients.length<5?
                                <Grid
                                  xs={12}
                                  display="flex"
                                  justifyContent="center"
                                  pt="10px"
                                  pb="20px"
                                  onClick={()=>{
                                    
                                    let category = localStorage.getItem(product.category_id).split("-")[0];
                                    let type = localStorage.getItem(product.category_id).split("-")[1].trim()==""?"All": localStorage.getItem(product.category_id).split("-")[1].trim().replace(/\s+/g, '');
                                    let gender = ""
                                    if (category.includes("Contact Lens")) {
                                      gender = "Unisex"
                                    }else{
                                      gender = product.products[0].general_attributes.find((att)=>att.title =='Gender').value.replace(/\s+/g, '');
                                    }
                                    category = category.replace(/\s+/g, '');
                                    history.push({ pathname: `/Products/${category}/${type}/${gender}/${toCamelCase(product.name)}`})
                                  }} 
                                  sx={{cursor:'pointer'}}
                                >
                                  {mainVariants(index).map(
                                    (mainVariant, mainVariantIndex) => {
                                      return (
                                        <Card
                                        
                                          sx={{
                                            border: "1px solid #DCDCDC",
                                            borderRadius: "6px",
                                            width: "50px",
                                            boxShadow: `${
                                              mainVariantIndex === indexofImageGroup
                                                ? "1px"
                                                : "none"
                                            }`,
                                            margin: "2px",
                                          }}
                                          onMouseEnter={() => {
                                            setIndexOfImageGroup(mainVariantIndex);
                                            setImageGroup(
                                              axiosConfig.defaults.baseURL +
                                                product.products.find(
                                                  (p) =>
                                                    p.main_attributes[0].value ===
                                                    mainVariant
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
                                            setIndexOfImageGroup("");
                                            setPriceGroup("");
                                          }}
                                        >
                                          <CardMedia
                                            component="img"
                                            sx={{
                                              width: "90%",
                                              height: "90%",
                                              margin: "auto",
                                              p:"2px"
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
                                                      p.main_attributes[0].value ===
                                                      mainVariant
                                                  ).file_urls[0].image_url
                                            }
                                          />
                                        </Card>
                                      );
                                    }
                                  )}
                                </Grid>
                              :
                              (isHover?(
                                <Grid display="flex" flexDirection='column' xs={12} 
                                  pb="10px"
                                >
                                  <Grid xs={12} md={12} display="flex" justifyContent="center"
                                  sx={{cursor:'pointer'}}
                                    onClick={()=>{
                                      
                                      let category = localStorage.getItem(product.category_id).split("-")[0];
                                      let type = localStorage.getItem(product.category_id).split("-")[1].trim()==""?"All": localStorage.getItem(product.category_id).split("-")[1].trim().replace(/\s+/g, '');
                                      let gender = ""
                                      if (category.includes("Contact Lens")) {
                                        gender = "Unisex"
                                      }else{
                                        gender = product.products[0].general_attributes.find((att)=>att.title =='Gender').value.replace(/\s+/g, '');
                                      }
                                      category = category.replace(/\s+/g, '');
                                      history.push({ pathname: `/Products/${category}/${type}/${gender}/${toCamelCase(product.name)}`})
                                    }} 
                                  >
                                    {mainVariants(index).map(
                                      (mainVariant, mainVariantIndex) => {
                                        if ((mainVariantIndex>=(activeDot*4)) && (mainVariantIndex<((activeDot+1)*4))) {
                                          return (
                                            <Card
                                              sx={{
                                                border: "1px solid #DCDCDC",
                                                borderRadius: "6px",
                                                width: "50px",
                                                boxShadow: `${
                                                  mainVariantIndex === indexofImageGroup
                                                    ? "1px"
                                                    : "none"
                                                }`,
                                                margin: "2px",
                                              }}
                                              onMouseEnter={() => {
                                                setIndexOfImageGroup(mainVariantIndex);
                                                setImageGroup(
                                                  axiosConfig.defaults.baseURL +
                                                    product.products.find(
                                                      (p) =>
                                                        p.main_attributes[0].value ===
                                                        mainVariant
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
                                                setIndexOfImageGroup("");
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
                                                      p.main_attributes[0].value ===
                                                      mainVariant
                                                  )?.file_urls.length === 0
                                                    ? No_Product_Image
                                                    : axiosConfig.defaults.baseURL +
                                                      product.products.find(
                                                        (p) =>
                                                          p.main_attributes[0].value ===
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
                                  <Grid  xs={12} md={12} display="flex" justifyContent='center' alignSelf='center' pt="20px" spacing="50px"  alignItems='center' container mt={0}>
                                    
                                      <Grid item xs={12} md={12} display="flex" justifyContent='center' className="dots">
                                        {
                                          numberOfDots.length>1?
                                            (activeDot==0?
                                              <Grid  item xs={2} md={3} display="flex" justifyContent='flex-end' alignItems='center'>
                                                <KeyboardArrowLeftIcon  color="G3"/>
                                              </Grid>
                                              :
                                              <Grid  item xs={2} md={3} display="flex" justifyContent='flex-end' alignItems='center'>
                                                <KeyboardArrowLeftIcon item onClick={()=>{setActiveDot(activeDot-1)}}/>
                                              </Grid>
                                            ) 
                                          :
                                            ""
                                        }
  
                                      {numberOfDots.length>1?
                                        <Grid   item xs={2.5} sm={window.innerWidth>731?2:2.2} md={window.innerWidth>1265?4:window.innerWidth>1110?4:5} spacing={window.innerWidth>945?0 :"50px"} display='flex' alignItems='center' justifyContent='center' sx={{maxWidth:{xs:"70px", md:"64px"}}} maxWidth={"55px"} flexWrap='wrap' pl={0}>
                                          {numberOfDots.map((n,index1)=>{
                                            return(
                                              activeDot== index1?
                                                <Grid item xs={3}  display='flex' justifyContent='center' onClick={()=>{setActiveDot(index1)}}  height="10px"><Grid bgcolor="P.main" borderRadius={"10px"} width="8px" height="8px" pt="8px"></Grid></Grid>
                                              :
                                                <Grid item xs={3} display='flex' justifyContent='center'  onClick={()=>{setActiveDot(index1)}}   height="10px"><Grid bgcolor="G3.main" borderRadius={"10px"} width="8px" height="8px" pt="8px"></Grid></Grid>
                                            )
                                                
                                          })}
                                        </Grid>
                                        :
                                        ""
                                      }
                                      {
                                        numberOfDots.length>1?
                                          ((numberOfDots.length-1)!=activeDot?
                                          <Grid  item md={3} xs={2} display="flex" alignItems='center'>
                                            <KeyboardArrowRightIcon item onClick={()=>{setActiveDot(activeDot+1)}}/>
                                          </Grid>
                                          :
                                          <Grid  item md={3} xs={2} display="flex" alignItems='center'>
                                            <KeyboardArrowRightIcon item color="G3"/>
                                          </Grid>
                                          )
                                          :
                                        ""
                                      }
                                      </Grid>
  
                                  </Grid>
                                </Grid>)
                              :<Grid></Grid>)
                            }
                            </Fade>
                          </Grid>
                          <Typography gutterBottom variant="h1" align="center"  mb="7px"
                            onClick={()=>{
                                
                              let category = localStorage.getItem(product.category_id).split("-")[0];
                              let type = localStorage.getItem(product.category_id).split("-")[1].trim()==""?"All": localStorage.getItem(product.category_id).split("-")[1].trim().replace(/\s+/g, '');
                              let gender = ""
                              if (category.includes("Contact Lens")) {
                                gender = "Unisex"
                              }else{
                                gender = product.products[0].general_attributes.find((att)=>att.title =='Gender').value.replace(/\s+/g, '');
                              }
                              category = category.replace(/\s+/g, '');
                              history.push({ pathname: `/Products/${category}/${type}/${gender}/${toCamelCase(product.name)}`})
                            }} 
                            sx={{cursor:'pointer'}}
                          >
                            {product.products[0].general_attributes.find(a=>a.title=="Brand").value}
                          </Typography>
                          <Typography gutterBottom variant="h1" align="center" 
                            onClick={()=>{
                                
                              let category = localStorage.getItem(product.category_id).split("-")[0];
                              let type = localStorage.getItem(product.category_id).split("-")[1].trim()==""?"All": localStorage.getItem(product.category_id).split("-")[1].trim().replace(/\s+/g, '');
                              let gender = ""
                              if (category.includes("Contact Lens")) {
                                gender = "Unisex"
                              }else{
                                gender = product.products[0].general_attributes.find((att)=>att.title =='Gender').value.replace(/\s+/g, '');
                              }
                              category = category.replace(/\s+/g, '');
                              history.push({ pathname: `/Products/${category}/${type}/${gender}/${toCamelCase(product.name)}`})
                            }} 
                            sx={{cursor:'pointer'}}
                          >
                            {product.name}
                          </Typography>
      
                          <Grid
                            xs={12}
                            display="flex"
                            flexWrap='wrap'
                            justifyContent="center"
                            alignContent="center"
                            height='25px'
                            mb='10px'
                            onClick={()=>{
                                
                              let category = localStorage.getItem(product.category_id).split("-")[0]
                              let type = localStorage.getItem(product.category_id).split("-")[1].trim()==""?"All": localStorage.getItem(product.category_id).split("-")[1].trim().replace(/\s+/g, '');
                              let gender = ""
                              if (category.includes("Contact Lens")) {
                                gender = "Unisex"
                              }else{
                                gender = product.products[0].general_attributes.find((att)=>att.title =='Gender').value.replace(/\s+/g, '');
                              }
                              category = category.replace(/\s+/g, '');
                              history.push({ pathname: `/Products/${category}/${type}/${gender}/${toCamelCase(product.name)}`})
                            }} 
                            sx={{cursor:'pointer'}}
                          >
                            <Typography variant="h10">
                              {indexOfMainVariant === index
                                ? ""
                                : mainVariants(index).length +
                                  " " +
                                  (product.products[0].main_attributes[0].title.includes("Color Code")?"Color":product.products[0].main_attributes[0].title )+
                                  (mainVariants(index).length > 1 ? "s" : "")}
                            </Typography>
                            <Typography variant="h33">
                              {indexOfMainVariant === index
                                ? PriceGroup === ""
                                  ? " "
                                  : PriceGroup + " KWD"
                                : " "}
                            </Typography>
                            
                          </Grid>
                        </CardContent>
                      </Card>
                    </SwiperSlide>
      
                  )
                  
                }
    
              })
          )
        }
      </Swiper>
    );
  };
 
 
  return (
    <Grid container spacing={0} display="flex" justifyContent="center" >
      <Hidden lgUp>
        <Grid xs={12} >{mobileSize()}</Grid>
      </Hidden>
      <Hidden lgDown>
        <Grid xs={window.innerWidth>1284? 11:12} pr={window.innerWidth>1284?0:"15px"} pl={window.innerWidth>1284?0:"15px"}>{desktopSize()}</Grid>
      </Hidden>
    </Grid>
  );
};

export default NewProducts;