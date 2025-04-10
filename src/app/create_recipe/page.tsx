"use client";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Image from "next/image";
import Button from "@/components/Button";

export default function CreateRecipe() {
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [ingredientList, setIngredientList] = useState<string[]>([]);
  const [instructions, setInstructions] = useState("");
  const [cookingTime, setCookingTime] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs
    if (
      !title ||
      ingredientList.length === 0 ||
      !instructions ||
      !cookingTime
    ) {
      toast.error("Please fill all fields");
      return;
    }

    const cookingTimeNumber = parseInt(cookingTime);
    if (isNaN(cookingTimeNumber)) {
      toast.error("Cooking time must be a number");
      return;
    }

    try {
      await axios.post("/api/recipes/createRecipe", {
        title,
        ingredients: ingredientList,
        instructions,
        cookingTime: cookingTimeNumber,
      });

      toast.success("Recipe created successfully!");

      // Reset form after success
      setTitle("");
      setIngredients("");
      setIngredientList([]);
      setInstructions("");
      setCookingTime("");
    } catch (error: any) {
      toast.error("Error creating recipe. Please try again later.");
    }
  };

  const handleAddIngredient = () => {
    if (ingredients.trim() !== "") {
      setIngredientList((prev) => [...prev, ingredients.trim()]);
      setIngredients(""); // Curățăm câmpul de input
    }
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredientList((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Recipe Oasis
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create and save your favorite recipes in one place. Share with
            friends or keep them as your culinary secrets.
          </p>
        </div>
      </div>
      <div className="bg-gray-50 mb-10 p-8 rounded-lg shadow-xl">
        <div className="flex items-center justify-center mb-6">
          <Image
            src="/chef_hat_heart.svg"
            alt="chef-hat"
            width={25}
            height={25}
          />
          <h2 className="text-2xl font-bold text-gray-800 pl-2">
            Create New Recipe
          </h2>
        </div>
        <form onSubmit={handleSubmit}>
          {/* Title Field */}
          <div className="mb-5">
            <h3 className="text-center mb-2">Recipe Title</h3>
            <div className="relative">
              <Image
                src="/fork-knife.svg"
                alt="fork-knife-icon"
                width={20}
                height={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
              />
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Grandma's Famous Apple Pie"
                className="w-full p-3 pl-10 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>

          {/* Ingredients Field */}
          <div className="mb-4">
            <h3 className="text-center mb-2">Ingredients</h3>
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder="Enter an ingredient"
                className="w-full p-3 pl-5 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <Button
                type="button"
                icon="plus.svg"
                title="Add"
                variant="btn_small_gradient p-3 pr-6 sm: pr-10"
                onClick={handleAddIngredient}
              />
            </div>
          </div>

          {/* Display Added Ingredients */}
          {ingredientList.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {ingredientList.map((ingredient, index) => (
                <div
                  key={index}
                  className="flex items-center bg-gray-200 px-4 py-2 rounded-lg"
                >
                  <span className="text-sm">{ingredient}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(index)}
                    className="ml-2 text-red-500 hover:text-red-700 cursor-pointer"
                  >
                    <Image
                      src="/close.svg"
                      alt="close-icon"
                      width={16}
                      height={16}
                    />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Instructions Field */}
          <div className="mb-4">
            <h3 className="text-center mb-2">Cooking Instructions</h3>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Describe the preparation and cooking steps in detail.."
              className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              rows={5}
            />
          </div>

          {/* Cooking Time Field */}
          <div className="mb-4">
            <h3 className="text-center mb-2">Cooking Time (minutes)</h3>
            <div className="relative flex items-center space-x-3">
              <Image
                src="/clock.svg"
                alt="clock-icon"
                width={20}
                height={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
              />
              <input
                type="number"
                value={cookingTime}
                onChange={(e) => setCookingTime(e.target.value)}
                placeholder="e.g. 45"
                className="w-full p-3 pl-10 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            title="Create Recipe"
            variant="btn_small_gradient mx-auto block"
          />
        </form>
      </div>
    </div>
  );
}
