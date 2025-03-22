'use client';

import React from 'react';

export default function ScrollNavigation() {
	return (
		<>
			{/* Scroll progress indicator */}
			<div className='fixed top-0 left-0 w-full h-1 bg-gray-800 z-50'>
				<div className='scroll-progress-bar h-full bg-white'></div>
			</div>

			{/* Navigation arrows - Removed as requested */}
		</>
	);
}
