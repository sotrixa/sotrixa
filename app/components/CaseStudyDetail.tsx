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
	onServiceChange?: (service: string) => void;
};

export default function CaseStudyDetail({ study, activeService, caseStudies, onClose, onServiceChange }: CaseStudyDetailProps) {
	const detailRef = useRef<HTMLDivElement>(null);
	const titleRef = useRef<HTMLHeadingElement>(null);
	const imageRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);
	const sidebarRef = useRef<HTMLDivElement>(null);
	const navRef = useRef<HTMLDivElement>(null);
	const [currentStudy, setCurrentStudy] = useState(study);
	const [isAnimating, setIsAnimating] = useState(false);
	const [debugText, setDebugText] = useState('');

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
		setDebugText((prev) => prev + ' | study updated');
	}, [study]);

	// Update current study when activeService changes
	useEffect(() => {
		if (caseStudies && caseStudies[activeService] && caseStudies[activeService].length > 0) {
			const firstStudy = caseStudies[activeService][0];
			setCurrentStudy(firstStudy);
			setDebugText((prev) => prev + ` | service changed to ${activeService}`);

			// Force content to be visible in case animations failed
			if (contentRef.current) {
				contentRef.current.style.opacity = '1';
				contentRef.current.style.transform = 'translateY(0)';
			}
		}
	}, [activeService, caseStudies]);

	// Handle service click in the sidebar with animations
	const handleServiceClick = (service: string) => {
		if (service === activeService || isAnimating) return;

		setIsAnimating(true);
		setDebugText((prev) => prev + ` | clicking service ${service}`);

		// Animate content out
		const tl = gsap.timeline({
			onComplete: () => {
				if (onServiceChange) {
					onServiceChange(service);
				} else {
					if (caseStudies && caseStudies[service] && caseStudies[service].length > 0) {
						const newStudy = caseStudies[service][0];
						setCurrentStudy(newStudy);
						setDebugText((prev) => prev + ` | set study to ${newStudy.title}`);
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
					x: 50,
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
					x: 50,
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

			// Animate sidebar
			if (sidebarRef.current) {
				tl.fromTo(sidebarRef.current, { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, ease: 'back.out(1.2)' }, '-=0.4');
			}

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

			// Add hover animations to sidebar items
			gsap.utils.toArray<HTMLDivElement>('.service-item').forEach((item) => {
				const gradient = item.querySelector('.service-gradient');
				const hoverTl = gsap.timeline({ paused: true });

				if (gradient) {
					hoverTl.to(gradient, {
						width: '100%',
						opacity: 0.6,
						duration: 0.3,
						ease: 'power1.out',
					});
				}

				hoverTl.to(
					item,
					{
						x: 5,
						color: '#000',
						duration: 0.3,
						ease: 'power1.out',
					},
					0
				);

				item.addEventListener('mouseenter', () => hoverTl.play());
				item.addEventListener('mouseleave', () => hoverTl.reverse());
			});
		}, detailRef);

		return () => ctx.revert();
	}, []);

	// Animate content when current study changes
	useEffect(() => {
		if (!contentRef.current || !imageRef.current || !titleRef.current) return;

		setDebugText((prev) => prev + ` | animating content for ${currentStudy.title}`);

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
		<div ref={detailRef} className='w-full min-h-screen bg-white relative' onKeyDown={handleKeyDown} tabIndex={0}>
			{/* Right side image positioned absolutely at top-right with zero margin/padding */}
			<div ref={imageRef} className='absolute -top-10 -mr-20 right-0 z-10'>
				<Image src={currentStudy.image} alt={currentStudy.title} width={500} height={350} className='object-cover' priority />
			</div>

			{/* Menu button in top right corner over the image */}
			<div className='absolute top-6 right-10 z-20'>
				<button className='text-black hover:scale-110 transition-transform duration-300'>
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
				<div ref={sidebarRef} className='lg:col-span-3 border-r border-gray-200 py-10 px-8 z-10 pt-60 bg-white'>
					<div className='w-full space-y-8 pl-4'>
						{Object.keys(caseStudies || {}).map((service) => (
							<div
								key={service}
								className={`service-item cursor-pointer transform transition-all duration-300 
									${activeService === service ? 'text-black font-black text-6xl -translate-y-2' : 'text-gray-500 font-bold text-3xl hover:text-gray-800 hover:-translate-y-1'}`}
								onClick={() => handleServiceClick(service)}
							>
								{activeService === service ? (
									<span className='relative'>
										{service}
										<span className='service-gradient absolute bottom-2 left-0 w-full h-2 bg-gradient-to-r from-[#f4dd65] via-[#d142e2] to-[#70DFC6] rounded-full opacity-40'></span>
									</span>
								) : (
									<span>{service}</span>
								)}
							</div>
						))}
					</div>
				</div>

				{/* Middle content - now with fixed height and scrollable */}
				<div className='lg:col-span-5 pt-30 pl-10 pr-4 z-10 bg-white h-screen overflow-y-auto'>
					{/* Navigation row with back link and case study navigation */}
					<div ref={navRef} className='flex justify-between items-center mb-8'>
						{/* Back link */}
						<a
							href='#'
							onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
								e.preventDefault();
								onClose();
							}}
							className='text-black font-medium hover:text-gray-700 transition-all duration-300 hover:-translate-x-1 group'
						>
							<span className='flex items-center'>
								<svg className='mr-2 transition-transform duration-300 group-hover:-translate-x-1' xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
									<path d='M19 12H5'></path>
									<path d='M12 19l-7-7 7-7'></path>
								</svg>
								RETURN TO CASE STUDIES
							</span>
						</a>

						{/* Next case study link */}
						{caseStudies && caseStudies[activeService] && caseStudies[activeService].length > 1 && (
							<a href='#' onClick={goToNextCaseStudy} className='text-black font-medium hover:text-gray-700 transition-all duration-300 hover:translate-x-1 group'>
								<span className='flex items-center'>
									READ {getNextCaseStudyTitle()}
									<svg className='ml-2 transition-transform duration-300 group-hover:translate-x-1' xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
										<path d='M5 12h14'></path>
										<path d='M12 5l7 7-7 7'></path>
									</svg>
								</span>
							</a>
						)}
					</div>

					<h2 ref={titleRef} className='text-5xl font-bold text-black mb-8 leading-tight'>
						{currentStudy.title}
					</h2>

					<div ref={contentRef} className='space-y-8'>
						<p className='mb-8'>
							<span className='text-[#3ecca7] text-xl font-semibold'>{activeService}</span>
							<span className='text-black text-xl'> is about people. Identifying and understanding your audience is in the lifeblood of what research should offer.</span>
						</p>

						<div className='detail-content space-y-6 text-black'>
							{currentStudy.description && <p className='text-base'>{currentStudy.description}</p>}

							{currentStudy.challenge && <p className='text-base'>{currentStudy.challenge}</p>}

							{currentStudy.solution && <p className='text-base'>{currentStudy.solution}</p>}

							{currentStudy.results && <p className='text-base'>{currentStudy.results}</p>}
						</div>
					</div>

					{/* Debug output - remove in production */}
					<div className='mt-8 text-xs text-gray-400 hidden'>{debugText}</div>
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
