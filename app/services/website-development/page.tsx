import type { Metadata } from 'next';
import { OptimizedImage } from '@/app/lib/image-optimization';
import { generateServiceSchema, generateBreadcrumbSchema } from '@/app/lib/seo';

export const metadata: Metadata = {
	title: 'Website Development Services | Sotrixa',
	description: 'Crafting websites where form meets feeling, and strategy becomes tangible experience. Beautiful, functional digital spaces that reflect your brand essence.',
	keywords: ['website development', 'web design', 'user experience', 'responsive design', 'website strategy', 'digital experience'],
};

export default function WebsiteDevelopmentPage() {
	const serviceSchema = generateServiceSchema({
		name: 'Website Development',
		description: 'Websites where form meets feeling, and strategy becomes tangible experience.',
		url: 'https://sotrixa.com/services/website-development',
	});

	const breadcrumbSchema = generateBreadcrumbSchema([
		{ name: 'Home', url: 'https://sotrixa.com' },
		{ name: 'Services', url: 'https://sotrixa.com/services' },
		{ name: 'Website Development', url: 'https://sotrixa.com/services/website-development' },
	]);

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(serviceSchema),
				}}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(breadcrumbSchema),
				}}
			/>
			<main className="min-h-screen bg-white">
				<div className="container mx-auto px-4 py-16">
					<header className="text-center mb-16">
						<h1 className="text-4xl md:text-6xl font-bold mb-6">
							Website Development
						</h1>
						<p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
							Crafting websites where form meets feeling, and strategy becomes tangible experience.
						</p>
					</header>

					<div className="max-w-4xl mx-auto">
						<div className="aspect-video mb-12">
							<OptimizedImage
								src="/images/website.jpg"
								alt="Website Development - Digital Experience Design"
								className="object-cover rounded-lg"
								fill
								priority
							/>
						</div>

						<div className="prose prose-lg max-w-none">
							<h2>Where Presence Becomes Tangible—And Impact Begins</h2>
							<p>
								Your website is the home of your vision—where strategy meets experience and form meets feeling. 
								At Sotrixa, we design digital spaces that are not only beautiful but deeply functional—reflecting 
								your brand&apos;s essence while guiding your audience into connection and action.
							</p>

							<h3>Our Development Process</h3>
							<ul>
								<li><strong>Strategic Planning:</strong> Understanding your goals and user journey</li>
								<li><strong>User Experience Design:</strong> Creating intuitive, engaging interactions</li>
								<li><strong>Visual Design:</strong> Crafting beautiful interfaces that reflect your brand</li>
								<li><strong>Development:</strong> Building responsive, accessible, high-performance websites</li>
								<li><strong>Optimization:</strong> Continuous improvement for better results</li>
							</ul>

							<h3>Technical Excellence</h3>
							<p>
								Rooted in clarity, crafted with care, your website becomes a living, evolving expression 
								of everything you stand for. We build responsive, accessible experiences optimized to 
								deliver your message with impact, creating seamless journeys that engage and convert.
							</p>
						</div>
					</div>
				</div>
			</main>
		</>
	);
}
