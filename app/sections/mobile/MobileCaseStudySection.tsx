'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import CaseStudyDetail from '../../components/CaseStudyDetail';
import { getText, parseColoredText, Language } from '../../data/translations';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
	gsap.registerPlugin(ScrollTrigger);
}

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

// Define case study data - matches desktop version
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
			results: 'The campaign achieved a 32% increase in repeat purchases and boosted social media following by a 45% among the target demographic.',
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

export default function MobileCaseStudySection() {
	const sectionRef = useRef<HTMLDivElement>(null);
	const [activeService, setActiveService] = useState<string>('CREATED TO MATTER');
	const [, setCurrentSlide] = useState(0);
	const sliderRef = useRef<HTMLDivElement>(null);
	const [selectedStudy, setSelectedStudy] = useState<CaseStudy | null>(null);
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
				left: 250,
				behavior: 'smooth',
			});
		}
	}, []);

	const prevSlide = useCallback(() => {
		if (sliderRef.current) {
			sliderRef.current.scrollBy({
				left: -250,
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
			tl.fromTo('.case-studies-title, .case-studies-description', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.2 });

			// Animate services with stagger
			tl.fromTo('.service-item', { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, stagger: 0.15 }, '-=0.4');

			// Animate slider
			tl.fromTo('.slider-container', { scale: 0.95, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7 }, '-=0.3');

			// Animate navigation controls
			tl.fromTo('.nav-controls', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.4');
		}, sectionRef);

		return () => ctx.revert();
	}, []);

	// Calculate all slides to display for the active service
	const getVisibleSlides = useCallback(() => {
		const slides = caseStudies[activeService] || [];
		return slides;
	}, [activeService]);

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

			gsap.fromTo('.case-studies-grid', { opacity: 0, y: 0, display: 'block' }, { opacity: 1, y: 0, duration: 0.4, delay: 0.1, ease: 'power2.out' });
		}
	}, [showDetail]);

	return (
		<section ref={sectionRef} id='mobile-case-studies' className='min-h-screen py-10 px-4 bg-white text-black'>
			<div className='max-w-lg mx-auto'>
				{/* Grid view */}
				<div className='case-studies-grid' style={{ display: showDetail ? 'none' : 'block' }}>
					{/* Title Section */}
					<h2 className='case-studies-title text-2xl font-bold text-black mb-2'>
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
					<p className='case-studies-description text-base mb-6'>{subtitleTranslation}</p>

					{/* Service Selection */}
					<div className='w-full space-y-2 mb-8'>
						{Object.keys(caseStudies).map((service) => (
							<div
								key={service}
								className={`service-item cursor-pointer transform transition-all duration-300 
                                ${activeService === service ? 'text-black font-bold text-xl -translate-y-1' : 'text-gray-500 font-medium text-base hover:text-gray-800 hover:-translate-y-1'}`}
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

					{/* Navigation controls */}
					<div className='flex justify-center space-x-4 mb-4 nav-controls'>
						<button onClick={prevSlide} className='bg-white bg-opacity-90 text-black p-3 rounded-full shadow-md flex items-center justify-center border border-gray-200'>
							<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
								<path d='m15 18-6-6 6-6' />
							</svg>
						</button>
						<button onClick={nextSlide} className='bg-white bg-opacity-90 text-black p-3 rounded-full shadow-md flex items-center justify-center border border-gray-200'>
							<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
								<path d='m9 6 6 6-6 6' />
							</svg>
						</button>
					</div>

					{/* Case Study Slider */}
					<div className='relative overflow-x-auto overflow-y-visible h-auto'>
						<div ref={sliderRef} className='slider-container flex flex-nowrap gap-4 w-max pb-8 pt-2' style={{ scrollBehavior: 'smooth', touchAction: 'pan-x' }}>
							{getVisibleSlides().map((study, index) => (
								<div key={index} className='slider-item flex-shrink-0 w-[280px] space-y-3 cursor-pointer transition-transform duration-300 hover:-translate-y-2' onClick={() => handleStudyClick(study)}>
									{/* Image container */}
									<div className='h-[320px] rounded-lg border border-gray-200 shadow-md overflow-hidden'>
										<div className='relative w-full h-full'>
											<Image src={study.image} alt={study.title} className='object-cover hover:scale-105 transition-transform duration-300' fill style={{ objectFit: 'cover' }} priority={index === 0} />

											{/* Overlay with view details button */}
											<div className='absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100'>
												<span className='px-4 py-2 bg-white text-black font-bold rounded-lg transform scale-95 hover:scale-100 transition-transform text-sm'>View Details</span>
											</div>
										</div>
									</div>

									{/* Title and description below the image */}
									<div className='space-y-1 px-1'>
										<h3 className='text-lg font-bold'>{study.title}</h3>
										<p className='text-sm text-gray-600'>{study.subtitle}</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Detail view */}
				{selectedStudy && (
					<div className='case-study-detail-container' style={{ display: showDetail ? 'block' : 'none' }}>
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
		</section>
	);
}
