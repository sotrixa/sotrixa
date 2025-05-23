import { useEffect, useRef } from 'react';

interface ScrollHandlerOptions {
	activeServiceIndex: number;
	setActiveServiceIndex: React.Dispatch<React.SetStateAction<number>>;
	services: string[];
	sectionIndex: number;
	isAnimating: React.MutableRefObject<boolean>;
	hasCompletedServices: React.MutableRefObject<boolean>;
	isDetailView: boolean;
}

export const useScrollHandler = ({ activeServiceIndex, setActiveServiceIndex, services, sectionIndex, isAnimating, hasCompletedServices, isDetailView }: ScrollHandlerOptions) => {
	const lastScrollTime = useRef<number>(0);

	useEffect(() => {
		if (typeof window === 'undefined') return;

		// Function to check if we're currently on the services section
		const isOnServicesSection = () => {
			const activeSection = document.documentElement.getAttribute('data-active-section');
			return activeSection === sectionIndex.toString();
		};

		// Track active status in the window for other components to check
		const updateActiveStatus = () => {
			const isActive = isOnServicesSection();
			window.isServicesActive = isActive;
			window.servicesHasControl = isActive;
		};

		// Run immediately and on section changes
		updateActiveStatus();

		// Handle section change events
		const handleSectionChange = () => {
			updateActiveStatus();

			// If we're now on services section, reset the service index
			if (isOnServicesSection()) {
				// Don't automatically set service index to 0 when entering the section
				// setActiveServiceIndex(0);
				hasCompletedServices.current = false;
				isAnimating.current = false; // Reset animation state
			}
		};

		// Faster throttling for scroll events
		const SCROLL_COOLDOWN = 650; // Increased cooldown to ensure complete animations

		// Go to next service with GSAP animation - with improved throttling
		const goToNextService = () => {
			// Don't allow scrolling in detail view
			if (isDetailView) return;

			const now = Date.now();
			const timeSinceLastScroll = now - lastScrollTime.current;

			// Exit if animation is running or not enough time has passed since last scroll
			if (isAnimating.current || timeSinceLastScroll < SCROLL_COOLDOWN) {
				return;
			}

			// Update last scroll time
			lastScrollTime.current = now;

			if (activeServiceIndex < services.length - 1) {
				// Move to next service
				setActiveServiceIndex((prev) => prev + 1);
				console.log(`Moving to next service: ${activeServiceIndex + 2}`);
			} else if (!hasCompletedServices.current) {
				hasCompletedServices.current = true;
				console.log('Completed all services, scroll down again to continue');
			} else {
				const nextPanel = window.horizontalScrollControls?.nextPanel;
				if (nextPanel) {
					console.log('Moving to next panel');
					nextPanel();
					hasCompletedServices.current = false;
					// setActiveServiceIndex(0);
				}
			}
		};

		// Go to previous service with GSAP animation - with improved throttling
		const goToPrevService = () => {
			// Don't allow scrolling in detail view
			if (isDetailView) return;

			const now = Date.now();
			const timeSinceLastScroll = now - lastScrollTime.current;

			// Exit if animation is running or not enough time has passed since last scroll
			if (isAnimating.current || timeSinceLastScroll < SCROLL_COOLDOWN) {
				return;
			}

			// Update last scroll time
			lastScrollTime.current = now;

			if (activeServiceIndex > 0) {
				// Move to previous service
				setActiveServiceIndex((prev) => prev - 1);
				console.log(`Moving to previous service: ${activeServiceIndex}`);
				hasCompletedServices.current = false;
			} else {
				const prevPanel = window.horizontalScrollControls?.prevPanel;
				if (prevPanel) {
					console.log('Moving to previous panel');
					prevPanel();
				}
			}
		};

		// More responsive wheel event handling with higher sensitivity
		const handleWheel = (e: WheelEvent) => {
			// Only handle wheel events when on services section and not in detail view
			if (!isOnServicesSection() || isDetailView) return;

			// Always prevent default behavior when on services section
			e.preventDefault();
			e.stopPropagation();

			// Determine scroll direction with a larger threshold for more deliberate scrolling
			const minWheelDelta = 15; // Increased threshold to prevent accidental scrolling
			if (e.deltaY > minWheelDelta) {
				goToNextService();
			} else if (e.deltaY < -minWheelDelta) {
				goToPrevService();
			}

			return false;
		};

		// Register event listeners
		window.addEventListener('wheel', handleWheel, { passive: false, capture: true });
		document.addEventListener('sectionChange', handleSectionChange as EventListener);

		// Add keyboard support
		const handleKeyDown = (e: KeyboardEvent) => {
			// Don't handle keyboard navigation in detail view
			if (!isOnServicesSection() || isDetailView) return;

			if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
				e.preventDefault();
				goToNextService();
			} else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
				e.preventDefault();
				goToPrevService();
			}
		};

		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('wheel', handleWheel, { capture: true });
			document.removeEventListener('sectionChange', handleSectionChange as EventListener);
			window.removeEventListener('keydown', handleKeyDown);
			window.isServicesActive = false;
			window.servicesHasControl = false;
		};
	}, [activeServiceIndex, services.length, sectionIndex, setActiveServiceIndex, isAnimating, hasCompletedServices, isDetailView]);

	// Provide helper functions for manual navigation
	const handleManualNav = (direction: 'next' | 'prev') => {
		// Don't allow manual navigation in detail view
		if (isDetailView) return;

		if (direction === 'next') {
			if (activeServiceIndex < services.length - 1) {
				setActiveServiceIndex((prev) => prev + 1);
			} else if (!hasCompletedServices.current) {
				hasCompletedServices.current = true;
			} else if (window.horizontalScrollControls?.nextPanel) {
				window.horizontalScrollControls.nextPanel();
				hasCompletedServices.current = false;
				// setActiveServiceIndex(0);
			}
		} else {
			if (activeServiceIndex > 0) {
				setActiveServiceIndex((prev) => prev - 1);
				hasCompletedServices.current = false;
			} else if (window.horizontalScrollControls?.prevPanel) {
				window.horizontalScrollControls.prevPanel();
			}
		}
	};

	return {
		handleManualNav,
		lastScrollTime,
	};
};
