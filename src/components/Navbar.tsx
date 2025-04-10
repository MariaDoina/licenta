"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { toast } from "react-hot-toast"; // Importă toast-ul
import { NAV_LINKS } from "../constants";
import Image from "next/image";
import Link from "next/link";
import Button from "./Button";
import axios from "axios";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const pathname = usePathname();

  // List to check if navbar has to be hidden
  const shouldHideNavbar = [
    "/login",
    "/signup",
    "/forgotpassword",
    "/resetpassword",
  ].includes(pathname);

  // Check user authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("/api/users/auth_check");
        setIsAuthenticated(response.data.success);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, [pathname]);

  // Check if the user is authenticated if not show them a message as to why they can't access other links
  const handleLinkClick = (href: string) => {
    if (!isAuthenticated) {
      toast.error("You need to be logged in to access this page.");
    } else {
      window.location.href = href;
    }
  };

  if (shouldHideNavbar || isAuthenticated === null) return null;

  return (
    <nav className="flex items-center justify-between max-container padding-container relative z-30 py-5 px-10 overflow-hidden bg-gradient-to-br from-green-400 to-blue-500">
      {/* Logo */}
      <Link href="/">
        <Image src="/logo.png" alt="logo" width={100} height={50} />
      </Link>

      {/* Desktop Menu */}
      <ul
        className={`hidden h-full gap-10 lg:flex pr-50  ${
          !isAuthenticated ? "mr-0 pl-0" : "mr-auto pl-32"
        }`}
      >
        {NAV_LINKS.map((link) => (
          <Link
            href={link.href}
            key={link.key}
            className="regular-16 text-white flexCenter cursor-pointer pb-1.5 transition-all hover:font-bold"
            onClick={() => handleLinkClick(link.href)} // Add toast logic for link click
          >
            {link.label}
          </Link>
        ))}
      </ul>

      {/* Desktop Buttons - show them only if user is not Authenticated */}
      {!isAuthenticated && (
        <div className="lg:flexCenter flex gap-3">
          <Button
            type="button"
            title="Sign Up"
            icon="/sign-up.svg"
            variant="btn_white_text"
            className="hidden lg:flex items-center gap-2"
            href="/signup"
          />
          <Button
            type="button"
            title="Log in"
            icon="/user.svg"
            variant="btn_dark_gray"
            className="hidden lg:flex items-center gap-2"
            href="/login"
          />
        </div>
      )}

      {/* Mobile Menu Button */}
      <Button
        type="button"
        icon={"/menu.svg"}
        title=""
        variant="border-none"
        className="lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      />

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-screen w-64 bg-white shadow-2xl transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out lg:hidden`}
      >
        <div className="flex flex-col items-center p-5">
          {/* Close Button */}
          <Button
            type="button"
            icon="/close.svg"
            title=""
            variant="border-none"
            className="self-end mt-6 mr-5"
            onClick={() => setIsOpen(false)}
          />

          {/* Mobile Links */}
          <ul className="flex flex-col items-center gap-6 mt-10">
            {NAV_LINKS.map((link) => (
              <li key={link.key}>
                <Link
                  href={link.href}
                  className="text-gray-500 text-lg hover:font-bold"
                  onClick={() => {
                    setIsOpen(false); // Close the menu when a link is clicked
                    handleLinkClick(link.href); // Add toast logic for link click
                  }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Buttons - show them only if user is not Authenticated */}
          {!isAuthenticated && (
            <div className="flex flex-col items-center gap-4 mt-6">
              <Button
                type="button"
                title="Sign Up"
                icon="sign-up.svg"
                variant="btn_white_text"
                className="border w-full text-center border-black"
                href="/signup"
              />
              <Button
                type="button"
                title="Log in"
                icon="/user.svg"
                variant="btn_dark_gray"
                className="w-full text-center"
                href="/login"
              />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
