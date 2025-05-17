'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import Image from 'next/image';
import Section from '../components/Section';
import CaseStudyDetail from '../components/CaseStudyDetail';
import { getText, parseColoredText, Language } from '../data/translations';

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

// Define case study data
const caseStudies: CaseStudiesData = {
	Research: [
		{
			title: 'Sports Direct',
			subtitle: 'Getting in touch with Gen Z',
			image: '/case-studies/sports-direct-1.jpg',
			description: 'A comprehensive research project to understand Gen Z consumer behavior and preferences for Sports Direct, leading to a strategic marketing overhaul.',
			challenge: 'Sports Direct needed to reconnect with younger consumers who were gravitating toward more trendy athletic brands.',
			solution: 'We conducted extensive interviews, surveys, and social media analysis to develop detailed customer personas and journey maps specifically for Gen Z shoppers.',
			results: 'Our insights led to a 28% increase in Gen Z engagement and a 15% boost in sales among the 18-24 demographic within six months of implementation.',
		},
		{
			title: 'Sports Direct',
			subtitle: 'Getting in touch with Gen Z',
			image: '/case-studies/sports-direct-2.jpg',
			description: 'A follow-up campaign that built on our initial research to create targeted digital experiences for the Gen Z audience.',
			challenge: 'Converting initial engagement into long-term brand loyalty with a demographic known for constantly shifting preferences.',
			solution: 'We developed an omnichannel approach that integrated social media, influencer partnerships, and in-store experiences tailored to Gen Z values and shopping habits.',
			results: 'The campaign achieved a 32% increase in repeat purchases and boosted social media following by 45% among the target demographic.',
		},
	],
	Branding: [
		{
			title: 'Brand A',
			subtitle: 'Brand strategy development',
			image: '/case-studies/brand-a.jpg',
			description: 'A complete brand transformation for a legacy company looking to modernize while maintaining their core values and customer base.',
			challenge: 'Brand A struggled with an outdated image despite having quality products, leading to declining market share among younger consumers.',
			solution: 'We developed a refreshed brand identity with new visual language, messaging, and positioning that honored their heritage while signaling innovation.',
		},
		{
			title: 'Brand Z',
			subtitle: 'Brand strategy development',
			image: '/case-studies/brand-a.jpg',
			description: 'A complete brand transformation for a legacy company looking to modernize while maintaining their core values and customer base.',
			challenge: 'Brand A struggled with an outdated image despite having quality products, leading to declining market share among younger consumers.',
			solution: 'We developed a refreshed brand identity with new visual language, messaging, and positioning that honored their heritage while signaling innovation.',
		},
	],
	'Bespoke Strategy': [
		{
			title: 'Strategy Client',
			subtitle: 'Custom strategy development',
			image: '/case-studies/strategy.jpg',
			description: 'A tailored business strategy to help a mid-sized company expand into new markets while maintaining their unique value proposition.',
			challenge: 'The client needed to grow without compromising their specialized approach or diluting their brand in highly competitive new territories.',
			solution: 'We created a phased expansion strategy with careful market analysis and positioning that protected their core differentiation.',
			results: 'Successful entry into three new markets with 22% year-over-year growth while maintaining customer satisfaction ratings.',
		},
	],
	'Business Planning': [
		{
			title: 'Business Client',
			subtitle: 'Planning for success',
			image: '/case-studies/business.jpg',
			description: 'Comprehensive business planning for a startup at a critical growth stage, helping them secure funding and scale operations.',
			challenge: 'The client needed a robust business plan that would satisfy investors while creating a practical roadmap for sustainable growth.',
			solution: 'We developed a detailed 3-year business plan with financial projections, operational structures, and market analysis.',
			results: 'The client secured £2.5M in Series A funding and achieved their 18-month goals within 12 months.',
		},
	],
	Marketing: [
		{
			title: 'Marketing Client',
			subtitle: 'Reaching new audiences',
			image: '/case-studies/marketing.jpg',
			description: 'An integrated marketing campaign that helped an established B2B company successfully pivot to reach B2C customers.',
			challenge: 'The client had strong industry reputation but no recognition among consumers, requiring a complete marketing approach shift.',
			solution: 'We designed a multi-channel marketing strategy that leveraged their existing credibility while building consumer-focused messaging and touchpoints.',
			results: 'Achieved 85% brand awareness in target consumer segments within 12 months and exceeded new revenue targets by 30%.',
		},
		{
			title: 'Marketing Client 2',
			subtitle: 'Reaching new audiences',
			image: '/case-studies/marketing.jpg',
			description: 'An integrated marketing campaign that helped an established B2B company successfully pivot to reach B2C customers.',
			challenge: 'The client had strong industry reputation but no recognition among consumers, requiring a complete marketing approach shift.',
			solution: 'We designed a multi-channel marketing strategy that leveraged their existing credibility while building consumer-focused messaging and touchpoints.',
			results: 'Achieved 85% brand awareness in target consumer segments within 12 months and exceeded new revenue targets by 30%.',
		},
	],
};

export default function CaseStudySection() {
	const sectionRef = useRef<HTMLDivElement>(null);
	const serviceRef = useRef<HTMLDivElement>(null);
	const [activeService, setActiveService] = useState<string>('Research');
	const [currentSlide, setCurrentSlide] = useState(0);
	const sliderRef = useRef<HTMLDivElement>(null);
	const [selectedStudy, setSelectedStudy] = useState<CaseStudy | null>(null);
	// New state to control visibility of detail view
	const [showDetail, setShowDetail] = useState(false);
	const [language] = useState<Language>('en');

	// Get title and subtitle from translations
	const titleTranslation = getText('caseStudySection.title', language);
	const subtitleTranslation = getText('caseStudySection.subtitle', language);

	// Parse the colored text in title
	const { text: rawTitleText, coloredWords } = parseColoredText(titleTranslation);

	const handleServiceClick = (service: string) => {
		// Reset selected study when changing service
		setSelectedStudy(null);

		// Prevent animation if the service is already active
		if (service === activeService) return;

		// Animate service change
		const ctx = gsap.context(() => {
			// Dim all services
			gsap.to('.service-item', {
				opacity: 0.5,
				duration: 0.3,
				ease: 'power2.out',
			});

			// Wait a moment and set the new active service
			gsap.delayedCall(0.2, () => {
				setActiveService(service);
				setCurrentSlide(0); // Reset to first slide when changing service

				// Restore opacity
				gsap.to('.service-item', {
					opacity: 1,
					duration: 0.3,
					delay: 0.1,
					ease: 'power2.in',
				});

				// Animate images in
				gsap.fromTo('.slider-item', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out' });
			});
		}, sectionRef);

		return () => ctx.revert();
	};

	const nextSlide = () => {
		if (caseStudies[activeService]?.length) {
			setCurrentSlide((prev) => (prev + 1) % caseStudies[activeService].length);
		}
	};

	const prevSlide = () => {
		if (caseStudies[activeService]?.length) {
			setCurrentSlide((prev) => (prev - 1 + caseStudies[activeService].length) % caseStudies[activeService].length);
		}
	};

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

	// Use GSAP for animations
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

			// Animate navigation controls
			tl.fromTo('.nav-controls', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.4');
		}, sectionRef);

		return () => ctx.revert();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [caseStudies]);

	// Calculate which two slides to display - memoized to prevent recreation on each render
	const getVisibleSlides = useCallback(() => {
		const slides = caseStudies[activeService] || [];

		// If we have no slides, return an empty array
		if (slides.length === 0) return [];

		// If there's only one slide, show it twice
		if (slides.length === 1) {
			return [slides[0], slides[0]];
		}

		// Get current and next slide (or wrap around to first)
		const currentIdx = currentSlide;
		const nextIdx = (currentSlide + 1) % slides.length;

		return [slides[currentIdx], slides[nextIdx]];
	}, [activeService, currentSlide]);

	// Handle slide changes with GSAP
	useEffect(() => {
		if (sliderRef.current) {
			// Get all slide items
			const slideItems = sliderRef.current.querySelectorAll('.slider-item');

			// Animate all slides with a fade and scale
			gsap.to(slideItems, {
				opacity: 0.4,
				scale: 0.95,
				duration: 0.4,
				ease: 'power2.out',
			});

			// Then highlight the visible slides
			const visibleSlides = getVisibleSlides();
			visibleSlides.forEach((_, index) => {
				gsap.to(slideItems[index], {
					opacity: 1,
					scale: 1,
					duration: 0.6,
					delay: 0.1,
					ease: 'power2.out',
				});
			});
		}
	}, [currentSlide, activeService, getVisibleSlides]);

	// After initial render, apply GSAP animations based on showDetail state
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
		<Section id='case-study' className='bg-white text-black pt-16 overflow-visible'>
			<div ref={sectionRef} className='w-full max-w-none'>
				{/* Grid view - set initial display style based on selected study */}
				<div className='grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-6 case-studies-grid' style={{ display: showDetail ? 'none' : 'grid' }}>
					{/* Left column - 5/12 width */}
					<div className='lg:col-span-5 pl-20 pr-4 pb-20 space-y-6'>
						<h2 className='mt-10 case-studies-title text-xl md:text-4xl font-bold text-black'>
							{/* Render title with colored words */}
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
										elements.push(<span key={`text-${i}`}>{rawTitleText.substring(lastIndex, wordIndex)}</span>);
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
									elements.push(<span key='text-end'>{rawTitleText.substring(lastIndex)}</span>);
								}

								return elements;
							})()}
						</h2>
						<p className='case-studies-description text-xl'>{subtitleTranslation}</p>

						<div ref={serviceRef} className='mt-16'>
							{/* Services list styled like ServicesSection */}
							<div className='w-full space-y-8 pl-4'>
								{Object.keys(caseStudies).map((service) => (
									<div
										key={service}
										className={`service-item cursor-pointer transform transition-all duration-300 
											${activeService === service ? 'text-black font-black text-6xl -translate-y-2' : 'text-gray-500 font-bold text-3xl hover:text-gray-800 hover:-translate-y-1'}`}
										onClick={() => handleServiceClick(service)}
									>
										{activeService === service ? (
											<span className='relative'>
												{service}
												<span className='absolute bottom-2 left-0 w-full h-2 bg-gradient-to-r from-[#f4dd65] via-[#d142e2] to-[#70DFC6] rounded-full opacity-40'></span>
											</span>
										) : (
											<span>{service}</span>
										)}
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Right column - 7/12 width, extending to the right edge */}
					<div className='lg:col-span-7 relative pr-0'>
						{/* Navigation control - positioned over both case studies */}
						<div className='nav-controls absolute -left-16 top-1/2 transform -translate-y-1/2 z-30'>
							<button onClick={prevSlide} className=' bg-opacity-80 text-black p-3 rounded-full hover:bg-opacity-100 transition-opacity shadow-lg flex items-center justify-center' disabled={currentSlide === 0}>
								<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
									<path d='m15 18-6-6 6-6' />
								</svg>
							</button>
						</div>

						{/* Case studies container with no right padding */}
						<div className='absolute inset-0 overflow-hidden'>
							<div ref={sliderRef} className='slider-container grid grid-cols-2 gap-4 gap-y-8 h-auto w-full'>
								{getVisibleSlides().map((study, index) => (
									<div key={index} className='slider-item space-y-4 cursor-pointer transition-transform duration-300 hover:-translate-y-2' onClick={() => handleStudyClick(study)}>
										{/* Image container */}
										<div className='h-[500px] rounded-lg border border-gray-200 shadow-md overflow-hidden'>
											<div className='relative w-full h-full'>
												<Image src={study.image} alt={study.title} className='object-cover hover:scale-105 transition-transform duration-300' fill style={{ objectFit: 'cover' }} />

												{/* Overlay with view details button */}
												<div className='absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100'>
													<span className='px-6 py-3 bg-white text-black font-bold rounded-lg transform scale-95 hover:scale-100 transition-transform'>View Details</span>
												</div>
											</div>
										</div>

										{/* Title and description below the image */}
										<div className='space-y-2'>
											<h3 className='text-xl font-bold'>{study.title}</h3>
											<p className='text-gray-600'>{study.subtitle}</p>
										</div>
									</div>
								))}
							</div>

							{/* Single click area on the right side to advance slides */}
							<div onClick={nextSlide} className='absolute right-0 top-0 h-[500px] w-1/2 cursor-pointer z-10' style={{ display: currentSlide >= (caseStudies[activeService]?.length || 1) - 1 ? 'none' : 'block' }}></div>
						</div>
					</div>
				</div>

				{/* Detail view - always render but control visibility with CSS */}
				{selectedStudy && (
					<div className='px-20 py-10 case-study-detail-container' style={{ display: showDetail ? 'block' : 'none' }}>
						<CaseStudyDetail
							study={selectedStudy}
							activeService={activeService}
							caseStudies={caseStudies}
							onClose={handleCloseDetail}
							onServiceChange={(service) => {
								setActiveService(service);
								// Select the first case study of the new service
								if (caseStudies[service]?.length > 0) {
									setSelectedStudy(caseStudies[service][0]);
								}
							}}
						/>
					</div>
				)}
			</div>
		</Section>
	);
}
