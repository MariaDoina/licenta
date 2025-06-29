import Link from "next/link";

export interface Recipe {
  _id: string;
  title: string;
  imageUrl: string;
  cookingTime: number;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
  ingredients: string[];
  instructions: string;
}

interface Props {
  recipes: Recipe[];
}

const RecipeList = ({ recipes }: Props) => {
  if (recipes.length === 0) {
    return (
      <p className="text-center text-gray-500 mb-10 text-lg">
        No recipes available yet.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-15">
      {recipes.map((recipe) => (
        <Link key={recipe._id} href={`/create_recipe/${recipe._id}`}>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:scale-[1.03] transition-transform duration-300">
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
                  <span className="text-lg">{recipe.cookingTime} min</span>{" "}
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
          </div>
        </Link>
      ))}
    </div>
  );
};

export default RecipeList;
