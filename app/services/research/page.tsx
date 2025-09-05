import type { Metadata } from 'next';
import { OptimizedImage } from '@/app/lib/image-optimization';
import { generateServiceSchema, generateBreadcrumbSchema } from '@/app/lib/seo';

export const metadata: Metadata = {
	title: 'Strategic Research Services | Sotrixa',
	description: 'Deep research and analysis to uncover insights that inform strategic direction. We turn data into strategy and insights into action.',
	keywords: ['strategic research', 'market research', 'business analysis', 'strategic insights', 'data analysis', 'competitive research'],
};

export default function ResearchPage() {
	const serviceSchema = generateServiceSchema({
		name: 'Strategic Research',
		description: 'Deep research and analysis to uncover insights that inform strategic direction.',
		url: 'https://sotrixa.com/services/research',
	});

	const breadcrumbSchema = generateBreadcrumbSchema([
		{ name: 'Home', url: 'https://sotrixa.com' },
		{ name: 'Services', url: 'https://sotrixa.com/services' },
		{ name: 'Research', url: 'https://sotrixa.com/services/research' },
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
							Strategic Research
						</h1>
						<p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
							Deep research and analysis to uncover insights that inform strategic direction.
						</p>
					</header>

					<div className="max-w-4xl mx-auto">
						<div className="aspect-video mb-12">
							<OptimizedImage
								src="/images/research.jpg"
								alt="Strategic Research - Data Analysis and Insights"
								className="object-cover rounded-lg"
								fill
								priority
							/>
						</div>

						<div className="prose prose-lg max-w-none">
							<h2>Turning Data into Strategy</h2>
							<p>
								Every great strategy begins with understanding. Through meticulous research and analysis, 
								we uncover the insights that become the foundation of strategic direction.
							</p>

							<h3>Our Research Approach</h3>
							<ul>
								<li><strong>Market Analysis:</strong> Understanding your competitive landscape and market opportunities</li>
								<li><strong>User Research:</strong> Deep insights into your audience&apos;s needs, behaviors, and motivations</li>
								<li><strong>Strategic Analysis:</strong> Identifying patterns and opportunities that inform decision-making</li>
								<li><strong>Trend Forecasting:</strong> Anticipating future market movements and opportunities</li>
							</ul>

							<h3>What You Get</h3>
							<p>
								Our research deliverables include comprehensive reports, strategic recommendations, 
								and actionable insights that inform every aspect of your business strategy.
							</p>
						</div>
					</div>
				</div>
			</main>
		</>
	);
}
