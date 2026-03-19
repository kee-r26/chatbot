import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Use environment variable
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the token
apiClient.interceptors.request.use(
  (config) => {
    const token = cookies.get("authToken"); // Retrieve token from cookies
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized errors (e.g., redirect to login)
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;