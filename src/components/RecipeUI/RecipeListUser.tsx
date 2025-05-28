import { Recipe } from "@/components/RecipeUI/RecipeList";
import Button from "@/components/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Props {
  recipes: Recipe[];
  showUnsaveButton?: boolean;
  onUnsave?: (recipeId: string) => void;
  showEditButton?: boolean; // opțional, default true
}

const RecipeListUser = ({
  recipes,
  showUnsaveButton = false,
  onUnsave,
  showEditButton = true,
}: Props) => {
  const router = useRouter();

  if (recipes.length === 0) {
    return (
      <p className="text-center text-gray-500 mb-10 text-lg">
        You have no recipes yet.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-15">
      {recipes.map((recipe) => (
        <div
          key={recipe._id}
          className="relative bg-white rounded-2xl shadow-lg overflow-hidden hover:scale-[1.03] transition-transform duration-300"
        >
          {/* Buton de Unsave (colț dreapta sus) */}
          {showUnsaveButton && onUnsave && (
            <div className="absolute top-2 right-2 z-10">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onUnsave(recipe._id);
                }}
                className="text-red-500 bg-white border border-red-300 rounded-full px-3 py-1 text-sm shadow-sm hover:bg-red-100 transition"
              >
                Unsave
              </button>
            </div>
          )}

          {/* Wrap the whole card in a Link */}
          <Link href={`/create_recipe/${recipe._id}`} className="block">
            {recipe.imageUrl ? (
              <img
                src={recipe.imageUrl}
                alt={recipe.title}
                className="w-full h-56 object-cover"
              />
            ) : (
              <div className="w-full h-56 bg-gray-200 flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}

            {/* Recipe title */}
            <div className="p-6 space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 text-center">
                {recipe.title}
              </h3>

              {/* Time and difficulty */}
              <div className="flex justify-center items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <img src="/clock.svg" alt="clock" className="w-5 h-5" />
                  <span className="text-lg">{recipe.cookingTime} min</span>
                </div>
                <span className="border-l h-5 border-gray-300"></span>
                <span className="text-indigo-600 font-medium capitalize text-lg">
                  {recipe.difficulty}
                </span>
              </div>

              {/* Recipe tags */}
              {recipe.tags && recipe.tags.length > 0 && (
                <div className="flex flex-wrap justify-center gap-3 mt-3 capitalize">
                  {recipe.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="text-sm bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Link>

          {/* Edit Button - afișat doar dacă e permis */}
          {showEditButton && (
            <div className="p-4 bg-gray-100 flex justify-center">
              <Button
                type="button"
                title="Edit Recipe"
                variant="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600"
                onClick={() => router.push(`/edit_recipe/${recipe._id}`)}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default RecipeListUser;
