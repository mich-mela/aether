/**
 * AETHER Local Account & Profile Database Operations
 * Uses PBKDF2-SHA256 password hashing via Web Crypto API.
 */

import { STORES } from './schema.js';
import {
  createRecord,
  putRecord,
  getRecord,
  getSingleByIndex,
  deleteRecord,
  deleteByIndex
} from './db.js';
import { generateId, hashPassword, verifyPassword } from './crypto.js';
import { setPref, getPref, removePref } from './storage.js';

export async function createAccount({ fullName, email, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  const existing = await getSingleByIndex(STORES.USERS, 'email', normalizedEmail);
  if (existing) {
    throw new Error('An account with this email address already exists on this browser.');
  }

  const passwordHash = await hashPassword(password);
  const now = new Date().toISOString();
  const userId = generateId('usr');

  const userRecord = {
    id: userId,
    fullName: fullName.trim(),
    email: normalizedEmail,
    passwordHash, // { algorithm, iterations, salt, hash } — never plaintext
    createdAt: now,
    lastLoginAt: now
  };

  const profileRecord = {
    userId,
    fullName: fullName.trim(),
    email: normalizedEmail,
    level: 'Beginner',
    interests: [],
    currentPathId: 'astronomy-beginner',
    onboardingCompleted: false,
    bio: '',
    createdAt: now,
    updatedAt: now
  };

  await createRecord(STORES.USERS, userRecord);
  await putRecord(STORES.PROFILES, profileRecord);

  // Welcome notification
  await putRecord(STORES.NOTIFICATIONS, {
    id: generateId('ntf'),
    userId,
    type: 'system',
    title: 'Welcome to AETHER',
    message: 'Your local explorer account is active. All progress is stored privately in this browser using IndexedDB.',
    read: false,
    createdAt: now
  });

  setPref('lastActiveUserId', userId);
  setPref('rememberSession', true);

  return sanitizeUser(userRecord, profileRecord);
}

export async function loginAccount({ email, password, remember = true }) {
  const normalizedEmail = email.trim().toLowerCase();
  const userRecord = await getSingleByIndex(STORES.USERS, 'email', normalizedEmail);
  if (!userRecord) {
    throw new Error('No local account found for that email address.');
  }

  const isValid = await verifyPassword(password, userRecord.passwordHash);
  if (!isValid) {
    throw new Error('Incorrect password. Please check your credentials and try again.');
  }

  userRecord.lastLoginAt = new Date().toISOString();
  await putRecord(STORES.USERS, userRecord);

  let profileRecord = await getRecord(STORES.PROFILES, userRecord.id);
  if (!profileRecord) {
    profileRecord = {
      userId: userRecord.id,
      fullName: userRecord.fullName,
      email: userRecord.email,
      level: 'Beginner',
      interests: [],
      currentPathId: 'astronomy-beginner',
      onboardingCompleted: true,
      bio: '',
      createdAt: userRecord.createdAt,
      updatedAt: userRecord.lastLoginAt
    };
    await putRecord(STORES.PROFILES, profileRecord);
  }

  setPref('rememberSession', Boolean(remember));
  if (remember) {
    setPref('lastActiveUserId', userRecord.id);
    sessionStorage.removeItem('aether_session_user');
  } else {
    removePref('lastActiveUserId');
    sessionStorage.setItem('aether_session_user', userRecord.id);
  }

  return sanitizeUser(userRecord, profileRecord);
}

export function logoutAccount() {
  removePref('lastActiveUserId');
  sessionStorage.removeItem('aether_session_user');
}

export async function restoreSession() {
  const sessionUserId = sessionStorage.getItem('aether_session_user') || getPref('lastActiveUserId', null);
  if (!sessionUserId) return null;

  const userRecord = await getRecord(STORES.USERS, sessionUserId);
  if (!userRecord) {
    logoutAccount();
    return null;
  }

  const profileRecord = await getRecord(STORES.PROFILES, userRecord.id);
  return sanitizeUser(userRecord, profileRecord);
}

export async function updateUserProfile(userId, updates) {
  const userRecord = await getRecord(STORES.USERS, userId);
  if (!userRecord) throw new Error('Account not found.');

  const existingProfile = (await getRecord(STORES.PROFILES, userId)) || {
    userId,
    createdAt: userRecord.createdAt
  };

  if (updates.fullName) {
    userRecord.fullName = updates.fullName.trim();
    await putRecord(STORES.USERS, userRecord);
  }

  const updatedProfile = {
    ...existingProfile,
    ...updates,
    userId,
    fullName: userRecord.fullName,
    email: userRecord.email,
    updatedAt: new Date().toISOString()
  };

  await putRecord(STORES.PROFILES, updatedProfile);
  return sanitizeUser(userRecord, updatedProfile);
}

export async function changeUserPassword(userId, currentPassword, newPassword) {
  const userRecord = await getRecord(STORES.USERS, userId);
  if (!userRecord) throw new Error('Account not found.');

  const ok = await verifyPassword(currentPassword, userRecord.passwordHash);
  if (!ok) {
    throw new Error('Current password is incorrect.');
  }

  userRecord.passwordHash = await hashPassword(newPassword);
  await putRecord(STORES.USERS, userRecord);
  return true;
}

export async function deleteUserAccount(userId) {
  await deleteRecord(STORES.USERS, userId);
  await deleteRecord(STORES.PROFILES, userId);

  const userScopedStores = [
    STORES.LEARNING_PROGRESS,
    STORES.LESSONS,
    STORES.QUIZ_RESULTS,
    STORES.FAVORITES,
    STORES.BOOKMARKS,
    STORES.ACHIEVEMENTS,
    STORES.ACTIVITY,
    STORES.NOTIFICATIONS,
    STORES.RECENTLY_VIEWED
  ];

  for (const storeName of userScopedStores) {
    await deleteByIndex(storeName, 'userId', userId);
  }

  logoutAccount();
  return true;
}

function sanitizeUser(userRecord, profileRecord) {
  return {
    id: userRecord.id,
    fullName: userRecord.fullName,
    email: userRecord.email,
    createdAt: userRecord.createdAt,
    lastLoginAt: userRecord.lastLoginAt,
    profile: profileRecord || {
      userId: userRecord.id,
      fullName: userRecord.fullName,
      email: userRecord.email,
      level: 'Beginner',
      interests: [],
      currentPathId: 'astronomy-beginner',
      onboardingCompleted: false,
      bio: ''
    }
  };
}
