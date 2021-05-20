import { logout } from "../services/authService";

const Logout = () => {
  logout();
  window.location = "/";

  return null;
};

export default Logout;
