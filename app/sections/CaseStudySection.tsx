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
	'CREATED TO MATTER': [
		{
			title: 'Created to Matter',
			subtitle: 'Strategic foundation',
			image: '/case-studies/created-to-matter.jpg',
			description: 'Empowering bold ideas with strategies that align vision, purpose, and growth.',
			challenge: 'Connecting business objectives with meaningful market impact in a saturated landscape.',
			solution: 'We developed a purpose-driven approach that unified business goals with genuine market needs.',
			results: 'Established a foundation for sustainable growth with clear purpose and direction.',
		},
	],
	RESEARCH: [
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
	'BUSINESS ARCHITECTURE': [
		{
			title: 'Business Client',
			subtitle: 'Planning for success',
			image: '/case-studies/business.jpg',
			description: 'Turning vision into a structured, evolving business—ready for real-world growth.',
			challenge: 'The client needed a robust business architecture that would create a foundation for sustainable growth.',
			solution: 'We developed a detailed business architecture with operational structures and organizational frameworks.',
			results: 'The client achieved their 18-month goals within 12 months with a scalable business model.',
		},
	],
	'BESPOKE STRATEGY CREATION': [
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
	BRANDING: [
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
	MARKETING: [
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
	'WEBSITE DEVELOPMENT': [
		{
			title: 'Web Client',
			subtitle: 'Digital experience',
			image: '/case-studies/website.jpg',
			description: 'Crafting websites where form meets feeling, and strategy becomes tangible experience.',
			challenge: 'Creating a website that not only looks beautiful but effectively communicates the brand story and drives conversions.',
			solution: 'We developed a custom website with seamless UX, interactive elements, and strategic content placement.',
			results: 'The new website increased user engagement by 40% and conversion rates by 25% within the first quarter.',
		},
	],
};

export default function CaseStudySection() {
	const sectionRef = useRef<HTMLDivElement>(null);
	const serviceRef = useRef<HTMLDivElement>(null);
	const [activeService, setActiveService] = useState<string>('CREATED TO MATTER');
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

	const nextSlide = useCallback(() => {
		if (sliderRef.current) {
			sliderRef.current.scrollBy({
				left: 300,
				behavior: 'smooth',
			});
		}
	}, []);

	const prevSlide = useCallback(() => {
		if (sliderRef.current) {
			sliderRef.current.scrollBy({
				left: -300,
				behavior: 'smooth',
			});
		}
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

	// Calculate all slides to display for the active service instead of just two
	const getVisibleSlides = useCallback(() => {
		const slides = caseStudies[activeService] || [];
		return slides; // Return all slides for the active service
	}, [activeService]);

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
							{/* Services list styled like ServicesSection but with smaller font */}
							<div className='w-full space-y-5 pl-4'>
								{Object.keys(caseStudies).map((service) => (
									<div
										key={service}
										className={`service-item cursor-pointer transform transition-all duration-300 
											${activeService === service ? 'text-black font-black text-2xl sm:text-3xl md:text-4xl -translate-y-1' : 'text-gray-500 font-medium text-lg sm:text-xl hover:text-gray-800 hover:-translate-y-1'}`}
										onClick={() => handleServiceClick(service)}
									>
										{activeService === service ? (
											<span className='relative'>
												{service}
												<span className='absolute bottom-1 left-0 w-full h-1 bg-gradient-to-r from-[#f4dd65] via-[#d142e2] to-[#70DFC6] rounded-full opacity-40'></span>
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
						{/* Navigation controls - positioned for better visibility */}
						<div className='nav-controls absolute -left-16 top-1/2 transform -translate-y-1/2 z-30 flex flex-col space-y-4'>
							<button onClick={prevSlide} className='bg-white bg-opacity-80 text-black p-3 rounded-full hover:bg-opacity-100 transition-all shadow-lg flex items-center justify-center'>
								<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
									<path d='m15 18-6-6 6-6' />
								</svg>
							</button>
							<button onClick={nextSlide} className='bg-white bg-opacity-80 text-black p-3 rounded-full hover:bg-opacity-100 transition-all shadow-lg flex items-center justify-center'>
								<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
									<path d='m9 6 6 6-6 6' />
								</svg>
							</button>
						</div>

						{/* Case studies container with no right padding - now shows all active service case studies */}
						<div className='absolute inset-0 overflow-x-auto overflow-y-hidden'>
							<div ref={sliderRef} className='slider-container flex flex-nowrap gap-6 h-full w-max px-4 pb-8 pt-4' style={{ scrollBehavior: 'smooth' }}>
								{getVisibleSlides().map((study, index) => (
									<div key={index} className='slider-item flex-shrink-0 w-[420px] space-y-4 cursor-pointer transition-transform duration-300 hover:-translate-y-2' onClick={() => handleStudyClick(study)}>
										{/* Image container - bigger size */}
										<div className='h-[480px] md:h-[500px] rounded-lg border border-gray-200 shadow-md overflow-hidden'>
											<div className='relative w-full h-full'>
												<Image src={study.image} alt={study.title} className='object-cover hover:scale-105 transition-transform duration-300' fill style={{ objectFit: 'cover' }} priority={index === 0} />

												{/* Overlay with view details button */}
												<div className='absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100'>
													<span className='px-6 py-3 bg-white text-black font-bold rounded-lg transform scale-95 hover:scale-100 transition-transform'>View Details</span>
												</div>
											</div>
										</div>

										{/* Title and description below the image */}
										<div className='space-y-2 px-2'>
											<h3 className='text-xl font-bold'>{study.title}</h3>
											<p className='text-gray-600'>{study.subtitle}</p>
										</div>
									</div>
								))}
							</div>
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
