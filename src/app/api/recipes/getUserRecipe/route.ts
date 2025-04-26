import { connect } from "@/db/dbConfig";
import Recipe from "@/models/recipeModel";
import { NextResponse, NextRequest } from "next/server";
import { getDataFromToken } from "@/lib/helpers/getDataFromToken";

connect();

export async function GET(request: NextRequest) {
  try {
    const userId = getDataFromToken(request);

    const recipes = await Recipe.find({ "userOwner._id": userId });

    return NextResponse.json({
      success: true,
      recipes: recipes || [],
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Error verifying token or fetching recipes",
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
