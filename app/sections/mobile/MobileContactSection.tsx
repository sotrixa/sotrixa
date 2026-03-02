"use client";

import { useRef } from "react";
import { useContactForm } from "../../lib/hooks/useContactForm";

export default function MobileContactSection() {
  const formRef = useRef<HTMLFormElement>(null);
  const {
    formData,
    isSubmitting,
    isSuccess,
    error,
    handleInputChange,
    handleSubmit,
  } = useContactForm();

  return (
    <section id="mobile-contact" className="w-full bg-white">
      <div className="px-5 py-10">
        {/* Label */}
        <div className="mb-6">
          <span className="text-[11px] font-bold tracking-widest text-gray-500 uppercase">
            Contact
          </span>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h1
            className="font-black text-black leading-tight"
            style={{ fontSize: "1.75rem" }}
          >
            Let&apos;s Talk
          </h1>
          <p className="text-gray-600 text-sm mt-3 leading-relaxed">
            Have a project in mind? Let&apos;s create something great together.
          </p>
        </div>

        {/* Contact Info */}
        <div className="space-y-3 mb-8">
          <a
            href="mailto:direction@sotrixa.com"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg
              className="w-5 h-5 text-gray-700 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 font-semibold uppercase">
                Email
              </p>
              <p className="text-sm text-gray-900 font-medium truncate">
                direction@sotrixa.com
              </p>
            </div>
          </a>

          <div className="flex items-center gap-3 p-3 rounded-lg">
            <svg
              className="w-5 h-5 text-gray-700 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
            </svg>
            <div className="flex-1">
              <p className="text-xs text-gray-500 font-semibold uppercase">
                Location
              </p>
              <p className="text-sm text-gray-900 font-medium">
                Sofia, Bulgaria
              </p>
            </div>
          </div>
        </div>

        {/* Social */}
        <div className="flex gap-2 mb-8">
          <a
            href="https://www.instagram.com/sotrixa"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-xs font-semibold"
          >
            Instagram
          </a>
          <a
            href="https://www.linkedin.com/company/sotrixa"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-xs font-semibold"
          >
            LinkedIn
          </a>
        </div>

        {/* Status Messages */}
        {isSuccess && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-semibold text-xs">
              Message sent successfully!
            </p>
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-semibold text-xs">Error: {error}</p>
          </div>
        )}

        {/* Form */}
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 text-sm placeholder-gray-500"
            placeholder="Name"
            required
            disabled={isSubmitting}
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 text-sm placeholder-gray-500"
            placeholder="Email"
            required
            disabled={isSubmitting}
          />
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 text-sm placeholder-gray-500"
            placeholder="Subject"
            required
            disabled={isSubmitting}
          />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 text-sm placeholder-gray-500 resize-none"
            placeholder="Message"
            required
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2 text-sm"
          >
            {isSubmitting ? (
              <>
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              "Send"
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
