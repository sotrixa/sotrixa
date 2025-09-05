import type { Metadata } from 'next';
import { OptimizedImage } from '@/app/lib/image-optimization';
import { generateServiceSchema, generateBreadcrumbSchema } from '@/app/lib/seo';

export const metadata: Metadata = {
	title: 'Brand Strategy & Identity Services | Sotrixa',
	description: 'Bringing your business&apos;s true story to life—visually, verbally, and emotionally. We create brand identities that feel alive and true.',
	keywords: ['brand strategy', 'brand identity', 'visual identity', 'brand design', 'logo design', 'brand positioning'],
};

export default function BrandingPage() {
	const serviceSchema = generateServiceSchema({
		name: 'Brand Strategy & Identity',
		description: 'Visual and verbal brand identities that feel alive and true to your business story.',
		url: 'https://sotrixa.com/services/branding',
	});

	const breadcrumbSchema = generateBreadcrumbSchema([
		{ name: 'Home', url: 'https://sotrixa.com' },
		{ name: 'Services', url: 'https://sotrixa.com/services' },
		{ name: 'Branding', url: 'https://sotrixa.com/services/branding' },
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
							Brand Strategy & Identity
						</h1>
						<p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
							Bringing your business&apos;s true story to life—visually, verbally, and emotionally.
						</p>
					</header>

					<div className="max-w-4xl mx-auto">
						<div className="aspect-video mb-12">
							<OptimizedImage
								src="/images/branding.jpg"
								alt="Brand Strategy & Identity - Visual Brand Development"
								className="object-cover rounded-lg"
								fill
								priority
							/>
						</div>

						<div className="prose prose-lg max-w-none">
							<h2>More Than an Aesthetic—An Invitation</h2>
							<p>
								A brand is the memory, the feeling, the story people carry after they meet you. 
								At Sotrixa, branding is an act of alignment: we listen deeply to what your business 
								is becoming and translate that into visual and verbal identities that feel alive and true.
							</p>

							<h3>Our Branding Process</h3>
							<ul>
								<li><strong>Brand Strategy:</strong> Defining your brand&apos;s purpose, positioning, and personality</li>
								<li><strong>Visual Identity:</strong> Logos, color palettes, typography, and design elements</li>
								<li><strong>Brand Voice:</strong> Tone, messaging, and communication guidelines</li>
								<li><strong>Brand Guidelines:</strong> Comprehensive systems for consistent brand application</li>
							</ul>

							<h3>What Makes Us Different</h3>
							<p>
								We create brands with precision and emotional resonance. Your brand becomes an invitation: 
								a true reflection of your story, ready to connect and inspire.
							</p>
						</div>
					</div>
				</div>
			</main>
		</>
	);
}
