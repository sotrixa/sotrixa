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

		// Initialize touch/mouse drag detection
		let startX = 0;
		let isDragging = false;

		const handleDragStart = (e: MouseEvent | TouchEvent) => {
			const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
			startX = clientX;
			isDragging = true;
		};

		const handleDragMove = (e: MouseEvent | TouchEvent) => {
			if (!isDragging) return;

			const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
			const diff = startX - clientX;

			// Detect direction and minimum movement threshold
			if (Math.abs(diff) > 50) {
				if (diff > 0) {
					nextPanel();
				} else {
					prevPanel();
				}
				isDragging = false;
			}
		};

		const handleDragEnd = () => {
			isDragging = false;
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

		// Add event listeners
		container.addEventListener('wheel', handleWheel, { passive: false });
		window.addEventListener('keydown', handleKeyDown);
		document.body.addEventListener('click', handleAnchorClick);

		// Add touch and mouse events
		container.addEventListener('mousedown', handleDragStart as EventListener);
		container.addEventListener('mousemove', handleDragMove as EventListener);
		container.addEventListener('mouseup', handleDragEnd);
		container.addEventListener('touchstart', handleDragStart as EventListener, { passive: false });
		container.addEventListener('touchmove', handleDragMove as EventListener, { passive: false });
		container.addEventListener('touchend', handleDragEnd);

		return () => {
			// Remove event listeners
			container.removeEventListener('wheel', handleWheel);
			window.removeEventListener('keydown', handleKeyDown);
			document.body.removeEventListener('click', handleAnchorClick);

			// Remove touch and mouse events
			container.removeEventListener('mousedown', handleDragStart as EventListener);
			container.removeEventListener('mousemove', handleDragMove as EventListener);
			container.removeEventListener('mouseup', handleDragEnd);
			container.removeEventListener('touchstart', handleDragStart as EventListener);
			container.removeEventListener('touchmove', handleDragMove as EventListener);
			container.removeEventListener('touchend', handleDragEnd);
		};
	}, [containerRef, sectionsRef, activeIndex, isAnimating, nextPanel, prevPanel, navigateToPanel]);
}
