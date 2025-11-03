import axios, { AxiosError } from "axios";
import type { InternalAxiosRequestConfig } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_AUTH || "http://localhost:3000";

const REFRESH_KEY = "refresh_token";

let accessTokenInMemory: string | null = null;

export const getAccessToken = () => accessTokenInMemory;
export const setAccessTokenInMemory = (token: string | null) => {
  accessTokenInMemory = token;
};
export const getRefreshToken = () => localStorage.getItem(REFRESH_KEY);

export const setRefreshToken = (refreshToken: string | null) => {
    if (refreshToken) 
        localStorage.setItem(REFRESH_KEY, refreshToken); 
    else 
        localStorage.removeItem(REFRESH_KEY);
};

export const setTokens = (accessToken: string | null, refreshToken: string | null) => {
    setAccessTokenInMemory(accessToken);
    setRefreshToken(refreshToken);
}

export const clearTokens = () => {
    setAccessTokenInMemory(null);
    setRefreshToken(null);
}


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const plain = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (error: any) => void;
    config: InternalAxiosRequestConfig;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error){
            prom.reject(error);
        } else {
            prom.config.headers = prom.config.headers || {};

            if (token) {
                prom.config.headers["Authorization"] = `Bearer ${token}`;
            }

            prom.resolve(prom.config);
        }
    });
    failedQueue = [];
};

api.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token && config.headers) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError & { config: InternalAxiosRequestConfig } ) => {
        const originalConfig = error.config;

        if (!originalConfig)
            return Promise.reject(error);

        const status = error.response ? error.response.status : null;

        if (status ===401 && !(originalConfig as any)._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: (cfg) => resolve(api.request(cfg)),
                        reject,
                        config: originalConfig,
                    });
                });
            }

            (originalConfig as any)._retry = true;
            isRefreshing = true;

            const refreshToken = getRefreshToken();

            try {
                const { data } = await plain.post("/auth/refresh", { refreshToken });
                const accessToken = data.accessToken ?? null;
                const newRefreshToken = data.refreshToken ?? null;

                // Always update access token in memory. Only update persistent
                // refresh token if the backend explicitly returned a new one.
                // This avoids accidentally removing a valid refresh token when
                // the refresh endpoint returns only an accessToken.
                setAccessTokenInMemory(accessToken);
                if (newRefreshToken) {
                    setRefreshToken(newRefreshToken);
                }

                processQueue(null, accessToken);

                originalConfig.headers = originalConfig.headers || {};
                if (accessToken) {
                    originalConfig.headers["Authorization"] = `Bearer ${accessToken}`;
                }
                return api.request(originalConfig);
            } catch (err) {
                processQueue(err, null);
                clearTokens();
                window.dispatchEvent(new Event("logout"));
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
);

export default api;