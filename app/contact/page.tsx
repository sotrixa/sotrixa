import type { Metadata } from 'next';
import { OptimizedImage } from '@/app/lib/image-optimization';
import { generateBreadcrumbSchema } from '@/app/lib/seo';
import { ContactRichSnippet } from '@/app/lib/search-console';

export const metadata: Metadata = {
	title: 'Contact Us - Let&apos;s Shape Your Strategic Direction | Sotrixa',
	description: 'Ready to transform your vision into strategy? Contact Sotrixa for strategic design, branding, marketing, and website development services.',
	keywords: ['contact sotrixa', 'strategic design consultation', 'brand strategy consultation', 'marketing strategy consultation', 'get in touch'],
};

export default function ContactPage() {
	const breadcrumbSchema = generateBreadcrumbSchema([
		{ name: 'Home', url: 'https://sotrixa.com' },
		{ name: 'Contact', url: 'https://sotrixa.com/contact' },
	]);

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(breadcrumbSchema),
				}}
			/>
			<ContactRichSnippet />
			<main className="min-h-screen bg-white">
				<div className="container mx-auto px-4 py-16">
					<div className="max-w-6xl mx-auto">
						<div className="grid lg:grid-cols-2 gap-16 items-center">
							<div>
								<h1 className="text-4xl md:text-6xl font-bold mb-6">
									Let&apos;s Shape Your Strategic Direction
								</h1>
								<p className="text-lg md:text-xl text-gray-600 mb-8">
									Ready to transform your vision into strategy? We partner with visionary thinkers 
									to create strategic direction that moves ideas forward.
								</p>

								<div className="space-y-6">
									<div>
										<h3 className="text-xl font-semibold mb-2">Email</h3>
										<a 
											href="mailto:hello@sotrixa.com" 
											className="text-blue-600 hover:text-blue-800 transition-colors"
										>
											hello@sotrixa.com
										</a>
									</div>

									<div>
										<h3 className="text-xl font-semibold mb-2">Services</h3>
										<ul className="space-y-2 text-gray-600">
											<li>• Strategic Research & Analysis</li>
											<li>• Brand Strategy & Identity</li>
											<li>• Marketing Strategy & Campaigns</li>
											<li>• Website Development & Design</li>
										</ul>
									</div>

									<div>
										<h3 className="text-xl font-semibold mb-2">Working Hours</h3>
										<p className="text-gray-600">Monday - Friday, 9:00 AM - 6:00 PM (EET)</p>
									</div>
								</div>
							</div>

							<div className="relative">
								<OptimizedImage
									src="/contact-page.png"
									alt="Contact Sotrixa - Strategic Design Agency"
									width={600}
									height={600}
									className="rounded-lg"
									priority
								/>
							</div>
						</div>

						<div className="mt-16 bg-gray-50 rounded-lg p-8">
							<h2 className="text-2xl font-bold mb-4">Ready to Start?</h2>
							<p className="text-gray-600 mb-6">
								Every project begins by listening. Share your vision, and let&apos;s explore how we can 
								shape strategic direction that moves your ideas forward.
							</p>
							<a
								href="mailto:hello@sotrixa.com?subject=Project Inquiry"
								className="inline-block bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors"
							>
								Start a Conversation
							</a>
						</div>
					</div>
				</div>
			</main>
		</>
	);
}
