import { connect } from "@/db/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { getDataFromToken } from "@/lib/helpers/getDataFromToken";

connect();

type UpdateUserData = {
  username?: string;
  about?: string;
  specialties?: string[];
  profileImageUrl?: string;
};

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

    // Prepare update object with explicit typing
    const updateData: UpdateUserData = {};
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
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
