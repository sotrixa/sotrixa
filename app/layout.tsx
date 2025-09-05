import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import CustomCursor from './components/CustomCursor';
import { LanguageProvider } from './data/LanguageContext';
import { generateMetadata, generateOrganizationSchema, generateWebsiteSchema } from './lib/seo';

const geistSans = Inter({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Inter({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = generateMetadata({});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const organizationSchema = generateOrganizationSchema();
	const websiteSchema = generateWebsiteSchema();

	return (
		<html lang='en'>
			<head>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(organizationSchema),
					}}
				/>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(websiteSchema),
					}}
				/>
			</head>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<LanguageProvider>
					<CustomCursor />
					{children}
				</LanguageProvider>
			</body>
		</html>
	);
}
