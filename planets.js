/**
 * AETHER Planet Explorer — Scientific Encyclopedia, Search, Filter, Sort, Comparison & Favorites
 */

import { PLANETS } from './data-planets.js';
import { MISSIONS } from './data-missions.js';
import { renderSpaceImage } from './images.js';
import { isFavorite, toggleFavorite } from './favorites-db.js';
import { recordRecentlyViewed } from './progress-db.js';
import { attachImageFallbacks, escapeHtml, refreshIcons } from './helpers.js';
import { renderDataBadge, showToast } from './components.js';

export async function renderPlanetsView(container, state, paramId = null) {
  if (paramId) {
    const planet = PLANETS.find((p) => p.id === paramId);
    if (planet) {
      return renderPlanetDetail(container, state, planet);
    }
  }

  let searchQuery = '';
  let filterClass = 'All';
  let sortBy = 'order';
  let compareA = 'earth';
  let compareB = 'mars';

  const renderList = () => {
    const filtered = PLANETS.filter((p) => {
      const matchClass = filterClass === 'All' || p.classification === filterClass;
      const q = searchQuery.toLowerCase();
      const matchSearch = !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
      return matchClass && matchSearch;
    }).sort((a, b) => {
      if (sortBy === 'diameter') return b.diameterKm - a.diameterKm;
      if (sortBy === 'gravity') return b.gravityMs2 - a.gravityMs2;
      if (sortBy === 'moons') return b.moonsCount - a.moonsCount;
      return a.order - b.order;
    });

    const pA = PLANETS.find((p) => p.id === compareA) || PLANETS[2];
    const pB = PLANETS.find((p) => p.id === compareB) || PLANETS[3];

    container.innerHTML = `
      <div class="fade-in">
        <div class="page-header">
          <div>
            <div class="page-eyebrow">Planetary Encyclopedia</div>
            <h1>Planet Explorer</h1>
            <p class="page-subtitle">Verified physical, orbital, and atmospheric measurements for all eight planets sourced from NASA NSSDC Planetary Fact Sheets.</p>
          </div>
          ${renderDataBadge('Historical', 'NASA NSSDC Verified')}
        </div>

        <div class="filter-bar">
          <input type="search" id="planet-search" class="form-control" placeholder="Search planets..." value="${escapeHtml(searchQuery)}" aria-label="Search planets" />
          <select id="planet-filter" class="form-select" aria-label="Filter by planet type">
            <option value="All" ${filterClass === 'All' ? 'selected' : ''}>All Classifications</option>
            <option value="Terrestrial" ${filterClass === 'Terrestrial' ? 'selected' : ''}>Terrestrial</option>
            <option value="Gas Giant" ${filterClass === 'Gas Giant' ? 'selected' : ''}>Gas Giant</option>
            <option value="Ice Giant" ${filterClass === 'Ice Giant' ? 'selected' : ''}>Ice Giant</option>
          </select>
          <select id="planet-sort" class="form-select" aria-label="Sort planets">
            <option value="order" ${sortBy === 'order' ? 'selected' : ''}>Sort: Distance from Sun</option>
            <option value="diameter" ${sortBy === 'diameter' ? 'selected' : ''}>Sort: Diameter (Largest)</option>
            <option value="gravity" ${sortBy === 'gravity' ? 'selected' : ''}>Sort: Surface Gravity</option>
            <option value="moons" ${sortBy === 'moons' ? 'selected' : ''}>Sort: Known Moons</option>
          </select>
        </div>

        <div class="grid-auto mb-8">
          ${filtered.map((p) => `
            <article class="card card-interactive">
              <div class="card-media">
                ${renderSpaceImage({ src: p.imageUrl, alt: p.name, title: p.name, palette: p.palette, variant: p.variant || 'planet' })}
              </div>
              <div class="flex justify-between items-center mb-2">
                <h2 class="card-title">${escapeHtml(p.name)}</h2>
                <span class="badge badge-cyan">${escapeHtml(p.classification)}</span>
              </div>
              <p class="text-sm text-muted mb-3">${escapeHtml(p.tagline)}</p>
              <div class="spec-grid mb-4" style="grid-template-columns:repeat(2,1fr);">
                <div class="spec-tile"><div class="spec-tile-label">Diameter</div><div class="spec-tile-value">${escapeHtml(p.diameter)}</div></div>
                <div class="spec-tile"><div class="spec-tile-label">Gravity</div><div class="spec-tile-value">${escapeHtml(p.gravity)}</div></div>
              </div>
              <a href="#planets/${p.id}" class="btn btn-primary btn-sm w-full">Inspect Planet Dossier</a>
            </article>
          `).join('')}
        </div>

        <!-- Side-by-Side Planet Comparison Tool -->
        <section class="card">
          <div class="card-header">
            <div>
              <div class="page-eyebrow">Comparative Planetology</div>
              <h2 class="card-title">Planet Comparison Tool</h2>
            </div>
          </div>
          <div class="grid-2 mb-4">
            <div class="form-group" style="margin:0;">
              <label class="form-label" for="compare-a">Planet A</label>
              <select id="compare-a" class="form-select">
                ${PLANETS.map((p) => `<option value="${p.id}" ${p.id === compareA ? 'selected' : ''}>${escapeHtml(p.name)}</option>`).join('')}
              </select>
            </div>
            <div class="form-group" style="margin:0;">
              <label class="form-label" for="compare-b">Planet B</label>
              <select id="compare-b" class="form-select">
                ${PLANETS.map((p) => `<option value="${p.id}" ${p.id === compareB ? 'selected' : ''}>${escapeHtml(p.name)}</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>${escapeHtml(pA.name)}</th>
                  <th>${escapeHtml(pB.name)}</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Classification</td><td>${escapeHtml(pA.classification)}</td><td>${escapeHtml(pB.classification)}</td></tr>
                <tr><td>Diameter</td><td class="mono">${escapeHtml(pA.diameter)}</td><td class="mono">${escapeHtml(pB.diameter)}</td></tr>
                <tr><td>Mass</td><td class="mono">${escapeHtml(pA.massKg)}</td><td class="mono">${escapeHtml(pB.massKg)}</td></tr>
                <tr><td>Surface Gravity</td><td class="mono">${escapeHtml(pA.gravity)}</td><td class="mono">${escapeHtml(pB.gravity)}</td></tr>
                <tr><td>Average Temperature</td><td>${escapeHtml(pA.averageTemp)}</td><td>${escapeHtml(pB.averageTemp)}</td></tr>
                <tr><td>Distance from Sun</td><td>${escapeHtml(pA.distanceFromSun)}</td><td>${escapeHtml(pB.distanceFromSun)}</td></tr>
                <tr><td>Orbital Period</td><td>${escapeHtml(pA.orbitalPeriod)}</td><td>${escapeHtml(pB.orbitalPeriod)}</td></tr>
                <tr><td>Rotation Period</td><td>${escapeHtml(pA.rotationPeriod)}</td><td>${escapeHtml(pB.rotationPeriod)}</td></tr>
                <tr><td>Known Moons</td><td>${escapeHtml(pA.knownMoons)}</td><td>${escapeHtml(pB.knownMoons)}</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    `;

    attachImageFallbacks(container);
    refreshIcons();

    container.querySelector('#planet-search').addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderList();
      const input = container.querySelector('#planet-search');
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    });
    container.querySelector('#planet-filter').addEventListener('change', (e) => {
      filterClass = e.target.value;
      renderList();
    });
    container.querySelector('#planet-sort').addEventListener('change', (e) => {
      sortBy = e.target.value;
      renderList();
    });
    container.querySelector('#compare-a').addEventListener('change', (e) => {
      compareA = e.target.value;
      renderList();
    });
    container.querySelector('#compare-b').addEventListener('change', (e) => {
      compareB = e.target.value;
      renderList();
    });
  };

  renderList();
}

async function renderPlanetDetail(container, state, planet) {
  if (state.user) {
    await recordRecentlyViewed(state.user.id, {
      entityType: 'Planet',
      entityId: planet.id,
      title: planet.name,
      route: `#planets/${planet.id}`
    });
  }

  let fav = state.user ? await isFavorite(state.user.id, 'planet', planet.id) : false;
  const relatedMissions = MISSIONS.filter((m) => planet.relatedMissions.includes(m.id));

  const renderInner = () => {
    container.innerHTML = `
      <div class="fade-in">
        <div class="mb-4 flex justify-between items-center flex-wrap gap-2">
          <a href="#planets" class="btn btn-secondary btn-sm">← Back to Planet Explorer</a>
          <button type="button" class="btn ${fav ? 'btn-primary' : 'btn-secondary'} btn-sm" id="planet-fav-btn">
            <i data-lucide="heart" style="width:15px;height:15px;"></i>
            ${fav ? 'Saved in Favorites' : 'Save to Favorites'}
          </button>
        </div>

        <div class="grid-2 mb-6">
          <div class="card">
            <div class="card-media" style="aspect-ratio:4/3;margin-bottom:0;">
              ${renderSpaceImage({ src: planet.imageUrl, alt: planet.name, title: planet.name, palette: planet.palette, variant: planet.variant || 'planet' })}
            </div>
          </div>

          <div class="card">
            <div class="flex justify-between items-center mb-2">
              <span class="badge badge-cyan">${escapeHtml(planet.classification)}</span>
              ${renderDataBadge('Historical', 'NASA NSSDC')}
            </div>
            <h1>${escapeHtml(planet.name)}</h1>
            <p class="text-secondary">${escapeHtml(planet.description)}</p>
            <div class="spec-grid mt-4">
              <div class="spec-tile"><div class="spec-tile-label">Diameter</div><div class="spec-tile-value">${escapeHtml(planet.diameter)}</div></div>
              <div class="spec-tile"><div class="spec-tile-label">Mass</div><div class="spec-tile-value">${escapeHtml(planet.massKg)}</div></div>
              <div class="spec-tile"><div class="spec-tile-label">Gravity</div><div class="spec-tile-value">${escapeHtml(planet.gravity)}</div></div>
              <div class="spec-tile"><div class="spec-tile-label">Avg Temperature</div><div class="spec-tile-value">${escapeHtml(planet.averageTemp)}</div></div>
              <div class="spec-tile"><div class="spec-tile-label">Orbital Period</div><div class="spec-tile-value">${escapeHtml(planet.orbitalPeriod)}</div></div>
              <div class="spec-tile"><div class="spec-tile-label">Rotation Period</div><div class="spec-tile-value">${escapeHtml(planet.rotationPeriod)}</div></div>
              <div class="spec-tile"><div class="spec-tile-label">Distance from Sun</div><div class="spec-tile-value">${escapeHtml(planet.distanceFromSun)}</div></div>
              <div class="spec-tile"><div class="spec-tile-label">Known Moons</div><div class="spec-tile-value">${escapeHtml(planet.knownMoons)}</div></div>
            </div>
          </div>
        </div>

        <div class="grid-2 mb-6">
          <section class="card">
            <h3>Atmospheric Composition &amp; Key Facts</h3>
            <p class="text-sm text-secondary mb-3"><strong>Atmosphere:</strong> ${escapeHtml(planet.atmosphere)}</p>
            <ul style="padding-left:1.2rem;margin:0;color:var(--text-secondary);" class="text-sm">
              ${planet.facts.map((f) => `<li class="mb-2">${escapeHtml(f)}</li>`).join('')}
            </ul>
          </section>

          <section class="card">
            <h3>Exploration History &amp; References</h3>
            <p class="text-sm text-secondary mb-4">${escapeHtml(planet.explorationHistory)}</p>
            ${relatedMissions.length ? `
              <p class="text-xs font-semibold text-muted mb-2" style="text-transform:uppercase;">Related Missions</p>
              <div class="flex flex-wrap gap-2 mb-4">
                ${relatedMissions.map((m) => `<a href="#missions/${m.id}" class="btn btn-secondary btn-sm">${escapeHtml(m.name)}</a>`).join('')}
              </div>
            ` : ''}
            <p class="text-xs font-semibold text-muted mb-2" style="text-transform:uppercase;">Official Scientific References</p>
            <ul class="footer-links">
              ${planet.references.map((r) => `<li><a href="${escapeHtml(r.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(r.label)} →</a></li>`).join('')}
            </ul>
          </section>
        </div>
      </div>
    `;

    attachImageFallbacks(container);
    refreshIcons();

    container.querySelector('#planet-fav-btn').addEventListener('click', async () => {
      if (!state.user) {
        showToast('Sign in to save favorite planets.', 'warning');
        return;
      }
      const res = await toggleFavorite(state.user.id, {
        entityType: 'planet',
        entityId: planet.id,
        title: planet.name,
        subtitle: planet.classification,
        route: `#planets/${planet.id}`
      });
      fav = res.saved;
      showToast(fav ? `${planet.name} saved to Favorites.` : `${planet.name} removed from Favorites.`, 'success');
      renderInner();
    });
  };

  renderInner();
}
