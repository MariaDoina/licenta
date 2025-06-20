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

interface GetRecipesResponse {
  recipes: Recipe[];
}

const useRecipes = () => {
  const { getRecipes } = useApi();
  const [data, setData] = useState<GetRecipesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getRecipes({});
        setData(response);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to fetch recipes.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

export default useRecipes;
