import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";

import SelectionMenu from "../components/settings/selectionMenu";
import Accounts from "../components/settings/accounts";
import WaterFlowMeters from "../components/settings/waterFlowMeters";
import EventTypes from "../components/settings/eventTypes";
import AdditionalFunction from "../components/settings/additionalFunction";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  paper: {
    minWidth: "70%",
    margin: 30,
    padding: 20,
    minHeight: 550,
  },
}));

const Settings = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [page, setPage] = useState("accounts");
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <SelectionMenu
        open={menuOpen}
        handleClose={() => setMenuOpen(false)}
        setPage={setPage}
      />
      <Paper className={classes.paper} elevation={2}>
        <IconButton
          color="primary"
          aria-label="Menu"
          onClick={() => setMenuOpen(true)}
        >
          <MenuIcon />
        </IconButton>
        {page === "accounts" && <Accounts />}
        {page === "waterFlowMeters" && <WaterFlowMeters />}
        {page === "eventTypes" && <EventTypes />}
        {page === "additionalFunction" && <AdditionalFunction />}
      </Paper>
    </div>
  );
};

export default Settings;
