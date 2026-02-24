"use client";

import { useState, useCallback } from "react";
import MobileServiceInfoSection from "./MobileServiceInfoSection";
import { getText, parseColoredText, Language } from "../../data/translations";

export default function MobileServicesSection() {
  const [activeServiceIndex, setActiveServiceIndex] = useState(0);
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

  const titleTranslation = getText("servicesSection.title", language);
  const subtitleTranslation = getText("servicesSection.subtitle", language);
  const { text: rawTitleText, coloredWords } =
    parseColoredText(titleTranslation);

  const handleServiceClick = useCallback((index: number) => {
    setActiveServiceIndex(index);
    setTimeout(() => setShowServiceInfo(true), 300);
  }, []);

  const handleBackFromServiceInfo = () => setShowServiceInfo(false);

  const renderColoredTitle = () => {
    let lastIndex = 0;
    const elements = [];
    const sortedWords = [...coloredWords].sort(
      (a, b) => rawTitleText.indexOf(a.word) - rawTitleText.indexOf(b.word),
    );
    sortedWords.forEach(({ word, color }, i) => {
      const wordIndex = rawTitleText.indexOf(word, lastIndex);
      if (wordIndex > lastIndex) {
        elements.push(
          <span key={`text-${i}`}>
            {rawTitleText.substring(lastIndex, wordIndex)}
          </span>,
        );
      }
      elements.push(
        <span key={`colored-${i}`} style={{ color }}>
          {word}
        </span>,
      );
      lastIndex = wordIndex + word.length;
    });
    if (lastIndex < rawTitleText.length) {
      elements.push(
        <span key="text-end">{rawTitleText.substring(lastIndex)}</span>,
      );
    }
    return elements;
  };

  if (showServiceInfo) {
    return (
      <MobileServiceInfoSection
        onBackClick={handleBackFromServiceInfo}
        activeService={services[activeServiceIndex]}
      />
    );
  }

  return (
    <section id="mobile-services" className="w-full bg-white">
      <div className="px-6 py-12">
        {/* Label */}
        <div className="mb-6">
          <span className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase">
            Services
          </span>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h1
            className="font-black text-black leading-[1.1]"
            style={{ fontSize: "1.75rem" }}
          >
            {renderColoredTitle()}
          </h1>
          <p className="text-gray-500 text-sm mt-3">{subtitleTranslation}</p>
        </div>

        {/* List */}
        <div className="space-y-2">
          {services.map((service, index) => (
            <button
              key={service}
              onClick={() => handleServiceClick(index)}
              className={`w-full text-left px-4 py-4 rounded-xl transition-all flex items-center justify-between ${
                index === activeServiceIndex
                  ? "bg-black text-white"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span className="font-semibold text-sm">{service}</span>
              <svg
                className={`w-4 h-4 ${index === activeServiceIndex ? "text-white" : "text-gray-400"}`}
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
          ))}
        </div>
      </div>
    </section>
  );
}
