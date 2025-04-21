"use client";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import IconHeader from "@/components/ui/IconHeader";

export default function VerifyEmailPage() {
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);

  const verifyUserEmail = async () => {
    if (!token) return;

    try {
      await axios.post("/api/users/verifyEmail", { token });
      setVerified(true);
    } catch (error: any) {
      setError(true);
      toast.error("Token is invalid or has expired.");
    }
  };

  useEffect(() => {
    const urlToken = window.location.search.split("=")[1];
    setToken(urlToken || "");
  }, []);

  useEffect(() => {
    if (token.length > 0) {
      verifyUserEmail();
    }
  }, [token]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-400 to-blue-500 p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8 space-y-6">
        {/* Header Section */}
        <IconHeader
          iconSrc="/email.svg"
          alt="verify-email-icon"
          title="Verify Your Email"
          description="Please verify your email address to complete the registration."
        />
        {/* Verification Result */}
        {verified && (
          <div className="text-center mt-4">
            <h2 className="text-2xl font-semibold text-green-600">
              Your email has been successfully verified!
            </h2>
          </div>
        )}

        {error && (
          <div className="text-center mt-4">
            <h2 className="text-2xl font-semibold text-red-600">
              Something went wrong. Please try again later.
            </h2>
          </div>
        )}

        {/* Back to Home Link */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-sm text-gray-600 font-semibold hover:underline"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
