"use client";

import React from "react";

interface MobileServiceInfoSectionProps {
  onBackClick?: () => void;
  activeService?: string;
}

interface ServiceContent {
  title: string;
  description: string[];
  values: {
    title: string;
    content?: string;
  }[];
}

const serviceContents: Record<string, ServiceContent> = {
  "CREATED TO MATTER": {
    title:
      "Empowering bold ideas with strategies that align vision, purpose, and growth.",
    description: [
      "Sotrixa partners with visionary entrepreneurs, creatives, and changemakers—those building with purpose and seeking clarity along the way.",
      "We work closely to translate bold ideas into aligned, authentic strategies that are ready for real-world growth.",
    ],
    values: [
      {
        title: "Impact",
        content:
          "Through deep research, sharp analysis, and strategic design, vision becomes structure—turning potential into direction, and ambition into action.",
      },
      {
        title: "Meaning",
        content:
          "Beyond client work, Sotrixa invests in artistic and educational initiatives, giving under-resourced children access to imagination, learning, and creative self-expression.",
      },
    ],
  },
  RESEARCH: {
    title:
      "Deep research, nuanced insight, and future-facing signals that shape powerful strategies.",
    description: [
      "At Sotrixa, research is a journey of co-discovery—driven by curiosity, shaped by context, and grounded in your vision.",
      "Together, we listen between the lines, observe subtle patterns, and trace emerging signals that guide strategic decisions.",
    ],
    values: [
      {
        title: "Curiosity",
        content:
          "By blending human stories with data-driven insights, we craft nuanced research journeys—through in-depth interviews, thoughtful surveys, cultural listening, and pattern-sensing.",
      },
      {
        title: "Conscience",
        content:
          "What we uncover together: Category Analysis, Competitive Analysis, Consumer Behavior Insights, Trend Scanning & Forecasting, and Audience Segmentation.",
      },
    ],
  },
  "BUSINESS ARCHITECTURE": {
    title:
      "Turning vision into a structured, evolving business—ready for real-world growth.",
    description: [
      "Every idea holds immense potential, but to thrive, it needs form, coherence, and a structure that sustains growth.",
      "At Sotrixa, we shape the fundamental elements of your business—what you offer, how you function, and the role you are meant to play.",
    ],
    values: [
      {
        title: "Structure",
        content:
          "Through co-creation, we translate concepts into frameworks and possibilities into actionable plans. Business Model Design, Offer Design & Positioning, and Operational Frameworks.",
      },
      {
        title: "Scalability",
        content:
          "We help define Mission, Vision & Values—the deeper truths that guide your evolution, while creating Growth Pathways to strategize expansion.",
      },
    ],
  },
  "BESPOKE STRATEGY CREATION": {
    title:
      "Precision-crafted roadmaps that move your vision forward with clarity, coherence, and purpose.",
    description: [
      "No two businesses move at the same rhythm.",
      "At Sotrixa, strategy honors your unique goals, capacity, and context—designing roadmaps that are intelligent, flexible, and fully aligned with your evolution.",
    ],
    values: [
      {
        title: "Precision",
        content:
          "Whether you are launching something new, expanding reach, refining an offer, or exploring partnerships, each strategic layer moves vision into structured momentum.",
      },
      {
        title: "Adaptability",
        content:
          "From go-to-market approaches and visibility plans to audience engagement, growth models, and positioning strategies.",
      },
    ],
  },
  "BRAND STORYTELLING": {
    title:
      "Bringing your business's true story to life—visually, verbally, and emotionally.",
    description: [
      "A brand is the memory, the feeling, the story people carry after they meet you.",
      "At Sotrixa, branding is an act of alignment: we listen deeply to what your business is becoming and translate that into visual and verbal identities that feel alive and true.",
    ],
    values: [
      {
        title: "Authenticity",
        content:
          "We create logos, color palettes, typography, design elements, and voice and tone guidelines—crafted with precision and emotional resonance.",
      },
      {
        title: "Distinction",
        content:
          "Your brand becomes an invitation: a true reflection of your story, ready to connect and inspire.",
      },
    ],
  },
  MARKETING: {
    title:
      "Expanding your presence with soulful marketing strategies that resonate and move.",
    description: [
      "Marketing is the movement of your story into the world—the choreography of voice, vision, and presence.",
      "At Sotrixa, we craft marketing strategies that are intelligent, soulful, and grounded in authenticity.",
    ],
    values: [
      {
        title: "Creativity",
        content:
          "From channel strategies and campaign direction to content pillars and creative activations, every element amplifies your voice with coherence and clarity.",
      },
      {
        title: "Measurement",
        content:
          "We design collaborations and strategic initiatives that expand your reach with purpose and impact, building sustainable momentum for your brand.",
      },
    ],
  },
  "WEBSITE DEVELOPMENT": {
    title:
      "Crafting websites where form meets feeling, and strategy becomes tangible experience.",
    description: [
      "Your website is the home of your vision—where strategy meets experience and form meets feeling.",
      "At Sotrixa, we design digital spaces that are beautiful, functional, and reflect your brand's essence while guiding your audience into connection and action.",
    ],
    values: [
      {
        title: "Usability",
        content:
          "Rooted in clarity, crafted with care, your website becomes a living, evolving expression of everything you stand for.",
      },
      {
        title: "Performance",
        content:
          "We build responsive, accessible experiences optimized to deliver your message with impact, creating seamless journeys that engage and convert.",
      },
    ],
  },
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
          {currentContent.title}
        </h1>

        {/* Description Paragraphs */}
        <div className="mb-10 space-y-4">
          {currentContent.description.map((paragraph, idx) => (
            <p
              key={idx}
              className="text-gray-700 text-sm leading-relaxed font-normal"
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* Values Section */}
        <div className="space-y-6">
          {currentContent.values.map((value, idx) => (
            <div
              key={idx}
              className={`${idx !== 0 ? "border-t border-gray-200 pt-6" : ""}`}
            >
              <h3 className="font-bold text-black text-sm mb-3">
                {value.title}
              </h3>
              {value.content && (
                <p className="text-gray-600 text-xs leading-relaxed font-normal">
                  {value.content}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileServiceInfoSection;
