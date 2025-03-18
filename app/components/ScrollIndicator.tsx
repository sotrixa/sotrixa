'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function ScrollIndicator() {
	const [scrollProgress, setScrollProgress] = useState(0);
	const [showIndicator, setShowIndicator] = useState(true);

	useEffect(() => {
		const handleScroll = () => {
			// Find the scrollable container
			const container = document.querySelector('.overflow-x-auto');

			if (container) {
				// Calculate scroll progress for horizontal scrolling
				const totalWidth = container.scrollWidth - container.clientWidth;
				const progress = container.scrollLeft / totalWidth;
				setScrollProgress(progress || 0);

				// Hide indicator after scrolling starts
				if (container.scrollLeft > container.clientWidth * 0.1) {
					setShowIndicator(false);
				} else {
					setShowIndicator(true);
				}
			}
		};

		// Add scroll event listener to the container instead of window
		const container = document.querySelector('.overflow-x-auto');
		if (container) {
			container.addEventListener('scroll', handleScroll);

			// Set initial state
			handleScroll();
		}

		return () => {
			if (container) {
				container.removeEventListener('scroll', handleScroll);
			}
		};
	}, []);

	// Animation variants
	const indicatorVariants = {
		visible: { opacity: 1, x: 0 },
		hidden: { opacity: 0, x: 20 },
	};

	return (
		<>
			{/* Horizontal scroll progress indicator */}
			<div className='fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50'>
				<div className='w-64 h-1 bg-gray-700 rounded-full overflow-hidden'>
					<motion.div className='h-full bg-blue-500' style={{ width: `${scrollProgress * 100}%` }} />
				</div>
			</div>

			{/* Scroll arrow indicator */}
			<motion.div className='fixed right-8 bottom-8 z-50' variants={indicatorVariants} animate={showIndicator ? 'visible' : 'hidden'} transition={{ duration: 0.5 }}>
				<div className='flex items-center text-white bg-black bg-opacity-50 px-4 py-2 rounded-full'>
					<span className='mr-2'>Scroll</span>
					<motion.div animate={{ x: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
						<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
							<line x1='5' y1='12' x2='19' y2='12'></line>
							<polyline points='12 5 19 12 12 19'></polyline>
						</svg>
					</motion.div>
				</div>
			</motion.div>
		</>
	);
}
