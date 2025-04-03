import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    //If token is not available it means user is not authenticated
    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated", success: false },
        { status: 401 }
      );
    }

    //Check if the token is valid
    const decodedToken = jwt.verify(
      token,
      process.env.TOKEN_SECRET!
    ) as jwt.JwtPayload;

    if (!decodedToken) {
      return NextResponse.json(
        { message: "Invalid token", success: false },
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
