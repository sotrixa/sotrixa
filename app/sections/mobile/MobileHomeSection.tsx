"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from "../../data/LanguageContext";
import { getText } from "../../data/translations";

export default function MobileHomeSection() {
  const { language } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.play().catch(() => {});
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="mobile-home" className="w-full bg-white">
      <div className="px-6 pt-20 pb-12">
        {/* Brand */}
        <div className="mb-6">
          <span className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase">
            Sotrixa
          </span>
        </div>

        {/* Hero */}
        <div className="mb-8">
          <h1
            className="font-black text-black leading-[1.05]"
            style={{ fontSize: "2.25rem" }}
          >
            We are a <span style={{ color: "#53EBDD" }}>strategy</span>
            <br />
            lab for <span style={{ color: "#DD53EB" }}>visionary</span>{" "}
            <span style={{ color: "#EBDD53" }}>thinkers</span>
          </h1>
        </div>

        <p className="text-gray-500 text-[15px] leading-relaxed mb-8 max-w-xs">
          {getText("homeSection.paragraph", language)}
        </p>

        {/* Video Card */}
        <div className="mb-8 rounded-2xl overflow-hidden bg-black shadow-lg">
          <div className="h-6 bg-[#222] flex items-center px-3">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="px-2 py-0.5 bg-[#111] rounded text-[8px] text-white/30 font-mono">
                sotrixa.com
              </div>
            </div>
          </div>
          <div className="aspect-[16/9] bg-black">
            <video
              ref={videoRef}
              src="/video/0223.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3 mb-6">
          <button
            onClick={() => scrollToSection("mobile-contact")}
            className="w-full py-4 bg-black text-white font-bold rounded-xl active:scale-[0.98] transition-transform"
          >
            {getText("homeSection.talkToUs", language)}
          </button>
          <button
            onClick={() => scrollToSection("mobile-services")}
            className="w-full py-4 bg-gray-100 text-black font-semibold rounded-xl active:scale-[0.98] transition-transform"
          >
            What we do
          </button>
        </div>

        {/* Link */}
        <button
          onClick={() => scrollToSection("mobile-case-studies")}
          className="text-gray-400 text-sm font-medium hover:text-black transition-colors flex items-center gap-2"
        >
          {getText("homeSection.seeOurWork", language)}
          <svg
            className="w-4 h-4"
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
    </section>
  );
}
