// Animation utilities for particles and effects
import gsap from 'gsap';

/**
 * Default particle colors matching the design system
 */
export const DEFAULT_PARTICLE_COLORS = [
  'bg-[#EBDD53]', // yellow
  'bg-[#DD53EB]', // purple
  'bg-[#53EBDD]', // green
];

/**
 * Default particle shapes
 */
export const DEFAULT_PARTICLE_SHAPES = [
  'rounded-full',   // circle
  'rounded-sm',     // near square
  'rounded-lg',     // rounded square
];

export interface ParticleConfig {
  count?: number;
  colors?: string[];
  shapes?: string[];
  minSize?: number;
  maxSize?: number;
}

/**
 * Creates particle elements in a container
 * @param containerRef - Reference to the container element
 * @param config - Configuration for particle generation
 */
export const createParticles = (
  containerRef: React.RefObject<HTMLDivElement>,
  config: ParticleConfig = {}
) => {
  if (!containerRef.current) return;

  const {
    count = 50,
    colors = DEFAULT_PARTICLE_COLORS,
    shapes = DEFAULT_PARTICLE_SHAPES,
    minSize = 2,
    maxSize = 10,
  } = config;

  // Clear any existing particles first
  while (containerRef.current.firstChild) {
    containerRef.current.removeChild(containerRef.current.firstChild);
  }

  // Create new particles
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    const color = colors[Math.floor(Math.random() * colors.length)];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];

    particle.className = `absolute ${shape} ${color} opacity-0`;

    // Vary the size
    const size = Math.random() * (maxSize - minSize) + minSize;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    // Add a subtle shadow for more depth
    particle.style.boxShadow = '0 1px 2px rgba(0,0,0,0.1)';

    containerRef.current.appendChild(particle);

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

/**
 * Animates particles with a burst effect
 * @param containerRef - Reference to the container with particles
 */
export const animateParticles = (containerRef: React.RefObject<HTMLDivElement>) => {
  if (!containerRef.current) return;

  const particles = containerRef.current.children;

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
