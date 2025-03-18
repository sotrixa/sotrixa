'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function ScrollGuide() {
	const [currentSection, setCurrentSection] = useState(0);
	const [maxSections, setMaxSections] = useState(0);
	const [isAtStart, setIsAtStart] = useState(true);

	useEffect(() => {
		// Find the container and sections
		const container = document.querySelector('.overflow-x-auto');
		const sections = document.querySelectorAll('section');

		// Set the maximum number of sections
		setMaxSections(sections.length);

		// Function to determine approximate current section and check if at start
		const updateScrollPosition = () => {
			if (container) {
				const scrollPosition = container.scrollLeft;
				const sectionWidth = window.innerWidth;
				const newIndex = Math.floor(scrollPosition / sectionWidth);

				setCurrentSection(newIndex);
				setIsAtStart(scrollPosition <= 10); // Consider "at start" if scrolled less than 10px
			}
		};

		// Listen for scroll events
		if (container) {
			container.addEventListener('scroll', updateScrollPosition);

			// Initial update
			updateScrollPosition();
		}

		return () => {
			if (container) {
				container.removeEventListener('scroll', updateScrollPosition);
			}
		};
	}, []);

	// Ultra fast scroll in the right direction
	const scrollRight = () => {
		const container = document.querySelector('.overflow-x-auto');
		if (container) {
			// Instant scroll - full screen width for maximum speed
			container.scrollLeft += window.innerWidth;
		}
	};

	// Ultra fast scroll in the left direction
	const scrollLeft = () => {
		const container = document.querySelector('.overflow-x-auto');
		if (container) {
			// Instant scroll - full screen width for maximum speed
			container.scrollLeft -= window.innerWidth;
		}
	};

	return (
		<>
			{/* Navigation buttons */}
			<div className='fixed z-50 bottom-10 right-10 flex gap-4'>
				<button
					onClick={scrollLeft}
					className={`p-3 rounded-full bg-white bg-opacity-30 backdrop-blur-md hover:bg-opacity-60 transition-all transform hover:scale-110 
            ${isAtStart ? 'opacity-30' : 'opacity-100'}`}
					disabled={isAtStart}
				>
					<svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
						<path d='M15 19L8 12L15 5' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
					</svg>
				</button>

				<button
					onClick={scrollRight}
					className={`p-3 rounded-full bg-white bg-opacity-30 backdrop-blur-md hover:bg-opacity-60 transition-all transform hover:scale-110
            ${currentSection >= maxSections - 1 ? 'opacity-30' : 'opacity-100'}`}
					disabled={currentSection >= maxSections - 1}
				>
					<svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
						<path d='M9 5L16 12L9 19' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
					</svg>
				</button>
			</div>

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
