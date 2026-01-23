'use client';

import { useEffect } from 'react';

/**
 * Locks the viewport height to initial value on page load.
 * Prevents content from moving when browser window is minimized vertically.
 */
export default function HeightLocker() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Function to update heights based on current viewport
    const updateHeights = () => {
      const currentHeight = window.innerHeight;

      // Set html and body to ALWAYS match current viewport height
      document.documentElement.style.height = `${currentHeight}px`;
      document.documentElement.style.minHeight = `${currentHeight}px`;
      document.body.style.height = `${currentHeight}px`;
      document.body.style.minHeight = `${currentHeight}px`;

      // Enable vertical scroll when viewport is smaller than 800px
      // This allows users on smaller screens to scroll to see all content
      if (currentHeight < 800) {
        document.documentElement.style.overflow = 'auto';
        document.body.style.overflow = 'auto';
      } else {
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
      }
    };

    // Update on mount
    updateHeights();

    // Update on resize
    window.addEventListener('resize', updateHeights);

    return () => {
      window.removeEventListener('resize', updateHeights);
    };
  }, []);

  return null; // This component renders nothing
}
