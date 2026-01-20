import React from 'react';

export interface AnimationRefs {
  formRef: React.RefObject<HTMLDivElement | null>;
  headingRef: React.RefObject<HTMLDivElement | null>;
  contactInfoRef: React.RefObject<HTMLDivElement | null>;
  imageRef: React.RefObject<HTMLDivElement | null>;
  formItemsRef: React.MutableRefObject<HTMLDivElement[]>;
}

export interface ContactAnimationReturn {
  animationsCreated: boolean;
}
