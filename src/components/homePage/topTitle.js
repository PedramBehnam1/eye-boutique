import React from "react";
import "../../asset/css/homePage/topTitle.css";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay } from "swiper";
import axiosConfig from '../../axiosConfig'


import {
  Card,
  CardMedia,
  Grid,
  Typography,
  Link,
} from "@mui/material";
import "../../asset/css/_styles.css";

const TopTitle = (props) => {
  SwiperCore.use([Autoplay]);

  return (
    <Grid xs={12} >
      <Swiper
        className="_swiper"
        autoplay={{ delay: props.timerDelay }}
        modules={[Autoplay]}
        style={{height: "600px"}}
      >
        {props.slider.map((slide, index) => {
          
          return (
            <SwiperSlide
            style={{height:"600px"}}
            >
              <Grid xs={12} position="relative" >
                <Link 
                >
                  <Card
                    sx={{ height: "755px", width: "100%", borderRadius: "0" }}
                  >
                    <CardMedia
                      component="img"
                      image={
                        axiosConfig.defaults.baseURL + slide.file.image_url
                      }
                    />
                  </Card>

                  <Grid
                  right={ window.innerWidth<550?"0px": '35px'}
                    sx={{
                      position: "absolute",
                      top: "450px",
                      lineHeight: 2,
                      paddingBottom: 8,
                      overflow: "visible",
                    }}
                  >
                    <Grid display='flex' flexDirection='column'> 
                      <Typography variant="h25" fontSize={ window.innerWidth>930?"55px": '35px'} color='Black1.main' sx={{ lineHeight: "67px"}}>
                        {slide.title.split("Eyeglasses")[0]}
                      </Typography>
                      <Grid  sx={{
                       bgcolor:'Black1.main', 
                       width:window.innerWidth>445? "400px":window.innerWidth>330?"300px":"250px",
                       height: "75px",
                       display:'flex',
                       flexDirection:'column',
                       justifyContent:'center' 
                      }}>
                        <Typography variant="h25" fontSize={ window.innerWidth>930?"55px": '35px'} color='White.main' pb="8px">{slide.title.split("Glasses Set ")[1]}</Typography>

                      </Grid>

                    </Grid>
                  </Grid>
                </Link>
              </Grid>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </Grid>
  );
};

export default TopTitle;
