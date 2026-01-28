"use client";

import { useRef } from "react";
import Section from "../../../components/layout/Section";
import { useContactForm } from "../../../lib/hooks/useContactForm";
import { useContactAnimation } from "./hooks/useContactAnimation";
import { useForceInteractivity } from "./hooks/useForceInteractivity";
import { ContactInfo } from "./components/ContactInfo";
import { ContactForm } from "./components/ContactForm";
import { ContactImage } from "./components/ContactImage";

export default function ContactSection() {
  // Initialize refs
  const formRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const contactInfoRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const formItemsRef = useRef<HTMLDivElement[]>([]);

  // Hooks
  const {
    formData,
    isSubmitting,
    isSuccess,
    error,
    handleInputChange,
    handleSubmit,
  } = useContactForm();
  const { animationsCreated } = useContactAnimation({
    formRef,
    headingRef,
    contactInfoRef,
    imageRef,
    formItemsRef,
  });
  useForceInteractivity();

  return (
    <Section
      id="contact"
      className="bg-[#FAFAFA] text-black w-screen h-screen flex items-center justify-center px-[clamp(1rem,3vw,2rem)]"
    >
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 items-start">
          {/* Left Column - Contact Content */}
          <div>
            <ContactInfo
              contactInfoRef={contactInfoRef}
              animationsCreated={animationsCreated}
            />
            <ContactForm
              formRef={formRef}
              formItemsRef={formItemsRef}
              animationsCreated={animationsCreated}
              formData={formData}
              isSubmitting={isSubmitting}
              isSuccess={isSuccess}
              error={error}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
            />
          </div>

          {/* Right Column - Image */}
          <ContactImage
            imageRef={imageRef}
            animationsCreated={animationsCreated}
          />
        </div>
      </div>
    </Section>
  );
}
