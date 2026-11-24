/**
 * AETHER Favorites, Bookmarks, Recently Viewed & Recent Activity
 */

import { getUserBookmarks, getUserFavorites, toggleBookmark, toggleFavorite } from './favorites-db.js';
import { getRecentlyViewed, getUserActivity } from './progress-db.js';
import { escapeHtml, formatRelativeTime, refreshIcons } from './helpers.js';
import { renderEmptyState, showToast } from './components.js';

export async function renderFavoritesView(container, state) {
  if (!state.user) {
    container.innerHTML = renderEmptyState({
      icon: 'bookmark',
      title: 'Sign In to View Saved Items',
      description: 'Your favorite planets, missions, images, bookmarked lessons, and exploration history are stored privately per local account in IndexedDB.',
      actionHtml: '<a href="#signin" class="btn btn-primary">Sign In / Create Account</a>'
    });
    refreshIcons();
    return;
  }

  let activeTab = 'favorites';

  const renderInner = async () => {
    const [favorites, bookmarks, recent, activity] = await Promise.all([
      getUserFavorites(state.user.id),
      getUserBookmarks(state.user.id),
      getRecentlyViewed(state.user.id, 18),
      getUserActivity(state.user.id, 30)
    ]);

    let bodyHtml = '';
    if (activeTab === 'favorites') {
      bodyHtml = favorites.length ? `
        <div class="grid-3">
          ${favorites.map((f) => `
            <article class="card">
              <div class="flex justify-between items-center mb-2">
                <span class="badge badge-cyan">${escapeHtml(f.entityType)}</span>
                <button type="button" class="btn btn-ghost btn-sm" data-rm-fav="${escapeHtml(f.entityType)}::${escapeHtml(f.entityId)}" aria-label="Remove favorite">Remove</button>
              </div>
              <h3 style="font-size:1rem;margin-bottom:4px;">${escapeHtml(f.title)}</h3>
              <p class="text-xs text-muted mb-3">${escapeHtml(f.subtitle)}</p>
              <a href="${escapeHtml(f.route || '#dashboard')}" class="btn btn-secondary btn-sm w-full">Open</a>
            </article>
          `).join('')}
        </div>
      ` : renderEmptyState({
        icon: 'heart',
        title: 'No Favorites Yet',
        description: 'Save planets, missions, deep-space objects, or gallery images to build your personal collection.'
      });
    } else if (activeTab === 'bookmarks') {
      bodyHtml = bookmarks.length ? `
        <div class="grid-2">
          ${bookmarks.map((b) => `
            <article class="card flex justify-between items-center gap-3">
              <div>
                <h3 style="font-size:1rem;margin-bottom:4px;">${escapeHtml(b.title)}</h3>
                <p class="text-xs text-muted" style="margin:0;">Saved ${formatRelativeTime(b.savedAt)}</p>
              </div>
              <div class="flex gap-2">
                <a href="#lesson/${escapeHtml(b.lessonId)}" class="btn btn-primary btn-sm">Study</a>
                <button type="button" class="btn btn-ghost btn-sm" data-rm-bm="${escapeHtml(b.lessonId)}">Remove</button>
              </div>
            </article>
          `).join('')}
        </div>
      ` : renderEmptyState({
        icon: 'bookmark',
        title: 'No Bookmarked Lessons',
        description: 'Use "Save for Later" inside any Space Academy lesson to bookmark it here.'
      });
    } else if (activeTab === 'recent') {
      bodyHtml = recent.length ? `
        <div class="grid-3">
          ${recent.map((r) => `
            <a href="${escapeHtml(r.route)}" class="card card-interactive" style="text-decoration:none;">
              <span class="badge badge-neutral mb-2">${escapeHtml(r.entityType)}</span>
              <h3 style="font-size:1rem;margin-bottom:4px;">${escapeHtml(r.title)}</h3>
              <p class="text-xs text-muted" style="margin:0;">Viewed ${formatRelativeTime(r.viewedAt)}</p>
            </a>
          `).join('')}
        </div>
      ` : renderEmptyState({ icon: 'clock', title: 'No Recently Viewed Items', description: 'Explore planets, missions, or lessons to populate your history.' });
    } else {
      bodyHtml = activity.length ? `
        <div class="card">
          ${activity.map((a) => `
            <div class="switch-row">
              <div>
                <div class="text-sm" style="color:var(--text-primary);">${escapeHtml(a.description)}</div>
                <div class="text-xs text-muted">${formatRelativeTime(a.timestamp)}</div>
              </div>
              <span class="badge badge-neutral">${escapeHtml(a.type.replace(/_/g, ' '))}</span>
            </div>
          `).join('')}
        </div>
      ` : renderEmptyState({ icon: 'activity', title: 'No Recorded Activity Yet', description: 'Completing lessons, taking quizzes, and saving favorites will appear here.' });
    }

    container.innerHTML = `
      <div class="fade-in">
        <div class="page-header">
          <div>
            <div class="page-eyebrow">Personal Local Archive</div>
            <h1>Favorites &amp; Activity</h1>
            <p class="page-subtitle">Manage your saved planets, missions, images, bookmarked lessons, and exploration log stored in IndexedDB.</p>
          </div>
        </div>

        <div class="pill-tabs">
          <button type="button" class="pill-tab ${activeTab === 'favorites' ? 'active' : ''}" data-fav-tab="favorites">Favorites (${favorites.length})</button>
          <button type="button" class="pill-tab ${activeTab === 'bookmarks' ? 'active' : ''}" data-fav-tab="bookmarks">Bookmarks (${bookmarks.length})</button>
          <button type="button" class="pill-tab ${activeTab === 'recent' ? 'active' : ''}" data-fav-tab="recent">Recently Viewed (${recent.length})</button>
          <button type="button" class="pill-tab ${activeTab === 'activity' ? 'active' : ''}" data-fav-tab="activity">Recent Activity (${activity.length})</button>
        </div>

        ${bodyHtml}
      </div>
    `;

    refreshIcons();

    container.querySelectorAll('[data-fav-tab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeTab = btn.dataset.favTab;
        renderInner();
      });
    });

    container.querySelectorAll('[data-rm-fav]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const [entityType, entityId] = btn.dataset.rmFav.split('::');
        await toggleFavorite(state.user.id, { entityType, entityId, title: '' });
        showToast('Removed from Favorites.', 'info');
        renderInner();
      });
    });

    container.querySelectorAll('[data-rm-bm]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        await toggleBookmark(state.user.id, { lessonId: btn.dataset.rmBm, courseId: '', title: '' });
        showToast('Bookmark removed.', 'info');
        renderInner();
      });
    });
  };

  renderInner();
}
