import type { Metadata } from "next";

import "./globals.css";
import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";

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
        <main className="relative overlfow-hidden">{children}</main>
        {/* <Footer /> */}
      </body>
    </html>
  );
}
