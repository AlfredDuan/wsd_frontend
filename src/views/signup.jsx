import React, { useState } from "react";
import { Redirect } from "react-router-dom";

import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import { Formik } from "formik";
import * as Yup from "yup";
import { useSnackbar } from "notistack";

import { userSignUp } from "../services/authService";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";

import { makeStyles } from "@material-ui/core/styles";

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

const SignupSchema = Yup.object().shape({
  username: Yup.string()
    .min(5, "Min 5 characters")
    .max(50, "Max 50 characters")
    .required("Username is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Min 6 characters")
    .max(50, "Max 50 characters"),
  confirmPassword: Yup.string()
    .required("Please input confirm password.")
    .oneOf([Yup.ref("password"), null], "Passwords does not match."),
});

export default function Signup(props) {
  const [location, setLocation] = useState("");
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  if (location !== "") return <Redirect to={location} />;

  return (
    <div className={classes.root}>
      <Paper className={classes.paper} elevation={2}>
        <img
          className={classes.logo}
          src="img\WSD_logo_en.png"
          height="35"
          alt=""
        />
        <Formik
          initialValues={{
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={SignupSchema}
          onSubmit={async (values, actions) => {
            const { username, email, password } = values;
            const result = await userSignUp(username, email, password);
            if (result.status === 200) {
              enqueueSnackbar("Signed up successfully!", {
                variant: "success",
              });
              setLocation("/login");
              //window.location = "/login";
            } else {
              if (result.field === "username")
                actions.setErrors({ username: result.message });
              if (result.field === "email")
                actions.setErrors({ email: result.message });

              enqueueSnackbar(result.message, {
                variant: "error",
              });
              //alert(JSON.stringify(values, null, 2));
            }
          }}
        >
          {(props) => {
            const {
              values,
              touched,
              errors,
              isSubmitting,
              handleChange,
              handleSubmit,
              handleBlur,
              dirty,
              isValid,
            } = props;
            return (
              <form className={classes.form} onSubmit={handleSubmit}>
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  label="Username"
                  name="username"
                  value={values.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.username && touched.username}
                  helperText={touched.username && errors.username}
                />
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  label="Email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.email && touched.email}
                  helperText={touched.email && errors.email}
                />
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  type="password"
                  label="Password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.password && touched.password}
                  helperText={touched.password && errors.password}
                />
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  type="password"
                  label="Confirm Password"
                  name="confirmPassword"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.confirmPassword && touched.confirmPassword}
                  helperText={touched.confirmPassword && errors.confirmPassword}
                />
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  type="submit"
                  disabled={isSubmitting || !dirty || !isValid}
                >
                  Sign Up
                </Button>
                <Grid container>
                  <Grid item>
                    <Link href="/login" variant="body2">
                      {"Already signed up? Login"}
                    </Link>
                  </Grid>
                </Grid>
              </form>
            );
          }}
        </Formik>
      </Paper>
    </div>
  );
}
