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
      const fixedHeight = Math.max(currentHeight, 800); // Minimum 800px

      // Set html and body to current viewport height
      document.documentElement.style.height = `${fixedHeight}px`;
      document.documentElement.style.minHeight = `${fixedHeight}px`;
      document.body.style.height = `${fixedHeight}px`;
      document.body.style.minHeight = `${fixedHeight}px`;

      // Enable vertical scroll when viewport is smaller than min-height
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
