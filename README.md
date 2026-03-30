# @articulink/design-system

Centralized design system for all Articulink applications, implementing atomic design principles.

## Installation

This package is part of the monorepo workspaces. All apps (portal, app, admin, website) automatically have access via:

```json
{
  "dependencies": {
    "@articulink/design-system": "workspace:*"
  }
}
```

## Usage

### 1. Import CSS Tokens

In your app's `globals.css`:

```css
@import "tailwindcss";
@import "@articulink/design-system/src/tokens/index.css";
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

### 3. Use Tailwind Color Classes

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

### Deep/Pressed States

| Token | Hex | Usage |
|-------|-----|-------|
| `tide-deep` | `#0369c1` | Primary button pressed |
| `sunshine-deep` | `#d4a90e` | Accent button pressed |

## Components

### Button

Duolingo-style 3D press effect button.

```tsx
<Button variant="primary">Primary Action</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="accent">Accent (Yellow)</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium (default)</Button>
<Button size="lg">Large</Button>

// States
<Button loading>Loading...</Button>
<Button disabled>Disabled</Button>
<Button fullWidth>Full Width</Button>
```

### Input

Accessible form input with validation states.

```tsx
<Input label="Email" placeholder="you@example.com" />
<Input label="Password" type="password" required />
<Input error="This field is required" />
<Input hint="We'll never share your email" />
```

### Card

Container with optional depth shadow and hover effects.

```tsx
<Card>Default card</Card>
<Card depth={false}>No shadow</Card>
<Card hover>Lift on hover</Card>
<Card padding="lg">Extra padding</Card>
```

### Modal

Accessible dialog with focus trapping.

```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
  description="Are you sure?"
>
  Modal content here
</Modal>
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
