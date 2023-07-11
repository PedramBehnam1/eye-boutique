import React, { useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import { useHistory } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "../../asset/css/loginPage/verifyByCell.css";
import Timer from "./timer";

const VerifyByCell = () => {
  let history = useHistory();

  const user = localStorage.getItem("cellphone");
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const handleSubmit = () => {
    if (value === localStorage.getItem("code")) {
      history.push("/profileInfo");
    } else {
      setError(true);
    }
  };

  return (
    <Grid
      container
      xs={12}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Paper
        style={{
          boxShadow: "none",
          borderRadius: "10px",
          width: "500px",
          backgroundColor: "#F5F5F5",
        }}
      >
        <Grid
          onClick={() => {
            history.push("/loginPage");
          }}
          sx={{
            display: "flex",
            justifyContent: "start",
            flexDirection: "row",
            alignItems: "center",
            height: "100px",
            paddingLeft: "30px",
            paddingRight: "30px",
            backgroundColor: "P.main",
            borderRadius: "10px",
            cursor: "pointer",
          }}
        >
          <ArrowBackIcon sx={{ color: "white", marginRight: "15px" }} />
          <Typography color="white" sx={{ fontSize: "20px" }}>
            Verification Code
          </Typography>
        </Grid>
        <Grid
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "start",
            alignItems: "start",
            borderRadius: "10px",
            marginTop: "3px",
            backgroundColor: "white",
            padding: "25px",
            width: "100%",
            minHeight: "400px",
          }}
        >
          <Typography>
            We have sent you an SMS with the code to +{user}
          </Typography>
          <Typography>
            Your temporarily code is: {localStorage.getItem("code")}
          </Typography>

          <TextField
            id="standard-basic"
            variant="standard"
            label="Code"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            fullWidth
            type="number"
            color="G1"
            style={{ marginTop: "84px" }}
            error={error}
          />
          <Grid
            xs={12}
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <Typography>Resend code in:</Typography>
            <Timer />
          </Grid>

          <Button
            variant="contained"
            sx={{
              borderRadius: "5px",
              textTransform: "capitalize",
              fontWeight: 600,
              color: "white",
              backgroundColor: "gray",
              border: "1px solid gray",
              height: "40px",
              width: "330px",
              display: "flex",
              alignSelf: "center",
              marginTop: "35px",

              "&:hover": {
                backgroundColor: "#CB929B",
                color: "white",
              },
            }}
            disabled={value.cellphone !== "" ? false : true}
            onClick={() => {
              handleSubmit();
            }}
          >
            Next
          </Button>
        </Grid>
      </Paper>
    </Grid>
  );
};

export default VerifyByCell;
