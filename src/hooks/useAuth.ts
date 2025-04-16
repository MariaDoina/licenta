import axios from "axios";
import { toast } from "react-hot-toast";

export const useAuth = () => {
  const signup = async (user: {
    email: string;
    password: string;
    username: string;
  }) => {
    try {
      const response = await axios.post("/api/users/signup", user);
      await toast.success("Signup successful");
      return response.data;
    } catch (error: any) {
      toast.error("A user with this email already exists.");
      throw error;
    }
  };

  const login = async (user: { email: string; password: string }) => {
    try {
      const res = await axios.post("/api/users/login", user);
      toast.success("Login successful");
      return res.data;
    } catch (error: any) {
      toast.error(
        "User not found. Please check your email and password, then try again."
      );
      throw error;
    }
  };

  return { signup, login };
};
