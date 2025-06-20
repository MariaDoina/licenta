import { useEffect, useState } from "react";
import { useApi } from "@/lib/helpers/ApiRequests";

export interface Recipe {
  _id: string;
  title: string;
  imageUrl?: string;
  instructions?: string;
  ingredients?: string[];
  cookingTime?: number;
  difficulty?: "easy" | "medium" | "hard";
  tags?: string[];
  userOwner?: {
    _id: string;
    username: string;
    email?: string;
  };
  isGenerated?: boolean;
  createdAt?: string;
}

const useRecipe = (id: string) => {
  const { getRecipeById } = useApi();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await getRecipeById(id);
        setRecipe(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to fetch recipe.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchRecipe();
  }, [id]);

  return { recipe, loading, error };
};

export default useRecipe;
