import React, { useCallback, useState } from "react";
import axios from "axios";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Box } from "@mui/system";
import { CirclePicker } from "react-color";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";

// Custom-components & utils
import Linear from "./Linear";
import ProgressBar from "./ProgressBar";
import FilesList from "./FilesList";
import formatBytes from "../utils/formatBytes";
import { Alert, Card, Dialog, DialogContent, DialogTitle, FormControl, FormControlLabel, FormLabel, MenuItem, Radio, RadioGroup } from "@mui/material";
import { useEffect } from "react";
import dayjs from "dayjs";

export const uploadPhotos = async (
  file,
  data,
  setProgress,
  setError,
  setSuccess,
  token
) => {
  console.log(data);
  const formData = new FormData();
  formData.append("file", file);
  formData.append("description", data.description);
  formData.append("nArticle", data.nArticle);
  formData.append("title", data.title);
  formData.append("observation", data.observation);
  formData.append("dateExtreme", data.dateExtreme);
  formData.append("dateElimination", data.dateElimination);
  formData.append("boiteId", data.boiteId);
  formData.append("category",data.categorie?.id)
  formData.append("type_doc",data.type_doc)
  formData.append("tagId",data.tagId)
  // for (let i = 0; i < files.length; i += 1) {
  //   formData.append("file", files[i]);
  // }
  const config = {
    withCredentials: true,
    headers: {
      "Content-Type": `multipart/form-data`,
      Authorization: `Bearer ${token}`,
    },
    onUploadProgress: (data) => {
      //Set the progress value to show the progress bar
      setProgress(Math.round((100 * data.loaded) / data.total));
    },
  };

  try {
    await axios
      .post(process.env.REACT_APP_HOSTNAME + "/upload", formData, config)
      .then((res) => {
        console.log(res.data);
        setSuccess(true);
        alert("fichier crée !");
      })
      .catch((error) => {
        alert(error.response.data)
        if (error.response.data.length === 1) setError(error.response.data);
        
        else setError("Erreur");
      });
  } catch (error) {
    console.log(error);

    const { code } = error;
    switch (code) {
      case "FILE_MISSING":
        setError("Please select a file before uploading!");
        break;
      case "LIMIT_FILE_SIZE":
        setError("File size is too large. Please upload files below 1MB!");
        break;
      case "INVALID_TYPE":
        setError(
          "This file type is not supported! Only .png, .jpg and .jpeg files are allowed"
        );
        break;

      default:
        setError(error?.message);
        console.log(error?.message);
        break;
    }
  } finally {
    console.log("done");
  }
};

export default function Content(props) {
  const { t } = useTranslation();
  const { user, token } = props;
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const [boites, setBoites] = useState(null);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState(null);
  const [openForm,setOpenForm]=useState(false)
  
  const [theCategorie, setCategorie] = React.useState(null);
  const [file, setFile] = useState(null);
  const [lastId,setLastId]=useState(null)
  const [data, setData] = useState({
    title: file ? file.name : "",
    nArticle: "",
    description: "",
    dateExtreme: null,
    dateElimination: null,
    observation: "",
    boiteId: 0,
    type_doc:"ELECTRONIC",
    categorie:categories.length>0 ? categories[0].title: "",
    tagId:null
  });
  const [formValues, setFormValues] = useState(data);
  const [tag, setTag] = useState({
    tag_name: "",
    tag_desc: "",
    color: "",
  });
  const [tagId, setTagId] = useState(null);
  const filter = createFilterOptions();

  

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_HOSTNAME + "/boitesByOrganisation", {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        //console.log(res.data)
        setBoites(res.data);
      });
    axios
    .get(process.env.REACT_APP_HOSTNAME + "/categories", {
      withCredentials: true,
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      //console.log(res.data)
      setCategories(res.data);
    });
    axios
    .get(process.env.REACT_APP_HOSTNAME + "/tags", {
      withCredentials: true,
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      //console.log(res.data)
      setTags(res.data);
    });
    axios
    .get(process.env.REACT_APP_HOSTNAME + "/files", {
      withCredentials: true,
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      //console.log(res.data)
      setLastId((res.data[res.data.length - 1]).id);
    });
  }, [token]);

  const handleInputChange = (e) => {
    
    const { name, value } = e.target;
    console.log(e.target.value)
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(formValues);
    uploadPhotos(file, formValues, setProgress, setError, setSuccess, token);
  };

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        // Do whatever you want with the file contents
        const binaryStr = reader.result;
        console.log(binaryStr);
      };
      reader.readAsArrayBuffer(file);
      setFile(file);
      //uploadPhotos(file, setProgress, setError,setSuccess);
    });
  }, []);

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop,
  });

  const files = acceptedFiles.map((file) => {
    const size = formatBytes(file.size);
    return (
      <>
        {file.path} - {size}
      </>
    );
  });

  

  const handleCloseT = () => {
    setOpenForm(false);
  };

  return (
    <Paper sx={{ margin: "auto", overflow: "hidden" }}>
      {success && <Alert severity="success">File created!</Alert>}
      {error && !success && <Alert severity="warning">{error}</Alert>}
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
                placeholder={t("Search placeholder")}
                InputProps={{
                  disableUnderline: true,
                  sx: { fontSize: "default" },
                }}
                variant="standard"
              />
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>

      <Box>
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <Paper
            variant="outlined"
            sx={{ m: 2, border: "3px dashed rgba(0, 0, 0, 0.12)", p: 2 }}
          >
            <Box sx={{ my: 5, mx: 2 }}>
              <DriveFolderUploadIcon
                color="primary"
                sx={{
                  display: "block",
                  margin: "auto",
                  transform: "scale(4.8)",
                }}
              />
              <Typography
                color="text.secondary"
                align="center"
                sx={{ marginTop: 5 }}
              >
                {t("Drag and drop zone")}
              </Typography>
            </Box>
          </Paper>
        </div>
        <Box sx={{ p: 2 }}>
          {progress > 0 && <ProgressBar progress={progress} />}
          {files.length > 0 && <Typography>{t("Files")}</Typography>}
          {files.map((el, i) => {
            return (
              <div>
                <FilesList file={el} key={i} />
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
                      id="outlined-read-only-input"
                      label="Numéro Séquentiel"
                      defaultValue={lastId + 1}
                      InputProps={{
                        readOnly: true,
                      }}
                    /></Grid>
                    <Grid item>
                      <TextField
                        
                        id="narticle-input"
                        name="nArticle"
                        label="N Article"
                        type="text"
                        value={formValues.nArticle}
                        onChange={handleInputChange}
                      />
                      </Grid>
                      <Grid item>
                      <TextField
                        id="title-input"
                        name="title"
                        label="Titre"
                        type="text"
                        placeholder={el.name}
                        value={formValues.title}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={["DatePicker"]}>
                          <DatePicker
                            
                            label="Date Extrême"
                            name="dateExtreme"
                            selected={formValues.dateExtreme}
                            onChange={(e) => {
                              setFormValues({
                                ...formValues,
                                dateExtreme: new Date(e),
                              });
                            }}
                            dateFormat="dd/MM/YYYY"
                            minDate={dayjs()}
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                      <TextField
                        
                        multiline
                        id="desc-input"
                        name="description"
                        label="Description"
                        type="text"
                        value={formValues.description}
                        onChange={handleInputChange}
                      /></Grid>
                      <Grid item>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={["DatePicker"]}>
                          <DatePicker
                            
                            label="Date Elimination"
                            name="dateElimination"
                            selected={formValues.dateElimination}
                            onChange={(e) => {
                              setFormValues({
                                ...formValues,
                                dateElimination: new Date(e),
                              });
                            }}
                            dateFormat="dd/MM/YYYY"
                            minDate={dayjs(formValues.dateExtreme)}
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                      </Grid>
                      <Grid>
                      <TextField
                        
                        multiline
                        id="obs-input"
                        name="observation"
                        label="Observation"
                        type="text"
                        value={formValues.observation}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item>
                      {boites && (
                        <TextField
                         
                          select
                          id="demo-simple-select"
                          name="boiteId"
                          value={formValues.boiteId}
                          label="N Boite"
                          onChange={handleInputChange}
                        >
                          {boites.map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                              Boite N {option.nbBoite} Salle {option.nbSalle}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    </Grid>
                    <Grid item>
                    <Autocomplete
                      name="categorie"
                      value={formValues.categorie}
                      onChange={async(event, newValue) => {
                        if (typeof newValue === 'string') {
                          setFormValues({
                            ...formValues,
                            categorie:newValue
                          })
                        } else if (newValue && newValue.inputValue) {
                          // Create a new value from the user input
                           axios.post(process.env.REACT_APP_HOSTNAME + "/category", {categorie:newValue.inputValue}, {
                            withCredentials: true,
                            headers: { Authorization: `Bearer ${token}` },
                          }).then( (res)=>{
                            setFormValues({
                              ...formValues,
                              categorie:res.data
                            })
                          }).catch(error => alert('Erreur'))
                          
                          
                        } else {
                          setFormValues({
                            ...formValues,
                            categorie:newValue
                          });
                        }
                       
                      }}
                      filterOptions={(options, params) => {
                        const filtered = filter(options, params);

                        const { inputValue } = params;
                        // Suggest the creation of a new value
                        const isExisting = options.some((option) => inputValue === option.title);
                        if (inputValue !== '' && !isExisting) {
                          filtered.push({
                            inputValue,
                            title: `Add "${inputValue}"`,
                          });
                          
                        }
                        
                        return filtered;
                      }}
                      selectOnFocus
                      clearOnBlur
                      handleHomeEndKeys
                      id="free-solo-with-text-demo"
                      options={categories}
                      getOptionLabel={(option) => {
                        // Value selected with enter, right from the input
                        if (typeof option === 'string') {
                          return option;
                        }
                        // Add "xxx" option created dynamically
                        if (option.inputValue) {
                          
                          return option.inputValue;
                        }
                        // Regular option
                        return option.title;
                      }}
                      renderOption={(props, option) => <li {...props}>{option.title}</li>}
                      sx={{ width: 300 }}
                      freeSolo
                      renderInput={(params) => (
                        <TextField {...params} label="Categorie" />
                      )}
                    />
                    </Grid>
                    <Grid item>
                      {tags && tags.length > 0 && !openForm ? (
                    <Grid item sx={{display:'flex', flex:'wrap'}}>
                    <TextField
                      
                      fullWidth
                      select
                      id="tagId"
                      name="tagId"
                      value={formValues.tagId}
                      label="Tag"
                      onChange={handleInputChange}
                    >
                      {tags.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.tag_name}
                        </MenuItem>
                      ))}
                    </TextField>
                    <IconButton onClick={() => setOpenForm(true)}>
                      <AddCircleIcon titleAccess="Ajouter nouveau tag" />
                    </IconButton>
                  </Grid>
                ) : (
                  <Dialog open={openForm} onClose={handleCloseT} fullWidth={true}>
                  <DialogTitle>{t("Add Tag")}</DialogTitle>
                  <DialogContent>
                    <Grid item>
                      <TextField
                        
                        id="tagName"
                        name="tag_name"
                        value={tag.tag_name}
                        fullWidth
                        type="text"
                        label="Name"
                        onChange={(e) => {
                          setOpenForm(true);
                          setTag({ ...tag, tag_name: e.target.value });
                        }}
                      />
                    </Grid>
                    <br />
                    <Grid item>
                      <TextField
                        
                        multiline
                        fullWidth
                        id="desc-input"
                        name="tag_desc"
                        label="Description"
                        type="text"
                        value={tag.tag_desc}
                        onChange={(e) =>
                          setTag({ ...tag, tag_desc: e.target.value })
                        }
                      />
                    </Grid>
                    <br />

                    <Grid item>
                      <CirclePicker
                        onChange={(color) =>
                          setTag({ ...tag, color: color.hex })
                        }
                      />{" "}
                    </Grid>
                    <br />
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    onClick={async () => {
                      
                        await axios.post(
                          process.env.REACT_APP_HOSTNAME + `/tag`,
                          { tag },
                          {
                            withCredentials: true,
                            headers: { Authorization: `Bearer ${token}` },
                          }
                        ).then((res) => {
                          setFormValues({...formValues, tagId:res.data.id});
                          alert('tag crée')
                        });
                      
                      setOpenForm(false);
                    }}
                  >
                    Ajouter
                  </Button>{" "}
                  </DialogContent>
                  </Dialog>
                )}
                
                    </Grid>
                    <Grid item>
                    <FormControl>
                      <FormLabel id="demo-row-radio-buttons-group-label">Type de document</FormLabel>
                      <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="type_doc"
                        value={formValues.type_doc}
                        onChange={handleInputChange}
                      >
                        <FormControlLabel value="ELECTRONIC" control={<Radio />} label="ELECTRONIC" />
                        <FormControlLabel value="PAPIER" control={<Radio />} label="PAPIER" />
                        
                        
                      </RadioGroup>
                    </FormControl>
                    </Grid>
                    <Button variant="contained" color="primary" type="submit">
                      Enregistrer
                    </Button>
                  </Grid>
                </Box>{" "}
              </div>
            );
          })}
        </Box>
      </Box>
    </Paper>
  );
}
