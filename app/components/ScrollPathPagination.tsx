import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Extend Window interface to include our function
declare global {
	interface Window {
		horizontalScrollControls?: {
			nextPanel: () => void;
			prevPanel: () => void;
			navigateToPanel: (index: number) => void;
			activeIndex: number;
		};
		updateScrollPathFromProgress?: (progress: number) => void;
	}
}

interface ScrollPathPaginationProps {
	sections: string[];
	activeSection?: number;
}

export default function ScrollPathPagination({ sections }: ScrollPathPaginationProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const svgRef = useRef<SVGSVGElement>(null);
	const pathRef = useRef<SVGPathElement>(null);
	const dotsRef = useRef<Array<SVGCircleElement | null>>([]);
	const gearRef = useRef<SVGGElement>(null);
	const timelineRef = useRef<gsap.core.Timeline | null>(null);

	// Setup all animations when component mounts
	useEffect(() => {
		if (!svgRef.current || !pathRef.current || !gearRef.current || !containerRef.current) return;

		// Calculate positions
		const numSections = sections.length;

		// Create main timeline
		const tl = gsap.timeline({
			paused: true,
		});

		// Setup gear and path
		const path = pathRef.current;
		const pathLength = path.getTotalLength();
		const gear = gearRef.current;

		// Initial setup - path is fully hidden by offset
		gsap.set(path, {
			strokeDasharray: pathLength,
			strokeDashoffset: pathLength,
			opacity: 1,
		});

		// Initial setup for gear icon
		gsap.set(gear, {
			opacity: 0,
			transformOrigin: 'center center',
		});

		// Setup rotation for gear
		gsap.to(gear, {
			rotation: 360,
			repeat: -1,
			duration: 8,
			ease: 'none',
		});

		// Capture dotsRef.current at the time the effect runs
		const dots = dotsRef.current;

		// Setup initial dot states
		dots.forEach((dot, i) => {
			if (!dot) return;
			gsap.set(dot, {
				opacity: i === 0 ? 1 : 0,
				fill: i === 0 ? '#000000' : '#333333',
				scale: i === 0 ? 1.5 : 1,
				stroke: i === 0 ? '#000000' : '#555555',
				strokeWidth: i === 0 ? 2 : 1,
			});
		});

		// Create a single animation that controls everything based on progress
		tl.to({}, { duration: 1, ease: 'none' }); // Empty tween that serves as timeline duration

		// Function to update elements based on timeline progress
		const updateFromProgress = (progress: number) => {
			// Make sure progress is between 0 and 1
			progress = Math.max(0, Math.min(1, progress));

			// Update path drawing
			gsap.to(path, {
				strokeDashoffset: pathLength * (1 - progress),
				opacity: 1,
				duration: 0.3,
				overwrite: 'auto',
			});

			// Calculate the nearest dot index and distance to it
			const nearestDotIndex = Math.round(progress * (numSections - 1));
			const distanceToNearestDot = Math.abs(progress * (numSections - 1) - nearestDotIndex);

			// Always calculate position along the path - don't snap to dots
			const pathPoint = path.getPointAtLength(pathLength * progress);

			// Position gear - always stay on the path
			if (progress > 0) {
				// Update gear position with animation
				gsap.to(gear, {
					x: pathPoint.x,
					y: pathPoint.y,
					// Scale up when near dots but don't change position
					scale: distanceToNearestDot < 0.05 && nearestDotIndex > 0 ? 1.5 : 1,
					opacity: 1,
					duration: 0.3,
					ease: 'power1.out',
					overwrite: 'auto',
				});

				// Use dotPositions for dot-specific animations if needed
				if (nearestDotIndex > 0 && distanceToNearestDot < 0.05) {
					// We're near a dot - could do additional animations with dotPositions[nearestDotIndex]
				}
			} else {
				// Hide gear at the very beginning (progress = 0)
				gsap.to(gear, {
					opacity: 0,
					duration: 0.2,
					overwrite: 'auto',
				});
			}

			// Update dots visibility
			const currentSectionIndex = Math.floor(progress * (numSections - 1));

			// Update dot states based on current progress
			dots.forEach((dot, i) => {
				if (!dot) return;

				// Show dots up to current section
				const isVisible = i === 0 || i <= currentSectionIndex + 1;
				const isActive = i <= currentSectionIndex;
				const isCurrent = i === currentSectionIndex;

				gsap.to(dot, {
					opacity: isVisible ? 1 : 0,
					scale: isCurrent ? 1.5 : isActive ? 1.2 : 1,
					fill: isActive ? (isCurrent ? '#000000' : '#333333') : '#555555',
					stroke: isActive ? '#000000' : '#555555',
					strokeWidth: isActive ? 2 : 1,
					duration: 0.2,
				});
			});
		};

		// Create ScrollTrigger that directly controls the animations
		ScrollTrigger.create({
			trigger: 'body',
			start: 'top top',
			end: 'bottom bottom',
			onUpdate: (self) => {
				// Get progress from ScrollTrigger
				const progress = self.progress;

				// Update timeline position
				tl.progress(progress);

				// Update all elements based on progress
				updateFromProgress(progress);

				// Always ensure visibility of SVG elements except gear (which is controlled in updateFromProgress)
				gsap.set(path, { opacity: 1 });
				gsap.set(svgRef.current, { opacity: 1 });
			},
		});

		// Create click handlers for the dots
		const dotEventListeners = dots
			.map((dot, index) => {
				if (!dot) return null;

				const clickHandler = () => {
					// Navigate to section
					if (window.horizontalScrollControls) {
						window.horizontalScrollControls.navigateToPanel(index);
					}
				};

				dot.addEventListener('click', clickHandler);
				return { dot, clickHandler };
			})
			.filter(Boolean);

		// Store the timeline and update function for cleanup and external control
		timelineRef.current = tl;

		// Store updateFromProgress in the window object so it can be accessed from event handlers
		window.updateScrollPathFromProgress = updateFromProgress;

		// Cleanup function
		return () => {
			ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
			if (timelineRef.current) {
				timelineRef.current.kill();
			}

			// Remove the update function
			delete window.updateScrollPathFromProgress;

			// Remove click event listeners using stored references
			dotEventListeners.forEach((listener) => {
				if (listener) {
					listener.dot.removeEventListener('click', listener.clickHandler);
				}
			});
		};
	}, [sections]);

	// Listen for custom events from the horizontal scroll component
	useEffect(() => {
		const handleSectionChange = (event: CustomEvent) => {
			const { currentSection } = event.detail;

			// Calculate progress based on current section
			const progress = currentSection / (sections.length - 1);

			// Update the timeline
			if (timelineRef.current) {
				timelineRef.current.progress(progress);
			}

			// Update elements directly
			if (window.updateScrollPathFromProgress) {
				window.updateScrollPathFromProgress(progress);
			}
		};

		document.addEventListener('sectionChange', handleSectionChange as EventListener);

		// Also listen for horizontalScroll events
		const handleScrollProgress = (event: CustomEvent) => {
			const { fromIndex, toIndex, progress } = event.detail;

			// Calculate current progress
			const startProgress = fromIndex / (sections.length - 1);
			const endProgress = toIndex / (sections.length - 1);
			const currentProgress = startProgress + (endProgress - startProgress) * progress;

			// Update the timeline
			if (timelineRef.current) {
				timelineRef.current.progress(currentProgress);
			}

			// Update elements directly
			if (window.updateScrollPathFromProgress) {
				window.updateScrollPathFromProgress(currentProgress);
			}
		};

		document.addEventListener('horizontalScroll', handleScrollProgress as EventListener);

		return () => {
			document.removeEventListener('sectionChange', handleSectionChange as EventListener);
			document.removeEventListener('horizontalScroll', handleScrollProgress as EventListener);
		};
	}, [sections.length]);

	// Generate a horizontal curved path
	const generateSVGPath = () => {
		const width = 300;
		const spacing = width / (sections.length - 1);
		let path = `M10 30`;

		for (let i = 1; i < sections.length; i++) {
			const x = i * spacing + 10;
			const controlX1 = x - spacing * 0.6;
			const controlX2 = x - spacing * 0.4;

			if (i % 2 === 0) {
				path += ` C${controlX1} 35, ${controlX2} 25, ${x} 30`;
			} else {
				path += ` C${controlX1} 25, ${controlX2} 35, ${x} 30`;
			}
		}

		return path;
	};

	// Calculate dot positions
	const calculateDotPositions = () => {
		const width = 300;
		const spacing = width / (sections.length - 1);

		return sections.map((_, i) => ({
			x: i * spacing + 10,
			y: 30,
		}));
	};

	const pathData = generateSVGPath();
	const dotPositions = calculateDotPositions();

	return (
		<div ref={containerRef} className='fixed bottom-10 left-1/2 transform -translate-x-1/2 z-[1000] pointer-events-auto' style={{ opacity: 1 }}>
			<svg ref={svgRef} width='320' height='60' viewBox='0 0 320 60' fill='none' xmlns='http://www.w3.org/2000/svg' style={{ filter: 'drop-shadow(0px 0px 5px rgba(0,0,0,0.2))', opacity: 1 }}>
				{/* Background glow */}
				<path d={pathData} stroke='rgba(0,0,0,0.2)' strokeWidth='8' strokeLinecap='round' fill='none' />

				{/* Main path */}
				<path ref={pathRef} d={pathData} stroke='#000000' strokeWidth='2' strokeLinecap='round' fill='none' style={{ opacity: 1 }} />

				{/* Gear icon */}
				<g ref={gearRef} className='pointer-events-none'>
					<foreignObject width='30' height='30' x='-15' y='-15'>
						<div className='w-full h-full flex items-center justify-center'>
							<Image src='/Gear-Icon.svg' alt='Gear Icon' width={30} height={30} className='w-full scale-150 h-full object-contain' priority />
						</div>
					</foreignObject>
				</g>

				{/* Section dots */}
				{dotPositions.map((pos, index) => (
					<g key={`dot-${index}`} className='cursor-pointer group'>
						<circle
							ref={(el) => {
								dotsRef.current[index] = el;
							}}
							cx={pos.x}
							cy={pos.y}
							r='6'
							fill='#333333'
							stroke='#000000'
							strokeWidth='1'
						/>

						{/* Tooltip */}
						<g className='opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
							<rect x={pos.x - 40} y='0' width='80' height='20' rx='4' fill='rgba(0,0,0,0.8)' />
							<text x={pos.x} y='12' fill='white' fontSize='11' fontFamily='sans-serif' textAnchor='middle' dominantBaseline='middle'>
								{sections[index]}
							</text>
						</g>
					</g>
				))}
			</svg>
		</div>
	);
}
