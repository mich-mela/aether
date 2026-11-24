/**
 * AETHER Interactive Space Exploration Timeline
 */

import { TIMELINE_EVENTS } from './data-timeline.js';
import { renderSpaceImage } from './images.js';
import { attachImageFallbacks, escapeHtml, refreshIcons } from './helpers.js';
import { renderDataBadge } from './components.js';

export function renderTimelineView(container) {
  let eraFilter = 'All';
  const eras = ['All', ...new Set(TIMELINE_EVENTS.map((e) => e.era))];

  const renderInner = () => {
    const filtered = TIMELINE_EVENTS.filter((e) => eraFilter === 'All' || e.era === eraFilter);

    container.innerHTML = `
      <div class="fade-in">
        <div class="page-header">
          <div>
            <div class="page-eyebrow">Chronicle of Spaceflight</div>
            <h1>Space Timeline</h1>
            <p class="page-subtitle">Historically verified milestones from Sputnik 1 (1957) to the James Webb Space Telescope and Artemis Program.</p>
          </div>
          ${renderDataBadge('Historical', 'Verified Chronology')}
        </div>

        <div class="pill-tabs">
          ${eras.map((era) => `<button type="button" class="pill-tab ${era === eraFilter ? 'active' : ''}" data-era="${escapeHtml(era)}">${escapeHtml(era)}</button>`).join('')}
        </div>

        <div class="timeline-list">
          ${filtered.map((ev) => `
            <article class="card timeline-item">
              <div class="grid-2" style="grid-template-columns:minmax(0,220px) minmax(0,1fr);align-items:center;">
                <div class="card-media" style="margin-bottom:0;aspect-ratio:16/10;">
                  ${renderSpaceImage({ src: ev.imageUrl, alt: ev.title, title: `${ev.year} ${ev.title}`, palette: ev.palette, variant: 'mission' })}
                </div>
                <div>
                  <div class="flex gap-2 items-center mb-2 flex-wrap">
                    <span class="badge badge-cyan">${ev.year}</span>
                    <span class="badge badge-neutral">${escapeHtml(ev.era)}</span>
                    <span class="text-xs mono text-muted">${escapeHtml(ev.date)}</span>
                  </div>
                  <h2 class="card-title mb-2">${escapeHtml(ev.title)}</h2>
                  <p class="text-sm text-secondary mb-2">${escapeHtml(ev.description)}</p>
                  <p class="text-xs text-muted mb-3"><strong>Historical Context:</strong> ${escapeHtml(ev.context)}</p>
                  <a href="${escapeHtml(ev.reference.url)}" target="_blank" rel="noopener noreferrer" class="text-xs">${escapeHtml(ev.reference.label)} →</a>
                </div>
              </div>
            </article>
          `).join('')}
        </div>
      </div>
    `;

    attachImageFallbacks(container);
    refreshIcons();

    container.querySelectorAll('[data-era]').forEach((btn) => {
      btn.addEventListener('click', () => {
        eraFilter = btn.dataset.era;
        renderInner();
      });
    });
  };

  renderInner();
}
