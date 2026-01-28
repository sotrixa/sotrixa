import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { RightPanelProps } from "../types";

// Function to render text with styled dashes
const renderTextWithStyledDashes = (text: string) => {
  // Handle all types of dashes: regular hyphen (-), en dash (–), and em dash (—)
  const parts = text.split(/(—|–|-)/g);

  return parts.map((part, i) => {
    // Check if this part is any type of dash
    if (part === "—" || part === "–" || part === "-") {
      return (
        <span
          key={i}
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

    return <span key={i}>{part}</span>;
  });
};

const scrollbarStyles = `
  .right-panel-scroll::-webkit-scrollbar {
    width: 8px;
  }
  .right-panel-scroll::-webkit-scrollbar-track {
    background: transparent;
  }
  .right-panel-scroll::-webkit-scrollbar-thumb {
    background: #999;
    border-radius: 4px;
  }
  .right-panel-scroll::-webkit-scrollbar-thumb:hover {
    background: #666;
  }

  @media (min-width: 1280px) {
    .right-panel-scroll {
      height: auto !important;
      overflow: visible !important;
      margin-top: 0 !important;
    }
  }

  @media (max-width: 1279px) {
    .right-panel-scroll {
      height: 450px !important;
      overflow-y: scroll !important;
      margin-top: -3rem !important;
    }
  }
`;

export function RightPanel({
  rightSideRef,
  rightContentRef,
  servicesTitleRef,
  activeService,
  currentContent,
}: RightPanelProps) {
  return (
    <>
      <style>{scrollbarStyles}</style>
      <div
        className="w-full md:w-1/2 p-4 md:p-4 flex flex-col justify-center overflow-visible"
        style={{ maxHeight: "100vh", overflow: "visible" }}
        ref={rightSideRef}
      >
        <AnimatePresence mode="wait">
          <motion.div
            ref={rightContentRef}
            key={activeService}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full flex flex-col overflow-visible"
            style={{ overflow: "visible" }}
          >
            <div
              className="right-panel-scroll"
              style={
                {
                  maxWidth: "95%",
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                  overflowX: "hidden",
                  paddingLeft: "1rem",
                  paddingRight: "1rem",
                  paddingTop: "1.5rem",
                  paddingBottom: "2rem",
                  display: "block",
                  WebkitOverflowScrolling: "touch",
                } satisfies React.CSSProperties
              }
            >
              <h3
                ref={servicesTitleRef}
                className="font-black mb-6 text-black"
                style={{
                  fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
                  lineHeight: 1,
                  maxWidth: "90%",
                  marginTop: "clamp(1rem, 3vh, 2rem)",
                }}
              >
                {activeService || "Services"}
              </h3>

              <div className="mb-8">
                {currentContent.description.map((paragraph, index) => {
                  // Group of bullet points
                  if (paragraph.startsWith("•")) {
                    // Extract content after the bullet point and dash
                    const parts = paragraph.substring(1).trim().split("–");
                    const bulletTitle = parts[0].trim();
                    const bulletContent =
                      parts.length > 1 ? parts[1].trim() : "";

                    return (
                      <div
                        key={index}
                        className="flex items-start group hover:translate-x-1 transition-transform duration-300 py-[1px]"
                      >
                        <span
                          className="text-[#DD53EB] mr-1.5 mt-[3px] opacity-90 group-hover:opacity-100 flex-shrink-0"
                          style={{ fontSize: "clamp(0.75rem, 1vw, 1rem)" }}
                        >
                          •
                        </span>
                        <div className="text-gray-700 leading-snug">
                          <span
                            className="font-medium text-gray-800"
                            style={{ fontSize: "clamp(0.9rem, 1.2vw, 1.1rem)" }}
                          >
                            {bulletTitle}
                          </span>
                          {bulletContent && (
                            <>
                              {" "}
                              <span
                                className="inline-block"
                                style={{
                                  fontSize: "1em",
                                  fontWeight: "200",
                                  transform: "scaleX(0.5)",
                                }}
                              >
                                –
                              </span>{" "}
                              <span
                                className="text-gray-600"
                                style={{
                                  fontSize: "clamp(0.8rem, 1vw, 0.95rem)",
                                }}
                              >
                                {renderTextWithStyledDashes(bulletContent)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  }

                  // Header for list sections (like "What we uncover together:")
                  if (paragraph.endsWith(":​")) {
                    return (
                      <p
                        key={index}
                        className="text-gray-700 font-medium mt-4 mb-1.5"
                        style={{ fontSize: "clamp(0.95rem, 1.3vw, 1.15rem)" }}
                      >
                        {paragraph}
                      </p>
                    );
                  }

                  // Empty line creates spacing
                  if (paragraph === "") {
                    return <div key={index} className="h-2" />;
                  }

                  // Regular paragraph
                  return (
                    <p
                      key={index}
                      className="text-gray-700 leading-relaxed mb-3"
                      style={{ fontSize: "clamp(0.9rem, 1.1vw, 1rem)" }}
                    >
                      {renderTextWithStyledDashes(paragraph)}
                    </p>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
