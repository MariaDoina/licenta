"use client";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Image from "next/image";
import Button from "@/components/Button";
import { motion } from "framer-motion";
import IngredientInput from "@/components/IngredientInput";
import { useLoadingState } from "@/hooks/useLoadingState";

export default function CreateRecipe() {
  const [title, setTitle] = useState("");
  const [ingredientList, setIngredientList] = useState<string[]>([]);
  const [instructions, setInstructions] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const { isLoading, startLoading, stopLoading } = useLoadingState();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    startLoading();
    // Validate inputs
    if (
      !title ||
      ingredientList.length === 0 ||
      !instructions ||
      !cookingTime
    ) {
      toast.error("Please fill all fields");
      stopLoading();
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
      setIngredientList([]);
      setInstructions("");
      setCookingTime("");
    } catch (error: any) {
      toast.error("Error creating recipe. Please try again later.");
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 p-6">
      <div className="max-w-3xl mx-auto p-6 ">
        <div className="text-center mb-10">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
          >
            Recipe Oasis
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Create and save your favorite recipes in one place. Share with
            friends or keep them as your culinary secrets.
          </motion.p>
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

            {/* Ingredient Input Component */}
            <IngredientInput
              ingredientList={ingredientList}
              setIngredientList={setIngredientList}
            />

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
              loading={isLoading}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
