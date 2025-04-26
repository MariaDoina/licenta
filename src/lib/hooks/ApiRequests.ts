import axios from "axios";
import { toast } from "react-hot-toast";

export const useApi = () => {
  // Includes all the authentication related API requests
  // such as signup, login, reset password, forgot password, and email verification.
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

  const verifyEmail = async (token: string) => {
    try {
      await axios.post("/api/users/verifyEmail", { token });
      toast.success("Email successfully verified!");
    } catch (error: any) {
      toast.error("Token is invalid or has expired.");
      throw error;
    }
  };

  // Api requests to check is the user is authenticated or not
  const checkAuth = async (): Promise<boolean> => {
    try {
      const response = await axios.get("/api/users/auth_check");
      return response.data.success;
    } catch (error) {
      return false;
    }
  };

  //Api request to get recipes
  const getRecipes = async () => {
    try {
      const response = await axios.get("/api/recipes/getRecipes");
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch recipes.");
    }
  };

  // Api request to get a single recipe by id
  const getRecipeById = async (id: string) => {
    try {
      const response = await axios.get(`/api/recipes/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || "Could not fetch recipe.");
    }
  };

  //Api request for user logout, getting user data, updating user data, and getting user recipes

  const logout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("Logged out successfully");
    } catch (error: any) {
      console.log(error.message);
      toast.error("Failed to logout");
      throw error;
    }
  };

  const getUserDetails = async () => {
    try {
      const res = await axios.get("/api/users/myUser");
      console.log("User details response:", res.data);
      return res.data.data;
    } catch (error: any) {
      console.error("Error getting user details:", error);
      toast.error("Failed to get user details");
      throw error;
    }
  };

  const updateProfile = async (data: {
    username: string;
    about: string;
    specialties: string[];
    profileImage: string | null;
  }) => {
    try {
      const res = await axios.put("/api/users/updateProfile", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      toast.success("Profile updated successfully");
      return res.data;
    } catch (error: any) {
      toast.error("Failed to update profile");
      throw error;
    }
  };

  const uploadProfileImage = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("profileImage", file);

      const res = await axios.post("/api/users/uploadProfileImage", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Profile image uploaded successfully!");
      return res.data.imageUrl;
    } catch (error: any) {
      console.error("Error uploading profile image:", error);
      toast.error("Failed to upload profile image");
      throw error;
    }
  };

  return {
    signup,
    login,
    resetPassword,
    forgotPassword,
    verifyEmail,
    checkAuth,
    getRecipes,
    getRecipeById,
    logout,
    getUserDetails,
    updateProfile,
    uploadProfileImage,
  };
};
