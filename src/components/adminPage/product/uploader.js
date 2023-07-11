import React, { useEffect, useState } from 'react'
import axiosConfig from "../../../axiosConfig";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import Notification from '../../../layout/notification';


const Uploader = (props) => {

    const [imagePreview, setImagePreview] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [starImage, setStarImage] = useState('');
    const [base, setBase] = useState();
    const [trigger, setTrigger] = useState();
    const [notificationObj, setNotificationObj] = useState({
        open: false,
        type: 'success',
        message: ''
    })

    const[_trigger,set_Trigger]= useState(1);



    const Input = styled('input')({
        display: 'none',
    });



    useEffect(() => {
        const imagePreviewArr = [...imagePreview];
        
        
        if (props.fileIdstoShow && props.fileIdstoShow.length > 0) {
            setImagePreview(props.fileIdstoShow);
        }
        let formData = new FormData();
        formData.append('file', imageFile);

        if (imageFile && formData) {
            
            axiosConfig.post('/admin/uploader', formData)
                .then(res => {
                    imagePreviewArr.push({ 'src': res.data.files[0].image_url, 'id': res.data.files[0].file_id })
                    setImagePreview([...imagePreviewArr]);
                    props.imagesFile(res.data.files[0].image_url, res.data.files[0].file_id);
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
    }, [imageFile, trigger,_trigger])


    


    const handleImagePreview = (e) => {
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
                }else{
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

    return (
        <Grid item xs={12} display='flex' justifyContent='start'>
            {imagePreview.map((cardImage, index) => {

                return (
                  
                    <Grid p={2} display='flex'
                    >
                        
                        <Card style={{
                            width: '133px',
                            display: 'flex',
                            justifyContent: 'center',
                            position: 'relative',

                        }}>
                            <CardMedia
                                component="img"
                                
                                image={axiosConfig.defaults.baseURL + cardImage.src}
                            />

                            <Grid xs={12} position='absolute' display='flex' justifyContent='space-between'
                                style={{
                                    width: '100%',
                                    backgroundImage: 'linear-gradient(180deg,  rgba(0,0,1,1), rgba(0,0,0,0))',
                                }}>
                                {cardImage.id == starImage ?
                                    <Grid item mt={0.3} ml={0.3}>
                                        <IconButton aria-label="delete">
                                            <StarIcon color='P' fontSize='small' />
                                        </IconButton>
                                    </Grid>
                                    :
                                    <Grid item mt={0.3} ml={0.3}
                                        style={{ backgroundColor: 'white', borderRadius: '50%' }}>
                                        <IconButton aria-label="delete" onClick={() => {
                                            setStarImage(cardImage.id);
                                            props.star(cardImage.id)
                                            
                                        }}
                                            disabled={props.disabled}
                                        >
                                            <StarBorderIcon fontSize='small' />
                                        </IconButton>
                                    </Grid>
                                }

                                <Grid item mt={0.3} ml={0.3}>
                                    <IconButton aria-label="delete" onClick={() => {
                                        set_Trigger(_trigger+1);
                                        imagePreview.splice(index, 1)
                                        
                                        setImagePreview(imagePreview)
                                        setImageFile(null);
                                        
                                    }}
                                        disabled={props.disabled}>
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
                <label htmlFor="contained-button-file">
                    <Input accept="image/*"
                        id="contained-button-file"
                        multiple
                        type="file"
                        onChange={handleImagePreview}
                    />
                    <Button variant="contained"
                    disabled={props.disabled}
                        component="span"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            flexDirection: 'column',
                            background: 'rgba(203, 146, 155, 0.1)',
                            justifyContent: 'center',
                            width: '100%',
                            height: '110px',
                            color: '#CB929B',
                            fontSize: '14px',
                            fontWeight: '400'
                        }}
                        size="small"
                    >
                        <AddIcon />
                        Upload Picture
                    </Button>
                </label>
                <Grid display='flex' alignItems='flex-end' p={2}>
                    <Typography variant="h10" color='gray'>
                        Ratio must be 1:1 (recomended size is 2000 x 2000 px)
                    </Typography>
                </Grid>
            </Grid>
            <Notification open={notificationObj.open} type={notificationObj.type} message={notificationObj.message} />
        </Grid>
    )
}

export default Uploader
