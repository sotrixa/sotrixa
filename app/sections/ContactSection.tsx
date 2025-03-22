'use client';

import { motion } from 'framer-motion';
import Section from '../components/Section';

export default function ContactSection() {
	return (
		<Section id='contact' className='bg-gray-800 text-white'>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
				<motion.div className='space-y-6' initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
					<h2 className='text-5xl font-bold'>Get In Touch</h2>
					<p className='text-lg'>Ready to start your project? Contact us today and let&apos;s discuss how we can help you achieve your business goals.</p>
					<div className='space-y-4'>
						<div className='flex items-center'>
							<span className='text-xl mr-3'>📍</span>
							<span>123 Business Avenue, Tech City</span>
						</div>
						<div className='flex items-center'>
							<span className='text-xl mr-3'>📧</span>
							<span>info@example.com</span>
						</div>
						<div className='flex items-center'>
							<span className='text-xl mr-3'>📞</span>
							<span>+1 (555) 123-4567</span>
						</div>
					</div>
				</motion.div>

				<motion.div className='bg-gray-700 rounded-xl p-8' initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
					<form className='space-y-4' suppressHydrationWarning>
						<div>
							<label htmlFor='name' className='block mb-2 text-sm font-medium'>
								Your Name
							</label>
							<input type='text' id='name' className='w-full px-4 py-3 bg-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none' placeholder='John Doe' suppressHydrationWarning />
						</div>
						<div>
							<label htmlFor='email' className='block mb-2 text-sm font-medium'>
								Your Email
							</label>
							<input type='email' id='email' className='w-full px-4 py-3 bg-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none' placeholder='john@example.com' suppressHydrationWarning />
						</div>
						<div>
							<label htmlFor='message' className='block mb-2 text-sm font-medium'>
								Your Message
							</label>
							<textarea id='message' rows={4} className='w-full px-4 py-3 bg-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none' placeholder='How can we help you?' suppressHydrationWarning></textarea>
						</div>
						<button type='submit' className='w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors'>
							Send Message
						</button>
					</form>
				</motion.div>
			</div>
		</Section>
	);
}
