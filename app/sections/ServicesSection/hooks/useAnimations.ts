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

	// Set up GSAP animations for services
	useEffect(() => {
		if (!servicesRef.current) return;

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
		});

		// Animate all service items with staggered timing for better effect
		serviceItemsRef.current.forEach((item, index) => {
			if (!item) return;

			// Calculate stagger timing based on distance from active item
			const staggerDelay = Math.min(Math.abs(index - activeServiceIndex) * 0.01, 0.03);

			// Scale and highlight active item
			if (index === activeServiceIndex) {
				timeline.to(
					item,
					{
						color: '#d142e2',
						scale: 1.3, // Bigger scale for active item
						opacity: 1,
						fontWeight: 800, // Make it bolder
						letterSpacing: '0.05em', // Slightly increase letter spacing
						duration: 0.3, // Reduced for faster transition
						ease: 'power2.out', // Changed to a smoother, faster ease
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
						fontWeight: 700, // Return to normal weight
						letterSpacing: 'normal',
						duration: 0.2, // Reduced for faster transition
						ease: 'power1.out', // Faster ease
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
						fontWeight: 700, // Return to normal weight
						letterSpacing: 'normal',
						duration: 0.2, // Reduced for faster transition
						ease: 'power1.out', // Faster ease
					},
					staggerDelay
				);
			}
		});

		// Add enhanced bounce effect to the active item
		const activeItem = serviceItemsRef.current[activeServiceIndex];
		if (activeItem) {
			timeline
				.to(
					activeItem,
					{
						y: -8, // Slightly more pronounced bounce
						duration: 0.15, // Reduced for faster bounce
						ease: 'power2.out', // Faster ease out
					},
					0.15 // Start bounce earlier
				)
				.to(
					activeItem,
					{
						y: 0, // Return to original position
						duration: 0.2, // Reduced for faster bounce return
						ease: 'back.out(1.5)', // Snappier return with slight overshoot
					},
					0.3 // Reduced to speed up animation
				);
		}

		tl.current = timeline;

		// Log the current active service for debugging
		console.log(`Active service changed to: ${activeServiceIndex + 1} of ${services.length}`);
	}, [activeServiceIndex, services.length, serviceItemsRef, servicesRef, isAnimating]);

	return { tl };
};
