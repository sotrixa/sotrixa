'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import MobileServiceInfoSection from './MobileServiceInfoSection';
import { getText, parseColoredText, Language } from '../../data/translations';

export default function MobileServicesSection() {
	const servicesRef = useRef<HTMLDivElement>(null);
	const serviceItemsRef = useRef<(HTMLDivElement | null)[]>([]);
	const sectionContainerRef = useRef<HTMLDivElement>(null);
	const backgroundRef = useRef<HTMLDivElement>(null);
	const [activeServiceIndex, setActiveServiceIndex] = useState(-1);
	const [showServiceInfo, setShowServiceInfo] = useState(false);
	const [language] = useState<Language>('en');
	
	// EXACT SAME SERVICES AS DESKTOP
	const services = ['RESEARCH', 'BUSINESS ARCHITECTURE', 'BESPOKE STRATEGY CREATION', 'BRANDING', 'MARKETING', 'WEBSITE DEVELOPMENT'];

	const isAnimating = useRef(false);
	const isScrolling = useRef(false);

	// Get title and subtitle from translations - EXACT SAME AS DESKTOP
	const titleTranslation = getText('servicesSection.title', language);
	const subtitleTranslation = getText('servicesSection.subtitle', language);

	// Parse the colored text in title - EXACT SAME AS DESKTOP
	const { text: rawTitleText, coloredWords } = parseColoredText(titleTranslation);

	// Debounced service index setter - EXACT SAME AS DESKTOP
	const debouncedSetActiveServiceIndex = useCallback((value: React.SetStateAction<number>) => {
		if (isScrolling.current) return;

		isScrolling.current = true;
		setActiveServiceIndex(value);

		// Reset scrolling flag after animation completes
		setTimeout(() => {
			isScrolling.current = false;
		}, 700); // Slightly longer than animation duration
	}, []);

	// Handle service click - EXACT SAME LOGIC AS DESKTOP
	const handleServiceClick = useCallback(
		(index: number) => {
			if (isAnimating.current) return;

			isAnimating.current = true;
			debouncedSetActiveServiceIndex(index);

			// Animate to service info after a delay
			setTimeout(() => {
				setShowServiceInfo(true);
				isAnimating.current = false;
			}, 600);
		},
		[debouncedSetActiveServiceIndex]
	);

	// Handle back from service info - EXACT SAME AS DESKTOP
	const handleBackFromServiceInfo = () => {
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
	};


	// Set up refs for service items
	useEffect(() => {
		serviceItemsRef.current = serviceItemsRef.current.slice(0, services.length);
	}, [services.length]);

	return (
		<>
			{showServiceInfo ? (
				<div className='relative'>
					<MobileServiceInfoSection onBackClick={handleBackFromServiceInfo} activeService={services[activeServiceIndex]} />
				</div>
			) : (
				<section id='mobile-services' className='bg-[#FAFAFA] text-black p-4 sm:p-6 relative overflow-hidden min-h-screen'>
					{/* EXACT SAME BACKGROUND AS DESKTOP - Minimalist grid background */}
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
						{/* EXACT SAME DECORATIVE ELEMENTS AS DESKTOP - Gear-like decorative elements */}
						<div className='absolute top-[20%] left-[15%] w-[60px] sm:w-[80px] h-[60px] sm:h-[80px] border-2 border-gray-300 rounded-full opacity-25 transform rotate-45'></div>
						<div className='absolute top-[15%] left-[12%] w-[40px] sm:w-[60px] h-[40px] sm:h-[60px] border-2 border-gray-300 rounded-full opacity-20'></div>
						<div className='absolute bottom-[25%] right-[10%] w-[80px] sm:w-[100px] h-[80px] sm:h-[100px] border-2 border-gray-300 rounded-full opacity-25 transform -rotate-12'></div>

						{/* EXACT SAME ABSTRACT LINES AS DESKTOP */}
						<div className='absolute top-[30%] left-0 w-[25%] h-[2px] bg-gradient-to-r from-transparent via-gray-400 to-transparent opacity-30'></div>
						<div className='absolute bottom-[40%] right-0 w-[30%] h-[2px] bg-gradient-to-l from-transparent via-gray-400 to-transparent opacity-30'></div>

						{/* EXACT SAME DOTS GRID AS DESKTOP */}
						<div
							className='absolute top-0 right-0 w-[100px] sm:w-[150px] h-[100px] sm:h-[150px] opacity-20'
							style={{
								backgroundImage: 'radial-gradient(circle, rgba(100,100,100,0.7) 2px, transparent 2px)',
								backgroundSize: '20px 20px',
							}}
						></div>
					</div>

					{/* Container div with ref */}
					<div ref={sectionContainerRef} className='relative w-full h-full' style={{ zIndex: 2 }}>
						<div className='flex flex-col items-center justify-center mt-10 gap-8 py-8 min-h-screen'>
							{/* EXACT SAME TITLE SECTION AS DESKTOP - Mobile optimized layout */}
							<motion.div className='w-full text-center' initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.1 }}>
								<div className='text-2xl sm:text-3xl md:text-4xl leading-tight font-black max-w-full px-4'>
									{/* EXACT SAME TITLE RENDERING LOGIC AS DESKTOP */}
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
												const textBefore = rawTitleText.substring(lastIndex, wordIndex);
												// Check if text contains em dash and style it smaller
												if (textBefore.includes('—')) {
													const parts = textBefore.split('—');
													elements.push(<span key={`text-${i}-before`}>{parts[0]}</span>);
													elements.push(
														<span key={`dash-${i}`} style={{ fontSize: '0.6em', fontWeight: '200', transform: 'scaleX(0.5)', display: 'inline-block' }}>
															–
														</span>
													);
													if (parts[1]) elements.push(<span key={`text-${i}-after`}>{parts[1]}</span>);
												} else {
													elements.push(<span key={`text-${i}`}>{textBefore}</span>);
												}
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
											const remainingText = rawTitleText.substring(lastIndex);
											// Check if remaining text contains em dash and style it smaller
											if (remainingText.includes('—')) {
												const parts = remainingText.split('—');
												elements.push(<span key='text-end-before'>{parts[0]}</span>);
												elements.push(
													<span key='dash-end' style={{ fontSize: '0.6em', fontWeight: '200', transform: 'scaleX(0.5)', display: 'inline-block' }}>
														–
													</span>
												);
												if (parts[1]) elements.push(<span key='text-end-after'>{parts[1]}</span>);
											} else {
												elements.push(<span key='text-end'>{remainingText}</span>);
											}
										}

										return elements;
									})()}
									<br />
									<span className='text-black text-lg sm:text-xl font-medium mt-4 block'>
										{/* EXACT SAME SUBTITLE RENDERING AS DESKTOP */}
										{(() => {
											// Handle em dashes in subtitle
											if (subtitleTranslation.includes('—')) {
												const parts = subtitleTranslation.split('—');
												const elements: React.ReactNode[] = [];
												
												parts.forEach((part, index) => {
													elements.push(<span key={`subtitle-${index}`}>{part}</span>);
													// Add styled dash between parts (except after the last part)
													if (index < parts.length - 1) {
														elements.push(
															<span key={`subtitle-dash-${index}`} style={{ fontSize: '0.6em', fontWeight: '200', transform: 'scaleX(0.5)', display: 'inline-block' }}>
																–
															</span>
														);
													}
												});
												
												return elements;
											} else {
												return subtitleTranslation;
											}
										})()}
									</span>
								</div>
							</motion.div>

							{/* EXACT SAME SERVICES LIST AS DESKTOP - Mobile optimized layout */}
							<motion.div 
								key='services-list' 
								className='w-full' 
								initial={{ opacity: 0, x: 50 }} 
								animate={{ opacity: 1, x: 0 }} 
								exit={{ opacity: 0, x: -50 }} 
								transition={{ duration: 0.5 }} 
								ref={servicesRef}
							>
								<div className='flex flex-col items-center text-center space-y-6 p-4'>
									{/* EXACT SAME SERVICES MAPPING AS DESKTOP */}
									<div className='w-full space-y-6'>
										{services.map((service, index) => (
											<div
												key={service}
												className={`cursor-pointer transform transition-all duration-300 ${
													index === activeServiceIndex 
														? 'text-black font-black text-xl sm:text-2xl -translate-y-1' 
														: 'text-gray-500 font-bold text-lg sm:text-xl hover:text-gray-700 hover:-translate-y-1'
												}`}
												onClick={() => handleServiceClick(index)}
												ref={(el) => {
													if (el) serviceItemsRef.current[index] = el;
												}}
											>
												<span>{service}</span>
												{/* EXACT SAME ACTIVE INDICATOR AS DESKTOP */}
												{index === activeServiceIndex && (
													<div className='h-1 w-24 sm:w-32 bg-[#d142e2] rounded-full mt-1 transform transition-all duration-300 mx-auto'></div>
												)}
											</div>
										))}
									</div>
								</div>
							</motion.div>
						</div>
					</div>
				</section>
			)}
		</>
	);
}