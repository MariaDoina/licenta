import { connect } from "@/db/dbConfig";
import Recipe from "@/models/recipeModel";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/helpers/verifyToken";

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
    const { title, ingredients, instructions, cookingTime } = reqBody;

    const newRecipe = new Recipe({
      title,
      ingredients,
      instructions,
      cookingTime,
      userOwner: id,
      createdAt: new Date(),
      isGenerated: false,
    });

    const savedRecipe = await newRecipe.save();
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
