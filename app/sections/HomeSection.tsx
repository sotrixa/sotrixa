'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './HomeSection.module.css';
import { gsap } from 'gsap';

export default function HomeSection() {
	const [windowWidth, setWindowWidth] = useState(0);
	const containerRef = useRef<HTMLDivElement>(null);
	const bodyRef = useRef<HTMLDivElement>(null);
	const headingRef = useRef<HTMLHeadingElement>(null);
	const subheadingRef = useRef<HTMLHeadingElement>(null);
	const paragraphRef = useRef<HTMLParagraphElement>(null);
	const buttonsRef = useRef<HTMLDivElement>(null);
	const videoContainerRef = useRef<HTMLDivElement>(null);
	const gridRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setWindowWidth(window.innerWidth);
		const handleResize = () => setWindowWidth(window.innerWidth);
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
					// Do not hide grid columns initially - just animate them in
					tl.fromTo(columns, { autoAlpha: 0 }, { autoAlpha: 1, stagger: 0.03, duration: 0.5 });
				}

				// Heading parts animation without hiding content first
				if (headingRef.current) {
					const parts = headingRef.current.querySelectorAll('span');
					// Just add a subtle animation without hiding text
					tl.fromTo(parts, { y: 10, scale: 0.95 }, { y: 0, scale: 1, stagger: 0.15, duration: 0.8 }, 0.3);
				}

				// Subheading animation - start from visible but slightly offset
				tl.fromTo(subheadingRef.current, { y: 10 }, { y: 0, duration: 0.7 }, '-=0.4');

				// Paragraph animation - start from visible but slightly offset
				tl.fromTo(paragraphRef.current, { y: 10 }, { y: 0, duration: 0.6 }, '-=0.3');

				// Buttons animation - start from visible but slightly offset
				tl.fromTo(buttonsRef.current, { y: 10 }, { y: 0, duration: 0.5 }, '-=0.2');

				// Video container animation - start from visible but slightly offset
				tl.fromTo(videoContainerRef.current, { x: 30 }, { x: 0, duration: 1 }, '-=0.8');

				// Add a cool scale effect to the whole container
				tl.from(
					containerRef.current,
					{
						scale: 1.05,
						duration: 1.5,
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
	}, []);

	const getBlocks = () => {
		const blockSize = windowWidth * 0.02;
		const nbOfBlocks = Math.ceil(window.innerHeight / blockSize);
		return [...Array(nbOfBlocks).keys()].map((_, index) => {
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
			<div ref={bodyRef} className={styles.body}>
				<h1 ref={headingRef} className={styles.heading}>
					<span className={styles.teal}>People</span> <span className={styles.white}>are</span> <span className={styles.yellow}>fascinating</span>
					<span className={styles.black}>.</span>
				</h1>
				<h2 ref={subheadingRef} className={styles.subheading}>
					Research should be too.
				</h2>
				<p ref={paragraphRef} className={styles.paragraph}>
					We transform complex data into meaningful insights through meticulous, human-centered research
				</p>
				<div ref={buttonsRef} className={styles.buttons}>
					<button className={styles.button}>Talk to us</button>
					<button className={styles.button}>See our work</button>
				</div>
			</div>

			<div ref={videoContainerRef} className={styles.videoContainer}>
				<video className={styles.video} autoPlay loop muted playsInline>
					<source src='/video/home-page-video.mp4' type='video/mp4' />
					Your browser does not support the video tag.
				</video>
			</div>

			<div ref={gridRef} className={styles.grid}>
				{windowWidth > 0 &&
					[...Array(40).keys()].map((_, index) => (
						<div key={'b_' + index} className={styles.column}>
							{getBlocks()}
						</div>
					))}
			</div>
		</div>
	);
}
