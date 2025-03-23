'use client';

import GsapHorizontalScroll from './components/GsapHorizontalScroll';
import KeyboardControls from './components/KeyboardControls';
import HomeSection from './sections/HomeSection';
import IntroSection from './sections/IntroSection';
import ServicesSection from './sections/ServicesSection';

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

				<CaseStudySection />
				<ContactSection />
			</GsapHorizontalScroll>
		</main>
	);
}
