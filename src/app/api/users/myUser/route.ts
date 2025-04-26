import { getDataFromToken } from "@/lib/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/db/dbConfig";

connect();

export async function GET(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    console.log("User ID from token:", userId);

    const user = await User.findById(userId)
      .select("-password -isAdmin")
      .populate({ path: "recipes", model: "recipes", select: "-__v" })
      .exec();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "User data fetched successfully",
      data: user,
    });
  } catch (error: any) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
