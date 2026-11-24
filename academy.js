/**
 * AETHER Space Academy — Complete Astronomy Curriculum & Progress Hub
 */

import { COURSES, ACHIEVEMENT_DEFS } from './data-courses.js';
import { LESSONS, QUIZZES } from './data-lessons.js';
import { getUserProgressSummary } from './progress-db.js';
import { escapeHtml, refreshIcons } from './helpers.js';

export async function renderAcademyView(container, state) {
  let difficultyFilter = 'All';
  const summary = state.user ? await getUserProgressSummary(state.user.id) : null;
  const completedSet = summary ? summary.completedLessonIds : new Set();

  const renderInner = () => {
    const filtered = COURSES.filter((c) => difficultyFilter === 'All' || c.difficulty === difficultyFilter);

    container.innerHTML = `
      <div class="fade-in">
        <div class="page-header">
          <div>
            <div class="page-eyebrow">Astronomy Learning Management System</div>
            <h1>Space Academy</h1>
            <p class="page-subtitle">16 structured astronomy and spaceflight courses with interactive lessons, knowledge checks, quizzes, and IndexedDB progress tracking.</p>
          </div>
          <div class="flex gap-2 flex-wrap">
            <a href="#learning-paths" class="btn btn-primary btn-sm">Learning Paths &amp; Certificates</a>
            <a href="#quiz/intro-astronomy" class="btn btn-secondary btn-sm">Take a Quiz</a>
          </div>
        </div>

        <div class="grid-3 mb-6">
          <div class="stat-card">
            <span class="stat-label">Curriculum</span>
            <div class="stat-value">${COURSES.length} Courses</div>
            <div class="stat-meta">${LESSONS.length} structured lessons</div>
          </div>
          <div class="stat-card">
            <span class="stat-label">Your Progress</span>
            <div class="stat-value">${completedSet.size} / ${LESSONS.length}</div>
            <div class="stat-meta">${state.user ? 'Persisted locally in IndexedDB' : 'Sign in to save progress'}</div>
          </div>
          <div class="stat-card">
            <span class="stat-label">Achievements Earned</span>
            <div class="stat-value">${summary ? summary.achievements.length : 0} / ${ACHIEVEMENT_DEFS.length}</div>
            <div class="stat-meta">Unlocked by completing lessons &amp; quizzes</div>
          </div>
        </div>

        <div class="pill-tabs">
          ${['All', 'Beginner', 'Intermediate', 'Advanced'].map((d) => `
            <button type="button" class="pill-tab ${difficultyFilter === d ? 'active' : ''}" data-diff="${d}">${d}</button>
          `).join('')}
        </div>

        <div class="grid-auto mb-8">
          ${filtered.map((course) => {
            const cLessons = LESSONS.filter((l) => l.courseId === course.id);
            const doneCount = cLessons.filter((l) => completedSet.has(l.id)).length;
            const pct = cLessons.length ? Math.round((doneCount / cLessons.length) * 100) : 0;
            const firstLesson = cLessons[0];
            const hasQuiz = Boolean(QUIZZES[course.id]);
            return `
              <article class="card card-interactive">
                <div class="flex justify-between items-center mb-2">
                  <span class="badge badge-cyan">${escapeHtml(course.difficulty)}</span>
                  <span class="text-xs mono text-muted">${escapeHtml(course.duration)}</span>
                </div>
                <h2 class="card-title mb-2">${escapeHtml(course.title)}</h2>
                <p class="text-sm text-muted mb-4">${escapeHtml(course.summary)}</p>
                <div class="progress-track mb-2"><div class="progress-fill" style="width:${pct}%;"></div></div>
                <div class="text-xs text-muted mb-4">${doneCount}/${cLessons.length} lessons completed (${pct}%)</div>
                <div class="flex gap-2 flex-wrap">
                  ${firstLesson ? `<a href="#lesson/${firstLesson.id}" class="btn btn-primary btn-sm" style="flex:1;">${doneCount > 0 ? 'Continue' : 'Start Course'}</a>` : ''}
                  ${hasQuiz ? `<a href="#quiz/${course.id}" class="btn btn-secondary btn-sm">Quiz</a>` : ''}
                </div>
              </article>
            `;
          }).join('')}
        </div>

        <section class="card">
          <h2 class="card-title mb-4">Space Academy Achievements</h2>
          <div class="grid-3">
            ${ACHIEVEMENT_DEFS.map((a) => {
              const unlocked = summary?.achievements.find((u) => u.badgeId === a.id);
              return `
                <div class="card" style="background:var(--bg-secondary);opacity:${unlocked ? '1' : '0.6'};">
                  <div class="flex items-center gap-3 mb-2">
                    <i data-lucide="${a.icon}" style="width:20px;height:20px;color:${unlocked ? 'var(--accent-cyan)' : 'var(--text-muted)'};"></i>
                    <strong class="text-sm">${escapeHtml(a.title)}</strong>
                  </div>
                  <p class="text-xs text-muted mb-2">${escapeHtml(a.description)}</p>
                  <span class="badge ${unlocked ? 'badge-live' : 'badge-neutral'}">${unlocked ? 'Unlocked' : 'Locked'}</span>
                </div>
              `;
            }).join('')}
          </div>
        </section>
      </div>
    `;

    refreshIcons();

    container.querySelectorAll('[data-diff]').forEach((btn) => {
      btn.addEventListener('click', () => {
        difficultyFilter = btn.dataset.diff;
        renderInner();
      });
    });
  };

  renderInner();
}
