'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
	gsap.registerPlugin(ScrollTrigger);
}

type CaseStudy = {
	title: string;
	subtitle: string;
	image: string;
	description?: string;
	challenge?: string;
	solution?: string;
	results?: string;
};

type CaseStudyDetailProps = {
	study: CaseStudy;
	activeService: string;
	caseStudies: Record<string, CaseStudy[]>;
	onClose: () => void;
};

export default function CaseStudyDetail({ study, activeService, caseStudies, onClose }: CaseStudyDetailProps) {
	const detailRef = useRef<HTMLDivElement>(null);
	const titleRef = useRef<HTMLHeadingElement>(null);
	const imageRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);
	const navRef = useRef<HTMLDivElement>(null);
	const [currentStudy, setCurrentStudy] = useState(study);
	const [isAnimating, setIsAnimating] = useState(false);

	// Update current study when prop changes
	useEffect(() => {
		setCurrentStudy(study);
	}, [study]);

	// Update current study when activeService changes
	useEffect(() => {
		if (caseStudies && caseStudies[activeService] && caseStudies[activeService].length > 0) {
			const firstStudy = caseStudies[activeService][0];
			setCurrentStudy(firstStudy);

			// Force content to be visible in case animations failed
			if (contentRef.current) {
				contentRef.current.style.opacity = '1';
				contentRef.current.style.transform = 'translateY(0)';
			}
		}
	}, [activeService, caseStudies]);

	// Transition to next case study with animation
	const goToNextCaseStudy = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		if (isAnimating) return;

		// If no case studies available, do nothing
		if (!caseStudies) {
			return;
		}

		// Create a flat array of all case studies with their service info
		const allCaseStudies: Array<{ study: CaseStudy; service: string }> = [];
		Object.keys(caseStudies).forEach((service) => {
			caseStudies[service].forEach((study) => {
				allCaseStudies.push({ study, service });
			});
		});

		if (allCaseStudies.length === 0) {
			return;
		}

		setIsAnimating(true);

		// Find current study in the flat array
		const currentIndex = allCaseStudies.findIndex((item) => item.study.title === currentStudy.title && item.service === activeService);

		// Get next study (cycle back to 0 if at the end)
		const nextIndex = currentIndex < allCaseStudies.length - 1 ? currentIndex + 1 : 0;

		const nextItem = allCaseStudies[nextIndex];

		// Update both the study and service if needed
		setCurrentStudy(nextItem.study);

		setIsAnimating(false);
	};

	// Handle initial animation on mount
	useEffect(() => {
		if (!detailRef.current) return;

		const ctx = gsap.context(() => {
			// Create main timeline
			const tl = gsap.timeline();

			// Animate the whole container in
			tl.fromTo(detailRef.current, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'power2.out' });

			// Animate image with a reveal effect
			if (imageRef.current) {
				tl.fromTo(imageRef.current, { x: 100, opacity: 0, scale: 0.9 }, { x: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' }, '-=0.5');
			}

			// Animate navigation
			if (navRef.current) {
				tl.fromTo(navRef.current, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.6');
			}

			// Animate title with a reveal effect
			if (titleRef.current) {
				tl.fromTo(titleRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' }, '-=0.7');
			}

			// Animate content paragraphs
			if (contentRef.current && contentRef.current.children) {
				const children = Array.from(contentRef.current.children);
				tl.fromTo(children, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' }, '-=0.5');
			}
		}, detailRef);

		return () => ctx.revert();
	}, []);

	// Animate content when current study changes
	useEffect(() => {
		if (!contentRef.current || !imageRef.current || !titleRef.current) return;

		// First ensure visibility before starting animations
		if (contentRef.current) {
			contentRef.current.style.display = 'block';
		}

		const ctx = gsap.context(() => {
			// Create a timeline for content transition
			const tl = gsap.timeline({
				onComplete: () => {
					// Force content to be visible after animation completes
					if (contentRef.current) {
						contentRef.current.style.opacity = '1';
						contentRef.current.style.transform = 'translateY(0)';
					}
				},
			});

			// Animate image
			tl.fromTo(imageRef.current, { x: 50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, ease: 'power2.out' }, 0);

			// Animate title
			tl.fromTo(titleRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }, 0.2);

			// Animate content with stagger
			if (contentRef.current && contentRef.current.children) {
				const children = Array.from(contentRef.current.children);
				tl.fromTo(children, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out' }, 0.3);
			}
		}, detailRef);

		return () => ctx.revert();
	}, [currentStudy]);

	// Hidden handler to allow keyboard navigation back
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Escape') {
			onClose();
		}
	};

	return (
		<div ref={detailRef} className='w-full min-h-screen bg-white relative mt-30' onKeyDown={handleKeyDown} tabIndex={0}>
			{/* 2-column grid layout */}
			<div className='grid grid-cols-12 gap-8 min-h-screen'>
				{/* Left column - Content (8 columns) */}
				<div className='col-span-8 ml-50 px-8'>
					{/* Content container */}
					<div className='pt-20 z-10 bg-white h-[calc(100vh-200px)] overflow-y-auto max-w-full'>
						{/* Navigation row with both buttons */}
						<div ref={navRef} className='flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-8 relative z-20 max-w-full'>
							{/* Back button */}
							<button onClick={onClose} className='text-gray-800 font-bold hover:text-[#3ecca7] transition-all duration-300 hover:-translate-x-1 group flex items-center flex-shrink-0'>
								<span className='flex items-center'>
									<svg className='mr-2 transition-transform duration-300 group-hover:-translate-x-1' xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
										<path d='M19 12H5'></path>
										<path d='M12 19l-7-7 7-7'></path>
									</svg>
									RETURN TO CASE STUDIES
								</span>
							</button>

							{/* Next case study button - always visible */}
							<button onClick={goToNextCaseStudy} className='text-black font-medium hover:text-gray-700 transition-all duration-300 hover:translate-x-1 group flex items-center flex-shrink-0'>
								<span className='flex items-center'>
									SEE NEXT CASE STUDY
									<svg className='ml-2 transition-transform duration-300 group-hover:translate-x-1' xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
										<path d='M5 12h14'></path>
										<path d='M12 5l7 7-7 7'></path>
									</svg>
								</span>
							</button>
						</div>

						<h2 ref={titleRef} className='text-5xl sm:text-6xl lg:text-7xl font-bold text-black mb-8 leading-tight max-w-full break-words'>
							{currentStudy.title}
						</h2>

						<div ref={contentRef} className='space-y-8 pb-16 max-w-full'>
							<div className='detail-content space-y-12 max-w-full'>
								{currentStudy.subtitle && (
									<div className='mb-8 max-w-full'>
										<h3 className='text-xl font-medium text-gray-900 mb-4 break-words'>Overview</h3>
										<p className='text-base text-gray-700 leading-relaxed break-words'>{currentStudy.subtitle}</p>
									</div>
								)}

								{currentStudy.description && (
									<div className='mb-8 max-w-full'>
										<h3 className='text-xl font-medium text-gray-900 mb-4 break-words'>Description</h3>
										<p className='text-base text-gray-700 leading-relaxed break-words'>{currentStudy.description}</p>
									</div>
								)}

								{currentStudy.challenge && (
									<div className='mb-8 max-w-full'>
										<h3 className='text-xl font-medium text-gray-900 mb-4 break-words'>Challenge</h3>
										<p className='text-base text-gray-700 leading-relaxed break-words'>{currentStudy.challenge}</p>
									</div>
								)}

								{currentStudy.solution && (
									<div className='mb-8 max-w-full'>
										<h3 className='text-xl font-medium text-gray-900 mb-4 break-words'>Solution</h3>
										<div className='text-base text-gray-700 leading-relaxed whitespace-pre-line break-words max-w-full'>{currentStudy.solution}</div>
									</div>
								)}

								{currentStudy.results && (
									<div className='mb-8 max-w-full'>
										<h3 className='text-xl font-medium text-gray-900 mb-4 break-words'>Results</h3>
										<p className='text-base text-gray-700 leading-relaxed break-words'>{currentStudy.results}</p>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>

				{/* Right column - Image (4 columns) */}
				<div className='col-span-4 flex items-start justify-center pt-10'>
					<div ref={imageRef} className='w-full max-w-[500px] sticky top-10'>
						<Image src={currentStudy.image} alt={currentStudy.title} width={500} height={350} className='object-cover w-full h-auto' priority />
					</div>
				</div>
			</div>

			{/* Hidden button for programmatic navigation */}
			<button onClick={onClose} className='sr-only' aria-label='Return to case studies'>
				Back
			</button>
		</div>
	);
}
