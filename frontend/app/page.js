"use client";

import SectionCounter from "@/components/Counter";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import { Hero } from "@/components/Hero";
import Navbar from "@/components/Navbar";
import StaticBackgroundPage from "@/components/StaticBackgroundPage";
import WhyChooseUs from "@/components/WhyChooseUs";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <StaticBackgroundPage />
      <WhyChooseUs />
      <SectionCounter />
      <FAQ />
      <Footer />
    </>
  );
}
