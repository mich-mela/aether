/**
 * AETHER Notifications Center
 * Tracks genuine learning events, lesson/course completions, achievement unlocks, and local app events.
 */

import {
  clearUserNotifications,
  getUserNotifications,
  markAllNotificationsRead,
  markNotificationRead
} from './progress-db.js';
import { escapeHtml, formatRelativeTime, refreshIcons } from './helpers.js';
import { renderEmptyState, showToast } from './components.js';

export async function renderNotificationsView(container, state, { onRefreshNav }) {
  if (!state.user) {
    container.innerHTML = renderEmptyState({
      icon: 'bell',
      title: 'Sign In for Notifications',
      description: 'Learning milestones, lesson completions, and achievement unlocks are stored locally for signed-in accounts.',
      actionHtml: '<a href="#signin" class="btn btn-primary">Sign In</a>'
    });
    refreshIcons();
    return;
  }

  const renderInner = async () => {
    const notifications = await getUserNotifications(state.user.id);
    const unread = notifications.filter((n) => !n.read).length;

    container.innerHTML = `
      <div class="fade-in">
        <div class="page-header">
          <div>
            <div class="page-eyebrow">Local Activity Alerts</div>
            <h1>Notifications (${unread} Unread)</h1>
            <p class="page-subtitle">Real alerts generated from your AETHER learning progress, quizzes, achievements, and account activity.</p>
          </div>
          ${notifications.length ? `
            <div class="flex gap-2 flex-wrap">
              <button type="button" class="btn btn-secondary btn-sm" id="mark-all-read-btn">Mark All Read</button>
              <button type="button" class="btn btn-danger btn-sm" id="clear-notifs-btn">Clear All</button>
            </div>
          ` : ''}
        </div>

        ${notifications.length ? `
          <div class="flex" style="flex-direction:column;gap:var(--space-3);">
            ${notifications.map((n) => `
              <article class="card" style="${n.read ? 'opacity:0.76;' : 'border-color:var(--accent-cyan-border);'}">
                <div class="flex justify-between items-center gap-3 flex-wrap">
                  <div>
                    <div class="flex items-center gap-2 mb-1">
                      ${!n.read ? '<span class="badge badge-cyan">Unread</span>' : '<span class="badge badge-neutral">Read</span>'}
                      <strong class="text-sm">${escapeHtml(n.title)}</strong>
                    </div>
                    <p class="text-sm text-secondary" style="margin:0;">${escapeHtml(n.message)}</p>
                    <p class="text-xs text-muted mt-1" style="margin:0;">${formatRelativeTime(n.createdAt)}</p>
                  </div>
                  ${!n.read ? `<button type="button" class="btn btn-secondary btn-sm" data-read-id="${escapeHtml(n.id)}">Mark Read</button>` : ''}
                </div>
              </article>
            `).join('')}
          </div>
        ` : renderEmptyState({
          icon: 'bell-off',
          title: 'All Caught Up',
          description: 'Complete a lesson or quiz in Space Academy to receive milestone and achievement notifications.'
        })}
      </div>
    `;

    refreshIcons();

    container.querySelector('#mark-all-read-btn')?.addEventListener('click', async () => {
      await markAllNotificationsRead(state.user.id);
      showToast('All notifications marked as read.', 'success');
      if (onRefreshNav) onRefreshNav();
      renderInner();
    });

    container.querySelector('#clear-notifs-btn')?.addEventListener('click', async () => {
      await clearUserNotifications(state.user.id);
      showToast('Notifications cleared.', 'info');
      if (onRefreshNav) onRefreshNav();
      renderInner();
    });

    container.querySelectorAll('[data-read-id]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        await markNotificationRead(btn.dataset.readId);
        if (onRefreshNav) onRefreshNav();
        renderInner();
      });
    });
  };

  renderInner();
}
