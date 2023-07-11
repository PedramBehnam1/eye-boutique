import React, { useRef, useState, useEffect } from "react";
import "../../asset/css/homePage/blog.css";
import Grid from "@mui/material/Grid";
import {
  Typography,
  Paper,
  Card,
  CardMedia,
  CardContent,
  Divider,
  Box,
} from "@mui/material";
import blogCard from "../../asset/images/blogCard.png";
import HeaderOtherPage from "../../layout/Header";
import Footer from "../../layout/footer";

const BlogPage = (props) => {
  const [isRemoved, setIsRemoved] = useState(false);
  const[showCartPage,setShowCartPage]=useState(false)
  const [trigger,setTrigger] = useState(0)
  const [_trigger, _setTrigger] = useState(0);
  return (
    <Grid container xs={12}>
      <HeaderOtherPage  trigger={trigger} _trigger={_trigger} showShoppingCard={showCartPage} closeShowShoppingCard={()=>{setShowCartPage(false)}}
        isRemoved={(isRemoved) => {
            setIsRemoved(isRemoved)
        }}
        _trigger_={(trigger) => {
            setTrigger(trigger);
            _setTrigger(trigger);
        }}
      />

      <Paper sx={{ width: 1 }}>
        <Grid
          container
          m={0}
          xs={12}
          pl={10}
          sx={{
            minHeight: "450px",
          }}
        >
          <Grid
            container
            m={0}
            pl={5}
            pb={5}
            xs={8}
            pr={10}
            sx={{
              minHeight: "450px",
            }}
          >
            <Grid xs={12} pt={15}>
              <Typography variant="h1" mb={1}>
                The real reason Facebook is changing
              </Typography>
              <Typography variant="p">Oct 29 . 10min read</Typography>
              <Grid mt={2} mb={2} sx={{ maxWidth: "750px" }}>
                <CardMedia
                  component="img"
                  height="350px"
                  image={blogCard}
                  alt="not loaded"
                />
              </Grid>
              <Typography mb={5} variant="h2">
                If you are even remotely caught up with tech news, you probably
                already heard Facebook has officially changed its name to Meta.
                Here is what Zuckerberg had to say.
              </Typography>
              <Divider />
              <Grid mt={5}>
                <Typography variant="p">
                  For my long-time readers, you know I am a VR interaction
                  designer & indie game developer for Isekai Ent, launching
                  titles for Steam VR & Oculus. That means other than getting
                  mailed the newest VR kits “for free”, one of our Sword Reverie
                  team's biggest excitement is to tune in for Facebook Connect
                  2021, the annual AR/VR conference, that was hosted today
                  October 28th. Although not as technical as last year, this
                  year Facebook did not disappoint. The whole conference gave us
                  truly a front-row seat to the future from Mark Zuckerberg
                  himself.
                </Typography>
              </Grid>
              <Grid mt={2}>
                <Typography variant="p">
                  If you are even remotely caught up with tech news, you
                  probably already heard Facebook has officially changed its
                  name to Meta. Here is what Zuckerberg had to say.
                </Typography>
              </Grid>
              <Grid container pt={2} justifyContent="space-between" xs={12}>
                <Grid
                  item
                  xs={6}
                  sx={{ maxWidth: "350px" }}
                  display="flex"
                  justifyContent="flex-start"
                >
                  <CardMedia
                    component="img"
                    height="200px"
                    image={blogCard}
                    alt="not loaded"
                  />
                </Grid>
                <Grid item xs={6} sx={{ maxWidth: "350px" }}>
                  <CardMedia
                    component="img"
                    height="200px"
                    image={blogCard}
                    alt="not loaded"
                  />
                </Grid>
              </Grid>
              <Grid mt={2}>
                <Typography variant="p">
                  “Facebook is one of the most used products in the world. But
                  increasingly, it doesn’t encompass everything that we do.
                  Right now, our brand is so tightly linked to one product that
                  it can’t possibly represent everything we are doing.”
                </Typography>
              </Grid>
              <Grid mt={2} mb={2} sx={{ maxWidth: "750px" }}>
                <CardMedia
                  component="img"
                  height="350px"
                  image={blogCard}
                  alt="not loaded"
                />
              </Grid>
              <Grid mt={2}>
                <Typography variant="p">
                  For my long-time readers, you know I am a VR interaction
                  designer & indie game developer for Isekai Ent, launching
                  titles for Steam VR & Oculus. That means other than getting
                  mailed the newest VR kits “for free”, one of our Sword Reverie
                  team's biggest excitement is to tune in for Facebook Connect
                  2021, the annual AR/VR conference, that was hosted today
                  October 28th. Although not as technical as last year, this
                  year Facebook did not disappoint. The whole conference gave us
                  truly a front-row seat to the future from Mark Zuckerberg
                  himself.
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            container
            display={"flex"}
            direction={"column"}
            m={0}
            xs={3}
            sx={{
              minHeight: "450px",
            }}
          >
            <Grid pt={22}>
              <Grid sx={{ height: "auto" }}>
                <Typography>Related Products</Typography>
                <Grid container>
                  <Grid>
                    <Grid
                      xs={12}
                      mb={2}
                      mt={2}
                      sx={{ width: "100%" }}
                      display="flex"
                    >
                      <Grid item xs={4}>
                        <Card
                          sx={{
                            maxWidth: 82,
                            border: "none",
                            boxShadow: "none",
                          }}
                        >
                          <CardMedia
                            component="img"
                            height="82"
                            width="82"
                            image={blogCard}
                            className="image"
                          />
                        </Card>
                      </Grid>
                      <Grid container xs={8} p={1}>
                        <Grid item>
                          <Typography variant="p">ROUND SUNGLASSES</Typography>
                        </Grid>
                        <Grid item display="flex">
                          <Grid>
                            <Typography variant="p">4 colors</Typography>
                          </Grid>
                          <Divider
                            orientation="vertical"
                            flexItem
                            sx={{
                              marginTop: "3px",
                              paddingLeft: 1,
                              borderRightWidth: 1,
                              height: "15px",
                            }}
                          />
                          <Grid>
                            <Typography variant="h1" pt={0.4} pl={1}>
                              KWD 740
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Divider />
                    <Grid
                      xs={12}
                      mb={2}
                      mt={2}
                      sx={{ width: "100%" }}
                      display="flex"
                    >
                      <Grid item xs={4}>
                        <Card
                          sx={{
                            maxWidth: 82,
                            border: "none",
                            boxShadow: "none",
                          }}
                        >
                          <CardMedia
                            component="img"
                            height="82"
                            width="82"
                            image={blogCard}
                            className="image"
                          />
                        </Card>
                      </Grid>
                      <Grid container xs={8} p={1}>
                        <Grid item>
                          <Typography variant="p">ROUND SUNGLASSES</Typography>
                        </Grid>
                        <Grid item display="flex">
                          <Grid>
                            <Typography variant="p">4 colors</Typography>
                          </Grid>
                          <Divider
                            orientation="vertical"
                            flexItem
                            sx={{
                              marginTop: "3px",
                              paddingLeft: 1,
                              borderRightWidth: 1,
                              height: "15px",
                            }}
                          />
                          <Grid>
                            <Typography variant="h1" pt={0.4} pl={1}>
                              KWD 740
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Divider />
                    <Grid
                      xs={12}
                      mb={2}
                      mt={2}
                      sx={{ width: "100%" }}
                      display="flex"
                    >
                      <Grid item xs={4}>
                        <Card
                          sx={{
                            maxWidth: 82,
                            border: "none",
                            boxShadow: "none",
                          }}
                        >
                          <CardMedia
                            component="img"
                            height="82"
                            width="82"
                            image={blogCard}
                            className="image"
                          />
                        </Card>
                      </Grid>
                      <Grid container xs={8} p={1}>
                        <Grid item>
                          <Typography variant="p">ROUND SUNGLASSES</Typography>
                        </Grid>
                        <Grid item display="flex">
                          <Grid>
                            <Typography variant="p">4 colors</Typography>
                          </Grid>
                          <Divider
                            orientation="vertical"
                            flexItem
                            sx={{
                              marginTop: "3px",
                              paddingLeft: 1,
                              borderRightWidth: 1,
                              height: "15px",
                            }}
                          />
                          <Grid>
                            <Typography variant="h1" pt={0.4} pl={1}>
                              KWD 740
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid mt={5}>
              <Typography>Related Posts</Typography>
              <Grid container mt={2} display={"flex"} direction={"column"}>
                <Grid item xs={12} sm={6} lg={4} mb={2}>
                  <Box
                    sx={{
                      minWidth: "300px",
                      maxWidth: "300px",
                      minHeight: "350px",
                      borderWidth: "1px",
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={blogCard}
                      alt="not loaded"
                    />
                    <CardContent sx={{ backgroundColor: "#F9F9F9" }}>
                      <Typography mb={2} variant="h1">
                        Carbon glasses or Still
                      </Typography>
                      <Typography variant="p">
                        Frames are measured by lens width, bridge width and
                        temple length in . You can easily find your size by
                        referring to the numbers on the inside.
                      </Typography>
                      <Grid mb={1} mt={2}>
                        <Typography variant="p">Oct 29 . 10min read</Typography>
                      </Grid>
                    </CardContent>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} lg={4} mb={2}>
                  <Box
                    sx={{
                      minWidth: "300px",
                      maxWidth: "300px",
                      minHeight: "350px",
                      borderWidth: "1px",
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={blogCard}
                      alt="not loaded"
                    />
                    <CardContent sx={{ backgroundColor: "#F9F9F9" }}>
                      <Typography mb={2} variant="h1">
                        Carbon glasses or Still
                      </Typography>
                      <Typography variant="p">
                        Frames are measured by lens width, bridge width and
                        temple length in . You can easily find your size by
                        referring to the numbers on the inside.
                      </Typography>
                      <Grid mb={1} mt={2}>
                        <Typography variant="p">Oct 29 . 10min read</Typography>
                      </Grid>
                    </CardContent>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
      <Footer />
    </Grid>
  );
};

export default BlogPage;
