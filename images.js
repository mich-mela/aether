/**
 * AETHER Astronomical Image Helper
 * Resolves official NASA/ESA image URLs with guaranteed local SVG fallbacks.
 */

import { createSpaceSvgFallback, escapeHtml } from './helpers.js';

export function renderSpaceImage({ src, alt, title, palette, variant = 'planet', className = '' }) {
  const fallback = createSpaceSvgFallback(title || alt || 'AETHER', palette, variant);
  const safeSrc = src || fallback;
  return `<img src="${escapeHtml(safeSrc)}" data-fallback="${escapeHtml(fallback)}" alt="${escapeHtml(alt || title || 'Astronomical image')}" loading="lazy" decoding="async" class="${escapeHtml(className)}" />`;
}
