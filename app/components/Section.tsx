'use client';

import { ReactNode } from 'react';

interface SectionProps {
	children: ReactNode;
	className?: string;
	id: string;
}

export default function Section({ children, className = '', id }: SectionProps) {
	return (
		<section
			id={id}
			className={`min-h-screen w-screen flex-shrink-0 flex items-center justify-center p-0 ${className}`}
			style={{
				width: '100vw',
				scrollSnapAlign: 'start',
				overflowY: 'hidden',
			}}
		>
			<div className='w-full'>{children}</div>
		</section>
	);
}
