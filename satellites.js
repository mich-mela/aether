/**
 * AETHER Satellite Tracker & Orbital Information Center
 * Displays verified orbital parameters and an interactive Earth orbital demonstration
 * clearly labeled as an educational simulation (never inventing live telemetry positions).
 */

import { SATELLITES } from './data-initial.js';
import { escapeHtml, refreshIcons } from './helpers.js';
import { renderDataBadge } from './components.js';

export function renderSatellitesView(container) {
  let search = '';
  let category = 'All';
  let selectedId = SATELLITES[0].id;
  let animId = null;
  let phase = 0;

  const categories = ['All', ...new Set(SATELLITES.map((s) => s.category))];

  const renderPage = () => {
    const filtered = SATELLITES.filter((s) => {
      const matchCat = category === 'All' || s.category === category;
      const q = search.toLowerCase();
      const matchQ = !q || s.name.toLowerCase().includes(q) || s.orbitRegime.toLowerCase().includes(q) || s.agency.toLowerCase().includes(q);
      return matchCat && matchQ;
    });

    const activeSat = SATELLITES.find((s) => s.id === selectedId) || SATELLITES[0];

    container.innerHTML = `
      <div class="fade-in">
        <div class="page-header">
          <div>
            <div class="page-eyebrow">Orbital Telemetry &amp; Regimes</div>
            <h1>Satellite Tracker</h1>
            <p class="page-subtitle">Inspect orbital altitudes, inclinations, and periods across LEO, MEO, GEO, and L2 space assets.</p>
          </div>
          ${renderDataBadge('Demonstration', 'Educational Orbital Simulation')}
        </div>

        <div class="alert-banner mb-5">
          <i data-lucide="info" style="width:18px;height:18px;flex-shrink:0;color:var(--accent-cyan);"></i>
          <div>
            <strong>Transparency Notice:</strong> Because AETHER runs locally without a live TLE/ephemeris relay server, the Earth orbital canvas below is an <strong>educational orbital demonstration</strong> illustrating inclination and relative orbital periods using verified nominal parameters from NASA and ESA.
          </div>
        </div>

        <div class="grid-2 mb-6">
          <section class="card">
            <div class="card-header">
              <h2 class="card-title">Earth Orbital Visualizer</h2>
              <span class="badge badge-demo">Simulation</span>
            </div>
            <div class="sim-canvas-wrap">
              <canvas id="sat-earth-canvas" class="sim-canvas" aria-label="Educational satellite orbit simulation around Earth"></canvas>
            </div>
          </section>

          <section class="card">
            <div class="card-header">
              <div>
                <div class="page-eyebrow">NORAD ID: ${escapeHtml(activeSat.noradId)}</div>
                <h2 class="card-title">${escapeHtml(activeSat.name)}</h2>
              </div>
              <span class="badge badge-cyan">${escapeHtml(activeSat.category)}</span>
            </div>
            <p class="text-sm text-secondary mb-4">${escapeHtml(activeSat.purpose)}</p>
            <div class="spec-grid mb-4">
              <div class="spec-tile"><div class="spec-tile-label">Orbit Regime</div><div class="spec-tile-value">${escapeHtml(activeSat.orbitRegime)}</div></div>
              <div class="spec-tile"><div class="spec-tile-label">Nominal Altitude</div><div class="spec-tile-value">${activeSat.altitudeKm.toLocaleString('en-US')} km</div></div>
              <div class="spec-tile"><div class="spec-tile-label">Inclination</div><div class="spec-tile-value">${activeSat.inclinationDeg}°</div></div>
              <div class="spec-tile"><div class="spec-tile-label">Orbital Period</div><div class="spec-tile-value">${activeSat.periodMin >= 1440 ? `${(activeSat.periodMin / 1440).toFixed(1)} days` : `${activeSat.periodMin} min`}</div></div>
              <div class="spec-tile"><div class="spec-tile-label">Orbital Speed</div><div class="spec-tile-value">${activeSat.speedKmS} km/s</div></div>
              <div class="spec-tile"><div class="spec-tile-label">Agency</div><div class="spec-tile-value">${escapeHtml(activeSat.agency)}</div></div>
            </div>
            <div class="flex justify-between items-center flex-wrap gap-2 text-xs text-muted">
              <span>Reference: <a href="${escapeHtml(activeSat.sourceUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(activeSat.sourceLabel)} →</a></span>
              <span>Nominal Reference Catalog</span>
            </div>
          </section>
        </div>

        <div class="filter-bar">
          <input type="search" id="sat-search" class="form-control" placeholder="Search satellites or regimes..." value="${escapeHtml(search)}" />
          <select id="sat-category" class="form-select" aria-label="Filter by satellite category">
            ${categories.map((c) => `<option value="${escapeHtml(c)}" ${category === c ? 'selected' : ''}>${escapeHtml(c)}</option>`).join('')}
          </select>
        </div>

        <div class="grid-auto">
          ${filtered.map((s) => `
            <article class="card card-interactive" style="cursor:pointer;${s.id === selectedId ? 'border-color:var(--accent-cyan);' : ''}" data-sat-id="${s.id}">
              <div class="flex justify-between items-center mb-2">
                <span class="badge badge-neutral">${escapeHtml(s.category)}</span>
                <span class="mono text-xs text-cyan">${s.altitudeKm.toLocaleString('en-US')} km</span>
              </div>
              <h3 style="font-size:1rem;margin-bottom:4px;">${escapeHtml(s.name)}</h3>
              <p class="text-xs text-muted mb-2">${escapeHtml(s.orbitRegime)} • Inclination ${s.inclinationDeg}°</p>
              <p class="text-xs text-secondary">${escapeHtml(s.purpose)}</p>
            </article>
          `).join('')}
        </div>
      </div>
    `;

    refreshIcons();

    container.querySelectorAll('[data-sat-id]').forEach((card) => {
      card.addEventListener('click', () => {
        selectedId = card.dataset.satId;
        renderPage();
      });
    });

    container.querySelector('#sat-search').addEventListener('input', (e) => {
      search = e.target.value;
      renderPage();
      const el = container.querySelector('#sat-search');
      el.focus();
      el.setSelectionRange(el.value.length, el.value.length);
    });

    container.querySelector('#sat-category').addEventListener('change', (e) => {
      category = e.target.value;
      renderPage();
    });

    startCanvasLoop(container.querySelector('#sat-earth-canvas'), activeSat);
  };

  const startCanvasLoop = (canvas, activeSat) => {
    if (animId) cancelAnimationFrame(animId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const draw = () => {
      animId = requestAnimationFrame(draw);
      const w = canvas.clientWidth || 500;
      const h = canvas.clientHeight || 360;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }

      ctx.fillStyle = '#050D1A';
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const earthR = Math.min(w, h) * 0.19;

      // Earth sphere
      const grad = ctx.createRadialGradient(cx - earthR * 0.3, cy - earthR * 0.3, earthR * 0.2, cx, cy, earthR);
      grad.addColorStop(0, '#4CC9F0');
      grad.addColorStop(0.55, '#1E6091');
      grad.addColorStop(1, '#081C2E');
      ctx.beginPath();
      ctx.arc(cx, cy, earthR, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Logarithmic orbit radius for visualization
      const logAlt = Math.log10(Math.max(200, activeSat.altitudeKm));
      const orbitR = earthR + 24 + ((logAlt - 2.3) / 4.2) * (Math.min(w, h) * 0.27);
      const tilt = ((activeSat.inclinationDeg || 20) * Math.PI) / 180;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(tilt * 0.45);
      ctx.beginPath();
      ctx.ellipse(0, 0, orbitR, orbitR * 0.48, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(53, 214, 242, 0.55)';
      ctx.lineWidth = 1.6;
      ctx.stroke();

      phase += Math.max(0.004, 0.03 / Math.sqrt(activeSat.periodMin / 90));
      const sx = Math.cos(phase) * orbitR;
      const sy = Math.sin(phase) * orbitR * 0.48;

      ctx.beginPath();
      ctx.arc(sx, sy, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#35D6F2';
      ctx.fill();
      ctx.restore();

      ctx.fillStyle = '#C8D3DF';
      ctx.font = '12px JetBrains Mono, monospace';
      ctx.fillText(`${activeSat.name} | Alt: ${activeSat.altitudeKm.toLocaleString('en-US')} km | Inc: ${activeSat.inclinationDeg}°`, 14, h - 16);
    };
    draw();
  };

  renderPage();

  return () => {
    if (animId) cancelAnimationFrame(animId);
  };
}
