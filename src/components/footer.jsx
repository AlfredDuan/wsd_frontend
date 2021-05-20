import React from "react";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary">
      {"Copyright © "}
      {new Date().getFullYear()}{" "}
      <Link color="inherit" href="https://www.wsd.gov.hk/en/home/index.html/">
        Water Supplies Department
      </Link>{" "}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  },
  main: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(2),
  },
  box: {
    color: theme.palette.grey[600],
  },
  footer: {
    padding: theme.spacing(1, 0),
    marginTop: "auto",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[200]
        : theme.palette.grey[800],
  },
  footerLeft: {
    paddingLeft: 15,
  },
  footerCenter: {
    textAlign: "center",
  },
  footerRight: {
    textAlign: "right",
    paddingRight: 15,
  },
}));

export default function Footer() {
  const classes = useStyles();

  return (
    <div>
      <footer className={classes.footer}>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Grid item xs={4} className={classes.footerLeft}>
            <Copyright />
          </Grid>
          <Grid item xs={4} className={classes.footerCenter}>
            <Box fontWeight="fontWeightBold" className={classes.box}>
              Water Station Predictive Maintenance System
            </Box>
          </Grid>
          <Grid item xs={4} className={classes.footerRight}>
            <img
              className={classes.logo}
              src="img\brandhk.png"
              height="42"
              alt=""
            />
          </Grid>
        </Grid>
      </footer>
    </div>
  );
}
