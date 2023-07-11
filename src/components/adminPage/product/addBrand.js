import React, { useEffect, useState } from "react";
import axiosConfig from "../../../axiosConfig";
import AdminLayout from "../../../layout/adminLayout";
import "../../../asset/css/adminPage/addColor.css";
import SwitchCust from "./SwitchCust";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import CircularProgress from '@mui/material/CircularProgress';
import { Snackbar } from "@mui/material";
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';



const AddBrand = () => {
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedBrand, setSelectedBrand] = useState({
        'title': '',
        'description': '',
        'file_id': '',
        'image_url': ''
    });
    const [list, setList] = useState([]);
    const [value, setValue] = useState({ 'title': '', 'description': '', 'file_id': '' });
    const [isEdit, setIsEdit] = useState(false);
    const [loading, setLoading] = useState(true);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [openDelete, setOpenDelete] = useState(false);
    const [openMassage, setOpenMassage] = useState(false);
    const [showMassage, setShowMassage] = useState('');


    const openMore = Boolean(anchorEl);

    useEffect(() => {
        refreshList();
    }, [])


    const refreshList = () => {

        axiosConfig.get('/admin/brand/all')
            .then(res => {
                setLoading(false)
                setList(res.data.brands)
            })
            .catch(error => {
                setShowMassage('Get all brand have a problem!')
                setOpenMassage(true)
            })
    };

    const addBrand = () => {
        if (imageFile !== null) {
            let formData = new FormData();
            formData.append('file', imageFile)
            axiosConfig.post('/admin/uploader', formData)

                .then(res => {
                    setValue({ ...value, 'file_id': res.data.files[0].file_id });
                    axiosConfig.post('/admin/brand/add', value)
                        .then((response) => {
                            if (response.data.status) {
                                refreshList();
                                setOpen(false);
                            }

                        })
                        .catch(error => {
                            setShowMassage('Add brand has a problem!')
                            setOpenMassage(true)
                        })

                })
                .catch(error => {
                    setShowMassage('Add photo has a problem!')
                    setOpenMassage(true)
                })
        }
    }

    const isLoading = () => {
        return (
            <Grid item xs={12} mt={2} mb={2} display='flex' justifyContent='center'>
                <CircularProgress color='P' />
            </Grid>
        )
    }


    const handleImagePreview = (e) => {
        let imageBase = URL.createObjectURL(e.target.files[0]);
        let imageFiles = e.target.files[0];
        setImageFile(imageFiles);
        setImagePreview(imageBase)
    }

    const handleClickOpenDialog = () => {
        setOpen(true);
    };

    const handleCloseDialog = () => {
        if (isEdit) {
            setIsEdit(false);
        }
        setOpen(false);
        setAnchorEl(null);
    };

    const handleClick = (event, brand) => {
        setAnchorEl(event.currentTarget);
        setSelectedBrand(brand);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const Input = styled('input')({
        display: 'none',
    });

    const handleChange = (event) => {
        setValue({ ...value, [event.target.id]: event.target.value })
    };

    const handleClickEdit = () => {
        setIsEdit(true);
        setOpen(true);
    }

    const editBrand = () => {
        if (imageFile !== null) {
            let formData = new FormData();
            formData.append('file', imageFile)
            axiosConfig.post('/admin/uploader', formData)

                .then(res => {
                    setValue({ ...value, 'file_id': res.data.files[0].file_id });
                    axiosConfig.put(`/admin/brand/${selectedBrand.id}`, value)
                        .then(res => {
                            if (res.data.status) {
                                setOpen(false);
                                setAnchorEl(null);
                                refreshList();
                            }
                        })
                        .catch(err => {
                            setShowMassage('Edit brand has a problem!')
                            setOpenMassage(true)
                        })
                })
                .catch(err => {
                    setShowMassage('Add brand has a problem!')
                    setOpenMassage(true)
                })
        }
    }

    const handleClickDelete = () => {
        setOpenDelete(true);
    }

    const deleteBrand = () => {
        axiosConfig.delete(`/admin/brand/${selectedBrand.id}`)
            .then(res => {
                if (res.data.status) {
                    setOpenDelete(false);
                    setAnchorEl(null);
                    refreshList();
                }
            })
            .catch(err => {
                setShowMassage('Delete brand has a problem!')
                setOpenMassage(true)
            })
    }

    const handleCloseDialogDelete = () => {
        setOpenDelete(false);
        setAnchorEl(null);
    }

    const bread = [
        {
            'title': 'Products',
            'href': '/admin/product'
        },
    ]

    const _handleClose = (event, reason) => {
        if (reason === "clickaway") {
          return;
        }
    
        setOpenMassage(false);
      };
    return (
        <AdminLayout breadcrumb={bread} pageName='Brands'>
            <Grid container spacing={2} className='main'>
                <Grid item xs={12} className='box' style={{ display: 'flex', flexDirection: 'column', padding: '0' }}>
                    <Grid item xs={12} className='addColorBox'>
                        <div className='addColorTitle'>
                            <Typography variant="menutitle" m={1} color='black'>
                                Brands List
                            </Typography>
                        </div>
                        <div>
                            <Button variant="contained"
                                color="P"
                                onClick={handleClickOpenDialog}
                                startIcon={<AddIcon />}
                            >
                                Add Brand
                            </Button>
                            <Dialog
                                open={open}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                            >
                                <Grid item xs={12} className='addColor' pt={3} pl={3}>
                                    <Typography variant="menutitle" color='black'>
                                        {isEdit ? 'Edit Brand' : 'Add New Brand'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} p={2}>
                                    <TextField
                                        id="title"
                                        label="Brand Name"
                                        color='P'
                                        fullWidth
                                        sx={{ pb: 2 }}
                                        defaultValue={isEdit ? selectedBrand.title : ''}
                                        onChange={handleChange}
                                    />
                                    <TextField
                                        id="description"
                                        label="Description"
                                        multiline
                                        rows={6}
                                        color='P'
                                        fullWidth
                                        defaultValue={isEdit ? selectedBrand.description : ''}
                                        onChange={handleChange}

                                    />
                                    <Grid item xs={12} display='flex' >
                                        <Grid item xs={4} p={2}>
                                            <Card >
                                                <CardMedia
                                                    component="img"
                                                    defaultValue={isEdit ? axiosConfig.defaults.baseURL + selectedBrand.image_url : ''}
                                                    image={imagePreview}
                                                />
                                            </Card>
                                        </Grid>
                                        <Grid xs={8} p={2} display='flex'>
                                            <label htmlFor="contained-button-file">
                                                <Input accept="image/*"
                                                    id="contained-button-file"
                                                    multiple
                                                    type="file"
                                                    onChange={handleImagePreview}
                                                />
                                                <Button variant="contained"
                                                    component="span"
                                                    className='uploadBtn addImg'
                                                    size="small"
                                                    
                                                >
                                                    <AddIcon />
                                                    Image
                                                </Button>
                                            </label>
                                            <Typography variant="h10" ml={2} mt={4} color='gray'>
                                                The best size is 1800 X 800 px.
                                            </Typography>
                                        </Grid>


                                    </Grid>
                                </Grid>
                                <Grid item xs={12} paddingLeft={1} paddingRight={1} display='flex' justifyContent='end'>
                                    <Button variant="outlined"
                                        color='G1'
                                        className='btnBox1'
                                        onClick={handleCloseDialog}
                                        sx={{ mt: 2, mb: 2, mr: 1, ml: 1 }}
                                    >Cancel</Button>
                                    <Button variant="contained"
                                        color="P"
                                        sx={{ mt: 2, mb: 2, mr: 1, ml: 1, color: 'white' }}
                                        onClick={isEdit ? editBrand : addBrand}
                                        disabled={
                                            value.title == '' || value.description == '' || value.image_url == ''
                                        }
                                    >
                                        save
                                    </Button>
                                </Grid>
                            </Dialog>
                        </div>

                    </Grid>
                    <Grid item xs={12} md={12}>
                        
                        <List>
                            {loading ? isLoading() :
                                list.map((brand, index) => {
                                    return (
                                        <ListItem key={brand.id}>
                                            <Grid item className='counterList'>
                                                <Typography variant="menuitem" p={1} color='black'>
                                                    {index + 1}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={1}>
                                                <Card sx={{ maxWidth: 85 }}>
                                                    <CardMedia
                                                        component="img"
                                                        image={axiosConfig.defaults.baseURL + brand.image_url}
                                                    />
                                                </Card>
                                            </Grid>
                                            <Grid item xs={2} className='brandTitle'>
                                                <Typography variant="menuitem" p={1} color='black'>
                                                    {brand.title}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={4} className='hexText'>
                                                <Typography variant="menuitem" p={1} color='black'>
                                                    {brand.description}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <SwitchCust />
                                            </Grid>
                                            <Grid item xs={2} className='moreIcone'>
                                                <IconButton aria-label="delete"
                                                    aria-controls={openMore ? 'demo-positioned-menu' : undefined}
                                                    aria-haspopup="true"
                                                    aria-expanded={openMore ? 'true' : undefined}
                                                    onClick={(event) => handleClick(event, brand)}
                                                >
                                                    <MoreVertIcon color='Black' />
                                                </IconButton>
                                                <Menu
                                                    id="demo-positioned-menu"
                                                    aria-labelledby="demo-positioned-button"
                                                    anchorEl={anchorEl}
                                                    open={openMore}
                                                    onClose={handleClose}
                                                    anchorOrigin={{
                                                        vertical: 'top',
                                                        horizontal: 'right',
                                                    }}
                                                    transformOrigin={{
                                                        vertical: 'top',
                                                        horizontal: 'right',
                                                    }}
                                                >
                                                    <MenuItem
                                                        onClick={handleClickEdit}>Edit</MenuItem>
                                                    <MenuItem onClick={handleClickDelete}>Delete</MenuItem>
                                                </Menu>
                                            </Grid>
                                        </ListItem>
                                    )
                                })}
                        </List>
                        <Dialog
                            open={openDelete}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <Grid xs={12} display='flex' justifyContent='center' mt={3} mb={1} ml={3} mr={6}>
                                <Typography>
                                    Are you sure you want to delete {selectedBrand.title} ?
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
                                    onClick={deleteBrand}
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
    )
}

export default AddBrand
