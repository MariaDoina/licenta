import { connect } from "@/db/dbConfig";
import Recipe from "@/models/recipeModel";
import { NextResponse } from "next/server";

connect();

export async function GET() {
  try {
    const recipes = await Recipe.find({}, "title imageUrl createdAt").sort({
      createdAt: -1,
    });

    return NextResponse.json(recipes);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch recipes." },
      { status: 500 }
    );
  }
}
