"use client";

import { useEffect, useState } from "react";
import AdminUserCard from "@/components/Admin/AdminUserCard";
import AdminRecipeCard from "@/components/Admin/AdminRecipeCard";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const res = await fetch("/api/admin/seeAllRecipeUser", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to fetch");

        setUsers(data.users);
        setRecipes(data.recipes);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchAdminData();
  }, []);

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

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <section>
        <h2 className="text-xl font-semibold mb-2">Users</h2>
        <div className="grid gap-4">
          {users.map((user: any) => (
            <AdminUserCard key={user._id} user={user} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Recipes</h2>
        <div className="grid gap-4">
          {recipes.map((recipe: any) => (
            <AdminRecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </div>
      </section>
    </div>
  );
}
