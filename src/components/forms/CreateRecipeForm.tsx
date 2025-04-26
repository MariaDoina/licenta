import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Image from "next/image";
import Button from "@/components/Button";
import AddItem from "@/components/RecipeUI/AddItem";

import { useLoadingState } from "@/lib/hooks/useLoadingState";

export default function CreateRecipeForm() {
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
    <form onSubmit={handleSubmit}>
      <div className="bg-gray-50 mb-10 p-8 rounded-lg shadow-xl">
        {/* Title Field */}
        <div className="mb-5 ">
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

        {/* Ingredients Field */}
        <AddItem
          label="Ingredient"
          itemList={ingredientList}
          onAdd={(item) => setIngredientList((prev) => [...prev, item])}
          onRemove={(index) =>
            setIngredientList((prev) => prev.filter((_, i) => i !== index))
          }
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
                difficulty === "hard" ? "bg-red-500 text-white" : "bg-gray-200"
              }`}
            >
              Hard
            </button>
          </div>
        </div>
        {/* Tags Field */}
        <AddItem
          label="Tag"
          itemList={ingredientList}
          onAdd={(item) => setIngredientList((prev) => [...prev, item])}
          onRemove={(index) =>
            setIngredientList((prev) => prev.filter((_, i) => i !== index))
          }
        />

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
      </div>
    </form>
  );
}
