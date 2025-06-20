import { NextRequest, NextResponse } from "next/server";
import Recipe from "@/models/recipeModel";
import User from "@/models/userModel";
import { getDataFromToken } from "@/lib/helpers/getDataFromToken";
import { connect } from "@/db/dbConfig";
import { deleteImageFromCloudinary } from "@/lib/deleteImage";

connect();

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    const requesterId = await getDataFromToken(req);
    const adminUser = await User.findById(requesterId);

    if (!adminUser || !adminUser.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const recipe = await Recipe.findByIdAndDelete(id);
    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    if (recipe.imageUrl) {
      try {
        await deleteImageFromCloudinary(recipe.imageUrl);
      } catch (imgError: unknown) {
        console.error("Error deleting image from Cloudinary:", imgError);
      }
    }

    await User.findByIdAndUpdate(recipe.userOwner, {
      $pull: { recipes: recipe._id },
    });

    return NextResponse.json({ message: "Recipe deleted successfully" });
  } catch (error: unknown) {
    console.error("Error deleting recipe:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
