'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import Image from 'next/image';
import Section from '../../components/Section';
import CaseStudyDetailMobile from './CaseStudyDetailMobile';
import { getText, parseColoredText, Language } from '../../data/translations';

// Define case study data type
type CaseStudy = {
	title: string;
	subtitle: string;
	image: string;
	description?: string;
	challenge?: string;
	solution?: string;
	results?: string;
};

type CaseStudiesData = {
	[key: string]: CaseStudy[];
};

// Define case study data - EXACT SAME AS DESKTOP
const caseStudies: CaseStudiesData = {
	HOSPITALITY: [
		{
			title: 'Hospitality Business',
			subtitle: 'A well-established hospitality business in Bulgaria',
			image: '/case-studies/brand-a.jpg',
			description: 'A well-established hospitality business in Bulgaria sought new avenues for expansion and strategic growth. With a strong foundation, the goal was to uncover actionable insights to inform future development.',
			challenge: 'Despite a solid market presence, the business needed fresh strategies to navigate an evolving, competitive hospitality landscape.',
			solution: "We launched a comprehensive research initiative to guide decision-making:\n\n- Research: Conducted in-depth analysis of the competitive landscape, including trend scanning and forecasting, to uncover emerging opportunities.\n- Bespoke Strategy Creation: Developed a tailored, actionable strategy aligned with the business's strengths and market insights.",
			results: 'Our efforts identified high-potential growth areas based on current trends. The bespoke strategy offered clear direction, enabling informed expansion decisions.',
		},
	],
	'ITALIAN CONCEPT': [
		{
			title: 'Italian Concept Store',
			subtitle: 'A specialty retailer introducing Italian lifestyle products',
			image: '/case-studies/business.jpg',
			description: 'A specialty retailer introducing Italian lifestyle products to the Bulgarian market aimed to deepen customer engagement and strengthen brand recognition.',
			challenge: 'While offering high-quality products, the store struggled to establish a cohesive brand presence and connect meaningfully with customers.',
			solution: "We undertook a strategic repositioning process:​\n\n- Research: Conducted an in-depth analysis of the local retail landscape, exploring customer preferences, market trends, and opportunities for differentiation.​\n- Marketing Plan Development: Crafted a targeted marketing strategy aligned with the store's offerings and audience, defining clear objectives, channels, and engagement steps.",
			results: "Our work revealed the store's unique market position, enabling stronger customer connection. A clear, research-based marketing strategy laid a foundation for lasting success.",
		},
	],
	'WELLNESS PRACTICE': [
		{
			title: 'Wellness Practice',
			subtitle: 'A newly established somatic therapist',
			image: '/case-studies/sports-direct-1.jpg',
			description: 'A newly established somatic therapist sought to define her distinctive healing approach and attract aligned clients through a strong, resonant presence.',
			challenge: 'Launching in a niche market required communicating the unique value of her services and creating a brand identity capable of building trust.',
			solution: "We guided the practice's development across key areas:​\n\n- Research: Analyzed the local wellness landscape to uncover gaps and opportunities.​\n- Business Architecture: Designed and positioned her service offerings to reflect her methodology.​\n- Branding: Developed a visual and verbal identity capturing the practice's essence and authenticity.​\n- Marketing Strategy: Crafted a marketing plan focused on resonant channels and messaging.",
			results: 'The new brand identity and strategic plan allowed her to connect meaningfully with clients, positioning her practice for growth and sustainability.',
		},
	],
	'International Cosmetics Brand': [
		{
			title: 'International Cosmetics Brand',
			subtitle: 'An international cosmetics company with a growing global presence.',
			image: '/case-studies/sports-direct-1.jpg',
			description: 'An international cosmetics company with a growing global presence was looking to evaluate the effectiveness of its internal employee programs and benefits—seeking to understand how they were received across the organization and what could be improved.',
			challenge: 'Despite continued business growth, several employee loyalty initiatives and internal benefits programs were underperforming. Engagement and perceived value varied across departments, making it difficult to assess impact or guide future improvements.',
			solution: "Research: Conducted in-depth, one-to-one interviews with employees across different levels and departments to uncover honest perspectives, unmet needs, and areas of friction within existing programs.",
			results: 'The research surfaced key disconnects in perception, communication, and relevance. Sotrixa provided actionable recommendations to refine current initiatives and introduce strategic adjustments—leading to stronger alignment between employee expectations and company offerings.',
		},
	],
};

export default function MobileCaseStudySection() {
	const sectionRef = useRef<HTMLDivElement>(null);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [activeService, setActiveService] = useState<string>('HOSPITALITY');
	const sliderRef = useRef<HTMLDivElement>(null);
	const [selectedStudy, setSelectedStudy] = useState<CaseStudy | null>(null);
	// New state to control visibility of detail view
	const [showDetail, setShowDetail] = useState(false);
	const [language] = useState<Language>('en');

	// Navigation state for carousel - EXACT SAME AS DESKTOP but mobile optimized
	const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
	const [slidesPerView, setSlidesPerView] = useState(1);

	// Get title and subtitle from translations - EXACT SAME AS DESKTOP
	const titleTranslation = getText('caseStudySection.title', language);
	const subtitleTranslation = getText('caseStudySection.subtitle', language);

	// Parse the colored text in title - EXACT SAME AS DESKTOP
	const { text: rawTitleText, coloredWords } = parseColoredText(titleTranslation);

	// Update slides per view on resize - MOBILE OPTIMIZED
	useEffect(() => {
		const updateSlidesPerView = () => {
			setSlidesPerView(window.innerWidth >= 640 ? 1 : 1); // Always 1 for mobile
		};

		// Set initial value
		updateSlidesPerView();

		// Add resize listener
		window.addEventListener('resize', updateSlidesPerView);
		return () => window.removeEventListener('resize', updateSlidesPerView);
	}, []);

	const handleStudyClick = (study: CaseStudy) => {
		// First set the selected study data
		setSelectedStudy(study);
		// Then show the detail view
		setShowDetail(true);
	};

	const handleCloseDetail = () => {
		// First hide the detail view
		setShowDetail(false);
		// After a delay, clear the selected study
		setTimeout(() => {
			setSelectedStudy(null);
		}, 400); // Match this with animation duration
	};

	// Use GSAP for animations - EXACT SAME AS DESKTOP
	useEffect(() => {
		if (!sectionRef.current || !caseStudies) return;

		const ctx = gsap.context(() => {
			const tl = gsap.timeline({
				defaults: { ease: 'power3.out' },
			});

			// Animate main title and description
			tl.fromTo('.case-studies-title, .case-studies-description', { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.2 });

			// Animate services with stagger
			tl.fromTo('.service-item', { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, stagger: 0.15 }, '-=0.4');

			// Animate slider
			tl.fromTo('.slider-container', { scale: 0.95, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7 }, '-=0.3');
		}, sectionRef);

		return () => ctx.revert();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [caseStudies]);

	// Get all case studies - EXACT SAME AS DESKTOP
	const getAllSlides = useCallback(() => {
		return Object.values(caseStudies).flat();
	}, []);

	// Navigation functions - EXACT SAME AS DESKTOP
	const goToPrevious = () => {
		setCurrentSlideIndex((prev) => Math.max(0, prev - slidesPerView));
	};

	const goToNext = () => {
		const allSlides = getAllSlides();
		const maxIndex = Math.max(0, allSlides.length - slidesPerView);
		setCurrentSlideIndex((prev) => Math.min(maxIndex, prev + slidesPerView));
	};

	// Check if navigation buttons should be disabled - EXACT SAME AS DESKTOP
	const isPrevDisabled = currentSlideIndex === 0;
	const isNextDisabled = () => {
		const allSlides = getAllSlides();
		return currentSlideIndex >= allSlides.length - slidesPerView;
	};

	// Get visible slides based on current index - EXACT SAME AS DESKTOP
	const getVisibleSlides = useCallback(() => {
		const allSlides = Object.values(caseStudies).flat();
		return allSlides.slice(currentSlideIndex, currentSlideIndex + slidesPerView);
	}, [currentSlideIndex, slidesPerView]);

	// Handle slide changes with GSAP - EXACT SAME AS DESKTOP
	useEffect(() => {
		if (sliderRef.current) {
			// Get all slide items
			const slideItems = sliderRef.current.querySelectorAll('.slider-item');

			// Simple fade-in animation without flashing
			gsap.set(slideItems, { opacity: 1, y: 0 });
			gsap.fromTo(
				slideItems,
				{ scale: 0.98 },
				{
					scale: 1,
					duration: 0.3,
					ease: 'power2.out',
				}
			);
		}
	}, [currentSlideIndex]);

	// After initial render, apply GSAP animations based on showDetail state - EXACT SAME AS DESKTOP
	useEffect(() => {
		if (!sectionRef.current) return;

		if (showDetail) {
			// Hide grid view and show detail view
			gsap.to('.case-studies-grid', {
				opacity: 0,
				y: -20,
				duration: 0.3,
				ease: 'power2.in',
				display: 'none',
			});

			gsap.fromTo('.case-study-detail-container', { opacity: 0, y: 20, display: 'block' }, { opacity: 1, y: 0, duration: 0.4, delay: 0.1, ease: 'power2.out' });
		} else {
			// Hide detail view and show grid view
			gsap.to('.case-study-detail-container', {
				opacity: 0,
				y: 20,
				duration: 0.3,
				ease: 'power2.in',
				display: 'none',
			});

			gsap.fromTo('.case-studies-grid', { opacity: 0, y: 0, display: 'grid' }, { opacity: 1, y: 0, duration: 0.4, delay: 0.1, ease: 'power2.out' });
		}
	}, [showDetail]);

	return (
		<Section id='mobile-case-studies' className='bg-white text-black pt-6 sm:pt-8 md:pt-12 lg:pt-16 overflow-visible'>
			<div ref={sectionRef} className='w-full max-w-none'>
				{/* Grid view - EXACT SAME AS DESKTOP but mobile optimized */}
				<div className='grid grid-cols-1 gap-0 case-studies-grid' style={{ display: showDetail ? 'none' : 'grid' }}>
					{/* Left column - EXACT SAME CONTENT AS DESKTOP but mobile layout */}
					<div className='px-4 sm:px-6 md:pl-8 lg:pl-12 xl:pl-16 lg:pr-6 xl:pr-8 pb-6 sm:pb-8 lg:pb-16 flex flex-col items-start justify-center h-full'>
						<h2 className='mt-[-14rem] sm:mt-6 lg:mt-10 case-studies-title text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-6xl font-black text-black text-left w-full'>
							{/* EXACT SAME TITLE RENDERING LOGIC AS DESKTOP */}
							{(() => {
								let lastIndex = 0;
								const elements = [];

								// Sort colored words by their position in the original text
								const sortedWords = [...coloredWords].sort((a, b) => rawTitleText.indexOf(a.word) - rawTitleText.indexOf(b.word));

								// Process each colored word
								sortedWords.forEach(({ word, color }, i) => {
									const wordIndex = rawTitleText.indexOf(word, lastIndex);

									// Add text before the colored word
									if (wordIndex > lastIndex) {
										const textBefore = rawTitleText.substring(lastIndex, wordIndex);
										// Check if text contains em dash and style it smaller
										if (textBefore.includes('—')) {
											const parts = textBefore.split('—');
											elements.push(<span key={`text-${i}-before`}>{parts[0]}</span>);
											elements.push(
												<span key={`dash-${i}`} style={{ fontSize: '1em', fontWeight: '200', transform: 'scaleX(0.5)', display: 'inline-block' }}>
													–
												</span>
											);
											if (parts[1]) elements.push(<span key={`text-${i}-after`}>{parts[1]}</span>);
										} else {
											elements.push(<span key={`text-${i}`}>{textBefore}</span>);
										}
									}

									// Add the colored word
									elements.push(
										<span key={`colored-${i}`} style={{ color }}>
											{word}
										</span>
									);

									lastIndex = wordIndex + word.length;
								});

								// Add any remaining text
								if (lastIndex < rawTitleText.length) {
									const remainingText = rawTitleText.substring(lastIndex);
									// Check if remaining text contains em dash and style it smaller
									if (remainingText.includes('—')) {
										const parts = remainingText.split('—');
										elements.push(<span key='text-end-before'>{parts[0]}</span>);
										elements.push(
											<span key='dash-end' style={{ fontSize: '0.6em', fontWeight: '200', transform: 'scaleX(0.5)', display: 'inline-block' }}>
												–
											</span>
										);
										if (parts[1]) elements.push(<span key='text-end-after'>{parts[1]}</span>);
									} else {
										elements.push(<span key='text-end'>{remainingText}</span>);
									}
								}

								return elements;
							})()}
						</h2>
						<p className='case-studies-description text-base sm:text-lg md:text-xl lg:text-xl xl:text-xl text-left w-full pt-2 sm:pt-3'>{subtitleTranslation}</p>
					</div>

					{/* Right column - EXACT SAME AS DESKTOP but mobile layout */}
					<div className='relative pr-0 mt-4 sm:mt-6'>
						{/* Case studies container - EXACT SAME AS DESKTOP */}
						<div className='relative overflow-hidden h-auto'>
							{/* Navigation arrows - EXACT SAME AS DESKTOP */}
							<div className='absolute left-0 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-2 sm:gap-3 pl-1 sm:pl-2'>
								<button onClick={goToPrevious} disabled={isPrevDisabled} className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 flex items-center justify-center transition-all duration-200 ${isPrevDisabled ? 'opacity-30 cursor-not-allowed' : 'opacity-70 hover:opacity-100 hover:scale-110 active:scale-95'}`} aria-label='Previous case study'>
									<svg width='24' height='24' className='sm:w-7 sm:h-7 lg:w-8 lg:h-8' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
										<path d='M15 18l-6-6 6-6' />
									</svg>
								</button>
								<button onClick={goToNext} disabled={isNextDisabled()} className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 flex items-center justify-center transition-all duration-200 ${isNextDisabled() ? 'opacity-30 cursor-not-allowed' : 'opacity-70 hover:opacity-100 hover:scale-110 active:scale-95'}`} aria-label='Next case study'>
									<svg width='24' height='24' className='sm:w-7 sm:h-7 lg:w-8 lg:h-8' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
										<path d='M9 18l6-6-6-6' />
									</svg>
								</button>
							</div>

							{/* EXACT SAME SLIDER AS DESKTOP */}
							<div ref={sliderRef} className='slider-container flex gap-3 sm:gap-4 md:gap-6 px-3 sm:px-4 pb-4 sm:pb-6 pt-2 sm:pt-3 ml-12 sm:ml-14 lg:ml-16'>
								{getVisibleSlides().map((study, index) => (
									<div key={`${currentSlideIndex}-${index}`} className='slider-item flex-shrink-0 w-full sm:w-[280px] md:w-[320px] lg:w-1/2 space-y-3 sm:space-y-4 cursor-pointer transition-transform duration-300 hover:-translate-y-2' onClick={() => handleStudyClick(study)}>
										{/* Image container - EXACT SAME AS DESKTOP */}
										<div className='h-[200px] xs:h-[220px] sm:h-[240px] md:h-[280px] lg:h-[320px] xl:h-[380px] rounded-lg border border-gray-200 shadow-md overflow-hidden'>
											<div className='relative w-full h-full'>
												<Image src={study.image} alt={study.title} className='object-cover hover:scale-105 transition-transform duration-300' fill style={{ objectFit: 'cover' }} priority={index === 0} />

												{/* Overlay with view details button - EXACT SAME AS DESKTOP */}
												<div className='absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100'>
													<span className='px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-3 bg-white text-black font-bold rounded-lg transform scale-95 hover:scale-100 transition-transform text-xs sm:text-sm md:text-base'>View Details</span>
												</div>
											</div>
										</div>

										{/* Title and description below the image - EXACT SAME AS DESKTOP */}
										<div className='space-y-1 sm:space-y-2 px-1 sm:px-2'>
											<h3 className='text-base sm:text-lg lg:text-xl font-bold leading-tight'>{study.title}</h3>
											<p className='text-sm sm:text-base text-gray-600 leading-tight'>{study.subtitle}</p>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>

				{/* Detail view - MOBILE OPTIMIZED OVERLAY */}
				{selectedStudy && (
					<div className='px-3 sm:px-4 md:px-8 lg:px-12 xl:px-20 py-4 sm:py-6 lg:py-10 case-study-detail-container' style={{ display: showDetail ? 'block' : 'none' }}>
						<CaseStudyDetailMobile study={selectedStudy} caseStudies={caseStudies} onClose={handleCloseDetail} />
					</div>
				)}
			</div>
		</Section>
	);
}