"use client";
import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Image from "next/image";
import { useLoadingState } from "@/lib/hooks/useLoadingState";

type UserData = {
  _id: string;
  username: string;
  email: string;
  profilePic: string;
  about: string;
  specialties: string[];
};

type Recipe = {
  _id: string;
  title: string;
  description?: string;
  userOwner:
    | string
    | {
        _id: string;
        username: string;
        email?: string;
      };
};
export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loadingRecipes, setLoadingRecipes] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    about: "",
    specialties: "",
  });

  const { isLoading, startLoading, stopLoading } = useLoadingState();

  const logout = async () => {
    try {
      startLoading();
      await axios.get("/api/users/logout");
      toast.success("Logged out successfully");
      router.push("/");
    } catch (error: any) {
      console.log(error.message);
      toast.error("Failed to logout");
    } finally {
      stopLoading();
    }
  };

  const getUserDetails = async () => {
    try {
      const res = await axios.get("/api/users/myUser");
      setUser(res.data.data);
      setFormData({
        about: res.data.data.about || "",
        specialties: res.data.data.specialties.join(", ") || "",
      });
    } catch (error: any) {
      console.log(error.message);
      toast.error("Failed to get user details");
    }
  };

  const getUserRecipes = async () => {
    try {
      setLoadingRecipes(true);
      if (!user?._id) return;
      const res = await axios.get("/api/recipes/getUserRecipe");
      const userRecipes = res.data.recipes.filter(
        (recipe: Recipe) => recipe.userOwner === user._id
      );
      setRecipes(res.data.recipes || []);
    } catch (error: any) {
      console.log(error.message);
      toast.error("Failed to fetch recipes");
    } finally {
      setLoadingRecipes(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.about.length > 500) {
      return toast.error("About section cannot exceed 500 characters.");
    }

    const specialtiesArray = formData.specialties
      .split(",")
      .map((s) => s.trim());
    if (specialtiesArray.length > 10) {
      return toast.error("You can specify up to 10 specialties.");
    }

    try {
      startLoading();
      const updatedUser = {
        about: formData.about,
        specialties: specialtiesArray,
      };
      await axios.put("/api/users/updateProfile", updatedUser);
      toast.success("Profile updated successfully");
      setIsEditing(false);
      getUserDetails();
    } catch (error: any) {
      console.log(error.message);
      toast.error("Failed to update profile");
    } finally {
      stopLoading();
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  useEffect(() => {
    if (user?._id) {
      getUserRecipes();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="relative h-64 bg-gradient-to-r from-blue-500 to-teal-400 animate-fade-in">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1495195134817-aeb325a55b65?q=80&w=2070&auto=format&fit=crop')",
          }}
        ></div>
      </div>

      <div className="container mx-auto relative z-10 -mt-24 pb-20">
        {/* Profile Header */}
        <div className="bg-white shadow-lg rounded-2xl p-8 mb-8 glassmorphism animate-blur-in">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative group flex justify-center">
              <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                {/* Uncomment if profilePic is supported */}
                {/* <Image
                  src={user?.profilePic || ""}
                  alt={user?.username || "Profile Picture"}
                  width={128}
                  height={128}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                /> */}
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center md:justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-1">{user?.username}</h1>
                  <p className="text-gray-500 flex items-center gap-2">
                    <span className="text-sm">{user?.email}</span>
                  </p>
                </div>
                <div className="flex flex-col gap-4 mt-2">
                  <Button
                    type="button"
                    title="Edit Profile"
                    variant="btn_white_text"
                    onClick={() => setIsEditing(!isEditing)}
                  />
                  <Button
                    type="button"
                    title="Reset Password"
                    variant="bg-white text-gray-800 border border-gray-200 py-2 px-4 shadow-sm hover:bg-gray-50"
                    href="/forgotpassword"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-lg rounded-2xl p-6 mb-8"
          >
            <div className="mb-4">
              <label
                className="block text-sm font-semibold text-gray-700 mb-2"
                htmlFor="about"
              >
                About
              </label>
              <textarea
                id="about"
                name="about"
                value={formData.about}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                placeholder="Tell us about yourself..."
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-sm font-semibold text-gray-700 mb-2"
                htmlFor="specialties"
              >
                Cooking Specialties (comma separated)
              </label>
              <input
                type="text"
                id="specialties"
                name="specialties"
                value={formData.specialties}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                placeholder="e.g. Italian, Vegetarian, Baking"
              />
            </div>

            <Button
              loading={isLoading}
              title="Save Changes"
              variant="bg-blue-500 text-white py-2 px-4 mt-4"
              type="submit"
            />
          </form>
        )}

        {/* About & Specialties */}
        <div className="flex gap-8 flex-wrap lg:flex-nowrap">
          <div className="w-full lg:w-1/2">
            <div className="bg-white shadow-lg rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">About</h2>
              <p className="text-gray-700">
                {user?.about || "No description available"}
              </p>
            </div>
          </div>

          <div className="w-full lg:w-1/2">
            <div className="bg-white shadow-lg rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">Cooking Specialties</h2>
              <div className="flex flex-wrap gap-2">
                {user?.specialties?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="bg-white px-3 py-1.5 rounded-lg text-sm border border-gray-200 shadow-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recipes Section */}
        <div className="mt-10">
          <div className="bg-white shadow-lg rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4">Your Recipes</h2>
            {loadingRecipes ? (
              <p>Loading recipes...</p>
            ) : recipes.length === 0 ? (
              <p className="text-gray-600">No recipes found.</p>
            ) : (
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {recipes.map((recipe) => (
                  <li
                    key={recipe._id}
                    className="bg-gray-50 border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition"
                  >
                    <h3 className="text-lg font-semibold mb-1">
                      {recipe.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {recipe.description}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="button"
            loading={isLoading}
            title="Logout"
            variant="btn_red"
            className="mt-8"
            onClick={logout}
          />
        </div>
      </div>
    </div>
  );
}
