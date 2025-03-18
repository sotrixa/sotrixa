'use client';

import ParallaxContainer from './components/ParallaxContainer';
import SmoothScroll from './components/SmoothScroll';
import MobileMenu from './components/MobileMenu';
import ScrollIndicator from './components/ScrollIndicator';
import ScrollGuide from './components/ScrollGuide';
import KeyboardControls from './components/KeyboardControls';
import HomeSection from './sections/HomeSection';
import IntroSection from './sections/IntroSection';
import ServicesSection from './sections/ServicesSection';
import AboutSection from './sections/AboutSection';
import ContactSection from './sections/ContactSection';

export default function Home() {
	return (
		<main className='relative bg-black min-h-screen'>
			<SmoothScroll />
			<ScrollIndicator />
			<ScrollGuide />
			<KeyboardControls />

			<nav className='fixed top-0 left-0 w-full z-50 bg-black bg-opacity-70 backdrop-blur-sm text-white shadow-lg'>
				<div className='container mx-auto px-6 py-4'>
					<div className='flex justify-between items-center'>
						<div className='text-2xl font-bold'>Company</div>
						<div className='hidden md:flex space-x-8'>
							<a href='#home' className='hover:text-blue-400 transition-colors'>
								Home
							</a>
							<a href='#intro' className='hover:text-blue-400 transition-colors'>
								Intro
							</a>
							<a href='#services' className='hover:text-blue-400 transition-colors'>
								Services
							</a>
							<a href='#about' className='hover:text-blue-400 transition-colors'>
								About
							</a>
							<a href='#contact' className='hover:text-blue-400 transition-colors'>
								Contact
							</a>
						</div>
						<MobileMenu />
					</div>
				</div>
			</nav>

			<ParallaxContainer>
				<HomeSection />
				<IntroSection />
				<ServicesSection />
				<AboutSection />
				<ContactSection />
			</ParallaxContainer>
		</main>
	);
}
