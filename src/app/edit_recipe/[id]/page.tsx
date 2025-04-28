// pages/edit_recipe/[id].tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApi } from "@/lib/helpers/ApiRequests";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";
import RecipeForm from "@/components/forms/EditRecipeForm";
import { Recipe } from "@/components/RecipeUI/RecipeList";

const EditRecipePage = () => {
  const router = useRouter();
  const { id } = useParams();
  const { getRecipeById, updateRecipe } = useApi();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get the recipe by ID
  useEffect(() => {
    const fetchRecipe = async () => {
      if (id) {
        try {
          const fetchedRecipe = await getRecipeById(id as string);
          setRecipe(fetchedRecipe);
        } catch (error) {
          console.error("Failed to fetch recipe:", error);
          toast.error("Failed to load recipe.");
        }
      }
    };

    fetchRecipe();
  }, [id]);

  const handleSaveChanges = async (updatedRecipe: Recipe) => {
    setIsLoading(true);

    if (!recipe) {
      toast.error("Recipe not found.");
      return;
    }

    try {
      await updateRecipe(recipe._id, updatedRecipe);
      router.push(`/profile`);
    } catch (error) {
      console.error("Failed to update recipe:", error);
      toast.error("Failed to save changes.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!recipe) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold mb-6">Edit Recipe</h2>

        {/* Use the RecipeForm component */}
        <RecipeForm
          recipe={recipe}
          isLoading={isLoading}
          setRecipe={setRecipe}
          handleSaveChanges={handleSaveChanges}
        />
      </div>
    </div>
  );
};

export default EditRecipePage;
