"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function SignupPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    password: "",
    username: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const onSignup = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post("/api/users/signup", user);
      console.log("Signup successful", response.data);
      router.push("/login");
      await toast.success("Signup successful");
    } catch (error: any) {
      console.log("Signup failed", error.message);
      toast.error(
        "A user with this email already exists. Please use a different email."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-400 to-blue-500 p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8 space-y-6">
        {/* Header Section */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="h-20 w-20 rounded-full bg-white shadow-lg flex items-center justify-center">
              <Image
                src="/chef_hat_heart.svg"
                alt="chef-hat"
                width={100}
                height={50}
              />
              {/* <ChefHat size={40} className="text-green-500" /> */}
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2 text-gray-800">Sign Up</h1>
          <p className="text-gray-600 text-sm">
            Create an account to get started.
          </p>
        </div>

        {/* Form Section */}
        {/* Username Field */}
        <label
          htmlFor="username"
          className="block text-gray-700 font-medium mb-2"
        >
          Username
        </label>
        <div className="relative">
          <Image
            src="/user-signup.svg"
            alt="user-icon"
            width={20}
            height={20}
            className="absolute left-3 top-1/2 transform -translate-y-1/2"
          />

          <input
            className="w-full p-3 pl-10 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            type="text"
            id="username"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            placeholder="Enter your username"
          />
        </div>

        {/* Email Field */}
        <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
          Email
        </label>
        <div className="relative">
          <Image
            src="/email.svg"
            alt="email-icon"
            width={20}
            height={20}
            className="absolute left-3 top-1/2 transform -translate-y-1/2"
          />

          <input
            className="w-full p-3 pl-10 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            type="email"
            id="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            placeholder="Enter your email"
          />
        </div>

        {/* Password Field */}
        <label
          htmlFor="password"
          className="block text-gray-700 font-medium mb-2"
        >
          Password
        </label>
        <div className="relative">
          <Image
            src="/password-lock.svg"
            alt="password-icon"
            width={20}
            height={20}
            className="absolute left-3 top-1/2 transform -translate-y-1/2"
          />

          <input
            className="w-full p-3 pl-10 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            type="password"
            id="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            placeholder="Enter your password"
          />
        </div>

        {/* Submit Button */}
        <div>
          <Button
            onClick={onSignup}
            type="button"
            title={isLoading ? "Signing Up..." : "Sign Up"}
            variant="btn_gradient_green_blue"
            full
          ></Button>
        </div>

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
