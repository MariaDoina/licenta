"use client";
import { toast } from "react-hot-toast";
import { useState } from "react";
import Button from "@/components/Button";
import { useLoadingState } from "@/app/lib/hooks/useLoadingState";
import { useAuth } from "@/app/lib/hooks/ApiRequests";
import IconHeader from "@/components/LoginSignupUI/IconHeader";
import Form from "@/components/forms/AuthForm";

export default function ForgotPasswordPage() {
  const [user, setUser] = useState({ email: "" });
  const { forgotPassword } = useAuth();
  const { isLoading, startLoading, stopLoading } = useLoadingState();

  const handleChange = (name: string, value: string) => {
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const onForgotPassword = async () => {
    if (!user.email) {
      toast.error("Please enter an email.");
      return;
    }

    try {
      startLoading();
      await forgotPassword(user);
    } catch (error: any) {
      console.log("Couldn't send email", error.message);
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-400 to-blue-500 p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8 space-y-6">
        <IconHeader
          iconSrc="/email.svg"
          alt="email-icon"
          title="Forgot Password"
          description="Enter your email to reset your password."
        />

        <Form
          fields={[
            {
              name: "email",
              type: "email",
              placeholder: "Enter your email",
              iconSrc: "/email.svg",
              value: user.email,
            },
          ]}
          onChange={handleChange}
          onSubmit={onForgotPassword}
          loading={isLoading}
          buttonText="Send Reset Link"
        />

        <Button
          type="button"
          title="Go back"
          variant="flex items-center justify-center w-full border-none text-blue-600 underline text-center mt-4"
          href="/login"
        />
      </div>
    </div>
  );
}
