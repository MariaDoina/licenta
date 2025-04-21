import { connect } from "@/db/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { getDataFromToken } from "@/app/lib/helpers/getDataFromToken";

connect();

export async function PUT(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    const body = await request.json();

    const { about, specialties } = body;

    //Validating data
    if (!about && !specialties) {
      return NextResponse.json(
        { error: "Please provide data to update." },
        { status: 400 }
      );
    }

    //Update about and specialties fields
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...(about && { about }),
        ...(specialties && { specialties }),
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "User updated succesfully",
      data: updatedUser,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
