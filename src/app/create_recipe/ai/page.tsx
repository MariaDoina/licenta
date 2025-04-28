"use client";
import Button from "@/components/Button";
import { motion } from "framer-motion";
import React, { useState } from "react";
import AddItem from "@/components/RecipeUI/AddItem";
import { useLoadingState } from "@/lib/hooks/useLoadingState";
import axios from "axios";
import toast from "react-hot-toast";

export default function GenerateRecipePage() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);
  const { isLoading, startLoading, stopLoading } = useLoadingState();

  const handleGenerate = async () => {
    startLoading();

    try {
      const response = await axios.post("/api/recipes/generateRecipe", {
        ingredients,
      });

      const data = response.data;
      console.log("API response data:", data);

      const recipe = data.recipe || data.savedRecipe || null;

      if (!recipe) {
        throw new Error("No recipe found");
      }

      // Afișează DOAR o rețetă, nu adaugă la listă
      setRecipes([recipe]);
    } catch (err: any) {
      toast.error(
        "Error generating recipe. Please check your ingredients and try again."
      );
      console.error("Error:", err.message);
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 p-6">
      <div className="max-w-3xl mx-auto p-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
        >
          Generate a Recipe
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          viewport={{ once: true }}
          className="text-lg text-gray-600 max-w-xl mx-auto mb-10"
        >
          Enter the ingredients you have on hand, and we'll create a delicious
          recipe for you to try.
        </motion.p>

        <AddItem
          label="Ingredient"
          itemList={ingredients}
          setItemList={setIngredients}
        />

        <Button
          type="button"
          title={isLoading ? "Generating..." : "Generate Recipe"}
          onClick={handleGenerate}
          variant="btn_small_gradient mx-auto block"
          loading={isLoading}
        />

        <div className="mt-6 space-y-6">
          {recipes.length > 0 ? (
            recipes.map((recipe, index) => (
              <div key={index} className="border p-4 rounded-lg shadow">
                <h2 className="text-xl font-semibold">{recipe.title}</h2>
                <p className="text-gray-600">
                  Cooking time: {recipe.cookingTime} min
                </p>
                <ul className="text-sm text-left list-disc list-inside my-2 text-gray-700">
                  {recipe.ingredients?.map((ing: string, idx: number) => (
                    <li key={idx}>{ing}</li>
                  ))}
                </ul>
                <div
                  className="prose max-w-none mt-2"
                  dangerouslySetInnerHTML={{ __html: recipe.instructions }}
                />
              </div>
            ))
          ) : (
            <p>No recipes generated yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
