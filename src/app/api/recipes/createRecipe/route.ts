import { connect } from "@/db/dbConfig";
import Recipe from "@/models/recipeModel";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

connect();

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "User not authenticated" },
        { status: 401 }
      );
    }

    //Check if the token is valid
    const decodedToken = jwt.verify(
      token,
      process.env.TOKEN_SECRET!
    ) as jwt.JwtPayload;

    const reqBody = await request.json();
    const { title, ingredients, instructions, cookingTime } = reqBody;

    //Save recipe to MongoDB
    const newRecipe = new Recipe({
      title,
      ingredients,
      instructions,
      cookingTime,
      userOwner: decodedToken.id,
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

    console.log(reqBody);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
