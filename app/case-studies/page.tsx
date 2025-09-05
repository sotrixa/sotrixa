import type { Metadata } from 'next';
import Link from 'next/link';
import { OptimizedImage } from '@/app/lib/image-optimization';
import { generateBreadcrumbSchema } from '@/app/lib/seo';

export const metadata: Metadata = {
	title: 'Case Studies - Strategic Design Projects | Sotrixa',
	description: 'Explore our strategic design case studies. See how we build with purpose and create outcomes that reflect the thinking behind them.',
	keywords: ['case studies', 'design portfolio', 'strategic projects', 'brand strategy examples', 'marketing campaigns', 'design work'],
};

const caseStudies = [
	{
		id: 'brand-strategy',
		title: 'Brand Strategy Transformation',
		description: 'Complete brand strategy and visual identity redesign for a growing tech startup.',
		image: '/case-studies/brand-a.jpg',
		category: 'Branding',
		href: '/case-studies/brand-strategy',
	},
	{
		id: 'marketing-strategy',
		title: 'Marketing Strategy & Campaign',
		description: 'Comprehensive marketing strategy that increased brand awareness by 300%.',
		image: '/case-studies/marketing.jpg',
		category: 'Marketing',
		href: '/case-studies/marketing-strategy',
	},
	{
		id: 'business-strategy',
		title: 'Business Strategy Consulting',
		description: 'Strategic consulting that helped a business pivot and find new market opportunities.',
		image: '/case-studies/business.jpg',
		category: 'Strategy',
		href: '/case-studies/business-strategy',
	},
];

export default function CaseStudiesPage() {
	const breadcrumbSchema = generateBreadcrumbSchema([
		{ name: 'Home', url: 'https://sotrixa.com' },
		{ name: 'Case Studies', url: 'https://sotrixa.com/case-studies' },
	]);

	return (
		<>
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
							Case Studies
						</h1>
						<p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
							We build with purpose—and every outcome reflects the thinking behind it. 
							A glimpse into how we shape strategy, identity, and experience with intention.
						</p>
					</header>

					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
						{caseStudies.map((study) => (
							<Link
								key={study.id}
								href={study.href}
								className="group block bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
							>
								<div className="aspect-video relative">
									<OptimizedImage
										src={study.image}
										alt={`${study.title} - Sotrixa Case Study`}
										className="object-cover group-hover:scale-105 transition-transform duration-300"
										fill
									/>
									<div className="absolute top-4 left-4">
										<span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
											{study.category}
										</span>
									</div>
								</div>
								<div className="p-6">
									<h2 className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors">
										{study.title}
									</h2>
									<p className="text-gray-600">
										{study.description}
									</p>
								</div>
							</Link>
						))}
					</div>
				</div>
			</main>
		</>
	);
}
