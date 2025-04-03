"use client";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useState } from "react";
import Image from "next/image";
import Button from "@/components/Button";
import { useLoadingState } from "@/hooks/useLoadingState";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const { isLoading, startLoading, stopLoading } = useLoadingState();

  const onHandleSubmit = async (e: any) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter an email.");
      return;
    }

    try {
      startLoading();
      const res = await axios.post("/api/users/forgotpassword", { email });
      toast.success("We’ve sent you a reset link! Please check your inbox.");
    } catch (error: any) {
      if (error.response?.status === 400) {
        toast.error("No account found with that email. Please try again.");
      } else {
        toast.error("Something went wrong! Please try again later.");
      }
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-400 to-blue-500 p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8 space-y-6">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="h-20 w-20 rounded-full bg-white shadow-lg flex items-center justify-center">
              <Image
                src="/email.svg"
                alt="email-icon"
                width={100}
                height={50}
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2 text-gray-800">
            Forgot Password
          </h1>
          <p className="text-gray-600 text-sm">
            Enter your email to reset your password.
          </p>
        </div>

        <form onSubmit={onHandleSubmit} className="space-y-4">
          <label
            htmlFor="email"
            className="block text-gray-700 font-medium mb-2"
          >
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
              type="email"
              className="w-full p-3 pl-10 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            loading={isLoading}
            title={isLoading ? "Sending..." : "Send Reset Link"}
            variant="btn_gradient_green_blue"
            full
          ></Button>
          <Button
            type="button"
            title=" Go back"
            variant="flex items-center justify-center w-full border-none text-blue-600 underline text-center mt-4"
            href="/login"
          ></Button>
        </form>
      </div>
    </div>
  );
}
