import axios from "axios";

axios.defaults.baseURL = "http://localhost:3001/api/";

export function authorization() {
  return axios.get("/users/auth").then((res) => res.data);
}

export function getUserData(username) {
  return axios.get(`profile/${username}`).then((res) => res.data);
}

export function getEmailVrfTkn(id, verifyTkn) {
  return axios.get(`users/verify/${id}/${verifyTkn}`).then((res) => res.data);
}

export function logoutUser() {
  return axios.post("/users/logout").then((res) => res.data);
}
