import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import Recipe from "@/models/recipeModel";
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

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.profileImageUrl) {
      try {
        await deleteImageFromCloudinary(user.profileImageUrl);
      } catch (err) {
        console.error("Error deleting profile image from Cloudinary:", err);
      }
    }

    const recipes = await Recipe.find({ userOwner: user._id });

    for (const recipe of recipes) {
      if (recipe.imageUrl) {
        try {
          await deleteImageFromCloudinary(recipe.imageUrl);
        } catch (imgError: unknown) {
          console.error(
            `Failed to delete image for recipe ${recipe._id}:`,
            imgError
          );
        }
      }
    }

    await Recipe.deleteMany({ userOwner: user._id });

    await user.deleteOne();

    return NextResponse.json({
      message: "User and their recipes deleted successfully",
    });
  } catch (error: unknown) {
    console.error("Error deleting user:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
