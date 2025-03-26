"use client";
import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Image from "next/image";

type UserData = {
  _id: string;
  username: string;
  email: string;
  profilePic: string;
  about: string;
  specialties: string[];
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // State for editing
  const [formData, setFormData] = useState({
    about: "",
    specialties: "",
  });

  const logout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error: any) {
      console.log(error.message);
      toast.error("Failed to logout");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedUser = {
        about: formData.about,
        specialties: formData.specialties.split(",").map((s) => s.trim()),
      };
      await axios.put("/api/users/updateProfile", updatedUser); // Call API endpoint
      toast.success("Profile updated successfully");
      setIsEditing(false); // Switch off editing mode
      getUserDetails(); // Refresh the user data
    } catch (error: any) {
      console.log(error.message);
      toast.error("Failed to update profile");
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
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            <div className="relative group">
              <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                {/* <Image
                  //TODO vezi adauga o alta varianta pt profile pic
                  src={user?.profilePic || ""}
                  alt={user?.username || "Profile Picture"}
                  width={128}
                  height={128}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                /> */}
              </div>
            </div>

            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
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
                    onClick={() => setIsEditing(!isEditing)} // Toggle edit mode
                  />
                  <Button
                    type="button"
                    title="Reset Password"
                    variant="bg-white text-gray-800 border border-gray-200 py-2 px-4 shadow-sm hover:bg-gray-50"
                    href="/"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form - If editing */}
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
              title="Save Changes"
              variant="bg-blue-500 text-white py-2 px-4 mt-4"
              type="submit"
            />
          </form>
        )}

        {/* Profile Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-1/3 space-y-6">
            <div className="bg-white shadow-lg rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">About</h2>
              <p className="text-gray-700">
                {user?.about || "No description available"}
              </p>
            </div>

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

        <Button
          type="button"
          title="Logout"
          variant="btn_red"
          // icon="/log-out.svg"
          className="mt-8 "
          onClick={logout}
        />
      </div>
    </div>
  );
}
