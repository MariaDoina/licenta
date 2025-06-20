import nodemailer from "nodemailer";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";
import { EmailType } from "@/constants/emailTypes";

interface SendEmailParams {
  email: string;
  emailType: EmailType;
  userId: string;
}

//Get email subject based on email type
function getSubject(emailType: EmailType): string {
  switch (emailType) {
    case EmailType.VERIFY:
      return "Verify your email";
    case EmailType.RESET:
      return "Reset your password";
    default:
      return "Notification";
  }
}

//Get email body based on email type
function getHTMLContent(emailType: EmailType, token: string): string {
  switch (emailType) {
    case EmailType.VERIFY:
      return `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${token}">here</a> to verify your email.</p>`;
    case EmailType.RESET:
      return `<p>Click <a href="${process.env.DOMAIN}/resetpassword?token=${token}">here</a> to reset your password.</p>`;
    default:
      return `<p>This is a notification email.</p>`;
  }
}

export const sendEmail = async ({
  email,
  emailType,
  userId,
}: SendEmailParams) => {
  try {
    //create a hashed Token
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    //Update token based on email type
    switch (emailType) {
      case EmailType.VERIFY:
        await User.findByIdAndUpdate(
          userId,
          {
            verifyToken: hashedToken,
            verifyTokenExpiry: Date.now() + 28800000,
          },
          { new: true, runValidators: true }
        );
        break;
      case EmailType.RESET:
        await User.findByIdAndUpdate(
          userId,
          {
            forgotPasswordToken: hashedToken,
            forgotPasswordTokenExpiry: Date.now() + 28800000,
          },
          { new: true, runValidators: true }
        );
        break;

      default:
        throw new Error("Invalid email type");
    }

    //Config mailtrap
    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
      },
    });

    //Config mail options
    const mailOptions = {
      from: "mariadoina35@gmail.com",
      to: email,
      subject: getSubject(emailType),

      html: getHTMLContent(emailType, hashedToken),
    };

    //Send email
    const mailResponse = await transport.sendMail(mailOptions);
    return mailResponse;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred");
  }
};
