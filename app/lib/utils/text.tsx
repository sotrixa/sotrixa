// Text styling utilities
import React from 'react';

/**
 * Styles dash characters with consistent formatting
 * Converts various dash types (—, –, -) to a uniform styled dash
 */
export const styleDash = () => ({
  className: 'inline-block',
  style: {
    fontSize: '1em',
    fontWeight: '200',
    transform: 'scaleX(0.5)',
  },
});

/**
 * Renders text with styled dashes and optional color mappings
 * @param text - The text to render
 * @param colorMappings - Optional mapping of words to CSS color classes
 * @returns JSX elements with styled dashes and colored words
 */
export const renderDashStyledText = (
  text: string,
  colorMappings?: Record<string, string>
): React.ReactElement => {
  // First handle all types of dashes
  const dashParts = text.split(/(—|–|-)/g);
  const dashStyle = styleDash();

  return (
    <span>
      {dashParts.map((dashPart, dashIndex) => {
        // If this part is any type of dash, style it consistently
        if (dashPart === '—' || dashPart === '–' || dashPart === '-') {
          return (
            <span key={dashIndex} {...dashStyle}>
              –
            </span>
          );
        }

        // For non-dash parts, apply color styling if provided
        if (colorMappings) {
          const words = dashPart.split(' ');
          return words.map((word, wordIndex) => {
            // Remove punctuation to check for color mapping
            const cleanWord = word.replace(/[.,!?;:]$/, '');
            const punctuation = word.match(/[.,!?;:]$/)?.[0] || '';
            const colorClass = colorMappings[cleanWord];

            return (
              <span key={`${dashIndex}-${wordIndex}`}>
                {colorClass ? <span className={colorClass}>{cleanWord}</span> : cleanWord}
                {punctuation}
                {wordIndex < words.length - 1 ? ' ' : ''}
              </span>
            );
          });
        }

        return <span key={dashIndex}>{dashPart}</span>;
      })}
    </span>
  );
};
