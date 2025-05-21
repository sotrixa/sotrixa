'use client';

import { useState, useEffect, useRef } from 'react';

export default function CustomCursor() {
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const [isVisible, setIsVisible] = useState(true);
	const [isMobile, setIsMobile] = useState(false);
	const [isClickable, setIsClickable] = useState(false);
	const [showScrollPrompt, setShowScrollPrompt] = useState(true);
	const [hasUserMoved, setHasUserMoved] = useState(false);
	const cursorRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		// Check if device is mobile
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};

		// Initial check
		checkMobile();

		// Center cursor on page load
		if (typeof window !== 'undefined') {
			setMousePosition({
				x: window.innerWidth / 2,
				y: window.innerHeight / 2,
			});
		}

		// Mouse position tracking for custom cursor
		const handleMouseMove = (e: MouseEvent) => {
			setMousePosition({ x: e.clientX, y: e.clientY });
			setHasUserMoved(true);

			// Make cursor visible when it moves
			setIsVisible(true);

			// Check if the element under the cursor is clickable
			const target = e.target as HTMLElement;

			const isClickableElement = !!(target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button') || target.classList.contains('cursor-pointer') || target.closest('.cursor-pointer') || target.getAttribute('role') === 'button' || target.closest('[role="button"]') || target.closest('[onClick]') || target.closest('.clickable') || window.getComputedStyle(target).cursor === 'pointer');

			setIsClickable(isClickableElement);
		};

		// Handle mouse leaving the window
		const handleMouseLeave = () => {
			setIsVisible(false);
		};

		// Handle mouse entering the window
		const handleMouseEnter = () => {
			setIsVisible(true);
		};

		// Handle scroll to hide the scroll prompt
		const handleScroll = () => {
			if (showScrollPrompt) {
				setShowScrollPrompt(false);
			}
		};

		// Hide default cursor
		if (document.body && !isMobile) {
			document.body.style.cursor = 'none';
		}

		// Add event listeners for desktop only
		if (!isMobile) {
			window.addEventListener('mousemove', handleMouseMove);
			document.addEventListener('mouseleave', handleMouseLeave);
			document.addEventListener('mouseenter', handleMouseEnter);
			window.addEventListener('scroll', handleScroll, { passive: true, capture: true });

			// Also detect wheel events for more immediate response
			window.addEventListener('wheel', handleScroll, { passive: true, capture: true });
		}

		// Add resize listener to detect screen size changes
		window.addEventListener('resize', checkMobile);

		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseleave', handleMouseLeave);
			document.removeEventListener('mouseenter', handleMouseEnter);
			window.removeEventListener('resize', checkMobile);
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('wheel', handleScroll);

			// Reset cursor style on component unmount
			if (document.body) {
				document.body.style.cursor = 'auto';
			}
		};
	}, [isMobile, showScrollPrompt]);

	// Don't render cursor on mobile or if cursor is outside window
	if (isMobile || !isVisible) return null;

	return (
		<div
			ref={cursorRef}
			className={`custom-cursor ${isClickable ? 'clickable' : ''}`}
			style={{
				position: 'fixed',
				left: mousePosition.x,
				top: mousePosition.y,
				pointerEvents: 'none', // Important - allows clicking through
				zIndex: 9999,
				transform: isClickable ? 'scale(1.2) translate(-5px, -5px)' : 'translate(-5px, -5px)',
				transition: hasUserMoved ? 'transform 0.2s' : 'none',
				filter: 'drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.5))',
			}}
		>
			{/* Mouse pointer cursor */}
			<svg width={isClickable ? '36' : '30'} height={isClickable ? '36' : '30'} viewBox='0 0 24 24' fill='white' stroke='black' strokeWidth='1.5'>
				<path d='M5,2 L5,18 L10,13 L13,16 L19,6 L13,16 L16,21 L18,10z' />
			</svg>

			{/* Scroll prompt bubble */}
			{showScrollPrompt && (
				<div
					style={{
						position: 'absolute',
						top: '100%',
						left: '50%',
						transform: 'translateX(-50%)',
						backgroundColor: 'rgba(0, 0, 0, 0.7)',
						color: 'white',
						padding: '8px 12px',
						borderRadius: '20px',
						fontSize: '14px',
						marginTop: '10px',
						whiteSpace: 'nowrap',
						animation: 'fadeIn 0.5s ease-in-out',
					}}
				>
					Scroll to explore
				</div>
			)}
		</div>
	);
}
