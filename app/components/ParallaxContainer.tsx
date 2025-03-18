'use client';

import React, { useRef, ReactNode, useEffect, useState } from 'react';

interface ParallaxContainerProps {
	children: ReactNode;
}

export default function ParallaxContainer({ children }: ParallaxContainerProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const sectionsCount = React.Children.count(children);
	const [isDragging, setIsDragging] = useState(false);
	const [startX, setStartX] = useState(0);
	const [scrollLeft, setScrollLeft] = useState(0);

	// Set up horizontal scrolling
	useEffect(() => {
		if (typeof window !== 'undefined') {
			// Convert vertical wheel events to horizontal scrolling with smoother behavior
			const handleWheel = (e: WheelEvent) => {
				e.preventDefault();
				const container = containerRef.current;
				if (container) {
					// Extreme fast scrolling with much higher multiplier
					const scrollAmount = e.deltaY * 2;

					// Direct scrolling without animation for instant response
					container.scrollLeft += scrollAmount;
				}
			};

			// Handle keyboard navigation
			const handleKeyDown = (e: KeyboardEvent) => {
				const container = containerRef.current;
				if (!container) return;

				// Direct scroll for speed - full screen width
				const scrollAmount = window.innerWidth;

				switch (e.key) {
					case 'ArrowRight':
						container.scrollLeft += scrollAmount;
						e.preventDefault();
						break;
					case 'ArrowLeft':
						container.scrollLeft -= scrollAmount;
						e.preventDefault();
						break;
				}
			};

			// Touch and mouse drag handlers
			const handleMouseDown = (e: MouseEvent) => {
				setIsDragging(true);
				setStartX(e.pageX - containerRef.current!.offsetLeft);
				setScrollLeft(containerRef.current!.scrollLeft);
			};

			const handleTouchStart = (e: TouchEvent) => {
				setIsDragging(true);
				setStartX(e.touches[0].pageX - containerRef.current!.offsetLeft);
				setScrollLeft(containerRef.current!.scrollLeft);
			};

			const handleMouseMove = (e: MouseEvent) => {
				if (!isDragging) return;
				e.preventDefault();
				const x = e.pageX - containerRef.current!.offsetLeft;
				// Maximum sensitivity for immediate response
				const walk = (x - startX) * 5;
				containerRef.current!.scrollLeft = scrollLeft - walk;
			};

			const handleTouchMove = (e: TouchEvent) => {
				if (!isDragging) return;
				const x = e.touches[0].pageX - containerRef.current!.offsetLeft;
				// Maximum sensitivity for immediate response
				const walk = (x - startX) * 5;
				containerRef.current!.scrollLeft = scrollLeft - walk;
			};

			const handleMouseUp = () => {
				setIsDragging(false);
			};

			const handleTouchEnd = handleMouseUp;

			// Get container and add event listeners
			const container = containerRef.current;
			if (container) {
				// Wheel events
				container.addEventListener('wheel', handleWheel, { passive: false });
				container.addEventListener('mousewheel', handleWheel as EventListener, { passive: false });

				// Mouse drag events
				container.addEventListener('mousedown', handleMouseDown);
				container.addEventListener('mousemove', handleMouseMove);
				window.addEventListener('mouseup', handleMouseUp);

				// Touch events
				container.addEventListener('touchstart', handleTouchStart);
				container.addEventListener('touchmove', handleTouchMove);
				container.addEventListener('touchend', handleTouchEnd);

				// Keyboard navigation
				window.addEventListener('keydown', handleKeyDown);

				// Force initial scroll to start of container
				setTimeout(() => {
					container.scrollLeft = 0;
				}, 100);
			}

			// Make scrollbar disappear but still allow scrolling
			document.body.style.overflow = 'hidden';

			return () => {
				if (container) {
					// Remove wheel events
					container.removeEventListener('wheel', handleWheel);
					container.removeEventListener('mousewheel', handleWheel as EventListener);

					// Remove mouse drag events
					container.removeEventListener('mousedown', handleMouseDown);
					container.removeEventListener('mousemove', handleMouseMove);
					window.removeEventListener('mouseup', handleMouseUp);

					// Remove touch events
					container.removeEventListener('touchstart', handleTouchStart);
					container.removeEventListener('touchmove', handleTouchMove);
					container.removeEventListener('touchend', handleTouchEnd);

					// Remove keyboard events
					window.removeEventListener('keydown', handleKeyDown);
				}
				document.body.style.overflow = '';
			};
		}
	}, [isDragging, startX, scrollLeft]);

	return (
		<div
			ref={containerRef}
			className='fixed inset-0 overflow-x-auto overflow-y-hidden scrollbar-hide'
			style={{
				WebkitOverflowScrolling: 'touch',
				msOverflowStyle: 'none',
				scrollbarWidth: 'none',
				cursor: isDragging ? 'grabbing' : 'grab',
			}}
		>
			<div
				className='flex h-screen'
				style={{
					width: `${sectionsCount * 100}vw`,
				}}
			>
				{React.Children.map(children, (child, index) => (
					<div key={index} className='w-screen h-screen flex-shrink-0'>
						{child}
					</div>
				))}
			</div>
		</div>
	);
}
