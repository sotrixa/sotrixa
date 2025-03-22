'use client';

import { useRef, useCallback, RefObject } from 'react';
import { gsap } from 'gsap';

type HTMLDivRef = RefObject<HTMLDivElement>;

export function useNavigationControls(sectionsCount: number) {
	const activeIndex = useRef<number>(0);
	const isAnimating = useRef<boolean>(false);
	const activePanelTimeline = useRef<gsap.core.Timeline | null>(null);
	const sectionsRef = useRef<HTMLDivElement>(null);
	const wrapperRef = useRef<HTMLDivElement>(null);

	// Function to dispatch scroll progress events
	const dispatchScrollProgress = useCallback((fromIndex: number, toIndex: number, progress: number) => {
		const event = new CustomEvent('horizontalScroll', {
			detail: {
				fromIndex,
				toIndex,
				progress,
			},
		});
		document.dispatchEvent(event);
	}, []);

	// Handle navigation to a specific panel
	const navigateToPanel = useCallback(
		(index: number) => {
			if (isAnimating.current || !sectionsRef.current || !wrapperRef.current) return;

			const currentIndex = activeIndex.current;
			isAnimating.current = true;
			activeIndex.current = index;

			// Update the active section immediately so other components can react
			document.documentElement.setAttribute('data-active-section', index.toString());

			// Dispatch immediate section change event for quick reaction
			const immediateEvent = new CustomEvent('sectionChange', {
				detail: {
					currentSection: index,
				},
			});
			document.dispatchEvent(immediateEvent);

			// Kill any active animations
			if (activePanelTimeline.current) {
				activePanelTimeline.current.kill();
			}

			// Create new timeline for the transition
			const tl = gsap.timeline({
				onComplete: () => {
					isAnimating.current = false;
					// Dispatch final progress when complete
					dispatchScrollProgress(currentIndex, index, 1);
				},
				onUpdate: () => {
					// Track progress during animation
					dispatchScrollProgress(currentIndex, index, tl.progress());
				},
			});

			// Update URL hash
			const sections = sectionsRef.current.children;
			if (sections[index]) {
				const sectionId = sections[index].id;
				if (sectionId) {
					window.history.pushState(null, '', `#${sectionId}`);
				}
			}

			// Calculate the target position
			const targetX = index * window.innerWidth;

			// Trigger the scroll animation
			tl.to(wrapperRef.current, {
				x: -targetX,
				duration: 1.2,
				ease: 'power3.inOut',
			});

			activePanelTimeline.current = tl;
		},
		[dispatchScrollProgress]
	);

	// Go to next panel
	const nextPanel = useCallback(() => {
		if (activeIndex.current < sectionsCount - 1) {
			navigateToPanel(activeIndex.current + 1);
		}
	}, [navigateToPanel, sectionsCount]);

	// Go to previous panel
	const prevPanel = useCallback(() => {
		if (activeIndex.current > 0) {
			navigateToPanel(activeIndex.current - 1);
		}
	}, [navigateToPanel]);

	return {
		activeIndex,
		isAnimating,
		activePanelTimeline,
		sectionsRef: sectionsRef as HTMLDivRef,
		wrapperRef: wrapperRef as HTMLDivRef,
		navigateToPanel,
		nextPanel,
		prevPanel,
		dispatchScrollProgress,
	};
}
