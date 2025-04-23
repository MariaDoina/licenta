"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

interface Recipe {
  _id: string;
  title: string;
  imageUrl?: string;
  instructions?: string;
  ingredients?: string[];
}

const RecipeDetailPage = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await axios.get(`/api/recipes/${id}`);
        setRecipe(res.data);
      } catch (err: any) {
        setError("Could not fetch recipe.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchRecipe();
  }, [id]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (error || !recipe)
    return <div className="p-10 text-center text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-4xl font-bold text-center mb-6">{recipe.title}</h1>

      {recipe.imageUrl && (
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          className="w-full max-w-3xl mx-auto rounded-2xl shadow mb-6"
        />
      )}

      <div className="max-w-2xl mx-auto space-y-4 text-gray-700">
        <h2 className="text-2xl font-semibold">Ingredients:</h2>
        <ul className="list-disc list-inside">
          {recipe.ingredients?.map((ingredient, idx) => (
            <li key={idx}>{ingredient}</li>
          ))}
        </ul>

        <h2 className="text-2xl font-semibold mt-6">Instructions:</h2>
        <p>{recipe.instructions || "No instructions provided."}</p>
      </div>
    </div>
  );
};

export default RecipeDetailPage;
