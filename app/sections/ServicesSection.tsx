'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Section from '../components/Section';

// Service descriptions with more detailed and engaging content
const serviceDetails = [
	{
		name: 'RESEARCH',
		description: 'Data-driven insights that reveal market opportunities and consumer behaviors to inform strategic decisions.',
		color: '#7feadb',
		icon: '🔍',
	},
	{
		name: 'BRANDING',
		description: 'Crafting distinctive brand identities that resonate with your audience and stand out in crowded markets.',
		color: '#f0d566',
		icon: '✨',
	},
	{
		name: 'BUSINESS PLANNING',
		description: 'Strategic roadmaps and execution plans that align with your vision and drive measurable growth.',
		color: '#ff9e7d',
		icon: '📊',
	},
	{
		name: 'BESPOKE STRATEGY',
		description: 'Custom strategic frameworks tailored to your unique challenges and opportunities in the marketplace.',
		color: '#61c0fa',
		icon: '🎯',
	},
	{
		name: 'MARKETING',
		description: 'Integrated marketing campaigns that connect with your audience across multiple touchpoints.',
		color: '#daa1ed',
		icon: '📣',
	},
	{
		name: 'WEBSITE DEVELOPMENT',
		description: 'High-performance digital experiences built with modern technologies and conversion-focused design.',
		color: '#6bde8f',
		icon: '💻',
	},
];

export default function ServicesSection() {
	const [activeService, setActiveService] = useState(0);

	// Variant for staggered animations
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: { y: 20, opacity: 0 },
		visible: {
			y: 0,
			opacity: 1,
			transition: { type: 'spring', stiffness: 300, damping: 24 },
		},
	};

	return (
		<Section id='services' className='bg-gradient-to-b from-[#FAFAFA] to-[#F5F5F5] text-black relative overflow-hidden'>
			{/* Decorative background elements */}
			<div className='absolute inset-0 overflow-hidden opacity-5 pointer-events-none'>
				<div className='absolute -top-32 -right-32 w-96 h-96 rounded-full bg-gradient-to-r from-pink-300 to-purple-300 blur-3xl'></div>
				<div className='absolute top-1/2 -left-48 w-96 h-96 rounded-full bg-gradient-to-r from-blue-300 to-teal-300 blur-3xl'></div>
				<div className='absolute -bottom-32 right-1/4 w-80 h-80 rounded-full bg-gradient-to-r from-yellow-300 to-orange-300 blur-3xl'></div>
			</div>

			{/* Single page with headline and services */}
			<div className='px-0 md:px-0 lg:px-0 py-0 h-screen flex items-center'>
				<div className='relative w-full h-full flex items-center justify-around'>
					{/* Main content */}
					<div className='flex flex-col md:flex-row md:items-start justify-around gap-8 w-full'>
						{/* Left Column - Main agency description */}
						<motion.div className='max-w-lg text-4xl md:text-5xl font-bold leading-tight' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
							<p className='tracking-tight'>
								A full-service agency
								<br />
								specialising in <span className='text-[#f0d566]'>brand</span>, <span className='text-[#daa1ed]'>audience</span>, and{' '}
								<span className='text-[#7feadb]'>
									creative
									<br />
									research
								</span>
							</p>
						</motion.div>

						{/* Right Column - Services heading and list */}
						<div className='flex flex-col'>
							{/* Services section heading */}
							<motion.h2 className='text-2xl md:text-base font-serif mb-6' initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
								<span className='uppercase font-serif border-b-2 border-black pb-1'>YOU NEED IT?</span> we do it.
							</motion.h2>

							{/* Services list in column format */}
							<motion.div className='flex flex-col gap-1' variants={containerVariants} initial='hidden' animate='visible'>
								{serviceDetails.map((service, index) => (
									<motion.div key={service.name} className='cursor-pointer perspective-1000 group' variants={itemVariants} onMouseEnter={() => setActiveService(index)}>
										<div className='flex items-center gap-3'>
											<span className='text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300'>{service.icon}</span>
											<motion.span
												className={`relative text-xl md:text-2xl transition-all duration-300 ${index === activeService ? 'text-black font-serif scale-110' : 'text-gray-400'} hover:text-black hover:font-serif hover:scale-110`}
												whileHover={{
													rotateY: 10,
													z: 20,
													textShadow: '2px 2px 0 rgba(0,0,0,0.1)',
												}}
											>
												{service.name}
												{index === activeService && <motion.div className='absolute -bottom-1 left-0 w-full h-0.5' style={{ backgroundColor: service.color }} initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 0.4 }} />}
											</motion.span>
										</div>
									</motion.div>
								))}
							</motion.div>
						</div>
					</div>
				</div>
			</div>
		</Section>
	);
}
