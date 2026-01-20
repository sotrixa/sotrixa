import { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { AnimationRefs, ContactAnimationReturn } from '../types';

export function useContactAnimation(refs: AnimationRefs): ContactAnimationReturn {
  const [animationsCreated, setAnimationsCreated] = useState(false);
  const { formRef, headingRef, contactInfoRef, imageRef, formItemsRef } = refs;

  useEffect(() => {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Initial setup - ensure content is visible by default with a small delay
    // This provides a fallback in case animations don't trigger
    const timeout = setTimeout(() => {
      if (headingRef.current) gsap.set(headingRef.current, { opacity: 1, y: 0 });
      if (contactInfoRef.current) gsap.set(contactInfoRef.current.children, { opacity: 1, y: 0 });
      if (formRef.current) gsap.set(formRef.current, { opacity: 1, y: 0 });
      if (imageRef.current) gsap.set(imageRef.current, { opacity: 1, y: 0 });
      if (formItemsRef.current.length) gsap.set(formItemsRef.current, { opacity: 1, y: 0 });
    }, 1000);

    // Main heading animation
    if (headingRef.current) {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 90%',
            once: true,
          },
        }
      );
    }

    // Contact info animation
    if (contactInfoRef.current && contactInfoRef.current.children.length) {
      gsap.fromTo(
        contactInfoRef.current.children,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.5,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: contactInfoRef.current,
            start: 'top 90%',
            once: true,
          },
        }
      );
    }

    // Form animation
    if (formRef.current) {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: formRef.current,
            start: 'top 90%',
            once: true,
          },
        }
      );
    }

    // Image animation
    if (imageRef.current) {
      gsap.fromTo(
        imageRef.current,
        { opacity: 0, x: 20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: imageRef.current,
            start: 'top 90%',
            once: true,
          },
        }
      );
    }

    // Form fields staggered animation
    if (formItemsRef.current.length) {
      gsap.fromTo(
        formItemsRef.current,
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.5,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: formRef.current,
            start: 'top 90%',
            once: true,
          },
        }
      );
    }

    setAnimationsCreated(true);

    // Refresh ScrollTrigger to ensure proper initialization
    ScrollTrigger.refresh();

    // Cleanup function
    return () => {
      clearTimeout(timeout);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [formRef, headingRef, contactInfoRef, imageRef, formItemsRef]);

  return { animationsCreated };
}
