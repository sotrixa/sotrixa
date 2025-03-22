'use client';

import { useRef, useEffect, useState } from 'react';
import Section from '../components/Section';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';

// Define type for horizontal scroll controls
interface HorizontalScrollControls {
	nextPanel: () => void;
	prevPanel: () => void;
	navigateToPanel: (index: number) => void;
	activeIndex: number;
}

// Extend Window interface
declare global {
	interface Window {
		horizontalScrollControls?: HorizontalScrollControls;
		isServicesActive?: boolean;
		servicesHasControl?: boolean;
	}
}

export default function ServicesSection() {
	const servicesRef = useRef<HTMLDivElement>(null);
	const serviceItemsRef = useRef<(HTMLDivElement | null)[]>([]);
	const [activeServiceIndex, setActiveServiceIndex] = useState(0);
	const services = ['RESEARCH', 'BRANDING', 'BUSINESS PLANNING', 'BESOKE STRATEGY', 'MARKETING', 'WEBSITE DEVELOPMENT'];
	const sectionIndex = 2; // Position of services section in the page layout
	const hasCompletedServices = useRef(false);
	const isAnimating = useRef(false);
	const tl = useRef<gsap.core.Timeline | null>(null);
	const lastScrollTime = useRef<number>(0);

	// GSAP animation for changing active service
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
				// Ensure we clear the debounce status when animation completes
				lastScrollTime.current = Date.now();
			},
		});

		// Animate all service items with staggered timing for better effect
		serviceItemsRef.current.forEach((item, index) => {
			if (!item) return;

			// Calculate stagger timing based on distance from active item
			const staggerDelay = Math.min(Math.abs(index - activeServiceIndex) * 0.03, 0.1);

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
						duration: 0.3, // Faster animation
						ease: 'back.out(1.2)', // Improved elastic effect
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
						duration: 0.25, // Faster animation
						ease: 'power3.out', // Smoother deceleration
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
						duration: 0.25, // Faster animation
						ease: 'power2.out',
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
						duration: 0.15,
						ease: 'power1.out',
					},
					0.15 // Start bounce after initial scale
				)
				.to(
					activeItem,
					{
						y: 0, // Return to original position
						duration: 0.15,
						ease: 'bounce.out', // Add bounce effect on return
					},
					0.3
				);
		}

		tl.current = timeline;

		// Log the current active service for debugging
		console.log(`Active service changed to: ${activeServiceIndex + 1} of ${services.length}`);
	}, [activeServiceIndex, services.length]);

	// Take control of scrolling and implement GSAP-based service navigation
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
				setActiveServiceIndex(0);
				hasCompletedServices.current = false;
				isAnimating.current = false; // Reset animation state
			}
		};

		// Faster throttling for scroll events
		const SCROLL_COOLDOWN = 25; // ms between scroll events (reduced for faster response)

		// Go to next service with GSAP animation - with improved throttling
		const goToNextService = () => {
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
					setActiveServiceIndex(0);
				}
			}
		};

		// Go to previous service with GSAP animation - with improved throttling
		const goToPrevService = () => {
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
			// Only handle wheel events when on services section
			if (!isOnServicesSection()) return;

			// Always prevent default behavior when on services section
			e.preventDefault();
			e.stopPropagation();

			// Determine scroll direction with a small threshold for better responsiveness
			const minWheelDelta = 2; // Lower threshold for faster response
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
			if (!isOnServicesSection()) return;

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
	}, [activeServiceIndex, services.length, sectionIndex]);

	return (
		<Section id='services' className='bg-white text-black p-25'>
			<div className='flex flex-col md:flex-row items-center justify-between gap-12 py-12'>
				{/* Left side with colored text */}
				<motion.div className='md:w-1/2' initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.1 }}>
					<div className='text-[42px] leading-tight font-bold max-w-[642px]'>
						<span className='text-black'>A full-service agency </span>
						<br />
						<span className='text-black'>specialising in </span>
						<span className='text-[#f4dd65]'>brand</span>
						<span className='text-black'>, </span>
						<br />
						<span className='text-[#d142e2]'>audience</span>
						<span className='text-black'>, and </span>
						<span className='text-[#70DFC6]'>creative </span>
						<br />
						<span className='text-[#70DFC6]'>research</span>
					</div>
				</motion.div>

				{/* Right side with service list */}
				<motion.div className='md:w-1/2' initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }} ref={servicesRef}>
					<div className='flex flex-col items-end text-right space-y-6'>
						<h1>You name it - we do it!</h1>
						{services.map((service, index) => (
							<div
								key={service}
								className='text-2xl font-bold tracking-wide cursor-pointer hover:opacity-90 active:opacity-100'
								onClick={() => setActiveServiceIndex(index)}
								ref={(el) => {
									serviceItemsRef.current[index] = el;
								}}
								style={{
									opacity: index <= activeServiceIndex ? 1 : 0.6,
									transform: index === activeServiceIndex ? 'scale(1.3)' : 'scale(1)', // Match the scale in GSAP animation
									color: index === activeServiceIndex ? '#d142e2' : '#000000',
									fontWeight: index === activeServiceIndex ? 800 : 700, // Match font weight in GSAP animation
									transition: 'none', // Let GSAP handle the animations
								}}
							>
								{service}
							</div>
						))}
					</div>
				</motion.div>
			</div>
		</Section>
	);
}
