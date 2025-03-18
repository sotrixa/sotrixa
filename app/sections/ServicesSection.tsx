'use client';

import { motion } from 'framer-motion';
import Section from '../components/Section';

const services = [
	{
		icon: '💻',
		title: 'Web Development',
		description: 'Custom websites built with latest technologies and optimized for performance.',
	},
	{
		icon: '📱',
		title: 'Mobile Apps',
		description: 'Native and cross-platform mobile applications that deliver exceptional user experiences.',
	},
	{
		icon: '🛠️',
		title: 'UI/UX Design',
		description: 'User-centered design that enhances usability and increases engagement.',
	},
	{
		icon: '🚀',
		title: 'Digital Marketing',
		description: 'Strategic campaigns that drive traffic, leads, and conversions.',
	},
];

export default function ServicesSection() {
	return (
		<Section id='services' className='bg-purple-600 text-white'>
			<div className='space-y-12'>
				<motion.div className='text-center' initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
					<h2 className='text-5xl font-bold mb-4'>Our Services</h2>
					<p className='text-xl max-w-3xl mx-auto'>We offer a comprehensive range of digital services to help your business thrive.</p>
				</motion.div>

				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
					{services.map((service, index) => (
						<motion.div key={service.title} className='bg-purple-700 p-6 rounded-xl' initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: index * 0.1 }} whileHover={{ y: -10, transition: { duration: 0.2 } }}>
							<span className='text-4xl block mb-4'>{service.icon}</span>
							<h3 className='text-2xl font-bold mb-2'>{service.title}</h3>
							<p>{service.description}</p>
						</motion.div>
					))}
				</div>
			</div>
		</Section>
	);
}
