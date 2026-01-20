import type { ServiceContent } from '@/app/types/services';
import type { LetterElements } from '@/app/types/animation';
import type { GsapTimeline } from '@/app/types/animation';

// Background Elements
export interface BackgroundElementsProps {
  gridBackgroundRef: React.RefObject<HTMLDivElement | null>;
  particlesRef: React.RefObject<HTMLDivElement | null>;
  gearRefs: React.MutableRefObject<(SVGSVGElement | null)[]>;
}

// Left Panel
export interface LeftPanelProps {
  leftSideRef: React.RefObject<HTMLDivElement | null>;
  logoRef: React.RefObject<HTMLDivElement | null>;
  backButtonRef: React.RefObject<HTMLButtonElement | null>;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  servicesGridRef: React.RefObject<HTMLDivElement | null>;
  activeService: string | undefined;
  setActiveService: (service: string) => void;
  handleBackToServices: () => void;
  serviceTitleRefs: React.MutableRefObject<(HTMLHeadingElement | null)[]>;
  resetLetterAnimation: (index: number) => void;
  animateLetterStagger: (index: number) => GsapTimeline;
  animateParticles: () => void;
}

// Right Panel
export interface RightPanelProps {
  rightSideRef: React.RefObject<HTMLDivElement | null>;
  rightContentRef: React.RefObject<HTMLDivElement | null>;
  servicesTitleRef: React.RefObject<HTMLHeadingElement | null>;
  activeService: string | undefined;
  currentContent: ServiceContent;
}

// Particle Effects Hook
export interface UseParticleEffectsParams {
  particlesRef: React.RefObject<HTMLDivElement | null>;
}

export interface UseParticleEffectsReturn {
  createParticles: () => void;
  animateParticles: () => void;
}

// Service Animation Hook
export interface UseServiceAnimationParams {
  sectionDivRef: React.RefObject<HTMLDivElement | null>;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  servicesGridRef: React.RefObject<HTMLDivElement | null>;
  rightContentRef: React.RefObject<HTMLDivElement | null>;
  serviceTitleRefs: React.MutableRefObject<(HTMLHeadingElement | null)[]>;
  splitTextRefs: React.MutableRefObject<LetterElements[]>;
  activeService: string | undefined;
  animateParticles: () => void;
  onBackClick?: () => void;
}

export interface UseServiceAnimationReturn {
  animateLetterStagger: (index: number) => GsapTimeline;
  resetLetterAnimation: (index: number) => void;
  playExitAnimation: () => GsapTimeline | undefined;
  handleBackToServices: () => void;
  createLetterAnimations: () => void;
}

// Color mappings type
export type ColorMappings = Record<string, Record<string, string>>;

// Service navigation item
export interface ServiceNavigationItem {
  name: string;
  icon: string;
}
