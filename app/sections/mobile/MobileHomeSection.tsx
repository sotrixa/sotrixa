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
      <div className="px-5 pt-16 pb-10">
        {/* Brand */}
        <div className="mb-8">
          <span className="text-[11px] font-bold tracking-widest text-gray-500 uppercase">
            Sotrixa
          </span>
        </div>

        {/* Hero */}
        <div className="mb-8">
          <h1
            className="font-black text-black leading-tight"
            style={{ fontSize: "1.75rem" }}
          >
            We are a <span style={{ color: "#53EBDD" }}>strategy</span> lab for{" "}
            <span style={{ color: "#DD53EB" }}>visionary</span>{" "}
            <span style={{ color: "#EBDD53" }}>thinkers</span>
          </h1>
        </div>

        <p className="text-gray-600 text-sm leading-relaxed mb-8">
          {getText("homeSection.paragraph", language)}
        </p>

        {/* Video */}
        <div className="mb-8 rounded-lg overflow-hidden bg-black">
          <div className="aspect-video bg-black">
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
        <div className="space-y-2.5">
          <button
            onClick={() => scrollToSection("mobile-contact")}
            className="w-full py-3 bg-black text-white font-semibold text-sm rounded-lg transition-opacity active:opacity-80"
          >
            {getText("homeSection.talkToUs", language)}
          </button>
          <button
            onClick={() => scrollToSection("mobile-services")}
            className="w-full py-3 bg-gray-100 text-black font-semibold text-sm rounded-lg transition-opacity active:opacity-80"
          >
            What we do
          </button>
          <button
            onClick={() => scrollToSection("mobile-case-studies")}
            className="w-full py-3 text-gray-700 font-semibold text-sm transition-opacity active:opacity-60"
          >
            See our work
          </button>
        </div>
      </div>
    </section>
  );
}
