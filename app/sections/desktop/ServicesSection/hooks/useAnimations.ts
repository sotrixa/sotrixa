import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface UseAnimationsOptions {
	activeServiceIndex: number;
	serviceItemsRef: React.MutableRefObject<(HTMLDivElement | null)[]>;
	servicesRef: React.RefObject<HTMLDivElement | null>;
	services: string[];
	isAnimating: React.MutableRefObject<boolean>;
}

export const useAnimations = ({ activeServiceIndex, serviceItemsRef, servicesRef, services, isAnimating }: UseAnimationsOptions) => {
	const tl = useRef<gsap.core.Timeline | null>(null);

	// No longer initialize first service as active on component mount
	// The effect that was here has been removed

	// Set up GSAP animations for services
	useEffect(() => {
		if (!servicesRef.current) return;

		// If activeServiceIndex is -1, don't animate anything
		if (activeServiceIndex === -1) return;

		// Kill any existing timeline
		if (tl.current) {
			tl.current.kill();
		}

		// Create new timeline for the transition
		const timeline = gsap.timeline({
			onStart: () => {
				isAnimating.current = true;
			},
			onComplete: () => {
				isAnimating.current = false;
			},
			// Add some delay before setting animation as complete
			delay: 0.1,
		});

		// Animate all service items with minimal transitions for less dynamic feel
		serviceItemsRef.current.forEach((item, index) => {
			if (!item) return;

			// Minimal stagger delay
			const staggerDelay = Math.min(Math.abs(index - activeServiceIndex) * 0.02, 0.05);

			// Subtle scale and highlight active item
			if (index === activeServiceIndex) {
				timeline.to(
					item,
					{
						color: '#000000',
						scale: 1.05, // Very subtle scale increase
						opacity: 1,
						fontWeight: 700, // Keep same weight
						letterSpacing: 'normal', // No letter spacing change
						duration: 0.25, // Quick transition
						ease: 'power1.out', // Simple easing
					},
					staggerDelay
				);
			}
			// Show previous items with full opacity
			else if (index < activeServiceIndex) {
				timeline.to(
					item,
					{
						color: '#000000',
						scale: 1,
						opacity: 1,
						fontWeight: 700,
						letterSpacing: 'normal',
						duration: 0.25,
						ease: 'power1.out',
					},
					staggerDelay
				);
			}
			// Dim future items
			else {
				timeline.to(
					item,
					{
						color: '#000000',
						scale: 1,
						opacity: 0.6,
						fontWeight: 700,
						letterSpacing: 'normal',
						duration: 0.25,
						ease: 'power1.out',
					},
					staggerDelay
				);
			}
		});

		// Removed bounce effect - now just a simple subtle lift
		const activeItem = serviceItemsRef.current[activeServiceIndex];
		if (activeItem) {
			timeline.to(
				activeItem,
				{
					y: -2, // Very minimal lift
					duration: 0.2, // Quick
					ease: 'power1.out',
				},
				0.1 // Start immediately
			);
		}

		tl.current = timeline;

		// Log the current active service for debugging
	}, [activeServiceIndex, services.length, serviceItemsRef, servicesRef, isAnimating]);

	return { tl };
};
