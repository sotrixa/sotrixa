"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import CaseStudyDetailMobile from "./CaseStudyDetailMobile";
import { getText, parseColoredText, Language } from "../../data/translations";
import { caseStudies, CaseStudy } from "../../data/caseStudies";

export default function MobileCaseStudySection() {
  const [selectedStudy, setSelectedStudy] = useState<CaseStudy | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [language] = useState<Language>("en");
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const titleTranslation = getText("caseStudySection.title", language);
  const subtitleTranslation = getText("caseStudySection.subtitle", language);
  const { text: rawTitleText, coloredWords } =
    parseColoredText(titleTranslation);

  const handleStudyClick = (study: CaseStudy) => {
    setSelectedStudy(study);
    setShowDetail(true);
  };
  const handleCloseDetail = () => {
    setShowDetail(false);
    setTimeout(() => setSelectedStudy(null), 400);
  };
  const getAllSlides = useCallback(() => Object.values(caseStudies).flat(), []);
  const goToPrevious = () =>
    setCurrentSlideIndex((prev) => Math.max(0, prev - 1));
  const goToNext = () =>
    setCurrentSlideIndex((prev) =>
      Math.min(getAllSlides().length - 1, prev + 1),
    );
  const currentStudy = getAllSlides()[currentSlideIndex];

  if (showDetail && selectedStudy) {
    return (
      <CaseStudyDetailMobile
        study={selectedStudy}
        caseStudies={caseStudies}
        onClose={handleCloseDetail}
      />
    );
  }

  const renderColoredTitle = () => {
    let lastIndex = 0;
    const elements = [];
    const sortedWords = [...coloredWords].sort(
      (a, b) => rawTitleText.indexOf(a.word) - rawTitleText.indexOf(b.word),
    );
    sortedWords.forEach(({ word, color }, i) => {
      const wordIndex = rawTitleText.indexOf(word, lastIndex);
      if (wordIndex > lastIndex)
        elements.push(
          <span key={`text-${i}`}>
            {rawTitleText.substring(lastIndex, wordIndex)}
          </span>,
        );
      elements.push(
        <span key={`colored-${i}`} style={{ color }}>
          {word}
        </span>,
      );
      lastIndex = wordIndex + word.length;
    });
    if (lastIndex < rawTitleText.length)
      elements.push(
        <span key="text-end">{rawTitleText.substring(lastIndex)}</span>,
      );
    return elements;
  };

  return (
    <section
      id="mobile-case-studies"
      style={{ backgroundColor: "#fbfbfb" }}
      className="w-full"
    >
      <div className="px-4 py-12 max-w-md mx-auto">
        {/* Title & Subtitle */}
        <div className="mb-12">
          <h1 className="font-black text-black leading-tight text-3xl md:text-4xl mb-4 scroll-mt-[90px]">
            {renderColoredTitle()}
          </h1>
          <p className="text-gray-600 text-sm font-normal leading-relaxed">
            {subtitleTranslation}
          </p>
        </div>

        {/* Case Study Card */}
        <div
          className="bg-white rounded-xl overflow-hidden mb-10 cursor-pointer hover:shadow-md transition-shadow duration-200"
          onClick={() => currentStudy && handleStudyClick(currentStudy)}
        >
          <div className="relative h-44 bg-white flex items-center justify-center p-6">
            <Image
              src={currentStudy?.image || ""}
              alt={currentStudy?.title || ""}
              width={300}
              height={300}
              className="w-full h-full object-contain"
              sizes="100vw"
              priority
            />
          </div>
          <div className="p-5 border-t border-gray-100">
            <h3 className="font-bold text-black text-sm mb-2">
              {currentStudy?.title}
            </h3>
            <p className="text-gray-600 text-xs leading-relaxed">
              {currentStudy?.subtitle}
            </p>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={goToPrevious}
            disabled={currentSlideIndex === 0}
            className={`flex-1 py-3 px-3 rounded-lg font-semibold text-sm transition-all duration-200 cursor-pointer min-h-[44px] ${
              currentSlideIndex === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-900 active:scale-95"
            }`}
          >
            ← Prev
          </button>
          <div className="flex gap-2 items-center px-2">
            {getAllSlides().map((_, i) => (
              <div
                key={i}
                className={`transition-all duration-200 ${
                  i === currentSlideIndex
                    ? "bg-black w-6 h-1.5 rounded-full"
                    : "bg-gray-300 w-1.5 h-1.5 rounded-full"
                }`}
              />
            ))}
          </div>
          <button
            onClick={goToNext}
            disabled={currentSlideIndex >= getAllSlides().length - 1}
            className={`flex-1 py-3 px-3 rounded-lg font-semibold text-sm transition-all duration-200 cursor-pointer min-h-[44px] ${
              currentSlideIndex >= getAllSlides().length - 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-900 active:scale-95"
            }`}
          >
            Next →
          </button>
        </div>
      </div>
    </section>
  );
}
