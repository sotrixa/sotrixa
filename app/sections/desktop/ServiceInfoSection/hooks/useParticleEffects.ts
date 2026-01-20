import { gsap } from 'gsap';
import type { UseParticleEffectsParams, UseParticleEffectsReturn } from '../types';

export function useParticleEffects({ particlesRef }: UseParticleEffectsParams): UseParticleEffectsReturn {
  // Create particles animation with colorful gradient-inspired particles
  const createParticles = () => {
    if (!particlesRef.current) return;

    // Clear any existing particles first
    while (particlesRef.current.firstChild) {
      particlesRef.current.removeChild(particlesRef.current.firstChild);
    }

    // Colors matching the new color scheme
    const colors = [
      'bg-[#EBDD53]', // yellow
      'bg-[#DD53EB]', // purple
      'bg-[#53EBDD]', // green
    ];

    // Create variety of particle shapes
    const shapes = [
      'rounded-full', // circle
      'rounded-sm', // near square
      'rounded-lg', // rounded square
    ];

    // Create new particles
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      const color = colors[Math.floor(Math.random() * colors.length)];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];

      particle.className = `absolute ${shape} ${color} opacity-0`;

      // Vary the size
      const size = Math.random() * 8 + 2;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;

      // Add a subtle shadow for more depth
      particle.style.boxShadow = '0 1px 2px rgba(0,0,0,0.1)';

      particlesRef.current.appendChild(particle);

      // Random position, making sure particles are within the container
      const x = Math.random() * 100; // percentage across width
      const y = Math.random() * 100; // percentage across height

      gsap.set(particle, {
        x: `${x}%`,
        y: `${y}%`,
        opacity: 0,
        scale: 0,
        rotation: Math.random() * 360, // random rotation for more dynamic feel
      });
    }
  };

  // Animate particles when service changes
  const animateParticles = () => {
    if (!particlesRef.current) return;

    const particles = particlesRef.current.children;

    gsap.to(particles, {
      opacity: 0,
      scale: 0,
      duration: 0.2,
      onComplete: () => {
        // Reset positions for next animation
        for (let i = 0; i < particles.length; i++) {
          const particle = particles[i];
          const x = Math.random() * 100;
          const y = Math.random() * 100;

          gsap.set(particle, {
            x: `${x}%`,
            y: `${y}%`,
          });
        }

        // Animate particles outward from center
        gsap.to(particles, {
          opacity: function () {
            return Math.random() * 0.5 + 0.1;
          },
          scale: function () {
            return Math.random() * 1 + 0.5;
          },
          duration: 1.5,
          stagger: 0.02,
          ease: 'power3.out',

          onComplete: () => {
            // Fade out slowly
            gsap.to(particles, {
              opacity: 0,
              duration: 2,
              stagger: 0.01,
              ease: 'power2.in',
            });
          },
        });
      },
    });
  };

  return {
    createParticles,
    animateParticles,
  };
}
