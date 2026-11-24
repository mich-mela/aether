/**
 * AETHER Astronomical Space Gallery
 * Features responsive grid, category filters, live NASA Image Library search, fullscreen lightbox, credits, and favorites.
 */

import { GALLERY_ITEMS } from './data-initial.js';
import { searchNasaImages } from './nasa.js';
import { renderSpaceImage } from './images.js';
import { isFavorite, toggleFavorite } from './favorites-db.js';
import { attachImageFallbacks, escapeHtml, refreshIcons } from './helpers.js';
import { openModal, renderDataBadge, showToast } from './components.js';

export function renderGalleryView(container, state) {
  let category = 'All';
  let search = '';
  let liveItems = [];
  let liveStatus = 'Historical';

  const categories = ['All', 'Planetary', 'Nebulae', 'Galaxies', 'Missions', 'Deep Space'];

  const renderInner = () => {
    const combined = [...liveItems, ...GALLERY_ITEMS];
    const filtered = combined.filter((item) => {
      const matchCat = category === 'All' || item.category === category;
      const q = search.toLowerCase();
      const matchQ = !q || item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q) || item.credit.toLowerCase().includes(q);
      return matchCat && matchQ;
    });

    container.innerHTML = `
      <div class="fade-in">
        <div class="page-header">
          <div>
            <div class="page-eyebrow">Official NASA &amp; ESA Imagery</div>
            <h1>Space Gallery</h1>
            <p class="page-subtitle">Browse curated official astronomical photographs with attribution, fullscreen inspection, and optional live NASA Image Library queries.</p>
          </div>
          ${renderDataBadge(liveStatus, liveItems.length ? 'Live NASA Search + Archive' : 'Verified Archive')}
        </div>

        <div class="pill-tabs">
          ${categories.map((c) => `<button type="button" class="pill-tab ${category === c ? 'active' : ''}" data-gal-cat="${c}">${c}</button>`).join('')}
        </div>

        <form class="filter-bar" id="gallery-search-form">
          <input type="search" id="gallery-search-input" class="form-control" placeholder="Filter archive or search NASA Images (e.g. Europa, Carina)..." value="${escapeHtml(search)}" />
          <button type="submit" class="btn btn-primary btn-sm" id="gallery-nasa-btn">Search NASA Library</button>
        </form>

        <div class="gallery-grid">
          ${filtered.map((item) => `
            <article class="card card-interactive gallery-card" data-gal-id="${escapeHtml(item.id)}">
              <div class="gallery-thumb">
                ${renderSpaceImage({ src: item.imageUrl, alt: item.title, title: item.title, palette: item.palette, variant: item.variant || 'nebula' })}
              </div>
              <div class="gallery-card-body">
                <div class="flex justify-between items-center mb-1">
                  <span class="badge badge-cyan">${escapeHtml(item.category || 'NASA Archive')}</span>
                  <span class="text-xs mono text-muted">${escapeHtml(item.date || item.dateCreated || '')}</span>
                </div>
                <h3 style="font-size:1rem;margin-bottom:4px;">${escapeHtml(item.title)}</h3>
                <p class="text-xs text-muted">${escapeHtml(item.credit)}</p>
              </div>
            </article>
          `).join('')}
        </div>
      </div>
    `;

    attachImageFallbacks(container);
    refreshIcons();

    container.querySelectorAll('[data-gal-cat]').forEach((btn) => {
      btn.addEventListener('click', () => {
        category = btn.dataset.galCat;
        renderInner();
      });
    });

    container.querySelector('#gallery-search-input').addEventListener('input', (e) => {
      search = e.target.value;
    });

    container.querySelector('#gallery-search-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      search = container.querySelector('#gallery-search-input').value.trim();
      if (!search) {
        liveItems = [];
        liveStatus = 'Historical';
        renderInner();
        return;
      }
      const btn = container.querySelector('#gallery-nasa-btn');
      btn.disabled = true;
      btn.textContent = 'Querying NASA...';
      const res = await searchNasaImages(search, 6);
      if (res.items.length) {
        liveItems = res.items.map((x) => ({ ...x, category: 'Deep Space', palette: ['#1D3557', '#35D6F2', '#07111F'], variant: 'nebula' }));
        liveStatus = 'Live';
        showToast(`Loaded ${res.items.length} images from NASA Image Library.`, 'success');
      } else {
        liveItems = [];
        liveStatus = 'Historical';
        showToast(res.error || 'Showing matching local archive items.', 'info');
      }
      renderInner();
    });

    container.querySelectorAll('[data-gal-id]').forEach((card) => {
      card.addEventListener('click', async () => {
        const item = combined.find((x) => x.id === card.dataset.galId);
        if (!item) return;
        let fav = state.user ? await isFavorite(state.user.id, 'image', item.id) : false;

        openModal({
          title: item.title,
          size: 'lg',
          contentHtml: `
            <div class="card-media" style="aspect-ratio:16/10;">
              ${renderSpaceImage({ src: item.imageUrl, alt: item.title, title: item.title, palette: item.palette, variant: item.variant || 'nebula' })}
            </div>
            <p class="text-sm text-secondary mb-3">${escapeHtml(item.description)}</p>
            <p class="text-xs text-muted"><strong>Credit:</strong> ${escapeHtml(item.credit)} • <strong>Date:</strong> ${escapeHtml(item.date || item.dateCreated || 'Archive')}</p>
          `,
          footerHtml: `
            <a href="${escapeHtml(item.sourceUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">Official NASA Source →</a>
            <button type="button" class="btn ${fav ? 'btn-primary' : 'btn-secondary'} btn-sm" id="modal-gal-fav">${fav ? 'Saved in Favorites' : 'Save Image'}</button>
          `,
          onMount: (root) => {
            attachImageFallbacks(root);
            root.querySelector('#modal-gal-fav').addEventListener('click', async (ev) => {
              if (!state.user) {
                showToast('Sign in to save favorite images.', 'warning');
                return;
              }
              const r = await toggleFavorite(state.user.id, {
                entityType: 'image',
                entityId: item.id,
                title: item.title,
                subtitle: item.credit,
                route: '#gallery'
              });
              ev.currentTarget.textContent = r.saved ? 'Saved in Favorites' : 'Save Image';
              showToast(r.saved ? 'Image saved to Favorites.' : 'Image removed from Favorites.', 'success');
            });
          }
        });
      });
    });
  };

  renderInner();
}
