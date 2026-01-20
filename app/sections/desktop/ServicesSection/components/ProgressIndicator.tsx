'use client';

import { motion } from 'framer-motion';
import { ProgressIndicatorProps } from '../types';

export const ProgressIndicator = ({ activeIndex, totalItems }: ProgressIndicatorProps) => {
	const progress = ((activeIndex + 1) / totalItems) * 100;

	return (
		<div className='w-full mb-4 bg-gray-200 h-1 rounded-full overflow-hidden'>
			<motion.div className='h-full bg-gradient-to-r from-[#70DFC6] to-[#d142e2]' initial={{ width: '0%' }} animate={{ width: `${progress}%` }} transition={{ duration: 0.3, ease: 'easeOut' }} />
		</div>
	);
};
