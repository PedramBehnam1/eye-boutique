import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import {
  Grid,
  Paper,
  Typography,
  ListItemText,
  Button,
  AccordionDetails,
  AccordionSummary,
  Accordion,
  List,
  ListItem,
  Hidden
} from "@mui/material";
import { Scrollbars } from "react-custom-scrollbars-2";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Collapse } from "@material-ui/core";

const menuItem = [
  {
    title: "Products",
    path: "/admin/product",
    detail: [
      {
        title: "Product list",
        path: "/admin/product",
      },
      {
        title: "Categories",
        path: "/admin/product/category",
      },
      {
        title: "Attributes",
        path: "/admin/product/attributes",
      },
    ],
  },
  {
    title: "Orders",
    path: "/admin/orderlist",
    detail: [
      {
        title: "Add Order",
        path: "/admin/orderlist/add",
      },
    ],
  },
  {
    title: "Users",
    path: "/admin/users",
  },
  {
    title: "Blog",
    path: "/admin/blog",
  },
  {
    title: "Language",
    path: "/admin/language",
  },
  {
    title: "Tag",
    path: "/admin/tag",
  },
  {
    title: "Content",
    path: "/admin/content",
    detail: [
      {
        title: "FAQ",
        path: "/admin/content/faq",
      },
    ],
  },
  {
    title: "Discount",
    path: "/admin/discounts",
  },
];

const NavList = () => {
  let history = useHistory();
  const location = useLocation();
  const activeItem = (e, i) => {
    const a = e.split("/");
    return a[i];
  };
  const [windowResizing, setWindowResizing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    let timeout;
    const handleResize = () => {
      clearTimeout(timeout);

      setWindowResizing(true);

      timeout = setTimeout(() => {
        setWindowResizing(false);
        if (window.innerWidth > 900) {
          return setShowMenu(false);
        }
      }, 200);
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const style = {
    width: "95%",
    paddingLeft: "20px",
    active: {
      backgroundColor: "rgb(203, 146, 155, 0.2) ",
      borderRadius: "0px",
      paddingLeft: "10px",
      borderRadius: "5px",
    },
    temp: {
      backgroundColor: "#CB929B",
      width: "8px",
      height: "45px",
      marginLeft: "-37px",
      span: {
        fontWeight: "700",
        marginLeft: "38px",
      },
      borderRadius: " 0 5px 5px 0",
    },
    itemList: {
      borderLeft: "1px solid #DCDCDC",
      padding: "0",
      color: "#757575",
    },
    itemListActive: {
      borderLeft: "3px solid #CB929B",
      marginLeft: "-2px",
      span: {
        fontWeight: "700",
        color: ` ${showMenu ? "white" : "black"}`,
      },
    },
    itemActive: {
      backgroundColor: "rgb(203, 146, 155, 0.2) ",
      borderRadius: "0px",
      paddingLeft: "10px",
      height: "45px",
    },
    listTemp: {
      backgroundColor: "#CB929B",
      width: "8px",
      height: "45px",
      marginLeft: "-30px",
      span: {
        fontWeight: "600",
        marginLeft: "38px",
      },
      borderRadius: " 0 5px 5px 0",
      display: "flex",
      alignItems: "center",
    },
  };

  const loc = location.pathname.split("/");

  const getWidth = () => {
    return window.innerWidth >= 1050 ? 150 : 140;
  };
  const changeMarginByWidth = () => {
    return window.innerWidth >= 1675
      ? 7
      : window.innerWidth >= 1560
        ? 6
        : window.innerWidth >= 1470
          ? 5
          : window.innerWidth >= 1380
            ? 4
            : window.innerWidth >= 1280
              ? 3
              : window.innerWidth >= 1170
                ? 2
                : window.innerWidth >= 1110
                  ? 1
                  : window.innerWidth >= 1080
                    ? 0.5
                    : 0;
  };

  const changeHeigthByWidth = () => {
    return window.innerWidth >= 1500
      ? "100%"
      : window.innerWidth >= 1200
        ? 30
        : window.innerWidth >= 880
          ? 20
          : window.innerWidth >= 720
            ? 15
            : 10;
  };
  return (
    <>
      <Hidden mdDown>
        <Grid
          xs={12}
          pl={1}
          sx={{
            position: "sticky",
            top: 80,
            zIndex: 100,
          }}
        >
          <Paper
            style={{
              boxShadow: "none",
              backgroundColor: "#CB929B",
              borderRadius: "5px",
            }}
          >
            <Grid
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="57px"
            >
              <Typography variant="h3" color="white">
                Dashboard
              </Typography>
            </Grid>
          </Paper>
          <Paper
            elevation={5}
            style={{ boxShadow: "none", border: "1px solid #DCDCDC" }}
          >
            <Grid container>
              <Grid item xs={12} md={12} m={0}>
                <Scrollbars style={{ height: window.innerHeight - 145 }}>
                  <List sx={[style, { mt: 2 }]} component="nav">
                    {menuItem.map((item) =>
                      !item.detail ? (
                        <ListItem
                          button
                          onClick={() => {
                            history.push(item.path);
                          }}
                          sx={
                            !loc[3]
                              ? loc[2] == activeItem(item.path, 2)
                                ? style.itemActive
                                : null
                              : null
                          }
                        >
                          <Grid
                            sx={
                              !loc[3]
                                ? loc[2] == activeItem(item.path, 2)
                                  ? style.listTemp
                                  : null
                                : null
                            }
                          >
                            <ListItemText primary={item.title} />
                          </Grid>
                        </ListItem>
                      ) : (
                        <Accordion
                          style={{
                            border: "none",
                            boxShadow: "none",
                            margin: 0,
                          }}
                          defaultExpanded={
                            loc[2] == activeItem(item.path, 2) ? true : false
                          }
                        >
                          <Button
                            color="Black"
                            sx={{
                              padding: "0",
                              width: "100%",
                              textTransform: "none",
                              display: "flex",
                              justifyContent: "start",
                            }}
                          >
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls="panel1a-content"
                              id="panel1a-header"
                              sx={[
                                loc[2] == activeItem(item.path, 2)
                                  ? style.active
                                  : "null",
                                {
                                  width: "100%",
                                  m: 0,
                                  mt: 0,
                                  mb: 0,
                                  p: 0,
                                  pb: 0,
                                  minHeight: "45px",
                                  maxHeight: "45px",
                                },
                              ]}
                              style={{
                                paddingTop: 0,
                                paddingBottom: 0,
                                paddingRight: "20px",
                                margin: 0,
                                minHeight: "45px",
                                maxHeight: "45px",
                              }}
                            >
                              <ListItem
                                onClick={() => history.push(item.path)}
                              >
                                <Grid
                                  sx={[
                                    loc[2] == activeItem(item.path, 2)
                                      ? style.temp
                                      : "null",
                                    {
                                      mt: 0,
                                      mb: 0,
                                      display: "flex",
                                      alignItems: "center",
                                    },
                                  ]}
                                >
                                  <ListItemText pt={1} primary={item.title} />
                                </Grid>
                              </ListItem>
                            </AccordionSummary>
                          </Button>
                          <AccordionDetails
                            sx={[style.itemList, { mb: 0, mt: "20px" }]}
                          >
                            {!item.detail
                              ? ""
                              : item.detail.map((detail) => (
                                <ListItem
                                  button
                                  onClick={() => history.push(detail.path)}
                                  sx={
                                    location.pathname == detail.path
                                      ? style.itemListActive
                                      : "null"
                                  }
                                >
                                  <ListItemText primary={detail.title} />
                                </ListItem>
                              ))}
                          </AccordionDetails>
                        </Accordion>
                      )
                    )}
                  </List>
                </Scrollbars>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Hidden>
      <Hidden mdUp>
        <Grid
          xs={12}
          position="fixed"
          width="100%"
          height={showMenu ? "100%" : "62px"}
          bottom="0"
          m={1}
          mb={0}
          display="flex"
          justifyContent="end"
          flexDirection="column"
          sx={
            showMenu
              ? { backgroundColor: "rgba(0, 0, 0, 0.9)" }
              : {
                background:
                  "linear-gradient(0deg, rgba(203, 146, 155, 0.1), rgba(203, 146, 155, 0.1)), rgba(0, 0, 0, 0.9)",
                borderRadius: "45px 45px 0 0",
              }
          }
          zIndex="1000"
        >
          <Grid
            xs={12}
            p={2}
            pt={4}
            onClick={() => setShowMenu(!showMenu)}
            display="flex"
            justifyContent="center"
            sx={
              showMenu
                ? {
                  backgroundColor: "rgba(203, 146, 155, 0.25)",
                  borderRadius: " 45px 45px 0px 0px",
                }
                : { background: "none" }
            }
          >
            <Typography variant="h8" color="P.main">
              Dashboard
            </Typography>
           
          </Grid>
          <Collapse in={showMenu} orientation="">
            <Grid
              xs={12}
              display="flex"
              sx={{ backgroundColor: "rgba(203, 146, 155, 0.25)" }}
              color="White.main"
            >
              <Grid container justifyContent="center">
                <Grid item xs={10} md={12} m={0}>
                  <Scrollbars style={{ height: window.innerHeight - 250 }}>
                    <List sx={[style, { mt: 2 }]} component="nav">
                      {menuItem.map((item) =>
                        !item.detail ? (
                          <ListItem
                            button
                            onClick={() => {
                              history.push(item.path);
                            }}
                            sx={
                              !loc[3]
                                ? loc[2] == activeItem(item.path, 2)
                                  ? style.itemActive
                                  : null
                                : null
                            }
                          >
                            <Grid
                              sx={
                                !loc[3]
                                  ? loc[2] == activeItem(item.path, 2)
                                    ? style.listTemp
                                    : null
                                  : null
                              }
                            >
                              <ListItemText primary={item.title} />
                            </Grid>
                  
                          </ListItem>
                        ) : (
                          <Accordion
                            style={{
                              border: "none",
                              boxShadow: "none",
                              margin: 0,
                              background: "none",
                            }}
                            defaultExpanded={
                              loc[2] == activeItem(item.path, 2) ? true : false
                            }
                          >
                            <Button
                              color={showMenu ? "White" : "Black"}
                              sx={{
                                padding: "0",
                                width: "100%",
                                textTransform: "none",
                                display: "flex",
                                justifyContent: "start",
                              }}
                            >
                              <AccordionSummary
                                expandIcon={
                                  <ExpandMoreIcon
                                    sx={
                                      showMenu
                                        ? { color: "White.main" }
                                        : { color: "Black.main" }
                                    }
                                  />
                                }
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                                sx={[
                                  loc[2] == activeItem(item.path, 2)
                                    ? style.active
                                    : "null",
                                  {
                                    width: "100%",
                                    m: 0,
                                    mt: 0,
                                    mb: 0,
                                    p: 0,
                                    pb: 0,
                                    minHeight: "45px",
                                    maxHeight: "45px",
                                  },
                                ]}
                                style={{
                                  paddingTop: 0,
                                  paddingBottom: 0,
                                  paddingRight: "20px",
                                  margin: 0,
                                  minHeight: "45px",
                                  maxHeight: "45px",
                                }}
                              >
                                <ListItem
                                  onClick={() => history.push(item.path)}
                                >
                                  <Grid
                                    sx={[
                                      loc[2] == activeItem(item.path, 2)
                                        ? style.temp
                                        : "null",
                                      {
                                        mt: 0,
                                        mb: 0,
                                        display: "flex",
                                        alignItems: "center",
                                      },
                                    ]}
                                  >
                                    <ListItemText pt={1} primary={item.title} />
                                  </Grid>
                                </ListItem>
                              </AccordionSummary>
                            </Button>
                            <AccordionDetails
                              sx={[style.itemList, { mb: 0, mt: "20px" }]}
                            >
                              {!item.detail
                                ? ""
                                : item.detail.map((detail) => (
                                  <ListItem
                                    button
                                    onClick={() => history.push(detail.path)}
                                    sx={
                                      location.pathname == detail.path
                                        ? style.itemListActive
                                        : "null"
                                    }
                                  >
                                    <ListItemText primary={detail.title} />
                                  </ListItem>
                                ))}
                            </AccordionDetails>
                          </Accordion>
                        )
                      )}
                    </List>
                  </Scrollbars>
                </Grid>
              </Grid>
            </Grid>
          </Collapse>
        </Grid>
      </Hidden>
    </>
  );
};

export default NavList;
