import { configureAxe } from 'vitest-axe';

// Configure axe for accessibility testing
configureAxe({
  rules: {
    // Customize rules as needed
    'color-contrast': { enabled: true },
    'label': { enabled: true },
    'button-name': { enabled: true },
    'image-alt': { enabled: true },
    'link-name': { enabled: true },
  },
});
