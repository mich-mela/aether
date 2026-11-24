/**
 * AETHER Input & Backup Data Validation Utilities
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateEmail(email) {
  const trimmed = String(email || '').trim().toLowerCase();
  if (!trimmed) return { valid: false, message: 'Email address is required.' };
  if (!EMAIL_RE.test(trimmed)) return { valid: false, message: 'Please enter a valid email address.' };
  return { valid: true, value: trimmed };
}

export function validateFullName(name) {
  const trimmed = String(name || '').trim();
  if (!trimmed) return { valid: false, message: 'Full name is required.' };
  if (trimmed.length < 2) return { valid: false, message: 'Full name must be at least 2 characters.' };
  if (trimmed.length > 80) return { valid: false, message: 'Full name must be 80 characters or fewer.' };
  return { valid: true, value: trimmed };
}

export function validatePassword(password) {
  const val = String(password || '');
  if (!val) return { valid: false, message: 'Password is required.' };
  if (val.length < 8) return { valid: false, message: 'Password must be at least 8 characters long.' };
  if (!/[A-Za-z]/.test(val) || !/\d/.test(val)) {
    return { valid: false, message: 'Password must include both letters and numbers.' };
  }
  return { valid: true, value: val };
}

export function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword) return { valid: false, message: 'Please confirm your password.' };
  if (password !== confirmPassword) return { valid: false, message: 'Passwords do not match.' };
  return { valid: true };
}

export function validateBackupPayload(data) {
  if (!data || typeof data !== 'object') {
    return { valid: false, message: 'Backup file must be a valid JSON object.' };
  }
  if (data.app !== 'AETHER' || typeof data.schemaVersion !== 'number') {
    return { valid: false, message: 'Unrecognized backup format. Expected an AETHER export file.' };
  }
  if (!data.records || typeof data.records !== 'object') {
    return { valid: false, message: 'Backup file is missing the records payload.' };
  }
  const requiredArrays = [
    'learningProgress',
    'quizResults',
    'favorites',
    'bookmarks',
    'achievements',
    'activity',
    'notifications',
    'recentlyViewed'
  ];
  for (const key of requiredArrays) {
    if (data.records[key] !== undefined && !Array.isArray(data.records[key])) {
      return { valid: false, message: `Invalid backup field "${key}": expected an array.` };
    }
  }
  return { valid: true };
}
