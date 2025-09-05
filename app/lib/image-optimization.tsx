import Image from 'next/image';
import { ComponentProps } from 'react';

interface OptimizedImageProps extends Omit<ComponentProps<typeof Image>, 'alt'> {
	src: string;
	alt: string;
	width?: number;
	height?: number;
	priority?: boolean;
	className?: string;
	sizes?: string;
}

export function OptimizedImage({
	src,
	alt,
	width = 800,
	height = 600,
	priority = false,
	className = '',
	sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
	...props
}: OptimizedImageProps) {
	return (
		<Image
			src={src}
			alt={alt}
			width={width}
			height={height}
			priority={priority}
			className={className}
			sizes={sizes}
			quality={85}
			placeholder="blur"
			blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
			{...props}
		/>
	);
}

// Predefined image configurations for common use cases
export const imageConfigs = {
	hero: {
		width: 1920,
		height: 1080,
		sizes: '100vw',
		priority: true,
	},
	caseStudy: {
		width: 800,
		height: 600,
		sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
	},
	logo: {
		width: 200,
		height: 60,
		sizes: '200px',
	},
	thumbnail: {
		width: 300,
		height: 200,
		sizes: '(max-width: 768px) 50vw, 300px',
	},
};
