"use client";
import IconHeader from "@/components/LoginSignupUI/IconHeader";
import { useLoadingState } from "@/lib/hooks/useLoadingState";
import { useApi } from "@/lib/helpers/ApiRequests";
import Form from "@/components/forms/AuthForm";
import Button from "@/components/Button";
import { toast } from "react-hot-toast";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const { isLoading, startLoading, stopLoading } = useLoadingState();
  const [user, setUser] = useState({ email: "" });
  const { forgotPassword } = useApi();

  // Info to be sent to the backend
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
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log("Couldn't send email", error.message);
        toast.error(error.message);
      } else {
        console.log("Couldn't send email", error);
        toast.error("An unexpected error occurred.");
      }
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
