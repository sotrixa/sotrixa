"use client";

import Image from "next/image";
import Link from "next/link";
import Header from "../header";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

// Main Navigation Component
export default function Navigation() {
  const [isMobile, setIsMobile] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      // Use 1024px to match Tailwind's lg breakpoint
      setIsMobile(window.innerWidth < 1024);
    };

    const handleScroll = () => {
      const scrolled = window.scrollY > 0;
      setIsScrolled(scrolled);
    };

    // Set initial values
    handleResize();
    handleScroll();

    // Add event listeners
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMobile]); // Added isMobile as dependency to update scroll state when mobile changes

  // Determine the logo link based on current page
  const getLogoHref = () => {
    // If we're on the home page, scroll to home section
    if (pathname === "/") {
      return "#home";
    }
    // If we're on any other page, navigate back to home page
    return "/";
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 ${
        isMobile && isScrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <div className="px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-3 xs:py-3.5 sm:py-4 md:py-5 transition-all duration-300 w-full">
        <div className="flex justify-between items-center w-full gap-4 mx-auto max-w-full">
          {/* Logo */}
          <Link
            href={getLogoHref()}
            className="transition-transform duration-300 hover:scale-105 flex-shrink-0 ml-[-0.7rem]"
          >
            <Image
              src="/sotrixa-logo.webp"
              alt="Sotrixa Logo"
              width={120}
              height={100}
              className="transition-all duration-300 w-auto h-auto"
              style={{
                width: "auto",
                height: "clamp(16px, 5vw, 100px)",
              }}
              priority
            />
          </Link>

          {/* Mobile Menu - only show on mobile */}
          {isMobile && (
            <div className="relative -mr-2 xs:-mr-3 sm:-mr-4 md:-mr-6">
              <Header />
            </div>
          )}
        </div>
      </div>

      {/* Desktop Menu */}
      {!isMobile && <Header />}
    </nav>
  );
}
