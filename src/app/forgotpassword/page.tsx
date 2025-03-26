"use client";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const onHandleSubmit = async (e: any) => {
    e.preventDefault();

    if (!email) {
      toast.error("Te rog introdu un email.");
      return;
    }

    try {
      const res = await axios.post("/api/users/forgotpassword", { email });
      toast.success(res.data.message);
    } catch (error: any) {
      if (error.response?.status === 400) {
        // Mesaj personalizat pentru email invalid
        toast.error(error.response.data.error);
      } else {
        // Eroare generală
        toast.error("Ceva nu a mers bine. Încearcă din nou.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-purple-700">
      <h1 className="text-3xl font-bold text-white">Forgot Password</h1>
      <form
        onSubmit={onHandleSubmit}
        className="flex flex-col space-y-4 mt-5 w-80"
      >
        <input
          type="email"
          className="p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Enter your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700"
        >
          Send Reset Link
        </button>
      </form>
    </div>
  );
}
