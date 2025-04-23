import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/db/dbConfig";
import Recipe from "@/models/recipeModel";

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  await connect();

  const { id } = context.params;

  try {
    const recipe = await Recipe.findById(id);

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    return NextResponse.json(recipe, { status: 200 });
  } catch (err) {
    console.error("Error fetching recipe:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
