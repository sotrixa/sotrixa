import Script from 'next/script';

interface GoogleSearchConsoleProps {
	verificationCode: string;
}

export function GoogleSearchConsole({ verificationCode }: GoogleSearchConsoleProps) {
	return (
		<meta
			name="google-site-verification"
			content={verificationCode}
		/>
	);
}

// Bing Webmaster Tools verification
interface BingWebmasterProps {
	verificationCode: string;
}

export function BingWebmaster({ verificationCode }: BingWebmasterProps) {
	return (
		<meta
			name="msvalidate.01"
			content={verificationCode}
		/>
	);
}

// Yandex Webmaster verification
interface YandexWebmasterProps {
	verificationCode: string;
}

export function YandexWebmaster({ verificationCode }: YandexWebmasterProps) {
	return (
		<meta
			name="yandex-verification"
			content={verificationCode}
		/>
	);
}

// Rich snippets for contact information
export function ContactRichSnippet() {
	const contactSchema = {
		'@context': 'https://schema.org',
		'@type': 'LocalBusiness',
		name: 'Sotrixa',
		description: 'Strategic Design Agency for Visionary Thinkers',
		url: 'https://sotrixa.com',
		telephone: '+1-XXX-XXX-XXXX', // Replace with actual phone
		email: 'hello@sotrixa.com',
		address: {
			'@type': 'PostalAddress',
			addressCountry: 'BG',
		},
		openingHours: 'Mo-Fr 09:00-18:00',
		priceRange: '$$',
		serviceArea: {
			'@type': 'Place',
			name: 'Worldwide',
		},
	};

	return (
		<Script
			id="contact-schema"
			type="application/ld+json"
			dangerouslySetInnerHTML={{
				__html: JSON.stringify(contactSchema),
			}}
		/>
	);
}
