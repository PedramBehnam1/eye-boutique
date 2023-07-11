import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  CardMedia,
  Dialog,
  Divider,
  Grid,
  IconButton,
  TextField,
  Typography,
  Card,
  Link,
  CircularProgress,
  Tooltip,
  Slider,
  Snackbar
} from "@mui/material";
import React, { useEffect, useState } from "react";
import AxiosConfig from "../../../axiosConfig";
import AdminLayout from "../../../layout/adminLayout";
import { Swiper, SwiperSlide } from "swiper/react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import { styled } from "@mui/material/styles";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import TimerIcon from "@mui/icons-material/Timer";
import { useHistory } from "react-router-dom";
import axiosConfig from "../../../axiosConfig";
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';

const Content = () => {
  const [banners, setBanners] = useState([]);
  const [mobileSliders, setMobileSliders] = useState([]);
  const [desktopSliders, setDesktopSliders] = useState([]);
  const [defaultType, setDefaultType] = useState("");
  const [openAddSlider, setOpenAddSlider] = useState(false);
  const [defaultIndex, setDefaultIndex] = useState(0);
  const [isEdit, setIsEdit] = useState(false);
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedSlide, setSelectedSlide] = useState([]);
  const [subMenu, setSubMenu] = useState([
    { title: "", link: "" },
    { title: "", link: "" },
    { title: "", link: "" },
  ]);
  const [isMainBanner, setIsMainBanner] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [fileId, setFileId] = useState("");
  const [disabledSave, setDisabledSave] = useState(true);
  const [loading, setLoading] = useState(false);
  const [openTimerDialog, setOpenTimerDialog] = useState(false);
  const marks = [
    { value: 1, label: "1S" },
    { value: 2, label: "2S" },
    { value: 3, label: "3S" },
    { value: 4, label: "4S" },
    { value: 5, label: "5S" },
    { value: 6, label: "6S" },
    { value: 7, label: "7S" },
    { value: 8, label: "8S" },
    { value: 9, label: "9S" },
    { value: 10, label: "10S" },
  ];
  const [timer, setTimer] = useState(5);
  let history = useHistory();
  const [user, setUser] = useState("11");
  const [role, setRole] = useState("");
  const [mainBannersCount, setMainBannersCount] = useState(0);
  const [openMassage, setOpenMassage] = useState(false);
  const [showMassage, setShowMassage] = useState('');


  useEffect(() => {
    getUserInfo();
  }, []);

  const getUserInfo = () => {
    axiosConfig
      .get("/users/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        let user = res.data.user;
        setUser(user);
        axiosConfig
          .get("/users/get_roles", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((res) => {
            let role1 = "";
            res.data.roles_list.map((role) => {
              if (role.id == user.role) {
                setRole(role.title);
                role1 = role.title;
              }
            });
            if (role1 != "admin" && role1 != "super admin") {
              history.push("/");
            }
          });
      })
      .catch((err) =>{
        if (err.response.data.error.status === 401) {
          axiosConfig
            .post("/users/refresh_token", {
              refresh_token: localStorage.getItem("refreshToken"),
            })
            .then((res) => {
              localStorage.setItem("token", res.data.accessToken);
              localStorage.setItem("refreshToken", res.data.refreshToken);
              getUserInfo();
            })
        } else {
          setShowMassage('Get user info has a problem!')
          setOpenMassage(true)
        }
      });
  };

  useEffect(() => {
    refreshList();
  }, [selectedSlide, defaultIndex]);

  const refreshList = () => {
    AxiosConfig.get("/admin/content/all").then((res) => {
      setBanners(res.data.data.banners);
      setMainBannersCount(res.data.data.banners.filter((s) => s.main_banner));
      setMobileSliders(res.data.data.sliders.filter((s) => s.is_mobile));
      setDesktopSliders(res.data.data.sliders.filter((s) => !s.is_mobile));
      setTimer(res.data.data.timerDelay[0].timer);
    });
  };

  const checkIsEmptySubMenu = () => {
    if (subMenu.filter((s) => s.link === "" || s.title === "").length === 0) {
      setDisabledSave(false);
    } else {
      setDisabledSave(true);
    }
  };

  const timerChange = () => {
    setLoading(true);
    const timerObj = {
      timer: parseInt(timer),
    };
    AxiosConfig.post("/admin/content/add/slider/timer", timerObj)
      .then((res) => {
        setLoading(false);
        setOpenTimerDialog(false);
        refreshList();
      })
      .catch((err) => {
        setShowMassage('Get timer of sliders have a problem!')
        setOpenMassage(true)
      });
  };

  const handleClickSlideDialog = (open, index, type) => {
    setLoading(false);
    setDefaultType(type);
    setOpenAddSlider(open);
    setDefaultIndex(index);
    if (!open) {
      setIsEdit(false);
      setFileId("");
      setImagePreview("");
    } else {
      if (
        index >
        (type === "mobileSlider"
          ? mobileSliders
          : type === "banners"
            ? banners
            : desktopSliders
        ).length
      ) {
        setIsEdit(false);
      } else {
        setImagePreview(
          (type === "desktopSlider"
            ? desktopSliders
            : type === "mobileSlider"
              ? mobileSliders
              : banners)[index].file.image_url
        );
        setIsEdit(true);
      }
    }
  };

  const Input = styled("input")({
    display: "none",
  });

  const deleteSlide = () => {
    setLoading(true);
    AxiosConfig.delete(`/admin/content/${selectedSlide.id}`)
      .then((res) => {
        refreshList();
        setOpenDeleteDialog(false);
        setSelectedSlide([]);
        setLoading(false);
      })
      .catch((err) => {
        
        setShowMassage('delete slide has a problem!')
        setOpenMassage(true)
      });
  };

  function handleChangeImageButton(e) {
    let imageFiles = e.target.files[0];
    let formData = new FormData();
    formData.append("file", imageFiles);
    imageFiles
      &&( 
        AxiosConfig.post("/admin/uploader", formData)
        .then((res) => {
          setFileId(res.data.files[0].file_id);
          setImagePreview(res.data.files[0].image_url);
          if (defaultType === "banners") {
            checkIsEmptySubMenu();
          }
        })
        .catch((err) => {
          setShowMassage('Add photo has a problem!')
          setOpenMassage(true)
        })
      )
  }

  const clickSaveBtn = (type) => {
    setLoading(true);
    let newObj = {};
    if (isEdit) {
      if (type === "banners") {
        for (let i = 0; i < 3; i++) {
          if (subMenu[i].title === "") {
            subMenu[i].title = selectedSlide?.sub_menu[i].title;
            subMenu[i].link = selectedSlide?.sub_menu[i].link;
          }
        }
        newObj = {
          title: title === "" ? selectedSlide.title : title,
          link: link === "" ? selectedSlide.link : link,
          file_id: fileId === "" ? selectedSlide.file_id : fileId,
          main_banner: isMainBanner,
          sub_menu: subMenu,
        };
      } else {
        newObj = {
          title: title === "" ? selectedSlide.title : title,
          link: link === "" ? selectedSlide.link : link,
          file_id: fileId === "" ? selectedSlide.file_id : fileId,
          is_mobile: type === "desktopSlider" ? false : true,
        };
      }
      AxiosConfig.put(`/admin/content/${selectedSlide.id}`, newObj)
        .then((res) => {
          
          handleClickSlideDialog(false, 0, "");
          refreshList();
          isEdit(false);
          setSelectedSlide([]);
          setTitle("");
          setLink("");
          setFileId("");
          setSubMenu([
            { title: "", link: "" },
            { title: "", link: "" },
            { title: "", link: "" },
          ]);
          setLoading(false);
        })
        .catch((err) => {
          setShowMassage('Update slide has a problem!')
          setOpenMassage(true)
        });
    } else {
      if (type === "banners") {
        newObj = {
          title: title,
          link: link,
          file_id: fileId,
          main_banner: isMainBanner,
          sub_menu: subMenu,
        };
        AxiosConfig.post("/admin/content/add/banner", newObj)
          .then((res) => {
            
            handleClickSlideDialog(false, 0, "");
            refreshList();
            setTitle("");
            setLink("");
            setFileId("");
            setSubMenu([
              { title: "", link: "" },
              { title: "", link: "" },
              { title: "", link: "" },
            ]);
            setSelectedSlide([]);
            setLoading(false);
          })
          .catch((err) => {
            setShowMassage('Add banner has a problem!')
            setOpenMassage(true)
          });
      } else {
        newObj = {
          title: title,
          link: link,
          file_id: fileId,
          is_mobile: type === "desktopSlider" ? false : true,
        };
        AxiosConfig.post("/admin/content/add/slider", newObj)
          .then((res) => {
            setLoading(false);
            handleClickSlideDialog(false, 0, "");
            refreshList();
            setTitle("");
            setLink("");
            setFileId("");
            setSubMenu([
              { title: "", link: "" },
              { title: "", link: "" },
              { title: "", link: "" },
            ]);
          })
          .catch((err) => {
            setShowMassage('Add slide has a problem!')
            setOpenMassage(true)
          });
      }
    }
  };

  const slider = (type) => {
    return (
      <>
        <Swiper className="mySwiper">
          {(type === "mobile" ? mobileSliders : desktopSliders).map(
            (slide, index) => {
              return (
                <SwiperSlide
                  className="swiper-slide"
                  data-swiper-autoplay="2000"
                >
                  <Grid xs={12} position="relative" p={2}>
                    <Card
                      sx={{ height: "600px", width: "100%", borderRadius: "0" }}
                    >
                      <CardMedia
                        component="img"
                        image={
                          AxiosConfig.defaults.baseURL + slide.file.image_url
                        }
                      />
                    </Card>
                    <Grid
                      sx={{
                        position: "absolute",
                        top: "20px",
                        right: "20px",
                      }}
                    >
                      <IconButton
                        color="Black"
                        style={{
                          backgroundColor: "white",
                          margin: "2px",
                        }}
                        onClick={() => {
                          setOpenTimerDialog(true);
                        }}
                      >
                        <TimerIcon />
                      </IconButton>
                      <IconButton
                        color="Black"
                        style={{
                          backgroundColor: "white",
                          margin: "2px",
                        }}
                        onClick={() => {
                          handleClickSlideDialog(
                            true,
                            index,
                            type === "mobile" ? "mobileSlider" : "desktopSlider"
                          );
                          setSelectedSlide(slide);
                          setTitle(selectedSlide.title);
                          setLink(selectedSlide.link);
                          setFileId(selectedSlide.fileId);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="Black"
                        style={{
                          backgroundColor: "white",
                          margin: "2px",
                        }}
                        onClick={() => {
                          setOpenDeleteDialog(true);
                          setSelectedSlide(slide);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                    <Grid
                      sx={{
                        position: "absolute",
                        top: "250px",
                        right: "40px",
                        backgroundColor: "White1.main",
                        lineHeight: 2,
                        paddingBottom: 8,
                        paddingLeft: "20px",
                        paddingRight: "20px",
                        width: "400px",
                        height: "70px",
                        overflow: "visible",
                      }}
                    >
                      <Typography
                        variant="h25"
                        color="White.main"
                        sx={{ lineHeight: "67px" }}
                      >
                        {slide.title}
                      </Typography>
                    </Grid>
                  </Grid>
                </SwiperSlide>
              );
            }
          )}
          <SwiperSlide>
            <Grid
              xs={12}
              m={2}
              height="600px"
              display="flex"
              border="1px"
              justifyContent="center"
              alignItems="center"
            >
              <Card
                sx={{
                  height: "600px",
                  width: "100%",
                  borderRadius: "0",
                  backgroundColor: "#73737312",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                style={{ border: "none", boxShadow: "none" }}
              >
                <IconButton
                  color="P"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    justifyContent: "center",
                    fontSize: "50px",
                    fontWeight: "400",
                    width: "100%",
                    height: "100%",
                    borderRadius: "0",
                  }}
                  onClick={() =>
                    handleClickSlideDialog(
                      true,
                      (type === "mobile" ? mobileSliders : desktopSliders)
                        .length + 1,
                      type === "mobile" ? "mobileSlider" : "desktopSlider"
                    )
                  }
                >
                  <AddIcon style={{ fontSize: "200px" }} />
                  Add Slider
                </IconButton>
              </Card>
            </Grid>
          </SwiperSlide>
        </Swiper>
      </>
    );
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenMassage(false);
  };

  return (
    <AdminLayout breadcrumb="" pageName="Content">
      <Grid
        sx={{
          paddingLeft: { xs: 0, sm: 1 },
          paddingRight: { xs: 0, sm: 1 },
        }}
      >
        <Accordion defaultExpanded={true} expanded={true}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Grid xs={12} display="flex" justifyContent="space-between">
              <Grid>
                <Typography variant="menutitle">Desktop Main Slider</Typography>
              </Grid>
              <Button
                onClick={() =>
                  handleClickSlideDialog(
                    true,
                    desktopSliders.length + 1,
                    "desktopSlider"
                  )
                }
                startIcon={<AddIcon />}
                color="P"
                sx={{ position: "absolute", right: "50px", zIndex: 100000 }}
              >
                Add Slider
              </Button>
            </Grid>
          </AccordionSummary>{" "}
          <Divider />
          <AccordionDetails style={{ padding: 0 }}>
            <Grid xs={12}>{slider("desktop")}</Grid>
          </AccordionDetails>
        </Accordion>
        <Accordion defaultExpanded={true} expanded={true}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Grid xs={12} display="flex" justifyContent="space-between">
              <Grid>
                <Typography variant="menutitle">Mobile Main Slider</Typography>
              </Grid>
              <Button
                onClick={() =>
                  handleClickSlideDialog(
                    true,
                    mobileSliders.length + 1,
                    "mobileSlider"
                  )
                }
                startIcon={<AddIcon />}
                color="P"
                sx={{ position: "absolute", right: "50px", zIndex: 100000 }}
              >
                Add Slider
              </Button>
            </Grid>
          </AccordionSummary>{" "}
          <Divider />
          <AccordionDetails style={{ padding: 0 }}>
            <Grid xs={12}>{slider("mobile")}</Grid>
          </AccordionDetails>
        </Accordion>
        <Accordion defaultExpanded={true} expanded={true}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Grid xs={12} display="flex" justifyContent="space-between">
              <Grid>
                <Typography variant="menutitle">Main Banners</Typography>
              </Grid>
            </Grid>
            <Button
              onClick={() => {
                handleClickSlideDialog(true, banners.length + 1, "banners");
                setIsMainBanner(true);
              }}
              disabled={mainBannersCount.length >= 2 ? true : false}
              startIcon={<AddIcon />}
              color="P"
              sx={{ position: "absolute", right: "50px", zIndex: 100000 }}
            >
              Add Main Banner
            </Button>
          </AccordionSummary>{" "}
          <Divider />
          <AccordionDetails style={{ padding: 0 }}>
            <Grid
              xs={12}
              display="flex"
              justifyContent="start"
              flexWrap="wrap"
              p={2}
            >
              {banners.map((banner, index) => {
                if (banner.main_banner) {
                  return (
                    <Grid xs={6} className="backImage">
                      <Grid
                        sx={{
                          position: "absolute",
                          top: "5px",
                          right: "5px",
                        }}
                      >
                        <IconButton
                          color="Black"
                          style={{
                            backgroundColor: "white",
                            margin: "2px",
                          }}
                          onClick={() => {
                            setSelectedSlide(banner);
                            handleClickSlideDialog(true, index, "banners");
                            setIsMainBanner(true);
                            setIsEdit(true);
                            setTitle(banner.title);
                            setLink(banner.link);
                            setFileId(banner.fileId);
                            checkIsEmptySubMenu();
                            for (let i = 0; i < 3; i++) {
                              if (subMenu[i].title === "") {
                                subMenu[i].title = banner?.sub_menu[i].title;
                                subMenu[i].link = banner?.sub_menu[i].link;
                              }
                            }
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Grid>
                      <img
                        style={{
                          displayL: "block",
                          width: "100%",
                          height: "320px",
                          objectFit: "cover",
                        }}
                        src={
                          AxiosConfig.defaults.baseURL + banner?.file.image_url
                        }
                      />

                      <Grid
                        className="textIn"
                        style={{
                          top: "65%",
                          height: "70%",
                        }}
                      >
                        <Grid
                          sx={{
                            m: "20px 0 0 20px",
                          }}
                        >
                          <Link
                            color="inherit"
                            underline="none"
                            style={{
                              color: "inherit",
                              textDecoration: "inherit",
                            }}
                          >
                            <Typography variant="h3" style={{ marginBottom: "10px" }}>
                              {banner?.title}
                            </Typography>
                          </Link>
                          {(banner?.sub_menu).map((menu) => {
                            return (
                              <Link
                                color="inherit"
                                underline="none"
                                style={{
                                  color: "inherit",
                                  textDecoration: "inherit",
                                }}
                              >
                                <Typography style={{ marginBottom: "10px" }}>
                                  {menu.title}
                                </Typography>
                              </Link>
                            );
                          })}
                        </Grid>
                      </Grid>
                    </Grid>
                  );
                }
              })}
            </Grid>
          </AccordionDetails>
        </Accordion>
        <Accordion defaultExpanded={true} expanded={true}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Grid xs={12} display="flex" justifyContent="space-between">
              <Grid>
                <Typography variant="menutitle">Banners</Typography>
              </Grid>
            </Grid>
            <Button
              onClick={() => {
                handleClickSlideDialog(true, banners.length + 1, "banners");
                setIsMainBanner(false);
              }}
              startIcon={<AddIcon />}
              color="P"
              sx={{ position: "absolute", right: "50px", zIndex: 100000 }}
            >
              Add Banner
            </Button>
          </AccordionSummary>{" "}
          <Divider />
          <AccordionDetails style={{ padding: 0 }}>
            <Grid
              xs={12}
              display="flex"
              justifyContent="center"
              flexWrap="wrap"
              p={2}
            >
              {banners.map((banner, index) => {
                if (!banner.main_banner) {
                  return (
                    <Grid
                      xs={
                        banners.length % 2 !== 0
                          ? index ===
                            banners.indexOf(
                              banners.filter((b) => !b.main_banner)[0]
                            )
                            ? 12
                            : 6
                          : 6
                      }
                      className="backImage"
                    >
                      <Grid
                        sx={{
                          position: "absolute",
                          top: "5px",
                          right: "5px",
                        }}
                      >
                        <IconButton
                          color="Black"
                          style={{
                            backgroundColor: "white",
                            margin: "2px",
                          }}
                          onClick={() => {
                            setSelectedSlide(banner);
                            handleClickSlideDialog(true, index, "banners");
                            setIsMainBanner(false);
                            for (let i = 0; i < 3; i++) {
                              if (subMenu[i].title === "") {
                                subMenu[i].title = banner?.sub_menu[i].title;
                                subMenu[i].link = banner?.sub_menu[i].link;
                              }
                            }
                            setTitle(banner.title);
                            setLink(banner.link);
                            setFileId(banner.fileId);
                            checkIsEmptySubMenu();
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="Black"
                          style={{
                            backgroundColor: "white",
                            margin: "2px",
                          }}
                          onClick={() => {
                            setOpenDeleteDialog(true);
                            setSelectedSlide(banner);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                      <img
                        style={{
                          displayL: "block",
                          width: "100%",
                          height: "320px",
                          objectFit: "cover",
                        }}
                        src={
                          AxiosConfig.defaults.baseURL + banner.file.image_url
                        }
                      />

                      <Grid
                        className="textIn"
                        display="block"
                        style={{
                          top: "65%",
                          height: "70%",
                          paddingTop: "50px",
                        }}
                      >
                        <Grid
                          sx={{
                            m: "20px 0 0 20px",
                          }}
                        >
                          <Link
                            color="inherit"
                            underline="none"
                            style={{
                              color: "inherit",
                              textDecoration: "inherit",
                            }}
                          >
                            <Typography variant="h3" style={{ marginBottom: "10px" }}>
                              {banner.title}
                            </Typography>
                          </Link>
                          {(banner?.sub_menu).map((menu) => {
                            return (
                              <Link
                                color="inherit"
                                underline="none"
                                style={{
                                  color: "inherit",
                                  textDecoration: "inherit",
                                }}
                              >
                                <p style={{ marginBottom: "10px" }}>
                                  {menu.title}
                                </p>
                              </Link>
                            );
                          })}
                        </Grid>
                      </Grid>
                    </Grid>
                  );
                }
              })}
            </Grid>
          </AccordionDetails>
        </Accordion>
        <Dialog
          maxWidth={
            window.innerWidth < 1150
              ? window.innerWidth < 700
                ? "lg"
                : "md"
              : "sm"
          }
          open={openAddSlider}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <Grid item xs={12} display="flex" justifyContent="start" m={2}>
            <Typography variant="menutitle" color="Black.main">
              {isEdit
                ? `Edit ${(defaultType === "banners" ? "Banner " : "Slide ") +
                (defaultIndex + 1)
                }`
                : "Add New " +
                (defaultType === "banners"
                  ? "Banner "
                  : `${defaultType === "mobile" ? "Mobile" : "Desktop"
                  } Slide `) +
                `(${defaultIndex})`}
            </Typography>
          </Grid>
          <Grid xs={12}>
            <Grid xs={12} display="flex" justifyContent="center" p={4} pt={0}>
              {imagePreview === "" ? (
                <label htmlFor="contained-button-file">
                  <Input
                    accept="image/*"
                    id="contained-button-file"
                    multiple
                    type="file"
                    onChange={(e) => {
                      handleChangeImageButton(e);
                    }}
                  />
                  <Tooltip title="Ratio must be 1:1 (recomended size is 2000 x 2000 px)">
                    <Button
                      variant="contained"
                      component="span"
                      color="P"
                      style={
                        defaultType === "mobileSlider"
                          ? { width: "150px" }
                          : { width: "350px" }
                      }
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "column",
                        background: "rgba(203, 146, 155, 0.1)",
                        justifyContent: "center",
                        height: "150px",
                        color: "P.main",
                        fontSize: "14px",
                        fontWeight: "400",
                      }}
                      size="small"
                    >
                      <AddIcon />
                      Upload Picture
                    </Button>
                  </Tooltip>
                </label>
              ) : (
                <Card sx={{ width: "95%", borderRadius: "0" }}>
                  <label
                    htmlFor="contained-button-file"
                    style={{
                      position: "absolute",
                      right: `${defaultType === "mobileSlider" ? "26%" : "10%"
                        }`,
                      paddingTop: "10px",
                      boxShadow: "none",
                    }}
                  >
                    <Input
                      accept="image/*"
                      id="contained-button-file"
                      multiple
                      type="file"
                      onChange={(e) => {
                        handleChangeImageButton(e);
                      }}
                    />
                    <Tooltip title="Ratio must be 1:1 (recomended size is 2000 x 2000 px)">
                      <Button
                        variant="contained"
                        component="span"
                        color="P"
                        style={{ width: "20px", boxShadow: "none" }}
                        sx={{
                          background: "none",
                          height: "20px",
                          color: "P.main",
                          boxShadow: "none",
                          position: "reletive",
                        }}
                      >
                        <ChangeCircleIcon />
                      </Button>
                    </Tooltip>
                  </label>

                  <CardMedia
                    component="img"
                    image={AxiosConfig.defaults.baseURL + imagePreview}
                    style={{ displayL: "block", objectFit: "cover" }}
                    sx={
                      defaultType === "banners"
                        ? { height: "320px", width: "100%" }
                        : { height: "340px", width: "500px" }
                    }
                  />
                </Card>
              )}
            </Grid>

            <Grid xs={12} p={2} pt={0}>
              <TextField
                label="Title"
                variant="outlined"
                color="P"
                fullWidth
                defaultValue={
                  defaultType === "banners"
                    ? title === ""
                      ? ""
                      : title
                    : selectedSlide.title
                }
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (defaultType === "banners") {
                    checkIsEmptySubMenu();
                  }
                }}
              />
            </Grid>

            <Grid xs={12} p={2} pt={0}>
              <TextField
                label="Link"
                variant="outlined"
                color="P"
                fullWidth
                defaultValue={
                  defaultType === "banner"
                    ? link === ""
                      ? ""
                      : link
                    : selectedSlide.link
                }
                onChange={(e) => {
                  setLink(e.target.value);
                  if (defaultType === "banners") {
                    checkIsEmptySubMenu();
                  }
                }}
              />
            </Grid>
            {defaultType !== "banners" ? (
              ""
            ) : (
              <>
                <Divider />
                <Typography variant="h1" p={1}>
                  Sub Menu:
                </Typography>
                {(banners[defaultIndex] !== undefined
                  ? banners[defaultIndex].sub_menu
                  : [1, 1, 1]
                ).map((menu, index) => {
                  return (
                    <Grid xs={12} display="flex" flexWrap="wrap">
                      <Grid xs={6} p={1}>
                        <TextField
                          label={"Title " + (index + 1)}
                          variant="outlined"
                          color="P"
                          fullWidth
                          defaultValue={isEdit ? menu.title : ""}
                          onChange={(e) => {
                            subMenu[index] = {
                              title: e.target.value,
                              link: subMenu[index].link,
                            };
                            checkIsEmptySubMenu();
                          }}
                        />
                      </Grid>
                      <Grid xs={6} p={1}>
                        <TextField
                          label={"Link " + (index + 1)}
                          variant="outlined"
                          color="P"
                          fullWidth
                          defaultValue={isEdit ? menu.link : ""}
                          onChange={(e) => {
                            subMenu[index] = {
                              title: subMenu[index].title,
                              link: e.target.value,
                            };
                            checkIsEmptySubMenu();
                          }}
                        />
                      </Grid>
                    </Grid>
                  );
                })}
              </>
            )}
          </Grid>
          <Grid
            item
            xs={12}
            paddingLeft={1}
            paddingRight={1}
            display="flex"
            justifyContent="end"
          >
            <Divider />
            <Button
              variant="outlined"
              color="G1"
              onClick={() => {
                setSelectedSlide([]);
                handleClickSlideDialog(false, 0, "");
                setTitle("");
                setLink("");
                setFileId("");
                setSubMenu([
                  { title: "", link: "" },
                  { title: "", link: "" },
                  { title: "", link: "" },
                ]);
                setLoading(false);
              }}
              sx={{ mt: 2, mb: 2, mr: 1, ml: 1 }}
              disabled={loading}
            >
              Cancel
            </Button>
            {loading ? (
              <CircularProgress
                sx={{ width: 10, mt: 2, mb: 2, mr: 2, ml: 2 }}
                color="P"
              />
            ) : (
              <Button
                variant="contained"
                color="P"
                sx={{ mt: 2, mb: 2, mr: 1, ml: 1, color: "white" }}
                onClick={() => clickSaveBtn(defaultType)}
                disabled={
                  defaultType === "banners"
                    ? title === "" ||
                    link === "" ||
                    fileId === "" ||
                    disabledSave
                    : title === "" || link === "" || fileId === ""
                }
              >
                save
              </Button>
            )}
          </Grid>
        </Dialog>

        <Dialog open={openDeleteDialog}>
          <Grid
            xs={12}
            display="flex"
            justifyContent="center"
            mt={3}
            mb={1}
            ml={3}
            mr={6}
          >
            <Typography>
              Are you sure you want delete ({selectedSlide.title}) ?
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            paddingLeft={1}
            paddingRight={1}
            display="flex"
            justifyContent="end"
          >
            <Button
              variant="outlined"
              color="G1"
              onClick={() => {
                setSelectedSlide([]);
                setOpenDeleteDialog(false);
                setTitle("");
                setLink("");
                setFileId("");
                setSubMenu([
                  { title: "", link: "" },
                  { title: "", link: "" },
                  { title: "", link: "" },
                ]);
              }}
              disabled={loading}
              sx={{ mt: 2, mb: 2, mr: 1, ml: 1 }}
            >
              Cancel
            </Button>
            {loading ? (
              <CircularProgress
                sx={{ width: 10, mt: 2, mb: 2, mr: 2, ml: 2 }}
                color="P"
              />
            ) : (
              <Button
                variant="contained"
                color="P"
                sx={{ mt: 2, mb: 2, mr: 1, ml: 1, color: "white" }}
                onClick={deleteSlide}
              >
                Delete
              </Button>
            )}
          </Grid>
        </Dialog>

        <Dialog open={openTimerDialog}>
          <Grid
            xs={12}
            display="flex"
            justifyContent="center"
            m={8}
            style={{ width: "300px" }}
          >
            <Slider
              aria-label="Temperature"
              defaultValue={5}
              onChange={(event, newValue) => {
                setTimer(newValue);
              }}
              value={timer}
              valueLabelDisplay="auto"
              step={1}
              marks={marks}
              min={1}
              max={10}
              color="P"
            />
          </Grid>
          <Grid
            item
            xs={12}
            paddingLeft={1}
            paddingRight={1}
            display="flex"
            justifyContent="end"
          >
            <Button
              variant="outlined"
              color="G1"
              onClick={() => {
                setOpenTimerDialog(false);
              }}
              disabled={loading}
              sx={{ mt: 2, mb: 2, mr: 1, ml: 1 }}
            >
              Cancel
            </Button>
            {loading ? (
              <CircularProgress
                sx={{ width: 10, mt: 2, mb: 2, mr: 2, ml: 2 }}
                color="P"
              />
            ) : (
              <Button
                variant="contained"
                color="P"
                sx={{ mt: 2, mb: 2, mr: 1, ml: 1, color: "white" }}
                onClick={timerChange}
              >
                save
              </Button>
            )}
          </Grid>
        </Dialog>
      </Grid> 

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
    </AdminLayout>
  );
};

export default Content;
