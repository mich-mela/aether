/**
 * AETHER Favorites & Lesson Bookmarks Database Module
 */

import { STORES } from './schema.js';
import { putRecord, getRecord, getRecordsByIndex, deleteRecord } from './db.js';
import { logActivity } from './progress-db.js';

export async function toggleFavorite(userId, { entityType, entityId, title, subtitle = '', route = '' }) {
  if (!userId) throw new Error('Please sign in to save favorites.');
  const id = `${userId}::${entityType}::${entityId}`;
  const existing = await getRecord(STORES.FAVORITES, id);
  if (existing) {
    await deleteRecord(STORES.FAVORITES, id);
    return { saved: false };
  }
  const rec = {
    id,
    userId,
    entityType,
    entityId,
    title,
    subtitle,
    route,
    savedAt: new Date().toISOString()
  };
  await putRecord(STORES.FAVORITES, rec);
  await logActivity(userId, 'favorite_added', `Saved ${entityType}: ${title}`, { entityType, entityId });
  return { saved: true, record: rec };
}

export async function isFavorite(userId, entityType, entityId) {
  if (!userId) return false;
  const rec = await getRecord(STORES.FAVORITES, `${userId}::${entityType}::${entityId}`);
  return Boolean(rec);
}

export async function getUserFavorites(userId, entityType = null) {
  if (!userId) return [];
  const all = await getRecordsByIndex(STORES.FAVORITES, 'userId', userId);
  const filtered = entityType ? all.filter((f) => f.entityType === entityType) : all;
  return filtered.sort((a, b) => (b.savedAt || '').localeCompare(a.savedAt || ''));
}

export async function toggleBookmark(userId, { lessonId, courseId, title }) {
  if (!userId) throw new Error('Please sign in to bookmark lessons.');
  const id = `${userId}::${lessonId}`;
  const existing = await getRecord(STORES.BOOKMARKS, id);
  if (existing) {
    await deleteRecord(STORES.BOOKMARKS, id);
    return { saved: false };
  }
  const rec = {
    id,
    userId,
    lessonId,
    courseId,
    title,
    savedAt: new Date().toISOString()
  };
  await putRecord(STORES.BOOKMARKS, rec);
  await logActivity(userId, 'bookmark_added', `Bookmarked lesson: ${title}`, { lessonId, courseId });
  return { saved: true, record: rec };
}

export async function isBookmarked(userId, lessonId) {
  if (!userId) return false;
  const rec = await getRecord(STORES.BOOKMARKS, `${userId}::${lessonId}`);
  return Boolean(rec);
}

export async function getUserBookmarks(userId) {
  if (!userId) return [];
  const all = await getRecordsByIndex(STORES.BOOKMARKS, 'userId', userId);
  return all.sort((a, b) => (b.savedAt || '').localeCompare(a.savedAt || ''));
}
