import axios from "axios";

// Custom axios instance with default settings
// Every API call in the app can use this instead of plain axios
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL, // set in .env file
    headers: { "Content-Type": "application/json" },
    timeout: 10000,
});

// Runs automatically before every request, attaches JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

// Runs automatically after every response, handles token expiry
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/";
        }
        return Promise.reject(error);
    }
);

export default api;