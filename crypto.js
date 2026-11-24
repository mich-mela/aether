/**
 * AETHER Web Crypto Password Derivation (PBKDF2-SHA256)
 * Used for local educational account management in IndexedDB.
 * Plaintext passwords are never stored.
 */

const ITERATIONS = 100000;
const KEY_LENGTH_BITS = 256;

function bytesToHex(bytes) {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

function hexToBytes(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes;
}

function constantTimeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export function generateSaltHex(lengthBytes = 16) {
  const arr = new Uint8Array(lengthBytes);
  crypto.getRandomValues(arr);
  return bytesToHex(arr);
}

export function generateId(prefix = 'id') {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  return `${prefix}_${Date.now().toString(36)}_${bytesToHex(bytes)}`;
}

export async function hashPassword(password, saltHex = generateSaltHex()) {
  if (!window.crypto || !window.crypto.subtle) {
    throw new Error('Web Crypto API is unavailable in this browser context. Please run AETHER on http://localhost:5500/ or HTTPS.');
  }

  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: hexToBytes(saltHex),
      iterations: ITERATIONS,
      hash: 'SHA-256'
    },
    keyMaterial,
    KEY_LENGTH_BITS
  );

  return {
    algorithm: 'PBKDF2-SHA256',
    iterations: ITERATIONS,
    salt: saltHex,
    hash: bytesToHex(new Uint8Array(derivedBits))
  };
}

export async function verifyPassword(password, storedRecord) {
  if (!storedRecord || !storedRecord.salt || !storedRecord.hash) return false;
  const derived = await hashPassword(password, storedRecord.salt);
  return constantTimeEqual(derived.hash, storedRecord.hash);
}
