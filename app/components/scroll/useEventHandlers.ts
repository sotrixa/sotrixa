'use client';

import { useEffect, RefObject, MutableRefObject } from 'react';

interface EventHandlersProps {
	containerRef: RefObject<HTMLDivElement>;
	sectionsRef: RefObject<HTMLDivElement>;
	activeIndex: MutableRefObject<number>;
	isAnimating: MutableRefObject<boolean>;
	nextPanel: () => void;
	prevPanel: () => void;
	navigateToPanel: (index: number) => void;
}

export function useEventHandlers({ containerRef, sectionsRef, activeIndex, isAnimating, nextPanel, prevPanel, navigateToPanel }: EventHandlersProps) {
	useEffect(() => {
		const container = containerRef.current;
		if (!container || !sectionsRef.current) return;

		// Check if the device is mobile
		const isMobile = () => {
			return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
		};

		// If mobile, don't apply custom scroll handlers and let native scrolling work
		if (isMobile()) {
			// For mobile, we only handle anchor clicks
			const handleAnchorClick = (e: MouseEvent) => {
				const target = e.target as HTMLElement;
				const anchor = target.closest('a');

				if (anchor && anchor.getAttribute('href')?.startsWith('#')) {
					// Allow default behavior for anchor links
					const targetId = anchor.getAttribute('href')?.substring(1);
					if (!targetId) return;

					// Only prevent default if we're handling navigation programmatically
					const sections = Array.from(sectionsRef.current!.children);
					const targetSection = sections.find((section) => section.id === targetId);
					if (targetSection) {
						e.preventDefault();
						// Scroll to element naturally
						targetSection.scrollIntoView({ behavior: 'smooth' });
					}
				}
			};

			document.body.addEventListener('click', handleAnchorClick);

			return () => {
				document.body.removeEventListener('click', handleAnchorClick);
			};
		}

		// Desktop scrolling behavior - everything below only applies to desktop

		// Handle wheel events for snapping navigation
		const handleWheel = (e: WheelEvent) => {
			// IMPORTANT: Skip handling if the services section is active and has control
			// Check both the data attribute and the window flag
			const activeSection = document.documentElement.getAttribute('data-active-section');
			const isServicesSection = activeSection === '2'; // Services is at index 2

			// Also check the global flag set by the ServicesSection component
			const servicesHasControl = typeof window !== 'undefined' && window.servicesHasControl;

			if (isServicesSection || servicesHasControl) {
				// Don't handle wheel events on services section - let the ServicesSection component handle it
				console.log('Main scroll system bypassing wheel event - services section is active');
				return;
			}

			// Only prevent default when we're handling the scroll
			e.preventDefault();

			if (isAnimating.current) return;

			// Determine direction
			const direction = e.deltaY > 0 ? 1 : -1;

			if (direction > 0) {
				nextPanel();
			} else {
				prevPanel();
			}
		};

		// Handle keyboard events
		const handleKeyDown = (e: KeyboardEvent) => {
			if (isAnimating.current) return;

			if (e.key === 'ArrowRight') {
				e.preventDefault();
				nextPanel();
			} else if (e.key === 'ArrowLeft') {
				e.preventDefault();
				prevPanel();
			}
		};

		// Handle anchor clicks for navigation
		const handleAnchorClick = (e: MouseEvent) => {
			const target = e.target as HTMLElement;
			const anchor = target.closest('a');

			if (anchor && anchor.getAttribute('href')?.startsWith('#')) {
				e.preventDefault();

				const targetId = anchor.getAttribute('href')?.substring(1);
				if (!targetId) return;

				const sections = Array.from(sectionsRef.current!.children);
				const targetSection = sections.find((section) => section.id === targetId);
				if (targetSection) {
					const index = parseInt(targetSection.getAttribute('data-section-index') || '0');
					navigateToPanel(index);
				}
			}
		};

		// Add event listeners for desktop only
		container.addEventListener('wheel', handleWheel, { passive: false });
		window.addEventListener('keydown', handleKeyDown);
		document.body.addEventListener('click', handleAnchorClick);

		return () => {
			// Remove event listeners
			container.removeEventListener('wheel', handleWheel);
			window.removeEventListener('keydown', handleKeyDown);
			document.body.removeEventListener('click', handleAnchorClick);
		};
	}, [containerRef, sectionsRef, activeIndex, isAnimating, nextPanel, prevPanel, navigateToPanel]);
}
