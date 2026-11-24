/**
 * AETHER LocalStorage Preferences Manager
 * Strictly for simple UI preferences & small settings.
 * Passwords and private account data are NEVER stored in LocalStorage.
 */

const PREFIX = 'aether_pref_';

export const DEFAULT_PREFS = {
  theme: 'dark', // 'dark' | 'light' | 'system'
  sidebarCollapsed: false,
  reducedMotion: false,
  soundEnabled: false, // Off by default
  notificationsEnabled: true,
  learningReminders: true,
  nasaApiKey: 'DEMO_KEY',
  lastSolarSpeed: 1,
  lastActiveUserId: null,
  rememberSession: true,
  defaultViewMode: 'grid'
};

function isStorageAvailable() {
  try {
    const testKey = `${PREFIX}__test__`;
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

export function getPref(key, fallback = DEFAULT_PREFS[key]) {
  if (!isStorageAvailable()) return fallback;
  try {
    const raw = window.localStorage.getItem(`${PREFIX}${key}`);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function setPref(key, value) {
  if (!isStorageAvailable()) return false;
  try {
    window.localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removePref(key) {
  if (!isStorageAvailable()) return;
  try {
    window.localStorage.removeItem(`${PREFIX}${key}`);
  } catch {
    // Ignore storage errors
  }
}

export function getAllPrefs() {
  const result = { ...DEFAULT_PREFS };
  for (const key of Object.keys(DEFAULT_PREFS)) {
    result[key] = getPref(key, DEFAULT_PREFS[key]);
  }
  return result;
}

export function resetAllPrefs() {
  for (const key of Object.keys(DEFAULT_PREFS)) {
    if (key !== 'lastActiveUserId') {
      setPref(key, DEFAULT_PREFS[key]);
    }
  }
  return getAllPrefs();
}

export function applyTheme(themePref = getPref('theme', 'dark')) {
  let resolved = themePref;
  if (themePref === 'system') {
    resolved = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  document.documentElement.setAttribute('data-theme', resolved === 'light' ? 'light' : 'dark');
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.setAttribute('content', resolved === 'light' ? '#F2F6FB' : '#07111F');
  }
  return resolved;
}

export function applyReducedMotion(enabled = getPref('reducedMotion', false)) {
  document.documentElement.setAttribute('data-reduced-motion', enabled ? 'true' : 'false');
}
