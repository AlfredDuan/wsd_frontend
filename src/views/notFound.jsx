import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  logo: {
    margin: 30,
  },
}));
export default function NotFound() {
  const classes = useStyles();

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Link href="/home">
          <img
            className={classes.logo}
            src="img\icon_waterdrop3.png"
            height="50"
            alt=""
          />
        </Link>
        <Typography variant="h3">Page Not Found!</Typography>
      </div>
    </Container>
  );
}
