import Features from "@/components/Features";
import HowToUse from "@/components/HowToUse";
import GetApp from "@/components/GetApp";
import Hero from "@/components/Hero";
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
