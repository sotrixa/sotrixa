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

		// Check if device is mobile
		const isMobile = typeof window !== 'undefined' && (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768);

		// Fix for Next.js hydration issues - short delay before initializing
		const initTimeout = setTimeout(() => {
			initScrolling();
		}, 100);

		function checkIfVerticalScrollNeeded() {
			if (typeof window === 'undefined') return false;

			// Use the same restrictive threshold as event handlers
			const viewportHeight = window.innerHeight;
			const restrictiveThreshold = 600; // More restrictive - only when really needed

			return viewportHeight < restrictiveThreshold;
		}

		function updateScrollBehavior() {
			const needsVerticalScroll = checkIfVerticalScrollNeeded();

			if (!isMobile) {
				if (needsVerticalScroll) {
					// When height is reduced, enable both scrollbars
					document.body.style.overflowX = 'auto'; // Show horizontal scrollbar
					document.body.style.overflowY = 'auto'; // Show vertical scrollbar
					if (containerRef.current) {
						containerRef.current.style.overflowX = 'auto';
						containerRef.current.style.overflowY = 'auto';
					}
				} else {
					// Default behavior - hide scrollbars for clean horizontal navigation
					document.body.style.overflowX = 'hidden';
					document.body.style.overflowY = 'hidden';
					if (containerRef.current) {
						containerRef.current.style.overflowX = 'hidden';
						containerRef.current.style.overflowY = 'hidden';
					}
				}
			} else {
				// For mobile, ensure scrolling is enabled
				document.body.style.overflow = '';
			}
		}

		function updateDimensions() {
			const wrapper = wrapperRef.current;
			if (!wrapper || !sectionsRef.current) return;

			const sections = Array.from(sectionsRef.current.children);
			const currentHeight = window.innerHeight;
			const fixedHeight = Math.max(currentHeight, 800); // Minimum 800px

			// Update wrapper dimensions
			gsap.set(wrapper, {
				width: sections.length * 100 + 'vw',
				height: `${fixedHeight}px`,
				minHeight: `${fixedHeight}px`,
			});

			// Update each section to match current viewport height
			sections.forEach((section) => {
				gsap.set(section, {
					width: '100vw',
					height: `${fixedHeight}px`,
					minHeight: `${fixedHeight}px`,
				});
			});
		}

		function initScrolling() {
			const container = containerRef.current;
			const wrapper = wrapperRef.current;

			if (!container || !wrapper || !sectionsRef.current) return;

			const sections = Array.from(sectionsRef.current.children);

			// Set initial scroll behavior
			updateScrollBehavior();

			// Initialize dimensions
			updateDimensions();

			// Add data attributes for tracking
			sections.forEach((section, i) => {
				section.setAttribute('data-section-index', i.toString());
			});

			// Clear any existing ScrollTriggers to prevent duplicates
			ScrollTrigger.getAll().forEach((st) => st.kill());

			// Navigation dots removed as requested

			// Set initial state
			gsap.set(wrapper, { x: 0 });

			// Listen for resize events to update scroll behavior AND dimensions
			const handleResize = () => {
				updateScrollBehavior();
				updateDimensions();
			};

			window.addEventListener('resize', handleResize);

			setIsInitialized(true);

			return () => {
				// Clean up code - restore default overflow
				document.body.style.overflowX = '';
				document.body.style.overflowY = '';
				window.removeEventListener('resize', handleResize);
			};
		}

		return () => {
			clearTimeout(initTimeout);
		};
	}, [containerRef, wrapperRef, sectionsRef, navigateToPanel, nextPanel, prevPanel, activeIndex, isAnimating, sectionsCount, setIsInitialized]);
}
