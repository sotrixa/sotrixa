'use client';

import { useEffect } from 'react';

/**
 * Locks the viewport height to initial value on page load.
 * Prevents content from moving when browser window is minimized vertically.
 */
export default function HeightLocker() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Capture initial viewport height in pixels - ONCE, NEVER CHANGES
    const initialHeight = window.innerHeight;
    const fixedHeight = Math.max(initialHeight, 800); // Minimum 800px

    // Set html and body to fixed pixel heights
    document.documentElement.style.height = `${fixedHeight}px`;
    document.documentElement.style.minHeight = `${fixedHeight}px`;
    document.body.style.height = `${fixedHeight}px`;
    document.body.style.minHeight = `${fixedHeight}px`;

    // Prevent any resize events from changing this
    // (no resize listener - we want it locked forever)
  }, []); // Run once on mount, never again

  return null; // This component renders nothing
}
