import React, { useEffect, useState } from 'react'
import { Button, Card, CardMedia, Dialog, Divider, FormControl, Grid, IconButton, CircularProgress, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography } from '@mui/material';
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';
import axiosConfig from '../../../axiosConfig';
import {  styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import Notification from '../../../layout/notification';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import DOMPurify from 'dompurify';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const AddBlog = () => {
    const [title, setTitle] = useState('');
    const [htmlBody, setHtmlBody] = useState(<></>)
    const [postLink, setPostLink] = useState([]);
    const [productLink, setProductLink] = useState([]);
    const [mainImage, setMainImage] = useState([]);
    const [mainImageEditor, setMainImageEditor] = useState([]);
    const [clicked, setClicked] = useState(0);
    const [imageFileBasic, setImageFileBasic] = useState(null)
    const [imageFileBasicEditor, setImageFileBasicEditor] = useState(null)
    const Input = styled('input')({
        display: 'none',
    });
    const [imageNumber, setImageNumber] = useState(0)
    const [imageNumberEditor, setImageNumberEditor] = useState(0)
    const [base, setBase] = useState();
    const [baseEditor, setBaseEditor] = useState();
    const [_numberBasic, set_NumberBasic] = useState('');
    const [_numberBasicEditore, set_NumberBasicEditore] = useState(0);
    const [notificationObj, setNotificationObj] = useState({
        open: false,
        type: 'success',
        message: ''
    })
    const [numberBasic, setNumberBasic] = useState(1)
    const [numberBasicEditor, setNumberBasicEditor] = useState(1)
    const [productGroupImage, setProductGroupImage] = useState([]);
    const [productGroupImageEditor, setProductGroupImageEditor] = useState([]);
    const [enDescription, setEnDescription] = useState('');
    const [numberTexts, setNumberTexts] = useState(0);
    const [texts, setTexts] = useState([]);
    const [openEditor, setOpenEditor] = useState(false)
    const [openAskQuestion, setOpenAskQuestion] = useState(false)
    const [index, setIndex] = useState(0);
    const [key, setKey] = useState(0);
    const [isImageOrText, setIsImageOrText] = useState('');
    const [editorValues, setEditorValues] = useState('');
    const [editorOrImageValues, setEditorOrImageValues] = useState([{ key: '', value: '', isTextOrImage: '' }]);
    const [openPreview, setOpenPreview] = useState(false)
    const [startDateAndTime, setStartDateAndTime] = useState(new Date());
    const [timeToRead, setTimeToRead] = useState('5 min');
    const [times, setTimes] = useState(['5 min', '10 min', '15 min']);
    const [blogs, setBlogs] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [dropdownSelectedValue, setDropdownSelectedValue] = useState([{ nthBlig: '', idBlog: '' }])
    const [dropdownSelectedProductValue, setDropdownSelectedProductValue] = useState([{ nthProduct: '', idProduct: '' }])
    const [selectedPosts, setSelectedPosts] = useState([{ blog: '', image_url: '', title: '', en_description: '' }])
    const [selectedProducts, setSelectedProducts] = useState([{ product: '', image_url: '', name: '' }])
    const [disableSave, setDisabledSave] = useState(true)
    const [products, setProducts] = useState([]);


    const bread = [
        {
            title: "Blog",
            href: "/admin/blog",
        },
    ];


    const addNewBlog = () => {

        setDisabledSave(false)
        let bodies = [{ key: '', body: '' }]
        let images = [{ key: '', file_id: '', file_url: '' }]
        let text_editors = editorOrImageValues.filter(value => value.isTextOrImage == 'Text')
        let image_editors = editorOrImageValues.filter(value => value.isTextOrImage != 'Text')
        text_editors.map((value, index) => {
            bodies[index] = { key: value.key, body: value.value }
        })
        let index = 0;
        image_editors.map((value) => {
            if (value.value) {
                value.value.map((image) => {
                    images[index] = { key: value.key, file_id: image.id, file_url: image.src }
                    index = index + 1;
                })
            }
        })


        const blogObj = {
            "related_posts": Object.values(postLink),
            "related_products": Object.values(productLink),
            "title": title,
            "file_id": mainImage.length != 0 ? mainImage[0].id : '',
            "en_description": enDescription,
            "images_editors": (images.length == 1 && images[0].key == '') ? [] : images,
            "bodies_editor": (bodies.length == 1 && bodies[0].key == '') ? [] : bodies,
            "create_date": startDateAndTime.toString(),
            "time": timeToRead
        }
        axiosConfig.post('/admin/blog/add', blogObj)
            .then(res => {
                window.location.reload()
            })
            .catch(err => {
                
                setNotificationObj({
                    open: true, type: 'error', message: `Add blog has a problem!`
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

    useEffect(() => {
        let imageArr = [];
        imageArr = [...mainImage];

        let result = [...mainImage];
        let formData = new FormData();
        formData.append('file', imageFileBasic);
        if (imageFileBasic && formData) {
            axiosConfig.post('/admin/uploader', formData)
                .then(res => {
                    imageArr.push({ 'src': res.data.files[0].image_url, 'id': res.data.files[0].file_id })
                    result = imageArr;
                    setMainImage([...result]);
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
        getAllBlog();
    }, [_numberBasic])

    const getAllBlog = () => {
        axiosConfig.get('/admin/blog/all?title=&page=1&limit=20')
            .then(res => {
                setBlogs(res.data.blogs.filter(b => b.attributes.length != 0 && ((b.attributes[0].value).includes(searchValue))))
            })
    }
    useEffect(() => {
        getProducts();
    }, [])

    const getProducts = () => {
        axiosConfig.get(`/admin/product/all?limit=1000&page=1&language_id=1&status=1&category_id&name=`
        )
            .then((res) => {
                let products = res.data.products;
                setProducts(products);
            });
    }

    useEffect(() => {
    }, [editorOrImageValues])


    const handleImagePreviewBasic = (e) => {
        let imageBase = URL.createObjectURL(e.target.files[0]);
        let imageFiles = e.target.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);

        let type = imageFiles.type;
        let numberOfAddImage = imageNumber;
        if (type.split('/')[1] == 'png' || type.split('/')[1] == 'jpg' || type.split('/')[1] == 'jpeg' || type.split('/')[1] == 'jfif' ||
            type.split('/')[1] == 'pjpeg' || type.split('/')[1] == 'pjp' || type.split('/')[1] == 'svg' || type.split('/')[1] == 'webp') {
            setImageNumber(imageNumber + 1)
            numberOfAddImage = numberOfAddImage + 1;
        }

        reader.onload = function (e) {
            var image = new Image();

            //Set the Base64 string return from FileReader as source.
            image.src = e.target.result;
            image.onload = function () {
                var height = this.height;
                var width = this.width;
                if (numberOfAddImage <= 1) {
                    setBase(imageBase);
                    setImageFileBasic(imageFiles);
                    set_NumberBasic(_numberBasic + 1)
                } else if (numberOfAddImage > 1) {
                    setNotificationObj({
                        open: true, type: 'error', message: `You can just add 1 image`
                    })
                    setTimeout(
                        () => setNotificationObj({
                            open: false,
                            type: 'success',
                            message: ''
                        }
                        ), 3000);
                } else {
                    setNotificationObj({
                        open: true, type: 'error', message: `Please upload an image with a 1:1 aspect ratio`
                    })
                    setTimeout(
                        () => setNotificationObj({
                            open: false,
                            type: 'success',
                            message: ''
                        }
                        ), 3000);
                }

            }
        }
    }

    useEffect(() => {
        let imageArr = [];
        imageArr = [...mainImageEditor];
        let result = [...mainImageEditor];
        let formData = new FormData();
        formData.append('file', imageFileBasicEditor);
        if (imageFileBasicEditor && formData) {
            axiosConfig.post('/admin/uploader', formData)
                .then(res => {
                    imageArr.push({ 'src': res.data.files[0].image_url, 'id': res.data.files[0].file_id })
                    result = imageArr;
                    setMainImageEditor([...result]);
                    setProductGroupImageEditor([...result]);
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

    }, [_numberBasicEditore])

    const handleImageEditore = (e) => {
        let imageBase = URL.createObjectURL(e.target.files[0]);
        let imageFiles = e.target.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        let type = imageFiles.type;
        let numberOfImages = imageNumberEditor;
        if (type.split('/')[1] == 'png' || type.split('/')[1] == 'jpg' || type.split('/')[1] == 'jpeg' || type.split('/')[1] == 'jfif' ||
            type.split('/')[1] == 'pjpeg' || type.split('/')[1] == 'pjp' || type.split('/')[1] == 'svg' || type.split('/')[1] == 'webp') {
            setImageNumberEditor(numberOfImages + 1)
            numberOfImages = numberOfImages + 1;
        }

        reader.onload = function (e) {
            var image = new Image();

            //Set the Base64 string return from FileReader as source.
            image.src = e.target.result;
            image.onload = function () {
                var height = this.height;
                var width = this.width;
                setBaseEditor(imageBase);
                setImageFileBasicEditor(imageFiles);
                set_NumberBasicEditore(_numberBasicEditore + 1)
            }
        }

    }
    
    useEffect(() => {
        setTexts(texts);
    }, [numberTexts])


    const createMarkup = (html) => {
        return {
            __html: DOMPurify.sanitize(html)
        }
    }
    const handleChangeStartDateAndTime = (newValue) => {
        setStartDateAndTime(newValue);
    };
    const handleChangeAttribute = (newValue) => {
        times.map((time, _index) => {
            if (newValue == _index) {
                setIndex(_index)
                setTimeToRead(time)
            }
        })
        setClicked(clicked + 1);
    }


    const mainAttributeComponentLoader = (title, nthBlog) => {

        if (blogs) {
            return (
                <Grid md={12} >
                    <FormControl fullWidth color='P'>
                        <InputLabel id="demo-simple-select-label" >{title}</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label={title + " "}
                            onChange={(e) => {
                                dropdownSelectedValue[nthBlog] = { nthBlig: nthBlog, idBlog: e.target.value }; setDropdownSelectedValue(dropdownSelectedValue);
                                blogs.map(blog => {
                                    if (blog.id == e.target.value) {
                                        postLink[nthBlog] = blog.attributes[0].value + blog.id
                                    }
                                })
                                axiosConfig.get(`/admin/blog/${e.target.value}`).then(res => {
                                    selectedPosts[nthBlog] = {
                                        blog: res.data.blog, image_url: res.data.file_url.image_url
                                        , title: res.data.blog_attributes.filter(attribute => attribute.attribute_id == 1)[0].value,
                                        en_description: res.data.blog_attributes.filter(attribute => attribute.attribute_id == 2)[0].value
                                    }
                                })

                                setClicked(clicked + 1)
                            }}
                        >
                            {blogs.map((blog) => {
                                let result = false;
                                dropdownSelectedValue.map(selectedValue => {
                                    if (selectedValue.idBlog === blog.id) {
                                        result = true;
                                    }
                                })
                                return (

                                    result ? <MenuItem value={blog.id} disabled>{blog.attributes[0].value}</MenuItem> : <MenuItem value={blog.id}>{blog.attributes[0].value}</MenuItem>

                                )
                                result = false;
                            })
                            }
                        </Select>
                    </FormControl>
                </Grid>
            )
        }
    };

    const relatedProducts = (title, nthProduct) => {
        if (products) {
            return (
                <Grid md={12} >
                    <FormControl fullWidth color='P'>
                        <InputLabel id="demo-simple-select-label" >{title}</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label={title + " "}
                            onChange={(e) => {
                                dropdownSelectedProductValue[nthProduct] = { nthProduct: nthProduct, idProduct: e.target.value }; setDropdownSelectedProductValue(dropdownSelectedProductValue);
                                let product;
                                products.map(p => {
                                    if (p.id == e.target.value) {
                                        productLink[nthProduct] = p.name + ":" + p.id
                                        selectedProducts[nthProduct] = {
                                            product: p, image_url: p.file_urls[0]
                                            , name: p.name
                                        }
                                    }
                                })

                                setClicked(clicked + 1)
                            }}
                        >
                            {products.map((p) => {
                                let result = false;
                                dropdownSelectedProductValue.map(selectedValue => {
                                    if (selectedValue.idProduct === p.id) {
                                        result = true;
                                    }
                                })
                                return (

                                    result ? <MenuItem value={p.id} disabled>{p.name}</MenuItem> : <MenuItem value={p.id}>{p.name}</MenuItem>

                                )
                                result = false;
                            })
                            }
                        </Select>
                    </FormControl>
                </Grid>
            )
        }
    }



    const toCamlize = (str) => {
        if (str == "") {
            return "";
        } else {
            str = str.toLowerCase();
            return str
                .replace(/\s(.)/g, function ($1) { return $1.toUpperCase(); })
                .replace(/^(.)/, function ($1) { return $1.toLowerCase(); })
                .replace(/^./, str[0].toUpperCase());
        }

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

    return (
        <Grid breadcrumb={bread} pageName='Add Blog'>
            <Grid container xs={12} display='flex' spacing={2}>
                <Grid item xs={9}>
                    <Paper sx={{ width: "100%", minHeight: '300px' }} >
                        <Grid xs={12} display='flex' justifyContent='space-between' >
                            <Grid p={3} textAlign='start'>
                                <Typography variant='h3'>Add Blog</Typography>
                            </Grid>
                            <Grid textAlign='end' p={2} >
                                <Button variant="outlined" color='G1' onClick={() => setOpenPreview(true)}>Preview</Button>
                            </Grid>
                        </Grid>
                        <Divider />
                        <Grid xs={12}>
                            <Grid p={2}>
                                <TextField id="outlined-basic" value={title} onChange={(e) => setTitle(toCamlize(e.target.value))} color='P' fullWidth label="Title" variant="outlined" />
                            </Grid>

                            <Grid item xs={12} display="flex" justifyContent='space-around' flexWrap="wrap">
                                {mainImage.length != 0 &&
                                    mainImage.map((cardImage, index1) => {
                                        return (
                                            <Grid p={2} display="flex" xs={12}>
                                                <Card
                                                    style={{
                                                        width: "100%",
                                                        height: "372px",
                                                        display: "flex",
                                                        justifyContent: imageNumber > 0 ? "space-around" : "center",
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
                                                        flexDirection="column-reverse"
                                                        justifyContent="space-between"
                                                        style={{
                                                            width: "100%",
                                                            height: "100%",
                                                        }}
                                                    >


                                                        <Grid item mt={0.3} ml={0.3} display='flex' flexDirection='row-reverse'>
                                                            <IconButton
                                                                sx={{ backgroundColor: 'G3.main', '&:hover': { backgroundColor: "G3.main" }, color: 'Black.main', borderRadius: 7, mb: 2, mr: 2 }}
                                                                aria-label="delete"
                                                                onClick={() => {
                                                                    setClicked(clicked + 1);
                                                                    mainImage.splice(index1, 1);
                                                                    if (imageNumber == 0) {
                                                                        setImageNumber(0)
                                                                    } else {
                                                                        setImageNumber(imageNumber - 1)
                                                                    }
                                                                    setMainImage(mainImage);
                                                                    setImageFileBasic(null);
                                                                }}
                                                            >
                                                                Remove
                                                            </IconButton>
                                                        </Grid>
                                                    </Grid>
                                                </Card>
                                            </Grid>
                                        );
                                    })}
                                <Grid p={2} sx={imageNumber == 0 ? { display: 'flex' } : { display: 'none' }} direction="column" xs={12} >
                                    <label htmlFor={`contained-button-file`} >
                                        <Input
                                            accept="image/*"
                                            id={`contained-button-file`}
                                            multiple
                                            type="file"
                                            onChange={(e) => {
                                                handleImagePreviewBasic(e);
                                                setNumberBasic(numberBasic + 1);
                                            }}
                                            disabled={imageNumber == 1}
                                        />
                                        <Button
                                            variant="contained"
                                            component="span"
                                            color="P"
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                flexDirection: "column",
                                                background: "rgba(203, 146, 155, 0.1)",
                                                justifyContent: "center",
                                                width: "100%",
                                                height: "110px",
                                                color: "P.main",
                                                fontSize: "14px",
                                                fontWeight: "400",
                                            }}
                                            size="small"
                                        >
                                            <AddIcon />
                                            Upload Picture
                                        </Button>
                                    </label>
                                    <Grid display="flex" alignItems="flex-end" p={2} pl={0}>
                                        <Typography variant="h10" color="G1.main">
                                            The best size 1800 X 800 px
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Notification
                                    open={notificationObj.open}
                                    type={notificationObj.type}
                                    message={notificationObj.message}
                                />
                            </Grid>
                            <Grid p={2}>
                                <TextField id="outlined-basic" onChange={(e) => setEnDescription(e.target.value)} color='P' fullWidth label="English Description"
                                    variant="outlined" multiline rows={4} />
                            </Grid>
                            <Divider />
                            {editorOrImageValues.length != 0 && (
                                editorOrImageValues.map((editorOrImageValue, index) => {
                                    return (
                                        editorOrImageValue.isTextOrImage == 'Text' ? (
                                            <Grid pt={2} pl={2} lineHeight={1.7} display='flex' justifyContent='space-between'>
                                                <Grid>
                                                    <div dangerouslySetInnerHTML={createMarkup(editorOrImageValue.value)}></div>
                                                </Grid>
                                                <Grid display='flex' flexDirection='column' justifyContent='space-around'>
                                                    <IconButton
                                                        component="span"
                                                        sx={{ ':focus': { backgroundColor: 'white', color: 'G1.main' }, mr: 2 }}
                                                        onClick={() => {
                                                            let filterValues = editorOrImageValues.filter((val, index1) => {
                                                                return index1 !== index
                                                            })
                                                            setEditorOrImageValues(filterValues)
                                                        }}
                                                    >
                                                        <DeleteOutlineIcon sx={{ color: "G1.main", fontSize: "40px", mb: 0.8, ":hover": { color: "G1.main" }, ':focus': { color: "G1.main" } }} fontSize="large" />
                                                    </IconButton>

                                                </Grid>
                                            </Grid>
                                        ) : (
                                            <Grid xs={12} display='flex' sx={editorOrImageValue.value == 1 ? { justifyContent: 'center' } : { justifyContent: 'center' }} flexWrap='wrap' >
                                                {editorOrImageValue.value.length != 0 &&
                                                    editorOrImageValue.value.map((cardImage, index1) => {
                                                        return (
                                                            <Grid p={2} display="flex" xs={editorOrImageValue.value.length == 1 ? 12 : (window.innerWidth > 950 ? 6 : 12)} >
                                                                <Card
                                                                    style={{
                                                                        width: "100%",
                                                                        height: "300px",
                                                                        display: "flex",
                                                                        justifyContent: imageNumberEditor > 0 ? "space-around" : "center",
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
                                                                        flexDirection="column-reverse"
                                                                        justifyContent="space-between"
                                                                        style={{
                                                                            width: "100%",
                                                                            height: "100%",
                                                                        }}
                                                                    >
                                                                        <Grid item mt={0.3} ml={0.3} display='flex' flexDirection='row-reverse'>
                                                                            <IconButton
                                                                                sx={{ backgroundColor: 'G3.main', '&:hover': { backgroundColor: "G3.main" }, color: 'Black.main', borderRadius: 7, mb: 2, mr: 2 }}
                                                                                aria-label="delete"
                                                                                onClick={() => {
                                                                                    let imageValues = editorOrImageValue.value;
                                                                                    if (editorOrImageValue.value.length == 2) {
                                                                                        imageValues = imageValues.filter((val, index) => {
                                                                                            return index != index1
                                                                                        })
                                                                                        editorOrImageValues[index] = { key: editorOrImageValue.key, value: imageValues, isTextOrImage: editorOrImageValue.isTextOrImage }
                                                                                        setEditorOrImageValues(editorOrImageValues);
                                                                                        setClicked(clicked + 1)
                                                                                    } else if (editorOrImageValue.value.length == 1) {
                                                                                        let filterValues = editorOrImageValues.filter((val, index1) => {
                                                                                            return index1 !== index
                                                                                        })
                                                                                        setEditorOrImageValues(filterValues)
                                                                                    }
                                                                                }}
                                                                            >
                                                                                Delete
                                                                            </IconButton>
                                                                        </Grid>
                                                                    </Grid>
                                                                </Card>
                                                            </Grid>
                                                        );
                                                    })}
                                            </Grid>
                                        )
                                    )
                                })
                            )}

                            <Grid display='flex' justifyContent='center' pt={3} >
                                <Grid display='flex' justifyContent='space-between' sx={{ backgroundColor: 'white', boxShadow: 4, borderRadius: 6, pl: 1.5 }}>
                                    <IconButton
                                        component="span"
                                        sx={{ ':focus': { backgroundColor: 'white', color: 'G1.main' } }}
                                        onClick={() => {
                                            setIsImageOrText('Image')
                                            setOpenAskQuestion(true)
                                            setEditorValues('');
                                        }}
                                    >
                                        <ImageOutlinedIcon sx={{ color: "G1.main", fontSize: "40px", mb: 0.8, ":hover": { color: "G1.main" }, ':focus': { color: "G1.main" } }} fontSize="large" />
                                    </IconButton>
                                    <IconButton component="span"
                                        sx={{ ':focus': { backgroundColor: 'white', color: 'G1.main' }, mr: 1, pl: 2, width: 55 }}
                                        onClick={() => {
                                            setOpenAskQuestion(true)
                                            setIsImageOrText('Text')
                                            setMainImageEditor([]);
                                        }}>
                                        <TextSnippetOutlinedIcon sx={{ color: "G1.main", fontSize: "40px", mb: 0.8, mr: 1.5, ":hover": { color: "G1.main" }, ":focus": { color: "G1.main" } }} fontSize="large" />
                                    </IconButton>
                                </Grid>
                            </Grid>
                            {openEditor && (
                                isImageOrText == 'Text' ?
                                    <Grid ml={2} mr={2} mt={2} sx={{ borderWidth: 2, border: 1, borderColor: 'Black.main' }}>
                                        <Grid ml={2} mr={2} mt={2}>
                                            <CKEditor
                                                editor={ClassicEditor}
                                                data="<p>Please enter something...</p>"

                                                config={{

                                                    toolbar: [
                                                        "bold",
                                                        "italic",
                                                        "underline",
                                                    ],
                                                    language: { ui: "fr", content: "fr" },
                                                    defaultLanguage: 'en'
                                                }}
                                                onChange={(event, editor) => {
                                                    setHtmlBody(editor.getData())
                                                    setEditorValues(editor.getData())
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} pt={5} mb={2} display="flex" justifyContent="end">
                                            <Button
                                                variant="outlined"
                                                color="G1"
                                                sx={{ mr: 1, ml: 1 }}
                                                onClick={() => { setOpenEditor(false); setEditorValues('') }}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="P"
                                                sx={{ mr: 1, ml: 1 }}
                                                onClick={() => {
                                                    if (editorValues != '') {
                                                        let newValue = { key: parseInt(key), value: editorValues, isTextOrImage: isImageOrText }
                                                        editorOrImageValues[key] = newValue;
                                                        setKey(parseInt(key) + 1)
                                                        setEditorValues('')
                                                    }
                                                    setOpenEditor(false)
                                                }}
                                            >
                                                ADD
                                            </Button>
                                        </Grid>
                                    </Grid>
                                    :
                                    <Grid xs={12} ml={2} mr={2} mt={2} sx={{ borderWidth: 2, border: 1, borderColor: 'Black.main' }}>

                                        <Grid xs={12} display='flex' flexWrap='wrap' >
                                            <Grid xs={12} display='flex' sx={mainImageEditor.length == 0 && { justifyContent: 'center' }} flexWrap='wrap' >
                                                {mainImageEditor.length != 0 &&
                                                    mainImageEditor.map((cardImage, index1) => {
                                                        return (
                                                            <Grid p={2} display="flex" xs={(window.innerWidth > 1300 ? 3 : window.innerWidth > 800 ? 5 : window.innerWidth > 600 ? 9 : 12)} >
                                                                <Card
                                                                    style={{
                                                                        width: "100%",
                                                                        height: "200px",
                                                                        display: "flex",
                                                                        justifyContent: imageNumberEditor > 0 ? "space-around" : "center",
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
                                                                        flexDirection="column-reverse"
                                                                        justifyContent="space-between"
                                                                        style={{
                                                                            width: "100%",
                                                                            height: "100%",
                                                                        }}
                                                                    >
                                                                        <Grid item mt={0.3} ml={0.3} display='flex' flexDirection='row-reverse'>
                                                                            <IconButton
                                                                                sx={{ backgroundColor: 'G3.main', '&:hover': { backgroundColor: "G3.main" }, color: 'Black.main', borderRadius: 7, mb: 2, mr: 2 }}
                                                                                aria-label="delete"
                                                                                onClick={() => {
                                                                                    setClicked(clicked + 1);
                                                                                    mainImageEditor.splice(index1, 1);
                                                                                    if (imageNumberEditor == 0) {
                                                                                        setImageNumberEditor(0)
                                                                                    } else {
                                                                                        setImageNumberEditor(imageNumberEditor - 1)
                                                                                    }
                                                                                    setMainImageEditor(mainImageEditor);
                                                                                    setImageFileBasicEditor(null);
                                                                                }}
                                                                            >
                                                                                Delete
                                                                            </IconButton>
                                                                        </Grid>
                                                                    </Grid>
                                                                </Card>
                                                            </Grid>
                                                        );
                                                    })}
                                                {mainImageEditor.length < 2 && (
                                                    <label htmlFor={`contained-button-file-Editor`} >
                                                        <Input
                                                            accept="image/*"
                                                            id={`contained-button-file-Editor`}
                                                            multiple
                                                            type="file"
                                                            onChange={(e) => {
                                                                if (mainImageEditor.length < 2) {
                                                                    handleImageEditore(e);
                                                                    setNumberBasicEditor(numberBasicEditor + 1);
                                                                } else {
                                                                    setNotificationObj({
                                                                        open: true, type: 'error', message: `You can just add 2 image`
                                                                    })
                                                                    setTimeout(
                                                                        () => setNotificationObj({
                                                                            open: false,
                                                                            type: 'error',
                                                                            message: ''
                                                                        }
                                                                        ), 3000);
                                                                }

                                                            }}
                                                        />
                                                        <IconButton
                                                            component="span"
                                                            sx={{
                                                                ':focus': { backgroundColor: 'P.main', color: 'White.main' }, ':hover': { backgroundColor: 'P.main', color: 'White.main' }
                                                                , mt: 10, color: 'White.main', backgroundColor: 'P.main'
                                                            }}
                                                        >
                                                            <AddIcon sx={{ color: "White.main", fontSize: "40px", ":hover": { color: "White.main" }, ':focus': { color: "White.main" } }} fontSize="large" />
                                                        </IconButton>
                                                    </label>
                                                )}
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12} pt={5} mb={2} display="flex" justifyContent="end" >
                                            <Button
                                                variant="outlined"
                                                color="G1"
                                                sx={{ mr: 1, ml: 1 }}
                                                onClick={() => { setOpenEditor(false); setMainImageEditor([]) }}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="P"
                                                sx={{ mr: 1, ml: 1 }}
                                                onClick={() => {
                                                    if (mainImageEditor.length != 0) {
                                                        let newValue = { key: parseInt(key), value: mainImageEditor, isTextOrImage: isImageOrText }
                                                        editorOrImageValues[key] = newValue;
                                                        setKey(parseInt(key) + 1)
                                                        setMainImageEditor([])
                                                    }
                                                    setOpenEditor(false)
                                                }}
                                            >
                                                ADD
                                            </Button>
                                        </Grid>
                                    </Grid>
                            )}
                            <Grid item xs={12} pt={15} display="flex" justifyContent="end">
                                <Button
                                    variant="outlined"
                                    color="G1"
                                    sx={{ mr: 1, ml: 1 }}
                                    onClick={() => window.location.reload()}
                                >
                                    Cancel
                                </Button>
                                {disableSave ?
                                    <Button
                                        variant="contained"
                                        color="P"
                                        sx={{ mr: 1, ml: 1 }}
                                        onClick={addNewBlog}
                                    >
                                        save
                                    </Button>
                                    :
                                    <CircularProgress sx={{ width: 20, mr: 1, ml: 1 }} />
                                }
                            </Grid>
                            <Grid item xs={12} height={20}></Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={3} >
                    <Grid xs={12} pb={2}>
                        <Paper sx={{ width: "100%", minHeight: '220px' }} >
                            <Grid p={2}>
                                <Typography variant='h3'>Settings</Typography>
                            </Grid>
                            <Divider />
                            <Grid p={2} >
                                <LocalizationProvider dateAdapter={AdapterDateFns} >
                                    <Stack direction="row" spacing={4}  >
                                        <DesktopDatePicker
                                            label="Create Date"
                                            inputFormat="MM/dd/yyyy"
                                            value={startDateAndTime}
                                            onChange={handleChangeStartDateAndTime}
                                            renderInput={(params) => <TextField id="outlined-basic" fullWidth color='P'{...params} />}
                                            color='P'
                                        />
                                    </Stack>
                                </LocalizationProvider>
                            </Grid>
                            <Grid p={2}>
                                <FormControl fullWidth>
                                    <InputLabel id='Time_for_read' color="P" >
                                        Time for read
                                    </InputLabel>
                                    <Select
                                        IconComponent={KeyboardArrowDownIcon}
                                        labelId='Time_for_read'
                                        id="demo-simple-select-required"
                                        color="P"
                                        label='Time_for_read'
                                        value={index}
                                        onChange={(e) => { handleChangeAttribute(e.target.value); }}
                                    >
                                        {times.map((time, index) => {
                                            return (
                                                <MenuItem value={index}>
                                                    {time}
                                                </MenuItem>
                                            );
                                        })}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid xs={12} pb={2}>
                        <Paper sx={{ width: "100%", minHeight: '320px' }} >
                            <Grid p={2}>
                                <Typography variant='h3'>Related Products</Typography>
                            </Grid>
                            <Divider />
                            <Grid p={2}>
                                {relatedProducts("Product 1", 0)}
                            </Grid>
                            <Grid p={2}>
                                {relatedProducts("Product 2", 1)}
                            </Grid>
                            <Grid p={2}>
                                {relatedProducts("Product 3", 2)}
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid xs={12} >
                        <Paper sx={{ width: "100%", minHeight: '320px' }} >
                            <Grid p={2}>
                                <Typography variant='h3'>Related Post</Typography>
                            </Grid>
                            <Divider />
                            <Grid p={2}>
                                {mainAttributeComponentLoader("First link", 0)}
                            </Grid>
                            <Grid p={2}>
                                {mainAttributeComponentLoader("Second link", 1)}
                            </Grid>
                            <Grid p={2}>
                                {mainAttributeComponentLoader("Third link", 2)}
                            </Grid>
                        </Paper>
                    </Grid>


                </Grid>
            </Grid>
            <Notification
                open={notificationObj.open}
                type={notificationObj.type}
                message={notificationObj.message}
            />

            <Dialog open={openAskQuestion}
                onClose={() => { setOpenAskQuestion(false) }}
            >
                <Grid xs={12} display='flex' flexDirection='column' justifyContent='space-between' pl={2} >
                    <Typography mt={2}>Are you sure to add the {isImageOrText == "Text" ? "text box" : isImageOrText.toLocaleLowerCase()}? You cannot edit it further, you are just alow to delete it!</Typography>
                    <Grid xs={12} display='flex' flexDirection='row-reverse' justifyContent='flex-start' pl={isImageOrText == 'Text' ? 43 : 46} mt={2} >
                        <Button
                            variant="contained"
                            color="P"
                            sx={{ mt: 2, mb: 2, mr: 1, ml: 1, color: "white" }}
                            onClick={() => {
                                setOpenAskQuestion(false);
                                setOpenEditor(true)
                            }}
                        >
                            Done
                        </Button>

                        <Button
                            variant="outlined"
                            color="G1"
                            onClick={() => {
                                setOpenAskQuestion(false)
                                setOpenEditor(false)
                            }}
                            sx={{ mt: 2, mb: 2, mr: 1, ml: 1 }}
                        >
                            Cancel
                        </Button>
                    </Grid>
                </Grid>
            </Dialog>
            <Dialog
                onClose={() => setOpenPreview(false)}
                minWidth='lg'
                maxWidth="xl"
                xs={12}
                open={openPreview}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <Grid width={1400} display='flex' flexDirection='row' >

                    <Grid xs={7}>
                        <Typography ml={8.5} mt={5} mb={2} variant='h3' fontSize={28}>
                            {title}
                        </Typography>
                        <Typography variant="h10" color="G1.main" ml={8.5}>
                            {startDateAndTime.toLocaleString('en-US', {
                                month: 'short',
                            })} {startDateAndTime.getDate()} . {timeToRead} read
                        </Typography>
                        <Grid item xs={12} display="flex" justifyContent='space-around' flexWrap="wrap" ml={6.8}>
                            {mainImage.length != 0 &&
                                mainImage.map((cardImage, index1) => {
                                    return (
                                        <Grid p={2} display="flex" xs={12}>
                                            <Card
                                                style={{
                                                    width: "100%",
                                                    height: "372px",
                                                    display: "flex",
                                                    justifyContent: imageNumber > 0 ? "space-around" : "center",
                                                    position: "relative",
                                                }}
                                            >
                                                <CardMedia
                                                    component="img"
                                                    image={axiosConfig.defaults.baseURL + cardImage.src}
                                                />
                                            </Card>
                                        </Grid>
                                    );
                                })}
                        </Grid>
                        <Typography ml={8.5} mr={2.2} mt={1} fontSize={18} fontWeight='bold' lineHeight={1.5} mb={2.7}>{enDescription}</Typography>
                        <Divider sx={{ mb: 2, ml: 8.5, width: "91.7%" }} />

                        {editorOrImageValues.length != 0 && (
                            editorOrImageValues.map(editorOrImageValue => {
                                return (
                                    editorOrImageValue.isTextOrImage == 'Text' ? (
                                        <Grid xs={12} pt={2} pl={8} mr={2} lineHeight={1.7}>
                                            <div dangerouslySetInnerHTML={createMarkup(editorOrImageValue.value)}></div>
                                        </Grid>
                                    ) : (
                                        <Grid xs={12} pl={6} display='flex' sx={editorOrImageValue.value == 1 ? { justifyContent: 'center' } : { justifyContent: 'center' }} flexWrap='wrap' >
                                            {editorOrImageValue.value.length != 0 &&
                                                editorOrImageValue.value.map((cardImage, index1) => {
                                                    return (
                                                        <Grid p={2} display="flex" xs={editorOrImageValue.value.length == 1 ? 12 : 6} >
                                                            <Card
                                                                style={{
                                                                    width: "100%",
                                                                    height: "300px",
                                                                    display: "flex",
                                                                    justifyContent: imageNumberEditor > 0 ? "space-around" : "center",
                                                                    position: "relative",
                                                                }}
                                                            >
                                                                <CardMedia
                                                                    component="img"
                                                                    image={axiosConfig.defaults.baseURL + cardImage.src}
                                                                />
                                                            </Card>
                                                        </Grid>
                                                    );
                                                })}
                                        </Grid>
                                    )
                                )
                            })
                        )}
                        <Grid mt={5}></Grid>
                    </Grid>
                    <Grid xs={5} display='flex' flexDirection='column' mt={5} ml={7}>
                        <Grid mt={11} mb={3}>
                            <Typography color="G1.main">Related Products </Typography>
                        </Grid>
                        {selectedProducts.map(selectedP => {
                            return (
                                products.map(p => {
                                    if (p.id == selectedP.product.id) {
                                        return (
                                            <>
                                                <Grid display='flex' >
                                                    <Card sx={{ maxWidth: 82, border: "none", boxShadow: "none", marginLeft: 2 }}>
                                                        <CardMedia
                                                            component="img"
                                                            height="82"
                                                            width="82"
                                                            image={axiosConfig.defaults.baseURL + p.file_urls[0]}
                                                            className="image"
                                                        />
                                                    </Card>
                                                    <Grid display='flex' flexDirection='column' ml={3}>
                                                        <Typography >{p.name}</Typography>
                                                        <Grid display='flex'>
                                                            <Typography>{countMainVariant(index) + ' ' + p.products[0].main_attributes[0].title + (countMainVariant(index) > 1 ? 's' : '')}</Typography>
                                                            <Typography ml={2.2}>|</Typography>
                                                            <Typography ml={2}>$ {p.products[0].price}</Typography>
                                                        </Grid>

                                                    </Grid>
                                                </Grid>
                                                <Divider sx={{ mb: 2, mt: 4, width: "55%" }} />
                                            </>
                                        )

                                    }
                                })
                            )
                        })}

                        <Grid xs={12} mt={11} mb={3}>
                            <Typography color="G1.main">Related Posts </Typography>
                            {selectedPosts.map((post) => {
                                return (
                                    blogs.map(blog => {
                                        if (blog.id === post.blog.id) {
                                            return (
                                                <Grid xs={12} mb={5}>
                                                    <Grid xs={8}>
                                                        <Card sx={{ border: "none", boxShadow: "none", marginLeft: 2, mb: 2 }}>
                                                            <CardMedia
                                                                component="img"
                                                                height="182"
                                                                width="82"
                                                                image={axiosConfig.defaults.baseURL + post.image_url}
                                                                className="image"
                                                            />
                                                        </Card>

                                                    </Grid>
                                                    <Grid mb={1}><Typography variant='MontseratFS16' pl={4} >{post.title}</Typography></Grid>
                                                    <Grid xs={7} mb={1}><Typography variant='h10' pl={4}>{post.en_description !== "null" ? post.en_description : "english description is empty."}</Typography></Grid>
                                                    <Typography variant="h10" color="G1.main" ml={4}>
                                                        {new Date(blog.create_date).toLocaleString('en-US', {
                                                            month: 'short',
                                                        })} {new Date(blog.create_date).getDate()} . {blog.time} read
                                                    </Typography>
                                                </Grid>

                                            )
                                        }
                                    })
                                )
                            })}
                        </Grid>
                    </Grid>
                </Grid>
            </Dialog>
        </Grid>
    )
}

export default AddBlog