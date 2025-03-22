'use client';

import { ServiceItem } from './ServiceItem';
import { ServicesListProps } from '../types';

export const ServicesList = ({ services, activeServiceIndex, setActiveServiceIndex, serviceItemsRef }: ServicesListProps) => {
	const setRefForIndex = (el: HTMLDivElement | null, index: number) => {
		serviceItemsRef.current[index] = el;
	};

	return (
		<div className='w-full space-y-5'>
			{services.map((service, index) => (
				<ServiceItem key={service} service={service} index={index} activeIndex={activeServiceIndex} onClick={() => setActiveServiceIndex(index)} ref={(el) => setRefForIndex(el, index)} />
			))}
		</div>
	);
};
