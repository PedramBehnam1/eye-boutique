import { Accordion, AccordionDetails, AccordionSummary, Button, CardMedia,  Divider, Grid, Hidden, IconButton, Typography ,
    Step,
    StepLabel,
    Stepper,
    Snackbar,SvgIcon} from "@mui/material";
import React, { useEffect, useState } from "react";
import Footer from "../../layout/footer";
import axiosConfig from '../../axiosConfig';
import Header from "../../layout/Header";
import NoProductImage from "../../asset/images/No-Product-Image-v2.png";
import Scrollbars from "react-custom-scrollbars-2";
import FavoriteIcon from '@mui/icons-material/Favorite';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import { makeStyles } from "@mui/styles";
import "../../asset/css/homePage/homeProductDetail.css"

import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useLocation } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore,{ Pagination,Navigation } from "swiper";
import "../../asset/css/_styles_.css";

const ProductDetail = () => {
    const [category, setCategory] = useState('');
    const [product, setProduct] = useState({});
    const [mainVariants, setMainVariants] = useState([]);
    const [variantArray, setVariantArray] = useState([]);
    const [selectedVariantArray, setSelectedVariantArray] = useState('');
    const [_selectedVariantArray, _setSelectedVariantArray] = useState('');
    const [_selectedVariantArray_, _setSelectedVariantArray_] = useState('');
    const [selectedVariant, setSelectedVariant] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [selectedVarientIndex, setSelectedVarientIndex] = useState(0);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [favorite, setFavorite] = useState(false);
    
    const [selectedSideAtt, setSelectedSideAtt] = useState({ index: '', title: '' });
    const [_selectedSideAtt, _setSelectedSideAtt] = useState('');
    const [selectedSideAttributes, setSelectedSideAttributes] = useState([]);
    const [_selectedSideAttributes, _setSelectedSideAttributes] = useState([]);
    const [selectedV, setSelectedV] = useState('');
    const [_selectedV, _setSelectedV] = useState('');
    const [_selectedV_, _setSelectedV_] = useState('');
    const [cardPage, setCardPage] = useState(true);
    const [trigger,setTrigger] = useState(0)
    const [_trigger, _setTrigger] = useState(0);
    const [loading, setLoading] = useState(false);
    const [loadingLeftEye, setLoadingLeftEye] = useState(false);
    const [loadingRigthEye, setLoadingRigthEye] = useState(false);
    const [_selectedIndex, _setSelectedIndex] = useState('');

    const [openMassage, setOpenMassage] = useState(false);
    const [showMassage, setShowMassage] = useState('');
    const [loadingPage, setLoadingPage] = useState(false);
    const [leftEye, setLeftEye] = useState(false);
    const [rightEye, setRightEye] = useState(false);
    const [leftEyeProduct, setLeftEyeProduct] = useState('');
    const [rightEyeProduct, setRightEyeProduct] = useState('');
    const [_leftEyeProduct, _setLeftEyeProduct] = useState('');
    const [_rightEyeProduct, _setRightEyeProduct] = useState('');
    const [varientOfEyes, setVarientOfEyes] = useState([]);
    const [isForTwoEyes, setIsForTwoEyes] = useState(false);
    const [isClickedConfirm, setIsClickedConfirm] = useState([false,false,false]);
    
    const [activeDot, setActiveDot] = useState(0);
    const [selectedVariants, setSelectedVariants] = useState([]);
    const[showCartPage,setShowCartPage]=useState(false)
    const location = useLocation();

    const [shoppingCart, setShoppingCart] = useState([]);  
    const [isRemoved, setIsRemoved] = useState(false);  
    const [height, setHeigth] = useState('');
    const [width, setWidth] = useState('');
    const [windowResizing, setWindowResizing] = useState(false);
    const [scrollY, setScrollY] = useState("");
    const useStyles = makeStyles(() => ({
            root: {
                "& 	.Mui-active": { color: "black !important" },
                "& .Mui-completed": { color: "#CB929B !important" }
            },
            paperRoot: {
                fontWeight: 900,
                '& .MuiStepConnector-root ': {
                    left: ' calc(-52% + 20px)',
                    right: 'calc(48% + 20px)',
                },
            "& 	.Mui-active": { color: "black !important" },
            "& .Mui-completed": { color: "#CB929B !important" }
        },
        
    }));
    const c = useStyles();  

    useEffect(()=>{
        localStorage.setItem('number',trigger)
    },[])
    useEffect(()=>{
        _setSelectedIndex(_selectedIndex)

    },[_trigger])

    const getWindowHeigth = () => {
        setHeigth(window.innerHeight)
        setWidth(window.innerWidth)
    }

    const listenScrollEvent = () => {
      setScrollY(window.scrollY);
    };
    useEffect(()=>{
        let timeout;
        const handleResize = () => {
            clearTimeout(timeout);

            setWindowResizing(true);

            timeout = setTimeout(() => {
                setWindowResizing(false);
            }, 200);
        }

        window.addEventListener("resize", handleResize);
        window.addEventListener('resize', getWindowHeigth)
        window.addEventListener("scroll", listenScrollEvent);
        return () => window.removeEventListener("resize", handleResize);
    })
    useEffect(() => {
        refreshList();
    }, [selectedSideAtt]);

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
    const refreshList = () => {
        let productName = window.location.pathname.split("Products/")[1].split("/")[window.location.pathname.split("Products/")[1].split("/").length-1];
        
        let product = '';
        axiosConfig.get(`/admin/product/all?limit=1000&page=1&language_id=1&status=1&category_id&name=`)
        .then((res) => {
            product =  res.data.products.find(p=>toCamelCase(p.name) == productName);
            axiosConfig.get(`/admin/product/get_productgroup_details/${product.id}`)
                .then(res => {
                   setProduct(res.data.product_group)
                   let recently_Viewed = JSON.parse(localStorage.getItem("recently_view") );
                   
                    if (recently_Viewed!=null) {
                       localStorage.setItem('recently_view',JSON.stringify(recently_Viewed))
                       recently_Viewed.push(product.id);
                       localStorage.setItem('recently_view',JSON.stringify(recently_Viewed))
                       
                    }else{
                       recently_Viewed = [];
                       recently_Viewed.push(product.id);
                       localStorage.setItem('recently_view',JSON.stringify(recently_Viewed))
                    }
                   
                    axiosConfig.get('/admin/category/all')
                       .then(respond => {
                        setCategory(respond.data.categories.find(c => c.types.find(t => t.id === res.data.product_group.category_id)).title.toLowerCase())
                           
                    })
   
                    const mainVariantsArray = []
                    res.data.product_group.products.map(p => {
                        if (mainVariantsArray.length !== 0) {
                            if (mainVariantsArray.find(m => m === p.main_attributes[0].value)) {
                            } else {
                                mainVariantsArray.push(p.main_attributes[0].value)
                            }
                        } else {
                            mainVariantsArray.push(p.main_attributes[0].value)
                        }
                    })
                    const varients = []
                    mainVariantsArray.map(mainVariant => {
                        varients.push(res.data.product_group.products.filter(p => p.main_attributes[0].value === mainVariant));
                    })
   
                    setMainVariants(mainVariantsArray);
                    setVariantArray(varients);
                    let dots = []
                    for (let index1 = 0; index1 < Math.ceil(varients.length/3); index1++) {
                        dots.push(index1)  
                    }
                
                    let selectedId=''
                    if (localStorage.getItem("Selected varient Id")!='') {
                        selectedId= parseInt(localStorage.getItem("Selected varient Id"));
                    }


                    if (selectedSideAtt.index === '') {
                        setSelectedVariantArray(varients[0]);
                        _setSelectedVariantArray(varients[0]);
                        _setSelectedVariantArray_(varients[0]);
                        let _selectedSideAtt_ = _selectedSideAtt==""?[]:_selectedSideAtt
                        if (varients[0].length!=0) {
                            for (let index = 0; index < varients[0][0].side_main_attributes.length; index++) {
                            _selectedSideAtt_[index]={ title: varients[0][0].side_main_attributes[index].title , value:'' }
                            }
                        }
                        _setSelectedSideAtt(_selectedSideAtt_)
                        
                        setSelectedSideAtt({ index: 0, title: varients[0][0].side_main_attributes[0].title })
                        let sideValues = []
                        if (selectedId!='') {
                            varients.map(v => {
                                if (v[v.length-1].id == selectedId) {
                                    v.map(varient=>{
                                        sideValues.push(varient.side_main_attributes.find(a => a.title === varients[0][0].side_main_attributes[0].title).value)

                                    })
                                    
                                } 
                            })
                        }else{
                            varients[0].map(v => {
                                sideValues.push(v.side_main_attributes.find(a => a.title === varients[0][0].side_main_attributes[0].title).value)
                            })
                        }
                        _setSelectedSideAttributes([...new Set(sideValues)])
                        
                        if (selectedId!=''&&selectedId!=undefined) {
                            let category = location.pathname
                            .split("Products/")[1]
                            .split("/")[0]
                            .replace(/\s+/g, "");
                            
                            
                            varients.map((p,index)=>{
                                if (p[0].id == selectedId) {
                                    setSelectedIndex(index);
                                    setSelectedVariantArray([p[0]]);
                                    _setSelectedVariantArray([p[0]]);
                                    _setSelectedVariantArray_([p[0]]);
                                    setSelectedVarientIndex(0)
                                    
                                    if (window.innerWidth>1555) {
                                        if (index>3) {
                                            setActiveDot(Math.floor(index/4)+1)
                                        }
                                    }else if (window.innerWidth>1165) {
                                        if (index<3) {
                                            setActiveDot(Math.floor(index/3))
                                            
                                        }else{
                                            setActiveDot(Math.floor(index/3)+1)

                                        }
                                        
                                    }else if(window.innerWidth>1035){
                                        if (index>1) {
                                            setActiveDot(Math.floor(index/2)+1)
                                        }
                                    } 
                                    
                                    _setTrigger(_trigger+1)
                                }
                            })
                            
                        
                        }
                    }
   
                    axiosConfig.get('/users/wishlist', {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    }).then(respons => {
                        respons.data.products.find(a => a.id === res.data.product_group.id) ? setFavorite(true) : setFavorite(false)
                    }).catch(err =>{ 
                        if(err.response.data.error.status === 401){
                        axiosConfig.post('/users/refresh_token', { 'refresh_token': localStorage.getItem('refreshToken') })
                            .then(res => {
                                localStorage.setItem('token', res.data.accessToken);
                                localStorage.setItem('refreshToken', res.data.refreshToken);
                                refreshList();
                            })
                        }else{
                            setShowMassage('Wishlist has a problem!')
                            setOpenMassage(true)      
                        }
                    })
                    setLoadingPage(true)
                   
            })
        });
    }

    const countMainVariants = (relatedProduct) => {
        const mainVariantsArray = [];
        relatedProduct.products.map(p => {
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

    function numberWithCommas(n) {
        var parts = n.toString().split(".");
        return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1].charAt(0) + (parts[1].charAt(1) ? parts[1].charAt(1) : '0') : ".00") + ' KWD';
    }

    useEffect( async()=>{
        
        await   axiosConfig
        .get("/users/card", {
            headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
        .then((res) => {
            let _selectedVarints=selectedVariants;
            if (category != 'sunglasses') {
                if (isRemoved) {
                    if (selectedVariantArray[0].side_main_attributes.length >1) {
                        if (rightEyeProduct!='') {
                            if (res.data.shoppingCard.find(card=>card.product_id==rightEyeProduct.id)==undefined) {
                                setLoadingRigthEye(false)
                                setRightEyeProduct('')
                                _selectedVarints = _selectedVarints.filter(v=>v!="Right eye");
                                setSelectedVariants(_selectedVarints);
                                _setSelectedIndex('')
                            }
                        }
                        if (leftEyeProduct != '') {
                            if (res.data.shoppingCard.find(card=>card.product_id==leftEyeProduct.id)==undefined) {
                                setLoadingLeftEye(false)
                                setLeftEyeProduct('')
                                _selectedVarints = _selectedVarints.filter(v=>v!="Left eye");
                                setSelectedVariants(_selectedVarints);
                                _setSelectedIndex('')
                            }
                            
                        } 
                        if (_selectedV != '') {
                            if (res.data.shoppingCard.find(card=>card.product_id==_selectedV.id)==undefined) {
                                setLoading(false)
                                _setSelectedV('')
                                _selectedVarints = _selectedVarints.filter(v=>v!=0);
                                setSelectedVariants(_selectedVarints);
                                _setSelectedIndex('')
                                
                            }
                            
                        }
                        
                    }else{
                        if (_rightEyeProduct!='') {
                            if (res.data.shoppingCard.find(card=>card.product_id==_rightEyeProduct.id)==undefined) {
                                setLoadingRigthEye(false)
                                _setRightEyeProduct('')
                                _selectedVarints = _selectedVarints.filter(v=>v!="Right eye");
                                setSelectedVariants(_selectedVarints);
                                _setSelectedIndex('')
                            }
                        }
                        if (_leftEyeProduct != '') {
                            if (res.data.shoppingCard.find(card=>card.product_id==_leftEyeProduct.id)==undefined) {
                                setLoadingLeftEye(false)
                                _setLeftEyeProduct('')
                                _selectedVarints = _selectedVarints.filter(v=>v!="Left eye");
                                setSelectedVariants(_selectedVarints);
                                _setSelectedIndex('')
                            }
                            
                        } 
                        if (_selectedV_ != '') {
                            if (res.data.shoppingCard.find(card=>card.product_id==_selectedV_.id)==undefined) {
                                setLoading(false)
                                _setSelectedV_('')
                                _selectedVarints = _selectedVarints.filter(v=>v!=0);
                                setSelectedVariants(_selectedVarints);
                                _setSelectedIndex('')
                            }
                            
                        }
                        
                    }
                    setSelectedSideAtt({ index: 0, title: variantArray[0][0].side_main_attributes[0].title })
                    let selectedSideAttributes =[];
                    if (variantArray[0].length!=0) {
                        for (let index = 0; index < variantArray[0][0].side_main_attributes.length; index++) {
                            selectedSideAttributes[index]={ title: variantArray[0][0].side_main_attributes[index].title , value:'' }
                            
                        }
                    }
                    _setSelectedSideAtt(selectedSideAttributes)
                    setSelectedSideAttributes([])
                    setShoppingCart(res.data.shoppingCard);
                    setIsRemoved(false)
    
                }else{
                    setShoppingCart(res.data.shoppingCard);
                }
                
            }else{
                setShoppingCart(res.data.shoppingCard);

            }
        })
    },[trigger])
    
    const addToCard = async(id) => {
        let isAddedToCart = false;
        if (localStorage.getItem("token")) {
            if (rightEye) {
                setLoadingRigthEye(true)
            }else if(leftEye){
                setLoadingLeftEye(true)
            }else{
                setLoading(true)
            }
            const cartObj = {
                product_id: id,
                quantity: 1
            }
            
         await   axiosConfig
            .get("/users/card", {
                headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then((res) => {

                res.data.shoppingCard.map( async cart=>{
                    if (cartObj.product_id == cart.product_id) {
                        if(cart.quantity<10){
                            isAddedToCart = true
                            await  axiosConfig.post('/users/card/add', cartObj
                                , {
                                    headers: {
                                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                                    }
                                }).then(res => {
                                    
                                    setTimeout(()=>{
                                        
                                        localStorage.setItem('number',trigger+1)
                                        setTrigger(trigger+1)
                                        setShowMassage("Added To Card!");
                                        setOpenMassage(true);
                    
                                    },1000)

                                })
            
                        }else{
                            isAddedToCart = true;
                            setShowMassage('You can not add more than 10 items to your cart!')
                            setOpenMassage(true)
                        }
                        
                    }
                    

                })
                if (!isAddedToCart) {
                    axiosConfig.post('/users/card/add', cartObj
                        , {
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem('token')}`
                            }
                        }).then(res => {
                            
                            localStorage.setItem('number',trigger+1)
                            setTrigger(trigger+1)

                            setTimeout(()=>{
                                localStorage.setItem('number',trigger+1)
                                setTrigger(trigger+1)
                                setShowMassage("Added To Card!");
                                setOpenMassage(true);
            
                            },1000)
                        })
                
                }
            })
            .catch((err) => {
                setShowMassage('Add to card has a problem!')
                setOpenMassage(true)   
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
                            
                        })
                }else{
                    setShowMassage('Add to card has a problem!')
                    setOpenMassage(true)   
                } 
            })
            
            
        }else{
            setShowMassage("Please Login first!");
            setOpenMassage(true);
        }
        
    }

    
    const deleteFromWishList = () => {
        setFavorite(false)
        if (localStorage.getItem("token")) {
            axiosConfig.delete(`/users/wishlist/${product.id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            }).then(() => {

                setFavorite(false)
            }).catch(err =>{ 
                if(err.response.data.error.status === 401){
                axiosConfig.post('/users/refresh_token', { 'refresh_token': localStorage.getItem('refreshToken') })
                    .then(res => {
                        localStorage.setItem('token', res.data.accessToken);
                        localStorage.setItem('refreshToken', res.data.refreshToken);
                        deleteFromWishList();
                        setShowMassage("Delted From Wishlist!");
                        setOpenMassage(true);
                    })
                }else{
                    setShowMassage('Delete from wishlist has a problem!')
                    setOpenMassage(true)   
                }
            })
        }else{
            setShowMassage("Please Login first!");
            setOpenMassage(true);
        }
    }

    const addToWishList = () => {
        if (localStorage.getItem("token")) {
            setFavorite(true)
            axiosConfig.post('/users/wishlist/add', { "product_group_id": product.id }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(() => {
                    setFavorite(true)
                    setShowMassage("Added To Wishlist!");
                    setOpenMassage(true);
                })
                .catch(err =>{ 
                    if(err.response.data.error.status === 401){
                        axiosConfig.post('/users/refresh_token', { 'refresh_token': localStorage.getItem('refreshToken') })
                            .then(res => {
                                localStorage.setItem('token', res.data.accessToken);
                                localStorage.setItem('refreshToken', res.data.refreshToken);
                                addToWishList();
                            })
                    }else{
                        setShowMassage('Add to wishlist has a problem!')
                        setOpenMassage(true)   
                    }
                })
        }else{
            setShowMassage("Please Login first!");
            setOpenMassage(true);
        }
    }
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpenMassage(false);
    };
    const truncate = (value,num)=>{
        return value.slice(0,num)+"..."
    }
    
    const DecreaseCartItem = (productId, current_quantity) => {
        
        if (localStorage.getItem("token")) {
            if (current_quantity == 1) {
                setShowMassage("Use delete icon in shopping cart to remove item from cart!");
                setOpenMassage(true);
            } else {

            const cartObj = {
                product_id: productId,
                quantity: 1,
            };
            axiosConfig
                .post("/users/card/decrease", cartObj, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                }).then((res) => {
                    _setTrigger(_trigger+1)
                    setTrigger(_trigger+1)
                    
                    setShowMassage(product.name+": "+(shoppingCart.find(card=>card.product_id==productId).quantity-1))
                    setOpenMassage(true)
                }).catch((err) => {
                    setShowMassage('Decrease cart item has a problem!')
                    setOpenMassage(true)      
                }).catch((err) =>{
                    if(err.response.data.error.status === 401){
                        axiosConfig
                            .post("/users/refresh_token", {
                            refresh_token: localStorage.getItem("refreshToken"),
                            })
                            .then((res) => {
                                setShowMassage('Decrease cart item has a problem!')
                                setOpenMassage(true)  
                                localStorage.setItem("token", res.data.accessToken);
                                localStorage.setItem("refreshToken", res.data.refreshToken);
                                IncreaseCartItem();
                            })
                    }else{
                        setShowMassage('Decrease cart item has a problem!')
                        setOpenMassage(true) 
                    }
                });
            }
        }else{
            setShowMassage("Please Login first!");
            setOpenMassage(true);
        }
    };
    const IncreaseCartItem = (productId, current_quantity) => {
        if (localStorage.getItem("token")) {
            if (current_quantity+1 > 10) {
                setShowMassage("You can not add more than 10 items to your cart!")
                setOpenMassage(true);
            } else {
            const cartObj = {
                product_id: productId,
                quantity: 1,
            };
            axiosConfig
                .post("/users/card/add", cartObj, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                })
                .then((res) => {

                    setShowMassage(product.name+": "+(shoppingCart.find(card=>card.product_id==productId).quantity+1))
                    setOpenMassage(true)
                    _setTrigger(_trigger+1)
                    setTrigger(_trigger+1)
                }).catch((err) => {
                    setShowMassage('Increase cart item has a problem!')
                    setOpenMassage(true) 
                }).catch((err) =>{
                    if(err.response.data.error.status === 401){
                        axiosConfig
                            .post("/users/refresh_token", {
                            refresh_token: localStorage.getItem("refreshToken"),
                            })
                            .then((res) => {
                                setShowMassage('Increase cart item has a problem!')
                                setOpenMassage(true) 
                                localStorage.setItem("token", res.data.accessToken);
                                localStorage.setItem("refreshToken", res.data.refreshToken);
                                IncreaseCartItem();
                            })
                    }else{
                        setShowMassage('Increase cart item has a problem!')
                        setOpenMassage(true) 
                    }
                });
            }
        }else{
            setShowMassage("Please Login first!");
            setOpenMassage(true);
        }
    };
    SwiperCore.use([Pagination,Navigation]);


    const mobileSizeOfMainVariantsImages = ()=>{
        
        let selectedId= parseInt(localStorage.getItem("Selected varient Id"));
        
     
        let _activeDot = activeDot;
         if (selectedId!=''&&selectedId!=undefined) {
            variantArray.map((p,index)=>{
                if (p[0].id == selectedId) {
                    
                    if (window.innerWidth>825) {
                        if (index>3) {
                            _activeDot = Math.floor(index/4)+1
                            
                        }
                    } else if (window.innerWidth>605) {
                        if (index>2) {
                            _activeDot = Math.floor(index/3)+1
                            
                        }
                    }else if (window.innerWidth>378) {
                        if (index>1) {
                            _activeDot = Math.floor(index/2)+1
                            
                        }
                    }else {
                        _activeDot = index
                        
                    }
                }
            })
        }

        return(

            <Grid xs={12} md={12} display='flex' justifyContent='center' bgcolor='white.main' flexWrap='wrap' pt="25px" >
                <Grid xs={12} display='flex' flexWrap='wrap' justifyContent='center'  >
                    
                    <Swiper  initialSlide={_activeDot===0?0:_activeDot}  slidesPerView='auto'    spaceBetween={50} 
                        
                    >
                        {variantArray.map((v,index) => {
                        return(
                            <>
                            <SwiperSlide style={{width:"100%"}} className="mySwiper3"  >
                                <Grid  sx={{ cursor: 'pointer',justifyContent:'center',alignItems:'center',margin: '0 4px',mb:index==0?"4px":0 ,pr:"10px", ml:index!=0?"5px":0}} display='flex' flexDirection='column' onClick={() => {
                                    setSelectedIndex(index);
                                    setSelectedVariantArray(v);
                                    _setSelectedVariantArray(v);
                                    _setSelectedVariantArray_(v);
                                    setSelectedVarientIndex(0)
                                    if (category!= 'sunglasses') {
                                        
                                                                            
                                        let sideValues=[];
                                        v.map(varient=>{
                                            sideValues.push(varient.side_main_attributes.find(a => a.title === variantArray[0][0].side_main_attributes[0].title).value)

                                        })
                                            
                                        _setSelectedSideAttributes([...new Set(sideValues)])
                                        
                                        setLeftEyeProduct('')
                                        setRightEyeProduct('')
                                        _setSelectedV([])
                                        setLoadingLeftEye(false)
                                        setLoadingRigthEye(false)
                                        setLoading(false)
                                        setSelectedSideAtt({ index: 0, title: variantArray[0][0].side_main_attributes[0].title })
                                        _setSelectedIndex('')
                                        setSelectedVariants([]);
                                        
                                        let selectedSideAtt =[];
                                        if (variantArray[0].length!=0) {
                                            for (let index = 0; index < variantArray[0][0].side_main_attributes.length; index++) {
                                                selectedSideAtt[index]={ title: variantArray[0][0].side_main_attributes[index].title , value:'' }
                                                
                                            }
                                        }
                                        _setSelectedSideAtt(selectedSideAtt)
                                        setSelectedSideAttributes([])
                                        
                                    }
                                
                                }}>
                                    <img
                                        src={(v[0] != undefined ? axiosConfig.defaults.baseURL + v[0].file_urls[0].image_url : NoProductImage)}
                                        width="100px" height='100px' style={{ objectFit: 'cover'}}
                                    />
                                    
                                    {selectedIndex == index ? (
                                        <Grid width='100px' display='flex' alignItems='center' borderBottom={2} borderColor='P.main'  ></Grid>
                                    ):
                                        <Grid width='100px' display='flex' alignItems='center' borderBottom={2} borderColor='White.main'  ></Grid>

                                    }
                                </Grid>
                            </SwiperSlide>
                            </>
                        );
                        })}
                    </Swiper>
                
                </Grid>
                
                <Divider  sx={{width:"100%"}}/>
                
            </Grid>
        )
    }
    return (
        loadingPage?
        (<Grid xs={12} md={12} >
            <Grid xs={12} md={12} mb={4}  spacing={0} sx={{ backgroundColor: "White.main" }}>
                <Grid container display='flex' flexDirection='column' >
                    <Grid xs={12} md={12}>
                        {trigger%2==0?
                            <Header trigger={trigger} _trigger={_trigger} showShoppingCard={showCartPage} closeShowShoppingCard={()=>{setShowCartPage(false)}}
                                isRemoved={(isRemoved) => {
                                    setIsRemoved(isRemoved)
                                }}
                                _trigger_={(trigger) => {
                                    setTrigger(trigger);
                                    _setTrigger(trigger);
                                }}
                            />
                            :
                            <Header trigger={trigger} _trigger={_trigger} showShoppingCard={showCartPage} closeShowShoppingCard={()=>{setShowCartPage(false)}}
                                isRemoved={(isRemoved) => {
                                    setIsRemoved(isRemoved)
                                }}
                                _trigger_={(_trigger) => {
                                    setTrigger(_trigger+trigger);
                                    _setTrigger(_trigger+trigger);
                                }}
                            />
                        }
                    </Grid>
                    <Grid container xs={12} display='flex' justifyContent='center' flexWrap='wrap' >
                        <Grid display='flex' justifyContent='center' alignSelf='center' xs={10} md={12} >
                            <Grid md={9} xs={12} display='flex' justifyContent='space-between' flexWrap='wrap' pt={"40px"}>
                                <Hidden mdDown>
                                    {window.innerWidth>1035?
                                        <Grid xs={12} height='100px'></Grid>
                                        :""
                                    }
                                </Hidden>
                                    {window.innerWidth>1035? '':
                                        <Grid xs={12} display='flex' justifyContent='center'>
                                            <Grid  mt={"71px"} mb="50px" alignItems='center' height="205px" maxWidth="228px">
                                                <CardMedia
                                                    component="img"
                                                    image={selectedVariantArray != '' ? axiosConfig.defaults.baseURL + selectedVariantArray[0].file_urls[0].image_url : (variantArray[0] != undefined ? axiosConfig.defaults.baseURL + variantArray[0][0].file_urls[0].image_url : NoProductImage)}
                                                />
                                            </Grid>

                                        </Grid>
                                    }
                            
                            {category === 'sunglasses'?
                                <Grid md={window.innerWidth>1450?5:window.innerWidth>1035?6:window.innerWidth>985?12:12} xs={12} pt="10px">
                                    {product && product.products !== undefined &&
                                    <Grid xs={12}  display='flex' flexWrap='wrap'>
                                        <Grid xs={12} display='flex' justifyContent='start' alignItems='center' ml={window.innerWidth>750?0:"-11px"}>
                                            <IconButton onClick={favorite ? deleteFromWishList : addToWishList}>
                                                {favorite ? <FavoriteIcon sx={{ color: 'P.main' }} /> :
                                                    <FavoriteIcon sx={{ color: 'G3.main' }} />}
                                            </IconButton>

                                            <Typography ml="22px" variant={window.innerWidth>450?'h12':"h17"}>{product.name != undefined ? product.name.charAt(0).toUpperCase() + product.name.slice(1) : ''}</Typography>
                                        </Grid>
                                        <Hidden mdDown>

                                            {window.innerWidth>1035?
                                            <Grid xs={12} mt="16px" pt="8px" pl="0.2px" display='flex' flexWrap='wrap' >
                                                <Grid xs={6} p="8px" display="flex" alignItems="center" pl={0} pb={0}>
                                                        
                                                    <SvgIcon
                                                                                
                                                        titleAccess="title"
                                                        component={(componentProps) => (
                                                            <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M17.5 4.375C16.85 3.88751 16.0771 3.59065 15.2679 3.51768C14.4587 3.44471 13.6452 3.59853 12.9184 3.96188C12.1917 4.32524 11.5806 4.88378 11.1534 5.57493C10.7263 6.26607 10.5 7.06251 10.5 7.875V10.5H8.75C8.28587 10.5 7.84075 10.6844 7.51256 11.0126C7.18437 11.3408 7 11.7859 7 12.25V26.25C7 27.6424 7.55312 28.9777 8.53769 29.9623C9.52226 30.9469 10.8576 31.5 12.25 31.5H20.1775L18.4642 29.75H12.25C11.3217 29.75 10.4315 29.3813 9.77513 28.7249C9.11875 28.0685 8.75 27.1783 8.75 26.25V12.25H19.25V15.841C19.5436 15.7804 19.8427 15.7499 20.1425 15.75H21V12.25H26.25V15.8848C26.8905 16.0475 27.4907 16.3538 28 16.7843V12.25C28 11.7859 27.8156 11.3408 27.4874 11.0126C27.1592 10.6844 26.7141 10.5 26.25 10.5H24.5V7.875C24.5 7.06251 24.2737 6.26607 23.8466 5.57493C23.4194 4.88378 22.8083 4.32524 22.0816 3.96188C21.3548 3.59853 20.5413 3.44471 19.7321 3.51768C18.9229 3.59065 18.15 3.88751 17.5 4.375ZM12.25 7.875C12.25 7.17881 12.5266 6.51113 13.0188 6.01885C13.5111 5.52656 14.1788 5.25 14.875 5.25C15.5712 5.25 16.2389 5.52656 16.7312 6.01885C17.2234 6.51113 17.5 7.17881 17.5 7.875V10.5H12.25V7.875ZM18.6672 5.691C19.0626 5.42701 19.5222 5.27533 19.997 5.25215C20.4718 5.22897 20.944 5.33516 21.3632 5.55939C21.7823 5.78362 22.1328 6.11746 22.377 6.52529C22.6213 6.93312 22.7502 7.39963 22.75 7.875V10.5H19.25V7.875C19.25 7.0805 19.0382 6.335 18.6672 5.691ZM18.256 27.0358C17.7716 26.5411 17.5003 25.8765 17.5 25.1843V20.1443C17.4998 19.7971 17.5679 19.4533 17.7006 19.1325C17.8333 18.8117 18.0279 18.5202 18.2734 18.2746C18.5188 18.029 18.8101 17.8342 19.1309 17.7013C19.4516 17.5684 19.7953 17.5 20.1425 17.5H25.1702C25.8755 17.5 26.551 17.7818 27.0462 18.2823L32.4835 23.7773C32.7303 24.0264 32.9251 24.3222 33.0567 24.6473C33.1882 24.9724 33.2539 25.3204 33.2498 25.6712C33.2457 26.0219 33.172 26.3682 33.033 26.6902C32.8939 27.0122 32.6923 27.3034 32.4397 27.5468L27.2825 32.5115C26.7811 32.9947 26.1091 33.2601 25.4128 33.2499C24.7166 33.2398 24.0526 32.9548 23.5655 32.4573L18.256 27.0358ZM21 22.3125C21 22.6606 21.1383 22.9944 21.3844 23.2406C21.6306 23.4867 21.9644 23.625 22.3125 23.625C22.6606 23.625 22.9944 23.4867 23.2406 23.2406C23.4867 22.9944 23.625 22.6606 23.625 22.3125C23.625 21.9644 23.4867 21.6306 23.2406 21.3844C22.9944 21.1383 22.6606 21 22.3125 21C21.9644 21 21.6306 21.1383 21.3844 21.3844C21.1383 21.6306 21 21.9644 21 22.3125Z" fill="#757575"/>
                                                            </svg>
                                                        )}
                                                    />
                                                    {window.innerWidth>1135?
                                                        <Typography variant='menuitem' color='G2.main' pl="24px" pt="2px">{product.products[0].general_attributes.find(a => a.title === 'Brand')?(
                                                            product.products[0].general_attributes.find(a => a.title === 'Brand').value):""}</Typography>
                                                    :
                                                        <Typography variant='menuitem' color='G2.main' pl="24px" pt="2px">{product.products[0].general_attributes.find(a => a.title === 'Brand')?(product.products[0].general_attributes.find(a => a.title === 'Brand').value.length>11?truncate(product.products[0].general_attributes.find(a => a.title === 'Brand').value
                                                        ,8):product.products[0].general_attributes.find(a => a.title === 'Brand').value):""}</Typography>
                                                    }
                                                </Grid>
                                                <Grid xs={6} pr="8px" pb={0} pt="14px" pl="28px"  display="flex" alignItems="center" >
                                                    <SvgIcon
                                                                                
                                                        titleAccess="title"
                                                        component={(componentProps) => (
                                                            <svg width="47" height="18" viewBox="0 0 47 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M11.75 2.94284C13.3081 2.94284 14.8025 3.56181 15.9043 4.66358C17.006 5.76536 17.625 7.25969 17.625 8.81784C17.625 10.376 17.006 11.8703 15.9043 12.9721C14.8025 14.0739 13.3081 14.6928 11.75 14.6928C10.1919 14.6928 8.69752 14.0739 7.59575 12.9721C6.49397 11.8703 5.875 10.376 5.875 8.81784C5.875 7.25969 6.49397 5.76536 7.59575 4.66358C8.69752 3.56181 10.1919 2.94284 11.75 2.94284ZM19.4609 4.54965C18.5765 2.94945 17.2163 1.66396 15.5687 0.871288C13.9211 0.0786185 12.0678 -0.181977 10.2655 0.125611C8.46324 0.433199 6.80125 1.29374 5.50984 2.588C4.21843 3.88225 3.36156 5.54613 3.05794 7.34909H1.46875C1.07921 7.34909 0.705631 7.50383 0.430187 7.77927C0.154743 8.05472 0 8.4283 0 8.81784C0 9.20737 0.154743 9.58096 0.430187 9.8564C0.705631 10.1318 1.07921 10.2866 1.46875 10.2866H3.05794C3.42246 12.4689 4.59458 14.4343 6.34143 15.7923C8.08827 17.1502 10.282 17.8014 12.4869 17.6164C14.6917 17.4314 16.7463 16.4237 18.2424 14.7937C19.7385 13.1636 20.5667 11.0304 20.5625 8.81784C20.5625 8.03876 20.872 7.2916 21.4229 6.74071C21.9738 6.18982 22.7209 5.88034 23.5 5.88034C24.2791 5.88034 25.0262 6.18982 25.5771 6.74071C26.128 7.2916 26.4375 8.03876 26.4375 8.81784C26.4333 11.0304 27.2615 13.1636 28.7576 14.7937C30.2537 16.4237 32.3083 17.4314 34.5131 17.6164C36.718 17.8014 38.9117 17.1502 40.6586 15.7923C42.4054 14.4343 43.5775 12.4689 43.9421 10.2866H45.5312C45.9208 10.2866 46.2944 10.1318 46.5698 9.8564C46.8453 9.58096 47 9.20737 47 8.81784C47 8.4283 46.8453 8.05472 46.5698 7.77927C46.2944 7.50383 45.9208 7.34909 45.5312 7.34909H43.9421C43.6384 5.54613 42.7816 3.88225 41.4902 2.588C40.1988 1.29374 38.5368 0.433199 36.7345 0.125611C34.9322 -0.181977 33.0789 0.0786185 31.4313 0.871288C29.7837 1.66396 28.4235 2.94945 27.5391 4.54965C26.4488 3.51553 25.0027 2.94023 23.5 2.94284C21.9373 2.94284 20.5155 3.55384 19.4609 4.54965ZM41.125 8.81784C41.125 10.376 40.506 11.8703 39.4043 12.9721C38.3025 14.0739 36.8081 14.6928 35.25 14.6928C33.6919 14.6928 32.1975 14.0739 31.0957 12.9721C29.994 11.8703 29.375 10.376 29.375 8.81784C29.375 7.25969 29.994 5.76536 31.0957 4.66358C32.1975 3.56181 33.6919 2.94284 35.25 2.94284C36.8081 2.94284 38.3025 3.56181 39.4043 4.66358C40.506 5.76536 41.125 7.25969 41.125 8.81784Z" fill="#757575"/>
                                                            </svg>

                                                        )}
                                                    />
                                                    {window.innerWidth>1135?
                                                        <Typography variant='menuitem' color='G2.main' pl="22px">{product.products[0].general_attributes.find(a => a.title === ('Type' ))?(product.products[0].general_attributes.find(a => a.title === 'Type').value):""}</Typography>
                                                    :
                                                        <Typography variant='menuitem' color='G2.main' pl="22px">{product.products[0].general_attributes.find(a => a.title === ('Type' ))?(product.products[0].general_attributes.find(a => a.title === 'Type').value.length>8?truncate(product.products[0].general_attributes.find(a => a.title === 'Type').value
                                                        ,8):product.products[0].general_attributes.find(a => a.title === 'Type').value):""}</Typography>

                                                    }
                                                </Grid>
                                                <Grid xs={12} height="8px"></Grid>
                                                <Grid xs={6} pt="18px" display="flex" alignItems="center">
                                                    <SvgIcon
                                                                                
                                                        titleAccess="title"
                                                        component={(componentProps) => (
                                                            <svg width="40" height="26" viewBox="0 0 40 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M29.2464 0C27.9499 0 26.7496 0.542109 25.8274 1.50434C24.9053 2.46649 24.3052 3.83871 24.3052 5.36731C24.3052 6.8959 24.9053 8.26784 25.8274 9.22999C26.7495 10.1923 27.9499 10.7344 29.2464 10.7344C30.5428 10.7344 31.7431 10.1923 32.6654 9.23006C33.5875 8.26791 34.1878 6.8959 34.1878 5.36731C34.1878 3.83871 33.5875 2.46656 32.6654 1.50434C31.7431 0.542109 30.5428 0 29.2464 0ZM7.68389 6.75C6.78437 6.75 5.94343 7.12406 5.28147 7.81488C4.6195 8.50556 4.17998 9.50273 4.17998 10.6172C4.17998 11.7316 4.6195 12.7288 5.28147 13.4195C5.94343 14.1103 6.78437 14.4844 7.68389 14.4844C8.5834 14.4844 9.42452 14.1103 10.0865 13.4195C10.7485 12.7288 11.1876 11.7316 11.1876 10.6172C11.1876 9.50273 10.7485 8.50556 10.0865 7.81488C9.42452 7.12406 8.5834 6.75 7.68389 6.75ZM24.6468 10.1021C24.5003 10.1908 24.3583 10.284 24.2212 10.3815C22.9889 11.2621 22.0815 12.5648 21.3885 14.1923C20.0777 17.2695 19.5553 21.456 18.6875 25.7344H39.8053C38.9374 21.456 38.4149 17.2695 37.1042 14.1923C36.4112 12.5648 35.5039 11.2621 34.2716 10.3815C34.1346 10.2839 33.9926 10.1907 33.846 10.1021C32.6924 11.2477 31.0661 12.0001 29.2465 12.0001C27.4269 12.0001 25.8005 11.2477 24.6469 10.1021H24.6468ZM4.20424 14.39C4.15276 14.4241 4.10155 14.4588 4.05132 14.4946C3.1634 15.1291 2.49568 16.0805 1.98222 17.286C1.02988 19.522 0.630524 22.5837 0 25.7344H15.3676C14.7372 22.5837 14.3378 19.522 13.3855 17.286C12.8721 16.0805 12.2045 15.1291 11.3165 14.4946C11.2664 14.459 11.2154 14.4241 11.1636 14.39C10.2761 15.2102 9.05149 15.75 7.68389 15.75C6.31629 15.75 5.09172 15.2101 4.20424 14.39Z" fill="#757575"/>
                                                            </svg>

                                                        )}
                                                    />
                                                    {window.innerWidth>1135?
                                                        <Typography variant='menuitem' color='G2.main' pl="20.3px" pt="3px">{product.products[0].general_attributes.find(a => a.title === ( 'Age Range'))?(product.products[0].general_attributes.find(a => a.title === 'Age Range').value):""}</Typography>
                                                    :
                                                        <Typography variant='menuitem' color='G2.main' pl="20.3px" pt="3px">{product.products[0].general_attributes.find(a => a.title === ( 'Age Range'))?(product.products[0].general_attributes.find(a => a.title === 'Age Range').value.length>11?truncate(product.products[0].general_attributes.find(a => a.title === 'Age Range').value
                                                        ,8):product.products[0].general_attributes.find(a => a.title === 'Age Range').value):""}</Typography>
                                                    }
                                                </Grid>
                                                <Grid xs={6} pr="8px" pt="24px" pl="35px" display="flex" alignItems="center">
                                                    <SvgIcon
                                                                                
                                                        titleAccess="title"
                                                        component={(componentProps) => (
                                                            <svg width="32" height="30" viewBox="0 0 32 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M27.9929 20.8333C25.8288 25.2733 21.2713 28.3333 15.9996 28.3333C10.7279 28.3333 6.17044 25.2733 4.0071 20.8333H2.17627C4.45127 26.22 9.7846 30 15.9996 30C22.2146 30 27.5471 26.22 29.8229 20.8333H27.9929ZM6.3171 5.83333C8.7471 3.26667 12.1863 1.66667 15.9996 1.66667C19.8129 1.66667 23.2521 3.26667 25.6821 5.83333H27.8738C25.1304 2.285 20.8321 0 15.9996 0C11.1671 0 6.86877 2.285 4.12544 5.83333H6.3171ZM8.4996 15C9.42044 15 10.1663 14.0667 10.1663 12.9167C10.1663 11.7667 9.42044 10.8333 8.4996 10.8333C7.57877 10.8333 6.83294 11.7667 6.83294 12.9167C6.83294 14.0667 7.57877 15 8.4996 15ZM25.1663 12.9167C25.1663 14.0667 24.4204 15 23.4996 15C22.5788 15 21.8329 14.0667 21.8329 12.9167C21.8329 11.7667 22.5788 10.8333 23.4996 10.8333C24.4204 10.8333 25.1663 11.7667 25.1663 12.9167Z" fill="#757575"/>
                                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M14.9023 11.15C14.9285 10.8779 14.9212 10.6037 14.8807 10.3333H17.119C17.0784 10.6037 17.0712 10.8779 17.0973 11.15L17.574 16.15C17.6528 16.9754 18.0363 17.7417 18.6497 18.2995C19.2631 18.8573 20.0624 19.1665 20.8915 19.1667H27.6665C28.5506 19.1667 29.3984 18.8155 30.0235 18.1904C30.6486 17.5652 30.9998 16.7174 30.9998 15.8333V11.6667H31.8332V7.5H20.4165C19.3965 7.5 18.4915 7.955 17.8832 8.66667H14.1165C13.8041 8.30018 13.4157 8.00602 12.9782 7.80457C12.5408 7.60312 12.0648 7.49919 11.5832 7.5H0.166504V11.6667H0.999837V15.8333C0.999837 16.7174 1.35103 17.5652 1.97615 18.1904C2.60127 18.8155 3.44912 19.1667 4.33317 19.1667H11.1082C11.9373 19.1665 12.7365 18.8573 13.35 18.2995C13.9634 17.7417 14.3469 16.9754 14.4257 16.15L14.9023 11.15ZM4.33317 9.16667C3.89114 9.16667 3.46722 9.34227 3.15466 9.65483C2.8421 9.96739 2.6665 10.3913 2.6665 10.8333V15.8333C2.6665 16.2754 2.8421 16.6993 3.15466 17.0118C3.46722 17.3244 3.89114 17.5 4.33317 17.5H11.1082C11.5226 17.4998 11.9222 17.3452 12.2288 17.0663C12.5354 16.7874 12.7271 16.4043 12.7665 15.9917L13.2432 10.9917C13.2652 10.7604 13.2387 10.5271 13.1653 10.3067C13.0919 10.0863 12.9733 9.88372 12.817 9.71188C12.6607 9.54004 12.4702 9.40277 12.2577 9.30888C12.0452 9.21499 11.8155 9.16655 11.5832 9.16667H4.33317ZM18.7565 10.9917C18.7344 10.7604 18.761 10.5271 18.8343 10.3067C18.9077 10.0863 19.0264 9.88372 19.1827 9.71188C19.339 9.54004 19.5295 9.40277 19.742 9.30888C19.9545 9.21499 20.1842 9.16655 20.4165 9.16667H27.6665C28.1085 9.16667 28.5325 9.34227 28.845 9.65483C29.1576 9.96739 29.3332 10.3913 29.3332 10.8333V15.8333C29.3332 16.2754 29.1576 16.6993 28.845 17.0118C28.5325 17.3244 28.1085 17.5 27.6665 17.5H20.8915C20.477 17.4998 20.0775 17.3452 19.7709 17.0663C19.4642 16.7874 19.2725 16.4043 19.2332 15.9917L18.7565 10.9917Z" fill="#757575"/>
                                                                <path d="M20.458 22.8641C20.5606 22.8258 20.6545 22.7677 20.7346 22.6931C20.8147 22.6184 20.8793 22.5288 20.9247 22.4292C20.9701 22.3296 20.9955 22.222 20.9994 22.1126C21.0032 22.0032 20.9855 21.8942 20.9472 21.7916C20.9089 21.6891 20.8508 21.5951 20.7761 21.515C20.7015 21.4349 20.6118 21.3703 20.5122 21.3249C20.4126 21.2795 20.3051 21.2541 20.1957 21.2503C20.0863 21.2464 19.9772 21.2641 19.8747 21.3025C18.158 21.9425 16.9355 22.2575 15.8105 22.2708C14.7047 22.285 13.6205 22.0083 12.1897 21.33C11.9899 21.2354 11.7607 21.224 11.5525 21.2984C11.3444 21.3728 11.1743 21.5268 11.0797 21.7266C10.9851 21.9264 10.9737 22.1556 11.0481 22.3638C11.1225 22.5719 11.2765 22.742 11.4763 22.8366C13.0513 23.5825 14.3922 23.955 15.8313 23.9375C17.2505 23.92 18.6913 23.5225 20.4572 22.8641H20.458Z" fill="#757575"/>
                                                            </svg>
                                                        )}
                                                    />
                                                    {window.innerWidth>1135?
                                                        <Typography variant='menuitem' color='G2.main' pl="30px" pb="1px">{
                                                            product.products[0].general_attributes.find(a => a.title === 'Shape')?product.products[0].general_attributes.find(a => a.title === 'Shape').value:""}</Typography>
                                                    :
                                                        <Typography variant='menuitem' color='G2.main' pl="30px" pb="1px">{
                                                            product.products[0].general_attributes.find(a => a.title === 'Shape')?(product.products[0].general_attributes.find(a => a.title === 'Shape').value.length>11?truncate(product.products[0].general_attributes.find(a => a.title === 'Shape').value
                                                            ,8):product.products[0].general_attributes.find(a => a.title === 'Shape').value):""}</Typography> 
                                                    
                                                    } 
                                                </Grid>
                                            </Grid>
                                            
                                            :
                                                <Grid xs={12} mt={2} pt={1} display='flex' flexWrap='wrap' sx={{border: '1px solid #E0E0E0' , borderRadius:'10px'}}>
                                                    <Grid xs={6} p={1} display="flex" alignItems="center">
                                                            
                                                        <SvgIcon
                                                                                    
                                                            titleAccess="title"
                                                            component={(componentProps) => (
                                                                <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M17.5 4.375C16.85 3.88751 16.0771 3.59065 15.2679 3.51768C14.4587 3.44471 13.6452 3.59853 12.9184 3.96188C12.1917 4.32524 11.5806 4.88378 11.1534 5.57493C10.7263 6.26607 10.5 7.06251 10.5 7.875V10.5H8.75C8.28587 10.5 7.84075 10.6844 7.51256 11.0126C7.18437 11.3408 7 11.7859 7 12.25V26.25C7 27.6424 7.55312 28.9777 8.53769 29.9623C9.52226 30.9469 10.8576 31.5 12.25 31.5H20.1775L18.4642 29.75H12.25C11.3217 29.75 10.4315 29.3813 9.77513 28.7249C9.11875 28.0685 8.75 27.1783 8.75 26.25V12.25H19.25V15.841C19.5436 15.7804 19.8427 15.7499 20.1425 15.75H21V12.25H26.25V15.8848C26.8905 16.0475 27.4907 16.3538 28 16.7843V12.25C28 11.7859 27.8156 11.3408 27.4874 11.0126C27.1592 10.6844 26.7141 10.5 26.25 10.5H24.5V7.875C24.5 7.06251 24.2737 6.26607 23.8466 5.57493C23.4194 4.88378 22.8083 4.32524 22.0816 3.96188C21.3548 3.59853 20.5413 3.44471 19.7321 3.51768C18.9229 3.59065 18.15 3.88751 17.5 4.375ZM12.25 7.875C12.25 7.17881 12.5266 6.51113 13.0188 6.01885C13.5111 5.52656 14.1788 5.25 14.875 5.25C15.5712 5.25 16.2389 5.52656 16.7312 6.01885C17.2234 6.51113 17.5 7.17881 17.5 7.875V10.5H12.25V7.875ZM18.6672 5.691C19.0626 5.42701 19.5222 5.27533 19.997 5.25215C20.4718 5.22897 20.944 5.33516 21.3632 5.55939C21.7823 5.78362 22.1328 6.11746 22.377 6.52529C22.6213 6.93312 22.7502 7.39963 22.75 7.875V10.5H19.25V7.875C19.25 7.0805 19.0382 6.335 18.6672 5.691ZM18.256 27.0358C17.7716 26.5411 17.5003 25.8765 17.5 25.1843V20.1443C17.4998 19.7971 17.5679 19.4533 17.7006 19.1325C17.8333 18.8117 18.0279 18.5202 18.2734 18.2746C18.5188 18.029 18.8101 17.8342 19.1309 17.7013C19.4516 17.5684 19.7953 17.5 20.1425 17.5H25.1702C25.8755 17.5 26.551 17.7818 27.0462 18.2823L32.4835 23.7773C32.7303 24.0264 32.9251 24.3222 33.0567 24.6473C33.1882 24.9724 33.2539 25.3204 33.2498 25.6712C33.2457 26.0219 33.172 26.3682 33.033 26.6902C32.8939 27.0122 32.6923 27.3034 32.4397 27.5468L27.2825 32.5115C26.7811 32.9947 26.1091 33.2601 25.4128 33.2499C24.7166 33.2398 24.0526 32.9548 23.5655 32.4573L18.256 27.0358ZM21 22.3125C21 22.6606 21.1383 22.9944 21.3844 23.2406C21.6306 23.4867 21.9644 23.625 22.3125 23.625C22.6606 23.625 22.9944 23.4867 23.2406 23.2406C23.4867 22.9944 23.625 22.6606 23.625 22.3125C23.625 21.9644 23.4867 21.6306 23.2406 21.3844C22.9944 21.1383 22.6606 21 22.3125 21C21.9644 21 21.6306 21.1383 21.3844 21.3844C21.1383 21.6306 21 21.9644 21 22.3125Z" fill="#757575"/>
                                                                </svg>
                                                            )}
                                                        />
                                                        <Typography variant='menuitem' color='G2.main' pl="24px" pt="2px">{product.products[0].general_attributes.find(a => a.title === 'Brand')?(product.products[0].general_attributes.find(a => a.title === 'Brand').value):""}</Typography>
                                                    </Grid>
                                                    <Grid xs={6} p={1}display="flex" alignItems="center" >
                                                        <SvgIcon
                                                                                    
                                                            titleAccess="title"
                                                            component={(componentProps) => (
                                                                <svg width="47" height="18" viewBox="0 0 47 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M11.75 2.94284C13.3081 2.94284 14.8025 3.56181 15.9043 4.66358C17.006 5.76536 17.625 7.25969 17.625 8.81784C17.625 10.376 17.006 11.8703 15.9043 12.9721C14.8025 14.0739 13.3081 14.6928 11.75 14.6928C10.1919 14.6928 8.69752 14.0739 7.59575 12.9721C6.49397 11.8703 5.875 10.376 5.875 8.81784C5.875 7.25969 6.49397 5.76536 7.59575 4.66358C8.69752 3.56181 10.1919 2.94284 11.75 2.94284ZM19.4609 4.54965C18.5765 2.94945 17.2163 1.66396 15.5687 0.871288C13.9211 0.0786185 12.0678 -0.181977 10.2655 0.125611C8.46324 0.433199 6.80125 1.29374 5.50984 2.588C4.21843 3.88225 3.36156 5.54613 3.05794 7.34909H1.46875C1.07921 7.34909 0.705631 7.50383 0.430187 7.77927C0.154743 8.05472 0 8.4283 0 8.81784C0 9.20737 0.154743 9.58096 0.430187 9.8564C0.705631 10.1318 1.07921 10.2866 1.46875 10.2866H3.05794C3.42246 12.4689 4.59458 14.4343 6.34143 15.7923C8.08827 17.1502 10.282 17.8014 12.4869 17.6164C14.6917 17.4314 16.7463 16.4237 18.2424 14.7937C19.7385 13.1636 20.5667 11.0304 20.5625 8.81784C20.5625 8.03876 20.872 7.2916 21.4229 6.74071C21.9738 6.18982 22.7209 5.88034 23.5 5.88034C24.2791 5.88034 25.0262 6.18982 25.5771 6.74071C26.128 7.2916 26.4375 8.03876 26.4375 8.81784C26.4333 11.0304 27.2615 13.1636 28.7576 14.7937C30.2537 16.4237 32.3083 17.4314 34.5131 17.6164C36.718 17.8014 38.9117 17.1502 40.6586 15.7923C42.4054 14.4343 43.5775 12.4689 43.9421 10.2866H45.5312C45.9208 10.2866 46.2944 10.1318 46.5698 9.8564C46.8453 9.58096 47 9.20737 47 8.81784C47 8.4283 46.8453 8.05472 46.5698 7.77927C46.2944 7.50383 45.9208 7.34909 45.5312 7.34909H43.9421C43.6384 5.54613 42.7816 3.88225 41.4902 2.588C40.1988 1.29374 38.5368 0.433199 36.7345 0.125611C34.9322 -0.181977 33.0789 0.0786185 31.4313 0.871288C29.7837 1.66396 28.4235 2.94945 27.5391 4.54965C26.4488 3.51553 25.0027 2.94023 23.5 2.94284C21.9373 2.94284 20.5155 3.55384 19.4609 4.54965ZM41.125 8.81784C41.125 10.376 40.506 11.8703 39.4043 12.9721C38.3025 14.0739 36.8081 14.6928 35.25 14.6928C33.6919 14.6928 32.1975 14.0739 31.0957 12.9721C29.994 11.8703 29.375 10.376 29.375 8.81784C29.375 7.25969 29.994 5.76536 31.0957 4.66358C32.1975 3.56181 33.6919 2.94284 35.25 2.94284C36.8081 2.94284 38.3025 3.56181 39.4043 4.66358C40.506 5.76536 41.125 7.25969 41.125 8.81784Z" fill="#757575"/>
                                                                </svg>

                                                            )}
                                                        />
                                                        <Typography variant='menuitem' color='G2.main' pl="7px">{product.products[0].general_attributes.find(a => a.title === 'Type')?(product.products[0].general_attributes.find(a => a.title === 'Type').value):""}</Typography>
                                                    </Grid>
                                                    <Grid xs={6} p={1} pl="8.5px" display="flex" alignItems="center">
                                                        <SvgIcon
                                                                                    
                                                            titleAccess="title"
                                                            component={(componentProps) => (
                                                                <svg width="40" height="26" viewBox="0 0 40 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M29.2464 0C27.9499 0 26.7496 0.542109 25.8274 1.50434C24.9053 2.46649 24.3052 3.83871 24.3052 5.36731C24.3052 6.8959 24.9053 8.26784 25.8274 9.22999C26.7495 10.1923 27.9499 10.7344 29.2464 10.7344C30.5428 10.7344 31.7431 10.1923 32.6654 9.23006C33.5875 8.26791 34.1878 6.8959 34.1878 5.36731C34.1878 3.83871 33.5875 2.46656 32.6654 1.50434C31.7431 0.542109 30.5428 0 29.2464 0ZM7.68389 6.75C6.78437 6.75 5.94343 7.12406 5.28147 7.81488C4.6195 8.50556 4.17998 9.50273 4.17998 10.6172C4.17998 11.7316 4.6195 12.7288 5.28147 13.4195C5.94343 14.1103 6.78437 14.4844 7.68389 14.4844C8.5834 14.4844 9.42452 14.1103 10.0865 13.4195C10.7485 12.7288 11.1876 11.7316 11.1876 10.6172C11.1876 9.50273 10.7485 8.50556 10.0865 7.81488C9.42452 7.12406 8.5834 6.75 7.68389 6.75ZM24.6468 10.1021C24.5003 10.1908 24.3583 10.284 24.2212 10.3815C22.9889 11.2621 22.0815 12.5648 21.3885 14.1923C20.0777 17.2695 19.5553 21.456 18.6875 25.7344H39.8053C38.9374 21.456 38.4149 17.2695 37.1042 14.1923C36.4112 12.5648 35.5039 11.2621 34.2716 10.3815C34.1346 10.2839 33.9926 10.1907 33.846 10.1021C32.6924 11.2477 31.0661 12.0001 29.2465 12.0001C27.4269 12.0001 25.8005 11.2477 24.6469 10.1021H24.6468ZM4.20424 14.39C4.15276 14.4241 4.10155 14.4588 4.05132 14.4946C3.1634 15.1291 2.49568 16.0805 1.98222 17.286C1.02988 19.522 0.630524 22.5837 0 25.7344H15.3676C14.7372 22.5837 14.3378 19.522 13.3855 17.286C12.8721 16.0805 12.2045 15.1291 11.3165 14.4946C11.2664 14.459 11.2154 14.4241 11.1636 14.39C10.2761 15.2102 9.05149 15.75 7.68389 15.75C6.31629 15.75 5.09172 15.2101 4.20424 14.39Z" fill="#757575"/>
                                                                </svg>

                                                            )}
                                                        />
                                                        <Typography variant='menuitem' color='G2.main' pl="18px" pt="3px">{product.products[0].general_attributes.find(a => a.title === ( 'Age Range'))?(product.products[0].general_attributes.find(a => a.title === 'Age Range').value):""}</Typography>
                                                    </Grid>

                                                    <Grid xs={6} p={1} pl="14px" display="flex" alignItems="center">
                                                        <SvgIcon
                                                                                    
                                                            titleAccess="title"
                                                            component={(componentProps) => (
                                                                <svg width="32" height="30" viewBox="0 0 32 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M27.9929 20.8333C25.8288 25.2733 21.2713 28.3333 15.9996 28.3333C10.7279 28.3333 6.17044 25.2733 4.0071 20.8333H2.17627C4.45127 26.22 9.7846 30 15.9996 30C22.2146 30 27.5471 26.22 29.8229 20.8333H27.9929ZM6.3171 5.83333C8.7471 3.26667 12.1863 1.66667 15.9996 1.66667C19.8129 1.66667 23.2521 3.26667 25.6821 5.83333H27.8738C25.1304 2.285 20.8321 0 15.9996 0C11.1671 0 6.86877 2.285 4.12544 5.83333H6.3171ZM8.4996 15C9.42044 15 10.1663 14.0667 10.1663 12.9167C10.1663 11.7667 9.42044 10.8333 8.4996 10.8333C7.57877 10.8333 6.83294 11.7667 6.83294 12.9167C6.83294 14.0667 7.57877 15 8.4996 15ZM25.1663 12.9167C25.1663 14.0667 24.4204 15 23.4996 15C22.5788 15 21.8329 14.0667 21.8329 12.9167C21.8329 11.7667 22.5788 10.8333 23.4996 10.8333C24.4204 10.8333 25.1663 11.7667 25.1663 12.9167Z" fill="#757575"/>
                                                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M14.9023 11.15C14.9285 10.8779 14.9212 10.6037 14.8807 10.3333H17.119C17.0784 10.6037 17.0712 10.8779 17.0973 11.15L17.574 16.15C17.6528 16.9754 18.0363 17.7417 18.6497 18.2995C19.2631 18.8573 20.0624 19.1665 20.8915 19.1667H27.6665C28.5506 19.1667 29.3984 18.8155 30.0235 18.1904C30.6486 17.5652 30.9998 16.7174 30.9998 15.8333V11.6667H31.8332V7.5H20.4165C19.3965 7.5 18.4915 7.955 17.8832 8.66667H14.1165C13.8041 8.30018 13.4157 8.00602 12.9782 7.80457C12.5408 7.60312 12.0648 7.49919 11.5832 7.5H0.166504V11.6667H0.999837V15.8333C0.999837 16.7174 1.35103 17.5652 1.97615 18.1904C2.60127 18.8155 3.44912 19.1667 4.33317 19.1667H11.1082C11.9373 19.1665 12.7365 18.8573 13.35 18.2995C13.9634 17.7417 14.3469 16.9754 14.4257 16.15L14.9023 11.15ZM4.33317 9.16667C3.89114 9.16667 3.46722 9.34227 3.15466 9.65483C2.8421 9.96739 2.6665 10.3913 2.6665 10.8333V15.8333C2.6665 16.2754 2.8421 16.6993 3.15466 17.0118C3.46722 17.3244 3.89114 17.5 4.33317 17.5H11.1082C11.5226 17.4998 11.9222 17.3452 12.2288 17.0663C12.5354 16.7874 12.7271 16.4043 12.7665 15.9917L13.2432 10.9917C13.2652 10.7604 13.2387 10.5271 13.1653 10.3067C13.0919 10.0863 12.9733 9.88372 12.817 9.71188C12.6607 9.54004 12.4702 9.40277 12.2577 9.30888C12.0452 9.21499 11.8155 9.16655 11.5832 9.16667H4.33317ZM18.7565 10.9917C18.7344 10.7604 18.761 10.5271 18.8343 10.3067C18.9077 10.0863 19.0264 9.88372 19.1827 9.71188C19.339 9.54004 19.5295 9.40277 19.742 9.30888C19.9545 9.21499 20.1842 9.16655 20.4165 9.16667H27.6665C28.1085 9.16667 28.5325 9.34227 28.845 9.65483C29.1576 9.96739 29.3332 10.3913 29.3332 10.8333V15.8333C29.3332 16.2754 29.1576 16.6993 28.845 17.0118C28.5325 17.3244 28.1085 17.5 27.6665 17.5H20.8915C20.477 17.4998 20.0775 17.3452 19.7709 17.0663C19.4642 16.7874 19.2725 16.4043 19.2332 15.9917L18.7565 10.9917Z" fill="#757575"/>
                                                                    <path d="M20.458 22.8641C20.5606 22.8258 20.6545 22.7677 20.7346 22.6931C20.8147 22.6184 20.8793 22.5288 20.9247 22.4292C20.9701 22.3296 20.9955 22.222 20.9994 22.1126C21.0032 22.0032 20.9855 21.8942 20.9472 21.7916C20.9089 21.6891 20.8508 21.5951 20.7761 21.515C20.7015 21.4349 20.6118 21.3703 20.5122 21.3249C20.4126 21.2795 20.3051 21.2541 20.1957 21.2503C20.0863 21.2464 19.9772 21.2641 19.8747 21.3025C18.158 21.9425 16.9355 22.2575 15.8105 22.2708C14.7047 22.285 13.6205 22.0083 12.1897 21.33C11.9899 21.2354 11.7607 21.224 11.5525 21.2984C11.3444 21.3728 11.1743 21.5268 11.0797 21.7266C10.9851 21.9264 10.9737 22.1556 11.0481 22.3638C11.1225 22.5719 11.2765 22.742 11.4763 22.8366C13.0513 23.5825 14.3922 23.955 15.8313 23.9375C17.2505 23.92 18.6913 23.5225 20.4572 22.8641H20.458Z" fill="#757575"/>
                                                                </svg>
                                                            )}
                                                        />
                                                        <Typography variant='menuitem' color='G2.main' pl="15px">
                                                        {product.products[0].general_attributes.find(a => a.title === 'Shape')?(product.products[0].general_attributes.find(a => a.title === 'Shape').value):""}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            }
                                        </Hidden>
                                        
                                        <Hidden mdUp>
                                            {window.innerWidth>750?
                                                <Grid xs={12} mt={2} pt={1} display='flex' flexWrap='wrap' sx={{border: '1px solid #E0E0E0' , borderRadius:'10px'}}>
                                                    <Grid xs={6} p={1} display="flex" alignItems="center">
                                                            
                                                        <SvgIcon
                                                                                    
                                                            titleAccess="title"
                                                            component={(componentProps) => (
                                                                <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M17.5 4.375C16.85 3.88751 16.0771 3.59065 15.2679 3.51768C14.4587 3.44471 13.6452 3.59853 12.9184 3.96188C12.1917 4.32524 11.5806 4.88378 11.1534 5.57493C10.7263 6.26607 10.5 7.06251 10.5 7.875V10.5H8.75C8.28587 10.5 7.84075 10.6844 7.51256 11.0126C7.18437 11.3408 7 11.7859 7 12.25V26.25C7 27.6424 7.55312 28.9777 8.53769 29.9623C9.52226 30.9469 10.8576 31.5 12.25 31.5H20.1775L18.4642 29.75H12.25C11.3217 29.75 10.4315 29.3813 9.77513 28.7249C9.11875 28.0685 8.75 27.1783 8.75 26.25V12.25H19.25V15.841C19.5436 15.7804 19.8427 15.7499 20.1425 15.75H21V12.25H26.25V15.8848C26.8905 16.0475 27.4907 16.3538 28 16.7843V12.25C28 11.7859 27.8156 11.3408 27.4874 11.0126C27.1592 10.6844 26.7141 10.5 26.25 10.5H24.5V7.875C24.5 7.06251 24.2737 6.26607 23.8466 5.57493C23.4194 4.88378 22.8083 4.32524 22.0816 3.96188C21.3548 3.59853 20.5413 3.44471 19.7321 3.51768C18.9229 3.59065 18.15 3.88751 17.5 4.375ZM12.25 7.875C12.25 7.17881 12.5266 6.51113 13.0188 6.01885C13.5111 5.52656 14.1788 5.25 14.875 5.25C15.5712 5.25 16.2389 5.52656 16.7312 6.01885C17.2234 6.51113 17.5 7.17881 17.5 7.875V10.5H12.25V7.875ZM18.6672 5.691C19.0626 5.42701 19.5222 5.27533 19.997 5.25215C20.4718 5.22897 20.944 5.33516 21.3632 5.55939C21.7823 5.78362 22.1328 6.11746 22.377 6.52529C22.6213 6.93312 22.7502 7.39963 22.75 7.875V10.5H19.25V7.875C19.25 7.0805 19.0382 6.335 18.6672 5.691ZM18.256 27.0358C17.7716 26.5411 17.5003 25.8765 17.5 25.1843V20.1443C17.4998 19.7971 17.5679 19.4533 17.7006 19.1325C17.8333 18.8117 18.0279 18.5202 18.2734 18.2746C18.5188 18.029 18.8101 17.8342 19.1309 17.7013C19.4516 17.5684 19.7953 17.5 20.1425 17.5H25.1702C25.8755 17.5 26.551 17.7818 27.0462 18.2823L32.4835 23.7773C32.7303 24.0264 32.9251 24.3222 33.0567 24.6473C33.1882 24.9724 33.2539 25.3204 33.2498 25.6712C33.2457 26.0219 33.172 26.3682 33.033 26.6902C32.8939 27.0122 32.6923 27.3034 32.4397 27.5468L27.2825 32.5115C26.7811 32.9947 26.1091 33.2601 25.4128 33.2499C24.7166 33.2398 24.0526 32.9548 23.5655 32.4573L18.256 27.0358ZM21 22.3125C21 22.6606 21.1383 22.9944 21.3844 23.2406C21.6306 23.4867 21.9644 23.625 22.3125 23.625C22.6606 23.625 22.9944 23.4867 23.2406 23.2406C23.4867 22.9944 23.625 22.6606 23.625 22.3125C23.625 21.9644 23.4867 21.6306 23.2406 21.3844C22.9944 21.1383 22.6606 21 22.3125 21C21.9644 21 21.6306 21.1383 21.3844 21.3844C21.1383 21.6306 21 21.9644 21 22.3125Z" fill="#757575"/>
                                                                </svg>
                                                            )}
                                                        />
                                                        <Typography variant='menuitem' color='G2.main' pl="24px" pt="2px">{product.products[0].general_attributes.find(a => a.title === 'Brand')?product.products[0].general_attributes.find(a => a.title === 'Brand').value:""}</Typography>
                                                    </Grid>
                                                    <Grid xs={6} p={1}display="flex" alignItems="center" >
                                                        <SvgIcon
                                                                                    
                                                            titleAccess="title"
                                                            
                                                            component={(componentProps) => (
                                                                <svg width="47" height="18" viewBox="0 0 47 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M11.75 2.94284C13.3081 2.94284 14.8025 3.56181 15.9043 4.66358C17.006 5.76536 17.625 7.25969 17.625 8.81784C17.625 10.376 17.006 11.8703 15.9043 12.9721C14.8025 14.0739 13.3081 14.6928 11.75 14.6928C10.1919 14.6928 8.69752 14.0739 7.59575 12.9721C6.49397 11.8703 5.875 10.376 5.875 8.81784C5.875 7.25969 6.49397 5.76536 7.59575 4.66358C8.69752 3.56181 10.1919 2.94284 11.75 2.94284ZM19.4609 4.54965C18.5765 2.94945 17.2163 1.66396 15.5687 0.871288C13.9211 0.0786185 12.0678 -0.181977 10.2655 0.125611C8.46324 0.433199 6.80125 1.29374 5.50984 2.588C4.21843 3.88225 3.36156 5.54613 3.05794 7.34909H1.46875C1.07921 7.34909 0.705631 7.50383 0.430187 7.77927C0.154743 8.05472 0 8.4283 0 8.81784C0 9.20737 0.154743 9.58096 0.430187 9.8564C0.705631 10.1318 1.07921 10.2866 1.46875 10.2866H3.05794C3.42246 12.4689 4.59458 14.4343 6.34143 15.7923C8.08827 17.1502 10.282 17.8014 12.4869 17.6164C14.6917 17.4314 16.7463 16.4237 18.2424 14.7937C19.7385 13.1636 20.5667 11.0304 20.5625 8.81784C20.5625 8.03876 20.872 7.2916 21.4229 6.74071C21.9738 6.18982 22.7209 5.88034 23.5 5.88034C24.2791 5.88034 25.0262 6.18982 25.5771 6.74071C26.128 7.2916 26.4375 8.03876 26.4375 8.81784C26.4333 11.0304 27.2615 13.1636 28.7576 14.7937C30.2537 16.4237 32.3083 17.4314 34.5131 17.6164C36.718 17.8014 38.9117 17.1502 40.6586 15.7923C42.4054 14.4343 43.5775 12.4689 43.9421 10.2866H45.5312C45.9208 10.2866 46.2944 10.1318 46.5698 9.8564C46.8453 9.58096 47 9.20737 47 8.81784C47 8.4283 46.8453 8.05472 46.5698 7.77927C46.2944 7.50383 45.9208 7.34909 45.5312 7.34909H43.9421C43.6384 5.54613 42.7816 3.88225 41.4902 2.588C40.1988 1.29374 38.5368 0.433199 36.7345 0.125611C34.9322 -0.181977 33.0789 0.0786185 31.4313 0.871288C29.7837 1.66396 28.4235 2.94945 27.5391 4.54965C26.4488 3.51553 25.0027 2.94023 23.5 2.94284C21.9373 2.94284 20.5155 3.55384 19.4609 4.54965ZM41.125 8.81784C41.125 10.376 40.506 11.8703 39.4043 12.9721C38.3025 14.0739 36.8081 14.6928 35.25 14.6928C33.6919 14.6928 32.1975 14.0739 31.0957 12.9721C29.994 11.8703 29.375 10.376 29.375 8.81784C29.375 7.25969 29.994 5.76536 31.0957 4.66358C32.1975 3.56181 33.6919 2.94284 35.25 2.94284C36.8081 2.94284 38.3025 3.56181 39.4043 4.66358C40.506 5.76536 41.125 7.25969 41.125 8.81784Z" fill="#757575"/>
                                                                </svg>

                                                            )}
                                                        />
                                                        <Typography variant='menuitem' color='G2.main' pl="7px">{product.products[0].general_attributes.find(a => a.title === 'Type')?(product.products[0].general_attributes.find(a => a.title === 'Type').value):""}</Typography>
                                                    </Grid>
                                                    <Grid xs={6} p={1} pl="8.5px" display="flex" alignItems="center">
                                                        <SvgIcon
                                                                                    
                                                            titleAccess="title"
                                                            component={(componentProps) => (
                                                                <svg width="40" height="26" viewBox="0 0 40 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M29.2464 0C27.9499 0 26.7496 0.542109 25.8274 1.50434C24.9053 2.46649 24.3052 3.83871 24.3052 5.36731C24.3052 6.8959 24.9053 8.26784 25.8274 9.22999C26.7495 10.1923 27.9499 10.7344 29.2464 10.7344C30.5428 10.7344 31.7431 10.1923 32.6654 9.23006C33.5875 8.26791 34.1878 6.8959 34.1878 5.36731C34.1878 3.83871 33.5875 2.46656 32.6654 1.50434C31.7431 0.542109 30.5428 0 29.2464 0ZM7.68389 6.75C6.78437 6.75 5.94343 7.12406 5.28147 7.81488C4.6195 8.50556 4.17998 9.50273 4.17998 10.6172C4.17998 11.7316 4.6195 12.7288 5.28147 13.4195C5.94343 14.1103 6.78437 14.4844 7.68389 14.4844C8.5834 14.4844 9.42452 14.1103 10.0865 13.4195C10.7485 12.7288 11.1876 11.7316 11.1876 10.6172C11.1876 9.50273 10.7485 8.50556 10.0865 7.81488C9.42452 7.12406 8.5834 6.75 7.68389 6.75ZM24.6468 10.1021C24.5003 10.1908 24.3583 10.284 24.2212 10.3815C22.9889 11.2621 22.0815 12.5648 21.3885 14.1923C20.0777 17.2695 19.5553 21.456 18.6875 25.7344H39.8053C38.9374 21.456 38.4149 17.2695 37.1042 14.1923C36.4112 12.5648 35.5039 11.2621 34.2716 10.3815C34.1346 10.2839 33.9926 10.1907 33.846 10.1021C32.6924 11.2477 31.0661 12.0001 29.2465 12.0001C27.4269 12.0001 25.8005 11.2477 24.6469 10.1021H24.6468ZM4.20424 14.39C4.15276 14.4241 4.10155 14.4588 4.05132 14.4946C3.1634 15.1291 2.49568 16.0805 1.98222 17.286C1.02988 19.522 0.630524 22.5837 0 25.7344H15.3676C14.7372 22.5837 14.3378 19.522 13.3855 17.286C12.8721 16.0805 12.2045 15.1291 11.3165 14.4946C11.2664 14.459 11.2154 14.4241 11.1636 14.39C10.2761 15.2102 9.05149 15.75 7.68389 15.75C6.31629 15.75 5.09172 15.2101 4.20424 14.39Z" fill="#757575"/>
                                                                </svg>

                                                            )}
                                                        />
                                                        <Typography variant='menuitem' color='G2.main' pl="18px" pt="3px">{product.products[0].general_attributes.find(a => a.title === ( 'Age Range'))?(product.products[0].general_attributes.find(a => a.title === 'Age Range').value):""}</Typography>
                                                       
                                                    </Grid>
                                                    <Grid xs={6} p={1} pl="14px" display="flex" alignItems="center">
                                                        <SvgIcon
                                                                                    
                                                            titleAccess="title"
                                                            component={(componentProps) => (
                                                                <svg width="32" height="30" viewBox="0 0 32 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M27.9929 20.8333C25.8288 25.2733 21.2713 28.3333 15.9996 28.3333C10.7279 28.3333 6.17044 25.2733 4.0071 20.8333H2.17627C4.45127 26.22 9.7846 30 15.9996 30C22.2146 30 27.5471 26.22 29.8229 20.8333H27.9929ZM6.3171 5.83333C8.7471 3.26667 12.1863 1.66667 15.9996 1.66667C19.8129 1.66667 23.2521 3.26667 25.6821 5.83333H27.8738C25.1304 2.285 20.8321 0 15.9996 0C11.1671 0 6.86877 2.285 4.12544 5.83333H6.3171ZM8.4996 15C9.42044 15 10.1663 14.0667 10.1663 12.9167C10.1663 11.7667 9.42044 10.8333 8.4996 10.8333C7.57877 10.8333 6.83294 11.7667 6.83294 12.9167C6.83294 14.0667 7.57877 15 8.4996 15ZM25.1663 12.9167C25.1663 14.0667 24.4204 15 23.4996 15C22.5788 15 21.8329 14.0667 21.8329 12.9167C21.8329 11.7667 22.5788 10.8333 23.4996 10.8333C24.4204 10.8333 25.1663 11.7667 25.1663 12.9167Z" fill="#757575"/>
                                                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M14.9023 11.15C14.9285 10.8779 14.9212 10.6037 14.8807 10.3333H17.119C17.0784 10.6037 17.0712 10.8779 17.0973 11.15L17.574 16.15C17.6528 16.9754 18.0363 17.7417 18.6497 18.2995C19.2631 18.8573 20.0624 19.1665 20.8915 19.1667H27.6665C28.5506 19.1667 29.3984 18.8155 30.0235 18.1904C30.6486 17.5652 30.9998 16.7174 30.9998 15.8333V11.6667H31.8332V7.5H20.4165C19.3965 7.5 18.4915 7.955 17.8832 8.66667H14.1165C13.8041 8.30018 13.4157 8.00602 12.9782 7.80457C12.5408 7.60312 12.0648 7.49919 11.5832 7.5H0.166504V11.6667H0.999837V15.8333C0.999837 16.7174 1.35103 17.5652 1.97615 18.1904C2.60127 18.8155 3.44912 19.1667 4.33317 19.1667H11.1082C11.9373 19.1665 12.7365 18.8573 13.35 18.2995C13.9634 17.7417 14.3469 16.9754 14.4257 16.15L14.9023 11.15ZM4.33317 9.16667C3.89114 9.16667 3.46722 9.34227 3.15466 9.65483C2.8421 9.96739 2.6665 10.3913 2.6665 10.8333V15.8333C2.6665 16.2754 2.8421 16.6993 3.15466 17.0118C3.46722 17.3244 3.89114 17.5 4.33317 17.5H11.1082C11.5226 17.4998 11.9222 17.3452 12.2288 17.0663C12.5354 16.7874 12.7271 16.4043 12.7665 15.9917L13.2432 10.9917C13.2652 10.7604 13.2387 10.5271 13.1653 10.3067C13.0919 10.0863 12.9733 9.88372 12.817 9.71188C12.6607 9.54004 12.4702 9.40277 12.2577 9.30888C12.0452 9.21499 11.8155 9.16655 11.5832 9.16667H4.33317ZM18.7565 10.9917C18.7344 10.7604 18.761 10.5271 18.8343 10.3067C18.9077 10.0863 19.0264 9.88372 19.1827 9.71188C19.339 9.54004 19.5295 9.40277 19.742 9.30888C19.9545 9.21499 20.1842 9.16655 20.4165 9.16667H27.6665C28.1085 9.16667 28.5325 9.34227 28.845 9.65483C29.1576 9.96739 29.3332 10.3913 29.3332 10.8333V15.8333C29.3332 16.2754 29.1576 16.6993 28.845 17.0118C28.5325 17.3244 28.1085 17.5 27.6665 17.5H20.8915C20.477 17.4998 20.0775 17.3452 19.7709 17.0663C19.4642 16.7874 19.2725 16.4043 19.2332 15.9917L18.7565 10.9917Z" fill="#757575"/>
                                                                    <path d="M20.458 22.8641C20.5606 22.8258 20.6545 22.7677 20.7346 22.6931C20.8147 22.6184 20.8793 22.5288 20.9247 22.4292C20.9701 22.3296 20.9955 22.222 20.9994 22.1126C21.0032 22.0032 20.9855 21.8942 20.9472 21.7916C20.9089 21.6891 20.8508 21.5951 20.7761 21.515C20.7015 21.4349 20.6118 21.3703 20.5122 21.3249C20.4126 21.2795 20.3051 21.2541 20.1957 21.2503C20.0863 21.2464 19.9772 21.2641 19.8747 21.3025C18.158 21.9425 16.9355 22.2575 15.8105 22.2708C14.7047 22.285 13.6205 22.0083 12.1897 21.33C11.9899 21.2354 11.7607 21.224 11.5525 21.2984C11.3444 21.3728 11.1743 21.5268 11.0797 21.7266C10.9851 21.9264 10.9737 22.1556 11.0481 22.3638C11.1225 22.5719 11.2765 22.742 11.4763 22.8366C13.0513 23.5825 14.3922 23.955 15.8313 23.9375C17.2505 23.92 18.6913 23.5225 20.4572 22.8641H20.458Z" fill="#757575"/>
                                                                </svg>
                                                            )}
                                                        />
                                                        <Typography variant='menuitem' color='G2.main' pl="15px">
                                                        {product.products[0].general_attributes.find(a => a.title === 'Shape')?(product.products[0].general_attributes.find(a => a.title === 'Shape').value):""}
                                                        </Typography>
                                                        
                                                    </Grid>
                                                </Grid>
                                            :
                                                <Grid xs={12} mt={2} pt={1} pl="16px" display='flex' flexWrap='wrap' sx={{border: '1px solid #E0E0E0' , borderRadius:'10px'}}>
                                                    <Grid xs={12} p="8px" pl="12px" display="flex" alignItems="center">
                                                            
                                                        <SvgIcon
                                                                                    
                                                            titleAccess="title"
                                                            component={(componentProps) => (
                                                                <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M17.5 4.375C16.85 3.88751 16.0771 3.59065 15.2679 3.51768C14.4587 3.44471 13.6452 3.59853 12.9184 3.96188C12.1917 4.32524 11.5806 4.88378 11.1534 5.57493C10.7263 6.26607 10.5 7.06251 10.5 7.875V10.5H8.75C8.28587 10.5 7.84075 10.6844 7.51256 11.0126C7.18437 11.3408 7 11.7859 7 12.25V26.25C7 27.6424 7.55312 28.9777 8.53769 29.9623C9.52226 30.9469 10.8576 31.5 12.25 31.5H20.1775L18.4642 29.75H12.25C11.3217 29.75 10.4315 29.3813 9.77513 28.7249C9.11875 28.0685 8.75 27.1783 8.75 26.25V12.25H19.25V15.841C19.5436 15.7804 19.8427 15.7499 20.1425 15.75H21V12.25H26.25V15.8848C26.8905 16.0475 27.4907 16.3538 28 16.7843V12.25C28 11.7859 27.8156 11.3408 27.4874 11.0126C27.1592 10.6844 26.7141 10.5 26.25 10.5H24.5V7.875C24.5 7.06251 24.2737 6.26607 23.8466 5.57493C23.4194 4.88378 22.8083 4.32524 22.0816 3.96188C21.3548 3.59853 20.5413 3.44471 19.7321 3.51768C18.9229 3.59065 18.15 3.88751 17.5 4.375ZM12.25 7.875C12.25 7.17881 12.5266 6.51113 13.0188 6.01885C13.5111 5.52656 14.1788 5.25 14.875 5.25C15.5712 5.25 16.2389 5.52656 16.7312 6.01885C17.2234 6.51113 17.5 7.17881 17.5 7.875V10.5H12.25V7.875ZM18.6672 5.691C19.0626 5.42701 19.5222 5.27533 19.997 5.25215C20.4718 5.22897 20.944 5.33516 21.3632 5.55939C21.7823 5.78362 22.1328 6.11746 22.377 6.52529C22.6213 6.93312 22.7502 7.39963 22.75 7.875V10.5H19.25V7.875C19.25 7.0805 19.0382 6.335 18.6672 5.691ZM18.256 27.0358C17.7716 26.5411 17.5003 25.8765 17.5 25.1843V20.1443C17.4998 19.7971 17.5679 19.4533 17.7006 19.1325C17.8333 18.8117 18.0279 18.5202 18.2734 18.2746C18.5188 18.029 18.8101 17.8342 19.1309 17.7013C19.4516 17.5684 19.7953 17.5 20.1425 17.5H25.1702C25.8755 17.5 26.551 17.7818 27.0462 18.2823L32.4835 23.7773C32.7303 24.0264 32.9251 24.3222 33.0567 24.6473C33.1882 24.9724 33.2539 25.3204 33.2498 25.6712C33.2457 26.0219 33.172 26.3682 33.033 26.6902C32.8939 27.0122 32.6923 27.3034 32.4397 27.5468L27.2825 32.5115C26.7811 32.9947 26.1091 33.2601 25.4128 33.2499C24.7166 33.2398 24.0526 32.9548 23.5655 32.4573L18.256 27.0358ZM21 22.3125C21 22.6606 21.1383 22.9944 21.3844 23.2406C21.6306 23.4867 21.9644 23.625 22.3125 23.625C22.6606 23.625 22.9944 23.4867 23.2406 23.2406C23.4867 22.9944 23.625 22.6606 23.625 22.3125C23.625 21.9644 23.4867 21.6306 23.2406 21.3844C22.9944 21.1383 22.6606 21 22.3125 21C21.9644 21 21.6306 21.1383 21.3844 21.3844C21.1383 21.6306 21 21.9644 21 22.3125Z" fill="#757575"/>
                                                                </svg>
                                                            )}
                                                        />
                                                        {window.innerWidth>400?
                                                            <Typography variant='menuitem' color='G2.main' pt="2px" pl="32px">{product.products[0].general_attributes.find(a => a.title === 'Brand')?(product.products[0].general_attributes.find(a => a.title === 'Brand').value):""}</Typography>
                                                        :
                                                            <Typography variant='menuitem' color='G2.main' pt="2px" pl="32px">{product.products[0].general_attributes.find(a => a.title === 'Brand')?(product.products[0].general_attributes.find(a => a.title === 'Brand').value.length>8?truncate(product.products[0].general_attributes.find(a => a.title === 'Brand').value
                                                            ,11):product.products[0].general_attributes.find(a => a.title === 'Brand').value):""}</Typography>
                                                        }
                                                    </Grid>
                                                    <Grid xs={12} display="flex" alignItems="center">
                                                        <Grid xs={window.innerWidth>640? 1.5:window.innerWidth>600?1.8:2}></Grid>
                                                        <Grid xs={9}><Divider /></Grid>
                                                        <Grid xs={1.5}></Grid>
                                                    </Grid>
                                                    <Grid xs={12} p="8px" display="flex" alignItems="center" >
                                                        <SvgIcon
                                                                                    
                                                            titleAccess="title"
                                                            component={(componentProps) => (
                                                                <svg width="47" height="18" viewBox="0 0 47 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M11.75 2.94284C13.3081 2.94284 14.8025 3.56181 15.9043 4.66358C17.006 5.76536 17.625 7.25969 17.625 8.81784C17.625 10.376 17.006 11.8703 15.9043 12.9721C14.8025 14.0739 13.3081 14.6928 11.75 14.6928C10.1919 14.6928 8.69752 14.0739 7.59575 12.9721C6.49397 11.8703 5.875 10.376 5.875 8.81784C5.875 7.25969 6.49397 5.76536 7.59575 4.66358C8.69752 3.56181 10.1919 2.94284 11.75 2.94284ZM19.4609 4.54965C18.5765 2.94945 17.2163 1.66396 15.5687 0.871288C13.9211 0.0786185 12.0678 -0.181977 10.2655 0.125611C8.46324 0.433199 6.80125 1.29374 5.50984 2.588C4.21843 3.88225 3.36156 5.54613 3.05794 7.34909H1.46875C1.07921 7.34909 0.705631 7.50383 0.430187 7.77927C0.154743 8.05472 0 8.4283 0 8.81784C0 9.20737 0.154743 9.58096 0.430187 9.8564C0.705631 10.1318 1.07921 10.2866 1.46875 10.2866H3.05794C3.42246 12.4689 4.59458 14.4343 6.34143 15.7923C8.08827 17.1502 10.282 17.8014 12.4869 17.6164C14.6917 17.4314 16.7463 16.4237 18.2424 14.7937C19.7385 13.1636 20.5667 11.0304 20.5625 8.81784C20.5625 8.03876 20.872 7.2916 21.4229 6.74071C21.9738 6.18982 22.7209 5.88034 23.5 5.88034C24.2791 5.88034 25.0262 6.18982 25.5771 6.74071C26.128 7.2916 26.4375 8.03876 26.4375 8.81784C26.4333 11.0304 27.2615 13.1636 28.7576 14.7937C30.2537 16.4237 32.3083 17.4314 34.5131 17.6164C36.718 17.8014 38.9117 17.1502 40.6586 15.7923C42.4054 14.4343 43.5775 12.4689 43.9421 10.2866H45.5312C45.9208 10.2866 46.2944 10.1318 46.5698 9.8564C46.8453 9.58096 47 9.20737 47 8.81784C47 8.4283 46.8453 8.05472 46.5698 7.77927C46.2944 7.50383 45.9208 7.34909 45.5312 7.34909H43.9421C43.6384 5.54613 42.7816 3.88225 41.4902 2.588C40.1988 1.29374 38.5368 0.433199 36.7345 0.125611C34.9322 -0.181977 33.0789 0.0786185 31.4313 0.871288C29.7837 1.66396 28.4235 2.94945 27.5391 4.54965C26.4488 3.51553 25.0027 2.94023 23.5 2.94284C21.9373 2.94284 20.5155 3.55384 19.4609 4.54965ZM41.125 8.81784C41.125 10.376 40.506 11.8703 39.4043 12.9721C38.3025 14.0739 36.8081 14.6928 35.25 14.6928C33.6919 14.6928 32.1975 14.0739 31.0957 12.9721C29.994 11.8703 29.375 10.376 29.375 8.81784C29.375 7.25969 29.994 5.76536 31.0957 4.66358C32.1975 3.56181 33.6919 2.94284 35.25 2.94284C36.8081 2.94284 38.3025 3.56181 39.4043 4.66358C40.506 5.76536 41.125 7.25969 41.125 8.81784Z" fill="#757575"/>
                                                                </svg>

                                                            )}
                                                        />
                                                        {window.innerWidth>400?
                                                            <Typography variant='menuitem' color='G2.main' pl="25px">{product.products[0].general_attributes.find(a => a.title === 'Type')?(product.products[0].general_attributes.find(a => a.title === 'Type').value):""}</Typography>
                                                        :
                                                            <Typography variant='menuitem' color='G2.main' pl="25px">{product.products[0].general_attributes.find(a => a.title === 'Type')?(product.products[0].general_attributes.find(a => a.title === 'Type').value.length>8?truncate(product.products[0].general_attributes.find(a => a.title === 'Type').value
                                                            ,11):product.products[0].general_attributes.find(a => a.title === 'Type').value):""}</Typography>
                                                        }
                                                    </Grid>
                                                    <Grid xs={12} display="flex" alignItems="center">
                                                        <Grid xs={window.innerWidth>640? 1.5:window.innerWidth>600?1.8:2}></Grid>
                                                        <Grid xs={9}><Divider /></Grid>
                                                        <Grid xs={1.5}></Grid>
                                                    </Grid>
                                                    <Grid xs={12} p="8px" pl="10px" display="flex" alignItems="center">
                                                        <SvgIcon
                                                                                    
                                                            titleAccess="title"
                                                            component={(componentProps) => (
                                                                <svg width="40" height="26" viewBox="0 0 40 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M29.2464 0C27.9499 0 26.7496 0.542109 25.8274 1.50434C24.9053 2.46649 24.3052 3.83871 24.3052 5.36731C24.3052 6.8959 24.9053 8.26784 25.8274 9.22999C26.7495 10.1923 27.9499 10.7344 29.2464 10.7344C30.5428 10.7344 31.7431 10.1923 32.6654 9.23006C33.5875 8.26791 34.1878 6.8959 34.1878 5.36731C34.1878 3.83871 33.5875 2.46656 32.6654 1.50434C31.7431 0.542109 30.5428 0 29.2464 0ZM7.68389 6.75C6.78437 6.75 5.94343 7.12406 5.28147 7.81488C4.6195 8.50556 4.17998 9.50273 4.17998 10.6172C4.17998 11.7316 4.6195 12.7288 5.28147 13.4195C5.94343 14.1103 6.78437 14.4844 7.68389 14.4844C8.5834 14.4844 9.42452 14.1103 10.0865 13.4195C10.7485 12.7288 11.1876 11.7316 11.1876 10.6172C11.1876 9.50273 10.7485 8.50556 10.0865 7.81488C9.42452 7.12406 8.5834 6.75 7.68389 6.75ZM24.6468 10.1021C24.5003 10.1908 24.3583 10.284 24.2212 10.3815C22.9889 11.2621 22.0815 12.5648 21.3885 14.1923C20.0777 17.2695 19.5553 21.456 18.6875 25.7344H39.8053C38.9374 21.456 38.4149 17.2695 37.1042 14.1923C36.4112 12.5648 35.5039 11.2621 34.2716 10.3815C34.1346 10.2839 33.9926 10.1907 33.846 10.1021C32.6924 11.2477 31.0661 12.0001 29.2465 12.0001C27.4269 12.0001 25.8005 11.2477 24.6469 10.1021H24.6468ZM4.20424 14.39C4.15276 14.4241 4.10155 14.4588 4.05132 14.4946C3.1634 15.1291 2.49568 16.0805 1.98222 17.286C1.02988 19.522 0.630524 22.5837 0 25.7344H15.3676C14.7372 22.5837 14.3378 19.522 13.3855 17.286C12.8721 16.0805 12.2045 15.1291 11.3165 14.4946C11.2664 14.459 11.2154 14.4241 11.1636 14.39C10.2761 15.2102 9.05149 15.75 7.68389 15.75C6.31629 15.75 5.09172 15.2101 4.20424 14.39Z" fill="#757575"/>
                                                                </svg>

                                                            )}
                                                        />
                                                        {window.innerWidth>400?
                                                            <Typography variant='menuitem' color='G2.main' pl="31px" pt="3px">{product.products[0].general_attributes.find(a => a.title === ( 'Age Range'))?(product.products[0].general_attributes.find(a => a.title === 'Age Range').value):""}</Typography>
                                                        :
                                                            <Typography variant='menuitem' color='G2.main' pl="31px" pt="3px">{product.products[0].general_attributes.find(a => a.title === ( 'Age Range'))?(product.products[0].general_attributes.find(a => a.title === 'Age Range').value.length>8?truncate(product.products[0].general_attributes.find(a => a.title === 'Age Range').value
                                                            ,11):product.products[0].general_attributes.find(a => a.title === 'Age Range').value):""}</Typography>
                                                        }
                                                    </Grid>
                                                    <Grid xs={12} display="flex" alignItems="center">
                                                        <Grid xs={window.innerWidth>640? 1.5:window.innerWidth>600?1.8:2}></Grid>
                                                        <Grid xs={9}><Divider /></Grid>
                                                        <Grid xs={1.5}></Grid>
                                                    </Grid>
                                                    <Grid xs={12} p="8px" pl="16px" display="flex" alignItems="center">
                                                        <SvgIcon
                                                                                    
                                                            titleAccess="title"
                                                            component={(componentProps) => (
                                                                <svg width="32" height="30" viewBox="0 0 32 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M27.9929 20.8333C25.8288 25.2733 21.2713 28.3333 15.9996 28.3333C10.7279 28.3333 6.17044 25.2733 4.0071 20.8333H2.17627C4.45127 26.22 9.7846 30 15.9996 30C22.2146 30 27.5471 26.22 29.8229 20.8333H27.9929ZM6.3171 5.83333C8.7471 3.26667 12.1863 1.66667 15.9996 1.66667C19.8129 1.66667 23.2521 3.26667 25.6821 5.83333H27.8738C25.1304 2.285 20.8321 0 15.9996 0C11.1671 0 6.86877 2.285 4.12544 5.83333H6.3171ZM8.4996 15C9.42044 15 10.1663 14.0667 10.1663 12.9167C10.1663 11.7667 9.42044 10.8333 8.4996 10.8333C7.57877 10.8333 6.83294 11.7667 6.83294 12.9167C6.83294 14.0667 7.57877 15 8.4996 15ZM25.1663 12.9167C25.1663 14.0667 24.4204 15 23.4996 15C22.5788 15 21.8329 14.0667 21.8329 12.9167C21.8329 11.7667 22.5788 10.8333 23.4996 10.8333C24.4204 10.8333 25.1663 11.7667 25.1663 12.9167Z" fill="#757575"/>
                                                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M14.9023 11.15C14.9285 10.8779 14.9212 10.6037 14.8807 10.3333H17.119C17.0784 10.6037 17.0712 10.8779 17.0973 11.15L17.574 16.15C17.6528 16.9754 18.0363 17.7417 18.6497 18.2995C19.2631 18.8573 20.0624 19.1665 20.8915 19.1667H27.6665C28.5506 19.1667 29.3984 18.8155 30.0235 18.1904C30.6486 17.5652 30.9998 16.7174 30.9998 15.8333V11.6667H31.8332V7.5H20.4165C19.3965 7.5 18.4915 7.955 17.8832 8.66667H14.1165C13.8041 8.30018 13.4157 8.00602 12.9782 7.80457C12.5408 7.60312 12.0648 7.49919 11.5832 7.5H0.166504V11.6667H0.999837V15.8333C0.999837 16.7174 1.35103 17.5652 1.97615 18.1904C2.60127 18.8155 3.44912 19.1667 4.33317 19.1667H11.1082C11.9373 19.1665 12.7365 18.8573 13.35 18.2995C13.9634 17.7417 14.3469 16.9754 14.4257 16.15L14.9023 11.15ZM4.33317 9.16667C3.89114 9.16667 3.46722 9.34227 3.15466 9.65483C2.8421 9.96739 2.6665 10.3913 2.6665 10.8333V15.8333C2.6665 16.2754 2.8421 16.6993 3.15466 17.0118C3.46722 17.3244 3.89114 17.5 4.33317 17.5H11.1082C11.5226 17.4998 11.9222 17.3452 12.2288 17.0663C12.5354 16.7874 12.7271 16.4043 12.7665 15.9917L13.2432 10.9917C13.2652 10.7604 13.2387 10.5271 13.1653 10.3067C13.0919 10.0863 12.9733 9.88372 12.817 9.71188C12.6607 9.54004 12.4702 9.40277 12.2577 9.30888C12.0452 9.21499 11.8155 9.16655 11.5832 9.16667H4.33317ZM18.7565 10.9917C18.7344 10.7604 18.761 10.5271 18.8343 10.3067C18.9077 10.0863 19.0264 9.88372 19.1827 9.71188C19.339 9.54004 19.5295 9.40277 19.742 9.30888C19.9545 9.21499 20.1842 9.16655 20.4165 9.16667H27.6665C28.1085 9.16667 28.5325 9.34227 28.845 9.65483C29.1576 9.96739 29.3332 10.3913 29.3332 10.8333V15.8333C29.3332 16.2754 29.1576 16.6993 28.845 17.0118C28.5325 17.3244 28.1085 17.5 27.6665 17.5H20.8915C20.477 17.4998 20.0775 17.3452 19.7709 17.0663C19.4642 16.7874 19.2725 16.4043 19.2332 15.9917L18.7565 10.9917Z" fill="#757575"/>
                                                                    <path d="M20.458 22.8641C20.5606 22.8258 20.6545 22.7677 20.7346 22.6931C20.8147 22.6184 20.8793 22.5288 20.9247 22.4292C20.9701 22.3296 20.9955 22.222 20.9994 22.1126C21.0032 22.0032 20.9855 21.8942 20.9472 21.7916C20.9089 21.6891 20.8508 21.5951 20.7761 21.515C20.7015 21.4349 20.6118 21.3703 20.5122 21.3249C20.4126 21.2795 20.3051 21.2541 20.1957 21.2503C20.0863 21.2464 19.9772 21.2641 19.8747 21.3025C18.158 21.9425 16.9355 22.2575 15.8105 22.2708C14.7047 22.285 13.6205 22.0083 12.1897 21.33C11.9899 21.2354 11.7607 21.224 11.5525 21.2984C11.3444 21.3728 11.1743 21.5268 11.0797 21.7266C10.9851 21.9264 10.9737 22.1556 11.0481 22.3638C11.1225 22.5719 11.2765 22.742 11.4763 22.8366C13.0513 23.5825 14.3922 23.955 15.8313 23.9375C17.2505 23.92 18.6913 23.5225 20.4572 22.8641H20.458Z" fill="#757575"/>
                                                                </svg>
                                                            )}
                                                        />
                                                        {window.innerWidth>400?
                                                            <Typography variant='menuitem' color='G2.main' pl="33px">{
                                                                (product.products[0].general_attributes.find(a => a.title === 'Shape')?(product.products[0].general_attributes.find(a => a.title === 'Shape').value):"")
                                                            }</Typography>
                                                            :
                                                            <Typography variant='menuitem' color='G2.main' pl="33px">{
                                                                    (product.products[0].general_attributes.find(a => a.title === 'Shape')?(product.products[0].general_attributes.find(a => a.title === 'Shape').value.length>11?truncate(product.products[0].general_attributes.find(a => a.title === 'Shape').value
                                                                    ,11):product.products[0].general_attributes.find(a => a.title === 'Shape').value):"")
                                                            }</Typography>
                                                        }
                                                    </Grid>
                                                </Grid>
                                            }
                                        </Hidden>
                                        

                                        <Grid xs={12} display='flex' justifyContent='start' mt={4} alignItems='center' backgroundColor='GrayLight2.main' p={1} pl={window.innerWidth>750?3:"35px"} borderRadius='10px'>
                                            <Typography variant={window.innerWidth>350? 'h30':'h32'} color='G1.main'>{category === 'sunglasses' ? 'Front Material' : 'Material'}:</Typography>
                                            {window.innerWidth>400?
                                                <Typography variant='h30' pl={0.5} color='G2.main'>{product.products[0].general_attributes.find(a => a.title === (category === 'sunglasses' ? 'Front Material' : 'Material'))?.value}</Typography>
                                            :
                                                <Typography variant={window.innerWidth>350? 'h30':'h32'} pl={0.5} color='G2.main'>{product.products[0].general_attributes.find(a => a.title === (category === 'sunglasses' ? 'Front Material' : 'Material'))?
                                                (product.products[0].general_attributes.find(a => a.title === (category === 'sunglasses' ? 'Front Material' : 'Material')).value.length>8?truncate(product.products[0].general_attributes.find(a => a.title === (category === 'sunglasses' ? 'Front Material' : 'Material')).value,11):product.products[0].general_attributes.find(a => a.title === (category === 'sunglasses' ? 'Front Material' : 'Material')).value):''}</Typography>
                                            }

                                        </Grid>
                                        <Grid xs={12} display='flex' justifyContent='start' mt={0.4} alignItems='center' backgroundColor='GrayLight2.main' p={1} pl={window.innerWidth>750?3:"35px"} borderRadius='10px'>
                                            <Typography variant={window.innerWidth>350? 'h30':'h32'} color='G1.main'>{category === 'sunglasses' ? 'Lens Material' : 'Diameter'}:</Typography>
                                            {window.innerWidth>400?
                                                <Typography variant='h30' pl={0.5} color='G2.main'>{product.products[0].general_attributes.find(a => a.title === (category === 'sunglasses' ? 'Lens Material' : 'Diameter'))?.value}</Typography>
                                            :
                                            <Typography variant={window.innerWidth>350? 'h30':'h32'} pl={0.5} color='G2.main'>{product.products[0].general_attributes.find(a => a.title === (category === 'sunglasses' ? 'Lens Material' : 'Diameter'))?
                                            (product.products[0].general_attributes.find(a => a.title === (category === 'sunglasses' ? 'Lens Material' : 'Diameter')).value.length>8?truncate(product.products[0].general_attributes.find(a => a.title === (category === 'sunglasses' ? 'Lens Material' : 'Diameter')).value,11):product.products[0].general_attributes.find(a => a.title === (category === 'sunglasses' ? 'Lens Material' : 'Diameter')).value):''}</Typography>
                                            }
                                        </Grid>
                                        <Grid xs={12} display='flex' justifyContent='start' mt={0.4} alignItems='center' backgroundColor='GrayLight2.main' p={1} pl={window.innerWidth>750?3:"35px"} borderRadius='10px'>
                                            <Typography variant={window.innerWidth>350? 'h30':'h32'} color='G1.main'>{category === 'sunglasses' ?'Temple Material:' :'Base Curve:'}</Typography>
                                            {window.innerWidth>400?
                                            <Typography variant='h30' pl={0.5} color='G2.main'>{product.products[0].general_attributes.find(a => a.title === (category === 'sunglasses' ? 'Temple Material' : 'Base Curve'))?.value}</Typography>
                                            :
                                            <Typography variant={window.innerWidth>350? 'h30':'h32'} pl={0.5} color='G2.main'>{product.products[0].general_attributes.find(a => a.title === (category === 'sunglasses' ? 'Temple Material' : 'Base Curve'))?
                                            (product.products[0].general_attributes.find(a => a.title === (category === 'sunglasses' ? 'Temple Material' : 'Base Curve')).value.length>8?truncate(product.products[0].general_attributes.find(a => a.title === (category === 'sunglasses' ? 'Temple Material' : 'Base Curve')).value,11):product.products[0].general_attributes.find(a => a.title === (category === 'sunglasses' ? 'Temple Material' : 'Base Curve')).value):''}</Typography>
                                            }
                                        </Grid>
                                    </Grid>
                                    }
                                </Grid>
                            :
                            
                                <Grid md={window.innerWidth>1450?5:window.innerWidth>1035?6:12}  xs={12} pt="10px">
                                    {product && product.products !== undefined &&
                                    <Grid xs={12}  display='flex' flexWrap='wrap'>
                                        <Grid xs={12} display='flex' justifyContent='start' alignItems='center' ml={window.innerWidth>750?0:"-11px"}>
                                            <IconButton onClick={favorite ? deleteFromWishList : addToWishList}>
                                                {favorite ? <FavoriteIcon sx={{ color: 'P.main' }} /> :
                                                    <FavoriteIcon sx={{ color: 'G3.main' }} />}
                                            </IconButton>

                                            <Typography ml="22px" variant={window.innerWidth>450?'h12':window.innerWidth>390?"h17":window.innerWidth>297?"h16":"h15"} fontWeight='700'>{product.name != undefined ? product.name.charAt(0).toUpperCase() + product.name.slice(1) : ''}</Typography>
                                        </Grid>

                                        {window.innerWidth>1035?
                                            <>
                                                <Grid xs={12} mt="16px" pt="8px" pl="0.2px" display='flex' flexWrap='wrap' >
                                                    <Grid xs={6} p="8px" display="flex" alignItems="center" pl={0} pb={0}>
                                                        <SvgIcon
                                                                                    
                                                            titleAccess="title"
                                                            component={(componentProps) => (
                                                                <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M17.5 4.375C16.85 3.88751 16.0771 3.59065 15.2679 3.51768C14.4587 3.44471 13.6452 3.59853 12.9184 3.96188C12.1917 4.32524 11.5806 4.88378 11.1534 5.57493C10.7263 6.26607 10.5 7.06251 10.5 7.875V10.5H8.75C8.28587 10.5 7.84075 10.6844 7.51256 11.0126C7.18437 11.3408 7 11.7859 7 12.25V26.25C7 27.6424 7.55312 28.9777 8.53769 29.9623C9.52226 30.9469 10.8576 31.5 12.25 31.5H20.1775L18.4642 29.75H12.25C11.3217 29.75 10.4315 29.3813 9.77513 28.7249C9.11875 28.0685 8.75 27.1783 8.75 26.25V12.25H19.25V15.841C19.5436 15.7804 19.8427 15.7499 20.1425 15.75H21V12.25H26.25V15.8848C26.8905 16.0475 27.4907 16.3538 28 16.7843V12.25C28 11.7859 27.8156 11.3408 27.4874 11.0126C27.1592 10.6844 26.7141 10.5 26.25 10.5H24.5V7.875C24.5 7.06251 24.2737 6.26607 23.8466 5.57493C23.4194 4.88378 22.8083 4.32524 22.0816 3.96188C21.3548 3.59853 20.5413 3.44471 19.7321 3.51768C18.9229 3.59065 18.15 3.88751 17.5 4.375ZM12.25 7.875C12.25 7.17881 12.5266 6.51113 13.0188 6.01885C13.5111 5.52656 14.1788 5.25 14.875 5.25C15.5712 5.25 16.2389 5.52656 16.7312 6.01885C17.2234 6.51113 17.5 7.17881 17.5 7.875V10.5H12.25V7.875ZM18.6672 5.691C19.0626 5.42701 19.5222 5.27533 19.997 5.25215C20.4718 5.22897 20.944 5.33516 21.3632 5.55939C21.7823 5.78362 22.1328 6.11746 22.377 6.52529C22.6213 6.93312 22.7502 7.39963 22.75 7.875V10.5H19.25V7.875C19.25 7.0805 19.0382 6.335 18.6672 5.691ZM18.256 27.0358C17.7716 26.5411 17.5003 25.8765 17.5 25.1843V20.1443C17.4998 19.7971 17.5679 19.4533 17.7006 19.1325C17.8333 18.8117 18.0279 18.5202 18.2734 18.2746C18.5188 18.029 18.8101 17.8342 19.1309 17.7013C19.4516 17.5684 19.7953 17.5 20.1425 17.5H25.1702C25.8755 17.5 26.551 17.7818 27.0462 18.2823L32.4835 23.7773C32.7303 24.0264 32.9251 24.3222 33.0567 24.6473C33.1882 24.9724 33.2539 25.3204 33.2498 25.6712C33.2457 26.0219 33.172 26.3682 33.033 26.6902C32.8939 27.0122 32.6923 27.3034 32.4397 27.5468L27.2825 32.5115C26.7811 32.9947 26.1091 33.2601 25.4128 33.2499C24.7166 33.2398 24.0526 32.9548 23.5655 32.4573L18.256 27.0358ZM21 22.3125C21 22.6606 21.1383 22.9944 21.3844 23.2406C21.6306 23.4867 21.9644 23.625 22.3125 23.625C22.6606 23.625 22.9944 23.4867 23.2406 23.2406C23.4867 22.9944 23.625 22.6606 23.625 22.3125C23.625 21.9644 23.4867 21.6306 23.2406 21.3844C22.9944 21.1383 22.6606 21 22.3125 21C21.9644 21 21.6306 21.1383 21.3844 21.3844C21.1383 21.6306 21 21.9644 21 22.3125Z" fill="#757575"/>
                                                                </svg>
                                                            )}
                                                        />
                                                        {window.innerWidth>1135?
                                                            <Typography variant='menuitem' color='G2.main' pl="24px" pt="4px">{product.products[0].general_attributes.find(a => a.title === 'Brand')?(product.products[0].general_attributes.find(a => a.title === 'Brand').value):""}</Typography>
                                                        :
                                                            <Typography variant='menuitem' color='G2.main' pl="24px" pt="4px">{product.products[0].general_attributes.find(a => a.title === 'Brand')?(product.products[0].general_attributes.find(a => a.title === 'Brand').value.length>8?truncate(product.products[0].general_attributes.find(a => a.title === 'Brand').value
                                                            ,11):product.products[0].general_attributes.find(a => a.title === 'Brand').value):""}</Typography>
                                                        }

                                                    </Grid>
                                                    <Grid xs={6} pr="8px" pb={0} pt="11px" pl="28px"  display="flex" alignItems="center" >
                                                        <SvgIcon
                                                                                    
                                                            titleAccess="title"
                                                            component={(componentProps) => (
                                                                <svg width="31" height="29" viewBox="0 0 31 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M30.4865 4.52819C30.3342 4.45182 30.1644 4.41699 29.9944 4.42719C29.8243 4.4374 29.6599 4.49228 29.5178 4.58631L20.3437 10.7282V5.39038C20.344 5.20613 20.2918 5.02563 20.1931 4.87003C20.0945 4.71443 19.9535 4.5902 19.7867 4.51189C19.6199 4.43359 19.4343 4.40447 19.2515 4.42795C19.0688 4.45142 18.8966 4.52652 18.755 4.64444L11.1212 10.951H7.74999V1.86413C7.75547 1.64019 7.68316 1.42128 7.54539 1.24465C7.40762 1.06802 7.2129 0.944593 6.99437 0.895378L3.11937 0.0235044C2.9764 -0.00857638 2.82802 -0.0078078 2.68539 0.0257521C2.54276 0.0593121 2.4096 0.124789 2.29594 0.217254C2.17963 0.311469 2.08674 0.431352 2.02455 0.567497C1.96236 0.703642 1.93256 0.852346 1.9375 1.00194V10.951H0.968749C0.711821 10.951 0.465416 11.0531 0.28374 11.2347C0.102064 11.4164 0 11.6628 0 11.9197V27.4197C0 27.6767 0.102064 27.9231 0.28374 28.1047C0.465416 28.2864 0.711821 28.3885 0.968749 28.3885H30.0312C30.2882 28.3885 30.5346 28.2864 30.7162 28.1047C30.8979 27.9231 31 27.6767 31 27.4197V5.39038C31.0013 5.21348 30.9541 5.03961 30.8636 4.88762C30.7731 4.73563 30.6427 4.61133 30.4865 4.52819ZM3.875 2.23225L5.8125 2.6585V10.951H3.875V2.23225ZM29.0625 26.451H1.9375V12.8885H11.4603C11.6867 12.8889 11.906 12.8101 12.0803 12.6657L18.4062 7.43444V12.5494C18.406 12.7254 18.4536 12.8982 18.5442 13.0491C18.6347 13.2 18.7646 13.3235 18.92 13.4061C19.0753 13.4888 19.2503 13.5276 19.426 13.5183C19.6018 13.509 19.7717 13.452 19.9175 13.3535L29.0625 7.21162V26.451Z" fill="#757575"/>
                                                                    <path d="M3.875 14.8164L11.625 12.8789V14.8164L3.875 16.7539V14.8164ZM3.875 18.6914H11.625V20.6289H3.875V18.6914ZM3.875 22.5664H11.625V24.5039H3.875V22.5664ZM16.4687 15.7852H18.4062V18.6914H16.4687V15.7852ZM16.4687 21.5976H18.4062V24.5039H16.4687V21.5976ZM20.3437 15.7852H22.2812V18.6914H20.3437V15.7852ZM20.3437 21.5976H22.2812V24.5039H20.3437V21.5976ZM24.2187 15.7852H26.1562V18.6914H24.2187V15.7852ZM24.2187 21.5976H26.1562V24.5039H24.2187V21.5976Z" fill="#757575"/>
                                                                </svg>

                                                            )}
                                                        />
                                                        <Typography variant='menuitem' color='G2.main' pl="30px" pt="2px">{product.products[0].general_attributes.find(a => a.title === 'Manufacturer')?(product.products[0].general_attributes.find(a => a.title === 'Manufacturer').value.length>11?truncate(product.products[0].general_attributes.find(a => a.title === 'Manufacturer').value
                                                        ,7):product.products[0].general_attributes.find(a => a.title === 'Manufacturer').value):""}</Typography>
                                                        

                                                    </Grid>
                                                    <Grid xs={12} height="4px"></Grid>
                                                    <Grid xs={6} pt="18px" display="flex" alignItems="center" pl="10px">
                                                        <SvgIcon
                                                                                    
                                                            titleAccess="title"
                                                            component={(componentProps) => (
                                                                <svg width="17" height="28" viewBox="0 0 17 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M0 0H17V8.4L11.3333 14L17 19.6V28H0V19.6L5.66667 14L0 8.4V0ZM14.1667 20.3L8.5 14.7L2.83333 20.3V25.2H14.1667V20.3ZM8.5 13.3L14.1667 7.7V2.8H2.83333V7.7L8.5 13.3ZM5.66667 5.6H11.3333V6.65L8.5 9.45L5.66667 6.65V5.6Z" fill="#757575"/>
                                                                </svg>

                                                            )}
                                                        />
                                                        {window.innerWidth>1135?
                                                            <Typography variant='menuitem' color='G2.main' pl="33px" >{product.products[0].general_attributes.find(a => a.title === ( 'Duration'))?(product.products[0].general_attributes.find(a => a.title === 'Duration').value):""}</Typography>
                                                        :
                                                            <Typography variant='menuitem' color='G2.main' pl="33px" >{product.products[0].general_attributes.find(a => a.title === ( 'Duration'))?(product.products[0].general_attributes.find(a => a.title === 'Duration').value.length>8?truncate(product.products[0].general_attributes.find(a => a.title === 'Duration').value
                                                            ,11):product.products[0].general_attributes.find(a => a.title === 'Duration').value):""}</Typography>
                                                        }

                                                    </Grid>
                                                    <Grid xs={6} pr="8px" pt="21px" pl="31.21px" display="flex" alignItems="center">
                                                        <SvgIcon
                                                                                    
                                                            titleAccess="title"
                                                            component={(componentProps) => (
                                                            <svg width="25" height="28" viewBox="0 0 25 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M24.7476 7.02704H24.7356C24.563 6.73022 24.319 6.48269 24.0264 6.30762L13.4495 0.247407C13.1608 0.0851353 12.8361 0 12.506 0C12.1759 0 11.8513 0.0851353 11.5625 0.247407L0.985656 6.28323C0.687006 6.45441 0.438229 6.70259 0.264505 7.00265C0.264505 7.00425 0.264194 7.00584 0.26359 7.00732C0.262986 7.0088 0.262101 7.01014 0.260985 7.01127C0.259869 7.01241 0.258544 7.0133 0.257086 7.01392C0.255628 7.01453 0.254065 7.01484 0.252486 7.01484V7.03923C0.0842091 7.32689 -0.00309086 7.65585 8.3587e-05 7.99033V20.0132C0.000691287 20.3608 0.0922536 20.702 0.265413 21.0019C0.438573 21.3018 0.687121 21.5498 0.985656 21.7203L11.5625 27.7561C11.8288 27.9035 12.1249 27.9869 12.4279 28H12.5962C12.8951 27.9851 13.1869 27.9017 13.4495 27.7561L24.0264 21.7203C24.3219 21.5472 24.5674 21.2984 24.7382 20.9988C24.9091 20.6992 24.9994 20.3593 25 20.0132V7.99033C25.0017 7.65218 24.9146 7.31967 24.7476 7.02704ZM12.5 1.95451L22.0913 7.41723L18.4014 9.53892L8.71399 4.11277L12.5 1.95451ZM12.6082 12.88L2.93276 7.41723L6.74284 5.24678L16.4423 10.6729L12.6082 12.88ZM1.92315 9.07556L11.6467 14.5749L11.5505 25.5125L1.92315 20.0132V9.07556ZM13.4736 25.5003L13.5697 14.5749L17.4279 12.3434V16.9892C17.4279 17.2479 17.5292 17.496 17.7095 17.679C17.8898 17.8619 18.1344 17.9647 18.3894 17.9647C18.6444 17.9647 18.889 17.8619 19.0693 17.679C19.2497 17.496 19.351 17.2479 19.351 16.9892V11.2338L23.0769 9.08775V20.0132L13.4736 25.5003Z" fill="#757575"/>
                                                            </svg>
                                                            )}
                                                        />
                                                        {window.innerWidth>1135?
                                                            <Typography variant='menuitem' color='G2.main' pl="35px" pb="1px">{
                                                                (product.products[0].general_attributes.find(a => a.title === 'Packaging')?(product.products[0].general_attributes.find(a => a.title === 'Packaging').value.split('contains')[1]):"")}</Typography>
                                                        :
                                                            <Typography variant='menuitem' color='G2.main' pl="35px" pb="1px">{ (product.products[0].general_attributes.find(a => a.title === 'Packaging')?(product.products[0].general_attributes.find(a => a.title === 'Packaging').value.split('contains')[1].length>10?truncate(product.products[0].general_attributes.find(a => a.title === 'Packaging').value.split('contains')[1]
                                                                ,11):product.products[0].general_attributes.find(a => a.title === 'Packaging').value.split('contains')[1]):"")}</Typography>
                                                        }
                                                    </Grid>
                                                </Grid>
                                            </>
                                        : window.innerWidth>750?
                                            <Grid xs={12} mt={2} pt={1} display='flex' flexWrap='wrap' sx={{border: '1px solid #E0E0E0' , borderRadius:'10px'}}>
                                                <Grid xs={6} p={1} display="flex" alignItems='center'>
                                                    <SvgIcon
                                                                                
                                                        titleAccess="title"
                                                        component={(componentProps) => (
                                                            <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M17.5 4.375C16.85 3.88751 16.0771 3.59065 15.2679 3.51768C14.4587 3.44471 13.6452 3.59853 12.9184 3.96188C12.1917 4.32524 11.5806 4.88378 11.1534 5.57493C10.7263 6.26607 10.5 7.06251 10.5 7.875V10.5H8.75C8.28587 10.5 7.84075 10.6844 7.51256 11.0126C7.18437 11.3408 7 11.7859 7 12.25V26.25C7 27.6424 7.55312 28.9777 8.53769 29.9623C9.52226 30.9469 10.8576 31.5 12.25 31.5H20.1775L18.4642 29.75H12.25C11.3217 29.75 10.4315 29.3813 9.77513 28.7249C9.11875 28.0685 8.75 27.1783 8.75 26.25V12.25H19.25V15.841C19.5436 15.7804 19.8427 15.7499 20.1425 15.75H21V12.25H26.25V15.8848C26.8905 16.0475 27.4907 16.3538 28 16.7843V12.25C28 11.7859 27.8156 11.3408 27.4874 11.0126C27.1592 10.6844 26.7141 10.5 26.25 10.5H24.5V7.875C24.5 7.06251 24.2737 6.26607 23.8466 5.57493C23.4194 4.88378 22.8083 4.32524 22.0816 3.96188C21.3548 3.59853 20.5413 3.44471 19.7321 3.51768C18.9229 3.59065 18.15 3.88751 17.5 4.375ZM12.25 7.875C12.25 7.17881 12.5266 6.51113 13.0188 6.01885C13.5111 5.52656 14.1788 5.25 14.875 5.25C15.5712 5.25 16.2389 5.52656 16.7312 6.01885C17.2234 6.51113 17.5 7.17881 17.5 7.875V10.5H12.25V7.875ZM18.6672 5.691C19.0626 5.42701 19.5222 5.27533 19.997 5.25215C20.4718 5.22897 20.944 5.33516 21.3632 5.55939C21.7823 5.78362 22.1328 6.11746 22.377 6.52529C22.6213 6.93312 22.7502 7.39963 22.75 7.875V10.5H19.25V7.875C19.25 7.0805 19.0382 6.335 18.6672 5.691ZM18.256 27.0358C17.7716 26.5411 17.5003 25.8765 17.5 25.1843V20.1443C17.4998 19.7971 17.5679 19.4533 17.7006 19.1325C17.8333 18.8117 18.0279 18.5202 18.2734 18.2746C18.5188 18.029 18.8101 17.8342 19.1309 17.7013C19.4516 17.5684 19.7953 17.5 20.1425 17.5H25.1702C25.8755 17.5 26.551 17.7818 27.0462 18.2823L32.4835 23.7773C32.7303 24.0264 32.9251 24.3222 33.0567 24.6473C33.1882 24.9724 33.2539 25.3204 33.2498 25.6712C33.2457 26.0219 33.172 26.3682 33.033 26.6902C32.8939 27.0122 32.6923 27.3034 32.4397 27.5468L27.2825 32.5115C26.7811 32.9947 26.1091 33.2601 25.4128 33.2499C24.7166 33.2398 24.0526 32.9548 23.5655 32.4573L18.256 27.0358ZM21 22.3125C21 22.6606 21.1383 22.9944 21.3844 23.2406C21.6306 23.4867 21.9644 23.625 22.3125 23.625C22.6606 23.625 22.9944 23.4867 23.2406 23.2406C23.4867 22.9944 23.625 22.6606 23.625 22.3125C23.625 21.9644 23.4867 21.6306 23.2406 21.3844C22.9944 21.1383 22.6606 21 22.3125 21C21.9644 21 21.6306 21.1383 21.3844 21.3844C21.1383 21.6306 21 21.9644 21 22.3125Z" fill="#757575"/>
                                                            </svg>
                                                        )}
                                                    />
                                                    <Typography variant='menuitem' color='G2.main' pt="4px" pl="9px">{product.products[0].general_attributes.find(a => a.title === 'Brand')?(product.products[0].general_attributes.find(a => a.title === 'Brand').value):""}</Typography>
                                                </Grid>
                                                <Grid xs={6} p={1} display="flex" alignItems='center'>
                                                    <SvgIcon
                                                                                
                                                        titleAccess="title"
                                                        component={(componentProps) => (
                                                            <svg width="31" height="29" viewBox="0 0 31 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M30.4865 4.52819C30.3342 4.45182 30.1644 4.41699 29.9944 4.42719C29.8243 4.4374 29.6599 4.49228 29.5178 4.58631L20.3437 10.7282V5.39038C20.344 5.20613 20.2918 5.02563 20.1931 4.87003C20.0945 4.71443 19.9535 4.5902 19.7867 4.51189C19.6199 4.43359 19.4343 4.40447 19.2515 4.42795C19.0688 4.45142 18.8966 4.52652 18.755 4.64444L11.1212 10.951H7.74999V1.86413C7.75547 1.64019 7.68316 1.42128 7.54539 1.24465C7.40762 1.06802 7.2129 0.944593 6.99437 0.895378L3.11937 0.0235044C2.9764 -0.00857638 2.82802 -0.0078078 2.68539 0.0257521C2.54276 0.0593121 2.4096 0.124789 2.29594 0.217254C2.17963 0.311469 2.08674 0.431352 2.02455 0.567497C1.96236 0.703642 1.93256 0.852346 1.9375 1.00194V10.951H0.968749C0.711821 10.951 0.465416 11.0531 0.28374 11.2347C0.102064 11.4164 0 11.6628 0 11.9197V27.4197C0 27.6767 0.102064 27.9231 0.28374 28.1047C0.465416 28.2864 0.711821 28.3885 0.968749 28.3885H30.0312C30.2882 28.3885 30.5346 28.2864 30.7162 28.1047C30.8979 27.9231 31 27.6767 31 27.4197V5.39038C31.0013 5.21348 30.9541 5.03961 30.8636 4.88762C30.7731 4.73563 30.6427 4.61133 30.4865 4.52819ZM3.875 2.23225L5.8125 2.6585V10.951H3.875V2.23225ZM29.0625 26.451H1.9375V12.8885H11.4603C11.6867 12.8889 11.906 12.8101 12.0803 12.6657L18.4062 7.43444V12.5494C18.406 12.7254 18.4536 12.8982 18.5442 13.0491C18.6347 13.2 18.7646 13.3235 18.92 13.4061C19.0753 13.4888 19.2503 13.5276 19.426 13.5183C19.6018 13.509 19.7717 13.452 19.9175 13.3535L29.0625 7.21162V26.451Z" fill="#757575"/>
                                                                <path d="M3.875 14.8164L11.625 12.8789V14.8164L3.875 16.7539V14.8164ZM3.875 18.6914H11.625V20.6289H3.875V18.6914ZM3.875 22.5664H11.625V24.5039H3.875V22.5664ZM16.4687 15.7852H18.4062V18.6914H16.4687V15.7852ZM16.4687 21.5976H18.4062V24.5039H16.4687V21.5976ZM20.3437 15.7852H22.2812V18.6914H20.3437V15.7852ZM20.3437 21.5976H22.2812V24.5039H20.3437V21.5976ZM24.2187 15.7852H26.1562V18.6914H24.2187V15.7852ZM24.2187 21.5976H26.1562V24.5039H24.2187V21.5976Z" fill="#757575"/>
                                                            </svg>

                                                        )}
                                                    />
                                                    <Typography variant='menuitem' color='G2.main' pt="4px" pl="13px">{product.products[0].general_attributes.find(a => a.title === 'Manufacturer')?(product.products[0].general_attributes.find(a => a.title === 'Manufacturer').value):""}</Typography>
                                                </Grid>
                                                <Grid xs={6} p={1} pl={"17px"} display="flex" alignItems='center'>
                                                    <SvgIcon
                                                                                
                                                        titleAccess="title"
                                                        component={(componentProps) => (
                                                            <svg width="17" height="28" viewBox="0 0 17 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M0 0H17V8.4L11.3333 14L17 19.6V28H0V19.6L5.66667 14L0 8.4V0ZM14.1667 20.3L8.5 14.7L2.83333 20.3V25.2H14.1667V20.3ZM8.5 13.3L14.1667 7.7V2.8H2.83333V7.7L8.5 13.3ZM5.66667 5.6H11.3333V6.65L8.5 9.45L5.66667 6.65V5.6Z" fill="#757575"/>
                                                            </svg>

                                                        )}
                                                    />
                                                    <Typography variant='menuitem' color='G2.main' pl="20px">{product.products[0].general_attributes.find(a => a.title === ( 'Duration'))?(product.products[0].general_attributes.find(a => a.title === 'Duration').value):""}</Typography>
                                                </Grid>
                                                <Grid xs={6} p={1} pl="11.28px" display="flex" alignItems='center'>
                                                    <SvgIcon
                                                                                
                                                        titleAccess="title"
                                                        component={(componentProps) => (
                                                        <svg width="25" height="28" viewBox="0 0 25 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M24.7476 7.02704H24.7356C24.563 6.73022 24.319 6.48269 24.0264 6.30762L13.4495 0.247407C13.1608 0.0851353 12.8361 0 12.506 0C12.1759 0 11.8513 0.0851353 11.5625 0.247407L0.985656 6.28323C0.687006 6.45441 0.438229 6.70259 0.264505 7.00265C0.264505 7.00425 0.264194 7.00584 0.26359 7.00732C0.262986 7.0088 0.262101 7.01014 0.260985 7.01127C0.259869 7.01241 0.258544 7.0133 0.257086 7.01392C0.255628 7.01453 0.254065 7.01484 0.252486 7.01484V7.03923C0.0842091 7.32689 -0.00309086 7.65585 8.3587e-05 7.99033V20.0132C0.000691287 20.3608 0.0922536 20.702 0.265413 21.0019C0.438573 21.3018 0.687121 21.5498 0.985656 21.7203L11.5625 27.7561C11.8288 27.9035 12.1249 27.9869 12.4279 28H12.5962C12.8951 27.9851 13.1869 27.9017 13.4495 27.7561L24.0264 21.7203C24.3219 21.5472 24.5674 21.2984 24.7382 20.9988C24.9091 20.6992 24.9994 20.3593 25 20.0132V7.99033C25.0017 7.65218 24.9146 7.31967 24.7476 7.02704ZM12.5 1.95451L22.0913 7.41723L18.4014 9.53892L8.71399 4.11277L12.5 1.95451ZM12.6082 12.88L2.93276 7.41723L6.74284 5.24678L16.4423 10.6729L12.6082 12.88ZM1.92315 9.07556L11.6467 14.5749L11.5505 25.5125L1.92315 20.0132V9.07556ZM13.4736 25.5003L13.5697 14.5749L17.4279 12.3434V16.9892C17.4279 17.2479 17.5292 17.496 17.7095 17.679C17.8898 17.8619 18.1344 17.9647 18.3894 17.9647C18.6444 17.9647 18.889 17.8619 19.0693 17.679C19.2497 17.496 19.351 17.2479 19.351 16.9892V11.2338L23.0769 9.08775V20.0132L13.4736 25.5003Z" fill="#757575"/>
                                                        </svg>
                                                        )}
                                                    />
                                                    <Typography variant='menuitem' color='G2.main' pl="16.29px">{(product.products[0].general_attributes.find(a => a.title === 'Packaging')?(product.products[0].general_attributes.find(a => a.title === 'Packaging').value.split('contains')[1]):"")}</Typography>
                                                </Grid>
                                            </Grid>
                                        :
                                            <Grid xs={12} mt={2} pt="8px" pl="16px" display='flex' flexWrap='wrap' sx={{border: '1px solid #E0E0E0' , borderRadius:'10px'}}>
                                                <Grid xs={12} p="8px" pl="12px" display="flex" alignItems="center">
                                                    <SvgIcon
                                                                                
                                                        titleAccess="title"
                                                        component={(componentProps) => (
                                                            <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M17.5 4.375C16.85 3.88751 16.0771 3.59065 15.2679 3.51768C14.4587 3.44471 13.6452 3.59853 12.9184 3.96188C12.1917 4.32524 11.5806 4.88378 11.1534 5.57493C10.7263 6.26607 10.5 7.06251 10.5 7.875V10.5H8.75C8.28587 10.5 7.84075 10.6844 7.51256 11.0126C7.18437 11.3408 7 11.7859 7 12.25V26.25C7 27.6424 7.55312 28.9777 8.53769 29.9623C9.52226 30.9469 10.8576 31.5 12.25 31.5H20.1775L18.4642 29.75H12.25C11.3217 29.75 10.4315 29.3813 9.77513 28.7249C9.11875 28.0685 8.75 27.1783 8.75 26.25V12.25H19.25V15.841C19.5436 15.7804 19.8427 15.7499 20.1425 15.75H21V12.25H26.25V15.8848C26.8905 16.0475 27.4907 16.3538 28 16.7843V12.25C28 11.7859 27.8156 11.3408 27.4874 11.0126C27.1592 10.6844 26.7141 10.5 26.25 10.5H24.5V7.875C24.5 7.06251 24.2737 6.26607 23.8466 5.57493C23.4194 4.88378 22.8083 4.32524 22.0816 3.96188C21.3548 3.59853 20.5413 3.44471 19.7321 3.51768C18.9229 3.59065 18.15 3.88751 17.5 4.375ZM12.25 7.875C12.25 7.17881 12.5266 6.51113 13.0188 6.01885C13.5111 5.52656 14.1788 5.25 14.875 5.25C15.5712 5.25 16.2389 5.52656 16.7312 6.01885C17.2234 6.51113 17.5 7.17881 17.5 7.875V10.5H12.25V7.875ZM18.6672 5.691C19.0626 5.42701 19.5222 5.27533 19.997 5.25215C20.4718 5.22897 20.944 5.33516 21.3632 5.55939C21.7823 5.78362 22.1328 6.11746 22.377 6.52529C22.6213 6.93312 22.7502 7.39963 22.75 7.875V10.5H19.25V7.875C19.25 7.0805 19.0382 6.335 18.6672 5.691ZM18.256 27.0358C17.7716 26.5411 17.5003 25.8765 17.5 25.1843V20.1443C17.4998 19.7971 17.5679 19.4533 17.7006 19.1325C17.8333 18.8117 18.0279 18.5202 18.2734 18.2746C18.5188 18.029 18.8101 17.8342 19.1309 17.7013C19.4516 17.5684 19.7953 17.5 20.1425 17.5H25.1702C25.8755 17.5 26.551 17.7818 27.0462 18.2823L32.4835 23.7773C32.7303 24.0264 32.9251 24.3222 33.0567 24.6473C33.1882 24.9724 33.2539 25.3204 33.2498 25.6712C33.2457 26.0219 33.172 26.3682 33.033 26.6902C32.8939 27.0122 32.6923 27.3034 32.4397 27.5468L27.2825 32.5115C26.7811 32.9947 26.1091 33.2601 25.4128 33.2499C24.7166 33.2398 24.0526 32.9548 23.5655 32.4573L18.256 27.0358ZM21 22.3125C21 22.6606 21.1383 22.9944 21.3844 23.2406C21.6306 23.4867 21.9644 23.625 22.3125 23.625C22.6606 23.625 22.9944 23.4867 23.2406 23.2406C23.4867 22.9944 23.625 22.6606 23.625 22.3125C23.625 21.9644 23.4867 21.6306 23.2406 21.3844C22.9944 21.1383 22.6606 21 22.3125 21C21.9644 21 21.6306 21.1383 21.3844 21.3844C21.1383 21.6306 21 21.9644 21 22.3125Z" fill="#757575"/>
                                                            </svg>
                                                        )}
                                                    />
                                                    {window.innerWidth>400?
                                                        <Typography variant='menuitem' color='G2.main' pt="4px" pl="32px">{product.products[0].general_attributes.find(a => a.title === 'Brand')?(product.products[0].general_attributes.find(a => a.title === 'Brand').value):""}</Typography>
                                                    :
                                                        <Typography variant='menuitem' color='G2.main' pt="4px" pl="32px">{product.products[0].general_attributes.find(a => a.title === 'Brand')?(product.products[0].general_attributes.find(a => a.title === 'Brand').value.length>8?truncate(product.products[0].general_attributes.find(a => a.title === 'Brand').value
                                                        ,11):product.products[0].general_attributes.find(a => a.title === 'Brand').value):""}</Typography>
                                                    }
                                                </Grid>
                                                <Grid xs={12} display="flex" alignItems="center">
                                                    <Grid xs={window.innerWidth>640? 1.5:window.innerWidth>600?1.8:2}></Grid>
                                                    <Grid xs={9}><Divider /></Grid>
                                                    <Grid xs={1.5}></Grid>
                                                </Grid>
                                                <Grid xs={12} p="8px" pl="15px" display="flex" alignItems="center" >
                                                    <SvgIcon
                                                                                
                                                        titleAccess="title"
                                                        component={(componentProps) => (
                                                            <svg width="31" height="29" viewBox="0 0 31 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M30.4865 4.52819C30.3342 4.45182 30.1644 4.41699 29.9944 4.42719C29.8243 4.4374 29.6599 4.49228 29.5178 4.58631L20.3437 10.7282V5.39038C20.344 5.20613 20.2918 5.02563 20.1931 4.87003C20.0945 4.71443 19.9535 4.5902 19.7867 4.51189C19.6199 4.43359 19.4343 4.40447 19.2515 4.42795C19.0688 4.45142 18.8966 4.52652 18.755 4.64444L11.1212 10.951H7.74999V1.86413C7.75547 1.64019 7.68316 1.42128 7.54539 1.24465C7.40762 1.06802 7.2129 0.944593 6.99437 0.895378L3.11937 0.0235044C2.9764 -0.00857638 2.82802 -0.0078078 2.68539 0.0257521C2.54276 0.0593121 2.4096 0.124789 2.29594 0.217254C2.17963 0.311469 2.08674 0.431352 2.02455 0.567497C1.96236 0.703642 1.93256 0.852346 1.9375 1.00194V10.951H0.968749C0.711821 10.951 0.465416 11.0531 0.28374 11.2347C0.102064 11.4164 0 11.6628 0 11.9197V27.4197C0 27.6767 0.102064 27.9231 0.28374 28.1047C0.465416 28.2864 0.711821 28.3885 0.968749 28.3885H30.0312C30.2882 28.3885 30.5346 28.2864 30.7162 28.1047C30.8979 27.9231 31 27.6767 31 27.4197V5.39038C31.0013 5.21348 30.9541 5.03961 30.8636 4.88762C30.7731 4.73563 30.6427 4.61133 30.4865 4.52819ZM3.875 2.23225L5.8125 2.6585V10.951H3.875V2.23225ZM29.0625 26.451H1.9375V12.8885H11.4603C11.6867 12.8889 11.906 12.8101 12.0803 12.6657L18.4062 7.43444V12.5494C18.406 12.7254 18.4536 12.8982 18.5442 13.0491C18.6347 13.2 18.7646 13.3235 18.92 13.4061C19.0753 13.4888 19.2503 13.5276 19.426 13.5183C19.6018 13.509 19.7717 13.452 19.9175 13.3535L29.0625 7.21162V26.451Z" fill="#757575"/>
                                                                <path d="M3.875 14.8164L11.625 12.8789V14.8164L3.875 16.7539V14.8164ZM3.875 18.6914H11.625V20.6289H3.875V18.6914ZM3.875 22.5664H11.625V24.5039H3.875V22.5664ZM16.4687 15.7852H18.4062V18.6914H16.4687V15.7852ZM16.4687 21.5976H18.4062V24.5039H16.4687V21.5976ZM20.3437 15.7852H22.2812V18.6914H20.3437V15.7852ZM20.3437 21.5976H22.2812V24.5039H20.3437V21.5976ZM24.2187 15.7852H26.1562V18.6914H24.2187V15.7852ZM24.2187 21.5976H26.1562V24.5039H24.2187V21.5976Z" fill="#757575"/>
                                                            </svg>

                                                        )}
                                                    />
                                                    {window.innerWidth>400?
                                                        <Typography variant='menuitem' color='G2.main' pl="33.5px" pt="3px">{product.products[0].general_attributes.find(a => a.title === 'Manufacturer')?(product.products[0].general_attributes.find(a => a.title === 'Manufacturer').value):""}</Typography>
                                                    :
                                                    <Typography variant='menuitem' color='G2.main' pl="33.5px" pt="3px">{product.products[0].general_attributes.find(a => a.title === 'Manufacturer')?(product.products[0].general_attributes.find(a => a.title === 'Manufacturer').value.length>8?truncate(product.products[0].general_attributes.find(a => a.title === 'Manufacturer').value
                                                        ,11):product.products[0].general_attributes.find(a => a.title === 'Manufacturer').value):""}</Typography>
                                                    }   
                                                </Grid>
                                                <Grid xs={12} display="flex" alignItems="center">
                                                    <Grid xs={window.innerWidth>640? 1.5:window.innerWidth>600?1.8:2}></Grid>
                                                    <Grid xs={9}><Divider /></Grid>
                                                    <Grid xs={1.5}></Grid>
                                                </Grid>
                                                <Grid xs={12} p="8px" pl="23px" display="flex" alignItems="center">
                                                    <SvgIcon
                                                                                
                                                        titleAccess="title"
                                                        component={(componentProps) => (
                                                            <svg width="17" height="28" viewBox="0 0 17 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M0 0H17V8.4L11.3333 14L17 19.6V28H0V19.6L5.66667 14L0 8.4V0ZM14.1667 20.3L8.5 14.7L2.83333 20.3V25.2H14.1667V20.3ZM8.5 13.3L14.1667 7.7V2.8H2.83333V7.7L8.5 13.3ZM5.66667 5.6H11.3333V6.65L8.5 9.45L5.66667 6.65V5.6Z" fill="#757575"/>
                                                            </svg>

                                                        )}
                                                    />
                                                    {window.innerWidth>400?
                                                        <Typography variant='menuitem' color='G2.main' pl="39.5px" pt={0}>{product.products[0].general_attributes.find(a => a.title === ( 'Duration'))?(product.products[0].general_attributes.find(a => a.title === 'Duration').value):""}</Typography>
                                                    :
                                                        <Typography variant='menuitem' color='G2.main' pl="39.5px" pt={0}>{product.products[0].general_attributes.find(a => a.title === ( 'Duration'))?(product.products[0].general_attributes.find(a => a.title === 'Duration').value.length>8?truncate(product.products[0].general_attributes.find(a => a.title === 'Duration').value
                                                        ,11):product.products[0].general_attributes.find(a => a.title === 'Duration').value):""}</Typography>
                                                    }
                                                </Grid>
                                                <Grid xs={12} display="flex" alignItems="center">
                                                    <Grid xs={window.innerWidth>640? 1.5:window.innerWidth>600?1.8:2}></Grid>
                                                    <Grid xs={9}><Divider /></Grid>
                                                    <Grid xs={1.5}></Grid>
                                                </Grid>
                                                <Grid xs={12} p="8px" pl="18.5px" display="flex" alignItems="center">
                                                    <SvgIcon
                                                                                
                                                        titleAccess="title"
                                                        component={(componentProps) => (
                                                        <svg width="25" height="28" viewBox="0 0 25 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M24.7476 7.02704H24.7356C24.563 6.73022 24.319 6.48269 24.0264 6.30762L13.4495 0.247407C13.1608 0.0851353 12.8361 0 12.506 0C12.1759 0 11.8513 0.0851353 11.5625 0.247407L0.985656 6.28323C0.687006 6.45441 0.438229 6.70259 0.264505 7.00265C0.264505 7.00425 0.264194 7.00584 0.26359 7.00732C0.262986 7.0088 0.262101 7.01014 0.260985 7.01127C0.259869 7.01241 0.258544 7.0133 0.257086 7.01392C0.255628 7.01453 0.254065 7.01484 0.252486 7.01484V7.03923C0.0842091 7.32689 -0.00309086 7.65585 8.3587e-05 7.99033V20.0132C0.000691287 20.3608 0.0922536 20.702 0.265413 21.0019C0.438573 21.3018 0.687121 21.5498 0.985656 21.7203L11.5625 27.7561C11.8288 27.9035 12.1249 27.9869 12.4279 28H12.5962C12.8951 27.9851 13.1869 27.9017 13.4495 27.7561L24.0264 21.7203C24.3219 21.5472 24.5674 21.2984 24.7382 20.9988C24.9091 20.6992 24.9994 20.3593 25 20.0132V7.99033C25.0017 7.65218 24.9146 7.31967 24.7476 7.02704ZM12.5 1.95451L22.0913 7.41723L18.4014 9.53892L8.71399 4.11277L12.5 1.95451ZM12.6082 12.88L2.93276 7.41723L6.74284 5.24678L16.4423 10.6729L12.6082 12.88ZM1.92315 9.07556L11.6467 14.5749L11.5505 25.5125L1.92315 20.0132V9.07556ZM13.4736 25.5003L13.5697 14.5749L17.4279 12.3434V16.9892C17.4279 17.2479 17.5292 17.496 17.7095 17.679C17.8898 17.8619 18.1344 17.9647 18.3894 17.9647C18.6444 17.9647 18.889 17.8619 19.0693 17.679C19.2497 17.496 19.351 17.2479 19.351 16.9892V11.2338L23.0769 9.08775V20.0132L13.4736 25.5003Z" fill="#757575"/>
                                                        </svg>
                                                        )}
                                                    />
                                                    {window.innerWidth>400?
                                                        <Typography variant='menuitem' color='G2.main' pl="36.5px">{
                                                            (product.products[0].general_attributes.find(a => a.title === 'Packaging')?(product.products[0].general_attributes.find(a => a.title === 'Packaging').value.split('contains')[1]):"")}
                                                        </Typography>
                                                    :
                                                        <Typography variant='menuitem' color='G2.main' pl="36.5px">{
                                                            (product.products[0].general_attributes.find(a => a.title === 'Packaging')?(product.products[0].general_attributes.find(a => a.title === 'Packaging').value.split('contains')[1].length>8?truncate(product.products[0].general_attributes.find(a => a.title === 'Packaging').value.split('contains')[1]
                                                            ,8):product.products[0].general_attributes.find(a => a.title === 'Packaging').value.split('contains')[1]):"")}
                                                        </Typography>
                                                    }
                                                </Grid>
                                            </Grid>

                                        }
                                        

                                        <Grid xs={12} display='flex' justifyContent='start' mt={4} alignItems='center' backgroundColor='GrayLight2.main' p={1} pl={window.innerWidth>750?3:"35px"} borderRadius='10px'>
                                            <Typography variant={window.innerWidth>350? 'h30':'h32'} color='G1.main'>{category === 'sunglasses' ? 'Front Material' : 'Material'}:</Typography>
                                            {window.innerWidth>400?
                                                <Typography variant='h30' pl={0.5} color='G2.main'>{product.products[0].general_attributes.find(a => a.title === (category === 'sunglasses' ? 'Front Material' : 'Material'))?.value}</Typography>
                                            :
                                                <Typography variant={window.innerWidth>350? 'h30':'h32'} pl={0.5} color='G2.main'>{product.products[0].general_attributes.find(a => a.title === (category === 'sunglasses' ? 'Front Material' : 'Material'))?
                                                (product.products[0].general_attributes.find(a => a.title === (category === 'sunglasses' ? 'Front Material' : 'Material')).value.length>8?truncate(product.products[0].general_attributes.find(a => a.title === (category === 'sunglasses' ? 'Front Material' : 'Material')).value,11):product.products[0].general_attributes.find(a => a.title === (category === 'sunglasses' ? 'Front Material' : 'Material')).value):''}</Typography>
                                            }

                                        </Grid>
                                        <Grid xs={12} display='flex' justifyContent='start' mt={0.4} alignItems='center' backgroundColor='GrayLight2.main' p={1} pl={window.innerWidth>750?3:"35px"} borderRadius='10px'>
                                            <Typography variant={window.innerWidth>350? 'h30':'h32'} color='G1.main'>{category === 'sunglasses' ? 'Lens Material' : 'Diameter'}:</Typography>
                                            {window.innerWidth>400?
                                                <Typography variant='h30' pl={0.5} color='G2.main'>{product.products[0].general_attributes.find(a => a.title === (category === 'sunglasses' ? 'Lens Material' : 'Diameter'))?.value}</Typography>
                                            :
                                            <Typography variant={window.innerWidth>350? 'h30':'h32'} pl={0.5} color='G2.main'>{product.products[0].general_attributes.find(a => a.title === (category === 'sunglasses' ? 'Lens Material' : 'Diameter'))?
                                            (product.products[0].general_attributes.find(a => a.title === (category === 'sunglasses' ? 'Lens Material' : 'Diameter')).value.length>8?truncate(product.products[0].general_attributes.find(a => a.title === (category === 'sunglasses' ? 'Lens Material' : 'Diameter')).value,11):product.products[0].general_attributes.find(a => a.title === (category === 'sunglasses' ? 'Lens Material' : 'Diameter')).value):''}</Typography>
                                            }
                                        </Grid>
                                        <Grid xs={12} display='flex' justifyContent='start' mt={0.4} alignItems='center' backgroundColor='GrayLight2.main' p={1} pl={window.innerWidth>750?3:"35px"} borderRadius='10px'>
                                            <Typography variant={window.innerWidth>350? 'h30':'h32'} color='G1.main'>{category === 'sunglasses' ?'Temple Material:' :'Base Curve:'}</Typography>
                                            {window.innerWidth>400?
                                            <Typography variant='h30' pl={0.5} color='G2.main'>{product.products[0].general_attributes.find(a => a.title === (category === 'sunglasses' ? 'Temple Material' : 'Base Curve'))?.value}</Typography>
                                            :
                                            <Typography variant={window.innerWidth>350? 'h30':'h32'} pl={0.5} color='G2.main'>{product.products[0].general_attributes.find(a => a.title === (category === 'sunglasses' ? 'Temple Material' : 'Base Curve'))?
                                            (product.products[0].general_attributes.find(a => a.title === (category === 'sunglasses' ? 'Temple Material' : 'Base Curve')).value.length>8?truncate(product.products[0].general_attributes.find(a => a.title === (category === 'sunglasses' ? 'Temple Material' : 'Base Curve')).value,11):product.products[0].general_attributes.find(a => a.title === (category === 'sunglasses' ? 'Temple Material' : 'Base Curve')).value):''}</Typography>
                                            }
                                        </Grid>
                                    </Grid>
                                    }
                                </Grid>
                            }
                            {category === 'sunglasses'? 
                                <Hidden mdDown>
                                    {window.innerWidth>1035?
                                    <Grid xs={window.innerWidth>899?5:6} md={window.innerWidth>899?5:window.innerWidth>899?6:5} >
                                        <Grid xs={12} display='flex' justifyContent='center' pl={window.innerWidth>1029?0:"10px"}>
                                            <img
                                                src={selectedVariantArray != '' ? axiosConfig.defaults.baseURL + selectedVariantArray[0].file_urls[0].image_url : (variantArray[0] != undefined ? axiosConfig.defaults.baseURL + variantArray[0][0].file_urls[0].image_url : NoProductImage)}
                                                width="400px" height='400px' style={{ objectFit: 'cover' }} />
                                        </Grid>
                                        
                                
                                        


                                    </Grid>
                                    :""}
                                    
                                    
                                </Hidden>
                            :
                                (window.innerWidth>1035?
                                    <Grid xs={window.innerWidth>1004?5:6} >
                                        <Grid xs={12} display='flex' justifyContent='center'>
                                            <img
                                                src={selectedVariantArray != '' ? axiosConfig.defaults.baseURL + selectedVariantArray[0].file_urls[0].image_url : (variantArray[0] != undefined ? axiosConfig.defaults.baseURL + variantArray[0][0].file_urls[0].image_url : NoProductImage)}
                                                width="400px" height='400px' style={{ objectFit: 'cover' }} />
                                        </Grid>
                                    

                                    


                                    </Grid>
                                :
                                ""
                                )
                            }
                            {window.innerWidth<1035?
                                mobileSizeOfMainVariantsImages()
                                :''
                            }
                            </Grid>
                        </Grid>
                        {window.innerWidth>1035?
                        
                            <Grid xs={12} md={12} display='flex' flexWrap='wrap' alignItems='center' >
                                <Grid xs={12} md={6}></Grid>
                                <Grid xs={12} md={6}  pt={{md:0,xs:2}} pr="20px">
                                    <Grid sx={{ width: "100%" , margin:'auto' }} >
                                        {category === 'sunglasses'? 
                                            <Hidden mdDown>
                                                <Grid xs={12} md={12} display='flex' justifyContent='center'   pr="30px">
                                                    <Grid  xs={12} md={12} display="flex" justifyContent='center' alignSelf='center'  pl={0}  alignItems='center' container mt={0}>
                                                        
                                                        {window.innerWidth>1035?((window.innerWidth>899 ||(window.innerWidth<1030&&window.innerWidth>912))?
                                                            <Grid xs={12} md={12} pl="2px"   display='flex' justifyContent='center' bgcolor='white.main' flexWrap='wrap' pt={1} >
                                                                
                                                                <Swiper  initialSlide={activeDot===0?0:activeDot}  slidesPerView='auto'    spaceBetween={65} 
                                                                    
                                                                >
                                                                    {variantArray.map((v,index) => {
                                                                        return(
                                                                            <>
                                                                            <SwiperSlide style={{width:"100%"}} className="mySwiper3"  >
                                                                                <Grid  sx={{ cursor: 'pointer',justifyContent:'center',alignItems:'center',margin: '0 4px' ,pr:"10px",mb:index==0?"2px":0, ml:index!=0?"5px":0}} display='flex' flexDirection='column' onClick={() => {
                                                                                    setSelectedIndex(index);
                                                                                    setSelectedVariantArray(v);
                                                                                    _setSelectedVariantArray(v);
                                                                                    _setSelectedVariantArray_(v);
                                                                                    setSelectedVarientIndex(0)
                                                                                
                                                                                }}>
                                                                                    <img
                                                                                        src={(v[0] != undefined ? axiosConfig.defaults.baseURL + v[0].file_urls[0].image_url : NoProductImage)}
                                                                                        width="100px" height='100px' style={{ objectFit: 'cover'}}
                                                                                    />
                                                                                    
                                                                                    {selectedIndex == index ? (
                                                                                        <Grid width='100px' display='flex' alignItems='center' borderBottom={2} borderColor='P.main'  ></Grid>
                                                                                    ):
                                                                                        <Grid width='100px' display='flex' alignItems='center' borderBottom={2} borderColor='White.main'  ></Grid>

                                                                                    }
                                                                                </Grid>
                                                                            </SwiperSlide>
                                                                            </>
                                                                        );
                                                                    })}
                                                                </Swiper>
                                                                
                                                            </Grid>
                                                        
                                                        :''):''}
                                                        {
                                                        (window.innerWidth>899?'':
                                                        <Grid xs={12} display='flex' ml="90px" >
                                                            <Grid xs={8} md={5}> </Grid>
                                                            <Grid xs={4} md={7}  display='flex' bgcolor='white.main' flexWrap='wrap' pt={1}>
                                                                <Grid xs={12} display='flex' flexWrap='wrap' justifyContent='center' >
                                                                
                                                                    <Swiper  initialSlide={activeDot}  slidesPerView='auto'    spaceBetween={45}>
                                                                        {variantArray.map((v,index) => {
                                                                            return(
                                                                                <>
                                                                                <SwiperSlide style={{width:"100%"}} className="mySwiper3"  >
                                                                                    <Grid  sx={{ cursor: 'pointer',justifyContent:'center',alignItems:'center',margin: '0 4px' ,mb:index==0?"2px":0,pr:"10px", ml:index!=0?"5px":0}} display='flex' flexDirection='column' onClick={() => {
                                                                                        setSelectedIndex(index);
                                                                                        setSelectedVariantArray(v);
                                                                                        _setSelectedVariantArray(v);
                                                                                        _setSelectedVariantArray_(v);
                                                                                        setSelectedVarientIndex(0)
                                                                                    
                                                                                    }}>
                                                                                        <img
                                                                                            src={(v[0] != undefined ? axiosConfig.defaults.baseURL + v[0].file_urls[0].image_url : NoProductImage)}
                                                                                            width="100px" height='100px' style={{ objectFit: 'cover'}}
                                                                                        />
                                                                                        
                                                                                        {selectedIndex == index ? (
                                                                                            <Grid width='100px' display='flex' alignItems='center' borderBottom={2} borderColor='P.main'  ></Grid>
                                                                                        ):
                                                                                            <Grid width='100px' display='flex' alignItems='center' borderBottom={2} borderColor='White.main'  ></Grid>
        
                                                                                        }
                                                                                    </Grid>
                                                                                </SwiperSlide>
                                                                                </>
                                                                            );
                                                                        })}
                                                                    </Swiper>
                                                                
                                                                </Grid>
                                                                        
                                                            </Grid>
                                                        </Grid>
                                                        
                                                        )}
                                                    </Grid>
                                                </Grid>

                                            </Hidden>
                                        :
                                        <Grid xs={12} md={12} display='flex' bgcolor='white.main' flexWrap='wrap' pt={1} sx={{pl:{md:"41px",lg:"52px"}}}>
                                            <Grid xs={12} display='flex' flexWrap='wrap' justifyContent='center' >
                                                
                                                <Swiper  initialSlide={activeDot}  slidesPerView='auto'    spaceBetween={45} 
                                                    style={{padding:"0 50px 0 50px"}}
                                                >
                                                        {variantArray.map((v,index) => {
                                                            return(
                                                                <>
                                                                    <SwiperSlide style={{width:"100%"}} className="mySwiper3"  >
                                                                        <Grid  sx={{ cursor: 'pointer',justifyContent:'center',alignItems:'center',margin: '0 4px' ,mb:index==0?"2px":0,pr:"10px", ml:index!=0?"5px":0}} display='flex' flexDirection='column' onClick={() => {
                                                                            setSelectedIndex(index);
                                                                            setSelectedVariantArray(v);
                                                                            _setSelectedVariantArray(v);
                                                                            _setSelectedVariantArray_(v);
                                                                            setSelectedVarientIndex(0);
                                                                            
                                                                            
                                                                            let sideValues=[];
                                                                            v.map(varient=>{
                                                                                sideValues.push(varient.side_main_attributes.find(a => a.title === variantArray[0][0].side_main_attributes[0].title).value)

                                                                            })
                                                                                
                                                                            _setSelectedSideAttributes([...new Set(sideValues)])
                                                                            
                                                                            setLeftEyeProduct('')
                                                                            setRightEyeProduct('')
                                                                            _setSelectedV([])
                                                                            _setLeftEyeProduct('')
                                                                            _setRightEyeProduct('')
                                                                            _setSelectedV_('')
                                                                            setLoadingLeftEye(false)
                                                                            setLoadingRigthEye(false)
                                                                            setLoading(false)
                                                                            setSelectedSideAtt({ index: 0, title: variantArray[0][0].side_main_attributes[0].title })
                                                                            _setSelectedIndex('')
                                                                            setSelectedVariants([]);
                                                                            
                                                                            let selectedSideAttributes =[];
                                                                            if (variantArray[0].length!=0) {
                                                                                for (let index = 0; index < variantArray[0][0].side_main_attributes.length; index++) {
                                                                                    selectedSideAttributes[index]={ title: variantArray[0][0].side_main_attributes[index].title , value:'' }
                                                                                    
                                                                                }
                                                                            }
                                                                            _setSelectedSideAtt(selectedSideAttributes)
                                                                            setSelectedSideAttributes([])

                                                                        
                                                                        }}>
                                                                            <img
                                                                                src={(v[0] != undefined ? axiosConfig.defaults.baseURL + v[0].file_urls[0].image_url : NoProductImage)}
                                                                                width="100px" height='100px' style={{ objectFit: 'cover'}}
                                                                            />
                                                                            
                                                                            {selectedIndex == index ? (
                                                                                <Grid width='100px' display='flex' alignItems='center' borderBottom={2} borderColor='P.main'  ></Grid>
                                                                            ):
                                                                                <Grid width='100px' display='flex' alignItems='center' borderBottom={2} borderColor='White.main'  ></Grid>

                                                                            }
                                                                        </Grid>
                                                                    </SwiperSlide>
                                                                </>
                                                            );
                                                        })}
                                                </Swiper>
                                            
                                            </Grid>
                                            
                                        </Grid>
                                        }

                                    </Grid>
                                </Grid>
                                <Grid xs={12} md={5}>
                                </Grid>
                                <Grid xs={12} md={7} pb={2} pt={{md:0,xs:2}} pr="20px">
                                    <Grid sx={{ width: "100%" , margin:'auto' }} >
                                        <Divider  />
                                    </Grid>
                                </Grid>
                            </Grid>
                        :""}
                        
                        {selectedVariantArray.length === 0 ? '' :
                            <Grid xs={12} md={12} display='flex' flexWrap='wrap'  justifyContent='center'  sx={[{pb:{md:window.innerWidth>1035?'150px':0,lg:'10px'}}]}>
                                    <Grid xs={12} md={window.innerWidth>1035?5:12} display='flex'  justifyContent='center' sx={window.innerWidth<1035?{width: "95%" , margin:'auto', flexWrap:'wrap'}:{}} >
                                        {selectedVariantArray[0].file_urls.length > 1 ?
                                            window.innerWidth>1035?
                                            <Grid   height="100%" >
                                                <Scrollbars style={{ width: '50px', height: "100%" ,overflow:'hidden'}}
                                                    className='scroll'
                                                >
                                                    <Grid  height="100%" display='flex' flexDirection='column' justifyContent='center' alignItems='center' >
                                                        {selectedVariantArray[0].file_urls.map((v, index) => {
                                                            return (
                                                                <Grid sx={{ width: 10, height: 10, cursor: 'pointer', backgroundColor: selectedVarientIndex == index ? 'P.main' : 'G3.main', ml: '20px', mb: "10px", borderRadius: "10px" }}
                                                                    onClick={() => { setSelectedVarientIndex(index) }}
                                                                ></Grid>
                                                            )
                                                        })
                                                        }
                                                    </Grid>
                                                </Scrollbars>

                                            </Grid>
                                            :""
                                            : ''}
                                            
                                            <Grid md={window.innerWidth>1035?7:12} xs={10} pt={window.innerWidth>1035?0:"20px"} display='flex' justifyContent='center' alignItems='center' >
                                                <Grid md={window.innerWidth>1035?12:9} xs={12} display='flex'  justifyContent='center' alignItems='center'>
                                                    {selectedVariantArray != '' ?
                                                    <CardMedia
                                                        component="img"
                                                        sx={window.innerWidth>1035?{}:{width:"185px",height:"185px"}}
                                                        image={axiosConfig.defaults.baseURL + selectedVariantArray[0].file_urls[selectedVarientIndex].image_url}
                                                    />
                                                
                                                        : (variantArray[0] != undefined ? '' :
                                                        <CardMedia
                                                            component="img"
                                                            sx={window.innerWidth>1035?{}:{width:"185px",height:"185px"}}
                                                            image={NoProductImage}
                                                        />
                                                    )}
                                                </Grid>    
                                            </Grid>
                                            {selectedVariantArray[0].file_urls.length > 1 ?
                                            (
                                                window.innerWidth<1035&&(
                                                    <Grid  xs={10} md={9} display='flex'  justifyContent='flex-start' alignItems='center' >
                                                        <IconButton 
                                                            sx={{ml:'-15px'}}
                                                            onClick={()=>{
                                                                setSelectedVarientIndex(selectedVarientIndex-1)
                                                            }}
                                                            disabled={selectedVarientIndex==0?true:false}
                                                        >
                                                            <KeyboardArrowLeftIcon color={selectedVarientIndex==0?"G2.main":"G1.main"} />

                                                        </IconButton>
                                                            {selectedVariantArray[0].file_urls.map((v, index) => {
                                                                return (
                                                                    <Grid sx={{ width: 10, height: 10, cursor: 'pointer', backgroundColor: selectedVarientIndex == index ? 'P.main' : 'G3.main', ml: index==0? 0:'14px', mb:0, borderRadius: "10px" }}
                                                                        onClick={() => { setSelectedVarientIndex(index) }}
                                                                        
                                                                    ></Grid>
                                                                )
                                                            })
                                                            }
                                                            
                                                        <IconButton
                                                            onClick={()=>{
                                                                setSelectedVarientIndex(selectedVarientIndex+1)
                                                            }}
                                                            disabled={(selectedVarientIndex+1< selectedVariantArray[0].file_urls.length)==0?true:false}
                                                        >
                                                            <KeyboardArrowRightIcon color={(selectedVarientIndex+1< selectedVariantArray[0].file_urls.length)?"G2.main":"G1.main"}/>
                                                            
                                                        </IconButton>
                                                        
                                                    </Grid>
                                                )
                                            ):""}

                                        
                                    </Grid>
                                    
                                <Grid xs={10} md={window.innerWidth>1035?7:9} pb="30px"   sx={window.innerWidth<1035?{width: "95%" , margin:'auto' }:{}} >
                                    
                                    
                                    <Grid xs={12} md={12} pb={2} pt={{md:0,xs:2}} pr={window.innerWidth>1035?"20px":0}>
                                        <Grid sx={window.innerWidth>1035?{ width: "100%" , margin:'auto' }:{}} >
                                        {category === 'sunglasses'&& product && product.products ? 
                                                <>
                                                    {window.innerWidth>1035?
                                                    <>
                                                        <Typography color='P.main' pb="30px" pt="30px" >{product.products[0].main_attributes[0].title} :  {mainVariants.length > 0 ? mainVariants[selectedIndex] : "You don't have main varient."}</Typography> 
                                                        
                                                        <Scrollbars style={{ width: '100%', minHeight: category === 'sunglasses'?"200px":"360px",height:'auto', marginRight: "5px" }}>
                                                            <Grid display='flex' flexWrap='wrap'  sx={window.innerWidth>1035?{justifyContent:'start'}:{justifyContent:'center'}}>
                                                                {category === 'sunglasses' && selectedVariantArray.length > 0 && selectedVariantArray.map((v, index) => {
                                                                    let result=false;
                                                                    return (
                                                                        <Grid xs={window.innerWidth>800?7 :window.innerWidth>700? 7.8:window.innerWidth>546?12:12}
                                                                        display='flex' justifyContent='center' flexWrap='wrap'
                                                                        
                                                                        md={window.innerWidth>1132?5.9:window.innerWidth>1115?6.5:7}  
                                                                        sx={[{ borderRadius: "10px", border: '1px solid #DCDCDC', mb: "20px",height:'160px' },window.innerWidth<1035&&{marginRight:"0.5px"}]}
                                                                            
                                                                        >
                                                                            <Grid xs={12} display='flex' flexWrap='wrap' justifyContent='start' alignItems='start' p={3} pl="14px" pr={0} pb={0}>
                                                                                <Grid xs={12} display='flex' flexWrap='wrap' justifyContent='start' alignItems='start' >
                                                                                {v.side_main_attributes.map(a => {
                                                                                    if (a.title!="Lens Properties") {
                                                                                        return (
                                                                                            <Grid md={window.innerWidth>1467?5.5:6} xs={5.5} display='flex' justifyContent='start' >
                                                                                                <Typography variant={window.innerWidth>350?"h15":"h39"} fontWeight='400' color='G2.main' >{a.title}: </Typography>
                                                                                                <Typography pl={0.5} variant={window.innerWidth>350?"h15":"h39"} fontWeight='400' color='G2.main' >{a.value}</Typography>
                                                                                            </Grid>
                                                                                        )
                                                                                    }
                                                                                })}
                                                                                {v.side_main_attributes.filter(a=>a.title=="Lens Properties").map(sideVarient=>{
                                                                                    return (
                                                                                        <Grid md={window.innerWidth>1467?5.5:window.innerWidth>=1317?6:8} xs={8.5} display='flex' justifyContent='start' >
                                                                                            <Typography variant={window.innerWidth>350?"h15":"h39"} fontWeight='400' color='G2.main' >{sideVarient.title}: </Typography>
                                                                                            <Typography pl={0.5} variant={window.innerWidth>350?"h15":"h39"} fontWeight='400' color='G2.main' >{sideVarient.value}</Typography>
                                                                                        </Grid>
                                                                                    )
                                                                                })}
                                                                                </Grid>
                                                                                <Grid xs={12} display='flex' justifyContent='end'  sx={{ paddingRight: { xs: "25px",md:window.innerWidth>1327? "30px":"25px"} }}  mt={-1} pt="8px">
                                                                                    <Typography variant={window.innerWidth>350?"h32":"h15"} fontWeight='600'>{numberWithCommas(v.price)}</Typography>
                                                                                </Grid>
                                                                                <Grid xs={12} display='flex' justifyContent='center' alignItems='center' 
                                                                                    height='38px' pt="1.1px"
                                                                                >
                                                                                             
                                                                                    {(selectedVariants[index]!=undefined&&shoppingCart.find(card=>card.product_id==v.id)!== undefined)?
                                                                                        <Grid bgcolor='P.main'  sx={[{
                                                                                            textTransform: 'none', paddingBottom: 0, width: '182px', height: '38px',display:'flex',justifyContent:'center' ,textAlign: 'end', alignItems: 'center', alignContent: 'flex-end',
                                                                                            borderBottomLeftRadius: "0", borderBottomRightRadius: '0', borderTopLeftRadius: "15px", borderTopRightRadius: '15px'
                                                                                        },window.innerWidth<326&&{fontSize:"11px"}]}
                                                                                        >
                                                                                            <Grid height='100%' display={"flex"} alignItems='center' pr="18px" 
                                                                                                onClick={()=>{
                                                                                                    setShowCartPage(true)
                                                                                                }}
                                                                                                sx={{cursor:'pointer'}}
                                                                                            >
                                                                                                <svg width="24" height="22" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                                    <path d="M1 1H5L7.68 12.6044C7.77144 13.0034 8.02191 13.3618 8.38755 13.6169C8.75318 13.872 9.2107 14.0075 9.68 13.9997H19.4C19.8693 14.0075 20.3268 13.872 20.6925 13.6169C21.0581 13.3618 21.3086 13.0034 21.4 12.6044L23 5.33323H6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                                                                    <path d="M10 21C10.5523 21 11 20.5523 11 20C11 19.4477 10.5523 19 10 19C9.44772 19 9 19.4477 9 20C9 20.5523 9.44772 21 10 21Z" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                                                                    <path d="M19 21C19.5523 21 20 20.5523 20 20C20 19.4477 19.5523 19 19 19C18.4477 19 18 19.4477 18 20C18 20.5523 18.4477 21 19 21Z" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                                                                </svg>
                                                                                            </Grid>
                                                                                            <Grid
                                                                                                sx={{
                                                                                                    minWidth: "80px",
                                                                                                    width: "28%",
                                                                                                    height: "28px",
                                                                                                    display: "flex",
                                                                                                    justifyContent: "space-between",
                                                                                                    alignItems: "center",
                                                                                                    flexDirection: "row",
                                                                                                    backgroundColor: "P3.main",
                                                                                                    borderRadius: "8px",
                                                                                                    overflow: "hidden",
                                                                                                    color: "P.main",
                                                                                                }}
                                                                                            >
                                                                                                <Grid
                                                                                                    style={{
                                                                                                    display: "flex",
                                                                                                    alignItems: "center",
                                                                                                    textAlign: "center",
                                                                                                    width: "28px",
                                                                                                    height: "28px",
                                                                                                    display: "flex",
                                                                                                    flexDirection: "column",
                                                                                                    justifyContent:'center',
                                                                                                    backgroundColor: "#F5E9EB",
                                                                                                    color: "black",
                                                                                                    cursor: "pointer",
                                                                                                    }}
                                                                                                    onClick={() => {
                                                                                                        DecreaseCartItem(
                                                                                                            v.id,
                                                                                                            shoppingCart.find(card=>card.product_id==v.id).quantity
                                                                                                        );
                                                                                                           
                                                                                                    }}
                                                                                                >
                                                                                                    -
                                                                                                </Grid>
                                                                                                <Typography color="Black.amin">
                                                                                                    {shoppingCart.find(card=>card.product_id==v.id).quantity}
                                                                                                </Typography>
                                                                                                <Grid
                                                                                                    style={{
                                                                                                    display: "flex",
                                                                                                    alignItems: "center",
                                                                                                    textAlign: "center",
                                                                                                    width: "28px",
                                                                                                    height: "28px",
                                                                                                    display: "flex",
                                                                                                    flexDirection: "column",
                                                                                                    justifyContent:'center',
                                                                                                    backgroundColor: "P.main",
                                                                                                    color: "#CB929B",
                                                                                                    cursor: "pointer",
                                                                                                    }}
                                                                                                    onClick={() => {
                                                                                                        
                                                                                                        IncreaseCartItem(
                                                                                                            v.id,
                                                                                                            shoppingCart.find(card=>card.product_id==v.id).quantity
                                                                                                        );
                                                                                                    }}
                                                                                                >
                                                                                                    +
                                                                                                </Grid>
                                                                                            </Grid>
                                                                                            
                                                                                        </Grid>
                                                                                    :
                                                                                        <Button color='Black' variant="contained" sx={[{
                                                                                            textTransform: 'none', paddingTop:0,paddingBottom: 0, width: '182px', height: '38px', textAlign: 'end', alignItems: 'center', alignContent: 'flex-end',
                                                                                            borderBottomLeftRadius: "0", borderBottomRightRadius: '0', borderTopLeftRadius: "15px", borderTopRightRadius: '15px'
                                                                                        ,color:'P.main',fontSize:'16px',fontWeight:'500',pt:0},window.innerWidth<326&&{fontSize:"11px"}]}
                                                                                            onClick={() => {
                                                                                                addToCard(v.id);
                                                                                                _setTrigger(_trigger+1);
                                                                                                let varients = selectedVariants;
                                                                                                
                                                                                                if (localStorage.getItem("token")) {
                                                                                                    if (varients[index]!=undefined||varients.length==0) {
                                                                                                        
                                                                                                        setTimeout(()=>{
                                                                                                            varients.push(index);
                                                                                                            setSelectedVariants(varients);
                                                                                                            
                                                                                                        },2000)
                                                                                                    }
                                                                                                }
                                                                                            }}
                                                                                        >
                                                                                            Add To Cart
                                                                                        </Button>
                                                                                    }
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
                                                                            </Grid>
                                                                        </Grid>
                                                                    )
                                                                })

                                                                }

                                                            </Grid>
                                                        </Scrollbars>
                                                    </>
                                                    :
                                                    <>
                                                    
                                                        <Grid item xs={12} className="numberAndTitle" >
                                                            <Typography color='P.main' pb="30px" pt="30px" >{product.products[0].main_attributes[0].title} :  {mainVariants.length > 0 ? mainVariants[selectedIndex] : "You don't have main varient."}</Typography> 

                                                        </Grid>
                                                        <Scrollbars style={{ width: '100%', minHeight: category === 'sunglasses'?"190px":"360px",height:'auto'}}>
                                                            <Grid display='flex' flexWrap='wrap'  sx={window.innerWidth>1035?{justifyContent:'start'}:{justifyContent:'center'}}>
                                                                {(category === 'sunglasses' && selectedVariantArray.length > 0 )&& selectedVariantArray.map((v, index) => {
                                                                    return (
                                                                        <Grid xs={window.innerWidth>800?7 :window.innerWidth>700? 7.8:window.innerWidth>546?12:12}
                                                                        display='flex' justifyContent='center' flexWrap='wrap'
                                                                        
                                                                        md={window.innerWidth>1132?5.9:window.innerWidth>1115?6.5:7}  
                                                                        sx={[{ borderRadius: "10px", border: '1px solid #DCDCDC', mb: "20px" },window.innerWidth<1035&&{marginRight:"0.5px"}]}
                                                                            
                                                                        >
                                                                            <Grid xs={12} display='flex' flexWrap='wrap' justifyContent='start' alignItems='start' pt="11px" pl='8px' pr={0} pb={0}>
                                                                                <Grid xs={11} md={11} display='flex' flexWrap='wrap' justifyContent='start' alignItems='start' >
                                                                                    {v.side_main_attributes.map(a => {
                                                                                        if (a.title!="Lens Properties") {
                                                                                            return (
                                                                                                <Grid md={window.innerWidth>1467?5.5:6} xs={5.5} display='flex' justifyContent='start' >
                                                                                                    <Typography variant={window.innerWidth>350?"h15":"h39"} fontWeight='400' color='G2.main' >{a.title}: </Typography>
                                                                                                    <Typography pl={0.5} variant={window.innerWidth>350?"h15":"h39"} fontWeight='400' color='G2.main' >{a.value}</Typography>
                                                                                                </Grid>
                                                                                            )
                                                                                        }
                                                                                    })}
                                                                                    {v.side_main_attributes.filter(a=>a.title=="Lens Properties").map(sideVarient=>{
                                                                                        return (
                                                                                            <Grid md={window.innerWidth>1467?5.5:window.innerWidth>=1317?6:8} xs={8.5} display='flex' justifyContent='start' >
                                                                                                <Typography variant={window.innerWidth>350?"h15":"h39"} fontWeight='400' color='G2.main' >{sideVarient.title}: </Typography>
                                                                                                <Typography pl={0.5} variant={window.innerWidth>350?"h15":"h39"} fontWeight='400' color='G2.main' >{sideVarient.value}</Typography>
                                                                                            </Grid>
                                                                                        )
                                                                                    })}
                                                                                </Grid>
                                                                                    
                                                                                <Grid xs={12} display='flex' justifyContent='end'  sx={{ paddingRight: { xs: "25px",md:window.innerWidth>1327? "58px":"25px"} }}  mt={-1} pt="8px">
                                                                                    <Typography variant={window.innerWidth>320?"h32":"h15"} fontWeight='600'>{numberWithCommas(v.price)}</Typography>
                                                                                </Grid>
                                                                                <Grid xs={12} display='flex' justifyContent='center' alignItems='end' mt={2}
                                                                                    height='26px'
                                                                                >
                                                                                    
                                                                                    {(selectedVariants[index]!=undefined&&shoppingCart.find(card=>card.product_id==v.id)!== undefined)?
                                                                                        <Grid bgcolor='P.main'  sx={[{
                                                                                            textTransform: 'none', paddingBottom: 0, width: '182px', height: '38px',display:'flex',justifyContent:'center' ,textAlign: 'end', alignItems: 'center', alignContent: 'flex-end',
                                                                                            borderBottomLeftRadius: "0", borderBottomRightRadius: '0', borderTopLeftRadius: "15px", borderTopRightRadius: '15px'
                                                                                        },window.innerWidth<326&&{fontSize:"11px"}]}
                                                                                        >
                                                                                            <Grid height='100%' display={"flex"} alignItems='center' pr="18px" 
                                                                                                onClick={()=>{
                                                                                                    setShowCartPage(true)
                                                                                                }}
                                                                                            sx={{cursor:'pointer'}}
                                                                                            >
                                                                                                <svg width="24" height="22" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                                    <path d="M1 1H5L7.68 12.6044C7.77144 13.0034 8.02191 13.3618 8.38755 13.6169C8.75318 13.872 9.2107 14.0075 9.68 13.9997H19.4C19.8693 14.0075 20.3268 13.872 20.6925 13.6169C21.0581 13.3618 21.3086 13.0034 21.4 12.6044L23 5.33323H6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                                                                    <path d="M10 21C10.5523 21 11 20.5523 11 20C11 19.4477 10.5523 19 10 19C9.44772 19 9 19.4477 9 20C9 20.5523 9.44772 21 10 21Z" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                                                                    <path d="M19 21C19.5523 21 20 20.5523 20 20C20 19.4477 19.5523 19 19 19C18.4477 19 18 19.4477 18 20C18 20.5523 18.4477 21 19 21Z" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                                                                </svg>
                                                                                            </Grid>
                                                                                            <Grid
                                                                                            sx={{
                                                                                                minWidth: "80px",
                                                                                                width: "28%",
                                                                                                height: "28px",
                                                                                                display: "flex",
                                                                                                justifyContent: "space-between",
                                                                                                alignItems: "center",
                                                                                                flexDirection: "row",
                                                                                                backgroundColor: "P3.main",
                                                                                                borderRadius: "8px",
                                                                                                overflow: "hidden",
                                                                                                color: "P.main",
                                                                                            }}
                                                                                            >
                                                                                                <Grid
                                                                                                    style={{
                                                                                                    display: "flex",
                                                                                                    alignItems: "center",
                                                                                                    textAlign: "center",
                                                                                                    width: "28px",
                                                                                                    height: "28px",
                                                                                                    display: "flex",
                                                                                                    flexDirection: "column",
                                                                                                    justifyContent:'center',
                                                                                                    backgroundColor: "#F5E9EB",
                                                                                                    color: "black",
                                                                                                    cursor: "pointer",
                                                                                                    }}
                                                                                                    onClick={() => {
                                                                                                        DecreaseCartItem(
                                                                                                            v.id,
                                                                                                            shoppingCart.find(card=>card.product_id==v.id).quantity
                                                                                                        );
                                                                                                            
                                                                                                          
                                                                                                    }}
                                                                                                >
                                                                                                    -
                                                                                                </Grid>
                                                                                                <Typography color="Black.amin">
                                                                                                    {shoppingCart.find(card=>card.product_id==v.id).quantity}
                                                                                                </Typography>
                                                                                                <Grid
                                                                                                    style={{
                                                                                                    display: "flex",
                                                                                                    alignItems: "center",
                                                                                                    textAlign: "center",
                                                                                                    width: "28px",
                                                                                                    height: "28px",
                                                                                                    display: "flex",
                                                                                                    flexDirection: "column",
                                                                                                    justifyContent:'center',
                                                                                                    backgroundColor: "P.main",
                                                                                                    color: "#CB929B",
                                                                                                    cursor: "pointer",
                                                                                                    }}
                                                                                                    onClick={() => {
                                                                                                        
                                                                                                        IncreaseCartItem(
                                                                                                            v.id,
                                                                                                            shoppingCart.find(card=>card.product_id==v.id).quantity
                                                                                                        );

                                                                                                    }}
                                                                                                >
                                                                                                    +
                                                                                                </Grid>
                                                                                            </Grid>
                                                                                            
                                                                                        </Grid>
                                                                                    :
                                                                                        <Button color='Black' variant="contained" sx={[{
                                                                                            textTransform: 'none', paddingBottom: 0, width: '182px', height: '38px', textAlign: 'end', alignItems: 'center', alignContent: 'flex-end',
                                                                                            borderBottomLeftRadius: "0", borderBottomRightRadius: '0', borderTopLeftRadius: "15px", borderTopRightRadius: '15px'
                                                                                        ,color:'P.main',fontSize:'16px',fontWeight:'500'},window.innerWidth<326&&{fontSize:"11px"}]}
                                                                                            onClick={() => {
                                                                                                addToCard(v.id); 
                                                                                                _setTrigger(_trigger+1);
                                                                                                let varients = selectedVariants;
                                                                                                
                                                                                                if (localStorage.getItem("token")) {
                                                                                                    if (varients[index]!=undefined||varients.length==0) {
                                                                                                        
                                                                                                        setTimeout(()=>{
                                                                                                            varients.push(index);
                                                                                                            setSelectedVariants(varients);
                                                                                                            
                                                                                                        },2000)
                                                                                                    }
                                                                                                }
                                                                                            }}
                                                                                        >
                                                                                            Add To Cart
                                                                                        </Button>
                                                                                    }
                                                                                    
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
                                                                            </Grid>
                                                                        </Grid>
                                                                    )
                                                                })}

                                                            </Grid>
                                                        </Scrollbars>
                                                    </>
                                                    


                                                    }
                                                    
                                                </>
                                        : ''}

                                        </Grid>
                                    </Grid>

                                    
                                    {category !== 'sunglasses'&&(
                                        <Grid xs={12} pr={window.innerWidth>1035?"20px":0}>

                                            <Grid xs={12}  >
                                                <Grid xs={12} minHeight="500px" maxHeight="900px">
                                                    
                                                    <Grid xs={window.innerWidth>1035?12:12} display="flex" justifyContent='start' alignItems='center' flexWrap='wrap' pt="30px" pb={selectedVariantArray[0].side_main_attributes.length > 1?"56px":0} >
                                                        
                                                        <Grid xs={12} display="flex" justifyContent='start' alignItems='center'>
                                                            <Grid   sx={{marginLeft:{xs:"10px",sm:"60px" ,md:window.innerWidth>1305?"90px":"70px"},cursor:'pointer' }} width="20px" height="20px" border="2px solid #CB929B" display='flex' justifyContent='center' alignItems="center" borderRadius= "5px" 
                                                            onClick={()=>{
                                                                
                                                                setIsForTwoEyes(!isForTwoEyes);
                                                                if (isForTwoEyes==false) {
                                                                    setRightEye(true)
                                                                    
                                                                }else{
                                                                    setRightEye(false)
                                                                    setLeftEye(false)
                                                                    
                                                                }
                                                                    
                                                                    
                                                                _setSelectedVariantArray(_selectedVariantArray_)
                                                                setVarientOfEyes([])
                                                                
                                                                _setTrigger(_trigger+1);
                                                                _setSelectedIndex('')
                                                                
                                                                
                                                                const selectedSideAttributes=[];
                                                                let clickedConfirms = isClickedConfirm;

                                                                let sideValues = []
                                                                
                                                                _selectedVariantArray.map(v => {
                                                                    sideValues.push(v.side_main_attributes.find(a => a.title === _selectedVariantArray[0].side_main_attributes[0].title).value)
                                                                    for (let index = 0; index < v.side_main_attributes.length; index++) {
                                                                        selectedSideAttributes[index]={ title: v.side_main_attributes[index].title , value:'' }
                                                                    }
                                                                })
                                                                _setSelectedSideAtt(selectedSideAttributes)
                                                                
                                                                for (let index = 0; index < selectedVariantArray[0].side_main_attributes.length; index++) {
                                                                    clickedConfirms[index] = false;
                                                                }
                                                                setIsClickedConfirm(clickedConfirms);

                                                                let _selectedSideAtt = { index: 0 , title: selectedVariantArray[0].side_main_attributes[0].title };
                                                                setSelectedSideAtt(_selectedSideAtt);
                                                                _selectedVariantArray_.map(v => {
                                                                    sideValues.push(v.side_main_attributes.find(a => a.title === _selectedVariantArray_[0].side_main_attributes[0].title).value)
                                                                    for (let index = 0; index < v.side_main_attributes.length; index++) {
                                                                        selectedSideAttributes[index]={ title: v.side_main_attributes[index].title , value:'' }
                                                                    }
                                                                })
                                                                _setSelectedSideAttributes([...new Set(sideValues)])
                                                                _setTrigger(_trigger+1); 
                                                                setSelectedSideAttributes([])
                                                                
                                                            }}> <Grid p="2px" bgcolor={isForTwoEyes?"P.main":"White.main"} sx={{cursor:'pointer'}} height="12px" width="12px" borderRadius= "3px"></Grid> 
                                                            </Grid>
                                                            <Typography variant={window.innerWidth>525?"h7":"h10"} color="G1.main" pl="19px">I Need 2 Different Powers for My Lenses.</Typography>

                                                        </Grid>
                                                        <Grid xs={12} display="flex" justifyContent='start' alignItems='center' sx={{marginLeft:{xs:"10px",sm:"60px" ,md:window.innerWidth>1305?"90px":"70px"}}}>
                                                          <Typography  color='P.main'  pt="30px" >{product.products[0].main_attributes[0].title} :  {mainVariants.length > 0 ? mainVariants[selectedIndex] : "You don't have main varient."}</Typography> 
                                                        </Grid>
                                                    </Grid>

                                                    {selectedVariantArray[0].side_main_attributes.length > 1 &&(
                                                        
                                                        <Grid xs={12} md={12} display='flex' width="100%"> 
                                                            <Grid md={12} xs={12}   display='flex' justifyContent='center' width="100%">
                                                                <Stepper
                                                                activeStep={((rightEye&&!loadingRigthEye)||(leftEye&&!loadingLeftEye) ||(!leftEye&&!rightEye&&!loading))? selectedSideAtt.index:(rightEye?rightEyeProduct.side_main_attributes.length:leftEye?leftEyeProduct.side_main_attributes.length:_selectedV.side_main_attributes.length)}
                                                                className={[c.paperRoot,"stepper"]}
                                                                alternativeLabel
                                                                sx={{width:"100%"}}
                                                                
                                                                >
                                                                {selectedVariantArray[0].side_main_attributes.map((s,step) => {
                                                                    return (
                                                                    <Step key={step}>
                                                                        <StepLabel>{s.title}</StepLabel>
                                                                    </Step>
                                                                    );
                                                                })}
                                                                </Stepper>
                                                            </Grid>
                                                        </Grid>

                                                    )}
                                                    <Grid xs={12}  mt={{ xs:"50px",sm:"50px",md:window.innerWidth>1305?(selectedVariantArray[0].side_main_attributes.length > 1?"60px":"46px"):"50px"}} sx={{paddingLeft:{xs:"10px",sm:"70px" ,md:window.innerWidth>1305?"100px":"75px"} }}>
                                                        <Scrollbars style={{ width: '100%', minHeight: category === 'sunglasses'?"200px":(_selectedSideAttributes.length>25?"360px":"200px"),height:'auto', right:window.innerWidth>1035? (isForTwoEyes?"65px ":"5px"):0 ,
                                                            
                                                        }}
                                                        >
                                                            <Grid display='flex' flexWrap='wrap'  justifyContent='center' pr="13px">
                                                                
                                                                <Grid xs={12} mb="20px"  >
                                                                    <Grid xs={12} md={12} display='flex' flexDirection='column'>
                                                                        
                                                                        <Grid xs={12} md={12} lg={12} display='flex'  flexWrap='wrap'  >
                                                                                {(rightEye&&!loadingRigthEye)||(leftEye&&!loadingLeftEye) ||(!leftEye&&!rightEye&&!loading)?
                                                                                <Grid xs={12} display='flex'  justifyContent='start'  >
                                                                                    
                                                                                    <Grid xs={window.innerWidth>1035? 12:12} display='flex' justifyContent={'start'} gap="30px" flexWrap='wrap' >
                                                                                        {_selectedSideAttributes.map((s,index) => {
                                                                                            return (
                                                                                                <Grid md={1}  p={0.3} display='flex' >
                                                                                                    <Button  variant="outlined" color='G1' sx={[{ borderRadius: '8px' ,width:"50px",
                                                                                                    border:_selectedIndex!=''?(_selectedIndex===index? "1px solid #CB929B":"1px solid rgba(117, 117, 117, 0.5)"):"1px solid rgba(117, 117, 117, 0.5)"
                                                                                                    ,"&:hover":{border:"1px solid #757575"}},_selectedIndex===index?{border:"1px solid #CB929B"}:{border:"1px solid rgba(117, 117, 117, 0.5)"}]}
                                                                                                        onClick={async () => {
                                                                                                            let _selectedSideAttributes =[...new Set(selectedSideAttributes)];
                                                                                                            let res = false;
                                                                                                            if (selectedSideAttributes.length==0) {
                                                                                                                res =true;  
                                                                                                                
                                                                                                            }else if (_selectedSideAttributes[selectedSideAttributes.length-1].title!=selectedSideAtt.title) {
                                                                                                              res =true;  
                                                                                                            }
                                                                                                            if (res) {
                                                                                                                if (selectedSideAttributes.length > 0) {
                                                                                                                    _selectedSideAttributes.push({ title: selectedSideAtt.title, value: s });
                                                                                                                    setSelectedSideAttributes([...selectedSideAttributes, { title: selectedSideAtt.title, value: s }])
                                                                                                                } else {
                                                                                                                    _selectedSideAttributes.push({ title: selectedSideAtt.title, value: s });
                                                                                                                    setSelectedSideAttributes([{ title: selectedSideAtt.title, value: s }])
                                                                                                                }
                                                                                                            }else{
                                                                                                                _selectedSideAttributes = _selectedSideAttributes.filter(p=>p.title!=selectedSideAtt.title)
                                                                                                               setSelectedSideAttributes([..._selectedSideAttributes, { title: selectedSideAtt.title, value: s }])

                                                                                                            }
                                                                                                            
                                                                                                            setSelectedV(s)
                                                                                                            
                                                                                                                let newVariant = _selectedVariantArray_.filter(b => b.side_main_attributes.find(a => a.title === selectedSideAtt.title && a.value === s))
                                                                                                                setSelectedVariant(newVariant)
                                                                                                                if (res) {
                                                                                                                    let newVariant1=[]
                                                                                                                    if (newVariant[0].side_main_attributes.length == _selectedSideAttributes.length) {
                                                                                                                        newVariant.map(v=>{
                                                                                                                            let result = true;
                                                                                                                            _selectedSideAttributes.map(p=>{
                                                                                                                                v.side_main_attributes.map(a=>{
                                                                                                                                    if (p.title==a.title) {
                                                                                                                                        if (p.value!=a.value) {
                                                                                                                                            result = false;
                                                                                                                                        }
                                                                                                                                    }
                                                                                                                                })
                                                                                                                            })
                                                                                                                            if (result) {
                                                                                                                                newVariant1.push(v)
                                                                                                                            }
    
                                                                                                                        })
                                                                                                                        newVariant = newVariant1;
                                                                                                                        setSelectedVariant(newVariant)
                                                                                                                    }
                                                                                                                }

                                                                                                                const sideAttributes = _selectedSideAtt!=''?_selectedSideAtt: []
                                                                                                                sideAttributes[selectedSideAtt.index]={title: selectedSideAtt.title, value: s}
                                                                                                                _setSelectedSideAtt(sideAttributes)
                                                                                                                await _setSelectedIndex(index)
                                                                                                                _setTrigger(_trigger+1)
                                                                                                                setSelectedVariantArray(newVariant)
                                                                                                                
                                                                                                            setCardPage(true);
                                                                                                        }}
                                                                                                    >
                                                                                                        {s}
                                                                                                    </Button>
                                                                                                        
                                                                                                </Grid>
                                                                                            )
                                                                                        })}
                                                                                    </Grid>
                                                                                        
                                                                                </Grid>        
                                                                                :
                                                                                ""
                                                                                
                                                                                
                                                                            }
                                                                            
                                                                            
                                                                        </Grid>

                                                                        
                                                                        
                                                                    </Grid>
                                                                </Grid>

                                                            </Grid>
                                                        </Scrollbars>
                                                        
                                                    </Grid>
                                                    
                                                    
                                                    <Grid xs={12} display='flex' justifyContent='space-between'  >
                                                        <Grid xs={window.innerWidth>1035?12:12} md={window.innerWidth>1035?12:12} display="flex" flexWrap='wrap' justifyContent='center' sx={window.innerWidth>1305?{paddingLeft:{sm:"70px" ,md:window.innerWidth>1305?"100px":"75px"} , mr:window.innerWidth>1035? (isForTwoEyes?"65px ":"5px"):0 }:{}}>
                                                            {(selectedVariantArray[0].side_main_attributes.length > 1&&((rightEye&&!loadingRigthEye)||(leftEye&&!loadingLeftEye) ||(!leftEye&&!rightEye&&!loading)&&cardPage))?(<Grid pt="10px"  ml={(window.innerWidth>932&&window.innerWidth<1133)?"0":0}  width= {(window.innerWidth>932&&window.innerWidth<1133)? "100%":"100%"} maxWidth={(window.innerWidth>932&&window.innerWidth<1133)? "100%":"100%"} display='flex' justifyContent='center'>
                                                                
                                                                    <Grid  width={window.innerWidth>520?"363px":"100%"} height='160px' display='flex' flexWrap='wrap' justifyContent='center' sx={{ borderRadius: "10px", border: '1px solid #DCDCDC' }} p="10px"  pb={0}>
                                                                        <Grid xs={8} >
                                                                            
                                                                            {_selectedSideAtt!=''?(_selectedSideAtt).map((side,index) => {
                                                                                return (
                                                                                    <Grid xs={12} display='flex' p={0.4}>
                                                                                        <Typography variant={window.innerWidth>320?"h15":"h39"} fontWeight='400' color={(side.value!=''&&isClickedConfirm[index])? 'Black.main':'G2.main'}  >{side.title}: </Typography>
                                                                                        <Typography pl={0.5} variant={window.innerWidth>320?"h15":"h39"} color={(side.value!=''&&isClickedConfirm[index])? 'Black.main':'G2.main'} >{side.value}</Typography>
                                                                                    </Grid>
                                                                                )

                                                                            }):''}
                                                                        </Grid>
                                                                        <Grid xs={4} display='flex' flexDirection='column' justifyContent='space-between' sx={isForTwoEyes?{}:{alignSelf:'end'}}>
                                                                            {isForTwoEyes? 
                                                                                (leftEye==''?
                                                                                <Grid xs={12}  alignItems='end'  alignSelf='center' >
                                                                                    
                                                                                    <SvgIcon
                                                                                        
                                                                                        titleAccess="title"
                                                                                        
                                                                                        component={(componentProps) => (
                                                                                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                                <path d="M6.92114 17.7725L13.2932 17.7725" stroke="#CB929B" stroke-width="3"/>
                                                                                                <path d="M15.9301 28.6743C19.4879 28.6743 22.5013 27.4397 24.9705 24.9705C27.4397 22.5013 28.6743 19.4879 28.6743 15.9301C28.6743 15.2929 28.6344 14.6754 28.5548 14.0775C28.4751 13.4806 28.3291 12.9034 28.1167 12.3459C27.5592 12.4786 27.0016 12.5784 26.444 12.6454C25.8865 12.7112 25.3024 12.7441 24.6917 12.7441C22.2757 12.7441 19.9923 12.2264 17.8418 11.1909C15.6912 10.1555 13.8592 8.70848 12.3459 6.84996C11.4963 8.92088 10.2818 10.7199 8.70264 12.2471C7.12237 13.7732 5.2835 14.9212 3.18603 15.6912V15.9301C3.18603 19.4879 4.42062 22.5013 6.88979 24.9705C9.35896 27.4397 12.3724 28.6743 15.9301 28.6743ZM15.9301 31.8603C13.7265 31.8603 11.6556 31.4419 9.71739 30.605C7.77922 29.7692 6.09328 28.6344 4.65957 27.2007C3.22586 25.767 2.0911 24.0811 1.2553 22.1429C0.418432 20.2047 0 18.1338 0 15.9301C0 13.7265 0.418432 11.6556 1.2553 9.71739C2.0911 7.77922 3.22586 6.09328 4.65957 4.65957C6.09328 3.22586 7.77922 2.09057 9.71739 1.2537C11.6556 0.417901 13.7265 0 15.9301 0C18.1338 0 20.2047 0.417901 22.1429 1.2537C24.0811 2.09057 25.767 3.22586 27.2007 4.65957C28.6344 6.09328 29.7692 7.77922 30.605 9.71739C31.4419 11.6556 31.8603 13.7265 31.8603 15.9301C31.8603 18.1338 31.4419 20.2047 30.605 22.1429C29.7692 24.0811 28.6344 25.767 27.2007 27.2007C25.767 28.6344 24.0811 29.7692 22.1429 30.605C20.2047 31.4419 18.1338 31.8603 15.9301 31.8603Z" fill="#CB929B"/>
                                                                                                <path d="M20.9285 14.3115C18.7562 14.3115 16.901 15.6327 16.1494 17.4976C16.901 19.3624 18.7562 20.6836 20.9285 20.6836C23.1008 20.6836 24.9559 19.3624 25.7075 17.4976C24.9559 15.6327 23.1008 14.3115 20.9285 14.3115ZM20.9285 19.6216C19.7294 19.6216 18.7562 18.67 18.7562 17.4976C18.7562 16.3251 19.7294 15.3735 20.9285 15.3735C22.1276 15.3735 23.1008 16.3251 23.1008 17.4976C23.1008 18.67 22.1276 19.6216 20.9285 19.6216ZM20.9285 16.2231C20.2073 16.2231 19.6251 16.7924 19.6251 17.4976C19.6251 18.2027 20.2073 18.772 20.9285 18.772C21.6497 18.772 22.2318 18.2027 22.2318 17.4976C22.2318 16.7924 21.6497 16.2231 20.9285 16.2231Z" fill="#CB929B"/>
                                                                                            </svg>
                                                                                        )}
                                                                                    />
                                                                                </Grid>
                                                                                :
                                                                                <Grid xs={12}  alignItems='end' alignSelf='center' >
                                                                                    
                                                                                    <SvgIcon
                                                                                        
                                                                                        titleAccess="title"
                                                                                        component={(componentProps) => (
                                                                                            <SvgIcon
                                                                                    
                                                                                            titleAccess="title"
                                                                                            
                                                                                            component={(componentProps) => (
                                                                                                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                                    <path d="M18.4919 17.6523L24.864 17.6523" stroke="#CB929B" stroke-width="3"/>
                                                                                                    <path d="M15.9301 28.8149C19.4879 28.8149 22.5013 27.5803 24.9705 25.1111C27.4397 22.642 28.6743 19.6285 28.6743 16.0708C28.6743 15.4336 28.6344 14.816 28.5548 14.2181C28.4751 13.6212 28.3291 13.044 28.1167 12.4865C27.5592 12.6192 27.0016 12.7191 26.444 12.786C25.8865 12.8518 25.3024 12.8847 24.6917 12.8847C22.2757 12.8847 19.9923 12.367 17.8418 11.3316C15.6912 10.2961 13.8592 8.84911 12.3459 6.99059C11.4963 9.06151 10.2818 10.8606 8.70264 12.3877C7.12237 13.9138 5.2835 15.0619 3.18603 15.8318V16.0708C3.18603 19.6285 4.42062 22.642 6.88979 25.1111C9.35896 27.5803 12.3724 28.8149 15.9301 28.8149ZM15.9301 32.0009C13.7265 32.0009 11.6556 31.5825 9.71739 30.7456C7.77922 29.9098 6.09328 28.7751 4.65957 27.3414C3.22586 25.9076 2.0911 24.2217 1.2553 22.2835C0.418432 20.3454 0 18.2744 0 16.0708C0 13.8671 0.418432 11.7962 1.2553 9.85802C2.0911 7.91985 3.22586 6.23391 4.65957 4.80019C6.09328 3.36648 7.77922 2.23119 9.71739 1.39433C11.6556 0.558526 13.7265 0.140625 15.9301 0.140625C18.1338 0.140625 20.2047 0.558526 22.1429 1.39433C24.0811 2.23119 25.767 3.36648 27.2007 4.80019C28.6344 6.23391 29.7692 7.91985 30.605 9.85802C31.4419 11.7962 31.8603 13.8671 31.8603 16.0708C31.8603 18.2744 31.4419 20.3454 30.605 22.2835C29.7692 24.2217 28.6344 25.9076 27.2007 27.3414C25.767 28.7751 24.0811 29.9098 22.1429 30.7456C20.2047 31.5825 18.1338 32.0009 15.9301 32.0009Z" fill="#CB929B"/>
                                                                                                    <path d="M11.1514 14.4785C8.97907 14.4785 7.12393 15.7997 6.37231 17.6645C7.12393 19.5294 8.97907 20.8506 11.1514 20.8506C13.3237 20.8506 15.1788 19.5294 15.9304 17.6645C15.1788 15.7997 13.3237 14.4785 11.1514 14.4785ZM11.1514 19.7886C9.95225 19.7886 8.97907 18.837 8.97907 17.6645C8.97907 16.4921 9.95225 15.5405 11.1514 15.5405C12.3505 15.5405 13.3237 16.4921 13.3237 17.6645C13.3237 18.837 12.3505 19.7886 11.1514 19.7886ZM11.1514 16.3901C10.4302 16.3901 9.84798 16.9594 9.84798 17.6645C9.84798 18.3697 10.4302 18.939 11.1514 18.939C11.8726 18.939 12.4547 18.3697 12.4547 17.6645C12.4547 16.9594 11.8726 16.3901 11.1514 16.3901Z" fill="#CB929B"/>
                                                                                                </svg>
                                                                                            )}
                                                                                        />
                                                                                        )}
                                                                                    />
                                                                                </Grid>

                                                                                )
                                                                            :''}
                                                                            <Grid xs={12}  alignItems='end'  alignSelf='center'>
                                                                                <Typography variant={window.innerWidth>320?"h32":"h15"} fontWeight='600'>{_selectedSideAtt[_selectedSideAtt.length-1].value !=''? numberWithCommas(selectedVariantArray[0].price):"0.0 KWD"}</Typography>
                                                                            </Grid>

                                                                        </Grid>
                                                                        <Grid xs={6} display='flex' justifyContent='center' alignItems='center' 
                                                                            height='38px' pt="1.1px" alignSelf='end'
                                                                        >
                                                                            {((rightEye&&selectedVariants.find(v=>v=="Right eye")!=undefined&&shoppingCart.find(card=>card.product_id==rightEyeProduct.id)!=undefined))||((leftEye&&selectedVariants.find(v=>v=="Left eye")!=undefined&&shoppingCart.find(card=>card.product_id==leftEyeProduct.id)!=undefined)) || ((!rightEye&&!leftEye&&selectedVariants[0]!=undefined&&shoppingCart.find(card=>card.product_id==_selectedV.id)!=undefined))?
                                                                                <Grid bgcolor='P.main'  sx={[{
                                                                                    textTransform: 'none', paddingBottom: 0, width: '182px', height: '38px',display:'flex',justifyContent:'center' ,textAlign: 'end', alignItems: 'center', alignContent: 'flex-end',
                                                                                    borderBottomLeftRadius: "0", borderBottomRightRadius: '0', borderTopLeftRadius: "15px", borderTopRightRadius: '15px'
                                                                                },window.innerWidth<326&&{fontSize:"11px"}]}
                                                                                >
                                                                                    <Grid height='100%' display={"flex"} alignItems='center' pr="18px" 
                                                                                        onClick={()=>{
                                                                                            setShowCartPage(true)
                                                                                        }}
                                                                                    sx={{cursor:'pointer'}}
                                                                                    >
                                                                                        <svg width="24" height="22" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                            <path d="M1 1H5L7.68 12.6044C7.77144 13.0034 8.02191 13.3618 8.38755 13.6169C8.75318 13.872 9.2107 14.0075 9.68 13.9997H19.4C19.8693 14.0075 20.3268 13.872 20.6925 13.6169C21.0581 13.3618 21.3086 13.0034 21.4 12.6044L23 5.33323H6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                                                            <path d="M10 21C10.5523 21 11 20.5523 11 20C11 19.4477 10.5523 19 10 19C9.44772 19 9 19.4477 9 20C9 20.5523 9.44772 21 10 21Z" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                                                            <path d="M19 21C19.5523 21 20 20.5523 20 20C20 19.4477 19.5523 19 19 19C18.4477 19 18 19.4477 18 20C18 20.5523 18.4477 21 19 21Z" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                                                        </svg>
                                                                                    </Grid>
                                                                                    <Grid
                                                                                    sx={{
                                                                                        minWidth: "80px",
                                                                                        width: "28%",
                                                                                        height: "28px",
                                                                                        display: "flex",
                                                                                        justifyContent: "space-between",
                                                                                        alignItems: "center",
                                                                                        flexDirection: "row",
                                                                                        backgroundColor: "P3.main",
                                                                                        borderRadius: "8px",
                                                                                        overflow: "hidden",
                                                                                        color: "P.main",
                                                                                    }}
                                                                                >
                                                                                <Grid
                                                                                    style={{
                                                                                    display: "flex",
                                                                                    alignItems: "center",
                                                                                    textAlign: "center",
                                                                                    width: "28px",
                                                                                    height: "28px",
                                                                                    display: "flex",
                                                                                    flexDirection: "column",
                                                                                    justifyContent:'center',
                                                                                    backgroundColor: "#F5E9EB",
                                                                                    color: "black",
                                                                                    cursor: "pointer",
                                                                                    }}
                                                                                    onClick={() => {
                                                                                        if (rightEye) {
                                                                                            DecreaseCartItem(
                                                                                                rightEyeProduct.id,
                                                                                                shoppingCart.find(card=>card.product_id==rightEyeProduct.id).quantity
                                                                                            );
                                                                                            
                                                                                            
                                                                                        }else if (leftEye) {
                                                                                            DecreaseCartItem(
                                                                                                leftEyeProduct.id,
                                                                                                shoppingCart.find(card=>card.product_id==leftEyeProduct.id).quantity
                                                                                            );
                                                                                                
                                                                                        }else{
                                                                                            DecreaseCartItem(
                                                                                                _selectedV.id,
                                                                                                shoppingCart.find(card=>card.product_id==_selectedV.id).quantity
                                                                                            );
                                                                                                
                                                                                             
                                                                                        }
                                                                                    }}
                                                                                >
                                                                                    -
                                                                                </Grid>
                                                                                <Typography color="Black.amin">

                                                                                    {rightEye?
                                                                                    shoppingCart.find(card=>card.product_id==rightEyeProduct.id).quantity
                                                                                    :leftEye?
                                                                                    shoppingCart.find(card=>card.product_id==leftEyeProduct.id).quantity
                                                                                    :
                                                                                    shoppingCart.find(card=>card.product_id==_selectedV.id).quantity
                                                                                    }
                                                                                </Typography>
                                                                                <Grid
                                                                                    style={{
                                                                                    display: "flex",
                                                                                    alignItems: "center",
                                                                                    textAlign: "center",
                                                                                    width: "28px",
                                                                                    height: "28px",
                                                                                    display: "flex",
                                                                                    flexDirection: "column",
                                                                                    justifyContent:'center',
                                                                                    backgroundColor: "P.main",
                                                                                    color: "#CB929B",
                                                                                    cursor: "pointer",
                                                                                    }}
                                                                                    onClick={() => {
                                                                                        
                                                                                        if(rightEye){
                                                                                        
                                                                                            IncreaseCartItem(
                                                                                                rightEyeProduct.id,
                                                                                                shoppingCart.find(card=>card.product_id==rightEyeProduct.id).quantity
                                                                                            );


                                                                                        }else if(leftEye){
                                                                                        
                                                                                            IncreaseCartItem(
                                                                                                leftEyeProduct.id,
                                                                                                shoppingCart.find(card=>card.product_id==leftEyeProduct.id).quantity
                                                                                            );

                                                                                        
                                                                                        }else{
                                                                                        
                                                                                            IncreaseCartItem(
                                                                                                _selectedV.id,
                                                                                                shoppingCart.find(card=>card.product_id==_selectedV.id).quantity
                                                                                            );

                                                                                        }

                                                                                    }}
                                                                                >
                                                                                    +
                                                                                </Grid>
                                                                                </Grid>
                                                                                        
                                                                                </Grid>
                                                                            :
                                                                                <Button color='Black' variant="contained"  sx={[{
                                                                                    textTransform: 'none', paddingBottom: 0, width: '182px', height: '38px', textAlign: 'end', alignItems: 'center', alignContent: 'flex-end', color: 'P.main',
                                                                                    borderBottomLeftRadius: "0", borderBottomRightRadius: '0', borderTopLeftRadius: "15px", borderTopRightRadius: '15px',fontSize:'16px',fontWeight:'500'
                                                                                    ,paddingTop:0
                                                                                },window.innerWidth<326&&{fontSize:"11px"}]}
                                                                                    onClick={() => {
                                                                                        let _selectedSideAtt_ = { index: selectedSideAtt.index , title: selectedVariantArray[0].side_main_attributes[selectedSideAtt.index].title };
                                                                                        let res = true;
                                                                                        if (_selectedSideAtt[selectedSideAtt.index]!= undefined) {
                                                                                            if (_selectedSideAtt[selectedSideAtt.index].value != '') {
                                                                                                if (_selectedSideAtt_.index<selectedVariantArray[0].side_main_attributes.length-1) {
                                                                                                    if (selectedV !='') {
                                                                                                        let clickedConfirms = isClickedConfirm;
                                                                                                        clickedConfirms[selectedSideAtt.index] = true;
                                                                                                        setIsClickedConfirm(clickedConfirms);
                                                                                                        _selectedSideAtt_ = { index: selectedSideAtt.index + 1, title: selectedVariantArray[0].side_main_attributes[selectedSideAtt.index + 1].title };
                                                                                                        
                                                                                                        let sideValues = []
                                                                                                        const newVariant = _selectedVariantArray.filter(b => b.side_main_attributes.find(a => a.title === selectedSideAtt.title && a.value === selectedV))
                                                                                                        
                                                                                                        newVariant.map(v => {
                                                                                                            sideValues.push(v.side_main_attributes.find(a => a.title === selectedVariantArray[0].side_main_attributes[selectedSideAtt.index + 1].title).value)
                                                                                                        })
                                                                                                        _setSelectedSideAttributes([...new Set(sideValues)])
                                                                                                        setSelectedSideAtt(_selectedSideAtt_);
                                                                                                    }
                                                                                                    _setSelectedIndex('')
                                                                                                }else{
                                                                                                    if (isForTwoEyes) {
                                                                                                        
                                                                                                        if ((selectedVariantArray[0].side_main_attributes.length-1==_selectedSideAtt_.index)&&(selectedVariantArray[0].side_main_attributes.length==_selectedSideAtt.length)) {
                                                                                                            
                                                                                                            let sideValues = []
                                                                                                            let bothVarient = varientOfEyes;
                                                                                                            
                                                                                                            let result = false;
                                                                                                            if (rightEye) {
                                                                                                                _selectedSideAtt_ = { index: _selectedSideAtt_.index+1 , title: _selectedSideAtt_.title };
                                                                                                                setSelectedSideAtt(_selectedSideAtt_);
                                                                                                                setRightEyeProduct(selectedVariant[0])

                                                                                                                setVarientOfEyes(bothVarient)
                                                                                                                _setSelectedVariantArray(_selectedVariantArray_)
                                                                                                                const sideAttributes=[];
                                                                                                                _selectedVariantArray_.map(v => {
                                                                                                                    sideValues.push(v.side_main_attributes.find(a => a.title === _selectedVariantArray_[0].side_main_attributes[0].title).value)
                                                                                                                    for (let index = 0; index < v.side_main_attributes.length; index++) {
                                                                                                                        sideAttributes[index]={ title: v.side_main_attributes[index].title , value:'' }
                                                                                                                    }
                                                                                                                })
                                                                                                                _setSelectedSideAtt(sideAttributes)
                                                                                                                _setSelectedSideAttributes([...new Set(sideValues)])
                                                                                                                setLoadingRigthEye(true);
                                                                                                            }else{
                                                                                                                setLeftEyeProduct(selectedVariant[0]);

                                                                                                                const sideAttributes=[];
                                                                                                                _selectedVariantArray.map(v => {
                                                                                                                    sideValues.push(v.side_main_attributes.find(a => a.title === _selectedVariantArray[0].side_main_attributes[0].title).value)
                                                                                                                    for (let index = 0; index < v.side_main_attributes.length; index++) {
                                                                                                                        sideAttributes[index]={ title: v.side_main_attributes[index].title , value:'' }
                                                                                                                    }
                                                                                                                })
                                                                                                                
                                                                                                                _setSelectedSideAtt(sideAttributes)
                                                                                                                let clickedConfirms = isClickedConfirm;
                                                                                                                for (let index = 0; index < selectedVariantArray[0].side_main_attributes.length; index++) {
                                                                                                                    clickedConfirms[index] = false;
                                                                                                                }
                                                                                                                setIsClickedConfirm(clickedConfirms);
                                                                                                                _selectedSideAtt_ = { index: _selectedSideAtt_.index+1 , title: _selectedSideAtt_.title };
                                                                                                                setSelectedSideAtt(_selectedSideAtt_);
                                                                                                                setLoadingLeftEye(true);
                                                                                                            }
                                                                                                            
                                                                                                            _setTrigger(_trigger+1);
                                                                                                            _setSelectedIndex('')
                                                                                                            
                                                                                                        }
                                                                                                    }else{
                                                                                                        let sideValues = []
                                                                                                        _selectedSideAtt_ = { index: _selectedSideAtt_.index+1 , title: _selectedSideAtt_.title };
                                                                                                        setSelectedSideAtt(_selectedSideAtt_);
                                                                                                        
                                                                                                        _setSelectedV(selectedVariant[0]);
                                                                                                        const sideAttributes=[];
                                                                                                        _selectedVariantArray_.map(v => {
                                                                                                            sideValues.push(v.side_main_attributes.find(a => a.title === _selectedVariantArray_[0].side_main_attributes[0].title).value)
                                                                                                            for (let index = 0; index < v.side_main_attributes.length; index++) {
                                                                                                                sideAttributes[index]={ title: v.side_main_attributes[index].title , value:'' }
                                                                                                            }
                                                                                                        })
                                                                                                        _setSelectedSideAttributes([...new Set(sideValues)])
                                                                                                        _setTrigger(_trigger+1); 
                                                                                                        _setSelectedIndex('')
                                                                                                        _setSelectedVariantArray(_selectedVariantArray_)
                                                                                                        
                                                                                                        _setSelectedSideAtt(sideAttributes)
                                                                                                        let clickedConfirms = isClickedConfirm;
                                                                                                        for (let index = 0; index < selectedVariantArray[0].side_main_attributes.length; index++) {
                                                                                                            clickedConfirms[index] = false;
                                                                                                        }
                                                                                                        setIsClickedConfirm(clickedConfirms);
                                                                                                        setLoading(true);
                                                                                                    }
                                                                                                    
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                        setSelectedV('')
                                                                                        
                                                                                    }}
                                                                                >
                                                                                    {selectedSideAtt.index == 0? "Confirm Sph":selectedSideAtt.index == 1?"Confirm Cyl":selectedSideAtt.index == 2?"Confirm Axis":""}
                                                                                </Button>
                                                                            }
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
                                                                    </Grid>
                                                                
                                                            </Grid>)
                                                            :(selectedVariantArray[0].side_main_attributes.length >1?
                                                            <Grid pt="10px"  ml={(window.innerWidth>932&&window.innerWidth<1133)?"0":0} height='160px' width= {(window.innerWidth>932&&window.innerWidth<1133)? "100%":"100%"} maxWidth={(window.innerWidth>932&&window.innerWidth<1133)? "100%":"100%"} display='flex' justifyContent='center'>
                                                                <Grid  width={window.innerWidth>520?"363px":"100%"} maxWidth={window.innerWidth>520?"363px":"100%"} display='flex' flexWrap='wrap' justifyContent='center' sx={{ borderRadius: "10px", border: '1px solid #DCDCDC' }} p="10px" pb={0}>
                                                                    <Grid xs={12} display='flex' flexWrap='wrap' justifyContent='center'>
                                                                        <Grid xs={8}>
                                                                            {rightEye?
                                                                            (rightEyeProduct!=''?(rightEyeProduct.side_main_attributes).map((side,index) => {
                                                                                return (
                                                                                    <Grid xs={12} display='flex' p={0.4}>
                                                                                        <Typography variant={window.innerWidth>320?"h15":"h39"} color={(side.value!=''&&isClickedConfirm[index])? 'Black.main':'G2.main'}  >{side.title}: </Typography>
                                                                                        <Typography pl={0.5} variant={window.innerWidth>320?"h15":"h39"} color={(side.value!=''&&isClickedConfirm[index])? 'Black.main':'G2.main'} >{side.value}</Typography>
                                                                                    </Grid>
                                                                                )

                                                                            }):'')
                                                                            :leftEye?
                                                                            (leftEyeProduct!=''?(leftEyeProduct.side_main_attributes).map((side,index) => {
                                                                                return (
                                                                                    <Grid xs={12} display='flex' p={0.4}>
                                                                                        <Typography variant={window.innerWidth>320?"h15":"h39"} color={(side.value!=''&&isClickedConfirm[index])? 'Black.main':'G2.main'}  >{side.title}: </Typography>
                                                                                        <Typography pl={0.5} variant={window.innerWidth>320?"h15":"h39"} color={(side.value!=''&&isClickedConfirm[index])? 'Black.main':'G2.main'} >{side.value}</Typography>
                                                                                    </Grid>
                                                                                )

                                                                            }):'')
                                                                            :
                                                                            (_selectedV!=''?(_selectedV.side_main_attributes).map((side,index) => {
                                                                                return (
                                                                                    <Grid xs={12} display='flex' p={0.4}>
                                                                                        <Typography variant={window.innerWidth>320?"h15":"h39"} color={(side.value!=''&&isClickedConfirm[index])? 'Black.main':'G2.main'}  >{side.title}: </Typography>
                                                                                        <Typography pl={0.5} variant={window.innerWidth>320?"h15":"h39"} color={(side.value!=''&&isClickedConfirm[index])? 'Black.main':'G2.main'} >{side.value}</Typography>
                                                                                    </Grid>
                                                                                )

                                                                            }):'')}
                                                                        </Grid>
                                                                        <Grid xs={4} display='flex' flexDirection='column' justifyContent='space-between' sx={isForTwoEyes?{}:{alignSelf:'end'}}>
                                                                            {isForTwoEyes? 
                                                                                (rightEye?
                                                                                <Grid xs={12}  alignItems='end'  alignSelf='center' >
                                                                                    
                                                                                    <SvgIcon
                                                                                        
                                                                                        titleAccess="title"
                                                                                        component={(componentProps) => (
                                                                                                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                                    <path d="M18.4919 17.6523L24.864 17.6523" stroke="#CB929B" stroke-width="3"/>
                                                                                                    <path d="M15.9301 28.8149C19.4879 28.8149 22.5013 27.5803 24.9705 25.1111C27.4397 22.642 28.6743 19.6285 28.6743 16.0708C28.6743 15.4336 28.6344 14.816 28.5548 14.2181C28.4751 13.6212 28.3291 13.044 28.1167 12.4865C27.5592 12.6192 27.0016 12.7191 26.444 12.786C25.8865 12.8518 25.3024 12.8847 24.6917 12.8847C22.2757 12.8847 19.9923 12.367 17.8418 11.3316C15.6912 10.2961 13.8592 8.84911 12.3459 6.99059C11.4963 9.06151 10.2818 10.8606 8.70264 12.3877C7.12237 13.9138 5.2835 15.0619 3.18603 15.8318V16.0708C3.18603 19.6285 4.42062 22.642 6.88979 25.1111C9.35896 27.5803 12.3724 28.8149 15.9301 28.8149ZM15.9301 32.0009C13.7265 32.0009 11.6556 31.5825 9.71739 30.7456C7.77922 29.9098 6.09328 28.7751 4.65957 27.3414C3.22586 25.9076 2.0911 24.2217 1.2553 22.2835C0.418432 20.3454 0 18.2744 0 16.0708C0 13.8671 0.418432 11.7962 1.2553 9.85802C2.0911 7.91985 3.22586 6.23391 4.65957 4.80019C6.09328 3.36648 7.77922 2.23119 9.71739 1.39433C11.6556 0.558526 13.7265 0.140625 15.9301 0.140625C18.1338 0.140625 20.2047 0.558526 22.1429 1.39433C24.0811 2.23119 25.767 3.36648 27.2007 4.80019C28.6344 6.23391 29.7692 7.91985 30.605 9.85802C31.4419 11.7962 31.8603 13.8671 31.8603 16.0708C31.8603 18.2744 31.4419 20.3454 30.605 22.2835C29.7692 24.2217 28.6344 25.9076 27.2007 27.3414C25.767 28.7751 24.0811 29.9098 22.1429 30.7456C20.2047 31.5825 18.1338 32.0009 15.9301 32.0009Z" fill="#CB929B"/>
                                                                                                    <path d="M11.1514 14.4785C8.97907 14.4785 7.12393 15.7997 6.37231 17.6645C7.12393 19.5294 8.97907 20.8506 11.1514 20.8506C13.3237 20.8506 15.1788 19.5294 15.9304 17.6645C15.1788 15.7997 13.3237 14.4785 11.1514 14.4785ZM11.1514 19.7886C9.95225 19.7886 8.97907 18.837 8.97907 17.6645C8.97907 16.4921 9.95225 15.5405 11.1514 15.5405C12.3505 15.5405 13.3237 16.4921 13.3237 17.6645C13.3237 18.837 12.3505 19.7886 11.1514 19.7886ZM11.1514 16.3901C10.4302 16.3901 9.84798 16.9594 9.84798 17.6645C9.84798 18.3697 10.4302 18.939 11.1514 18.939C11.8726 18.939 12.4547 18.3697 12.4547 17.6645C12.4547 16.9594 11.8726 16.3901 11.1514 16.3901Z" fill="#CB929B"/>
                                                                                                </svg>
                                                                                        )}
                                                                                    />
                                                                                </Grid>
                                                                                :
                                                                                <Grid xs={12}  alignItems='end' alignSelf='center' >
                                                                                    
                                                                                    <SvgIcon
                                                                                        
                                                                                        titleAccess="title"
                                                                                        component={(componentProps) => (
                                                                                            <SvgIcon
                                                                                    
                                                                                            titleAccess="title"
                                                                                            component={(componentProps) => (
                                                                                            <svg width="32" height="32" viewBox="0 0 32 32" fill="#CB929B" xmlns="http://www.w3.org/2000/svg">
                                                                                                <path d="M6.92114 17.7725L13.2932 17.7725" stroke="#CB929B" stroke-width="3"/>
                                                                                                <path d="M15.9301 28.6743C19.4879 28.6743 22.5013 27.4397 24.9705 24.9705C27.4397 22.5013 28.6743 19.4879 28.6743 15.9301C28.6743 15.2929 28.6344 14.6754 28.5548 14.0775C28.4751 13.4806 28.3291 12.9034 28.1167 12.3459C27.5592 12.4786 27.0016 12.5784 26.444 12.6454C25.8865 12.7112 25.3024 12.7441 24.6917 12.7441C22.2757 12.7441 19.9923 12.2264 17.8418 11.1909C15.6912 10.1555 13.8592 8.70848 12.3459 6.84996C11.4963 8.92088 10.2818 10.7199 8.70264 12.2471C7.12237 13.7732 5.2835 14.9212 3.18603 15.6912V15.9301C3.18603 19.4879 4.42062 22.5013 6.88979 24.9705C9.35896 27.4397 12.3724 28.6743 15.9301 28.6743ZM15.9301 31.8603C13.7265 31.8603 11.6556 31.4419 9.71739 30.605C7.77922 29.7692 6.09328 28.6344 4.65957 27.2007C3.22586 25.767 2.0911 24.0811 1.2553 22.1429C0.418432 20.2047 0 18.1338 0 15.9301C0 13.7265 0.418432 11.6556 1.2553 9.71739C2.0911 7.77922 3.22586 6.09328 4.65957 4.65957C6.09328 3.22586 7.77922 2.09057 9.71739 1.2537C11.6556 0.417901 13.7265 0 15.9301 0C18.1338 0 20.2047 0.417901 22.1429 1.2537C24.0811 2.09057 25.767 3.22586 27.2007 4.65957C28.6344 6.09328 29.7692 7.77922 30.605 9.71739C31.4419 11.6556 31.8603 13.7265 31.8603 15.9301C31.8603 18.1338 31.4419 20.2047 30.605 22.1429C29.7692 24.0811 28.6344 25.767 27.2007 27.2007C25.767 28.6344 24.0811 29.7692 22.1429 30.605C20.2047 31.4419 18.1338 31.8603 15.9301 31.8603Z" fill="#CB929B"/>
                                                                                                <path d="M20.9285 14.3115C18.7562 14.3115 16.901 15.6327 16.1494 17.4976C16.901 19.3624 18.7562 20.6836 20.9285 20.6836C23.1008 20.6836 24.9559 19.3624 25.7075 17.4976C24.9559 15.6327 23.1008 14.3115 20.9285 14.3115ZM20.9285 19.6216C19.7294 19.6216 18.7562 18.67 18.7562 17.4976C18.7562 16.3251 19.7294 15.3735 20.9285 15.3735C22.1276 15.3735 23.1008 16.3251 23.1008 17.4976C23.1008 18.67 22.1276 19.6216 20.9285 19.6216ZM20.9285 16.2231C20.2073 16.2231 19.6251 16.7924 19.6251 17.4976C19.6251 18.2027 20.2073 18.772 20.9285 18.772C21.6497 18.772 22.2318 18.2027 22.2318 17.4976C22.2318 16.7924 21.6497 16.2231 20.9285 16.2231Z" fill="#CB929B"/>
                                                                                            </svg>
                                                                                            )}
                                                                                        />
                                                                                        )}
                                                                                    />
                                                                                </Grid>

                                                                                )
                                                                            :''}
                                                                            <Grid xs={12}  alignItems='end'  alignSelf='center'>
                                                                                <Typography variant={window.innerWidth>320?"h32":"h15"} fontWeight='600'>{rightEye?numberWithCommas(rightEyeProduct.price) :leftEye?numberWithCommas(leftEyeProduct.price):numberWithCommas(_selectedV.price)}</Typography>
                                                                            </Grid>

                                                                        </Grid>
                                                                    </Grid>
                                                                    <Grid xs={6} display='flex' justifyContent='center' alignItems='center' 
                                                                        height='38px' pt="1.1px" alignSelf='end'
                                                                    >
                                                                        
                                                                        {(rightEye&&selectedVariants.find(v=>v=="Right eye")!=undefined&&shoppingCart.find(card=>card.product_id==rightEyeProduct.id)!=undefined)||(leftEye&&selectedVariants.find(v=>v=="Left eye")!=undefined&&shoppingCart.find(card=>card.product_id==leftEyeProduct.id)!=undefined) || (!rightEye&&!leftEye&&selectedVariants.find(v=>v==0)!=undefined&&shoppingCart.find(card=>card.product_id==_selectedV.id)!=undefined)?
                                                                            <Grid bgcolor='P.main'  sx={[{
                                                                                textTransform: 'none', paddingBottom: 0, width: '182px', height: '38px',display:'flex',justifyContent:'center' ,textAlign: 'end', alignItems: 'center', alignContent: 'flex-end',
                                                                                borderBottomLeftRadius: "0", borderBottomRightRadius: '0', borderTopLeftRadius: "15px", borderTopRightRadius: '15px'
                                                                            },window.innerWidth<326&&{fontSize:"11px"}]}
                                                                            >
                                                                                <Grid height='100%' display={"flex"} alignItems='center' pr="18px" 
                                                                                    onClick={()=>{
                                                                                        setShowCartPage(true)
                                                                                    }}
                                                                                sx={{cursor:'pointer'}}
                                                                                >
                                                                                    <svg width="24" height="22" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                        <path d="M1 1H5L7.68 12.6044C7.77144 13.0034 8.02191 13.3618 8.38755 13.6169C8.75318 13.872 9.2107 14.0075 9.68 13.9997H19.4C19.8693 14.0075 20.3268 13.872 20.6925 13.6169C21.0581 13.3618 21.3086 13.0034 21.4 12.6044L23 5.33323H6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                                                        <path d="M10 21C10.5523 21 11 20.5523 11 20C11 19.4477 10.5523 19 10 19C9.44772 19 9 19.4477 9 20C9 20.5523 9.44772 21 10 21Z" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                                                        <path d="M19 21C19.5523 21 20 20.5523 20 20C20 19.4477 19.5523 19 19 19C18.4477 19 18 19.4477 18 20C18 20.5523 18.4477 21 19 21Z" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                                                    </svg>
                                                                                </Grid>
                                                                                <Grid
                                                                                sx={{
                                                                                    minWidth: "80px",
                                                                                    width: "28%",
                                                                                    height: "28px",
                                                                                    display: "flex",
                                                                                    justifyContent: "space-between",
                                                                                    alignItems: "center",
                                                                                    flexDirection: "row",
                                                                                    backgroundColor: "P3.main",
                                                                                    borderRadius: "8px",
                                                                                    overflow: "hidden",
                                                                                    color: "P.main",
                                                                                }}
                                                                            >
                                                                            <Grid
                                                                                style={{
                                                                                display: "flex",
                                                                                alignItems: "center",
                                                                                textAlign: "center",
                                                                                width: "28px",
                                                                                height: "28px",
                                                                                display: "flex",
                                                                                flexDirection: "column",
                                                                                justifyContent:'center',
                                                                                backgroundColor: "#F5E9EB",
                                                                                color: "black",
                                                                                cursor: "pointer",
                                                                                }}
                                                                                onClick={() => {
                                                                                    if (rightEye) {
                                                                                        DecreaseCartItem(
                                                                                            rightEyeProduct.id,
                                                                                            shoppingCart.find(card=>card.product_id==rightEyeProduct.id).quantity
                                                                                        );
                                                                                        
                                                                                        
                                                                                    }else if (leftEye) {
                                                                                        DecreaseCartItem(
                                                                                            leftEyeProduct.id,
                                                                                            shoppingCart.find(card=>card.product_id==leftEyeProduct.id).quantity
                                                                                        );
                                                                                    }else{
                                                                                        DecreaseCartItem(
                                                                                            _selectedV.id,
                                                                                            shoppingCart.find(card=>card.product_id==_selectedV.id).quantity
                                                                                        );
                                                                                    }
                                                                                }}
                                                                            >
                                                                                -
                                                                            </Grid>
                                                                            <Typography color="Black.amin">

                                                                                {rightEye?
                                                                                shoppingCart.find(card=>card.product_id==rightEyeProduct.id).quantity
                                                                                :leftEye?
                                                                                shoppingCart.find(card=>card.product_id==leftEyeProduct.id).quantity
                                                                                :
                                                                                shoppingCart.find(card=>card.product_id==_selectedV.id).quantity
                                                                                }
                                                                            </Typography>
                                                                            <Grid
                                                                                style={{
                                                                                display: "flex",
                                                                                alignItems: "center",
                                                                                textAlign: "center",
                                                                                width: "28px",
                                                                                height: "28px",
                                                                                display: "flex",
                                                                                flexDirection: "column",
                                                                                justifyContent:'center',
                                                                                backgroundColor: "P.main",
                                                                                color: "#CB929B",
                                                                                cursor: "pointer",
                                                                                }}
                                                                                onClick={() => {
                                                                                    
                                                                                    if(rightEye){
                                                                                        
                                                                                        IncreaseCartItem(
                                                                                            rightEyeProduct.id,
                                                                                            shoppingCart.find(card=>card.product_id==rightEyeProduct.id).quantity
                                                                                        );
                                                                                        

                                                                                    }else if(leftEye){
                                                                                        
                                                                                        IncreaseCartItem(
                                                                                            leftEyeProduct.id,
                                                                                            shoppingCart.find(card=>card.product_id==leftEyeProduct.id).quantity
                                                                                        );
                                                                                        

                                                                                    }else{
                                                                                        
                                                                                        IncreaseCartItem(
                                                                                            _selectedV.id,
                                                                                            shoppingCart.find(card=>card.product_id==_selectedV.id).quantity
                                                                                        );

                                                                                    }

                                                                                }}
                                                                            >
                                                                                +
                                                                            </Grid>
                                                                            </Grid>
                                                                                 
                                                                            </Grid>
                                                                        :
                                                                            <Button color='Black' variant="contained" sx={[{alignSelf:'end',
                                                                            textTransform: 'none',paddingTop:0, paddingBottom: 0, width: '182px', height: '38px', textAlign: 'end', alignItems: 'center', alignContent: 'flex-end',
                                                                            borderBottomLeftRadius: "0", borderBottomRightRadius: '0', borderTopLeftRadius: "15px", borderTopRightRadius: '15px'
                                                                            ,color:'P.main',fontSize:'16px',fontWeight:'500'},window.innerWidth<326&&{fontSize:"11px"}]}
                                                                                onClick={() => {
                                                                                    let varients = selectedVariants;
                                                                                    if (rightEye) {
                                                                                        addToCard(rightEyeProduct.id)
                                                                                        
                                                                                        if (localStorage.getItem("token")) {
                                                                                            setTimeout(()=>{
                                                                                                varients.push('Right eye')
                                                                                                setSelectedVariants(varients);
                                                                                            },2000)
                                                                                        }
                                                                                    }else if(leftEye){
                                                                                        addToCard(leftEyeProduct.id)
                                                                                        if (localStorage.getItem("token")) {
                                                                                            setTimeout(()=>{
                                                                                                varients.push('Left eye')
                                                                                                setSelectedVariants(varients);
                                                                                            })
                                                                                        }
                                                                                        setLeftEye(true)
                                                                                    }else{
                                                                                        addToCard(_selectedV.id);
                                                                                        if (localStorage.getItem("token")) {
                                                                                            setTimeout(()=>{
                                                                                                varients.push(0);
                                                                                                setSelectedVariants(varients);
                                                                                            },2000)
                                                                                        }
                                                                                    }
                                                                                    
                                                                                    _setTrigger(_trigger+1);
                                                                                    
                                                                                }}
                                                                            >
                                                                                Add To Cart
                                                                            </Button>
                                                                        }
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
                                                                </Grid>
                                                            </Grid>
                                                            :
                                                            <Grid  pt="10px" ml={(window.innerWidth>932&&window.innerWidth<1133)?"0":0} height='160px'  width= {(window.innerWidth>932&&window.innerWidth<1133)? "100%":"100%"} maxWidth={(window.innerWidth>932&&window.innerWidth<1133)? "100%":"100%"} display='flex' justifyContent='center'>
                                                                <Grid  width={window.innerWidth>520?"363px":"100%"} maxWidth={window.innerWidth>520?"363px":"100%"} display='flex' flexWrap='wrap' justifyContent='center' sx={{ borderRadius: "10px", border: '1px solid #DCDCDC' }} p={2} pb={0}>
                                                                    <Grid xs={12} display='flex' flexWrap='wrap' justifyContent='center'>

                                                                        <Grid xs={8}>
                                                                            { 
                                                                            (_selectedSideAtt[0].value!=''?
                                                                                (_selectedSideAtt.map((side,index) => {
                                                                                    return (
                                                                                        <Grid xs={12} display='flex' p={0.4}>
                                                                                            <Typography variant={window.innerWidth>320?"h15":"h39"} fontWeight='400' color={(side.value!=''&&isClickedConfirm[index])? 'Black.main':'G2.main'}  >{side.title}: </Typography>
                                                                                            <Typography pl={0.5} variant={window.innerWidth>320?"h15":"h39"} color={(side.value!=''&&isClickedConfirm[index])? 'Black.main':'G2.main'} >{side.value}</Typography>
                                                                                        </Grid>
                                                                                    )

                                                                                }))
                                                                            :(
                                                                                rightEye?
                                                                                (_rightEyeProduct!=''?(_rightEyeProduct.side_main_attributes).map((side,index) => {
                                                                                    return (
                                                                                        <Grid xs={12} display='flex' p={0.4}>
                                                                                            <Typography variant={window.innerWidth>320?"h15":"h39"} color={(side.value!=''&&isClickedConfirm[index])? 'Black.main':'G2.main'}  >{side.title}: </Typography>
                                                                                            <Typography pl={0.5} variant={window.innerWidth>320?"h15":"h39"} color={(side.value!=''&&isClickedConfirm[index])? 'Black.main':'G2.main'} >{side.value}</Typography>
                                                                                        </Grid>
                                                                                    )

                                                                                }):
                                                                                (_selectedSideAtt.map((side,index) => {
                                                                                    return (
                                                                                        <Grid xs={12} display='flex' p={0.4}>
                                                                                            <Typography variant={window.innerWidth>320?"h15":"h39"} fontWeight='400' color={(side.value!=''&&isClickedConfirm[index])? 'Black.main':'G2.main'}  >{side.title}: </Typography>
                                                                                            <Typography pl={0.5} variant={window.innerWidth>320?"h15":"h39"} color={(side.value!=''&&isClickedConfirm[index])? 'Black.main':'G2.main'} >{side.value}</Typography>
                                                                                        </Grid>
                                                                                    )

                                                                                }))
                                                                                )
                                                                            : leftEye?
                                                                                (_leftEyeProduct!=''?(_leftEyeProduct.side_main_attributes).map((side,index) => {
                                                                                    return (
                                                                                        <Grid xs={12} display='flex' p={0.4}>
                                                                                            <Typography variant={window.innerWidth>320?"h15":"h39"} color={(side.value!=''&&isClickedConfirm[index])? 'Black.main':'G2.main'}  >{side.title}: </Typography>
                                                                                            <Typography pl={0.5} variant={window.innerWidth>320?"h15":"h39"} color={(side.value!=''&&isClickedConfirm[index])? 'Black.main':'G2.main'} >{side.value}</Typography>
                                                                                        </Grid>
                                                                                    )

                                                                                }):
                                                                                (_selectedSideAtt.map((side,index) => {
                                                                                    return (
                                                                                        <Grid xs={12} display='flex' p={0.4}>
                                                                                            <Typography variant={window.innerWidth>320?"h15":"h39"} fontWeight='400' color={(side.value!=''&&isClickedConfirm[index])? 'Black.main':'G2.main'}  >{side.title}: </Typography>
                                                                                            <Typography pl={0.5} variant={window.innerWidth>320?"h15":"h39"} color={(side.value!=''&&isClickedConfirm[index])? 'Black.main':'G2.main'} >{side.value}</Typography>
                                                                                        </Grid>
                                                                                    )

                                                                                }))
                                                                                )
                                                                            :  (_selectedV_!=''?(_selectedV_.side_main_attributes).map((side,index) => {
                                                                                    return (
                                                                                        <Grid xs={12} display='flex' p={0.4}>
                                                                                            <Typography variant={window.innerWidth>320?"h15":"h39"} color={(side.value!=''&&isClickedConfirm[index])? 'Black.main':'G2.main'}  >{side.title}: </Typography>
                                                                                            <Typography pl={0.5} variant={window.innerWidth>320?"h15":"h39"} color={(side.value!=''&&isClickedConfirm[index])? 'Black.main':'G2.main'} >{side.value}</Typography>
                                                                                        </Grid>
                                                                                    )

                                                                                }):
                                                                            
                                                                                (_selectedSideAtt.map((side,index) => {
                                                                                    return (
                                                                                        <Grid xs={12} display='flex' p={0.4}>
                                                                                            <Typography variant={window.innerWidth>320?"h15":"h39"} fontWeight='400' color={(side.value!=''&&isClickedConfirm[index])? 'Black.main':'G2.main'}  >{side.title}: </Typography>
                                                                                            <Typography pl={0.5} variant={window.innerWidth>320?"h15":"h39"} color={(side.value!=''&&isClickedConfirm[index])? 'Black.main':'G2.main'} >{side.value}</Typography>
                                                                                        </Grid>
                                                                                    )

                                                                                }))
                                                                            )
                                                                            ))
                                                                            }
                                                                        </Grid>
                                                                        <Grid xs={4} display='flex' flexDirection='column' justifyContent='space-between' sx={isForTwoEyes?{}:{alignSelf:'end'}} >
                                                                            {isForTwoEyes? 
                                                                                (rightEye?
                                                                                <Grid xs={12}  alignItems='end'  alignSelf='center' >
                                                                                    
                                                                                    <SvgIcon
                                                                                        
                                                                                        titleAccess="title"
                                                                                        component={(componentProps) => (
                                                                                                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                                    <path d="M18.4919 17.6523L24.864 17.6523" stroke="#CB929B" stroke-width="3"/>
                                                                                                    <path d="M15.9301 28.8149C19.4879 28.8149 22.5013 27.5803 24.9705 25.1111C27.4397 22.642 28.6743 19.6285 28.6743 16.0708C28.6743 15.4336 28.6344 14.816 28.5548 14.2181C28.4751 13.6212 28.3291 13.044 28.1167 12.4865C27.5592 12.6192 27.0016 12.7191 26.444 12.786C25.8865 12.8518 25.3024 12.8847 24.6917 12.8847C22.2757 12.8847 19.9923 12.367 17.8418 11.3316C15.6912 10.2961 13.8592 8.84911 12.3459 6.99059C11.4963 9.06151 10.2818 10.8606 8.70264 12.3877C7.12237 13.9138 5.2835 15.0619 3.18603 15.8318V16.0708C3.18603 19.6285 4.42062 22.642 6.88979 25.1111C9.35896 27.5803 12.3724 28.8149 15.9301 28.8149ZM15.9301 32.0009C13.7265 32.0009 11.6556 31.5825 9.71739 30.7456C7.77922 29.9098 6.09328 28.7751 4.65957 27.3414C3.22586 25.9076 2.0911 24.2217 1.2553 22.2835C0.418432 20.3454 0 18.2744 0 16.0708C0 13.8671 0.418432 11.7962 1.2553 9.85802C2.0911 7.91985 3.22586 6.23391 4.65957 4.80019C6.09328 3.36648 7.77922 2.23119 9.71739 1.39433C11.6556 0.558526 13.7265 0.140625 15.9301 0.140625C18.1338 0.140625 20.2047 0.558526 22.1429 1.39433C24.0811 2.23119 25.767 3.36648 27.2007 4.80019C28.6344 6.23391 29.7692 7.91985 30.605 9.85802C31.4419 11.7962 31.8603 13.8671 31.8603 16.0708C31.8603 18.2744 31.4419 20.3454 30.605 22.2835C29.7692 24.2217 28.6344 25.9076 27.2007 27.3414C25.767 28.7751 24.0811 29.9098 22.1429 30.7456C20.2047 31.5825 18.1338 32.0009 15.9301 32.0009Z" fill="#CB929B"/>
                                                                                                    <path d="M11.1514 14.4785C8.97907 14.4785 7.12393 15.7997 6.37231 17.6645C7.12393 19.5294 8.97907 20.8506 11.1514 20.8506C13.3237 20.8506 15.1788 19.5294 15.9304 17.6645C15.1788 15.7997 13.3237 14.4785 11.1514 14.4785ZM11.1514 19.7886C9.95225 19.7886 8.97907 18.837 8.97907 17.6645C8.97907 16.4921 9.95225 15.5405 11.1514 15.5405C12.3505 15.5405 13.3237 16.4921 13.3237 17.6645C13.3237 18.837 12.3505 19.7886 11.1514 19.7886ZM11.1514 16.3901C10.4302 16.3901 9.84798 16.9594 9.84798 17.6645C9.84798 18.3697 10.4302 18.939 11.1514 18.939C11.8726 18.939 12.4547 18.3697 12.4547 17.6645C12.4547 16.9594 11.8726 16.3901 11.1514 16.3901Z" fill="#CB929B"/>
                                                                                                </svg>
                                                                                        )}
                                                                                    />
                                                                                </Grid>
                                                                                :
                                                                                <Grid xs={12}  alignItems='end' alignSelf='center' >
                                                                                    
                                                                                    <SvgIcon
                                                                                        
                                                                                        titleAccess="title"
                                                                                        component={(componentProps) => (
                                                                                            <SvgIcon
                                                                                    
                                                                                            titleAccess="title"
                                                                                            component={(componentProps) => (
                                                                                            <svg width="32" height="32" viewBox="0 0 32 32" fill="#CB929B" xmlns="http://www.w3.org/2000/svg">
                                                                                                <path d="M6.92114 17.7725L13.2932 17.7725" stroke="#CB929B" stroke-width="3"/>
                                                                                                <path d="M15.9301 28.6743C19.4879 28.6743 22.5013 27.4397 24.9705 24.9705C27.4397 22.5013 28.6743 19.4879 28.6743 15.9301C28.6743 15.2929 28.6344 14.6754 28.5548 14.0775C28.4751 13.4806 28.3291 12.9034 28.1167 12.3459C27.5592 12.4786 27.0016 12.5784 26.444 12.6454C25.8865 12.7112 25.3024 12.7441 24.6917 12.7441C22.2757 12.7441 19.9923 12.2264 17.8418 11.1909C15.6912 10.1555 13.8592 8.70848 12.3459 6.84996C11.4963 8.92088 10.2818 10.7199 8.70264 12.2471C7.12237 13.7732 5.2835 14.9212 3.18603 15.6912V15.9301C3.18603 19.4879 4.42062 22.5013 6.88979 24.9705C9.35896 27.4397 12.3724 28.6743 15.9301 28.6743ZM15.9301 31.8603C13.7265 31.8603 11.6556 31.4419 9.71739 30.605C7.77922 29.7692 6.09328 28.6344 4.65957 27.2007C3.22586 25.767 2.0911 24.0811 1.2553 22.1429C0.418432 20.2047 0 18.1338 0 15.9301C0 13.7265 0.418432 11.6556 1.2553 9.71739C2.0911 7.77922 3.22586 6.09328 4.65957 4.65957C6.09328 3.22586 7.77922 2.09057 9.71739 1.2537C11.6556 0.417901 13.7265 0 15.9301 0C18.1338 0 20.2047 0.417901 22.1429 1.2537C24.0811 2.09057 25.767 3.22586 27.2007 4.65957C28.6344 6.09328 29.7692 7.77922 30.605 9.71739C31.4419 11.6556 31.8603 13.7265 31.8603 15.9301C31.8603 18.1338 31.4419 20.2047 30.605 22.1429C29.7692 24.0811 28.6344 25.767 27.2007 27.2007C25.767 28.6344 24.0811 29.7692 22.1429 30.605C20.2047 31.4419 18.1338 31.8603 15.9301 31.8603Z" fill="#CB929B"/>
                                                                                                <path d="M20.9285 14.3115C18.7562 14.3115 16.901 15.6327 16.1494 17.4976C16.901 19.3624 18.7562 20.6836 20.9285 20.6836C23.1008 20.6836 24.9559 19.3624 25.7075 17.4976C24.9559 15.6327 23.1008 14.3115 20.9285 14.3115ZM20.9285 19.6216C19.7294 19.6216 18.7562 18.67 18.7562 17.4976C18.7562 16.3251 19.7294 15.3735 20.9285 15.3735C22.1276 15.3735 23.1008 16.3251 23.1008 17.4976C23.1008 18.67 22.1276 19.6216 20.9285 19.6216ZM20.9285 16.2231C20.2073 16.2231 19.6251 16.7924 19.6251 17.4976C19.6251 18.2027 20.2073 18.772 20.9285 18.772C21.6497 18.772 22.2318 18.2027 22.2318 17.4976C22.2318 16.7924 21.6497 16.2231 20.9285 16.2231Z" fill="#CB929B"/>
                                                                                            </svg>
                                                                                            )}
                                                                                        />
                                                                                        )}
                                                                                    />
                                                                                </Grid>

                                                                                )
                                                                            :''}
                                                                            <Grid xs={12}  alignItems='end'  alignSelf='center'>
                                                                                <Typography variant={window.innerWidth>320?"h32":"h15"} fontWeight='600'>{_selectedSideAtt[_selectedSideAtt.length-1].value !=''? numberWithCommas(selectedVariantArray[0].price):(rightEye?(_rightEyeProduct !=''? numberWithCommas(_rightEyeProduct.price):'0.0 KWD'):leftEye?((_leftEyeProduct !=''? numberWithCommas(_leftEyeProduct.price):'0.0 KWD')):((_selectedV_ !=''? numberWithCommas(_selectedV_.price):'0.0 KWD')))}</Typography>
                                                                            </Grid>

                                                                        </Grid>
                                                                    </Grid>
                                                                    <Grid xs={6} display='flex' justifyContent='center' alignItems='center' 
                                                                        height='38px' pt="1.1px" alignSelf='end'
                                                                    >
                                                                        {(rightEye&&selectedVariants.find(v=>v=="Right eye")!=undefined&&shoppingCart.find(card=>card.product_id==_rightEyeProduct.id)!=undefined)||(leftEye&&selectedVariants.find(v=>v=="Left eye")!=undefined&&shoppingCart.find(card=>card.product_id==_leftEyeProduct.id)!=undefined) || (!rightEye&&!leftEye&&selectedVariants.find(v=>v==0)!=undefined&&shoppingCart.find(card=>card.product_id==_selectedV_.id)!=undefined)?
                                                                            <Grid bgcolor='P.main'  sx={[{
                                                                                textTransform: 'none', paddingBottom: 0, width: '182px', height: '38px',display:'flex',justifyContent:'center' ,textAlign: 'end', alignItems: 'center', alignContent: 'flex-end',
                                                                                borderBottomLeftRadius: "0", borderBottomRightRadius: '0', borderTopLeftRadius: "15px", borderTopRightRadius: '15px'
                                                                            },window.innerWidth<326&&{fontSize:"11px"}]}
                                                                            >
                                                                                <Grid height='100%' display={"flex"} alignItems='center' pr="18px" 
                                                                                    onClick={()=>{
                                                                                        setShowCartPage(true)
                                                                                    }}
                                                                                sx={{cursor:'pointer'}}
                                                                                >
                                                                                    <svg width="24" height="22" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                        <path d="M1 1H5L7.68 12.6044C7.77144 13.0034 8.02191 13.3618 8.38755 13.6169C8.75318 13.872 9.2107 14.0075 9.68 13.9997H19.4C19.8693 14.0075 20.3268 13.872 20.6925 13.6169C21.0581 13.3618 21.3086 13.0034 21.4 12.6044L23 5.33323H6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                                                        <path d="M10 21C10.5523 21 11 20.5523 11 20C11 19.4477 10.5523 19 10 19C9.44772 19 9 19.4477 9 20C9 20.5523 9.44772 21 10 21Z" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                                                        <path d="M19 21C19.5523 21 20 20.5523 20 20C20 19.4477 19.5523 19 19 19C18.4477 19 18 19.4477 18 20C18 20.5523 18.4477 21 19 21Z" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                                                    </svg>
                                                                                </Grid>
                                                                                <Grid
                                                                                sx={{
                                                                                    minWidth: "80px",
                                                                                    width: "28%",
                                                                                    height: "28px",
                                                                                    display: "flex",
                                                                                    justifyContent: "space-between",
                                                                                    alignItems: "center",
                                                                                    flexDirection: "row",
                                                                                    backgroundColor: "P3.main",
                                                                                    borderRadius: "8px",
                                                                                    overflow: "hidden",
                                                                                    color: "P.main",
                                                                                }}
                                                                            >
                                                                            <Grid
                                                                                style={{
                                                                                display: "flex",
                                                                                alignItems: "center",
                                                                                textAlign: "center",
                                                                                width: "28px",
                                                                                height: "28px",
                                                                                display: "flex",
                                                                                flexDirection: "column",
                                                                                justifyContent:'center',
                                                                                backgroundColor: "#F5E9EB",
                                                                                color: "black",
                                                                                cursor: "pointer",
                                                                                }}
                                                                                onClick={() => {
                                                                                    if (rightEye) {
                                                                                        DecreaseCartItem(
                                                                                            _rightEyeProduct.id,
                                                                                            shoppingCart.find(card=>card.product_id==_rightEyeProduct.id).quantity
                                                                                        );
                                                                                        
                                                                                    }else if (leftEye) {
                                                                                        DecreaseCartItem(
                                                                                            _leftEyeProduct.id,
                                                                                            shoppingCart.find(card=>card.product_id==_leftEyeProduct.id).quantity
                                                                                        );
                                                                                    }else{
                                                                                        DecreaseCartItem(
                                                                                            _selectedV_.id,
                                                                                            shoppingCart.find(card=>card.product_id==_selectedV_.id).quantity
                                                                                        );
                                                                                    }
                                                                                }}
                                                                            >
                                                                                -
                                                                            </Grid>
                                                                            <Typography color="Black.amin">

                                                                                {rightEye?
                                                                                shoppingCart.find(card=>card.product_id==_rightEyeProduct.id).quantity
                                                                                :leftEye?
                                                                                shoppingCart.find(card=>card.product_id==_leftEyeProduct.id).quantity
                                                                                :
                                                                                shoppingCart.find(card=>card.product_id==_selectedV_.id).quantity
                                                                                }
                                                                            </Typography>
                                                                            <Grid
                                                                                style={{
                                                                                display: "flex",
                                                                                alignItems: "center",
                                                                                textAlign: "center",
                                                                                width: "28px",
                                                                                height: "28px",
                                                                                display: "flex",
                                                                                flexDirection: "column",
                                                                                justifyContent:'center',
                                                                                backgroundColor: "P.main",
                                                                                color: "#CB929B",
                                                                                cursor: "pointer",
                                                                                }}
                                                                                onClick={() => {
                                                                                    
                                                                                    if(rightEye){
                                                                                        
                                                                                        IncreaseCartItem(
                                                                                            _rightEyeProduct.id,
                                                                                            shoppingCart.find(card=>card.product_id==_rightEyeProduct.id).quantity
                                                                                        );

                                                                                    }else if(leftEye){
                                                                                        
                                                                                        IncreaseCartItem(
                                                                                            _leftEyeProduct.id,
                                                                                            shoppingCart.find(card=>card.product_id==_leftEyeProduct.id).quantity
                                                                                        );

                                                                                    }else{
                                                                                    
                                                                                        IncreaseCartItem(
                                                                                            _selectedV_.id,
                                                                                            shoppingCart.find(card=>card.product_id==_selectedV_.id).quantity
                                                                                        );


                                                                                    }

                                                                                }}
                                                                            >
                                                                                +
                                                                            </Grid>
                                                                            </Grid>
                                                                                
                                                                            </Grid>
                                                                        :
                                                                        <Button color='Black' variant="contained" sx={[{alignSelf:'end',
                                                                            textTransform: 'none',paddingTop:0 ,  paddingBottom: 0, width: '182px', height: '38px', textAlign: 'end', alignItems: 'center', alignContent: 'flex-end',
                                                                            borderBottomLeftRadius: "0", borderBottomRightRadius: '0', borderTopLeftRadius: "15px", borderTopRightRadius: '15px'
                                                                        ,color:'P.main',fontSize:'16px',fontWeight:'500'},window.innerWidth<326&&{fontSize:"11px"}]}
                                                                            onClick={async() => {
                                                                                const newVariant = _selectedVariantArray.filter(b => b.side_main_attributes.find(a => a.title === selectedSideAtt.title && a.value === selectedV))
                                                                                let varients = selectedVariants;
                                                                                if (newVariant[0]!=undefined) {
                                                                                    if (rightEye) {
                                                                                      await  _setRightEyeProduct(newVariant[0])
                                                                                      addToCard(newVariant[0].id)
                                                                                      await  _setRightEyeProduct(newVariant[0])
                                                                                      if (localStorage.getItem("token")) {
                                                                                          setTimeout(()=>{
                                                                                            _setRightEyeProduct(newVariant[0])
                                                                                                varients.push('Right eye')
                                                                                                setSelectedVariants(varients);
                                                                                            },2000)
                                                                                        }

                                                                                    }else if(leftEye){
                                                                                        await _setLeftEyeProduct(newVariant[0])
                                                                                        addToCard(newVariant[0].id)
                                                                                        await _setLeftEyeProduct(newVariant[0])
                                                                                        if (localStorage.getItem("token")) {
                                                                                            setTimeout(()=>{
                                                                                                _setLeftEyeProduct(newVariant[0])
                                                                                                varients.push('Left eye')
                                                                                                setSelectedVariants(varients);
                                                                                            })
                                                                                        }
                                                                                        setLeftEye(true)
                                                                                    }else{
                                                                                        await _setSelectedV_(newVariant[0])
                                                                                        addToCard(newVariant[0].id)
                                                                                        await _setSelectedV_(newVariant[0])
                                                                                        if (localStorage.getItem("token")) {
                                                                                            setTimeout(()=>{
                                                                                                _setSelectedV_(newVariant[0])
                                                                                                varients.push(0);
                                                                                                setSelectedVariants(varients);
                                                                                            },2000)
                                                                                        }
                                                                                        
                                                                                    }
                                                                                    
                                                                                }
                                                                                
                                                                                _setTrigger(_trigger+1);
                                                                                setTrigger(trigger+1);
                                                                                
                                                                            }}
                                                                        >
                                                                            Add to card
                                                                        </Button>
                                                                        }
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
                                                                </Grid>
                                                            </Grid>
                                                            )
                                                            
                                                            }
                                                            

                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                    )
                                    }
                                </Grid>
                            </Grid>
                        }

                        {window.innerWidth>1035?(
                            isForTwoEyes?
                            (<Grid xs={12} display='flex' justifyContent='flex-end' >
                                <Grid width="64px" height="480px" display='flex' flexDirection='column' sx={{mt:window.innerWidth>=1200?"-455px" :window.innerWidth>899?"-576px":"-435px"}} >
                                    <Grid xs={12} display='flex'    flexDirection='column' height="54px" 
                                    justifyContent='center' 
                                    sx={[{borderTopLeftRadius:"73px"
                                        
                                        ,alignItems:'end',
                                        cursor:'pointer'
                                    },rightEye?{background:"linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), #000000",zIndex:100,borderBottomLeftRadius:"71px"}:{bgcolor:"G3.main",zIndex:0}]}
                                        onClick={()=>{
                                            _setSelectedVariantArray(_selectedVariantArray_)
                                            setVarientOfEyes([])
                                            
                                            _setTrigger(_trigger+1);
                                            _setSelectedIndex('')
                                            
                                            
                                            const selectedSideAttributes=[];
                                            let clickedConfirms = isClickedConfirm;
                                            let selectedAtt = { index: 0 , title: selectedVariantArray[0].side_main_attributes[0].title };
                                            let sideValues = []

                                            for (let index = 0; index < selectedVariantArray[0].side_main_attributes.length; index++) {
                                                clickedConfirms[index] = false;
                                            }
                                            setIsClickedConfirm(clickedConfirms);
                                            setSelectedSideAtt(selectedAtt);

                                            _selectedVariantArray_.map(v => {
                                                sideValues.push(v.side_main_attributes.find(a => a.title === _selectedVariantArray_[0].side_main_attributes[0].title).value)
                                                for (let index = 0; index < v.side_main_attributes.length; index++) {
                                                    selectedSideAttributes[index]={ title: v.side_main_attributes[index].title , value:'' }
                                                }
                                            })
                                            _setSelectedSideAtt(selectedSideAttributes)
                                            _setSelectedSideAttributes([...new Set(sideValues)])
                                            _setTrigger(_trigger+1); 
                                                                                    
                                            setRightEye(true);
                                            setLeftEye(false)
                                        }}
                                    >
                                        <Grid width="64px" display='flex' flexDirection='column' alignItems='center' justifyContent='center'>
                                            <Grid>
                                                <SvgIcon
                                                    titleAccess="title"
                                                    component={(componentProps) => (
                                                        <svg width="18" height="72" viewBox="0 0 18 72"  xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M13 66.024L8.552 68.584L8.552 69.976L13 69.976L13 71.8L1.88 71.8L1.88 67.96C1.88 67.1067 2.02933 66.3867 2.328 65.8C2.62667 65.2027 3.02667 64.76 3.528 64.472C4.02933 64.1733 4.58933 64.024 5.208 64.024C5.93333 64.024 6.59467 64.2373 7.192 64.664C7.77867 65.08 8.17867 65.7253 8.392 66.6L13 63.848L13 66.024ZM7.096 69.976L7.096 67.96C7.096 67.2773 6.92533 66.7653 6.584 66.424C6.24267 66.072 5.784 65.896 5.208 65.896C4.632 65.896 4.184 66.0667 3.864 66.408C3.53333 66.7493 3.368 67.2667 3.368 67.96L3.368 69.976L7.096 69.976ZM3.016 60.7626C3.016 61.0933 2.904 61.3706 2.68 61.5946C2.456 61.8186 2.17867 61.9306 1.848 61.9306C1.51733 61.9306 1.24 61.8186 1.016 61.5946C0.791999 61.3706 0.679999 61.0933 0.679999 60.7626C0.679999 60.4426 0.791999 60.1706 1.016 59.9466C1.24 59.7226 1.51733 59.6106 1.848 59.6106C2.17867 59.6106 2.456 59.7226 2.68 59.9466C2.904 60.1706 3.016 60.4426 3.016 60.7626ZM4.184 59.8666L13 59.8666L13 61.6906L4.184 61.6906L4.184 59.8666ZM4.04 53.9199C4.04 53.2372 4.17867 52.6345 4.456 52.1119C4.72267 51.5785 5.05867 51.1625 5.464 50.8639L4.184 50.8639L4.184 49.0239L13.144 49.0239C13.9547 49.0239 14.6747 49.1945 15.304 49.5359C15.944 49.8772 16.4453 50.3732 16.808 51.0239C17.1707 51.6639 17.352 52.4319 17.352 53.3279C17.352 54.5225 17.0693 55.5145 16.504 56.3039C15.9493 57.0932 15.192 57.5412 14.232 57.6479L14.232 55.8399C14.6907 55.7012 15.0587 55.4079 15.336 54.9599C15.624 54.5012 15.768 53.9572 15.768 53.3279C15.768 52.5919 15.544 51.9999 15.096 51.5519C14.648 51.0932 13.9973 50.8639 13.144 50.8639L11.672 50.8639C12.088 51.1732 12.44 51.5945 12.728 52.1279C13.0053 52.6505 13.144 53.2479 13.144 53.9199C13.144 54.6879 12.952 55.3919 12.568 56.0319C12.1733 56.6612 11.6293 57.1625 10.936 57.5359C10.232 57.8985 9.43733 58.0799 8.552 58.0799C7.66667 58.0799 6.88267 57.8985 6.2 57.5359C5.51733 57.1625 4.98933 56.6612 4.616 56.0319C4.232 55.3919 4.04 54.6879 4.04 53.9199ZM8.584 50.8639C7.976 50.8639 7.448 50.9919 7 51.2479C6.552 51.4932 6.21067 51.8185 5.976 52.2239C5.74133 52.6292 5.624 53.0665 5.624 53.5359C5.624 54.0052 5.74133 54.4425 5.976 54.8479C6.2 55.2532 6.536 55.5839 6.984 55.8399C7.42133 56.0852 7.944 56.2079 8.552 56.2079C9.16 56.2079 9.69333 56.0852 10.152 55.8399C10.6107 55.5839 10.9627 55.2532 11.208 54.8479C11.4427 54.4319 11.56 53.9945 11.56 53.5359C11.56 53.0665 11.4427 52.6292 11.208 52.2239C10.9733 51.8185 10.632 51.4932 10.184 51.2479C9.72533 50.9919 9.192 50.8639 8.584 50.8639ZM4.04 42.0681C4.04 41.3961 4.184 40.7988 4.472 40.2761C4.76 39.7428 5.18666 39.3268 5.752 39.0281C6.31733 38.7188 7 38.5641 7.8 38.5641L13 38.5641L13 40.3721L8.072 40.3721C7.28266 40.3721 6.68 40.5695 6.264 40.9641C5.83733 41.3588 5.624 41.8975 5.624 42.5801C5.624 43.2628 5.83733 43.8068 6.264 44.2121C6.68 44.6068 7.28266 44.8041 8.072 44.8041L13 44.8041L13 46.6281L1.16 46.6281L1.16 44.8041L5.208 44.8041C4.83467 44.4948 4.54667 44.1055 4.344 43.6361C4.14133 43.1561 4.04 42.6335 4.04 42.0681ZM5.672 34.1095L10.552 34.1095C10.8827 34.1095 11.1227 34.0348 11.272 33.8855C11.4107 33.7255 11.48 33.4588 11.48 33.0855L11.48 31.9655L13 31.9655L13 33.4055C13 34.2268 12.808 34.8562 12.424 35.2935C12.04 35.7308 11.416 35.9495 10.552 35.9495L5.672 35.9495L5.672 36.9895L4.184 36.9895L4.184 35.9495L1.992 35.9495L1.992 34.1095L4.184 34.1095L4.184 31.9655L5.672 31.9655L5.672 34.1095ZM3.352 24.3041L6.616 24.3041L6.616 20.4641L8.104 20.4641L8.104 24.3041L11.512 24.3041L11.512 19.9841L13 19.9841L13 26.1281L1.864 26.1281L1.864 19.9841L3.352 19.9841L3.352 24.3041ZM4.184 9.8015L17.144 15.2095L17.144 17.0975L12.856 15.3055L4.184 18.7775L4.184 16.7455L10.904 14.2655L4.184 11.6895L4.184 9.8015ZM8.376 0.344999C8.70666 0.344999 9.00533 0.366332 9.272 0.408999L9.272 7.145C9.976 7.09167 10.5413 6.83033 10.968 6.361C11.3947 5.89167 11.608 5.31567 11.608 4.633C11.608 3.65167 11.1973 2.95833 10.376 2.553L10.376 0.584999C11.1867 0.851666 11.8533 1.337 12.376 2.041C12.888 2.73433 13.144 3.59833 13.144 4.633C13.144 5.47567 12.9573 6.233 12.584 6.905C12.2 7.56633 11.6667 8.089 10.984 8.473C10.2907 8.84633 9.49066 9.033 8.584 9.033C7.67733 9.033 6.88266 8.85167 6.2 8.489C5.50666 8.11567 4.97333 7.59833 4.6 6.937C4.22666 6.265 4.04 5.497 4.04 4.633C4.04 3.801 4.22133 3.05967 4.584 2.409C4.94666 1.75833 5.45866 1.25167 6.12 0.888999C6.77066 0.526332 7.52266 0.344999 8.376 0.344999ZM7.8 2.249C7.128 2.25967 6.58933 2.49967 6.184 2.969C5.77866 3.43833 5.576 4.01967 5.576 4.713C5.576 5.34233 5.77866 5.881 6.184 6.329C6.57866 6.777 7.11733 7.04367 7.8 7.129L7.8 2.249Z" fill={rightEye?"#CB929B":"black"}/>
                                                        </svg>

                                                    )}
                                                />

                                            </Grid>
                                            <Grid pt="10px">
                                                <SvgIcon
                                                    
                                                    titleAccess="title"
                                                    component={(componentProps) => (
                                                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M6.92114 17.7725L13.2932 17.7725" stroke={rightEye?"#CB929B":"black"} stroke-width="3"/>
                                                            <path d="M15.9301 28.6743C19.4879 28.6743 22.5013 27.4397 24.9705 24.9705C27.4397 22.5013 28.6743 19.4879 28.6743 15.9301C28.6743 15.2929 28.6344 14.6754 28.5548 14.0775C28.4751 13.4806 28.3291 12.9034 28.1167 12.3459C27.5592 12.4786 27.0016 12.5784 26.444 12.6454C25.8865 12.7112 25.3024 12.7441 24.6917 12.7441C22.2757 12.7441 19.9923 12.2264 17.8418 11.1909C15.6912 10.1555 13.8592 8.70848 12.3459 6.84996C11.4963 8.92088 10.2818 10.7199 8.70264 12.2471C7.12237 13.7732 5.2835 14.9212 3.18603 15.6912V15.9301C3.18603 19.4879 4.42062 22.5013 6.88979 24.9705C9.35896 27.4397 12.3724 28.6743 15.9301 28.6743ZM15.9301 31.8603C13.7265 31.8603 11.6556 31.4419 9.71739 30.605C7.77922 29.7692 6.09328 28.6344 4.65957 27.2007C3.22586 25.767 2.0911 24.0811 1.2553 22.1429C0.418432 20.2047 0 18.1338 0 15.9301C0 13.7265 0.418432 11.6556 1.2553 9.71739C2.0911 7.77922 3.22586 6.09328 4.65957 4.65957C6.09328 3.22586 7.77922 2.09057 9.71739 1.2537C11.6556 0.417901 13.7265 0 15.9301 0C18.1338 0 20.2047 0.417901 22.1429 1.2537C24.0811 2.09057 25.767 3.22586 27.2007 4.65957C28.6344 6.09328 29.7692 7.77922 30.605 9.71739C31.4419 11.6556 31.8603 13.7265 31.8603 15.9301C31.8603 18.1338 31.4419 20.2047 30.605 22.1429C29.7692 24.0811 28.6344 25.767 27.2007 27.2007C25.767 28.6344 24.0811 29.7692 22.1429 30.605C20.2047 31.4419 18.1338 31.8603 15.9301 31.8603Z" fill={rightEye?"#CB929B":"black"}/>
                                                            <path d="M20.9285 14.3115C18.7562 14.3115 16.901 15.6327 16.1494 17.4976C16.901 19.3624 18.7562 20.6836 20.9285 20.6836C23.1008 20.6836 24.9559 19.3624 25.7075 17.4976C24.9559 15.6327 23.1008 14.3115 20.9285 14.3115ZM20.9285 19.6216C19.7294 19.6216 18.7562 18.67 18.7562 17.4976C18.7562 16.3251 19.7294 15.3735 20.9285 15.3735C22.1276 15.3735 23.1008 16.3251 23.1008 17.4976C23.1008 18.67 22.1276 19.6216 20.9285 19.6216ZM20.9285 16.2231C20.2073 16.2231 19.6251 16.7924 19.6251 17.4976C19.6251 18.2027 20.2073 18.772 20.9285 18.772C21.6497 18.772 22.2318 18.2027 22.2318 17.4976C22.2318 16.7924 21.6497 16.2231 20.9285 16.2231Z" fill={rightEye?"#CB929B":"black"}/>
                                                        </svg>
                                                    )}
                                                />

                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid xs={12}   mt="-58px" sx={leftEye?{zIndex:100} :{}}>
                                        <Grid xs={12} display='flex' flexDirection='column' 
                                        
                                        height="100%"
                                        justifyContent='center' 
                                        sx={[{borderBottomLeftRadius:"71px"
                                            ,alignItems:'end',
                                            cursor:'pointer'
                                        },leftEye?{background:"linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), #000000",borderTopLeftRadius:"73px",zIndex:1000}:{bgcolor:"G3.main"}]}
                                            
                                        onClick={()=>{
                                            _setSelectedVariantArray(_selectedVariantArray_)
                                                                                    
                                            setVarientOfEyes([])
                                            _setTrigger(_trigger+1);
                                            _setSelectedIndex('')
                                            
                                            
                                            const selectedVariant3=[];
                                            _selectedVariantArray_.map(v => {
                                                for (let index = 0; index < v.side_main_attributes.length; index++) {
                                                    selectedVariant3[index]={ title: v.side_main_attributes[index].title , value:'' }
                                                }
                                            })
                                            _setSelectedSideAtt(selectedVariant3)
                                            
                                            let clickedConfirms = isClickedConfirm;
                                            for (let index = 0; index < selectedVariantArray[0].side_main_attributes.length; index++) {
                                                clickedConfirms[index] = false;
                                            }
                                            setIsClickedConfirm(clickedConfirms);      
                                            let selectedVariant2 = { index: 0 , title: selectedVariantArray[0].side_main_attributes[0].title };
                                            setSelectedSideAtt(selectedVariant2);
                                            let sideValues = []
                                            _selectedVariantArray.map(v => {
                                                sideValues.push(v.side_main_attributes.find(a => a.title === _selectedVariantArray[0].side_main_attributes[0].title).value)
                                                for (let index = 0; index < v.side_main_attributes.length; index++) {
                                                    selectedVariant3[index]={ title: v.side_main_attributes[index].title , value:'' }
                                                }
                                            })
                                            _setSelectedSideAtt(selectedVariant3)
                                            for (let index = 0; index < selectedVariantArray[0].side_main_attributes.length; index++) {
                                                clickedConfirms[index] = false;
                                            }
                                            setIsClickedConfirm(clickedConfirms);
                                            selectedVariant2 = { index: 0 , title: selectedVariantArray[0].side_main_attributes[0].title };
                                            setSelectedSideAtt(selectedVariant2);
                                            _selectedVariantArray_.map(v => {
                                                sideValues.push(v.side_main_attributes.find(a => a.title === _selectedVariantArray_[0].side_main_attributes[0].title).value)
                                                for (let index = 0; index < v.side_main_attributes.length; index++) {
                                                    selectedVariant3[index]={ title: v.side_main_attributes[index].title , value:'' }
                                                }
                                            })
                                            _setSelectedSideAttributes([...new Set(sideValues)])
                                            _setTrigger(_trigger+1); 
                                                                               
                                            setRightEye(false);setLeftEye(true); _setTrigger(_trigger+1)
                                            setSelectedSideAttributes([])}}
                                        >
                                            <Grid width="64px" pt="18px"  display='flex' flexDirection='column' alignItems='center' justifyContent='center'>
                                                <Grid >
                                                    <svg width="18" height="59" viewBox="0 0 18 59"  xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M11.528 56.976L11.528 53.216L13 53.216L13 58.8L1.88 58.8L1.88 56.976L11.528 56.976ZM8.376 43.6106C8.70667 43.6106 9.00533 43.632 9.272 43.6746L9.272 50.4106C9.976 50.3573 10.5413 50.096 10.968 49.6266C11.3947 49.1573 11.608 48.5813 11.608 47.8986C11.608 46.9173 11.1973 46.224 10.376 45.8186L10.376 43.8506C11.1867 44.1173 11.8533 44.6026 12.376 45.3066C12.888 46 13.144 46.864 13.144 47.8986C13.144 48.7413 12.9573 49.4986 12.584 50.1706C12.2 50.832 11.6667 51.3546 10.984 51.7386C10.2907 52.112 9.49067 52.2986 8.584 52.2986C7.67733 52.2986 6.88267 52.1173 6.2 51.7546C5.50667 51.3813 4.97333 50.864 4.6 50.2026C4.22667 49.5306 4.04 48.7626 4.04 47.8986C4.04 47.0666 4.22133 46.3253 4.584 45.6746C4.94667 45.024 5.45867 44.5173 6.12 44.1546C6.77067 43.792 7.52267 43.6106 8.376 43.6106ZM7.8 45.5146C7.128 45.5253 6.58933 45.7653 6.184 46.2346C5.77867 46.704 5.576 47.2853 5.576 47.9786C5.576 48.608 5.77867 49.1466 6.184 49.5946C6.57867 50.0426 7.11733 50.3093 7.8 50.3946L7.8 45.5146ZM5.672 38.1196L5.672 39.7516L13 39.7516L13 41.5916L5.672 41.5916L5.672 42.6316L4.184 42.6316L4.184 41.5916L3.56 41.5916C2.54667 41.5916 1.81066 41.325 1.352 40.7916C0.882665 40.2476 0.647999 39.3996 0.647999 38.2476L2.168 38.2476C2.168 38.8023 2.27467 39.1916 2.488 39.4156C2.69067 39.6396 3.048 39.7516 3.56 39.7516L4.184 39.7516L4.184 38.1196L5.672 38.1196ZM5.672 34.3751L10.552 34.3751C10.8827 34.3751 11.1227 34.3005 11.272 34.1511C11.4107 33.9911 11.48 33.7245 11.48 33.3511L11.48 32.2311L13 32.2311L13 33.6711C13 34.4925 12.808 35.1218 12.424 35.5591C12.04 35.9965 11.416 36.2151 10.552 36.2151L5.672 36.2151L5.672 37.2551L4.184 37.2551L4.184 36.2151L1.992 36.2151L1.992 34.3751L4.184 34.3751L4.184 32.2311L5.672 32.2311L5.672 34.3751ZM3.352 24.5697L6.616 24.5697L6.616 20.7297L8.104 20.7297L8.104 24.5697L11.512 24.5697L11.512 20.2497L13 20.2497L13 26.3937L1.864 26.3937L1.864 20.2497L3.352 20.2497L3.352 24.5697ZM4.184 10.0671L17.144 15.4751L17.144 17.3631L12.856 15.5711L4.184 19.0431L4.184 17.0111L10.904 14.5311L4.184 11.9551L4.184 10.0671ZM8.376 0.610624C8.70666 0.610624 9.00533 0.631957 9.272 0.674624L9.272 7.41062C9.976 7.35729 10.5413 7.09596 10.968 6.62662C11.3947 6.15729 11.608 5.58129 11.608 4.89862C11.608 3.91729 11.1973 3.22396 10.376 2.81862L10.376 0.850624C11.1867 1.11729 11.8533 1.60262 12.376 2.30662C12.888 2.99996 13.144 3.86396 13.144 4.89862C13.144 5.74129 12.9573 6.49862 12.584 7.17062C12.2 7.83196 11.6667 8.35462 10.984 8.73862C10.2907 9.11196 9.49066 9.29862 8.584 9.29862C7.67733 9.29862 6.88266 9.11729 6.2 8.75462C5.50666 8.38129 4.97333 7.86396 4.6 7.20262C4.22666 6.53062 4.04 5.76262 4.04 4.89862C4.04 4.06662 4.22133 3.32529 4.584 2.67462C4.94666 2.02396 5.45866 1.51729 6.12 1.15462C6.77066 0.791957 7.52266 0.610624 8.376 0.610624ZM7.8 2.51462C7.128 2.52529 6.58933 2.76529 6.184 3.23462C5.77866 3.70396 5.576 4.28529 5.576 4.97862C5.576 5.60796 5.77866 6.14662 6.184 6.59462C6.57866 7.04262 7.11733 7.30929 7.8 7.39462L7.8 2.51462Z" fill={leftEye?"#CB929B":"black"}/>
                                                    </svg>

                                                </Grid>
                                                <Grid pt="7px">
                                                    <SvgIcon
                                                        
                                                        titleAccess="title"
                                                        component={(componentProps) => (
                                                            <svg width="32" height="32" viewBox="0 0 32 32" fill={leftEye?"#CB929B":"black"} xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M18.4919 17.6523L24.864 17.6523" stroke={leftEye?"#CB929B":"black"} stroke-width="3"/>
                                                                <path d="M15.9301 28.8149C19.4879 28.8149 22.5013 27.5803 24.9705 25.1111C27.4397 22.642 28.6743 19.6285 28.6743 16.0708C28.6743 15.4336 28.6344 14.816 28.5548 14.2181C28.4751 13.6212 28.3291 13.044 28.1167 12.4865C27.5592 12.6192 27.0016 12.7191 26.444 12.786C25.8865 12.8518 25.3024 12.8847 24.6917 12.8847C22.2757 12.8847 19.9923 12.367 17.8418 11.3316C15.6912 10.2961 13.8592 8.84911 12.3459 6.99059C11.4963 9.06151 10.2818 10.8606 8.70264 12.3877C7.12237 13.9138 5.2835 15.0619 3.18603 15.8318V16.0708C3.18603 19.6285 4.42062 22.642 6.88979 25.1111C9.35896 27.5803 12.3724 28.8149 15.9301 28.8149ZM15.9301 32.0009C13.7265 32.0009 11.6556 31.5825 9.71739 30.7456C7.77922 29.9098 6.09328 28.7751 4.65957 27.3414C3.22586 25.9076 2.0911 24.2217 1.2553 22.2835C0.418432 20.3454 0 18.2744 0 16.0708C0 13.8671 0.418432 11.7962 1.2553 9.85802C2.0911 7.91985 3.22586 6.23391 4.65957 4.80019C6.09328 3.36648 7.77922 2.23119 9.71739 1.39433C11.6556 0.558526 13.7265 0.140625 15.9301 0.140625C18.1338 0.140625 20.2047 0.558526 22.1429 1.39433C24.0811 2.23119 25.767 3.36648 27.2007 4.80019C28.6344 6.23391 29.7692 7.91985 30.605 9.85802C31.4419 11.7962 31.8603 13.8671 31.8603 16.0708C31.8603 18.2744 31.4419 20.3454 30.605 22.2835C29.7692 24.2217 28.6344 25.9076 27.2007 27.3414C25.767 28.7751 24.0811 29.9098 22.1429 30.7456C20.2047 31.5825 18.1338 32.0009 15.9301 32.0009Z" fill={leftEye?"#CB929B":"black"}/>
                                                                <path d="M11.1514 14.4785C8.97907 14.4785 7.12393 15.7997 6.37231 17.6645C7.12393 19.5294 8.97907 20.8506 11.1514 20.8506C13.3237 20.8506 15.1788 19.5294 15.9304 17.6645C15.1788 15.7997 13.3237 14.4785 11.1514 14.4785ZM11.1514 19.7886C9.95225 19.7886 8.97907 18.837 8.97907 17.6645C8.97907 16.4921 9.95225 15.5405 11.1514 15.5405C12.3505 15.5405 13.3237 16.4921 13.3237 17.6645C13.3237 18.837 12.3505 19.7886 11.1514 19.7886ZM11.1514 16.3901C10.4302 16.3901 9.84798 16.9594 9.84798 17.6645C9.84798 18.3697 10.4302 18.939 11.1514 18.939C11.8726 18.939 12.4547 18.3697 12.4547 17.6645C12.4547 16.9594 11.8726 16.3901 11.1514 16.3901Z" fill={leftEye?"#CB929B":"black"}/>
                                                            </svg>


                                                        )}
                                                    />

                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>)
                            :'')
                            :
                            ((isForTwoEyes&&((window.scrollY > (document.body.scrollHeight - (window.innerWidth>700?2150:window.innerWidth>600?2300:2000))) &&(window.scrollY < (document.body.scrollHeight -(window.innerWidth>700?1760:window.innerWidth>600?1800:window.innerWidth>380?1450:window.innerWidth>330?1450:1500) ))))?
                                <Grid width='100%' height="50px" display='flex' justifyContent='center'  position="fixed" bottom="0" mr="1px" ml='1px' zIndex={100}>
                                    <Grid width='100%' height="100%" display='flex' justifyContent='center' >
                                        <Grid width='64.5%'   mr="-58px" sx={leftEye?{zIndex:100} :{}}>
                                            <Grid width='100%' display='flex'  
                                            justifyContent='center' 
                                            height="100%"
                                            sx={[{borderTopLeftRadius:"71px"
                                                ,alignItems:'center',
                                                cursor:'pointer'
                                            },leftEye?{background:"linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), #000000",zIndex:100,borderTopRightRadius:"71px"}:{bgcolor:"G3.main",zIndex:0}]}
                                            
                                            onClick={()=>{
                                                    
                                    
                                                _setSelectedVariantArray(_selectedVariantArray_);
                                                                                        
                                                setVarientOfEyes([]);
                                                _setTrigger(_trigger+1);
                                                _setSelectedIndex('');
                                                
                                                
                                                const selectedSideAttributes=[];
                                                
                                                let clickedConfirms = isClickedConfirm;    
                                                let sideValues = []
                                                let selectedSideAtt = { index: 0 , title: selectedVariantArray[0].side_main_attributes[0].title };

                                                for (let index = 0; index < selectedVariantArray[0].side_main_attributes.length; index++) {
                                                    clickedConfirms[index] = false;
                                                }
                                                setIsClickedConfirm(clickedConfirms);
                                                setSelectedSideAtt(selectedSideAtt);
                                                
                                                _selectedVariantArray_.map(v => {
                                                    sideValues.push(v.side_main_attributes.find(a => a.title === _selectedVariantArray_[0].side_main_attributes[0].title).value)
                                                    for (let index = 0; index < v.side_main_attributes.length; index++) {
                                                        selectedSideAttributes[index]={ title: v.side_main_attributes[index].title , value:'' }
                                                    }
                                                })
                                                _setSelectedSideAtt(selectedSideAttributes)
                                                _setSelectedSideAttributes([...new Set(sideValues)])
                                                _setTrigger(_trigger+1); 
                                                                                        
                                                setRightEye(false);setLeftEye(true)
                                                setSelectedSideAttributes([])
                                
                                            }} 
                                            >
                                            
                                                <Grid width='100%' height="100%"   display='flex' justifyContent='center' alignItems='center' >
                                                    <Grid >
                                                        <SvgIcon
                                                            
                                                            titleAccess="title"
                                                            component={(componentProps) => (
                                                                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M18.4919 17.6523L24.864 17.6523" stroke={leftEye?"#CB929B":"black"} stroke-width="3"/>
                                                                    <path d="M15.9301 28.8149C19.4879 28.8149 22.5013 27.5803 24.9705 25.1111C27.4397 22.642 28.6743 19.6285 28.6743 16.0708C28.6743 15.4336 28.6344 14.816 28.5548 14.2181C28.4751 13.6212 28.3291 13.044 28.1167 12.4865C27.5592 12.6192 27.0016 12.7191 26.444 12.786C25.8865 12.8518 25.3024 12.8847 24.6917 12.8847C22.2757 12.8847 19.9923 12.367 17.8418 11.3316C15.6912 10.2961 13.8592 8.84911 12.3459 6.99059C11.4963 9.06151 10.2818 10.8606 8.70264 12.3877C7.12237 13.9138 5.2835 15.0619 3.18603 15.8318V16.0708C3.18603 19.6285 4.42062 22.642 6.88979 25.1111C9.35896 27.5803 12.3724 28.8149 15.9301 28.8149ZM15.9301 32.0009C13.7265 32.0009 11.6556 31.5825 9.71739 30.7456C7.77922 29.9098 6.09328 28.7751 4.65957 27.3414C3.22586 25.9076 2.0911 24.2217 1.2553 22.2835C0.418432 20.3454 0 18.2744 0 16.0708C0 13.8671 0.418432 11.7962 1.2553 9.85802C2.0911 7.91985 3.22586 6.23391 4.65957 4.80019C6.09328 3.36648 7.77922 2.23119 9.71739 1.39433C11.6556 0.558526 13.7265 0.140625 15.9301 0.140625C18.1338 0.140625 20.2047 0.558526 22.1429 1.39433C24.0811 2.23119 25.767 3.36648 27.2007 4.80019C28.6344 6.23391 29.7692 7.91985 30.605 9.85802C31.4419 11.7962 31.8603 13.8671 31.8603 16.0708C31.8603 18.2744 31.4419 20.3454 30.605 22.2835C29.7692 24.2217 28.6344 25.9076 27.2007 27.3414C25.767 28.7751 24.0811 29.9098 22.1429 30.7456C20.2047 31.5825 18.1338 32.0009 15.9301 32.0009Z" fill={leftEye?"#CB929B":"black"}/>
                                                                    <path d="M11.1514 14.4785C8.97907 14.4785 7.12393 15.7997 6.37231 17.6645C7.12393 19.5294 8.97907 20.8506 11.1514 20.8506C13.3237 20.8506 15.1788 19.5294 15.9304 17.6645C15.1788 15.7997 13.3237 14.4785 11.1514 14.4785ZM11.1514 19.7886C9.95225 19.7886 8.97907 18.837 8.97907 17.6645C8.97907 16.4921 9.95225 15.5405 11.1514 15.5405C12.3505 15.5405 13.3237 16.4921 13.3237 17.6645C13.3237 18.837 12.3505 19.7886 11.1514 19.7886ZM11.1514 16.3901C10.4302 16.3901 9.84798 16.9594 9.84798 17.6645C9.84798 18.3697 10.4302 18.939 11.1514 18.939C11.8726 18.939 12.4547 18.3697 12.4547 17.6645C12.4547 16.9594 11.8726 16.3901 11.1514 16.3901Z" fill={leftEye?"#CB929B":"black"}/>
                                                                </svg>
    
    
                                                            )}
                                                        />
    
                                                    </Grid>
                                                    <Grid pl='13px'>
                                                        <Typography variant="h18" color={leftEye?"P.main":"Black.main"} fontWeight='bold'>Left Eye</Typography>
    
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid width='57%' display='flex'   height="100%" 
                                        justifyContent='center' 
                                        sx={[{alignItems:'center'
                                            
                                            ,borderTopRightRadius:"71px",
                                            cursor:'pointer'
                                        },rightEye?{background:"linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), #000000",borderTopLeftRadius:"73px",zIndex:100}:{bgcolor:"G3.main"}]}
                                            
                                        onClick={()=>{
                                            _setSelectedVariantArray(_selectedVariantArray_)
                                                                                    
                                            setVarientOfEyes([])
                                            _setTrigger(_trigger+1);
                                            _setSelectedIndex('')
                                            
                                            
                                            const selectedVariant3=[];
                                            _selectedVariantArray_.map(v => {
                                                for (let index = 0; index < v.side_main_attributes.length; index++) {
                                                    selectedVariant3[index]={ title: v.side_main_attributes[index].title , value:'' }
                                                }
                                            })
                                            _setSelectedSideAtt(selectedVariant3)
                                            
                                            let clickedConfirms = isClickedConfirm;
                                            for (let index = 0; index < selectedVariantArray[0].side_main_attributes.length; index++) {
                                                clickedConfirms[index] = false;
                                            }
                                            setIsClickedConfirm(clickedConfirms);      
                                            let selectedVariant2 = { index: 0 , title: selectedVariantArray[0].side_main_attributes[0].title };
                                            setSelectedSideAtt(selectedVariant2);
                                            let sideValues = []
                                            _selectedVariantArray.map(v => {
                                                sideValues.push(v.side_main_attributes.find(a => a.title === _selectedVariantArray[0].side_main_attributes[0].title).value)
                                                for (let index = 0; index < v.side_main_attributes.length; index++) {
                                                    selectedVariant3[index]={ title: v.side_main_attributes[index].title , value:'' }
                                                }
                                            })
                                            _setSelectedSideAtt(selectedVariant3)
                                            for (let index = 0; index < selectedVariantArray[0].side_main_attributes.length; index++) {
                                                clickedConfirms[index] = false;
                                            }
                                            setIsClickedConfirm(clickedConfirms);
                                            selectedVariant2 = { index: 0 , title: selectedVariantArray[0].side_main_attributes[0].title };
                                            setSelectedSideAtt(selectedVariant2);
                                            _selectedVariantArray_.map(v => {
                                                sideValues.push(v.side_main_attributes.find(a => a.title === _selectedVariantArray_[0].side_main_attributes[0].title).value)
                                                for (let index = 0; index < v.side_main_attributes.length; index++) {
                                                    selectedVariant3[index]={ title: v.side_main_attributes[index].title , value:'' }
                                                }
                                            })
                                            _setSelectedSideAttributes([...new Set(sideValues)])
                                            _setTrigger(_trigger+1); 
                                                                               
                                            setRightEye(true);setLeftEye(false); _setTrigger(_trigger+1)}}
                                        >
                                            <Grid width='100%' display='flex' justifyContent='center' alignItems='center' height="100%" >
                                                <Grid width='100%' display='flex' justifyContent='center' alignItems='center' height="100%" >
                                                    <Grid >
                                                        <SvgIcon
                                                            
                                                            titleAccess="title"
                                                            component={(componentProps) => (
                                                                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M6.92114 17.7725L13.2932 17.7725" stroke={rightEye?"#CB929B":"black"} stroke-width="3"/>
                                                                    <path d="M15.9301 28.6743C19.4879 28.6743 22.5013 27.4397 24.9705 24.9705C27.4397 22.5013 28.6743 19.4879 28.6743 15.9301C28.6743 15.2929 28.6344 14.6754 28.5548 14.0775C28.4751 13.4806 28.3291 12.9034 28.1167 12.3459C27.5592 12.4786 27.0016 12.5784 26.444 12.6454C25.8865 12.7112 25.3024 12.7441 24.6917 12.7441C22.2757 12.7441 19.9923 12.2264 17.8418 11.1909C15.6912 10.1555 13.8592 8.70848 12.3459 6.84996C11.4963 8.92088 10.2818 10.7199 8.70264 12.2471C7.12237 13.7732 5.2835 14.9212 3.18603 15.6912V15.9301C3.18603 19.4879 4.42062 22.5013 6.88979 24.9705C9.35896 27.4397 12.3724 28.6743 15.9301 28.6743ZM15.9301 31.8603C13.7265 31.8603 11.6556 31.4419 9.71739 30.605C7.77922 29.7692 6.09328 28.6344 4.65957 27.2007C3.22586 25.767 2.0911 24.0811 1.2553 22.1429C0.418432 20.2047 0 18.1338 0 15.9301C0 13.7265 0.418432 11.6556 1.2553 9.71739C2.0911 7.77922 3.22586 6.09328 4.65957 4.65957C6.09328 3.22586 7.77922 2.09057 9.71739 1.2537C11.6556 0.417901 13.7265 0 15.9301 0C18.1338 0 20.2047 0.417901 22.1429 1.2537C24.0811 2.09057 25.767 3.22586 27.2007 4.65957C28.6344 6.09328 29.7692 7.77922 30.605 9.71739C31.4419 11.6556 31.8603 13.7265 31.8603 15.9301C31.8603 18.1338 31.4419 20.2047 30.605 22.1429C29.7692 24.0811 28.6344 25.767 27.2007 27.2007C25.767 28.6344 24.0811 29.7692 22.1429 30.605C20.2047 31.4419 18.1338 31.8603 15.9301 31.8603Z" fill={rightEye?"#CB929B":"black"}/>
                                                                    <path d="M20.9285 14.3115C18.7562 14.3115 16.901 15.6327 16.1494 17.4976C16.901 19.3624 18.7562 20.6836 20.9285 20.6836C23.1008 20.6836 24.9559 19.3624 25.7075 17.4976C24.9559 15.6327 23.1008 14.3115 20.9285 14.3115ZM20.9285 19.6216C19.7294 19.6216 18.7562 18.67 18.7562 17.4976C18.7562 16.3251 19.7294 15.3735 20.9285 15.3735C22.1276 15.3735 23.1008 16.3251 23.1008 17.4976C23.1008 18.67 22.1276 19.6216 20.9285 19.6216ZM20.9285 16.2231C20.2073 16.2231 19.6251 16.7924 19.6251 17.4976C19.6251 18.2027 20.2073 18.772 20.9285 18.772C21.6497 18.772 22.2318 18.2027 22.2318 17.4976C22.2318 16.7924 21.6497 16.2231 20.9285 16.2231Z" fill={rightEye?"#CB929B":"black"}/>
                                                                </svg>
                                                            )}
                                                        />
        
                                                    </Grid>
                                                    <Typography pl="13px" variant="h18" fontWeight='bold' color={rightEye?'P.main':"Black.main"}>Right Eye</Typography>
    
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                :'')
                        
                        }
                        <Hidden mdDown>
                            {window.innerWidth>1035?
                                <Grid  xs={12} display='flex' backgroundColor='G3.main'
                                mt="150px"
                                >
                                    <Grid md={7} display='flex' justifyContent='center' flexDirection='column' pl={8} pr={8}>
                                        <Typography pb={1} variant='h30' fontWeight='600'>Description</Typography>
                                        <Typography variant='h36'> {product.description} </Typography>
                                    </Grid>
                                    <Grid xs={5} display='flex' height='411px'  sx={{ backgroundColor: 'G3.main' }}>
                                    <CardMedia
                                        component="img"
                                        sx={{opacity:'0.7'}}
                                        height='411px'
                                        width='100%'
                                        image={product.file_urls != undefined ? axiosConfig.defaults.baseURL + product.file_urls[0].image_url : NoProductImage}
                                    />                            
                                    </Grid>
                                </Grid>
                            :
                                <Grid xs={10} md={window.innerWidth>1035?7:9} mt="30px"  sx={window.innerWidth<1035?{width: "95%" , margin:'auto' }:{}} display='flex' justifyContent='center'>
                                    <Grid xs={12} md={12}  >

                                    <Grid sx={window.innerWidth>1035?{ width: "95%" , margin:'auto' }:{}} >
                                    <Accordion sx={{border:'none' , boxShadow:'none',width:'100%',p:0}} defaultExpanded={true}>
                                    
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                            sx={{p:0}}
                                        >
                                            <Typography pb={1} variant='h7' color='G1.main'>Description</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails sx={{pr:window.innerWidth>900?0:"3px",pl:0}}>
                                            <Grid xs={12} display='flex' flexWrap='wrap' justifyContent='center'
                                    >
                                        <Grid xs={6} >
                                            <Grid xs={12} display='flex' justifyContent='center'>
                                                <CardMedia
                                                    component="img"
                                                    height='185px'
                                                    width="185px"
                                                    sx={{maxWidth:'185px',maxHeight:'185px'}}
                                                    image={product.file_urls != undefined ? axiosConfig.defaults.baseURL + product.file_urls[0].image_url : NoProductImage}
                                                />
                                            </Grid>
                                        </Grid>
                                        <Grid xs={12} display='flex' justifyContent='center' flexDirection='column' >
                                            <Typography ml="10px" variant='h10' pt="8px"> {product.description} </Typography>
                                        </Grid>
                                        
                                            </Grid> 
                                        </AccordionDetails>
                                    </Accordion>  
                                    </Grid>
                                    </Grid>
                                </Grid>
                            }
                        </Hidden>
                        <Hidden mdUp>
                        <Grid xs={10} md={window.innerWidth>1035?7:9} mt="30px"  sx={window.innerWidth<1035?{width: "95%" , margin:'auto' }:{}} display='flex' justifyContent='center'>
                            <Grid xs={12} md={12}  >

                            <Grid sx={window.innerWidth>1035?{ width: "95%" , margin:'auto' }:{}} >
                            <Accordion sx={{border:'none' , boxShadow:'none',width:'100%',p:0}} defaultExpanded={true}>
                            
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                    sx={{p:0}}
                                >
                                    <Typography pb={1} variant='h7' color='G1.main'>Description</Typography>
                                </AccordionSummary>
                                <AccordionDetails sx={{pr:window.innerWidth>900?0:"3px",pl:0}}>
                                    <Grid xs={12} display='flex' flexWrap='wrap' justifyContent='center'
                            >
                                <Grid xs={6} >
                                    <Grid xs={12} display='flex' justifyContent='center'>
                                        <CardMedia
                                            component="img"
                                            sx={{maxWidth:'185px',maxHeight:'185px'}}
                                            image={product.file_urls != undefined ? axiosConfig.defaults.baseURL + product.file_urls[0].image_url : NoProductImage}
                                        />

                                    </Grid>
                                </Grid>
                                <Grid xs={12} display='flex' justifyContent='center' flexDirection='column' >
                                    <Typography ml="10px" variant='h10' pt="8px"> {product.description} </Typography>
                                </Grid>
                                
                                    </Grid> 
                                </AccordionDetails>
                            </Accordion>  
                            </Grid>
                            </Grid>
                        </Grid>
                        
                            
                        </Hidden>
                    
                        <Grid xs={12} md={12} display='flex' justifyContent='center' pt={"40px"} mt="74px" pb="50px" sx={{backgroundColor:'Black1.main'}}>
                            <Typography variant="h12" color='White.main'>Related Creations</Typography>
                        </Grid>
                        <Grid xs={12} md={12} display='flex'  sx={{backgroundColor:'Black1.main'}}>

                            {relatedProducts && relatedProducts.length != 0 ? (relatedProducts.map((relatedProduct, index) => {
                                if (index < 3) {
                                    return (
                                        <Grid display='flex' flexDirection='column' xs={4} md={4} >
                                            <Grid textAlign='center'>
                                            <CardMedia
                                                component="img"
                                                height='100%'
                                                image={product.file_urls != undefined ? axiosConfig.defaults.baseURL + product.file_urls[0].image_url : NoProductImage}
                                            />
                                            </Grid>
                                            <Typography mt='5px' textAlign='center'>{relatedProduct.name}</Typography>
                                            <Grid display='flex' justifyContent='center' mt="10px">
                                                <Typography variant="h10" >{(countMainVariants(relatedProduct) + ' ' + relatedProduct.products[0].main_attributes[0].title + (countMainVariants(relatedProduct) > 1 ? 's' : ''))}</Typography>
                                                < Divider orientation="vertical" flexItem sx={{ ml: '8px', mr: "8px" }} />
                                                <Typography fontWeight='bold'>{relatedProduct.price != null ? relatedProduct.price : 0} KWD</Typography>
                                            </Grid>
                                        </Grid>
                                    )
                                }

                            })) :
                                <Grid display='flex' justifyContent='center' xs={12} md={12} mb="150px">
                                    <Typography variant="h30"  color='White.main' > You dont have any related creations..!</Typography>
                                </Grid>
                            }
                        </Grid>
                    </Grid>


                </Grid>
            <Footer />
            </Grid >
            
        </Grid >)
        :
        (
            <Grid xs={12} md={12} height={window.innerHeight} display="flex" sx={{ backgroundColor: "White.main" ,justifyContent:'center',alignItems:'center'}}>
                Please wait...
            </Grid>
        )
            
        
    );
};

export default ProductDetail;