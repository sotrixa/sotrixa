'use client';

import Image from 'next/image';
import Link from 'next/link';
import Header from '../header';
import { useState, useEffect, CSSProperties } from 'react';
import { usePathname } from 'next/navigation';

// Main Navigation Component
export default function Navigation() {
	const [isMobile, setIsMobile] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);
	const pathname = usePathname();

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth <= 768);
		};

		const handleScroll = () => {
			const scrolled = window.scrollY > 0;
			setIsScrolled(scrolled);
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

	// Determine the logo link based on current page
	const getLogoHref = () => {
		// If we're on the home page, scroll to home section
		if (pathname === '/') {
			return '#home';
		}
		// If we're on any other page, navigate back to home page
		return '/';
	};

	return (
		<nav style={navStyle}>
			<div className={`${isMobile ? 'px-4 py-3' : 'px-8 py-4'} transition-all duration-300`}>
				<div className='flex justify-between items-center'>
					{/* Logo */}
					<Link href={getLogoHref()} className='transition-transform duration-300 hover:scale-105'>
						<Image 
							src='/sotrixa-logo.webp' 
							alt='Sotrixa Logo' 
							width={isMobile ? 20 : 120} 
							height={isMobile ? 20 : 100} 
							className='transition-all duration-300' 
							style={{ width: "auto", height: isMobile ? "20px" : "100px" }}
							priority
						/>
					</Link>
					
					{/* Mobile Menu - only show on mobile and position it within the white container */}
					{isMobile && (
						<div className='relative'>
							<Header />
						</div>
					)}
				</div>
			</div>

			{/* Desktop Sliding Stairs Menu - only show on desktop */}
			{!isMobile && <Header />}
		</nav>
	);
}
