import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/helpers/verifyToken";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    const decodedToken = verifyToken(token);

    //Check if the token is valid
    if (!decodedToken) {
      return NextResponse.json(
        { message: "User not authenticated" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      message: "User is authenticated",
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Error verifying token",
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
