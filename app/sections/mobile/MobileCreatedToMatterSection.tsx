"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";

export default function MobileCreatedToMatterSection() {
  const backgroundRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Function to render text with styled dashes - EXACT SAME AS DESKTOP
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

  // Animate the background grid - EXACT SAME AS DESKTOP
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

  // Animate content entrance - EXACT SAME AS DESKTOP
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
      className="bg-[#FAFAFA] text-black relative overflow-hidden py-10 px-4"
    >
      {/* Minimalist grid background - EXACT SAME AS DESKTOP */}
      <div
        ref={backgroundRef}
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
						linear-gradient(to right, rgba(150,150,150,0.15) 1px, transparent 1px),
						linear-gradient(to bottom, rgba(150,150,150,0.15) 1px, transparent 1px)
					`,
          backgroundSize: "40px 40px",
          backgroundPosition: "0 0",
        }}
      >
        {/* Gear-like decorative elements - EXACT SAME AS DESKTOP */}
        <div className="absolute top-[20%] left-[15%] w-[60px] h-[60px] border-2 border-gray-300 rounded-full opacity-25 transform rotate-45"></div>
        <div className="absolute top-[15%] left-[12%] w-[40px] h-[40px] border-2 border-gray-300 rounded-full opacity-20"></div>
        <div className="absolute bottom-[25%] right-[10%] w-[80px] h-[80px] border-2 border-gray-300 rounded-full opacity-25 transform -rotate-12"></div>

        {/* Abstract lines - EXACT SAME AS DESKTOP */}
        <div className="absolute top-[30%] left-0 w-[25%] h-[2px] bg-gradient-to-r from-transparent via-gray-400 to-transparent opacity-30"></div>
        <div className="absolute bottom-[40%] right-0 w-[30%] h-[2px] bg-gradient-to-l from-transparent via-gray-400 to-transparent opacity-30"></div>

        {/* Dots grid in one corner - EXACT SAME AS DESKTOP */}
        <div
          className="absolute top-0 right-0 w-[100px] h-[100px] opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(100,100,100,0.7) 2px, transparent 2px)",
            backgroundSize: "20px 20px",
          }}
        ></div>
      </div>

      <div className="relative z-10 w-full">
        {/* Content */}
        <div ref={contentRef} className="space-y-6">
          {/* Title section - EXACT SAME CONTENT AS DESKTOP */}
          <div ref={titleRef} className="text-left mb-5">
            <h1
              className="font-bold m-0"
              style={{
                fontSize: "clamp(1.3rem, 5vw, 2rem)",
                lineHeight: 1.1,
              }}
            >
              <span>Created to </span>
              <span style={{ color: "#d142e2" }}>Matter</span>
            </h1>
            <div className="h-1 w-20 bg-gradient-to-r from-[#f4dd65] via-[#d142e2] to-[#70DFC6] rounded-full mt-3"></div>
          </div>

          {/* First content block - EXACT SAME CONTENT AS DESKTOP */}
          <motion.div
            className="text-sm leading-relaxed space-y-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-gray-800">
              {renderTextWithStyledDash(
                "Empowering bold ideas with strategies that align vision, purpose, and growth. Sotrixa partners with visionary entrepreneurs, creatives, and changemakers—those building with purpose and seeking clarity along the way.",
              )}
            </p>
            <p className="text-gray-800">
              {renderTextWithStyledDash(
                "We work closely to translate bold ideas into aligned, authentic strategies that are ready for real-world growth.",
              )}
            </p>
          </motion.div>

          {/* Second content block - EXACT SAME CONTENT AS DESKTOP */}
          <motion.div
            className="text-sm leading-relaxed space-y-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-gray-800">
              {renderTextWithStyledDash(
                "Through deep research, sharp analysis, and strategic design, vision becomes structure—turning potential into direction, and ambition into action.",
              )}
            </p>
            <p className="text-gray-800">
              {renderTextWithStyledDash(
                "Beyond client work, Sotrixa invests in artistic and educational initiatives, giving under- resourced children access to imagination, learning, and creative self-expression. Because the future needs more creators—and every child deserves a space to dream.",
              )}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
