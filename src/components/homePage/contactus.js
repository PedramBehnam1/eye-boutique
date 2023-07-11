import React, { useState } from "react";
import Footer from "../../layout/footer";
import "../../asset/css/homePage/contactus.css";
import {
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
} from "@mui/material";
import HeaderOtherPage from "../../layout/Header";
import Grid from "@mui/material/Grid";

function Contactus() {
  const [isRemoved, setIsRemoved] = useState(false);
  const[showCartPage,setShowCartPage]=useState(false)
  const [trigger,setTrigger] = useState(0)
  const [_trigger, _setTrigger] = useState(0);
  return (
    <Grid xs={12}>
      <HeaderOtherPage trigger={trigger} _trigger={_trigger} showShoppingCard={showCartPage} closeShowShoppingCard={()=>{setShowCartPage(false)}}
        isRemoved={(isRemoved) => {
          setIsRemoved(isRemoved)
        }}
        _trigger_={(trigger) => {
          setTrigger(trigger);
          _setTrigger(trigger);
        }}
      />
      <Paper>
        <Grid container spacing={0} justifyContent="center">
          <Grid container xs={7} style={{ marginTop: "100px" }}>
            <Grid item xs={12} pl={1} pb={5}>
              <Typography color={"black"} variant="h1" fontSize={24}>
                Contact Us
              </Typography>
            </Grid>
            <Grid item xs={12} p={1}>
              <Typography color={"black"} variant="h1" fontSize={16}>
                Need Help ?
              </Typography>
              <Typography color={"black"}>
                Phone Number : +965 1806080
              </Typography>
              <Typography color={"black"}>Hotline: +965 22054961</Typography>
            </Grid>
            <Grid item xs={6} p={1}>
              <Typography color={"black"} variant="h1" fontSize={16}>
                Email:
              </Typography>
              <Typography color={"black"}>Support@hassans.com</Typography>
            </Grid>
            <Grid item xs={6} p={1} sx={{ backgroundColor: "black" }}>
              <Typography color={"white"}>
                Sunday to Thursday: 8:00am - 4:30 pm KWT Time Saturday: 9:00 am
                - 1:00 pm KWT Time
              </Typography>
            </Grid>
            <Grid item xs={12} p={1}>
              <Typography color={"black"} variant="h1" fontSize={16}>
                Adresses:
              </Typography>
              <Typography color={"black"}>
                Hassan’s Optician Company | Kuwait Free Trade Zone – Shuwaikh
                Port – Plot C-22 | P.O. Box: 1139, Safat 13012 – Kuwait
              </Typography>
            </Grid>
          </Grid>
          <Divider style={{ background: "red" }} orientation="horizontal" />
          <Grid container xs={7}>
            <Grid item xs={6} p={1}>
              <TextField
                margin="normal"
                name="fullName"
                label="FullName"
                type="text"
                id="fullName"
                fullWidth={true}
              />
            </Grid>
            <Grid item xs={6} p={1}>
              <TextField
                margin="normal"
                name="email"
                label="Email"
                type="text"
                id="email"
                fullWidth={true}
              />
            </Grid>
          </Grid>
          <Grid container xs={7} p={1}>
            <TextField
              margin="normal"
              name="text"
              label="What's on your mind?"
              id="text"
              fullWidth
              multiline
              rows={4}
            />
            <Button variant="contained" id="buttonStyle">
              Submit
            </Button>
          </Grid>
          <Divider style={{ background: "red" }} orientation="horizontal" />
        </Grid>
      </Paper>
      <Footer />
    </Grid>
  );
}
export default Contactus;
