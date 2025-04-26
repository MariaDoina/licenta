import { connect } from "@/db/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { getDataFromToken } from "@/lib/helpers/getDataFromToken";

connect();

export async function PUT(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    const body = await request.json();
    console.log("Body received:", body);

    const { username, about, specialties, profileImage } = body;

    // Validate input
    if (!username && !about && !specialties && !profileImage) {
      return NextResponse.json(
        { error: "Please provide data to update." },
        { status: 400 }
      );
    }

    // Check if username is available
    if (username) {
      const existingUser = await User.findOne({ username });
      if (existingUser && existingUser._id.toString() !== userId) {
        return NextResponse.json(
          { error: "Username is already taken." },
          { status: 400 }
        );
      }
    }

    // Prepare update object
    const updateData: any = {};
    if (username) updateData.username = username;
    if (about) updateData.about = about;
    if (specialties) updateData.specialties = specialties;
    if (profileImage) updateData.profileImageUrl = profileImage;

    // Update user
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });
    console.log("Updated user:", updatedUser);

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error: any) {
    console.error("Update profile error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
