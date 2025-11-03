import axios from "axios";

interface RegisterData {
  email: string;
  password: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_SIGN_UP || "http://localhost:3000";

export const registerUser = async (data: RegisterData) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/user/register`, data);
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Registration failed");
  }
};
