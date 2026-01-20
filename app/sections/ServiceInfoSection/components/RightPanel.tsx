import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { RightPanelProps } from '../types';

// Function to render text with styled dashes
const renderTextWithStyledDashes = (text: string) => {
  // Handle all types of dashes: regular hyphen (-), en dash (–), and em dash (—)
  const parts = text.split(/(—|–|-)/g);

  return parts.map((part, i) => {
    // Check if this part is any type of dash
    if (part === '—' || part === '–' || part === '-') {
      return (
        <span key={i} className="inline-block" style={{ fontSize: '1em', fontWeight: '200', transform: 'scaleX(0.5)' }}>
          –
        </span>
      );
    }

    return <span key={i}>{part}</span>;
  });
};

export function RightPanel({ rightSideRef, rightContentRef, servicesTitleRef, activeService, currentContent }: RightPanelProps) {
  return (
    <div className='w-full md:w-1/2 p-4 md:p-0 flex flex-col justify-start' ref={rightSideRef}>
      <AnimatePresence mode='wait'>
        <motion.div
          ref={rightContentRef}
          key={activeService}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <h3 ref={servicesTitleRef} className='text-2xl font-black mb-6 text-black'>
            {activeService || 'Services'}
          </h3>

          <div className='mb-8'>
            {currentContent.description.map((paragraph, index) => {
              // Group of bullet points
              if (paragraph.startsWith('•')) {
                // Extract content after the bullet point and dash
                const parts = paragraph.substring(1).trim().split('–');
                const bulletTitle = parts[0].trim();
                const bulletContent = parts.length > 1 ? parts[1].trim() : '';

                return (
                  <div key={index} className='flex items-start group hover:translate-x-1 transition-transform duration-300 py-[1px]'>
                    <span className='text-[#DD53EB] text-xs mr-1.5 mt-[3px] opacity-90 group-hover:opacity-100 flex-shrink-0'>•</span>
                    <div className='text-gray-700 leading-snug'>
                      <span className='font-medium text-gray-800'>{bulletTitle}</span>
                      {bulletContent && (
                        <>
                          {' '}
                          <span className="inline-block" style={{ fontSize: '1em', fontWeight: '200', transform: 'scaleX(0.5)' }}>
                            –
                          </span>
                          {' '}
                          <span className='text-gray-600 text-xs'>{renderTextWithStyledDashes(bulletContent)}</span>
                        </>
                      )}
                    </div>
                  </div>
                );
              }

              // Header for list sections (like "What we uncover together:")
              if (paragraph.endsWith(':​')) {
                return (
                  <p key={index} className='text-gray-700 font-medium mt-4 mb-1.5'>
                    {paragraph}
                  </p>
                );
              }

              // Empty line creates spacing
              if (paragraph === '') {
                return <div key={index} className='h-2' />;
              }

              // Regular paragraph
              return (
                <p key={index} className='text-gray-700 leading-relaxed mb-3'>
                  {renderTextWithStyledDashes(paragraph)}
                </p>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
