/**
 * AETHER_DATABASE — IndexedDB Schema Definition
 * Organized object stores, primary keys, and indexes.
 */

export const DB_NAME = 'AETHER_DATABASE';
export const DB_VERSION = 1;

export const STORES = {
  USERS: 'users',
  PROFILES: 'profiles',
  COURSES: 'courses',
  LEARNING_PROGRESS: 'learningProgress',
  LESSONS: 'lessons',
  QUIZ_RESULTS: 'quizResults',
  FAVORITES: 'favorites',
  BOOKMARKS: 'bookmarks',
  ACHIEVEMENTS: 'achievements',
  ACTIVITY: 'activity',
  NOTIFICATIONS: 'notifications',
  RECENTLY_VIEWED: 'recentlyViewed'
};

export const STORE_DEFINITIONS = [
  {
    name: STORES.USERS,
    options: { keyPath: 'id' },
    indexes: [
      { name: 'email', keyPath: 'email', options: { unique: true } },
      { name: 'createdAt', keyPath: 'createdAt', options: { unique: false } }
    ]
  },
  {
    name: STORES.PROFILES,
    options: { keyPath: 'userId' },
    indexes: [
      { name: 'level', keyPath: 'level', options: { unique: false } }
    ]
  },
  {
    name: STORES.COURSES,
    options: { keyPath: 'id' },
    indexes: [
      { name: 'difficulty', keyPath: 'difficulty', options: { unique: false } },
      { name: 'pathId', keyPath: 'pathId', options: { unique: false } }
    ]
  },
  {
    name: STORES.LEARNING_PROGRESS,
    options: { keyPath: 'id' }, // `${userId}::${courseId}`
    indexes: [
      { name: 'userId', keyPath: 'userId', options: { unique: false } },
      { name: 'courseId', keyPath: 'courseId', options: { unique: false } },
      { name: 'updatedAt', keyPath: 'updatedAt', options: { unique: false } }
    ]
  },
  {
    name: STORES.LESSONS,
    options: { keyPath: 'id' }, // `${userId}::${lessonId}`
    indexes: [
      { name: 'userId', keyPath: 'userId', options: { unique: false } },
      { name: 'courseId', keyPath: 'courseId', options: { unique: false } },
      { name: 'completed', keyPath: 'completed', options: { unique: false } }
    ]
  },
  {
    name: STORES.QUIZ_RESULTS,
    options: { keyPath: 'id' },
    indexes: [
      { name: 'userId', keyPath: 'userId', options: { unique: false } },
      { name: 'courseId', keyPath: 'courseId', options: { unique: false } },
      { name: 'takenAt', keyPath: 'takenAt', options: { unique: false } }
    ]
  },
  {
    name: STORES.FAVORITES,
    options: { keyPath: 'id' }, // `${userId}::${entityType}::${entityId}`
    indexes: [
      { name: 'userId', keyPath: 'userId', options: { unique: false } },
      { name: 'entityType', keyPath: 'entityType', options: { unique: false } }
    ]
  },
  {
    name: STORES.BOOKMARKS,
    options: { keyPath: 'id' }, // `${userId}::${lessonId}`
    indexes: [
      { name: 'userId', keyPath: 'userId', options: { unique: false } },
      { name: 'savedAt', keyPath: 'savedAt', options: { unique: false } }
    ]
  },
  {
    name: STORES.ACHIEVEMENTS,
    options: { keyPath: 'id' }, // `${userId}::${badgeId}`
    indexes: [
      { name: 'userId', keyPath: 'userId', options: { unique: false } },
      { name: 'unlockedAt', keyPath: 'unlockedAt', options: { unique: false } }
    ]
  },
  {
    name: STORES.ACTIVITY,
    options: { keyPath: 'id' },
    indexes: [
      { name: 'userId', keyPath: 'userId', options: { unique: false } },
      { name: 'timestamp', keyPath: 'timestamp', options: { unique: false } }
    ]
  },
  {
    name: STORES.NOTIFICATIONS,
    options: { keyPath: 'id' },
    indexes: [
      { name: 'userId', keyPath: 'userId', options: { unique: false } },
      { name: 'read', keyPath: 'read', options: { unique: false } },
      { name: 'createdAt', keyPath: 'createdAt', options: { unique: false } }
    ]
  },
  {
    name: STORES.RECENTLY_VIEWED,
    options: { keyPath: 'id' }, // `${userId}::${entityType}::${entityId}`
    indexes: [
      { name: 'userId', keyPath: 'userId', options: { unique: false } },
      { name: 'viewedAt', keyPath: 'viewedAt', options: { unique: false } }
    ]
  }
];
