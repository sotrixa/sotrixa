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
      image: "/1_Icon_Hospitality_Business.svg",
      description:
        "A well-established hospitality business in Bulgaria sought new avenues for expansion and strategic growth. With a strong foundation, the goal was to uncover actionable insights to inform future development.",
      challenge:
        "Despite a solid market presence, the business needed fresh strategies to navigate an evolving, competitive hospitality landscape.",
      solution:
        "We launched a comprehensive research initiative to guide decision-making:\n\n• Research: Conducted in-depth analysis of the competitive landscape, including trend scanning and forecasting, to uncover emerging opportunities.\n• Bespoke Strategy Creation: Developed a tailored, actionable strategy aligned with the business's strengths and market insights.",
      results:
        "Our efforts identified high-potential growth areas based on current trends. The bespoke strategy offered clear direction, enabling informed expansion decisions.",
    },
  ],
  "ITALIAN CONCEPT": [
    {
      title: "Italian Concept Store",
      subtitle: "A specialty retailer introducing Italian lifestyle products",
      image: "/2_Icon_Italian Concept Store.svg",
      description:
        "A specialty retailer introducing Italian lifestyle products to the Bulgarian market aimed to deepen customer engagement and strengthen brand recognition.",
      challenge:
        "While offering high-quality products, the store struggled to establish a cohesive brand presence and connect meaningfully with customers.",
      solution:
        "We undertook a strategic repositioning process:\n\n• Research: Conducted an in-depth analysis of the local retail landscape, exploring customer preferences, market trends, and opportunities for differentiation.\n• Marketing Plan Development: Crafted a targeted marketing strategy aligned with the store's offerings and audience, defining clear objectives, channels, and engagement steps.",
      results:
        "Our work revealed the store's unique market position, enabling stronger customer connection. A clear, research-based marketing strategy laid a foundation for lasting success.",
    },
  ],
  "WELLNESS PRACTICE": [
    {
      title: "Wellness Practice",
      subtitle: "A newly established somatic therapist",
      image: "/3_Icon_Wellness Practice.svg",
      description:
        "A newly established somatic therapist sought to define her distinctive healing approach and attract aligned clients through a strong, resonant presence.",
      challenge:
        "Launching in a niche market required communicating the unique value of her services and creating a brand identity capable of building trust.",
      solution:
        "We guided the practice's development across key areas:\n\n• Research: Analyzed the local wellness landscape to uncover gaps and opportunities.\n• Business Architecture: Designed and positioned her service offerings to reflect her methodology.\n• Branding: Developed a visual and verbal identity capturing the practice's essence and authenticity.\n• Marketing Strategy: Crafted a marketing plan focused on resonant channels and messaging.",
      results:
        "The new brand identity and strategic plan allowed her to connect meaningfully with clients, positioning her practice for growth and sustainability.",
    },
  ],
  "International Cosmetics Brand": [
    {
      title: "International Cosmetics Brand",
      subtitle:
        "An international cosmetics company with a growing global presence.",
      image: "/4_Icon_International Cosmetics Brand.svg",
      description:
        "An international cosmetics company with a growing global presence was looking to evaluate the effectiveness of its internal employee programs and benefits—seeking to understand how they were received across the organization and what could be improved.",
      challenge:
        "Despite continued business growth, several employee loyalty initiatives and internal benefits programs were underperforming. Engagement and perceived value varied across departments, making it difficult to assess impact or guide future improvements.",
      solution:
        "Research: Conducted in-depth, one-to-one interviews with employees across different levels and departments to uncover honest perspectives, unmet needs, and areas of friction within existing programs.",
      results:
        "The research surfaced key disconnects in perception, communication, and relevance. Sotrixa provided actionable recommendations to refine current initiatives and introduce strategic adjustments—leading to stronger alignment between employee expectations and company offerings.",
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
