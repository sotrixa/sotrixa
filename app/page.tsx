'use client';

import GsapHorizontalScroll from './components/GsapHorizontalScroll';
import KeyboardControls from './components/KeyboardControls';
import HomeSection from './sections/HomeSection';
import IntroSection from './sections/IntroSection';
import ServicesSection from './sections/ServicesSection';
import AboutSection from './sections/AboutSection';
import CaseStudySection from './sections/CaseStudySection';
import ContactSection from './sections/ContactSection';
import Navigation from './components/Navigation';

export default function Home() {
	return (
		<main className='relative bg-black min-h-screen'>
			<KeyboardControls />
			<Navigation />

			<GsapHorizontalScroll>
				<HomeSection />
				<IntroSection />
				<ServicesSection />
				<AboutSection />
				<CaseStudySection />
				<ContactSection />
			</GsapHorizontalScroll>
		</main>
	);
}
