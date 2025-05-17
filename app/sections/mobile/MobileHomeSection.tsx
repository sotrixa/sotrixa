'use client';

import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useLanguage } from '../../data/LanguageContext';
import { getText } from '../../data/translations';
import Link from 'next/link';
import LanguageSwitcher from '../../components/LanguageSwitcher';

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
		<div id='home' ref={containerRef} className='relative min-h-screen w-full overflow-hidden flex items-center justify-center bg-[#fafafa]'>
			<LanguageSwitcher />

			<div ref={bodyRef} className='relative z-10 flex flex-col items-center text-center px-5 py-16 max-w-md mx-auto'>
				<h1 ref={headingRef} className='text-[2.2rem] sm:text-[2.5rem] font-bold leading-tight mb-6 text-black'>
					<span className='inline'>We are a </span>
					<span className='inline text-[#39E4D3] bg-black p-2 rounded-4xl'>strategy</span>
					<span className='inline'> lab for visionary </span>
					<span className='inline text-[#ffd044] bg-black p-2 rounded-4xl'>thinkers</span>
					<span className='inline'>.</span>
				</h1>

				<p ref={paragraphRef} className='text-base sm:text-lg mb-8 text-black'>
					{getText('homeSection.paragraph', language)}
				</p>

				<div ref={buttonsRef} className='flex flex-wrap justify-center gap-3 mb-4'>
					<Link href='#contact'>
						<button className='py-3 px-6 bg-[#39E4D3] text-white hover:bg-[#33c9b9] transition-colors font-medium rounded-md touch-manipulation'>{getText('homeSection.talkToUs', language)}</button>
					</Link>
					<Link href='#case-studies'>
						<button className='py-3 px-6 border border-black text-black hover:bg-black/5 transition-colors font-medium rounded-md touch-manipulation'>{getText('homeSection.seeOurWork', language)}</button>
					</Link>
				</div>
			</div>

			{/* Video background - styled like desktop version */}
			<div ref={videoContainerRef} className='absolute inset-0 w-full h-full z-0 pointer-events-none'>
				<video className='absolute inset-0 w-full h-full object-cover' autoPlay loop muted playsInline poster='/video/home-page-poster.jpg'>
					<source src='/video/home-page-video.mp4' type='video/mp4' />
					Your browser does not support the video tag.
				</video>
			</div>

			{/* Grid background effect - optimized with fewer columns */}
			<div ref={gridRef} className='absolute inset-0 z-1 opacity-10 pointer-events-none'>
				<div className='flex h-full'>
					{windowWidth > 0 &&
						[...Array(10).keys()].map((_, index) => (
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
