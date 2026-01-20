'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MobileMenu() {
	const [isOpen, setIsOpen] = useState(false);

	const toggleMenu = () => {
		setIsOpen(!isOpen);
	};

	return (
		<>
			<button className='md:hidden flex flex-col justify-center items-center w-10 h-10 space-y-1.5 z-50' onClick={toggleMenu} aria-label='Toggle menu'>
				<motion.span animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }} className='w-6 h-0.5 bg-white block' />
				<motion.span animate={isOpen ? { opacity: 0 } : { opacity: 1 }} className='w-6 h-0.5 bg-white block' />
				<motion.span animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }} className='w-6 h-0.5 bg-white block' />
			</button>

			<AnimatePresence>
				{isOpen && (
					<motion.div initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '100%' }} transition={{ type: 'tween', duration: 0.3 }} className='fixed inset-0 bg-black bg-opacity-90 z-40 md:hidden'>
						<div className='flex flex-col items-center justify-center h-full space-y-8 text-xl'>
							<a href='#home' className='text-white hover:text-blue-400 transition-colors' onClick={toggleMenu}>
								Home
							</a>
							<a href='#intro' className='text-white hover:text-blue-400 transition-colors' onClick={toggleMenu}>
								Intro
							</a>
							<a href='#services' className='text-white hover:text-blue-400 transition-colors' onClick={toggleMenu}>
								Services
							</a>
							<a href='#about' className='text-white hover:text-blue-400 transition-colors' onClick={toggleMenu}>
								About
							</a>
							<a href='#contact' className='text-white hover:text-blue-400 transition-colors' onClick={toggleMenu}>
								Contact
							</a>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}
