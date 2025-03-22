'use client';

import React from 'react';

interface ScrollNavigationProps {
	prevPanel: () => void;
	nextPanel: () => void;
}

export default function ScrollNavigation({ prevPanel, nextPanel }: ScrollNavigationProps) {
	return (
		<>
			{/* Scroll progress indicator */}
			<div className='fixed top-0 left-0 w-full h-1 bg-gray-800 z-50'>
				<div className='scroll-progress-bar h-full bg-white'></div>
			</div>

			{/* Navigation arrows */}
			<button
				onClick={prevPanel}
				className='fixed left-6 top-1/2 transform -translate-y-1/2 z-50 w-12 h-12 rounded-full 
                  bg-white bg-opacity-10 backdrop-blur-md flex items-center justify-center 
                  text-white transition-all duration-300 hover:bg-opacity-30'
				aria-label='Previous section'
			>
				<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
					<polyline points='15 18 9 12 15 6'></polyline>
				</svg>
			</button>

			<button
				onClick={nextPanel}
				className='fixed right-6 top-1/2 transform -translate-y-1/2 z-50 w-12 h-12 rounded-full 
                  bg-white bg-opacity-10 backdrop-blur-md flex items-center justify-center 
                  text-white transition-all duration-300 hover:bg-opacity-30'
				aria-label='Next section'
			>
				<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
					<polyline points='9 18 15 12 9 6'></polyline>
				</svg>
			</button>
		</>
	);
}
