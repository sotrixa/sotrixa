'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Section from '../components/Section';
import { motion, AnimatePresence } from 'framer-motion';
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
	const [activeServiceIndex, setActiveServiceIndex] = useState(0);
	const [isDetailView, setIsDetailView] = useState(false);
	const [showServiceInfo, setShowServiceInfo] = useState(false);
	const [language] = useState<Language>('en');
	const services = ['RESEARCH', 'BUSINESS ARCHITECTURE', 'BESPOKE STRATEGY CREATION', 'BRANDING', 'MARKETING', 'WEBSITE DEVELOPMENT'];

	// Service descriptions
	const serviceDescriptions = ['Deep research, nuanced insight, and future-facing signals that shape powerful strategies.', 'Turning vision into a structured, evolving business—ready for real-world growth.', 'Precision-crafted roadmaps that move your vision forward with clarity, coherence, and purpose.', "Bringing your business's true story to life—visually, verbally, and emotionally.", 'Expanding your presence with soulful marketing strategies that resonate and move.', 'Crafting websites where form meets feeling, and strategy becomes tangible experience.'];

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
		setActiveServiceIndex(0);
	}, []);

	// Use custom hooks for scroll handling and animations
	useScrollHandler({
		activeServiceIndex,
		setActiveServiceIndex: debouncedSetActiveServiceIndex,
		services,
		sectionIndex,
		isAnimating,
		hasCompletedServices,
		isDetailView,
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

		// Smooth transition without flash
		const tl = gsap.timeline();
		tl.to(gifRef.current, {
			opacity: 0,
			scale: 0.8,
			duration: 0.3,
			ease: 'power1.out',
			onComplete: () => {
				setIsDetailView(true);
			},
		});
	};

	// Handle back button click
	const handleBackClick = () => {
		// Smooth transition without flash
		setIsDetailView(false);
		// Restore GIF animation after switching back to list view
		if (gifRef.current) {
			gsap.to(gifRef.current, {
				opacity: 1,
				scale: 1,
				duration: 0.5,
				ease: 'power2.out',
			});
		}
	};

	// Handle service info link click
	const handleServiceInfoClick = (e: React.MouseEvent) => {
		e.preventDefault();
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
									<span className='text-black text-2xl sm:text-3xl md:text-2xl font-medium mt-6 block'>{subtitleTranslation}</span>
								</div>
							</motion.div>

							{/* Right side with service list or detail view */}
							<AnimatePresence mode='wait'>
								{!isDetailView ? (
									/* Services List View */
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
													</div>
												))}
											</div>
										</div>
									</motion.div>
								) : (
									/* Service Detail View */
									<motion.div key='service-detail' className='md:w-full w-full' initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} transition={{ duration: 0.5 }}>
										<div className='flex flex-col items-start text-left space-y-6 sm:space-y-8 p-4 sm:p-10 ml-0 sm:ml-10'>
											{/* Back button */}
											<button onClick={handleBackClick} className='text-gray-500 hover:text-black transition-colors flex items-center space-x-2 mb-4 sm:mb-6 py-2'>
												<svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
													<path fillRule='evenodd' d='M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z' clipRule='evenodd' />
												</svg>
												<span>Back to services</span>
											</button>

											{/* Service title with gradient */}
											<div className='space-y-2'>
												<motion.h1 className='text-4xl sm:text-5xl md:text-7xl font-black tracking-tight' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
													<span className='bg-gradient-to-r from-[#f4dd65] via-[#d142e2] to-[#70DFC6] text-transparent bg-clip-text'>{services[activeServiceIndex]}</span>
												</motion.h1>
												<div className='h-1 w-1/2 bg-gradient-to-r from-[#f4dd65] via-[#d142e2] to-[#70DFC6] rounded-full'></div>
											</div>

											{/* Service description */}
											<motion.p className='text-base sm:text-lg text-gray-700 max-w-xl' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
												{serviceDescriptions[activeServiceIndex]}
											</motion.p>

											{/* Links section */}
											<motion.div className='flex flex-col space-y-4 mt-6 sm:mt-8 pt-4 border-t border-gray-200 w-full' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }}>
												<h3 className='text-sm uppercase tracking-widest text-gray-400'>Explore More</h3>
												<div className='flex space-x-6'>
													<a href='#' className='group flex items-center space-x-2 text-lg font-bold text-black touch-action-manipulation' onClick={handleServiceInfoClick} style={{ touchAction: 'manipulation' }}>
														<span>Services</span>
														<svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 transform transition-transform group-hover:translate-x-1' viewBox='0 0 20 20' fill='currentColor'>
															<path fillRule='evenodd' d='M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z' clipRule='evenodd' />
														</svg>
													</a>
												</div>
											</motion.div>
										</div>
									</motion.div>
								)}
							</AnimatePresence>
						</div>
					</div>
				</Section>
			)}
		</>
	);
}
