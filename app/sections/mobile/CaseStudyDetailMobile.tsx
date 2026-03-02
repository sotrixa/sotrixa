"use client";

import { useEffect, useRef } from "react";
// Using standard img tag for SVG support
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
      <div className="px-5 pb-8">
        {/* Header with close button */}
        <div className="flex justify-between items-center sticky top-0 bg-white py-4 mb-6 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Case Study</h2>
          <button
            onClick={handleClose}
            className="text-gray-600 hover:text-black transition-colors"
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

        {/* Title */}
        <div ref={titleRef} className="mb-6">
          <h1
            className="text-2xl font-black text-black mb-2"
            style={{ lineHeight: 1 }}
          >
            {study.title}
          </h1>
          <p className="text-sm text-gray-600">{study.subtitle}</p>
        </div>

        {/* Main Image */}
        <div ref={imageRef} className="mb-8">
          <div className="relative w-full h-64 rounded-lg overflow-hidden bg-gray-50 p-4">
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
              <h3 className="font-bold text-black text-sm mb-2">Overview</h3>
              <p className="text-gray-700 text-xs leading-relaxed">
                {study.description}
              </p>
            </div>
          )}

          {study.challenge && (
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-bold text-black text-sm mb-2">Challenge</h3>
              <p className="text-gray-700 text-xs leading-relaxed">
                {study.challenge}
              </p>
            </div>
          )}

          {study.solution && (
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-bold text-black text-sm mb-2">Solution</h3>
              <p className="text-gray-700 text-xs leading-relaxed">
                {study.solution}
              </p>
            </div>
          )}

          {study.results && (
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-bold text-black text-sm mb-2">Results</h3>
              <p className="text-gray-700 text-xs leading-relaxed">
                {study.results}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
