'use client';

import GsapHorizontalScroll from './components/GsapHorizontalScroll';
import KeyboardControls from './components/KeyboardControls';
import HomeSection from './sections/HomeSection';
import IntroSection from './sections/IntroSection';
import ServicesSection from './sections/ServicesSection';
import ScrollPathPagination from './components/ScrollPathPagination';
import CaseStudySection from './sections/CaseStudySection';
import ContactSection from './sections/ContactSection';
import Navigation from './components/Navigation';

export default function Home() {
	// Sections for the pagination
	const sections = ['Home', 'Intro', 'Services', 'Case Study', 'Contact'];

	return (
		<>
			{/* Direct inclusion of pagination with the new design */}
			<ScrollPathPagination sections={sections} activeSection={0} />

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
		</>
	);
}
