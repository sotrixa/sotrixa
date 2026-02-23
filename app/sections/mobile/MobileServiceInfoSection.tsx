'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
	gsap.registerPlugin(ScrollTrigger);
}

interface MobileServiceInfoSectionProps {
	onBackClick?: () => void;
	activeService?: string;
}

interface ServiceContent {
	title: string;
	description: string[];
	approachTitle: string;
	values: {
		title: string;
		content?: string;
	}[];
}

const serviceContents: Record<string, ServiceContent> = {
	'CREATED TO MATTER': {
		title: 'Empowering bold ideas with strategies that align vision, purpose, and growth.',
		description: ['Sotrixa partners with visionary entrepreneurs, creatives, and changemakers—those building with purpose and seeking clarity along the way.​', 'We work closely to translate bold ideas into aligned, authentic strategies that are ready for real-world growth.​'],
		approachTitle: 'Turning vision into structure, potential into direction',
		values: [
			{
				title: 'Impact',
				content: 'Through deep research, sharp analysis, and strategic design, vision becomes structure—turning potential into direction, and ambition into action.​',
			},
			{
				title: 'Meaning',
				content: 'Beyond client work, Sotrixa invests in artistic and educational initiatives, giving under-resourced children access to imagination, learning, and creative self-expression. Because the future needs more creators—and every child deserves a space to dream.',
			},
		],
	},
	RESEARCH: {
		title: 'Deep research, nuanced insight, and future-facing signals that shape powerful strategies.',
		description: ['At Sotrixa, research is a journey of co-discovery—driven by curiosity, shaped by context, and grounded in your vision.​', 'Together, we listen between the lines, observe subtle patterns, and trace emerging signals that guide strategic decisions.​'],
		approachTitle: 'A living compass for everything we build together',
		values: [
			{
				title: 'Curiosity',
				content: 'By blending human stories with data-driven insights, we craft nuanced research journeys—through in-depth interviews, thoughtful surveys, cultural listening, and pattern-sensing.​',
			},
			{
				title: 'Conscience',
				content: 'What we uncover together: Category Analysis, Competitive Analysis, Consumer Behavior Insights, Trend Scanning & Forecasting, and Audience Segmentation—mapping real people with real stories and needs, not just numbers.​',
			},
		],
	},
	'BUSINESS ARCHITECTURE': {
		title: 'Turning vision into a structured, evolving business—ready for real-world growth.',
		description: ['Every idea holds immense potential, but to thrive, it needs form, coherence, and a structure that sustains growth.​', 'At Sotrixa, we shape the fundamental elements of your business—what you offer, how you function, and the role you are meant to play.​'],
		approachTitle: 'An aligned, living structure—ready for strategy and movement',
		values: [
			{
				title: 'Structure',
				content: 'Through co-creation, we translate concepts into frameworks and possibilities into actionable plans.​ What we shape together: Business Model Design, Offer Design & Positioning, and Operational Frameworks that map systems and processes for consistency and focus.​',
			},
			{
				title: 'Scalability',
				content: 'We help define Mission, Vision & Values—the deeper truths that guide your evolution, while creating Growth Pathways to strategize how to expand, shift, or scale intentionally over time.​',
			},
		],
	},
	'BESPOKE STRATEGY CREATION': {
		title: 'Precision-crafted roadmaps that move your vision forward with clarity, coherence, and purpose.',
		description: ['No two businesses move at the same rhythm.​', 'At Sotrixa, strategy honors your unique goals, capacity, and context—designing roadmaps that are intelligent, flexible, and fully aligned with your evolution.​'],
		approachTitle: 'Structured, sustainable momentum',
		values: [
			{
				title: 'Precision',
				content: 'Whether you are launching something new, expanding reach, refining an offer, or exploring partnerships, each strategic layer moves vision into structured, sustainable momentum.​',
			},
			{
				title: 'Adaptability',
				content: 'From go-to-market approaches and visibility plans to audience engagement, growth models, and positioning strategies—every element is crafted to create meaningful forward motion.',
			},
		],
	},
	'BRAND STORYTELLING': {
		title: "Bringing your business's true story to life—visually, verbally, and emotionally.",
		description: ['A brand is the memory, the feeling, the story people carry after they meet you.​', 'At Sotrixa, branding is an act of alignment: we listen deeply to what your business is becoming and translate that into visual and verbal identities that feel alive and true.​'],
		approachTitle: 'More than an aesthetic, an invitation',
		values: [
			{
				title: 'Authenticity',
				content: 'We create logos, color palettes, typography, design elements, and voice and tone guidelines—crafted with precision and emotional resonance.​',
			},
			{
				title: 'Distinction',
				content: 'Your brand becomes an invitation: a true reflection of your story, ready to connect and inspire.',
			},
		],
	},
	MARKETING: {
		title: 'Expanding your presence with soulful marketing strategies that resonate and move.',
		description: ['Marketing is the movement of your story into the world—the choreography of voice, vision, and presence.​', 'At Sotrixa, we craft marketing strategies that are intelligent, soulful, and grounded in authenticity.​'],
		approachTitle: "Your story doesn't just travel—it moves, it resonates",
		values: [
			{
				title: 'Creativity',
				content: 'From channel strategies and campaign direction to content pillars and creative activations, every element amplifies your voice with coherence and clarity.',
			},
			{
				title: 'Measurement',
				content: 'We design collaborations and strategic initiatives that expand your reach with purpose and impact, building sustainable momentum for your brand.',
			},
		],
	},
	'WEBSITE DEVELOPMENT': {
		title: 'Crafting websites where form meets feeling, and strategy becomes tangible experience.',
		description: ['Your website is the home of your vision—where strategy meets experience and form meets feeling.​', "At Sotrixa, we design digital spaces that are not only beautiful but deeply functional—reflecting your brand's essence while guiding your audience into connection and action.​"],
		approachTitle: 'Where presence becomes tangible—and impact begins',
		values: [
			{
				title: 'Usability',
				content: 'Rooted in clarity, crafted with care, your website becomes a living, evolving expression of everything you stand for.​',
			},
			{
				title: 'Performance',
				content: 'We build responsive, accessible experiences optimized to deliver your message with impact, creating seamless journeys that engage and convert.',
			},
		],
	},
};

const MobileServiceInfoSection: React.FC<MobileServiceInfoSectionProps> = ({ onBackClick, activeService }) => {
	const sectionDivRef = useRef<HTMLDivElement>(null);
	const gridBackgroundRef = useRef<HTMLDivElement>(null);
	const particlesRef = useRef<HTMLDivElement>(null);
	const gearRefs = useRef<Array<SVGSVGElement | null>>([]);

	const currentContent = activeService && serviceContents[activeService] ? serviceContents[activeService] : serviceContents['CREATED TO MATTER'];

	// Gear SVG
	const GearSVG = ({ size, toothCount, color, opacity }: { size: number; toothCount: number; color: string; opacity: number }) => {
		const outerRadius = size / 2;
		const innerRadius = outerRadius * 0.7;
		const toothHeight = outerRadius * 0.2;
		const centerHoleRadius = outerRadius * 0.2;
		const points = [];
		for (let i = 0; i < toothCount; i++) {
			const angle = (i / toothCount) * Math.PI * 2;
			const nextAngle = ((i + 0.5) / toothCount) * Math.PI * 2;
			const nextNextAngle = ((i + 1) / toothCount) * Math.PI * 2;
			points.push([innerRadius * Math.cos(angle), innerRadius * Math.sin(angle)]);
			points.push([(outerRadius + toothHeight) * Math.cos(nextAngle), (outerRadius + toothHeight) * Math.sin(nextAngle)]);
			points.push([innerRadius * Math.cos(nextNextAngle), innerRadius * Math.sin(nextNextAngle)]);
		}
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
			<svg width={size} height={size} viewBox={`${-outerRadius - toothHeight} ${-outerRadius - toothHeight} ${(outerRadius + toothHeight) * 2} ${(outerRadius + toothHeight) * 2}`}>
				<path d={pathData} fill='none' stroke={color} strokeWidth={1} opacity={opacity} />
				<circle cx='0' cy='0' r={centerHoleRadius} fill='none' stroke={color} strokeWidth={1} opacity={opacity} />
				{[...Array(Math.min(toothCount / 2, 6))].map((_, i) => {
					const angle = (i / Math.min(toothCount / 2, 6)) * Math.PI * 2;
					return <line key={i} x1={centerHoleRadius * Math.cos(angle)} y1={centerHoleRadius * Math.sin(angle)} x2={innerRadius * 0.9 * Math.cos(angle)} y2={innerRadius * 0.9 * Math.sin(angle)} stroke={color} strokeWidth={1} opacity={opacity} />;
				})}
			</svg>
		);
	};

	// Particles
	const createParticles = () => {
		if (!particlesRef.current) return;
		while (particlesRef.current.firstChild) {
			particlesRef.current.removeChild(particlesRef.current.firstChild);
		}
		const colors = ['bg-[#f4dd65]', 'bg-[#d142e2]', 'bg-[#70DFC6]', 'bg-[#F5A623]', 'bg-[#9F7AEA]'];
		const shapes = ['rounded-full', 'rounded-sm', 'rounded-lg'];
		for (let i = 0; i < 40; i++) {
			const particle = document.createElement('div');
			const color = colors[Math.floor(Math.random() * colors.length)];
			const shape = shapes[Math.floor(Math.random() * shapes.length)];
			particle.className = `absolute ${shape} ${color} opacity-0`;
			const size = Math.random() * 8 + 2;
			particle.style.width = `${size}px`;
			particle.style.height = `${size}px`;
			particle.style.boxShadow = '0 1px 2px rgba(0,0,0,0.1)';
			particlesRef.current.appendChild(particle);
			const x = Math.random() * 100;
			const y = Math.random() * 100;
			gsap.set(particle, {
				x: `${x}%`,
				y: `${y}%`,
				opacity: 0,
				scale: 0,
				rotation: Math.random() * 360,
			});
		}
	};

	const animateParticles = () => {
		if (!particlesRef.current) return;
		const particles = particlesRef.current.children;
		gsap.to(particles, {
			opacity: 0,
			scale: 0,
			duration: 0.2,
			onComplete: () => {
				for (let i = 0; i < particles.length; i++) {
					const particle = particles[i];
					const x = Math.random() * 100;
					const y = Math.random() * 100;
					gsap.set(particle, { x: `${x}%`, y: `${y}%` });
				}
				gsap.to(particles, {
					opacity: function () {
						return Math.random() * 0.5 + 0.1;
					},
					scale: function () {
						return Math.random() * 1 + 0.5;
					},
					duration: 1.2,
					stagger: 0.02,
					ease: 'power3.out',
					onComplete: () => {
						gsap.to(particles, {
							opacity: 0,
							duration: 1.5,
							stagger: 0.01,
							ease: 'power2.in',
						});
					},
				});
			},
		});
	};

	useEffect(() => {
		createParticles();
		// Copy refs to local variables for cleanup
		const gridBackgroundCurrent = gridBackgroundRef.current;
		const gearRefsCurrent = [...gearRefs.current];
		if (gridBackgroundCurrent) {
			gsap.set(gridBackgroundCurrent, { backgroundPosition: '0px 0px' });
			gsap.to(gridBackgroundCurrent, {
				backgroundPosition: '40px 40px',
				duration: 8,
				ease: 'linear',
				repeat: -1,
			});
		}
		gearRefsCurrent.forEach((gearRef, index) => {
			if (!gearRef) return;
			gsap.set(gearRef, { rotation: Math.random() * 360, transformOrigin: 'center center' });
			gsap.to(gearRef, {
				rotation: index % 2 === 0 ? '+=360' : '-=360',
				duration: 20 + index * 5,
				ease: 'none',
				repeat: -1,
			});
		});
		animateParticles();
		return () => {
			gsap.killTweensOf(gridBackgroundCurrent);
			gearRefsCurrent.forEach((gearRef) => {
				if (gearRef) gsap.killTweensOf(gearRef);
			});
		};
	}, [activeService]);

	return (
		<div className='fixed inset-0 z-50 w-full h-full bg-[#FAFAFA] overflow-auto flex flex-col' ref={sectionDivRef}>
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
			<div className='absolute top-[10%] left-[5%] z-0 opacity-25'>
				<svg
					ref={(el) => {
						if (el) gearRefs.current[0] = el;
					}}
				>
					<GearSVG size={120} toothCount={10} color='#888' opacity={0.25} />
				</svg>
			</div>
			<div className='absolute top-[20%] left-[70%] z-0 opacity-20'>
				<svg
					ref={(el) => {
						if (el) gearRefs.current[1] = el;
					}}
				>
					<GearSVG size={80} toothCount={8} color='#666' opacity={0.2} />
				</svg>
			</div>
			<div className='absolute bottom-[20%] right-[10%] z-0 opacity-25'>
				<svg
					ref={(el) => {
						if (el) gearRefs.current[2] = el;
					}}
				>
					<GearSVG size={100} toothCount={12} color='#888' opacity={0.25} />
				</svg>
			</div>
			{/* Abstract lines */}
			<div className='absolute top-[30%] left-0 w-[40%] h-[2px] bg-gradient-to-r from-transparent via-gray-400 to-transparent opacity-30'></div>
			<div className='absolute bottom-[40%] right-0 w-[50%] h-[2px] bg-gradient-to-l from-transparent via-gray-400 to-transparent opacity-30'></div>
			{/* Dots grid in one corner */}
			<div
				className='absolute top-0 right-0 w-[120px] h-[120px] opacity-20'
				style={{
					backgroundImage: 'radial-gradient(circle, rgba(100,100,100,0.7) 2px, transparent 2px)',
					backgroundSize: '20px 20px',
				}}
			></div>
			{/* Particles container for animated effects */}
			<div ref={particlesRef} className='absolute inset-0 pointer-events-none z-10'></div>
			{/* Content */}
			<div className='relative z-20 flex-1 flex flex-col px-4 py-6'>
				{/* Back button */}
				<button onClick={onBackClick} className='flex items-center space-x-2 text-gray-500 hover:text-black transition-colors mb-6 py-2' aria-label='Back to services'>
					<svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
						<path fillRule='evenodd' d='M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z' clipRule='evenodd' />
					</svg>
					<span>Back to services</span>
				</button>
				{/* Title */}
				<motion.h1 className='text-xl font-bold tracking-tight mb-2 bg-gradient-to-r from-[#f4dd65] via-[#d142e2] to-[#70DFC6] text-transparent bg-clip-text' style={{ lineHeight: 1 }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
					{currentContent.title}
				</motion.h1>
				{/* Approach Title */}
				<motion.p className='text-lg font-bold mb-4' initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}>
					{currentContent.approachTitle}
				</motion.p>
				{/* Description */}
				<div className='mb-6 space-y-3'>
					{currentContent.description.map((paragraph, idx) => (
						<motion.p key={idx} className='text-gray-700 leading-relaxed' initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + idx * 0.05, duration: 0.4 }}>
							{paragraph}
						</motion.p>
					))}
				</div>
				{/* Values */}
				<div className='grid grid-cols-1 gap-4 mt-4'>
					{currentContent.values.map((value, idx) => (
						<motion.div key={idx} className='p-4 rounded-lg bg-gray-50/50 hover:bg-gray-50/80 transition-colors duration-300' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + idx * 0.1, duration: 0.5 }}>
							<h3 className='text-base font-bold mb-2' style={{ lineHeight: 1 }}>{value.title}</h3>
							{value.content && <p className='text-gray-600 leading-relaxed'>{value.content}</p>}
						</motion.div>
					))}
				</div>
			</div>
		</div>
	);
};

export default MobileServiceInfoSection;
