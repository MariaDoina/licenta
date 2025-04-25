"use client";
import { useParams, useRouter } from "next/navigation";
import useRecipe from "@/lib/hooks/useRecipe";

const RecipeDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { recipe, loading, error } = useRecipe(id as string);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-blue-100">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );

  if (error || !recipe)
    return <div className="p-10 text-center text-red-600">{error}</div>;

  const {
    title,
    imageUrl,
    ingredients,
    instructions,
    cookingTime,
    difficulty,
    tags = [],
    userOwner,
    isGenerated,
    createdAt,
  } = recipe;

  return (
    <div className="min-h-screen bg-white p-6">
      <button
        onClick={() => router.push("/recipes")}
        className="mb-6 px-4 py-2 bg-blue-100 text-blue-800 font-medium rounded-md hover:bg-blue-200 transition"
      >
        ← Back to Recipes
      </button>

      <h1 className="text-4xl font-bold text-center mb-6">{title}</h1>

      {imageUrl && (
        <div className="relative max-w-3xl mx-auto mb-6">
          <img
            src={imageUrl}
            alt={title}
            className="w-full rounded-2xl shadow"
          />
          {difficulty && (
            <span className="absolute top-4 right-4 bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full shadow">
              {difficulty}
            </span>
          )}
        </div>
      )}

      <div className="max-w-2xl mx-auto space-y-6 text-gray-700">
        <div className="flex items-center flex-wrap gap-3">
          {cookingTime && (
            <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
              ⏱ {cookingTime} mins
            </span>
          )}
          {isGenerated && (
            <span className="bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full">
              🤖 AI Generated
            </span>
          )}
          {!isGenerated && userOwner && (
            <div className="text-center text-sm text-gray-500 mb-2">
              By {recipe.userOwner?.username || "Unknown chef"}
            </div>
          )}
          {createdAt && (
            <span className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full">
              📅 {new Date(createdAt).toLocaleDateString()}
            </span>
          )}
        </div>

        {tags?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className="bg-gray-200 text-gray-800 text-sm px-3 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div>
          <h2 className="text-2xl font-semibold mb-2">Ingredients:</h2>
          <ul className="list-disc list-inside space-y-1">
            {ingredients?.map((ingredient, idx) => (
              <li key={idx}>{ingredient}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">Instructions:</h2>
          <p>{instructions || "No instructions provided."}</p>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailPage;
