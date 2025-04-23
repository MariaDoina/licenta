import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/db/dbConfig";
import Recipe from "@/models/recipeModel";

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = await context.params;

  await connect();
  const recipe = await Recipe.findById(id);

  if (!recipe) {
    return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
  }

  return NextResponse.json(recipe);
}
