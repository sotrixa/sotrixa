import React, { MutableRefObject } from 'react';

interface DotPosition {
  x: number;
  y: number;
}

interface NavigationDotsProps {
  dotPositions: DotPosition[];
  sections: string[];
  activeDotIndex: number;
  dotsRef: MutableRefObject<(SVGCircleElement | null)[]>;
}

export function NavigationDots({ dotPositions, sections, activeDotIndex, dotsRef }: NavigationDotsProps) {
  return (
    <>
      {dotPositions.map((pos, index) => (
        <g
          key={`dot-${index}`}
          className='cursor-pointer'
          style={{ pointerEvents: 'auto' }}
          onClick={() => {
            if (window.horizontalScrollControls) {
              window.horizontalScrollControls.navigateToPanel(index);
            }
          }}
        >
          {/* The dot */}
          <circle
            ref={(el) => {
              dotsRef.current[index] = el;
            }}
            cx={pos.x}
            cy={pos.y}
            r='6'
            fill={index < activeDotIndex ? '#666666' : '#000000'}
            stroke='#000000'
            strokeWidth='1'
            className='transition-all duration-300'
          />

          {/* Section label (always visible below the dot) */}
          <text
            id={`label-${index}`}
            x={pos.x}
            y={pos.y + 25}
            fill='#000000'
            fontSize='11'
            fontFamily='sans-serif'
            textAnchor='middle'
            dominantBaseline='middle'
            className='transition-all duration-300'
            style={{ transformOrigin: 'center' }}
          >
            {sections[index] || (index === 0 ? 'Home' : `Section ${index + 1}`)}
          </text>
        </g>
      ))}
    </>
  );
}

// Calculate dot positions along the path
export function calculateDotPositions(sections: string[], svgWidth: number): DotPosition[] {
  const width = svgWidth - 80; // Match increased padding from path
  const spacing = width / (sections.length - 1);

  return sections.map((_, i) => ({
    x: i * spacing + 20,
    y: 30,
  }));
}
