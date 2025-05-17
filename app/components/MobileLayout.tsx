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
	const [isScrolled, setIsScrolled] = useState(false);
	const [menuIsOpen, setMenuIsOpen] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 100);
		};

		window.addEventListener('scroll', handleScroll);
		return () => {
			window.removeEventListener('scroll', handleScroll);
			// Clean up all ScrollTrigger instances when the component unmounts
			ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
		};
	}, []);

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
			{/* Mobile header using desktop header components - positioned absolutely to match desktop */}
			<header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300`}>
				<div className='relative w-full'>
					{/* Logo */}
					<Link href='/' className='absolute top-4 left-4 z-50'>
						<Image src='/sotrixa-logo.webp' alt='Sotrixa Logo' width={100} height={33} className='transition-all duration-300' priority />
					</Link>

					{/* Burger menu - absolute positioned to match desktop */}
					<div className='absolute top-0 right-0 z-50'>
						<Burger openMenu={() => setMenuIsOpen(true)} isMenuOpen={menuIsOpen} />
					</div>

					{/* Menu overlay */}
					<AnimatePresence mode='wait'>
						{menuIsOpen && (
							<>
								<Stairs />
								<Menu isMobile={true} closeMenu={() => setMenuIsOpen(false)} />
							</>
						)}
					</AnimatePresence>
				</div>
			</header>

			{/* Main content */}
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
