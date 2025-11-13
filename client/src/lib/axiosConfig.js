// src/lib/axiosConfig.js
import axios from "axios";
import { auth } from "./firebase";

const api = axios.create({
    // remove any trailing slashes just in case
    baseURL:
        import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "") ||
        "http://localhost:5000",
    timeout: 15000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// Attach Firebase ID token (if logged in)
api.interceptors.request.use(async (config) => {
    const user = auth.currentUser;

    if (user) {
        const token = await user.getIdToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    } else {
        delete config.headers.Authorization;
    }

    return config;
});

export default api;
