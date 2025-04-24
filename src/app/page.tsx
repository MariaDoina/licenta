import Features from "@/containers/HomePage/Features";
import HowToUse from "@/containers/HomePage/HowToUse";
import GetApp from "@/containers/HomePage/GetApp";
import Hero from "@/containers/HomePage/Hero";

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
