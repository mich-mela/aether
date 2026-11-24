/**
 * AETHER Learning Paths & Educational Completion Certificates
 */

import { COURSES, LEARNING_PATHS } from './data-courses.js';
import { LESSONS } from './data-lessons.js';
import { getUserProgressSummary } from './progress-db.js';
import { updateUserProfile } from './users-db.js';
import { escapeHtml, formatShortDate, refreshIcons } from './helpers.js';
import { openModal, showToast } from './components.js';

export async function renderLearningPathsView(container, state, { onUserUpdated }) {
  const summary = state.user ? await getUserProgressSummary(state.user.id) : null;
  const activePathId = state.user?.profile?.currentPathId || 'astronomy-beginner';

  container.innerHTML = `
    <div class="fade-in">
      <div class="page-header">
        <div>
          <div class="page-eyebrow">Structured Astronomy Tracks</div>
          <h1>Learning Paths</h1>
          <p class="page-subtitle">Follow curated multi-course tracks from Astronomy Beginner to Advanced Astronomy and earn AETHER educational completion certificates.</p>
        </div>
        <a href="#academy" class="btn btn-secondary btn-sm">All 16 Courses</a>
      </div>

      <div class="grid-2">
        ${LEARNING_PATHS.map((path) => {
          const pProg = summary?.pathProgress.find((x) => x.pathId === path.id) || { completedLessons: 0, totalLessons: path.courseIds.length, percent: 0, completed: false };
          const pathCourses = COURSES.filter((c) => path.courseIds.includes(c.id));
          const firstLesson = LESSONS.find((l) => path.courseIds.includes(l.courseId));
          const isActive = activePathId === path.id;

          return `
            <article class="card" style="${isActive ? 'border-color:var(--accent-cyan);' : ''}">
              <div class="flex justify-between items-center gap-2 mb-2 flex-wrap">
                <span class="badge badge-cyan">${escapeHtml(path.difficulty)}</span>
                <span class="text-xs mono text-muted">${escapeHtml(path.duration)}</span>
              </div>
              <h2 class="card-title mb-2">${escapeHtml(path.title)} ${isActive ? '<span class="badge badge-live" style="margin-left:6px;">Active Path</span>' : ''}</h2>
              <p class="text-sm text-secondary mb-3">${escapeHtml(path.description)}</p>

              <p class="text-xs font-semibold text-muted mb-1" style="text-transform:uppercase;">Learning Objectives</p>
              <ul class="text-xs text-muted mb-3" style="padding-left:1.1rem;">
                ${path.objectives.map((o) => `<li class="mb-1">${escapeHtml(o)}</li>`).join('')}
              </ul>

              <p class="text-xs font-semibold text-muted mb-2" style="text-transform:uppercase;">Modules (${pathCourses.length})</p>
              <div class="flex flex-wrap gap-2 mb-4">
                ${pathCourses.map((c) => {
                  const fl = LESSONS.find((l) => l.courseId === c.id);
                  return `<a href="#lesson/${fl?.id || ''}" class="badge badge-neutral" style="text-decoration:none;">${escapeHtml(c.title)}</a>`;
                }).join('')}
              </div>

              <div class="progress-track mb-2"><div class="progress-fill" style="width:${pProg.percent}%;"></div></div>
              <div class="flex justify-between text-xs text-muted mb-4">
                <span>${pProg.completedLessons}/${pProg.totalLessons} lessons completed</span>
                <span class="mono">${pProg.percent}%</span>
              </div>

              <div class="flex flex-wrap gap-2">
                ${firstLesson ? `<a href="#lesson/${firstLesson.id}" class="btn btn-primary btn-sm">${pProg.percent > 0 ? 'Continue Path' : 'Start Path'}</a>` : ''}
                ${state.user && !isActive ? `<button type="button" class="btn btn-secondary btn-sm" data-set-path="${path.id}">Set as Active</button>` : ''}
                ${pProg.completed ? `<button type="button" class="btn btn-secondary btn-sm" data-cert-path="${path.id}">View Certificate</button>` : ''}
              </div>
            </article>
          `;
        }).join('')}
      </div>
    </div>
  `;

  refreshIcons();

  container.querySelectorAll('[data-set-path]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      if (!state.user) return;
      const updated = await updateUserProfile(state.user.id, { currentPathId: btn.dataset.setPath });
      showToast('Active learning path updated.', 'success');
      onUserUpdated(updated);
      renderLearningPathsView(container, { ...state, user: updated }, { onUserUpdated });
    });
  });

  container.querySelectorAll('[data-cert-path]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const path = LEARNING_PATHS.find((p) => p.id === btn.dataset.certPath);
      if (!path) return;
      openModal({
        title: 'AETHER Educational Completion Certificate',
        size: 'lg',
        contentHtml: `
          <div class="certificate-frame">
            <div class="page-eyebrow">AETHER Space Academy</div>
            <h2 style="font-size:1.75rem;color:#F5F8FC;margin-bottom:var(--space-2);">Certificate of Completion</h2>
            <p class="text-sm" style="color:#C8D3DF;">This educational completion certificate acknowledges that</p>
            <h3 style="font-size:1.6rem;color:#35D6F2;margin:var(--space-3) 0;">${escapeHtml(state.user?.fullName || 'Explorer')}</h3>
            <p class="text-sm" style="color:#C8D3DF;">has completed all required lessons in the learning path:</p>
            <h4 style="font-size:1.2rem;color:#F5F8FC;margin:var(--space-2) 0 var(--space-4);">${escapeHtml(path.title)}</h4>
            <p class="text-xs mono" style="color:#8EA1B7;">Issued locally on ${formatShortDate(new Date().toISOString())}</p>
            <p class="text-xs mt-4" style="color:#8EA1B7;border-top:1px solid rgba(200,211,223,0.18);padding-top:var(--space-3);">
              Notice: This is an AETHER educational completion certificate issued locally in your browser and is not an accredited academic degree or official university qualification.
            </p>
          </div>
        `,
        footerHtml: `<button type="button" class="btn btn-primary" onclick="window.print()">Print / Save as PDF</button>`
      });
    });
  });
}
