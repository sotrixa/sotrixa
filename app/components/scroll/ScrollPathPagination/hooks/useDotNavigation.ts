import { useEffect, MutableRefObject } from 'react';
import { gsap } from 'gsap';

interface UseDotNavigationParams {
  sections: string[];
  timelineRef: MutableRefObject<gsap.core.Timeline | null>;
  setActiveDotIndex: (index: number) => void;
}

export function useDotNavigation({ sections, timelineRef, setActiveDotIndex }: UseDotNavigationParams) {
  useEffect(() => {
    // Handle section change events
    const handleSectionChange = (event: CustomEvent) => {
      const { currentSection } = event.detail;
      setActiveDotIndex(currentSection);

      // Calculate progress based on current section
      const progress = currentSection / (sections.length - 1);

      // Update the timeline
      if (timelineRef.current) {
        timelineRef.current.progress(progress);
      }

      // Update elements directly
      if (window.updateScrollPathFromProgress) {
        window.updateScrollPathFromProgress(progress);
      }

      // Animate the active label
      for (let i = 0; i < sections.length; i++) {
        const label = document.getElementById(`label-${i}`);
        if (label) {
          gsap.to(label, {
            scale: i === currentSection ? 1.2 : 1,
            duration: 0.3,
            ease: 'power2.out',
            transformOrigin: 'center center',
          });
        }
      }
    };

    // Handle horizontal scroll progress events
    const handleScrollProgress = (event: CustomEvent) => {
      const { fromIndex, toIndex, progress } = event.detail;

      // Calculate current progress
      const startProgress = fromIndex / (sections.length - 1);
      const endProgress = toIndex / (sections.length - 1);
      const currentProgress = startProgress + (endProgress - startProgress) * progress;

      // Update the timeline
      if (timelineRef.current) {
        timelineRef.current.progress(currentProgress);
      }

      // Update elements directly
      if (window.updateScrollPathFromProgress) {
        window.updateScrollPathFromProgress(currentProgress);
      }

      // Calculate the current section index from progress
      const currentSectionIndex = Math.floor(currentProgress * (sections.length - 1));

      // Animate the active label
      for (let i = 0; i < sections.length; i++) {
        const label = document.getElementById(`label-${i}`);
        if (label) {
          gsap.to(label, {
            scale: i === currentSectionIndex ? 1.2 : 1,
            duration: 0.3,
            ease: 'power2.out',
            transformOrigin: 'center center',
          });
        }
      }
    };

    document.addEventListener('sectionChange', handleSectionChange as EventListener);
    document.addEventListener('horizontalScroll', handleScrollProgress as EventListener);

    return () => {
      document.removeEventListener('sectionChange', handleSectionChange as EventListener);
      document.removeEventListener('horizontalScroll', handleScrollProgress as EventListener);
    };
  }, [sections.length, timelineRef, setActiveDotIndex]);
}
