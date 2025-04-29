"use client";
import Image from "next/image";
import useRecipes from "@/lib/hooks/useRecipes";
import Link from "next/link";

const Features = () => {
  const { data, loading, error } = useRecipes();
  const recipes = data?.recipes ?? [];

  if (loading) {
    return (
      <div className="text-center mt-20 text-xl text-gray-600">
        Loading recipes...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 mb-20">
      <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">
        Our Featured Recipes
      </h1>

      {recipes.length === 0 ? (
        <p className="text-center text-gray-500">No recipes available yet.</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {recipes.slice(0, 8).map((recipe) => (
            <Link key={recipe._id} href={`/create_recipe/${recipe._id}`}>
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:scale-[1.03] transition-transform duration-300">
                {recipe.imageUrl ? (
                  <Image
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
                <div className="p-4 text-center">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {recipe.title}
                  </h2>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {error && (
        <div className="text-center text-red-600 mt-8">
          Failed to load recipes: {error}
        </div>
      )}
    </div>
  );
};

export default Features;
