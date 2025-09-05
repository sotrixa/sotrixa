'use client';

import Script from 'next/script';

interface GoogleAnalyticsProps {
	measurementId: string;
}

export function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
	return (
		<>
			<Script
				src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
				strategy="afterInteractive"
			/>
			<Script id="google-analytics" strategy="afterInteractive">
				{`
					window.dataLayer = window.dataLayer || [];
					function gtag(){dataLayer.push(arguments);}
					gtag('js', new Date());
					gtag('config', '${measurementId}', {
						page_title: document.title,
						page_location: window.location.href,
						anonymize_ip: true,
						allow_google_signals: false,
						allow_ad_personalization_signals: false
					});
				`}
			</Script>
		</>
	);
}

// Google Tag Manager
interface GoogleTagManagerProps {
	gtmId: string;
}

export function GoogleTagManager({ gtmId }: GoogleTagManagerProps) {
	return (
		<>
			<Script id="google-tag-manager" strategy="afterInteractive">
				{`
					(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
					new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
					j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
					'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
					})(window,document,'script','dataLayer','${gtmId}');
				`}
			</Script>
			<noscript>
				<iframe
					src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
					height="0"
					width="0"
					style={{ display: 'none', visibility: 'hidden' }}
				/>
			</noscript>
		</>
	);
}

// Event tracking functions
export const trackEvent = (eventName: string, parameters?: Record<string, unknown>) => {
	if (typeof window !== 'undefined' && 'gtag' in window) {
		// @ts-expect-error - gtag is added by Google Analytics script
		window.gtag('event', eventName, parameters);
	}
};

export const trackPageView = (url: string, title?: string) => {
	if (typeof window !== 'undefined' && 'gtag' in window) {
		// @ts-expect-error - gtag is added by Google Analytics script
		window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
			page_path: url,
			page_title: title,
		});
	}
};

// Common events for the agency website
export const trackContactFormSubmit = () => {
	trackEvent('contact_form_submit', {
		event_category: 'engagement',
		event_label: 'contact_form',
	});
};

export const trackServicePageView = (serviceName: string) => {
	trackEvent('service_page_view', {
		event_category: 'engagement',
		service_name: serviceName,
	});
};

export const trackCaseStudyView = (caseStudyName: string) => {
	trackEvent('case_study_view', {
		event_category: 'engagement',
		case_study_name: caseStudyName,
	});
};
