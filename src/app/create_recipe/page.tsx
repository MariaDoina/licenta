"use client";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function CreateRecipe() {
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [cookingTime, setCookingTime] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    //check is all fields are filled
    if (!title || !ingredients || !instructions || !cookingTime) {
      toast.error("Please fill all fields");
      return;
    }

    const ingredientList = ingredients
      .split(",")
      .map((ingredient) => ingredient.trim());

    const cookingTimeNumber = parseInt(cookingTime);
    if (isNaN(cookingTimeNumber)) {
      toast.error("Cooking time must be a number");
      return;
    }

    try {
      const response = await axios.post("/api/recipes/createRecipe", {
        title,
        ingredients: ingredientList,
        instructions,
        cookingTime: cookingTimeNumber,
      });

      toast.success("Recipe created successfully!");
    } catch (error: any) {
      console.log("Couldn't create recipe", error.message);
      toast.error("Error creating recipe. Please try again later.");
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Title</label>
        <input
          type="text"
          placeholder="Recipe title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <label>Ingredients</label>
        <input
          type="text"
          placeholder="Ingredients (separate with commas)"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
        />
      </div>

      <div>
        <label>Instructions</label>
        <textarea
          placeholder="Cooking instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
        />
      </div>

      <div>
        <label>Cooking Time (in minutes)</label>
        <input
          type="number"
          placeholder="Cooking time"
          value={cookingTime}
          onChange={(e) => setCookingTime(e.target.value)}
        />
      </div>

      <button type="submit">Create Recipe</button>
    </form>
  );
}
//TODO verifica sa nu poata adauga userii de mai multe ori aceeasi reteta
