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

  //Recipe related API requests
  const getRecipes = async (filters: {
    ingredients?: string;
    tags?: string;
    title?: string;
  }) => {
    try {
      // Construct the query string based on the filters object
      const { ingredients, tags, title } = filters;
      const params = new URLSearchParams();

      if (ingredients?.trim()) {
        params.append("ingredients", ingredients.trim());
      }

      if (tags?.trim()) {
        params.append("tags", tags.trim());
      }

      if (title?.trim()) {
        params.append("title", title.trim());
      }

      // Make the GET request with the query parameters
      const response = await axios.get(
        `/api/recipes/getRecipes?${params.toString()}`
      );

      return response.data; // Return the filtered recipes
    } catch (error: unknown) {
      // Check if the error is an instance of Error
      if (error instanceof Error) {
        throw new Error(error.message || "Failed to fetch recipes.");
      } else {
        throw new Error("An unknown error occurred.");
      }
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

  //Api request to upload image to cloudinary and to create a recipe
  const uploadImage = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await axios.post("/api/recipes/uploadImage", formData);
      // toast.success("Image uploaded successfully!");
      return res.data.imageUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
      throw error;
    }
  };

  const createRecipe = async (data: {
    title: string;
    ingredients: string[];
    instructions: string;
    cookingTime: number;
    imageUrl: string;
    difficulty: "easy" | "medium" | "hard";
    tags: string[];
  }) => {
    try {
      const res = await axios.post("/api/recipes/createRecipe", data);

      // If creation is successful, show success toast
      toast.success("Recipe created successfully!");
      return res.data;
    } catch (error: any) {
      // If there's an error, check if it's a specific one related to duplicate title
      if (error.response && error.response.data && error.response.data.error) {
        const errorMessage = error.response.data.error;

        // Show more specific error message if it's about duplicate title
        if (errorMessage === "A recipe with this title already exists.") {
          toast.error(
            "A recipe with this title already exists. Try searching for it."
          );
        } else {
          toast.error("Failed to create recipe");
        }
      } else {
        toast.error("Failed to create recipe");
      }

      throw error;
    }
  };

  //Api to update recipe by id
  const updateRecipe = async (
    id: string,
    updatedData: {
      title: string;
      ingredients: string[];
      instructions: string;
      cookingTime: number;
      imageUrl: string;
      difficulty: "easy" | "medium" | "hard";
      tags: string[];
    }
  ) => {
    try {
      const response = await axios.put(
        `/api/recipes/updateRecipe/${id}`,
        updatedData
      );
      toast.success("Recipe updated successfully!");
      return response.data;
    } catch (error: any) {
      toast.error("Failed to update recipe.");
      throw error;
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
    profileImageUrl: string | null;
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
    uploadImage,
    createRecipe,
    updateRecipe,
  };
};
