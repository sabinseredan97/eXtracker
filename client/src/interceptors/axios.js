import axios from "axios";

axios.defaults.baseURL = "http://localhost:3001/api/";

let jwtInterceptor = axios.create({ baseURL: "http://localhost:3001/api/" });

jwtInterceptor.interceptors.response.use(
  (resp) => resp,
  async (error) => {
    let refresh = false;
    if (error.response.status === 400 && !refresh) {
      refresh = true;
      const response = await axios.get(
        "users/refresh",
        {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.accessToken}`;
        return axios(error.config);
      }
    }
    refresh = false;
    return error;
  }
);

export default jwtInterceptor;
