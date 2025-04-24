import { useState } from "react";

export const useRecipeForm = () => {
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

  const handleAddIngredient = () => {
    if (ingredients.trim() !== "") {
      setIngredientList((prev) => [...prev, ingredients.trim()]);
      setIngredients("");
    }
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredientList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddTag = () => {
    if (newTag.trim() !== "" && !tags.includes(newTag.trim())) {
      setTags((prev) => [...prev, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (index: number) => {
    setTags((prev) => prev.filter((_, i) => i !== index));
  };

  return {
    title,
    setTitle,
    ingredients,
    setIngredients,
    ingredientList,
    setIngredientList,
    instructions,
    setInstructions,
    cookingTime,
    setCookingTime,
    imageFile,
    setImageFile,
    difficulty,
    setDifficulty,
    tags,
    setTags,
    newTag,
    setNewTag,
    handleAddIngredient,
    handleRemoveIngredient,
    handleAddTag,
    handleRemoveTag,
  };
};
