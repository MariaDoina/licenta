import { useState } from "react";
import Image from "next/image";
import Button from "@/components/Button";

interface IngredientInputProps {
  ingredientList: string[];
  setIngredientList: React.Dispatch<React.SetStateAction<string[]>>;
}

const IngredientInput: React.FC<IngredientInputProps> = ({
  ingredientList,
  setIngredientList,
}) => {
  const [ingredient, setIngredient] = useState<string>("");

  const handleAddIngredient = () => {
    if (ingredient.trim() !== "") {
      setIngredientList((prev) => [...prev, ingredient.trim()]);
      setIngredient("");
    }
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredientList((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="mb-4">
      <h3 className="text-center mb-2 text-lg font-semibold">Ingredients</h3>
      <div className="flex items-center space-x-3">
        {/* Input for ingredient */}
        <input
          type="text"
          value={ingredient}
          onChange={(e) => setIngredient(e.target.value)}
          placeholder="Enter an ingredient"
          className="w-full p-3 pl-5 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        {/* Button to add ingredient */}
        <Button
          type="button"
          icon="/plus.svg"
          title="Add"
          variant="btn_small_gradient sm: pr-10"
          onClick={handleAddIngredient}
        />
      </div>

      {/* Show ingredients list */}
      {ingredientList.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-3">
          {ingredientList.map((ingredient, index) => (
            <div
              key={index}
              className="flex items-center bg-gray-200 px-4 py-2 rounded-lg"
            >
              <span className="text-sm">{ingredient}</span>
              <button
                onClick={() => handleRemoveIngredient(index)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                <Image src="/close.svg" alt="Remove" width={16} height={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IngredientInput;
