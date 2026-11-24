/**
 * AETHER Space Missions Exploration Center
 */

import { MISSIONS } from './data-missions.js';
import { renderSpaceImage } from './images.js';
import { isFavorite, toggleFavorite } from './favorites-db.js';
import { recordRecentlyViewed } from './progress-db.js';
import { attachImageFallbacks, escapeHtml, refreshIcons } from './helpers.js';
import { renderDataBadge, showToast } from './components.js';

export async function renderMissionsView(container, state, paramId = null) {
  if (paramId) {
    const mission = MISSIONS.find((m) => m.id === paramId);
    if (mission) return renderMissionDetail(container, state, mission);
  }

  let search = '';
  let statusFilter = 'All';
  let agencyFilter = 'All';

  const agencies = ['All', 'NASA', 'ESA', 'JPL'];

  const renderList = () => {
    const filtered = MISSIONS.filter((m) => {
      const matchStatus = statusFilter === 'All' || m.status === statusFilter;
      const matchAgency = agencyFilter === 'All' || m.agency.includes(agencyFilter);
      const q = search.toLowerCase();
      const matchSearch = !q || m.name.toLowerCase().includes(q) || m.destination.toLowerCase().includes(q) || m.type.toLowerCase().includes(q);
      return matchStatus && matchAgency && matchSearch;
    });

    container.innerHTML = `
      <div class="fade-in">
        <div class="page-header">
          <div>
            <div class="page-eyebrow">Flight Operations Archive</div>
            <h1>Space Missions</h1>
            <p class="page-subtitle">Explore verified historical, active, and upcoming missions from NASA, JPL, ESA, and international space agencies.</p>
          </div>
          ${renderDataBadge('Historical', 'Official Agency Records')}
        </div>

        <div class="filter-bar">
          <input type="search" id="mission-search" class="form-control" placeholder="Search missions, destinations..." value="${escapeHtml(search)}" />
          <select id="mission-status" class="form-select" aria-label="Filter by status">
            <option value="All" ${statusFilter === 'All' ? 'selected' : ''}>All Statuses</option>
            <option value="Historical" ${statusFilter === 'Historical' ? 'selected' : ''}>Historical</option>
            <option value="Current" ${statusFilter === 'Current' ? 'selected' : ''}>Current / Active</option>
            <option value="Upcoming" ${statusFilter === 'Upcoming' ? 'selected' : ''}>Upcoming / Program</option>
          </select>
          <select id="mission-agency" class="form-select" aria-label="Filter by agency">
            ${agencies.map((a) => `<option value="${a}" ${agencyFilter === a ? 'selected' : ''}>${a === 'All' ? 'All Agencies' : a}</option>`).join('')}
          </select>
        </div>

        <div class="grid-auto">
          ${filtered.map((m) => `
            <article class="card card-interactive">
              <div class="card-media">
                ${renderSpaceImage({ src: m.imageUrl, alt: m.name, title: m.name, palette: m.palette, variant: 'mission' })}
              </div>
              <div class="flex justify-between items-center gap-2 mb-2">
                <span class="badge ${m.status === 'Current' ? 'badge-live' : m.status === 'Upcoming' ? 'badge-cyan' : 'badge-historical'}">${escapeHtml(m.status)}</span>
                <span class="text-xs mono text-muted">${escapeHtml(m.launchDate)}</span>
              </div>
              <h2 class="card-title mb-1">${escapeHtml(m.name)}</h2>
              <p class="text-xs text-cyan mb-2">${escapeHtml(m.agency)} • ${escapeHtml(m.type)}</p>
              <p class="text-sm text-muted mb-4">Destination: ${escapeHtml(m.destination)}</p>
              <a href="#missions/${m.id}" class="btn btn-primary btn-sm w-full">View Mission Dossier</a>
            </article>
          `).join('')}
        </div>
      </div>
    `;

    attachImageFallbacks(container);
    refreshIcons();

    container.querySelector('#mission-search').addEventListener('input', (e) => {
      search = e.target.value;
      renderList();
      const el = container.querySelector('#mission-search');
      el.focus();
      el.setSelectionRange(el.value.length, el.value.length);
    });
    container.querySelector('#mission-status').addEventListener('change', (e) => {
      statusFilter = e.target.value;
      renderList();
    });
    container.querySelector('#mission-agency').addEventListener('change', (e) => {
      agencyFilter = e.target.value;
      renderList();
    });
  };

  renderList();
}

async function renderMissionDetail(container, state, m) {
  if (state.user) {
    await recordRecentlyViewed(state.user.id, {
      entityType: 'Mission',
      entityId: m.id,
      title: m.name,
      route: `#missions/${m.id}`
    });
  }
  let fav = state.user ? await isFavorite(state.user.id, 'mission', m.id) : false;

  const renderInner = () => {
    container.innerHTML = `
      <div class="fade-in">
        <div class="mb-4 flex justify-between items-center flex-wrap gap-2">
          <a href="#missions" class="btn btn-secondary btn-sm">← Back to Space Missions</a>
          <button type="button" class="btn ${fav ? 'btn-primary' : 'btn-secondary'} btn-sm" id="mission-fav-btn">
            <i data-lucide="heart" style="width:15px;height:15px;"></i>
            ${fav ? 'Saved Mission' : 'Save Mission'}
          </button>
        </div>

        <div class="grid-2 mb-6">
          <div class="card">
            <div class="card-media" style="aspect-ratio:4/3;margin-bottom:0;">
              ${renderSpaceImage({ src: m.imageUrl, alt: m.name, title: m.name, palette: m.palette, variant: 'mission' })}
            </div>
          </div>

          <div class="card">
            <div class="flex gap-2 items-center mb-2 flex-wrap">
              <span class="badge badge-cyan">${escapeHtml(m.status)}</span>
              <span class="badge badge-neutral">${escapeHtml(m.agency)}</span>
            </div>
            <h1>${escapeHtml(m.name)}</h1>
            <p class="text-sm text-cyan mb-4">${escapeHtml(m.type)}</p>
            <div class="spec-grid">
              <div class="spec-tile"><div class="spec-tile-label">Launch Date</div><div class="spec-tile-value">${escapeHtml(m.launchDate)}</div></div>
              <div class="spec-tile"><div class="spec-tile-label">Destination</div><div class="spec-tile-value">${escapeHtml(m.destination)}</div></div>
              <div class="spec-tile" style="grid-column:1/-1;"><div class="spec-tile-label">Spacecraft</div><div class="spec-tile-value">${escapeHtml(m.spacecraft)}</div></div>
            </div>
          </div>
        </div>

        <div class="grid-2">
          <section class="card">
            <h3>Mission Objectives &amp; Key Discoveries</h3>
            <p class="text-xs font-semibold text-cyan mt-3 mb-2" style="text-transform:uppercase;">Objectives</p>
            <ul class="text-sm text-secondary" style="padding-left:1.2rem;">
              ${m.objectives.map((o) => `<li class="mb-2">${escapeHtml(o)}</li>`).join('')}
            </ul>
            <p class="text-xs font-semibold text-cyan mt-4 mb-2" style="text-transform:uppercase;">Key Discoveries</p>
            <ul class="text-sm text-secondary" style="padding-left:1.2rem;">
              ${m.discoveries.map((d) => `<li class="mb-2">${escapeHtml(d)}</li>`).join('')}
            </ul>
          </section>

          <section class="card">
            <h3>Mission Timeline &amp; Official Sources</h3>
            <ul class="text-sm text-secondary mt-3" style="padding-left:1.2rem;">
              ${m.timeline.map((t) => `<li class="mb-2">${escapeHtml(t)}</li>`).join('')}
            </ul>
            <p class="text-xs font-semibold text-cyan mt-4 mb-2" style="text-transform:uppercase;">Official Sources</p>
            <ul class="footer-links">
              ${m.sources.map((s) => `<li><a href="${escapeHtml(s.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(s.label)} →</a></li>`).join('')}
            </ul>
          </section>
        </div>
      </div>
    `;

    attachImageFallbacks(container);
    refreshIcons();

    container.querySelector('#mission-fav-btn').addEventListener('click', async () => {
      if (!state.user) {
        showToast('Sign in to save missions.', 'warning');
        return;
      }
      const res = await toggleFavorite(state.user.id, {
        entityType: 'mission',
        entityId: m.id,
        title: m.name,
        subtitle: `${m.agency} • ${m.status}`,
        route: `#missions/${m.id}`
      });
      fav = res.saved;
      showToast(fav ? `${m.name} saved.` : `${m.name} removed.`, 'success');
      renderInner();
    });
  };

  renderInner();
}
