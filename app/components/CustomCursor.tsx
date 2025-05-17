'use client';

import { useState, useEffect, useRef } from 'react';

export default function CustomCursor() {
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const [isVisible, setIsVisible] = useState(true);
	const [showBubble, setShowBubble] = useState(true);
	const [isMobile, setIsMobile] = useState(false);
	const hasScrolled = useRef(false);

	useEffect(() => {
		// Check if device is mobile
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};

		// Initial check
		checkMobile();

		// Mouse position tracking for custom cursor
		const handleMouseMove = (e: MouseEvent) => {
			setMousePosition({ x: e.clientX, y: e.clientY });

			// Make cursor visible when it moves (in case it was hidden)
			setIsVisible(true);
		};

		// Hide text bubble when user scrolls
		const handleScroll = () => {
			if (!hasScrolled.current) {
				hasScrolled.current = true;
				setShowBubble(false);
			}
		};

		// Handle mouse leaving the window
		const handleMouseLeave = () => {
			setIsVisible(false);
		};

		// Handle mouse entering the window
		const handleMouseEnter = () => {
			setIsVisible(true);
		};

		// Hide default cursor on desktop only
		if (document.body && !isMobile) {
			document.body.style.cursor = 'none';
		}

		// Add event listeners for desktop only
		if (!isMobile) {
			window.addEventListener('mousemove', handleMouseMove);
			window.addEventListener('scroll', handleScroll);
			window.addEventListener('wheel', handleScroll);
			document.addEventListener('mouseleave', handleMouseLeave);
			document.addEventListener('mouseenter', handleMouseEnter);
		}

		// Add resize listener to detect screen size changes
		window.addEventListener('resize', checkMobile);

		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('wheel', handleScroll);
			document.removeEventListener('mouseleave', handleMouseLeave);
			document.removeEventListener('mouseenter', handleMouseEnter);
			window.removeEventListener('resize', checkMobile);

			// Reset cursor style on component unmount
			if (document.body) {
				document.body.style.cursor = 'auto';
			}
		};
	}, [isMobile]);

	// Don't render cursor on mobile or if cursor is outside window
	if (isMobile || !isVisible) return null;

	return (
		<div
			className='custom-cursor'
			style={{
				position: 'fixed',
				left: mousePosition.x,
				top: mousePosition.y,
				pointerEvents: 'none', // Important - allows clicking through
				zIndex: 9999,
				transform: 'translate(-50%, -50%)',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				transition: 'transform 0.1s ease',
			}}
		>
			{/* Cursor pointer */}
			<div
				style={{
					width: '80px',
					height: '80px',
					borderRadius: '50%',
					border: '3px solid black',
					backgroundColor: 'rgba(255, 255, 255, 0.8)',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					transform: 'rotate(-45deg)',
					marginBottom: showBubble ? '15px' : '0',
					transition: 'width 0.2s ease, height 0.2s ease, transform 0.2s ease',
				}}
			>
				<svg width='40' height='40' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
					<path d='M5 12H19M19 12L12 5M19 12L12 19' stroke='black' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
				</svg>
			</div>

			{/* Text bubble that shows only on home page initially */}
			{showBubble && (
				<div
					style={{
						padding: '10px 16px',
						backgroundColor: 'black',
						color: 'white',
						borderRadius: '20px',
						fontSize: '18px',
						fontWeight: 600,
						whiteSpace: 'nowrap',
					}}
				>
					START SCROLLING
				</div>
			)}
		</div>
	);
}
