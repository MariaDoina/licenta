import { useState, useEffect } from "react";

// Custom Hook pentru gestionarea filtrelor cu debounce
const useSearch = (delay: number) => {
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [tags, setTags] = useState("");

  const [debouncedTitle, setDebouncedTitle] = useState(title);
  const [debouncedIngredients, setDebouncedIngredients] = useState(ingredients);
  const [debouncedTags, setDebouncedTags] = useState(tags);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTitle(title);
    }, delay);

    return () => clearTimeout(handler);
  }, [title, delay]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedIngredients(ingredients);
    }, delay);

    return () => clearTimeout(handler);
  }, [ingredients, delay]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTags(tags);
    }, delay);

    return () => clearTimeout(handler);
  }, [tags, delay]);

  return {
    title,
    setTitle,
    ingredients,
    setIngredients,
    tags,
    setTags,
    debouncedTitle,
    debouncedIngredients,
    debouncedTags,
  };
};

export default useSearch;
