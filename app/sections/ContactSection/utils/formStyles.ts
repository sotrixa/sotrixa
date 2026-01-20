export const formContainerStyles = {
  pointerEvents: 'auto' as const,
  userSelect: 'text' as const,
  position: 'relative' as const,
  zIndex: 99999,
};

export const labelStyles = {
  pointerEvents: 'auto' as const,
  cursor: 'default',
};

export const formItemWrapperStyles = (animationsCreated: boolean) => ({
  opacity: animationsCreated ? undefined : 1,
  pointerEvents: 'auto' as const,
  userSelect: 'text' as const,
});

export const inputStyles = {
  pointerEvents: 'auto' as const,
  cursor: 'text',
  userSelect: 'text' as const,
  position: 'relative' as const,
  zIndex: 99999,
  backgroundColor: 'white',
  border: '1px solid #d1d5db',
};

export const textareaStyles = {
  pointerEvents: 'auto' as const,
  cursor: 'text',
  userSelect: 'text' as const,
  position: 'relative' as const,
  zIndex: 99999,
  backgroundColor: 'white',
  border: '1px solid #d1d5db',
  resize: 'vertical' as const,
};

export const buttonStyles = {
  pointerEvents: 'auto' as const,
  cursor: 'pointer',
  position: 'relative' as const,
  zIndex: 10000,
};
