"use client";

import { useEffect, useState } from "react";
import ScrollToTopButton from "@/app/components/scroll/ScrollToTopButton";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Burger from "@/app/components/header/burger";
import Menu from "@/app/components/header/menu";
import Stairs from "@/app/components/header/stairs";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

// Wrapper component to handle proper exit animation
function MenuOverlay({ closeMenu }: { closeMenu: () => void }) {
  return (
    <motion.div
      key="menu-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[998]"
    >
      <Stairs />
      <Menu closeMenu={closeMenu} />
    </motion.div>
  );
}

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Define the props type directly
type Props = {
  children: React.ReactNode;
};

// Rename the component to avoid redeclaration issues
function MobileLayoutComponent({ children }: Props) {
  // Initialize as false to ensure transparency on first render
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  // Force isScrolled to false when menu is open for consistent visuals
  useEffect(() => {
    if (menuIsOpen) {
      setIsScrolled(false);
    }
  }, [menuIsOpen]);

  useEffect(() => {
    const handleScroll = () => {
      // Only update scroll state when menu is closed
      if (!menuIsOpen) {
        setIsScrolled(window.scrollY > 50);
      }
    };

    // Set initial state - explicitly set to false to ensure transparency
    setIsScrolled(window.scrollY > 50);

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      // Clean up all ScrollTrigger instances when the component unmounts
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [menuIsOpen]);

  // Prevent body scrolling when menu is open
  useEffect(() => {
    if (menuIsOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuIsOpen]);

  return (
    <div className="w-full min-h-screen bg-white text-black overflow-x-hidden">
      {/* Mobile header - responsive height and positioning */}
      <header
        style={{
          backgroundColor: isScrolled && !menuIsOpen ? "white" : "transparent",
          boxShadow:
            isScrolled && !menuIsOpen ? "0 2px 4px rgba(0, 0, 0, 0.1)" : "none",
          pointerEvents: "none", // Allow clicks to pass through the header to content underneath
        }}
        className="fixed top-0 left-0 w-full h-[80px] sm:h-[90px] md:h-[100px] lg:h-[120px] z-50 transition-all duration-300"
      >
        {/* Inner container that ensures all elements are within the header background */}
        <div className="relative w-full h-full flex justify-between items-center px-4 md:px-8">
          {/* Logo container with proper padding */}
          <div className="h-full flex items-center pointer-events-auto pt-4">
            <Link href="/" className="z-50 pb-5">
              <Image
                src="/sotrixa-logo.webp"
                alt="Sotrixa Logo"
                width={50}
                height={36}
                className="transition-all duration-300"
                style={{
                  filter:
                    isScrolled && !menuIsOpen
                      ? "none"
                      : "brightness(0) invert(0)",
                }}
                priority
              />
            </Link>
          </div>

          {/* Burger menu with proper spacing - white icons regardless of scroll state */}
          <div className="h-full flex items-center justify-center pointer-events-auto pb-2">
            <Burger
              openMenu={() => setMenuIsOpen(true)}
              closeMenu={() => setMenuIsOpen(false)}
              isMenuOpen={menuIsOpen}
              isScrolled={isScrolled}
            />
          </div>
        </div>
      </header>

      {/* Menu components outside header for proper z-index stacking */}
      <AnimatePresence mode="wait">
        {menuIsOpen && <MenuOverlay closeMenu={() => setMenuIsOpen(false)} />}
      </AnimatePresence>

      {/* Main content - starts from the top of the page */}
      <main className="w-full">{children}</main>

      {/* Mobile footer */}
      <footer className="bg-black text-white py-8 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center flex-wrap">
            <div className="mb-4 md:mb-0">
              <Image
                src="/sotrixa-logo.webp"
                alt="Sotrixa Logo"
                width={100}
                height={33}
              />
            </div>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/sotrixa"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-teal-400 transition-colors"
                aria-label="Instagram"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/company/sotrixa"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-teal-400 transition-colors"
                aria-label="LinkedIn"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>
          <div className="mt-6 text-sm text-gray-400">
            © {new Date().getFullYear()} Sotrixa. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Scroll to top button */}
      {isScrolled && <ScrollToTopButton />}
    </div>
  );
}

// Export the component with a different name to avoid conflicts
export default MobileLayoutComponent;
