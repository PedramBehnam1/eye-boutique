import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardMedia,
  Grid,
  CardContent,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import axiosConfig from "../../axiosConfig";
import blogImg from "../../asset/images/blog.png";
import Footer from "../../layout/footer";
import Header from "../../layout/Header";
import NoProductImage from "../../asset/images/No-Product-Image-v2.png";
import { useHistory } from "react-router-dom";

const EbMagazine = (theme) => {
    const [isRemoved, setIsRemoved] = useState(false);
    const[showCartPage,setShowCartPage]=useState(false)
    const [trigger,setTrigger] = useState(0)
    const [_trigger, _setTrigger] = useState(0);
    const [blogs,setBlogs]=useState([])
    const [images,setImages ]=useState([]);
    const [allItem,setAllItem ]=useState(false);  
    const [windowResizing, setWindowResizing] = useState(false);
    let history = useHistory()
  
    useEffect(() => {
    let timeout;
    const handleResize = () => {
        clearTimeout(timeout);

        setWindowResizing(true);

        timeout = setTimeout(() => {
            setWindowResizing(false);
        }, 200);
    }
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        refreshList();
    }, []);


    const refreshList = async() => {
        await axiosConfig.get('/admin/blog/all?title=&page=1&limit=20')
        .then(async res => {
            let blogs =(res.data.blogs.filter(b=> b.attributes.length!=0&&((b.attributes[0].value).includes(''))))
            blogs = blogs.filter(b=>b.status==0);
            setBlogs(blogs)

            let files=[]
            for (let index = 0; index < blogs.length; index++) {
                const id =  blogs[index].id;
                await axiosConfig.get(`/admin/blog/${id}`)
                .then(res => {
                files[index]=res.data;
                })
            }
            setImages(Object.values(files))
        })
    };


  return (
    <Grid xs={12} md={12}>
        <Grid backgroundColor="white">
            <Grid >
                <Header trigger={trigger} _trigger={_trigger} showShoppingCard={showCartPage} closeShowShoppingCard={()=>{setShowCartPage(false)}}
                    isRemoved={(isRemoved) => {
                        setIsRemoved(isRemoved)
                    }}
                    _trigger_={(trigger) => {
                        setTrigger(trigger);
                        _setTrigger(trigger);
                    }}
                />
            </Grid>
        

        

            <Grid container xs={12}>
                <Grid 
                item xs={12}
                style={{height: "580px"}}
                sx={{
                    backgroundImage: `url(${blogImg})`,
                    backgroundSize: "cover",
                    position:"relative"
                }}
                
                >
                <Card
                    sx={{
                    minWidth: "25%",
                    maxWidth: "25%",
                    top: "59%",
                    borderWidth: "1px",
                    backgroundColor: "Black.main",
                    justifyContent:"center",
                    position:"absolute",
                    left:"10%",
                    opacity:0.6
                    }}
                    
                >
                
                </Card>
                </Grid>
            </Grid>
            <Grid
                display="flex"
                flexWrap="wrap"
                justifyContent={"center" }
                alignItems="center"
                backgroundColor="white"
            >
                {blogs && blogs.length > 0 ? blogs.map((blog,index) => {
                    return allItem ==false? (index<3&&
                        (
                            <Grid
                                item
                                md={4}
                                xs={12}
                                display="flex"
                                justifyContent="center"
                                pb={3}
                                pt={1}
                            >
                                <Card
                                    className="card"
                                    elevation={0}
                                    sx={{ width: "90%", height: "90%" }}
                                    
                                    onClick={()=>{history.push({pathname:`/home/ebMagazine/blog/${blog.id}`,
                                        state: {
                                            blogId: blog.id,
                                        }
                                    })}}
                                >
                                
                                <CardMedia
                                    component="img"
                                    height="300"
                                    image={
                                        
                                        images[index]!=undefined?(images[index].file_url!= null ?((images[index].file_url != undefined && images[index].file_url.image_url != null )?  axiosConfig.defaults.baseURL + images[index].file_url.image_url:NoProductImage):NoProductImage):NoProductImage     
                                    }
                                />
                                <CardContent sx={{display:'flex',flexDirection:'column'}}>
                                    <Typography gutterBottom variant="h3" align="left">
                                    {  blog.attributes != undefined?!/\S/.test(blog.attributes.filter(attribute=>attribute.attribute_id == 1)[0].value)||blog.attributes.filter(attribute=>attribute.attribute_id == 1)[0].value==null?"Title is empty." :(window.innerWidth>1117? blog.attributes.filter(attribute=>attribute.attribute_id == 1)[0].value: (blog.attributes.filter(attribute=>attribute.attribute_id == 1)[0].value.length>15? blog.attributes.filter(attribute=>attribute.attribute_id == 1)[0].value.substring(0,10)+"...":blog.attributes.filter(attribute=>attribute.attribute_id == 1)[0].value))  :'Title is empty.'}
                                    </Typography>
                                    <Typography gutterBottom variant="MontseratFS14" sx={{fontWeight: '400'}} align="left">
                                    {blog.attributes != undefined?(!/\S/.test(blog.attributes.filter(attribute=>attribute.attribute_id == 2)[0].value)|| blog.attributes.filter(attribute=>attribute.attribute_id == 2)[0].value=="null"?
                                        "Description is empty" :blog.attributes.filter(attribute=>attribute.attribute_id == 2)[0].value.substring(0, 60)
                                    ):''}
                                    {blog.attributes != undefined?(!/\S/.test(blog.attributes.filter(attribute=>attribute.attribute_id == 2)[0].value)|| blog.attributes.filter(attribute=>attribute.attribute_id == 2)[0].value=="null"?
                                        "" :blog.attributes.filter(attribute=>attribute.attribute_id == 2)[0].value.length>60? " ...":""
                                    ):''}
                                    </Typography>
                                    
                                </CardContent>
                                </Card>
                            </Grid>
                        
                        )
                    ) : (
                        <Grid
                            item
                            md={4}
                            xs={12}
                            display="flex"
                            justifyContent="center"
                            pb={3}
                            pt={1}
                        >
                            <Card
                            className="card"
                            elevation={0}
                            sx={{ width: "90%", height: "90%" }}
                            onClick={() => {
                                
                                
                            }}
                            >
                            
                            <CardMedia
                                component="img"
                                height="300"
                                image={
                                    images[index]!=undefined?(images[index].file_url!= null ?((images[index].file_url != undefined && images[index].file_url.image_url != null )?  axiosConfig.defaults.baseURL + images[index].file_url.image_url:NoProductImage):NoProductImage):NoProductImage     
                                }
                            />
                            <CardContent sx={{display:'flex',flexDirection:'column'}}>
                                <Typography gutterBottom variant="h3" align="left">
                                    
                                {blog.attributes != undefined?blog.attributes.filter(attribute=>attribute.attribute_id == 1)[0].value:''}
                                </Typography>
                                <Typography gutterBottom variant="MontseratFS14" sx={{fontWeight: '400'}} align="left">
                                    {blog.attributes != undefined?(blog.attributes.filter(attribute=>attribute.attribute_id == 2)[0].value=="null"?
                                        "Description is empty" :blog.attributes.filter(attribute=>attribute.attribute_id == 2)[0].value.substring(0, 60)
                                    ):''}
                                    {blog.attributes != undefined?(blog.attributes.filter(attribute=>attribute.attribute_id == 2)[0].value=="null"?
                                        "" :blog.attributes.filter(attribute=>attribute.attribute_id == 2)[0].value.length>60? " ...":""
                                    ):''}
                                </Typography>
                                <Button
                                    variant="outlined"
                                    color="Black"
                                    align="left"
                                    sx={{borderWidth:1,borderColor:"Black.main",fontWeight: 'bold',width:150}}
                                    onClick={()=>{history.push({pathname:`/home/ebMagazine/blog/${blog.id}`,
                                        state: {
                                            blogId: blog.id,
                                        }
                                    })}}
                                >
                                    See More
                                </Button>
                            </CardContent>
                            </Card>
                        </Grid>
                    
                    );
                })
                    :
                    <Grid xs={12} style={{ height: '200px' }} sx={{display:'flex',flexDirection:'row',textAlign:'center'}} >
                        <Typography alignSelf='center'>No blogs found</Typography> 
                    </Grid>
                   
                }{" "}
                
            </Grid>  
            <Grid 
                display= {(blogs.length>3&&allItem==false)?"flex":"none"}
                justifyContent={"center"}
                alignItems="center"
                backgroundColor="white"
                pt={5}
                pb={5}
                mb={3}
            >
                <Button color="Black"  onClick={()=>setAllItem(true)}>
                    <Typography variant="h3"> Load More</Typography>
                    
                </Button>     

            </Grid>
            <Footer/>
        </Grid>
        
      
      
        
      
    
         
      
      
      
      
    </Grid>
  );
};

export default EbMagazine;
