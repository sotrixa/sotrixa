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
		// FORCE CONTACT FORM TO BE INTERACTIVE - ONE TIME SETUP
		const forceContactFormInteractive = () => {
			const contactSection = document.getElementById('contact');
			if (contactSection) {
				// Set the contact section to highest priority
				contactSection.style.position = 'relative';
				contactSection.style.zIndex = '99999';
				
				// Force all form elements to be interactive
				const formElements = contactSection.querySelectorAll('input, textarea, button, label, form, select');
				formElements.forEach((element) => {
					const el = element as HTMLElement;
					el.style.setProperty('pointer-events', 'auto', 'important');
					el.style.setProperty('user-select', 'text', 'important');
					el.style.setProperty('cursor', 'text', 'important');
					el.style.setProperty('z-index', '99999', 'important');
					el.style.setProperty('position', 'relative', 'important');
					
					// Ensure inputs and textareas are focusable
					if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
						el.style.setProperty('background-color', 'white', 'important');
						el.style.setProperty('border', '1px solid #d1d5db', 'important');
						el.tabIndex = 0; // Ensure they're focusable
					}
				});
				
				// Special handling for buttons
				const buttons = contactSection.querySelectorAll('button');
				buttons.forEach((button) => {
					const btn = button as HTMLElement;
					btn.style.setProperty('cursor', 'pointer', 'important');
					btn.style.setProperty('background-color', '#000', 'important');
					btn.style.setProperty('color', 'white', 'important');
					btn.tabIndex = 0; // Ensure they're focusable
				});
				
				// Stop all event propagation from contact section
				const stopPropagation = (e: Event) => {
					e.stopPropagation();
				};
				
				contactSection.addEventListener('wheel', stopPropagation, { capture: true });
				contactSection.addEventListener('mousedown', stopPropagation, { capture: true });
				contactSection.addEventListener('touchstart', stopPropagation, { capture: true });
				contactSection.addEventListener('keydown', stopPropagation, { capture: true });
				
			}
		};
		
		// Force immediately and after multiple delays to ensure DOM is ready
		forceContactFormInteractive();
		setTimeout(forceContactFormInteractive, 100);
		setTimeout(forceContactFormInteractive, 500);
		setTimeout(forceContactFormInteractive, 1000);
		
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
		<Section id='contact' className='bg-[#FAFAFA] text-black min-h-screen flex items-center justify-center pt-12 sm:pt-16 md:pt-20 pb-16 sm:pb-20 md:pb-24'>
			<div className='w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 max-w-7xl mx-auto'>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8 items-start'>
					{/* Left Column - Contact Content */}
					<div className='md:col-span-1 lg:col-span-2 space-y-3 sm:space-y-4 mt-4 sm:mt-6 md:mt-8 lg:mt-16' ref={contactInfoRef} style={{ opacity: animationsCreated ? undefined : 1 }}>
						{/* Contact Information */}
						<div className='space-y-2 sm:space-y-3'>
							
							<div>
								<p className='text-xs uppercase tracking-wider font-medium text-gray-500 mb-2'>Get in touch with us</p>

								<div className='space-y-1.5'>
									<div className='flex items-center space-x-3'>
										<div className='w-7 h-7 flex items-center justify-center bg-black rounded-sm'>
											<svg className='w-4 h-4 text-white' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'>
												<rect width='20' height='16' x='2' y='4' rx='2'></rect>
												<path d='m22 7-10 5L2 7'></path>
											</svg>
										</div>
										<a href='mailto:direction@sotrixa.com' className='text-gray-700 hover:text-black transition-colors text-sm'>
										direction@sotrixa.com
										</a>
									</div>

									<div className='flex items-center space-x-3'>
										
										
									</div>

									<div className='flex items-center space-x-3'>
										<div className='w-7 h-7 flex items-center justify-center bg-gray-800 rounded-sm'>
											<svg className='w-4 h-4 text-white' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'>
												<path d='M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z'></path>
												<circle cx='12' cy='10' r='3'></circle>
											</svg>
										</div>
										<p className='text-gray-700 text-sm'>Sofia, Bulgaria</p>
									</div>
								</div>
							</div>

							<div>
								<p className='text-xs uppercase tracking-wider font-medium text-gray-500 mb-2'>Follow Us</p>
								<div className='flex space-x-2'>
									{/* Instagram */}
									<a href='#' className='w-8 h-8 flex items-center justify-center border border-black hover:bg-gray-100 transition-colors rounded-sm' aria-label='Instagram'>
										<svg className='w-4 h-4 text-black' fill='currentColor' viewBox='0 0 24 24'>
											<path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z'/>
										</svg>
									</a>
									
									{/* LinkedIn */}
									<a href='#' className='w-8 h-8 flex items-center justify-center border border-black hover:bg-gray-100 transition-colors rounded-sm' aria-label='LinkedIn'>
										<svg className='w-4 h-4 text-black' fill='currentColor' viewBox='0 0 24 24'>
											<path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'/>
										</svg>
									</a>
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

							<form onSubmit={handleSubmit} className='space-y-2 sm:space-y-2.5 contact-form-override' style={{ pointerEvents: 'auto', userSelect: 'text', position: 'relative', zIndex: 99999 }}>
								<div className='grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5'>
									<div ref={addToFormRefs} style={{ opacity: animationsCreated ? undefined : 1, pointerEvents: 'auto', userSelect: 'text' }}>
										<label htmlFor='name' className='block mb-1 text-xs font-medium text-gray-700' style={{ pointerEvents: 'auto', cursor: 'default' }}>
											Name *
										</label>
										<input 
											type='text' 
											id='name' 
											name='name' 
											value={formData.name} 
											onChange={handleInputChange} 
											className='w-full px-3 py-1.5 sm:py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors text-gray-800 text-sm' 
											placeholder='John Doe' 
											required 
											disabled={isSubmitting}
											style={{ 
												pointerEvents: 'auto' as const, 
												cursor: 'text', 
												userSelect: 'text',
												position: 'relative',
												zIndex: 99999,
												backgroundColor: 'white',
												border: '1px solid #d1d5db'
											}}
										/>
									</div>

									<div ref={addToFormRefs} style={{ opacity: animationsCreated ? undefined : 1, pointerEvents: 'auto', userSelect: 'text' }}>
										<label htmlFor='email' className='block mb-1 text-xs font-medium text-gray-700' style={{ pointerEvents: 'auto', cursor: 'default' }}>
											Email *
										</label>
										<input 
											type='email' 
											id='email' 
											name='email' 
											value={formData.email} 
											onChange={handleInputChange} 
											className='w-full px-3 py-1.5 sm:py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors text-gray-800 text-sm' 
											placeholder='john@example.com' 
											required 
											disabled={isSubmitting}
											style={{ 
												pointerEvents: 'auto' as const, 
												cursor: 'text', 
												userSelect: 'text',
												position: 'relative',
												zIndex: 99999,
												backgroundColor: 'white',
												border: '1px solid #d1d5db'
											}}
										/>
									</div>
								</div>

								<div ref={addToFormRefs} style={{ opacity: animationsCreated ? undefined : 1, pointerEvents: 'auto', userSelect: 'text' }}>
									<label htmlFor='subject' className='block mb-1 text-xs font-medium text-gray-700' style={{ pointerEvents: 'auto', cursor: 'default' }}>
										Subject *
									</label>
									<input 
										type='text' 
										id='subject' 
										name='subject' 
										value={formData.subject} 
										onChange={handleInputChange} 
										className='w-full px-3 py-1.5 sm:py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors text-gray-800 text-sm' 
										placeholder='Project inquiry' 
										required 
										disabled={isSubmitting}
										style={{ 
											pointerEvents: 'auto' as const, 
											cursor: 'text', 
											userSelect: 'text',
											position: 'relative',
											zIndex: 10000
										}}
									/>
								</div>

								<div ref={addToFormRefs} style={{ opacity: animationsCreated ? undefined : 1, pointerEvents: 'auto', userSelect: 'text' }}>
									<label htmlFor='message' className='block mb-1 text-xs font-medium text-gray-700' style={{ pointerEvents: 'auto', cursor: 'default' }}>
										Message *
									</label>
									<textarea 
										id='message' 
										name='message' 
										value={formData.message} 
										onChange={handleInputChange} 
										rows={3} 
										className='w-full px-3 py-1.5 sm:py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors text-gray-800 text-sm resize-none' 
										placeholder='Tell us about your project...' 
										required 
										disabled={isSubmitting}
										style={{ 
											pointerEvents: 'auto' as const, 
											cursor: 'text', 
											userSelect: 'text',
											position: 'relative',
											zIndex: 10000
										}}
									></textarea>
								</div>

								<div ref={addToFormRefs} style={{ opacity: animationsCreated ? undefined : 1, pointerEvents: 'auto' }}>
									<button 
										type='submit' 
										disabled={isSubmitting} 
										className='px-4 sm:px-5 py-1.5 sm:py-2 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition-colors text-sm disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2'
										style={{ 
											pointerEvents: 'auto' as const, 
											cursor: 'pointer',
											position: 'relative',
											zIndex: 10000
										}}
									>
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
					<div className='md:col-span-1 lg:col-span-3 flex items-center justify-center md:justify-end mt-6 md:mt-0' ref={imageRef} style={{ opacity: animationsCreated ? undefined : 1 }}>
						<div className='relative w-full max-w-sm sm:max-w-md lg:max-w-lg aspect-square rounded-lg overflow-hidden bg-gray-50 md:ml-auto'>
							<Image src='/contact-page-1.png' alt='Contact us' fill className='object-contain' sizes='(max-width: 640px) 90vw, (max-width: 768px) 70vw, (max-width: 1024px) 50vw, 40vw' priority />
						</div>
					</div>
				</div>
			</div>
		</Section>
	);
}
