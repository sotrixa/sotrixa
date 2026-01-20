// Define type for horizontal scroll controls
export interface HorizontalScrollControls {
	nextPanel: () => void;
	prevPanel: () => void;
	navigateToPanel: (index: number) => void;
	activeIndex: number;
}

// Types for ServiceItem props
export interface ServiceItemProps {
	service: string;
	index: number;
	activeIndex: number;
	onClick: () => void;
	ref: (el: HTMLDivElement | null) => void;
}

// Types for ServicesList props
export interface ServicesListProps {
	services: string[];
	activeServiceIndex: number;
	setActiveServiceIndex: (index: number) => void;
	serviceItemsRef: React.MutableRefObject<(HTMLDivElement | null)[]>;
	isDetailView?: boolean;
	setIsDetailView?: React.Dispatch<React.SetStateAction<boolean>>;
}

// Types for ProgressIndicator props
export interface ProgressIndicatorProps {
	activeIndex: number;
	totalItems: number;
}

// Types for NavigationDots props
export interface NavigationDotsProps {
	items: string[];
	activeIndex: number;
	onDotClick: (index: number) => void;
}

// Extend Window interface
declare global {
	interface Window {
		horizontalScrollControls?: HorizontalScrollControls;
		isServicesActive?: boolean;
		servicesHasControl?: boolean;
	}
}
