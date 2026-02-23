"use client";

import { useState, useRef, RefObject, useEffect } from "react";
import { GsapHorizontalScrollProps } from "../scroll/types";
import { useNavigationControls } from "../scroll/useNavigationControls";
import { useScrollSetup } from "../scroll/useScrollSetup";
import { useScrollInitializer } from "../scroll/useScrollInitializer";
import { useEventHandlers } from "../scroll/useEventHandlers";
import ScrollNavigation from "../scroll/ScrollNavigation";
import gsap from "gsap";
import Image from "next/image";

type HTMLDivRef = RefObject<HTMLDivElement>;

// Define type for horizontal scroll controls
interface HorizontalScrollControls {
  nextPanel: () => void;
  prevPanel: () => void;
  navigateToPanel: (index: number) => void;
  activeIndex: number;
}

// Extend Window interface
declare global {
  interface Window {
    horizontalScrollControls?: HorizontalScrollControls;
  }
}

export default function GsapHorizontalScroll({
  children,
}: GsapHorizontalScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [needsVerticalScroll, setNeedsVerticalScroll] = useState(false);

  // Loading animation refs
  const loadingRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const sloganRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);

  // Get the total number of sections
  const sectionsCount = Array.isArray(children) ? children.length : 1;

  // Set up navigation controls
  const {
    activeIndex,
    isAnimating,
    sectionsRef,
    wrapperRef,
    navigateToPanel,
    nextPanel,
    prevPanel,
  } = useNavigationControls(sectionsCount);

  // Initialize GSAP
  useScrollSetup();

  // Initialize scroll setup
  useScrollInitializer({
    containerRef: containerRef as HTMLDivRef,
    wrapperRef,
    sectionsRef,
    navigateToPanel,
    nextPanel,
    prevPanel,
    activeIndex,
    isAnimating,
    sectionsCount,
    setIsInitialized,
  });

  // Set up event handlers
  useEventHandlers({
    containerRef: containerRef as HTMLDivRef,
    sectionsRef,
    activeIndex,
    isAnimating,
    nextPanel,
    prevPanel,
    navigateToPanel,
  });

  // Animate loading screen
  useEffect(() => {
    if (!isInitialized && loadingRef.current) {
      // Simple fade-in animation for loading elements
      gsap.to([logoRef.current, sloganRef.current, dotsRef.current], {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
      });
    }
  }, [isInitialized]);

  // Check if vertical scroll is needed based on viewport height
  useEffect(() => {
    const checkVerticalScroll = () => {
      if (typeof window !== "undefined") {
        const viewportHeight = window.innerHeight;
        const restrictiveThreshold = 800; // Match HeightLocker min-height
        const needsScroll = viewportHeight < restrictiveThreshold;

        // Also check if there's actually scrollable content
        if (containerRef.current && needsScroll) {
          const container = containerRef.current;
          const hasScrollableContent =
            container.scrollHeight > container.clientHeight;
          setNeedsVerticalScroll(needsScroll && hasScrollableContent);
        } else {
          setNeedsVerticalScroll(false);
        }
      }
    };

    checkVerticalScroll();
    window.addEventListener("resize", checkVerticalScroll);

    return () => {
      window.removeEventListener("resize", checkVerticalScroll);
    };
  }, []);

  // Expose navigation controls for other components to use
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.horizontalScrollControls = {
        nextPanel,
        prevPanel,
        navigateToPanel,
        activeIndex: activeIndex.current,
      };
    }

    return () => {
      if (typeof window !== "undefined") {
        delete window.horizontalScrollControls;
      }
    };
  }, [navigateToPanel, nextPanel, prevPanel, activeIndex]);

  return (
    <>
      {/* Main container */}
      <div
        ref={containerRef}
        className={`fixed inset-0 w-screen h-screen ${needsVerticalScroll ? "overflow-x-auto overflow-y-auto" : "overflow-x-hidden overflow-y-hidden"}`}
      >
        {/* Horizontal scroll wrapper */}
        <div
          ref={wrapperRef}
          className="flex flex-nowrap"
          style={{
            willChange: "transform",
            transform: "translateX(0px)",
            width: `${sectionsCount * 100}vw`,
            height: "100%",
          }}
        >
          {/* Sections container */}
          <div
            ref={sectionsRef}
            className="flex flex-nowrap"
            style={{ width: `${sectionsCount * 100}vw`, height: "100%" }}
          >
            {children}
          </div>
        </div>
      </div>

      {/* Navigation components */}
      <ScrollNavigation />

      {/* Loading Screen - hidden on mobile */}
      {!isInitialized && (
        <div
          ref={loadingRef}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black hidden lg:flex"
        >
          {/* Main content container */}
          <div className="text-center px-8 max-w-2xl mx-auto">
            {/* Logo */}
            <div className="mb-8 flex justify-center">
              <Image
                ref={logoRef}
                src="/sotrixa-logo.webp"
                alt="Sotrixa Logo"
                width={200}
                height={100}
                className="opacity-0"
                priority
              />
            </div>

            {/* Slogan */}
            <div ref={sloganRef} className="mb-8 opacity-0">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                We are a strategy lab for{" "}
                <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  visionary thinkers
                </span>
              </h2>
              <p className="text-gray-400 text-lg">
                Crafting experiences that matter
              </p>
            </div>

            {/* Loading dots */}
            <div
              ref={dotsRef}
              className="flex justify-center space-x-2 opacity-0"
            >
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
