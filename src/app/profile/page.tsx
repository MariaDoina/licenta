"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useApi } from "@/lib/hooks/ApiRequests";
import { useLoadingState } from "@/lib/hooks/useLoadingState";
import Button from "@/components/Button";
import RecipeList, { Recipe } from "@/components/RecipeUI/RecipeList";

type UserData = {
  _id: string;
  username: string;
  email: string;
  about: string;
  specialties: string[];
  recipes: Recipe[];
};

export default function ProfilePage() {
  const { logout, getUserDetails, updateProfile } = useApi();
  const router = useRouter();

  const [user, setUser] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ about: "", specialties: "" });
  const { isLoading, startLoading, stopLoading } = useLoadingState();

  const fetchUserDetails = async () => {
    try {
      const userData = await getUserDetails();
      setUser(userData);
      setFormData({
        about: userData.about || "",
        specialties: userData.specialties.join(", ") || "",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async () => {
    try {
      startLoading();
      await logout();
      router.push("/");
    } catch (error) {
      console.error(error);
    } finally {
      stopLoading();
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.about.length > 500) {
      return toast.error("About section cannot exceed 500 characters.");
    }
    const specialtiesArray = formData.specialties
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (specialtiesArray.length > 10) {
      return toast.error("You can specify up to 10 specialties.");
    }

    try {
      startLoading();
      await updateProfile({
        about: formData.about,
        specialties: specialtiesArray,
      });
      setIsEditing(false);
      fetchUserDetails();
    } catch (error) {
      console.error(error);
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

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
        <div className="bg-white shadow-lg rounded-2xl p-8 mb-8 glassmorphism animate-blur-in">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="h-32 w-32 rounded-full overflow-hidden bg-gray-200"></div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center md:justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-bold">{user?.username}</h1>
                  <p className="text-gray-500">{user?.email}</p>
                </div>
                <div className="flex flex-col gap-2">
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

        {isEditing && (
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-lg rounded-2xl p-6 mb-8"
          >
            <div className="mb-4">
              <label
                className="block text-sm font-semibold mb-2"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-sm font-semibold mb-2"
                htmlFor="specialties"
              >
                Cooking Specialties
              </label>
              <input
                type="text"
                id="specialties"
                name="specialties"
                value={formData.specialties}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
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

        <div className="flex gap-8 flex-wrap lg:flex-nowrap mb-10">
          <div className="w-full lg:w-1/2">
            <div className="bg-white shadow-lg rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">About</h2>
              <p className="text-gray-700">
                {user?.about || "No description available."}
              </p>
            </div>
          </div>

          <div className="w-full lg:w-1/2">
            <div className="bg-white shadow-lg rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">Specialties</h2>
              <div className="flex flex-wrap gap-2">
                {user?.specialties?.map((specialty, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Show Users recipes */}
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Your Recipes</h2>
            <Button
              type="button"
              title="Add New Recipe"
              variant="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
              onClick={() => router.push("/create_recipe/manual")}
            />
          </div>

          {user?.recipes?.length === 0 ? (
            <p className="text-center text-gray-500">No recipes found.</p>
          ) : (
            <RecipeList recipes={user?.recipes || []} />
          )}
        </div>

        <div className="flex justify-end mt-8">
          <Button
            type="button"
            loading={isLoading}
            title="Logout"
            variant="btn_red"
            onClick={handleLogout}
          />
        </div>
      </div>
    </div>
  );
}
