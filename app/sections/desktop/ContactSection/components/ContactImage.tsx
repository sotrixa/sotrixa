import React from 'react';

interface ContactImageProps {
  imageRef: React.RefObject<HTMLDivElement | null>;
  animationsCreated: boolean;
}

export function ContactImage({ imageRef, animationsCreated }: ContactImageProps) {
  return (
    <div className='flex items-center justify-center mt-0 md:mt-5 md:pr-6' ref={imageRef} style={{ opacity: animationsCreated ? undefined : 1 }}>
      <div className='relative w-full max-w-xs sm:max-w-sm lg:max-w-md aspect-square rounded-lg overflow-hidden bg-gray-50'>
        <video src='/video/Contact-page-video.mp4' autoPlay loop muted playsInline className='w-full h-full object-contain' />
      </div>
    </div>
  );
}
