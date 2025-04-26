import Link from "next/link";

export interface Recipe {
  _id: string;
  title: string;
  imageUrl: string;
  cookingTime: number;
  difficulty: string;
  tags: string[];
}

interface Props {
  recipes: Recipe[];
}

const RecipeList = ({ recipes }: Props) => {
  if (recipes.length === 0) {
    return (
      <p className="text-center text-gray-500 mb-10">
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
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}
            <div className="p-4 space-y-2">
              <h3 className="text-lg font-semibold text-gray-800 text-center">
                {recipe.title}
              </h3>

              <div className="flex justify-center items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <img src="/clock.svg" alt="clock" className="w-4 h-4" />
                  <span>{recipe.cookingTime} min</span>
                </div>
                <span className="border-l h-4 border-gray-300"></span>
                <span className="text-indigo-600 font-medium capitalize">
                  {recipe.difficulty}
                </span>
              </div>

              {recipe.tags && recipe.tags.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                  {recipe.tags.map((tag, index) => (
                    <span
                      key={tag}
                      className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full"
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
