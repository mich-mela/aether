/**
 * AETHER Learning Progress, Quizzes, Achievements, Activity & Notifications DB
 */

import { STORES } from './schema.js';
import { putRecord, getRecord, getRecordsByIndex, deleteRecord } from './db.js';
import { generateId } from './crypto.js';
import { COURSES, LEARNING_PATHS, ACHIEVEMENT_DEFS } from './data-courses.js';
import { LESSONS } from './data-lessons.js';

export async function enrollInCourse(userId, courseId) {
  const id = `${userId}::${courseId}`;
  const existing = await getRecord(STORES.LEARNING_PROGRESS, id);
  const now = new Date().toISOString();
  if (existing) return existing;

  const courseLessons = LESSONS.filter((l) => l.courseId === courseId);
  const record = {
    id,
    userId,
    courseId,
    enrolledAt: now,
    updatedAt: now,
    completedLessonIds: [],
    currentLessonId: courseLessons[0]?.id || null,
    completionPercent: 0
  };
  await putRecord(STORES.LEARNING_PROGRESS, record);
  await logActivity(userId, 'course_enrolled', `Enrolled in course: ${COURSES.find((c) => c.id === courseId)?.title || courseId}`, { courseId });
  return record;
}

export async function markLessonComplete(userId, courseId, lessonId) {
  const now = new Date().toISOString();
  await putRecord(STORES.LESSONS, {
    id: `${userId}::${lessonId}`,
    userId,
    courseId,
    lessonId,
    completed: true,
    completedAt: now
  });

  const progress = await enrollInCourse(userId, courseId);
  if (!progress.completedLessonIds.includes(lessonId)) {
    progress.completedLessonIds.push(lessonId);
  }
  const courseLessons = LESSONS.filter((l) => l.courseId === courseId);
  const nextLesson = courseLessons.find((l) => !progress.completedLessonIds.includes(l.id));
  progress.currentLessonId = nextLesson ? nextLesson.id : lessonId;
  progress.completionPercent = courseLessons.length
    ? Math.round((progress.completedLessonIds.length / courseLessons.length) * 100)
    : 100;
  progress.updatedAt = now;

  await putRecord(STORES.LEARNING_PROGRESS, progress);

  const lessonObj = LESSONS.find((l) => l.id === lessonId);
  await logActivity(userId, 'lesson_completed', `Completed lesson: ${lessonObj?.title || lessonId}`, { courseId, lessonId });
  await createNotification(userId, 'learning', 'Lesson Completed', `You completed "${lessonObj?.title || lessonId}".`);

  if (progress.completionPercent === 100) {
    const courseObj = COURSES.find((c) => c.id === courseId);
    await createNotification(userId, 'course', 'Course Completed', `You finished all lessons in "${courseObj?.title || courseId}".`);
  }

  const newlyUnlocked = await evaluateAchievements(userId);
  return { progress, newlyUnlocked };
}

export async function setLastLessonPosition(userId, courseId, lessonId) {
  const progress = await enrollInCourse(userId, courseId);
  progress.currentLessonId = lessonId;
  progress.updatedAt = new Date().toISOString();
  await putRecord(STORES.LEARNING_PROGRESS, progress);
  return progress;
}

export async function saveQuizResult(userId, { courseId, score, total, percentage, answers }) {
  const now = new Date().toISOString();
  const record = {
    id: generateId('qz'),
    userId,
    courseId,
    score,
    total,
    percentage,
    answers,
    takenAt: now
  };
  await putRecord(STORES.QUIZ_RESULTS, record);

  const courseObj = COURSES.find((c) => c.id === courseId);
  await logActivity(userId, 'quiz_completed', `Scored ${score}/${total} (${percentage}%) on ${courseObj?.title || courseId} quiz`, { courseId, percentage });
  await createNotification(userId, 'quiz', 'Quiz Completed', `You scored ${percentage}% on the ${courseObj?.title || courseId} quiz.`);

  const newlyUnlocked = await evaluateAchievements(userId);
  return { record, newlyUnlocked };
}

export async function getUserProgressSummary(userId) {
  const [progressList, completedLessons, quizResults, achievements] = await Promise.all([
    getRecordsByIndex(STORES.LEARNING_PROGRESS, 'userId', userId),
    getRecordsByIndex(STORES.LESSONS, 'userId', userId),
    getRecordsByIndex(STORES.QUIZ_RESULTS, 'userId', userId),
    getRecordsByIndex(STORES.ACHIEVEMENTS, 'userId', userId)
  ]);

  const completedLessonIds = new Set(completedLessons.filter((l) => l.completed).map((l) => l.lessonId));

  const pathProgress = LEARNING_PATHS.map((path) => {
    const pathLessons = LESSONS.filter((l) => path.courseIds.includes(l.courseId));
    const done = pathLessons.filter((l) => completedLessonIds.has(l.id)).length;
    const percent = pathLessons.length ? Math.round((done / pathLessons.length) * 100) : 0;
    return {
      pathId: path.id,
      completedLessons: done,
      totalLessons: pathLessons.length,
      percent,
      completed: pathLessons.length > 0 && done === pathLessons.length
    };
  });

  return {
    progressList: progressList.sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || '')),
    completedLessonIds,
    completedLessonsCount: completedLessonIds.size,
    totalLessonsCount: LESSONS.length,
    quizResults: quizResults.sort((a, b) => (b.takenAt || '').localeCompare(a.takenAt || '')),
    achievements: achievements.sort((a, b) => (b.unlockedAt || '').localeCompare(a.unlockedAt || '')),
    pathProgress
  };
}

export async function evaluateAchievements(userId) {
  const summary = await getUserProgressSummary(userId);
  const existingIds = new Set(summary.achievements.map((a) => a.badgeId));
  const newlyUnlocked = [];

  const solarLessons = LESSONS.filter((l) => ['solar-system', 'the-sun', 'planetary-science'].includes(l.courseId));
  const solarDone = solarLessons.every((l) => summary.completedLessonIds.has(l.id));

  const deepSpaceLessons = LESSONS.filter((l) => ['galaxies', 'nebulae', 'black-holes', 'exoplanets'].includes(l.courseId));
  const deepDone = deepSpaceLessons.filter((l) => summary.completedLessonIds.has(l.id)).length >= 3;

  const anyPathDone = summary.pathProgress.some((p) => p.completed);
  const highScoreQuiz = summary.quizResults.some((q) => q.percentage >= 80);

  const checks = {
    'first-lesson': summary.completedLessonsCount >= 1,
    'five-lessons': summary.completedLessonsCount >= 5,
    'solar-system-explorer': solarDone,
    'deep-space-explorer': deepDone,
    'first-path-completed': anyPathDone,
    'astronomy-enthusiast': summary.completedLessonsCount >= 10 && highScoreQuiz
  };

  const now = new Date().toISOString();
  for (const def of ACHIEVEMENT_DEFS) {
    if (checks[def.id] && !existingIds.has(def.id)) {
      const badge = {
        id: `${userId}::${def.id}`,
        userId,
        badgeId: def.id,
        title: def.title,
        description: def.description,
        icon: def.icon,
        unlockedAt: now
      };
      await putRecord(STORES.ACHIEVEMENTS, badge);
      await createNotification(userId, 'achievement', `Achievement Unlocked: ${def.title}`, def.description);
      newlyUnlocked.push(badge);
    }
  }
  return newlyUnlocked;
}

export async function logActivity(userId, type, description, meta = {}) {
  if (!userId) return;
  await putRecord(STORES.ACTIVITY, {
    id: generateId('act'),
    userId,
    type,
    description,
    meta,
    timestamp: new Date().toISOString()
  });
}

export async function getUserActivity(userId, limit = 30) {
  const list = await getRecordsByIndex(STORES.ACTIVITY, 'userId', userId);
  return list.sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || '')).slice(0, limit);
}

export async function recordRecentlyViewed(userId, { entityType, entityId, title, route }) {
  if (!userId) return;
  await putRecord(STORES.RECENTLY_VIEWED, {
    id: `${userId}::${entityType}::${entityId}`,
    userId,
    entityType,
    entityId,
    title,
    route,
    viewedAt: new Date().toISOString()
  });
}

export async function getRecentlyViewed(userId, limit = 12) {
  if (!userId) return [];
  const list = await getRecordsByIndex(STORES.RECENTLY_VIEWED, 'userId', userId);
  return list.sort((a, b) => (b.viewedAt || '').localeCompare(a.viewedAt || '')).slice(0, limit);
}

export async function createNotification(userId, category, title, message) {
  if (!userId) return;
  await putRecord(STORES.NOTIFICATIONS, {
    id: generateId('ntf'),
    userId,
    category,
    title,
    message,
    read: false,
    createdAt: new Date().toISOString()
  });
}

export async function getUserNotifications(userId) {
  if (!userId) return [];
  const list = await getRecordsByIndex(STORES.NOTIFICATIONS, 'userId', userId);
  return list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
}

export async function markNotificationRead(id) {
  const rec = await getRecord(STORES.NOTIFICATIONS, id);
  if (!rec) return;
  rec.read = true;
  await putRecord(STORES.NOTIFICATIONS, rec);
}

export async function markAllNotificationsRead(userId) {
  const list = await getRecordsByIndex(STORES.NOTIFICATIONS, 'userId', userId);
  for (const item of list) {
    if (!item.read) {
      item.read = true;
      await putRecord(STORES.NOTIFICATIONS, item);
    }
  }
}

export async function clearUserNotifications(userId) {
  const list = await getRecordsByIndex(STORES.NOTIFICATIONS, 'userId', userId);
  for (const item of list) {
    await deleteRecord(STORES.NOTIFICATIONS, item.id);
  }
}
