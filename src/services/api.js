import axios from "axios";

const LOCAL_API = "http://localhost:8000/api/v1";
const PROD_API = "https://food-app-backend-1-69jk.onrender.com/api/v1"; 

const api = axios.create({
  baseURL: PROD_API,
});

// Automatically attach token if present
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  
  export const initializeApiBase = async () => {
    try {
      await axios.get(`${LOCAL_API}/ping`, { timeout: 1000 });
      api.defaults.baseURL = LOCAL_API;
      console.log("✅ Using LOCAL API");
    } catch {
      api.defaults.baseURL = PROD_API;
      console.log("🌐 Using PRODUCTION API");
    }
  };
  
  export default api;