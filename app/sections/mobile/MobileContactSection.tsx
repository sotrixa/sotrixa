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
    <section
      id="mobile-contact"
      style={{ backgroundColor: "#fbfbfb" }}
      className="w-full"
    >
      <div className="px-4 py-12 max-w-md mx-auto">
        {/* Title */}
        <div className="mb-8">
          <h1 className="font-black text-black leading-tight text-3xl md:text-4xl mb-4 scroll-mt-[90px]">
            Let&apos;s Talk
          </h1>
          <p className="text-gray-600 text-sm font-normal leading-relaxed">
            Have a project in mind? Let&apos;s create something great together.
          </p>
        </div>

        {/* Video */}
        <div className="mb-8 rounded-xl overflow-hidden w-full aspect-square">
          <video
            src="/video/Contact-page-video.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        </div>

        {/* Contact Information */}
        <div className="space-y-3 mb-12 bg-white rounded-xl p-5">
          {/* Email */}
          <a
            href="mailto:direction@sotrixa.com"
            className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
          >
            <svg
              className="w-6 h-6 text-gray-700 flex-shrink-0 mt-0.5"
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
              <p className="text-xs text-gray-500 font-semibold uppercase mb-1">
                Email
              </p>
              <p className="text-sm text-gray-900 font-medium break-all">
                direction@sotrixa.com
              </p>
            </div>
          </a>

          {/* Divider */}
          <div className="h-px bg-gray-200"></div>

          {/* Location */}
          <div className="flex items-start gap-4 p-3">
            <svg
              className="w-6 h-6 text-gray-700 flex-shrink-0 mt-0.5"
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
              <p className="text-xs text-gray-500 font-semibold uppercase mb-1">
                Location
              </p>
              <p className="text-sm text-gray-900 font-medium">
                Sofia, Bulgaria
              </p>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="grid grid-cols-2 gap-3 mb-12">
          <a
            href="https://www.instagram.com/sotrixa"
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-4 bg-black text-white text-center rounded-lg hover:bg-gray-900 active:scale-95 transition-all duration-200 text-sm font-semibold cursor-pointer min-h-[44px] flex items-center justify-center"
          >
            Instagram
          </a>
          <a
            href="https://www.linkedin.com/company/sotrixa"
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-4 bg-black text-white text-center rounded-lg hover:bg-gray-900 active:scale-95 transition-all duration-200 text-sm font-semibold cursor-pointer min-h-[44px] flex items-center justify-center"
          >
            LinkedIn
          </a>
        </div>

        {/* Status Messages */}
        {isSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-semibold text-sm">
              ✓ Message sent successfully!
            </p>
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-semibold text-sm">Error: {error}</p>
          </div>
        )}

        {/* Contact Form */}
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase block mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/30 focus:border-transparent text-sm placeholder-gray-400 font-normal min-h-[44px]"
              placeholder="Your name"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase block mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/30 focus:border-transparent text-sm placeholder-gray-400 font-normal min-h-[44px]"
              placeholder="your@email.com"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase block mb-2">
              Subject
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/30 focus:border-transparent text-sm placeholder-gray-400 font-normal min-h-[44px]"
              placeholder="Project or inquiry"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase block mb-2">
              Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={5}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/30 focus:border-transparent text-sm placeholder-gray-400 resize-none font-normal"
              placeholder="Tell us about your project..."
              required
              disabled={isSubmitting}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-4 bg-black text-white font-semibold rounded-lg hover:bg-gray-900 active:scale-95 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-sm min-h-[48px] mt-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              "Send Message"
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
