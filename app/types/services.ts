// Service content and props interfaces

// Service content interface
export interface ServiceContent {
  title: string;
  description: string[];
}

// Service info section props
export interface ServiceInfoSectionProps {
  onBackClick?: () => void;
  activeService?: string;
}

// Mobile service info section props
export interface MobileServiceInfoSectionProps {
  onBackClick?: () => void;
  activeService?: string;
}

// ServiceItem props
export interface ServiceItemProps {
  service: string;
  index: number;
  activeIndex: number;
  onClick: () => void;
  ref: (el: HTMLDivElement | null) => void;
}

// ServicesList props
export interface ServicesListProps {
  services: string[];
  activeServiceIndex: number;
  setActiveServiceIndex: (index: number) => void;
  serviceItemsRef: React.MutableRefObject<(HTMLDivElement | null)[]>;
  isDetailView?: boolean;
  setIsDetailView?: React.Dispatch<React.SetStateAction<boolean>>;
}

// ProgressIndicator props
export interface ProgressIndicatorProps {
  activeIndex: number;
  totalItems: number;
}

// NavigationDots props
export interface NavigationDotsProps {
  items: string[];
  activeIndex: number;
  onDotClick: (index: number) => void;
}

// GearSVG component props
export interface GearSVGProps {
  size: number;
  toothCount: number;
  color: string;
  opacity: number;
  className?: string;
}
