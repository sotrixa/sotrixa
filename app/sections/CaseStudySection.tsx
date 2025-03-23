'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import Image from 'next/image';
import Section from '../components/Section';

// Define case study data type
type CaseStudy = {
	title: string;
	subtitle: string;
	image: string;
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
		},
		{
			title: 'Sports Direct',
			subtitle: 'Getting in touch with Gen Z',
			image: '/case-studies/sports-direct-2.jpg',
		},
	],
	Branding: [
		{
			title: 'Brand A',
			subtitle: 'Brand strategy development',
			image: '/case-studies/brand-a.jpg',
		},
	],
	'Bespoke Strategy': [
		{
			title: 'Strategy Client',
			subtitle: 'Custom strategy development',
			image: '/case-studies/strategy.jpg',
		},
	],
	'Business Planning': [
		{
			title: 'Business Client',
			subtitle: 'Planning for success',
			image: '/case-studies/business.jpg',
		},
	],
	Marketing: [
		{
			title: 'Marketing Client',
			subtitle: 'Reaching new audiences',
			image: '/case-studies/marketing.jpg',
		},
	],
};

export default function CaseStudySection() {
	const sectionRef = useRef<HTMLDivElement>(null);
	const serviceRef = useRef<HTMLDivElement>(null);
	const [activeService, setActiveService] = useState<string>('Research');
	const [currentSlide, setCurrentSlide] = useState(0);
	const sliderRef = useRef<HTMLDivElement>(null);

	const handleServiceClick = (service: string) => {
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

	return (
		<Section id='case-study' className='bg-white text-black pt-16'>
			<div ref={sectionRef} className='container mx-auto px-4 pb-20'>
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
					<div className='space-y-6'>
						<h2 className='case-studies-title text-5xl font-bold text-black'>Case Studies</h2>
						<p className='case-studies-description'>
							<span className='text-[#3ecca7] text-xl font-semibold'>Research</span>
							<span className='text-black text-xl'>
								{' '}
								is about people. Identifying and understanding<br></br> your{' '}
							</span>
							<span className='text-[#ff69b4] text-xl font-semibold'>audience</span>
							<span className='text-black text-xl'> is in the </span>
							<span className='text-[#f4dd65] text-xl font-semibold'>lifeblood</span>
							<span className='text-black text-xl'> of what research should offer.</span>
						</p>

						<div ref={serviceRef} className='mt-16'>
							<div className='space-y-2 mb-10'></div>

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

					<div className='relative'>
						{/* Two case studies side by side */}
						<div ref={sliderRef} className='slider-container grid grid-cols-2 gap-4 h-[450px]'>
							{getVisibleSlides().map((study, index) => (
								<div key={index} className='slider-item h-full flex flex-col rounded-lg border border-gray-200 shadow-md overflow-hidden'>
									<div className='relative flex-1 overflow-hidden'>
										<Image src={study.image} alt={study.title} className='object-cover hover:scale-105 transition-transform duration-300' fill style={{ objectFit: 'cover' }} />
									</div>
									<div className='bg-white p-4'>
										<h3 className='text-xl font-bold mb-2'>{study.title}</h3>
										<p className='text-gray-600'>{study.subtitle}</p>
									</div>
								</div>
							))}
						</div>

						{/* Navigation controls */}
						<div className='nav-controls absolute bottom-4 right-4 flex items-center space-x-2'>
							<button onClick={prevSlide} className='bg-black bg-opacity-80 text-white p-2 rounded-full hover:bg-opacity-100 transition-opacity' disabled={currentSlide === 0}>
								<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
									<path d='m15 18-6-6 6-6' />
								</svg>
							</button>
							<button onClick={nextSlide} className='bg-black bg-opacity-80 text-white p-2 rounded-full hover:bg-opacity-100 transition-opacity' disabled={currentSlide >= (caseStudies[activeService]?.length || 1) - 1}>
								<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
									<path d='m9 18 6-6-6-6' />
								</svg>
							</button>
						</div>
					</div>
				</div>
			</div>
		</Section>
	);
}
