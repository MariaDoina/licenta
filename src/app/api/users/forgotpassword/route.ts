import { NextRequest, NextResponse } from "next/server";
import { EmailType } from "@/constants/emailTypes";
import { sendEmail } from "@/lib/helpers/mailer";
import { connect } from "@/db/dbConfig";
import User from "@/models/userModel";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email } = reqBody;
    console.log("Email sent from frontend", reqBody);

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "invalid user" }, { status: 400 });
    }

    await sendEmail({
      email,
      emailType: EmailType.RESET,
      userId: user._id,
    });

    return NextResponse.json({
      message: "email sent successfully",
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
