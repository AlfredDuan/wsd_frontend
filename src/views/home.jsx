import React, { useState, useContext } from "react";
import { Redirect } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import HomeTable from "../components/homeTable";
import Button from "@material-ui/core/Button";
import ShowChartIcon from "@material-ui/icons/ShowChart";

import InfoContext from "../context/infoContext";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  paper: {
    "min-width": "60vw",
    margin: 30,
    padding: 20,
    minHeight: 550,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200,
    alignContent: "center",
  },
  button: {
    marginBottom: 10,
  },
}));

export default function Home() {
  const [redirect, setRedirect] = useState(false);
  const { selectedAbns } = useContext(InfoContext);

  const classes = useStyles();
  const search = "?selectedAbns=1";

  if (redirect === true)
    return (
      <Redirect
        to={{
          pathname: "/investigation",
          search: search,
          state: { renderSelectedAbns: true },
        }}
      />
    );

  return (
    <div className={classes.root}>
      <Paper className={classes.paper} elevation={2}>
        <Button
          className={classes.button}
          size="small"
          variant="contained"
          color="primary"
          disabled={selectedAbns.length === 0}
          onClick={() => setRedirect(true)}
          startIcon={<ShowChartIcon />}
        >
          Details
        </Button>
        <HomeTable />
      </Paper>
    </div>
  );
}
