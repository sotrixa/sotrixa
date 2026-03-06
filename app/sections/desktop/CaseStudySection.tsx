"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import Image from "next/image";
import Section from "../../components/layout/Section";
import CaseStudyDetail from "../../components/case-studies/CaseStudyDetail";
import { getText, parseColoredText, Language } from "../../data/translations";
import { caseStudies, CaseStudy } from "../../data/caseStudies";

export default function CaseStudySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeService, setActiveService] = useState<string>("HOSPITALITY");
  const sliderRef = useRef<HTMLDivElement>(null);
  const [selectedStudy, setSelectedStudy] = useState<CaseStudy | null>(null);
  // New state to control visibility of detail view
  const [showDetail, setShowDetail] = useState(false);
  const [language] = useState<Language>("en");

  // Navigation state for carousel - always show 2 case studies per view
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const slidesPerView = 2;

  // Get title and subtitle from translations
  const titleTranslation = getText("caseStudySection.title", language);
  const subtitleTranslation = getText("caseStudySection.subtitle", language);

  // Parse the colored text in title
  const { text: rawTitleText, coloredWords } =
    parseColoredText(titleTranslation);

  const handleStudyClick = (study: CaseStudy) => {
    // First set the selected study data
    setSelectedStudy(study);
    // Then show the detail view
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    // First hide the detail view
    setShowDetail(false);
    // After a delay, clear the selected study
    setTimeout(() => {
      setSelectedStudy(null);
    }, 400); // Match this with animation duration
  };

  // Use GSAP for animations
  useEffect(() => {
    if (!sectionRef.current || !caseStudies) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      // Animate main title and description
      tl.fromTo(
        ".case-studies-title",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
      );
      tl.fromTo(
        ".case-studies-description",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        "-=0.6",
      );

      // Animate services with stagger (only if elements exist)
      const serviceItems = document.querySelectorAll(".service-item");
      if (serviceItems.length > 0) {
        tl.fromTo(
          serviceItems,
          { x: -50, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.6, stagger: 0.15 },
          "-=0.4",
        );
      }

      // Animate slider
      tl.fromTo(
        ".slider-container",
        { scale: 0.95, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.7 },
        "-=0.3",
      );
    }, sectionRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseStudies]);

  // Get all case studies
  const getAllSlides = useCallback(() => {
    return Object.values(caseStudies).flat();
  }, []);

  // Navigation functions
  const goToPrevious = () => {
    setCurrentSlideIndex((prev) => Math.max(0, prev - slidesPerView));
  };

  const goToNext = () => {
    const allSlides = getAllSlides();
    const maxIndex = Math.max(0, allSlides.length - slidesPerView);
    setCurrentSlideIndex((prev) => Math.min(maxIndex, prev + slidesPerView));
  };

  // Check if navigation buttons should be disabled
  const isPrevDisabled = currentSlideIndex === 0;
  const isNextDisabled = () => {
    const allSlides = getAllSlides();
    return currentSlideIndex >= allSlides.length - slidesPerView;
  };

  // Get visible slides based on current index
  const getVisibleSlides = useCallback(() => {
    const allSlides = Object.values(caseStudies).flat();
    return allSlides.slice(
      currentSlideIndex,
      currentSlideIndex + slidesPerView,
    );
  }, [currentSlideIndex, slidesPerView]);

  // Handle slide changes with GSAP
  useEffect(() => {
    if (sliderRef.current) {
      // Get all slide items
      const slideItems = sliderRef.current.querySelectorAll(".slider-item");

      // Simple fade-in animation without flashing
      gsap.set(slideItems, { opacity: 1, y: 0 });
      gsap.fromTo(
        slideItems,
        { scale: 0.98 },
        {
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        },
      );
    }
  }, [currentSlideIndex]);

  // GSAP animations removed to fix layout issues

  return (
    <Section id="case-study" className="bg-white text-black overflow-visible">
      <div
        ref={sectionRef}
        className="px-[clamp(1rem,3vw,2rem)] py-[clamp(2rem,5vh,3rem)] w-screen h-screen"
        style={{
          minWidth: "100vw",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Grid view - set initial display style based on selected study */}
        {!showDetail && (
          <div
            className="case-studies-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "clamp(1.5rem,8vw,3rem)",
              width: "100%",
              height: "70vh",
            }}
          >
            {/* Left column - responsive layout */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "flex-start",
                paddingTop: "15vh",
              }}
            >
              <h1
                className="case-studies-title font-black text-left w-full min-w-0 m-0 px-2 xs:px-0 sm:px-0 md:px-0 lg:px-0 xl:px-0"
                style={{
                  fontSize: "clamp(1rem, 4vw, 3.8rem)",
                  lineHeight: 1.1,
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                  margin: 1,
                }}
              >
                {/* Render title with colored words */}
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
              </h1>
              <p
                className="case-studies-description text-left w-full min-w-0 px-2 xs:px-0 sm:px-0 md:px-0 lg:px-0 xl:px-0"
                style={{
                  fontSize: "clamp(0.7rem, 1.5vw, 1.125rem)",
                  marginTop: "0.75rem",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                }}
              >
                {subtitleTranslation}
              </p>
            </div>

            {/* Right column - responsive layout */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "1rem",
                }}
              >
                {/* Navigation arrows - OUTSIDE carousel */}
                <div className="flex flex-col gap-3">
                  <button
                    onClick={goToPrevious}
                    disabled={isPrevDisabled}
                    className={`w-12 h-12 flex items-center justify-center transition-all duration-200 ${isPrevDisabled ? "opacity-30 cursor-not-allowed" : "opacity-70 hover:opacity-100 hover:scale-110 active:scale-95"}`}
                    aria-label="Previous case study"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>
                  <button
                    onClick={goToNext}
                    disabled={isNextDisabled()}
                    className={`w-12 h-12 flex items-center justify-center transition-all duration-200 ${isNextDisabled() ? "opacity-30 cursor-not-allowed" : "opacity-70 hover:opacity-100 hover:scale-110 active:scale-95"}`}
                    aria-label="Next case study"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                </div>

                {/* Case studies container */}
                <div className="relative overflow-hidden h-auto flex-1">
                  <div
                    ref={sliderRef}
                    className="slider-container"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "1.5rem",
                      paddingBottom: "1.5rem",
                      paddingTop: "0.75rem",
                    }}
                  >
                    {getVisibleSlides().map((study, index) => (
                      <div
                        key={`${currentSlideIndex}-${index}`}
                        className="slider-item cursor-pointer transition-transform duration-300 hover:-translate-y-2 select-text flex flex-col"
                        onClick={() => handleStudyClick(study)}
                      >
                        {/* Image container */}
                        <div
                          className="rounded-lg border border-gray-200 shadow-md overflow-hidden bg-white"
                          style={{ height: "360px" }}
                        >
                          <div className="relative w-full h-full">
                            <Image
                              src={study.image}
                              alt={study.title}
                              fill
                              className="object-contain hover:scale-105 transition-transform duration-300"
                              sizes="(max-width: 768px) 100vw, 50vw"
                              priority={index === 0}
                            />

                            {/* Overlay with view details button */}
                            <div
                              className="absolute inset-0 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100"
                              style={{
                                backgroundColor: "rgba(83, 235, 221, 0.3)",
                              }}
                            >
                              <span className="px-4 py-2 bg-white text-black font-bold rounded-lg transform scale-95 hover:scale-100 transition-transform text-sm">
                                View Details
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Title and description below the image */}
                        <div className="flex flex-col gap-2 mt-4">
                          <h3 className="font-bold text-base leading-snug">
                            {study.title}
                          </h3>
                          <p className="text-gray-600 leading-snug text-sm">
                            {study.subtitle}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Detail view - always render but control visibility with CSS */}
        {selectedStudy && (
          <div
            className="px-[clamp(1rem,5vw,3rem)] py-[clamp(1rem,10vh,3rem)] case-study-detail-container"
            style={{ display: showDetail ? "block" : "none" }}
          >
            <CaseStudyDetail
              study={selectedStudy}
              caseStudies={caseStudies}
              onClose={handleCloseDetail}
            />
          </div>
        )}
      </div>
    </Section>
  );
}
