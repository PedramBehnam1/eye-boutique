import React from "react";
import googleIcon from "../../asset/images/googleIcon.png";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import facebookIcon from "../../asset/images/facebookIcon.png";
import appleIcon from "../../asset/images/appleIcon.png";
import { Divider, Typography, Grid } from "@mui/material";

const OrWith = () => {
  return (
    <Grid>
      <Divider sx={{ paddingTop: "20px", marginBottom: "20px" }} />
      <Typography className="titleText">Or Login / Sing up with:</Typography>
      <Grid
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Button
          variant="outlined "
          component="span"
          className="googleIcon"
          startIcon={<img src={googleIcon} />}
        >
          Login with google
        </Button>
        <IconButton component="span" className="googleIcon">
          <img
            src={appleIcon}
            style={{
              paddingLeft: "10px",
              paddingRight: "10px",
            }}
          />
        </IconButton>
        <IconButton component="span" className="googleIcon">
          <img
            src={facebookIcon}
            style={{
              paddingLeft: "10px",
              paddingRight: "10px",
            }}
          />
        </IconButton>
      </Grid>
    </Grid>
  );
};

export default OrWith;
