'use client';

import { motion } from 'framer-motion';
import { useEffect } from 'react';

export default function ScrollGuide() {
	useEffect(() => {
		// Find the container and sections
		const container = document.querySelector('.overflow-x-auto');

		// Listen for scroll events
		if (container) {
			// Initial set up only - no need to track scroll position anymore
		}

		return () => {
			// Clean up
		};
	}, []);

	return (
		<>
			{/* Navigation buttons removed as requested */}

			{/* Keyboard shortcut hint at bottom left */}
			<div className='fixed z-50 bottom-10 left-10'>
				<div className='bg-white bg-opacity-30 backdrop-blur-md px-4 py-2 rounded-full text-white'>
					Press <span className='font-bold'>?</span> for keyboard shortcuts
				</div>
			</div>

			{/* Instructions overlay - shown on first load */}
			<motion.div className='fixed inset-0 z-40 flex flex-col items-center justify-center bg-black bg-opacity-70 text-white' initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ delay: 3, duration: 1 }} style={{ pointerEvents: 'none' }}>
				<motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }}>
					<div className='text-center p-6 backdrop-blur-md bg-black bg-opacity-30 rounded-xl'>
						<h2 className='text-3xl font-bold mb-4'>Smooth Horizontal Scrolling</h2>
						<p className='mb-6 text-xl'>Scroll sideways to explore our content</p>

						<div className='flex justify-center gap-8 text-center'>
							<div className='flex flex-col items-center'>
								<svg width='40' height='40' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
									<path d='M19 12H5' stroke='white' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
									<path d='M12 19L5 12L12 5' stroke='white' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
								</svg>
								<span className='mt-2'>Scroll Left</span>
							</div>

							<div className='flex flex-col items-center'>
								<svg width='40' height='40' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
									<path d='M5 12H19' stroke='white' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
									<path d='M12 5L19 12L12 19' stroke='white' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
								</svg>
								<span className='mt-2'>Scroll Right</span>
							</div>
						</div>

						<p className='mt-6 text-sm opacity-70'>
							Tip: Press <span className='font-bold'>?</span> key for keyboard shortcuts
						</p>
					</div>
				</motion.div>
			</motion.div>
		</>
	);
}
