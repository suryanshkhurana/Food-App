import axios from "axios";

const LOCAL_API = "http://localhost:8000/api/v1";
const PROD_API = "https://food-app-backend-1-urmc.onrender.com/api/v1"; 

const api = axios.create({
  baseURL: PROD_API,
  withCredentials: true 
});

api.interceptors.request.use(function (config) {
  try {
    const authData = JSON.parse(localStorage.getItem('auth-storage'));
    const token = authData?.state?.tokens?.accessToken;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    console.error('Error accessing auth token:', e);
  }
  
  return config;
}, function (error) {
  return Promise.reject(error);
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