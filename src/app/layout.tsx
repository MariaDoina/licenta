import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";

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
        {/* Showing Navbar only if they're not the routes i specified */}
        <Navbar />
        <main className="relative overlfow-hidden">
          {children}
          <Toaster position="top-center" />
        </main>
        <Footer />
      </body>
    </html>
  );
}
