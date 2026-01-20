import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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
	const [svgWidth, setSvgWidth] = useState(500); // Default width until client-side hydration
	const [activeDotIndex, setActiveDotIndex] = useState(0); // Track active dot index
	const [isMenuOpen, setIsMenuOpen] = useState(false); // Track navigation menu state
	const [mounted, setMounted] = useState(false); // Track if component is mounted
	const [isMobile, setIsMobile] = useState(false); // Track if device is mobile
	
	// Mount tracking and mobile detection
	useEffect(() => {
		setMounted(true);
		
		// Check if device is mobile (screen width < 1024px)
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 1024);
		};
		
		// Check initially
		checkMobile();
		
		// Listen for resize events to update mobile state
		window.addEventListener('resize', checkMobile);
		
		return () => {
			setMounted(false);
			window.removeEventListener('resize', checkMobile);
		};
	}, []);
	
	// LOCK POSITION IN PIXELS - CALCULATE ONCE AND NEVER CHANGE
	useEffect(() => {
		if (!mounted || typeof window === 'undefined') return;

		// Capture initial viewport dimensions in pixels - ONCE
		const initialHeight = window.innerHeight;
		const fixedHeight = Math.max(initialHeight, 800);
		const bottomPosition = fixedHeight - 20; // 20px from bottom of FIXED height

		const forcePosition = () => {
			if (containerRef.current) {
				const element = containerRef.current;

				// FORCE FIXED POSITION USING PIXEL VALUES - NOT VIEWPORT-RELATIVE
				element.style.setProperty('position', 'fixed', 'important');
				element.style.setProperty('top', `${bottomPosition - 80}px`, 'important'); // Fixed pixel position from top
				element.style.setProperty('bottom', 'unset', 'important'); // Don't use bottom (viewport-relative)
				element.style.setProperty('left', '50%', 'important');
				element.style.setProperty('transform', 'translateX(-50%)', 'important');
				element.style.setProperty('z-index', '99999', 'important');
				element.style.setProperty('right', 'unset', 'important');
				element.style.setProperty('pointer-events', 'none', 'important');
				element.style.setProperty('display', isMenuOpen ? 'none' : 'block', 'important');
				element.style.setProperty('width', 'auto', 'important');
				element.style.setProperty('height', 'auto', 'important');
				element.style.setProperty('margin', '0', 'important');
				element.style.setProperty('padding', '0', 'important');
				element.style.setProperty('max-height', 'none', 'important');
				element.style.setProperty('min-height', '0', 'important');
				element.style.setProperty('max-width', 'none', 'important');
				element.style.setProperty('min-width', '0', 'important');
				element.style.setProperty('overflow', 'visible', 'important');
			}
		};

		// Force position immediately and constantly
		forcePosition();
		const interval = setInterval(forcePosition, 10);

		// Cleanup
		return () => {
			clearInterval(interval);
		};
	}, [mounted, isMenuOpen]);

	// Listen for navigation menu state changes
	useEffect(() => {
		// Listen for the custom event dispatched by the Header component
		const handleNavigationMenuStateChange = (event: Event) => {
			const customEvent = event as CustomEvent;
			if (customEvent.detail && typeof customEvent.detail.isOpen === 'boolean') {
				setIsMenuOpen(customEvent.detail.isOpen);
			}
		};

		document.addEventListener('navigationMenuStateChange', handleNavigationMenuStateChange);

		return () => {
			document.removeEventListener('navigationMenuStateChange', handleNavigationMenuStateChange);
		};
	}, []);

	// Set SVG width once based on desktop size - NO responsive behavior
	useEffect(() => {
		// Safe to access window here (client-side only)
		// Set to a fixed desktop-appropriate width (no responsive behavior)
		const desktopWidth = Math.max(window.innerWidth * 0.5, 600); // Minimum 600px, or half screen width
		setSvgWidth(desktopWidth);

		// NO resize listener - we want it to maintain desktop size
		// regardless of viewport changes
	}, []);

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
			transformOrigin: '50% 50%',
		});

		// Setup rotation for gear
		gsap.to(gear, {
			rotation: 360,
			repeat: -1,
			duration: 8,
			ease: 'none',
			transformOrigin: '50% 50%',
		});

		// Capture dotsRef.current at the time the effect runs
		const dots = dotsRef.current;

		// Setup initial dot states
		dots.forEach((dot) => {
			if (!dot) return;
			gsap.set(dot, {
				opacity: 1, // Show all dots initially
				fill: '#000000', // All dots are black initially
				scale: 1,
				stroke: '#000000',
				strokeWidth: 1,
			});
		});

		// Create a single animation that controls everything based on progress
		tl.to({}, { duration: 1, ease: 'none' }); // Empty tween that serves as timeline duration

		// Function to update elements based on timeline progress
		const updateFromProgress = (progress: number) => {
			// Make sure progress is between 0 and 1
			progress = Math.max(0, Math.min(1, progress));

			// Calculate the current drawn length of the path
			const drawnLength = pathLength * progress;

			// Update path drawing WITHOUT animation for exact sync
			gsap.set(path, {
				strokeDashoffset: pathLength - drawnLength,
				opacity: 1,
			});

			// Calculate the current section index
			const currentSectionIndex = Math.floor(progress * (numSections - 1));
			setActiveDotIndex(currentSectionIndex);

			// Get the point at the current drawn position of the path
			const pathPoint = path.getPointAtLength(drawnLength);

			// Position gear - ALWAYS at the end of the drawn line
			if (progress > 0) {
				// Position the gear IMMEDIATELY at the exact end of the currently drawn path
				gsap.set(gear, {
					x: pathPoint.x,
					y: pathPoint.y,
					scale: 1.2,
					opacity: 1,
				});
			} else {
				// Hide gear at the very beginning (progress = 0)
				gsap.set(gear, {
					opacity: 0,
				});
			}

			// Update dots visibility and style
			dots.forEach((dot, i) => {
				if (!dot) return;

				const isPassed = i < currentSectionIndex;
				const isActive = i === currentSectionIndex;

				gsap.set(dot, {
					opacity: 1, // Always show all dots
					scale: 1,
					fill: isPassed ? '#666666' : '#000000', // Past sections are gray, current and future are black
					stroke: '#000000',
					strokeWidth: 1,
				});

				// Find label for this dot and animate it if it's active
				const label = document.getElementById(`label-${i}`);
				if (label) {
					gsap.to(label, {
						scale: isActive ? 1.2 : 1,
						duration: 0.3,
						ease: 'power2.out',
						transformOrigin: 'center center',
					});
				}
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
	}, [sections, svgWidth]);

	// Listen for custom events from the horizontal scroll component
	useEffect(() => {
		const handleSectionChange = (event: CustomEvent) => {
			const { currentSection } = event.detail;
			setActiveDotIndex(currentSection);

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

			// Animate the active label
			for (let i = 0; i < sections.length; i++) {
				const label = document.getElementById(`label-${i}`);
				if (label) {
					gsap.to(label, {
						scale: i === currentSection ? 1.2 : 1,
						duration: 0.3,
						ease: 'power2.out',
						transformOrigin: 'center center',
					});
				}
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

			// Calculate the current section index from progress
			const currentSectionIndex = Math.floor(currentProgress * (sections.length - 1));

			// Animate the active label
			for (let i = 0; i < sections.length; i++) {
				const label = document.getElementById(`label-${i}`);
				if (label) {
					gsap.to(label, {
						scale: i === currentSectionIndex ? 1.2 : 1,
						duration: 0.3,
						ease: 'power2.out',
						transformOrigin: 'center center',
					});
				}
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
		const width = svgWidth - 80; // Increased padding on right side for labels
		const spacing = width / (sections.length - 1);
		let path = `M20 30`; // Minimal left padding

		for (let i = 1; i < sections.length; i++) {
			const x = i * spacing + 20;
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
		const width = svgWidth - 80; // Match increased padding from path
		const spacing = width / (sections.length - 1);

		return sections.map((_, i) => ({
			x: i * spacing + 20,
			y: 30,
		}));
	};

	const pathData = generateSVGPath();
	const dotPositions = calculateDotPositions();

	// Adjust SVG height to accommodate the labels
	const svgHeight = 80;

	// Don't render on server, before mount, or on mobile
	if (!mounted || typeof window === 'undefined' || isMobile) {
		return null;
	}

	// Render using portal directly to body to bypass ALL container constraints
	return createPortal(
		<div
			ref={containerRef}
			className="scroll-path-pagination"
			style={{
				display: isMenuOpen ? 'none' : 'block',
				pointerEvents: 'none'
			}}
		>
			<svg 
				ref={svgRef} 
				width={svgWidth} 
				height={svgHeight} 
				viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
				fill='none' 
				xmlns='http://www.w3.org/2000/svg' 
				style={{ 
					filter: 'drop-shadow(0px 0px 5px rgba(0,0,0,0.2))'
				}} 
				className='w-full h-auto'
			>
				{/* Background glow */}
				<path d={pathData} stroke='rgba(0,0,0,0.2)' strokeWidth='8' strokeLinecap='round' fill='none' />

				{/* Main path */}
				<path ref={pathRef} d={pathData} stroke='#000000' strokeWidth='2' strokeLinecap='round' fill='none' style={{ opacity: 1 }} />

				{/* Gear icon */}
				<g ref={gearRef} className='pointer-events-none'>
					<foreignObject width='40' height='40' x='-20' y='-20'>
						<div className='w-full h-full flex items-center justify-center'>
							<Image src='/Gear-Icon.svg' alt='Gear Icon' width={32} height={32} className='w-full h-full object-contain' style={{ transformOrigin: 'center' }} priority />
						</div>
					</foreignObject>
				</g>

				{/* Section dots and labels */}
				{dotPositions.map((pos, index) => (
					<g
						key={`dot-${index}`}
						className='cursor-pointer'
						style={{ pointerEvents: 'auto' }}
						onClick={() => {
							if (window.horizontalScrollControls) {
								window.horizontalScrollControls.navigateToPanel(index);
							}
						}}
					>
						{/* The dot */}
						<circle
							ref={(el) => {
								dotsRef.current[index] = el;
							}}
							cx={pos.x}
							cy={pos.y}
							r='6'
							fill={index < activeDotIndex ? '#666666' : '#000000'} // Past dots are gray, current and future are black
							stroke='#000000'
							strokeWidth='1'
							className='transition-all duration-300'
						/>

						{/* Section label (always visible below the dot) */}
						<text id={`label-${index}`} x={pos.x} y={pos.y + 25} fill='#000000' fontSize='11' fontFamily='sans-serif' textAnchor='middle' dominantBaseline='middle' className='transition-all duration-300' style={{ transformOrigin: 'center' }}>
							{sections[index] || (index === 0 ? 'Home' : `Section ${index + 1}`)}
						</text>
					</g>
				))}
			</svg>
		</div>,
		document.body
	);
}
