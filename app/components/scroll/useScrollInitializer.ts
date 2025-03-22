'use client';

import { useEffect, RefObject, Dispatch, SetStateAction, MutableRefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface ScrollInitializerProps {
	containerRef: RefObject<HTMLDivElement>;
	wrapperRef: RefObject<HTMLDivElement>;
	sectionsRef: RefObject<HTMLDivElement>;
	navigateToPanel: (index: number) => void;
	nextPanel: () => void;
	prevPanel: () => void;
	activeIndex: MutableRefObject<number>;
	isAnimating: MutableRefObject<boolean>;
	sectionsCount: number;
	setIsInitialized: Dispatch<SetStateAction<boolean>>;
}

export function useScrollInitializer({ containerRef, wrapperRef, sectionsRef, navigateToPanel, nextPanel, prevPanel, activeIndex, isAnimating, sectionsCount, setIsInitialized }: ScrollInitializerProps) {
	useEffect(() => {
		if (!containerRef.current || !wrapperRef.current || !sectionsRef.current) return;

		// Re-register plugins to be extra safe
		if (typeof window !== 'undefined') {
			gsap.registerPlugin(ScrollTrigger);
		}

		// Fix for Next.js hydration issues - short delay before initializing
		const initTimeout = setTimeout(() => {
			initScrolling();
		}, 100);

		function initScrolling() {
			const container = containerRef.current;
			const wrapper = wrapperRef.current;

			if (!container || !wrapper || !sectionsRef.current) return;

			const sections = Array.from(sectionsRef.current.children);

			// Make sure the body doesn't scroll
			document.body.style.overflow = 'hidden';

			// Set initial dimensions
			gsap.set(wrapper, {
				width: sections.length * 100 + 'vw',
				height: '100vh',
			});

			sections.forEach((section, i) => {
				// Add data attribute for tracking
				section.setAttribute('data-section-index', i.toString());

				// Set each section to be full width
				gsap.set(section, { width: '100vw' });
			});

			// Clear any existing ScrollTriggers to prevent duplicates
			ScrollTrigger.getAll().forEach((st) => st.kill());

			// Create navigation dots
			const createNavMarkers = () => {
				const navMarkerContainer = document.createElement('div');
				navMarkerContainer.className = 'fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 flex space-x-2';

				sections.forEach((section, index) => {
					const marker = document.createElement('button');
					marker.className = 'w-2 h-2 rounded-full bg-white bg-opacity-50 transition-all duration-300 hover:bg-opacity-100';
					marker.setAttribute('aria-label', `Navigate to section ${index + 1}`);

					// Add active class to current section
					if (index === activeIndex.current) {
						marker.classList.add('w-6', 'bg-opacity-100');
					}

					marker.addEventListener('click', () => navigateToPanel(index));
					navMarkerContainer.appendChild(marker);
				});

				document.body.appendChild(navMarkerContainer);
				return navMarkerContainer;
			};

			// Initialize
			const navMarkers = createNavMarkers();

			// Set initial state
			gsap.set(wrapper, { x: 0 });

			setIsInitialized(true);

			return () => {
				// Remove markers
				if (navMarkers.parentNode) {
					navMarkers.parentNode.removeChild(navMarkers);
				}
				document.body.style.overflow = '';
			};
		}

		return () => {
			clearTimeout(initTimeout);
		};
	}, [containerRef, wrapperRef, sectionsRef, navigateToPanel, nextPanel, prevPanel, activeIndex, isAnimating, sectionsCount, setIsInitialized]);
}
