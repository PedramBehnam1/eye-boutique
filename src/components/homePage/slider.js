import React from 'react';
import SwipeableViews from 'react-swipeable-views';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import image1 from '../../asset/images/image 4.png'
import image2 from '../../asset/images/image 2.png'
import image3 from '../../asset/images/image 1.png'
import '../../asset/css/homePage/newProduct.css'
const styles = {


};
const products = [
  {
      'image': image1,
      'title': 'ROUND SUNGLASSES',
      'countColor': '4 Color',
      'price': 'KWD 740'
  },
  {
      'image': image2,
      'title': 'ROUND SUNGLASSES',
      'countColor': '4 Color',
      'price': 'KWD 740'
  },
  {
      'image': image3,
      'title': 'ROUND SUNGLASSES',
      'countColor': '4 Color',
      'price': 'KWD 740'
  }
]
function Slider() {
  const temp = products.map(({ image, title, countColor, price }) => {
    return (
      <div style={Object.assign({}, styles.slide, styles.slide1)} className='slider'>
         <Grid item xs={4} md={4} >
            <Card sx={{ maxWidth: 300 }} className='cardItem'>
                <CardMedia
                    component="img"
                    image={image}
                />
               
            </Card>
        </Grid>
      </div>
       
     
    )
})
  return (
    <Grid container spacing={0} >
    <Grid item xs={12} className='newProductMain'>
    return (
    <SwipeableViews style={styles.root} slideStyle={styles.slideContainer}>
      {temp}
    </SwipeableViews>
    </Grid>
    </Grid>
  );
}

export default Slider;