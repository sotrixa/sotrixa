"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";

export default function MobileCreatedToMatterSection() {
  const backgroundRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Function to render text with styled dashes
  const renderTextWithStyledDash = (text: string) => {
    if (text.includes("—")) {
      const parts = text.split("—");
      const elements: React.ReactNode[] = [];

      parts.forEach((part, index) => {
        elements.push(<span key={`text-${index}`}>{part}</span>);
        if (index < parts.length - 1) {
          elements.push(
            <span
              key={`dash-${index}`}
              style={{
                fontSize: "1em",
                fontWeight: "200",
                transform: "scaleX(0.5)",
                display: "inline-block",
              }}
            >
              –
            </span>,
          );
        }
      });

      return elements;
    }
    return text;
  };

  // Animate the background grid
  useEffect(() => {
    if (!backgroundRef.current) return;

    gsap.fromTo(
      backgroundRef.current,
      {
        opacity: 0,
        scale: 0.95,
      },
      {
        opacity: 0.5,
        scale: 1,
        duration: 1.5,
        ease: "power2.out",
      },
    );

    // Subtle continuous movement
    gsap.to(backgroundRef.current, {
      backgroundPosition: "100% 100%",
      duration: 120,
      ease: "none",
      repeat: -1,
    });
  }, []);

  // Animate content entrance
  useEffect(() => {
    if (!titleRef.current || !contentRef.current) return;

    const tl = gsap.timeline();

    tl.fromTo(
      titleRef.current,
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      },
    ).fromTo(
      contentRef.current.children,
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        stagger: 0.2,
        duration: 0.6,
        ease: "power2.out",
      },
      "-=0.4",
    );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      id="mobile-created-to-matter"
      className="bg-gray-50 text-black relative overflow-hidden py-12 px-4"
    >
      {/* Minimalist grid background */}
      <div
        ref={backgroundRef}
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
linear-gradient(to right, rgba(150,150,150,0.08) 1px, transparent 1px),
linear-gradient(to bottom, rgba(150,150,150,0.08) 1px, transparent 1px)
`,
          backgroundSize: "50px 50px",
          backgroundPosition: "0 0",
        }}
      >
        {/* Decorative circles - scaled for mobile */}
        <div className="absolute top-[15%] left-[10%] w-12 h-12 border-2 border-gray-300 rounded-full opacity-15 transform rotate-45 hidden sm:block"></div>
        <div className="absolute top-[10%] left-[8%] w-8 h-8 border-2 border-gray-300 rounded-full opacity-10 hidden sm:block"></div>
        <div className="absolute bottom-[20%] right-[5%] w-16 h-16 border-2 border-gray-300 rounded-full opacity-15 transform -rotate-12 hidden sm:block"></div>

        {/* Subtle decorative lines - mobile optimized */}
        <div className="absolute top-[25%] left-0 w-1/4 h-[1px] bg-gradient-to-r from-transparent via-gray-400 to-transparent opacity-20 hidden sm:block"></div>
        <div className="absolute bottom-[35%] right-0 w-1/3 h-[1px] bg-gradient-to-l from-transparent via-gray-400 to-transparent opacity-20 hidden sm:block"></div>
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto">
        {/* Content Container */}
        <div ref={contentRef} className="space-y-8">
          {/* Title section */}
          <div ref={titleRef} className="text-left">
            <h1 className="font-black text-2xl md:text-3xl leading-snug mb-4">
              <span>Created to </span>
              <span className="text-purple-600">Matter</span>
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-yellow-400 via-purple-500 to-cyan-400 rounded-full"></div>
          </div>

          {/* First content block */}
          <motion.div
            className="text-sm leading-relaxed space-y-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-gray-800 font-normal">
              {renderTextWithStyledDash(
                "Empowering bold ideas with strategies that align vision, purpose, and growth. Sotrixa partners with visionary entrepreneurs, creatives, and changemakers—those building with purpose and seeking clarity along the way.",
              )}
            </p>
            <p className="text-gray-800 font-normal">
              {renderTextWithStyledDash(
                "We work closely to translate bold ideas into aligned, authentic strategies that are ready for real-world growth.",
              )}
            </p>
          </motion.div>

          {/* Second content block */}
          <motion.div
            className="text-sm leading-relaxed space-y-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-gray-800 font-normal">
              {renderTextWithStyledDash(
                "Through deep research, sharp analysis, and strategic design, vision becomes structure—turning potential into direction, and ambition into action.",
              )}
            </p>
            <p className="text-gray-800 font-normal">
              {renderTextWithStyledDash(
                "Beyond client work, Sotrixa invests in artistic and educational initiatives, giving under-resourced children access to imagination, learning, and creative self-expression. Because the future needs more creators—and every child deserves a space to dream.",
              )}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
