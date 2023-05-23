import React, { useState, useEffect, useContext } from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import DataTablePagination from "./TablePagination";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import AppBar from "@mui/material/AppBar";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Avatar from "@mui/material/Avatar";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import HelpIcon from "@mui/icons-material/Help";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import MenuIcon from "@mui/icons-material/Menu";
import Axios from "axios";
import { Alert, MenuItem } from "@mui/material";
import Paper from "@mui/material/Paper";
import SearchIcon from "@mui/icons-material/Search";
import { changeLanguage } from "i18next";
import { AppThemeContext } from "../AppTheme";
import { useTranslation } from "react-i18next";

const lightColor = "rgba(255, 255, 255, 0.7)";

const data = {
  nbSalle: 0,
  nbRayonnage: 0,
  nbEtage: 0,
  nbBoite: 0,
  bordereauVId: 0,
};
const headCells = [
  {
    id: "nbBoite",
    numeric: true,
    disablePadding: false,
    label: "N box",
  },
  {
    id: "nbSalle",
    numeric: true,
    disablePadding: true,
    label: "N Room",
  },
  {
    id: "nbRayonnage",
    numeric: true,
    disablePadding: false,
    label: "shelving",
  },
  {
    id: "nbEtage",
    numeric: true,
    disablePadding: false,
    label: "N Floor",
  },
  {
    id: "bordereauVId",
    numeric: true,
    disablePadding: false,
    label: "N Slip",
  },
];

const Boites = (props) => {
  const [formValues, setFormValues] = useState(data);
  const [open, setOpen] = useState(false);
  const [fullWidth, setFullWidth] = useState(true);
  const [boites, setBoites] = useState(null);
  const [bordereaux, setBordereaux] = useState(null);
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState({
    numError: "",
  });
  const [filterB, setFilterB] = useState({
    b: (boites) => {
      return boites;
    },
  });

  const { logout, user, token, onDrawerToggle } = props;
  const { toggleLanguage } = useContext(AppThemeContext);

  const { t } = useTranslation();

  useEffect(() => {
    setContent("boites");
    Axios.get(process.env.REACT_APP_HOSTNAME + "/boites", {
      withCredentials: true,
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      //console.log(res.data)
      setBoites(res.data);
    });
    Axios.get(process.env.REACT_APP_HOSTNAME + "/bordereauxByOrganisation", {
      withCredentials: true,
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      //console.log(res.data)
      setBordereaux(res.data);
    });
  }, [token]);

  const checkError = (event) => {
    const { type, value, name } = event.target;

    if (type === "number") {
      if (value < 1)
        setFormErrors({ ...formErrors, numError: "valeur invalide" });
      else setFormErrors({ ...formErrors, numError: "" });
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
    checkError(e);
  };

  const handleChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(formValues);
    const fd = new FormData();
    fd.append("file", image);
    fd.append("bordereauVId", formValues.bordereauVId);
    fd.append("nbBoite", formValues.nbBoite);
    fd.append("nbEtage", formValues.nbEtage);
    fd.append("nbRayonnage", formValues.nbRayonnage);
    fd.append("nbSalle", formValues.nbSalle);
    await Axios.post(process.env.REACT_APP_HOSTNAME + "/boite", fd, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        setSuccess(true);
        alert("boite créee!");
      })
      .catch((err) => console.log(err));
  };
  const handleSearch = (e) => {
    let target = e.target;
    setFilterB({
      b: (boites) => {
        if (target.value === "") return boites;
        else
          return boites.filter(
            (x) => x.nbBoite.toString().includes(target.value)
            //|| x.nbEtage.toString().includes(target.value)
            //||x.nbRayonnage.toString().includes(target.value)
            //||x.nbSalle.toString().includes(target.value)
            //||x.bordereauVersement.nbv.toString().includes(target.value)
          );
      },
    });
  };

  return (
    <div>
      <AppBar
        component="div"
        position="static"
        elevation={0}
        sx={{ zIndex: 0 }}
      >
        <div>
          <Box
            component="main"
            sx={{ flex: 1, py: 6, px: 4, bgcolor: "#eaeff1" }}
          >
            <Button variant="outlined" onClick={handleClickOpen}>
              Ajouter une Boîte
            </Button>
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle>Ajout</DialogTitle>
              <DialogContent>
                {success && <Alert severity="success">Boite créee!</Alert>}
                <Box
                  component="form"
                  sx={{
                    "& .MuiTextField-root": { m: 1, width: "25ch" },
                  }}
                  noValidate
                  autoComplete="off"
                  onSubmit={handleSubmit}
                >
                  <Grid
                    container
                    alignItems="center"
                    justify="center"
                    direction="column"
                  >
                    <Grid item>
                      <TextField
                        required
                        id="nboite-input"
                        name="nbBoite"
                        label="N Boite"
                        type="number"
                        value={formValues.nbBoite}
                        onChange={handleInputChange}
                        error={formErrors.numError}
                        helperText={formErrors.numError}
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        required
                        id="nsalle-input"
                        name="nbSalle"
                        label="NSalle"
                        type="number"
                        value={formValues.nbSalle}
                        onChange={handleInputChange}
                        error={formErrors.numError}
                        helperText={formErrors.numError}
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        required
                        id="nrayonnage-input"
                        name="nbRayonnage"
                        label="N Rayonnage"
                        type="number"
                        value={formValues.nbRayonnage}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        required
                        id="netage-input"
                        name="nbEtage"
                        label="N Etage"
                        type="number"
                        value={formValues.nbEtage}
                        onChange={handleInputChange}
                        error={formErrors.numError}
                        helperText={formErrors.numError}
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        required
                        fullWidth
                        helperText="Sélectionner une image"
                        type="file"
                        onChange={handleChange}
                      />
                    </Grid>
                    {bordereaux && (
                      <Grid item>
                        <TextField
                          required
                          select
                          id="demo-simple-select"
                          name="bordereauVId"
                          value={formValues.bordereauVId}
                          label="N Bordereau Versement"
                          onChange={handleInputChange}
                          error={formErrors.numError}
                          helperText={formErrors.numError}
                        >
                          {bordereaux.map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                              {option.nbv}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                    )}
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={formErrors.numError}
                    >
                      Enregistrer
                    </Button>
                  </Grid>
                </Box>
              </DialogContent>

              <DialogActions>
                <Button onClick={handleClose}>Annuler</Button>
              </DialogActions>
            </Dialog>
            {boites && boites.length > 0 ? (
              <Paper sx={{ width: "100%", mb: 2 }}>
                <AppBar
                  position="static"
                  color="default"
                  elevation={0}
                  sx={{ borderBottom: "1px solid rgba(0, 0, 0, 0.12)" }}
                >
                  <Toolbar>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item>
                        <SearchIcon color="inherit" sx={{ display: "block" }} />
                      </Grid>
                      <Grid item xs>
                        <TextField
                          fullWidth
                          placeholder={t("Search")}
                          InputProps={{
                            disableUnderline: true,
                            sx: { fontSize: "default" },
                          }}
                          variant="standard"
                          onChange={handleSearch}
                        />
                      </Grid>
                    </Grid>
                  </Toolbar>
                </AppBar>
                <DataTablePagination
                  rows={filterB.b(boites)}
                  headCells={headCells}
                  content={content}
                  token={token}
                />
              </Paper>
            ) : (
              <p style={{ textAlign: "center", color: "black" }}>
                Aucune Boite !
              </p>
            )}
          </Box>
        </div>
      </AppBar>
    </div>
  );
};

export default Boites;
