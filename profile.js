/**
 * AETHER User Profile — Local Explorer Dossier, Learning Stats, Favorites & Profile Editing
 */

import { LEARNING_PATHS } from './data-courses.js';
import { getUserActivity, getUserProgressSummary } from './progress-db.js';
import { getUserFavorites } from './favorites-db.js';
import { logoutAccount, updateUserProfile } from './users-db.js';
import { escapeHtml, formatRelativeTime, formatShortDate, getInitials, refreshIcons } from './helpers.js';
import { renderEmptyState, showToast } from './components.js';
import { validateFullName } from './validation.js';

export async function renderProfileView(container, state, { onUserUpdated, onLogout }) {
  if (!state.user) {
    container.innerHTML = renderEmptyState({
      icon: 'user',
      title: 'Local Explorer Profile',
      description: 'Sign in or create a local account to track your astronomy level, completed lessons, achievements, and favorite discoveries.',
      actionHtml: '<div class="flex gap-3" style="justify-content:center;"><a href="#signin" class="btn btn-primary">Sign In</a><a href="#signup" class="btn btn-secondary">Create Account</a></div>'
    });
    refreshIcons();
    return;
  }

  const [summary, favorites, activity] = await Promise.all([
    getUserProgressSummary(state.user.id),
    getUserFavorites(state.user.id),
    getUserActivity(state.user.id, 10)
  ]);

  const currentPath = LEARNING_PATHS.find((p) => p.id === (state.user.profile?.currentPathId || 'astronomy-beginner')) || LEARNING_PATHS[0];
  const favPlanets = favorites.filter((f) => f.entityType === 'planet');
  const favMissions = favorites.filter((f) => f.entityType === 'mission');

  container.innerHTML = `
    <div class="fade-in">
      <div class="page-header">
        <div>
          <div class="page-eyebrow">Local Explorer Dossier</div>
          <h1>User Profile</h1>
        </div>
        <div class="flex gap-2 flex-wrap">
          <a href="#settings" class="btn btn-secondary btn-sm">Account Settings</a>
          <button type="button" class="btn btn-danger btn-sm" id="profile-logout-btn">Sign Out</button>
        </div>
      </div>

      <section class="card mb-6">
        <div class="flex items-center gap-4 flex-wrap">
          <div class="avatar avatar-lg">${escapeHtml(getInitials(state.user.fullName))}</div>
          <div style="flex:1;min-width:220px;">
            <h2 style="margin-bottom:2px;">${escapeHtml(state.user.fullName)}</h2>
            <p class="text-sm mono text-cyan mb-2">${escapeHtml(state.user.email)}</p>
            <div class="flex flex-wrap gap-2">
              <span class="badge badge-cyan">Level: ${escapeHtml(state.user.profile?.level || 'Beginner')}</span>
              <span class="badge badge-neutral">Joined ${formatShortDate(state.user.createdAt)}</span>
              <span class="badge badge-neutral">Path: ${escapeHtml(currentPath.title)}</span>
            </div>
          </div>
        </div>
      </section>

      <div class="grid-4 mb-6">
        <div class="stat-card"><span class="stat-label">Completed Lessons</span><div class="stat-value">${summary.completedLessonsCount}</div></div>
        <div class="stat-card"><span class="stat-label">Quizzes Taken</span><div class="stat-value">${summary.quizResults.length}</div></div>
        <div class="stat-card"><span class="stat-label">Achievements</span><div class="stat-value">${summary.achievements.length}</div></div>
        <div class="stat-card"><span class="stat-label">Saved Items</span><div class="stat-value">${favorites.length}</div></div>
      </div>

      <div class="grid-2 mb-6">
        <section class="card">
          <h3 class="mb-4">Edit Profile &amp; Learning Preferences</h3>
          <form id="profile-edit-form">
            <div class="form-group">
              <label class="form-label" for="prof-name">Full Name</label>
              <input type="text" id="prof-name" class="form-control" value="${escapeHtml(state.user.fullName)}" required />
            </div>
            <div class="form-group">
              <label class="form-label" for="prof-level">Astronomy Learning Level</label>
              <select id="prof-level" class="form-select">
                ${['Beginner', 'Intermediate', 'Advanced'].map((l) => `<option value="${l}" ${state.user.profile?.level === l ? 'selected' : ''}>${l}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" for="prof-path">Current Learning Path</label>
              <select id="prof-path" class="form-select">
                ${LEARNING_PATHS.map((p) => `<option value="${p.id}" ${currentPath.id === p.id ? 'selected' : ''}>${escapeHtml(p.title)}</option>`).join('')}
              </select>
            </div>
            <button type="submit" class="btn btn-primary btn-sm">Save Profile Changes</button>
          </form>
        </section>

        <section class="card">
          <h3 class="mb-3">Unlocked Achievements (${summary.achievements.length})</h3>
          ${summary.achievements.length ? `
            <div class="flex flex-wrap gap-2 mb-5">
              ${summary.achievements.map((a) => `<span class="badge badge-live">${escapeHtml(a.title)}</span>`).join('')}
            </div>
          ` : '<p class="text-sm text-muted mb-5">Complete lessons and quizzes in Space Academy to earn badges.</p>'}

          <h3 class="mb-2">Favorite Planets (${favPlanets.length}) &amp; Missions (${favMissions.length})</h3>
          <div class="flex flex-wrap gap-2">
            ${[...favPlanets, ...favMissions].map((f) => `<a href="${escapeHtml(f.route)}" class="badge badge-cyan" style="text-decoration:none;">${escapeHtml(f.title)}</a>`).join('') || '<span class="text-sm text-muted">No favorite planets or missions saved yet.</span>'}
          </div>
        </section>
      </div>

      <section class="card">
        <h3 class="mb-3">Recent Activity</h3>
        ${activity.length ? activity.map((a) => `
          <div class="switch-row">
            <span class="text-sm text-secondary">${escapeHtml(a.description)}</span>
            <span class="text-xs text-muted">${formatRelativeTime(a.timestamp)}</span>
          </div>
        `).join('') : '<p class="text-sm text-muted">No activity logged yet.</p>'}
      </section>
    </div>
  `;

  refreshIcons();

  container.querySelector('#profile-logout-btn').addEventListener('click', () => {
    logoutAccount();
    showToast('Signed out of local session.', 'info');
    onLogout();
  });

  container.querySelector('#profile-edit-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nameVal = container.querySelector('#prof-name').value;
    const check = validateFullName(nameVal);
    if (!check.valid) {
      showToast(check.message, 'error');
      return;
    }
    const updated = await updateUserProfile(state.user.id, {
      fullName: check.value,
      level: container.querySelector('#prof-level').value,
      currentPathId: container.querySelector('#prof-path').value
    });
    showToast('Profile saved to IndexedDB.', 'success');
    onUserUpdated(updated);
    renderProfileView(container, { ...state, user: updated }, { onUserUpdated, onLogout });
  });
}
