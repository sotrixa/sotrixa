"use client";

import { motion } from "framer-motion";

const desktopIconPulseAnimation = {
  opacity: [0.8, 0.1, 0.8],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

const mobileIconPulseAnimation = {
  opacity: [0.8, 0.1, 0.8],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut",
  },
};
import Section from "../../components/layout/Section";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { getText } from "../../data/translations";
import ReactDOM from "react-dom";

export default function IntroSection() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoHovered, setIsVideoHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const desktopVideoRef = useRef<HTMLVideoElement>(null);

  // Auto-focus the video when it starts playing
  useEffect(() => {
    if (isVideoPlaying) {
      // Short delay to ensure DOM is ready
      setTimeout(() => {
        // Focus the appropriate video ref based on viewport size
        if (window.innerWidth >= 768) {
          desktopVideoRef.current?.focus();
        } else {
          videoRef.current?.focus();
        }
      }, 100);
    }
  }, [isVideoPlaying]);

  // Prevent body scrolling when video is playing on mobile
  useEffect(() => {
    if (isVideoPlaying) {
      // Save current scroll position
      const scrollY = window.scrollY;
      // Add styles to body
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.top = `-${scrollY}px`;
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
      }
    }
  }, [isVideoPlaying]);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsVideoPlaying(true);

    // Wait for state update then play video
    setTimeout(() => {
      // Play the appropriate video based on viewport size
      if (window.innerWidth >= 768) {
        if (desktopVideoRef.current) {
          desktopVideoRef.current.play().catch((error) => {
            console.error("Desktop video playback failed:", error);
          });
        }
      } else {
        if (videoRef.current) {
          videoRef.current.play().catch((error) => {
            console.error("Mobile video playback failed:", error);
          });
        }
      }
    }, 50);
  };

  const handleCloseVideo = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Pause and reset both videos
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }

    if (desktopVideoRef.current) {
      desktopVideoRef.current.pause();
      desktopVideoRef.current.currentTime = 0;
    }

    setIsVideoPlaying(false);
  };

  const renderColoredText = (text: string) => {
    // Parse the colored text exactly like CaseStudySection
    const colorPattern = /\{\{([^:]+):([^}]+)\}\}/g;
    const coloredWords: { word: string; color: string }[] = [];

    let match;
    let plainText = text;

    while ((match = colorPattern.exec(text)) !== null) {
      const [fullMatch, word, color] = match;
      coloredWords.push({ word, color });
      plainText = plainText.replace(fullMatch, word);
    }

    // Render using the same logic as CaseStudySection
    let lastIndex = 0;
    const elements: React.ReactNode[] = [];

    // Sort colored words by their position in the original text
    const sortedWords = [...coloredWords].sort(
      (a, b) => plainText.indexOf(a.word) - plainText.indexOf(b.word),
    );

    // Process each colored word
    sortedWords.forEach(({ word, color }, i) => {
      const wordIndex = plainText.indexOf(word, lastIndex);

      // Add text before the colored word
      if (wordIndex > lastIndex) {
        const textBefore = plainText.substring(lastIndex, wordIndex);
        // Check if text contains em dash and style it smaller
        if (textBefore.includes("—")) {
          const parts = textBefore.split("—");
          elements.push(<span key={`text-${i}-before`}>{parts[0]}</span>);
          elements.push(
            <span
              key={`dash-${i}`}
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
          if (parts[1])
            elements.push(<span key={`text-${i}-after`}>{parts[1]}</span>);
        } else {
          elements.push(<span key={`text-${i}`}>{textBefore}</span>);
        }
      }

      // Add the colored word
      elements.push(
        <span key={`colored-${i}`} style={{ color }}>
          {word}
        </span>,
      );

      lastIndex = wordIndex + word.length;
    });

    // Add any remaining text
    if (lastIndex < plainText.length) {
      const remainingText = plainText.substring(lastIndex);
      // Check if remaining text contains em dash and style it smaller
      if (remainingText.includes("—")) {
        const parts = remainingText.split("—");
        elements.push(<span key="text-end-before">{parts[0]}</span>);
        elements.push(
          <span
            key="dash-end"
            style={{
              fontSize: "0.6em",
              fontWeight: "200",
              transform: "scaleX(0.5)",
              display: "inline-block",
            }}
          >
            –
          </span>,
        );
        if (parts[1])
          elements.push(<span key="text-end-after">{parts[1]}</span>);
      } else {
        elements.push(<span key="text-end">{remainingText}</span>);
      }
    }

    return elements;
  };

  const renderTestimonialWithStyledDash = (text: string) => {
    // Apply the same dash styling to testimonial text
    if (text.includes("—")) {
      const parts = text.split("—");
      return (
        <>
          {parts[0]}
          <span
            style={{
              fontSize: "1em",
              fontWeight: "200",
              transform: "scaleX(0.5)",
              display: "inline-block",
            }}
          >
            –
          </span>
          {parts[1]}
        </>
      );
    }
    return text;
  };

  const renderTestimonial = (text: string) => {
    // Split "The Lab by SOTRIXA" to format it properly
    if (text.includes("by SOTRIXA")) {
      return (
        <>
          <span className="text-[#76cccb] font-extrabold text-2xl">
            THE LAB
          </span>
          <br />
          <span className="text-[#583c48] text-base font-extrabold">
            BY SOTRIXA
          </span>
        </>
      );
    }
    // Apply dash styling for other testimonial text
    return renderTestimonialWithStyledDash(text);
  };

  // Split the title into two parts
  const titleText = getText("introSection.title", "en").split("\n");
  const firstLine = titleText[0] || "";
  const secondLine = titleText[1] || "";
  // Join both lines for rendering - no space needed since secondLine starts with dash
  const fullTitle = `${firstLine}${secondLine}`.trim();
  const subheadingText = getText("introSection.subheading", "en");
  const testimonialText = getText("introSection.testimonial", "en");

  // Conditionally render the video player or the image for desktop
  const renderVideoContent = () => {
    if (isVideoPlaying) {
      return (
        <div
          className="relative w-full h-full bg-black rounded-xl overflow-hidden shadow-lg z-20"
          onMouseEnter={() => setIsVideoHovered(true)}
          onMouseLeave={() => setIsVideoHovered(false)}
        >
          <button
            className="absolute top-4 right-4 bg-white/90 rounded-full cursor-pointer p-2 hover:bg-white transition-colors z-10 shadow-lg focus:outline-none focus:ring-2 focus:ring-white group"
            onClick={handleCloseVideo}
            aria-label="Close video"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6 text-black group-hover:scale-110 transition-transform"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <video
            ref={desktopVideoRef}
            className="w-full h-full object-cover rounded-xl"
            controls={isVideoHovered}
            autoPlay
            playsInline
            onError={() => console.error("Desktop video failed to load")}
            tabIndex={0}
          >
            <source src="/video/Sotrixa-final.mp4" type="video/mp4" />
            <p className="p-4 text-white text-center">
              Your browser does not support the video tag. Please use a modern
              browser to view this video.
            </p>
          </video>
        </div>
      );
    }

    return (
      <>
        {/* Desktop-only image */}
        <div className="hidden md:block relative w-full aspect-video">
          <Image
            src="/About-us-cover.svg"
            alt="Sotrixa research visualization"
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        {/* Desktop-only play button - centered on thumbnail */}
        <div className="absolute inset-0 hidden md:flex items-center justify-center pointer-events-none" style={{ transform: 'translateY(-1.5rem)' }}>
          <div className="pointer-events-auto">
            <button
              type="button"
              className="rounded-full shadow-lg cursor-pointer hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#583c48] group"
              style={{ padding: "clamp(0.25rem, 1vw, 0.75rem)" }}
              onClick={handlePlayClick}
              aria-label="Play Sotrixa introduction video"
            >
              <div
                className="flex items-center justify-center group-hover:scale-110 transition-transform relative"
                style={{
                  width: "clamp(1.25rem, 3vw, 2.5rem)",
                  height: "clamp(1.25rem, 3vw, 2.5rem)",
                }}
              >
                <motion.div
                  className="absolute top-1/2 left-1/2 rounded-full pointer-events-none bg-white -translate-x-1/2 -translate-y-1/2"
                  style={{
                    width: "clamp(2rem, 5vw, 3.5rem)",
                    height: "clamp(2rem, 5vw, 3.5rem)",
                  }}
                  animate={desktopIconPulseAnimation}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-[#583c48] relative z-10"
                  style={{
                    width: "clamp(0.875rem, 2.5vw, 1.75rem)",
                    height: "clamp(0.875rem, 2.5vw, 1.75rem)",
                  }}
                >
                  <path d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </>
    );
  };

  // Mobile fullscreen video overlay
  const renderMobileVideoOverlay = () => {
    if (!isVideoPlaying) return null;
    // Only render on mobile to prevent duplicate video elements
    if (typeof window !== "undefined" && window.innerWidth >= 768) return null;

    // Use portal to render the overlay at the document body level
    return ReactDOM.createPortal(
      <div
        className="fixed inset-0 z-[9999] bg-black/35 flex items-center justify-center md:hidden"
        style={{ top: 0, left: 0, right: 0, bottom: 0 }}
      >
        <div
          className="relative w-[90%] aspect-video mx-auto max-w-lg max-h-[80vh]"
          onMouseEnter={() => setIsVideoHovered(true)}
          onMouseLeave={() => setIsVideoHovered(false)}
        >
          <button
            className="absolute top-4 right-4 bg-white/90 rounded-full cursor-pointer p-2 z-10 shadow-lg focus:outline-none focus:ring-2 focus:ring-white group"
            onClick={handleCloseVideo}
            aria-label="Close video"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 text-black group-hover:scale-110 transition-transform"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <video
            ref={videoRef}
            className="w-full h-full object-contain"
            controls={isVideoHovered}
            autoPlay
            playsInline
            onError={() => console.error("Mobile video failed to load")}
            tabIndex={0}
          >
            <source src="/video/Sotrixa-final-subs.mp4" type="video/mp4" />
            <p className="p-4 text-white text-center">
              Your browser does not support the video tag. Please use a modern
              browser to view this video.
            </p>
          </video>
        </div>
      </div>,
      document.body,
    );
  };

  return (
    <>
      {/* Mobile fullscreen video overlay */}
      {renderMobileVideoOverlay()}

      <Section id="intro" className="bg-[#FAFAFA] text-black relative">
        {/* Mobile-only background image */}
        <div
          className="md:hidden absolute inset-0 z-0"
          style={{
            backgroundImage: "url(/intro-section.webp)",
            backgroundSize: "cover",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
            opacity: 0.4,
          }}
        />

        <div
          className="flex flex-col lg:flex-row gap-[clamp(1.5rem,8vw,3rem)] relative z-10 items-center justify-center w-screen h-screen"
          style={{
            minWidth: "100vw",
            minHeight: "100vh",
            padding: "2rem 1rem",
          }}
        >
          <div className="flex-1 flex flex-col items-start min-w-0 min-h-0 justify-center">
            <motion.div
              className="w-full text-left min-w-0"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <h1
                className="font-black block text-left m-0 w-full min-w-0 px-2 xs:px-4 sm:px-5 md:px-5 lg:px-6 xl:px-8"
                style={{
                  fontSize: "clamp(1rem, 4vw, 5rem)",
                  lineHeight: 1.1,
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                }}
              >
                {renderColoredText(fullTitle)}
              </h1>

              {/* Subheading in its own row */}
              <div className="w-full mt-6 min-w-0">
                <p
                  className="text-left w-full min-w-0 m-0 px-2 xs:px-4 sm:px-5 md:px-5 lg:px-6 xl:px-8"
                  style={{
                    fontSize: "clamp(0.875rem, 1.8vw, 1.125rem)",
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                  }}
                >
                  {subheadingText}
                </p>

                {/* Mobile-only play button */}
                <button
                  type="button"
                  className="block md:hidden bg-white rounded-full shadow-lg cursor-pointer hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#d142e2] group"
                  style={{
                    marginTop: "clamp(0.5rem, 2vh, 1rem)",
                    padding: "clamp(0.5rem, 1vw, 0.75rem)",
                  }}
                  onClick={handlePlayClick}
                  aria-label="Play Sotrixa introduction video"
                >
                  <div
                    className="flex items-center justify-center group-hover:scale-110 transition-transform relative"
                    style={{
                      width: "clamp(1.5rem, 3vw, 2rem)",
                      height: "clamp(1.5rem, 3vw, 2rem)",
                    }}
                  >
                    <motion.div
                      className="absolute top-1/2 left-1/2 rounded-full pointer-events-none bg-white -translate-x-1/2 -translate-y-1/2"
                      style={{
                        width: "clamp(2.5rem, 5vw, 3rem)",
                        height: "clamp(2.5rem, 5vw, 3rem)",
                      }}
                      animate={mobileIconPulseAnimation}
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="text-[#d142e2] relative z-10"
                      style={{
                        width: "clamp(0.75rem, 2vw, 1.25rem)",
                        height: "clamp(0.75rem, 2vw, 1.25rem)",
                      }}
                    >
                      <path d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" />
                    </svg>
                  </div>
                </button>
              </div>

              {/* Mobile-only testimonial */}
              <div className="block md:hidden mt-6">
                <p
                  className="leading-tight py-2 px-0 text-left"
                  style={{
                    fontSize: "clamp(0.75rem, 1.5vw, 0.875rem)",
                  }}
                >
                  {renderTestimonial(testimonialText)}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Desktop-only video container with proper spacing */}
          <motion.div
            className="hidden md:block relative flex-1 min-w-0 min-h-0 overflow-hidden"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="relative">
              <div style={{ aspectRatio: "16/9" }}>{renderVideoContent()}</div>

              {/* Desktop-only testimonial */}
              <div className="hidden md:block text-center">
                <div className="mt-0">
                  <p
                    className="max-w-xl mx-auto -mt-8"
                    style={{
                      fontSize: "clamp(0.875rem, 2vw, 1.125rem)",
                    }}
                  >
                    {renderTestimonial(testimonialText)}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>
    </>
  );
}
