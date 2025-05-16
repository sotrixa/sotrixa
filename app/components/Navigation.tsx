'use client';

import Image from 'next/image';
import Header from './header';
import { useState, useEffect } from 'react';

// Main Navigation Component
export default function Navigation() {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth <= 768);
		};

		// Set initial value
		handleResize();

		// Add event listener
		window.addEventListener('resize', handleResize);

		// Cleanup
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return (
		<nav className='fixed top-0 left-0 w-full z-50'>
			<div className={`${isMobile ? 'px-4 py-3' : 'px-20 py-4'} transition-all duration-300`}>
				<div className='flex justify-between items-center'>
					{/* Logo */}
					<div>
						<Image src='/sotrixa-logo.webp' alt='Sotrixa Logo' width={isMobile ? 100 : 120} height={isMobile ? 33 : 40} className='transition-all duration-300' />
					</div>
				</div>
			</div>

			{/* Sliding Stairs Menu */}
			<Header />
		</nav>
	);
}
