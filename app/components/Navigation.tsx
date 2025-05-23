'use client';

import Image from 'next/image';
import Link from 'next/link';
import Header from './header';
import { useState, useEffect, CSSProperties } from 'react';

// Main Navigation Component
export default function Navigation() {
	const [isMobile, setIsMobile] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth <= 768);
		};

		const handleScroll = () => {
			const scrolled = window.scrollY > 0;
			setIsScrolled(scrolled);
			console.log('Scroll detected:', { scrollY: window.scrollY, isMobile, isScrolled: scrolled });
		};

		// Set initial values
		handleResize();
		handleScroll();

		// Add event listeners
		window.addEventListener('resize', handleResize);
		window.addEventListener('scroll', handleScroll);

		// Cleanup
		return () => {
			window.removeEventListener('resize', handleResize);
			window.removeEventListener('scroll', handleScroll);
		};
	}, [isMobile]); // Added isMobile as dependency to update scroll state when mobile changes

	// Create inline styles for navigation
	const navStyle: CSSProperties = {
		position: 'fixed',
		top: 0,
		left: 0,
		width: '100%',
		zIndex: 50,
		transition: 'background-color 0.3s, box-shadow 0.3s',
		backgroundColor: isMobile && isScrolled ? 'white' : 'transparent',
		boxShadow: isMobile && isScrolled ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : 'none',
	};

	// Debug indicator style
	const debugStyle: CSSProperties = {
		position: 'fixed',
		bottom: '10px',
		right: '10px',
		padding: '5px 10px',
		background: '#333',
		color: 'white',
		borderRadius: '4px',
		fontSize: '12px',
		zIndex: 9999,
	};

	return (
		<nav style={navStyle}>
			<div className={`${isMobile ? 'px-4 py-3' : 'px-20 py-4'} transition-all duration-300`}>
				<div className='flex justify-between items-center'>
					{/* Logo */}
					<Link href='#home' className='transition-transform duration-300 hover:scale-105'>
						<Image src='/sotrixa-logo.webp' alt='Sotrixa Logo' width={isMobile ? 100 : 120} height={isMobile ? 33 : 40} className='transition-all duration-300' />
					</Link>
				</div>
			</div>

			{/* Sliding Stairs Menu */}
			<Header />

			{/* Debug indicator - visible only during development */}
			{process.env.NODE_ENV === 'development' && (
				<div style={debugStyle}>
					Mobile: {isMobile ? 'Yes' : 'No'} | Scrolled: {isScrolled ? 'Yes' : 'No'}
				</div>
			)}
		</nav>
	);
}
