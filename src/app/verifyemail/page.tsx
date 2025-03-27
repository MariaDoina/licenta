"use client";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";

export default function VerifyEmailPage() {
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);

  const verifyUserEmail = async () => {
    try {
      await axios.post("/api/users/verifyEmail", { token });
      setVerified(true);
    } catch (error: any) {
      setError(true);
      toast.error("Something went wrong! Please try again later.");
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
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="h-20 w-20 rounded-full bg-white shadow-lg flex items-center justify-center">
              <Image
                src="/verify_email.svg"
                alt="verify-email-icon"
                width={100}
                height={50}
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2 text-gray-800">
            Verify Your Email
          </h1>
          <p className="text-gray-600 text-sm">
            Please verify your email address to complete the registration.
          </p>
        </div>

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
