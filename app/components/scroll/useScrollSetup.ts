'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

export function useScrollSetup() {
	useEffect(() => {
		// This runs only on the client
		if (typeof window !== 'undefined') {
			// Register GSAP plugins
			gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

			// Use GSAP token if available
			if (process.env.NEXT_PUBLIC_GSAP_TOKEN_KEY) {
				gsap.registerPlugin({
					name: 'GSDevTools',
					init() {
						// This is just to trigger license check
						console.log('GSAP initialized with token');
					},
				});
			}
		}
	}, []);
}
