import axios from "axios";

const base = import.meta.env.VITE_BASE_URL || "http://backend.golden.bajpai.dev/";
const API = axios.create({
  baseURL: base,
  withCredentials: true
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});



export default API;