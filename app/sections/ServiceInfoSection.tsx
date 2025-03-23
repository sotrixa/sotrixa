'use client';

import React, { useEffect, useRef, useState } from 'react';
import Section from '../components/Section';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin only
if (typeof window !== 'undefined') {
	gsap.registerPlugin(ScrollTrigger);
}

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
	activeService?: string;
}

// Define service content interface
interface ServiceContent {
	title: string;
	description: string[];
	approachTitle: string;
	values: {
		title: string;
		content?: string;
	}[];
}

// Define interface for our custom letter elements
interface LetterElements {
	chars: HTMLSpanElement[];
	revert: () => void;
}

export default function ServiceInfoSection({ onBackClick, activeService: initialActiveService }: ServiceInfoSectionProps) {
	const sectionDivRef = useRef<HTMLDivElement>(null);
	const leftSideRef = useRef<HTMLDivElement>(null);
	const rightSideRef = useRef<HTMLDivElement>(null);
	const headingRef = useRef<HTMLHeadingElement>(null);
	const servicesGridRef = useRef<HTMLDivElement>(null);
	const rightContentRef = useRef<HTMLDivElement>(null);
	const logoRef = useRef<HTMLDivElement>(null);
	const dividerLineRef = useRef<HTMLDivElement>(null);
	const backButtonRef = useRef<HTMLButtonElement>(null);
	const servicesTitleRef = useRef<HTMLHeadingElement>(null);
	const approachTitleRef = useRef<HTMLParagraphElement>(null);
	const particlesRef = useRef<HTMLDivElement>(null);

	// Add state to track the active service
	const [activeService, setActiveService] = useState<string | undefined>(initialActiveService);
	// Store previous service for animations
	const prevServiceRef = useRef<string | undefined>(initialActiveService);

	// Add SVG knot animation references
	const knotRefs = useRef<Array<SVGSVGElement | null>>([]);

	// Add text element references for animations
	const serviceTitleRefs = useRef<(HTMLHeadingElement | null)[]>([]);
	// Update the type for the splitTextRefs
	const splitTextRefs = useRef<LetterElements[]>([]);

	// Service content definitions
	const serviceContents: Record<string, ServiceContent> = {
		RESEARCH: {
			title: 'A full-service agency specialising in brand, audience, and creative research',
			description: ['We use quantitative, qualitative, and AI-enhanced methodologies to dive deep into the complexities of human life.', 'We start by understanding why you want to segment - is it long term growth strategy, is it to drive innovation in new markets or new audiences, or is it about finding efficiencies in your marketing strategy?', 'Whether uncovering attitudinal nuances to refine messaging or identifying behavioural patterns to optimise retention, our segmentation strategies lead to smarter business decisions.'],
			approachTitle: 'Our Research Approach',
			values: [{ title: 'Curiosity' }, { title: 'Conscience' }],
		},
		BRANDING: {
			title: 'Building memorable brands that stand out in crowded markets',
			description: ['Our branding services create cohesive visual and verbal identities that resonate with your target audience.', 'We blend strategic thinking with creative execution to develop brands that are both distinctive and authentic.', 'From logo design to brand guidelines, we ensure your brand communicates consistently across all touchpoints.'],
			approachTitle: 'Our Branding Philosophy',
			values: [{ title: 'Authenticity' }, { title: 'Distinction' }],
		},
		'BESPOKE STRATEGY': {
			title: 'Custom strategies tailored to your unique business challenges',
			description: ['We develop bespoke strategies that address your specific business needs and market position.', 'Our strategic frameworks are built on deep market analysis and competitive insights.', 'We collaborate closely with your team to ensure strategies are both ambitious and achievable.'],
			approachTitle: 'Strategic Development Process',
			values: [{ title: 'Precision' }, { title: 'Adaptability' }],
		},
		'WEBSITE DEVELOPMENT': {
			title: 'Creating digital experiences that engage and convert',
			description: ['Our website development combines beautiful design with robust functionality.', 'We build responsive, accessible websites optimized for performance and search engines.', 'From e-commerce to content platforms, we create digital solutions that drive real business results.'],
			approachTitle: 'Our Development Methodology',
			values: [{ title: 'Usability' }, { title: 'Performance' }],
		},
		'BUSINESS PLANNING': {
			title: 'Comprehensive business planning for sustainable growth',
			description: ['We help businesses define clear paths to growth through detailed, actionable planning.', 'Our business plans incorporate market analysis, competitive positioning, and financial projections.', 'We focus on creating realistic roadmaps that can guide decision-making and attract investment.'],
			approachTitle: 'Business Planning Framework',
			values: [{ title: 'Clarity' }, { title: 'Foresight' }],
		},
		MARKETING: {
			title: 'Data-driven marketing that delivers measurable results',
			description: ['Our marketing services combine creative campaigns with analytical rigor.', 'We develop integrated marketing strategies across digital and traditional channels.', 'From social media to content marketing, we focus on connecting with audiences and driving conversions.'],
			approachTitle: 'Marketing Strategy Principles',
			values: [{ title: 'Creativity' }, { title: 'Measurement' }],
		},
	};

	// Get content based on active service or default to Research
	const currentContent = activeService && serviceContents[activeService] ? serviceContents[activeService] : serviceContents['RESEARCH'];

	// Create particles animation
	const createParticles = () => {
		if (!particlesRef.current) return;

		// Clear any existing particles first
		while (particlesRef.current.firstChild) {
			particlesRef.current.removeChild(particlesRef.current.firstChild);
		}

		// Create new particles
		for (let i = 0; i < 50; i++) {
			const particle = document.createElement('div');
			particle.className = 'absolute rounded-full bg-blue-500 opacity-0';
			particle.style.width = `${Math.random() * 6 + 2}px`;
			particle.style.height = particle.style.width;
			particlesRef.current.appendChild(particle);

			// Random position, making sure particles are within the container
			const x = Math.random() * 100; // percentage across width
			const y = Math.random() * 100; // percentage across height

			gsap.set(particle, {
				x: `${x}%`,
				y: `${y}%`,
				opacity: 0,
				scale: 0,
			});
		}
	};

	// Animate particles when service changes
	const animateParticles = () => {
		if (!particlesRef.current) return;

		const particles = particlesRef.current.children;

		gsap.to(particles, {
			opacity: 0,
			scale: 0,
			duration: 0.2,
			onComplete: () => {
				// Reset positions for next animation
				for (let i = 0; i < particles.length; i++) {
					const particle = particles[i];
					const x = Math.random() * 100;
					const y = Math.random() * 100;

					gsap.set(particle, {
						x: `${x}%`,
						y: `${y}%`,
					});
				}

				// Animate particles outward from center
				gsap.to(particles, {
					opacity: function () {
						return Math.random() * 0.5 + 0.1;
					},
					scale: function () {
						return Math.random() * 1 + 0.5;
					},
					duration: 1.5,
					stagger: 0.02,
					ease: 'power3.out',
					onComplete: () => {
						// Fade out slowly
						gsap.to(particles, {
							opacity: 0,
							duration: 2,
							stagger: 0.01,
							ease: 'power2.in',
						});
					},
				});
			},
		});
	};

	// Update animateLetterStagger function to work with our custom implementation
	const animateLetterStagger = (index: number) => {
		if (!serviceTitleRefs.current[index] || !splitTextRefs.current[index]) return;

		const split = splitTextRefs.current[index];

		// Timeline for letter animations
		const letterTl = gsap.timeline();

		// Animation sequence
		letterTl
			// First jump up each letter sequentially
			.to(split.chars, {
				y: -25,
				rotationX: -90,
				opacity: 0,
				stagger: 0.03,
				duration: 0.3,
				ease: 'back.in(2)',
			})
			// Then drop them back down in blue
			.to(
				split.chars,
				{
					y: 0,
					rotationX: 0,
					opacity: 1,
					color: '#2563eb',
					stagger: 0.03,
					duration: 0.3,
					ease: 'elastic.out(1, 0.5)',
					fontWeight: 'bold',
				},
				'+=0.1'
			)
			// Add a slight wave effect at the end
			.to(
				split.chars,
				{
					y: -5,
					stagger: {
						each: 0.02,
						from: 'start',
						grid: 'auto',
						ease: 'sine.inOut',
					},
					duration: 0.2,
					ease: 'sine.inOut',
					repeat: 1,
					yoyo: true,
				},
				'-=0.2'
			);

		return letterTl;
	};

	// Update resetLetterAnimation
	const resetLetterAnimation = (index: number) => {
		if (!splitTextRefs.current[index]) return;

		const split = splitTextRefs.current[index];

		gsap.to(split.chars, {
			y: 0,
			opacity: 1,
			color: '#000',
			fontWeight: 'bold',
			rotationX: 0,
			duration: 0.3,
			stagger: 0.02,
			ease: 'power1.out',
		});
	};

	// Update handleServiceClick to only animate the right side content
	const handleServiceClick = (service: string, index: number) => {
		if (service === activeService) return;

		prevServiceRef.current = activeService;
		setActiveService(service);

		// Find the index of the previously active service
		const prevIndex = ['RESEARCH', 'BRANDING', 'BESPOKE STRATEGY', 'WEBSITE DEVELOPMENT', 'BUSINESS PLANNING', 'MARKETING'].findIndex((s) => s === prevServiceRef.current);

		// Reset the previous service animation
		if (prevIndex >= 0 && serviceTitleRefs.current[prevIndex]) {
			resetLetterAnimation(prevIndex);
		}

		// Animate the letter stagger on the left side
		animateLetterStagger(index);

		// Trigger the particle animation when changing service
		animateParticles();
	};

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

		// Enhanced exit animation with particles
		animateParticles();

		// Create a wave-like exit animation
		tl.to(servicesGridRef.current?.children || [], {
			y: -30,
			opacity: 0,
			stagger: 0.03,
			duration: 0.3,
			ease: 'power2.in',
		})
			.to(
				headingRef.current,
				{
					y: -20,
					opacity: 0,
					duration: 0.3,
					ease: 'power2.in',
				},
				'-=0.2'
			)
			.to(
				rightContentRef.current?.children || [],
				{
					y: 20,
					opacity: 0,
					stagger: 0.03,
					duration: 0.3,
					ease: 'power2.in',
				},
				'-=0.4'
			)
			.to(sectionDivRef.current, {
				opacity: 0,
				scale: 0.95,
				duration: 0.4,
				ease: 'power3.inOut',
			});

		return tl;
	};

	useEffect(() => {
		if (!sectionDivRef.current) return;

		// Capture ref values at the beginning of the effect
		const sectionDivCurrent = sectionDivRef.current;
		const dividerLineCurrent = dividerLineRef.current;

		// Initialize particles
		createParticles();

		// Define createLetterAnimations inside useEffect
		const createLetterAnimations = () => {
			serviceTitleRefs.current.forEach((titleRef, index) => {
				if (!titleRef) return;

				// Store the original text content
				const originalText = titleRef.textContent || '';
				// Clear the element
				titleRef.innerHTML = '';

				// Create spans for each character
				const chars: HTMLSpanElement[] = [];

				// Split text into individual letters and wrap in spans
				originalText.split('').forEach((char) => {
					const charSpan = document.createElement('span');
					charSpan.className = 'letter-char';
					charSpan.textContent = char;
					charSpan.style.display = 'inline-block';
					charSpan.style.willChange = 'transform, opacity';
					titleRef.appendChild(charSpan);
					chars.push(charSpan);
				});

				// Create revert function to restore original text
				const revert = () => {
					if (titleRef) {
						titleRef.innerHTML = originalText;
					}
				};

				// Store reference to letter elements and revert function
				splitTextRefs.current[index] = {
					chars,
					revert,
				};

				// Set initial state of all letters
				gsap.set(chars, {
					y: 0,
					opacity: 1,
					rotationX: 0,
					rotationY: 0,
					transformOrigin: 'center center',
				});

				// Add hover animation for each service item
				const serviceItem = titleRef.closest('.service-item');
				if (serviceItem) {
					serviceItem.addEventListener('mouseenter', () => {
						if (activeService === ['RESEARCH', 'BRANDING', 'BESPOKE STRATEGY', 'WEBSITE DEVELOPMENT', 'BUSINESS PLANNING', 'MARKETING'][index]) return;

						gsap.to(chars, {
							y: -15,
							opacity: 1,
							stagger: 0.02,
							duration: 0.3,
							ease: 'back.out(2)',
							overwrite: true,
						});
					});

					serviceItem.addEventListener('mouseleave', () => {
						if (activeService === ['RESEARCH', 'BRANDING', 'BESPOKE STRATEGY', 'WEBSITE DEVELOPMENT', 'BUSINESS PLANNING', 'MARKETING'][index]) return;

						gsap.to(chars, {
							y: 0,
							opacity: 1,
							stagger: 0.01,
							duration: 0.2,
							ease: 'power1.out',
							overwrite: true,
						});
					});
				}
			});
		};

		// Initialize split text animations after a slight delay to ensure DOM is ready
		setTimeout(() => {
			createLetterAnimations();
		}, 100);

		// Initialize text styles for service titles based on current activeService
		serviceTitleRefs.current.forEach((titleRef, index) => {
			if (titleRef) {
				const service = ['RESEARCH', 'BRANDING', 'BESPOKE STRATEGY', 'WEBSITE DEVELOPMENT', 'BUSINESS PLANNING', 'MARKETING'][index];

				// Set initial styles
				gsap.set(titleRef, {
					letterSpacing: '0.05em',
					color: activeService === service ? '#2563eb' : '#000',
					fontWeight: 'bold',
					textShadow: activeService === service ? '0 0 3px rgba(37,99,235,0.2)' : 'none',
				});

				// If there's an active service on initial load, animate its knot
				if (activeService === service) {
					gsap.to(titleRef, {
						color: '#2563eb',
						fontWeight: 'bold',
						duration: 0.3,
					});
				}
			}
		});

		// Initialize all knots in hidden state
		knotRefs.current.forEach((knotRef, index) => {
			if (knotRef) {
				const paths = knotRef.querySelectorAll('path');
				gsap.set(paths, {
					strokeDasharray: '100%',
					strokeDashoffset: '100%',
					opacity: 0.3,
				});

				// If there's an active service on initial load, tie its knot
				if (activeService === ['RESEARCH', 'BRANDING', 'BESPOKE STRATEGY', 'WEBSITE DEVELOPMENT', 'BUSINESS PLANNING', 'MARKETING'][index]) {
					gsap.to(paths, {
						strokeDashoffset: 0,
						opacity: 1,
						duration: 0.4,
						stagger: 0.1,
					});
				}
			}
		});

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

		// Initial entrance animations for section components
		if (sectionDivCurrent) {
			gsap.fromTo(
				sectionDivCurrent,
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
		}

		// Animate the divider line with glow effect
		if (dividerLineCurrent) {
			gsap.fromTo(
				dividerLineCurrent,
				{
					scaleX: 0,
					transformOrigin: 'left',
				},
				{
					scaleX: 1,
					duration: 0.8,
					ease: 'power3.inOut',
				}
			);
		}

		// Initial particle animation
		animateParticles();

		// Capture the splitTextRefs.current value inside the effect to use in cleanup
		const splitTextRefsCurrent = splitTextRefs.current;

		return () => {
			// Clean up all animations
			gsap.killTweensOf(sectionDivCurrent);
			gsap.killTweensOf(dividerLineCurrent);
			gsap.killTweensOf('.service-item');

			// Revert split text using the captured value
			splitTextRefsCurrent.forEach((split) => {
				if (split && split.revert) split.revert();
			});

			// Kill all ScrollTriggers
			if (typeof ScrollTrigger !== 'undefined') {
				ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
			}

			// Simple cleanup - let browser handle removing listeners when elements are destroyed
			// No need to explicitly remove listeners when component unmounts
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [onBackClick]); // activeService intentionally omitted to prevent "changed size between renders" error

	// Function to handle exit animations (will be used by parent component)
	const playExitAnimation = () => {
		if (!sectionDivRef.current) return;

		const tl = gsap.timeline();

		// Trigger particle effect for exit
		animateParticles();

		// Sequential exit animation for a more dramatic effect
		tl.to(rightSideRef.current, {
			opacity: 0,
			x: 30,
			duration: 0.3,
			ease: 'power2.in',
		})
			.to(
				dividerLineRef.current,
				{
					scaleY: 0,
					duration: 0.2,
					ease: 'power1.in',
				},
				'-=0.1'
			)
			.to(
				leftSideRef.current,
				{
					opacity: 0,
					x: -30,
					duration: 0.3,
					ease: 'power2.in',
				},
				'-=0.2'
			)
			.to(sectionDivRef.current, {
				opacity: 0,
				scale: 0.95,
				duration: 0.3,
				ease: 'power3.in',
			});

		return tl;
	};

	// Make the function accessible to the parent
	if (typeof window !== 'undefined') {
		window.playServiceInfoExitAnimation = playExitAnimation;
	}

	return (
		<Section id='service-info' className='bg-white text-black relative overflow-hidden'>
			{/* Particles container for animated effects */}
			<div ref={particlesRef} className='absolute inset-0 pointer-events-none z-10'></div>

			<div ref={sectionDivRef} className='flex w-full h-full relative z-20'>
				{/* Left side with strategy heading and services list */}
				<div className='w-1/2 p-10 flex flex-col' ref={leftSideRef}>
					<div className='mb-8' ref={logoRef}>
						<button onClick={handleBackToServices} ref={backButtonRef} className='group flex items-center space-x-2 cursor-pointer'>
							<svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4 transform transition-transform duration-300 group-hover:-translate-x-1' viewBox='0 0 20 20' fill='currentColor'>
								<path fillRule='evenodd' d='M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z' clipRule='evenodd' />
							</svg>
							<span className='text-sm uppercase tracking-widest border-b border-transparent transition-all duration-300 group-hover:border-black'>RETURN TO SERVICES</span>
						</button>
					</div>

					<div className='my-8'>
						<h1 className='text-4xl font-bold mb-6' ref={headingRef}>
							{currentContent.title}
						</h1>
					</div>

					<div className='grid grid-cols-2 gap-8 mt-10' ref={servicesGridRef}>
						{['RESEARCH', 'BRANDING', 'BESPOKE STRATEGY', 'WEBSITE DEVELOPMENT', 'BUSINESS PLANNING', 'MARKETING'].map((service, index) => (
							<div key={service} className={`mb-6 service-item ${activeService === service ? 'active-service' : ''}`} onClick={() => handleServiceClick(service, index)} style={{ cursor: 'pointer' }}>
								{service === 'BESPOKE STRATEGY' ? (
									<div>
										<h3
											ref={(el) => {
												serviceTitleRefs.current[index] = el;
											}}
											className={`text-xl uppercase font-bold tracking-widest mb-2 ${activeService === service ? 'text-blue-600' : ''}`}
										>
											BESPOKE STRATEGY
										</h3>
									</div>
								) : (
									<h3
										ref={(el) => {
											serviceTitleRefs.current[index] = el;
										}}
										className={`text-xl uppercase font-bold tracking-widest mb-2 ${activeService === service ? 'text-blue-600' : ''}`}
									>
										{service}
									</h3>
								)}

								{activeService === service && <div className='h-1 w-10 bg-blue-600 mt-1'></div>}
							</div>
						))}
					</div>
				</div>

				{/* Divider line */}
				<div className='h-full w-[1px] bg-gray-300' ref={dividerLineRef} style={{ transformOrigin: 'top' }}></div>

				{/* Right side with services details */}
				<div className='w-1/2 p-10' ref={rightSideRef}>
					<AnimatePresence mode='wait'>
						<motion.div ref={rightContentRef} key={activeService} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
							<h3 ref={servicesTitleRef} className='text-xl font-bold mb-4'>
								Services
							</h3>

							<p ref={approachTitleRef} className='text-lg mb-10'>
								{currentContent.approachTitle}
							</p>

							<div className='mb-8'>
								{currentContent.description.map((paragraph, index) => (
									<p key={index} className='mb-4'>
										{paragraph}
									</p>
								))}
							</div>

							{currentContent.values.map((value, index) => (
								<div key={index} className='my-12 border-t border-gray-200 pt-4 value-item'>
									<h3 className='text-xl font-bold mb-4'>{value.title}</h3>
									{value.content && <p className='text-gray-700'>{value.content}</p>}
								</div>
							))}
						</motion.div>
					</AnimatePresence>
				</div>
			</div>
		</Section>
	);
}
