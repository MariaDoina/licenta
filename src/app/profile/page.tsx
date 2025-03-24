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
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);

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
    } catch (error: any) {
      console.log(error.message);
      toast.error("Failed to get user details");
    }
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
                <Image
                  src={user?.profilePic || "/default-avatar.jpg"}
                  alt={user?.username || "Profile Picture"}
                  width={128}
                  height={128}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
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
                <div className="flex gap-3">
                  <Button
                    type="button"
                    title="Edit Profile"
                    variant="bg-white text-gray-800 border border-gray-200 py-2 px-4 shadow-sm hover:bg-gray-50"
                  />
                  <Button type="button" title="Settings" variant="py-2 px-4" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white shadow-lg rounded-2xl p-6 text-center">
            <h2 className="text-xl font-semibold">My Recipes</h2>
            <p className="text-2xl font-bold">28</p>
          </div>
          <div className="bg-white shadow-lg rounded-2xl p-6 text-center">
            <h2 className="text-xl font-semibold">Favorites</h2>
            <p className="text-2xl font-bold">164</p>
          </div>
          <div className="bg-white shadow-lg rounded-2xl p-6 text-center">
            <h2 className="text-xl font-semibold">Followers</h2>
            <p className="text-2xl font-bold">482</p>
          </div>
        </div>

        {/* Profile Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-1/3 space-y-6">
            <div className="bg-white shadow-lg rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">About</h2>
              <p className="text-gray-700">
                Food enthusiast and home chef. I love creating simple, delicious
                meals with fresh ingredients. Sharing my culinary journey one
                recipe at a time!
              </p>
            </div>

            <div className="bg-white shadow-lg rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">Cooking Specialties</h2>
              <div className="flex flex-wrap gap-2">
                {[
                  "Italian",
                  "Vegetarian",
                  "Baking",
                  "Soups",
                  "Desserts",
                  "Breakfast",
                  "Quick Meals",
                ].map((skill) => (
                  <span
                    key={skill}
                    className="bg-white px-3 py-1.5 rounded-lg text-sm border border-gray-200 shadow-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full lg:w-2/3 space-y-6">
            <div className="bg-white shadow-lg rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">My Recipes</h2>
                <Button
                  type="button"
                  title="View All"
                  variant="bg-white text-gray-800 border border-gray-200 py-2 px-4 shadow-sm hover:bg-gray-50"
                />
              </div>
              {/* Here you can map through your recipes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Example recipe */}
                <div className="bg-white shadow-lg rounded-xl p-4">
                  <h3 className="font-bold text-lg mb-1">Homemade Lasagna</h3>
                  <p className="text-gray-500 text-sm">
                    Classic Italian comfort food with layers of pasta, rich meat
                    sauce, and cheese
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white shadow-lg rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {/* Example activity */}
                <div className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0">
                  <div className="h-2 w-2 rounded-full bg-blue-500 mt-2"></div>
                  <div>
                    <p className="text-gray-800">
                      Posted a new recipe: Homemade Lasagna
                    </p>
                    <p className="text-xs text-gray-400">2 hours ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Button
          type="button"
          title="Logout"
          variant="btn_dark_gray"
          className="hidden lg:flex items-center gap-2"
          onClick={logout}
        />
      </div>
    </div>
  );
}
