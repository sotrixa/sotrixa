'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin once
if (typeof window !== 'undefined') {
	gsap.registerPlugin(ScrollTrigger);
}

export default function MobileContactSection() {
	// Simplified refs for mobile optimization
	const headingRef = useRef<HTMLDivElement>(null);
	const formRef = useRef<HTMLFormElement>(null);
	const contactInfoRef = useRef<HTMLDivElement>(null);
	const [animationsInitialized, setAnimationsInitialized] = useState(false);

	useEffect(() => {
		if (typeof window === 'undefined') return;

		// Simplified animation for mobile - less resource intensive
		const timeout = setTimeout(() => {
			if (headingRef.current) gsap.set(headingRef.current, { opacity: 1, y: 0 });
			if (contactInfoRef.current) gsap.set(contactInfoRef.current, { opacity: 1, y: 0 });
			if (formRef.current) gsap.set(formRef.current, { opacity: 1, y: 0 });
		}, 800);

		// Basic fade-in animations optimized for mobile
		if (headingRef.current) {
			gsap.fromTo(
				headingRef.current,
				{ opacity: 0, y: 20 },
				{
					opacity: 1,
					y: 0,
					duration: 0.5,
					ease: 'power2.out',
					scrollTrigger: {
						trigger: headingRef.current,
						start: 'top 90%',
						once: true,
					},
				}
			);
		}

		if (contactInfoRef.current) {
			gsap.fromTo(
				contactInfoRef.current,
				{ opacity: 0, y: 15 },
				{
					opacity: 1,
					y: 0,
					duration: 0.5,
					ease: 'power1.out',
					delay: 0.1,
					scrollTrigger: {
						trigger: contactInfoRef.current,
						start: 'top 90%',
						once: true,
					},
				}
			);
		}

		if (formRef.current) {
			gsap.fromTo(
				formRef.current,
				{ opacity: 0, y: 15 },
				{
					opacity: 1,
					y: 0,
					duration: 0.5,
					ease: 'power1.out',
					delay: 0.2,
					scrollTrigger: {
						trigger: formRef.current,
						start: 'top 90%',
						once: true,
					},
				}
			);
		}

		setAnimationsInitialized(true);

		// Clean up
		return () => {
			clearTimeout(timeout);
			ScrollTrigger.getAll().forEach((t) => t.kill());
		};
	}, []);

	return (
		<section id='mobile-contact' className='bg-[#FAFAFA] text-black py-12 px-4'>
			<div className='max-w-sm mx-auto'>
				<div ref={headingRef} className='mb-8 text-center' style={{ opacity: animationsInitialized ? undefined : 1 }}>
					<h2 className='text-3xl font-medium mb-2'>Contact</h2>
					<div className='w-12 h-0.5 bg-black mx-auto mb-4'></div>
					<p className='text-gray-600'>Get in touch and let&apos;s discuss your project.</p>
				</div>

				<div ref={contactInfoRef} className='mb-8 space-y-6' style={{ opacity: animationsInitialized ? undefined : 1 }}>
					<div>
						<p className='text-sm uppercase tracking-wider font-medium text-gray-500 mb-3'>Contact Information</p>

						<div className='space-y-4'>
							<div className='flex items-center space-x-3'>
								<div className='w-8 h-8 flex items-center justify-center border border-gray-200 rounded-full'>
									<span className='text-sm'>✉️</span>
								</div>
								<a href='mailto:hello@company.com' className='text-gray-700 hover:text-black transition-colors text-sm'>
									hello@company.com
								</a>
							</div>

							<div className='flex items-center space-x-3'>
								<div className='w-8 h-8 flex items-center justify-center border border-gray-200 rounded-full'>
									<span className='text-sm'>📱</span>
								</div>
								<a href='tel:+15551234567' className='text-gray-700 hover:text-black transition-colors text-sm'>
									+1 (555) 123-4567
								</a>
							</div>

							<div className='flex items-center space-x-3'>
								<div className='w-8 h-8 flex items-center justify-center border border-gray-200 rounded-full'>
									<span className='text-sm'>📍</span>
								</div>
								<p className='text-gray-700 text-sm'>Tech Hub, Innovation Square</p>
							</div>
						</div>
					</div>

					<div>
						<p className='text-sm uppercase tracking-wider font-medium text-gray-500 mb-3'>Follow Us</p>
						<div className='flex space-x-2'>
							{['Twitter', 'LinkedIn', 'Instagram', 'GitHub'].map((platform) => (
								<a key={platform} href='#' className='w-8 h-8 flex items-center justify-center border border-gray-200 rounded-full text-gray-600 hover:bg-gray-100 hover:border-gray-300 transition-colors' aria-label={platform}>
									{platform[0]}
								</a>
							))}
						</div>
					</div>
				</div>

				<form ref={formRef} className='space-y-4' style={{ opacity: animationsInitialized ? undefined : 1 }}>
					<div>
						<label htmlFor='name' className='block mb-1 text-sm font-medium text-gray-700'>
							Name
						</label>
						<input type='text' id='name' className='w-full px-3 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors text-gray-800' placeholder='John Doe' />
					</div>

					<div>
						<label htmlFor='email' className='block mb-1 text-sm font-medium text-gray-700'>
							Email
						</label>
						<input type='email' id='email' className='w-full px-3 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors text-gray-800' placeholder='john@example.com' />
					</div>

					<div>
						<label htmlFor='subject' className='block mb-1 text-sm font-medium text-gray-700'>
							Subject
						</label>
						<input type='text' id='subject' className='w-full px-3 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors text-gray-800' placeholder='Project inquiry' />
					</div>

					<div>
						<label htmlFor='message' className='block mb-1 text-sm font-medium text-gray-700'>
							Message
						</label>
						<textarea id='message' rows={3} className='w-full px-3 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors text-gray-800' placeholder='Tell us about your project...'></textarea>
					</div>

					<div>
						<button type='submit' className='w-full px-4 py-2.5 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition-colors'>
							Send Message
						</button>
					</div>
				</form>
			</div>
		</section>
	);
}
