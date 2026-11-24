/**
 * AETHER Lesson Reader — Educational Content, Knowledge Check, Bookmark & IndexedDB Completion
 */

import { COURSES } from './data-courses.js';
import { LESSONS, QUIZZES } from './data-lessons.js';
import {
  getUserProgressSummary,
  markLessonComplete,
  recordRecentlyViewed,
  setLastLessonPosition
} from './progress-db.js';
import { isBookmarked, toggleBookmark } from './favorites-db.js';
import { escapeHtml, refreshIcons } from './helpers.js';
import { showToast } from './components.js';

export async function renderLessonView(container, state, lessonId) {
  const idx = Math.max(0, LESSONS.findIndex((l) => l.id === lessonId));
  const lesson = LESSONS[idx] || LESSONS[0];
  const course = COURSES.find((c) => c.id === lesson.courseId);
  const prevLesson = idx > 0 ? LESSONS[idx - 1] : null;
  const nextLesson = idx < LESSONS.length - 1 ? LESSONS[idx + 1] : null;
  const related = LESSONS.filter((l) => l.id !== lesson.id).slice(0, 3);

  if (state.user) {
    await setLastLessonPosition(state.user.id, lesson.courseId, lesson.id);
    await recordRecentlyViewed(state.user.id, {
      entityType: 'Lesson',
      entityId: lesson.id,
      title: lesson.title,
      route: `#lesson/${lesson.id}`
    });
  }

  let summary = state.user ? await getUserProgressSummary(state.user.id) : null;
  let isCompleted = summary ? summary.completedLessonIds.has(lesson.id) : false;
  let bookmarked = state.user ? await isBookmarked(state.user.id, lesson.id) : false;
  let kcSelected = null;

  const renderInner = () => {
    container.innerHTML = `
      <div class="fade-in">
        <div class="mb-4 flex justify-between items-center flex-wrap gap-2">
          <a href="#academy" class="btn btn-secondary btn-sm">← Back to Space Academy</a>
          <div class="flex gap-2 flex-wrap">
            <button type="button" class="btn ${bookmarked ? 'btn-primary' : 'btn-secondary'} btn-sm" id="lesson-bookmark-btn">
              <i data-lucide="bookmark" style="width:15px;height:15px;"></i>
              ${bookmarked ? 'Saved for Later' : 'Save for Later'}
            </button>
            <button type="button" class="btn ${isCompleted ? 'btn-secondary' : 'btn-primary'} btn-sm" id="lesson-complete-btn">
              <i data-lucide="check-circle-2" style="width:15px;height:15px;"></i>
              ${isCompleted ? 'Completed ✓' : 'Mark as Complete'}
            </button>
          </div>
        </div>

        <div class="lesson-layout">
          <article class="card lesson-prose">
            <div class="flex gap-2 items-center mb-2 flex-wrap">
              <span class="badge badge-cyan">${escapeHtml(course?.title || 'Space Academy')}</span>
              <span class="badge badge-neutral">${escapeHtml(lesson.duration)}</span>
              ${isCompleted ? '<span class="badge badge-live">Completed</span>' : ''}
            </div>
            <h1>${escapeHtml(lesson.title)}</h1>
            <p style="font-size:1.05rem;color:var(--text-primary);">${escapeHtml(lesson.intro)}</p>

            <div class="card mt-4 mb-4" style="background:var(--bg-secondary);border-color:var(--accent-cyan-border);">
              <div class="page-eyebrow">Conceptual Diagram</div>
              <p class="mono text-sm text-cyan" style="margin:0;">${escapeHtml(lesson.diagramLabel)}</p>
            </div>

            ${lesson.sections.map((s) => `
              <h2>${escapeHtml(s.heading)}</h2>
              <p>${escapeHtml(s.body)}</p>
            `).join('')}

            <h3>Key Scientific Facts</h3>
            <ul class="text-sm text-secondary" style="padding-left:1.25rem;">
              ${lesson.facts.map((f) => `<li class="mb-2">${escapeHtml(f)}</li>`).join('')}
            </ul>

            <!-- Interactive Knowledge Check -->
            <div class="card mt-6" style="background:var(--bg-secondary);">
              <div class="page-eyebrow">Knowledge Check</div>
              <h3 style="margin-top:0;">${escapeHtml(lesson.knowledgeCheck.question)}</h3>
              <div class="mt-3">
                ${lesson.knowledgeCheck.options.map((opt, i) => {
                  let cls = 'quiz-option';
                  if (kcSelected !== null) {
                    if (i === lesson.knowledgeCheck.answerIndex) cls += ' correct';
                    else if (i === kcSelected) cls += ' incorrect';
                  }
                  return `<button type="button" class="${cls}" data-kc-idx="${i}">${escapeHtml(opt)}</button>`;
                }).join('')}
              </div>
              ${kcSelected !== null ? `
                <div class="alert-banner mt-3">
                  <div>
                    <strong>${kcSelected === lesson.knowledgeCheck.answerIndex ? 'Correct!' : 'Review:'}</strong>
                    ${escapeHtml(lesson.knowledgeCheck.explanation)}
                  </div>
                </div>
              ` : ''}
            </div>

            <div class="mt-6 flex justify-between items-center flex-wrap gap-3" style="border-top:1px solid var(--border-subtle);padding-top:var(--space-4);">
              ${prevLesson ? `<a href="#lesson/${prevLesson.id}" class="btn btn-secondary btn-sm">← Previous: ${escapeHtml(prevLesson.title.slice(0, 26))}</a>` : '<span></span>'}
              ${nextLesson ? `<a href="#lesson/${nextLesson.id}" class="btn btn-primary btn-sm">Next: ${escapeHtml(nextLesson.title.slice(0, 26))} →</a>` : '<a href="#academy" class="btn btn-primary btn-sm">Return to Academy</a>'}
            </div>
          </article>

          <aside class="flex" style="flex-direction:column;gap:var(--space-4);">
            <div class="card">
              <h3 class="mb-3">Course Actions</h3>
              ${QUIZZES[lesson.courseId] ? `<a href="#quiz/${lesson.courseId}" class="btn btn-primary btn-sm w-full mb-2">Take Course Quiz</a>` : ''}
              <a href="#learning-paths" class="btn btn-secondary btn-sm w-full">View Learning Paths</a>
            </div>

            <div class="card">
              <h3 class="mb-3">Scientific References</h3>
              <ul class="footer-links">
                ${lesson.references.map((r) => `<li><a href="${escapeHtml(r.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(r.label)} →</a></li>`).join('')}
              </ul>
            </div>

            <div class="card">
              <h3 class="mb-3">Related Lessons</h3>
              <ul class="footer-links">
                ${related.map((r) => `<li><a href="#lesson/${r.id}">${escapeHtml(r.title)}</a></li>`).join('')}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    `;

    refreshIcons();

    container.querySelectorAll('[data-kc-idx]').forEach((btn) => {
      btn.addEventListener('click', () => {
        kcSelected = Number(btn.dataset.kcIdx);
        renderInner();
      });
    });

    container.querySelector('#lesson-complete-btn').addEventListener('click', async () => {
      if (!state.user) {
        showToast('Sign in to save lesson completion to IndexedDB.', 'warning');
        return;
      }
      const { newlyUnlocked } = await markLessonComplete(state.user.id, lesson.courseId, lesson.id);
      isCompleted = true;
      showToast('Lesson marked as complete and saved locally!', 'success');
      for (const b of newlyUnlocked) {
        showToast(`Achievement Unlocked: ${b.title}!`, 'success', 4800);
      }
      renderInner();
    });

    container.querySelector('#lesson-bookmark-btn').addEventListener('click', async () => {
      if (!state.user) {
        showToast('Sign in to bookmark lessons.', 'warning');
        return;
      }
      const res = await toggleBookmark(state.user.id, {
        lessonId: lesson.id,
        courseId: lesson.courseId,
        title: lesson.title
      });
      bookmarked = res.saved;
      showToast(bookmarked ? 'Lesson saved for later.' : 'Bookmark removed.', 'success');
      renderInner();
    });
  };

  renderInner();
}
