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
};

export default function CaseStudySection() {
	const sectionRef = useRef<HTMLDivElement>(null);
	const [activeService, setActiveService] = useState<string>('HOSPITALITY');
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
		}, sectionRef);

		return () => ctx.revert();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [caseStudies]);

	// Calculate all slides to display for the active service instead of just two
	const getVisibleSlides = useCallback(() => {
		// Return all case studies from all categories
		const allSlides = Object.values(caseStudies).flat();
		return allSlides;
	}, []);

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

			// Then highlight all slides
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
	}, [getVisibleSlides]);

	// Handle service change from detail view
	const handleDetailServiceChange = useCallback((service: string) => {
		// Reset selected study when changing service
		setSelectedStudy(null);

		setActiveService(service);

		// If there are case studies for this service, select the first one
		if (caseStudies[service]?.length > 0) {
			setSelectedStudy(caseStudies[service][0]);
		}
	}, []);

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
		<Section id='case-study' className='bg-white text-black pt-8 md:pt-16 overflow-visible'>
			<div ref={sectionRef} className='w-full max-w-none'>
				{/* Grid view - set initial display style based on selected study */}
				<div className='grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-6 case-studies-grid' style={{ display: showDetail ? 'none' : 'grid' }}>
					{/* Left column - 5/12 width */}
					<div className='lg:col-span-6 px-6 sm:pl-8 md:pl-12 lg:pl-16 lg:pr-8 pb-8 lg:pb-16 flex flex-col items-start justify-center h-full'>
						<h2 className='mt-6 lg:mt-10 case-studies-title text-2xl md:text-6xl font-bold text-black text-left w-full'>
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
						<p className='case-studies-description text-lg md:text-xl text-left w-full pt-3'>{subtitleTranslation}</p>
					</div>

					{/* Right column - 7/12 width, extending to the right edge */}
					<div className='lg:col-span-6 relative pr-0 mt-6 lg:-mt-16'>
						{/* Case studies container with no right padding - now shows all active service case studies */}
						<div className='relative overflow-x-auto overflow-y-visible h-auto'>
							<div ref={sliderRef} className='slider-container flex flex-nowrap gap-4 md:gap-6 w-max px-4 pb-6 pt-3' style={{ scrollBehavior: 'smooth', touchAction: 'pan-x' }}>
								{getVisibleSlides().map((study, index) => (
									<div key={index} className='slider-item flex-shrink-0 w-[280px] sm:w-[320px] md:w-[380px] space-y-4 cursor-pointer transition-transform duration-300 hover:-translate-y-2' onClick={() => handleStudyClick(study)}>
										{/* Image container - reduced size */}
										<div className='h-[280px] sm:h-[340px] md:h-[420px] lg:h-[460px] rounded-lg border border-gray-200 shadow-md overflow-hidden'>
											<div className='relative w-full h-full'>
												<Image src={study.image} alt={study.title} className='object-cover hover:scale-105 transition-transform duration-300' fill style={{ objectFit: 'cover' }} priority={index === 0} />

												{/* Overlay with view details button */}
												<div className='absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100'>
													<span className='px-4 py-2 sm:px-6 sm:py-3 bg-white text-black font-bold rounded-lg transform scale-95 hover:scale-100 transition-transform text-sm sm:text-base'>View Details</span>
												</div>
											</div>
										</div>

										{/* Title and description below the image */}
										<div className='space-y-1 sm:space-y-2 px-2'>
											<h3 className='text-lg sm:text-xl font-bold'>{study.title}</h3>
											<p className='text-sm sm:text-base text-gray-600'>{study.subtitle}</p>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>

				{/* Detail view - always render but control visibility with CSS */}
				{selectedStudy && (
					<div className='px-4 sm:px-8 md:px-12 lg:px-20 py-6 lg:py-10 case-study-detail-container' style={{ display: showDetail ? 'block' : 'none' }}>
						<CaseStudyDetail study={selectedStudy} activeService={activeService} caseStudies={caseStudies} onClose={handleCloseDetail} onServiceChange={handleDetailServiceChange} />
					</div>
				)}
			</div>
		</Section>
	);
}
