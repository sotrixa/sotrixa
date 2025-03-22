'use client';

import { motion } from 'framer-motion';
import { forwardRef } from 'react';

interface ServiceItemProps {
	service: string;
	index: number;
	activeIndex: number;
	onClick: () => void;
}

export const ServiceItem = forwardRef<HTMLDivElement, ServiceItemProps>(({ service, index, activeIndex, onClick }, ref) => {
	const isActive = index === activeIndex;
	const isCompleted = index < activeIndex;

	return (
		<motion.div
			ref={ref}
			className={`
          relative flex justify-end items-center cursor-pointer
          group transition-all duration-300 py-2 px-4
          ${isActive ? 'bg-white/50 backdrop-blur-sm shadow-md rounded-xl' : ''}
        `}
			initial={{ opacity: 0, x: 50 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ delay: 0.1 * index, duration: 0.5 }}
			onClick={onClick}
		>
			{/* Service number indicator */}
			<span
				className={`
            absolute left-0 opacity-30 text-sm font-mono
            ${isActive ? 'text-[#d142e2]' : 'text-gray-400'}
          `}
			>
				0{index + 1}
			</span>

			{/* Service text - styled directly rather than through GSAP */}
			<span
				style={{
					opacity: isCompleted || isActive ? 1 : 0.6,
					transform: isActive ? 'scale(1.3)' : 'scale(1)',
					color: isActive ? '#d142e2' : '#000000',
					fontWeight: isActive ? 800 : 700,
					transition: 'none', // This will be handled by GSAP
				}}
				className='text-2xl tracking-wide z-10'
			>
				{service}
			</span>

			{/* Active indicator dot */}
			{isActive && <motion.span className='absolute -right-3 w-2 h-2 rounded-full bg-[#d142e2]' initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.3 }} />}

			{/* Hover effect */}
			<span className='absolute inset-0 bg-gradient-to-r from-transparent to-[#d142e2]/5 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300' />
		</motion.div>
	);
});

// Add display name to fix the linter error
ServiceItem.displayName = 'ServiceItem';
