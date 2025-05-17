'use client';

import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
	gsap.registerPlugin(ScrollTrigger);
}

export default function MobileContactSection() {
	const sectionRef = useRef<HTMLDivElement>(null);
	const headingRef = useRef<HTMLHeadingElement>(null);
	const formRef = useRef<HTMLFormElement>(null);
	const infoRef = useRef<HTMLDivElement>(null);

	const [formData, setFormData] = useState({
		name: '',
		email: '',
		company: '',
		message: '',
	});

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log('Form submitted:', formData);
		// Here you would typically send the data to your backend or a form handling service
		// For this example, we'll just reset the form
		setFormData({
			name: '',
			email: '',
			company: '',
			message: '',
		});
		alert('Thank you for your message! We will get back to you soon.');
	};

	// Animation effect
	useEffect(() => {
		if (typeof window === 'undefined' || !sectionRef.current) return;

		// Heading animation
		gsap.fromTo(
			headingRef.current,
			{ opacity: 0, y: 30 },
			{
				opacity: 1,
				y: 0,
				duration: 0.8,
				scrollTrigger: {
					trigger: headingRef.current,
					start: 'top 80%',
					toggleActions: 'play none none reverse',
				},
			}
		);

		// Form animation
		gsap.fromTo(
			formRef.current,
			{ opacity: 0, y: 30 },
			{
				opacity: 1,
				y: 0,
				duration: 0.8,
				delay: 0.2,
				scrollTrigger: {
					trigger: formRef.current,
					start: 'top 85%',
					toggleActions: 'play none none reverse',
				},
			}
		);

		// Info animation
		gsap.fromTo(
			infoRef.current,
			{ opacity: 0, y: 30 },
			{
				opacity: 1,
				y: 0,
				duration: 0.8,
				delay: 0.4,
				scrollTrigger: {
					trigger: infoRef.current,
					start: 'top 85%',
					toggleActions: 'play none none reverse',
				},
			}
		);

		return () => {
			ScrollTrigger.getAll().forEach((trigger) => trigger.kill(true));
		};
	}, []);

	return (
		<section ref={sectionRef} id='mobile-contact' className='min-h-screen py-16 px-4 bg-gray-950'>
			<div className='max-w-lg mx-auto'>
				<h2 ref={headingRef} className='text-3xl font-bold text-white mb-10 text-center'>
					Get In Touch
				</h2>

				<form ref={formRef} onSubmit={handleSubmit} className='mb-12 bg-gray-900 p-6 rounded-lg shadow-lg'>
					<div className='mb-4'>
						<label htmlFor='name' className='block text-white mb-2'>
							Name
						</label>
						<input type='text' id='name' name='name' value={formData.name} onChange={handleInputChange} className='w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-teal-500 focus:outline-none' required />
					</div>

					<div className='mb-4'>
						<label htmlFor='email' className='block text-white mb-2'>
							Email
						</label>
						<input type='email' id='email' name='email' value={formData.email} onChange={handleInputChange} className='w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-teal-500 focus:outline-none' required />
					</div>

					<div className='mb-4'>
						<label htmlFor='company' className='block text-white mb-2'>
							Company (Optional)
						</label>
						<input type='text' id='company' name='company' value={formData.company} onChange={handleInputChange} className='w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-teal-500 focus:outline-none' />
					</div>

					<div className='mb-6'>
						<label htmlFor='message' className='block text-white mb-2'>
							Message
						</label>
						<textarea id='message' name='message' value={formData.message} onChange={handleInputChange} rows={4} className='w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-teal-500 focus:outline-none' required></textarea>
					</div>

					<button type='submit' className='w-full py-3 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-600 transition-colors'>
						Send Message
					</button>
				</form>

				<div ref={infoRef} className='text-white'>
					<h3 className='text-xl font-semibold mb-4 text-center'>Other Ways to Connect</h3>

					<div className='grid grid-cols-1 gap-4 text-center'>
						<div>
							<p className='text-gray-400'>Email</p>
							<a href='mailto:info@sotrixa.com' className='text-teal-400 hover:underline'>
								info@sotrixa.com
							</a>
						</div>

						<div>
							<p className='text-gray-400'>Phone</p>
							<a href='tel:+15555555555' className='text-teal-400 hover:underline'>
								+1 (555) 555-5555
							</a>
						</div>

						<div>
							<p className='text-gray-400'>Address</p>
							<address className='not-italic text-teal-400'>
								123 Strategy Avenue
								<br />
								Innovation District
								<br />
								San Francisco, CA 94105
							</address>
						</div>
					</div>

					<div className='flex justify-center mt-6 space-x-4'>
						<a href='#' className='text-gray-400 hover:text-white'>
							<span className='sr-only'>Twitter</span>
							<svg className='h-6 w-6' fill='currentColor' viewBox='0 0 24 24' aria-hidden='true'>
								<path d='M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84' />
							</svg>
						</a>

						<a href='#' className='text-gray-400 hover:text-white'>
							<span className='sr-only'>LinkedIn</span>
							<svg className='h-6 w-6' fill='currentColor' viewBox='0 0 24 24' aria-hidden='true'>
								<path d='M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z' />
							</svg>
						</a>

						<a href='#' className='text-gray-400 hover:text-white'>
							<span className='sr-only'>Instagram</span>
							<svg className='h-6 w-6' fill='currentColor' viewBox='0 0 24 24' aria-hidden='true'>
								<path fillRule='evenodd' d='M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z' clipRule='evenodd' />
							</svg>
						</a>
					</div>
				</div>
			</div>
		</section>
	);
}
