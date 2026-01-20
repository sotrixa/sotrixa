// Grid background animation utilities
import gsap from 'gsap';

export interface GridAnimationConfig {
  startPosition?: string;
  endPosition?: string;
  duration?: number;
  ease?: string;
  repeat?: number;
}

/**
 * Animates a grid background with continuous movement
 * @param elementRef - Reference to the element with the grid background
 * @param config - Configuration for the animation
 */
export const animateGridBackground = (
  elementRef: React.RefObject<HTMLElement>,
  config: GridAnimationConfig = {}
) => {
  if (!elementRef.current) return;

  const {
    startPosition = '0px 0px',
    endPosition = '40px 40px',
    duration = 8,
    ease = 'linear',
    repeat = -1, // Infinite repetition
  } = config;

  // Initial position
  gsap.set(elementRef.current, {
    backgroundPosition: startPosition,
  });

  // Create continuous animation for grid movement
  gsap.to(elementRef.current, {
    backgroundPosition: endPosition,
    duration,
    ease,
    repeat,
  });
};

/**
 * Kills any running grid background animation
 * @param elementRef - Reference to the element with the grid background
 */
export const killGridAnimation = (elementRef: React.RefObject<HTMLElement>) => {
  if (!elementRef.current) return;
  gsap.killTweensOf(elementRef.current);
};
