"use client";
import Button from "@/components/Button";
import { motion } from "framer-motion";
import React, { useState } from "react";
import IngredientInput from "@/components/IngredientInput";
import { useLoadingState } from "@/hooks/useLoadingState";
import axios from "axios";

export default function GenerateRecipePage() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);
  const { isLoading, startLoading, stopLoading } = useLoadingState();
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    // Începe încărcarea

    startLoading();
    setError(null);

    try {
      // Trimite cererea pentru a genera rețeta
      const response = await axios.post("/api/recipes/generateRecipe", {
        ingredients,
      });

      // Verifică răspunsul API-ului
      console.log("Response Data:", response.data);

      const data = response.data;

      // Verifică dacă există rețeta generată
      if (!data || !data.recipe) {
        throw new Error("No recipe found");
      }

      // Actualizează starea cu rețeta
      setRecipes((prev) => {
        console.log("Previous Recipes:", prev); // Logăm rețetele anterioare
        const updatedRecipes = [...prev, data.recipe];
        console.log("Updated Recipes:", updatedRecipes); // Logăm noile rețete
        return updatedRecipes;
      });
    } catch (err: any) {
      setError(err.message);
      console.error("Error:", err.message); // Logăm eroarea
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

        {/* Ingredient Input Component */}
        <IngredientInput
          ingredientList={ingredients}
          setIngredientList={setIngredients}
        />

        {/* Butonul pentru generarea rețetei */}
        <Button
          type="button"
          title={isLoading ? "Generating..." : "Generate Recipe"}
          onClick={handleGenerate}
          variant="btn_small_gradient mx-auto block"
          loading={isLoading}
        />

        {/* Mesaj de eroare */}
        {error && <p className="text-red-600 mt-4">Error: {error}</p>}

        {/* Afișarea rețetelor generate */}
        <div className="mt-6 space-y-6">
          {recipes.length > 0 ? (
            recipes.map((recipe, index) => (
              <div key={index} className="border p-4 rounded-lg shadow">
                <h2 className="text-xl font-semibold">{recipe.title}</h2>
                <p className="text-gray-600">
                  Cooking time: {recipe.cookingTime} min
                </p>
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
