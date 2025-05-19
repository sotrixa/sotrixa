'use client';

import { useEffect, useState } from 'react';
import ScrollToTopButton from '@/app/components/ScrollToTopButton';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Burger from '@/app/components/header/burger';
import Menu from '@/app/components/header/menu';
import Stairs from '@/app/components/header/stairs';
import { AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
	gsap.registerPlugin(ScrollTrigger);
}

// Define the props type directly
type Props = {
	children: React.ReactNode;
};

// Rename the component to avoid redeclaration issues
function MobileLayoutComponent({ children }: Props) {
	// Initialize as false to ensure transparency on first render
	const [isScrolled, setIsScrolled] = useState(false);
	const [menuIsOpen, setMenuIsOpen] = useState(false);

	// Force isScrolled to false when menu is open for consistent visuals
	useEffect(() => {
		if (menuIsOpen) {
			setIsScrolled(false);
		}
	}, [menuIsOpen]);

	useEffect(() => {
		const handleScroll = () => {
			// Only update scroll state when menu is closed
			if (!menuIsOpen) {
				setIsScrolled(window.scrollY > 50);
			}
		};

		// Set initial state - explicitly set to false to ensure transparency
		setIsScrolled(window.scrollY > 50);

		window.addEventListener('scroll', handleScroll);
		return () => {
			window.removeEventListener('scroll', handleScroll);
			// Clean up all ScrollTrigger instances when the component unmounts
			ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
		};
	}, [menuIsOpen]);

	// Prevent body scrolling when menu is open
	useEffect(() => {
		if (menuIsOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => {
			document.body.style.overflow = '';
		};
	}, [menuIsOpen]);

	return (
		<div className='w-full min-h-screen bg-white text-black overflow-x-hidden'>
			{/* Mobile header - transparent when menu is open or at top of page */}
			<header
				style={{
					backgroundColor: isScrolled && !menuIsOpen ? 'white' : 'transparent',
					boxShadow: isScrolled && !menuIsOpen ? '0 2px 4px rgba(0, 0, 0, 0.1)' : 'none',
					pointerEvents: 'none', // Allow clicks to pass through the header to content underneath
				}}
				className='fixed top-0 left-0 w-full h-[100px] md:h-[120px] z-50 transition-all duration-300'
			>
				{/* Inner container that ensures all elements are within the header background */}
				<div className='relative w-full h-full flex justify-between items-center px-4 md:px-8'>
					{/* Logo container with proper padding */}
					<div className='h-full flex items-center pointer-events-auto pt-4'>
						<Link href='/' className='z-50 pb-5'>
							<Image src='/sotrixa-logo.webp' alt='Sotrixa Logo' width={90} height={36} className='transition-all duration-300' style={{ filter: isScrolled && !menuIsOpen ? 'none' : 'brightness(0) invert(0)' }} priority />
						</Link>
					</div>

					{/* Burger menu with proper spacing - white icons regardless of scroll state */}
					<div className='h-full flex items-center justify-center pointer-events-auto pb-2'>
						<Burger openMenu={() => setMenuIsOpen(true)} isMenuOpen={menuIsOpen} isScrolled={false} />
					</div>
				</div>
			</header>

			{/* Menu components outside header for proper z-index stacking */}
			<AnimatePresence mode='wait'>
				{menuIsOpen && (
					<>
						<Stairs />
						<Menu closeMenu={() => setMenuIsOpen(false)} />
					</>
				)}
			</AnimatePresence>

			{/* Main content - starts from the top of the page */}
			<main className='w-full'>{children}</main>

			{/* Mobile footer */}
			<footer className='bg-black text-white py-8 px-4'>
				<div className='container mx-auto'>
					<div className='flex justify-between items-center flex-wrap'>
						<div className='mb-4 md:mb-0'>
							<Image src='/sotrixa-logo.webp' alt='Sotrixa Logo' width={100} height={33} />
						</div>
						<div className='flex space-x-4'>
							<a href='#' className='hover:text-teal-400 transition-colors'>
								FB
							</a>
							<a href='#' className='hover:text-teal-400 transition-colors'>
								IG
							</a>
							<a href='#' className='hover:text-teal-400 transition-colors'>
								IN
							</a>
							<a href='#' className='hover:text-teal-400 transition-colors'>
								BE
							</a>
						</div>
					</div>
					<div className='mt-6 text-sm text-gray-400'>© {new Date().getFullYear()} Sotrixa. All rights reserved.</div>
				</div>
			</footer>

			{/* Scroll to top button */}
			{isScrolled && <ScrollToTopButton />}
		</div>
	);
}

// Export the component with a different name to avoid conflicts
export default MobileLayoutComponent;
