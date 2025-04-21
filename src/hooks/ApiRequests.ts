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
      toast.success("Signup successful");
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

  const resetPassword = async (user: {
    token: string;
    newpassword: string;
  }) => {
    try {
      const res = await axios.post("/api/users/resetpassword", user);
      toast.success("Your password has been successfully changed!");
      return res.data;
    } catch (error: any) {
      toast.error("Failed to reset password. Please try again.");
      throw error;
    }
  };

  const forgotPassword = async (user: { email: string }) => {
    try {
      const res = await axios.post("/api/users/forgotpassword", user);
      toast.success("We’ve sent you a reset link! Please check your inbox.");
      return res.data;
    } catch (error: any) {
      if (error.response?.status === 400) {
        toast.error("No account found with that email. Please try again.");
      } else {
        toast.error("Something went wrong! Please try again later.");
      }
      throw error;
    }
  };

  return { signup, login, resetPassword, forgotPassword };
};
