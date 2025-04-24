import { connect } from "@/db/dbConfig";
import Recipe from "@/models/recipeModel";
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
    console.log("Request body:", reqBody);

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

    console.log("Saving recipe with image:", {
      title,
      ingredients,
      instructions,
      cookingTime,
      imageUrl,
      difficulty,
      tags,
    });

    const savedRecipe = await newRecipe.save();
    console.log("Recipe saved:", savedRecipe);
    console.log("Recipe that was saved: ", savedRecipe);

    return NextResponse.json({
      message: "Recipe created successfully",
      success: true,
      savedRecipe,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
