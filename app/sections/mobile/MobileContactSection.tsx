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
				{/* Owl Video */}
				<div className='flex justify-center mb-6'>
					<div className='relative w-48 h-48 rounded-lg overflow-hidden'>
						<video
							src='/video/Contact-page-video.mp4'
							autoPlay
							loop
							muted
							playsInline
							className='absolute -inset-[2px] w-[calc(100%+4px)] h-[calc(100%+4px)] object-cover'
						/>
					</div>
				</div>

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
								<a href='mailto:direction@sotrixa.com' className='text-gray-700 hover:text-black transition-colors text-sm'>
									direction@sotrixa.com
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
							<a href='https://www.instagram.com/sotrixa' target='_blank' rel='noopener noreferrer' className='w-8 h-8 flex items-center justify-center bg-black text-white hover:bg-gray-800 transition-colors rounded-sm' aria-label='Instagram'>
								<svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'><path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z'/></svg>
							</a>
							<a href='https://www.linkedin.com/company/sotrixa' target='_blank' rel='noopener noreferrer' className='w-8 h-8 flex items-center justify-center bg-black text-white hover:bg-gray-800 transition-colors rounded-sm' aria-label='LinkedIn'>
								<svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'><path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'/></svg>
							</a>
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
