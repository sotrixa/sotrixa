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

    letterTl
      .to(split.chars, {
        x: -15,
        rotationY: -90,
        opacity: 0,
        stagger: 0.03,
        duration: 0.3,
        ease: 'back.in(2)',
      })
      .to(
        split.chars,
        {
          x: 0,
          rotationY: 0,
          opacity: 1,
          color: '#d142e2',
          stagger: 0.03,
          duration: 0.3,
          ease: 'elastic.out(1, 0.5)',
          fontWeight: 'bold',
        },
        '+=0.1'
      )
      .to(
        split.chars,
        {
          x: -3,
          stagger: {
            each: 0.02,
            from: 'start',
            grid: 'auto',
            ease: 'sine.inOut',
          },
          duration: 0.2,
          ease: 'sine.inOut',
          repeat: 1,
          yoyo: true,
        },
        '-=0.2'
      );

    return letterTl;
  };

  const resetLetterAnimation = (index: number) => {
    if (!splitTextRefs.current[index]) return;

    const split = splitTextRefs.current[index];

    gsap.to(split.chars, {
      x: 0,
      opacity: 1,
      color: '#000',
      fontWeight: 'bold',
      rotationY: 0,
      duration: 0.3,
      stagger: 0.02,
      ease: 'power1.out',
    });
  };

  const playExitAnimation = () => {
    if (!sectionDivRef.current) return;

    const tl = gsap.timeline();
    animateParticles();

    const carouselItems = Array.from(servicesGridRef.current?.querySelectorAll('.service-item') || []);
    const flashOverlay = document.createElement('div');
    flashOverlay.className = 'absolute inset-0 bg-gradient-to-r from-[#EBDD53] via-[#DD53EB] to-[#53EBDD] pointer-events-none z-50';
    flashOverlay.style.opacity = '0';
    sectionDivRef.current.appendChild(flashOverlay);

    tl.to(flashOverlay, {
      opacity: 0.1,
      duration: 0.2,
      ease: 'power1.in',
      onComplete: () => {
        gsap.to(flashOverlay, {
          opacity: 0,
          duration: 0.5,
          ease: 'power2.out',
          onComplete: () => {
            if (flashOverlay.parentNode) {
              flashOverlay.parentNode.removeChild(flashOverlay);
            }
          },
        });
      },
    });

    tl.to(carouselItems, { x: -20, opacity: 0, stagger: 0.03, duration: 0.4, ease: 'power2.in' }, '-=0.1')
      .to(headingRef.current, { y: -15, opacity: 0, duration: 0.3, ease: 'power2.in' }, '-=0.3')
      .to(rightContentRef.current, { opacity: 0, y: 15, duration: 0.4, ease: 'power2.in' }, '-=0.3')
      .to(sectionDivRef.current, { opacity: 0, scale: 0.98, duration: 0.4, ease: 'power3.in' }, '-=0.2');

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

    tl.to(carouselItems, { x: -30, opacity: 0, stagger: 0.03, duration: 0.3, ease: 'power2.in' })
      .to(headingRef.current, { y: -20, opacity: 0, duration: 0.3, ease: 'power2.in' }, '-=0.2')
      .to(rightContentRef.current?.children || [], { y: 20, opacity: 0, stagger: 0.03, duration: 0.3, ease: 'power2.in' }, '-=0.4')
      .to(sectionDivRef.current, { opacity: 0, scale: 0.95, duration: 0.4, ease: 'power3.inOut' });

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
          gsap.to(chars, { y: -5, x: 2, opacity: 1, scale: 1.05, color: '#DD53EB', stagger: 0.01, duration: 0.25, ease: 'power2.out', overwrite: true });
        });

        serviceItem.addEventListener('mouseleave', () => {
          if (activeService === serviceNames[index]) return;
          gsap.to(chars, { y: 0, x: 0, scale: 1, opacity: 1, color: '#333', stagger: 0.01, duration: 0.2, ease: 'power1.out', overwrite: true });
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
