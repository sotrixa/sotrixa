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
	activeService: string; // Add this to show the active service in the sidebar
	onClose: () => void; // Keep this for functionality but don't use visibly
};

export default function CaseStudyDetail({ study, activeService, onClose }: CaseStudyDetailProps) {
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
				<div className='lg:col-span-3 border-r border-gray-200 py-10 px-8 z-10 pt-60 bg-white'>
					<div className='space-y-5'>
						<div className={`flex items-center ${activeService === 'Research' ? 'font-bold' : 'font-medium'}`}>
							<span className='text-black'>Research</span>
							{activeService === 'Research' && (
								<svg className='ml-2' xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
									<path d='M5 12h14'></path>
									<path d='M12 5l7 7-7 7'></path>
								</svg>
							)}
						</div>
						<div className={`text-black ${activeService === 'Branding' ? 'font-bold' : 'font-medium'}`}>
							Branding
							{activeService === 'Branding' && (
								<svg className='ml-2 inline' xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
									<path d='M5 12h14'></path>
									<path d='M12 5l7 7-7 7'></path>
								</svg>
							)}
						</div>
						<div className={`text-black ${activeService === 'Bespoke Strategy' ? 'font-bold' : 'font-medium'}`}>
							Bespoke Strategy
							{activeService === 'Bespoke Strategy' && (
								<svg className='ml-2 inline' xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
									<path d='M5 12h14'></path>
									<path d='M12 5l7 7-7 7'></path>
								</svg>
							)}
						</div>
						<div className={`text-black ${activeService === 'Business Planning' ? 'font-bold' : 'font-medium'}`}>
							Business Planning
							{activeService === 'Business Planning' && (
								<svg className='ml-2 inline' xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
									<path d='M5 12h14'></path>
									<path d='M12 5l7 7-7 7'></path>
								</svg>
							)}
						</div>
						<div className={`text-black ${activeService === 'Marketing' ? 'font-bold' : 'font-medium'}`}>
							Marketing
							{activeService === 'Marketing' && (
								<svg className='ml-2 inline' xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
									<path d='M5 12h14'></path>
									<path d='M12 5l7 7-7 7'></path>
								</svg>
							)}
						</div>
					</div>
				</div>

				{/* Middle content - now with fixed height and scrollable */}
				<div className='lg:col-span-5 pt-30 pl-10 pr-4 z-10 bg-white h-screen overflow-y-auto'>
					{/* Simple black text back link */}
					<a
						href='#'
						onClick={(e) => {
							e.preventDefault();
							onClose();
						}}
						className='block mb-8 text-black font-medium hover:text-gray-700 transition-colors'
					>
						<span className='flex items-center'>
							<svg className='mr-2' xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
								<path d='M19 12H5'></path>
								<path d='M12 19l-7-7 7-7'></path>
							</svg>
							RETURN TO CASE STUDIES
						</span>
					</a>

					<h2 className='text-5xl font-bold text-black mb-8'>{study.title}</h2>

					<p className='mb-8'>
						<span className='text-[#3ecca7] text-xl font-semibold'>{activeService}</span>
						<span className='text-black text-xl'> is about people. Identifying and understanding your audience is in the lifeblood of what research should offer.</span>
					</p>

					<div className='detail-content space-y-6 text-black'>
						{study.description && <p className='text-base'>{study.description}</p>}

						{study.challenge && <p className='text-base'>{study.challenge}</p>}

						{study.solution && <p className='text-base'>{study.solution}</p>}

						{study.results && <p className='text-base'>{study.results}</p>}
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
