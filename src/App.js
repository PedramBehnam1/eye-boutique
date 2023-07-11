import React, { useState } from "react";
import Routes from "./Routes";
import { BrowserRouter as Router } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axiosConfig from "./axiosConfig";
import Montserrat1 from "./asset/fonts/Montserrat/Montserrat-Regular.ttf";
import CssBaseline from '@mui/material/CssBaseline';
import './index.css';

const theme = createTheme({
  palette: {
    mode: "light"
    ,
    P: {
      main: "#CB929B",
    },
    P1: {
      main: "rgb(203, 146, 155, 0.2)",
    },
    P2: {
      main: "#f7eded",
    },
    P3: {
      main: "#F5E9EB",
    },
    Black: {
      main: "#212121",
    },
    Black1: {
      main: "#000000",
    },
    Black2: {
      main: "#404040",
    },
    G1: {
      main: "#757575",
    },
    G2: {
      main: "#9E9E9E",
    },
    G3: {
      main: "#E0E0E0",
    },
    White: {
      main: "#FFFFFF",
    },
    White1: {
      main: "rgba(255, 255, 255, 0.4)",
    },
    White2: {
      main: "rgba(255,255,255,0.9)"
    },
    LightGreen: {
      main: "#1ABB51"
    },
    LightGreen1: {
      main: "#EDFFEF"
    },
    paleGreen: {
      main: "#f7f2ed"
    },
    paleGreen1: {
      main: "#f7f5ed"
    },
    Red: {
      main: "#ff0303"
    },
    Orange: {
      main: "#fa6f05"
    },
    Orange1: {
      main: "#ff9966"
    },
    Yellow: {
      main: "#fcba03"
    },
    Golden: {
      main: "#AF8900"
    },
    GrayLight: {
      main: '#F5F5F5'
    },
    GrayLight2: {
      main: '#F4F4F4'
    },
    GrayLight3: {
      main: '#DCDCDC'
    }
  },

  typography: {
    
    fontFamily: 'Poppins',
    fontStyle: "normal",
    MontseratFS16: {
      fontWeight: "700",
      fontSize: "16px",
    },
    MontseratFS14: {
      fontSize: "14px",
    },
    ProfileName:{
      fontSize:"13px",
      fontWeight:'400'
    }
    ,
    h1: {
      fontWeight: "700",
      fontSize: "16px",
    },
    h2: {
      fontWeight: "400",
      fontSize: "16px",
    },
    h3: {
      fontWeight: "700",
      fontSize: "18px",
    },
    h4: {
      fontWeight: "bold",
      fontSize: "16px",
    },
    h5: {
      fontWeight: "normal",
      fontSize: "16px",
    },
    menuitem: {
      fontWeight: "500",
      fontSize: "16px",
    },
    menutitle: {
      fontWeight: "700",
      fontSize: "18px",
    },
    h7: {
      fontWeight: "500",
      fontSize: "16px",
    },
    h8: {
      fontWeight: "500",
      fontSize: "18px",
    },
    description: {
      fontWeight: "normal",
      fontSize: "14px",
    },
    h10: {
      fontWeight: "400",
      fontSize: "14px",
    },
    h11: {
      fontWeight: "500",
      fontSize: "18px",
    },
    h12: {
      fontWeight: "700",
      fontSize: "24px",
    },
    h13: {
      fontWeight: "900",
      fontSize: "24px",
    },
    h14: {
      fontWeight: "900",
      fontSize: "16px",
    },
    h15: {
      fontWeight: "400",
      fontSize: "12px",
    },
    h16: {
      fontWeight: "300",
      fontSize: "14px",
    },
    h17: {
      fontWeight: "700",
      fontSize: "20px",
    },
    h18: {
      fontWeight: "500",
      fontSize: "14px",
    },
    h19: {
      fontWeight: "700",
      fontSize: "28px",
    },
    h20: {
      fontWeight: "700",
      fontSize: "12px",
    },
    h21: {
      fontWeight: "500",
      fontSize: "12px",
    },
    h22: {
      fontWeight: "600",
      fontSize: "32px",
    },
    h23: {
      fontWeight: "900",
      fontSize: "42px",
    },
    h24: {
      fontWeight: "700",
      fontSize: "50px",
    },
    h25: {
      fontWeight: "700",
      fontSize: "60px",
    },
    italic: {
      fontStyle: "italic",
    },
    h26: {
      fontWeight: "400",
      fontSize: "20px",
    },
    h27: {
      fontWeight: "400",
      fontSize: "11px",
    },
    h28: {
      fontWeight: "400",
      fontSize: "15px",
    },
    h29: {
      fontWeight: "300",
      fontSize: "12px",
    },
    h30: {
      fontWeight: "600",
      fontSize: "16px",
    },
    h31: {
      fontWeight: "500",
      fontSize: "36px",
    },
    h32: {
      fontWeight: "600",
      fontSize: "14px",
    },
    h33: {
      fontWeight: "600",
      fontSize: "18px",
    },
    h34: {
      fontWeight: "500",
      fontSize: "17px",
    },
    h35: {
      fontWeight: "400",
      fontSize: "18px",
    },
     h36: {
      fontWeight: "300",
      fontSize: "15px",
    },
    h37: {
      fontWeight: "600",
      fontSize: "22px",
    },
    h38: {
      fontWeight: "500",
      fontSize: "40px",
    },
    h39: {
      fontWeight: "500",
      fontSize: "10px",
    },
    h40: {
      fontWeight: "700",
      fontSize: "8px",
    },
    h41: {
      fontWeight: "500",
      fontSize: "32px",
    }
  },
  components: {
    MuiTypography: {
      defaultProps: {
        fontFamily: Montserrat1,
      },
    },
  },
});

class App extends React.Component {
  render() {
    
    const categories = [];

    console.error = console.warn = () => { };

    axiosConfig.get("/admin/category/all").then((res) => {
      let temp = [];
      res.data.categories.map((category) => {
        category.types.map((cat) => {
          temp.push({ id: cat.id, name: category.title + " - " + cat.title });
          localStorage.setItem(category.title + " " + cat.title, cat.id);
          localStorage.setItem(cat.id, category.title + " - " + cat.title);
          categories.push({ id: cat.id, title: cat.title });
        });

      });
      localStorage.setItem("categories", JSON.stringify(temp));
    });
    return (
      <div>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <Routes />
          </Router>
        </ThemeProvider>
      </div>
    );
  }
}
export default App;
