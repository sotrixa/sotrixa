'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Section from '../components/Section';
import gsap from 'gsap';
import Image from 'next/image';
import styles from './ServicesSection.module.css';

// Define the service type
interface ServiceDetails {
	title: string;
	description: string;
	src: string;
	color: string;
}

// Service descriptions with image paths and colors
const serviceDetails: ServiceDetails[] = [
	{
		title: 'RESEARCH',
		description: 'Data-driven insights that reveal market opportunities and consumer behaviors.',
		src: '/images/research.jpg',
		color: '#7feadb',
	},
	{
		title: 'BRANDING',
		description: 'Crafting distinctive brand identities that resonate with your audience.',
		src: '/images/branding.jpg',
		color: '#f0d566',
	},
	{
		title: 'BUSINESS PLANNING',
		description: 'Strategic roadmaps and execution plans that align with your vision and drive growth.',
		src: '/images/business.jpg',
		color: '#ff9e7d',
	},
	{
		title: 'BESPOKE STRATEGY',
		description: 'Custom strategic frameworks tailored to your unique challenges and opportunities.',
		src: '/images/strategy.jpg',
		color: '#61c0fa',
	},
	{
		title: 'MARKETING',
		description: 'Integrated marketing campaigns that connect with your audience across touchpoints.',
		src: '/images/marketing.jpg',
		color: '#daa1ed',
	},
	{
		title: 'WEBSITE DEVELOPMENT',
		description: 'High-performance digital experiences built with modern technologies.',
		src: '/images/website.jpg',
		color: '#6bde8f',
	},
];

export default function ServicesSection() {
	const [modal, setModal] = useState({ active: false, index: 0 });
	const [viewMode, setViewMode] = useState(false);
	const [selectedService, setSelectedService] = useState<ServiceDetails | null>(null);

	// Scale animation for the modal
	const scaleAnimation = {
		initial: { scale: 0, x: '-50%', y: '-50%' },
		enter: { scale: 1, x: '-50%', y: '-50%', transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] } },
		closed: { scale: 0, x: '-50%', y: '-50%', transition: { duration: 0.4, ease: [0.32, 0, 0.67, 0] } },
	};

	// Refs for GSAP animations
	const modalContainerRef = useRef(null);
	const cursorRef = useRef(null);
	const cursorLabelRef = useRef(null);

	const handleViewClick = () => {
		if (modal.active && modal.index >= 0 && modal.index < serviceDetails.length) {
			console.log('View clicked for service:', serviceDetails[modal.index].title);
			setSelectedService(serviceDetails[modal.index]);
			setViewMode(true);
			setModal({ active: false, index: 0 });
		}
	};

	const handleServiceClick = (index: number) => {
		console.log('Service clicked:', serviceDetails[index].title);
		setSelectedService(serviceDetails[index]);
		setViewMode(true);
		setModal({ active: false, index: 0 });
	};

	const handleBackClick = () => {
		setViewMode(false);
		setSelectedService(null);
	};

	useEffect(() => {
		// Move Container with original timing
		const xMoveContainer = gsap.quickTo(modalContainerRef.current, 'left', { duration: 0.8, ease: 'power3' });
		const yMoveContainer = gsap.quickTo(modalContainerRef.current, 'top', { duration: 0.8, ease: 'power3' });
		// Move cursor with original timing
		const xMoveCursor = gsap.quickTo(cursorRef.current, 'left', { duration: 0.5, ease: 'power3' });
		const yMoveCursor = gsap.quickTo(cursorRef.current, 'top', { duration: 0.5, ease: 'power3' });
		// Move cursor label with slightly faster timing
		const xMoveCursorLabel = gsap.quickTo(cursorLabelRef.current, 'left', { duration: 0.45, ease: 'power3' });
		const yMoveCursorLabel = gsap.quickTo(cursorLabelRef.current, 'top', { duration: 0.45, ease: 'power3' });

		window.addEventListener('mousemove', (e) => {
			const { pageX, pageY } = e;

			xMoveContainer(pageX);
			yMoveContainer(pageY);
			xMoveCursor(pageX);
			yMoveCursor(pageY);
			xMoveCursorLabel(pageX);
			yMoveCursorLabel(pageY);
		});

		return () => {
			window.removeEventListener('mousemove', () => {});
		};
	}, []);

	return (
		<>
			<Section id='services' className='bg-[#FAFAFA] text-black relative overflow-hidden'>
				{!viewMode ? (
					<div className={styles.main}>
						<div className='flex flex-row justify-between items-center w-full h-full'>
							{/* Left Column - Agency Description */}
							<div className='w-1/2 pr-12'>
								<motion.div className='text-4xl md:text-5xl font-bold leading-tight' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
									<p className='tracking-tight'>
										A full-service agency
										<br />
										specialising in <span className='text-[#f0d566]'>brand</span>, <span className='text-[#daa1ed]'>audience</span>, <br></br>
										<span className='text-[#7feadb]'>creative research</span>
									</p>
								</motion.div>
							</div>

							{/* Right Column - Services */}
							<div className='w-1/2'>
								<div className={styles.projectContainer}>
									{serviceDetails.map((service, index) => (
										<div key={service.title} className={styles.project} onMouseEnter={() => setModal({ active: true, index })} onMouseLeave={() => setModal({ active: false, index })}>
											<div className={styles.projectHeader} onClick={() => handleServiceClick(index)}>
												<h2>{service.title}</h2>
												<p>Design & Development</p>
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				) : (
					/* Service Detail View */
					selectedService && (
						<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className={styles.serviceDetail} style={{ backgroundColor: selectedService.color }}>
							<div className='container mx-auto py-16'>
								<button className='mb-8 text-black flex items-center font-medium' onClick={handleBackClick}>
									<svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 mr-2' viewBox='0 0 20 20' fill='currentColor'>
										<path fillRule='evenodd' d='M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z' clipRule='evenodd' />
									</svg>
									Back to services
								</button>

								<div className='flex flex-col md:flex-row'>
									<div className='md:w-1/2 mb-8 md:mb-0 md:pr-12'>
										<h1 className='text-4xl md:text-5xl font-bold mb-6'>{selectedService.title}</h1>
										<p className='text-xl mb-8'>{selectedService.description}</p>
										<div className='bg-white p-6 rounded-lg shadow-lg'>
											<h2 className='text-2xl font-bold mb-4'>Our Approach</h2>
											<p className='mb-4'>We combine strategic insights with creative excellence to deliver results that exceed expectations.</p>
											<ul className='list-disc pl-5 space-y-2'>
												<li>In-depth research and analysis</li>
												<li>Collaborative strategy development</li>
												<li>Creative concept exploration</li>
												<li>Meticulous execution and delivery</li>
												<li>Performance measurement and optimization</li>
											</ul>
										</div>
									</div>
									<div className='md:w-1/2'>
										<div className='rounded-lg overflow-hidden'>
											<Image src={selectedService.src} alt={selectedService.title} width={600} height={400} className='w-full h-auto' unoptimized style={{ objectFit: 'cover' }} />
										</div>
										<div className='mt-8 bg-white p-6 rounded-lg shadow-lg'>
											<h2 className='text-2xl font-bold mb-4'>Our Expertise</h2>
											<p>With years of experience in {selectedService.title.toLowerCase()}, our team brings unparalleled expertise to every project.</p>
										</div>
									</div>
								</div>
							</div>
						</motion.div>
					)
				)}
			</Section>

			<motion.div ref={modalContainerRef} variants={scaleAnimation} initial='initial' animate={modal.active ? 'enter' : 'closed'} className={styles.modalContainer}>
				<div style={{ top: modal.index * -100 + '%' }} className={styles.modalSlider}>
					{serviceDetails.map((service, index) => {
						const { src, color } = service;
						return (
							<div className={styles.modal} style={{ backgroundColor: color }} key={`modal_${index}`}>
								<Image src={src} width={300} height={225} alt={service.title} unoptimized style={{ objectFit: 'cover' }} />
							</div>
						);
					})}
				</div>
			</motion.div>

			<motion.div ref={cursorRef} className={styles.cursor} variants={scaleAnimation} initial='initial' animate={modal.active ? 'enter' : 'closed'} onClick={handleViewClick}></motion.div>

			<motion.div ref={cursorLabelRef} className={styles.cursorLabel} variants={scaleAnimation} initial='initial' animate={modal.active ? 'enter' : 'closed'} onClick={handleViewClick}>
				View
			</motion.div>
		</>
	);
}
