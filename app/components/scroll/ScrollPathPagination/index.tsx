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
  const [topPosition, setTopPosition] = useState<number | null>(null);
  const [useBottomPosition, setUseBottomPosition] = useState(true);
  const initialHeightRef = useRef<number | null>(null);

  // Mount tracking only
  useEffect(() => {
    setMounted(true);

    return () => {
      setMounted(false);
    };
  }, []);


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

  // Lock top position on mount and handle resize
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Store initial height
    const initialHeight = window.innerHeight;
    initialHeightRef.current = initialHeight;

    // Calculate locked top position
    const calculatedTop = initialHeight - 100; // 100 = svgHeight (80) + bottom spacing (20)
    setTopPosition(calculatedTop);

    const handleResize = () => {
      const currentHeight = window.innerHeight;

      // If back to full size or larger, use bottom positioning
      if (initialHeightRef.current && currentHeight >= initialHeightRef.current) {
        setUseBottomPosition(true);
      } else {
        // If smaller, use locked top position
        setUseBottomPosition(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
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

  // Don't render on server or before mount and position is calculated
  if (!mounted || typeof window === 'undefined' || topPosition === null) {
    return null;
  }

  // Render using portal directly to body
  return createPortal(
    <div
      ref={containerRef}
      className='scroll-path-pagination'
      style={{
        position: 'fixed',
        ...(useBottomPosition
          ? { bottom: '20px', top: 'auto' }
          : { top: topPosition !== null ? `${topPosition}px` : 'auto', bottom: 'auto' }),
        left: '50%',
        transform: 'translateX(-50%)',
        pointerEvents: 'none',
        display: isMenuOpen ? 'none' : 'block',
        width: 'auto',
        height: 'auto',
        margin: 0,
        padding: 0,
      }}
    >
      <PathSVG svgRef={svgRef} pathRef={pathRef} gearRef={gearRef} svgWidth={svgWidth} svgHeight={svgHeight} sections={sections}>
        <NavigationDots dotPositions={dotPositions} sections={sections} activeDotIndex={activeDotIndex} dotsRef={dotsRef} />
      </PathSVG>
    </div>,
    document.body
  );
}
