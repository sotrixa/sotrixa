'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './HomeSection.module.css';
import { gsap } from 'gsap';
import { useLanguage } from '../data/LanguageContext';
import { getText } from '../data/translations';
import LanguageSwitcher from '../components/LanguageSwitcher';

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
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const handleResize = () => {
			const width = window.innerWidth;
			setWindowWidth(width);
			setIsMobile(width <= 768);
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
					const columns = gridRef.current.querySelectorAll(`.${styles.column}`);
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
				// Only do horizontal animation on desktop
				if (!isMobile) {
					tl.fromTo(videoContainerRef.current, { x: 30 }, { x: 0, duration: 1 }, '-=0.8');
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

	const getBlocks = () => {
		// Fewer blocks on mobile for better performance
		const blockSize = isMobile ? windowWidth * 0.03 : windowWidth * 0.02;
		const nbOfBlocks = Math.ceil(window.innerHeight / blockSize);
		const limitedBlocks = isMobile ? Math.min(nbOfBlocks, 15) : nbOfBlocks;

		return [...Array(limitedBlocks).keys()].map((_, index) => {
			return <div key={index} onMouseEnter={(e) => colorize(e.target as HTMLDivElement)} />;
		});
	};

	const colorize = (el: HTMLDivElement) => {
		el.style.backgroundColor = 'black';
		setTimeout(() => {
			el.style.backgroundColor = 'transparent';
		}, 300);
	};

	return (
		<div id='home' ref={containerRef} className={styles.container}>
			<LanguageSwitcher />

			<div ref={bodyRef} className={styles.body}>
				<h1 ref={headingRef} className={styles.heading}>
					{isMobile ? (
						// Simplified layout for mobile
						<>
							<span className={styles.white}>We are a </span>
							<span className={styles.teal}>strategy lab</span>
							<span className={styles.white}> for </span>
							<span className={styles.magenta}>visionary</span>
							<span className={styles.white}> </span>
							<span className={styles.yellow}>thinkers</span>
						</>
					) : (
						// Original layout for desktop
						<>
							<span>We are a </span>
							<span className={styles.teal}>strategy</span>
							<span> lab for </span>
							<span className={styles.magenta}>visionary</span>
							<span> </span>
							<span className={styles.yellow}>thinkers</span>
						</>
					)}
				</h1>

				<p ref={paragraphRef} className={styles.paragraph}>
					{getText('homeSection.paragraph', language)}
				</p>
				<div ref={buttonsRef} className={styles.buttons}>
					<button
						className={styles.button}
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
						className={styles.button}
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
						className={styles.button}
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

			<div ref={videoContainerRef} className={styles.videoContainer}>
				<video
					className={styles.video}
					autoPlay
					loop
					muted
					playsInline
					// Lower video quality on mobile devices for better performance
					poster={isMobile ? '/video/home-page-poster.jpg' : undefined}
				>
					<source src={isMobile ? '/video/home-page-video-mobile.mp4' : '/video/home-page-video.mp4'} type='video/mp4' />
					Your browser does not support the video tag.
				</video>
			</div>

			<div ref={gridRef} className={styles.grid}>
				{windowWidth > 0 &&
					[...Array(isMobile ? 10 : 40).keys()].map((_, index) => (
						<div key={'b_' + index} className={styles.column}>
							{getBlocks()}
						</div>
					))}
			</div>
		</div>
	);
}
