import Features from "@/components/mainPage/Features";
import HowToUse from "@/components/mainPage/HowToUse";
import GetApp from "@/components/mainPage/GetApp";
import Hero from "@/components/mainPage/Hero";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Hero />
      <HowToUse />
      <Features />
      <GetApp />
    </>
  );
}
