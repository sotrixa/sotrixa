'use client';

import Image from 'next/image';
import Header from './header';

// Main Navigation Component
export default function Navigation() {
	return (
		<nav className='fixed top-0 left-0 w-full z-50'>
			<div className='px-20 py-4'>
				<div className='flex justify-between items-center'>
					{/* Logo */}
					<div>
						<Image src='/sotrixa-logo.webp' alt='Sotrixa Logo' width={120} height={40} />
					</div>
				</div>
			</div>

			{/* Sliding Stairs Menu */}
			<Header />
		</nav>
	);
}
