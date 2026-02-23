"use client";

import React from "react";
import GsapHorizontalScroll from "@/app/components/animation/GsapHorizontalScroll";
import KeyboardControls from "@/app/components/scroll/KeyboardControls";
import HomeSection from "@/app/sections/desktop/HomeSection";
import IntroSection from "@/app/sections/desktop/IntroSection";
import ServicesSection from "@/app/sections/desktop/ServicesSection";
import ScrollPathPagination from "@/app/components/scroll/ScrollPathPagination";
import CaseStudySection from "@/app/sections/desktop/CaseStudySection";
import ContactSection from "@/app/sections/desktop/ContactSection";
import Navigation from "@/app/components/navigation/Navigation";
import dynamic from "next/dynamic";

// Dynamic imports for mobile components
const MobileHomeSection = dynamic(
  () =>
    import("@/app/sections/mobile/MobileHomeSection").then((mod) => ({
      default: mod.default,
    })),
  { ssr: false },
);
const MobileIntroSection = dynamic(
  () =>
    import("@/app/sections/mobile/MobileIntroSection").then((mod) => ({
      default: mod.default,
    })),
  { ssr: false },
);
const MobileServicesSection = dynamic(
  () =>
    import("@/app/sections/mobile/MobileServicesSection").then((mod) => ({
      default: mod.default,
    })),
  { ssr: false },
);
const MobileCaseStudySection = dynamic(
  () =>
    import("@/app/sections/mobile/MobileCaseStudySection").then((mod) => ({
      default: mod.default,
    })),
  { ssr: false },
);
const MobileCreatedToMatterSection = dynamic(
  () =>
    import("@/app/sections/mobile/MobileCreatedToMatterSection").then(
      (mod) => ({ default: mod.default }),
    ),
  { ssr: false },
);
const MobileContactSection = dynamic(
  () =>
    import("@/app/sections/mobile/MobileContactSection").then((mod) => ({
      default: mod.default,
    })),
  { ssr: false },
);

export default function Home() {
  // Sections for the pagination
  const sections = ["Home", "Intro", "Services", "Case Studies", "Contact"];

  return (
    <>
      {/* Force desktop layout hidden on mobile using media query */}
      <style jsx>{`
        @media (max-width: 1023px) {
          .desktop-layout {
            display: none !important;
          }
        }
      `}</style>

      {/* Shared navigation for both mobile and desktop */}
      <Navigation />

      {/* Mobile layout - hidden on desktop with Tailwind classes */}
      <div className="block lg:hidden">
        <main className="w-full">
          <MobileHomeSection />
          <MobileIntroSection />
          <MobileServicesSection />
          <MobileCaseStudySection />
          <MobileCreatedToMatterSection />
          <MobileContactSection />
        </main>
      </div>

      {/* Desktop layout - hidden on mobile/tablet with Tailwind classes */}
      <div className="hidden lg:block desktop-layout">
        <main className="relative bg-black min-h-screen overflow-y-auto overflow-x-hidden">
          <KeyboardControls />
          <GsapHorizontalScroll>
            <HomeSection />
            <IntroSection />
            <ServicesSection />
            <CaseStudySection />
            <ContactSection />
          </GsapHorizontalScroll>
        </main>
        <ScrollPathPagination sections={sections} activeSection={0} />
      </div>
    </>
  );
}
