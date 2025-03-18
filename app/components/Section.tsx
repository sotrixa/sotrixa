'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface SectionProps {
	children: ReactNode;
	className?: string;
	id: string;
}

export default function Section({ children, className = '', id }: SectionProps) {
	return (
		<motion.section id={id} className={`min-h-screen w-screen flex-shrink-0 flex items-center justify-center p-0 ${className}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} viewport={{ once: false, amount: 0.5 }}>
			<div className='w-full'>{children}</div>
		</motion.section>
	);
}
