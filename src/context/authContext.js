import React from "react";

const AuthContext = React.createContext({
  username: "",
  setUsername: () => {},
  role: "",
  setRole: () => {},
});

export default AuthContext;
