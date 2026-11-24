/**
 * AETHER Global Search across Planets, Missions, Satellites, Deep Space, Courses, Lessons, Timeline & Gallery
 */

import { getAllSearchableItems } from './data-service.js';
import { escapeHtml, refreshIcons } from './helpers.js';
import { renderEmptyState } from './components.js';

export function renderSearchView(container, initialQuery = '') {
  const index = getAllSearchableItems();
  let query = initialQuery;
  let typeFilter = 'All';
  const types = ['All', 'Planet', 'Mission', 'Satellite', 'Deep Space', 'Course', 'Lesson', 'Timeline', 'Gallery'];
  const suggestions = ['Mars', 'James Webb', 'Black Hole', 'Orbital', 'Voyager', 'Saturn', 'Exoplanet'];

  const renderInner = () => {
    const q = query.trim().toLowerCase();
    const matches = index.filter((item) => {
      const matchType = typeFilter === 'All' || item.type === typeFilter;
      const matchQ = !q || item.title.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q) || item.keywords.toLowerCase().includes(q);
      return matchType && matchQ;
    });

    container.innerHTML = `
      <div class="fade-in">
        <div class="page-header">
          <div>
            <div class="page-eyebrow">Unified Knowledge Index</div>
            <h1>Global Search</h1>
            <p class="page-subtitle">Search across planets, missions, satellites, deep-space objects, courses, lessons, timeline milestones, and gallery archives.</p>
          </div>
        </div>

        <div class="filter-bar">
          <input type="search" id="global-search-input" class="form-control" placeholder="Type keywords (e.g. Europa, Hubble, Kepler, Saturn)..." value="${escapeHtml(query)}" aria-label="Search AETHER catalog" />
          ${query ? '<button type="button" class="btn btn-secondary btn-sm" id="clear-search-btn">Clear</button>' : ''}
        </div>

        <div class="flex flex-wrap gap-2 mb-4 items-center">
          <span class="text-xs text-muted">Suggestions:</span>
          ${suggestions.map((s) => `<button type="button" class="badge badge-neutral" style="cursor:pointer;" data-suggest="${s}">${s}</button>`).join('')}
        </div>

        <div class="pill-tabs">
          ${types.map((t) => `<button type="button" class="pill-tab ${t === typeFilter ? 'active' : ''}" data-search-type="${t}">${t}</button>`).join('')}
        </div>

        <p class="text-xs text-muted mb-4">Showing ${matches.length} matching records</p>

        ${matches.length ? `
          <div class="grid-2">
            ${matches.slice(0, 40).map((item) => `
              <a href="${escapeHtml(item.route)}" class="card card-interactive" style="text-decoration:none;">
                <div class="flex justify-between items-center mb-2">
                  <span class="badge badge-cyan">${escapeHtml(item.type)}</span>
                  <i data-lucide="arrow-up-right" style="width:16px;height:16px;color:var(--text-muted);"></i>
                </div>
                <h3 style="font-size:1rem;margin-bottom:4px;">${escapeHtml(item.title)}</h3>
                <p class="text-xs text-muted" style="margin:0;">${escapeHtml(item.subtitle)}</p>
              </a>
            `).join('')}
          </div>
        ` : renderEmptyState({
          icon: 'search-x',
          title: 'No Matching Records',
          description: `No items matched "${query}". Try searching for a planet, mission name, or astronomy topic.`
        })}
      </div>
    `;

    refreshIcons();

    const input = container.querySelector('#global-search-input');
    input.addEventListener('input', (e) => {
      query = e.target.value;
      renderInner();
      const ref = container.querySelector('#global-search-input');
      ref.focus();
      ref.setSelectionRange(ref.value.length, ref.value.length);
    });

    container.querySelector('#clear-search-btn')?.addEventListener('click', () => {
      query = '';
      renderInner();
    });

    container.querySelectorAll('[data-suggest]').forEach((btn) => {
      btn.addEventListener('click', () => {
        query = btn.dataset.suggest;
        renderInner();
      });
    });

    container.querySelectorAll('[data-search-type]').forEach((btn) => {
      btn.addEventListener('click', () => {
        typeFilter = btn.dataset.searchType;
        renderInner();
      });
    });
  };

  renderInner();
}
