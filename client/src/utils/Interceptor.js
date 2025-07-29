import axios from 'axios';
import {refreshToken} from "../apis/auth.js";

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_SERVER_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const {response} = error;

        if (response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const storedRefreshToken = localStorage.getItem('refreshToken');

                if (!storedRefreshToken) throw new Error('No refresh token found');

                const refreshTokenData = await refreshToken({refreshToken: storedRefreshToken});

                if (refreshTokenData.data?.accessToken) {
                    localStorage.setItem('accessToken', refreshTokenData.data.accessToken);

                    originalRequest.headers.Authorization = `Bearer ${refreshTokenData.accessToken}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                console.error('Refresh token failed:', refreshError);
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default api;
