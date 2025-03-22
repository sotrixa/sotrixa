'use client';

import { useState, useRef, RefObject, useEffect } from 'react';
import { GsapHorizontalScrollProps } from './scroll/types';
import { useNavigationControls } from './scroll/useNavigationControls';
import { useScrollSetup } from './scroll/useScrollSetup';
import { useScrollInitializer } from './scroll/useScrollInitializer';
import { useEventHandlers } from './scroll/useEventHandlers';
import ScrollNavigation from './scroll/ScrollNavigation';

type HTMLDivRef = RefObject<HTMLDivElement>;

// Define type for horizontal scroll controls
interface HorizontalScrollControls {
	nextPanel: () => void;
	prevPanel: () => void;
	navigateToPanel: (index: number) => void;
	activeIndex: number;
}

// Extend Window interface
declare global {
	interface Window {
		horizontalScrollControls?: HorizontalScrollControls;
	}
}

export default function GsapHorizontalScroll({ children }: GsapHorizontalScrollProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [isInitialized, setIsInitialized] = useState(false);

	// Get the total number of sections
	const sectionsCount = Array.isArray(children) ? children.length : 1;

	// Set up navigation controls
	const { activeIndex, isAnimating, sectionsRef, wrapperRef, navigateToPanel, nextPanel, prevPanel } = useNavigationControls(sectionsCount);

	// Initialize GSAP
	useScrollSetup();

	// Initialize scroll setup
	useScrollInitializer({
		containerRef: containerRef as HTMLDivRef,
		wrapperRef,
		sectionsRef,
		navigateToPanel,
		nextPanel,
		prevPanel,
		activeIndex,
		isAnimating,
		sectionsCount,
		setIsInitialized,
	});

	// Set up event handlers
	useEventHandlers({
		containerRef: containerRef as HTMLDivRef,
		sectionsRef,
		activeIndex,
		isAnimating,
		nextPanel,
		prevPanel,
		navigateToPanel,
	});

	// Expose navigation controls for other components to use
	useEffect(() => {
		if (typeof window !== 'undefined') {
			window.horizontalScrollControls = {
				nextPanel,
				prevPanel,
				navigateToPanel,
				activeIndex: activeIndex.current,
			};
		}

		return () => {
			if (typeof window !== 'undefined') {
				delete window.horizontalScrollControls;
			}
		};
	}, [navigateToPanel, nextPanel, prevPanel, activeIndex]);

	return (
		<>
			{/* Main container */}
			<div ref={containerRef} className='fixed inset-0 overflow-hidden'>
				{/* Horizontal scroll wrapper */}
				<div ref={wrapperRef} className='h-full flex flex-nowrap' style={{ willChange: 'transform', transform: 'translateX(0px)' }}>
					{/* Sections container */}
					<div ref={sectionsRef} className='flex flex-nowrap h-full'>
						{children}
					</div>
				</div>
			</div>

			{/* Navigation components */}
			<ScrollNavigation prevPanel={prevPanel} nextPanel={nextPanel} />

			{/* Fallback message - will only show if initialization fails */}
			{!isInitialized && (
				<div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-[100] text-white'>
					<div className='text-center p-8'>
						<h2 className='text-2xl mb-4'>Initializing scroll experience...</h2>
						<p>If this message persists, try refreshing the page.</p>
					</div>
				</div>
			)}
		</>
	);
}
