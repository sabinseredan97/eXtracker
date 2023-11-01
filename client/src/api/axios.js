import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "https://extracker-server.onrender.com/api/";
//"https://extracker-server-g9tff.ondigitalocean.app/api/";

export function getUserData(username) {
  return axios.get(`users/data/${username}`).then((res) => res.data);
}

export function getEmailVrfTkn(id, verifyTkn) {
  return axios.get(`users/verify/${id}/${verifyTkn}`).then((res) => res.data);
}

export function categories() {
  return axios.get("products/categories").then((res) => res.data);
}

export function getProducts(order, column, startDate, endDate) {
  return axios
    .get(`products/get-products/${order}/${column}/${startDate}/${endDate}`)
    .then((res) => res.data);
}

export function getTotalExpenses(startDate, endDate) {
  return axios
    .get(`products/total-expenses/${startDate}/${endDate}`)
    .then((res) => res.data);
}

export function getPeriosExp(startDate, endDate) {
  return axios
    .get(`products/period-expenses/${startDate}/${endDate}`)
    .then((res) => res.data);
}

export function isLoggedIn() {
  return axios.get("users/logged-in").then((res) => res.data);
}
