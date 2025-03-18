'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function Navigation() {
	const [isOpen, setIsOpen] = useState(false);

	const toggleMenu = () => {
		setIsOpen(!isOpen);
	};

	return (
		<nav className='fixed top-0 left-0 w-full z-50  bg-opacity-70  text-white'>
			<div className='container mx-auto px-6 py-4'>
				<div className='flex justify-between items-center'>
					{/* Logo */}
					<div>
						<Image src='/sotrixa-logo.webp' alt='Sotrixa Logo' width={120} height={40} />
					</div>

					{/* Menu toggle button - only shown when menu is closed */}
					{!isOpen && (
						<button className='flex items-center gap-4 z-50 relative' onClick={toggleMenu} aria-label='Open menu'>
							<span className='font-serif text-black text-lg'>Main Menu</span>
							<Image src='/menu-open.svg' alt='Open menu' width={32} height={32} className='cursor-pointer' />
						</button>
					)}
				</div>
			</div>

			{/* Side panel mobile menu */}
			<AnimatePresence>
				{isOpen && (
					<>
						{/* Background overlay */}
						<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='fixed inset-0  bg-opacity-40 z-30' onClick={toggleMenu} />

						{/* Menu panel */}
						<motion.div initial={{ opacity: 0, y: '-100%' }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: '-100%' }} transition={{ type: 'tween', duration: 0.3 }} className='fixed top-0 left-0 right-0 h-screen w-full bg-white z-40 flex flex-col text-black shadow-xl md:w-3/12 md:right-0 md:left-auto'>
							{/* Header with title and close button */}
							<div className='flex gap-4 items-right justify-end px-8 pt-8 pb-6 border-b border-gray-100'>
								<h2 className='text-2xl font-bold'>Main Menu</h2>
								<button onClick={toggleMenu} aria-label='Close menu'>
									<Image src='/menu-close.svg' alt='Close menu' width={32} height={32} className='cursor-pointer' />
								</button>
							</div>

							{/* Menu content */}
							<div className='flex flex-col px-8  space-y-6 text-xl font-medium mt-8'>
								<a href='#about' className='hover:text-blue-600 transition-colors text-left ml-62' onClick={toggleMenu}>
									About Us
								</a>

								<a href='#services' className='hover:text-blue-600 transition-colors text-left ml-62' onClick={toggleMenu}>
									Services
								</a>

								<a href='#case-studies' className='hover:text-blue-600 transition-colors text-left ml-62' onClick={toggleMenu}>
									Case Studies
								</a>

								<div className='mt-2 flex justify-end w-full'>
									<a href='#contact' onClick={toggleMenu} className='px-8 py-3 bg-yellow-300 rounded-full text-black font-serif shadow-md hover:bg-yellow-400 transition-colors'>
										Get In touch with us
									</a>
								</div>
							</div>

							{/* Social icons */}
							<div className='absolute bottom-8 left-72 flex space-x-4'>
								<a href='https://instagram.com' target='_blank' rel='noopener noreferrer' aria-label='Instagram'>
									<svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
										<path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.981C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' fill='currentColor' />
									</svg>
								</a>
								<a href='https://facebook.com' target='_blank' rel='noopener noreferrer' aria-label='Facebook'>
									<svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
										<path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' fill='currentColor' />
									</svg>
								</a>
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</nav>
	);
}
