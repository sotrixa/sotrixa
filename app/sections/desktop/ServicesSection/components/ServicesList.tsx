'use client';

import { ServiceItem } from './ServiceItem';
import { ServicesListProps } from '../types';

export const ServicesList = ({ services, activeServiceIndex, setActiveServiceIndex, serviceItemsRef, setIsDetailView }: ServicesListProps) => {
	const setRefForIndex = (el: HTMLDivElement | null, index: number) => {
		serviceItemsRef.current[index] = el;
	};

	const handleServiceClick = (index: number) => {
		setActiveServiceIndex(index);
		// If setIsDetailView function is provided, set isDetailView to true when service is clicked
		if (setIsDetailView) {
			setIsDetailView(true);
		}
	};

	return (
		<div className='w-full space-y-5'>
			{services.map((service, index) => (
				<ServiceItem key={service} service={service} index={index} activeIndex={activeServiceIndex} onClick={() => handleServiceClick(index)} ref={(el) => setRefForIndex(el, index)} />
			))}
		</div>
	);
};
