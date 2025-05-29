'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Section from '../components/Section';
import { useContactForm } from '../lib/hooks/useContactForm';

export default function ContactSection() {
	// Refs for animation targets
	const formRef = useRef<HTMLDivElement>(null);
	const headingRef = useRef<HTMLDivElement>(null);
	const contactInfoRef = useRef<HTMLDivElement>(null);
	const imageRef = useRef<HTMLDivElement>(null);
	const formItemsRef = useRef<HTMLDivElement[]>([]);
	const [animationsCreated, setAnimationsCreated] = useState(false);

	// Contact form hook
	const { formData, isSubmitting, isSuccess, error, handleInputChange, handleSubmit } = useContactForm();

	useEffect(() => {
		// Register ScrollTrigger plugin
		gsap.registerPlugin(ScrollTrigger);

		// Initial setup - ensure content is visible by default with a small delay
		// This provides a fallback in case animations don't trigger
		const timeout = setTimeout(() => {
			if (headingRef.current) gsap.set(headingRef.current, { opacity: 1, y: 0 });
			if (contactInfoRef.current) gsap.set(contactInfoRef.current.children, { opacity: 1, y: 0 });
			if (formRef.current) gsap.set(formRef.current, { opacity: 1, y: 0 });
			if (imageRef.current) gsap.set(imageRef.current, { opacity: 1, y: 0 });
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

		// Image animation
		if (imageRef.current) {
			gsap.fromTo(
				imageRef.current,
				{ opacity: 0, x: 20 },
				{
					opacity: 1,
					x: 0,
					duration: 0.8,
					ease: 'power2.out',
					scrollTrigger: {
						trigger: imageRef.current,
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
		<Section id='contact' className='bg-[#FAFAFA] text-black min-h-screen flex items-center justify-center pt-20 pb-24'>
			<div className='w-full px-1r sm:px-1 lg:px-1 xl:px-1 max-w-7xl mx-auto'>
				<div className='grid grid-cols-1 lg:grid-cols-5 gap-6 items-start'>
					{/* Left Column - Contact Content */}
					<div className='lg:col-span-2 space-y-4 mt-8 lg:mt-16' ref={contactInfoRef} style={{ opacity: animationsCreated ? undefined : 1 }}>
						{/* Contact Information */}
						<div className='space-y-3'>
							
							<div>
								<p className='text-xs uppercase tracking-wider font-medium text-gray-500 mb-2'>Contact Information</p>

								<div className='space-y-1.5'>
									<div className='flex items-center space-x-3'>
										<div className='w-6 h-6 flex items-center justify-center border border-gray-200 rounded-full'>
											<span className='text-xs'>✉️</span>
										</div>
										<a href='mailto:hello@company.com' className='text-gray-700 hover:text-black transition-colors text-sm'>
											hello@company.com
										</a>
									</div>

									<div className='flex items-center space-x-3'>
										<div className='w-6 h-6 flex items-center justify-center border border-gray-200 rounded-full'>
											<span className='text-xs'>📱</span>
										</div>
										<a href='tel:+15551234567' className='text-gray-700 hover:text-black transition-colors text-sm'>
											+1 (555) 123-4567
										</a>
									</div>

									<div className='flex items-center space-x-3'>
										<div className='w-6 h-6 flex items-center justify-center border border-gray-200 rounded-full'>
											<span className='text-xs'>📍</span>
										</div>
										<p className='text-gray-700 text-sm'>Tech Hub, Innovation Square</p>
									</div>
								</div>
							</div>

							<div>
								<p className='text-xs uppercase tracking-wider font-medium text-gray-500 mb-2'>Follow Us</p>
								<div className='flex space-x-2'>
									{['Twitter', 'LinkedIn', 'Instagram', 'GitHub'].map((platform) => (
										<a key={platform} href='#' className='w-6 h-6 flex items-center justify-center border border-gray-200 rounded-full text-gray-600 hover:bg-gray-100 hover:border-gray-300 transition-colors text-xs' aria-label={platform}>
											{platform[0]}
										</a>
									))}
								</div>
							</div>
						</div>

						{/* Contact Form */}
						<div ref={formRef} style={{ opacity: animationsCreated ? undefined : 1 }}>
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

							<form onSubmit={handleSubmit} className='space-y-2.5'>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-2.5'>
									<div ref={addToFormRefs} style={{ opacity: animationsCreated ? undefined : 1 }}>
										<label htmlFor='name' className='block mb-1 text-xs font-medium text-gray-700'>
											Name *
										</label>
										<input type='text' id='name' name='name' value={formData.name} onChange={handleInputChange} className='w-full px-3 py-1.5 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors text-gray-800 text-sm' placeholder='John Doe' required disabled={isSubmitting} />
									</div>

									<div ref={addToFormRefs} style={{ opacity: animationsCreated ? undefined : 1 }}>
										<label htmlFor='email' className='block mb-1 text-xs font-medium text-gray-700'>
											Email *
										</label>
										<input type='email' id='email' name='email' value={formData.email} onChange={handleInputChange} className='w-full px-3 py-1.5 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors text-gray-800 text-sm' placeholder='john@example.com' required disabled={isSubmitting} />
									</div>
								</div>

								<div ref={addToFormRefs} style={{ opacity: animationsCreated ? undefined : 1 }}>
									<label htmlFor='subject' className='block mb-1 text-xs font-medium text-gray-700'>
										Subject *
									</label>
									<input type='text' id='subject' name='subject' value={formData.subject} onChange={handleInputChange} className='w-full px-3 py-1.5 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors text-gray-800 text-sm' placeholder='Project inquiry' required disabled={isSubmitting} />
								</div>

								<div ref={addToFormRefs} style={{ opacity: animationsCreated ? undefined : 1 }}>
									<label htmlFor='message' className='block mb-1 text-xs font-medium text-gray-700'>
										Message *
									</label>
									<textarea id='message' name='message' value={formData.message} onChange={handleInputChange} rows={2} className='w-full px-3 py-1.5 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors text-gray-800 text-sm resize-none' placeholder='Tell us about your project...' required disabled={isSubmitting}></textarea>
								</div>

								<div ref={addToFormRefs} style={{ opacity: animationsCreated ? undefined : 1 }}>
									<button type='submit' disabled={isSubmitting} className='px-4 py-1.5 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition-colors text-sm disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2'>
										{isSubmitting ? (
											<>
												<div className='w-3 h-3 border border-white border-t-transparent rounded-full animate-spin'></div>
												Sending...
											</>
										) : (
											'Send Message'
										)}
									</button>
								</div>
							</form>
						</div>
					</div>

					{/* Right Column - Image */}
					<div className='lg:col-span-3 flex items-center justify-end' ref={imageRef} style={{ opacity: animationsCreated ? undefined : 1 }}>
						<div className='relative w-full max-w-lg aspect-square rounded-lg overflow-hidden bg-gray-50 ml-auto'>
							<Image src='/contact-page-1.png' alt='Contact us' fill className='object-contain' sizes='(max-width: 1024px) 70vw, 50vw' priority />
						</div>
					</div>
				</div>
			</div>
		</Section>
	);
}
