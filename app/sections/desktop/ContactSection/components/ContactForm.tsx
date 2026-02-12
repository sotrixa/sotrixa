import React from "react";
import {
  formContainerStyles,
  formItemWrapperStyles,
} from "../utils/formStyles";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactFormProps {
  formRef: React.RefObject<HTMLDivElement | null>;
  formItemsRef: React.MutableRefObject<HTMLDivElement[]>;
  animationsCreated: boolean;
  formData: ContactFormData;
  isSubmitting: boolean;
  isSuccess: boolean;
  error: string | null;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export function ContactForm({
  formRef,
  formItemsRef,
  animationsCreated,
  formData,
  isSubmitting,
  isSuccess,
  error,
  handleInputChange,
  handleSubmit,
}: ContactFormProps) {
  // Add element to formItemsRef array
  const addToFormRefs = (el: HTMLDivElement | null) => {
    if (el && !formItemsRef.current.includes(el)) {
      formItemsRef.current.push(el);
    }
  };

  return (
    <div
      ref={formRef}
      className="xs:px-1 sm:px-2 md:px-1 lg:px-2 xl:px-5 pt-4"
      style={{ opacity: animationsCreated ? undefined : 1 }}
    >
      {/* Success Message */}
      {isSuccess && (
        <div
          className="mb-4 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-md"
          style={{ fontSize: "clamp(0.75rem, 1.2vw, 0.875rem)" }}
        >
          <p className="text-green-800 font-medium">
            ✓ Message sent successfully!
          </p>
          <p className="text-green-600 text-xs mt-1">
            We&apos;ll get back to you soon.
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div
          className="mb-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-md"
          style={{ fontSize: "clamp(0.75rem, 1.2vw, 0.875rem)" }}
        >
          <p className="text-red-800 font-medium">⚠ {error}</p>
          <p className="text-red-600 text-xs mt-1">
            Please try again or contact us directly.
          </p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-[clamp(0.3rem,0.7vw,0.5rem)] contact-form-override"
        style={formContainerStyles}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[clamp(0.3rem,0.6vw,0.5rem)]">
          <div
            ref={addToFormRefs}
            style={formItemWrapperStyles(animationsCreated)}
          >
            <label
              htmlFor="name"
              className="block font-medium text-gray-700"
              style={{
                fontSize: "clamp(0.6rem, 0.85vw, 0.9rem)",
                marginBottom: "clamp(0.2rem, 0.5vw, 0.4rem)",
              }}
            >
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors text-gray-800"
              style={{
                padding:
                  "clamp(0.3rem, 0.7vw, 0.55rem) clamp(0.35rem, 0.9vw, 0.6rem)",
                fontSize: "clamp(0.75rem, 1.1vw, 1rem)",
              }}
              placeholder="John Doe"
              required
              disabled={isSubmitting}
            />
          </div>

          <div
            ref={addToFormRefs}
            style={formItemWrapperStyles(animationsCreated)}
          >
            <label
              htmlFor="email"
              className="block font-medium text-gray-700"
              style={{
                fontSize: "clamp(0.6rem, 0.85vw, 0.9rem)",
                marginBottom: "clamp(0.2rem, 0.5vw, 0.4rem)",
              }}
            >
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors text-gray-800"
              style={{
                padding:
                  "clamp(0.3rem, 0.7vw, 0.55rem) clamp(0.35rem, 0.9vw, 0.6rem)",
                fontSize: "clamp(0.75rem, 1.1vw, 1rem)",
              }}
              placeholder="john@example.com"
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div
          ref={addToFormRefs}
          style={formItemWrapperStyles(animationsCreated)}
        >
          <label
            htmlFor="subject"
            className="block font-medium text-gray-700"
            style={{
              fontSize: "clamp(0.6rem, 0.85vw, 0.9rem)",
              marginBottom: "clamp(0.2rem, 0.5vw, 0.4rem)",
            }}
          >
            Subject *
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            className="w-full bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors text-gray-800"
            style={{
              padding:
                "clamp(0.3rem, 0.7vw, 0.55rem) clamp(0.35rem, 0.9vw, 0.6rem)",
              fontSize: "clamp(0.75rem, 1.1vw, 1rem)",
            }}
            placeholder="Project inquiry"
            required
            disabled={isSubmitting}
          />
        </div>

        <div
          ref={addToFormRefs}
          style={formItemWrapperStyles(animationsCreated)}
        >
          <label
            htmlFor="message"
            className="block font-medium text-gray-700"
            style={{
              fontSize: "clamp(0.6rem, 0.85vw, 0.9rem)",
              marginBottom: "clamp(0.2rem, 0.5vw, 0.4rem)",
            }}
          >
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows={3}
            className="w-full bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors text-gray-800 resize-none"
            style={{
              padding:
                "clamp(0.3rem, 0.7vw, 0.55rem) clamp(0.35rem, 0.9vw, 0.6rem)",
              fontSize: "clamp(0.75rem, 1.1vw, 1rem)",
            }}
            placeholder="Tell us about your project..."
            required
            disabled={isSubmitting}
          ></textarea>
        </div>

        <div
          ref={addToFormRefs}
          style={{
            ...formItemWrapperStyles(animationsCreated),
            userSelect: undefined,
          }}
        >
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-black text-white font-medium rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-[clamp(0.25rem,1vw,0.5rem)]"
            style={{
              padding:
                "clamp(0.3rem, 0.7vw, 0.55rem) clamp(0.7rem, 1.3vw, 1.1rem)",
              fontSize: "clamp(0.75rem, 1.1vw, 1rem)",
            }}
          >
            {isSubmitting ? (
              <>
                <div
                  className="border border-white border-t-transparent rounded-full animate-spin"
                  style={{
                    width: "clamp(0.55rem, 0.9vw, 0.8rem)",
                    height: "clamp(0.55rem, 0.9vw, 0.8rem)",
                  }}
                ></div>
                Sending...
              </>
            ) : (
              "Send Message"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
