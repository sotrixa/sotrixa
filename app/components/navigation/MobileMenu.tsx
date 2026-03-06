"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const mobileStyles = `
  @media (max-width: 768px) {
    html {
      scroll-padding-top: 120px;
    }
    #mobile-home,
    #mobile-intro,
    #mobile-services,
    #mobile-case-studies,
    #mobile-contact {
      scroll-margin-top: 80px;
    }
  }
`;

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleNavClick = () => {
    toggleMenu();
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <style>{mobileStyles}</style>
      {/* Sticky Header */}
      <div
        className={`md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 transition-all duration-300 ${
          isScrolled ? "py-2 shadow-sm" : "py-4"
        }`}
      >
        <div className="flex justify-between items-center px-5 h-full">
          <span
            className={`font-bold transition-all duration-300 ${isScrolled ? "text-sm" : "text-base"} text-black`}
          >
            Sotrixa
          </span>
          <button
            onClick={toggleMenu}
            className="flex flex-col justify-center items-center space-y-1"
            aria-label="Toggle menu"
          >
            <motion.span
              animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              className="w-5 h-0.5 bg-black block"
            />
            <motion.span
              animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
              className="w-5 h-0.5 bg-black block"
            />
            <motion.span
              animate={isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              className="w-5 h-0.5 bg-black block"
            />
          </button>
        </div>
      </div>

      {/* Add padding to account for sticky header */}
      <div className="md:hidden h-14" />

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 bg-white z-40 md:hidden overflow-y-auto"
          >
            <div className="pt-20 px-5 pb-8 space-y-3">
              <a
                href="#mobile-home"
                className="block py-10 text-gray-900 font-semibold text-7xl hover:text-gray-600 transition-colors"
                onClick={handleNavClick}
              >
                Home
              </a>
              <a
                href="#mobile-intro"
                className="block py-10 text-gray-900 font-semibold text-7xl hover:text-gray-600 transition-colors"
                onClick={handleNavClick}
              >
                About
              </a>
              <a
                href="#mobile-services"
                className="block py-10 text-gray-900 font-semibold text-7xl hover:text-gray-600 transition-colors"
                onClick={handleNavClick}
              >
                Services
              </a>
              <a
                href="#mobile-case-studies"
                className="block py-10 text-gray-900 font-semibold text-7xl hover:text-gray-600 transition-colors"
                onClick={handleNavClick}
              >
                Work
              </a>
              <a
                href="#mobile-contact"
                className="block py-10 text-gray-900 font-semibold text-7xl hover:text-gray-600 transition-colors"
                onClick={handleNavClick}
              >
                Contact
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
