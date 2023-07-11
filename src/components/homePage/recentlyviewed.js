import React from "react";
import Grid from "@mui/material/Grid";
import { Card, CardMedia } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { useHistory } from "react-router-dom";
import No_Product_Image from "../../asset/images/No-Product-Image-v2.png";
import axiosConfig from '../../axiosConfig';

const Recentlyviewed = (props) => {
  let history = useHistory();
  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="center"
      pb="132px"
      pt={5}
    >
      <Swiper 
      slidesPerView={4} spaceBetween={35} 
      >
        {props.products.length === 0 ?
          <></>:
          <>
       {(props.products).map((p) => {
        return(
            <>
            {((p.name != null ||p.name != undefined) || (p.products.length != 0 && p.products[0].sku !=undefined)) &&
            <SwiperSlide  style={{width:"400px" }} >
              
              <Card sx={{ cursor:'pointer', maxWidth: 250, maxHeight:250 , width:190, border:"1px solid white", color:"White.main" , boxShadow:"0px 2px 1px -1px rgb(255 255 255 / 33%)"}} 
                className="card"
  
                
                onClick={() => {
                  history.push({
                    pathname: `/home/productlist/${p.id}`,
                  })
                }}

              >
                <CardMedia 
                
                  component="img"
                  image={p.file_urls !== null? axiosConfig.defaults.baseURL + p.file_urls[0].image_url : No_Product_Image}
                  style={{height:"62%" }}
                
                />
              
              </Card>
            </SwiperSlide>
          } 
          </> 
        );
      })}
      </>}
          
      </Swiper> 
     
      
    </Grid>
  );
};

export default Recentlyviewed;
