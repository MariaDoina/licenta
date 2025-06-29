import { NextRequest, NextResponse } from "next/server";
import { EmailType } from "@/constants/emailTypes";
import { sendEmail } from "@/lib/helpers/mailer";
import { connect } from "@/db/dbConfig";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { username, email, password } = reqBody;

    console.log(reqBody);

    //check if user already exists
    const user = await User.findOne({ email });

    if (user) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    console.log("User that was saved: ", savedUser);

    //send verification email
    await sendEmail({
      email,
      emailType: EmailType.VERIFY,
      userId: savedUser._id,
    });

    return NextResponse.json({
      message: "User created successfully",
      success: true,
      savedUser,
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
