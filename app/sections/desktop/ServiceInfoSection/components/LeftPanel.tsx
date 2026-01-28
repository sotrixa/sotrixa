import React, { useRef } from "react";
import type { LeftPanelProps } from "../types";
import { serviceContents, serviceItems } from "../data/serviceContents";

// Function to render title with colored keywords
const renderStyledTitle = (title: string, service: string) => {
  // Define color mappings for each service
  const colorMappings: Record<string, Record<string, string>> = {
    RESEARCH: {
      research: "text-[#DD53EB]",
      signals: "text-[#53EBDD]",
      strategies: "text-[#EBDD53]",
    },
    "BUSINESS ARCHITECTURE": {
      vision: "text-[#DD53EB]",
      structured: "text-[#53EBDD]",
      growth: "text-[#EBDD53]",
    },
    "BESPOKE STRATEGY CREATION": {
      vision: "text-[#DD53EB]",
      clarity: "text-[#53EBDD]",
      purpose: "text-[#EBDD53]",
    },
    "BRAND STORYTELLING": {
      Bringing: "text-[#DD53EB]",
      story: "text-[#53EBDD]",
      emotionally: "text-[#EBDD53]",
    },
    MARKETING: {
      presence: "text-[#DD53EB]",
      strategies: "text-[#53EBDD]",
      move: "text-[#EBDD53]",
    },
    "WEBSITE DEVELOPMENT": {
      websites: "text-[#DD53EB]",
      feeling: "text-[#53EBDD]",
      experience: "text-[#EBDD53]",
    },
  };

  const colors = colorMappings[service] || {};

  // First handle all types of dashes, then apply color styling
  const dashParts = title.split(/(—|–|-)/g);

  return (
    <span>
      {dashParts.map((dashPart, dashIndex) => {
        // If this part is any type of dash, style it consistently
        if (dashPart === "—" || dashPart === "–" || dashPart === "-") {
          return (
            <span
              key={dashIndex}
              className="inline-block"
              style={{
                fontSize: "1em",
                fontWeight: "200",
                transform: "scaleX(0.5)",
              }}
            >
              –
            </span>
          );
        }

        // For non-dash parts, apply color styling
        const words = dashPart.split(" ");
        return words.map((word, wordIndex) => {
          // Remove punctuation to check for color mapping
          const cleanWord = word.replace(/[.,!?;:]$/, "");
          const punctuation = word.match(/[.,!?;:]$/)?.[0] || "";
          const colorClass = colors[cleanWord];

          return (
            <span key={`${dashIndex}-${wordIndex}`}>
              {colorClass ? (
                <span className={colorClass}>{cleanWord}</span>
              ) : (
                cleanWord
              )}
              {punctuation}
              {wordIndex < words.length - 1 ? " " : ""}
            </span>
          );
        });
      })}
    </span>
  );
};

export function LeftPanel({
  leftSideRef,
  logoRef,
  backButtonRef,
  headingRef,
  servicesGridRef,
  activeService,
  setActiveService,
  handleBackToServices,
  serviceTitleRefs,
  resetLetterAnimation,
  animateLetterStagger,
  animateParticles,
}: LeftPanelProps) {
  const prevServiceRef = useRef<string | undefined>(activeService);
  const currentContent =
    activeService && serviceContents[activeService]
      ? serviceContents[activeService]
      : serviceContents["RESEARCH"];

  return (
    <div
      className="w-full md:w-1/2 p-4 md:p-4 flex flex-col justify-center min-h-screen md:min-h-full"
      ref={leftSideRef}
    >
      <div className="mb-6" ref={logoRef}>
        <button
          onClick={handleBackToServices}
          ref={backButtonRef}
          className="group flex items-center space-x-2 cursor-pointer text-black hover:text-[#EBDD53] transition-colors duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 transform transition-transform duration-300 group-hover:-translate-x-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          <span
            className="uppercase tracking-widest"
            style={{ fontSize: "clamp(0.65rem, 0.9vw, 0.875rem)" }}
          >
            RETURN TO SERVICES
          </span>
        </button>
      </div>

      <div className="mb-6">
        <h1
          className="font-bold mb-0 text-black"
          style={{ fontSize: "clamp(1.75rem, 4vw, 3.5rem)", lineHeight: 1 }}
          ref={headingRef}
        >
          {activeService && serviceContents[activeService] ? (
            renderStyledTitle(
              serviceContents[activeService].title,
              activeService,
            )
          ) : (
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EBDD53] via-[#DD53EB] to-[#53EBDD]">
              {currentContent.title}
            </span>
          )}
        </h1>
      </div>

      {/* Navigation arrows to change services */}
      <div className="mt-3 relative" ref={servicesGridRef}>
        {/* Navigation with arrows and dots */}
        <div className="flex items-center justify-start space-x-6">
          {/* Left arrow with text */}
          <button
            onClick={() => {
              const currentIndex = serviceItems.findIndex(
                (item) => item.name === activeService,
              );
              const prevIndex =
                currentIndex > 0 ? currentIndex - 1 : serviceItems.length - 1;
              const newService = serviceItems[prevIndex].name;

              prevServiceRef.current = activeService;
              setActiveService(newService);

              // Reset previous service animation
              if (serviceTitleRefs.current[currentIndex]) {
                resetLetterAnimation(currentIndex);
              }

              // Animate new service
              animateLetterStagger(prevIndex);
              animateParticles();
            }}
            className="group flex items-center space-x-3 text-black hover:text-[#DD53EB] transition-all duration-300"
            aria-label="Previous service"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 transition-colors duration-300"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span
              className="font-medium tracking-wide transition-colors duration-300"
              style={{ fontSize: "clamp(0.75rem, 1vw, 0.95rem)" }}
            >
              Previous Service
            </span>
          </button>

          {/* Service dots indicator */}
          <div className="flex space-x-2">
            {serviceItems.map((item, index) => (
              <button
                key={index}
                className={`h-3 w-3 rounded-full transition-all ${activeService === item.name ? "bg-black" : "bg-gray-400 hover:bg-gray-500"}`}
                onClick={() => {
                  const currentIndex = serviceItems.findIndex(
                    (service) => service.name === activeService,
                  );

                  prevServiceRef.current = activeService;
                  setActiveService(item.name);

                  // Reset previous service animation
                  if (serviceTitleRefs.current[currentIndex]) {
                    resetLetterAnimation(currentIndex);
                  }

                  // Animate new service
                  animateLetterStagger(index);
                  animateParticles();
                }}
                aria-label={`Go to ${item.name}`}
              />
            ))}
          </div>

          {/* Right arrow with text */}
          <button
            onClick={() => {
              const currentIndex = serviceItems.findIndex(
                (item) => item.name === activeService,
              );
              const nextIndex =
                currentIndex < serviceItems.length - 1 ? currentIndex + 1 : 0;
              const newService = serviceItems[nextIndex].name;

              prevServiceRef.current = activeService;
              setActiveService(newService);

              // Reset previous service animation
              if (serviceTitleRefs.current[currentIndex]) {
                resetLetterAnimation(currentIndex);
              }

              // Animate new service
              animateLetterStagger(nextIndex);
              animateParticles();
            }}
            className="group flex items-center space-x-3 text-black hover:text-[#DD53EB] transition-all duration-300"
            aria-label="Next service"
          >
            <span
              className="font-medium tracking-wide transition-colors duration-300"
              style={{ fontSize: "clamp(0.75rem, 1vw, 0.95rem)" }}
            >
              See next Service
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 transition-colors duration-300"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
