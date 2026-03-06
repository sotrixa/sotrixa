"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

type CaseStudy = {
  title: string;
  subtitle: string;
  image: string;
  description?: string;
  challenge?: string;
  solution?: string;
  results?: string;
};

type CaseStudyDetailMobileProps = {
  study: CaseStudy;
  caseStudies: Record<string, CaseStudy[]>;
  onClose: () => void;
};

export default function CaseStudyDetailMobile({
  study,
  onClose,
}: CaseStudyDetailMobileProps) {
  const detailRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Animation on mount
  useEffect(() => {
    if (!detailRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Set initial states
      gsap.set([titleRef.current, imageRef.current, contentRef.current], {
        opacity: 0,
        y: 30,
      });

      // Animate elements in
      tl.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
      });

      tl.to(
        imageRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
        },
        "-=0.4",
      );

      tl.to(
        contentRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
        },
        "-=0.4",
      );
    }, detailRef);

    return () => ctx.revert();
  }, [study]);

  // Handle close with animation
  const handleClose = () => {
    if (!detailRef.current) {
      onClose();
      return;
    }

    const tl = gsap.timeline({
      onComplete: onClose,
    });

    tl.to([titleRef.current, imageRef.current, contentRef.current], {
      opacity: 0,
      y: -20,
      duration: 0.3,
      stagger: 0.05,
      ease: "power2.in",
    });
  };

  return (
    <div
      ref={detailRef}
      className="fixed inset-0 bg-white z-50 overflow-y-auto"
    >
      {/* Header with close button */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex justify-between items-center">
        <h2 className="text-sm font-semibold text-gray-900">Case Study</h2>
        <button
          onClick={handleClose}
          className="text-gray-600 hover:text-black transition-colors cursor-pointer p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Close case study"
        >
          <svg
            className="w-5 h-5"
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
      </div>

      {/* Content */}
      <div className="px-4 py-8 max-w-md mx-auto">
        {/* Title Section */}
        <div ref={titleRef} className="mb-8">
          <h1 className="text-2xl font-black text-black mb-3 leading-snug">
            {study.title}
          </h1>
          <p className="text-sm text-gray-600 font-normal">{study.subtitle}</p>
        </div>

        {/* Main Image */}
        <div ref={imageRef} className="mb-10">
          <div className="relative w-full h-64 rounded-xl overflow-hidden bg-gray-50 p-6 shadow-sm">
            <img
              src={study.image}
              alt={study.title}
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Content Sections */}
        <div ref={contentRef} className="space-y-6 pb-12">
          {study.description && (
            <div>
              <h3 className="font-bold text-black text-sm mb-3">Overview</h3>
              <p className="text-gray-700 text-sm leading-relaxed font-normal">
                {study.description}
              </p>
            </div>
          )}

          {study.challenge && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-bold text-black text-sm mb-3">Challenge</h3>
              <p className="text-gray-700 text-sm leading-relaxed font-normal">
                {study.challenge}
              </p>
            </div>
          )}

          {study.solution && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-bold text-black text-sm mb-3">Solution</h3>
              <p className="text-gray-700 text-sm leading-relaxed font-normal">
                {study.solution}
              </p>
            </div>
          )}

          {study.results && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-bold text-black text-sm mb-3">Results</h3>
              <p className="text-gray-700 text-sm leading-relaxed font-normal">
                {study.results}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
