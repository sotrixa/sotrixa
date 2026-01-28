"use client";

import React, { useState, useEffect } from "react";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export default function Section({
  children,
  className = "",
  id,
}: SectionProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Check if device is mobile using standard breakpoint
    const checkMobile = () => {
      const mobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent,
        ) || window.innerWidth < 1024;
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Use consistent default values during SSR and initial client render
  const sectionStyle = {
    scrollSnapAlign: "start" as const,
    // Default to hidden during SSR, then update on client
    overflowY: mounted && isMobile ? ("visible" as const) : ("hidden" as const),
  };

  return (
    <section
      id={id}
      className={`p-0 ${className}`}
      style={{ ...sectionStyle, boxSizing: "border-box" }}
    >
      {children}
    </section>
  );
}
