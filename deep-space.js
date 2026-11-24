/**
 * AETHER Deep Space Exploration Discovery Center
 */

import { DEEP_SPACE_OBJECTS } from './data-deep-space.js';
import { renderSpaceImage } from './images.js';
import { isFavorite, toggleFavorite } from './favorites-db.js';
import { recordRecentlyViewed } from './progress-db.js';
import { attachImageFallbacks, escapeHtml, refreshIcons } from './helpers.js';
import { renderDataBadge, showToast } from './components.js';

export async function renderDeepSpaceView(container, state, paramId = null) {
  if (paramId) {
    const obj = DEEP_SPACE_OBJECTS.find((d) => d.id === paramId);
    if (obj) return renderDeepSpaceDetail(container, state, obj);
  }

  let search = '';
  let category = 'All';
  const categories = ['All', 'Galaxies', 'Nebulae', 'Star Clusters', 'Black Holes', 'Exoplanets', 'Supernovae', 'Cosmic Phenomena'];

  const renderList = () => {
    const filtered = DEEP_SPACE_OBJECTS.filter((o) => {
      const matchCat = category === 'All' || o.category === category;
      const q = search.toLowerCase();
      const matchQ = !q || o.name.toLowerCase().includes(q) || o.description.toLowerCase().includes(q) || o.category.toLowerCase().includes(q);
      return matchCat && matchQ;
    });

    container.innerHTML = `
      <div class="fade-in">
        <div class="page-header">
          <div>
            <div class="page-eyebrow">Extragalactic &amp; Astrophysical Catalog</div>
            <h1>Deep Space Exploration</h1>
            <p class="page-subtitle">Discover galaxies, nebulae, star clusters, black holes, exoplanets, supernovae, and cosmic phenomena.</p>
          </div>
          ${renderDataBadge('Historical', 'NASA / ESA / STScI Verified')}
        </div>

        <div class="pill-tabs">
          ${categories.map((c) => `<button type="button" class="pill-tab ${category === c ? 'active' : ''}" data-ds-cat="${escapeHtml(c)}">${escapeHtml(c)}</button>`).join('')}
        </div>

        <div class="filter-bar">
          <input type="search" id="ds-search" class="form-control" placeholder="Search deep-space objects..." value="${escapeHtml(search)}" />
        </div>

        <div class="grid-auto">
          ${filtered.map((o) => `
            <article class="card card-interactive">
              <div class="card-media">
                ${renderSpaceImage({ src: o.imageUrl, alt: o.name, title: o.name, palette: o.palette, variant: o.variant || 'nebula' })}
              </div>
              <div class="flex justify-between items-center mb-2">
                <span class="badge badge-cyan">${escapeHtml(o.category)}</span>
                <span class="text-xs mono text-muted">${escapeHtml(o.distance)}</span>
              </div>
              <h2 class="card-title mb-2">${escapeHtml(o.name)}</h2>
              <p class="text-sm text-muted mb-4">${escapeHtml(o.description.slice(0, 125))}…</p>
              <a href="#deep-space/${o.id}" class="btn btn-primary btn-sm w-full">Inspect Object</a>
            </article>
          `).join('')}
        </div>
      </div>
    `;

    attachImageFallbacks(container);
    refreshIcons();

    container.querySelectorAll('[data-ds-cat]').forEach((btn) => {
      btn.addEventListener('click', () => {
        category = btn.dataset.dsCat;
        renderList();
      });
    });

    container.querySelector('#ds-search').addEventListener('input', (e) => {
      search = e.target.value;
      renderList();
      const el = container.querySelector('#ds-search');
      el.focus();
      el.setSelectionRange(el.value.length, el.value.length);
    });
  };

  renderList();
}

async function renderDeepSpaceDetail(container, state, obj) {
  if (state.user) {
    await recordRecentlyViewed(state.user.id, {
      entityType: 'Deep Space',
      entityId: obj.id,
      title: obj.name,
      route: `#deep-space/${obj.id}`
    });
  }

  let fav = state.user ? await isFavorite(state.user.id, 'deep-space', obj.id) : false;

  const renderInner = () => {
    container.innerHTML = `
      <div class="fade-in">
        <div class="mb-4 flex justify-between items-center flex-wrap gap-2">
          <a href="#deep-space" class="btn btn-secondary btn-sm">← Back to Deep Space</a>
          <button type="button" class="btn ${fav ? 'btn-primary' : 'btn-secondary'} btn-sm" id="ds-fav-btn">
            <i data-lucide="heart" style="width:15px;height:15px;"></i>
            ${fav ? 'Saved Object' : 'Save to Favorites'}
          </button>
        </div>

        <div class="grid-2 mb-6">
          <div class="card">
            <div class="card-media" style="aspect-ratio:4/3;margin-bottom:0;">
              ${renderSpaceImage({ src: obj.imageUrl, alt: obj.name, title: obj.name, palette: obj.palette, variant: obj.variant || 'nebula' })}
            </div>
          </div>

          <div class="card">
            <span class="badge badge-cyan mb-2">${escapeHtml(obj.category)}</span>
            <h1>${escapeHtml(obj.name)}</h1>
            <p class="text-secondary">${escapeHtml(obj.description)}</p>
            <div class="spec-grid mt-4">
              <div class="spec-tile"><div class="spec-tile-label">Distance</div><div class="spec-tile-value">${escapeHtml(obj.distance)}</div></div>
              <div class="spec-tile"><div class="spec-tile-label">Constellation</div><div class="spec-tile-value">${escapeHtml(obj.constellation)}</div></div>
              <div class="spec-tile" style="grid-column:1/-1;"><div class="spec-tile-label">Verified Measurements</div><div class="spec-tile-value">${escapeHtml(obj.measurements)}</div></div>
            </div>
          </div>
        </div>

        <div class="grid-2">
          <section class="card">
            <h3>Discovery &amp; Scientific Context</h3>
            <p class="text-sm text-secondary mt-2">${escapeHtml(obj.discovery)}</p>
          </section>
          <section class="card">
            <h3>Official References</h3>
            <ul class="footer-links mt-2">
              ${obj.references.map((r) => `<li><a href="${escapeHtml(r.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(r.label)} →</a></li>`).join('')}
            </ul>
          </section>
        </div>
      </div>
    `;

    attachImageFallbacks(container);
    refreshIcons();

    container.querySelector('#ds-fav-btn').addEventListener('click', async () => {
      if (!state.user) {
        showToast('Sign in to save deep-space objects.', 'warning');
        return;
      }
      const res = await toggleFavorite(state.user.id, {
        entityType: 'deep-space',
        entityId: obj.id,
        title: obj.name,
        subtitle: obj.category,
        route: `#deep-space/${obj.id}`
      });
      fav = res.saved;
      showToast(fav ? `${obj.name} saved.` : `${obj.name} removed.`, 'success');
      renderInner();
    });
  };

  renderInner();
}
