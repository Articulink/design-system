#!/usr/bin/env node
/**
 * Verifies that every brand color token in @articulink/brand's
 * tokens/tokens.json exists in src/tokens/index.css with the same hex
 * value. The brand package is the source of truth for brand colors; this
 * check fails CI on drift.
 *
 * Token source (first that works):
 *   1. BRAND_TOKENS_PATH env var — a local tokens.json (for offline runs)
 *   2. https://raw.githubusercontent.com/Articulink/brand/main/tokens/tokens.json
 *   3. https://raw.githubusercontent.com/jordyhunsaker/articulink-brand/main/tokens/tokens.json
 *      (pre-org-transfer location; kept as a fallback during migration)
 */
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const TOKEN_URLS = [
  'https://raw.githubusercontent.com/Articulink/brand/main/tokens/tokens.json',
  'https://raw.githubusercontent.com/jordyhunsaker/articulink-brand/main/tokens/tokens.json',
];

async function loadBrandTokens() {
  if (process.env.BRAND_TOKENS_PATH) {
    return JSON.parse(await readFile(process.env.BRAND_TOKENS_PATH, 'utf8'));
  }
  const errors = [];
  for (const url of TOKEN_URLS) {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        errors.push(`${url}: HTTP ${res.status}`);
        continue;
      }
      return await res.json();
    } catch (err) {
      errors.push(`${url}: ${err.message}`);
    }
  }
  throw new Error(`Could not load brand tokens:\n  ${errors.join('\n  ')}`);
}

// e.g. "tideDeep" / "tide-deep" -> "tidedeep"
const normalize = (name) => name.toLowerCase().replace(/[^a-z0-9]/g, '');

function collectBrandColors(node, out = new Map()) {
  for (const [key, value] of Object.entries(node)) {
    if (value && typeof value === 'object') {
      if (typeof value.value === 'string' && value.value.startsWith('#')) {
        out.set(normalize(key), { name: key, hex: value.value.toUpperCase() });
      } else {
        collectBrandColors(value, out);
      }
    }
  }
  return out;
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const css = await readFile(path.join(root, 'src/tokens/index.css'), 'utf8');

// First definition of each custom property wins (light mode); later
// re-definitions are dark-mode overrides and are not compared.
const cssTokens = new Map();
for (const match of css.matchAll(/--([a-zA-Z0-9-]+):\s*(#[0-9A-Fa-f]{3,8})\b/g)) {
  const key = normalize(match[1]);
  if (!cssTokens.has(key)) cssTokens.set(key, { name: match[1], hex: match[2].toUpperCase() });
}

const brand = collectBrandColors((await loadBrandTokens()).color ?? {});

const missing = [];
const mismatched = [];
for (const [key, token] of brand) {
  const cssToken = cssTokens.get(key);
  if (!cssToken) missing.push(token.name);
  else if (cssToken.hex !== token.hex) {
    mismatched.push(`${token.name}: brand ${token.hex} != css --${cssToken.name} ${cssToken.hex}`);
  }
}

if (missing.length || mismatched.length) {
  if (missing.length) console.error(`Brand tokens missing from src/tokens/index.css:\n  ${missing.join('\n  ')}`);
  if (mismatched.length) console.error(`Brand token values out of sync:\n  ${mismatched.join('\n  ')}`);
  console.error('\nBrand colors are owned by @articulink/brand (tokens/tokens.json). Update src/tokens/index.css to match.');
  process.exit(1);
}

console.log(`Token parity OK: ${brand.size} brand color tokens match src/tokens/index.css.`);
