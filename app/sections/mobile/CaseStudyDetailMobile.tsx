'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';

type CaseStudy = {
	title: string;
	subtitle: string;
	image: string;
	description?: string;
	challenge?: string;
	solution?: string;
	results?: string;
};

type CaseStudyDetailMobileProps = {
	study: CaseStudy;
	caseStudies: Record<string, CaseStudy[]>;
	onClose: () => void;
};

export default function CaseStudyDetailMobile({ study, onClose }: CaseStudyDetailMobileProps) {
	const detailRef = useRef<HTMLDivElement>(null);
	const titleRef = useRef<HTMLHeadingElement>(null);
	const imageRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);

	// Animation on mount
	useEffect(() => {
		if (!detailRef.current) return;

		const ctx = gsap.context(() => {
			const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

			// Set initial states
			gsap.set([titleRef.current, imageRef.current, contentRef.current], {
				opacity: 0,
				y: 30,
			});

			// Animate elements in
			tl.to(titleRef.current, {
				opacity: 1,
				y: 0,
				duration: 0.6,
			});

			tl.to(
				imageRef.current,
				{
					opacity: 1,
					y: 0,
					duration: 0.6,
				},
				'-=0.4'
			);

			tl.to(
				contentRef.current,
				{
					opacity: 1,
					y: 0,
					duration: 0.8,
				},
				'-=0.4'
			);
		}, detailRef);

		return () => ctx.revert();
	}, [study]);

	// Handle close with animation
	const handleClose = () => {
		if (!detailRef.current) {
			onClose();
			return;
		}

		const tl = gsap.timeline({
			onComplete: onClose,
		});

		tl.to([titleRef.current, imageRef.current, contentRef.current], {
			opacity: 0,
			y: -20,
			duration: 0.3,
			stagger: 0.05,
			ease: 'power2.in',
		});
	};

	return (
		<div ref={detailRef} className='fixed inset-0 bg-white z-50 overflow-y-auto'>
			<div className='min-h-screen p-4 pb-8'>
				{/* Header with close button */}
				<div className='flex justify-between items-center mb-6 sticky top-0 bg-white pb-4'>
					<button
						onClick={handleClose}
						className='w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 transition-colors'
						aria-label='Close case study'
					>
						<svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
							<path d='M18 6L6 18M6 6l12 12' />
						</svg>
					</button>
				</div>

				{/* Title */}
				<div ref={titleRef} className='mb-6'>
					<h1 className='text-2xl sm:text-3xl font-black text-black mb-3' style={{ lineHeight: 1 }}>{study.title}</h1>
					<p className='text-base sm:text-lg text-gray-600'>{study.subtitle}</p>
				</div>

				{/* Main Image */}
				<div ref={imageRef} className='mb-8'>
					<div className='relative w-full h-[300px] sm:h-[400px] rounded-lg overflow-hidden shadow-lg'>
						<Image
							src={study.image}
							alt={study.title}
							fill
							className='object-cover'
							priority
						/>
					</div>
				</div>

				{/* Content Sections */}
				<div ref={contentRef} className='space-y-8 pb-20'>
					{/* Description */}
					{study.description && (
						<div>
							<h2 className='text-lg sm:text-xl font-bold text-black mb-4' style={{ lineHeight: 1 }}>Overview</h2>
							<p className='text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line'>
								{study.description}
							</p>
						</div>
					)}

					{/* Challenge */}
					{study.challenge && (
						<div>
							<h2 className='text-lg sm:text-xl font-bold text-black mb-4' style={{ lineHeight: 1 }}>Challenge</h2>
							<p className='text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line'>
								{study.challenge}
							</p>
						</div>
					)}

					{/* Solution */}
					{study.solution && (
						<div>
							<h2 className='text-lg sm:text-xl font-bold text-black mb-4' style={{ lineHeight: 1 }}>Solution</h2>
							<p className='text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line'>
								{study.solution}
							</p>
						</div>
					)}

					{/* Results */}
					{study.results && (
						<div>
							<h2 className='text-lg sm:text-xl font-bold text-black mb-4' style={{ lineHeight: 1 }}>Results</h2>
							<p className='text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line'>
								{study.results}
							</p>
						</div>
					)}
				</div>

				{/* Bottom spacing */}
				<div className='h-8'></div>
			</div>
		</div>
	);
}