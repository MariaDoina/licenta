"use client";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Image from "next/image";
import Button from "@/components/Button";
import { motion } from "framer-motion";
import { useLoadingState } from "@/lib/hooks/useLoadingState";

export default function CreateRecipe() {
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [ingredientList, setIngredientList] = useState<string[]>([]);
  const [instructions, setInstructions] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "easy"
  );
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const { isLoading, startLoading, stopLoading } = useLoadingState();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    startLoading();

    // Validate inputs
    if (
      !title ||
      ingredientList.length === 0 ||
      !instructions ||
      !cookingTime ||
      !imageFile
    ) {
      toast.error("Please fill all fields");
      stopLoading();
      return;
    }

    const cookingTimeNumber = parseInt(cookingTime);
    if (isNaN(cookingTimeNumber)) {
      toast.error("Cooking time must be a number");
      stopLoading();
      return;
    }

    try {
      // Send photo to backend
      const formData = new FormData();
      formData.append("image", imageFile);

      const imageUploadResponnse = await axios.post(
        "/api/recipes/uploadImage",
        formData
      );
      const imageUrl = imageUploadResponnse.data.imageUrl;

      // Send rest of the recipe data to backend
      await axios.post("/api/recipes/createRecipe", {
        title,
        ingredients: ingredientList,
        instructions,
        cookingTime: cookingTimeNumber,
        imageUrl,
        difficulty,
        tags,
      });

      toast.success("Recipe created successfully!");

      // Reset form after success
      setTitle("");
      setIngredients("");
      setIngredientList([]);
      setInstructions("");
      setCookingTime("");
      setImageFile(null);
      setTags([]); // Reset tags
      setNewTag(""); // Reset new tag input
    } catch (error: any) {
      toast.error("Error creating recipe. Please try again later.");
    } finally {
      stopLoading();
    }
  };

  const handleAddIngredient = () => {
    if (ingredients.trim() !== "") {
      setIngredientList((prev) => [...prev, ingredients.trim()]);
      setIngredients("");
    }
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredientList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() !== "" && !tags.includes(newTag.trim())) {
      setTags((prev) => [...prev, newTag.trim()]);
      setNewTag("");
    } else {
      toast.error("Please enter a valid tag or tag already added.");
    }
  };

  const handleRemoveTag = (index: number) => {
    setTags((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 p-6">
      <div className="max-w-3xl mx-auto p-6 ">
        <div className="max-w-7xl mx-auto">
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
                  icon="/plus.svg"
                  title="Add"
                  variant="btn_small_gradient sm: pr-10"
                  onClick={handleAddIngredient}
                />
              </div>
            </div>
            {/* Display Added Ingredients */} {/* Display Added Ingredients */}
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
            {/* Difficulty Selector */}
            <div className="mb-4">
              <h3 className="text-center mb-2">Difficulty Level</h3>
              <div className="flex justify-center space-x-4">
                <button
                  type="button"
                  onClick={() => setDifficulty("easy")}
                  className={`p-3 w-24 text-center rounded-lg ${
                    difficulty === "easy"
                      ? "bg-green-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  Easy
                </button>
                <button
                  type="button"
                  onClick={() => setDifficulty("medium")}
                  className={`p-3 w-24 text-center rounded-lg ${
                    difficulty === "medium"
                      ? "bg-yellow-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  Medium
                </button>
                <button
                  type="button"
                  onClick={() => setDifficulty("hard")}
                  className={`p-3 w-24 text-center rounded-lg ${
                    difficulty === "hard"
                      ? "bg-red-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  Hard
                </button>
              </div>
            </div>
            {/* Tags Field */}
            <div className="mb-4">
              <h3 className="text-center mb-2">Tags</h3>
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Enter a tag"
                  className="w-full p-3 pl-5 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <Button
                  type="button"
                  icon="/plus.svg"
                  title="Add Tag"
                  variant="btn_small_gradient sm: pr-10"
                  onClick={handleAddTag}
                />
              </div>
            </div>
            {/* Display Added Tags */}
            {tags.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-gray-200 px-4 py-2 rounded-lg"
                  >
                    <span className="text-sm">{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(index)}
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
            {/* Insert Image field */}
            <div className="mb-4">
              <h3 className="text-center mb-2">Upload Recipe Image</h3>
              <input
                type="file"
                accept="image/*"
                className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                onChange={handleImageChange}
              />
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
