import React, { useEffect, useContext } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { useHistory, useLocation } from "react-router-dom";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import ExitToApp from "@material-ui/icons/ExitToApp";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";

import AuthContext from "../context/authContext";

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(1),
  },
  padding: {
    padding: theme.spacing(3),
  },
  appBar: {
    paddingBottom: theme.spacing(0),
  },
  tabs: {
    paddingBottom: 0,
    marginBottom: 0,
  },
  tab: {
    minWidth: 120,
  },
  exitIcon: {
    color: "primary",
    marginLeft: "auto",
  },
}));

const StyledTabs = withStyles({
  indicator: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
    "& > span": {
      maxWidth: 100,
      width: "100%",
      backgroundColor: "#635ee7",
    },
  },
})((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

const StyledTab = withStyles((theme) => ({
  root: {
    textTransform: "none",
    color: "#000",
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(1),
    "&:focus": {
      opacity: 1,
    },
  },
}))((props) => <Tab disableRipple {...props} />);

const NavBar = (props) => {
  const [value, setValue] = React.useState(0);
  const { role } = useContext(AuthContext);
  let history = useHistory();
  let location = useLocation();

  const classes = useStyles();

  useEffect(() => {
    const pathname = location.pathname;
    if (pathname === "/home") setValue(0);
    if (pathname === "/overview") setValue(1);
    if (pathname === "/investigation") setValue(2);
    if (pathname === "/data-import") setValue(3);
    if (pathname === "/settings") setValue(4);
  }, [location.pathname]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue === 0) history.push("/home");
    if (newValue === 1) history.push("/overview");
    if (newValue === 2) history.push("/investigation");
    if (newValue === 3) history.push("/data-import");
    if (newValue === 4) history.push("/settings");
  };

  return (
    <AppBar position="relative" color="secondary" className={classes.appBar}>
      <Toolbar variant="dense">
        <img
          src="img\wsd_icon.png"
          className={classes.icon}
          height="30"
          alt=""
        />
        <StyledTabs
          className={classes.tabs}
          value={value}
          onChange={handleChange}
          aria-label="navbar navigation"
        >
          <StyledTab className={classes.tab} label="Home" />
          <StyledTab className={classes.tab} label="Overview" />
          <StyledTab className={classes.tab} label="Investigation" />
          {role === "admin" && (
            <StyledTab className={classes.tab} label="Data Import" />
          )}
          {role === "admin" && (
            <StyledTab className={classes.tab} label="Settings" />
          )}
        </StyledTabs>
        <Tooltip title="Logout">
          <IconButton
            className={classes.exitIcon}
            color="primary"
            aria-label="Logout"
            onClick={() => {
              history.push("/logout");
            }}
          >
            <ExitToApp fontSize="large" />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
