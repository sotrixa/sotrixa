'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Section from '../components/Section';
import { motion } from 'framer-motion';
import { useScrollHandler } from './ServicesSection/hooks/useScrollHandler';
import { useAnimations } from './ServicesSection/hooks/useAnimations';
import { gsap } from 'gsap';
import ServiceInfoSection from './ServiceInfoSection';
import { getText, parseColoredText, Language } from '../data/translations';

// Get Timeline type from gsap
type Timeline = ReturnType<typeof gsap.timeline>;

// Declare global window properties
declare global {
	interface Window {
		servicesHasControl?: boolean;
		navigateToPanel?: (index: number) => void;
		playServiceInfoExitAnimation?: () => Timeline | undefined;
	}
}

export default function ServicesSection() {
	const servicesRef = useRef<HTMLDivElement>(null);
	const serviceItemsRef = useRef<(HTMLDivElement | null)[]>([]);
	const gifRef = useRef<HTMLDivElement>(null);
	const sectionContainerRef = useRef<HTMLDivElement>(null);
	const backgroundRef = useRef<HTMLDivElement>(null);
	const [activeServiceIndex, setActiveServiceIndex] = useState(-1);
	const [showServiceInfo, setShowServiceInfo] = useState(false);
	const [language] = useState<Language>('en');
	const services = ['RESEARCH', 'BUSINESS ARCHITECTURE', 'BESPOKE STRATEGY CREATION', 'BRANDING', 'MARKETING', 'WEBSITE DEVELOPMENT'];

	const sectionIndex = 2; // Position of services section in the page layout
	const hasCompletedServices = useRef(false);
	const isAnimating = useRef(false);
	const isScrolling = useRef(false);

	// Get title and subtitle from translations
	const titleTranslation = getText('servicesSection.title', language);
	const subtitleTranslation = getText('servicesSection.subtitle', language);

	// Parse the colored text in title
	const { text: rawTitleText, coloredWords } = parseColoredText(titleTranslation);

	// Debounced service index setter to prevent rapid changes
	const debouncedSetActiveServiceIndex = useCallback((value: React.SetStateAction<number>) => {
		if (isScrolling.current) return;

		isScrolling.current = true;
		setActiveServiceIndex(value);

		// Reset scrolling flag after animation completes
		setTimeout(() => {
			isScrolling.current = false;
		}, 700); // Slightly longer than animation duration
	}, []);

	// Ensure first service is active when component mounts or section changes
	useEffect(() => {
		// Don't set an active index initially
		// setActiveServiceIndex(0);
	}, []);

	// Use custom hooks for scroll handling and animations
	useScrollHandler({
		activeServiceIndex,
		setActiveServiceIndex: debouncedSetActiveServiceIndex,
		services,
		sectionIndex,
		isAnimating,
		hasCompletedServices,
		isDetailView: false,
	});

	// Initialize animations
	useAnimations({
		activeServiceIndex,
		serviceItemsRef,
		servicesRef,
		services,
		isAnimating,
	});

	// Get random position within boundaries
	const getRandomPosition = () => {
		// Ensure values stay within the screen boundaries (with padding)
		const maxX = 80; // Max percentage of screen width
		const maxY = 70; // Max percentage of screen height
		const minX = 10; // Min percentage from left
		const minY = 10; // Min percentage from top

		return {
			x: Math.floor(Math.random() * (maxX - minX) + minX),
			y: Math.floor(Math.random() * (maxY - minY) + minY),
		};
	};

	// GSAP Floating Animation for GIF
	useEffect(() => {
		if (!gifRef.current || !sectionContainerRef.current) return;

		// Kill any existing animations
		gsap.killTweensOf(gifRef.current);

		// Get random initial position
		const initialPos = getRandomPosition();

		// Create floating animation
		const tl = gsap.timeline({
			repeat: -1,
			repeatRefresh: true, // Get fresh random values on each repeat
			onRepeat: () => {
				// Change GIF positions more dramatically on each loop
				const newPos = getRandomPosition();
				gsap.to(gifRef.current, {
					left: `${newPos.x}%`,
					top: `${newPos.y}%`,
					duration: 8,
					ease: 'power1.inOut',
				});
			},
		});

		// Set initial position
		gsap.set(gifRef.current, {
			left: `${initialPos.x}%`,
			top: `${initialPos.y}%`,
			xPercent: -50, // Center the element horizontally
			yPercent: -50, // Center the element vertically
			rotate: Math.random() * 10 - 5,
		});

		// Floating animation
		tl.to(gifRef.current, {
			x: '+=50',
			y: '-=30',
			rotate: Math.random() * 10 - 5,
			duration: 5 + Math.random() * 2,
			ease: 'sine.inOut',
		})
			.to(gifRef.current, {
				x: '-=70',
				y: '+=60',
				rotate: Math.random() * 10 - 5,
				duration: 6 + Math.random() * 2,
				ease: 'sine.inOut',
			})
			.to(gifRef.current, {
				x: '+=20',
				y: '-=30',
				rotate: Math.random() * 10 - 5,
				duration: 4 + Math.random() * 2,
				ease: 'sine.inOut',
			});

		return () => {
			tl.kill();
		};
	}, [activeServiceIndex]);

	// Animate the background grid
	useEffect(() => {
		if (!backgroundRef.current) return;

		gsap.fromTo(
			backgroundRef.current,
			{
				opacity: 0,
				scale: 0.95,
			},
			{
				opacity: 0.5,
				scale: 1,
				duration: 1.5,
				ease: 'power2.out',
			}
		);

		// Subtle continuous movement
		gsap.to(backgroundRef.current, {
			backgroundPosition: '100% 100%',
			duration: 120,
			ease: 'none',
			repeat: -1,
		});
	}, []);

	// Handle service selection
	const handleServiceClick = (index: number) => {
		debouncedSetActiveServiceIndex(index);

		// Go directly to ServiceInfoSection instead of showing detail view
		setShowServiceInfo(true);
	};

	// Handle back from service info
	const handleBackFromServiceInfo = () => {
		// Check if the exit animation function is available
		if (typeof window !== 'undefined' && window.playServiceInfoExitAnimation) {
			// Run the exit animation and wait for it to complete before switching views
			const tl = window.playServiceInfoExitAnimation();
			if (tl) {
				tl.eventCallback('onComplete', () => {
					setShowServiceInfo(false);
				});
			} else {
				// Fallback if animation fails
				setShowServiceInfo(false);
			}
		} else {
			// Create animation sequence for smooth transition back
			const tl = gsap.timeline({
				onComplete: () => {
					setShowServiceInfo(false);
				},
			});

			// Fade out animation before returning to services
			tl.to('.service-info-container', {
				opacity: 0.8,
				scale: 0.98,
				duration: 0.3,
				ease: 'power2.inOut',
			});
		}
	};

	return (
		<>
			{showServiceInfo ? (
				<div className='relative'>
					<ServiceInfoSection onBackClick={handleBackFromServiceInfo} activeService={services[activeServiceIndex]} />
				</div>
			) : (
				<Section id='services' className='bg-[#FAFAFA] text-black p-4 sm:p-25 relative overflow-hidden'>
					{/* Minimalist grid background */}
					<div
						ref={backgroundRef}
						className='absolute inset-0 z-0'
						style={{
							backgroundImage: `
								linear-gradient(to right, rgba(150,150,150,0.15) 1px, transparent 1px),
								linear-gradient(to bottom, rgba(150,150,150,0.15) 1px, transparent 1px)
							`,
							backgroundSize: '40px 40px',
							backgroundPosition: '0 0',
						}}
					>
						{/* Gear-like decorative elements */}
						<div className='absolute top-[20%] left-[15%] w-[80px] sm:w-[150px] h-[80px] sm:h-[150px] border-2 border-gray-300 rounded-full opacity-25 transform rotate-45'></div>
						<div className='absolute top-[15%] left-[12%] w-[60px] sm:w-[100px] h-[60px] sm:h-[100px] border-2 border-gray-300 rounded-full opacity-20'></div>
						<div className='absolute bottom-[25%] right-[10%] w-[100px] sm:w-[200px] h-[100px] sm:h-[200px] border-2 border-gray-300 rounded-full opacity-25 transform -rotate-12'></div>

						{/* Abstract lines */}
						<div className='absolute top-[30%] left-0 w-[25%] h-[2px] bg-gradient-to-r from-transparent via-gray-400 to-transparent opacity-30'></div>
						<div className='absolute bottom-[40%] right-0 w-[30%] h-[2px] bg-gradient-to-l from-transparent via-gray-400 to-transparent opacity-30'></div>

						{/* Dots grid in one corner */}
						<div
							className='absolute top-0 right-0 w-[150px] sm:w-[300px] h-[150px] sm:h-[300px] opacity-20'
							style={{
								backgroundImage: 'radial-gradient(circle, rgba(100,100,100,0.7) 2px, transparent 2px)',
								backgroundSize: '20px 20px',
							}}
						></div>
					</div>

					{/* Container div with ref */}
					<div ref={sectionContainerRef} className='relative w-full h-full' style={{ zIndex: 2 }}>
						{/* Removed the floating GIF section */}

						<div className='flex flex-col md:flex-row items-center justify-between mt-10 gap-8 sm:gap-12 py-8 sm:py-12'>
							{/* Left side with colored text */}
							<motion.div className='md:w-full' initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.1 }}>
								<div className='text-3xl sm:text-5xl md:text-[57px] leading-tight font-bold max-w-[642px]'>
									{/* Simplified title rendering to prevent duplication */}
									{(() => {
										let lastIndex = 0;
										const elements = [];

										// Sort colored words by their position in the original text
										const sortedWords = [...coloredWords].sort((a, b) => rawTitleText.indexOf(a.word) - rawTitleText.indexOf(b.word));

										// Process each colored word
										sortedWords.forEach(({ word, color }, i) => {
											const wordIndex = rawTitleText.indexOf(word, lastIndex);

											// Add text before the colored word
											if (wordIndex > lastIndex) {
												elements.push(<span key={`text-${i}`}>{rawTitleText.substring(lastIndex, wordIndex)}</span>);
											}

											// Add the colored word
											elements.push(
												<span key={`colored-${i}`} style={{ color }}>
													{word}
												</span>
											);

											lastIndex = wordIndex + word.length;
										});

										// Add any remaining text
										if (lastIndex < rawTitleText.length) {
											elements.push(<span key='text-end'>{rawTitleText.substring(lastIndex)}</span>);
										}

										return elements;
									})()}
									<br />
									<span className='text-black text-2xl sm:text-3xl md:text-xl font-medium mt-6 block'>{subtitleTranslation}</span>
								</div>
							</motion.div>

							{/* Right side with service list - removed conditional rendering for detail view */}
							<motion.div key='services-list' className='md:w-full w-full' initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.5 }} ref={servicesRef}>
								<div className='flex flex-col items-start text-left space-y-6 sm:space-y-8 p-4 sm:p-10 ml-0 sm:ml-10'>
									{/* Services list - direct implementation instead of using components */}
									<div className='w-full space-y-5 sm:space-y-8'>
										{services.map((service, index) => (
											<div
												key={service}
												className={`cursor-pointer transform transition-all duration-300 ${index === activeServiceIndex ? 'text-black font-black text-2xl sm:text-3xl md:text-4xl -translate-y-1 sm:-translate-y-2' : 'text-gray-500 font-bold text-xl sm:text-2xl md:text-3xl'}`}
												onClick={() => handleServiceClick(index)}
												ref={(el) => {
													if (el) serviceItemsRef.current[index] = el;
												}}
											>
												<span>{service}</span>
												{index === activeServiceIndex && <div className='h-1 w-32 sm:w-48 bg-[#d142e2] rounded-full mt-1 transform transition-all duration-300'></div>}
											</div>
										))}
									</div>
								</div>
							</motion.div>
						</div>
					</div>
				</Section>
			)}
		</>
	);
}
