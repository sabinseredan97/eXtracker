import axios from "axios";

axios.defaults.baseURL = "http://localhost:3001/api/";

export function getUserData(username) {
  return axios.get(`profile/user-data/${username}`).then((res) => res.data);
}

export function getEmailVrfTkn(id, verifyTkn) {
  return axios.get(`users/verify/${id}/${verifyTkn}`).then((res) => res.data);
}

export function logoutUser() {
  return axios.post("users/logout").then((res) => res.data);
}

export function categories() {
  return axios.get("profile/categories").then((res) => res.data);
}
