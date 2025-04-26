"use client";
import RecipeList, { Recipe } from "@/components/RecipeUI/RecipeList";
import ProfileEditForm from "@/components/forms/ProfileEditForm";
import { useLoadingState } from "@/lib/hooks/useLoadingState";
import { useApi } from "@/lib/hooks/ApiRequests";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import toast from "react-hot-toast";

type UserData = {
  _id: string;
  username: string;
  email: string;
  about: string;
  specialties: string[];
  recipes: Recipe[];
  profileImageUrl: string | null; // Folosim profileImageUrl în loc de profileImage
};

export default function ProfilePage() {
  const { logout, getUserDetails, updateProfile, uploadProfileImage } =
    useApi();
  const router = useRouter();

  const [user, setUser] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { isLoading, startLoading, stopLoading } = useLoadingState();

  const fetchUserDetails = async () => {
    try {
      const userData = await getUserDetails();
      setUser(userData);
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

  const handleSaveChanges = async (updatedData: {
    username: string;
    about: string;
    specialties: string[];
    profileImage: File | null;
  }) => {
    try {
      let profileImageUrl = user?.profileImageUrl || null; // Folosim profileImageUrl aici

      if (updatedData.profileImage) {
        const uploadedImageUrl = await uploadProfileImage(
          updatedData.profileImage
        );
        profileImageUrl = uploadedImageUrl;
      }

      const updateData = {
        username: updatedData.username,
        about: updatedData.about,
        specialties: updatedData.specialties,
        profileImageUrl, // Actualizam cu profileImageUrl
      };

      await updateProfile(updateData);
      toast.success("Profile updated successfully!");
      fetchUserDetails();
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save profile changes:", error);
      toast.error("Failed to save changes.");
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  if (user) {
    console.log("ProfileImageUrl in Render:", user.profileImageUrl); // Verificăm corectitudinea datelor
  }

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
            <div className="h-32 w-32 rounded-full overflow-hidden bg-gray-200">
              {user?.profileImageUrl ? ( // Folosim profileImageUrl
                <img
                  src={user.profileImageUrl}
                  alt="Profile Image"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  No image
                </div>
              )}
            </div>

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

        {isEditing && user && (
          <ProfileEditForm
            currentUsername={user.username}
            currentAbout={user.about}
            currentSpecialties={user.specialties}
            currentProfileImage={user.profileImageUrl} // Actualizăm cu profileImageUrl
            onSave={handleSaveChanges}
          />
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
