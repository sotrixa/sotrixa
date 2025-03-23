'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';

type CaseStudyDetailProps = {
	study: {
		title: string;
		subtitle: string;
		image: string;
		description?: string;
		challenge?: string;
		solution?: string;
		results?: string;
	};
	onClose: () => void; // Keep this for functionality but don't use visibly
};

export default function CaseStudyDetail({ study, onClose }: CaseStudyDetailProps) {
	const detailRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!detailRef.current) return;

		const ctx = gsap.context(() => {
			// Animate the detail view in
			gsap.fromTo(detailRef.current, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'power3.out' });
		}, detailRef);

		return () => ctx.revert();
	}, [study]);

	// Hidden handler to allow keyboard navigation back
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Escape') {
			onClose();
		}
	};

	return (
		<div ref={detailRef} className='w-full min-h-screen bg-white relative' onKeyDown={handleKeyDown} tabIndex={0}>
			{/* Right side image positioned absolutely at top-right with zero margin/padding */}
			<div className='absolute -top-10 -mr-20 right-0 z-10'>
				<Image src={study.image} alt={study.title} width={500} height={350} className='object-cover' priority />
			</div>

			{/* Menu button in top right corner over the image */}
			<div className='absolute top-6 right-10 z-20'>
				<button className='text-black'>
					<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
						<line x1='3' y1='12' x2='21' y2='12'></line>
						<line x1='3' y1='6' x2='21' y2='6'></line>
						<line x1='3' y1='18' x2='21' y2='18'></line>
					</svg>
				</button>
			</div>

			{/* Main content grid */}
			<div className='grid grid-cols-1 lg:grid-cols-12 min-h-screen'>
				{/* Left sidebar */}
				<div className='lg:col-span-3 border-r border-gray-200 py-10 px-8 z-10 bg-white'>
					<div className='mb-12'>
						<Image src='/sotrixa-strategy.svg' alt='Sotrixa Strategy' width={120} height={80} />
					</div>

					<div className='space-y-5'>
						<div className='flex items-center'>
							<span className='text-black font-medium'>Research</span>
							<svg className='ml-2' xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
								<path d='M5 12h14'></path>
								<path d='M12 5l7 7-7 7'></path>
							</svg>
						</div>
						<div className='text-black font-medium'>Branding</div>
						<div className='text-black font-medium'>Bespoke Strategy</div>
						<div className='text-black font-medium'>Business Planning</div>
						<div className='text-black font-medium'>Marketing</div>
					</div>
				</div>

				{/* Middle content */}
				<div className='lg:col-span-5 pt-12 pl-10 pr-4 z-10 bg-white'>
					<h2 className='text-5xl font-bold text-black mb-8'>Sports Direct</h2>

					<p className='mb-8'>
						<span className='text-[#3ecca7] text-xl font-semibold'>Research</span>
						<span className='text-black text-xl'> is about people. Identifying and understanding your audience is in the lifeblood of what research should offer.</span>
					</p>

					<div className='detail-content space-y-6 text-black'>
						<p className='text-base'>Nullam scelerisque quam est. In convallis, odio enim. Nullam. Vestibulum elit, odio odio Nullam leo. Morbi quis quis non, maximus id non, urna, vel luctus urna.</p>

						<p className='text-base'>vitae varius non venenatis Quisque odio felis, ullamcorper leo, vitae urna cursus odio faucibus dignissim, placerat porta leo, lacus, tincidunt elementum ac</p>

						<p className='text-base'>Sed nec leo, sapien maximus Donec id tempor felis, ullamcorper sollicitudin, sed urna, orci vehicula, tempor dignissim, at placerat varius In nec est, lacus</p>
					</div>
				</div>

				{/* Empty column to ensure correct spacing */}
				<div className='lg:col-span-4'></div>
			</div>

			{/* Hidden button for programmatic navigation */}
			<button onClick={onClose} className='sr-only' aria-label='Return to case studies'>
				Back
			</button>
		</div>
	);
}
