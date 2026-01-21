import { gsap } from 'gsap';
import type { UseServiceAnimationParams, UseServiceAnimationReturn } from '../types';

export function useServiceAnimation({
  sectionDivRef,
  headingRef,
  servicesGridRef,
  rightContentRef,
  serviceTitleRefs,
  splitTextRefs,
  activeService,
  animateParticles,
  onBackClick,
}: UseServiceAnimationParams): UseServiceAnimationReturn {
  const animateLetterStagger = (index: number) => {
    if (!serviceTitleRefs.current[index] || !splitTextRefs.current[index]) {
      return gsap.timeline();
    }

    const split = splitTextRefs.current[index];
    const letterTl = gsap.timeline();

    // Reduced animation - simpler fade in without rotations
    letterTl
      .to(split.chars, {
        opacity: 0,
        stagger: 0.02,
        duration: 0.15,
        ease: 'power1.in',
      })
      .to(
        split.chars,
        {
          opacity: 1,
          color: '#d142e2',
          stagger: 0.02,
          duration: 0.15,
          ease: 'power1.out',
          fontWeight: 'bold',
        },
        '+=0.05'
      );

    return letterTl;
  };

  const resetLetterAnimation = (index: number) => {
    if (!splitTextRefs.current[index]) return;

    const split = splitTextRefs.current[index];

    gsap.to(split.chars, {
      opacity: 1,
      color: '#000',
      fontWeight: 'bold',
      duration: 0.2,
      stagger: 0.01,
      ease: 'power1.out',
    });
  };

  const playExitAnimation = () => {
    if (!sectionDivRef.current) return;

    const tl = gsap.timeline();
    animateParticles();

    const carouselItems = Array.from(servicesGridRef.current?.querySelectorAll('.service-item') || []);

    // Subtle fade out without flash overlay
    tl.to(carouselItems, { opacity: 0, stagger: 0.02, duration: 0.3, ease: 'power2.out' }, '-=0.1')
      .to(headingRef.current, { opacity: 0, duration: 0.25, ease: 'power2.out' }, '-=0.25')
      .to(rightContentRef.current, { opacity: 0, duration: 0.3, ease: 'power2.out' }, '-=0.2')
      .to(sectionDivRef.current, { opacity: 0, duration: 0.3, ease: 'power2.out' }, '-=0.2');

    return tl;
  };

  const handleBackToServices = () => {
    const tl = gsap.timeline({
      onComplete: () => {
        if (onBackClick) {
          onBackClick();
        } else if (typeof window !== 'undefined' && window.goBackToServices) {
          window.goBackToServices();
        }
      },
    });

    animateParticles();
    const carouselItems = Array.from(servicesGridRef.current?.querySelectorAll('.service-item') || []);

    // Subtle fade out
    tl.to(carouselItems, { opacity: 0, stagger: 0.02, duration: 0.3, ease: 'power2.out' })
      .to(headingRef.current, { opacity: 0, duration: 0.25, ease: 'power2.out' }, '-=0.2')
      .to(rightContentRef.current?.children || [], { opacity: 0, stagger: 0.02, duration: 0.3, ease: 'power2.out' }, '-=0.25')
      .to(sectionDivRef.current, { opacity: 0, duration: 0.3, ease: 'power2.out' }, '-=0.15');

    return tl;
  };

  const createLetterAnimations = () => {
    serviceTitleRefs.current.forEach((titleRef, index) => {
      if (!titleRef) return;

      const originalText = titleRef.textContent || '';
      titleRef.textContent = '';
      const chars: HTMLSpanElement[] = [];

      originalText.split('').forEach((char) => {
        const charSpan = document.createElement('span');
        charSpan.className = 'letter-char';
        charSpan.textContent = char;
        charSpan.style.display = 'inline-block';
        charSpan.style.willChange = 'transform, opacity';
        charSpan.style.fontSize = 'inherit';
        titleRef.appendChild(charSpan);
        chars.push(charSpan);
      });

      const revert = () => {
        if (titleRef) {
          titleRef.textContent = originalText;
        }
      };

      splitTextRefs.current[index] = { chars, revert };

      gsap.set(chars, {
        y: 0,
        opacity: 1,
        rotationX: 0,
        rotationY: 0,
        transformOrigin: 'center center',
      });

      const serviceItem = titleRef.closest('.service-item');
      if (serviceItem) {
        const serviceNames = ['RESEARCH', 'BUSINESS ARCHITECTURE', 'BESPOKE STRATEGY CREATION', 'BRAND STORYTELLING', 'MARKETING', 'WEBSITE DEVELOPMENT'];

        serviceItem.addEventListener('mouseenter', () => {
          if (activeService === serviceNames[index]) return;
          // Removed hover animation - keep it static
        });

        serviceItem.addEventListener('mouseleave', () => {
          if (activeService === serviceNames[index]) return;
          // Removed hover animation
        });
      }
    });
  };

  return {
    animateLetterStagger,
    resetLetterAnimation,
    playExitAnimation,
    handleBackToServices,
    createLetterAnimations,
  };
}
