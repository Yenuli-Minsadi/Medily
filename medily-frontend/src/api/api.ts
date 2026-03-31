import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080",
    headers: { "Content-Type": "application/json" },
    timeout: 80000,  // ← change from 10000 to 30000
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

// TEMPORARILY DISABLED - not redirecting on 401 so we can debug
api.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
);

export default api;