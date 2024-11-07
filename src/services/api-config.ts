import axios,{ CanceledError } from "axios";

const baseURL = import.meta.env.VITE_BASE_URL;

const instance = axios.create({ 
    baseURL: baseURL,

    headers: {
      "ngrok-skip-browser-warning": "69420"
    }
  });
  
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
  export default instance;
export { CanceledError };