import { useEffect } from 'react';

export function useForceInteractivity(): void {
  useEffect(() => {
    // FORCE CONTACT FORM TO BE INTERACTIVE - ONE TIME SETUP
    const forceContactFormInteractive = () => {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        // Set the contact section to highest priority
        contactSection.style.position = 'relative';
        contactSection.style.zIndex = '99999';

        // Force all form elements to be interactive
        const formElements = contactSection.querySelectorAll('input, textarea, button, label, form, select');
        formElements.forEach((element) => {
          const el = element as HTMLElement;
          el.style.setProperty('pointer-events', 'auto', 'important');
          el.style.setProperty('user-select', 'text', 'important');
          el.style.setProperty('cursor', 'text', 'important');
          el.style.setProperty('z-index', '99999', 'important');
          el.style.setProperty('position', 'relative', 'important');

          // Ensure inputs and textareas are focusable
          if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.style.setProperty('background-color', 'white', 'important');
            el.style.setProperty('border', '1px solid #d1d5db', 'important');
            el.tabIndex = 0;
          }
        });

        // Special handling for buttons
        const buttons = contactSection.querySelectorAll('button');
        buttons.forEach((button) => {
          const btn = button as HTMLElement;
          btn.style.setProperty('cursor', 'pointer', 'important');
          btn.style.setProperty('background-color', '#000', 'important');
          btn.style.setProperty('color', 'white', 'important');
          btn.tabIndex = 0;
        });

        // Stop all event propagation from contact section
        const stopPropagation = (e: Event) => {
          e.stopPropagation();
        };

        contactSection.addEventListener('wheel', stopPropagation, { capture: true });
        contactSection.addEventListener('mousedown', stopPropagation, { capture: true });
        contactSection.addEventListener('touchstart', stopPropagation, { capture: true });
        contactSection.addEventListener('keydown', stopPropagation, { capture: true });
      }
    };

    // Force immediately and after multiple delays to ensure DOM is ready
    forceContactFormInteractive();
    setTimeout(forceContactFormInteractive, 100);
    setTimeout(forceContactFormInteractive, 500);
    setTimeout(forceContactFormInteractive, 1000);
  }, []);
}
