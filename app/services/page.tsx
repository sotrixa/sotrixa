import type { Metadata } from 'next';
import Link from 'next/link';
import { OptimizedImage } from '@/app/lib/image-optimization';
import { generateBreadcrumbSchema } from '@/app/lib/seo';

export const metadata: Metadata = {
	title: 'Services - Strategic Design Solutions | Sotrixa',
	description: 'Discover our strategic design services: Research, Branding, Marketing, and Website Development. We help visionary thinkers shape strategic direction.',
};

const services = [
	{
		id: 'research',
		title: 'Strategic Research',
		description: 'Deep research and analysis to uncover insights that inform strategic direction.',
		image: '/images/research.jpg',
		href: '/services/research',
	},
	{
		id: 'branding',
		title: 'Brand Strategy & Identity',
		description: 'Visual and verbal brand identities that feel alive and true to your business story.',
		image: '/images/branding.jpg',
		href: '/services/branding',
	},
	{
		id: 'marketing',
		title: 'Marketing Strategy',
		description: 'Soulful marketing strategies that resonate and move your audience.',
		image: '/images/marketing.jpg',
		href: '/services/marketing',
	},
	{
		id: 'website-development',
		title: 'Website Development',
		description: 'Websites where form meets feeling, and strategy becomes tangible experience.',
		image: '/images/website.jpg',
		href: '/services/website-development',
	},
];

export default function ServicesPage() {
	const breadcrumbSchema = generateBreadcrumbSchema([
		{ name: 'Home', url: 'https://sotrixa.com' },
		{ name: 'Services', url: 'https://sotrixa.com/services' },
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
							Strategic Design Services
						</h1>
						<p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
							We move from insight to structure, strategy to story — building identities and experiences that hold together and move forward.
						</p>
					</header>

					<div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
						{services.map((service) => (
							<Link
								key={service.id}
								href={service.href}
								className="group block bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
							>
								<div className="aspect-video relative">
									<OptimizedImage
										src={service.image}
										alt={`${service.title} - Sotrixa Strategic Design Service`}
										className="object-cover group-hover:scale-105 transition-transform duration-300"
										fill
									/>
								</div>
								<div className="p-6">
									<h2 className="text-2xl font-bold mb-3 group-hover:text-blue-600 transition-colors">
										{service.title}
									</h2>
									<p className="text-gray-600">
										{service.description}
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
