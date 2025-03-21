'use client';

import ParallaxContainer from './components/ParallaxContainer';
import SmoothScroll from './components/SmoothScroll';
import ScrollIndicator from './components/ScrollIndicator';
// import ScrollGuide from './components/ScrollGuide';
import KeyboardControls from './components/KeyboardControls';
import HomeSection from './sections/HomeSection';
import IntroSection from './sections/IntroSection';
import ServicesSection from './sections/ServicesSection';
import AboutSection from './sections/AboutSection';
import ContactSection from './sections/ContactSection';
import Navigation from './components/Navigation';

export default function Home() {
	return (
		<main className='relative bg-black min-h-screen'>
			<SmoothScroll />
			<ScrollIndicator />
			{/* <ScrollGuide /> */}
			<KeyboardControls />
			<Navigation />

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
