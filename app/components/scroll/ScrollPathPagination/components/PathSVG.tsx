import React, { RefObject, ReactNode } from 'react';
import Image from 'next/image';

interface PathSVGProps {
  svgRef: RefObject<SVGSVGElement | null>;
  pathRef: RefObject<SVGPathElement | null>;
  gearRef: RefObject<SVGGElement | null>;
  svgWidth: number;
  svgHeight: number;
  sections: string[];
  children?: ReactNode;
}

// Generate a horizontal curved path
const generateSVGPath = (sections: string[], svgWidth: number) => {
  const width = svgWidth - 80;
  const spacing = width / (sections.length - 1);
  let path = `M20 30`;

  for (let i = 1; i < sections.length; i++) {
    const x = i * spacing + 20;
    const controlX1 = x - spacing * 0.6;
    const controlX2 = x - spacing * 0.4;

    if (i % 2 === 0) {
      path += ` C${controlX1} 35, ${controlX2} 25, ${x} 30`;
    } else {
      path += ` C${controlX1} 25, ${controlX2} 35, ${x} 30`;
    }
  }

  return path;
};

export function PathSVG({ svgRef, pathRef, gearRef, svgWidth, svgHeight, sections, children }: PathSVGProps) {
  const pathData = generateSVGPath(sections, svgWidth);

  return (
    <svg
      ref={svgRef}
      width={svgWidth}
      height={svgHeight}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      style={{
        filter: 'drop-shadow(0px 0px 5px rgba(0,0,0,0.2))',
      }}
      className='w-full h-auto'
    >
      {/* Background glow */}
      <path d={pathData} stroke='rgba(0,0,0,0.2)' strokeWidth='8' strokeLinecap='round' fill='none' />

      {/* Main path */}
      <path ref={pathRef} d={pathData} stroke='#000000' strokeWidth='2' strokeLinecap='round' fill='none' style={{ opacity: 1 }} />

      {/* Gear icon */}
      <g ref={gearRef} className='pointer-events-none'>
        <foreignObject width='40' height='40' x='-20' y='-20'>
          <div className='w-full h-full flex items-center justify-center'>
            <Image src='/Gear-Icon.svg' alt='Gear Icon' width={32} height={32} className='w-full h-full object-contain' style={{ transformOrigin: 'center' }} priority />
          </div>
        </foreignObject>
      </g>

      {/* Section dots and labels */}
      {children}
    </svg>
  );
}
