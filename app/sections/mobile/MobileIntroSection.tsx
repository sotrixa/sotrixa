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
      <section id="mobile-intro" className="w-full bg-white">
        <div className="px-6 py-12">
          {/* Label */}
          <div className="mb-6">
            <span className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase">
              About
            </span>
          </div>

          {/* Title */}
          <div className="mb-8">
            <h1
              className="font-black text-black leading-[1.1]"
              style={{ fontSize: "1.875rem" }}
            >
              {renderColoredText(titleText[0] || "")}
            </h1>
            <h1
              className="font-black text-black leading-[1.1] mt-1"
              style={{ fontSize: "1.875rem" }}
            >
              {renderColoredText(titleText[1] || "")}
            </h1>
          </div>

          {/* Video Thumbnail */}
          <div className="mb-8" onClick={handlePlayClick}>
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gray-100 cursor-pointer">
              <Image
                src="/About-us-cover.svg"
                alt="Sotrixa"
                fill
                className="object-contain"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white shadow-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-black ml-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="mb-2">
            <h2 className="font-bold text-black text-lg mb-3">
              {subheadingText}
            </h2>
            <p className="text-gray-500 text-[15px] leading-relaxed">
              {testimonialText}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
