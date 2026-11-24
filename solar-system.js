/**
 * AETHER Interactive 3D Solar System (Three.js + Procedural Planetary Textures + 2D WebGL Fallback)
 * Disposes all GPU geometries, materials, textures, and animation frames on unmount.
 */

import { PLANETS } from './data-planets.js';
import { getPref, setPref } from './storage.js';
import { escapeHtml, refreshIcons } from './helpers.js';
import { renderDataBadge } from './components.js';

function createProceduralPlanetTexture(planet) {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 128;
  const ctx = c.getContext('2d');

  const [base, light, dark] = planet.palette || ['#3B9EFF', '#90E0EF', '#081C2E'];
  const grad = ctx.createLinearGradient(0, 0, 0, c.height);
  grad.addColorStop(0, dark);
  grad.addColorStop(0.25, base);
  grad.addColorStop(0.5, light);
  grad.addColorStop(0.75, base);
  grad.addColorStop(1, dark);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, c.width, c.height);

  // Subtle atmospheric bands or craters
  ctx.globalAlpha = 0.22;
  for (let i = 0; i < 14; i++) {
    ctx.fillStyle = i % 2 === 0 ? light : dark;
    const y = (i / 14) * c.height;
    ctx.fillRect(0, y, c.width, 4 + (i % 4) * 2);
  }
  ctx.globalAlpha = 1;
  return c;
}

function isWebGLSupported() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch {
    return false;
  }
}

export function renderSolarSystemView(container) {
  let speed = Number(getPref('lastSolarSpeed', 1)) || 1;
  let paused = false;
  let showOrbits = true;
  let showLabels = true;
  let selectedId = 'earth';

  container.innerHTML = `
    <div class="fade-in">
      <div class="page-header">
        <div>
          <div class="page-eyebrow">Interactive 3D Visualization</div>
          <h1>Solar System Observatory</h1>
          <p class="page-subtitle">Drag to orbit camera, scroll or pinch to zoom, and select any planet to inspect its NASA NSSDC measurements.</p>
        </div>
        <div class="flex gap-2 items-center flex-wrap">
          ${renderDataBadge('Demonstration', 'Educational Visualization')}
        </div>
      </div>

      <div class="solar-viewport-wrap">
        <div class="solar-hud-top">
          <div class="solar-controls-bar">
            <button type="button" class="btn btn-primary btn-sm" id="solar-play-btn">Pause</button>
            <button type="button" class="btn btn-secondary btn-sm" id="solar-reset-btn">Reset Camera</button>
            <button type="button" class="btn btn-secondary btn-sm" id="solar-orbits-btn">Orbits: On</button>
            <button type="button" class="btn btn-secondary btn-sm" id="solar-labels-btn">Labels: On</button>
            <label class="text-xs text-secondary flex items-center gap-2" style="padding:0 4px;">
              Speed <span class="mono text-cyan" id="solar-speed-val">${speed.toFixed(1)}x</span>
              <input type="range" id="solar-speed-range" min="0.1" max="5" step="0.1" value="${speed}" style="width:90px;" />
            </label>
          </div>
        </div>

        <div id="solar-canvas-host" class="solar-canvas-host"></div>

        <div class="solar-planet-strip" role="group" aria-label="Focus Planet">
          <button type="button" class="solar-planet-btn" data-focus="sun">Sun</button>
          ${PLANETS.map((p) => `<button type="button" class="solar-planet-btn ${p.id === selectedId ? 'active' : ''}" data-focus="${p.id}">${escapeHtml(p.name)}</button>`).join('')}
        </div>
      </div>

      <div class="grid-2">
        <section class="card" id="solar-detail-panel"></section>
        <section class="card">
          <h3>Scientific Scaling &amp; Educational Disclosure</h3>
          <p class="text-sm text-secondary mt-2">
            To keep all eight planets simultaneously visible and interactive on desktop and mobile screens, <strong>planetary radii and orbital distances are logarithmically compressed</strong> for educational clarity.
          </p>
          <p class="text-sm text-muted">
            At true 1:1 scale, the Sun would be 109 times Earth's diameter and Neptune would orbit 30 AU (4.5 billion km) away, making planets invisible sub-pixel dots. All numerical data displayed in the detail panel reflects verified NASA NSSDC measurements.
          </p>
        </section>
      </div>
    </div>
  `;

  const host = container.querySelector('#solar-canvas-host');
  const detailPanel = container.querySelector('#solar-detail-panel');

  const updateDetailPanel = (id) => {
    selectedId = id;
    container.querySelectorAll('.solar-planet-btn').forEach((b) => {
      b.classList.toggle('active', b.dataset.focus === id);
    });

    if (id === 'sun') {
      detailPanel.innerHTML = `
        <div class="flex justify-between items-center mb-3">
          <h2 style="margin:0;">The Sun (G2V Star)</h2>
          <span class="badge badge-cyan">Host Star</span>
        </div>
        <p class="text-sm text-secondary">The Sun contains 99.86% of the Solar System's mass, radiating energy generated by core hydrogen fusion at ~15 million K.</p>
        <div class="spec-grid mt-3">
          <div class="spec-tile"><div class="spec-tile-label">Diameter</div><div class="spec-tile-value">1,392,700 km</div></div>
          <div class="spec-tile"><div class="spec-tile-label">Mass</div><div class="spec-tile-value">1.989 × 10³⁰ kg</div></div>
          <div class="spec-tile"><div class="spec-tile-label">Surface Temp</div><div class="spec-tile-value">5,500 °C</div></div>
        </div>
      `;
      return;
    }

    const p = PLANETS.find((x) => x.id === id) || PLANETS[2];
    detailPanel.innerHTML = `
      <div class="flex justify-between items-center mb-2">
        <h2 style="margin:0;">${escapeHtml(p.name)}</h2>
        <span class="badge badge-cyan">${escapeHtml(p.classification)}</span>
      </div>
      <p class="text-sm text-secondary mb-3">${escapeHtml(p.description)}</p>
      <div class="spec-grid mb-4">
        <div class="spec-tile"><div class="spec-tile-label">Distance from Sun</div><div class="spec-tile-value">${escapeHtml(p.distanceFromSun)}</div></div>
        <div class="spec-tile"><div class="spec-tile-label">Diameter</div><div class="spec-tile-value">${escapeHtml(p.diameter)}</div></div>
        <div class="spec-tile"><div class="spec-tile-label">Orbital Period</div><div class="spec-tile-value">${escapeHtml(p.orbitalPeriod)}</div></div>
        <div class="spec-tile"><div class="spec-tile-label">Surface Gravity</div><div class="spec-tile-value">${escapeHtml(p.gravity)}</div></div>
      </div>
      <a href="#planets/${p.id}" class="btn btn-primary btn-sm">Open Full Planet Dossier →</a>
    `;
  };

  updateDetailPanel(selectedId);

  // Control Listeners
  const playBtn = container.querySelector('#solar-play-btn');
  playBtn.addEventListener('click', () => {
    paused = !paused;
    playBtn.textContent = paused ? 'Resume' : 'Pause';
  });

  const speedRange = container.querySelector('#solar-speed-range');
  const speedVal = container.querySelector('#solar-speed-val');
  speedRange.addEventListener('input', () => {
    speed = Number(speedRange.value);
    speedVal.textContent = `${speed.toFixed(1)}x`;
    setPref('lastSolarSpeed', speed);
  });

  const orbitsBtn = container.querySelector('#solar-orbits-btn');
  orbitsBtn.addEventListener('click', () => {
    showOrbits = !showOrbits;
    orbitsBtn.textContent = `Orbits: ${showOrbits ? 'On' : 'Off'}`;
    if (typeof toggleOrbitsCb === 'function') toggleOrbitsCb(showOrbits);
  });

  const labelsBtn = container.querySelector('#solar-labels-btn');
  labelsBtn.addEventListener('click', () => {
    showLabels = !showLabels;
    labelsBtn.textContent = `Labels: ${showLabels ? 'On' : 'Off'}`;
  });

  let resetCameraCb = null;
  let focusBodyCb = null;
  let toggleOrbitsCb = null;
  let animFrameId = null;
  let cleanupEngine = () => {};

  container.querySelector('#solar-reset-btn').addEventListener('click', () => {
    if (typeof resetCameraCb === 'function') resetCameraCb();
  });

  container.querySelectorAll('.solar-planet-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      updateDetailPanel(btn.dataset.focus);
      if (typeof focusBodyCb === 'function') focusBodyCb(btn.dataset.focus);
    });
  });

  // Choose Three.js WebGL if available, else crisp 2D Canvas fallback
  const canUseThree = Boolean(window.THREE && isWebGLSupported());

  if (canUseThree) {
    const THREE = window.THREE;
    const width = host.clientWidth || 800;
    const height = host.clientHeight || 500;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 800);
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'default' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    host.appendChild(renderer.domElement);

    // Label overlay canvas
    const labelOverlay = document.createElement('div');
    labelOverlay.style.cssText = 'position:absolute;inset:0;pointer-events:none;overflow:hidden;';
    host.appendChild(labelOverlay);

    // Lighting
    scene.add(new THREE.AmbientLight(0x557799, 0.85));
    const sunLight = new THREE.PointLight(0xffffff, 2.4, 300, 0.5);
    scene.add(sunLight);

    // Starfield
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(1200 * 3);
    for (let i = 0; i < 1200; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 420;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 420;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 420;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xdbeafe, size: 0.75 });
    scene.add(new THREE.Points(starGeo, starMat));

    // Sun
    const sunGeo = new THREE.SphereGeometry(3.4, 32, 32);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xffc857 });
    const sunMesh = new THREE.Mesh(sunGeo, sunMat);
    scene.add(sunMesh);

    const disposables = [starGeo, starMat, sunGeo, sunMat];
    const orbitLines = [];
    const planetEntries = [];

    PLANETS.forEach((p, idx) => {
      const texCanvas = createProceduralPlanetTexture(p);
      const texture = new THREE.CanvasTexture(texCanvas);
      const geo = new THREE.SphereGeometry(p.visual3d.radius, 28, 28);
      const mat = new THREE.MeshStandardMaterial({ map: texture, roughness: 0.78, metalness: 0.08 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.z = p.visual3d.tilt || 0;
      mesh.userData = { planetId: p.id };
      scene.add(mesh);
      disposables.push(texture, geo, mat);

      if (p.visual3d.hasRings) {
        const ringGeo = new THREE.RingGeometry(p.visual3d.radius * 1.35, p.visual3d.radius * 2.25, 48);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0xd8c39b, side: THREE.DoubleSide, transparent: true, opacity: 0.65 });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        mesh.add(ring);
        disposables.push(ringGeo, ringMat);
      }

      // Orbit ring
      const pts = [];
      const r = p.visual3d.orbitRadius;
      for (let a = 0; a <= 96; a++) {
        const theta = (a / 96) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(theta) * r, 0, Math.sin(theta) * r));
      }
      const orbGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const orbMat = new THREE.LineBasicMaterial({ color: 0x35d6f2, transparent: true, opacity: 0.25 });
      const orbLine = new THREE.Line(orbGeo, orbMat);
      scene.add(orbLine);
      orbitLines.push(orbLine);
      disposables.push(orbGeo, orbMat);

      const labelEl = document.createElement('div');
      labelEl.textContent = p.name;
      labelEl.style.cssText = 'position:absolute;font-size:11px;font-family:var(--font-mono);color:#C8D3DF;text-shadow:0 1px 4px #000;transform:translate(-50%,-140%);white-space:nowrap;';
      labelOverlay.appendChild(labelEl);

      planetEntries.push({
        planet: p,
        mesh,
        labelEl,
        angle: idx * 0.85
      });
    });

    toggleOrbitsCb = (visible) => {
      orbitLines.forEach((l) => { l.visible = visible; });
    };

    // Custom lightweight Orbit / Zoom / Pan controls (zero external OrbitControls dependency)
    let theta = 0.7;
    let phi = 1.05;
    let radius = 78;
    const target = new THREE.Vector3(0, 0, 0);
    let focusTargetId = null;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    resetCameraCb = () => {
      theta = 0.7;
      phi = 1.05;
      radius = 78;
      focusTargetId = null;
      target.set(0, 0, 0);
    };

    focusBodyCb = (id) => {
      focusTargetId = id === 'sun' ? null : id;
      if (id === 'sun') {
        target.set(0, 0, 0);
        radius = 28;
      } else {
        radius = 18;
      }
    };

    const dom = renderer.domElement;
    dom.style.cursor = 'grab';
    dom.addEventListener('pointerdown', (e) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      dom.style.cursor = 'grabbing';
    });
    window.addEventListener('pointerup', () => {
      dragging = false;
      dom.style.cursor = 'grab';
    });
    dom.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      theta -= dx * 0.006;
      phi = Math.max(0.2, Math.min(Math.PI - 0.2, phi - dy * 0.006));
    });
    dom.addEventListener('wheel', (e) => {
      e.preventDefault();
      radius = Math.max(10, Math.min(180, radius + e.deltaY * 0.05));
    }, { passive: false });

    const onResize = () => {
      const w = host.clientWidth || 800;
      const h = host.clientHeight || 500;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    const vec = new THREE.Vector3();
    const animate = () => {
      animFrameId = requestAnimationFrame(animate);
      const dt = paused ? 0 : 0.005 * speed;

      planetEntries.forEach((entry) => {
        entry.angle += dt * entry.planet.visual3d.speed;
        const r = entry.planet.visual3d.orbitRadius;
        entry.mesh.position.set(Math.cos(entry.angle) * r, 0, Math.sin(entry.angle) * r);
        entry.mesh.rotation.y += paused ? 0 : entry.planet.visual3d.rotationSpeed * speed;
      });

      if (focusTargetId) {
        const focused = planetEntries.find((e) => e.planet.id === focusTargetId);
        if (focused) target.lerp(focused.mesh.position, 0.08);
      }

      camera.position.set(
        target.x + radius * Math.sin(phi) * Math.cos(theta),
        target.y + radius * Math.cos(phi),
        target.z + radius * Math.sin(phi) * Math.sin(theta)
      );
      camera.lookAt(target);
      renderer.render(scene, camera);

      const w = host.clientWidth;
      const h = host.clientHeight;
      planetEntries.forEach((entry) => {
        if (!showLabels) {
          entry.labelEl.style.display = 'none';
          return;
        }
        vec.copy(entry.mesh.position).project(camera);
        if (vec.z > 1) {
          entry.labelEl.style.display = 'none';
        } else {
          entry.labelEl.style.display = 'block';
          entry.labelEl.style.left = `${(vec.x * 0.5 + 0.5) * w}px`;
          entry.labelEl.style.top = `${(-vec.y * 0.5 + 0.5) * h}px`;
        }
      });
    };
    animate();

    cleanupEngine = () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', onResize);
      disposables.forEach((d) => {
        if (typeof d.dispose === 'function') d.dispose();
      });
      renderer.dispose();
    };
  } else {
    // Crisp 2D Canvas Orbital Fallback when WebGL or Three.js CDN is unavailable
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'width:100%;height:100%;display:block;';
    host.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    const angles = PLANETS.map((_, i) => i * 0.85);

    const draw2d = () => {
      animFrameId = requestAnimationFrame(draw2d);
      const w = host.clientWidth || 700;
      const h = host.clientHeight || 440;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      ctx.fillStyle = '#040B14';
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const maxR = Math.min(w, h) * 0.44;

      // Sun
      ctx.beginPath();
      ctx.arc(cx, cy, 14, 0, Math.PI * 2);
      ctx.fillStyle = '#FFC857';
      ctx.fill();

      PLANETS.forEach((p, idx) => {
        if (!paused) angles[idx] += 0.005 * speed * p.visual3d.speed;
        const r = ((idx + 1) / PLANETS.length) * maxR;
        if (showOrbits) {
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(53, 214, 242, 0.22)';
          ctx.stroke();
        }
        const x = cx + Math.cos(angles[idx]) * r;
        const y = cy + Math.sin(angles[idx]) * r;
        ctx.beginPath();
        ctx.arc(x, y, Math.max(4, p.visual3d.radius * 4.5), 0, Math.PI * 2);
        ctx.fillStyle = p.colorHex;
        ctx.fill();
        if (showLabels) {
          ctx.fillStyle = '#C8D3DF';
          ctx.font = '11px Inter, sans-serif';
          ctx.fillText(p.name, x + 8, y + 4);
        }
      });

      ctx.fillStyle = '#8EA1B7';
      ctx.font = '11px Inter, sans-serif';
      ctx.fillText('2D Canvas Orbital Fallback Mode (WebGL/Three.js unavailable)', 14, h - 46);
    };
    draw2d();
    cleanupEngine = () => cancelAnimationFrame(animFrameId);
  }

  refreshIcons();
  return cleanupEngine;
}
