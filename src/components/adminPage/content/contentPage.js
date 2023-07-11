import React, { useState, useRef, useEffect } from 'react'
import AxiosConfig from '../../../axiosConfig'
import AdminLayout from '../../../layout/adminLayout';
import { Accordion, AccordionDetails, AccordionSummary, Button, Grid,  TextField, Typography, Divider, Card, CardMedia, Link, IconButton, Dialog,Snackbar } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import { styled } from "@mui/material/styles";
import { useHistory } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';

const ContentPage = () => {
    const [imageFile, setImageFile] = useState(null);
    const [desktopSlider, setDesktopSlider] = useState([]);
    const [mobileSlider, setMobileSlider] = useState([]);
    const [Banners, setBanners] = useState([]);
    const [imagePreviewMobileSlider, setImagePreviewMobileSlider] = useState([]);
    const [imagePreviewDesktopSlider, setImagePreviewDesktopSlider] = useState([]);
    const [imagePreviewBanners, setImagePreviewBanners] = useState([]);
    const [trigger, setTrigger] = useState(1)
    const [defaultBanners, setDefaultBanners] = useState([]);
    const [defaultSliderMobile, setDefaultSliderMobile] = useState([]);
    const [defaultSliderDesktop, setDefaultSliderDesktop] = useState([]);
    const [selectedAddButton, setSelectedAddButton] = useState({ index: '', name: '' })
    const [openAddSlider, setOpenAddSlider] = useState(false);
    const [defaultIndex, setDefaultIndex] = useState(0);
    const [isEdit, setIsEdit] = useState(false);
    const [defaultType, setDefaultType] = useState('');
    const [openMassage, setOpenMassage] = useState(false);
    const [showMassage, setShowMassage] = useState('');

    let history = useHistory();




    useEffect(() => {
        refreshList();
    }, []);


    const Input = styled('input')({
        display: 'none',
    });


    const addNewContent = () => {
        let notChangeSliders = []
        let notChangeBanners = []

        if (defaultSliderDesktop.length !== 0) {
            defaultSliderDesktop.forEach(element => {
                notChangeSliders.push({ file_id: element.file_id, is_mobile: element.is_mobile, title: element.title, link: element.link })
            });
        }
        if (defaultSliderMobile.length !== 0) {
            defaultSliderMobile.forEach(element => {
                notChangeSliders.push({ file_id: element.file_id, is_mobile: element.is_mobile, title: element.title, link: element.link })
            });
        }
        if (defaultBanners.length !== 0) {
            defaultBanners.forEach(element => {
                notChangeBanners.push({ file_id: element.file_id, title: element.title, link: element.link })
            });
        }


        const contentObj = {
            sliders: [...Object.values(desktopSlider), ...Object.values(mobileSlider), ...Object.values(notChangeSliders)],
            banners: [...Object.values(notChangeBanners), ...Object.values(Banners)]
        }

    }

    const refreshList = () => {

        AxiosConfig.get('/admin/content/all')
            .then((res) => {
                setDefaultBanners(res.data.data.banners)
                setDefaultSliderMobile(res.data.data.sliders.filter(s => s.is_mobile))
                setDefaultSliderDesktop(res.data.data.sliders.filter(s => !s.is_mobile))

            })
            .catch((err) => {
                setShowMassage('Get all content have a problem!')
                setOpenMassage(true)
            })
    }

    function handleChangeImageButton(e) {
        let imageFiles = e.target.files[0];
        let formData = new FormData();
        formData.append('file', imageFiles);
        imageFiles &&(
            AxiosConfig.post('/admin/uploader', formData)
                .then((res) => {

                    if (selectedAddButton.name === 'desktop') {
                        desktopSlider[selectedAddButton.index] = {
                            ...desktopSlider[selectedAddButton.index],
                            file_id: res.data.files[0].file_id,
                            is_mobile: false,
                            title: desktopSlider[selectedAddButton.index] ? desktopSlider[selectedAddButton.index].title : defaultSliderDesktop[selectedAddButton.index].title,
                            link: desktopSlider[selectedAddButton.index] ? desktopSlider[selectedAddButton.index].link : defaultSliderDesktop[selectedAddButton.index].link
                        }
                        imagePreviewDesktopSlider[selectedAddButton.index] = { ...imagePreviewDesktopSlider[selectedAddButton.index], src: res.data.files[0].image_url };
                    } else if (selectedAddButton.name === 'mobile') {
                        mobileSlider[selectedAddButton.index] = {
                            ...mobileSlider[selectedAddButton.index],
                            file_id: res.data.files[0].file_id,
                            is_mobile: true,
                            title: mobileSlider[selectedAddButton.index] ? mobileSlider[selectedAddButton.index].title : defaultSliderMobile[selectedAddButton.index].title,
                            link: mobileSlider[selectedAddButton.index] ? mobileSlider[selectedAddButton.index].link : defaultSliderMobile[selectedAddButton.index].link
                        }
                        imagePreviewMobileSlider[selectedAddButton.index] = { ...imagePreviewMobileSlider[selectedAddButton.index], src: res.data.files[0].image_url }
                    } else if (selectedAddButton.name === 'banner') {

                        Banners[selectedAddButton.index] = {
                            ...Banners[selectedAddButton.index],
                            file_id: res.data.files[0].file_id,
                            title: Banners[selectedAddButton.index] ? Banners[selectedAddButton.index].title : defaultBanners[selectedAddButton.index].title
                        }
                        imagePreviewBanners[selectedAddButton.index] = { ...imagePreviewBanners[selectedAddButton.index], src: res.data.files[0].image_url }
                    }

                    setTrigger(trigger + 1)
                })
        )
                
    }

    const handleClickSlideDialog = (open, index, type) => {
        setDefaultType(type);
        setOpenAddSlider(open);
        setDefaultIndex(index);


        if (index > (type === 'mobileSlider' ? defaultSliderMobile : type === 'banners' ? defaultBanners : defaultSliderDesktop).length) {
            setIsEdit(false)
        } else {
            setIsEdit(true)
        }
        if (!open) {
            setIsEdit(false)
        }
    }

    const slider = (type) => {
        return (
            <Swiper
                className="mySwiper"
            >
                {(type === 'mobile' ? defaultSliderMobile : defaultSliderDesktop).map((slide, index) => {
                    return (
                        <SwiperSlide>
                            <Grid xs={12} position="relative" p={2}>
                                <Card
                                    sx={{ height: "600px", width: "100%", borderRadius: "0" }}
                                >
                                    <CardMedia
                                        component="img"
                                        image={
                                            AxiosConfig.defaults.baseURL + slide.file.image_url
                                        }
                                    />
                                </Card>
                                <Grid sx={{
                                    position: "absolute",
                                    top: '20px',
                                    right: '20px'
                                }}>
                                    <IconButton
                                        color="Black"
                                        style={{
                                            backgroundColor: 'white',
                                            margin: '2px'
                                        }}
                                        onClick={() => handleClickSlideDialog(true, index, (type === 'mobile' ? 'mobileSlider' : 'desktopSlider'))}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        color="Black"
                                        style={{
                                            backgroundColor: 'white',
                                            margin: '2px'
                                        }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Grid>
                                <Grid
                                    sx={{
                                        position: "absolute",
                                        top: "250px",
                                        right: "40px",
                                        backgroundColor: "White1.main",
                                        lineHeight: 2,
                                        paddingBottom: 8,
                                        paddingLeft: "20px",
                                        paddingRight: "20px",
                                        width: "400px",
                                        height: "70px",
                                        overflow: "visible",
                                    }}
                                >
                                    <Typography variant="h25" color='White.main' sx={{ lineHeight: "67px" }}>
                                        {slide.title}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </SwiperSlide>
                    );
                })}
                <SwiperSlide >
                    <Grid xs={12} m={2}
                        height='600px'
                        display='flex'
                        border='1px'
                        justifyContent='center'
                        alignItems='center'>
                        <Card
                            sx={{ height: "600px", width: "100%", borderRadius: "0", backgroundColor: '#73737312', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        >
                            <IconButton color='P'
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    fontSize: '50px',
                                    fontWeight: '400'
                                }}
                                onClick={() => handleClickSlideDialog(true, ((type === 'mobile' ? defaultSliderMobile : defaultSliderDesktop).length + 1), (type === 'mobile' ? 'mobileSlider' : 'desktopSlider'))}
                            >
                                <AddIcon style={{ fontSize: '200px' }} />
                                Add Slide
                            </IconButton>
                        </Card>

                    </Grid>
                </SwiperSlide>
            </Swiper>
        )
    }

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
        return;
        }

        setOpenMassage(false);
    };

    return (
        <AdminLayout breadcrumb='' pageName="Content">
            <Accordion defaultExpanded={true} expanded={true} >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Grid xs={12} display='flex' justifyContent='space-between'>
                        <Grid>
                            <Typography variant='menutitle'>Desktop Main Slider</Typography>
                        </Grid>
                    </Grid>

                </AccordionSummary> <Divider />
                <AccordionDetails style={{ padding: 0 }}>
                    <Grid xs={12}>
                        {slider('desktop')}
                    </Grid>
                </AccordionDetails>
            </Accordion>
            <Accordion defaultExpanded={true} expanded={true} >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Grid xs={12} display='flex' justifyContent='space-between'>
                        <Grid>
                            <Typography variant='menutitle'>Mobile Main Slider</Typography>
                        </Grid>
                    </Grid>

                </AccordionSummary> <Divider />
                <AccordionDetails style={{ padding: 0 }}>
                    <Grid xs={12}>
                        {slider('mobile')}
                    </Grid>

                </AccordionDetails>
            </Accordion>
            {defaultBanners.length === 0 ? '' :
                <Accordion defaultExpanded={true} expanded={true} >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Grid xs={12} display='flex' justifyContent='space-between'>
                            <Grid>
                                <Typography variant='menutitle'>Main Banners</Typography>
                            </Grid>
                        </Grid>

                    </AccordionSummary> <Divider />
                    <AccordionDetails style={{ padding: 0 }}>
                        <Grid xs={12} display='flex' justifyContent='center' flexWrap='wrap' p={2}>
                            {defaultBanners.map((banner, index) => {
                                return (
                                    <Grid xs={6} className="backImage" mt={4}  >
                                        <Grid sx={{
                                            position: "absolute",
                                            top: '5px',
                                            right: '5px'
                                        }}>
                                            <IconButton
                                                color="Black"
                                                style={{
                                                    backgroundColor: 'white',
                                                    margin: '2px'
                                                }}
                                                onClick={() => handleClickSlideDialog(true, index, 'banners')}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                color="Black"
                                                style={{
                                                    backgroundColor: 'white',
                                                    margin: '2px'
                                                }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Grid>
                                        <img style={{ height: '100%' }} src={AxiosConfig.defaults.baseURL + banner.file.image_url} />


                                        <div className="textIn" display='block' style={{ top: '65%', height: '70%' }}>

                                            <Link href="#" color="inherit" underline="none" style={{ color: 'inherit', textDecoration: 'inherit' }}>
                                                <h1 style={{ marginBottom: "10px" }} >
                                                    {banner.title}
                                                </h1>
                                            </Link>
                                            <Link href="#" color="inherit" underline="none" style={{ color: 'inherit', textDecoration: 'inherit' }}>
                                                <p style={{ marginBottom: "10px" }}>
                                                    Sun glasses
                                                </p>
                                            </Link>
                                            <Link href="#" color="inherit" underline="none" style={{ color: 'inherit', textDecoration: 'inherit' }}>
                                                <p style={{ marginBottom: "10px" }}>
                                                    Optical
                                                </p>
                                            </Link>
                                            <Link href="#" color="inherit" underline="none" style={{ color: 'inherit', textDecoration: 'inherit' }}>
                                                <p style={{ marginBottom: "10px" }}>
                                                    AC
                                                </p>
                                            </Link>
                                        </div>
                                    </Grid>
                                )
                            })}
                           
                        </Grid>
                   
                    </AccordionDetails>
                </Accordion>
            }
            {defaultBanners.length === 0 ? '' :
                <Accordion defaultExpanded={true} expanded={true} >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Grid xs={12} display='flex' justifyContent='space-between'>
                            <Grid>
                                <Typography variant='menutitle'>Banners</Typography>
                            </Grid>
                        </Grid>

                    </AccordionSummary> <Divider />
                    <AccordionDetails style={{ padding: 0 }}>
                        <Grid xs={12} display='flex' justifyContent='center' flexWrap='wrap' p={2}>
                            {defaultBanners.map((banner, index) => {
                                return (
                                    <Grid xs={defaultBanners.length % 2 !== 0 ? index === 0 ? 12 : 6 : 6} className="backImage" mt={4}  >
                                        <Grid sx={{
                                            position: "absolute",
                                            top: '5px',
                                            right: '5px'
                                        }}>
                                            <IconButton
                                                color="Black"
                                                style={{
                                                    backgroundColor: 'white',
                                                    margin: '2px'
                                                }}
                                                onClick={() => handleClickSlideDialog(true, index, 'banners')}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                color="Black"
                                                style={{
                                                    backgroundColor: 'white',
                                                    margin: '2px'
                                                }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Grid>
                                        <img style={{ height: '100%' }} src={AxiosConfig.defaults.baseURL + banner.file.image_url} />


                                        <div className="textIn" display='block' style={{ top: '65%', height: '70%' }}>

                                            <Link href="#" color="inherit" underline="none" style={{ color: 'inherit', textDecoration: 'inherit' }}>
                                                <h1 style={{ marginBottom: "10px" }} >
                                                    {banner.title}
                                                </h1>
                                            </Link>
                                            <Link href="#" color="inherit" underline="none" style={{ color: 'inherit', textDecoration: 'inherit' }}>
                                                <p style={{ marginBottom: "10px" }}>
                                                    Sun glasses
                                                </p>
                                            </Link>
                                            <Link href="#" color="inherit" underline="none" style={{ color: 'inherit', textDecoration: 'inherit' }}>
                                                <p style={{ marginBottom: "10px" }}>
                                                    Optical
                                                </p>
                                            </Link>
                                            <Link href="#" color="inherit" underline="none" style={{ color: 'inherit', textDecoration: 'inherit' }}>
                                                <p style={{ marginBottom: "10px" }}>
                                                    AC
                                                </p>
                                            </Link>
                                        </div>
                                    </Grid>
                                )
                            })}
                           
                        </Grid>
                       
                    </AccordionDetails>
                </Accordion>
            }
            <Grid item xs={12} p={0} display="flex" justifyContent="end">
                <Button
                    variant="outlined"
                    color="G1"
                    sx={{ mr: 1, ml: 1 }}
                    onClick={() => history.push("/admin/product")}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    color="P"
                    sx={{ mr: 1, ml: 1 }}
                    onClick={addNewContent}
                >
                    save
                </Button>
            </Grid>

            <Dialog
                maxWidth={window.innerWidth < 1150 ? (window.innerWidth < 700 ? 'lg' : 'md') : 'sm'}
                open={openAddSlider}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <Grid item xs={12} display='flex' justifyContent='start' m={2}>
                    <Typography variant="menutitle" color="Black.main" >
                        {isEdit ? `Edit ${(defaultType === 'banners' ? 'Banner ' : 'Slide ') + (defaultIndex + 1)}` : 'Add New Slide'}
                    </Typography>
                </Grid>
                <Grid xs={12} >
                    <Grid xs={12} display='flex' justifyContent='center' p={4} pt={0}>
                        {!isEdit ?
                            <label htmlFor="contained-button-file">
                                <Input accept="image/*"
                                    id="contained-button-file"
                                    multiple
                                    type="file"
                                    onChange={(e) => {
                                        handleChangeImageButton(e);
                                        setDefaultSliderDesktop(defaultSliderDesktop.filter((_, i) => i != selectedAddButton.index));
                                    }}
                                />
                                <Button variant="contained"
                                    component="span"
                                    color='P'
                                    style={defaultType === 'mobileSlider' ? { width: '150px' } : { width: '350px' }}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        flexDirection: 'column',
                                        background: 'rgba(203, 146, 155, 0.1)',
                                        justifyContent: 'center',
                                        height: '150px',
                                        color: 'P.main',
                                        fontSize: '14px',
                                        fontWeight: '400'
                                    }}
                                    size="small"
                                >
                                    <AddIcon />
                                    Upload Picture
                                </Button>
                            </label>
                            :
                            <Card
                                sx={(defaultType === 'mobileSlider' ? { width: '50%', borderRadius: "0" } : { width: '90%', borderRadius: "0" })}
                            >
                                <CardMedia
                                    component="img"
                                    image={
                                        AxiosConfig.defaults.baseURL + (defaultType === 'desktopSlider' ? defaultSliderDesktop : defaultType === 'mobileSlider' ? defaultSliderMobile : defaultBanners)[defaultIndex].file.image_url
                                    }
                                />
                            </Card>
                        }
                    </Grid>

                    <Grid xs={12} p={2} pt={0}>
                        <TextField label="Title" variant="outlined" color='P' fullWidth
                            defaultValue={isEdit ? (defaultType === 'desktopSlider' ? defaultSliderDesktop : defaultType === 'mobileSlider' ? defaultSliderMobile : defaultBanners)[defaultIndex].title : ''}
                        />
                    </Grid>

                    <Grid xs={12} p={2} pt={0}>
                        <TextField label="Link" variant="outlined" color='P' fullWidth
                            defaultValue={isEdit ? (defaultType === 'desktopSlider' ? defaultSliderDesktop : defaultType === 'mobileSlider' ? defaultSliderMobile : defaultBanners)[defaultIndex].link : ''}
                        />
                    </Grid>
                    {defaultType !== 'banners' ? '' :
                        <>
                            <Divider />
                            <Typography variant='h1' p={1}>
                                Sub Menu:
                            </Typography>
                            <Grid xs={12} display='flex' flexWrap='wrap'>
                                <Grid xs={6} p={1} >
                                    <TextField label="Title" variant="outlined" color='P' fullWidth
                                    />
                                </Grid>
                                <Grid xs={6} p={1}>
                                    <TextField label="Link" variant="outlined" color='P' fullWidth
                                    />
                                </Grid>
                            </Grid>
                        </>
                    }
                </Grid>
                <Grid
                    item
                    xs={12}
                    paddingLeft={1}
                    paddingRight={1}
                    display="flex"
                    justifyContent="end"

                >
                    <Divider />
                    <Button
                        variant="outlined"
                        color="G1"
                        onClick={() => handleClickSlideDialog(false, '')}
                        sx={{ mt: 2, mb: 2, mr: 1, ml: 1 }}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        color="P"
                        sx={{ mt: 2, mb: 2, mr: 1, ml: 1, color: "white" }}
                    >
                        save
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
           
        </AdminLayout >
    )
}

export default ContentPage;