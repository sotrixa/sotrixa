'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Section from '../components/Section';

export default function ContactSection() {
	// Refs for animation targets
	const formRef = useRef<HTMLDivElement>(null);
	const headingRef = useRef<HTMLDivElement>(null);
	const contactInfoRef = useRef<HTMLDivElement>(null);
	const formItemsRef = useRef<HTMLDivElement[]>([]);
	const [animationsCreated, setAnimationsCreated] = useState(false);

	useEffect(() => {
		// Register ScrollTrigger plugin
		gsap.registerPlugin(ScrollTrigger);

		// Initial setup - ensure content is visible by default with a small delay
		// This provides a fallback in case animations don't trigger
		const timeout = setTimeout(() => {
			if (headingRef.current) gsap.set(headingRef.current, { opacity: 1, y: 0 });
			if (contactInfoRef.current) gsap.set(contactInfoRef.current.children, { opacity: 1, y: 0 });
			if (formRef.current) gsap.set(formRef.current, { opacity: 1, y: 0 });
			if (formItemsRef.current.length) gsap.set(formItemsRef.current, { opacity: 1, y: 0 });
		}, 1000);

		// Main heading animation
		if (headingRef.current) {
			gsap.fromTo(
				headingRef.current,
				{ opacity: 0, y: 30 },
				{
					opacity: 1,
					y: 0,
					duration: 0.7,
					ease: 'power3.out',
					scrollTrigger: {
						trigger: headingRef.current,
						start: 'top 90%', // Trigger earlier
						once: true,
					},
				}
			);
		}

		// Contact info animation
		if (contactInfoRef.current && contactInfoRef.current.children.length) {
			gsap.fromTo(
				contactInfoRef.current.children,
				{ opacity: 0, y: 20 },
				{
					opacity: 1,
					y: 0,
					stagger: 0.1,
					duration: 0.5,
					ease: 'power1.out',
					scrollTrigger: {
						trigger: contactInfoRef.current,
						start: 'top 90%', // Trigger earlier
						once: true,
					},
				}
			);
		}

		// Form animation
		if (formRef.current) {
			gsap.fromTo(
				formRef.current,
				{ opacity: 0, y: 20 },
				{
					opacity: 1,
					y: 0,
					duration: 0.8,
					ease: 'power2.out',
					scrollTrigger: {
						trigger: formRef.current,
						start: 'top 90%', // Trigger earlier
						once: true,
					},
				}
			);
		}

		// Form fields staggered animation
		if (formItemsRef.current.length) {
			gsap.fromTo(
				formItemsRef.current,
				{ opacity: 0, y: 15 },
				{
					opacity: 1,
					y: 0,
					stagger: 0.08,
					duration: 0.5,
					ease: 'power1.out',
					scrollTrigger: {
						trigger: formRef.current,
						start: 'top 90%', // Trigger earlier
						once: true,
					},
				}
			);
		}

		setAnimationsCreated(true);

		// Refresh ScrollTrigger to ensure proper initialization
		ScrollTrigger.refresh();

		// Cleanup function
		return () => {
			clearTimeout(timeout);
			ScrollTrigger.getAll().forEach((t) => t.kill());
		};
	}, []);

	// Add element to formItemsRef array
	const addToFormRefs = (el: HTMLDivElement | null) => {
		if (el && !formItemsRef.current.includes(el)) {
			formItemsRef.current.push(el);
		}
	};

	return (
		<Section id='contact' className='bg-[#FAFAFA] text-black py-20'>
			<div className='max-w-6xl mx-auto px-6'>
				<div className='mb-16 text-center' ref={headingRef} style={{ opacity: animationsCreated ? undefined : 1 }}>
					<h2 className='text-4xl font-medium mb-2'>Contact</h2>
					<div className='w-16 h-0.5 bg-black mx-auto mb-6'></div>
					<p className='text-gray-600 max-w-lg mx-auto'>Get in touch and let&apos;s discuss your project.</p>
				</div>

				<div className='grid grid-cols-1 lg:grid-cols-12 gap-16'>
					<div className='lg:col-span-4 space-y-8' ref={contactInfoRef} style={{ opacity: animationsCreated ? undefined : 1 }}>
						<div>
							<p className='text-sm uppercase tracking-wider font-medium text-gray-500 mb-4'>Contact Information</p>

							<div className='space-y-5'>
								<div className='flex items-center space-x-4'>
									<div className='w-10 h-10 flex items-center justify-center border border-gray-200 rounded-full'>
										<span className='text-sm'>✉️</span>
									</div>
									<a href='mailto:hello@company.com' className='text-gray-700 hover:text-black transition-colors'>
										hello@company.com
									</a>
								</div>

								<div className='flex items-center space-x-4'>
									<div className='w-10 h-10 flex items-center justify-center border border-gray-200 rounded-full'>
										<span className='text-sm'>📱</span>
									</div>
									<a href='tel:+15551234567' className='text-gray-700 hover:text-black transition-colors'>
										+1 (555) 123-4567
									</a>
								</div>

								<div className='flex items-center space-x-4'>
									<div className='w-10 h-10 flex items-center justify-center border border-gray-200 rounded-full'>
										<span className='text-sm'>📍</span>
									</div>
									<p className='text-gray-700'>Tech Hub, Innovation Square</p>
								</div>
							</div>
						</div>

						<div>
							<p className='text-sm uppercase tracking-wider font-medium text-gray-500 mb-4'>Follow Us</p>
							<div className='flex space-x-3'>
								{['Twitter', 'LinkedIn', 'Instagram', 'GitHub'].map((platform) => (
									<a key={platform} href='#' className='w-9 h-9 flex items-center justify-center border border-gray-200 rounded-full text-gray-600 hover:bg-gray-100 hover:border-gray-300 transition-colors' aria-label={platform}>
										{platform[0]}
									</a>
								))}
							</div>
						</div>
					</div>

					<div className='lg:col-span-8' ref={formRef} style={{ opacity: animationsCreated ? undefined : 1 }}>
						<form className='space-y-6'>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
								<div ref={addToFormRefs} style={{ opacity: animationsCreated ? undefined : 1 }}>
									<label htmlFor='name' className='block mb-1.5 text-sm font-medium text-gray-700'>
										Name
									</label>
									<input type='text' id='name' className='w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors text-gray-800' placeholder='John Doe' />
								</div>

								<div ref={addToFormRefs} style={{ opacity: animationsCreated ? undefined : 1 }}>
									<label htmlFor='email' className='block mb-1.5 text-sm font-medium text-gray-700'>
										Email
									</label>
									<input type='email' id='email' className='w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors text-gray-800' placeholder='john@example.com' />
								</div>
							</div>

							<div ref={addToFormRefs} style={{ opacity: animationsCreated ? undefined : 1 }}>
								<label htmlFor='subject' className='block mb-1.5 text-sm font-medium text-gray-700'>
									Subject
								</label>
								<input type='text' id='subject' className='w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors text-gray-800' placeholder='Project inquiry' />
							</div>

							<div ref={addToFormRefs} style={{ opacity: animationsCreated ? undefined : 1 }}>
								<label htmlFor='message' className='block mb-1.5 text-sm font-medium text-gray-700'>
									Message
								</label>
								<textarea id='message' rows={4} className='w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors text-gray-800' placeholder='Tell us about your project...'></textarea>
							</div>

							<div ref={addToFormRefs} style={{ opacity: animationsCreated ? undefined : 1 }}>
								<button type='submit' className='px-6 py-2.5 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition-colors'>
									Send Message
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</Section>
	);
}
