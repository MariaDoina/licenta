"use client";
import IconHeader from "@/components/LoginSignupUI/IconHeader";
import { useLoadingState } from "@/lib/hooks/useLoadingState";
import { useApi } from "@/lib/helpers/ApiRequests";
import Form from "@/components/forms/AuthForm";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import Link from "next/link";

export default function LoginPage() {
  const { isLoading, startLoading, stopLoading } = useLoadingState();
  const [user, setUser] = useState({ email: "", password: "" });
  const { login } = useApi();
  const router = useRouter();

  // Info to be sent to the backend
  const handleChange = (name: string, value: string) => {
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  //Api call to login the user
  const handleLogin = async () => {
    if (!user.email.trim() || !user.password.trim()) {
      toast.error("Please fill in all fields!");
      return;
    }

    try {
      startLoading();
      await login(user);
      router.push("/");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
        console.error("Login error:", error.message);
      } else {
        toast.error("An unexpected error occurred.");
        console.error("Login error:", error);
      }
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-400 to-blue-500 p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8 space-y-6">
        {/* Header Section */}
        <IconHeader
          iconSrc="/chef_hat_heart.svg"
          alt="Chef Hat"
          title="Log in"
          description="Log in to get started"
        />

        {/* Form Section */}
        <Form
          fields={[
            {
              name: "email",
              type: "email",
              placeholder: "Enter your email",
              iconSrc: "/email.svg",
              value: user.email,
            },
            {
              name: "password",
              type: "password",
              placeholder: "Enter your password",
              iconSrc: "/password-lock.svg",
              value: user.password,
            },
          ]}
          onChange={handleChange}
          onSubmit={handleLogin}
          loading={isLoading}
          buttonText="Log in"
        />

        {/* Login Link */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            You don&apos;t have an account?&nbsp;
            <Link
              href="/signup"
              className="text-indigo-600 font-semibold hover:underline"
            >
              Sign Up
            </Link>
          </p>
          <p className="text-sm text-gray-600">
            Forgot your password?&nbsp;
            <Link
              href="/forgotpassword"
              className="text-indigo-600 font-semibold hover:underline"
            >
              Click here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
