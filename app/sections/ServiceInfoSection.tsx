'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
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
}

// Define interface for our custom letter elements
interface LetterElements {
	chars: HTMLSpanElement[];
	revert: () => void;
}

// Define interface for the GearSVG component props
interface GearSVGProps {
	size: number;
	toothCount: number;
	color: string;
	opacity: number;
	className?: string;
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
	const particlesRef = useRef<HTMLDivElement>(null);
	const gridBackgroundRef = useRef<HTMLDivElement>(null);
	const gearRefs = useRef<Array<SVGSVGElement | null>>([]);

	// Add state to track the active service
	const [activeService, setActiveService] = useState<string | undefined>(initialActiveService);
	// Store previous service for animations
	const prevServiceRef = useRef<string | undefined>(initialActiveService);

	// Add text element references for animations
	const serviceTitleRefs = useRef<(HTMLHeadingElement | null)[]>([]);
	// Update the type for the splitTextRefs
	const splitTextRefs = useRef<LetterElements[]>([]);

	// Create a function to generate a gear SVG with customizable parameters
	const GearSVG = ({ size, toothCount, color, opacity, className }: GearSVGProps) => {
		// Calculate gear parameters
		const outerRadius = size / 2;
		const innerRadius = outerRadius * 0.7;
		const toothHeight = outerRadius * 0.2;
		const centerHoleRadius = outerRadius * 0.2;

		// Generate points for the gear path
		const points = [];
		for (let i = 0; i < toothCount; i++) {
			const angle = (i / toothCount) * Math.PI * 2;
			const nextAngle = ((i + 0.5) / toothCount) * Math.PI * 2;
			const nextNextAngle = ((i + 1) / toothCount) * Math.PI * 2;

			// Inner point before tooth
			points.push([innerRadius * Math.cos(angle), innerRadius * Math.sin(angle)]);

			// Outer point (tooth peak)
			points.push([(outerRadius + toothHeight) * Math.cos(nextAngle), (outerRadius + toothHeight) * Math.sin(nextAngle)]);

			// Inner point after tooth
			points.push([innerRadius * Math.cos(nextNextAngle), innerRadius * Math.sin(nextNextAngle)]);
		}

		// Generate the SVG path
		let pathData = 'M ';
		points.forEach((point, index) => {
			if (index === 0) {
				pathData += `${point[0]},${point[1]} `;
			} else {
				pathData += `L ${point[0]},${point[1]} `;
			}
		});
		pathData += 'Z';

		return (
			<svg width={size} height={size} viewBox={`${-outerRadius - toothHeight} ${-outerRadius - toothHeight} ${(outerRadius + toothHeight) * 2} ${(outerRadius + toothHeight) * 2}`} className={className}>
				<path d={pathData} fill='none' stroke={color} strokeWidth={1} opacity={opacity} transform='translate(0, 0)' />
				<circle cx='0' cy='0' r={centerHoleRadius} fill='none' stroke={color} strokeWidth={1} opacity={opacity} />
				{/* Add some spokes for a more mechanical look */}
				{[...Array(Math.min(toothCount / 2, 6))].map((_, i) => {
					const angle = (i / Math.min(toothCount / 2, 6)) * Math.PI * 2;
					return <line key={i} x1={centerHoleRadius * Math.cos(angle)} y1={centerHoleRadius * Math.sin(angle)} x2={innerRadius * 0.9 * Math.cos(angle)} y2={innerRadius * 0.9 * Math.sin(angle)} stroke={color} strokeWidth={1} opacity={opacity} />;
				})}
			</svg>
		);
	};

	// Service content definitions
	const serviceContents: Record<string, ServiceContent> = {
		RESEARCH: {
			title: 'Deep research, nuanced insight, and future-facing signals that shape powerful strategies',
			description: ['At Sotrixa, research is a journey of co-discovery—driven by curiosity, shaped by context, and grounded in your vision.​', 'Together, we listen between the lines, observe subtle patterns, and trace emerging signals that guide strategic decisions.​', 'By blending human stories with data-driven insights, we craft nuanced research journeys—through in-depth interviews, thoughtful surveys, cultural listening, and pattern-sensing.​', '', 'What we uncover together:​', '• Category Analysis – Understand the shifts and undercurrents defining your space.​', '• Competitive Analysis – Gain a clear view of your landscape and your distinction.​', '• Consumer Behavior Insights – Explore the drivers, desires, and needs of your audience.​', "• Trend Scanning & Forecasting – Anticipate what's next and move ahead of the current.​", '• Audience Segmentation – Map real people with real stories and needs—not just numbers.​', '', 'Our findings become a living compass for everything we build together.'],
		},
		'BUSINESS ARCHITECTURE': {
			title: 'Turning vision into a structured, evolving business—ready for real-world growth',
			description: ['Every idea holds immense potential, but to thrive, it needs form, coherence, and a structure that sustains growth.​', 'At Sotrixa, we shape the fundamental elements of your business—what you offer, how you function, and the role you are meant to play.​', 'Through co-creation, we translate concepts into frameworks and possibilities into actionable plans.​', '', 'What we shape together:​', '• Business Model Design – Create a structure that sustains value creation and growth.​', '• Offer Design & Positioning – Shape your offerings with clarity, meaning, and distinction.​', '• Operational Frameworks – Map systems and processes for consistency and focus.​', '• Mission, Vision & Values – Define the deeper truths that guide your evolution.​', '• Growth Pathways – Strategize how to expand, shift, or scale intentionally over time.​', '', 'This is where your business becomes an aligned, living structure—ready for strategy and movement.'],
		},
		'BESPOKE STRATEGY CREATION': {
			title: 'Precision-crafted roadmaps that move your vision forward with clarity, coherence, and purpose',
			description: ['No two businesses move at the same rhythm.​', 'At Sotrixa, strategy honors your unique goals, capacity, and context—designing roadmaps that are intelligent, flexible, and fully aligned with your evolution.​', 'Whether you are launching something new, expanding reach, refining an offer, or exploring partnerships, each strategic layer moves vision into structured, sustainable momentum.​', 'From go-to-market approaches and visibility plans to audience engagement, growth models, and positioning strategies—every element is crafted to create meaningful forward motion.'],
		},
		BRANDING: {
			title: "Bringing your business's true story to life—visually, verbally, and emotionally",
			description: ['A brand is the memory, the feeling, the story people carry after they meet you.​', 'At Sotrixa, branding is an act of alignment: we listen deeply to what your business is becoming and translate that into visual and verbal identities that feel alive and true.​', 'We create logos, color palettes, typography, design elements, and voice and tone guidelines—crafted with precision and emotional resonance.​', 'More than an aesthetic, your brand becomes an invitation: a true reflection of your story, ready to connect and inspire.'],
		},
		MARKETING: {
			title: 'Expanding your presence with soulful marketing strategies that resonate and move',
			description: ['Marketing is the movement of your story into the world—the choreography of voice, vision, and presence.​', 'At Sotrixa, we craft marketing strategies that are intelligent, soulful, and grounded in authenticity.​', 'From channel strategies and campaign direction to content pillars, creative activations, and collaborations, every element amplifies your voice and expands your reach with coherence, clarity, and impact.​', "Your story doesn't just travel—it moves, it resonates, it builds momentum."],
		},
		'WEBSITE DEVELOPMENT': {
			title: 'Crafting websites where form meets feeling, and strategy becomes tangible experience',
			description: ['Your website is the home of your vision—where strategy meets experience and form meets feeling.​', "At Sotrixa, we design digital spaces that are not only beautiful but deeply functional—reflecting your brand's essence while guiding your audience into connection and action.​", 'Rooted in clarity, crafted with care, your website becomes a living, evolving expression of everything you stand for.​', "It's where presence becomes tangible—and impact begins."],
		},
	};

	// Get content based on active service or default to Research
	const currentContent = activeService && serviceContents[activeService] ? serviceContents[activeService] : serviceContents['RESEARCH'];

	// Create particles animation with colorful gradient-inspired particles
	const createParticles = () => {
		if (!particlesRef.current) return;

		// Clear any existing particles first
		while (particlesRef.current.firstChild) {
			particlesRef.current.removeChild(particlesRef.current.firstChild);
		}

		// Colors matching ServicesSection gradient
		const colors = [
			'bg-[#f4dd65]', // yellow
			'bg-[#d142e2]', // purple
			'bg-[#70DFC6]', // teal
			'bg-[#F5A623]', // orange
			'bg-[#9F7AEA]', // lavender
		];

		// Create variety of particle shapes
		const shapes = [
			'rounded-full', // circle
			'rounded-sm', // near square
			'rounded-lg', // rounded square
		];

		// Create new particles
		for (let i = 0; i < 50; i++) {
			const particle = document.createElement('div');
			const color = colors[Math.floor(Math.random() * colors.length)];
			const shape = shapes[Math.floor(Math.random() * shapes.length)];

			particle.className = `absolute ${shape} ${color} opacity-0`;

			// Vary the size
			const size = Math.random() * 8 + 2;
			particle.style.width = `${size}px`;
			particle.style.height = `${size}px`;

			// Add a subtle shadow for more depth
			particle.style.boxShadow = '0 1px 2px rgba(0,0,0,0.1)';

			particlesRef.current.appendChild(particle);

			// Random position, making sure particles are within the container
			const x = Math.random() * 100; // percentage across width
			const y = Math.random() * 100; // percentage across height

			gsap.set(particle, {
				x: `${x}%`,
				y: `${y}%`,
				opacity: 0,
				scale: 0,
				rotation: Math.random() * 360, // random rotation for more dynamic feel
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

		// Animation sequence for vertical orientation
		letterTl
			// First slide sideways for vertical orientation
			.to(split.chars, {
				x: -15,
				rotationY: -90,
				opacity: 0,
				stagger: 0.03,
				duration: 0.3,
				ease: 'back.in(2)',
			})
			// Then bring them back with color
			.to(
				split.chars,
				{
					x: 0,
					rotationY: 0,
					opacity: 1,
					color: '#d142e2',
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
					x: -3,
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

	// Update resetLetterAnimation for horizontal movement
	const resetLetterAnimation = (index: number) => {
		if (!splitTextRefs.current[index]) return;

		const split = splitTextRefs.current[index];

		gsap.to(split.chars, {
			x: 0,
			opacity: 1,
			color: '#000',
			fontWeight: 'bold',
			rotationY: 0,
			duration: 0.3,
			stagger: 0.02,
			ease: 'power1.out',
		});
	};

	// Define service items with icons using useMemo
	const serviceItems = useMemo(
		() => [
			{ name: 'RESEARCH', icon: '🔍' },
			{ name: 'BUSINESS ARCHITECTURE', icon: '🏛️' },
			{ name: 'BESPOKE STRATEGY CREATION', icon: '🧩' },
			{ name: 'BRANDING', icon: '✨' },
			{ name: 'MARKETING', icon: '📊' },
			{ name: 'WEBSITE DEVELOPMENT', icon: '💻' },
		],
		[]
	);

	// Function to handle exit animations (will be used by parent component)
	const playExitAnimation = () => {
		if (!sectionDivRef.current) return;

		const tl = gsap.timeline();

		// Trigger particle effect for exit
		animateParticles();

		// Collect all carousel items
		const carouselItems = Array.from(servicesGridRef.current?.querySelectorAll('.service-item') || []);

		// Create a flash effect
		const flashOverlay = document.createElement('div');
		flashOverlay.className = 'absolute inset-0 bg-gradient-to-r from-[#f4dd65] via-[#d142e2] to-[#70DFC6] pointer-events-none z-50';
		flashOverlay.style.opacity = '0';
		sectionDivRef.current.appendChild(flashOverlay);

		// Flash effect
		tl.to(flashOverlay, {
			opacity: 0.1,
			duration: 0.2,
			ease: 'power1.in',
			onComplete: () => {
				gsap.to(flashOverlay, {
					opacity: 0,
					duration: 0.5,
					ease: 'power2.out',
					onComplete: () => {
						if (flashOverlay.parentNode) {
							flashOverlay.parentNode.removeChild(flashOverlay);
						}
					},
				});
			},
		});

		// Stylish exit animation adapted for vertical carousel
		tl.to(
			carouselItems,
			{
				x: -20,
				opacity: 0,
				stagger: 0.03,
				duration: 0.4,
				ease: 'power2.in',
			},
			'-=0.1'
		)
			.to(
				headingRef.current,
				{
					y: -15,
					opacity: 0,
					duration: 0.3,
					ease: 'power2.in',
				},
				'-=0.3'
			)
			.to(
				rightContentRef.current,
				{
					opacity: 0,
					y: 15,
					duration: 0.4,
					ease: 'power2.in',
				},
				'-=0.3'
			)
			.to(
				sectionDivRef.current,
				{
					opacity: 0,
					scale: 0.98,
					duration: 0.4,
					ease: 'power3.in',
				},
				'-=0.2'
			);

		return tl;
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

		// Collect all carousel items
		const carouselItems = Array.from(servicesGridRef.current?.querySelectorAll('.service-item') || []);

		// Create a wave-like exit animation for vertical carousel
		tl.to(carouselItems, {
			x: -30,
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

	// Function to render title with colored keywords
	const renderStyledTitle = (title: string, service: string) => {
		// Define color mappings for each service
		const colorMappings: Record<string, Record<string, string>> = {
			RESEARCH: {
				research: 'text-[#D142E2]',
				signals: 'text-[#71DDC6]',
				strategies: 'text-[#F4DD65]',
			},
			'BUSINESS ARCHITECTURE': {
				vision: 'text-[#D142E2]',
				structured: 'text-[#71DDC6]',
				growth: 'text-[#F4DD65]',
			},
			'BESPOKE STRATEGY CREATION': {
				vision: 'text-[#D142E2]',
				clarity: 'text-[#71DDC6]',
				purpose: 'text-[#F4DD65]',
			},
			BRANDING: {
				Bringing: 'text-[#D142E2]',
				story: 'text-[#71DDC6]',
				emotionally: 'text-[#F4DD65]',
			},
			MARKETING: {
				presence: 'text-[#D142E2]',
				strategies: 'text-[#71DDC6]',
				move: 'text-[#F4DD65]',
			},
			'WEBSITE DEVELOPMENT': {
				websites: 'text-[#D142E2]',
				feeling: 'text-[#71DDC6]',
				experience: 'text-[#F4DD65]',
			},
		};

		const colors = colorMappings[service] || {};

		// Split title into words and apply colors
		const words = title.split(' ');

		return (
			<span>
				{words.map((word, index) => {
					// Remove punctuation to check for color mapping
					const cleanWord = word.replace(/[.,!?;:]$/, '');
					const punctuation = word.match(/[.,!?;:]$/)?.[0] || '';
					const colorClass = colors[cleanWord];

					return (
						<span key={index}>
							{colorClass ? <span className={colorClass}>{cleanWord}</span> : cleanWord}
							{punctuation}
							{index < words.length - 1 ? ' ' : ''}
						</span>
					);
				})}
			</span>
		);
	};

	useEffect(() => {
		if (!sectionDivRef.current) return;

		// Capture ref values at the beginning of the effect
		const sectionDivCurrent = sectionDivRef.current;
		const dividerLineCurrent = dividerLineRef.current;
		const gridBackgroundCurrent = gridBackgroundRef.current;
		const gearRefsCurrent = [...gearRefs.current]; // Create a copy of the current array

		// Initialize particles
		createParticles();

		// Animate the grid background
		if (gridBackgroundCurrent) {
			// Initial position
			gsap.set(gridBackgroundCurrent, {
				backgroundPosition: '0px 0px',
			});

			// Create continuous animation for grid movement
			gsap.to(gridBackgroundCurrent, {
				backgroundPosition: '40px 40px',
				duration: 8,
				ease: 'linear',
				repeat: -1, // Infinite repetition
			});
		}

		// Animate the gears with continuous rotation
		gearRefsCurrent.forEach((gearRef, index) => {
			if (!gearRef) return;

			// Set initial rotation
			gsap.set(gearRef, {
				rotation: Math.random() * 360,
				transformOrigin: 'center center',
			});

			// Create rotation animation with alternating directions
			gsap.to(gearRef, {
				rotation: index % 2 === 0 ? '+=360' : '-=360', // Alternate rotation direction
				duration: 20 + index * 5, // Vary the speed for each gear
				ease: 'none',
				repeat: -1,
			});
		});

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
					charSpan.style.fontSize = 'inherit';
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
						if (activeService === ['CREATED TO MATTER', 'RESEARCH', 'BUSINESS ARCHITECTURE', 'BESPOKE STRATEGY CREATION', 'BRANDING', 'MARKETING', 'WEBSITE DEVELOPMENT'][index]) return;

						// Enhanced hover animation
						gsap.to(chars, {
							y: -5, // Reduced movement from -15 to -5 for subtlety
							x: 2, // Slight shift right
							opacity: 1,
							scale: 1.05, // Slight scale up
							color: '#d142e2', // Match the purple from gradient
							stagger: 0.01, // Faster stagger for more professional feel
							duration: 0.25,
							ease: 'power2.out',
							overwrite: true,
						});
					});

					serviceItem.addEventListener('mouseleave', () => {
						if (activeService === ['CREATED TO MATTER', 'RESEARCH', 'BUSINESS ARCHITECTURE', 'BESPOKE STRATEGY CREATION', 'BRANDING', 'MARKETING', 'WEBSITE DEVELOPMENT'][index]) return;

						// Smoother reset animation
						gsap.to(chars, {
							y: 0,
							x: 0,
							scale: 1,
							opacity: 1,
							color: '#333', // Dark gray instead of pure black for better readability
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
				const service = ['CREATED TO MATTER', 'RESEARCH', 'BUSINESS ARCHITECTURE', 'BESPOKE STRATEGY CREATION', 'BRANDING', 'MARKETING', 'WEBSITE DEVELOPMENT'][index];

				// Set initial styles - change blue to gradient purple
				gsap.set(titleRef, {
					letterSpacing: '0.05em',
					color: activeService === service ? '#d142e2' : '#333', // Changed from blue to purple, and #000 to #333
					fontWeight: 'bold',
					textShadow: activeService === service ? '0 0 3px rgba(209,66,226,0.3)' : 'none', // Updated shadow color
				});

				// If there's an active service on initial load, animate its text
				if (activeService === service) {
					gsap.to(titleRef, {
						color: '#d142e2', // Changed from blue to purple
						fontWeight: 'bold',
						duration: 0.3,
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
			if (gridBackgroundCurrent) {
				gsap.killTweensOf(gridBackgroundCurrent);
			}

			// Clean up gear animations using the captured array
			gearRefsCurrent.forEach((gearRef) => {
				if (gearRef) {
					gsap.killTweensOf(gearRef);
				}
			});

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

	// Make the function accessible to the parent
	if (typeof window !== 'undefined') {
		window.playServiceInfoExitAnimation = playExitAnimation;
	}

	return (
		<Section id='service-info' className='bg-[#FAFAFA] text-black p-4 sm:p-6 relative overflow-hidden min-h-screen'>
			{/* Animated grid background */}
			<div
				ref={gridBackgroundRef}
				className='absolute inset-0 z-0 opacity-40'
				style={{
					backgroundImage: `
						linear-gradient(to right, rgba(150,150,150,0.12) 1px, transparent 1px),
						linear-gradient(to bottom, rgba(150,150,150,0.12) 1px, transparent 1px),
						linear-gradient(45deg, rgba(150,150,150,0.05) 25%, transparent 25%, transparent 75%, rgba(150,150,150,0.05) 75%, rgba(150,150,150,0.05)),
						linear-gradient(135deg, rgba(150,150,150,0.05) 25%, transparent 25%, transparent 75%, rgba(150,150,150,0.05) 75%, rgba(150,150,150,0.05))
					`,
					backgroundSize: '40px 40px, 40px 40px, 80px 80px, 80px 80px',
					backgroundPosition: '0 0, 0 0, 0 0, 0 0',
				}}
			></div>

			{/* Gear decorative elements */}
			<div className='absolute top-[15%] left-[10%] z-0 opacity-25'>
				<svg
					ref={(el) => {
						if (el) gearRefs.current[0] = el;
					}}
				>
					<GearSVG size={180} toothCount={12} color='#888' opacity={0.25} />
				</svg>
			</div>

			<div className='absolute top-[25%] left-[18%] z-0 opacity-20'>
				<svg
					ref={(el) => {
						if (el) gearRefs.current[1] = el;
					}}
				>
					<GearSVG size={120} toothCount={10} color='#666' opacity={0.2} />
				</svg>
			</div>

			<div className='absolute bottom-[30%] right-[15%] z-0 opacity-25'>
				<svg
					ref={(el) => {
						if (el) gearRefs.current[2] = el;
					}}
				>
					<GearSVG size={200} toothCount={16} color='#888' opacity={0.25} />
				</svg>
			</div>

			<div className='absolute bottom-[20%] right-[25%] z-0 opacity-20'>
				<svg
					ref={(el) => {
						if (el) gearRefs.current[3] = el;
					}}
				>
					<GearSVG size={150} toothCount={14} color='#777' opacity={0.15} />
				</svg>
			</div>

			<div className='absolute top-[60%] left-[5%] z-0 opacity-15'>
				<svg
					ref={(el) => {
						if (el) gearRefs.current[4] = el;
					}}
				>
					<GearSVG size={100} toothCount={8} color='#999' opacity={0.15} />
				</svg>
			</div>

			{/* Abstract lines */}
			<div className='absolute top-[30%] left-0 w-[25%] h-[2px] bg-gradient-to-r from-transparent via-gray-400 to-transparent opacity-30'></div>
			<div className='absolute bottom-[40%] right-0 w-[30%] h-[2px] bg-gradient-to-l from-transparent via-gray-400 to-transparent opacity-30'></div>

			{/* Dots grid in one corner */}
			<div
				className='absolute top-0 right-0 w-[150px] sm:w-[300px] h-[150px] sm:h-[300px] opacity-20'
				style={{
					backgroundImage: 'radial-gradient(circle, rgba(100,100,100,0.7) 2px, transparent 2px)',
					backgroundSize: '20px 20px',
				}}
			></div>

			{/* Particles container for animated effects */}
			<div ref={particlesRef} className='absolute inset-0 pointer-events-none z-10'></div>

			<div ref={sectionDivRef} className='flex flex-col md:flex-row w-full h-full relative z-20 mx-auto my-8 mt-0'>
				{/* Left side with strategy heading and services list */}
				<div className='w-full md:w-1/2 p-4 md:p-6 flex flex-col justify-center min-h-screen md:min-h-full' ref={leftSideRef}>
					<div className='mb-6' ref={logoRef}>
						<button onClick={handleBackToServices} ref={backButtonRef} className='group flex items-center space-x-2 cursor-pointer text-black hover:text-[#f4dd65] transition-colors duration-300'>
							<svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 transform transition-transform duration-300 group-hover:-translate-x-1' viewBox='0 0 20 20' fill='currentColor'>
								<path fillRule='evenodd' d='M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z' clipRule='evenodd' />
							</svg>
							<span className='text-sm uppercase tracking-widest'>RETURN TO SERVICES</span>
						</button>
					</div>

					<div className='mb-6'>
						<h1 className='!text-4xl md:!text-5xl lg:!text-5xl font-bold mb-0' ref={headingRef}>
							{activeService && serviceContents[activeService] ? renderStyledTitle(serviceContents[activeService].title, activeService) : <span className='text-transparent bg-clip-text bg-gradient-to-r from-[#f4dd65] via-[#d142e2] to-[#70DFC6]'>{currentContent.title}</span>}
						</h1>
					</div>

					{/* Navigation arrows to change services */}
					<div className='mt-12 relative' ref={servicesGridRef}>
						{/* Navigation with arrows and dots */}
						<div className='flex items-center justify-start space-x-6'>
							{/* Left arrow with text */}
							<button
								onClick={() => {
									const currentIndex = serviceItems.findIndex((item) => item.name === activeService);
									const prevIndex = currentIndex > 0 ? currentIndex - 1 : serviceItems.length - 1;
									const newService = serviceItems[prevIndex].name;

									prevServiceRef.current = activeService;
									setActiveService(newService);

									// Reset previous service animation
									if (serviceTitleRefs.current[currentIndex]) {
										resetLetterAnimation(currentIndex);
									}

									// Animate new service
									animateLetterStagger(prevIndex);
									animateParticles();
								}}
								className='group flex items-center space-x-3 text-black hover:text-[#d142e2] transition-all duration-300'
								aria-label='Previous service'
							>
								<svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6 transition-colors duration-300' viewBox='0 0 20 20' fill='currentColor'>
									<path fillRule='evenodd' d='M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z' clipRule='evenodd' />
								</svg>
								<span className='text-sm font-medium tracking-wide transition-colors duration-300'>Previous service</span>
							</button>

							{/* Service dots indicator */}
							<div className='flex space-x-2'>
								{serviceItems.map((item, index) => (
									<button
										key={index}
										className={`h-3 w-3 rounded-full transition-all ${activeService === item.name ? 'bg-black' : 'bg-gray-400 hover:bg-gray-500'}`}
										onClick={() => {
											const currentIndex = serviceItems.findIndex((service) => service.name === activeService);

											prevServiceRef.current = activeService;
											setActiveService(item.name);

											// Reset previous service animation
											if (serviceTitleRefs.current[currentIndex]) {
												resetLetterAnimation(currentIndex);
											}

											// Animate new service
											animateLetterStagger(index);
											animateParticles();
										}}
										aria-label={`Go to ${item.name}`}
									/>
								))}
							</div>

							{/* Right arrow with text */}
							<button
								onClick={() => {
									const currentIndex = serviceItems.findIndex((item) => item.name === activeService);
									const nextIndex = currentIndex < serviceItems.length - 1 ? currentIndex + 1 : 0;
									const newService = serviceItems[nextIndex].name;

									prevServiceRef.current = activeService;
									setActiveService(newService);

									// Reset previous service animation
									if (serviceTitleRefs.current[currentIndex]) {
										resetLetterAnimation(currentIndex);
									}

									// Animate new service
									animateLetterStagger(nextIndex);
									animateParticles();
								}}
								className='group flex items-center space-x-3 text-black hover:text-[#d142e2] transition-all duration-300'
								aria-label='Next service'
							>
								<span className='text-sm font-medium tracking-wide transition-colors duration-300'>See next Service</span>
								<svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6 transition-colors duration-300' viewBox='0 0 20 20' fill='currentColor'>
									<path fillRule='evenodd' d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z' clipRule='evenodd' />
								</svg>
							</button>
						</div>
					</div>
				</div>

				{/* Divider line */}
				<div className='relative md:h-full w-full md:w-[1px] h-[1px] my-4 md:my-0 mx-auto md:mx-0'>
					<div ref={dividerLineRef} className='absolute inset-0 bg-gray-200'></div>
				</div>

				{/* Right side with services details */}
				<div className='w-full md:w-1/2 p-4 md:p-6' ref={rightSideRef}>
					<AnimatePresence mode='wait'>
						<motion.div ref={rightContentRef} key={activeService} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
							<h3 ref={servicesTitleRef} className='text-2xl font-black mb-6 text-black'>
								{activeService || 'Services'}
							</h3>

							<div className='mb-8'>
								{currentContent.description.map((paragraph, index) => {
									// Group of bullet points
									if (paragraph.startsWith('•')) {
										// Extract content after the bullet point and dash
										const parts = paragraph.substring(1).trim().split('–');
										const bulletTitle = parts[0].trim();
										const bulletContent = parts.length > 1 ? parts[1].trim() : '';

										return (
											<div key={index} className='flex items-start group hover:translate-x-1 transition-transform duration-300 py-[1px]'>
												<span className='text-[#d142e2] text-xs mr-1.5 mt-[3px] opacity-90 group-hover:opacity-100 flex-shrink-0'>•</span>
												<div className='text-gray-700 leading-snug'>
													<span className='font-medium text-gray-800'>{bulletTitle}</span>
													{bulletContent && (
														<>
															<span className='text-xs font-serif'>–</span> <span className='text-gray-600 text-xs'>{bulletContent}</span>
														</>
													)}
												</div>
											</div>
										);
									}

									// Header for list sections (like "What we uncover together:")
									if (paragraph.endsWith(':​')) {
										return (
											<p key={index} className='text-gray-700 font-medium mt-4 mb-1.5'>
												{paragraph}
											</p>
										);
									}

									// Empty line creates spacing
									if (paragraph === '') {
										return <div key={index} className='h-2'></div>;
									}

									// Regular paragraph
									return (
										<p key={index} className='text-gray-700 leading-relaxed mb-3'>
											{paragraph}
										</p>
									);
								})}
							</div>
						</motion.div>
					</AnimatePresence>
				</div>
			</div>
		</Section>
	);
}
