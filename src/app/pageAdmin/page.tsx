"use client";

import { useEffect, useState } from "react";
import AdminUserCard from "@/components/Admin/AdminUserCard";
import AdminRecipeCard from "@/components/Admin/AdminRecipeCard";
import { useRouter } from "next/navigation";
import { useApi } from "@/lib/helpers/ApiRequests";
import { useLoadingState } from "@/lib/hooks/useLoadingState";
import Spinner from "@/components/LoadingSpinner";
import { Recipe, UserData } from "@/constants/typesDB";

export default function AdminPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState("");
  const { isLoading, startLoading, stopLoading } = useLoadingState();
  const router = useRouter();
  const { getAdminData } = useApi();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        startLoading();
        const data = await getAdminData();
        setUsers(data.users);
        setRecipes(data.recipes);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        stopLoading();
      }
    };
    fetchAdminData();
  }, []);

  const handleDeleteUser = (id: string) => {
    setUsers((prev) => prev.filter((user) => user._id !== id));
  };
  const handleDeleteRecipe = (id: string) => {
    setRecipes((prev) => prev.filter((recipe) => recipe._id !== id));
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center">
        <p className="text-red-600 text-lg font-semibold">
          An error occurred: {error}
        </p>
        <button
          onClick={() => router.push("/profile")}
          className="text-blue-600 hover:underline text-base font-medium"
        >
          Back to profile
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-green-100 to-blue-100 min-h-screen p-6 space-y-10 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-center">Admin Dashboard</h1>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Users</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {users.map((user) => (
            <AdminUserCard
              key={user._id}
              user={user}
              onDelete={handleDeleteUser}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Recipes</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {recipes.map((recipe) => (
            <AdminRecipeCard
              key={recipe._id}
              recipe={recipe}
              onDelete={handleDeleteRecipe}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
