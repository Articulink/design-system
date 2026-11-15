# Changelog

## 0.2.1 · November 15, 2026

- **Confetti: one size.** `.bg-shape-tile` now draws the one-size tile from
  the Articulink Brand design system v13: every shape the same size
  (mixed sizes read as fake depth), balanced so each kind paints the same
  area, spread evenly, 83 shapes. It is the same tile as articulink.com's
  `public/images/confetti-tile.svg` and `@articulink/brand` v2, from the
  same seeded generator (`scripts/generate-confetti-tile.mjs` in those repos).

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
