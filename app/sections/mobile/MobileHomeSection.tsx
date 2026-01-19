'use client';

import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useLanguage } from '../../data/LanguageContext';
import { getText } from '../../data/translations';


const MobileHome: React.FC = () => {
	const [windowWidth, setWindowWidth] = useState(0);
	const { language } = useLanguage();
	const containerRef = useRef<HTMLDivElement>(null);
	const bodyRef = useRef<HTMLDivElement>(null);
	const headingRef = useRef<HTMLHeadingElement>(null);
	const paragraphRef = useRef<HTMLParagraphElement>(null);
	const buttonsRef = useRef<HTMLDivElement>(null);
	const videoContainerRef = useRef<HTMLDivElement>(null);
	const gridRef = useRef<HTMLDivElement>(null);
	const [isMobile, setIsMobile] = useState(true);

	useEffect(() => {
		const handleResize = () => {
			const width = window.innerWidth;
			setWindowWidth(width);
			setIsMobile(true); // Always true for mobile component
		};

		// Initial call
		handleResize();

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	// GSAP animation effect - optimized for mobile
	useEffect(() => {
		if (typeof window === 'undefined' || !containerRef.current) return;

		// Short delay to ensure DOM is fully rendered
		const animationTimeout = setTimeout(() => {
			try {
				// Create main timeline with lighter animations for mobile
				const tl = gsap.timeline({
					defaults: { ease: 'power3.out' },
				});

				// Grid animation if present - reduce animation complexity
				if (gridRef.current) {
					const columns = gridRef.current.querySelectorAll('.grid-column');
					tl.fromTo(columns, { autoAlpha: 0 }, { autoAlpha: 0.7, stagger: 0.02, duration: 0.4 });
				}

				// Heading parts animation - simplified for mobile
				if (headingRef.current) {
					const parts = headingRef.current.querySelectorAll('span');
					tl.fromTo(parts, { y: 10, scale: 0.95 }, { y: 0, scale: 1, stagger: 0.12, duration: 0.6 }, 0.3);
				}

				// Paragraph animation - lighter for mobile
				tl.fromTo(paragraphRef.current, { y: 10 }, { y: 0, duration: 0.6 }, '-=0.3');

				// Buttons animation - simplified
				tl.fromTo(buttonsRef.current, { y: 10 }, { y: 0, duration: 0.5 }, '-=0.2');

				// Video container animation - similar to desktop but optimized for mobile
				tl.fromTo(videoContainerRef.current, { autoAlpha: 0.7, scale: 1.05 }, { autoAlpha: 1, scale: 1, duration: 0.8 }, '-=0.8');

				// Small scale effect instead of the larger one
				tl.from(
					containerRef.current,
					{
						scale: 1.01,
						duration: 0.8,
						ease: 'power2.out',
					},
					0
				);

				// Ensure animation plays
				tl.play();
			} catch (error) {
				console.error('Animation error:', error);
			}
		}, 100);

		return () => clearTimeout(animationTimeout);
	}, [isMobile]);

	// Generate grid blocks - optimized for mobile with fewer blocks
	const getBlocks = () => {
		const blockSize = windowWidth * 0.03;
		const nbOfBlocks = Math.ceil(window.innerHeight / blockSize);
		const limitedBlocks = Math.min(nbOfBlocks, 15);

		return [...Array(limitedBlocks).keys()].map((_, index) => {
			return <div key={index} className='block w-full h-full' onMouseEnter={(e) => colorize(e.target as HTMLDivElement)} />;
		});
	};

	const colorize = (el: HTMLDivElement) => {
		el.style.backgroundColor = 'black';
		setTimeout(() => {
			el.style.backgroundColor = 'transparent';
		}, 300);
	};

	return (
		<div id='mobile-home' ref={containerRef} className='relative min-h-screen w-full overflow-hidden flex items-center justify-center bg-[#fafafa]'>
			<div ref={bodyRef} className='relative z-10 flex flex-col items-center text-center px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20 max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto'>
				<h1 ref={headingRef} className='text-[2rem] xs:text-[2.2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[3.5rem] font-bold leading-tight mb-4 sm:mb-6 md:mb-8 text-black'>
					<span className='inline'>We are a </span>
					<span className='inline text-[#53EBDD] bg-black px-2 py-1 sm:px-3 sm:py-2 rounded-lg mr-1'>strategy</span>
					<span className='inline'> lab for </span>
					<span className='inline text-[#DD53EB] bg-black px-2 py-1 sm:px-3 sm:py-2 rounded-lg mr-1'>visionary</span>
					<span className='inline'> </span>
					<span className='inline text-[#EBDD53] bg-black px-2 py-1 sm:px-3 sm:py-2 rounded-lg'>thinkers</span>
				</h1>

				<p ref={paragraphRef} className='text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 md:mb-10 text-black max-w-full sm:max-w-md md:max-w-lg'>
					{getText('homeSection.paragraph', language)}
				</p>

				<div ref={buttonsRef} className='flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 mb-4 w-full max-w-md'>
					<button
						className='w-full sm:w-auto py-3 sm:py-3.5 px-6 sm:px-8 bg-black text-white hover:bg-gray-800 transition-colors font-medium rounded-md touch-manipulation text-sm sm:text-base'
						onClick={() => {
							// Navigate to Contact section for mobile
							const contactSection = document.getElementById('mobile-contact');
							if (contactSection) {
								contactSection.scrollIntoView({ 
									behavior: 'smooth',
									block: 'start'
								});
							} else {
								console.warn('Contact section not found');
							}
						}}
					>
						{getText('homeSection.talkToUs', language)}
					</button>
					<button
						className='w-full sm:w-auto py-3 sm:py-3.5 px-6 sm:px-8 bg-transparent border-2 border-black text-black hover:bg-black hover:text-white transition-colors font-medium rounded-md touch-manipulation text-sm sm:text-base'
						onClick={() => {
							// Navigate to Services section for mobile
							const servicesSection = document.getElementById('mobile-services');
							if (servicesSection) {
								servicesSection.scrollIntoView({ 
									behavior: 'smooth',
									block: 'start'
								});
							} else {
								console.warn('Services section not found');
							}
						}}
					>
						What we do
					</button>
					<button
						className='w-full sm:w-auto py-3 sm:py-3.5 px-6 sm:px-8 bg-transparent border-2 border-black text-black hover:bg-black hover:text-white transition-colors font-medium rounded-md touch-manipulation text-sm sm:text-base'
						onClick={() => {
							// Navigate to Case Studies section for mobile
							const caseStudiesSection = document.getElementById('mobile-case-studies');
							if (caseStudiesSection) {
								caseStudiesSection.scrollIntoView({ 
									behavior: 'smooth',
									block: 'start'
								});
							} else {
								console.warn('Case Studies section not found');
							}
						}}
					>
						{getText('homeSection.seeOurWork', language)}
					</button>
				</div>
			</div>

			{/* Video background - responsive sizing */}
			<div ref={videoContainerRef} className='absolute inset-0 w-full h-full z-0 pointer-events-none opacity-80 sm:opacity-90'>
				<video className='absolute inset-0 w-full h-full object-cover' autoPlay loop muted playsInline>
					<source src='/video/Sotrixa Home Page Animation.mp4' type='video/mp4' />
					Your browser does not support the video tag.
				</video>
			</div>

			{/* Grid background effect - responsive columns */}
			<div ref={gridRef} className='absolute inset-0 z-1 opacity-5 sm:opacity-10 pointer-events-none'>
				<div className='flex h-full'>
					{windowWidth > 0 &&
						[...Array(windowWidth < 600 ? 8 : windowWidth < 900 ? 12 : 16).keys()].map((_, index) => (
							<div key={'column_' + index} className='grid-column flex-1 h-full'>
								{getBlocks()}
							</div>
						))}
				</div>
			</div>
		</div>
	);
};

// Export the component
export default MobileHome;
