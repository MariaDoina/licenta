"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useLoadingState } from "@/hooks/useLoadingState";
import { useAuth } from "@/hooks/useAuth";
import IconHeader from "@/components/ui/IconHeader";
import Form from "@/components/form/Form";
import { toast } from "react-hot-toast";

export default function SignupPage() {
  const [user, setUser] = useState({ email: "", password: "", username: "" });
  const { signup } = useAuth();
  const { isLoading, startLoading, stopLoading } = useLoadingState();
  const router = useRouter();

  const handleChange = (name: string, value: string) => {
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  // const validateUser = (user: { username: string; email: string; password: string }) => {
  //   if (!user.username.trim()) {
  //     toast.error("Username is required!");
  //     return false;
  //   }

  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   if (!emailRegex.test(user.email)) {
  //     toast.error("Please enter a valid email address!");
  //     return false;
  //   }

  //   if (user.password.length < 6) {
  //     toast.error("Password must be at least 6 characters long!");
  //     return false;
  //   }

  //   return true;
  // };

  const handleSignup = async () => {
    if (!user.username.trim() || !user.email.trim() || !user.password.trim()) {
      toast.error("Please fill in all fields!");
      return;
    }

    try {
      startLoading();
      await signup(user);
      router.push("/login");
    } catch (error: any) {
      console.log("Signup failed", error.message);
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
          title="Sign Up"
          description="Create an account to get started."
        />

        {/* Form Section */}
        <Form
          fields={[
            {
              name: "username",
              type: "username",
              placeholder: "Enter your username",
              iconSrc: "/user-signup.svg",
              value: user.username,
            },
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
          onSubmit={handleSignup}
          loading={isLoading}
          buttonText="Sign Up"
        />

        {/* Login Link */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
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
