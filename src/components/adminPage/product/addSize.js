import React from "react";
import AdminLayout from "../../../layout/adminLayout";
import Grid from "@mui/material/Grid";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import "../../../asset/css/adminPage/addCategory.css";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const AddSize = () => {
  const [open, setOpen] = React.useState(false);
  const [subMenu, setSubMenu] = React.useState("");
  const [type, setType] = React.useState("");
  const [fullWidth, setFullWidth] = React.useState(true);
  const handleClickOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    console.info("You clicked the delete icon.");
  };

  const subMenuValue = (type) => {
    setType(type);
    
    return (
      <Grid item xs={12} sm={7} md={9}>
        <Paper sx={{ maxWidth: "100%" }}>
          <MenuList sx={{ width: "100%" }} disablePadding>
            <Grid
              item
              xs={12}
              mt={2}
              display="flex"
              justifyContent="space-between"
            >
              <Typography variant="menutitle" pt={0} m={2} color="black">
                {type} Values
              </Typography>
              <div>
                <Button
                  variant="outlined"
                  sx={{ mt: 1, mr: 1 }}
                  color="G1"
                  onClick={handleClickOpenDialog}
                >
                  Add Values
                </Button>
              </div>
            </Grid>
            <Divider />
          </MenuList>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "start",
              p: 1,
              width: "100%",
            }}
          >
            <Grid item xs={12} display="flex" flexWrap="wrap">
              <Chip
                sx={{ m: 1 }}
                label="240 ML"
                variant="outlined"
                onDelete={handleDelete}
              />
              <Chip
                sx={{ m: 1 }}
                label="210 ML"
                variant="outlined"
                onDelete={handleDelete}
              />
              <Chip
                sx={{ m: 1 }}
                label="400 ML"
                variant="outlined"
                onDelete={handleDelete}
              />
              <Chip
                sx={{ m: 1 }}
                label="1000 ML"
                variant="outlined"
                onDelete={handleDelete}
              />
              <Chip
                sx={{ m: 1 }}
                label="300 ML"
                variant="outlined"
                onDelete={handleDelete}
              />
            </Grid>
          </Box>
        </Paper>
      </Grid>
    );
  };
  const bread = [
    {
      title: "Products",
      href: "/admin/product",
    },
  ];

  return (
    <AdminLayout breadcrumb={bread} pageName="Categories">
      <Grid container spacing={2}>
        <Grid item xs={12} sm={5} md={3}>
          <Paper sx={{ maxWidth: "100%", minHeight: "100%", mt: 2 }}>
            <Grid item xs={12} pt={2} pb={2} pl={1} pr={1}>
              <Typography variant="menutitle" pt={2} m={2} color="black">
                Sizes List
              </Typography>
            </Grid>
            <Divider />
            <Grid item xs={12}>
              <MenuList sx={{ width: "100%" }} disablePadding>
                <MenuItem
                  sx={{ pt: 2, pb: 1, pl: 3 }}
                  onClick={() => setSubMenu(subMenuValue("Glasses Size"))}
                >
                  <Typography variant="menuitem" color="black">
                    1
                  </Typography>
                  <ListItemText>
                    <Typography variant="menuitem" ml={2} color="black">
                      Glasses Size
                    </Typography>
                  </ListItemText>
                  <NavigateNextIcon />
                </MenuItem>
                <Divider />
                <MenuItem
                  sx={{ pl: 3 }}
                  onClick={() => setSubMenu(subMenuValue("Shape Power"))}
                >
                  <Typography variant="menuitem" color="black">
                    2
                  </Typography>

                  <ListItemText>
                    <Typography variant="menuitem" ml={2} color="black">
                      Shape Power
                    </Typography>
                  </ListItemText>
                  <NavigateNextIcon />
                </MenuItem>
                <Divider />
                <MenuItem
                  sx={{ pl: 3 }}
                  onClick={() => setSubMenu(subMenuValue("Axis"))}
                >
                  <Typography variant="menuitem" color="black">
                    3
                  </Typography>

                  <ListItemText>
                    <Typography variant="menuitem" ml={2} color="black">
                      Axis
                    </Typography>
                  </ListItemText>
                  <NavigateNextIcon />
                </MenuItem>
                <Divider />
                <MenuItem
                  sx={{ pl: 3 }}
                  onClick={() => setSubMenu(subMenuValue("CLY"))}
                >
                  <Typography variant="menuitem" color="black">
                    4
                  </Typography>
                  <ListItemText>
                    <Typography variant="menuitem" ml={2} color="black">
                      CYL
                    </Typography>
                  </ListItemText>
                  <NavigateNextIcon />
                </MenuItem>
              </MenuList>
            </Grid>
          </Paper>
        </Grid>

        {subMenu}

        <Dialog
          pl={3}
          pr={3}
          fullWidth={fullWidth}
          maxWidth="xs"
          open={open}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <Grid container xs={12}>
            <Grid item xs={12} pt={2} pl={3} pr={3} pb={2}>
              <Typography variant="menutitle" color="black">
                Add {type} Value
              </Typography>
            </Grid>
            <Divider style={{ width: "100%" }} />
            <Grid item xs={12} pt={2} pl={3} pr={3} pb={2}>
              <TextField
                id="outlined-basic"
                label="Value"
                color="P"
                fullWidth
                sx={{ pb: 5 }}
              />
            </Grid>
            <Divider style={{ width: "100%" }} />
            <Grid item xs={12} pr={2} display="flex" justifyContent="end">
              <Divider />
              <Button
                variant="outlined"
                color="G1"
                onClick={handleCloseDialog}
                sx={{ mt: 2, mb: 2, mr: 1, ml: 1 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="P"
                sx={{ mt: 2, mb: 2, mr: 1, ml: 1, color: "white" }}
              >
                save
              </Button>
            </Grid>
          </Grid>
        </Dialog>
      </Grid>
    </AdminLayout>
  );
};

export default AddSize;
