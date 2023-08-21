import axios from "axios";

axios.defaults.baseURL = "http://localhost:3001/api/";

export function getUserData(username) {
  return axios.get(`users/data/${username}`).then((res) => res.data);
}

export function getEmailVrfTkn(id, verifyTkn) {
  return axios.get(`users/verify/${id}/${verifyTkn}`).then((res) => res.data);
}

export function logoutUser() {
  return axios.post("users/logout").then((res) => res.data);
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
