import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../api/userApi";

interface RegisterData {
  email: string;
  password: string;
}

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterData) => registerUser(data),
    onError: (error) => {
      console.error("Error:", error);
    },
  });
};
