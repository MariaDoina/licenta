import { connect } from "@/db/dbConfig";
import Recipe from "@/models/recipeModel";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/helpers/verifyToken";

connect();

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    const decodedToken = verifyToken(token);

    if (!decodedToken) {
      return NextResponse.json(
        { message: "User not authenticated" },
        { status: 401 }
      );
    }

    const { id } = decodedToken;

    const reqBody = await request.json();
    const {
      title,
      ingredients,
      instructions,
      cookingTime,
      imageUrl,
      isGenerated = false,
      difficulty,
      tags = [],
    } = reqBody;
    // console.log("Request body:", reqBody);

    //Check if recipe already exists
    const existingRecipe = await Recipe.findOne({ title });
    if (existingRecipe) {
      return NextResponse.json(
        { error: "A recipe with this title already exists." },
        { status: 400 }
      );
    }

    // validate image just for recipes created by users
    if (!imageUrl && !isGenerated) {
      return NextResponse.json(
        { error: "Image is required for user-created recipes." },
        { status: 400 }
      );
    }

    //validate dificulty to be only one of the following: easy, medium, hard
    if (!["easy", "medium", "hard"].includes(difficulty)) {
      return NextResponse.json(
        {
          error:
            "Invalid difficulty level. Please select 'easy', 'medium', or 'hard'.",
        },
        { status: 400 }
      );
    }

    const newRecipe = new Recipe({
      title,
      ingredients,
      instructions,
      cookingTime,
      userOwner: id,
      createdAt: new Date(),
      isGenerated,
      imageUrl,
      difficulty,
      tags,
    });

    // console.log("Saving recipe with image:", {
    //   title,
    //   ingredients,
    //   instructions,
    //   cookingTime,
    //   imageUrl,
    //   difficulty,
    //   tags,
    // });

    const savedRecipe = await newRecipe.save();
    console.log("Recipe saved:", savedRecipe);

    //Add the recipe to the user
    await User.findByIdAndUpdate(id, {
      $push: { recipes: savedRecipe._id },
    });

    // console.log(`Recipe ID ${savedRecipe._id} added to user ${id}`);

    return NextResponse.json({
      message: "Recipe created and linked to user successfully",
      success: true,
      savedRecipe,
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
