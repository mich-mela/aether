/**
 * AETHER Space Simulator — Educational Physics Laboratory
 * 1. Newtonian Gravity Calculator & Interactive Multi-Body Force Visualizer (SI units)
 * 2. Two-Body Orbital Mechanics Simulator (Circular, Elliptical, Escape trajectories via RK4)
 */

import { escapeHtml, formatSI, refreshIcons } from './helpers.js';
import { renderDataBadge } from './components.js';

const G = 6.67430e-11; // N·m²/kg²
const M_EARTH = 5.9722e24; // kg
const R_EARTH = 6.371e6; // m

export function renderSimulatorView(container) {
  let activeTab = 'gravity';
  let animId = null;

  // Gravity lab state (SI units)
  let bodies = [
    { name: 'Body A (Earth-scale)', massKg: 5.972e24, x: 0.32, y: 0.5, color: '#3B9EFF' },
    { name: 'Body B (Moon-scale)', massKg: 7.348e22, x: 0.68, y: 0.5, color: '#C8D3DF' }
  ];
  let separationKm = 384400; // Earth-Moon mean distance

  // Orbital mechanics state
  let orbitPaused = false;
  let orbitSpeed = 1;
  let initialAltKm = 12000;
  let velocityRatio = 1.0; // 1.0 = circular, >1 elliptical, >=1.414 escape
  let orbitState = null;

  const initOrbitState = () => {
    const r0 = R_EARTH + initialAltKm * 1000;
    const vCirc = Math.sqrt((G * M_EARTH) / r0);
    const v0 = vCirc * velocityRatio;
    orbitState = {
      x: r0,
      y: 0,
      vx: 0,
      vy: v0,
      vCirc,
      vEsc: Math.SQRT2 * vCirc,
      trail: [{ x: r0, y: 0 }]
    };
  };
  initOrbitState();

  const stopLoop = () => {
    if (animId) {
      cancelAnimationFrame(animId);
      animId = null;
    }
  };

  const renderPage = () => {
    stopLoop();
    const rMeters = separationKm * 1000;
    const forceN = (G * bodies[0].massKg * bodies[1].massKg) / (rMeters * rMeters);
    const accel1 = forceN / bodies[0].massKg;
    const accel2 = forceN / bodies[1].massKg;

    container.innerHTML = `
      <div class="fade-in">
        <div class="page-header">
          <div>
            <div class="page-eyebrow">Interactive Physics Laboratory</div>
            <h1>Space Simulator</h1>
            <p class="page-subtitle">Experiment with Newtonian gravitation and two-body orbital trajectories using SI units.</p>
          </div>
          ${renderDataBadge('Demonstration', 'Educational Physics Model')}
        </div>

        <div class="pill-tabs" role="tablist">
          <button type="button" class="pill-tab ${activeTab === 'gravity' ? 'active' : ''}" data-sim-tab="gravity">Gravity Lab (SI Units)</button>
          <button type="button" class="pill-tab ${activeTab === 'orbital' ? 'active' : ''}" data-sim-tab="orbital">Orbital Mechanics (RK4)</button>
        </div>

        ${activeTab === 'gravity' ? `
          <div class="grid-2 mb-6">
            <section class="card">
              <div class="card-header">
                <h2 class="card-title">Gravitational Interaction Visualizer</h2>
                <button type="button" class="btn btn-secondary btn-sm" id="grav-add-body">+ Add Test Mass</button>
              </div>
              <div class="sim-canvas-wrap">
                <canvas id="gravity-canvas" class="sim-canvas"></canvas>
              </div>
              <p class="text-xs text-muted mt-3">
                Formula: <span class="mono text-cyan">F = G · m₁ · m₂ / r²</span> where <span class="mono">G = 6.67430 × 10⁻¹¹ N·m²/kg²</span>.
              </p>
            </section>

            <section class="card">
              <h2 class="card-title mb-4">Parameters &amp; SI Calculations</h2>
              <div class="form-group">
                <label class="form-label" for="grav-m1">Mass 1 (× 10²⁴ kg): <strong class="mono text-cyan" id="grav-m1-out">${(bodies[0].massKg / 1e24).toFixed(2)}</strong></label>
                <input type="range" id="grav-m1" class="w-full" min="0.1" max="20" step="0.1" value="${(bodies[0].massKg / 1e24).toFixed(2)}" />
              </div>
              <div class="form-group">
                <label class="form-label" for="grav-m2">Mass 2 (× 10²² kg): <strong class="mono text-cyan" id="grav-m2-out">${(bodies[1].massKg / 1e22).toFixed(2)}</strong></label>
                <input type="range" id="grav-m2" class="w-full" min="0.5" max="100" step="0.5" value="${(bodies[1].massKg / 1e22).toFixed(2)}" />
              </div>
              <div class="form-group">
                <label class="form-label" for="grav-dist">Center-to-Center Distance (km): <strong class="mono text-cyan" id="grav-dist-out">${separationKm.toLocaleString('en-US')} km</strong></label>
                <input type="range" id="grav-dist" class="w-full" min="20000" max="1000000" step="5000" value="${separationKm}" />
              </div>

              <div class="spec-grid mt-4">
                <div class="spec-tile"><div class="spec-tile-label">Gravitational Force</div><div class="spec-tile-value" id="grav-force-out">${formatSI(forceN, 'N')}</div></div>
                <div class="spec-tile"><div class="spec-tile-label">Accel on Mass 1</div><div class="spec-tile-value" id="grav-a1-out">${formatSI(accel1, 'm/s²')}</div></div>
                <div class="spec-tile"><div class="spec-tile-label">Accel on Mass 2</div><div class="spec-tile-value" id="grav-a2-out">${formatSI(accel2, 'm/s²')}</div></div>
                <div class="spec-tile"><div class="spec-tile-label">Active Bodies</div><div class="spec-tile-value">${bodies.length}</div></div>
              </div>
            </section>
          </div>
        ` : `
          <div class="grid-2 mb-6">
            <section class="card">
              <div class="card-header">
                <h2 class="card-title">Orbital Trajectory Simulator</h2>
                <div class="flex gap-2">
                  <button type="button" class="btn btn-primary btn-sm" id="orb-play-btn">${orbitPaused ? 'Play' : 'Pause'}</button>
                  <button type="button" class="btn btn-secondary btn-sm" id="orb-reset-btn">Reset</button>
                </div>
              </div>
              <div class="sim-canvas-wrap">
                <canvas id="orbital-canvas" class="sim-canvas"></canvas>
              </div>
            </section>

            <section class="card">
              <h2 class="card-title mb-4">Initial Conditions (Earth Central Body)</h2>
              <div class="form-group">
                <label class="form-label" for="orb-alt">Initial Altitude (km): <strong class="mono text-cyan">${initialAltKm.toLocaleString('en-US')} km</strong></label>
                <input type="range" id="orb-alt" class="w-full" min="2000" max="36000" step="1000" value="${initialAltKm}" />
              </div>
              <div class="form-group">
                <label class="form-label" for="orb-vratio">Initial Velocity Ratio (v₀ / v_circ): <strong class="mono text-cyan">${velocityRatio.toFixed(2)}×</strong></label>
                <input type="range" id="orb-vratio" class="w-full" min="0.7" max="1.5" step="0.02" value="${velocityRatio}" />
                <div class="form-hint">1.00× = Circular • 1.01–1.40× = Elliptical • ≥1.414× = Escape trajectory</div>
              </div>
              <div class="form-group">
                <label class="form-label" for="orb-speed">Simulation Speed: <strong class="mono text-cyan">${orbitSpeed.toFixed(1)}×</strong></label>
                <input type="range" id="orb-speed" class="w-full" min="0.2" max="4" step="0.2" value="${orbitSpeed}" />
              </div>
              <div class="spec-grid mt-4">
                <div class="spec-tile"><div class="spec-tile-label">Circular Velocity</div><div class="spec-tile-value">${(orbitState.vCirc / 1000).toFixed(2)} km/s</div></div>
                <div class="spec-tile"><div class="spec-tile-label">Launch Velocity</div><div class="spec-tile-value">${((orbitState.vCirc * velocityRatio) / 1000).toFixed(2)} km/s</div></div>
                <div class="spec-tile"><div class="spec-tile-label">Escape Velocity</div><div class="spec-tile-value">${(orbitState.vEsc / 1000).toFixed(2)} km/s</div></div>
                <div class="spec-tile"><div class="spec-tile-label">Orbit Type</div><div class="spec-tile-value">${velocityRatio >= 1.414 ? 'Escape' : Math.abs(velocityRatio - 1) < 0.03 ? 'Circular' : 'Elliptical'}</div></div>
              </div>
            </section>
          </div>
        `}

        <section class="card">
          <h3>Physics Assumptions &amp; Educational Scope</h3>
          <p class="text-sm text-secondary mt-2">
            This laboratory models idealized point-mass Newtonian gravity in a vacuum using 4th-order Runge-Kutta (RK4) integration. It omits atmospheric drag, Earth's J₂ oblateness, solar radiation pressure, and third-body perturbations, and is designed strictly for astronomy education rather than operational mission planning.
          </p>
        </section>
      </div>
    `;

    refreshIcons();

    container.querySelectorAll('[data-sim-tab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeTab = btn.dataset.simTab;
        renderPage();
      });
    });

    if (activeTab === 'gravity') {
      const drawGravity = () => {
        const canvas = container.querySelector('#gravity-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.clientWidth || 500;
        const h = canvas.clientHeight || 380;
        canvas.width = w;
        canvas.height = h;
        ctx.fillStyle = '#050D1A';
        ctx.fillRect(0, 0, w, h);

        // Draw force vector line between primary two bodies
        const p1 = { x: bodies[0].x * w, y: bodies[0].y * h };
        const p2 = { x: bodies[1].x * w, y: bodies[1].y * h };

        ctx.strokeStyle = 'rgba(53, 214, 242, 0.5)';
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
        ctx.setLineDash([]);

        bodies.forEach((b, idx) => {
          const bx = b.x * w;
          const by = b.y * h;
          const r = idx === 0 ? Math.min(44, 18 + Math.log10(b.massKg / 1e23) * 10) : idx === 1 ? Math.min(28, 10 + Math.log10(b.massKg / 1e21) * 6) : 9;
          ctx.beginPath();
          ctx.arc(bx, by, Math.max(8, r), 0, Math.PI * 2);
          ctx.fillStyle = b.color;
          ctx.fill();
          ctx.fillStyle = '#F5F8FC';
          ctx.font = '11px Inter, sans-serif';
          ctx.fillText(b.name, bx - 36, by + Math.max(8, r) + 16);
        });
      };
      drawGravity();

      container.querySelector('#grav-m1').addEventListener('input', (e) => {
        bodies[0].massKg = Number(e.target.value) * 1e24;
        renderPage();
      });
      container.querySelector('#grav-m2').addEventListener('input', (e) => {
        bodies[1].massKg = Number(e.target.value) * 1e22;
        renderPage();
      });
      container.querySelector('#grav-dist').addEventListener('input', (e) => {
        separationKm = Number(e.target.value);
        const norm = (separationKm - 20000) / 980000;
        bodies[0].x = 0.42 - norm * 0.22;
        bodies[1].x = 0.58 + norm * 0.22;
        renderPage();
      });
      container.querySelector('#grav-add-body').addEventListener('click', () => {
        if (bodies.length >= 6) return;
        bodies.push({
          name: `Probe ${bodies.length - 1}`,
          massKg: 1e21,
          x: 0.25 + Math.random() * 0.5,
          y: 0.22 + Math.random() * 0.56,
          color: '#35D6F2'
        });
        renderPage();
      });
    } else {
      container.querySelector('#orb-play-btn').addEventListener('click', () => {
        orbitPaused = !orbitPaused;
        renderPage();
      });
      container.querySelector('#orb-reset-btn').addEventListener('click', () => {
        initOrbitState();
        renderPage();
      });
      container.querySelector('#orb-alt').addEventListener('input', (e) => {
        initialAltKm = Number(e.target.value);
        initOrbitState();
        renderPage();
      });
      container.querySelector('#orb-vratio').addEventListener('input', (e) => {
        velocityRatio = Number(e.target.value);
        initOrbitState();
        renderPage();
      });
      container.querySelector('#orb-speed').addEventListener('input', (e) => {
        orbitSpeed = Number(e.target.value);
        renderPage();
      });

      const canvas = container.querySelector('#orbital-canvas');
      const ctx = canvas.getContext('2d');

      const stepRK4 = (s, dt) => {
        const accel = (x, y) => {
          const r2 = x * x + y * y;
          const r = Math.sqrt(r2);
          const a = -(G * M_EARTH) / (r2 * r);
          return { ax: a * x, ay: a * y };
        };
        const k1a = accel(s.x, s.y);
        const k1 = { dx: s.vx, dy: s.vy, dvx: k1a.ax, dvy: k1a.ay };

        const k2a = accel(s.x + 0.5 * dt * k1.dx, s.y + 0.5 * dt * k1.dy);
        const k2 = { dx: s.vx + 0.5 * dt * k1.dvx, dy: s.vy + 0.5 * dt * k1.dvy, dvx: k2a.ax, dvy: k2a.ay };

        const k3a = accel(s.x + 0.5 * dt * k2.dx, s.y + 0.5 * dt * k2.dy);
        const k3 = { dx: s.vx + 0.5 * dt * k2.dvx, dy: s.vy + 0.5 * dt * k2.dvy, dvx: k3a.ax, dvy: k3a.ay };

        const k4a = accel(s.x + dt * k3.dx, s.y + dt * k3.dy);
        const k4 = { dx: s.vx + dt * k3.dvx, dy: s.vy + dt * k3.dvy, dvx: k4a.ax, dvy: k4a.ay };

        s.x += (dt / 6) * (k1.dx + 2 * k2.dx + 2 * k3.dx + k4.dx);
        s.y += (dt / 6) * (k1.dy + 2 * k2.dy + 2 * k3.dy + k4.dy);
        s.vx += (dt / 6) * (k1.dvx + 2 * k2.dvx + 2 * k3.dvx + k4.dvx);
        s.vy += (dt / 6) * (k1.dvy + 2 * k2.dvy + 2 * k3.dvy + k4.dvy);
      };

      const loop = () => {
        animId = requestAnimationFrame(loop);
        const w = canvas.clientWidth || 500;
        const h = canvas.clientHeight || 380;
        if (canvas.width !== w || canvas.height !== h) {
          canvas.width = w;
          canvas.height = h;
        }
        ctx.fillStyle = '#050D1A';
        ctx.fillRect(0, 0, w, h);

        if (!orbitPaused) {
          for (let i = 0; i < 4; i++) {
            stepRK4(orbitState, 45 * orbitSpeed);
          }
          orbitState.trail.push({ x: orbitState.x, y: orbitState.y });
          if (orbitState.trail.length > 420) orbitState.trail.shift();
        }

        const cx = w / 2;
        const cy = h / 2;
        const scale = Math.min(w, h) / (1.45e8);

        // Earth
        ctx.beginPath();
        ctx.arc(cx, cy, Math.max(12, R_EARTH * scale), 0, Math.PI * 2);
        ctx.fillStyle = '#2A7DE1';
        ctx.fill();

        // Trail
        ctx.beginPath();
        orbitState.trail.forEach((pt, idx) => {
          const px = cx + pt.x * scale;
          const py = cy + pt.y * scale;
          if (idx === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        ctx.strokeStyle = '#35D6F2';
        ctx.lineWidth = 1.6;
        ctx.stroke();

        // Spacecraft
        const sx = cx + orbitState.x * scale;
        const sy = cy + orbitState.y * scale;
        ctx.beginPath();
        ctx.arc(sx, sy, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#F5F8FC';
        ctx.fill();
      };
      loop();
    }
  };

  renderPage();
  return stopLoop;
}
