import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'vitest-axe';
import { Button } from '../components/Button';

expect.extend(toHaveNoViolations);

describe('Button Accessibility', () => {
  it('should have no accessibility violations with default props', async () => {
    const { container } = render(<Button>Click me</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations when disabled', async () => {
    const { container } = render(<Button disabled>Disabled</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with loading state', async () => {
    const { container } = render(<Button loading>Loading</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations as a link', async () => {
    const { container } = render(<Button href="/test">Link Button</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with all variants', async () => {
    const variants = ['primary', 'secondary', 'accent', 'ghost', 'danger'] as const;

    for (const variant of variants) {
      const { container } = render(<Button variant={variant}>{variant}</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    }
  });
});
