import axios from "axios";
import { BASE_URL } from "../utils/constants";

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

api.interceptors.request.use(
    config => {

        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    error => Promise.reject(error)
);

api.interceptors.response.use(
    response => response,
    async error => {

        const originalRequest = error.config;

        const isAuthCall = originalRequest &&
            originalRequest.url &&
            originalRequest.url.includes("/auth/");

        if (
            error.response &&
            error.response.status === 401 &&
            originalRequest &&
            !originalRequest._retry &&
            !isAuthCall
        ) {

            originalRequest._retry = true;

            const storedRefreshToken = localStorage.getItem("refreshToken");

            if (storedRefreshToken) {
                try {
                    const response = await axios.post(
                        `${BASE_URL}/auth/refresh-token`,
                        { refreshToken: storedRefreshToken }
                    );

                    localStorage.setItem("token", response.data.token);
                    localStorage.setItem("refreshToken", response.data.refreshToken);

                    originalRequest.headers.Authorization = `Bearer ${response.data.token}`;

                    return api(originalRequest);
                } catch (refreshError) {
                    localStorage.clear();
                    window.location.href = "/";
                    return Promise.reject(refreshError);
                }
            }

            localStorage.clear();
            window.location.href = "/";
        }

        return Promise.reject(error);
    }
);

export default api;