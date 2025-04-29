import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import Recipe from "@/models/recipeModel";
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

    const user = await User.findById(params.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await Recipe.deleteMany({ userOwner: user._id });
    await user.deleteOne();

    return NextResponse.json({
      message: "User and their recipes deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
