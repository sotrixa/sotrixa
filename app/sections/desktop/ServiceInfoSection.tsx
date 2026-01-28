"use client";

import React, { useEffect, useRef, useState } from "react";
import Section from "../../components/layout/Section";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ServiceInfoSectionProps } from "@/app/types/services";
import { LetterElements } from "@/app/types/animation";
import { serviceContents } from "./ServiceInfoSection/data/serviceContents";
import { BackgroundElements } from "./ServiceInfoSection/components/BackgroundElements";
import { LeftPanel } from "./ServiceInfoSection/components/LeftPanel";
import { RightPanel } from "./ServiceInfoSection/components/RightPanel";
import { useParticleEffects } from "./ServiceInfoSection/hooks/useParticleEffects";
import { useServiceAnimation } from "./ServiceInfoSection/hooks/useServiceAnimation";

// Register ScrollTrigger plugin only
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ServiceInfoSection({
  onBackClick,
  activeService: initialActiveService,
}: ServiceInfoSectionProps) {
  // Refs
  const sectionDivRef = useRef<HTMLDivElement>(null);
  const leftSideRef = useRef<HTMLDivElement>(null);
  const rightSideRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const servicesGridRef = useRef<HTMLDivElement>(null);
  const rightContentRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const dividerLineRef = useRef<HTMLDivElement>(null);
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const servicesTitleRef = useRef<HTMLHeadingElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const gridBackgroundRef = useRef<HTMLDivElement>(null);
  const gearRefs = useRef<Array<SVGSVGElement | null>>([]);

  // State
  const [activeService, setActiveService] = useState<string | undefined>(
    initialActiveService,
  );
  const serviceTitleRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const splitTextRefs = useRef<LetterElements[]>([]);

  // Get current content
  const currentContent =
    activeService && serviceContents[activeService]
      ? serviceContents[activeService]
      : serviceContents["RESEARCH"];

  // Hooks
  const { createParticles, animateParticles } = useParticleEffects({
    particlesRef,
  });
  const {
    animateLetterStagger,
    resetLetterAnimation,
    playExitAnimation,
    handleBackToServices,
    createLetterAnimations,
  } = useServiceAnimation({
    sectionDivRef,
    headingRef,
    servicesGridRef,
    rightContentRef,
    serviceTitleRefs,
    splitTextRefs,
    activeService,
    animateParticles,
    onBackClick,
  });

  // Main useEffect for animations
  useEffect(() => {
    const sectionDivCurrent = sectionDivRef.current;

    if (!sectionDivCurrent) return;

    // Create particles
    createParticles();

    // Animate grid background
    if (gridBackgroundRef.current) {
      gsap.to(gridBackgroundRef.current, {
        backgroundPosition:
          "100px 100px, 100px 100px, 200px 200px, 200px 200px",
        duration: 60,
        ease: "linear",
        repeat: -1,
      });
    }

    // Animate gears with varied speeds and directions
    gearRefs.current.forEach((gearRef, index) => {
      if (!gearRef) return;

      gsap.set(gearRef, {
        transformOrigin: "center center",
      });

      gsap.to(gearRef, {
        rotation: index % 2 === 0 ? "+=360" : "-=360",
        duration: 20 + index * 5,
        ease: "none",
        repeat: -1,
      });
    });

    // Initialize split text animations
    setTimeout(() => {
      createLetterAnimations();
    }, 100);

    // Initialize text styles for service titles
    serviceTitleRefs.current.forEach((titleRef, index) => {
      if (titleRef) {
        const serviceNames = [
          "RESEARCH",
          "BUSINESS ARCHITECTURE",
          "BESPOKE STRATEGY CREATION",
          "BRAND STORYTELLING",
          "MARKETING",
          "WEBSITE DEVELOPMENT",
        ];
        const service = serviceNames[index];

        gsap.set(titleRef, {
          letterSpacing: "0.05em",
          color: activeService === service ? "#DD53EB" : "#333",
          fontWeight: "bold",
          textShadow:
            activeService === service ? "0 0 3px rgba(221,83,235,0.3)" : "none",
        });

        if (activeService === service) {
          gsap.to(titleRef, {
            color: "#DD53EB",
            fontWeight: "bold",
            duration: 0.3,
          });
        }
      }
    });

    // Back button entrance animation
    gsap.fromTo(
      backButtonRef.current,
      {
        opacity: 0,
        x: -30,
        scale: 0.9,
      },
      {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 0.6,
        delay: 0.2,
        ease: "back.out(1.7)",
      },
    );

    // Initial entrance animations for section
    gsap.fromTo(
      sectionDivCurrent,
      {
        opacity: 0,
        scale: 0.95,
      },
      {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        delay: 0.3,
        ease: "power2.out",
      },
    );

    // Divider line animation
    if (dividerLineRef.current) {
      gsap.fromTo(
        dividerLineRef.current,
        {
          scaleY: 0,
        },
        {
          scaleY: 1,
          duration: 0.8,
          delay: 0.4,
          ease: "power2.out",
        },
      );
    }

    // Cleanup
    return () => {
      splitTextRefs.current.forEach((split) => split?.revert());
    };
  }, [activeService, createParticles, createLetterAnimations]);

  // Expose exit animation globally
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.playServiceInfoExitAnimation = playExitAnimation;
    }
  }, [playExitAnimation]);

  return (
    <Section
      id="services-info"
      className="bg-white w-screen h-screen flex items-center justify-center px-[clamp(1rem,3vw,2rem)]"
      style={{ minWidth: "100vw", minHeight: "100vh" }}
    >
      <BackgroundElements
        gridBackgroundRef={gridBackgroundRef}
        particlesRef={particlesRef}
        gearRefs={gearRefs}
      />

      <div
        ref={sectionDivRef}
        className="flex flex-col md:flex-row w-full h-full relative z-20 mx-auto my-0"
      >
        <LeftPanel
          leftSideRef={leftSideRef}
          logoRef={logoRef}
          backButtonRef={backButtonRef}
          headingRef={headingRef}
          servicesGridRef={servicesGridRef}
          activeService={activeService}
          setActiveService={setActiveService}
          handleBackToServices={handleBackToServices}
          serviceTitleRefs={serviceTitleRefs}
          resetLetterAnimation={resetLetterAnimation}
          animateLetterStagger={animateLetterStagger}
          animateParticles={animateParticles}
        />

        {/* Divider line */}
        <div className="relative md:h-full w-full md:w-[1px] h-[1px] my-4 md:my-0 mx-auto md:mx-0 flex-shrink-0">
          <div ref={dividerLineRef} className="absolute inset-0 bg-gray-200" />
        </div>

        <RightPanel
          rightSideRef={rightSideRef}
          rightContentRef={rightContentRef}
          servicesTitleRef={servicesTitleRef}
          activeService={activeService}
          currentContent={currentContent}
        />
      </div>
    </Section>
  );
}
