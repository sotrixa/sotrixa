import React from "react";
import { InstagramIcon } from "hugeicons-react";

interface ContactInfoProps {
  contactInfoRef: React.RefObject<HTMLDivElement | null>;
  animationsCreated: boolean;
}

export function ContactInfo({
  contactInfoRef,
  animationsCreated,
}: ContactInfoProps) {
  return (
    <div
      className="items-start px-2 xs:px-1 sm:px-2 md:px-1 lg:px-2 xl:px-5"
      ref={contactInfoRef}
      style={{
        opacity: animationsCreated ? undefined : 1,
        marginBottom: "clamp(0.5rem, 1vw, 0.75rem)",
      }}
    >
      <div
        style={{
          display: "grid",
          gap: "clamp(0.4rem, 0.8vw, 0.6rem)",
        }}
      >
        <div>
          <p
            className="uppercase tracking-wider font-medium text-gray-500"
            style={{
              fontSize: "clamp(0.6rem, 0.85vw, 0.9rem)",
              marginBottom: "clamp(0.3rem, 0.6vw, 0.5rem)",
            }}
          >
            Get in touch with us
          </p>

          <div
            style={{
              display: "grid",
              gap: "clamp(0.3rem, 0.6vw, 0.5rem)",
            }}
          >
            <div
              className="flex items-center"
              style={{ gap: "clamp(0.3rem, 0.6vw, 0.5rem)" }}
            >
              <div
                className="flex items-center justify-center bg-black rounded-sm flex-shrink-0"
                style={{
                  width: "clamp(1.1rem, 1.6vw, 1.3rem)",
                  height: "clamp(1.1rem, 1.6vw, 1.3rem)",
                }}
              >
                <svg
                  className="text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  style={{
                    width: "clamp(0.65rem, 1vw, 0.85rem)",
                    height: "clamp(0.65rem, 1vw, 0.85rem)",
                  }}
                >
                  <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                  <path d="m22 7-10 5L2 7"></path>
                </svg>
              </div>
              <a
                href="mailto:direction@sotrixa.com"
                className="text-gray-700 hover:text-black transition-colors"
                style={{ fontSize: "clamp(0.75rem, 1.1vw, 1rem)" }}
              >
                direction@sotrixa.com
              </a>
            </div>

            <div
              className="flex items-center"
              style={{ gap: "clamp(0.3rem, 0.6vw, 0.5rem)" }}
            >
              <div
                className="flex items-center justify-center bg-gray-800 rounded-sm flex-shrink-0"
                style={{
                  width: "clamp(1.1rem, 1.6vw, 1.3rem)",
                  height: "clamp(1.1rem, 1.6vw, 1.3rem)",
                }}
              >
                <svg
                  className="text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  style={{
                    width: "clamp(0.65rem, 1vw, 0.85rem)",
                    height: "clamp(0.65rem, 1vw, 0.85rem)",
                  }}
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <p
                className="text-gray-700"
                style={{ fontSize: "clamp(0.75rem, 1.1vw, 1rem)" }}
              >
                Sofia, Bulgaria
              </p>
            </div>
          </div>
        </div>

        <div>
          <p
            className="uppercase tracking-wider font-medium text-gray-500"
            style={{
              fontSize: "clamp(0.6rem, 0.85vw, 0.9rem)",
              marginBottom: "clamp(0.3rem, 0.6vw, 0.5rem)",
            }}
          >
            Follow Us
          </p>
          <div className="flex" style={{ gap: "clamp(0.3rem, 0.6vw, 0.5rem)" }}>
            {/* Instagram */}
            <a
              href="https://www.instagram.com/sotrixa"
              className="flex items-center justify-center bg-black border border-white hover:bg-gray-800 transition-colors rounded-sm"
              aria-label="Instagram"
              style={{
                width: "clamp(1.2rem, 2.2vw, 1.5rem)",
                height: "clamp(1.2rem, 2.2vw, 1.5rem)",
              }}
            >
              <InstagramIcon
                className="text-white"
                size={16}
                strokeWidth={1.5}
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
