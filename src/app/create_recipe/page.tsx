"use client";

import { useState, useEffect, useRef } from "react";
import { useApi } from "@/lib/helpers/ApiRequests";
import { motion } from "framer-motion";
import RecipeCard from "@/components/RecipeUI/CreateRecipeCard";
import RecipeList, { Recipe } from "@/components/RecipeUI/RecipeList";
import useSearch from "@/lib/hooks/useSearch";

const CreateRecipe = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    title,
    setTitle,
    ingredients,
    setIngredients,
    tags,
    setTags,
    debouncedTitle,
    debouncedIngredients,
    debouncedTags,
  } = useSearch(500);

  const { getRecipes } = useApi();

  const bottomRef = useRef<HTMLDivElement | null>(null); // Aici am corectat tipul

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const filters = debouncedTitle || debouncedIngredients || debouncedTags;

        const response = await getRecipes({
          ingredients: debouncedIngredients,
          tags: debouncedTags,
          title: debouncedTitle,
        });
        setRecipes(response.recipes);
      } catch (err: any) {
        setError(err.message || "Failed to fetch recipes.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [debouncedTitle, debouncedIngredients, debouncedTags]);

  const handleSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setter(e.target.value);
  };

  // Functie care face scroll la secțiunea de jos
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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

      {/* Filters Section */}
      <div className="mb-12 w-full max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {/* Search by Title */}
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-semibold text-gray-700">
              Title
            </label>
            <input
              type="text"
              className="p-3 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="e.g., Chocolate Cake"
              value={title}
              onChange={(e) => handleSearchChange(e, setTitle)}
            />
          </div>

          {/* Search by Ingredients */}
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-semibold text-gray-700">
              Ingredients (comma separated)
            </label>
            <input
              type="text"
              className="p-3 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="e.g., sugar, flour, butter"
              value={ingredients}
              onChange={(e) => handleSearchChange(e, setIngredients)}
            />
          </div>

          {/* Search by Tags */}
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-semibold text-gray-700">
              Tags (comma separated)
            </label>
            <input
              type="text"
              className="p-3 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="e.g., dessert, quick, vegan"
              value={tags}
              onChange={(e) => handleSearchChange(e, setTags)}
            />
          </div>
        </div>
      </div>

      {/* Button to scroll to the bottom */}
      <div className=" mb-10">
        <button
          onClick={scrollToBottom}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          Scroll to Bottom
        </button>
      </div>

      {/* Loading state small message */}
      {loading && (
        <div className="text-gray-500 mb-4">Searching recipes...</div>
      )}

      {/* Show Recipes */}
      <RecipeList recipes={recipes} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-4xl px-4 mt-12">
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

      {/* Error Message */}
      {error && <div className="text-lg text-red-600 mt-8">{error}</div>}

      {/* The bottom section */}
      <div ref={bottomRef} className="mt-16" />
    </div>
  );
};

export default CreateRecipe;
