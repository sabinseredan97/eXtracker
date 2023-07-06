import axios from "axios";
import jwtInterceptor from "../interceptors/axios";

export function authorization() {
  return jwtInterceptor.get("/users/auth").then((res) => res.data);
}

export function getUserData(username) {
  return jwtInterceptor.get(`profile/${username}`).then((res) => res.data);
}

export function getEmailVrfTkn(id, verifyTkn) {
  return axios.get(`users/verify/${id}/${verifyTkn}`).then((res) => res.data);
}

export function logoutUser() {
  return axios.post("/users/logout").then((res) => res.data);
}
