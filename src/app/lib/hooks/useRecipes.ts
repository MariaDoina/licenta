import { useEffect, useState } from "react";
import axios from "axios";

interface Recipe {
  _id: string;
  title: string;
  imageUrl: string;
}

const useRecipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get("/api/recipes/getRecipes");
        console.log("See what the response is ", response.data);
        setRecipes(response.data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch recipes.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  return { recipes, loading, error };
};

export default useRecipes;
