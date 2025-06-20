import { getDataFromToken } from "@/lib/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import Recipe from "@/models/recipeModel";
import { connect } from "@/db/dbConfig";

connect();

export async function GET(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    const user = await User.findById(userId);

    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { error: "You are not authorized to access this resource" },
        { status: 403 }
      );
    }

    //If user is admin, fetch all users and recipes
    const allUsers = await User.find().select("-password");
    const allRecipes = await Recipe.find();

    return NextResponse.json({
      message: "Data fetched successfully",
      users: allUsers,
      recipes: allRecipes,
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
