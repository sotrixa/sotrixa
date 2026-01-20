import React from 'react';
import { GearSVG } from './GearSVG';
import type { BackgroundElementsProps } from '../types';

export function BackgroundElements({ gridBackgroundRef, particlesRef, gearRefs }: BackgroundElementsProps) {
  return (
    <>
      {/* Animated grid background */}
      <div
        ref={gridBackgroundRef}
        className='absolute inset-0 z-0 opacity-40'
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(150,150,150,0.12) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(150,150,150,0.12) 1px, transparent 1px),
            linear-gradient(45deg, rgba(150,150,150,0.05) 25%, transparent 25%, transparent 75%, rgba(150,150,150,0.05) 75%, rgba(150,150,150,0.05)),
            linear-gradient(135deg, rgba(150,150,150,0.05) 25%, transparent 25%, transparent 75%, rgba(150,150,150,0.05) 75%, rgba(150,150,150,0.05))
          `,
          backgroundSize: '40px 40px, 40px 40px, 80px 80px, 80px 80px',
          backgroundPosition: '0 0, 0 0, 0 0, 0 0',
        }}
      />

      {/* Gear decorative elements */}
      <div className='absolute top-[15%] left-[10%] z-0 opacity-25'>
        <svg
          ref={(el) => {
            if (el) gearRefs.current[0] = el;
          }}
        >
          <GearSVG size={180} toothCount={12} color='#888' opacity={0.25} />
        </svg>
      </div>

      <div className='absolute top-[25%] left-[18%] z-0 opacity-20'>
        <svg
          ref={(el) => {
            if (el) gearRefs.current[1] = el;
          }}
        >
          <GearSVG size={120} toothCount={10} color='#666' opacity={0.2} />
        </svg>
      </div>

      <div className='absolute bottom-[30%] right-[15%] z-0 opacity-25'>
        <svg
          ref={(el) => {
            if (el) gearRefs.current[2] = el;
          }}
        >
          <GearSVG size={200} toothCount={16} color='#888' opacity={0.25} />
        </svg>
      </div>

      <div className='absolute bottom-[20%] right-[25%] z-0 opacity-20'>
        <svg
          ref={(el) => {
            if (el) gearRefs.current[3] = el;
          }}
        >
          <GearSVG size={150} toothCount={14} color='#777' opacity={0.15} />
        </svg>
      </div>

      <div className='absolute top-[60%] left-[5%] z-0 opacity-15'>
        <svg
          ref={(el) => {
            if (el) gearRefs.current[4] = el;
          }}
        >
          <GearSVG size={100} toothCount={8} color='#999' opacity={0.15} />
        </svg>
      </div>

      {/* Abstract lines */}
      <div className='absolute top-[30%] left-0 w-[25%] h-[2px] bg-gradient-to-r from-transparent via-gray-400 to-transparent opacity-30' />
      <div className='absolute bottom-[40%] right-0 w-[30%] h-[2px] bg-gradient-to-l from-transparent via-gray-400 to-transparent opacity-30' />

      {/* Dots grid in one corner */}
      <div
        className='absolute top-0 right-0 w-[150px] sm:w-[300px] h-[150px] sm:h-[300px] opacity-20'
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(100,100,100,0.7) 2px, transparent 2px)',
          backgroundSize: '20px 20px',
        }}
      />

      {/* Particles container for animated effects */}
      <div ref={particlesRef} className='absolute inset-0 pointer-events-none z-10' />
    </>
  );
}
