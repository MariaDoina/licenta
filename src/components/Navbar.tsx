"use client";
import { useState } from "react";
import { NAV_LINKS } from "../constants";
import Image from "next/image";
import Link from "next/link";
import Button from "./Button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between max-container padding-container relative z-30 py-5 px-10 overflow-hidden">
      {/* Logo */}
      <Link href="/">
        <Image src="/logo-recipe-app.svg" alt="logo" width={100} height={50} />
      </Link>

      {/* Desktop Menu */}
      <ul className="hidden h-full gap-10 lg:flex pr-50">
        {NAV_LINKS.map((link) => (
          <Link
            href={link.href}
            key={link.key}
            className="regular-16 text-gray-500 flexCenter cursor-pointer pb-1.5 transition-all hover:font-bold"
          >
            {link.label}
          </Link>
        ))}
      </ul>

      {/* Desktop Buttons */}
      <div className="lg:flexCenter flex gap-1">
        <Button
          type="button"
          title="Sign Up"
          icon="/sign-up.svg"
          variant="btn_white_text"
          className="hidden lg:flex items-center gap-2"
        />
        <Button
          type="button"
          title="Log in"
          icon="/user.svg"
          variant="btn_dark_gray"
          className="hidden lg:flex items-center gap-2"
        />
      </div>

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
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Buttons */}
          <div className="flex flex-col items-center gap-4 mt-6">
            <Button
              type="button"
              title="Sign Up"
              icon="sign-up.svg"
              variant="btn_white_text"
              className="border w-full text-center border-black"
            />
            <Button
              type="button"
              title="Log in"
              icon="/user.svg"
              variant="btn_dark_gray"
              className="w-full text-center"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
