'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useLanguage } from '../../data/LanguageContext';
import { getText } from '../../data/translations';

// Extend Window interface for navigation controls
declare global {
	interface Window {
		horizontalScrollControls?: {
			navigateToPanel: (index: number) => void;
			nextPanel: () => void;
			prevPanel: () => void;
			activeIndex: number;
		};
	}
}

export default function HomeSection() {
	const [windowWidth, setWindowWidth] = useState(0);
	const { language } = useLanguage();
	const containerRef = useRef<HTMLDivElement>(null);
	const bodyRef = useRef<HTMLDivElement>(null);
	const headingRef = useRef<HTMLHeadingElement>(null);
	const subheadingRef = useRef<HTMLHeadingElement>(null);
	const paragraphRef = useRef<HTMLParagraphElement>(null);
	const buttonsRef = useRef<HTMLDivElement>(null);
	const videoContainerRef = useRef<HTMLDivElement>(null);
	const gridRef = useRef<HTMLDivElement>(null);
	const videoRef = useRef<HTMLVideoElement>(null);
	const [isMobile, setIsMobile] = useState(false);

	// LOCK INITIAL HEIGHT - capture once and never change
	useEffect(() => {
		if (typeof window === 'undefined') return;

		// Capture initial viewport height in pixels
		const initialHeight = window.innerHeight;
		const fixedHeight = Math.max(initialHeight, 800); // Minimum 800px

		// Set container height in pixels - NEVER RECALCULATES
		if (containerRef.current) {
			containerRef.current.style.height = `${fixedHeight}px`;
			containerRef.current.style.minHeight = `${fixedHeight}px`;
		}

		// Set video height (60% of viewport)
		if (videoRef.current) {
			const videoHeight = fixedHeight * 0.6;
			videoRef.current.style.height = `${videoHeight}px`;
			videoRef.current.style.minHeight = `${videoHeight}px`;
		}
	}, []); // Run once on mount, never again

	useEffect(() => {
		const handleResize = () => {
			const width = window.innerWidth;
			setWindowWidth(width);
			// Consistent with main page mobile detection
			setIsMobile(width < 1024);
		};

		// Initial call
		handleResize();

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	// GSAP animation effect
	useEffect(() => {
		// Skip on server side
		if (typeof window === 'undefined') return;

		// Immediately hide grid elements on mount to prevent flash
		if (gridRef.current) {
			const columns = gridRef.current.querySelectorAll('[data-grid-column]');
			gsap.set(columns, { autoAlpha: 0 });
		}

		// Short delay to ensure DOM is fully rendered
		const animationTimeout = setTimeout(() => {
			if (!containerRef.current) return;

			try {
				// Create main timeline
				const tl = gsap.timeline({
					defaults: { ease: 'power3.out' },
				});

				// Grid animation
				if (gridRef.current) {
					const columns = gridRef.current.querySelectorAll('[data-grid-column]');
					// Use fewer columns on mobile for better performance
					const visibleColumns = isMobile ? Array.from(columns).slice(0, isMobile ? 10 : 20) : columns;

					tl.fromTo(visibleColumns, { autoAlpha: 0 }, { autoAlpha: 1, stagger: 0.03, duration: 0.5 });
				}

				// Heading parts animation without hiding content first
				if (headingRef.current) {
					const parts = headingRef.current.querySelectorAll('span');
					// Just add a subtle animation without hiding text
					tl.fromTo(parts, { y: 10, scale: 0.95 }, { y: 0, scale: 1, stagger: 0.15, duration: 0.8 }, 0.3);
				}

				// Subheading animation - start from visible but slightly offset
				if (subheadingRef.current) {
					tl.fromTo(subheadingRef.current, { y: 10 }, { y: 0, duration: 0.7 }, '-=0.4');
				}

				// Paragraph animation - start from visible but slightly offset
				tl.fromTo(paragraphRef.current, { y: 10 }, { y: 0, duration: 0.6 }, '-=0.3');

				// Buttons animation - start from visible but slightly offset
				tl.fromTo(buttonsRef.current, { y: 10 }, { y: 0, duration: 0.5 }, '-=0.2');

				// Video container animation - start from visible but slightly offset
				// Simple fade in animation for desktop (no horizontal movement)
				if (!isMobile) {
					tl.fromTo(videoContainerRef.current, { autoAlpha: 0.8, scale: 1.05 }, { autoAlpha: 1, scale: 1, duration: 1 }, '-=0.8');
				} else {
					// For mobile, fade in the background video with a slight scale effect
					tl.fromTo(videoContainerRef.current, { autoAlpha: 0.7, scale: 1.05 }, { autoAlpha: 1, scale: 1, duration: 1 }, '-=0.8');
				}

				// Add a cool scale effect to the whole container
				tl.from(
					containerRef.current,
					{
						scale: isMobile ? 1.02 : 1.05, // Smaller scale effect on mobile
						duration: isMobile ? 1 : 1.5,
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

	// Ensure video loops continuously
	useEffect(() => {
		const video = videoRef.current;
		if (!video) return;

		const handleVideoEnd = () => {
			video.currentTime = 0;
			video.play().catch(console.error);
		};

		const handleVideoError = () => {
			// Retry playing the video if there's an error
			setTimeout(() => {
				video.play().catch(console.error);
			}, 1000);
		};

		video.addEventListener('ended', handleVideoEnd);
		video.addEventListener('error', handleVideoError);

		// Ensure video plays initially
		video.play().catch(console.error);

		return () => {
			video.removeEventListener('ended', handleVideoEnd);
			video.removeEventListener('error', handleVideoError);
		};
	}, []);

	const getBlocks = () => {
		// Fewer blocks on mobile for better performance
		const blockSize = isMobile ? windowWidth * 0.03 : windowWidth * 0.02;
		const nbOfBlocks = Math.ceil(window.innerHeight / blockSize);
		const limitedBlocks = isMobile ? Math.min(nbOfBlocks, 15) : nbOfBlocks;

		return [...Array(limitedBlocks).keys()].map((_, index) => {
			return (
				<div
					key={index}
					className="flex-1 w-full transition-colors duration-300"
					onMouseEnter={(e) => colorize(e.target as HTMLDivElement)}
				/>
			);
		});
	};

	const colorize = (el: HTMLDivElement) => {
		el.style.backgroundColor = 'black';
		setTimeout(() => {
			el.style.backgroundColor = 'transparent';
		}, 300);
	};

	return (
		<div
			id='home'
			ref={containerRef}
			className="flex items-center justify-between bg-[#fbfbfb] overflow-hidden relative w-screen max-[900px]:flex-col max-[900px]:justify-center max-[900px]:gap-6 max-md:gap-4 min-h-screen"
		>
			<div
				ref={bodyRef}
				className="text-left font-bold w-1/2 relative text-black pointer-events-none flex flex-col gap-2 z-[2] shrink-0 pl-12 max-[1200px]:w-[48%] max-[1200px]:pl-6 max-[900px]:w-full max-[900px]:text-center max-[900px]:px-6 max-md:w-full max-md:justify-center max-md:items-center max-md:text-center max-md:z-[3] max-md:px-4 max-[480px]:px-3"
			>
				<h1
					ref={headingRef}
					className="font-black leading-tight m-0 pointer-events-auto max-md:text-center max-md:leading-tight"
					style={{ fontSize: 'clamp(1rem, 5.5vw, 4rem)' }}
				>
					{isMobile ? (
						// Simplified layout for mobile
						<>
							<span className="text-black">We are a </span>
							<span style={{ color: '#53EBDD' }}>strategy lab</span>
							<span className="text-black"> for </span>
							<span style={{ color: '#DD53EB' }}>visionary</span>
							<span className="text-black"> </span>
							<span style={{ color: '#EBDD53' }}>thinkers</span>
						</>
					) : (
						// Original layout for desktop
						<>
							<span>We are a </span>
							<span style={{ color: '#53EBDD' }}>strategy</span>
							<span> lab for </span>
							<span style={{ color: '#DD53EB' }}>visionary</span>
							<span> </span>
							<span style={{ color: '#EBDD53' }}>thinkers</span>
						</>
					)}
				</h1>

				<p
					ref={paragraphRef}
					className="text-xl leading-relaxed max-w-[36rem] font-normal m-0 mb-8 pointer-events-auto max-md:text-center max-md:max-w-[90%] max-md:mx-auto max-md:mb-6 max-md:text-sm max-md:leading-snug max-[480px]:text-[0.85rem] max-[480px]:max-w-[95%]"
				>
					{getText('homeSection.paragraph', language)}
				</p>
				<div
					ref={buttonsRef}
					className="flex gap-8 pointer-events-auto max-md:justify-center max-md:gap-2"
				>
					<button
						className="text-base font-medium cursor-pointer bg-transparent border-none p-0 hover:underline"
						onClick={() => {
							// Navigate to Contact section (index 4)
							if (window.horizontalScrollControls) {
								window.horizontalScrollControls.navigateToPanel(4);
							}
						}}
					>
						{getText('homeSection.talkToUs', language)}
					</button>
					<button
						className="text-base font-medium cursor-pointer bg-transparent border-none p-0 hover:underline"
						onClick={() => {
							// Navigate to Services section (index 2)
							if (window.horizontalScrollControls) {
								window.horizontalScrollControls.navigateToPanel(2);
							}
						}}
					>
						What we do
					</button>
					<button
						className="text-base font-medium cursor-pointer bg-transparent border-none p-0 hover:underline"
						onClick={() => {
							// Navigate to Case Study section (index 3)
							if (window.horizontalScrollControls) {
								window.horizontalScrollControls.navigateToPanel(3);
							}
						}}
					>
						{getText('homeSection.seeOurWork', language)}
					</button>
				</div>
			</div>

			<div
				ref={videoContainerRef}
				className="w-[45%] relative h-full overflow-hidden flex items-center justify-center z-[1] bg-[#fbfbfb] shrink-0 max-[1200px]:w-[45%] max-[1200px]:h-full max-[900px]:w-full max-[900px]:h-3/4 max-[900px]:relative max-[900px]:p-0 max-md:absolute max-md:w-full max-md:h-full max-md:left-0 max-md:top-0 max-md:z-[1] max-md:bg-transparent"
			>
				<video
					className="w-[85%] object-contain relative z-[2] max-w-full m-0 p-0 border-none outline-none shadow-none block bg-transparent overflow-hidden max-md:w-full max-md:h-full max-md:object-cover"
					autoPlay
					loop
					muted
					playsInline
					ref={videoRef}
				>
					<source src={isMobile ? '/video/Sotrixa Home Page Animation.mp4' : '/video/Sotrixa Home Page Animation.mp4'} type='video/mp4' />
					Your browser does not support the video tag.
				</video>
			</div>

			<div
				ref={gridRef}
				className="absolute top-0 left-0 h-full w-full grid grid-cols-[repeat(40,1fr)] -z-[1] pointer-events-none max-md:-z-[2] max-[1024px]:grid-cols-[repeat(10,1fr)]"
			>
				{windowWidth > 0 &&
					[...Array(isMobile ? 10 : 40).keys()].map((_, index) => (
						<div
							key={'b_' + index}
							data-grid-column
							className="h-full flex flex-col opacity-0"
						>
							{getBlocks()}
						</div>
					))}
			</div>
		</div>
	);
}
