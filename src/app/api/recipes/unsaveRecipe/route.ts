import { connect } from "@/db/dbConfig";
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

    const userId = decodedToken.id;

    const { recipeId } = await request.json();

    if (!recipeId) {
      return NextResponse.json(
        { error: "Recipe ID is required" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Scoate recipeId din savedRecipes (dacă există)
    user.savedRecipes = user.savedRecipes.filter(
      (id: string) => id.toString() !== recipeId
    );

    await user.save();

    return NextResponse.json({
      success: true,
      savedRecipes: user.savedRecipes,
    });
  } catch (error: unknown) {
    console.error("API ERROR:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
