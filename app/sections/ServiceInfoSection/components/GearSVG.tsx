import React from 'react';
import { GearSVGProps } from '@/app/types/services';

/**
 * GearSVG Component
 * Generates a customizable gear SVG with teeth, spokes, and a center hole
 */
export const GearSVG = ({ size, toothCount, color, opacity, className }: GearSVGProps) => {
  // Calculate gear parameters
  const outerRadius = size / 2;
  const innerRadius = outerRadius * 0.7;
  const toothHeight = outerRadius * 0.2;
  const centerHoleRadius = outerRadius * 0.2;

  // Generate points for the gear path
  const points = [];
  for (let i = 0; i < toothCount; i++) {
    const angle = (i / toothCount) * Math.PI * 2;
    const nextAngle = ((i + 0.5) / toothCount) * Math.PI * 2;
    const nextNextAngle = ((i + 1) / toothCount) * Math.PI * 2;

    // Inner point before tooth
    points.push([innerRadius * Math.cos(angle), innerRadius * Math.sin(angle)]);

    // Outer point (tooth peak)
    points.push([(outerRadius + toothHeight) * Math.cos(nextAngle), (outerRadius + toothHeight) * Math.sin(nextAngle)]);

    // Inner point after tooth
    points.push([innerRadius * Math.cos(nextNextAngle), innerRadius * Math.sin(nextNextAngle)]);
  }

  // Generate the SVG path
  let pathData = 'M ';
  points.forEach((point, index) => {
    if (index === 0) {
      pathData += `${point[0]},${point[1]} `;
    } else {
      pathData += `L ${point[0]},${point[1]} `;
    }
  });
  pathData += 'Z';

  return (
    <svg width={size} height={size} viewBox={`${-outerRadius - toothHeight} ${-outerRadius - toothHeight} ${(outerRadius + toothHeight) * 2} ${(outerRadius + toothHeight) * 2}`} className={className}>
      <path d={pathData} fill='none' stroke={color} strokeWidth={1} opacity={opacity} transform='translate(0, 0)' />
      <circle cx='0' cy='0' r={centerHoleRadius} fill='none' stroke={color} strokeWidth={1} opacity={opacity} />
      {/* Add some spokes for a more mechanical look */}
      {[...Array(Math.min(toothCount / 2, 6))].map((_, i) => {
        const angle = (i / Math.min(toothCount / 2, 6)) * Math.PI * 2;
        return <line key={i} x1={centerHoleRadius * Math.cos(angle)} y1={centerHoleRadius * Math.sin(angle)} x2={innerRadius * 0.9 * Math.cos(angle)} y2={innerRadius * 0.9 * Math.sin(angle)} stroke={color} strokeWidth={1} opacity={opacity} />;
      })}
    </svg>
  );
};
