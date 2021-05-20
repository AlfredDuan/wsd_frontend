// import axios from "axios";
import { create } from "apisauce";

import { apiUrl, tokenKey } from "../config.json";

const token = sessionStorage.getItem(tokenKey);

const api = create({
  baseURL: apiUrl,
  headers: { "x-auth-token": token },
});

// axios.interceptors.response.use(null, (error) => {
//   const expectedError =
//     error.response &&
//     error.response.status >= 400 &&
//     error.response.status < 500;

//   if (!expectedError) {
//     console.log(error);
//     console.log("An unexpected error occurrred.");
//   }
// });

// if (token) axios.defaults.headers.common["x-auth-token"] = token;

export default {
  get: api.get,
  post: api.post,
  put: api.put,
  delete: api.delete,
};
