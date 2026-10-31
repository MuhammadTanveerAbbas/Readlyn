"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import PixelDivider from "@/components/landing/PixelDivider";
import Logos from "@/components/landing/Logos";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import Testimonials from "@/components/landing/Testimonials";
import Bento from "@/components/landing/Bento";
import Comparison from "@/components/landing/Comparison";
import Showcase from "@/components/landing/Showcase";
import FAQ from "@/components/landing/FAQ";
import Pricing from "@/components/landing/Pricing";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";
import { createClient } from "@/lib/supabase/client";

export default function Home() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        router.replace("/dashboard");
      } else {
        setIsReady(true);
      }
    };
    checkAuth();
  }, [router]);

  return (
    <main
      className="relative flex flex-col w-full bg-[var(--surface-sunken)] pt-[64px] transition-opacity duration-300"
      style={{ opacity: isReady ? 1 : 0 }}
    >
      <Navbar />
      <Hero />
      <PixelDivider />
      <Logos />
      <Features />
      <HowItWorks />
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
