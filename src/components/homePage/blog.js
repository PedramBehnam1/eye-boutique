import React, {  useState, useEffect } from "react";
import "../../asset/css/homePage/blog.css";
import Grid from "@mui/material/Grid";
import {
  Button,
  Typography,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import axiosConfig from '../../axiosConfig';
import { useHistory } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import No_Product_Image from "../../asset/images/No-Product-Image-v2.png";
import SwiperCore,{ Pagination,Navigation } from "swiper";
import "../../asset/css/styles.css";

const Blog = (props) => {
  const en_description = props.blog.blog_attributes != undefined? props.blog.blog_attributes.filter(attribute=>attribute.attribute_id == 2)[0].value:'';
  const [showMore,setShowMore]=useState(false)
  let history = useHistory()
  const [windowResizing, setWindowResizing] = useState(false);
  
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
  const truncate = (value,num)=>{
      return value.slice(0,num)+"..."
  }
  const mobileSize = () => {
    SwiperCore.use([Pagination,Navigation]);
    return (
      props.allBlog.length>0&&(
        <Swiper className="mySwiper2" height='400px' style={{maxHeight:"490px",backgroundColor:'#000000'}} 
          spaceBetween={window.innerWidth>900?160:window.innerWidth>830?140:window.innerWidth>710?120:window.innerWidth>588?100:80} 
          centeredSlides slidesPerView={1.5}
          initialSlide={Math.floor(props.allBlog.length/2) }
          pagination={{
            clickable: true,
          }}
          navigation={true}
          mousewheel={true}
          modules={[Pagination]}
         
        >
        {props.allBlog.map((blog,index) => {
          return (
                <SwiperSlide style={{backgroundColor:'#000000',ml:index==0?"-95px":0,maxHeight:"300px"}}   >
                  <Grid 
                    onClick={()=>{history.push({pathname:`/home/ebMagazine/blog/${blog.id}`,
                      state: {
                        blogId: blog.id,
                      }
                    })}}
                    sx={{cursor:'pointer', backgroundImage: `url(${blog.file_url!=undefined?axiosConfig.defaults.baseURL+blog.file_url.image_url:No_Product_Image})`,backgroundSize: "100% 300px" ,display:'flex' , flexDirection:'column',justifyContent:'end'}}
                    height="250px" maxHeight='250px' width="100%"
                  >
                    <Grid display='flex' justifyContent='center' alignItems='center' height="100%">
                      <Grid
                        item
                        xs={12}
                        sx={{
                          backgroundColor: "White2.main",
                          textAlign:"center",
                          width:"80%",
                          pt:"10px",
                          pb:"10px",
                          position:"absolute",
                          boxShadow:'none',
                          borderRadius:'4px',
                          opacity:'0.94'
                        }}
                      >
                        {props._blog.blog_attributes != undefined?
                        <Button   sx={{
                          fontSize:window.innerWidth>670?"18px":"8px",
                          fontWeight:"700",
                          color:'Black.main',textTransform:'none',":hover":{bgcolor:'initial'}}}
                        >
                          {blog.attributes != undefined?(!/\S/.test(blog.attributes.filter(attribute=>attribute.attribute_id == 1)[0].value)||blog.attributes.filter(attribute=>attribute.attribute_id == 1)[0].value==null?"Title is empty." : (blog.attributes.filter(attribute=>attribute.attribute_id == 1)[0].value.length>10?truncate(blog.attributes.filter(attribute=>attribute.attribute_id == 1)[0].value,13):blog.attributes.filter(attribute=>attribute.attribute_id == 1)[0].value)):'Title is empty.'}
                        </Button>
                        :''}
                        
                      </Grid>

                    </Grid>
                  </Grid>
                </SwiperSlide>


          )

        })}
        </Swiper>

      )
    );
  };
  return (
    window.innerWidth>1001?
    <Grid container xs={12} display='flex' flexWrap='wrap' >

      
      {props.blog != ""&&(
        <Grid pr={props.numberOfBlog>1?"8px":0} item xs={props.numberOfBlog<=1?12 : (window.innerWidth>=1000?6:12)} md={props.numberOfBlog<=1?12 : (window.innerWidth>=1000?6:12)} style={{height:600}} >
              <Grid 
                item xs={12}
                style={{height:"100%"}}
                
                sx={{
                  
                  backgroundImage: `url(${props.blog.file_url != undefined?axiosConfig.defaults.baseURL+props.blog.file_url.image_url:''})`,
                  backgroundSize: "cover",
                  position:"relative"
                }}
                
                >
              <Card
                  sx={{
                    minWidth: "50%",
                    maxWidth: "50%",
                    top: "35%",
                    borderWidth: "1px",
                    backgroundColor: "White2.main",
                    justifyContent:"center",
                    position:"absolute",
                    left:"25%",
                    boxShadow:'none',
                    opacity:'0.94'
                  }}
                  elevation={0}
                  
                >
                  
              
                  <CardContent sx={{textAlign:'center',display:'flex',flexDirection:'column'}}>
                    {props.blog.blog_attributes != undefined?
                      <Typography mb={2} variant="h3" sx={{textAlign:"center",fontWeight:'bold',color:'Black.main',fontSize:'18px',textTransform:'none'}}
                      >
                        {props.blog.blog_attributes != undefined?(!/\S/.test(props.blog.blog_attributes.filter(attribute=>attribute.attribute_id == 1)[0].value)||props.blog.blog_attributes.filter(attribute=>attribute.attribute_id == 1)[0].value==null?"Title is empty." : props.blog.blog_attributes.filter(attribute=>attribute.attribute_id == 1)[0].value) :''}
                      </Typography>
                    :''}
                    <Typography variant="MontseratFS14" fontWeight='400'>
                      {props.blog.blog_attributes != undefined?(en_description=='null'|| !/\S/.test(en_description)?
                      "Description is empty" : (en_description.length>150? (showMore? en_description: en_description.substring(0, 150)) :en_description) )
                      :''}
                    { en_description.length>150&&showMore==false&&(props.blog.blog_attributes != undefined?(en_description=='null'?
                      '' :"...")
                      :'')}
                    </Typography>
                    <Grid display='flex' justifyContent='center' mt="16px">
                      <Button
                        variant="outlined"
                        color="Black"
                        sx={{borderWidth:1,borderColor:"Black.main",justifyContent:"center",width:"150px",height:"36px",borderRadius:"10px"
                        ,":hover":{bgcolor:'initial'}
                        }}
                        onClick={()=>{history.push({pathname:`/home/ebMagazine/blog/${props.blog.blog.id}`,
                          state: {
                              blogId: props.blog.blog.id,
                          }
                        })}}
                        
                      >
                        <Typography variant="h1" textTransform='none'>See More</Typography> 
                      </Button>

                    </Grid>
                  </CardContent>
                  <CardActions sx={{justifyContent:"center"}}>
                  </CardActions>

                  
                </Card>
              </Grid>
        </Grid>
      )}
      {props.numberOfBlog>1&&(
        <Grid item xs={window.innerWidth>=1000?6:12} md={window.innerWidth>=1000?6:12}  style={{height:window.innerWidth>=1000?600: (props.numberOfBlog==2? 600:850)}}>        
          <Grid
            item xs={12}
            style={{height:props.numberOfBlog == 2? "100%":"50%"}}
            sx={{  
              backgroundImage: `url(${props._blog.file_url != undefined?axiosConfig.defaults.baseURL+props._blog.file_url.image_url:''})`,
              backgroundSize: "cover",
              justifyContent:"center",
              position:"relative",
              pb:props.numberOfBlog == 2? 0:"5px"
            }}
          
          >
            <Grid
              item
              xs={12}
              sx={{
                backgroundColor: "White2.main",
                textAlign:"center",
                width:"80%",
                marginLeft:"100px",
                marginRight:"-200px",
                padding:"20px",
                pt:"10px",
                pb:"10px",
                position:"absolute",
                top:"50%",
                boxShadow:'none',
                borderRadius:'4px',
                opacity:'0.94'
              }}
            >
              {props._blog.blog_attributes != undefined?
              <Button  variant="h3" sx={{textAlign:"center",fontWeight:'bold',color:'Black.main',fontSize:'18px',textTransform:'none'
              ,":hover":{bgcolor:'initial'}
              }}
                onClick={()=>{history.push({pathname:`/home/ebMagazine/blog/${props._blog.blog.id}`,
                  state: {
                      blogId: props._blog.blog.id,
                  }
                })}}
              >
                {props._blog.blog_attributes != undefined?(!/\S/.test(props._blog.blog_attributes.filter(attribute=>attribute.attribute_id == 1)[0].value)||props._blog.blog_attributes.filter(attribute=>attribute.attribute_id == 1)[0].value==null?"Title is empty." : props._blog.blog_attributes.filter(attribute=>attribute.attribute_id == 1)[0].value):''}
              </Button>
              :''}
              
            </Grid>
          </Grid>
          {props.numberOfBlog == 3 &&(
            <Grid item xs={12} style={{height:props.numberOfBlog == 2? "50%":"99%"}} pt="6.5px">
              <Grid
                item xs={12}
                style={{height:"50%"}}
                sx={{
                  backgroundImage: `url(${props._blog_.file_url != undefined?axiosConfig.defaults.baseURL+props._blog_.file_url.image_url:''})`,
                  backgroundSize: "cover",
                  justifyContent:"center",
                  position:"relative"              
                }}
              
              >
                <Grid
                  item
                  xs={12}
                  
                  sx={{
                    backgroundColor: "White2.main",
                    textAlign:"center",
                    width:"80%",
                    marginLeft:"100px",
                    marginRight:"-200px",
                    padding:"20px",
                    pt:"10px",
                    pb:"10px",
                    position:"absolute",
                    top:"50%",
                    boxShadow:'none',
                    borderRadius:'4px',
                    opacity:'0.94'
                  }}
                >
                  {props._blog_.blog_attributes != undefined?
                  <Button variant="h3" sx={{textAlign:"center",fontWeight:'bold',color:'Black.main',fontSize:'18px',textTransform:'none'
                  ,":hover":{bgcolor:'initial'}
                  }}
                    onClick={()=>{history.push({pathname:`/home/ebMagazine/blog/${props._blog_.blog.id}`,
                      state: {
                          blogId: props._blog_.blog.id,
                      }
                    })}}
                  >
                    {props._blog_.blog_attributes != undefined?(!/\S/.test(props._blog_.blog_attributes.filter(attribute=>attribute.attribute_id == 1)[0].value)||props._blog_.blog_attributes.filter(attribute=>attribute.attribute_id == 1)[0].value==null?"Title is empty." : props._blog_.blog_attributes.filter(attribute=>attribute.attribute_id == 1)[0].value):''}
                  </Button>
                  :''}
                  
                </Grid>
              </Grid>
            </Grid>
          )}
        </Grid>  

      )}
      
    </Grid>
    :<>
      {mobileSize()}
      
      
    </>
    
  );
};

export default Blog;

