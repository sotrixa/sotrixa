"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Section from "../../components/layout/Section";
import { motion } from "framer-motion";
import { useScrollHandler } from "./ServicesSection/hooks/useScrollHandler";
import { useAnimations } from "./ServicesSection/hooks/useAnimations";
import { gsap } from "gsap";
import ServiceInfoSection from "./ServiceInfoSection";
import { getText, parseColoredText, Language } from "../../data/translations";

// Get Timeline type from gsap
type Timeline = ReturnType<typeof gsap.timeline>;

// Declare global window properties
declare global {
  interface Window {
    servicesHasControl?: boolean;
    navigateToPanel?: (index: number) => void;
    playServiceInfoExitAnimation?: () => Timeline | undefined;
  }
}

export default function ServicesSection() {
  const servicesRef = useRef<HTMLDivElement>(null);
  const serviceItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const gifRef = useRef<HTMLDivElement>(null);
  const sectionContainerRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const [activeServiceIndex, setActiveServiceIndex] = useState(-1);
  const [showServiceInfo, setShowServiceInfo] = useState(false);
  const [language] = useState<Language>("en");
  const services = [
    "RESEARCH",
    "BUSINESS ARCHITECTURE",
    "BESPOKE STRATEGY CREATION",
    "BRAND STORYTELLING",
    "MARKETING",
    "WEBSITE DEVELOPMENT",
  ];

  const sectionIndex = 2; // Position of services section in the page layout
  const hasCompletedServices = useRef(false);
  const isAnimating = useRef(false);
  const isScrolling = useRef(false);

  // Get title and subtitle from translations
  const titleTranslation = getText("servicesSection.title", language);
  const subtitleTranslation = getText("servicesSection.subtitle", language);

  // Parse the colored text in title
  const { text: rawTitleText, coloredWords } =
    parseColoredText(titleTranslation);

  // Debounced service index setter to prevent rapid changes
  const debouncedSetActiveServiceIndex = useCallback(
    (value: React.SetStateAction<number>) => {
      if (isScrolling.current) return;

      isScrolling.current = true;
      setActiveServiceIndex(value);

      // Reset scrolling flag after animation completes
      setTimeout(() => {
        isScrolling.current = false;
      }, 700); // Slightly longer than animation duration
    },
    [],
  );

  // Ensure first service is active when component mounts or section changes
  useEffect(() => {
    // Don't set an active index initially
    // setActiveServiceIndex(0);
  }, []);

  // Use custom hooks for scroll handling and animations
  useScrollHandler({
    activeServiceIndex,
    setActiveServiceIndex: debouncedSetActiveServiceIndex,
    services,
    sectionIndex,
    isAnimating,
    hasCompletedServices,
    isDetailView: false,
  });

  // Initialize animations
  useAnimations({
    activeServiceIndex,
    serviceItemsRef,
    servicesRef,
    services,
    isAnimating,
  });



  // Get random position within boundaries
  const getRandomPosition = () => {
    // Ensure values stay within the screen boundaries (with padding)
    const maxX = 80; // Max percentage of screen width
    const maxY = 70; // Max percentage of screen height
    const minX = 10; // Min percentage from left
    const minY = 10; // Min percentage from top

    return {
      x: Math.floor(Math.random() * (maxX - minX) + minX),
      y: Math.floor(Math.random() * (maxY - minY) + minY),
    };
  };

  // GSAP Floating Animation for GIF
  useEffect(() => {
    if (!gifRef.current || !sectionContainerRef.current) return;

    // Kill any existing animations
    gsap.killTweensOf(gifRef.current);

    // Get random initial position
    const initialPos = getRandomPosition();

    // Create floating animation
    const tl = gsap.timeline({
      repeat: -1,
      repeatRefresh: true, // Get fresh random values on each repeat
      onRepeat: () => {
        // Change GIF positions more dramatically on each loop
        const newPos = getRandomPosition();
        gsap.to(gifRef.current, {
          left: `${newPos.x}%`,
          top: `${newPos.y}%`,
          duration: 8,
          ease: "power1.inOut",
        });
      },
    });

    // Set initial position
    gsap.set(gifRef.current, {
      left: `${initialPos.x}%`,
      top: `${initialPos.y}%`,
      xPercent: -50, // Center the element horizontally
      yPercent: -50, // Center the element vertically
      rotate: Math.random() * 10 - 5,
    });

    // Floating animation
    tl.to(gifRef.current, {
      x: "+=50",
      y: "-=30",
      rotate: Math.random() * 10 - 5,
      duration: 5 + Math.random() * 2,
      ease: "sine.inOut",
    })
      .to(gifRef.current, {
        x: "-=70",
        y: "+=60",
        rotate: Math.random() * 10 - 5,
        duration: 6 + Math.random() * 2,
        ease: "sine.inOut",
      })
      .to(gifRef.current, {
        x: "+=20",
        y: "-=30",
        rotate: Math.random() * 10 - 5,
        duration: 4 + Math.random() * 2,
        ease: "sine.inOut",
      });

    return () => {
      tl.kill();
    };
  }, [activeServiceIndex]);

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

  // Handle service selection
  const handleServiceClick = (index: number) => {
    debouncedSetActiveServiceIndex(index);

    // Go directly to ServiceInfoSection instead of showing detail view
    setShowServiceInfo(true);
  };

  // Handle back from service info
  const handleBackFromServiceInfo = () => {
    // Check if the exit animation function is available
    if (typeof window !== "undefined" && window.playServiceInfoExitAnimation) {
      // Run the exit animation and wait for it to complete before switching views
      const tl = window.playServiceInfoExitAnimation();
      if (tl) {
        tl.eventCallback("onComplete", () => {
          setShowServiceInfo(false);
        });
      } else {
        // Fallback if animation fails
        setShowServiceInfo(false);
      }
    } else {
      // Create animation sequence for smooth transition back
      const tl = gsap.timeline({
        onComplete: () => {
          setShowServiceInfo(false);
        },
      });

      // Fade out animation before returning to services
      tl.to(".service-info-container", {
        opacity: 0.8,
        scale: 0.98,
        duration: 0.3,
        ease: "power2.inOut",
      });
    }
  };

  return (
    <>
      {showServiceInfo ? (
        <div className="relative">
          <ServiceInfoSection
            onBackClick={handleBackFromServiceInfo}
            activeService={services[activeServiceIndex]}
          />
        </div>
      ) : (
        <Section
          id="services"
          className="bg-[#FAFAFA] text-black relative overflow-hidden"
        >
          {/* Minimalist grid background */}
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
            {/* Gear-like decorative elements */}
            <div className="absolute top-[20%] left-[15%] w-[clamp(80px,15vw,150px)] aspect-square border-2 border-gray-300 rounded-full opacity-25 transform rotate-45"></div>
            <div className="absolute top-[15%] left-[12%] w-[clamp(60px,12vw,100px)] aspect-square border-2 border-gray-300 rounded-full opacity-20"></div>
            <div className="absolute bottom-[25%] right-[10%] w-[clamp(100px,20vw,200px)] aspect-square border-2 border-gray-300 rounded-full opacity-25 transform -rotate-12"></div>

            {/* Abstract lines */}
            <div className="absolute top-[30%] left-0 w-1/4 h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent opacity-30"></div>
            <div className="absolute bottom-[40%] right-0 w-1/3 h-px bg-gradient-to-l from-transparent via-gray-400 to-transparent opacity-30"></div>

            {/* Dots grid in one corner */}
            <div
              className="absolute top-0 right-0 w-[clamp(150px,30vw,300px)] aspect-square opacity-20"
              style={{
                backgroundImage:
                  "radial-gradient(circle, rgba(100,100,100,0.7) 2px, transparent 2px)",
                backgroundSize: "20px 20px",
              }}
            ></div>
          </div>

          {/* Container div with ref */}
          <div
            ref={sectionContainerRef}
            className="relative px-[clamp(1rem,3vw,2rem)] py-[clamp(2rem,5vh,3rem)] flex items-center justify-center w-screen h-screen"
            style={{ zIndex: 2, minWidth: "100vw", minHeight: "100vh" }}
          >
            {/* Removed the floating GIF section */}

            <div
              className="flex flex-col lg:flex-row items-start lg:items-center justify-center gap-[clamp(1.5rem,10vw,4rem)] w-full"
              style={{ minHeight: "auto" }}
            >
              {/* Left side with colored text */}
              <motion.div
                className="flex-1 min-w-0 min-h-0 flex flex-col justify-center"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.1 }}
              >
                <h1
                  className="mt-2 font-black m-0 w-full text-left min-w-0 px-2 xs:px-2 sm:px-3 md:px-4 lg:px-4 xl:px-4"
                  style={{
                    fontSize: "clamp(1rem, 4vw, 4.5rem)",
                    lineHeight: 1,
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                  }}
                >
                  {/* Enhanced title rendering with proper dash styling */}
                  {(() => {
                    let lastIndex = 0;
                    const elements = [];

                    // Sort colored words by their position in the original text
                    const sortedWords = [...coloredWords].sort(
                      (a, b) =>
                        rawTitleText.indexOf(a.word) -
                        rawTitleText.indexOf(b.word),
                    );

                    // Process each colored word
                    sortedWords.forEach(({ word, color }, i) => {
                      const wordIndex = rawTitleText.indexOf(word, lastIndex);

                      // Add text before the colored word
                      if (wordIndex > lastIndex) {
                        const textBefore = rawTitleText.substring(
                          lastIndex,
                          wordIndex,
                        );
                        // Check if text contains em dash and style it smaller
                        if (textBefore.includes("—")) {
                          const parts = textBefore.split("—");
                          elements.push(
                            <span key={`text-${i}-before`}>{parts[0]}</span>,
                          );
                          elements.push(
                            <span
                              key={`dash-${i}`}
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
                            elements.push(
                              <span key={`text-${i}-after`}>{parts[1]}</span>,
                            );
                        } else {
                          elements.push(
                            <span key={`text-${i}`}>{textBefore}</span>,
                          );
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
                    if (lastIndex < rawTitleText.length) {
                      const remainingText = rawTitleText.substring(lastIndex);
                      // Check if remaining text contains em dash and style it smaller
                      if (remainingText.includes("—")) {
                        const parts = remainingText.split("—");
                        elements.push(
                          <span key="text-end-before">{parts[0]}</span>,
                        );
                        elements.push(
                          <span
                            key="dash-end"
                            style={{
                              fontSize: "0.1em",
                              fontWeight: "200",
                              transform: "scaleX(0.5)",
                              display: "inline-block",
                            }}
                          >
                            –
                          </span>,
                        );
                        if (parts[1])
                          elements.push(
                            <span key="text-end-after">{parts[1]}</span>,
                          );
                      } else {
                        elements.push(
                          <span key="text-end">{remainingText}</span>,
                        );
                      }
                    }

                    return elements;
                  })()}
                  <br />
                  <span
                    className="text-black font-normal leading-relaxed mt-6 block text-left w-full min-w-0"
                    style={{
                      fontSize: "clamp(0.7rem, 1.5vw, 1.125rem)",
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                    }}
                  >
                    {/* Enhanced subtitle rendering with proper dash styling */}
                    {(() => {
                      // Handle em dashes in subtitle
                      if (subtitleTranslation.includes("—")) {
                        const parts = subtitleTranslation.split("—");
                        const elements: React.ReactNode[] = [];

                        parts.forEach((part, index) => {
                          elements.push(
                            <span key={`subtitle-${index}`}>{part}</span>,
                          );
                          // Add styled dash between parts (except after the last part)
                          if (index < parts.length - 1) {
                            elements.push(
                              <span
                                key={`subtitle-dash-${index}`}
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
                          }
                        });

                        return elements;
                      } else {
                        return subtitleTranslation;
                      }
                    })()}
                  </span>
                </h1>
              </motion.div>

              {/* Right side with service list - removed conditional rendering for detail view */}
              <motion.div
                key="services-list"
                className="flex-1 min-w-0 min-h-0"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                ref={servicesRef}
              >
                <div className="mt-6 flex flex-col items-start text-left gap-[clamp(1rem,3vh,2rem)]">
                  {/* Services list - direct implementation instead of using components */}
                  <div className="flex flex-col gap-[clamp(0.5rem, 1vh, 0.75rem)]">
                    {services.map((service, index) => (
                      <div
                        key={service}
                        className={`cursor-pointer transition-all duration-300 ${index === activeServiceIndex ? "text-black font-black" : "text-gray-500 font-bold"}`}
                        style={{
                          fontSize: "clamp(0.9rem, 2vw, 2rem)",
                        }}
                        onClick={() => handleServiceClick(index)}
                        ref={(el) => {
                          if (el) serviceItemsRef.current[index] = el;
                        }}
                      >
                        <span>{service}</span>
                        {index === activeServiceIndex && (
                          <div
                            className="bg-[#d142e2] rounded-full transition-all duration-300"
                            style={{
                              height: "clamp(2px, 0.5vh, 4px)",
                              width: "clamp(6rem, 8vw, 8rem)",
                              marginTop: "clamp(0.25rem, 1vh, 0.5rem)",
                            }}
                          ></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </Section>
      )}
    </>
  );
}
