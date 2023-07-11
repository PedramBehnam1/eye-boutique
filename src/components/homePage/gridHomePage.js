import React, { useState, useEffect } from "react";
import {
  Grid,
  Divider,
  Snackbar,
  IconButton,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import axiosConfig from "../../axiosConfig";
import TopTitle from "./topTitle";
import Blog from "./blog";
import Recentlyviewed from "./recentlyviewed";
import Posters from "./posters";
import NewProducts from "./newProducts";
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';

const GridHomePage = (props) => {
  const [banners, setBanners] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [recentlyViewed, setRecentlyViwed] = useState([]);
  const [sliders, setSliders] = useState([]);
  const [slidesTimer, setSlidesTimer] = useState("");
  const [allBlog, setAllBlog] = useState([]);
  const [blog, setBlog] = useState("");
  const [_blog, _setBlog] = useState("");
  const [_blog_, _setBlog_] = useState("");
  const [numberOfBlogs, setNumberOfBlogs] = useState(0);
  const [windowResizing, setWindowResizing] = useState(false);
  const [openMassage, setOpenMassage] = useState(false);
  const [showMassage, setShowMassage] = useState('');


  useEffect(() => {
    let timeout;
    const handleResize = () => {
      clearTimeout(timeout);

      setWindowResizing(true);

      timeout = setTimeout(() => {
        setWindowResizing(false);
      }, 200);
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (props.banners.length != 0) {
      let banners = [];
      banners.push(...props.banners.filter((b) => b.title == "Women"));
      banners.push(...props.banners.filter((b) => b.title == "Men"));
      banners.push(...props.banners.filter((b) => b.title == "Color"));
      banners.push(...props.banners.filter((b) => b.title == "Clear"));

      setSliders(props.sliders);
      setBanners(banners);
    }

    if (props.timer != "") {
      setSlidesTimer(props.timer);
    }

    if (props.sliders.length != 0) {
      setSliders(props.sliders);
    }
  }, [props.sliders]);

  useEffect(() => {
    refreshPage();
    refreshBlogList();
  }, []);

  const refreshPage = () => {
    axiosConfig
      .get("/?language_id=1", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setRecentlyViwed(res.data.data.recently_viewed_products);
        setNewProducts(res.data.data.new_products);
      })
      .catch((err) =>{
        if(err.response?.data.error.status === 401){
          axiosConfig
            .post("/users/refresh_token", {
              refresh_token: localStorage.getItem("refreshToken"),
            })
            .then((res) => {
              localStorage.setItem("token", res.data.accessToken);
              localStorage.setItem("refreshToken", res.data.refreshToken);
              refreshPage();
            })
        }else{
          setShowMassage('Get all new products have a problem!')
          setOpenMassage(true)            
        } 
      });
  };

  const refreshBlogList = async () => {
    let numberOfBlogs = 0;
    await axiosConfig
      .get("/admin/blog/all?title=&page=1&limit=20")
      .then(async (res) => {
        let blogs = res.data.blogs.filter(
          (b) => b.attributes.length != 0 && b.attributes[0].value.includes("")
        );
        blogs = blogs.filter((b) => b.status == 0);
        let threeBlog = [];
        for (let index = 0; index < blogs.length; index++) {
          if (index <= 2) {
            const id = blogs[index].id;
            await axiosConfig.get(`/admin/blog/${id}`).then((res) => {
              threeBlog[index] = res.data;
            });
            numberOfBlogs = index + 1;
          }
        }
        
        setAllBlog(blogs);
        setBlog(blogs[0] != undefined ? Object.values(threeBlog)[0] : "");
        _setBlog(blogs[1] != undefined ? Object.values(threeBlog)[1] : "");
        _setBlog_(blogs[2] != undefined ? Object.values(threeBlog)[2] : "");
      });

    setNumberOfBlogs(numberOfBlogs);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenMassage(false);
  };

  return (
    <Grid container spacing={0} sx={{ backgroundColor: "white" }}>
      <Grid item xs={12}>
        {slidesTimer !== "" && (
          <TopTitle slider={sliders} timerDelay={slidesTimer * 1000} />
        )}
      </Grid>

      {banners.length > 0 &&
        banners
          .filter((b) => b.main_banner)
          .map((banner) => {
            return (
              <Grid item xs={12} md={12}>
                <Posters
                  banner={banner}
                  type="gender"
                />
              </Grid>
            );
          })}
      <Grid pt="90px" xs={12} display="flex" alignItems="center">
        <Grid
          xs={
            window.innerWidth > 1360
              ? 5
              : window.innerWidth > 911
              ? 4.5
              : window.innerWidth > 780
              ? 4.25
              : 4
          }
        ></Grid>
        <Grid
          xs={
            window.innerWidth > 1360
              ? 2
              : window.innerWidth > 911
              ? 3
              : window.innerWidth > 780
              ? 3.5
              : 4
          }
          display="flex"
          justifyContent="center"
          pr="5px"
        >
          <Typography
            color="Black.main"
            variant={
              window.innerWidth > 930
                ? "h22"
                : window.innerWidth < 550
                ? (window.innerWidth>360? "h30":"h29")
                : "h37"
            }
            fontWeight='600'
          >
            New Products
          </Typography>
        </Grid>
        <Grid
          xs={
            window.innerWidth > 1360
              ? 5
              : window.innerWidth > 911
              ? 4.5
              : window.innerWidth > 780
              ? 4.25
              : 4
          }
          alignItems="center"
          pt="4px"
        >
          <Divider
            sx={{
              bgcolor: "Black.main",
              borderTopWidth: "1.2px",
              borderBottomWidth: "1.2px",
              borderColor: "Black.main",
            }}
          />
        </Grid>
      </Grid>
      <Grid item pt="35px" xs={12}>
        <NewProducts />
      </Grid>


      <Grid pt={5} xs={12} display="flex" alignItems="center" pb="49px">
        <Grid
          xs={
            window.innerWidth > 1600
              ? 5
              : window.innerWidth > 1090
              ? 4.5
              : window.innerWidth > 780
              ? 4.25
              : window.innerWidth > 577
              ? 4
              : 3.75
          }
          alignItems="center"
          pt="4px"
        >
          <Divider
            sx={{
              bgcolor: "Black.main",
              borderTopWidth: "1.2px",
              borderBottomWidth: "1.2px",
              borderColor: "Black.main",
            }}
          />
        </Grid>
        <Grid
          xs={
            window.innerWidth > 1600
              ? 2
              : window.innerWidth > 1090
              ? 3
              : window.innerWidth > 780
              ? 3.5
              : window.innerWidth > 577
              ? 4
              : 4.5
          }
          display="flex"
          justifyContent="center"
          pr="5px"
        >
          <Typography
            color="Black.main"
            variant={
              window.innerWidth > 930
                ? "h22"
                : window.innerWidth < 550
                ? (window.innerWidth>360? "h30":"h29")
                : "h37"
            }
            fontWeight='600'
          >
            Contact Lenses
          </Typography>
        </Grid>
        <Grid
          xs={
            window.innerWidth > 1600
              ? 5
              : window.innerWidth > 1090
              ? 4.5
              : window.innerWidth > 780
              ? 4.25
              : window.innerWidth > 577
              ? 4
              : 3.75
          }
        ></Grid>
      </Grid>
      {
        banners.length > 0 &&
          banners
            .filter((b) => !b.main_banner)
            .map((banner, index) => {
              return (
                <Grid
                  item
                  xs={12}
                  md={12}
                  bgcolor={index == 1 ? "Black1.main" : "white.main"}
                >
                  
                  <Posters
                    banner={banner}
                    type="Contact Lenses"
                  />
                </Grid>
              );
            })
            
      }
      <Grid
        item
        xs={12}
        bgcolor="Black1.main"
        pt="94px"
        pb="94px"
        display="flex"
        alignItems="center"
      >
        <Grid
          xs={
            window.innerWidth > 1600
              ? 5
              : window.innerWidth > 1030
              ? 4.5
              : window.innerWidth > 650
              ? 4.25
              : window.innerWidth > 577
              ? 4
              : 3.75
          }
        ></Grid>
        <Grid
          xs={
            window.innerWidth > 1600
              ? 2
              : window.innerWidth > 1030
              ? 3
              : window.innerWidth > 650
              ? 3.5
              : window.innerWidth > 577
              ? 4
              : 4.5
          }
          display="flex"
          justifyContent="center"
          pr="5px"
        >
          <Typography
            color="White.main"
            variant={window.innerWidth > 930 ? "h22" : (window.innerWidth>360? "h30":"h29")}
            fontWeight='600'
          >
            EB Magazine
          </Typography>
        </Grid>
        <Grid
          xs={
            window.innerWidth > 1600
              ? 5
              : window.innerWidth > 1030
              ? 4.5
              : window.innerWidth > 650
              ? 4.25
              : window.innerWidth > 577
              ? 4
              : 3.75
          }
          alignItems="center"
        >
          <Divider
            sx={{
              bgcolor: "White.main",
              borderTopWidth: "1.2px",
              borderBottomWidth: "1.2px",
              borderColor: "White.main",
            }}
          />
        </Grid>
      </Grid>

      <Grid
        pl="8px"
        pr="8px"
        item
        xs={12}
        bgcolor="Black1.main"
        style={{
          height:
            numberOfBlogs == 0
              ? 0
              : window.innerWidth >= 1001
              ? "610px"
              : "410px",
        }}
      >
        <Blog
          blog={blog}
          _blog={_blog}
          _blog_={_blog_}
          allBlog={allBlog}
          numberOfBlog={numberOfBlogs}
        />
      </Grid>

      {recentlyViewed.length != 0 && (
        <>
          <Grid
            item
            xs={12}
            pt="94px"
            pb="94px"
            display="flex"
            alignItems="center"
          >
            <Grid
              xs={
                window.innerWidth > 1600
                  ? 5
                  : window.innerWidth > 1030
                  ? 4.5
                  : window.innerWidth > 650
                  ? 4.25
                  : window.innerWidth > 577
                  ? 4
                  : 3.75
              }
            ></Grid>
            <Grid
              xs={
                window.innerWidth > 1600
                  ? 2
                  : window.innerWidth > 1030
                  ? 3
                  : window.innerWidth > 650
                  ? 3.5
                  : window.innerWidth > 577
                  ? 4
                  : 4.5
              }
              display="flex"
              justifyContent="center"
              pr="5px"
            >
              <Typography
                color="Black1.main"
                variant={window.innerWidth > 930 ? "h22" : "h37"}
              >
                Recently Viewed
              </Typography>
            </Grid>
            <Grid
              xs={
                window.innerWidth > 1600
                  ? 5
                  : window.innerWidth > 1030
                  ? 4.5
                  : window.innerWidth > 650
                  ? 4.25
                  : window.innerWidth > 577
                  ? 4
                  : 3.75
              }
              alignItems="center"
            >
              <Divider
                sx={{
                  bgcolor: "Black1.main",
                  borderTopWidth: "1.2px",
                  borderBottomWidth: "1.2px",
                  borderColor: "Black.main",
                }}
              />
            </Grid>
          </Grid>
          <Grid item xs={12} pb="28px">
            <Recentlyviewed
              products={recentlyViewed}
            />
          </Grid>
        </>
      )}
      <Grid item xs={12} pb={recentlyViewed.length == 0 ? "98px" : 0}></Grid>
                                                        
      <Snackbar open={openMassage} autoHideDuration={6000} onClose={handleClose}
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
    </Grid>
  );
};

export default GridHomePage;
