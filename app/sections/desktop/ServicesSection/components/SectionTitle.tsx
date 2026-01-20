'use client';

import { motion } from 'framer-motion';

interface SectionTitleProps {
	text: string;
}

export const SectionTitle = ({ text }: SectionTitleProps) => {
	return (
		<motion.h1 className='font-bold text-2xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#70DFC6] via-[#d142e2] to-[#f4dd65] w-full text-center' initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }}>
			{text}
		</motion.h1>
	);
};
