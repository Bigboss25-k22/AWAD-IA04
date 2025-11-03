import axios from "axios";
import api from "./axiosClient";

const BASE_URL = import.meta.env.VITE_API_BASE_URL_AUTH || "http://localhost:3000";

export interface LoginPayload {
    email: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
}

export const loginRequest = (data: LoginPayload) =>
  axios.post<LoginResponse>(`${BASE_URL}/auth/login`, data).then((r) => r.data);

export const refreshRequest = (refreshToken: string | null) =>
  axios.post<{ accessToken?: string; refreshToken?: string }>(`${BASE_URL}/auth/refresh`, { refreshToken }).then((r) => r.data);

export const getProfile = () => api.get("/auth/profile").then((r) => r.data);