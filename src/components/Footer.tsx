"use client";
import { FOOTER_CONTACT_INFO, FOOTER_LINKS, SOCIALS } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();

  // Paths that i dont want the footer to show in
  const noNavbarRoutes = [
    "/login",
    "/signup",
    "/forgotpassword",
    "/resetpassword",
  ];

  // Hide the footer if i am on that path
  if (noNavbarRoutes.includes(pathname)) {
    return null;
  }

  return (
    <footer className="flexCenter bg-gradient-to-br from-green-400 to-blue-500 ">
      <div className="padding-container max-container flex w-full flex-col gap-14 px-10 md:px-20 ">
        <div className="flex flex-col items-start justify-center gap-[10%] md:flex-row  mt-10">
          <Link href="/" className="mb-10">
            <Image src="/logo.png" alt="logo" width={74} height={29} />
          </Link>
          {/* Our Community */}
          <div className="flex flex-wrap gap-10 sm:justify-between md:flex-1 text-white">
            {FOOTER_LINKS.map((column, index) => (
              <FooterColumn key={index} title={column.title}>
                <ul className="flex flex-col gap-4 text-base text-white">
                  {column.links.map((link, i) => (
                    <li key={i}>
                      <Link
                        href={link.href}
                        className=" text-white flexCenter cursor-pointer pb-1.5 transition-all hover:font-bold"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </FooterColumn>
            ))}

            {/* Contact info */}
            <div className="flex flex-col gap-5 text-white">
              <FooterColumn title={FOOTER_CONTACT_INFO.title}>
                {FOOTER_CONTACT_INFO.links.map((link) => (
                  <Link
                    href="/"
                    key={link.label}
                    className="flex gap-4 md:flex-col lg:flex-row"
                  >
                    <p className="whitespace-nowrap">{link.label}:</p>
                    <p className="whitespace-nowrap text-white font-bold">
                      {link.value}
                    </p>
                  </Link>
                ))}
              </FooterColumn>
            </div>
            {/* Socials */}
            <div className="flex flex-col gap-5 text-white">
              <FooterColumn title={SOCIALS.title}>
                <ul className="flex gap-4 ">
                  {SOCIALS.links.map((link) => (
                    <Link href="/" key={link}>
                      <Image src={link} alt="logo" width={24} height={24} />
                    </Link>
                  ))}
                </ul>
              </FooterColumn>
            </div>
          </div>
        </div>
        <div className="border border-white" />
        <p className="w-full text-center text-white mb-10 ">
          2025 SmartBite | All rights reserved
        </p>
      </div>
    </footer>
  );
};

type FooterColumnProps = {
  title: string;
  children: React.ReactNode;
};

const FooterColumn = ({ title, children }: FooterColumnProps) => {
  return (
    <div className="flex flex-col gap-5">
      <h4 className="text-2xl whitespace-nowrap font-semibold">{title}</h4>
      {children}
    </div>
  );
};

export default Footer;
