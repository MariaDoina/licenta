import { connect } from "@/db/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import Recipe from "@/models/recipeModel";
import { getDataFromToken } from "@/lib/helpers/getDataFromToken";

connect();

interface RecipeUpdateData {
  title?: string;
  ingredients?: string[];
  instructions?: string;
  cookingTime?: number;
  imageUrl?: string;
  difficulty?: "easy" | "medium" | "hard";
  tags?: string[];
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getDataFromToken(request);

    const body = await request.json();
    console.log("Body received:", body);

    const {
      title,
      ingredients,
      instructions,
      cookingTime,
      imageUrl,
      difficulty,
      tags,
    } = body;

    // Validate input - check if at least one field is provided for update
    if (
      !title &&
      !ingredients &&
      !instructions &&
      !cookingTime &&
      !imageUrl &&
      !difficulty &&
      !tags
    ) {
      return NextResponse.json(
        { error: "Please provide data to update." },
        { status: 400 }
      );
    }

    // Extract recipe ID from params
    const { id } = params;

    // Find the recipe by ID
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    // Check user ownership
    if (recipe.userOwner?.toString() !== userId) {
      return NextResponse.json(
        { error: "You are not authorized to update this recipe." },
        { status: 403 }
      );
    }

    // Build update object using typed interface
    const updateData: RecipeUpdateData = {};
    if (title) updateData.title = title;
    if (ingredients) updateData.ingredients = ingredients;
    if (instructions) updateData.instructions = instructions;
    if (cookingTime) updateData.cookingTime = cookingTime;
    if (imageUrl) updateData.imageUrl = imageUrl;
    if (difficulty) updateData.difficulty = difficulty;
    if (tags) updateData.tags = tags;

    // Update the recipe and return the new document
    const updatedRecipe = await Recipe.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    console.log("Updated recipe:", updatedRecipe);

    if (!updatedRecipe) {
      return NextResponse.json(
        { error: "Failed to update recipe" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Recipe updated successfully",
      data: updatedRecipe,
    });
  } catch (error: unknown) {
    console.error("Update recipe error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
