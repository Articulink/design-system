/**
 * @articulink/design-system
 *
 * Centralized design system for all Articulink applications.
 *
 * Usage:
 *
 * 1. Import CSS tokens in your globals.css:
 *    @import "@articulink/design-system/tokens";
 *
 * 2. Import React components:
 *    import { Button, Input, Card, Modal } from '@articulink/design-system';
 *
 * 3. Use Tailwind color classes:
 *    bg-tide, text-abyss, border-mist, etc.
 */

// Re-export all components
export * from './components';

// Re-export all hooks
export * from './hooks';

// Re-export all utilities
export * from './utils';
