import React, { useEffect, useState } from "react";
import "../asset/css/homePage/footer.css";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Button,
  Divider,
  Hidden,
  IconButton,
  Typography,
} from "@mui/material";
import {
  GrLinkedinOption,
  GrFacebookOption,
  GrYoutube,
  GrInstagram,
} from "react-icons/gr";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useHistory } from "react-router-dom";
import axiosConfig from "../axiosConfig";

const Footer = (props) => {
  let history = useHistory();
  const [genderId, setGenderId] = useState();
  const [gender, setGender] = useState();
  const [disabledButton, setDisabledButton] = useState(true);
  useEffect(() => {
    seterGender();
  }, []);
  const seterGender = () => {
    const temp = {};
    axiosConfig.get("/admin/category/attributes").then((res) => {
      const genderObj = !res.data.attributes.filter((a) => a.title === "gender")
        ? res.data.attributes.filter((a) => a.title === "gender")[0]["values"]
        : "";

      genderObj &&
        genderObj.forEach((element) => {
          const value = element.value;
          const valueId = element.id;
          setGenderId(element.attribute_id);
          temp[value] = valueId;
        });
    });
    setGender(temp);
  };
  const clickedMenu = (categoryId, valueId, genderName) => {
    categoryId === `category_id=${localStorage.getItem("Glass Sun Glass")}` ||
      categoryId === `category_id=${localStorage.getItem("Glass Eye Glass")}`
      ? history.push({
        pathname: `/home/productlist/${categoryId}/${localStorage.getItem(
          categoryId.split("category_id=")[1]
        )}/${valueId}/${genderName}`,
        state: {
          categoryId: categoryId,
          attributeId: genderId,
          valueId: valueId,
        },
      })
      : history.push({
        pathname: `/home/productlist/${categoryId}/${localStorage.getItem(
          categoryId.split("category_id=")[1]
        )}/all/all`,
        state: {
          categoryId: categoryId,
          attributeId: "",
          valueId: "",
        },
      });
  };

  const sendEmail = (e) => {
    if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e.target.value)) {
      setDisabledButton(false);
    } else {
      setDisabledButton(true);
    }
  }

  return (
    <Grid
      container
      spacing={1}
      justifyContent="center"
      className="footer"
      pt={2}
      sx={window.location.pathname=="/home/profile/orders"?{mt:"16px"}:{}}
    >
      <Hidden smDown>
        <Grid
          item
          xs={12}
          pb={2}
          display="flex"
          justifyContent="space-between"
          borderBottom={1}
          borderColor="gray"
        >
          <Grid xs={5} display="flex" justifyContent="end" alignItems='center'>
            <TextField
              sx={{ width: "80%" }}
              focused
              multiline="false"
              color="G1"
              id="subscribeemail"
              label="Email"
              type="email"
              autocomplete="none"
              placeholder="Leave your email to get the newsletter"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={sendEmail}
            />
          </Grid>
          {disabledButton ? '' :
            <Grid xs={2} display="flex" p={1} pl={4} style={{ color: "white" }}>
              <Button variant="contained" color="P" fullWidth>
                Submit
              </Button>
            </Grid>
          }

          <Grid xs={5} display="flex" justifyContent="center">
            <IconButton p={1}>
              <Avatar
                sx={{ bgcolor: "G1" }}
              >
                <GrLinkedinOption color="#212121" />
              </Avatar>
            </IconButton>

            <IconButton p={1}>
              <Avatar sx={{ bgcolor: "G1" }}>
                <GrFacebookOption color="#212121" />
              </Avatar>
            </IconButton>

            <IconButton p={1}>
              <Avatar sx={{ bgcolor: "G1" }}>
                <GrYoutube color="#212121" />
              </Avatar>
            </IconButton>

            <IconButton p={1}>
              <Avatar sx={{ bgcolor: "G1" }}>
                <GrInstagram color="#212121" />
              </Avatar>
            </IconButton>
          </Grid>
        </Grid>
        <Divider color="P" />
        <Grid xs={12} pt={3} display="flex" justifyContent="center">
          <Grid item xs={2.6}>
            <ul className="categorieslist">
              <li>
                <Link href="#" underline="none" color="White.main"  fontWeight="400">
                  <span className="categoriesaddress">Careers</span>
                </Link>
              </li>
              <li>
                <Link href="#" underline="none" color="White.main" fontWeight="400">
                  <span className="categoriesaddress">Zeiss Lab</span>
                </Link>
              </li>
              <li>
                <Link href="#" underline="none" color="White.main" fontWeight="400">
                  <span className="categoriesaddress">Locations</span>
                </Link>
              </li>
              <li>
                <Link href="#" underline="none" color="White.main" fontWeight="400">
                  <span className="categoriesaddress">Care Guide</span>
                </Link>
              </li>
            </ul>
          </Grid>
          <Grid item xs={2.6}>
            <ul className="categorieslist" fontWeight="400">
              <li>
                <Link href="#" underline="none" color="White.main" fontWeight="400">
                  <span className="categoriesaddress">
                    Exchange and returns
                  </span>
                </Link>
              </li>
              <li>
                <Link href="#" underline="none" color="White.main" fontWeight="400">
                  <span className="categoriesaddress">
                    Terms And Conditions
                  </span>
                </Link>
              </li>
              <li>
                <Link href="#" underline="none" color="White.main" fontWeight="400">
                  <span className="categoriesaddress">Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link href="/home/faq" underline="none" color="White.main" fontWeight="400">
                  <span className="categoriesaddress">FAQ</span>
                </Link>
              </li>
            </ul>
          </Grid>
          <Grid item xs={2.6}>
            <ul className="categorieslist">
              <li>
                <Link href="/loginPage" underline="none" color="White.main" fontWeight="400">
                  <span className="categoriesaddress">Login</span>
                </Link>
              </li>
              <li>
                <Link href="/loginPage" underline="none" color="White.main" fontWeight="400">
                  <span className="categoriesaddress">Sing up</span>
                </Link>
              </li>
              <li>
                <Link href="/contactus" underline="none" color="White.main" fontWeight="400">
                  <span className="categoriesaddress">Contact Us</span>
                </Link>
              </li>
              <li>
                <Link href="/home/aboutus" underline="none" color="White.main" fontWeight="400">
                  <span className="categoriesaddress">About Us</span>
                </Link>
              </li>
            </ul>
          </Grid>
          <Grid item xs={2.6}>
            <ul className="categorieslist">
              <li>
                <Link
                  sx={{ cursor: "pointer" }}
                  onClick={() =>
                    clickedMenu(
                      `category_id=${localStorage.getItem(
                        "Contact Lens Color"
                      )}`
                    )
                  }
                  underline="none"
                  color="White.main"
                  fontWeight="400"
                >
                  <span className="categoriesaddress">Contact Lenses</span>
                </Link>
              </li>
              <li>
                <Link
                  sx={{ cursor: "pointer" }}
                  onClick={() =>
                    clickedMenu(
                      `category_id=${localStorage.getItem("Glass Sun Glass")}`,
                      gender["Man"],
                      "man"
                    )
                  }
                  underline="none"
                  color="White.main"
                  fontWeight="400"
                >
                  <span className="categoriesaddress">Sunglasses for Men</span>
                </Link>
              </li>
              <li>
                <Link
                  sx={{ cursor: "pointer" }}
                  onClick={() =>
                    clickedMenu(
                      `category_id=${localStorage.getItem("Glass Sun Glass")}`,
                      gender["Woman"],
                      "woman"
                    )
                  }
                  underline="none"
                  color="White.main"
                  fontWeight="400"
                >
                  <span className="categoriesaddress">
                    Sunglasses for women
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  sx={{ cursor: "pointer" }}
                  onClick={() =>
                    clickedMenu(
                      `category_id=${localStorage.getItem("Glass Eye Glass")}`,
                      gender["Woman"],
                      "woman"
                    )
                  }
                  underline="none"
                  color="White.main"
                  fontWeight="400"
                >
                  <span className="categoriesaddress">Glasses for women</span>
                </Link>
              </li>
            </ul>
          </Grid>
        </Grid>
        <Divider color="gray" />
        <Grid xs={12} display="flex" justifyContent="center" p={2}>
          <Typography color="White.main" variant="h15">
            Copyright @ 2022 EYE BOUTIQLE, Inc All Right Reserved
          </Typography>
        </Grid>
      </Hidden>
      <Hidden smUp>
        <Grid xs={12}>
          <Accordion style={{ background: "none", color: "white" }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon style={{ color: "white" }} />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography p={1} variant="h1">
                Customer Care
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid xs={12} display="flex" flexWrap="wrap" p={1}>
                <Grid xs={6} p={1}>
                  <Link
                    href="#"
                    underline="none"
                    color="white"
                    fontWeight="400"
                  >
                    Careers
                  </Link>
                </Grid>
                <Grid xs={6} p={1}>
                  <Link
                    href="#"
                    underline="none"
                    color="white"
                    fontWeight="400"
                  >
                    Zeiss Lab
                  </Link>
                </Grid>
                <Grid xs={6} p={1}>
                  <Link
                    href="#"
                    underline="none"
                    color="white"
                    fontWeight="400"
                  >
                    Locations
                  </Link>
                </Grid>
                <Grid xs={6} p={1}>
                  <Link
                    href="#"
                    underline="none"
                    color="white"
                    fontWeight="400"
                  >
                    Care Guide
                  </Link>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
          <Accordion style={{ background: "none", color: "white" }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon style={{ color: "white" }} />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography p={1} variant="h1">
                Terms And Conditions
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid xs={12} display="flex" flexWrap="wrap" p={1}>
                <Grid xs={6} p={1}>
                  <Link
                    href="#"
                    underline="none"
                    color="white"
                    fontWeight="400"
                  >
                    Exchange and returns
                  </Link>
                </Grid>
                <Grid xs={6} p={1}>
                  <Link
                    href="#"
                    underline="none"
                    color="white"
                    fontWeight="400"
                  >
                    Terms And Conditions
                  </Link>
                </Grid>
                <Grid xs={6} p={1}>
                  <Link
                    href="#"
                    underline="none"
                    color="white"
                    fontWeight="400"
                  >
                    Privacy Policy
                  </Link>
                </Grid>
                <Grid xs={6} p={1}>
                  <Link
                    href="/home/faq"
                    underline="none"
                    color="white"
                    fontWeight="400"
                  >
                    FAQ
                  </Link>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
          <Accordion style={{ background: "none", color: "white" }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon style={{ color: "white" }} />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography p={1} variant="h1">
                Account
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid xs={12} display="flex" flexWrap="wrap" p={1}>
                <Grid xs={6} p={1}>
                  <Link
                    href="#"
                    underline="none"
                    color="white"
                    fontWeight="400"
                  >
                    Login
                  </Link>
                </Grid>
                <Grid xs={6} p={1}>
                  <Link
                    href="#"
                    underline="none"
                    color="white"
                    fontWeight="400"
                  >
                    Sing Up
                  </Link>
                </Grid>
                <Grid xs={6} p={1}>
                  <Link
                    href="#"
                    underline="none"
                    color="white"
                    fontWeight="400"
                  >
                    Contact Us
                  </Link>
                </Grid>
                <Grid xs={6} p={1}>
                  <Link
                    href="#"
                    underline="none"
                    color="white"
                    fontWeight="400"
                  >
                    About Us
                  </Link>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
          <Accordion style={{ background: "none", color: "white" }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon style={{ color: "white" }} />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography p={1} variant="h1">
                Top Searches
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid xs={12} display="flex" flexWrap="wrap">
                <Grid xs={6} p={1}>
                  <Link
                    href="#"
                    underline="none"
                    color="white"
                    fontWeight="400"
                  >
                    Contact Lenses
                  </Link>
                </Grid>
                <Grid xs={6} p={1}>
                  <Link
                    onClick={() =>
                      clickedMenu(
                        `category_id=${localStorage.getItem(
                          "Glass Sun Glass"
                        )}`,
                        gender["Man"],
                        "man"
                      )
                    }
                    underline="none"
                    color="white"
                    fontWeight="400"
                  >
                    Sunglasses for Men
                  </Link>
                </Grid>
                <Grid xs={6} p={1}>
                  <Link
                    href="#"
                    underline="none"
                    color="white"
                    fontWeight="400"
                  >
                    Sunglasses for women
                  </Link>
                </Grid>
                <Grid xs={6} p={1}>
                  <Link
                    href="#"
                    underline="none"
                    color="white"
                    fontWeight="400"
                  >
                    Glasses for women
                  </Link>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
          <Grid
            xs={12}
            display="flex"
            justifyContent="center"
            pt={3}
            pl={1}
            pb={disabledButton ? 2 : 0}
            textAlign="center"
          >
            <TextField
              sx={{ width: "90%" }}
              focused
              multiline="false"
              color="G1"
              id="subscribeemail"
              label="Email"
              type="email"
              autocomplete="none"
              placeholder="Leave your email to get the newsletter"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={sendEmail}
            />
          </Grid>
          {disabledButton ? '' :
            <Grid xs={12} display="flex" p={3} style={{ color: "white" }}>
              <Button variant="contained" color="P" fullWidth>
                Submit
              </Button>
            </Grid>
          }
          <Grid xs={12} pb={2} display="flex" justifyContent="space-evenly">
            <IconButton>
              <Avatar
                sx={{ bgcolor: "G1" }}
              >
                <GrLinkedinOption color="#212121" />
              </Avatar>
            </IconButton>

            <IconButton>
              <Avatar sx={{ bgcolor: "G1" }}>
                <GrFacebookOption color="#212121" />
              </Avatar>
            </IconButton>

            <IconButton>
              <Avatar sx={{ bgcolor: "G1" }}>
                <GrYoutube color="#212121" />
              </Avatar>
            </IconButton>

            <IconButton>
              <Avatar sx={{ bgcolor: "G1" }}>
                <GrInstagram color="#212121" />
              </Avatar>
            </IconButton>
          </Grid>
          <Divider color="gray" />
          <Grid xs={12} display="flex" justifyContent="center" p={2}>
            <Typography color="white" variant="h15">
              Copyright @ 2022 EYE BOUTIQLE, Inc All Right Reserved
            </Typography>
          </Grid>
        </Grid>
      </Hidden>
    </Grid>
  );
};

export default Footer;
