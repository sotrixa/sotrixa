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

type CaseStudyDetailMobileProps = {
	study: CaseStudy;
	activeService: string;
	caseStudies: Record<string, CaseStudy[]>;
	onClose: () => void;
	onServiceChange?: (service: string) => void;
};

export default function CaseStudyDetailMobile({ study, activeService, caseStudies, onClose, onServiceChange }: CaseStudyDetailMobileProps) {
	const detailRef = useRef<HTMLDivElement>(null);
	const titleRef = useRef<HTMLHeadingElement>(null);
	const imageRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);
	const servicesRef = useRef<HTMLDivElement>(null);
	const [currentStudy, setCurrentStudy] = useState(study);
	const [isAnimating, setIsAnimating] = useState(false);
	const [isServicesOpen, setIsServicesOpen] = useState(false);

	// Get the title of the next case study for navigation
	const getNextCaseStudyTitle = () => {
		if (!caseStudies || !caseStudies[activeService] || caseStudies[activeService].length <= 1) {
			return '';
		}

		const currentIndex = caseStudies[activeService].findIndex((study) => study.title === currentStudy.title);
		const nextIndex = currentIndex < caseStudies[activeService].length - 1 ? currentIndex + 1 : 0;
		return caseStudies[activeService][nextIndex].title;
	};

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

	// Toggle services dropdown
	const toggleServices = () => {
		setIsServicesOpen(!isServicesOpen);
	};

	// Handle service click with animations
	const handleServiceClick = (service: string) => {
		if (service === activeService || isAnimating) return;

		setIsAnimating(true);
		setIsServicesOpen(false);

		// Animate content out
		const tl = gsap.timeline({
			onComplete: () => {
				if (onServiceChange) {
					onServiceChange(service);
				} else {
					if (caseStudies && caseStudies[service] && caseStudies[service].length > 0) {
						const newStudy = caseStudies[service][0];
						setCurrentStudy(newStudy);
					}
				}

				// Set a slightly longer timeout to ensure animations complete
				setTimeout(() => {
					setIsAnimating(false);

					// Force visibility after animation
					if (contentRef.current) {
						contentRef.current.style.opacity = '1';
						contentRef.current.style.transform = 'translateY(0)';
					}
				}, 500);
			},
		});

		if (contentRef.current) {
			tl.to(
				contentRef.current,
				{
					opacity: 0,
					y: 30,
					duration: 0.4,
					ease: 'power2.out',
				},
				0
			);
		}

		if (imageRef.current) {
			tl.to(
				imageRef.current,
				{
					opacity: 0,
					y: 30,
					duration: 0.4,
					ease: 'power2.out',
				},
				0
			);
		}
	};

	// Transition to next case study with animation
	const goToNextCaseStudy = (e: React.MouseEvent<HTMLAnchorElement>) => {
		e.preventDefault();
		if (isAnimating) return;

		setIsAnimating(true);

		const currentIndex = caseStudies[activeService].findIndex((study) => study.title === currentStudy.title);
		const nextIndex = currentIndex < caseStudies[activeService].length - 1 ? currentIndex + 1 : 0;
		const nextStudy = caseStudies[activeService][nextIndex];

		// Animate out current content
		const tl = gsap.timeline({
			onComplete: () => {
				setCurrentStudy(nextStudy);

				// Set a slightly longer timeout to ensure animations complete
				setTimeout(() => {
					setIsAnimating(false);

					// Force visibility after animation
					if (contentRef.current) {
						contentRef.current.style.opacity = '1';
						contentRef.current.style.transform = 'translateY(0)';
					}
				}, 500);
			},
		});

		if (contentRef.current) {
			tl.to(
				contentRef.current,
				{
					opacity: 0,
					y: 30,
					duration: 0.4,
					ease: 'power2.out',
				},
				0
			);
		}

		if (imageRef.current) {
			tl.to(
				imageRef.current,
				{
					opacity: 0,
					y: 30,
					duration: 0.4,
					ease: 'power2.out',
				},
				0
			);
		}
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
				tl.fromTo(imageRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' }, '-=0.3');
			}

			// Animate title with a reveal effect
			if (titleRef.current) {
				tl.fromTo(titleRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.5)' }, '-=0.5');
			}

			// Animate content paragraphs
			if (contentRef.current && contentRef.current.children) {
				const children = Array.from(contentRef.current.children);
				tl.fromTo(children, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' }, '-=0.3');
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
			tl.fromTo(imageRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' }, 0);

			// Animate title
			tl.fromTo(titleRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.5)' }, 0.2);

			// Animate content with stagger
			if (contentRef.current && contentRef.current.children) {
				const children = Array.from(contentRef.current.children);
				tl.fromTo(children, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out' }, 0.3);
			}
		}, detailRef);

		return () => ctx.revert();
	}, [currentStudy]);

	// Prevent body scrolling when services dropdown is open
	useEffect(() => {
		if (isServicesOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => {
			document.body.style.overflow = '';
		};
	}, [isServicesOpen]);

	return (
		<div ref={detailRef} className='w-full min-h-screen bg-white relative overflow-x-hidden'>
			{/* Top navigation bar */}
			<div className='sticky top-0 z-30 bg-white px-4 py-4 flex justify-between items-center border-b border-gray-100 shadow-sm'>
				<a
					href='#'
					onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
						e.preventDefault();
						onClose();
					}}
					className='text-black font-medium text-sm'
				>
					<span className='flex items-center'>
						<svg className='mr-2' xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
							<path d='M19 12H5'></path>
							<path d='M12 19l-7-7 7-7'></path>
						</svg>
						BACK
					</span>
				</a>

				<button onClick={toggleServices} className='text-black flex items-center text-sm font-medium'>
					{activeService}
					<svg className={`ml-2 transition-transform duration-300 ${isServicesOpen ? 'rotate-180' : ''}`} xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
						<path d='M6 9l6 6 6-6'></path>
					</svg>
				</button>
			</div>

			{/* Services dropdown (absolute positioned) */}
			{isServicesOpen && (
				<div ref={servicesRef} className='fixed inset-0 z-20 bg-white pt-16 px-4 pb-4 overflow-y-auto'>
					<div className='space-y-6 pt-4'>
						{Object.keys(caseStudies || {}).map((service) => (
							<div
								key={service}
								className={`cursor-pointer transform transition-all duration-300 py-2 border-b border-gray-100
									${activeService === service ? 'text-black font-bold text-2xl' : 'text-gray-500 text-xl'}`}
								onClick={() => handleServiceClick(service)}
							>
								{service}
								{activeService === service && <span className='absolute left-0 w-2 h-full bg-gradient-to-b from-[#f4dd65] via-[#d142e2] to-[#70DFC6] rounded-r-full'></span>}
							</div>
						))}
					</div>
				</div>
			)}

			{/* Main content container */}
			<div className='px-4 pt-4 pb-16'>
				{/* Featured image */}
				<div ref={imageRef} className='w-full h-48 relative mb-6 rounded-lg overflow-hidden'>
					<Image src={currentStudy.image} alt={currentStudy.title} fill className='object-cover' priority />
				</div>

				{/* Title */}
				<h2 ref={titleRef} className='text-3xl font-bold text-black mb-4 leading-tight'>
					{currentStudy.title}
				</h2>

				{/* Content */}
				<div ref={contentRef} className='space-y-6'>
					<p className='mb-4'>
						<span className='text-[#3ecca7] text-lg font-semibold'>{activeService}</span>
						<span className='text-black text-lg'> is about people. Identifying and understanding your audience is in the lifeblood of what research should offer.</span>
					</p>

					<div className='space-y-5 text-black'>
						{currentStudy.description && <p className='text-base'>{currentStudy.description}</p>}
						{currentStudy.challenge && <p className='text-base'>{currentStudy.challenge}</p>}
						{currentStudy.solution && <p className='text-base'>{currentStudy.solution}</p>}
						{currentStudy.results && <p className='text-base'>{currentStudy.results}</p>}
					</div>
				</div>

				{/* Next case study button - positioned at bottom */}
				{caseStudies && caseStudies[activeService] && caseStudies[activeService].length > 1 && (
					<div className='mt-10 pt-6 border-t border-gray-100'>
						<a href='#' onClick={goToNextCaseStudy} className='flex justify-between items-center w-full bg-gray-50 p-4 rounded-lg'>
							<span className='text-sm text-gray-500'>NEXT CASE STUDY</span>
							<span className='flex items-center text-black font-medium'>
								{getNextCaseStudyTitle().length > 20 ? `${getNextCaseStudyTitle().substring(0, 20)}...` : getNextCaseStudyTitle()}
								<svg className='ml-2' xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
									<path d='M5 12h14'></path>
									<path d='M12 5l7 7-7 7'></path>
								</svg>
							</span>
						</a>
					</div>
				)}
			</div>
		</div>
	);
}
