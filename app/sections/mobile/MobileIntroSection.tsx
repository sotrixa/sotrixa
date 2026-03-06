"use client";

import { useState, useRef } from "react";
import { useLanguage } from "../../data/LanguageContext";
import { getText } from "../../data/translations";
import Image from "next/image";
import ReactDOM from "react-dom";

export default function MobileIntroSection() {
  const { language } = useLanguage();
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayClick = () => {
    setIsVideoPlaying(true);
    setTimeout(() => videoRef.current?.play().catch(console.error), 50);
  };

  const handleCloseVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setIsVideoPlaying(false);
  };

  const renderColoredText = (text: string) => {
    const parts = text.split(/(\{\{.*?\}\})/g);
    return parts.map((part, i) => {
      const match = part.match(/\{\{(.*?):(.*?)\}\}/);
      if (match) {
        const [, word, color] = match;
        return (
          <span key={i} style={{ color }}>
            {word}
          </span>
        );
      }
      // Make em-dash smaller in mobile
      if (part === "—") {
        return (
          <span key={i} className="text-lg md:text-3xl">
            {part}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  const titleText = getText("introSection.title", language).split("\n");
  const subheadingText = getText("introSection.subheading", language);
  const testimonialText = getText("introSection.testimonial", language);

  const renderVideoOverlay = () => {
    if (!isVideoPlaying) return null;
    return ReactDOM.createPortal(
      <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center p-4">
        <div className="relative w-full max-w-lg">
          <button
            className="absolute -top-10 right-0 text-white/70 hover:text-white transition-colors"
            onClick={handleCloseVideo}
          >
            <svg
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <video
            ref={videoRef}
            className="w-full rounded-2xl"
            controls
            playsInline
          >
            <source src="/video/Sotrixa-final-subs.mp4" type="video/mp4" />
          </video>
        </div>
      </div>,
      document.body,
    );
  };

  return (
    <>
      {renderVideoOverlay()}
      <section
        id="mobile-intro"
        style={{ backgroundColor: "#fbfbfb" }}
        className="w-full"
      >
        <div className="px-4 py-12 max-w-md mx-auto">
          {/* Section Label */}

          {/* Title */}
          <div className="mb-10">
            <h1
              className="font-black text-black leading-tight text-3xl md:text-4xl"
              style={{ scrollMarginTop: "90px" }}
            >
              {renderColoredText(titleText[0] || "")}
              {titleText[1] && (
                <>
                  <br />
                  {renderColoredText(titleText[1])}
                </>
              )}
            </h1>
          </div>

          {/* Video Thumbnail */}
          <div
            className="mb-12 rounded-xl overflow-hidden mx-auto w-4/5 cursor-pointer relative"
            onClick={handlePlayClick}
          >
            <Image
              src="/About-us-cover.svg"
              alt="Sotrixa About Us"
              width={500}
              height={500}
              className="w-full h-auto object-contain block"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 flex items-center justify-center -translate-y-4">
              <div className="w-14 h-14 rounded-full bg-white hover:bg-white/90 flex items-center justify-center transition-all duration-200 shadow-lg">
                <svg
                  className="w-6 h-6 text-black ml-0.5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Content */}
          <h2 className="font-bold text-black text-lg mb-4 leading-snug">
            {subheadingText}
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed font-normal">
            {testimonialText}
          </p>
        </div>
      </section>
    </>
  );
}
