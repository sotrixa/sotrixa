'use client';

import React from 'react';

interface SectionProps {
	children: React.ReactNode;
	className?: string;
	id?: string;
}

export default function Section({ children, className = '', id }: SectionProps) {
	// Check if device is mobile using standard breakpoint
	const isMobile = typeof window !== 'undefined' && (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 1024);

	return (
		<section
			id={id}
			className={`min-h-screen w-screen flex-shrink-0 flex items-center justify-center p-0 ${className}`}
			style={{
				width: '100vw',
				scrollSnapAlign: 'start',
				// Only hide overflow on desktop, allow scrolling on mobile
				overflowY: isMobile ? 'visible' : 'hidden',
			}}
		>
			<div className='w-full'>{children}</div>
		</section>
	);
}
