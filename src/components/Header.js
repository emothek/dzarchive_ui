import React, { useContext } from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import HelpIcon from "@mui/icons-material/Help";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { changeLanguage } from "i18next";
import { AppThemeContext } from "../AppTheme";
import { useTranslation } from "react-i18next";

import Content from "./Content";
import Files from "./Files";
import { Box } from "@mui/material";

const lightColor = "rgba(255, 255, 255, 0.7)";

function Header(props) {
  const { user, token, logout, tag, content, onDrawerToggle } = props;
  const { toggleLanguage } = useContext(AppThemeContext);

  const { t } = useTranslation();

  const [index, setIndex] = React.useState(0);
  const [tagExist, setTagExist] = React.useState(false);

  React.useEffect(() => {
    if (content === "Archivage") {
      setIndex(0);
      setTagExist(false);
    } else if (content === "Articles") {
      setIndex(1);
      setTagExist(false);
    } else if (content === "Tag") {
      setTagExist(true);
      //setIndex(1)
    }
  }, [content]);
  const handleTabs = (e, i) => {
    setIndex(i);
  };

  return (
    <React.Fragment>
      <AppBar
        component="div"
        position="static"
        elevation={0}
        sx={{ zIndex: 0 }}
      >
        <Tabs value={index} textColor="inherit" onChange={handleTabs}>
          <Tab label={t("Digitize")} />
          <Tab label={t("Browse")} />
        </Tabs>
      </AppBar>
      {index === 0 && (
        <Box
          component="main"
          sx={{ flex: 1, py: 6, px: 4, bgcolor: "#eaeff1" }}
        >
          <Content user={user} token={token} />
        </Box>
      )}
      {index === 1 && (
        <Box
          component="main"
          sx={{ flex: 1, py: 6, px: 4, bgcolor: "#eaeff1" }}
        >
          <Files user={user} token={token} tagName={tag} tagExist={tagExist} />
        </Box>
      )}
    </React.Fragment>
  );
}

Header.propTypes = {
  onDrawerToggle: PropTypes.func.isRequired,
};

export default Header;
