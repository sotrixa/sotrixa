'use client';

import { NavigationDotsProps } from '../types';

export const NavigationDots = ({ items, activeIndex, onDotClick }: NavigationDotsProps) => {
	return (
		<div className='flex justify-center gap-2 w-full mt-6'>
			{items.map((_, index) => (
				<button key={`dot-${index}`} className={`w-2 h-2 rounded-full transition-all duration-300 ${index === activeIndex ? 'bg-[#d142e2] w-4' : 'bg-gray-300'}`} onClick={() => onDotClick(index)} aria-label={`Go to service ${index + 1}`} />
			))}
		</div>
	);
};
