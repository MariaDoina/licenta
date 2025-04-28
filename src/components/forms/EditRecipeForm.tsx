import { Recipe } from "@/components/RecipeUI/RecipeList";
import Button from "@/components/Button";

interface RecipeFormProps {
  recipe: Recipe;
  isLoading: boolean;
  setRecipe: React.Dispatch<React.SetStateAction<Recipe | null>>;
  handleSaveChanges: (updatedRecipe: Recipe) => Promise<void>;
}

const RecipeForm = ({
  recipe,
  isLoading,
  setRecipe,
  handleSaveChanges,
}: RecipeFormProps) => {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 mb-8">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (recipe) handleSaveChanges(recipe);
        }}
      >
        {/* Recipe Title */}
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-semibold mb-2">
            Recipe Title
          </label>
          <input
            type="text"
            id="title"
            value={recipe.title}
            onChange={(e) => setRecipe({ ...recipe, title: e.target.value })}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        {/* Cooking Time */}
        <div className="mb-4">
          <label
            htmlFor="cookingTime"
            className="block text-sm font-semibold mb-2"
          >
            Cooking Time (minutes)
          </label>
          <input
            type="number"
            id="cookingTime"
            value={recipe.cookingTime}
            onChange={(e) =>
              setRecipe({
                ...recipe,
                cookingTime: Number(e.target.value),
              })
            }
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        {/* Difficulty */}
        <div className="mb-4">
          <label
            htmlFor="difficulty"
            className="block text-sm font-semibold mb-2"
          >
            Difficulty
          </label>
          <select
            id="difficulty"
            value={recipe.difficulty}
            onChange={(e) =>
              setRecipe({
                ...recipe,
                difficulty: e.target.value as "easy" | "medium" | "hard",
              })
            }
            className="w-full p-2 border rounded-md"
            required
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Ingredients */}
        <div className="mb-4">
          <label
            htmlFor="ingredients"
            className="block text-sm font-semibold mb-2"
          >
            Ingredients
          </label>
          <textarea
            id="ingredients"
            value={recipe.ingredients.join("\n")}
            onChange={(e) =>
              setRecipe({
                ...recipe,
                ingredients: e.target.value.split("\n"),
              })
            }
            className="w-full p-2 border rounded-md"
            rows={5}
            required
          />
        </div>

        {/* Instructions */}
        <div className="mb-4">
          <label
            htmlFor="instructions"
            className="block text-sm font-semibold mb-2"
          >
            Instructions
          </label>
          <textarea
            id="instructions"
            value={recipe.instructions}
            onChange={(e) =>
              setRecipe({
                ...recipe,
                instructions: e.target.value,
              })
            }
            className="w-full p-2 border rounded-md"
            rows={5}
            required
          />
        </div>

        {/* Tags */}
        <div className="mb-4">
          <label htmlFor="tags" className="block text-sm font-semibold mb-2">
            Tags (separate by commas)
          </label>
          <input
            type="text"
            id="tags"
            value={recipe.tags.join(", ")}
            onChange={(e) =>
              setRecipe({
                ...recipe,
                tags: e.target.value.split(",").map((tag) => tag.trim()),
              })
            }
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Save Button */}
        <div className="mb-6">
          <Button
            type="submit"
            title={isLoading ? "Saving..." : "Save Changes"}
            variant="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
            loading={isLoading}
          />
        </div>
      </form>
    </div>
  );
};

export default RecipeForm;
