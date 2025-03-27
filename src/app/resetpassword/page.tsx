"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function ResetPasswordPage() {
  const [token, setToken] = useState(""); // Set the token from the url
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Extract token from url
  useEffect(() => {
    const urlToken = window.location.search.split("=")[1];
    setToken(urlToken || "");
  }, []);

  // Password validation
  const onResetPassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("Passwords do not match. Please try again.");
      return;
    }

    try {
      setIsLoading(true);

      // Trimiterea cererii pentru resetarea parolei
      const response = await axios.post("/api/users/resetpassword", {
        token,
        newpassword: passwords.newPassword,
      });

      console.log("Password reset successful", response.data);
      toast.success("Your password has been successfully changed!");
      router.push("/login");
    } catch (error: any) {
      toast.error("Failed to reset password. Please try again.");
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
                src="/password-lock.svg"
                alt="reset-password-icon"
                width={100}
                height={50}
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2 text-gray-800">
            Reset Password
          </h1>
          <p className="text-gray-600 text-sm">
            Enter your new password below.
          </p>
        </div>

        {/* New Password Field */}
        <label
          htmlFor="newPassword"
          className="block text-gray-700 font-medium mb-2"
        >
          New Password
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
            id="newPassword"
            value={passwords.newPassword}
            onChange={(e) =>
              setPasswords({ ...passwords, newPassword: e.target.value })
            }
            placeholder="Enter new password"
          />
        </div>

        {/* Confirm Password Field */}
        <label
          htmlFor="confirmPassword"
          className="block text-gray-700 font-medium mb-2"
        >
          Confirm Password
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
            id="confirmPassword"
            value={passwords.confirmPassword}
            onChange={(e) =>
              setPasswords({ ...passwords, confirmPassword: e.target.value })
            }
            placeholder="Confirm your new password"
          />
        </div>

        {/* Submit Button */}
        <div>
          <Button
            onClick={onResetPassword}
            type="button"
            title={isLoading ? "Resetting..." : "Reset Password"}
            variant="w-full py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-400 hover:to-blue-400 text-white rounded-lg shadow-md transition duration-300 flex items-center justify-center"
            full
          />
        </div>

        {/* Back to Login Link */}
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
