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
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <section
      id="mobile-home"
      style={{ backgroundColor: "#fbfbfb" }}
      className="w-full min-h-screen"
    >
      <div className="px-4 pt-28 pb-16 max-w-md mx-auto">
        {/* Brand Label */}

        {/* Hero Headline */}
        <div className="mb-8">
          <h1 className="font-black text-black leading-tight text-4xl md:text-5xl scroll-mt-[90px]">
            We are a <span style={{ color: "#53EBDD" }}>strategy</span> lab for{" "}
            <span style={{ color: "#DD53EB" }}>visionary</span>{" "}
            <span style={{ color: "#EBDD53" }}>thinkers</span>
          </h1>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed mb-12 font-normal">
          {getText("homeSection.paragraph", language)}
        </p>

        {/* Video Section - Centered */}
        <div className="mb-12 rounded-xl overflow-hidden bg-gray-900 mx-auto w-full">
          <video
            ref={videoRef}
            src="/video/0223.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-auto object-contain block"
          />
        </div>

        {/* CTA Buttons */}
        <div className="space-y-2.5">
          <a
            href="#mobile-contact"
            className="block w-full py-3 px-4 bg-black text-white font-semibold text-sm rounded-lg transition-all duration-200 active:scale-95 active:opacity-80 hover:bg-gray-900 cursor-pointer min-h-[40px] text-center"
          >
            {getText("homeSection.talkToUs", language)}
          </a>
          <a
            href="#mobile-services"
            className="block w-full py-3 px-4 bg-gray-100 text-black font-semibold text-sm rounded-lg transition-all duration-200 active:scale-95 active:opacity-80 hover:bg-gray-200 cursor-pointer min-h-[40px] text-center"
          >
            What we do
          </a>
          <a
            href="#mobile-case-studies"
            className="block w-full py-3 px-4 text-gray-700 font-semibold text-sm transition-all duration-200 active:opacity-60 hover:text-black cursor-pointer border-b border-gray-300 pb-2 min-h-[40px] text-center"
          >
            See our work
          </a>
        </div>
      </div>
    </section>
  );
}
