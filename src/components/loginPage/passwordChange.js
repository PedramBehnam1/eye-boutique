import React, { useEffect, useState } from "react";
import logoBlack from "../../asset/images/logoBlack.png";
import "../../asset/css/logInPage.css";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import { Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import SubmitBtn from "./submitBtn";

const ChangePassword = () => {
  let [phone, setPhone] = useState("");
  
  return (
    <div>
      <div className="logoLogin">
        <Card style={{ border: "none", boxShadow: "none", background: "none" }}>
          <CardMedia component="img" image={logoBlack} alt="logo" />
        </Card>
      </div>

      <div className="loginCard">
        <Card style={{ border: "none", boxShadow: "none" }}>
          <div>
            <h2 className="loginTitle">Reseting pasword</h2>
            <Typography>Enter your phone number</Typography>
            <TextField
              id="standard-basic"
              variant="standard"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              fullWidth
              color="G1"
              placeholder="EX +98 912 1234"
              type="number"
            />
            <SubmitBtn value={phone}
             text="Continue"
             
             />

            <Typography>
              We have sent you an SMS with the code to
              <Typography>+98 912 923 6069</Typography>
            </Typography>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ChangePassword;
