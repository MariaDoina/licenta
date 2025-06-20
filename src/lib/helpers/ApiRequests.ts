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
    } catch (error: unknown) {
      toast.error("A user with this email already exists.");
      throw error;
    }
  };

  const login = async (user: { email: string; password: string }) => {
    try {
      const res = await axios.post("/api/users/login", user);
      toast.success("Login successful");
      return res.data;
    } catch (error: unknown) {
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
    } catch (error: unknown) {
      toast.error("Failed to reset password. Please try again.");
      throw error;
    }
  };

  const forgotPassword = async (user: { email: string }) => {
    try {
      const res = await axios.post("/api/users/forgotpassword", user);
      toast.success("We’ve sent you a reset link! Please check your inbox.");
      return res.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
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
    } catch (error: unknown) {
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
  const getRecipes = async (filters?: {
    ingredients?: string;
    tags?: string;
    title?: string;
  }) => {
    try {
      const params = new URLSearchParams();

      if (filters?.ingredients?.trim()) {
        params.append("ingredients", filters.ingredients.trim());
      }

      if (filters?.tags?.trim()) {
        params.append("tags", filters.tags.trim());
      }

      if (filters?.title?.trim()) {
        params.append("title", filters.title.trim());
      }

      const response = await axios.get(
        `/api/recipes/getRecipes?${params.toString()}`
      );

      return response.data;
    } catch (error: unknown) {
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
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message || "Could not fetch recipe.");
      } else {
        throw new Error("Could not fetch recipe.");
      }
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
    } catch (error: unknown) {
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
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        const errorMessage = error.response.data.error;

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
    } catch (error: unknown) {
      toast.error("Failed to update recipe.");
      throw error;
    }
  };

  //Api to save recipe so user can access it later
  const saveRecipe = async (recipeId: string) => {
    try {
      const res = await axios.post("/api/recipes/saveRecipeToUser", {
        recipeId,
      });
      toast.success("Recipe was saved succesfully!");
      return res.data;
    } catch (error: any) {
      toast.error("Could not save recipe. Please try again.");
      throw error;
    }
  };

  //Api request for user logout, getting user data, updating user data, and getting user recipes
  const logout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("Logged out successfully");
    } catch (error: unknown) {
      console.log(error);
      toast.error("Failed to logout");
      throw error;
    }
  };

  const getUserDetails = async () => {
    try {
      const res = await axios.get("/api/users/myUser");
      console.log("User details response:", res.data);
      return res.data.data;
    } catch (error: unknown) {
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
    } catch (error: unknown) {
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
    } catch (error: unknown) {
      console.error("Error uploading profile image:", error);
      toast.error("Failed to upload profile image");
      throw error;
    }
  };

  //Api request for admin to get all users and recipes
  const getAdminData = async () => {
    try {
      const res = await axios.get("/api/admin/seeAllRecipeUser", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      return res.data;
    } catch (error: unknown) {
      toast.error("Failed to fetch data.");
      throw error;
    }
  };

  //Api request to delete a recipe by id
  const deleteRecipe = async (recipeId: string) => {
    try {
      const res = await axios.delete(`/api/admin/recipes/${recipeId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Recipe deleted successfully");
      return res.data;
    } catch {
      toast.error("Failed to delete recipe");
    }
  };

  //Api request to delete a user by id
  const deleteUser = async (userId: string) => {
    try {
      const res = await axios.delete(`/api/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success("User deleted successfully.");
      return res.data;
    } catch (error: unknown) {
      toast.error("Failed to delete user.");
      throw error;
    }
  };

  //Api request to get all saved recipes from user
  const getSavedRecipes = async () => {
    try {
      const res = await axios.get("/api/recipes/getSavedRecipeFromUser");
      return res.data.savedRecipes;
    } catch (error: unknown) {
      toast.error("Failed to fetch saved recipes.");
      throw error;
    }
  };

  //Api to unsave recipe
  const unsaveRecipe = async (recipeId: string) => {
    try {
      const res = await axios.post("/api/recipes/unsaveRecipe", { recipeId });
      toast.success("Recipe removed from saved successfully!");
      return res.data;
    } catch (error: unknown) {
      toast.error("Failed to remove recipe from saved.");
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
    deleteRecipe,
    deleteUser,
    getAdminData,
    saveRecipe,
    getSavedRecipes,
    unsaveRecipe,
  };
};
