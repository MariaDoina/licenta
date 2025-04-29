import { NextRequest, NextResponse } from "next/server";
import Recipe from "@/models/recipeModel";
import User from "@/models/userModel";
import { getDataFromToken } from "@/lib/helpers/getDataFromToken";
import { connect } from "@/db/dbConfig";

connect();

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const requesterId = await getDataFromToken(req);
    const adminUser = await User.findById(requesterId);

    if (!adminUser || !adminUser.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const recipe = await Recipe.findByIdAndDelete(params.id);
    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    console.log("Recipe ID param:", params.id);

    await User.findByIdAndUpdate(recipe.userOwner, {
      $pull: { recipes: recipe._id },
    });

    return NextResponse.json({ message: "Recipe deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting recipe:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
