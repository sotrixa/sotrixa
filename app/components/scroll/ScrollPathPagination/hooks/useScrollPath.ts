import { useEffect, RefObject, MutableRefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface UseScrollPathParams {
  svgRef: RefObject<SVGSVGElement | null>;
  pathRef: RefObject<SVGPathElement | null>;
  gearRef: RefObject<SVGGElement | null>;
  dotsRef: MutableRefObject<(SVGCircleElement | null)[]>;
  timelineRef: MutableRefObject<gsap.core.Timeline | null>;
  sections: string[];
  svgWidth: number;
  setActiveDotIndex: (index: number) => void;
}

export function useScrollPath({
  svgRef,
  pathRef,
  gearRef,
  dotsRef,
  timelineRef,
  sections,
  svgWidth,
  setActiveDotIndex,
}: UseScrollPathParams) {
  useEffect(() => {
    if (!svgRef.current || !pathRef.current || !gearRef.current) return;

    // Calculate positions
    const numSections = sections.length;

    // Create main timeline
    const tl = gsap.timeline({
      paused: true,
    });

    // Setup gear and path
    const path = pathRef.current;
    const pathLength = path.getTotalLength();
    const gear = gearRef.current;

    // Initial setup - path is fully hidden by offset
    gsap.set(path, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
      opacity: 1,
    });

    // Initial setup for gear icon
    gsap.set(gear, {
      opacity: 0,
      transformOrigin: '50% 50%',
    });

    // Setup rotation for gear
    gsap.to(gear, {
      rotation: 360,
      repeat: -1,
      duration: 8,
      ease: 'none',
      transformOrigin: '50% 50%',
    });

    // Capture dotsRef.current at the time the effect runs
    const dots = dotsRef.current;

    // Setup initial dot states
    dots.forEach((dot) => {
      if (!dot) return;
      gsap.set(dot, {
        opacity: 1,
        fill: '#000000',
        scale: 1,
        stroke: '#000000',
        strokeWidth: 1,
      });
    });

    // Create a single animation that controls everything based on progress
    tl.to({}, { duration: 1, ease: 'none' });

    // Function to update elements based on timeline progress
    const updateFromProgress = (progress: number) => {
      // Make sure progress is between 0 and 1
      progress = Math.max(0, Math.min(1, progress));

      // Calculate the current drawn length of the path
      const drawnLength = pathLength * progress;

      // Update path drawing WITHOUT animation for exact sync
      gsap.set(path, {
        strokeDashoffset: pathLength - drawnLength,
        opacity: 1,
      });

      // Calculate the current section index
      const currentSectionIndex = Math.floor(progress * (numSections - 1));
      setActiveDotIndex(currentSectionIndex);

      // Get the point at the current drawn position of the path
      const pathPoint = path.getPointAtLength(drawnLength);

      // Position gear - ALWAYS at the end of the drawn line
      if (progress > 0) {
        gsap.set(gear, {
          x: pathPoint.x,
          y: pathPoint.y,
          scale: 1.2,
          opacity: 1,
        });
      } else {
        gsap.set(gear, {
          opacity: 0,
        });
      }

      // Update dots visibility and style
      dots.forEach((dot, i) => {
        if (!dot) return;

        const isPassed = i < currentSectionIndex;

        gsap.set(dot, {
          opacity: 1,
          scale: 1,
          fill: isPassed ? '#666666' : '#000000',
          stroke: '#000000',
          strokeWidth: 1,
        });

        // Find label for this dot and animate it if it's active
        const label = document.getElementById(`label-${i}`);
        if (label) {
          const isActive = i === currentSectionIndex;
          gsap.to(label, {
            scale: isActive ? 1.2 : 1,
            duration: 0.3,
            ease: 'power2.out',
            transformOrigin: 'center center',
          });
        }
      });
    };

    // Create ScrollTrigger that directly controls the animations
    ScrollTrigger.create({
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        // Get progress from ScrollTrigger
        const progress = self.progress;

        // Update timeline position
        tl.progress(progress);

        // Update all elements based on progress
        updateFromProgress(progress);

        // Always ensure visibility of SVG elements
        gsap.set(path, { opacity: 1 });
        gsap.set(svgRef.current, { opacity: 1 });
      },
    });

    // Create click handlers for the dots
    const dotEventListeners = dots
      .map((dot, index) => {
        if (!dot) return null;

        const clickHandler = () => {
          if (window.horizontalScrollControls) {
            window.horizontalScrollControls.navigateToPanel(index);
          }
        };

        dot.addEventListener('click', clickHandler);
        return { dot, clickHandler };
      })
      .filter(Boolean);

    // Store the timeline for cleanup
    timelineRef.current = tl;

    // Store updateFromProgress in the window object
    window.updateScrollPathFromProgress = updateFromProgress;

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      if (timelineRef.current) {
        timelineRef.current.kill();
      }

      delete window.updateScrollPathFromProgress;

      dotEventListeners.forEach((listener) => {
        if (listener) {
          listener.dot.removeEventListener('click', listener.clickHandler);
        }
      });
    };
  }, [sections, svgWidth, svgRef, pathRef, gearRef, dotsRef, timelineRef, setActiveDotIndex]);
}
