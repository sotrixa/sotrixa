"use client";

import React from "react";
import { serviceContents } from "../desktop/ServiceInfoSection/data/serviceContents";

interface MobileServiceInfoSectionProps {
  onBackClick?: () => void;
  activeService?: string;
}

const colorMappings: Record<string, Record<string, string>> = {
  RESEARCH: {
    research: "#53EBDD",
    signals: "#53EBDD",
    strategies: "#EBDD53",
  },
  "BUSINESS ARCHITECTURE": {
    vision: "#DD53EB",
    structured: "#53EBDD",
    growth: "#EBDD53",
  },
  "BESPOKE STRATEGY CREATION": {
    vision: "#DD53EB",
    clarity: "#53EBDD",
    purpose: "#EBDD53",
  },
  "BRAND STORYTELLING": {
    Bringing: "#DD53EB",
    story: "#53EBDD",
    emotionally: "#EBDD53",
  },
  MARKETING: {
    presence: "#DD53EB",
    strategies: "#53EBDD",
    move: "#EBDD53",
  },
  "WEBSITE DEVELOPMENT": {
    websites: "#DD53EB",
    feeling: "#53EBDD",
    experience: "#EBDD53",
  },
};

const renderStyledTitle = (title: string, service: string) => {
  const colors = colorMappings[service] || {};
  const dashParts = title.split(/(—|–|-)/g);

  return (
    <span>
      {dashParts.map((dashPart, dashIndex) => {
        if (dashPart === "—" || dashPart === "–" || dashPart === "-") {
          return (
            <span
              key={dashIndex}
              style={{
                fontSize: "1em",
                fontWeight: "200",
                transform: "scaleX(0.5)",
                display: "inline-block",
              }}
            >
              –
            </span>
          );
        }

        const words = dashPart.split(" ");
        return words.map((word, wordIndex) => {
          const cleanWord = word.replace(/[.,!?;:]$/, "");
          const punctuation = word.match(/[.,!?;:]$/)?.[0] || "";
          const color = colors[cleanWord];

          return (
            <span key={`${dashIndex}-${wordIndex}`}>
              {color ? <span style={{ color }}>{cleanWord}</span> : cleanWord}
              {punctuation}
              {wordIndex < words.length - 1 ? " " : ""}
            </span>
          );
        });
      })}
    </span>
  );
};

const renderTextWithStyledDashes = (text: string) => {
  const parts = text.split(/(—|–|-)/g);
  return parts.map((part, i) => {
    if (part === "—" || part === "–" || part === "-") {
      return (
        <span
          key={i}
          style={{
            fontSize: "1em",
            fontWeight: "200",
            transform: "scaleX(0.5)",
            display: "inline-block",
          }}
        >
          –
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
};

const MobileServiceInfoSection: React.FC<MobileServiceInfoSectionProps> = ({
  onBackClick,
  activeService,
}) => {
  const currentContent =
    activeService && serviceContents[activeService]
      ? serviceContents[activeService]
      : serviceContents["CREATED TO MATTER"];

  return (
    <div className="fixed inset-0 z-50 w-full h-full bg-white overflow-y-auto flex flex-col">
      {/* Header with Back Button */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4">
        <button
          onClick={onBackClick}
          className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors text-sm font-medium cursor-pointer min-h-[44px]"
          aria-label="Back to services"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          <span>Back</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-4 py-8 max-w-md mx-auto w-full">
        {/* Title */}
        <h1 className="text-2xl font-black text-black mb-8 leading-snug">
          {renderStyledTitle(currentContent.title, activeService || "RESEARCH")}
        </h1>

        {/* Description Paragraphs */}
        <div className="mb-10 space-y-3">
          {currentContent.description.map((paragraph, idx) => {
            // Bullet points with colored dots
            if (paragraph.startsWith("•")) {
              const parts = paragraph.substring(1).trim().split("–");
              const bulletTitle = parts[0].trim();
              const bulletContent = parts.length > 1 ? parts[1].trim() : "";

              return (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-[#DD53EB] mt-0.5 flex-shrink-0 text-lg">
                    •
                  </span>
                  <div>
                    <span className="font-medium text-gray-800 text-sm">
                      {bulletTitle}
                    </span>
                    {bulletContent && (
                      <>
                        {" "}
                        <span
                          style={{
                            fontSize: "1em",
                            fontWeight: "200",
                            transform: "scaleX(0.5)",
                            display: "inline-block",
                          }}
                        >
                          –
                        </span>{" "}
                        <span className="text-gray-600 text-sm">
                          {renderTextWithStyledDashes(bulletContent)}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              );
            }

            // Section headers
            if (paragraph.endsWith(":​")) {
              return (
                <p
                  key={idx}
                  className="text-gray-700 font-medium mt-4 mb-2 text-sm"
                >
                  {paragraph}
                </p>
              );
            }

            // Empty line spacing
            if (paragraph === "") {
              return <div key={idx} className="h-2" />;
            }

            // Regular paragraphs
            return (
              <p key={idx} className="text-gray-700 leading-relaxed text-sm">
                {renderTextWithStyledDashes(paragraph)}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MobileServiceInfoSection;
