"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import CaseStudyDetailMobile from "./CaseStudyDetailMobile";
import { getText, parseColoredText, Language } from "../../data/translations";

type CaseStudy = {
  title: string;
  subtitle: string;
  image: string;
  description?: string;
  challenge?: string;
  solution?: string;
  results?: string;
};

type CaseStudiesData = { [key: string]: CaseStudy[] };

const caseStudies: CaseStudiesData = {
  HOSPITALITY: [
    {
      title: "Hospitality Business",
      subtitle: "A well-established hospitality business in Bulgaria",
      image: "/1_Icon_Hospitality Business.svg",
      description: "Seeking new avenues for expansion.",
      challenge: "Needed fresh strategies.",
      solution: "Comprehensive research initiative.",
      results: "Identified high-potential growth areas.",
    },
  ],
  "ITALIAN CONCEPT": [
    {
      title: "Italian Concept Store",
      subtitle: "Italian lifestyle products retailer",
      image: "/2_Icon_Italian Concept Store.svg",
      description: "Introducing Italian lifestyle to Bulgaria.",
      challenge: "Establishing brand presence.",
      solution: "Strategic repositioning.",
      results: "Unique market position revealed.",
    },
  ],
  "WELLNESS PRACTICE": [
    {
      title: "Wellness Practice",
      subtitle: "Somatic therapist",
      image: "/3_Icon_Wellness Practice.svg",
      description: "Defining distinctive healing approach.",
      challenge: "Communicating unique value.",
      solution: "Full brand development.",
      results: "Meaningful client connection.",
    },
  ],
  "International Cosmetics Brand": [
    {
      title: "International Cosmetics Brand",
      subtitle: "Global cosmetics company",
      image: "/4_Icon_International Cosmetics Brand.svg",
      description: "Evaluating employee programs.",
      challenge: "Underperforming initiatives.",
      solution: "In-depth employee interviews.",
      results: "Actionable recommendations provided.",
    },
  ],
};

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
    <section id="mobile-case-studies" className="w-full bg-white">
      <div className="px-6 py-12">
        {/* Label */}
        <div className="mb-6">
          <span className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase">
            Work
          </span>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h1
            className="font-black text-black leading-[1.1]"
            style={{ fontSize: "1.5rem" }}
          >
            {renderColoredTitle()}
          </h1>
          <p className="text-gray-500 text-sm mt-2">{subtitleTranslation}</p>
        </div>

        {/* Card */}
        <div
          className="bg-gray-50 rounded-2xl overflow-hidden mb-6"
          onClick={() => currentStudy && handleStudyClick(currentStudy)}
        >
          <div className="relative h-44 bg-white">
            <Image
              src={currentStudy?.image || ""}
              alt={currentStudy?.title || ""}
              fill
              className="object-contain p-4"
              sizes="100vw"
            />
          </div>
          <div className="p-5">
            <h3 className="font-bold text-black mb-1">{currentStudy?.title}</h3>
            <p className="text-gray-500 text-sm">{currentStudy?.subtitle}</p>
          </div>
        </div>

        {/* Nav */}
        <div className="flex items-center justify-between">
          <button
            onClick={goToPrevious}
            disabled={currentSlideIndex === 0}
            className={`w-12 h-12 rounded-full flex items-center justify-center ${currentSlideIndex === 0 ? "bg-gray-100 text-gray-300" : "bg-black text-white"}`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div className="flex gap-1.5">
            {getAllSlides().map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full ${i === currentSlideIndex ? "bg-black w-6" : "bg-gray-200 w-1.5"}`}
              />
            ))}
          </div>
          <button
            onClick={goToNext}
            disabled={currentSlideIndex >= getAllSlides().length - 1}
            className={`w-12 h-12 rounded-full flex items-center justify-center ${currentSlideIndex >= getAllSlides().length - 1 ? "bg-gray-100 text-gray-300" : "bg-black text-white"}`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
