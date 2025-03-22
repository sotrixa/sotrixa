import { ReactNode } from 'react';

export interface GsapHorizontalScrollProps {
	children: ReactNode;
}

export interface HorizontalScrollEvent extends CustomEvent {
	detail: {
		fromIndex: number;
		toIndex: number;
		progress: number;
	};
}
