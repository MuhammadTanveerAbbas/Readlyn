import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import PixelDivider from "@/components/landing/PixelDivider";
import Logos from "@/components/landing/Logos";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import Stats from "@/components/landing/Stats";
import Testimonials from "@/components/landing/Testimonials";
import Bento from "@/components/landing/Bento";
import Comparison from "@/components/landing/Comparison";
import Showcase from "@/components/landing/Showcase";
import FAQ from "@/components/landing/FAQ";
import Pricing from "@/components/landing/Pricing";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="relative flex flex-col w-full bg-[#060606] pt-[64px] overflow-hidden">
      <Navbar />
      <Hero />
      <PixelDivider />
      <Logos />
      <Features />
      <HowItWorks />
      <Stats />
      <Testimonials />
      <Bento />
      <Comparison />
      <Showcase />
      <FAQ />
      <Pricing />
      <FinalCTA />
      <Footer />
    </main>
  );
}
