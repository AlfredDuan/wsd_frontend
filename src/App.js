import React, { useState, useEffect } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import jwtDecode from "jwt-decode";

import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import LinearProgress from "@material-ui/core/LinearProgress";

import { SnackbarProvider } from "notistack";

import ProtectedRoute from "./views/protectedRoute";
import Login from "./views/login";
import Logout from "./views/logout";
import Investigation from "./views/investigation";
import Overview from "./views/overview";
import DataImport from "./views/dataImport";
import NotFound from "./views/notFound";
import Home from "./views/home";
import Settings from "./views/settings";

import { tokenKey } from "./config.json";
import AuthContext from "./context/authContext";
import InfoContext from "./context/infoContext";

import NavBar from "./components/navBar";
import Footer from "./components/footer";
import "./App.css";
import Signup from "./views/signup";
import { sleep } from "./utils/helpers";

import { getWaterFlowMeters } from "./utils/info";

import { getEventTypes } from "./services/settingService";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  },
  main: {
    marginTop: theme.spacing(0),
    marginBottom: theme.spacing(0),
    flexGrow: 1,
  },
}));

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#006bb6",
      light: "#46A6EB",
      dark: "#003E6B",
    },
    secondary: {
      main: "#f5fafe",
      light: "#81DDEB",
      dark: "#5B696B",
    },
    tertiary: {
      main: "#e1fbeb",
      light: "#8DEBB1",
      dark: "#606B64",
    },
    accent: {
      main: "#178292",
      light: "#6CDAEB",
      dark: "#115F6B",
    },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
});

function App() {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [meters, setMeters] = useState("");
  const [selectedAbns, setSelectedAbns] = useState("");
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressOn, setProgressOn] = useState(false);
  const [intervalId, setIntervalId] = useState(0);
  const [eventDict, setEventDict] = useState([]);

  useEffect(() => {
    const startProgressLine = () => {
      setShowProgress(true);
      const interval = setInterval(() => {
        setProgress((progress) => {
          const ceil = (100 - progress) / 5;
          const random = Math.floor(Math.random() * ceil);
          return progress + random;
        });
      }, 100);
      setIntervalId(interval);
    };

    const endProgressLine = async () => {
      clearInterval(intervalId);
      setProgress(100);
      await sleep(1000);
      setShowProgress(false);
      setProgress(0);
    };

    if (progressOn) {
      startProgressLine();
    } else if(intervalId !== 0) {
      endProgressLine();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progressOn]);

  useEffect(() => {
    const token = sessionStorage.getItem(tokenKey);

    if (token) {
      try {
        const decodedProps = jwtDecode(token);
        setUsername(decodedProps.username);
        setRole(decodedProps.role);
      } catch (ex) {
        sessionStorage.removeItem(tokenKey);
      }
    } else {
      setUsername("");
      setRole("");
    }
  }, []);

  useEffect(() => {
    if (username !== "") retrieveMetersInfo();
  }, [username]);

  useEffect(() => {
    updateEventDict();
  }, []);

  const updateEventDict = async () => {
    const { data: result} = await getEventTypes();

    window.localStorage.setItem("eventType", JSON.stringify(result));
    const eventType = result;
    const lEventDict = {};
    // lEventDict["crossDaysError"] = "Cross Days Error";
    for (const i in eventType) {
      lEventDict[eventType[i].eventTag] = eventType[i].description;
    }
    lEventDict['crossDaysError'] = "cross days error"
    setEventDict(lEventDict);
  };

  const classes = useStyles();

  const retrieveMetersInfo = async () => {
    const lmeters = await getWaterFlowMeters();
    setMeters(lmeters);
  };

  const authContextValue = {
    username,
    role,
  };

  const infoContextValue = {
    meters,
    retrieveMetersInfo,
    selectedAbns,
    setSelectedAbns,
    progressOn,
    setProgressOn,
    eventDict,
    updateEventDict,
  };
  return (
    <MuiThemeProvider theme={theme}>
      <AuthContext.Provider value={authContextValue}>
        <InfoContext.Provider value={infoContextValue}>
          <SnackbarProvider maxSnack={3}>
            <div className={classes.root}>
              <CssBaseline />

              {username && <NavBar />}
              <div style={showProgress ? null : { visibility: "hidden" }}>
                <LinearProgress variant="determinate" value={progress} />
              </div>

              <main className={classes.main}>
                <Switch>
                  <Route path="/login" component={Login} />
                  <Route path="/signup" component={Signup} />
                  <Route path="/logout" component={Logout} />
                  <ProtectedRoute path="/home" component={Home} />
                  <ProtectedRoute
                    path="/investigation"
                    component={Investigation}
                  />
                  <ProtectedRoute
                    path="/overview"
                    component={Overview}
                  />
                  <ProtectedRoute path="/data-import" component={DataImport} />
                  <ProtectedRoute path="/settings" component={Settings} />
                  <Route path="/not-found" component={NotFound} />
                  <Redirect from="/" exact to="/home" />
                  <Redirect to="/not-found" />
                </Switch>
              </main>
              <Footer />
            </div>
          </SnackbarProvider>
        </InfoContext.Provider>
      </AuthContext.Provider>
    </MuiThemeProvider>
  );
}

export default App;
