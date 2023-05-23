import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Axios from "axios";
import {
  alpha,
  AppBar,
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import FileIcon from "@mui/icons-material/Description";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useTranslation } from "react-i18next";
import { visuallyHidden } from "@mui/utils";
import PropTypes from "prop-types";
import * as dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import File from "./File";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import PasswordIcon from "@mui/icons-material/Password";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRange } from "react-date-range";
import { CirclePicker } from "react-color";
import EditIcon from "@mui/icons-material/Edit";
import Highlighter from "react-highlight-words";

const download = require("downloadjs");

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "title",
    numeric: false,
    disablePadding: true,
    label: "Name",
  },
  {
    id: "salleId",
    numeric: true,
    disablePadding: true,
    label: "Room",
  },
  {
    id: "boiteId",
    numeric: true,
    disablePadding: true,
    label: "Box",
  },
  {
    id: "nArticle",
    numeric: true,
    disablePadding: true,
    label: "Article",
  },
  {
    id: "dateExtreme",
    numeric: true,
    disablePadding: true,
    label: "extreme date",
  },
  {
    id: "updatedAt",
    numeric: true,
    disablePadding: false,
    label: "updatedAt",
  },
];
function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    result,
  } = props;
  const { t } = useTranslation();
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all files",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {t(headCell.label)}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell>{t("Tags")}</TableCell>
        {result && <TableCell>{t("Preview")}</TableCell>}
        <TableCell>{t("Action")}</TableCell>
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { token, handleOpenRange, numSelected, selectedItems } = props;
  const { t } = useTranslation();
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {t("Files")}
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip
          title={t("Delete")}
          onClick={async () => {
            await fetch(process.env.REACT_APP_HOSTNAME + `/file/`, {
              method: "DELETE",
              body: JSON.stringify(selectedItems),
              credentials: "include",

              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }).then((res) => {
              Axios.post(
                process.env.REACT_APP_HOSTNAME + `/user/activity/`,
                { doc_id: selectedItems, activity: "userDeleteDocument" },
                {
                  withCredentials: true,
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              alert("fichier supprimé");
            });

            /*Axios.delete(process.env.REACT_APP_HOSTNAME+`/file/${sf}`).then((res) => {
              alert('suppression !');
          });*/
          }}
        >
          <IconButton>
            <DeleteIcon sx={{ color: "red" }} />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title={t("Search By Date")} onClick={handleOpenRange}>
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  token: PropTypes.string.isRequired,
  selectedItems: PropTypes.array.isRequired,
  handleOpenRange: PropTypes.func.isRequired,
};

export default function Files(props) {
  const { token, user, tagName, tagExist } = props;
  const [files, setFiles] = useState([]);
  const [boites, setBoites] = useState(null);
  const [categories, setCategories] = useState([]);
  const [file, setFile] = useState(null);
  const [type, setType] = useState("");
  const [path, setPath] = useState(null);
  const [showFile, setShowFile] = useState(false);
  const [open, setOpen] = useState(false);
  const [openT, setOpenT] = useState(false);
  const [openEf, setOpenEf] = useState(false);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filterFt, setFilterFt] = useState(files);
  const [searchItem, setSearchItem] = useState("");
  const [dateType, setDateType] = useState("");
  const { t } = useTranslation();
  const filter = createFilterOptions();
  const user_activities = [
    "userDeleteDocument",
    "userEditDocument",
    "userViewDocument",
  ];
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: "selection",
    },
  ]);
  const [tag, setTag] = useState({
    tag_name: "",
    tag_desc: "",
    color: "",
  });

  const [tags, setTags] = useState(null);
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [tagId, setTagId] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [result, setResult] = useState(null);
  const [formValues, setFormValues] = useState({
    nArticle: "",
    description: "",
    dateExtreme: null,
    dateElimination: null,
    observation: "",
    boiteId: null,
    type_doc: "",
    categoryId: null,
  });

  useEffect(() => {
    if (tagExist) {
      setFilterFt(
        files
          .map((item) => ({
            ...item,
            tags: item.tags.filter((child) => child.id === parseInt(tagName)),
          }))
          .filter((item) => item.tags.length > 0)
      );
    } else if (searchItem === "") {
      setResult(null);
      Axios.get(process.env.REACT_APP_HOSTNAME + "/files", {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => {
        //console.log(res.data)
        setFiles(res.data);
        setFilterFt(res.data);
      });
    }

    if (openT)
      Axios.get(process.env.REACT_APP_HOSTNAME + "/tags", {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => {
        setTags(res.data);
      });

    if (openEf) {
      Axios.get(process.env.REACT_APP_HOSTNAME + "/boitesByOrganisation", {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => {
        //console.log(res.data)
        setBoites(res.data);
      });
      Axios.get(process.env.REACT_APP_HOSTNAME + "/categories", {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => {
        //console.log(res.data)
        setCategories(res.data);
      });
    }
  }, [token, searchItem, tagExist, tagName, openT, openEf]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = files.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const handleSearch = (e) => {
    let target = e.target;
    setSearchItem(target.value.replace(/ /g, "&"));
  };

  const handleOpenRange = () => setOpen((open) => !open);

  const Search = async (e) => {
    if (e.key === "Enter") {
      const res = await Axios.get(
        process.env.REACT_APP_HOSTNAME + "/search?q=" + searchItem.trim(),
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      )
        .then((res) => {
          if (res.data.files.length > 0) {
            setFilterFt(res.data.files);
            setResult(res.data.result);
            //console.log(result)
          } else {
            alert("Aucun resultat !");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleShow = () => {
    setShowFile(!showFile);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleCloseT = () => {
    setOpenT(false);
  };
  const handleCloseEf = () => {
    setOpenEf(false);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(formValues);

    Axios.put(process.env.REACT_APP_HOSTNAME + `/file/${file.id}`, formValues, {
      withCredentials: true,
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        Axios.post(
          process.env.REACT_APP_HOSTNAME + `/user/activity`,
          { doc_id: file.id, activity: user_activities[1] },
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        alert("Fichier modifié !");
      })
      .catch((err) => alert("Erreur"));
  };

  const SearchDate = async () => {
    console.log(dateType, state);
    let filtered = null;
    if (dateType === "createdAt") {
      filtered = files.filter((file) => {
        return (
          new Date(file.createdAt).getTime() >= state[0].startDate.getTime() &&
          new Date(file.createdAt).getTime() <= state[0].endDate.getTime()
        );
      });
    }
    if (dateType === "updatedAt") {
      filtered = files.filter((file) => {
        return (
          new Date(file.updatedAt).getTime() >= state[0].startDate.getTime() &&
          new Date(file.updatedAt).getTime() <= state[0].endDate.getTime()
        );
      });
    } else if (dateType === "dateExtreme") {
      filtered = files.filter((file) => {
        return (
          new Date(file.dateExtreme).getTime() >=
            state[0].startDate.getTime() &&
          new Date(file.dateExtreme).getTime() <= state[0].endDate.getTime()
        );
      });
    } else if (dateType === "dateElimination") {
      filtered = files.filter((file) => {
        return (
          new Date(file.dateElimination).getTime() >=
            state[0].startDate.getTime() &&
          new Date(file.dateElimination).getTime() <= state[0].endDate.getTime()
        );
      });
    }

    if (filtered.length > 0) setFilterFt(filtered);
    else {
      alert("Aucun resultat");
      setFilterFt(files);
    }

    handleClose();
  };

  const getFile = async (id) => {
    await Axios.get(process.env.REACT_APP_HOSTNAME + "/file/" + id, {
      withCredentials: true,
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      console.log(res);
      setFile(res.data);
      setType(res.data.title.split(".").pop());
      console.log(type);
    });
  };

  const getEncryptedFile = async (id, password) => {
    try {
      console.log(token);
      return await fetch(
        process.env.REACT_APP_HOSTNAME + "/file/viewenc/" + id + `/${password}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  const createCategory = async (categorie) => {
    await Axios.post(
      process.env.REACT_APP_HOSTNAME + "/category",
      { categorie },
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((res) => {
        alert(res.data.name + " catégorie créee");
      })
      .catch((error) => alert("Erreur"));
  };

  return (
    <Box sx={{ margin: "auto", overflow: "hidden" }}>
      {files && filterFt.length > 0 ? (
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
                    placeholder={t("Search placeholder")}
                    InputProps={{
                      disableUnderline: true,
                      sx: { fontSize: "default" },
                    }}
                    variant="standard"
                    onChange={handleSearch}
                    onKeyUp={Search.bind(this)}
                  />
                </Grid>
              </Grid>
            </Toolbar>
          </AppBar>
          <Dialog open={open} onClose={handleClose} fullWidth>
            <DialogTitle>Choisir Dates</DialogTitle>
            <DialogContent>
              <TextField
                required
                fullWidth
                select
                id="demo-simple-select"
                name="dateType"
                value={dateType}
                label="Choisir type date"
                onChange={(e) => {
                  setDateType(e.target.value);
                }}
              >
                <MenuItem key={0} value="createdAt">
                  Date de Création
                </MenuItem>
                <MenuItem key={1} value="updatedAt">
                  Date de Modification
                </MenuItem>
                <MenuItem key={2} value="dateExtreme">
                  Date Extrême
                </MenuItem>
                <MenuItem key={3} value="dateElimination">
                  Date Elimination
                </MenuItem>
              </TextField>
              <DateRange
                editableDateInputs={true}
                onChange={(item) => setState([item.selection])}
                moveRangeOnFirstSelection={false}
                ranges={state}
              />
              <Button
                variant="contained"
                color="primary"
                type="submit"
                onClick={SearchDate}
              >
                Rechercher
              </Button>
            </DialogContent>
          </Dialog>
          <EnhancedTableToolbar
            numSelected={selected.length}
            selectedItems={selected}
            token={token}
            handleOpenRange={handleOpenRange}
          />
          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={files.length}
                result={result}
              />
              <TableBody>
                {stableSort(filterFt, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((f, index) => {
                    const isItemSelected = isSelected(f.id);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    let filtered =
                      result && result.filter((r) => r.titre === f.title);
                    console.log(filtered);
                    let textToHighlight = result
                      ? "".concat(
                          filtered.map((r) => r.titre === f.title && r.line)
                        )
                      : " test ";

                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, f.id)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={0}
                        key={f.id}
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            sx={visuallyHidden}
                            checked={isItemSelected}
                            inputProps={{
                              "aria-labelledby": labelId,
                            }}
                          />
                        </TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                        >
                          <FileIcon /> {f.title}
                        </TableCell>

                        <TableCell align="right">
                          {f.boite ? f.boite.nbSalle : "Aucune"}
                        </TableCell>
                        <TableCell align="right">
                          {f.boite ? f.boite.nbBoite : "Aucune"}
                        </TableCell>
                        <TableCell>
                          {f.nArticle !== "" ? f.nArticle : f.id}
                        </TableCell>
                        <TableCell align="right">
                          {dayjs(f.dateExtreme || new Date()).format(
                            "DD-MMM-YYYY, h:mm A"
                          )}
                        </TableCell>
                        <TableCell align="right">
                          {dayjs(f.updatedAt || new Date()).format(
                            "DD-MMM-YYYY, h:mm A"
                          )}
                        </TableCell>
                        <TableCell align="right">
                          {f.tags &&
                            f.tags.map((data) => {
                              return (
                                <ListItem key={data.id}>
                                  <Chip
                                    sx={{ bgcolor: data.color, color: "white" }}
                                    label={data.tag_name}
                                    size="small"
                                    onDelete={async () => {
                                      let id = data.id;
                                      await Axios.post(
                                        process.env.REACT_APP_HOSTNAME +
                                          `/tag/remove/${f.id}`,
                                        { id },
                                        {
                                          withCredentials: true,
                                          headers: {
                                            Authorization: `Bearer ${token}`,
                                          },
                                        }
                                      ).then((res) => {
                                        alert(res.data);
                                      });
                                    }}
                                  />
                                </ListItem>
                              );
                            })}
                        </TableCell>
                        {result && (
                          <TableCell>
                            <Card sx={{ p: 1 }}>
                              <Highlighter
                                highlightClassName="YourHighlightClass"
                                searchWords={[searchItem]}
                                autoEscape={true}
                                textToHighlight={textToHighlight}
                              />
                            </Card>
                          </TableCell>
                        )}

                        <TableCell sx={{ display: "flex", flex: "wrap" }}>
                          {f.password && (
                            <IconButton
                              onClick={async () => {
                                console.log("..... file object");
                                console.log(f);

                                if (!showFile) {
                                  await getFile(f.id);
                                  let password = prompt("Password");

                                  const encFile = await getEncryptedFile(
                                    f.id,
                                    password
                                  );
                                  console.log("\n\n\n ====== file ");
                                  console.log(typeof encFile);
                                  console.log(encFile);

                                  const blob = await encFile.blob();
                                  console.log(blob);
                                  setPath(blob);

                                  handleShow();
                                }
                              }}
                            >
                              <PasswordIcon
                                color="primary"
                                titleAccess={t("Afficher")}
                              />
                            </IconButton>
                          )}

                          {!f.password && (
                            <IconButton
                              onClick={async () => {
                                console.log("..... file object");
                                console.log(f);

                                if (!showFile) {
                                  await getFile(f.id);

                                  const res = await fetch(
                                    process.env.REACT_APP_HOSTNAME +
                                      `/file/view/${f.id}`,
                                    {
                                      withCredentials: true,
                                      headers: {
                                        Authorization: `Bearer ${token}`,
                                      },
                                    }
                                  );
                                  if (res) {
                                    await Axios.post(
                                      process.env.REACT_APP_HOSTNAME +
                                        `/user/activity/`,
                                      {
                                        doc_id: f.id,
                                        activity: user_activities[2],
                                      },
                                      {
                                        withCredentials: true,
                                        headers: {
                                          Authorization: `Bearer ${token}`,
                                        },
                                      }
                                    );
                                    console.log(res);
                                    const blob = await res.blob();
                                    console.log(blob);
                                    setPath(blob);
                                  }

                                  handleShow();
                                }
                              }}
                            >
                              <FileOpenIcon
                                color="primary"
                                titleAccess={t("Afficher")}
                              />
                            </IconButton>
                          )}

                          <IconButton
                            onClick={() => {
                              getFile(f.id);
                              setOpenT(true);
                            }}
                          >
                            <BookmarkAddIcon titleAccess={t("Add Tag")} />
                          </IconButton>

                          <IconButton
                            onClick={async () => {
                              await getFile(f.id);
                              console.log(file);
                              setOpenEf(true);
                            }}
                          >
                            <EditIcon titleAccess={t("EditInformation")} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={files.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
          <Dialog open={openT} onClose={handleCloseT} fullWidth={true}>
            <DialogTitle>{t("Add Tag")}</DialogTitle>
            <DialogContent>
              <br />
              <Grid>
                {tags && tags.length > 0 && !openForm ? (
                  <Grid item sx={{ display: "flex", flex: "wrap" }}>
                    <TextField
                      required
                      fullWidth
                      select
                      id="tagId"
                      name="tagId"
                      value={tagId}
                      label="Tag"
                      onChange={(e) => setTagId(e.target.value)}
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
                  <>
                    <Grid item>
                      <TextField
                        required
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
                        required
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
                  </>
                )}
                <br />
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  onClick={async () => {
                    if (openForm) {
                      await Axios.post(
                        process.env.REACT_APP_HOSTNAME + `/tag`,
                        { tag },
                        {
                          withCredentials: true,
                          headers: { Authorization: `Bearer ${token}` },
                        }
                      ).then((res) => {
                        setTagId(res.data.id);

                        Axios.post(
                          process.env.REACT_APP_HOSTNAME + `/addtag/${file.id}`,
                          { tagId: res.data.id },
                          {
                            withCredentials: true,
                            headers: { Authorization: `Bearer ${token}` },
                          }
                        ).then((res) => {
                          Axios.post(
                            process.env.REACT_APP_HOSTNAME + `/user/activity/`,
                            { doc_id: file.id, activity: user_activities[1] },
                            {
                              withCredentials: true,
                              headers: { Authorization: `Bearer ${token}` },
                            }
                          );
                          alert("Tag ajouté");
                          handleCloseT();
                        });
                      });
                    } else {
                      await Axios.post(
                        process.env.REACT_APP_HOSTNAME + `/addtag/${file.id}`,
                        { tagId },
                        {
                          withCredentials: true,
                          headers: { Authorization: `Bearer ${token}` },
                        }
                      ).then((res) => {
                        Axios.post(
                          process.env.REACT_APP_HOSTNAME + `/user/activity/`,
                          { doc_id: file.id, activity: user_activities[1] },
                          {
                            withCredentials: true,
                            headers: { Authorization: `Bearer ${token}` },
                          }
                        );
                        alert("Tag ajouté");
                        handleCloseT();
                      });
                    }
                    setOpenForm(false);
                  }}
                >
                  Ajouter
                </Button>{" "}
              </Grid>
            </DialogContent>
          </Dialog>
        </Paper>
      ) : (
        <p style={{ textAlign: "center" }}>Aucun Fichier !</p>
      )}
      {showFile && (
        <Grid container spacing={2}>
          <Grid item xs={8}>
            {type === "doc" ||
            type === "docx" ||
            type === "xlsx" ||
            type === "ppt" ? (
              <Button onClick={() => download(path, file.title)}>
                Télécharger
              </Button>
            ) : (
              showFile && <File file={path} />
            )}
          </Grid>
          <Grid item xs={4}>
            <Box>
              <Card sx={{ p: 2, color: "white" }}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{ py: 1 }}
                />
                <TextField
                  required
                  fullWidth
                  multiline
                  sx={{ py: 1 }}
                  id="descinput"
                  name="note"
                  label="Note"
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  onClick={async () => {
                    await Axios.post(
                      process.env.REACT_APP_HOSTNAME + `/send/file/${file.id}`,
                      { email, note },
                      {
                        withCredentials: true,
                        headers: { Authorization: `Bearer ${token}` },
                      }
                    )
                      .then((res) => {
                        alert("fichier envoyé !");
                      })
                      .catch((err) => {
                        alert("Erreur d'envoi");
                      });
                  }}
                >
                  Envoyer
                </Button>{" "}
              </Card>

              <List>
                {file.tags &&
                  file.tags.map((data) => {
                    return (
                      <ListItem key={data.id}>
                        <Chip
                          sx={{ bgcolor: data.color, color: "white" }}
                          label={data.tag_name}
                          size="small"
                          onDelete={async () => {
                            let id = data.id;
                            await Axios.post(
                              process.env.REACT_APP_HOSTNAME +
                                `/tag/remove/${file.id}`,
                              { id },
                              {
                                withCredentials: true,
                                headers: {
                                  Authorization: `Bearer ${token}`,
                                },
                              }
                            ).then((res) => {
                              alert(res.data);
                            });
                          }}
                        />
                      </ListItem>
                    );
                  })}
                <ListItem>
                  <ListItemText primary={"Titre"} secondary={file.title} />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={"N Article"}
                    secondary={file.nArticle ? file.nArticle : file.id}
                  />
                </ListItem>
                {file.category && (
                  <ListItem>
                    <ListItemText
                      primary={"Catégorie"}
                      secondary={file.category.name}
                    />
                  </ListItem>
                )}
                {file.type && (
                  <ListItem>
                    <ListItemText primary={"Type"} secondary={file.type} />
                  </ListItem>
                )}
                <ListItem>
                  <ListItemText
                    primary={"Description"}
                    secondary={file.description}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={"Observation"}
                    secondary={file.observation}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={"Date de création"}
                    secondary={dayjs(file.createdAt || new Date()).format(
                      "DD-MMM-YYYY, h:mm A"
                    )}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={"Date de modification"}
                    secondary={dayjs(file.updatedAt || new Date()).format(
                      "DD-MMM-YYYY, h:mm A"
                    )}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={"Date Extrême"}
                    secondary={dayjs(file.dateExtreme || new Date()).format(
                      "DD-MMM-YYYY, h:mm A"
                    )}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={"Date Elimination"}
                    secondary={dayjs(file.dateElimination || new Date()).format(
                      "DD-MMM-YYYY, h:mm A"
                    )}
                  />
                </ListItem>
                {file.boite && (
                  <ListItem>
                    <ListItemText
                      primary={"Boite"}
                      secondary={
                        "N " +
                        file.boite.nbBoite +
                        " " +
                        "Salle " +
                        file.boite.nbSalle
                      }
                    />
                  </ListItem>
                )}
              </List>
            </Box>
          </Grid>
        </Grid>
      )}
      {openEf && (
        <Dialog open={openEf} onClose={handleCloseEf}>
          <DialogTitle>{t("EditInformation")}</DialogTitle>
          <DialogContent>
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
                    id="narticle-input"
                    name="nArticle"
                    label="N Article"
                    type="text"
                    value={formValues.nArticle}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DatePicker"]}>
                      <DatePicker
                        required
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
                    required
                    multiline
                    id="desc-input"
                    name="description"
                    label="Description"
                    type="text"
                    value={formValues.description}
                    onChange={handleInputChange}
                  />

                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DatePicker"]}>
                      <DatePicker
                        required
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

                  <TextField
                    required
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
                      required
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
                    name="categoryId"
                    value={formValues.categoryId}
                    onChange={async (event, newValue) => {
                      if (typeof newValue === "string") {
                        setFormValues({
                          ...formValues,
                          categoryId: newValue,
                        });
                      } else if (newValue && newValue.inputValue) {
                        // Create a new value from the user input

                        Axios.post(
                          process.env.REACT_APP_HOSTNAME + "/category",
                          { categorie: newValue.inputValue },
                          {
                            withCredentials: true,
                            headers: { Authorization: `Bearer ${token}` },
                          }
                        )
                          .then((res) => {
                            setFormValues({
                              ...formValues,
                              categorie: res.data,
                            });
                          })
                          .catch((error) => alert("Erreur"));
                      } else {
                        setFormValues({
                          ...formValues,
                          categoryId: newValue,
                        });
                      }
                    }}
                    filterOptions={(options, params) => {
                      const filtered = filter(options, params);

                      const { inputValue } = params;
                      // Suggest the creation of a new value
                      const isExisting = options.some(
                        (option) => inputValue === option.title
                      );
                      if (inputValue !== "" && !isExisting) {
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
                      if (typeof option === "string") {
                        return option;
                      }
                      // Add "xxx" option created dynamically
                      if (option.inputValue) {
                        return option.inputValue;
                      }
                      // Regular option
                      return option.title;
                    }}
                    renderOption={(props, option) => (
                      <li {...props}>{option.title}</li>
                    )}
                    sx={{ width: 300 }}
                    freeSolo
                    renderInput={(params) => (
                      <TextField {...params} label="Categorie" />
                    )}
                  />
                </Grid>

                <Grid item>
                  <FormControl>
                    <FormLabel id="demo-row-radio-buttons-group-label">
                      Type de document
                    </FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="type_doc"
                      value={formValues.type_doc}
                      onChange={handleInputChange}
                    >
                      <FormControlLabel
                        value="ELECTRONIC"
                        control={<Radio />}
                        label="ELECTRONIC"
                      />
                      <FormControlLabel
                        value="PAPIER"
                        control={<Radio />}
                        label="PAPIER"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Button variant="contained" color="primary" type="submit">
                  Enregistrer
                </Button>
              </Grid>
            </Box>{" "}
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
}
