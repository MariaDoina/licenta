import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/db/dbConfig";
import Recipe from "@/models/recipeModel";

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = await context.params;

  try {
    await connect();

    const recipe = await Recipe.findById(id).populate("userOwner", "username");

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    return NextResponse.json(recipe);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
