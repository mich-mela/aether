/**
 * AETHER Local Data Backup & Restore (JSON Export / Import)
 * Exports and restores the active user's IndexedDB records with validation.
 */

import { DB_VERSION, STORES } from './schema.js';
import { getRecord, getRecordsByIndex, putRecord } from './db.js';
import { validateBackupPayload } from './validation.js';
import { getAllPrefs, setPref } from './storage.js';

export async function exportUserBackup(userId) {
  if (!userId) throw new Error('Sign in to export your personal AETHER backup.');

  const [
    profile,
    learningProgress,
    lessons,
    quizResults,
    favorites,
    bookmarks,
    achievements,
    activity,
    notifications,
    recentlyViewed
  ] = await Promise.all([
    getRecord(STORES.PROFILES, userId),
    getRecordsByIndex(STORES.LEARNING_PROGRESS, 'userId', userId),
    getRecordsByIndex(STORES.LESSONS, 'userId', userId),
    getRecordsByIndex(STORES.QUIZ_RESULTS, 'userId', userId),
    getRecordsByIndex(STORES.FAVORITES, 'userId', userId),
    getRecordsByIndex(STORES.BOOKMARKS, 'userId', userId),
    getRecordsByIndex(STORES.ACHIEVEMENTS, 'userId', userId),
    getRecordsByIndex(STORES.ACTIVITY, 'userId', userId),
    getRecordsByIndex(STORES.NOTIFICATIONS, 'userId', userId),
    getRecordsByIndex(STORES.RECENTLY_VIEWED, 'userId', userId)
  ]);

  const prefs = getAllPrefs();
  delete prefs.lastActiveUserId;

  return {
    app: 'AETHER',
    schemaVersion: DB_VERSION,
    exportedAt: new Date().toISOString(),
    note: 'Local AETHER educational backup. Password hashes are excluded for safety.',
    preferences: prefs,
    records: {
      profile: profile || null,
      learningProgress,
      lessons,
      quizResults,
      favorites,
      bookmarks,
      achievements,
      activity,
      notifications,
      recentlyViewed
    }
  };
}

export async function importUserBackup(userId, rawJson) {
  if (!userId) throw new Error('Sign in before importing a backup into your account.');

  let parsed;
  try {
    parsed = typeof rawJson === 'string' ? JSON.parse(rawJson) : rawJson;
  } catch {
    throw new Error('The selected file is not valid JSON.');
  }

  const check = validateBackupPayload(parsed);
  if (!check.valid) {
    throw new Error(check.message);
  }

  const { records, preferences } = parsed;
  let importedCount = 0;

  if (records.profile && typeof records.profile === 'object') {
    const existing = (await getRecord(STORES.PROFILES, userId)) || {};
    await putRecord(STORES.PROFILES, {
      ...existing,
      level: records.profile.level || existing.level || 'Beginner',
      interests: Array.isArray(records.profile.interests) ? records.profile.interests : existing.interests || [],
      currentPathId: records.profile.currentPathId || existing.currentPathId || 'astronomy-beginner',
      bio: typeof records.profile.bio === 'string' ? records.profile.bio : existing.bio || '',
      onboardingCompleted: true,
      userId,
      updatedAt: new Date().toISOString()
    });
    importedCount++;
  }

  const storeMap = [
    ['learningProgress', STORES.LEARNING_PROGRESS, (item) => `${userId}::${item.courseId}`],
    ['lessons', STORES.LESSONS, (item) => `${userId}::${item.lessonId}`],
    ['quizResults', STORES.QUIZ_RESULTS, (item) => item.id],
    ['favorites', STORES.FAVORITES, (item) => `${userId}::${item.entityType}::${item.entityId}`],
    ['bookmarks', STORES.BOOKMARKS, (item) => `${userId}::${item.lessonId}`],
    ['achievements', STORES.ACHIEVEMENTS, (item) => `${userId}::${item.badgeId}`],
    ['activity', STORES.ACTIVITY, (item) => item.id],
    ['notifications', STORES.NOTIFICATIONS, (item) => item.id],
    ['recentlyViewed', STORES.RECENTLY_VIEWED, (item) => `${userId}::${item.entityType}::${item.entityId}`]
  ];

  for (const [key, storeName, buildId] of storeMap) {
    const arr = records[key];
    if (!Array.isArray(arr)) continue;
    for (const item of arr) {
      if (!item || typeof item !== 'object') continue;
      const scoped = { ...item, userId };
      const computedId = buildId(scoped);
      if (computedId) scoped.id = computedId;
      await putRecord(storeName, scoped);
      importedCount++;
    }
  }

  if (preferences && typeof preferences === 'object') {
    const allowedPrefs = ['theme', 'reducedMotion', 'soundEnabled', 'notificationsEnabled', 'learningReminders'];
    for (const k of allowedPrefs) {
      if (preferences[k] !== undefined) setPref(k, preferences[k]);
    }
  }

  return { importedCount };
}

export function triggerJsonDownload(payload, filename = 'aether-backup.json') {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
