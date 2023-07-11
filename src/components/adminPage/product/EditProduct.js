import React, { useEffect, useState } from "react";
import {
    Tooltip,
    Grid,
    MenuItem,
    Divider,
    Typography,
    Button,
    Chip,
    Dialog,
    TextField,
    IconButton,
    CircularProgress,
    InputLabel,
    FormControl,
    Select,
    Switch,
    FormControlLabel,
    InputAdornment,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Card,
    CardMedia,
    Autocomplete,
    Checkbox,
    Snackbar
    } from "@mui/material";
import { useHistory, useLocation } from "react-router-dom";
import axiosConfig from '../../../axiosConfig';
import AdminLayout from "../../../layout/adminLayout";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AddIcon from "@mui/icons-material/Add";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";
import Notification from '../../../layout/notification';
import CloseIcon from '@mui/icons-material/Close';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import DifferenceIcon from '@mui/icons-material/Difference';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';

import "../../../asset/css/adminPage/addProduct.css";

const EditProduct = () => {

    const location = useLocation();
    const [additionalAttributesList, setAdditionalAttributesList] = useState([]);
    const [mainAttributeList, setMainAttributeList] = useState([]);
    let history = useHistory();
    const [product, setProduct] = useState([]);
    const [orderedFlag, setOrderedFlag] = useState(false);
    const [defaultAttribute, setDefaultAttribute] = useState([]);

    const [attributes, setAttributes] = useState([]);
    const [openAddTag, setOpenAddTag] = useState(false);
    const [fullTagsList, setFullTagsList] = useState([]);
    const [tagValue, setTagValue] = useState([]);
    const [_tagValue, _setTagValue] = useState([]);
    const [_tagValue_, _setTagValue_] = useState([]);
    const [openAddTagBasic, setOpenAddTagBsic] = useState(false);
    const [tagValueBasic, setTagValueBasic] = useState([]);
    const [tagValueListBasic, setTagValueListBasic] = useState([]);
    const [variantCount, setVariantCount] = useState(0);
    const [additionalAttributes, setAdditionalAttributes] = useState([]);
    const [variants, setVariants] = useState([]);
    const [parentId, setParentId] = useState('');
    const [activeChip, setActiveChip] = useState('');
    const [parentFiles, setParentFiles] = useState({});
    const [trigger, setTrigger] = useState(1);
    const [tagTrigger, setTagTrigger] = useState(1);
    const [emptyAttribute, setEmptyAttribute] = useState(true);
    const [emptyVariant, setEmptyVariant] = useState(true);
    const [_trigger, _setTrigger] = useState(1)
    const [imagePreview,setImagePreview ]=useState([]);
    const [imagePreviewBasic,setImagePreviewBasic ]=useState([]);
    const [numberBasic, setNumberBasic] = useState(1)
    const[_numberBasic,_setNumberBasic]=useState('');
    const [imageFileBasic, setImageFileBasic] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const Input = styled('input')({
        display: 'none',
    });
    const [base, setBase] = useState();
    const [notificationObj, setNotificationObj] = useState({
        open: false,
        type: 'success',
        message: ''
    })
    const [selectedRow,setSelectedRow]=useState('');
    const [_selectedRow,_setSelectedRow]=useState('');
    const [_selectedRow_,_setSelectedRow_]=useState('');
    const [_selectedRow__,_setSelectedRow__]=useState('');
    const[updater,setUpdater]=useState('');
    const[_updater,_setUpdater]=useState('');
    const[_updater_,_setUpdater_]=useState('');
    const[openDeleteVariant,setOpenDeleteVariant]=useState(false);
    const[emptyVariantRow,setEmptyVariantRow]=useState([]);
    const[isTrue,setIsTrue]=useState(true);
    const[openVariant,setOpenVariant]=useState(false);
    const [expand, setExpand] = useState([false]);
    const[imageNumber,setImageNumber]=useState(0)
    const[videoNumber,setVideoNumber]=useState(0)

    const[name,setProductGroupName]=useState('');
    const[productGroupArabicName,setProductGroupArabicName]=useState('');
    const[productGroupDescription,setProductGroupDescription]=useState('');
    const [productGroupImage,setProductGroupImage ]=useState([]);
    const[openChooseMain,setOpenChooseMain]=useState(false);
    const [selectedProductsMainAttribute,setSelectedProductsMainAttribute ]=useState([]);
    const [textAttributeValuesList,setTextAttributeValuesList]=useState([])
    const [textAttributeValuesTrigger,setTextAttributeTrigger]=useState(0)
    const [dropdownSelectedValue,setDropdownSelectedValue ]=useState([]);
    const [selectedMainAttributes,setSelectedMainAttributes ]=useState([]);
    const [selectedMainAttributeText,setSelectedMainAttributeText ]=useState([]);
    const [variantRow, setVariantRow] = useState(-1);

    const [mainAttributeDescriptions, setMainAttributeDescriptions] = useState([]);
    const [selectedRowByMainAttribute,setSelectedRowByMainAttribute]=useState('');
    const [itemcodeList,setItemcodeList]=useState([]);
    const[itemcodeChecker,setItemcodeChecker]=useState(false);
    const [disabledSave, setDisabledSave] = useState(false);
    const [user, setUser] = useState("11");
    const [role, setRole] = useState('');
    const [openMassage, setOpenMassage] = useState(false);
    const [showMassage, setShowMassage] = useState('');
    
    useEffect( ()=>{
    getUserInfo();
    },[])
    const getUserInfo = async () => {
    await axiosConfig
        .get("/users/profile", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        })
        .then(async (res) => {
            
        let user =res.data.user; 
        setUser(user);
        await axiosConfig
            .get("/users/get_roles", {
            headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            }).then((res) => {
                let role1 ="";
                res.data.roles_list.map(role=>{
                    if (role.id == user.role) {
                        setRole(role.title);
                        role1 = role.title;
                    }
                })
                if (role1 != "admin" && role1!= "super admin") {
                    history.push("/")
                }
            })
        })
        .catch((err) =>{
            if(err.response.data.error.status === 401){
                axiosConfig.post("/users/refresh_token", {
                    refresh_token: localStorage.getItem("refreshToken"),
                }).then((res) => {
                    setNotificationObj({
                        open: true, type: 'error', message: `Get user info has a problem!`
                    })
                    setTimeout(
                        () => setNotificationObj({
                            open: false,
                            type: 'success',
                            message: ''
                        }
                    ), 3000);
                    localStorage.setItem("token", res.data.accessToken);
                    localStorage.setItem("refreshToken", res.data.refreshToken);
                    getUserInfo();
                })
            }else{
                setNotificationObj({
                    open: true, type: 'error', message: `Get user info has a problem!`
                })
                setTimeout(
                    () => setNotificationObj({
                        open: false,
                        type: 'success',
                        message: ''
                    }
                ), 3000);
            } 
        });
    };




    const chooseMainAttributeDialog = (row) => {
        setOpenVariant(!openVariant)
        setOpenChooseMain(!openChooseMain)
    };

    const deleteSelectedVariant = (row, mainAttr) => {
        setSelectedRowByMainAttribute(mainAttr);
        _setSelectedRow_(row);
        setOpenDeleteVariant(true);
        
    };
    
    

    const handleSelectTextAttribute = () => {
        if (dropdownSelectedValue.length !== 0 && dropdownSelectedValue !== []) {
            variantsCreator()
        }
    }

    useEffect(() => {
        refreshList();
        
        if (selectedProductsMainAttribute) {
            axiosConfig.get(`/admin/category/get_attribute_values_list/${selectedProductsMainAttribute.id}`)
            .then((res) => {
                setTextAttributeValuesList(res.data.attribute_values_list)
            })
            .catch((err) => {
                setNotificationObj({
                    open: true, type: 'error', message: `Get attribute list have a problem!`
                })
                setTimeout(
                    () => setNotificationObj({
                        open: false,
                        type: 'success',
                        message: ''
                    }
                ), 3000);
            });
        }
    }, [name,tagTrigger]);

    const mainAttributeComponentLoader = () => {
        if (selectedProductsMainAttribute.type == 2) {
            if (textAttributeValuesTrigger == 0) {
                axiosConfig.get(`/admin/category/get_attribute_values_list/${selectedProductsMainAttribute.id}`)
                .then((res) => {
                    setTextAttributeValuesList(res.data.attribute_values_list)
                })
                .catch((err) => {
                    setNotificationObj({
                        open: true, type: 'error', message: `Get attribute list have a problem!`
                    })
                    setTimeout(
                        () => setNotificationObj({
                            open: false,
                            type: 'success',
                            message: ''
                        }
                    ), 3000);
                });
                setTextAttributeTrigger(1)
            }
            if (textAttributeValuesList && textAttributeValuesList.length !== 0) {
                return(
                    <Grid md={12} p={1}>
                        <FormControl fullWidth>
                            <InputLabel id={selectedProductsMainAttribute.title} color="P">
                                {selectedProductsMainAttribute.title}
                            </InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id={selectedProductsMainAttribute.title}
                                color="P"
                                label={selectedProductsMainAttribute.title}
                                onChange={(e) => {setDropdownSelectedValue(e.target.value)}}
                            >
                                {
                                    textAttributeValuesList.map((val) => {return <MenuItem value={val.id}>{val.value}</MenuItem>}) 
                                }
                            </Select>
                        </FormControl>
                    </Grid>
                )
            }
        } else {
            const values = selectedProductsMainAttribute.values
            if (selectedProductsMainAttribute && typeof(values) === "object") {
                return (
                    <Grid md={12} p={1}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">{selectedProductsMainAttribute.title}</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Age"
                                onChange={(e) => {setDropdownSelectedValue(e.target.value)}}
                            >
                                {
                                    selectedMainAttributes.length === 0 ?
                                        values.map((val) => {return <MenuItem value={val.id}>{val.value}</MenuItem>}) 
                                    :
                                        values.map((val) => { 
                                            return (
                                                selectedMainAttributes.map(mainAttrID => {
                                                    if (val.id === mainAttrID) {
                                                        return <MenuItem value={val.id} disabled>{val.value}</MenuItem>
                                                    }
                                                    return <MenuItem value={val.id}>{val.value}</MenuItem>
                                                })
                                            )
                                        })
                                }
                            </Select>
                        </FormControl>
                 </Grid>
                )
            }
        }
    };

    
     const addVariantDescription = (row) => {            
        variants[row].has_description = true
        setTrigger((prev) => !prev)
    }

    const deleteVariantDescription = (row) => {            
        variants[row].has_description = false
        variants[row].description = ''
        setTrigger((prev) => !prev)
    }

    const changeVariantDescription = (row, value) => {            
        variants[row].description = value
    }

    const variantsCreator = (mainAttr, index) => {
        if (dropdownSelectedValue === [] || dropdownSelectedValue.length === 0) {
            setShowMassage("You must choose one attribute value to process!")
            setOpenMassage(true)
        } else {
            let newVariantCount = variantRow + 1;
            setVariantRow(newVariantCount);
    
            const mainAttributes = [...selectedMainAttributes]
            mainAttributes.push(dropdownSelectedValue)
            setSelectedMainAttributes(mainAttributes)

            const _variants = [...variants]
            _variants.push({
                mainAttribute:[{
                    attribute_id : selectedProductsMainAttribute.id,
                    value: dropdownSelectedValue
                }],
                attributes: [],
                images: [],
                sku: '',
                price: '',
                stock: '',
                tags: [],
                has_description: false,
                description: '',
                variantGroup: newVariantCount

            })
            setVariants(_variants)
            setOpenChooseMain(!openChooseMain)
            setDropdownSelectedValue([])
        }
    }
    const variantDetailLoader = (mainAttr, index) => {
        
        if (mainAttr) {
            return (
                <Grid container xs={12} display="flex" flexWrap="wrap" sx={{display:"flex" , width:"100%"}}>
                    <Grid item>
                        {attributes.map((attribute) => {
                            if (attribute.is_variant && attribute.is_parent) {
                                var attributeValue = attribute.values.filter((a) => a.id === mainAttr)
                                return(
                                    <Grid item xs={12} className="flex" display="flex" flexWrap="wrap">
                                        <Typography ml={1} color={"P.main"}>
                                            {attribute.title + ": "}
                                        </Typography>
                                        <Typography ml={1}>
                                            {attributeValue[0].value}
                                        </Typography>
                                    </Grid>
                                )
                            }
                        })}
                    </Grid>     
    
                </Grid>
            )
        }
        
    };
    const _imagesFile=(fileURL, id)=>{
        const tempColorFiles = { ...parentFiles };
        if (variants.find(p => p.attributes.find(a => a.attribute_id === parentId).value === activeChip)) {
            const productToEdit = variants.find(p => p.attributes.find(a => a.attribute_id === parentId).value === activeChip)
            productToEdit.images.push({
                file_id: id,
                is_thumbnail: false
            })

        } else {
            if (!tempColorFiles[activeChip]) {
                tempColorFiles[activeChip] = [{ src: fileURL, id: id }];
            } else {
                tempColorFiles[activeChip].push({ src: fileURL, id: id });
            }
        }
        setParentFiles(tempColorFiles);
    }

    useEffect(() => {
        let imagePreviews=[];
        if (imagePreview[selectedRow]!= undefined) {
            imagePreviews = [...imagePreview[selectedRow]];
        }
        
        let result=[...imagePreview];
        let formData = new FormData();
        formData.append('file', imageFile);
        if (imageFile && formData) {
            axiosConfig.post('/admin/uploader', formData)
            .then(res => {
                imagePreviews.push({ 'src': res.data.files[0].image_url, 'id': res.data.files[0].file_id })
                result[selectedRow] = imagePreviews;  
                setImagePreview([...result]);
                _imagesFile(res.data.files[0].image_url, res.data.files[0].file_id,selectedRow)
            })
            .catch(error => {
                setNotificationObj({
                    open: true, type: 'error', message: `Add photo has a problem!`
                })
                setTimeout(
                    () => setNotificationObj({
                        open: false,
                        type: 'success',
                        message: ''
                    }
                ), 3000);
            })
        }
        setTrigger(3)
    }, [selectedRow,updater])


    useEffect(() => {
        let imagePreviewBasicArr=[];
        imagePreviewBasicArr = [...imagePreviewBasic];
        
        let result=[...imagePreviewBasic];
        let formData = new FormData();
        formData.append('file', imageFileBasic);
        if (imageFileBasic && formData) {
            axiosConfig.post('/admin/uploader', formData)
                .then(res => {
                    imagePreviewBasicArr.push({ src: res.data.files[0].image_url, id: res.data.files[0].file_id })
                    result  = imagePreviewBasicArr;  
                    setImagePreviewBasic([...result]);
                    setProductGroupImage([...result]);
                })
                .catch(error => {
                    setNotificationObj({
                        open: true, type: 'error', message: `Add photo has a problem!`
                    })
                    setTimeout(
                        () => setNotificationObj({
                            open: false,
                            type: 'success',
                            message: ''
                        }
                    ), 3000);
                })
        }
        setTrigger(2)
    }, [_numberBasic])

    useEffect(async () => {
        
        let flagAttribute = []
        variants.map((variant, index) => {
            flagAttribute.push(variant.mainAttribute[0].value)
        })
        let uniqueArray = flagAttribute.filter(function(item, pos) {
            return flagAttribute.indexOf(item) == pos;
        })
        setSelectedMainAttributes(uniqueArray)

        await axiosConfig.get(`/admin/product/get_edit_product/${location.state.detail}`)
            .then(res => {
                if (Object.values(additionalAttributes).length >= res.data.additional_attributes.filter(b => b.type !== 4).length) {
                    const newAddition = Object.values(additionalAttributes)
                    for (let i = 0; i < newAddition.length; i++) {
                        if (newAddition[i].attribute_id!=235&&newAddition[i].attribute_id!=236) {
                            if (newAddition[i].value !== '') {
                                setEmptyAttribute(false)
                                _setTrigger(1)
                            } else {
                                setEmptyAttribute(true)
                                _setTrigger(2)
                                break;
                            }
                        }

                    }
                }

                if (variants.length > 0) {
                    for (let i = 0; i < variants.length; i++) {
                        if (variants[i].attributes.length == res.data.main_attribute.length) {
                            if (variants[i].price !== '' && variants[i].sku !== '' && variants[i].stock !== '') {
                                setEmptyVariant(false)
                            } else {
                                setEmptyVariant(true)
                                break;
                            }

                        } else {
                            setEmptyVariant(true)
                        }


                    }
                }
                
            })
    }, [additionalAttributes, _trigger,variants,parentFiles])


    useEffect(async()=>{
        emptyVariantRow[_selectedRow__]=isTrue;
        let result =[];

        variants.map((variant, index) => {
            if (variant.mainAttribute[0].attribute_id === 0 || variant.mainAttribute[0].value === 0) {
                variants.shift()
            }
        })

        let flagAttribute = []
        variants.map((variant, index) => {
            flagAttribute.push(variant.mainAttribute[0].value)
        })
        let uniqueArray = flagAttribute.filter(function(item, pos) {
            return flagAttribute.indexOf(item) == pos;
        })
        setSelectedMainAttributes(uniqueArray)
    },[_updater_])

    const refreshList = () => {
        axiosConfig.get(`/admin/product/get_edit_product/${location.state.detail}`)
        .then(res => {
            // Product fields build up ... 
            setProduct(res.data.product)
            setProductGroupName(res.data.product.name)
            setProductGroupArabicName(res.data.product.arabic_name)
            setProductGroupDescription(res.data.product.description)
            setAdditionalAttributesList(res.data.additional_attributes);

            // get product tags details
            if (res.data.product.tags) {
                let productGroupTags = res.data.product.tags
                let temp = []
                productGroupTags.map((tag)=> {
                    axiosConfig.get(`/admin/label/${tag.label_id}`)
                        .then(result => {
                            temp.push(result.data.tag)
                    })
                    setTagValueBasic(temp)
                    setTagTrigger(2)
                })
            }
            
            let result = [];
            let _result={};
            let _result_=[];
            let type=[];
            let _type=[];
            let _type_=[];
            let _type__=[];

            res.data.main_attribute.map(attribute=>{
                if (attribute.is_parent&&attribute.is_variant) {
                    _result=attribute;
                    setSelectedProductsMainAttribute(attribute)     
                }else{
                    result.push(attribute);
                }
            })

            if (Object.values(_result).length!=0) {
                _result_.push(_result);
            }
            result.map(attribute=>{
                _result_.push(attribute);
            })

            _result_.map(attribute=>{
                if (attribute.type==1) {
                    type.push(attribute)
                }
            })
            _result_.map(attribute=>{
                if (attribute.type==2) {
                    _type.push(attribute)
                }
            })
            _result_.map(attribute=>{
                if (attribute.type==3) {
                    _type_.push(attribute)
                }
            })
            _result_.map(attribute=>{
                if (attribute.type==4) {
                    _type__.push(attribute)
                }
            })

            _result_=[];
            type.map(attribute=>{
                _result_.push(attribute)
            })
            _type.map(attribute=>{
                _result_.push(attribute)
            })
            _type_.map(attribute=>{
                _result_.push(attribute)
            })
            _type__.map(attribute=>{
                _result_.push(attribute)
            })
            setMainAttributeList(_result_);
            setOrderedFlag(res.data.ordered_flag)
            setDefaultAttribute(res.data.product.product[0].attributes)

            if (trigger === 1) {
                setVariantCount((res.data.product.product).length);
                renderAdditionAttribute(res.data.product.product[0].attributes, res.data.additional_attributes);
                renderVariants(res.data.product.product, res.data.main_attribute);
            }
            setParentId(res.data.main_attribute.filter(a => a.is_parent)[0]['id']);
            _setTrigger(_trigger + 1)

            let productGroupImageList=[];
            let productGroupImages=[];
            if (product.file_urls && product.file_urls.length > 0) {
                product.file_urls.map((p,index)=>{
                    productGroupImages.push({ id: p.id, src: p.image_url })
                    productGroupImageList= productGroupImages;    
                }) 
                setImagePreviewBasic(productGroupImageList)
                setProductGroupImage(productGroupImageList)
                setImageNumber(imageNumber+1)

            }

            let images=[];
            let _images=[];
            res.data.product.product.map((p,index)=>{
                p.files.map(file=>{
                    _images.push({ id: file.file_id, src: file.image_url })
                })
                images[index]= _images;
                _images=[];
            }) 
            setImagePreview(images);
            setAttributes(_result_);

            
            axiosConfig.get('/admin/label/all')
            .then(respond => {
                setFullTagsList(respond.data.labels)
            })
            if (trigger !== 0) {
                setTrigger(0)
                
            }

        })

        axiosConfig.get(`/admin/product/get_itemcode_list`)
        .then(result => {
            setItemcodeList(result.data.itemcode_list)
        })
            

    }


    const renderAdditionAttribute = async (attributes, additionalAttribute) => {
        const additionalAttributes = []
        for (let i = 0; i < attributes.length; i++) {
            for (let j = 0; j < additionalAttribute.length; j++) {
                if (attributes[i].attribute_id === additionalAttribute[j].id) {
                    additionalAttributes[attributes[i].attribute_id] = {
                        "attribute_id": attributes[i].attribute_id,
                        "value": attributes[i].value
                    }
                }
            }
        }
        
        await setAdditionalAttributes(additionalAttributes)
    }

    const renderVariants = async (products, mainAttribute) => {
        let variantObj = [];
        let variantsMainAttributes = []
        let variantTags = [...tagValue]
        await products.map(async (product, index) => {
            let imageObj = [];
            let attributeObj = [];
            let mainAttributeObj = []
            setVariantRow(index);
            
            product.files.map((image) => {
                imageObj.push({
                    "file_id": image.file_id,
                    "is_thumbnail": image.is_thumbnail
                })
            })
            product.attributes.map((attribute, index) => {
                for (let i = 0; i < mainAttribute.length; i++) {
                    if (attribute.attribute_id === mainAttribute[i].id) {
                        if (mainAttribute[i].is_parent == true && mainAttribute[i].is_variant == true) {
                            mainAttributeObj.push({
                                attribute_id : mainAttribute[i].id,
                                value: parseInt(attribute.value)
                            })
                        } else if (mainAttribute[i].is_parent == false && mainAttribute[i].is_variant == true) {
                            attributeObj.push({
                                "attribute_id": attribute.attribute_id,
                                "value": attribute.value
                            })
                        }
                    }
                }
            })

            // get variant tags details
            
            if (product.tags.length > 0) {
                let temp = []
                await product.tags.map(async (tag)=> {
                    await axiosConfig.get(`/admin/label/${tag.label_id}`)
                        .then(result => {
                            temp.push(result.data.tag)
                    })

                })
                variantTags.push(temp)
            }
            

            variantsMainAttributes = mainAttributeObj

            variantObj.push({
                id: product.id,
                mainAttribute: mainAttributeObj,
                attributes: attributeObj,
                images: imageObj,
                sku: product.sku,
                price: product.price,
                stock: product.stock,
                tags: variantTags,
                has_description: false,
                description: product.description,
                variantGroup: index

            })
            if (products.length ==index+1) {
                setTagValue(variantTags)
                
            }
            
        })
        let variantsMainAttributesModified = []
        if (variantObj.length > 0) {
            variantObj.map((variant)=>{
                if (variant.mainAttribute.length > 0) {
                    variantsMainAttributesModified.push(variant.mainAttribute[0].value)
                }
            })
        }
        let uniqueArray = variantsMainAttributesModified.filter(function(item, pos) {
            return variantsMainAttributesModified.indexOf(item) == pos;
        })
        setSelectedMainAttributes(uniqueArray)
        setVariants(variantObj)
    }


    // description component loader for attribues
    const mainAttribueDescriptionLoader = (mainAttr, index) => {
        let flagAttribute = false
        mainAttributeDescriptions.map((attribute,index) => {
            if(Object.values(attribute).includes(mainAttr)) {
                flagAttribute = true
            }
        })
        if (flagAttribute) {
            return (
            <Grid item xs={12} p={1} sx={{position:"relative"}}>
                <TextField
                id="outlined-attribute"
                label="Description"
                multiline
                rows={4}
                fullWidth
                color="P"
                onChange={(e) => changeMainAttributeDescription(mainAttr, e.target.value)}
                />
                <Grid sx={{position:"absolute", right:10,bottom:15, zIndex:100}}>
                    <Tooltip title="delete description">
                        <Button sx={{color:"P.main"}} size="small" onClick={()=> deleteMainAttributeDescription(mainAttr, index)}>
                            <DeleteIcon />
                        </Button>
                    </Tooltip>
                </Grid>
            </Grid>
            )
        }
    }

    

    const deleteMainAttributeDescription = (mainAttr, index) => {
        let flagAttribute = ''
        mainAttributeDescriptions.map((attribute,index) => {
            if(Object.values(attribute).includes(mainAttr)) {
                flagAttribute = index
            }
        })
        const temp= [...mainAttributeDescriptions]
        temp.splice(flagAttribute, 1);
        setMainAttributeDescriptions(temp)
    }

     // changeText Main attribute description
     const changeMainAttributeDescription = (mainAttr, value) => {
        let flagAttribute = ''
        mainAttributeDescriptions.map((attribute,index) => {
            if(Object.values(attribute).includes(mainAttr)) {
                flagAttribute = index
            }
        })
        const temp = [...mainAttributeDescriptions]
        temp.splice(flagAttribute, 1 ,
            {
                attribute_id: mainAttr,
                description: value
            });
        setMainAttributeDescriptions(temp)
    }

    const sideAttributesLoader = (variant, row) => {
        return (
          <Grid item xs={12} className="flex" display="flex" flexWrap="wrap">

            {attributes.map((attribute) => {
              if (attribute.is_variant && !attribute.is_parent) {
                if (attribute.type === 1) { 
                    return (
                      <Grid item md={4} xl={3} p={1}>
                        <FormControl fullWidth>
                          <InputLabel id={attribute.title} color="P"
                            required={attribute.is_optional == true ? true : false}
                           >
                            {attribute.title.charAt(0).toUpperCase() +
                              attribute.title.slice(1)}
                          </InputLabel>
                          <Select
                            IconComponent={KeyboardArrowDownIcon}
                            labelId={attribute.title}
                            id="demo-simple-select-required"
                            color="P"
                            required={attribute.is_optional == true ? true : false}
                            value={
                              variants[row].attributes.filter(
                                (a) => a.attribute_id === attribute.id
                              )[0]
                                ? variants[row].attributes.filter(
                                    (a) => a.attribute_id === attribute.id
                                  )[0]["value"]
                                : ""
                            }
                            label={attribute.title}
                            onChange={(e) => {
                              handleChangeVariantAttribute(
                                row,
                                attribute.id,
                                e.target.value
                              );
                            }}
                          >
                            {attribute.values.map((val) => {
                              return <MenuItem value={val.id}>{val.value}</MenuItem>;
                            })}
                          </Select>
                        </FormControl>
                      </Grid>
                    );
                }
                
                if (attribute.type === 2) { 
                    return (
                      <Grid item md={4} xl={3} p={1}>
                        <TextField
                            id="outlined-attribute"
                            color="P"
                            label={attribute.title ? attribute.title : "No title"}
                            variant="outlined"
                            required={attribute.is_optional == true ? true : false}
                            fullWidth
                            onChange={(e) => setProductGroupName(e.target.value)}
                            ></TextField>
                      </Grid>
                    );
                }
                
                 if (attribute.type === 4) { 
                    return (
                        <Grid item xs={2} p={1} display="flex" alignItems="center">
                        <FormControlLabel
                            control={
                                <Switch
                                    color='P'
                                    name="gilad"
                                    defaultChecked={defaultAttribute.find(a => a.attribute_id === attribute.id) ? parseInt(defaultAttribute.find(a => a.attribute_id === attribute.id)['value']) == 1 ? true : false : ""}
                                />

                            }
                            label={attribute.title}
                            labelId={attribute.title}
                            onChange={(e) =>
                            handleChangeVariantAttribute(
                                row,
                                attribute.id,
                                e.target.checked
                            )
                            }
                        />
                    </Grid>
                    );
                }
            }
               
            })}
          </Grid>
        );
    };

    const customAttributesLoader = (variant, row) => {
        return (
          <Grid item xs={12} className="flex" display="flex" flexWrap="wrap">
            <Grid item md={4} xl={3} p={1}>
              <TextField
                label="Item Code"
                id="outlined-start-adornment"
                fullWidth
                color="P"
                required
                inputProps={{ style: { textTransform: "uppercase" } }}
                value={variants[row].sku}
                onChange={(e) => {
                    if (itemcodeList.find((list) => list === e.target.value.toUpperCase())) {
                        setShowMassage("This itemcode is already declared!")
                        setOpenMassage(true)
                        setItemcodeChecker(true)
                    } else {
                        setItemcodeChecker(false)
                    }
                  if (/^[\d\w]*$/.test(e.target.value.toUpperCase())) {
                    variants[row] = {
                      ...variants[row],
                      attributes: variants[row].attributes,
                      images: variants[row].images,
                      sku: e.target.value.toUpperCase(),
                      price: variants[row].price,
                      stock: variants[row].stock,
                    };
                    _setTrigger(_trigger + 1);
                    _setUpdater(_updater + 1);
                    _setSelectedRow__(row);
                  }
                }}
              />
            </Grid>
            <Grid item md={4} xl={3} p={1}>
              <TextField
                label="Stock"
                id="outlined-start-adornment"
                fullWidth
                color="P"
                required
                value={variants[row].stock}
                onChange={(e) => {
                  if (/^\d*$/.test(e.target.value)) {
                    variants[row] = {
                      ...variants[row],
                      attributes: variants[row].attributes,
                      images: variants[row].images,
                      sku: variants[row].sku,
                      price: variants[row].price,
                      stock: e.target.value,
                    };
                    _setTrigger(_trigger + 1);
                    _setUpdater(_updater + 1);
                    _setSelectedRow__(row);
                  }
                }}
              />
            </Grid>
            <Grid item md={4} xl={3} p={1}>
              <TextField
                label="Price"
                id="outlined-start-adornment"
                fullWidth
                color="P"
                required
                value={variants[row].price}
                InputProps={{
                  endAdornment: <InputAdornment position="end"> KWD</InputAdornment>,
                }}
                onChange={(e) => {
                  if (variants[row].price == "" && e.target.value == ".") {
                    variants[row] = {
                      ...variants[row],
                      attributes: variants[row].attributes,
                      images: variants[row].images,
                      sku: variants[row].sku,
                      price: 0 + e.target.value,
                      stock: variants[row].stock,
                    };
                    _setTrigger(_trigger + 1);
                    _setUpdater(_updater + 1);
                    _setSelectedRow__(row);
                  } else if (
                    /^\d*(\.\d{0,2})?$/.test(e.target.value) &&
                    e.target.value != "e"
                  ) {
                    variants[row] = {
                      ...variants[row],
                      attributes: variants[row].attributes,
                      images: variants[row].images,
                      sku: variants[row].sku,
                      price: e.target.value,
                      stock: variants[row].stock,
                    };
                    _setTrigger(_trigger + 1);
                    _setUpdater(_updater + 1);
                    _setSelectedRow__(row);
                  }
                }}
              />
            </Grid>
          </Grid>
        );
    };

    // Duplicator
    const duplicateVariant = (mainAttr, index) => {
        const _variants = [...variants];
        _variants.push({
          mainAttribute: [
            {
              attribute_id: parentId,
              value: parseInt(mainAttr),
            },
          ],
          attributes: [],
          images: [],
          sku: "",
          price: "",
          stock: "",
          tags: [],
          has_description: false,
          description: "",
        });
        setVariants(_variants);
        setOpenVariant(false);
        setItemcodeChecker(true);
    }



    const bread = [
        {
            title: "Products",
            href: "/admin/product",
        },
        {
            title: "Edit Product",
            href: "/admin/product",
        },
    ];


    const handleClickOpenDialogTags = (row) => {
        if (row === '') {
            setOpenAddTagBsic(true)
        }else{
            setOpenAddTag(true);
            _setSelectedRow(row);
        }
    };

    const handleCloseDialog = (row) => {
        if (row == "Basic") {
            setOpenAddTagBsic(false);
            setTagValueBasic([]);
        }else if ("Variants") {
            setOpenAddTag(false);
            _setTagValue_([]);
            _setTagValue([]);
        }
    };
    
    const handleClickOpenDialogVariants = (row) => {
        setOpenVariant(!openVariant)
    };


    const updateTagList = (row) => {
        if (row == "Basic") {
            tagValueBasic.forEach(element => {
                tagValueListBasic.push(element.id)
            });
            setOpenAddTagBsic(false);
        }else if ("Variants") {
            
            let tags = []
            if (tagValue[_selectedRow]!= undefined) {
                tagValue[_selectedRow].map(tag=>{
                    tags.push(tag);
                })
            }
            _tagValue_[_selectedRow].map(tag=>{
                tags.push(tag);
            })
            tagValue[_selectedRow] =tags
            
            _setTagValue([]);
            setOpenAddTag(false);
        }
    };


    const clickRemoveColor = (row) => {
        const modifiedAttributes = variants.filter(
            (elem, index) => index != row
        );

        const filteredEpand = expand.filter(
            (elem, index) => index != row
        );    
        const filteredPicture = imagePreview.filter(
            (elem, index) => index != row
        );
        let newVariantCount = variantCount - 1;
        setImagePreview(filteredPicture);
        setVariantCount(newVariantCount);
        setVariants(modifiedAttributes);
        setExpand(filteredEpand)
        setOpenDeleteVariant(false)
    };

    const handleChangeAttribute = (id, newValue) => {
        if (newValue == true || newValue == false) {
            if (newValue == true) {
                newValue = 1
            } else {
                newValue = 0
            }
        }
        additionalAttributes[id] = {
            "attribute_id": id,
            "value": parseInt(newValue)
        }
        setTrigger(trigger + 1)
    }

    const handleChangeVariantAttribute = (row, id, newValue) => {
        if (newValue == true || newValue == false) {
            if (newValue == true) {
                newValue = 1
            } else {
                newValue = 0
            }
        }

        const _variants = variants;
        
        if (variants[row].attributes.find(a => a.attribute_id === id)) {

            const filterAttribute = variants[row].attributes.filter(a => a.attribute_id !== id)

            _variants[row] = {
                ..._variants[row],
                "attributes": [...Object.values(filterAttribute), {
                    "attribute_id": id,
                    "value": newValue
                }]
            }
        } else {
            _variants[row] = {
                ..._variants[row],
                "attributes": [..._variants[row].attributes, _variants[row].attributes[id] = {
                    "attribute_id": id,
                    "value": newValue 
                }]
            }
        }

        setVariants(_variants)
        setTrigger(trigger + 1)
        _setSelectedRow__(row);
        _setUpdater(_updater+1)
    }


    const addProduct = () => {
        setDisabledSave(true)

        // save group images
        const productGroupImagesIDs = [];
        if (productGroupImage) {
            for (let group_image of productGroupImage) {
                productGroupImagesIDs.push( { file_id: group_image.id, is_thumbnail: true } );
            }
        } else {
            productGroupImagesIDs = []
        }


        // variant categorizer
        selectedMainAttributes.map((main, index)=> {
            variants.map((variant)=> {
                if (variant.mainAttribute[0].value == main) {
                    variant.variantGroup = index
                }
            })
        })
        
        //attach image to variants
        if (imagePreview.length !== 0) {
            imagePreview.map((image, index) => {
                variants.map((variant)=> {
                    if (variant.variantGroup == index) {
                        variant.images=image
                    }
                })
            })
        }
        
        let tags = [...tagValue]; 
        // add group tags to product object
        variants.map((variant, index) => {
            if (tags[index]) {
                variants[index].tags = tagValue[index];
            } else {
                variant.tags= [];
            }
        })

        attributes.filter(a => !a.is_variant).forEach(attribute => {
            additionalAttributes[attribute.id] &&(
                attribute.type === 4 ?
                    additionalAttributes[attribute.id] = {
                        attribute_id: attribute.id,
                        value: false,
                    }
                    :
                    additionalAttributes[attribute.id] = {
                        attribute_id: attribute.id,
                        value: "",
                    }
                )
        })

        const productObj = {
            category_id: product.category_id,
            name: name,
            arabic_name: productGroupArabicName,
            description: productGroupDescription,
            additional_attributes: Object.values(additionalAttributes),
            variants: variants,
            group_images: productGroupImagesIDs,
            tags: tagValueBasic
        }
        axiosConfig.put(`/admin/product/edit_product/${product.id}`, productObj)
        .then(res => {
            setTimeout(() => { history.push("/admin/product") }, 1000);
        }).catch(err => {
            setNotificationObj({
                open: true, type: 'error', message: `Edit product has a problem!`
            })
            setTimeout(
                () => setNotificationObj({
                    open: false,
                    type: 'success',
                    message: ''
                }
            ), 3000);
        })

    }

    
    const handleImagePreview = (e,row) => {
        let imageBase = URL.createObjectURL(e.target.files[0]);
        let imageFiles = e.target.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        

        reader.onload = function (e) {
            var image = new Image();

            //Set the Base64 string return from FileReader as source.
            image.src = e.target.result;
            image.onload = function () {
                var height = this.height;
                var width = this.width;
                if (height == width ) {
                    setBase(imageBase);
                    setImageFile(imageFiles);
                    setSelectedRow(row);
                    setUpdater(updater+1)   
                }else{
                    setNotificationObj({
                        open: true, type: 'error', message: `Please upload an image with a 1:1 aspect ratio`
                    })
                    setTimeout(() => 
                        setNotificationObj({
                            open: false,
                            type: 'success',
                            message: ''
                        }
                    ), 3000);
                }

            }
        }
        
    }

    const handleImagePreviewBasic = (e) => {
        let imageBase = URL.createObjectURL(e.target.files[0]);
        let imageFiles = e.target.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);

        let type = imageFiles.type;
        let numberOfAddImage=imageNumber;
        if (type.split('/')[1] == 'png'||type.split('/')[1] == 'jpg'||type.split('/')[1] == 'jpeg'||type.split('/')[1] == 'jfif'||
        type.split('/')[1] ==  'pjpeg'||type.split('/')[1] == 'pjp'||type.split('/')[1] == 'svg' ) {
            numberOfAddImage=numberOfAddImage+1;
            setImageNumber(imageNumber+1)
        }else if (type.split('/')[1]=='mp4') {
            setVideoNumber(videoNumber+1)
            numberOfAddImage=numberOfAddImage+1;   
        }

        reader.onload = function (e) {
            var image = new Image();

            //Set the Base64 string return from FileReader as source.
            image.src = e.target.result;
            image.onload = function () {
                var height = this.height;
                var width = this.width;
                if (height == width && numberOfAddImage<=2) {
                    setBase(imageBase);
                    setImageFileBasic(imageFiles);
                    _setNumberBasic(_numberBasic+1)   
                }else if(numberOfAddImage>2){
                    setNotificationObj({
                        open: true, type: 'error', message: `You can just add 2 images`
                    })
                    setTimeout(() => 
                        setNotificationObj({
                            open: false,
                            type: 'success',
                            message: ''
                        }
                    ), 3000);
                }else{
                    setNotificationObj({
                        open: true, type: 'error', message: `Please upload an image with a 1:1 aspect ratio`
                    })
                    setTimeout(() => 
                        setNotificationObj({
                            open: false,
                            type: 'success',
                            message: ''
                        }
                    ), 3000);
                }

            }
        }
        
    }


    const handleCloseDialogDelete = ()=>{
        setOpenDeleteVariant(false);
    }

    const checkIsEmpty=()=>{
        
        let variantAttrFlag = true
        let attribueIdType = []
        let result = true;
        additionalAttributesList.map(attribute =>{
            if ( !attribute.is_variant ) {
                if (attribute.type === 1) {
                    attribueIdType.push(attribute.id)
                    additionalAttributes.map(ad=>{
                        if (ad.attribute_id == attribute.id) {
                            if(attribute.values.filter(a=>a.id==ad.value).length == 0){
                                result = false
                            }
                        }
                    })
                }
            }
        })
        additionalAttributes.map(ad=>{
            attribueIdType.map(att=>{
                if (att==ad.attribute_id) {
                    if (ad.value!=''&&result) {
                        result = true
                    }else{
                        result = false
                    }
                }
            })
        })

        if (variants.length > 0) {
            variants.map((variant)=> {
                if(variant.sku == '' || String(variant.price) == '' || String(variant.stock) == ''){
                    variantAttrFlag = false
                }
            })
        }
        
        let variantImageFlag = true
        if (imagePreview !== undefined) {
            imagePreview.map((image)=> {
                if (image.length == 0) {
                    variantImageFlag = false
                }
            })
        }

        if (productGroupImage.length !== 0

            && variantAttrFlag !== false
            && variantImageFlag !== false
            && variants.length !== 0
            && productGroupArabicName !== ''
            && name.length !== ''            
            && itemcodeChecker !== true    
            && result
            ) {
             return false
        } else {
            return true
        }
    }

    const handleDelteTag = (row,basicOrVarient,index)=>{
        if (basicOrVarient) {
            const filterTags= tagValueBasic.filter((elem, index1)=>index1!= row);
            setTagValueBasic(filterTags)
        }else{
            if( tagValue[row]!= undefined){
                if ((tagValue[row].length==1|| (Object.getPrototypeOf(tagValue[row][tagValue[row].length-1]) === Object.prototype
                &&tagValue[row][tagValue[row].length-1].length == undefined))) {
                    const filterTagsOfRow = tagValue[row].filter((elem, index1)=>index1!= index)
                    tagValue[row]=filterTagsOfRow;
                }else if(tagValue[index]!= undefined && tagValue[index][tagValue[index].length-1]!=undefined){
                    const filterTagsOfRow = tagValue[row][tagValue[row].length-1].filter((elem, index1)=>index1!= index)
                    tagValue[row]=filterTagsOfRow;
                }
            }
        }
        _setUpdater_(_updater_+1);
    }
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
        return;
        }

        setOpenMassage(false);
    };

    return (
        <AdminLayout breadcrumb={bread}
        >
            <Grid container spacing={2} className="main">
                <Grid item xs={12} md={12} className="box boxItem">
                    <Accordion defaultExpanded={true} className="accordionMain" sx={{width:'100%'}}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Grid item xs={12} md={12} className="numberAndTitle">
                                <Typography
                                    align="center"
                                    attribute="menuitem"
                                    mt={0.5}
                                    ml={1}
                                    color="Black.main"
                                    variant='menuitem'
                                    fontWeight='bold'
                                >
                                    Basic Information
                                </Typography>
                            </Grid>
                        </AccordionSummary>
                        <AccordionDetails className="boxTitle">
                            <Grid item xs={4} p={1}>
                                {product.category_id &&
                                    <>
                                        <FormControl fullWidth >
                                            <InputLabel id="category" color="P">
                                                Category
                                            </InputLabel>
                                            <Select
                                                IconComponent={KeyboardArrowDownIcon}
                                                labelId="category"
                                                id="demo-simple-select"
                                                color="P"
                                                defaultValue={product.category_id}
                                                label="Category"
                                                disabled
                                            >
                                                {JSON.parse(localStorage.getItem('categories')).map((category) => {
                                                    return (
                                                        <MenuItem value={category.id}
                                                        >{category.name}</MenuItem>
                                                    )
                                                })}
                                            </Select>
                                        </FormControl>
                                       
                                    </>
                                }

                            </Grid>
                            <Grid item xs={4} p={1} >
                                <TextField id="outlined-attribute"
                                    color='P'
                                    label={product.category_id == 371 || product.category_id == 372 || product.category_id == 373 ? "Model Number" : "Name"}
                                    variant='outlined'
                                    required
                                    fullWidth
                                    onChange={(e) => setProductGroupName(e.target.value)}
                                    value={name}
                                    >
                                </TextField>
                                
                            </Grid>
                            <Grid item xs={4} p={1} >
                                
                                <TextField id="outlined-attribute"
                                    color='P'
                                    label="Arabic Name"
                                    variant='outlined'
                                    required
                                    fullWidth
                                    onChange={(e) => setProductGroupArabicName(e.target.value)}
                                    value={productGroupArabicName}
                                >
                                </TextField>
                                
                            </Grid>
                            <Grid item xs={12} p={1}>
                                <TextField
                                    id="outlined-attribute"
                                    label="Description"
                                    multiline
                                    rows={4}
                                    required
                                    fullWidth
                                    color="P"
                                    onChange={(e) => setProductGroupDescription(e.target.value)}
                                    value={productGroupDescription}
                                />
                            </Grid>
                            <Grid item xs={12} display="flex" flexWrap="wrap">
                                {(imagePreviewBasic.length!=0)&&imagePreviewBasic.map((cardImage, index1) => {
                                    return (
                                        <Grid p={2} display='flex'>
                                            <Card style={{
                                                width: '133px',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                position: 'relative',
            
                                            }}>
                                                {
                                                    cardImage.length != 0 ?
                                                    <CardMedia
                                                    component="img"  
                                                    image={axiosConfig.defaults.baseURL + cardImage.src}
                                                />
                                                : ""
                                                }
                                                
                                                <Grid xs={12} position='absolute' display='flex' justifyContent='space-between'
                                                    style={{
                                                        width: '100%',
                                                        backgroundImage: 'linear-gradient(180deg,  rgba(0,0,1,1), rgba(0,0,0,0))',
                                                    }}>
            
                                                    <Grid item mt={0.3} ml={0.3}>
                                                        <IconButton aria-label="delete" 
                                                            onClick={() => {
                                                                setImageNumber(imageNumber-1)

                                                                _setTrigger(_trigger+1);
                                                                imagePreviewBasic.splice(index1, 1)
                                                                setImagePreviewBasic(imagePreviewBasic)
                                                                setProductGroupImage(imagePreviewBasic)
                                                                setImageFileBasic(null);
                                                            }}
                                                        >
                                                            <DeleteIcon color="White" fontSize='small' />
                                                        </IconButton>
                                                    </Grid>
            
                                                </Grid>
                                            </Card>
                                        </Grid>
                                        
                                        
                                    )
                                })
            
                                }
                    
                                <Grid p={2} display='flex' direction="row">
                                    <label htmlFor={`contained-button-file`}>
                                        <Input accept="image/*"
                                            id={`contained-button-file`}
                                            multiple
                                            type="file"
                                            onChange={(e)=>{handleImagePreviewBasic(e);setNumberBasic(numberBasic+1)}}
                                            disabled={imageNumber==2&&videoNumber==1}
                                        />
                                        <Tooltip title="Ratio must be 1:1 (recomended size is 2000 x 2000 px)">
                                            <Button variant="contained"
                                                component="span"
                                                color='P'
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    flexDirection: 'column',
                                                    background: 'rgba(203, 146, 155, 0.1)',
                                                    justifyContent: 'center',
                                                    width: '100%',
                                                    height: '110px',
                                                    color: 'P.main',
                                                    fontSize: '14px',
                                                    fontWeight: '400'
                                                }}
                                                size="small"
                                            >
                                                <AddIcon />
                                                Upload Picture
                                            </Button>
                                        </Tooltip>
                                    </label>
                                    
                                </Grid>
                                <Notification open={notificationObj.open} type={notificationObj.type} message={notificationObj.message} />
                            </Grid>
                            <Grid item xs={12} md={12} >
                                <Grid item xs={12} md={12} display="flex" flexWrap="wrap">
                                    {tagValueBasic &&
                                    tagValueBasic.map((tag, index) => {
                                        return (
                                        <Grid key={index} item p={1}>
                                            <Chip
                                            variant="outlined"
                                            label={tag.title}
                                            onDelete={() => handleDelteTag(index, true)}
                                            deleteIcon={<CloseIcon />}
                                            />
                                        </Grid>
                                        );
                                    })}
                                    <Button
                                        onClick={() => handleClickOpenDialogTags("")}
                                        startIcon={<AddIcon />}
                                        color="P"
                                        sx={{ textTransform: "unset" }}
                                        >
                                        Product Tags
                                    </Button>
                                </Grid>
                            </Grid>
                            
                        </AccordionDetails>

                    </Accordion>


                </Grid>
                <Grid item xs={12} md={12} className="box boxItem">
                    <Accordion defaultExpanded={true} className="accordionMain">
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Grid item xs={12} md={12} className="numberAndTitle">
                                <Typography
                                    align="center"
                                    attribute="menuitem"
                                    mt={0.5}
                                    ml={1}
                                    color="Black.main"
                                    variant='menuitem'
                                    fontWeight='bold'
                                >
                                    General Information
                                </Typography>
                            </Grid>
                        </AccordionSummary>
                        <AccordionDetails>
                            {defaultAttribute.length > 0 &&
                                <Grid item xs={12} display="flex" flexWrap="wrap">
                                    {additionalAttributesList.map(attribute => {
                                        return (
                                            attribute.is_variant ? '' :
                                                attribute.type === 1 ?
                                                    <Grid item xs={4} p={1}>

                                                        <FormControl fullWidth>
                                                            <InputLabel id={attribute.title} color="P"
                                                                required={attribute.is_optional == true ? true : false}

                                                             >
                                                                {attribute.title.charAt(0).toUpperCase() +
                                                                    attribute.title.slice(1)}
                                                            </InputLabel>
                                                            <Select
                                                                IconComponent={KeyboardArrowDownIcon}
                                                                labelId={attribute.title}
                                                                id="demo-simple-select-required"
                                                                color="P"
                                                                label={attribute.title}
                                                                onChange={(e) => handleChangeAttribute(attribute.id, e.target.value)}
                                                                defaultValue={defaultAttribute.find(a => a.attribute_id === attribute.id) != undefined &&
                                                                    defaultAttribute.find(a => a.attribute_id === attribute.id)['value']
                                                                }
                                                            >
                                                                {attribute.values.map((value) => {
                                                                    return (
                                                                        <MenuItem value={value.id}>
                                                                            {value.value}
                                                                        </MenuItem>
                                                                    );
                                                                })}
                                                            </Select>
                                                        </FormControl>
                                                    </Grid>
                                                : ''
                                        )

                                    })}
                                    <Grid item xs={12} p={1}></Grid>
                                    {additionalAttributesList.map(attribute => {
                                        return (
                                            attribute.is_variant ? '' :
                                            attribute.type === 4 ?
                                            <Grid item xs={2} p={1} display='flex' alignItems='center'>
                                                    <FormControlLabel
                                                        control={
                                                            <Switch
                                                                color='P'
                                                                name="gilad"
                                                                defaultChecked={parseInt(defaultAttribute.find(a => a.attribute_id === attribute.id)['value']) == 1 ? true : false}
                                                            />

                                                        }
                                                        label={attribute.title}
                                                        onChange={(e) => handleChangeAttribute(attribute.id, e.target.checked)}

                                                    />
                                                </Grid>
                                            : ''
                                        )

                                    })}
                                </Grid>
                            }
                        </AccordionDetails>
                    </Accordion>
                </Grid>
                <Grid item xs={12} md={12} className="box boxItem">
                    <Accordion
                        expanded={true}
                        defaultExpanded={true}
                        className="accordionMain"
                        sx={{width:'100%'}}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Grid item xs={12} md={12}>
                                <Grid item xs={12} md={12} className="numberAndTitle">
                                    <Typography
                                        align="center"
                                        attribute="menuitem"
                                        mt={0.5}
                                        ml={1}
                                        color="Black.main"
                                        variant='menuitem'
                                        fontWeight='bold'
                                    >
                                        Variants
                                    </Typography>
                                    <Button
                                        onClick={() =>handleClickOpenDialogVariants()}
                                        startIcon={<AddIcon />}
                                        color="P"
                                        sx={{ marginLeft:2,'&:hover': {backgroundColor:"P.main"},backgroundColor:"P.main",color: "white" }}
                                        >
                                        Add Main Attribute
                                    </Button>
                                </Grid>
                            </Grid>
                        </AccordionSummary>
                        <AccordionDetails className="boxTitle">

                            <Grid xs={12}>
                                {selectedMainAttributes ? selectedMainAttributes.map((mainAttr, index) => {
                                    return (
                                        <Grid sx={{marginBottom:3 }}>
                                            <Accordion
                                                elevation={0}
                                                defaultExpanded={false}
                                                sx={{ width: "100%" }}
                                                >
                                                <AccordionSummary>
                                                    <Grid
                                                        sx={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            alignContent: "center",
                                                        }}
                                                    >
                                                        {variantDetailLoader(mainAttr, index)}
                                                        {mainAttribueDescriptionLoader(mainAttr, index)}

                                                    </Grid>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                <Grid item xs={12} display="flex" flexWrap="wrap">

                                                    {imagePreview.length != 0 &&
                                                        imagePreview[index] != undefined &&
                                                        imagePreview[index].map((cardImage, index1) => {
                                                        return (
                                                            <Grid p={2} display="flex">
                                                            <Card
                                                                style={{
                                                                width: "133px",
                                                                display: "flex",
                                                                justifyContent: "center",
                                                                position: "relative",
                                                                }}
                                                            >
                                                                <CardMedia
                                                                component="img"
                                                                image={axiosConfig.defaults.baseURL + cardImage.src}
                                                                />

                                                                <Grid
                                                                xs={12}
                                                                position="absolute"
                                                                display="flex"
                                                                justifyContent="space-between"
                                                                style={{
                                                                    width: "100%",
                                                                    backgroundImage:
                                                                    "linear-gradient(180deg,  rgba(0,0,1,1), rgba(0,0,0,0))",
                                                                }}
                                                                >
                                                                <Grid item mt={0.3} ml={0.3}>
                                                                    <IconButton
                                                                    aria-label="delete"
                                                                    onClick={() => {
                                                                        _setTrigger(_trigger + 1);
                                                                        imagePreview[index].splice(index1, 1);
                                                                        setImagePreview(imagePreview);
                                                                        setImageFile(null);
                                                                    }}
                                                                    >
                                                                    <DeleteIcon color="White" fontSize="small" />
                                                                    </IconButton>
                                                                </Grid>
                                                                </Grid>
                                                            </Card>
                                                            </Grid>
                                                        );
                                                    })}

                                                    <Grid p={2} display="flex" direction="row">
                                                        <label htmlFor={`contained-button-file_${index}`}>
                                                        <Input
                                                            accept="image/*"
                                                            id={`contained-button-file_${index}`}
                                                            multiple
                                                            type="file"
                                                            disabled={emptyVariantRow[index]}
                                                            onChange={(e) => {
                                                            handleImagePreview(e, index);
                                                            _setTrigger(_trigger + 1);
                                                            }}
                                                        />
                                                        <Tooltip title="Ratio must be 1:1 (recomended size is 2000 x 2000 px)">
                                                            <Button
                                                                variant="contained"
                                                                component="span"
                                                                style={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                flexDirection: "column",
                                                                background: "rgba(203, 146, 155, 0.1)",
                                                                justifyContent: "center",
                                                                width: "100%",
                                                                height: "110px",
                                                                color: "#CB929B",
                                                                fontSize: "14px",
                                                                fontWeight: "400",
                                                                }}
                                                                size="small"
                                                            >
                                                                <AddIcon />
                                                                Upload Picture
                                                            </Button>
                                                            </Tooltip>
                                                        </label>
                                                    </Grid>
                                                </Grid>
                                                    
                                                    {variants.map((variant, row) => {
                                                        if (variant.mainAttribute[0].value == mainAttr) {
                                                            return (
                                                                <Grid item ml={5} xs={12} display="flex" flexWrap="wrap">
                                                                    <Accordion
                                                                        elevation={0}
                                                                        defaultExpanded={false}
                                                                        sx={{ width: "100%" }}
                                                                        >
                                                                        <AccordionSummary>
                                                                        <Typography color={"P.main"}>
                                                                            Variant
                                                                        </Typography>
                                                                        <Typography ml={1} align="center" color="P.main" variant="menuitem">
                                                                            {row + 1}
                                                                        </Typography>

                                                                        </AccordionSummary>
                                                                        <AccordionDetails sx={{ borderLeft: 1, borderColor: "P.main", paddingBottom:5}}>
                                                                            {sideAttributesLoader(variant, row)}
                                                                            {customAttributesLoader(variant, row)}
                                                                            {
                                                                                variant.description !== '' && variant.description != undefined || variant.has_description == true? 
                                                                                (
                                                                                    <Grid item xs={12} p={1} sx={{position:"relative"}}>
                                                                                        <TextField
                                                                                        id="outlined-attribute"
                                                                                        label="Description"
                                                                                        multiline
                                                                                        rows={4}
                                                                                        fullWidth
                                                                                        color="P"
                                                                                        onChange={(e) => changeVariantDescription(row, e.target.value)}
                                                                                        defaultValue={variant.description}
                                                                                        />
                                                                                        <Grid sx={{position:"absolute", right:10,bottom:15, zIndex:100}}>
                                                                                            <Tooltip title="delete description" placement="top">
                                                                                                <Button sx={{color:"P.main"}} size="small" onClick={()=> deleteVariantDescription(row)}>
                                                                                                    <DeleteIcon />
                                                                                                </Button>
                                                                                            </Tooltip>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                ):
                                                                                ''
                                                                            }
                                                                            <Grid sx={{position:"absolute", right:10,bottom:35}}>
                                                                                {
                                                                                    variant.description !== '' && variant.description != undefined || variant.has_description == true? 
                                                                                    ''
                                                                                    : 
                                                                                    <Tooltip title="Add description">
                                                                                        <Button sx={{color:"P.main"}} size="small" onClick={()=> addVariantDescription(row)}>
                                                                                            <DescriptionOutlinedIcon />
                                                                                        </Button>
                                                                                    </Tooltip>
                                                                                }
                                                                                <Tooltip title="Delete this variant!" placement="top">
                                                                                    <Button sx={{color:"P.main"}} size="small" 
                                                                                        onClick={() => {
                                                                                            if (variants.length <= 1) {
                                                                                                setShowMassage("Product must have at least one variant.")
                                                                                                setOpenMassage(true)
                                                                                                
                                                                                            }else{
                                                                                                deleteSelectedVariant(row, mainAttr);
                                                                                            }
                                                                                        }}>
                                                                                        <DeleteIcon />
                                                                                    </Button>
                                                                                </Tooltip>
                                                                            </Grid>
                                                                            <Grid item xs={12} md={12} display="flex" flexWrap="wrap">
                                                                            {tagValueBasic.length > 0 &&
                                                                            tagValueBasic.map((tag) => {
                                                                                return (
                                                                                <Grid item p={1}>
                                                                                    <Chip variant="outlined" label={tag.title} />
                                                                                </Grid>
                                                                                );
                                                                            })}
                                                                            {tagValue}
                                                                            {tagValue[row] != undefined
                                                                            ? tagValue[row] != undefined &&
                                                                                (tagValue[row].length == 1 ||
                                                                                tagValue[row].length == 0 ||
                                                                                (Object.getPrototypeOf(
                                                                                    tagValue[row][tagValue[row].length - 1]
                                                                                ) === Object.prototype &&
                                                                                    tagValue[row][tagValue[row].length - 1]
                                                                                    .length == undefined))
                                                                                ? tagValue[row].map((tag, index1) => {
                                                                                    return (
                                                                                    <Grid item p={1}>
                                                                                        <Chip
                                                                                        variant="outlined"
                                                                                        label={tag !== null ? tag.title : "failed to load tag title!"}
                                                                                        onDelete={() =>
                                                                                            handleDelteTag(row, false, index1)
                                                                                        }
                                                                                        deleteIcon={<CloseIcon />}
                                                                                        />
                                                                                    </Grid>
                                                                                    );
                                                                                })
                                                                                : tagValue[row] != undefined &&
                                                                                tagValue[row][tagValue[row].length - 1] !=
                                                                                undefined &&
                                                                                tagValue[row][tagValue[row].length - 1].map(
                                                                                    (tag, index1) => {
                                                                                    return (
                                                                                        <Grid item p={1}>
                                                                                        <Chip
                                                                                            variant="outlined"
                                                                                            label={tag.title}
                                                                                            onDelete={() =>
                                                                                            handleDelteTag(index, false, index1)
                                                                                            }
                                                                                            deleteIcon={<CloseIcon />}
                                                                                        />
                                                                                        </Grid>
                                                                                    );
                                                                                    }
                                                                                )
                                                                            : ""}
                                                                            <Button
                                                                            onClick={() => handleClickOpenDialogTags(row)}
                                                                            startIcon={<AddIcon />}
                                                                            color="P"
                                                                            sx={{ textTransform: "unset" }}
                                                                            >
                                                                                Variant Tags
                                                                            </Button>
                                                                        </Grid>
                                                                        </AccordionDetails>
                                                                    </Accordion>

                                                                    <Grid ml={10} mt={5} sx={{position:"absolute", right:10,bottom:-10}}>
                                                                        <Tooltip title="Duplicate variant with the same main attribute">
                                                                            <Button sx={{color:"P.main"}} size="small"
                                                                            onClick={()=> duplicateVariant(mainAttr, index)}
                                                                            >
                                                                                <DifferenceIcon />
                                                                            </Button>
                                                                        </Tooltip>
                                                                    </Grid>
                                                                </Grid>
                                                            ) 
                                                        }                              
                                                    })}
                                                </AccordionDetails>
                                            </Accordion>
                                        </Grid>
                                    )
                                }) : ""}
                            </Grid>

                        </AccordionDetails>
                    </Accordion>
                </Grid>

                <Grid item xs={12} p={0} display="flex" justifyContent="end">
                    <Button
                        variant="outlined"
                        color="G1"
                        sx={{ mr: 1, ml: 1 }}
                        onClick={() => history.push("/admin/product")}
                    >
                        Cancel
                    </Button>
                    {
                        (!disabledSave)&&(
                                <Tooltip title="Product Group image, Variants image, Product Group name and arabic name and at least 1 variant is required!">
                                    <Grid>
                                        <Button
                                        
                                            variant="contained"
                                            color="P"
                                            sx={{ mr: 1, ml: 1, color:"white" }}
                                            onClick={addProduct}
                                            disabled={checkIsEmpty()}
                                            >
                                            save
                                        </Button>
                                    </Grid>
                                </Tooltip>
                        )
                    }
                    {
                        disabledSave &&(
                            <CircularProgress sx={{width:10,ml:5}}/>
                        )
                    }
                </Grid>
                <Dialog
                    maxWidth="sm"
                    xs={12}
                    open={openAddTag}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-productGroupDescription"
                >
                    <Grid container p={1} xs={12}>
                        <Grid
                            item
                            xs={3}
                            display="flex"
                            justifyContent="center"
                            m={2}
                        >
                            <Typography
                                variant="menutitle"
                                color="black"
                                style={{ width: "400px" }}
                            >
                                Add Tag
                            </Typography>
                        </Grid>
                    </Grid>
                    <Divider />
                    <Grid
                        item
                        xs={12}
                        style={{
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                    </Grid>
                    <Grid container p={2} xs={12}>
                        <Autocomplete
                            multiple
                            id="checkboxes-tags-demo"
                            options={fullTagsList}
                            disableCloseOnSelect
                            onChange={(event, newValue) => {
                                _setTagValue(newValue)
                                _tagValue_[_selectedRow]=newValue;
                            }}
                            value={_tagValue}
                            getOptionLabel={(option) => option.title}
                            renderOption={(props, option, { selected }) => (
                                <li {...props} style={tagValueBasic.find(tag=>tag.id==option.id)&&{pointerEvents:'none'}}>
                                    <Checkbox
                                        icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                                        checkedIcon={<CheckBoxIcon fontSize="small" />}
                                        style={{ marginRight: 8 }}
                                        checked={tagValueBasic.find(tag=>tag.id==option.id)?true :selected}
                                        color='P'
                                        disabled={tagValueBasic.find(tag=>tag.id==option.id)}
                                    />
                                    {option.title}
                                </li>
                            )}
                            style={{ width: 500 }}
                            renderInput={(params) => (
                                <TextField {...params} label="Tags" color="P" />
                            )}
                        />
                    </Grid>
                    <Divider />
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
                            onClick={()=>handleCloseDialog('Varients')}
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
                            onClick={()=>updateTagList("Varients")}
                        >
                            Save
                        </Button>
                    </Grid>
                </Dialog>

                <Dialog
                    maxWidth="sm"
                    xs={12}
                    open={openAddTagBasic}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-productGroupDescription"
                >
                    <Grid container p={1} xs={12}>
                        <Grid
                            item
                            xs={3}
                            display="flex"
                            justifyContent="center"
                            m={2}
                        >
                            <Typography
                                variant="menutitle"
                                color="black"
                                style={{ width: "400px" }}
                            >
                                Add Tag
                            </Typography>
                        </Grid>
                    </Grid>
                    <Divider />
                    <Grid
                        item
                        xs={12}
                        style={{
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                    </Grid>
                    <Grid container p={2} xs={12}>
                        <Autocomplete
                            multiple
                            id="checkboxes-tags-demo"
                            options={fullTagsList}
                            disableCloseOnSelect
                            onChange={(event, newValue) => {
                                setTagValueBasic(newValue);
                            }}

                            value={tagValueBasic}
                            getOptionLabel={(option) => option.title}
                            renderOption={(props, option, { selected }) => (
                                <li {...props} style={tagValueBasic.find(tag=>tag.id==option.id)&&{pointerEvents:'none'}}>
                                    <Checkbox
                                        icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                                        checkedIcon={<CheckBoxIcon fontSize="small" />}
                                        style={{ marginRight: 8 }}
                                        checked={tagValueBasic.find(tag=>tag.id==option.id)?true :selected}
                                        color='P'
                                        disabled={tagValueBasic.find(tag=>tag.id==option.id)}
                                    />
                                    {option.title}
                                </li>
                            )}
                            style={{ width: 500 }}
                            renderInput={(params) => (
                                <TextField {...params} label="Tags" color="P" />
                            )}
                        />
                    </Grid>
                    <Divider />
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
                            onClick={()=>handleCloseDialog("Basic")}
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
                            onClick={()=>updateTagList("Basic")}
                        >
                            Save
                        </Button>
                    </Grid>
                </Dialog>

                <Dialog
                open={openDeleteVariant}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-productGroupDescription"
                >
                    <Grid xs={12} display='flex' justifyContent='center' mt={3} mb={1} ml={3} mr={6}>
                        
                        <Typography>
                            Are you sure you want to delete this row?
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
                                onClick={() => clickRemoveColor(_selectedRow_)}
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

            <Grid>
                <Dialog
                open={openVariant}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-productGroupDescription"
                >
                    <Grid xs={12} display='flex' justifyContent='center' mt={3} mb={1} ml={3} mr={6}>
                        <Typography>
                            Do you want to add a new varient?
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
                            onClick={chooseMainAttributeDialog}
                        >
                            Continue
                        </Button>
                        
                        <Button
                            variant="outlined"
                            color="G1"
                            onClick={handleClickOpenDialogVariants}
                            sx={{ mt: 2, mb: 2, mr: 1, ml: 1 }}
                        >
                            Cancel
                        </Button>
                    </Grid>
                </Dialog>     
                       
            </Grid>  

            <Grid>
                <Dialog
                open={openChooseMain}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                >
                    <Grid xs={12} display='flex' justifyContent='center' mt={3} mb={1} ml={3} mr={6}>
                        
                        <Typography>
                            Select the main attribute.
                        </Typography>
                    </Grid>
                    <Grid>
                        {selectedProductsMainAttribute ? mainAttributeComponentLoader() : ""}
                    </Grid>

                    <Grid
                        item
                        xs={12}
                        paddingLeft={1}
                        paddingRight={1}
                        display="flex"
                        justifyContent="end"
                        alignItems="center"
                    >
                        {
                            selectedProductsMainAttribute.type == 2 ? 
                            (
                                <Grid md={12} p={1}>
                                    <Tooltip title="Add new value to the main attribue">
                                        <Button
                                            variant="contained"
                                            color="P"
                                            sx={{ mr: 1, color: "white" }}
                                            >
                                            Add
                                        </Button>
                                    </Tooltip>
                                    </Grid>
                            ) : ""
                        }
                        <Button
                            variant="contained"
                            color="P"
                            sx={{ mt: 2, mb: 2, mr: 1, ml: 1, color: "white" }}
                            disabled={selectedMainAttributes ? false : true}
                            onClick={selectedMainAttributeText.length == 0 || selectedMainAttributeText == ''? variantsCreator : handleSelectTextAttribute}
                        >
                            Select
                        </Button>
                        
                        <Button
                            variant="outlined"
                            color="G1"
                            sx={{ mt: 2, mb: 2, mr: 1, ml: 1 }}
                        >
                            Cancel
                        </Button>
                    </Grid>
                </Dialog>  
                
                                                                    
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
        </AdminLayout >)
}

export default EditProduct