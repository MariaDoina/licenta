"use client";
import { useEffect, useState } from "react";
import { useApi } from "@/lib/hooks/ApiRequests";
import { motion } from "framer-motion";
import RecipeCard from "@/components/RecipeUI/CreateRecipeCard";
import RecipeList, { Recipe } from "@/components/RecipeUI/RecipeList";

const CreateRecipe = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { getRecipes } = useApi();

  useEffect(() => {
    setLoading(true);
    getRecipes()
      .then((data) => {
        setRecipes(data);
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch recipes.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-blue-100">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-blue-100 px-4 py-16">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-4xl font-bold text-gray-800 text-center mb-4"
      >
        Your Digital Kitchen
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        viewport={{ once: true }}
        className="text-lg text-gray-600 max-w-xl text-center mb-12"
      >
        Create perfect recipes with the help of artificial intelligence or add
        and organize your own favorite recipes.
      </motion.p>

      {/* Show Recipes */}
      <RecipeList recipes={recipes} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-4xl px-4">
        <RecipeCard
          href="/create_recipe/ai"
          imageSrc="/wand.svg"
          altText="AI Chef"
          title="Generate with AI"
          description="Let AI suggest recipes based on the ingredients you have or your culinary preferences."
        />

        <RecipeCard
          href="/create_recipe/manual"
          imageSrc="/book.svg"
          altText="Manual Recipe"
          title="Add your own recipes"
          description="Prefer the classic way? Add your ingredients and instructions step by step."
        />
      </div>
    </div>
  );
};

export default CreateRecipe;
