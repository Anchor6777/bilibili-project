import axios from "axios";

const myAxios = axios.create({
  baseURL: "http://localhost:8080/",
  timeout: 10000,
  withCredentials: true,
});

export default myAxios;
