"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
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
    <Section id="contact" className="bg-[#FAFAFA] text-black relative">
      <div
        className="flex flex-col lg:flex-row gap-[clamp(0.5rem,3vw,1.5rem)] relative z-10 items-center justify-center w-screen h-screen"
        style={{
          minWidth: "100vw",
          minHeight: "100vh",
          padding: "clamp(0.75rem, 1.5vw, 1.25rem) clamp(0.6rem, 1.5vw, 1rem)",
        }}
      >
        {/* Left Column - Contact Content */}
        <motion.div
          className="flex-1 flex flex-col items-start min-w-0 min-h-0 justify-center"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="w-full text-left min-w-0">
            <div
              ref={headingRef}
              style={{ marginBottom: "clamp(0.75rem, 1.5vw, 1.25rem)" }}
            ></div>

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
        </motion.div>

        {/* Right Column - Image */}
        <motion.div
          className="hidden lg:flex relative flex-1 min-w-0 min-h-0 items-center justify-center"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <ContactImage
            imageRef={imageRef}
            animationsCreated={animationsCreated}
          />
        </motion.div>
      </div>
    </Section>
  );
}
