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

		// Variables for drag functionality
		let isDragging = false;
		let startX = 0;
		const dragThreshold = 100; // Minimum drag distance to trigger section change

		// Prevent default drag behavior on all elements
		const preventDragDefault = (e: Event) => {
			e.preventDefault();
			e.stopPropagation();
			return false;
		};

		// Apply this prevention to ALL elements that might interfere with our drag
		const setupNoDragElements = () => {
			// Get all elements that might have default drag behavior
			const mediaElements = document.querySelectorAll('img, video, a, [draggable="true"], iframe, canvas, svg, object, embed');

			mediaElements.forEach((element) => {
				// Prevent native dragging
				element.setAttribute('draggable', 'false');

				// Stop all drag-related events
				element.addEventListener('dragstart', preventDragDefault, { capture: true, passive: false });
				element.addEventListener('mousedown', (e) => e.stopPropagation(), { capture: false });
			});

			// Make text unselectable during drag operations
			document.body.classList.add('horizontal-drag-enabled');

			// Add global styles for text selection prevention during drag
			const style = document.createElement('style');
			style.setAttribute('data-horizontal-drag', 'true');
			style.innerHTML = `
				.horizontal-drag-enabled.is-dragging *:not(#case-study *) {
					user-select: none !important;
					-webkit-user-select: none !important;
				}
				.horizontal-drag-enabled.is-dragging *:not(#case-study *, a, button, [role="button"]) {
					pointer-events: none !important;
				}
				.horizontal-drag-enabled.is-dragging {
					cursor: grabbing !important;
				}
			`;
			document.head.appendChild(style);
		};

		// Run this setup once and whenever the DOM might change
		setupNoDragElements();

		// Optional: Set up a MutationObserver to handle dynamically added elements
		const observer = new MutationObserver(setupNoDragElements);
		observer.observe(document.body, { childList: true, subtree: true });

		// Drag handling functions
		const handleMouseDown = (e: MouseEvent) => {
			// Skip if we're in services section with control
			const activeSection = document.documentElement.getAttribute('data-active-section');
			const isServicesSection = activeSection === '2'; // Services is at index 2
			const servicesHasControl = typeof window !== 'undefined' && window.servicesHasControl;

			// ADDED: Skip if we're in the case study section
			const target = e.target as HTMLElement;
			const inCaseStudySection = target.closest('#case-study') !== null;
			if (inCaseStudySection) {
				return; // Don't handle drag in case study section
			}

			if (isServicesSection || servicesHasControl) return;
			if (isAnimating.current) return;

			// Skip if we're clicking on specific UI controls (not content)
			if ((target.tagName === 'BUTTON' || target.closest('button') || target.getAttribute('role') === 'button' || target.closest('[role="button"]')) && !target.closest('.section-content')) {
				// Allow dragging on content areas
				return;
			}

			isDragging = true;
			startX = e.clientX;

			// Add dragging class for global style control
			document.body.classList.add('is-dragging');

			// Prevent default to stop text selection or other default behaviors
			e.preventDefault();
			e.stopPropagation();

			// Dispatch custom event for drag start
			document.dispatchEvent(new CustomEvent('horizontalScrolling'));
		};

		const handleMouseMove = (e: MouseEvent) => {
			if (!isDragging) return;

			// Prevent text selection during drag
			e.preventDefault();
			e.stopPropagation();
		};

		const handleMouseUp = (e: MouseEvent) => {
			if (!isDragging) return;

			// Remove dragging class immediately
			document.body.classList.remove('is-dragging');

			// Calculate drag distance
			const dragDistance = e.clientX - startX;

			// Determine if we should navigate
			if (Math.abs(dragDistance) > dragThreshold) {
				if (dragDistance > 0) {
					// Dragged right - go to previous section
					prevPanel();
				} else {
					// Dragged left - go to next section
					nextPanel();
				}
			}

			isDragging = false;

			// Added: Make sure to enable pointer events again
			setTimeout(() => {
				document.body.classList.remove('is-dragging');
			}, 10);

			// Prevent any default behavior at the end of drag
			e.preventDefault();
			e.stopPropagation();
		};

		const handleMouseLeave = () => {
			if (!isDragging) return;

			// Reset drag state
			isDragging = false;
			document.body.classList.remove('is-dragging');
		};

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

			// Dispatch custom event to notify cursor component about scrolling
			document.dispatchEvent(new CustomEvent('horizontalScrolling'));

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

		// Add mouse drag event listeners to document for site-wide handling
		document.addEventListener('mousedown', handleMouseDown, { passive: false });
		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);
		document.addEventListener('mouseleave', handleMouseLeave);

		return () => {
			// Remove event listeners
			container.removeEventListener('wheel', handleWheel);
			window.removeEventListener('keydown', handleKeyDown);
			document.body.removeEventListener('click', handleAnchorClick);
			document.removeEventListener('mousedown', handleMouseDown);
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
			document.removeEventListener('mouseleave', handleMouseLeave);

			// Clean up the drag prevention
			const mediaElements = document.querySelectorAll('img, video, a, [draggable="false"], iframe, canvas, svg');
			mediaElements.forEach((element) => {
				element.removeEventListener('dragstart', preventDragDefault);
				// We don't remove the draggable attribute to avoid visual flicker if component remounts
			});

			// Remove the added class
			document.body.classList.remove('horizontal-drag-enabled');
			document.body.classList.remove('is-dragging');

			// Remove the style element if it exists
			const addedStyle = document.querySelector('style[data-horizontal-drag]');
			if (addedStyle) {
				addedStyle.remove();
			}

			// Disconnect observer
			observer.disconnect();
		};
	}, [containerRef, sectionsRef, activeIndex, isAnimating, nextPanel, prevPanel, navigateToPanel]);
}
