import { useEffect, useState } from "react";
import { useApi } from "../helpers/ApiRequests";

interface Recipe {
  _id: string;
  title: string;
  imageUrl: string;
  cookingTime: number;
  difficulty: string;
  tags: string[];
}

const useRecipes = () => {
  const { getRecipes } = useApi();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getRecipes();
        setRecipes(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch recipes.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { recipes, loading, error };
};

export default useRecipes;
