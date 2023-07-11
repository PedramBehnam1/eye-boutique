import React, {  useState, useEffect } from "react";
import "../../asset/css/homePage/blog.css";
import Grid from "@mui/material/Grid";
import {
  Typography,
  Card,
  CardMedia,
  Divider
} from "@mui/material";
import Footer from "../../layout/footer";
import axiosConfig from '../../axiosConfig';
import Header from "../../layout/Header";
import DOMPurify from 'dompurify';
import NoProductImage from "../../asset/images/No-Product-Image-v2.png";
import { useHistory, useLocation, useParams } from "react-router-dom";

const BlogDetail = (props) => {
  const [isRemoved, setIsRemoved] = useState(false);
  const[showCartPage,setShowCartPage]=useState(false)
  const [trigger,setTrigger] = useState(0)
  const [_trigger, _setTrigger] = useState(0);

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [files, setFiles] = useState([]);
  const [title, setTitle] = useState('');
  const [enDescription, setEnDescription] = useState('');
  const [startDateAndTime, setStartDateAndTime] = useState(new Date());
  const [mainImage,setMainImage ]=useState([]);
  const[imageNumber,setImageNumber]=useState(0)
  const[imageNumberEditor,setImageNumberEditor]=useState([])
  const[editorOrImageValues,setEditorOrImageValues]=useState([{key:'',value:'',isTextOrImage:''}]);
  const[selectedPosts, setSelectedPosts]= useState([{blog:'',image_url:'',title:'',en_description:''}])
  const[selectedProducts, setSelectedProducts]= useState([{product:'',image_url:'',name:''}])
  const[key,setKey]=useState(0);
  const[times,setTimes]=useState(['5 min','10 min','15 min']);
  const[selectedTimeIndex,setSelectedTimeIndex]=useState(0);

  const [windowResizing, setWindowResizing] = useState(false);
  const { id } = useParams();
  let history = useHistory();
  const location = useLocation();

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


    useEffect(()=>{getBlog(location.state ? location.state.blogId : id)
        getAllBlog();
        axiosConfig.get(`/admin/blog/${location.state ? location.state.blogId : id}`)
        .then(async res => {
            let posts = [{image:''}]
            
            setFiles(posts)
        })
        
    },[])

    const getBlog = async (blogId)=>{
        let blogs = [];
        await axiosConfig.get('/admin/blog/all?title=&page=1&limit=20')
            .then( async res => {
                blogs = res.data.blogs.filter(b=> b.attributes.length!=0&&((b.attributes[0].value).includes('')));
                setBlogs(blogs)

                await axiosConfig.get(`/admin/blog/${blogId}`)
                .then(async res => {
                    setTitle(res.data.blog_attributes.filter(attribute=>attribute.attribute_id == 1)[0].value)
                    setEnDescription(res.data.blog_attributes.filter(attribute=>attribute.attribute_id == 2)[0].value)
                    setStartDateAndTime(new Date(res.data.blog.create_date) )
                    //get main image
                    let mainImage = [];
                    mainImage.push({ 'src': res.data.file_url.image_url, 'id': res.data.file_url.id })
                    setMainImage([...mainImage])

                    //get editor images
                    setImageNumber(1)
                    let numberOfImages=0;
                    let images = [{src:'',id:''}]
                    let key = '';
                    let _key = '';
                    res.data.blog_images.map(img=>{

                        if ( key != img.key ) {
                            numberOfImages=0;
                        }else
                            numberOfImages= numberOfImages+1

                        if (key !== '' && key == img.key ) {
                            images.push({src:img.file_url,id:img.file_id})
                            images[1].id = img.file_id;
                            images[1].src = img.file_url;
                            editorOrImageValues[img.key] = {key:img.key,value:images,isTextOrImage:'Image'}
                            imageNumberEditor[img.key] = numberOfImages+1;
                            key='';
                            images = [{src:'',id:''}]
                        }else{
                            images[0].id = img.file_id;
                            images[0].src = img.file_url;
                            editorOrImageValues[img.key] = {key:img.key,value:images,isTextOrImage:'Image'}
                            imageNumberEditor[img.key] = numberOfImages+1;
                            key = img.key
                        }
                        _key = img.key;
                        
                    })
                    
                    key ='';
                    res.data.blog_body.map(body=>{
                        editorOrImageValues[body.key] = {key:body.key,value:body.body,isTextOrImage:'Text'}
                        key = body.key
                        if (_key<body.key) {
                            _key = body.key;
                        }
                    })
                    
                    
                    setKey(_key+1);
                    times.map((time,index)=>{
                        if (time ==res.data.blog.time ) {
                            setSelectedTimeIndex(index)
                        }
                    })
                    
                    
                })
            })

            

        axiosConfig.get("/admin/category/all").then((respond) => {
            setCategories(respond.data.categories);
        })
        
    }

    
    const getAllBlog = async ()=>{
        let blogs;
        axiosConfig.get('/admin/blog/all?title=&page=1&limit=20')
        .then(res => {
            setBlogs(res.data.blogs.filter(b=> b.attributes.length!=0&&((b.attributes[0].value).includes(''))))
            blogs= res.data.blogs.filter(b=> b.attributes.length!=0&&((b.attributes[0].value).includes('')))
            
        })
        let relatedPosts;
        let relatedProducts;
    await  axiosConfig.get(`/admin/blog/${location.state ? location.state.blogId : id}`)
        .then(async res => {
            relatedPosts = res.data.blog_attributes.filter(attribute=>attribute.attribute_id == 3)
            relatedProducts = res.data.blog_attributes.filter(attribute=>attribute.attribute_id == 4)
        
        })
        relatedPosts.map((post,index)=>{
            axiosConfig.get(`/admin/blog/${post.value.slice(-2)}`).then(res=>{
                selectedPosts[index]=({blog:res.data.blog,image_url:res.data.file_url.image_url
                ,title:res.data.blog_attributes.filter(attribute=>attribute.attribute_id == 1)[0].value,
                en_description:res.data.blog_attributes.filter(attribute=>attribute.attribute_id == 2)[0].value
                })
            })
        })
        await axiosConfig.get(`/admin/product/all?limit=1000&page=1&language_id=1&status=1&category_id&name=`
        ).then((res) => {
            let products = res.data.products;
            relatedProducts.map((product,index)=>{
                products.map(p=>{
                    if (product.value.split(":")[1] == p.id) {
                        selectedProducts[index]=({product:p,image_url:p.file_urls[0],name:p.name})
                        
                    }
                })
                    
                
            })
            setProducts(products);
        });
    }

    const createMarkup = (html) => {
        return  {
            __html: DOMPurify.sanitize(html)
        }
    }
    
    const countMainVariants = (index) => {
        const mainVariantsArray = [];
        if (products[index] != undefined) {
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
        }
        return mainVariantsArray.length
    }

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

    return (
    <Grid xs={12} md={12} >
        <Grid item backgroundColor="white" xs={12} pt="90px">
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


            <Grid  container  display='flex' flexDirection='row'justifyContent='space-between' >
                <Grid item  xs={window.innerWidth<=980? 12:window.innerWidth<1075?7.4:(window.innerWidth<1115? 7.6:(window.innerWidth<1158?7.8:(window.innerWidth<1200?7.9:(window.innerWidth<1251?8:(window.innerWidth<1300?8.1:(window.innerWidth<1350?8.2:(window.innerWidth<1400?8.3:(window.innerWidth<1448? 8.4:(window.innerWidth<1545? 8.5:(window.innerWidth<1585? 8.6:(window.innerWidth<1600?8.7:8.8)))))))))))} 
                md={window.innerWidth<=980? 12:window.innerWidth<1075?7.4:(window.innerWidth<1115? 7.6:(window.innerWidth<1158?7.8:(window.innerWidth<1200?7.9:(window.innerWidth<1251?8:(window.innerWidth<1300?8.1:(window.innerWidth<1350?8.2:(window.innerWidth<1400?8.3:(window.innerWidth<1448? 8.4:(window.innerWidth<1545? 8.5:(window.innerWidth<1585? 8.6:(window.innerWidth<1600?8.7:8.8)))))))))))}>
                    <Typography ml={window.innerWidth<1044?7 :8.5} mt={5} mb={2} variant='h3' fontSize={28}>
                        {!/\S/.test(title)||title==null?"Title is empty." : title  }
                    </Typography>
                    <Typography variant="h10" color="G1.main" ml={window.innerWidth<1044?7 :8.5}>
                        {startDateAndTime.toLocaleString('en-US', {
                            month: 'short',
                        })} {startDateAndTime.getDate()} . {times[selectedTimeIndex]} read
                    </Typography>
                    <Grid item xs={12} display="flex" justifyContent='space-around' flexWrap="wrap" >

                        {mainImage.length != 0 &&
                        mainImage.map((cardImage, index1) => {
                            return (
                            <Grid p={2} pl={window.innerWidth<1044?6.5 :8} display="flex" xs={12}>
                                <Card
                                style={{
                                    
                                    width: "99%",
                                    height:"372px",
                                    display: "flex",
                                    justifyContent:imageNumber>0?"space-around" :"center",
                                    position: "relative",
                                }}
                                >
                                    <CardMedia
                                        component="img"
                                        image={ cardImage.src != null?axiosConfig.defaults.baseURL + cardImage.src:NoProductImage}
                                    />
                                
                                </Card>
                            </Grid>
                            );
                        })}
                    </Grid>
                    <Typography ml={window.innerWidth<1044?7 :8.5} mr={2.2} mt={1}  fontSize={18} fontWeight='bold' lineHeight={1.5} mb={2.7}
                        maxWidth="100%"
                    >{!/\S/.test(enDescription)|| enDescription=="null"?"Description is empty.":enDescription}
                    </Typography>
                    <Divider   sx={{mb:2,ml:window.innerWidth<1044?7 :8.5,width:"91.7%"}}/>

                    {editorOrImageValues.length!=0&&(
                    editorOrImageValues.map(editorOrImageValue=>{
                        return(
                            editorOrImageValue.isTextOrImage == 'Text'?(
                                <Grid xs={12} pt={2} pl={window.innerWidth<1044?6.5 :8.5} mr={2} lineHeight={1.7}>
                                    <div dangerouslySetInnerHTML={createMarkup(editorOrImageValue.value)}></div>       
                                </Grid>
                            ):(
                                <Grid xs={12} pl={window.innerWidth<1044?5 :6} display='flex' sx={editorOrImageValue.value == 1?{justifyContent:'center'}:{justifyContent:'center'}} flexWrap='wrap' >
                                {editorOrImageValue.value.length != 0 &&
                                    editorOrImageValue.value.map((cardImage, index1) => {
                                        return (
                                        <Grid p={2}  display="flex" xs={window.innerWidth<=1165? 12: (imageNumberEditor[editorOrImageValue.key]>1?6:12)} >
                                            <Card
                                            style={{
                                                width: "100%",
                                                height:"300px",
                                                display: "flex",
                                                justifyContent:imageNumberEditor[editorOrImageValue.key]>0?"center" :"center",
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
                <Grid item xs={window.innerWidth<=980? 12:window.innerWidth<1075?3.7:(window.innerWidth<1115?3.6:(window.innerWidth<1158?3.5:(window.innerWidth<1200?3.4: (window.innerWidth<1251?3.3:(window.innerWidth<1300?3.2:(window.innerWidth<1350?3.1:(window.innerWidth<1400? 3:(window.innerWidth<1448? 2.9:(window.innerWidth<1545? 2.8:(window.innerWidth<1585? 2.7:(window.innerWidth<=1600?2.6:2.5)))))))))))} 
                    md={window.innerWidth<=980? 12:window.innerWidth<1075?3.7:(window.innerWidth<1115?3.6:(window.innerWidth<1158?3.5:(window.innerWidth<1200?3.4: (window.innerWidth<1251?3.3:(window.innerWidth<1300?3.2:(window.innerWidth<1350?3.1:(window.innerWidth<1400? 3:(window.innerWidth<1448? 2.9:(window.innerWidth<1545? 2.8:(window.innerWidth<1585? 2.7:(window.innerWidth<=1600?2.6:2.5)))))))))))} display='flex' flexDirection='column' mt={5}  mr={window.innerWidth<1044?7 :8} >
                    <Grid  maxWidth="100%" mt={11} borderRadius={2} display='flex' flexDirection='column' ml={window.innerWidth<=980?6:0}>
                        <Grid  p={2} pt={2.7} pb={2.7} border="1px solid #DCDCDC" borderRadius={1} sx={{backgroundColor:"GrayLight2.main"}}>
                            <Typography color="Black.main" variant="h11" fontWeight="600">Related Products </Typography>
                        </Grid>
                        
                        { (selectedProducts[0].product!=""&&selectedProducts[0].name!=""&&selectedProducts[0].image_url!="")?
                            selectedProducts.map((p,index)=>{
                                return(
                                    <Grid  borderRadius="5px"  borderLeft="1px solid #DCDCDC" borderBottom="1px solid #DCDCDC"  borderRight="1px solid #DCDCDC" borderTop="1px solid #DCDCDC" 
                                         display="flex" flexDirection="column" pt={1.5} pl={0} pr={0}    
                                    >
                                        <Grid display='flex' sx={{alignSelf: window.innerWidth<=980?'flex-start' :'center'}}>
                                            <Card sx={{ maxWidth: 82, border: "none", boxShadow: "none",pt:0.5 ,
                                                ml:window.innerWidth<=980?6:0,mr:2,cursor:"pointer"}}
                                                onClick={() => {
                                                    let category;
                                                    let type;

                                                    categories.map(c=>{
                                                        c.types.map(t=>{
                                                            if (t.id == p.product.category_id) {
                                                                category = c.title
                                                                type = t.title;
                                                            }
                                                        })
                                                    })
                                                    category = category.replace(/\s+/g, "");
                                                    type = type.replace(/\s+/g, "");
                                                    let gender = p.product.products[0].general_attributes.find(g=>g.title== 'Gender').value;

                                                    history.push({ pathname: `/Products/${category}/${type}/${gender}/${toCamelCase(
                                                        p.product.name
                                                    )}`} )
                                                }}
                                            >
                                                <CardMedia
                                                component="img"
                                                height="82"
                                                width="82"
                                                image={axiosConfig.defaults.baseURL+p.image_url}
                                                className="image"
                                                />
                                            </Card>
                                            <Grid display='flex' flexDirection='column' ml={3} pt={ window.innerWidth< 986 ?2.3 :(window.innerWidth <1000?2.3:2.3)} mb={4}>
                                                <Typography variant="description" sx={{fontWeight:"bold"}}>{!/\S/.test(p.name)|| p.name=="null"?"Name is empty.":p.name }</Typography>
                                                <Grid display='flex' flexWrap='wrap' alignItems='center' pt={1}> 
                                                
                                                    <Typography variant="description" ml={0.1} mt={-0.25568}>{countMainVariants(index) + ' ' + p.product.products[0].main_attributes[0].title + (countMainVariants(index) > 1 ? 's' : '')}</Typography>
                                                    <Typography ml={2.35} mr={2.08} mt={-0.25568}  pt={0.017} variant="description">|</Typography>
                                                    <Typography ml={0} mr={0.6} mt={-0.347} sx={{fontWeight:"bold"}}>$</Typography>
                                                    <Typography ml={0} mt={-0.25568} sx={{fontWeight:"bold"}}>{p.product.products[0].price}</Typography>
                                                </Grid>
                                                
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                )
                            })
                            :""
                        }
                        
                    </Grid>

                    <Grid xs={12} mt={11} mb={3} ml={window.innerWidth>980?0:"35px"}>
                        <Typography color="G1.main" pl="15px" mb="4px">Related Posts </Typography>
                        {selectedPosts.map((post,index)=>{
                            return(
                                blogs.map(blog=>{
                                    if (blog.id === post.blog.id) {
                                        return(
                                            <Grid xs={12} mb={5}>
                                                <Grid xs={8}>
                                                    <Card sx={{ border: "none", boxShadow: "none", marginLeft:2 ,mb:2,cursor:'pointer'}}
                                                        onClick={()=>{history.push({pathname:`/home/ebMagazine/blog/${blog.id}`,
                                                            state: {
                                                                blogId: blog.id,
                                                            }
                                                        });window.location.reload()}}
                                                    >
                                                        <CardMedia
                                                            component="img"
                                                            height="182"
                                                            width="82"
                                                            image={axiosConfig.defaults.baseURL+post.image_url}
                                                            className="image"
                                                        />
                                                    </Card>

                                                </Grid>
                                                <Grid mb={1}><Typography variant='MontseratFS16' pl={4} >{!/\S/.test(post.title)|| post.title=="null"?"Title is empty.":post.title}</Typography></Grid>
                                                <Grid xs={7} mb={1}><Typography variant='h10' pl={4}>{!/\S/.test(post.en_description)||post.en_description!== "null"? post.en_description: "Description is empty."}</Typography></Grid>
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

        </Grid>
        <Footer/>
    </Grid>
    );
};

export default BlogDetail;


