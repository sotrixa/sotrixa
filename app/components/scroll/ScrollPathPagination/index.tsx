import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PathSVG } from './components/PathSVG';
import { NavigationDots, calculateDotPositions } from './components/NavigationDots';
import { useScrollPath } from './hooks/useScrollPath';
import { useDotNavigation } from './hooks/useDotNavigation';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Extend Window interface to include our function
declare global {
  interface Window {
    horizontalScrollControls?: {
      nextPanel: () => void;
      prevPanel: () => void;
      navigateToPanel: (index: number) => void;
      activeIndex: number;
    };
    updateScrollPathFromProgress?: (progress: number) => void;
  }
}

interface ScrollPathPaginationProps {
  sections: string[];
  activeSection?: number;
}

export default function ScrollPathPagination({ sections }: ScrollPathPaginationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const dotsRef = useRef<Array<SVGCircleElement | null>>([]);
  const gearRef = useRef<SVGGElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [svgWidth, setSvgWidth] = useState(500);
  const [activeDotIndex, setActiveDotIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Mount tracking and mobile detection
  useEffect(() => {
    setMounted(true);

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      setMounted(false);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Position element based on current viewport height
  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;

    const forcePosition = () => {
      if (containerRef.current) {
        // Get current viewport height for positioning
        const currentHeight = window.innerHeight;
        const bottomPosition = currentHeight - 20;

        const element = containerRef.current;

        element.style.setProperty('position', 'fixed', 'important');
        element.style.setProperty('top', `${bottomPosition - 80}px`, 'important');
        element.style.setProperty('bottom', 'unset', 'important');
        element.style.setProperty('left', '50%', 'important');
        element.style.setProperty('transform', 'translateX(-50%)', 'important');
        element.style.setProperty('z-index', '99999', 'important');
        element.style.setProperty('right', 'unset', 'important');
        element.style.setProperty('pointer-events', 'none', 'important');
        element.style.setProperty('display', isMenuOpen ? 'none' : 'block', 'important');
        element.style.setProperty('width', 'auto', 'important');
        element.style.setProperty('height', 'auto', 'important');
        element.style.setProperty('margin', '0', 'important');
        element.style.setProperty('padding', '0', 'important');
        element.style.setProperty('max-height', 'none', 'important');
        element.style.setProperty('min-height', '0', 'important');
        element.style.setProperty('max-width', 'none', 'important');
        element.style.setProperty('min-width', '0', 'important');
        element.style.setProperty('overflow', 'visible', 'important');
      }
    };

    forcePosition();
    const interval = setInterval(forcePosition, 10);

    return () => {
      clearInterval(interval);
    };
  }, [mounted, isMenuOpen]);

  // Listen for navigation menu state changes
  useEffect(() => {
    const handleNavigationMenuStateChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail && typeof customEvent.detail.isOpen === 'boolean') {
        setIsMenuOpen(customEvent.detail.isOpen);
      }
    };

    document.addEventListener('navigationMenuStateChange', handleNavigationMenuStateChange);

    return () => {
      document.removeEventListener('navigationMenuStateChange', handleNavigationMenuStateChange);
    };
  }, []);

  // Set SVG width once based on desktop size - NO responsive behavior
  useEffect(() => {
    const desktopWidth = Math.max(window.innerWidth * 0.5, 600);
    setSvgWidth(desktopWidth);
  }, []);

  // Use custom hooks for scroll path and navigation
  useScrollPath({
    svgRef,
    pathRef,
    gearRef,
    dotsRef,
    timelineRef,
    sections,
    svgWidth,
    setActiveDotIndex,
  });

  useDotNavigation({
    sections,
    timelineRef,
    setActiveDotIndex,
  });

  // Calculate dot positions
  const dotPositions = calculateDotPositions(sections, svgWidth);

  // Adjust SVG height to accommodate the labels
  const svgHeight = 80;

  // Don't render on server, before mount, or on mobile
  if (!mounted || typeof window === 'undefined' || isMobile) {
    return null;
  }

  // Render using portal directly to body
  return createPortal(
    <div
      ref={containerRef}
      className='scroll-path-pagination'
      style={{
        display: isMenuOpen ? 'none' : 'block',
        pointerEvents: 'none',
      }}
    >
      <PathSVG svgRef={svgRef} pathRef={pathRef} gearRef={gearRef} svgWidth={svgWidth} svgHeight={svgHeight} sections={sections}>
        <NavigationDots dotPositions={dotPositions} sections={sections} activeDotIndex={activeDotIndex} dotsRef={dotsRef} />
      </PathSVG>
    </div>,
    document.body
  );
}
