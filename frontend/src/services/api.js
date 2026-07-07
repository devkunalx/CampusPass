import axios from "axios";
import useAuthStore from "../store/useAuthStore.js";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(
  (config) => {
    const auth = useAuthStore.getState().auth;

    if (auth?.token) {
      config.headers.Authorization = `Bearer ${auth.token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;