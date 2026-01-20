// GSAP and ScrollTrigger animation types
import type gsap from 'gsap';

// GSAP Timeline type alias
export type GsapTimeline = ReturnType<typeof gsap.timeline>;

// Horizontal scroll controls interface
export interface HorizontalScrollControls {
  nextPanel: () => void;
  prevPanel: () => void;
  navigateToPanel: (index: number) => void;
  activeIndex: number;
}

// Extend Window interface for GSAP and scroll controls
declare global {
  interface Window {
    // Horizontal scroll controls
    horizontalScrollControls?: HorizontalScrollControls;

    // Scroll path pagination controls
    updateScrollPathFromProgress?: (progress: number) => void;

    // Service info section controls
    playServiceInfoExitAnimation?: () => GsapTimeline | undefined;
    goBackToServices?: () => void;

    // Services section state
    isServicesActive?: boolean;
    servicesHasControl?: boolean;
  }
}

// Letter elements for text animation
export interface LetterElements {
  chars: HTMLSpanElement[];
  revert: () => void;
}
