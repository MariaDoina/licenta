"use client";
import { useParams, useRouter } from "next/navigation";
import { useApi } from "@/lib/helpers/ApiRequests";
import useRecipe from "@/lib/hooks/useRecipe";
import Button from "@/components/Button";
import Image from "next/image";

const RecipeDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { recipe, loading, error } = useRecipe(id as string);
  const { saveRecipe } = useApi();

  const handleSaveRecipe = async () => {
    try {
      await saveRecipe(id as string);
    } catch (error) {
      console.error("Eroare la salvarea rețetei:", error);
    }
  };

  const token =
    typeof window !== "undefined"
      ? document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1]
      : null;

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-blue-100">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );

  if (error || !recipe)
    return <div className="p-10 text-center text-red-600">{error}</div>;

  const {
    title,
    imageUrl,
    ingredients,
    instructions,
    cookingTime,
    difficulty,
    tags = [],
    userOwner,
    isGenerated,
    createdAt,
  } = recipe;

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-green-100 to-blue-100">
      {/* Top navigation buttons */}
      <div className="max-w-4xl mx-auto flex justify-between items-center mb-6">
        <Button
          type="button"
          title="Back to Recipes"
          icon="/arrow-left.svg"
          variant="btn_white_recipe"
          onClick={() => router.push("/create_recipe")}
        />

        {/* {isOwner && (
          <Button
            type="button"
            title="Edit Recipe"
            variant="btn_white_text"
            onClick={() => router.push(`/edit_recipe/${id}`)}
          />
        )} */}
      </div>

      {/* Recipe Card */}
      <div className="relative max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Recipe Image and Difficulty Badge */}
        {imageUrl && (
          <div className="relative">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-[300px] object-cover rounded-t-lg"
            />
            {difficulty && (
              <span className="absolute top-4 right-4 bg-gray-50 text-md text-gray-700 font-medium capitalize px-3 py-1 rounded-full border-none shadow">
                {difficulty}
              </span>
            )}
            <div className="absolute bottom-4 left-4 text-white text-4xl font-bold drop-shadow-lg">
              {title}
            </div>
          </div>
        )}

        <div className="p-6 bg-white">
          {/* Time, Author, Date */}
          <div className="flex flex-col items-start gap-4 mb-8">
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
              {cookingTime && (
                <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full">
                  <Image
                    src="/clock.svg"
                    alt="Clock icon"
                    width={20}
                    height={20}
                  />
                  <span>{cookingTime} mins</span>
                </div>
              )}
              <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                <Image src="/chef.svg" alt="Chef icon" width={20} height={20} />
                <span>By {userOwner?.username || "Unknown chef"}</span>
              </div>
              {createdAt && (
                <div className="flex items-center gap-2 bg-gray-100 text-gray-800 px-3 py-1 rounded-full">
                  <Image
                    src="/calendar.svg"
                    alt="Calendar icon"
                    width={20}
                    height={20}
                  />
                  <span>{new Date(createdAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-200 text-gray-700 text-md px-3 py-1 rounded-full flex items-center gap-2"
                  >
                    <Image
                      src="/label.svg"
                      alt="Tag icon"
                      width={20}
                      height={20}
                    />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* AI Generated Badge */}
          {isGenerated && (
            <div className="text-left mb-8">
              <span className="bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full">
                🤖 AI Generated
              </span>
            </div>
          )}

          {/* Ingredients and Instructions */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 w-full mx-auto">
            {/* Ingredients */}
            <div className="md:col-span-2">
              <h2 className="text-2xl font-semibold mb-3">Ingredients</h2>
              <ul className="list-disc list-inside marker:text-green-600 space-y-2 text-gray-700">
                {ingredients?.map((ingredient, idx) => (
                  <li key={idx}>{ingredient}</li>
                ))}
              </ul>
            </div>

            {/* Instructions */}
            <div className="md:col-span-3">
              <h2 className="text-2xl font-semibold mb-3">Instructions</h2>
              <p className="leading-relaxed text-gray-700">
                {instructions || "No instructions provided."}
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-start mt-4 mb-8 ml-7">
          <Button
            type="button"
            title="Save Recipe"
            icon="/bookmark.svg"
            variant="btn_small_gradient"
            onClick={handleSaveRecipe}
          />
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailPage;
