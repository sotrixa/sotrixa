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
        const textBefore = rawTitleText.substring(lastIndex, wordIndex);
        // Handle em-dash styling
        if (textBefore.includes("—")) {
          const parts = textBefore.split("—");
          elements.push(<span key={`text-${i}-before`}>{parts[0]}</span>);
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
            elements.push(<span key={`text-${i}-after`}>{parts[1]}</span>);
        } else {
          elements.push(<span key={`text-${i}`}>{textBefore}</span>);
        }
      }
      elements.push(
        <span key={`colored-${i}`} style={{ color }}>
          {word}
        </span>,
      );
      lastIndex = wordIndex + word.length;
    });
    if (lastIndex < rawTitleText.length) {
      const remainingText = rawTitleText.substring(lastIndex);
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

  if (showServiceInfo) {
    return (
      <MobileServiceInfoSection
        onBackClick={handleBackFromServiceInfo}
        activeService={services[activeServiceIndex]}
      />
    );
  }

  return (
    <section
      id="mobile-services"
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

        {/* Services List */}
        <div className="space-y-3">
          {services.map((service, index) => (
            <button
              key={service}
              onClick={() => handleServiceClick(index)}
              className={`w-full text-left px-5 py-4 rounded-lg transition-all duration-200 text-sm font-semibold cursor-pointer min-h-[48px] flex items-center group ${
                index === activeServiceIndex
                  ? "bg-black text-white shadow-md scale-100"
                  : "text-gray-700 hover:bg-gray-100 active:bg-gray-200 active:scale-98"
              }`}
            >
              <span className="flex-1">{service}</span>
              {index === activeServiceIndex && (
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
