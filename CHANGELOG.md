# Changelog

## 0.4.1 · November 15, 2026

- **`Button` (React):** the primary variant uses the `action` colours
  (blue-600, as `.btn-primary` does), not white on blue-500 (4.4:1, under
  AA); secondary and ghost text is `action` too.
- **`Input` (React):** the `icon` prop (in the props the story and tests
  used, but never implemented, so it leaked onto the `<input>`) now draws a
  decorative icon inside the field, on the left.
- **Tests pass again:** `next` is a dev dependency (and a peer: `Button` and
  `Breadcrumb` import `next/link`); stale class expectations in the Button,
  Input and Modal tests corrected; the axe tests run in jsdom with the
  vitest-axe matchers registered.

## 0.4.0 · November 15, 2026

- **Breaking: the ocean colour names are gone.** The aliases retired in v6
  (`--tide`, `bg-abyss`, `text-mist`…) no longer resolve. The package's own
  components now use the tokens, with no visual change. Old name → token:
  tide → `blue-500`, surf → `blue-400`, tide-deep → `blue-600`, tide-dark →
  `blue-700`, tide-shadow → `action-shadow`, abyss → `navy`, cloud →
  `white`, lagoon → `blue-800`, depths → `blue-850`, trench → `blue-950`,
  breeze → `surface-subtle`, mist → `surface-tint`, mist-deep →
  `slate-100`, bubble → `blue-100`, sunshine → `yellow`, sunshine-deep →
  `yellow-deep`, coral → `pink`, seafoam → `cyan`, sunset → `orange`,
  kelp → `green`, jellyfish → `violet`. For anything that means "the
  brand", use `primary` rather than `blue-500`.

## 0.3.0 · November 15, 2026

- **Brand colour (design system v14).** `--primary` is `blue-600`
  (`#0268BF`), not `blue-500`, so brand surfaces and the confetti field take
  white text at any size (5.6:1). Same hue as `blue-500`, so the accents keep
  their spacing on the colour wheel. `--primary-deep` is `blue-700`.
  `blue-500` stays on the ramp (focus rings, Link's head, `chart-1`). A
  consumer that pinned `--blue-500` to `#0268BF` (articulink.com) can drop
  the pin and use `primary` for brand surfaces.

## 0.2.1 · November 15, 2026

- **Confetti: one size.** `.bg-shape-tile` now draws the one-size tile from
  the Articulink Brand design system v13: every shape the same size
  (mixed sizes read as fake depth), balanced so each kind paints the same
  area, spread evenly, 83 shapes. It is the same tile as articulink.com's
  `public/images/confetti-tile.svg`, from its seeded generator
  (`scripts/generate-confetti-tile.mjs` in the website repo).

## 0.2.0 · October 31, 2026

Brings the package to the Articulink Brand design system v11.

- **Colour:** new token names (`blue-25`…`blue-950`, `slate-*`, `navy`,
  `surface-subtle`, `surface-tint`, `yellow`, `cyan`, `pink`, `orange`, `green`,
  `violet`, `action*`), retuned status colours, chart colours, dark theme via
  `data-theme="dark"`. Ocean names stay as deprecated aliases.
- **Type:** Lexend replaces Poppins and Nunito. Self-hosted files in
  `src/fonts/`, `@font-face` in `src/tokens/fonts.css`, type classes in
  `src/styles/type.css`.
- **Buttons:** `action` (blue-600) primary, `btn-tertiary`, `btn-icon`,
  `btn-full`; 44/36/56px heights; the 4px edge compresses 2px when pressed.
- **Components:** `src/styles/components.css` carries the `al-*` component
  classes and the v11 `.bg-shape-tile` confetti.
- **Tokens:** spacing, radius, shadow, motion, breakpoint and z-index scales.
