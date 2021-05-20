import React, { useState, useContext } from "react";

import { Redirect } from "react-router-dom";
import { userLogin } from "../services/authService";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

import { makeStyles } from "@material-ui/core/styles";
import AuthContext from "../context/authContext";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(1),
      width: theme.spacing(16),
      height: theme.spacing(16),
    },
  },
  paper: {
    marginTop: theme.spacing(15),
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(8),
    paddingLeft: theme.spacing(8),
    paddingRight: theme.spacing(8),

    width: "33%",
    minWidth: 480,
    height: 450,
    padding: "2vw",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  logo: {
    marginBottom: theme.spacing(2),
  },
}));

export default function Login(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const { role } = useContext(AuthContext);
  const classes = useStyles();

  if (role) return <Redirect to="/" />;

  const handleChange = (event) => {
    if (event.target.name === "username") setUsername(event.target.value);
    if (event.target.name === "password") setPassword(event.target.value);
  };

  const handleLogin = async () => {
    const result = await userLogin(username, password);

    if (result.status === 200) {
      const { state } = props.location;
      window.location = state ? state.from.pathname : "/home";
    } else {
      setErrorMsg(result.message);
    }
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper} elevation={2}>
        <img
          className={classes.logo}
          src="img\WSD_logo_en.png"
          height="35"
          alt=""
        />
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            value={username}
            onChange={handleChange}
            autoComplete="username"
            autoFocus
            error={errorMsg !== ""}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            value={password}
            onChange={handleChange}
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            error={errorMsg !== ""}
            helperText={errorMsg}
          />

          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleLogin}
          >
            Login
          </Button>
          <Grid container>
            <Grid item>
              <Link href="/signup" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </div>
  );
}
