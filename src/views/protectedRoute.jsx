import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import AuthContext from "../context/authContext";
const ProtectedRoute = ({ path, component: Component, render, ...rest }) => {
  const { username } = useContext(AuthContext);
  return (
    <Route
      {...rest}
      render={(props) => {
        if (!username)
          return (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: props.location },
              }}
            />
          );
        return Component ? <Component {...props} /> : render(props);
      }}
    />
  );
};

export default ProtectedRoute;
