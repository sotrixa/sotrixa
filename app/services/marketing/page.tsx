import type { Metadata } from 'next';
import { OptimizedImage } from '@/app/lib/image-optimization';
import { generateServiceSchema, generateBreadcrumbSchema } from '@/app/lib/seo';

export const metadata: Metadata = {
	title: 'Marketing Strategy Services | Sotrixa',
	description: 'Expanding your presence with soulful marketing strategies that resonate and move. We craft marketing that is intelligent, authentic, and impactful.',
	keywords: ['marketing strategy', 'digital marketing', 'marketing campaigns', 'content strategy', 'marketing consulting', 'brand marketing'],
};

export default function MarketingPage() {
	const serviceSchema = generateServiceSchema({
		name: 'Marketing Strategy',
		description: 'Soulful marketing strategies that resonate and move your audience.',
		url: 'https://sotrixa.com/services/marketing',
	});

	const breadcrumbSchema = generateBreadcrumbSchema([
		{ name: 'Home', url: 'https://sotrixa.com' },
		{ name: 'Services', url: 'https://sotrixa.com/services' },
		{ name: 'Marketing', url: 'https://sotrixa.com/services/marketing' },
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
							Marketing Strategy
						</h1>
						<p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
							Expanding your presence with soulful marketing strategies that resonate and move.
						</p>
					</header>

					<div className="max-w-4xl mx-auto">
						<div className="aspect-video mb-12">
							<OptimizedImage
								src="/images/marketing.jpg"
								alt="Marketing Strategy - Digital Marketing and Campaign Development"
								className="object-cover rounded-lg"
								fill
								priority
							/>
						</div>

						<div className="prose prose-lg max-w-none">
							<h2>Your Story Doesn&apos;t Just Travel—It Moves, It Resonates</h2>
							<p>
								Marketing is the movement of your story into the world—the choreography of voice, 
								vision, and presence. At Sotrixa, we craft marketing strategies that are intelligent, 
								soulful, and grounded in authenticity.
							</p>

							<h3>Our Marketing Approach</h3>
							<ul>
								<li><strong>Channel Strategy:</strong> Identifying the right platforms and touchpoints for your audience</li>
								<li><strong>Campaign Direction:</strong> Creative concepts that amplify your message</li>
								<li><strong>Content Pillars:</strong> Strategic content frameworks that drive engagement</li>
								<li><strong>Creative Activations:</strong> Innovative campaigns that capture attention</li>
								<li><strong>Performance Measurement:</strong> Data-driven optimization for maximum impact</li>
							</ul>

							<h3>Building Momentum</h3>
							<p>
								From channel strategies and campaign direction to content pillars, creative activations, 
								and collaborations, every element amplifies your voice and expands your reach with 
								coherence, clarity, and impact.
							</p>
						</div>
					</div>
				</div>
			</main>
		</>
	);
}
