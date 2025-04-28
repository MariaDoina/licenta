import { connect } from "@/db/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import Recipe from "@/models/recipeModel";
import { getDataFromToken } from "@/lib/helpers/getDataFromToken";

connect();

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

    // Validate input
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

    // Find the recipe ID from the request URL
    const { id } = await params;

    // Check if the recipe ID exists
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    // Check if the user is authorized to update the recipe
    if (recipe.userOwner.toString() !== userId) {
      return NextResponse.json(
        { error: "You are not authorized to update this recipe." },
        { status: 403 }
      );
    }

    // Create an object with the fields to update
    const updateData: any = {};
    if (title) updateData.title = title;
    if (ingredients) updateData.ingredients = ingredients;
    if (instructions) updateData.instructions = instructions;
    if (cookingTime) updateData.cookingTime = cookingTime;
    if (imageUrl) updateData.imageUrl = imageUrl;
    if (difficulty) updateData.difficulty = difficulty;
    if (tags) updateData.tags = tags;

    // Update the recipe in the database
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
  } catch (error: any) {
    console.error("Update recipe error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
