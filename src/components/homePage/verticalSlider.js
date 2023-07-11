import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';


import "../../asset/css/homePage/verticalSlider.css";

import { Pagination } from "swiper";

const verticalSlider = (props) => {

    return (
        <>
            <Swiper
                pagination={{
                    clickable: true,
                }}
                modules={[Pagination]}
                className="mySwiper"
            >
                {props.imageArray.map((img) => {
                    return (
                        <SwiperSlide>
                            <Card sx={{ width: '50%' , border:'none' , boxShadow:'none' }}>
                                <CardMedia
                                    component="img"
                                    height="170"
                                    image={img}
                                />
                            </Card>
                        </SwiperSlide>

                    )
                })}
                
            </Swiper>
        </>
    );
}



export default verticalSlider