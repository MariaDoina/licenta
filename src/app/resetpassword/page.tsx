"use client";
import IconHeader from "@/components/LoginSignupUI/IconHeader";
import { useLoadingState } from "@/lib/hooks/useLoadingState";
import React, { useState, useEffect } from "react";
import { useApi } from "@/lib/hooks/ApiRequests";
import Form from "@/components/forms/AuthForm";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";

export default function ResetPasswordPage() {
  const { isLoading, startLoading, stopLoading } = useLoadingState();
  const [token, setToken] = useState(""); // Extracted from URL
  const { resetPassword } = useApi();
  const router = useRouter();

  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (name: string, value: string) => {
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  // Extract token from URL
  useEffect(() => {
    const urlToken = window.location.search.split("=")[1];
    setToken(urlToken || "");
  }, []);

  const onResetPassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("Passwords do not match. Please try again.");
      return;
    }

    try {
      startLoading();
      await resetPassword({ token, newpassword: passwords.newPassword });
      router.push("/login");
    } catch (error: any) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-400 to-blue-500 p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8 space-y-6">
        <IconHeader
          iconSrc="/password-lock.svg"
          alt="reset-password-icon"
          title="Reset Password"
          description="Enter your new password below."
        />

        <Form
          fields={[
            {
              name: "newPassword",
              type: "password",
              placeholder: "Enter new password",
              iconSrc: "/password-lock.svg",
              value: passwords.newPassword,
            },
            {
              name: "confirmPassword",
              type: "password",
              placeholder: "Confirm your new password",
              iconSrc: "/password-lock.svg",
              value: passwords.confirmPassword,
            },
          ]}
          onChange={handleChange}
          onSubmit={onResetPassword}
          loading={isLoading}
          buttonText="Reset Password"
        />

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Remembered your password?&nbsp;
            <Link
              href="/login"
              className="text-indigo-600 font-semibold hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
