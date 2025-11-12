import axios from "axios";
import { auth } from "./firebase";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "") || "",
    timeout: 15000,
    headers: { "Content-Type": "application/json", Accept: "application/json" },
});

api.interceptors.request.use(async (config) => {
    const user = auth.currentUser;
    if (user) {
        const token = await user.getIdToken();
        if (token) config.headers.Authorization = `Bearer ${token}`;
    } else {
        delete config.headers.Authorization;
    }
    return config;
});

export default api;
