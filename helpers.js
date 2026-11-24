/**
 * AETHER General Helpers, Formatting & Fallback Media Generators
 */

export function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function formatUtcTime(date = new Date()) {
  return date.toISOString().slice(11, 19) + ' UTC';
}

export function formatUtcDate(date = new Date()) {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC'
  }) + ' (UTC)';
}

export function formatShortDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatRelativeTime(iso) {
  if (!iso) return '';
  const diffSec = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (diffSec < 60) return 'Just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  return `${Math.floor(diffSec / 86400)}d ago`;
}

export function getInitials(name = '') {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return 'AE';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function debounce(fn, delay = 200) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export async function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return true;
  }
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  const ok = document.execCommand('copy');
  ta.remove();
  return ok;
}

export function formatSI(value, unit = '', digits = 3) {
  if (!Number.isFinite(value)) return `— ${unit}`.trim();
  const abs = Math.abs(value);
  if (abs !== 0 && (abs >= 1e5 || abs < 1e-2)) {
    return `${value.toExponential(digits)} ${unit}`.trim();
  }
  return `${Number(value.toPrecision(digits + 1)).toLocaleString('en-US')} ${unit}`.trim();
}

export function refreshIcons() {
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}

/**
 * Generates an inline SVG astronomical visual fallback so images never break
 * offline or if an external NASA image endpoint is throttled.
 */
export function createSpaceSvgFallback(title = 'AETHER', palette = ['#102542', '#35D6F2', '#07111F'], variant = 'planet') {
  const [c1, c2, c3] = palette;
  const safeTitle = escapeHtml(title);
  let bodyMarkup = '';
  if (variant === 'ringed') {
    bodyMarkup = `
      <ellipse cx="320" cy="200" rx="155" ry="34" fill="none" stroke="${c2}" stroke-opacity="0.65" stroke-width="14" transform="rotate(-14 320 200)"/>
      <circle cx="320" cy="200" r="82" fill="url(#gOrb)"/>
      <path d="M 168 188 A 155 34 -14 0 0 472 212" fill="none" stroke="${c2}" stroke-opacity="0.85" stroke-width="10"/>`;
  } else if (variant === 'nebula' || variant === 'galaxy') {
    bodyMarkup = `
      <ellipse cx="320" cy="200" rx="170" ry="70" fill="url(#gNeb)" transform="rotate(-22 320 200)" opacity="0.85"/>
      <ellipse cx="320" cy="200" rx="95" ry="36" fill="${c2}" opacity="0.28" transform="rotate(-22 320 200)"/>
      <circle cx="320" cy="200" r="18" fill="#F5F8FC" opacity="0.9"/>`;
  } else if (variant === 'mission') {
    bodyMarkup = `
      <circle cx="320" cy="200" r="110" fill="none" stroke="${c2}" stroke-opacity="0.28" stroke-dasharray="6 6"/>
      <circle cx="320" cy="200" r="64" fill="none" stroke="${c2}" stroke-opacity="0.45"/>
      <polygon points="320,148 340,210 320,196 300,210" fill="${c2}"/>
      <circle cx="320" cy="200" r="5" fill="#F5F8FC"/>`;
  } else {
    bodyMarkup = `
      <circle cx="320" cy="200" r="96" fill="url(#gOrb)"/>
      <circle cx="320" cy="200" r="96" fill="url(#gShade)"/>`;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400">
    <defs>
      <radialGradient id="gBg" cx="50%" cy="45%" r="70%">
        <stop offset="0%" stop-color="${c1}"/>
        <stop offset="100%" stop-color="${c3}"/>
      </radialGradient>
      <radialGradient id="gOrb" cx="35%" cy="32%" r="68%">
        <stop offset="0%" stop-color="${c2}"/>
        <stop offset="55%" stop-color="${c1}"/>
        <stop offset="100%" stop-color="${c3}"/>
      </radialGradient>
      <radialGradient id="gShade" cx="72%" cy="68%" r="65%">
        <stop offset="0%" stop-color="#000000" stop-opacity="0.72"/>
        <stop offset="65%" stop-color="#000000" stop-opacity="0.15"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="gNeb" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="${c2}" stop-opacity="0.8"/>
        <stop offset="60%" stop-color="${c1}" stop-opacity="0.45"/>
        <stop offset="100%" stop-color="${c3}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="640" height="400" fill="url(#gBg)"/>
    <g fill="#F5F8FC" opacity="0.65">
      <circle cx="74" cy="64" r="1.4"/><circle cx="148" cy="112" r="1.1"/><circle cx="520" cy="72" r="1.5"/>
      <circle cx="572" cy="148" r="1.2"/><circle cx="96" cy="312" r="1.3"/><circle cx="490" cy="326" r="1.1"/>
      <circle cx="220" cy="54" r="1"/><circle cx="412" cy="84" r="1.2"/><circle cx="588" cy="274" r="1.4"/>
    </g>
    ${bodyMarkup}
    <text x="24" y="374" fill="#C8D3DF" font-family="Inter, system-ui, sans-serif" font-size="14" font-weight="600" letter-spacing="1.5">${safeTitle.toUpperCase()}</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function attachImageFallbacks(root = document) {
  root.querySelectorAll('img[data-fallback]').forEach((img) => {
    if (img.dataset.fallbackBound) return;
    img.dataset.fallbackBound = '1';
    img.addEventListener('error', () => {
      if (img.src !== img.dataset.fallback) {
        img.src = img.dataset.fallback;
      }
    });
  });
}
