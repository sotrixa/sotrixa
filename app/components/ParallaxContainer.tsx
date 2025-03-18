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
				// Always prevent default browser scrolling
				e.preventDefault();

				// Get the container
				const container = containerRef.current;
				if (!container) return;

				// Check if we're in the services section
				const target = e.target as Element;
				const servicesSection = target.closest('#services');

				// If we're in the services section and it has scroll lock enabled
				if (servicesSection) {
					const isScrollLocked = servicesSection.getAttribute('data-scroll-locked') === 'true';

					// If the section is handling its own scrolling, let it handle events
					if (isScrollLocked) {
						// Don't do horizontal scrolling while in services with scroll lock
						return;
					}
				}

				// Normal horizontal scrolling for all other cases
				const scrollAmount = e.deltaY * 1.5;
				container.scrollLeft += scrollAmount;
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
				// COMPLETELY DISABLE CLICK-TO-SCROLL BEHAVIOR
				// Only allow dragging when explicitly clicking on the background itself
				const target = e.target as Element;

				// If clicking on anything but the container itself, don't start dragging
				if (
					target !== containerRef.current &&
					// We also need to check if it's a direct child of the container
					(target.parentElement !== containerRef.current ||
						// Or if it's any interactive element or descendent
						target.tagName === 'BUTTON' ||
						target.closest('button') ||
						target.closest('a') ||
						target.closest('[role="button"]') ||
						target.closest('input') ||
						target.closest('video') ||
						target.closest('svg') ||
						// Or if it has any event handlers
						(target as HTMLElement).onclick != null)
				) {
					return;
				}

				// Prevent default browser behavior
				e.preventDefault();
				e.stopPropagation();

				setIsDragging(true);
				setStartX(e.pageX - containerRef.current!.offsetLeft);
				setScrollLeft(containerRef.current!.scrollLeft);
			};

			const handleTouchStart = (e: TouchEvent) => {
				// COMPLETELY DISABLE TOUCH-TO-SCROLL FOR ALL ELEMENTS
				// Similar approach - only allow dragging on the container background
				const target = e.target as Element;

				// If touching anything but the container itself, don't start dragging
				if (
					target !== containerRef.current &&
					// We also need to check if it's a direct child of the container
					(target.parentElement !== containerRef.current ||
						// Or if it's any interactive element or descendent
						target.tagName === 'BUTTON' ||
						target.closest('button') ||
						target.closest('a') ||
						target.closest('[role="button"]') ||
						target.closest('input') ||
						target.closest('video') ||
						target.closest('svg') ||
						// Or if it has any event handlers
						(target as HTMLElement).onclick != null)
				) {
					return;
				}

				// Prevent default browser behavior for touch
				e.preventDefault();
				e.stopPropagation();

				setIsDragging(true);
				setStartX(e.touches[0].pageX - containerRef.current!.offsetLeft);
				setScrollLeft(containerRef.current!.scrollLeft);
			};

			// Additional safety for click prevention on entire container
			const handleClickCapture = (e: MouseEvent) => {
				// If the click is not on a recognized interactive element, prevent default
				// This ensures no accidental jumps
				const target = e.target as Element;
				if (target !== containerRef.current && !(target.tagName === 'BUTTON' || target.closest('button') || target.closest('a') || target.closest('[role="button"]') || target.closest('input') || target.closest('video'))) {
					// Prevent any default behavior for non-interactive elements
					e.preventDefault();
					e.stopPropagation();
				}
			};

			const handleMouseMove = (e: MouseEvent) => {
				if (!isDragging) return;

				// Always prevent default behavior during dragging
				e.preventDefault();
				e.stopPropagation();

				const x = e.pageX - containerRef.current!.offsetLeft;
				// Make dragging less sensitive to avoid jumpy behavior
				const walk = (x - startX) * 2.5; // Reduced sensitivity
				containerRef.current!.scrollLeft = scrollLeft - walk;
			};

			const handleTouchMove = (e: TouchEvent) => {
				if (!isDragging) return;

				// Always prevent default behavior during dragging
				e.preventDefault();
				e.stopPropagation();

				const x = e.touches[0].pageX - containerRef.current!.offsetLeft;
				// Make dragging less sensitive to avoid jumpy behavior
				const walk = (x - startX) * 2.5; // Reduced sensitivity
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
				container.addEventListener('click', handleClickCapture, { capture: true });
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
					container.removeEventListener('click', handleClickCapture, { capture: true });
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
			className='fixed inset-0 overflow-x-auto overflow-y-hidden scrollbar-hide parallax-container'
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
