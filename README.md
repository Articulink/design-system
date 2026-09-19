# @articulink/design-system

Centralized design system for all Articulink applications. **This is the single source of truth for shared UI components.**

## Important Rules

1. **Always import shared components from this package** — never create local duplicates of Button, Input, Modal, Card, or Toast
2. **Use semantic color tokens** for status indicators (success-bg, warning-bg, error-bg, info-bg)
3. **Add new shared components here** when they're needed across multiple apps
4. **Edit tokens in `src/tokens/index.css`** to change colors/styles globally — brand color values must stay in sync with [`@articulink/brand`](https://github.com/Articulink/brand)'s `tokens/tokens.json`, the brand's source of truth

## Installation

The package is published to GitHub Packages under the `@articulink` scope.
Point npm at the GitHub Packages registry for that scope in your project's
`.npmrc`:

```ini
@articulink:registry=https://npm.pkg.github.com
```

Authenticate with a GitHub token that has `read:packages` (e.g. in
`~/.npmrc`: `//npm.pkg.github.com/:_authToken=YOUR_TOKEN`, or the
workflow-provided `GITHUB_TOKEN` in CI), then install:

```bash
npm install @articulink/design-system
```

`react >= 18` and `react-dom >= 18` are peer dependencies.

## Usage

### 1. Import CSS Tokens

In your app's `globals.css`:

```css
@import "tailwindcss";
@import "@articulink/design-system/tokens";
```

### 2. Use React Components

```tsx
import { Button, Input, Card, Modal } from '@articulink/design-system';

function MyComponent() {
  return (
    <Card depth hover>
      <Input label="Email" placeholder="you@example.com" />
      <Button variant="primary">Submit</Button>
    </Card>
  );
}
```

### 3. Register your router's link component (optional)

The design system is router-agnostic: components that render internal links
(`Button` with `href`, `BreadcrumbItem`) default to a plain `<a>`. In the
Next.js apps, wrap the root layout once in `LinkProvider` to get client-side
navigation:

```tsx
import Link from 'next/link';
import { LinkProvider } from '@articulink/design-system';

<LinkProvider component={Link}>
  {children}
</LinkProvider>
```

### 4. Use Tailwind Color Classes

All brand colors are available as Tailwind utilities:

```tsx
<div className="bg-tide text-white">Primary blue</div>
<div className="bg-sunshine text-abyss">Accent yellow</div>
<div className="bg-breeze border-mist">Light background</div>
```

## Design Tokens

### Core Brand Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `tide` | `#037DE4` | Primary actions, links, focus states |
| `surf` | `#1E96FC` | Secondary blue, hover states |
| `abyss` | `#012A4D` | Text, dark elements |
| `cloud` | `#FFFFFF` | Backgrounds |
| `sunshine` | `#FCDE1E` | Accent, highlights, CTAs |

### Blue Scale (Ocean Journey)

| Token | Hex | Usage |
|-------|-----|-------|
| `breeze` | `#F7FBFF` | Lightest background |
| `mist` | `#E4F2FE` | Borders, dividers |
| `bubble` | `#AFD9FD` | Hover borders |
| `lagoon` | `#013F74` | Secondary text |
| `depths` | `#01355E` | Dark accents |
| `trench` | `#001C33` | Darkest |

### UI Feedback

| Token | Hex | Usage |
|-------|-----|-------|
| `info` | `#3B82F6` | Information |
| `success` | `#22C55E` | Success states |
| `warning` | `#F59E0B` | Warnings |
| `error` | `#EF4444` | Errors |

### Status Badges

Use these for consistent status indicators:

```tsx
// Success badge
<span className="bg-success-bg text-success-text px-2 py-1 rounded-full text-sm">
  Completed
</span>

// Warning badge  
<span className="bg-warning-bg text-warning-text px-2 py-1 rounded-full text-sm">
  Pending
</span>

// Error badge
<span className="bg-error-bg text-error-text px-2 py-1 rounded-full text-sm">
  Failed
</span>
```

| Background | Text | Usage |
|------------|------|-------|
| `success-bg` | `success-text` | Completed, active, approved |
| `warning-bg` | `warning-text` | Pending, in progress |
| `error-bg` | `error-text` | Failed, rejected, cancelled |
| `info-bg` | `info-text` | Informational, neutral |

### Deep/Pressed States

| Token | Hex | Usage |
|-------|-----|-------|
| `tide-deep` | `#0369c1` | Primary button pressed |
| `sunshine-deep` | `#d4a90e` | Accent button pressed |


## Components

The package ships 90+ components: form controls (Button, Input, Select,
Checkbox, Combobox, DatePicker, FileUpload, …), layout (Card, Tabs,
Accordion, ResizablePanel, …), overlays (Modal, Drawer, Popover, Tooltip,
CommandMenu, …), navigation (Breadcrumb, Pagination, Sidebar, …), feedback
(Alert, Toast, Skeleton, Badge, …), data display (DataTable, Timeline,
StatCard, LineChart, BarChart, PieChart, USMap, …), media and
therapy-specific components (AudioRecorder, SignaturePad, WeekSchedule,
VoiceInput, …), plus `ThemeProvider`, `LinkProvider`, and `ErrorBoundary`.

**See [docs/COMPONENTS.md](docs/COMPONENTS.md) for the full usage reference
of every component.**

Everything is exported from the package root except `RichTextEditor`, which
lives at `@articulink/design-system/rich-text-editor` and requires the
TipTap peer dependencies (see the reference for details).

## Testing & Storybook

The design system includes testing and documentation infrastructure:

```bash
# Run tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run accessibility tests
npm run test:a11y

# Start Storybook
npm run storybook

# Build Storybook
npm run build-storybook
```

### Writing Tests

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '../components/Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

### Writing Stories

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../components/Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
  },
};
```

## CSS Utility Classes

The design system provides these utility classes:

- `.card-depth` - Standard card shadow
- `.card-depth-hover` - Hover shadow effect
- `.btn-3d` - 3D button press effect
- `.btn-primary`, `.btn-secondary`, `.btn-accent`, `.btn-ghost` - CSS-only buttons
- `.form-input` - Styled form inputs
- `.sr-only` - Screen reader only
- `.animate-fade-in-up`, `.animate-float`, etc. - Animations

## Typography

The design system expects these font variables to be set:

- `--font-poppins` - Body text (sans-serif)
- `--font-nunito` - Display/headings
- `--font-caveat` - Handwritten accents

Configure in your root layout:

```tsx
import { Poppins, Nunito, Caveat } from "next/font/google";

const poppins = Poppins({ variable: "--font-poppins", ... });
const nunito = Nunito({ variable: "--font-nunito", ... });
const caveat = Caveat({ variable: "--font-caveat", ... });

<body className={`${poppins.variable} ${nunito.variable} ${caveat.variable} font-sans`}>
```


## Adding New Components

When a component is needed across multiple apps:

1. Create the component in `src/components/YourComponent.tsx`
2. Export it from `src/components/index.ts`
3. Document usage in [docs/COMPONENTS.md](docs/COMPONENTS.md)
4. Update apps to import from `@articulink/design-system`

```ts
// src/components/index.ts
export { YourComponent } from './YourComponent';
export type { YourComponentProps } from './YourComponent';
```

## Development

```bash
npm install
npm run typecheck   # tsc --noEmit
npm run check:tokens # verify brand color parity with @articulink/brand
npm test            # vitest unit tests
npm run test:a11y   # accessibility tests
npm run build       # emits ESM + type declarations to dist/
npm run storybook   # component playground
```

## Publishing

The [publish workflow](.github/workflows/publish.yml) publishes the package
to GitHub Packages when a GitHub release is published (the release tag must
match the `package.json` version, e.g. `v0.1.0`), or manually via
workflow_dispatch. `prepublishOnly` runs the typecheck and build.

## File Structure

```
src/
├── components/        # 90+ components + index.ts barrel export
├── hooks/             # Shared hooks (useDataTable, useFetch)
├── tokens/            # index.css — CSS custom properties and Tailwind theme
├── utils/             # Shared utilities (statusColors, …)
├── rich-text-editor.ts# Separate entry point for the TipTap editor
├── __tests__/         # Unit + accessibility tests
├── stories/           # Storybook stories
└── index.ts           # Main package entry
docs/
└── COMPONENTS.md      # Full per-component usage reference
```
