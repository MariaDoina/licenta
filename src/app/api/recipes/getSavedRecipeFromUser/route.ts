import { connect } from "@/db/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/helpers/verifyToken";

connect();

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "User not authenticated" },
        { status: 401 }
      );
    }

    const decodedToken = verifyToken(token);
    if (!decodedToken || !decodedToken.id) {
      return NextResponse.json(
        { message: "User not authenticated" },
        { status: 401 }
      );
    }

    const userId = decodedToken.id;

    // Căutăm userul și populăm savedRecipes
    const user = await User.findById(userId).populate({
      path: "savedRecipes",
      select: "title imageUrl cookingTime difficulty tags",
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      savedRecipes: user.savedRecipes,
    });
  } catch (error: any) {
    console.error("Error fetching saved recipes:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
