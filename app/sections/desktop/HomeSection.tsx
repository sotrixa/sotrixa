"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useLanguage } from "../../data/LanguageContext";
import { getText } from "../../data/translations";

// Extend Window interface for navigation controls
declare global {
  interface Window {
    horizontalScrollControls?: {
      navigateToPanel: (index: number) => void;
      nextPanel: () => void;
      prevPanel: () => void;
      activeIndex: number;
    };
  }
}

export default function HomeSection() {
  const [windowWidth, setWindowWidth] = useState(0);
  const { language } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // No fixed heights needed - let content flow naturally with flex

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      // Consistent with main page mobile detection
      setIsMobile(width < 1024);
    };

    // Initial call
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // GSAP animation effect
  useEffect(() => {
    // Skip on server side
    if (typeof window === "undefined") return;

    // Immediately hide grid elements on mount to prevent flash
    if (gridRef.current) {
      const columns = gridRef.current.querySelectorAll("[data-grid-column]");
      gsap.set(columns, { autoAlpha: 0 });
    }

    // Short delay to ensure DOM is fully rendered
    const animationTimeout = setTimeout(() => {
      if (!containerRef.current) return;

      try {
        // Create main timeline
        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
        });

        // Grid animation
        if (gridRef.current) {
          const columns =
            gridRef.current.querySelectorAll("[data-grid-column]");
          // Use fewer columns on mobile for better performance
          const visibleColumns = isMobile
            ? Array.from(columns).slice(0, isMobile ? 10 : 20)
            : columns;

          tl.fromTo(
            visibleColumns,
            { autoAlpha: 0 },
            { autoAlpha: 1, stagger: 0.03, duration: 0.5 },
          );
        }

        // Heading parts animation without hiding content first
        if (headingRef.current) {
          const parts = headingRef.current.querySelectorAll("span");
          // Just add a subtle animation without hiding text
          tl.fromTo(
            parts,
            { y: 10, scale: 0.95 },
            { y: 0, scale: 1, stagger: 0.15, duration: 0.8 },
            0.3,
          );
        }

        // Subheading animation - start from visible but slightly offset
        if (subheadingRef.current) {
          tl.fromTo(
            subheadingRef.current,
            { y: 10 },
            { y: 0, duration: 0.7 },
            "-=0.4",
          );
        }

        // Paragraph animation - start from visible but slightly offset
        tl.fromTo(
          paragraphRef.current,
          { y: 10 },
          { y: 0, duration: 0.6 },
          "-=0.3",
        );

        // Buttons animation - start from visible but slightly offset
        tl.fromTo(
          buttonsRef.current,
          { y: 10 },
          { y: 0, duration: 0.5 },
          "-=0.2",
        );

        // Video container animation - start from visible but slightly offset
        // Simple fade in animation for desktop (no horizontal movement)
        if (!isMobile) {
          tl.fromTo(
            videoContainerRef.current,
            { autoAlpha: 0.8, scale: 1.05 },
            { autoAlpha: 1, scale: 1, duration: 1 },
            "-=0.8",
          );
        } else {
          // For mobile, fade in the background video with a slight scale effect
          tl.fromTo(
            videoContainerRef.current,
            { autoAlpha: 0.7, scale: 1.05 },
            { autoAlpha: 1, scale: 1, duration: 1 },
            "-=0.8",
          );
        }

        // Add a cool scale effect to the whole container
        tl.from(
          containerRef.current,
          {
            scale: isMobile ? 1.02 : 1.05, // Smaller scale effect on mobile
            duration: isMobile ? 1 : 1.5,
            ease: "power2.out",
          },
          0,
        );

        // Ensure animation plays
        tl.play();
      } catch (error) {
        console.error("Animation error:", error);
      }
    }, 100);

    return () => clearTimeout(animationTimeout);
  }, [isMobile]);

  // Ensure video loops continuously
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleVideoEnd = () => {
      video.currentTime = 0;
      video.play().catch(console.error);
    };

    const handleVideoError = () => {
      // Retry playing the video if there's an error
      setTimeout(() => {
        video.play().catch(console.error);
      }, 1000);
    };

    video.addEventListener("ended", handleVideoEnd);
    video.addEventListener("error", handleVideoError);

    // Ensure video plays initially
    video.play().catch(console.error);

    return () => {
      video.removeEventListener("ended", handleVideoEnd);
      video.removeEventListener("error", handleVideoError);
    };
  }, []);

  const getBlocks = () => {
    // Fewer blocks on mobile for better performance
    const blockSize = isMobile ? windowWidth * 0.03 : windowWidth * 0.02;
    const nbOfBlocks = Math.ceil(window.innerHeight / blockSize);
    const limitedBlocks = isMobile ? Math.min(nbOfBlocks, 15) : nbOfBlocks;

    return [...Array(limitedBlocks).keys()].map((_, index) => {
      return (
        <div
          key={index}
          className="flex-1 w-full transition-colors duration-300"
          onMouseEnter={(e) => colorize(e.target as HTMLDivElement)}
        />
      );
    });
  };

  const colorize = (el: HTMLDivElement) => {
    el.style.backgroundColor = "black";
    setTimeout(() => {
      el.style.backgroundColor = "transparent";
    }, 300);
  };

  return (
    <div
      id="home"
      ref={containerRef}
      className="bg-[#fbfbfb] relative px-[clamp(1rem,3vw,2rem)] py-[clamp(2rem,5vh,3rem)] flex items-center justify-center w-screen h-screen"
      style={{
        minWidth: "100vw",
        minHeight: "100vh",
      }}
    >
      <div
        className="flex flex-col md:flex-row items-stretch justify-center gap-[clamp(1.5rem,8vw,3rem)] w-full"
        style={{ height: "70vh" }}
      >
        <div
          ref={bodyRef}
          className="flex-1 flex flex-col items-start min-w-0 justify-start"
          style={{ paddingTop: "15vh" }}
        >
          <h1
            ref={headingRef}
            className="font-black text-left w-full min-w-0 m-0 px-2 xs:px-0 sm:px-0 md:px-0 lg:px-0 xl:px-0"
            style={{
              fontSize: "clamp(1rem, 4vw, 5rem)",
              lineHeight: 1.1,
              wordBreak: "break-word",
              overflowWrap: "break-word",
            }}
          >
            {isMobile ? (
              // Simplified layout for mobile
              <>
                <span className="text-black">We are a </span>
                <span style={{ color: "#53EBDD" }}>strategy lab</span>
                <span className="text-black"> for </span>
                <span style={{ color: "#DD53EB" }}>visionary</span>
                <span className="text-black"> </span>
                <span style={{ color: "#EBDD53" }}>thinkers</span>
              </>
            ) : (
              // Original layout for desktop
              <>
                <span className="text-black">We are a </span>
                <span style={{ color: "#53EBDD" }}>strategy</span>
                <span className="text-black"> lab for </span>
                <span style={{ color: "#DD53EB" }}>visionary</span>
                <span className="text-black"> </span>
                <span style={{ color: "#EBDD53" }}>thinkers</span>
              </>
            )}
          </h1>

          <p
            ref={paragraphRef}
            className="leading-relaxed font-normal pointer-events-auto text-left w-full min-w-0 m-0 px-2 xs:px-0 sm:px-0 md:px-0 lg:px-0 xl:px-0 break-words text-black pt-4"
            style={{
              fontSize: "clamp(0.8rem, 1.5vw, 1.35rem)",
            }}
          >
            {getText("homeSection.paragraph", language)}
          </p>
          <div
            ref={buttonsRef}
            className="flex pointer-events-auto flex-wrap gap-[clamp(1rem,3vw,2rem)] px-2 xs:px-0 sm:px-0 md:px-0 lg:px-0 xl:px-0 mt-4"
          >
            <button
              className="font-medium cursor-pointer bg-transparent border-none p-0 hover:underline text-black"
              style={{ fontSize: "clamp(0.85rem, 1.5vw, 1rem)" }}
              onClick={() => {
                // Navigate to Contact section (index 4)
                if (window.horizontalScrollControls) {
                  window.horizontalScrollControls.navigateToPanel(4);
                }
              }}
            >
              {getText("homeSection.talkToUs", language)}
            </button>
            <button
              className="font-medium cursor-pointer bg-transparent border-none p-0 hover:underline text-black"
              style={{ fontSize: "clamp(0.85rem, 1.5vw, 1rem)" }}
              onClick={() => {
                // Navigate to Services section (index 2)
                if (window.horizontalScrollControls) {
                  window.horizontalScrollControls.navigateToPanel(2);
                }
              }}
            >
              What we do
            </button>
            <button
              className="font-medium cursor-pointer bg-transparent border-none p-0 hover:underline text-black"
              style={{ fontSize: "clamp(0.85rem, 1.5vw, 1rem)" }}
              onClick={() => {
                // Navigate to Case Study section (index 3)
                if (window.horizontalScrollControls) {
                  window.horizontalScrollControls.navigateToPanel(3);
                }
              }}
            >
              {getText("homeSection.seeOurWork", language)}
            </button>
          </div>
        </div>

        <div
          ref={videoContainerRef}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minWidth: 0,
            justifyContent: "center",
            position: "relative",
            ...(isMobile ? {} : { marginTop: "-10vh" }),
          }}
        >
          <video
            className="object-contain p-0 block"
            style={{
              width: "100%",
              height: "auto",
              maxHeight: "100vh",
              aspectRatio: "16/9",
              border: "none",
              outline: "none",
              boxShadow: "none",
              display: "block",
            }}
            autoPlay
            loop
            muted
            playsInline
            ref={videoRef}
          >
            <source
              src={
                isMobile
                  ? "/video/Sotrixa Home Page Animation.mp4"
                  : "/video/Sotrixa Home Page Animation.mp4"
              }
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
          {/* Overlay frame to cover video edge rendering artifacts */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              boxShadow: "inset 0 0 0 5px #fbfbfb",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />
        </div>
      </div>

      <div
        ref={gridRef}
        className="absolute top-0 left-0 h-full w-full grid grid-cols-[repeat(40,1fr)] -z-[1] pointer-events-none max-md:-z-[2] max-[1024px]:grid-cols-[repeat(10,1fr)]"
      >
        {windowWidth > 0 &&
          [...Array(isMobile ? 10 : 40).keys()].map((_, index) => (
            <div
              key={"b_" + index}
              data-grid-column
              className="h-full flex flex-col opacity-0"
            >
              {getBlocks()}
            </div>
          ))}
      </div>
    </div>
  );
}
