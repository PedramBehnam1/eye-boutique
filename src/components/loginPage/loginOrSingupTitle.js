import {
  Tooltip,
  Menu,
  Grid,
  MenuList,
  MenuItem,
  Divider,
  Paper,
  Typography,
  ListItemText,
  Button,
  Box,
  Chip,
  Dialog,
  TextField,
  IconButton,
  CircularProgress,
  InputLabel,
  FormControl,
  Select,
  Switch,
  Pagination,
  Alert,
  Hidden,
  InputBase,
  Snackbar,
  FormControlLabel,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardMedia,
  Autocomplete,
  Checkbox,
  MuiAlert,
  Slide,
  ButtonGroup,
  Fade,
} from "@mui/material";
import React, { useState } from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import LoginCard from "./loginCard";
import SignUp from "./SignUp";
import logoBlack from "../../asset/images/logoBlack.png";

const LoginOrSignUpTitle = () => {
  const [page, setPage] = useState("LoginCard");

  return (
    <Grid>
      <Card style={{ border: "none", boxShadow: "none", background: "none" }}>
        <CardMedia component="img" image={logoBlack} alt="logo" />
      </Card>
      <h2 className="loginTitle">
        <Link
          className="loginTitle"
          onClick={() => {
            setPage("LoginCard");
          }}
        >
          Login
        </Link>
        /
        <Link
          className="loginTitle"
          onClick={() => {
            setPage("SignUp");
          }}
        >
          Sing up
        </Link>
      </h2>
      {page === "LoginCard" && <LoginCard />}
      {page === "SignUp" && <SignUp />}
    </Grid>
  );
};

export default LoginOrSignUpTitle;
