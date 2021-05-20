import http from "./httpService";

import { tokenKey } from "../config.json";
const apiEndpoint = "/account";

export async function userLogin(username, password) {
  const result = await http.post(`${apiEndpoint}/login`, {
    username,
    password,
  });

  console.log("login result: ", result);

  if (result.status === 400) {
    return {
      status: result.status,
      message: result.data.message,
    };
  }

  const jwt = result.data.token;
  sessionStorage.setItem(tokenKey, jwt);

  return { status: result.status };
}

export async function userSignUp(username, email, password) {
  const result = await http.post(`${apiEndpoint}`, {
    username,
    email,
    password,
  });
  if (result.status === 400) {
    return {
      status: result.status,
      field: result.data.field,
      message: result.data.message,
    };
  }

  return { status: result.status };
}

export function logout() {
  sessionStorage.removeItem(tokenKey);
}
