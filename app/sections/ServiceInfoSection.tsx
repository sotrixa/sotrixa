'use client';

import React, { useEffect, useRef } from 'react';
import Section from '../components/Section';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';

// Augment Window interface to account for our global function
declare global {
	interface Window {
		playServiceInfoExitAnimation?: () => gsap.core.Timeline | undefined;
		goBackToServices?: () => void;
	}
}

// Define props interface
interface ServiceInfoSectionProps {
	onBackClick?: () => void;
}

export default function ServiceInfoSection({ onBackClick }: ServiceInfoSectionProps) {
	const sectionDivRef = useRef<HTMLDivElement>(null);
	const leftSideRef = useRef<HTMLDivElement>(null);
	const rightSideRef = useRef<HTMLDivElement>(null);
	const headingRef = useRef<HTMLHeadingElement>(null);
	const servicesGridRef = useRef<HTMLDivElement>(null);
	const rightContentRef = useRef<HTMLDivElement>(null);
	const logoRef = useRef<HTMLDivElement>(null);
	const dividerLineRef = useRef<HTMLDivElement>(null);
	const backButtonRef = useRef<HTMLButtonElement>(null);

	// Function to handle back button click
	const handleBackToServices = () => {
		// Play exit animation first
		const tl = gsap.timeline({
			onComplete: () => {
				// Call the provided callback when animation completes
				if (onBackClick) {
					onBackClick();
				} else if (typeof window !== 'undefined' && window.goBackToServices) {
					// Fallback to global function if available
					window.goBackToServices();
				}
			},
		});

		// Animate out the content
		tl.to(sectionDivRef.current, {
			opacity: 0,
			scale: 0.95,
			duration: 0.4,
			ease: 'power3.inOut',
		});

		return tl;
	};

	useEffect(() => {
		if (!sectionDivRef.current) return;

		// First animate in the back button with a bounce effect
		gsap.fromTo(
			backButtonRef.current,
			{
				opacity: 0,
				x: -30,
				scale: 0.9,
			},
			{
				opacity: 1,
				x: 0,
				scale: 1,
				duration: 0.6,
				delay: 0.2,
				ease: 'back.out(1.7)',
			}
		);

		// GSAP animations for the whole section
		const tl = gsap.timeline();

		// Initial scale and fade in for the entire section
		tl.fromTo(
			sectionDivRef.current,
			{
				opacity: 0,
				scale: 0.97,
			},
			{
				opacity: 1,
				scale: 1,
				duration: 0.8,
				ease: 'power3.out',
			}
		);

		// Animate the logo
		tl.fromTo(logoRef.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.7)' }, '-=0.4');

		// Animate the left side
		tl.fromTo(leftSideRef.current, { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }, '-=0.4');

		// Animate the main heading
		tl.fromTo(headingRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.5');

		// Animate services grid items with a staggered effect
		tl.fromTo(
			servicesGridRef.current?.children || [],
			{
				opacity: 0,
				y: 20,
				scale: 0.9,
			},
			{
				opacity: 1,
				y: 0,
				scale: 1,
				duration: 0.5,
				stagger: 0.1,
				ease: 'power2.out',
			},
			'-=0.3'
		);

		// Divider line animation
		tl.fromTo(dividerLineRef.current, { scaleX: 0, transformOrigin: 'left' }, { scaleX: 1, duration: 0.8, ease: 'power3.inOut' }, '-=1.5');

		// Animate the right side
		tl.fromTo(rightSideRef.current, { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }, '-=1.4');

		// Animate right side content with staggered entries
		tl.fromTo(
			rightContentRef.current?.children || [],
			{
				opacity: 0,
				y: 20,
				scale: 0.95,
			},
			{
				opacity: 1,
				y: 0,
				scale: 1,
				duration: 0.5,
				stagger: 0.15,
				ease: 'power2.out',
			},
			'-=0.6'
		);

		// Add a subtle floating animation to service items
		gsap.to('.service-item', {
			y: 5,
			duration: 2,
			stagger: 0.1,
			repeat: -1,
			yoyo: true,
			ease: 'sine.inOut',
		});

		// Store a reference to the button element to use in cleanup
		const buttonElement = backButtonRef.current;

		// Hover animation handlers
		const handleMouseEnter = () => {
			gsap.to(buttonElement, {
				scale: 1.05,
				duration: 0.2,
				ease: 'power1.out',
			});
		};

		const handleMouseLeave = () => {
			gsap.to(buttonElement, {
				scale: 1,
				duration: 0.2,
				ease: 'power1.out',
			});
		};

		// Add event listeners
		if (buttonElement) {
			buttonElement.addEventListener('mouseenter', handleMouseEnter);
			buttonElement.addEventListener('mouseleave', handleMouseLeave);
		}

		return () => {
			// Clean up all animations
			tl.kill();
			gsap.killTweensOf('.service-item');

			// Remove event listeners using the stored reference and functions
			if (buttonElement) {
				buttonElement.removeEventListener('mouseenter', handleMouseEnter);
				buttonElement.removeEventListener('mouseleave', handleMouseLeave);
			}
		};
	}, [onBackClick]);

	// Function to handle exit animations (will be used by parent component)
	const playExitAnimation = () => {
		if (!sectionDivRef.current) return;

		const tl = gsap.timeline();
		tl.to(sectionDivRef.current, {
			opacity: 0,
			scale: 0.95,
			duration: 0.4,
			ease: 'power3.inOut',
		});

		return tl;
	};

	// Make the function accessible to the parent
	if (typeof window !== 'undefined') {
		window.playServiceInfoExitAnimation = playExitAnimation;
	}

	return (
		<Section id='service-info' className='bg-white text-black relative'>
			{/* Single back button matching the image screenshot */}

			<motion.div ref={sectionDivRef} className='flex w-full h-full' style={{ position: 'relative', zIndex: 20 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.5 }}>
				{/* Left side with strategy heading and services list */}
				<motion.div className='w-1/2 p-10 flex flex-col' ref={leftSideRef}>
					<div className='mb-8' ref={logoRef}>
						<motion.button onClick={handleBackToServices} className='group flex items-center space-x-2 cursor-pointer' whileHover={{ x: -5 }} transition={{ type: 'spring', stiffness: 300 }}>
							<svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4 transform transition-transform duration-300 group-hover:-translate-x-1' viewBox='0 0 20 20' fill='currentColor'>
								<path fillRule='evenodd' d='M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z' clipRule='evenodd' />
							</svg>
							<span className='text-sm uppercase tracking-widest border-b border-transparent transition-all duration-300 group-hover:border-black'>RETURN TO SERVICES</span>
						</motion.button>
					</div>

					<div className='my-8'>
						<h1 className='text-4xl font-bold mb-6' ref={headingRef}>
							A full-service agency specialising in brand, audience, and creative research
						</h1>
					</div>

					<div className='grid grid-cols-2 gap-8 mt-10' ref={servicesGridRef}>
						<motion.div className='mb-6 service-item' whileHover={{ x: 8, scale: 1.05, transformOrigin: 'left' }} transition={{ type: 'spring', stiffness: 300 }}>
							<h3 className='text-sm uppercase font-bold tracking-widest mb-2'>RESEARCH</h3>
						</motion.div>

						<motion.div className='mb-6 service-item' whileHover={{ x: 8, scale: 1.05, transformOrigin: 'left' }} transition={{ type: 'spring', stiffness: 300 }}>
							<h3 className='text-sm uppercase font-bold tracking-widest mb-2'>BRANDING</h3>
						</motion.div>

						<motion.div className='mb-6 service-item' whileHover={{ x: 8, scale: 1.05, transformOrigin: 'left' }} transition={{ type: 'spring', stiffness: 300 }}>
							<h3 className='text-sm uppercase font-bold tracking-widest mb-2'>BESPOKE</h3>
							<h3 className='text-sm uppercase font-bold tracking-widest mb-2'>STRATEGY</h3>
						</motion.div>

						<motion.div className='mb-6 service-item' whileHover={{ x: 8, scale: 1.05, transformOrigin: 'left' }} transition={{ type: 'spring', stiffness: 300 }}>
							<h3 className='text-sm uppercase font-bold tracking-widest mb-2'>WEBSITE DEVELOPMENT</h3>
						</motion.div>

						<motion.div className='mb-6 service-item' whileHover={{ x: 8, scale: 1.05, transformOrigin: 'left' }} transition={{ type: 'spring', stiffness: 300 }}>
							<h3 className='text-sm uppercase font-bold tracking-widest mb-2'>BUSINESS PLANNING</h3>
						</motion.div>

						<motion.div className='mb-6 service-item' whileHover={{ x: 8, scale: 1.05, transformOrigin: 'left' }} transition={{ type: 'spring', stiffness: 300 }}>
							<h3 className='text-sm uppercase font-bold tracking-widest mb-2'>MARKETING</h3>
						</motion.div>
					</div>
				</motion.div>

				{/* Divider line */}
				<div className='h-full w-[1px] bg-gray-300' ref={dividerLineRef} style={{ transformOrigin: 'top' }}></div>

				{/* Right side with services details */}
				<motion.div className='w-1/2 p-10' ref={rightSideRef}>
					<div ref={rightContentRef}>
						<motion.h3 className='text-xl font-bold mb-4' whileHover={{ x: 5, color: '#333' }} transition={{ type: 'spring', stiffness: 300 }}>
							Services
						</motion.h3>

						<motion.p className='text-lg mb-10' whileHover={{ x: 5 }} transition={{ type: 'spring', stiffness: 300 }}>
							Our Approach
						</motion.p>

						<motion.div
							className='mb-8'
							whileInView={{
								opacity: 1,
								y: 0,
							}}
							initial={{ opacity: 0.8, y: 10 }}
							transition={{ duration: 0.8 }}
						>
							<motion.p className='mb-4' whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 200 }}>
								We use quantitative, qualitative, and AI-enhanced methodologies to dive deep into the complexities of human life.
							</motion.p>

							<motion.p className='mb-4' whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 200 }}>
								We start by understanding why you want to segment - is it long term growth strategy, is it to drive innovation in new markets or new audiences, or is it about finding efficiencies in your marketing strategy?
							</motion.p>

							<motion.p className='mb-4' whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 200 }}>
								Whether uncovering attitudinal nuances to refine messaging or identifying behavioural patterns to optimise retention, our segmentation strategies lead to smarter business decisions.
							</motion.p>
						</motion.div>

						<motion.div
							className='my-12 border-t border-gray-200 pt-4'
							whileHover={{ x: 5 }}
							whileInView={{
								opacity: 1,
								y: 0,
							}}
							initial={{ opacity: 0.8, y: 10 }}
							transition={{ duration: 0.5, delay: 0.1 }}
						>
							<h3 className='text-xl font-bold mb-4'>Curiosity</h3>
						</motion.div>

						<motion.div
							className='my-12 border-t border-gray-200 pt-4'
							whileHover={{ x: 5 }}
							whileInView={{
								opacity: 1,
								y: 0,
							}}
							initial={{ opacity: 0.8, y: 10 }}
							transition={{ duration: 0.5, delay: 0.2 }}
						>
							<h3 className='text-xl font-bold mb-4'>Conscience</h3>
						</motion.div>
					</div>
				</motion.div>
			</motion.div>
		</Section>
	);
}
