import React from "react";

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
      className="items-start"
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
              className="flex items-center justify-center border border-black hover:bg-gray-100 transition-colors rounded-sm"
              aria-label="Instagram"
              style={{
                width: "clamp(1.2rem, 2.2vw, 1.5rem)",
                height: "clamp(1.2rem, 2.2vw, 1.5rem)",
              }}
            >
              <svg
                className="text-black"
                fill="currentColor"
                viewBox="0 0 24 24"
                style={{
                  width: "clamp(1rem, 1.5vw, 1.25rem)",
                  height: "clamp(1rem, 1.5vw, 1.25rem)",
                }}
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
