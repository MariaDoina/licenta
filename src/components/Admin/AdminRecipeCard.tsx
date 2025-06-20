import { useApi } from "@/lib/helpers/ApiRequests";
import { useLoadingState } from "@/lib/hooks/useLoadingState";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { Recipe } from "@/constants/typesDB"; // ✅ Import direct

export default function AdminRecipeCard({
  recipe,
  onDelete,
}: {
  recipe: Recipe;
  onDelete: (id: string) => void;
}) {
  const { deleteRecipe } = useApi();
  const { isLoading, startLoading, stopLoading } = useLoadingState();

  if (!recipe) {
    return (
      <div className="border p-4 rounded-xl shadow-md bg-gray-100 text-gray-500">
        Recipe is unavailable.
      </div>
    );
  }

  const handleDelete = async () => {
    if (!confirm(`Delete recipe: ${recipe.title}?`)) return;

    try {
      startLoading();
      await deleteRecipe(recipe._id);
      onDelete(recipe._id);
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof (error as any).message === "string"
      ) {
        toast.error((error as any).message);
      } else {
        toast.error("Failed to delete recipe.");
      }
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="border p-4 rounded-xl shadow-md bg-white space-y-3">
      <div className="w-full h-48 relative">
        {recipe.imageUrl ? (
          <Image
            src={recipe.imageUrl}
            alt={recipe.title}
            width={500}
            height={300}
            className="w-full h-full object-cover rounded-md"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 rounded-md">
            No Image
          </div>
        )}
      </div>

      <h3 className="text-xl font-semibold">{recipe.title}</h3>
      <p className="text-sm text-gray-600">
        Difficulty:{" "}
        <span className="capitalize">{recipe.difficulty ?? "unknown"}</span>
      </p>
      {recipe.cookingTime && (
        <p className="text-sm text-gray-600">
          Cooking Time: {recipe.cookingTime} min
        </p>
      )}
      {recipe.ingredients && recipe.ingredients.length > 0 && (
        <div className="text-sm text-gray-700">
          <strong>Ingredients:</strong>
          <ul className="list-disc ml-5">
            {recipe.ingredients.slice(0, 2).map((ing, idx) => (
              <li key={idx}>{ing}</li>
            ))}
            {recipe.ingredients.length > 2 && <li>...</li>}
          </ul>
        </div>
      )}
      {recipe.tags && recipe.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {recipe.tags.map((tag, idx) => (
            <span
              key={idx}
              className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
      <button
        onClick={handleDelete}
        className="text-red-600 text-sm hover:underline"
        disabled={isLoading}
      >
        {isLoading ? "Deleting..." : "Delete Recipe"}
      </button>
    </div>
  );
}
