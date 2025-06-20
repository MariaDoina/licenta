import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import Chatbot from "@/components/ChatBot/chatbot";

import "./globals.css";
import Navbar from "@/components/Navbar";

import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Recipe App",
  description: "Manage your recipes easily.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="relative overflow-hidden">
          {children}
          <Toaster position="top-center" />
          <Chatbot />
        </main>
        <Footer />
      </body>
    </html>
  );
}
