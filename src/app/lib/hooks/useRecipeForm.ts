import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useLoadingState } from "@/app/lib/hooks/useLoadingState";

export function useRecipeForm(onSuccess?: () => void) {
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [ingredientList, setIngredientList] = useState<string[]>([]);
  const [instructions, setInstructions] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const { isLoading, startLoading, stopLoading } = useLoadingState();

  const handleAddIngredient = () => {
    if (ingredients.trim() !== "") {
      setIngredientList((prev) => [...prev, ingredients.trim()]);
      setIngredients("");
    }
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredientList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      startLoading();
      await axios.post("/api/recipes/createRecipe", {
        title,
        ingredients: ingredientList,
        instructions,
        cookingTime: cookingTimeNumber,
      });
      toast.success("Recipe created successfully!");
      resetForm();
      onSuccess?.();
    } catch (error) {
      toast.error("Error creating recipe. Please try again later.");
    } finally {
      stopLoading();
    }
  };

  const resetForm = () => {
    setTitle("");
    setIngredients("");
    setIngredientList([]);
    setInstructions("");
    setCookingTime("");
  };

  return {
    title,
    setTitle,
    ingredients,
    setIngredients,
    ingredientList,
    handleAddIngredient,
    handleRemoveIngredient,
    instructions,
    setInstructions,
    cookingTime,
    setCookingTime,
    handleSubmit,
    isLoading,
  };
}
