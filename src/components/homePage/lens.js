import React, { useState } from "react";
import "../../asset/css/homePage/lens.css";
import axiosConfig from '../../axiosConfig';
import {
  Grid,
} from "@mui/material";

const Lens = (props) => {
  const [style, setStyle] = useState({ display: "block" });
  return (
    <Grid container xs={12} sm={12} className="lensImage">
      <Grid item xs={12}>
        <img
          width="100%"
          height="280px"
          src={axiosConfig.defaults.baseURL + props.url}
        />
        <div className="lensText" style={style}>
          <h1 >{props.name.charAt(0).toUpperCase() + props.name.slice(1)}</h1>
        </div>
      </Grid>

    </Grid>
  );
};

export default Lens;
