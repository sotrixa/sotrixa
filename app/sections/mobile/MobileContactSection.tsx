'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useContactForm } from '../../lib/hooks/useContactForm';

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

	// Contact form hook
	const { formData, isSubmitting, isSuccess, error, handleInputChange, handleSubmit } = useContactForm();

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
		<section id='mobile-contact' className='bg-[#FAFAFA] text-black py-12 px-4 mt-[-10rem]'>
			<div className='max-w-sm mx-auto'>
				<div ref={headingRef} className='mb-8 text-center' style={{ opacity: animationsInitialized ? undefined : 1 }}>
					<h2 className='text-2xl font-medium mb-2 text-left' style={{ lineHeight: 1 }}>Contact</h2>
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
									<span className='text-sm'>📍</span>
								</div>
								<p className='text-gray-700 text-sm'>Sofia, Bulgaria</p>
							</div>
						</div>
					</div>

					<div>
						<p className='text-sm uppercase tracking-wider font-medium text-gray-500 mb-3'>Follow Us</p>
						<div className='flex space-x-2'>
							{['Instagram'/* , 'LinkedIn' */].map((platform) => (
								<a key={platform} href='#' className='w-8 h-8 flex items-center justify-center border border-gray-200 rounded-full text-gray-600 hover:bg-gray-100 hover:border-gray-300 transition-colors' aria-label={platform}>
									{platform[0]}
								</a>
							))}
						</div>
					</div>
				</div>

				{/* Success Message */}
				{isSuccess && (
					<div className='mb-4 p-3 bg-green-50 border border-green-200 rounded-md'>
						<p className='text-green-800 text-sm font-medium'>✓ Message sent successfully!</p>
						<p className='text-green-600 text-xs mt-1'>We&apos;ll get back to you soon.</p>
					</div>
				)}

				{/* Error Message */}
				{error && (
					<div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-md'>
						<p className='text-red-800 text-sm font-medium'>⚠ {error}</p>
						<p className='text-red-600 text-xs mt-1'>Please try again or contact us directly.</p>
					</div>
				)}

				<form ref={formRef} onSubmit={handleSubmit} className='space-y-4' style={{ opacity: animationsInitialized ? undefined : 1 }}>
					<div>
						<label htmlFor='name' className='block mb-1 text-sm font-medium text-gray-700'>
							Name *
						</label>
						<input 
							type='text' 
							id='name' 
							name='name'
							value={formData.name}
							onChange={handleInputChange}
							className='w-full px-3 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors text-gray-800' 
							placeholder='John Doe' 
							required
							disabled={isSubmitting}
						/>
					</div>

					<div>
						<label htmlFor='email' className='block mb-1 text-sm font-medium text-gray-700'>
							Email *
						</label>
						<input 
							type='email' 
							id='email' 
							name='email'
							value={formData.email}
							onChange={handleInputChange}
							className='w-full px-3 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors text-gray-800' 
							placeholder='john@example.com' 
							required
							disabled={isSubmitting}
						/>
					</div>

					<div>
						<label htmlFor='subject' className='block mb-1 text-sm font-medium text-gray-700'>
							Subject *
						</label>
						<input 
							type='text' 
							id='subject' 
							name='subject'
							value={formData.subject}
							onChange={handleInputChange}
							className='w-full px-3 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors text-gray-800' 
							placeholder='Project inquiry' 
							required
							disabled={isSubmitting}
						/>
					</div>

					<div>
						<label htmlFor='message' className='block mb-1 text-sm font-medium text-gray-700'>
							Message *
						</label>
						<textarea 
							id='message' 
							name='message'
							value={formData.message}
							onChange={handleInputChange}
							rows={3} 
							className='w-full px-3 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors text-gray-800 resize-none' 
							placeholder='Tell us about your project...'
							required
							disabled={isSubmitting}
						></textarea>
					</div>

					<div>
						<button 
							type='submit' 
							disabled={isSubmitting}
							className='w-full px-4 py-2.5 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2'
						>
							{isSubmitting ? (
								<>
									<div className='w-4 h-4 border border-white border-t-transparent rounded-full animate-spin'></div>
									Sending...
								</>
							) : (
								'Send Message'
							)}
						</button>
					</div>
				</form>
			</div>
		</section>
	);
}
