import { connect } from "@/db/dbConfig";
import Recipe from "@/models/recipeModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ingredientsParam = searchParams.get("ingredients");
    const tagsParam = searchParams.get("tags");
    const titleParam = searchParams.get("title");

    const query: any = {};

    // Filtering by ingredients
    if (ingredientsParam) {
      const ingredientsArray = ingredientsParam
        .split(",")
        .map((i) => i.trim().toLowerCase());
      query.ingredients = {
        $all: ingredientsArray.map(
          (ingredient) =>
            new RegExp(ingredient.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i")
        ),
      };
    }

    // Filtering by tags
    if (tagsParam) {
      const tagsArray = tagsParam.split(",").map((t) => t.trim().toLowerCase());

      query.$and = tagsArray.map((tag: string) => ({
        tags: {
          $regex: new RegExp(tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"),
        },
      }));
    }

    // Filtering by title
    if (titleParam) {
      query.title = {
        $regex: new RegExp(
          titleParam.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
          "i"
        ),
      };
    }

    const recipes = await Recipe.find(
      query,
      "title imageUrl cookingTime difficulty tags"
    ).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      recipes,
    });
  } catch (error: unknown) {
    console.error("Error searching recipes:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
