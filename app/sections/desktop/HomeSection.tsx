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
  const { language } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // No fixed heights needed - let content flow naturally with flex

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
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

    // Short delay to ensure DOM is fully rendered
    const animationTimeout = setTimeout(() => {
      if (!containerRef.current) return;

      try {
        // Create main timeline
        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
        });

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
          className="relative w-full aspect-square rounded-lg overflow-hidden"
          style={{
            maxWidth: "clamp(0rem, 42vw, 55rem)",
            clipPath: "inset(0 round 0.5rem)",
            marginTop: "clamp(-5.5rem, -15vw, -10rem)",
          }}
        >
          <video
            src="/video/0223.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="absolute -inset-[2px] w-[calc(91%+4px)] h-[calc(91%+4px)] object-contaign block p-0 border-0 outline-none"
          />
        </div>
      </div>
    </div>
  );
}
