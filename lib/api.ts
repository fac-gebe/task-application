import axios from 'axios';
import { deleteToken, getToken } from './authStorage';
export const api = axios.create({
    // API base URL
    baseURL: 'https://mobile-application-development-backend-production.up.railway.app/api',
    headers: {
        'Accept': 'application / json',
        'Content-Type': 'application/json',
    },
});

// Attach the token
api.interceptors.request.use(
    async (config) => {
        const token = await getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle expired tokens
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            await deleteToken();

        }
        return Promise.reject(error);
    }
);