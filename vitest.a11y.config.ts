import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./src/__tests__/setup.ts', './src/__tests__/a11y-setup.ts'],
    include: ['src/**/*.a11y.{test,spec}.{ts,tsx}'],
  },
});
