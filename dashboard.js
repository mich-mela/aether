/**
 * AETHER Personalized Mission Control Dashboard
 */

import { getDashboardData } from './data-service.js';
import { renderSpaceImage } from './images.js';
import { PLANETS } from './data-planets.js';
import { COURSES, LEARNING_PATHS } from './data-courses.js';
import { LESSONS } from './data-lessons.js';
import { getUserProgressSummary, getRecentlyViewed } from './progress-db.js';
import { attachImageFallbacks, escapeHtml, formatUtcDate, formatUtcTime, refreshIcons } from './helpers.js';
import { renderDataBadge, renderLoadingState } from './components.js';

let activeChart = null;

export async function renderDashboardView(container, state) {
  container.innerHTML = renderLoadingState('Synchronizing Mission Control telemetry...');

  const [dashData, progressSummary, recentItems] = await Promise.all([
    getDashboardData(),
    state.user ? getUserProgressSummary(state.user.id) : Promise.resolve(null),
    state.user ? getRecentlyViewed(state.user.id, 6) : Promise.resolve([])
  ]);

  const userName = state.user ? state.user.fullName : 'Explorer';
  const currentPathId = state.user?.profile?.currentPathId || 'astronomy-beginner';
  const currentPath = LEARNING_PATHS.find((p) => p.id === currentPathId) || LEARNING_PATHS[0];
  const currentPathProgress = progressSummary?.pathProgress.find((p) => p.pathId === currentPath.id) || { completedLessons: 0, totalLessons: 2, percent: 0 };

  const lastCourseProgress = progressSummary?.progressList?.[0] || null;
  const continueLesson = lastCourseProgress?.currentLessonId
    ? LESSONS.find((l) => l.id === lastCourseProgress.currentLessonId)
    : LESSONS.find((l) => currentPath.courseIds.includes(l.courseId)) || LESSONS[0];

  const { apod, jpl, stats } = dashData;

  container.innerHTML = `
    <div class="fade-in">
      <section class="dashboard-hero">
        <div>
          <div class="page-eyebrow">AETHER Mission Control</div>
          <h1>Welcome, ${escapeHtml(userName)}</h1>
          <p class="text-sm text-secondary" style="max-width:600px;">
            ${state.user
              ? `Active Level: <strong>${escapeHtml(state.user.profile?.level || 'Beginner')}</strong> • Current Path: <strong>${escapeHtml(currentPath.title)}</strong>`
              : 'Exploring in Guest Mode. Create a local account to persist your lessons, quizzes, and achievements in IndexedDB.'}
          </p>
        </div>
        <div style="text-align:right;">
          <div class="mono text-cyan" style="font-size:1.35rem;font-weight:600;" id="dashboard-utc-clock">${formatUtcTime()}</div>
          <div class="text-xs text-muted">${formatUtcDate()}</div>
          <div class="flex gap-2 mt-3" style="justify-content:flex-end;flex-wrap:wrap;">
            <a href="#solar-system" class="btn btn-primary btn-sm">Launch 3D Solar System</a>
            <a href="#lesson/${escapeHtml(continueLesson.id)}" class="btn btn-secondary btn-sm">Continue Learning</a>
          </div>
        </div>
      </section>

      <!-- KPI Overview Strip -->
      <section class="grid-4 mb-6" aria-label="Platform Statistics">
        <div class="stat-card">
          <div class="flex justify-between items-center">
            <span class="stat-label">Learning Progress</span>
            ${renderDataBadge(state.user ? 'Cached' : 'Demonstration', state.user ? 'Local DB' : 'Guest')}
          </div>
          <div class="stat-value">${progressSummary ? `${progressSummary.completedLessonsCount}/${progressSummary.totalLessonsCount}` : `0/${stats.lessonsCount}`}</div>
          <div class="stat-meta">Lessons completed across ${stats.coursesCount} courses</div>
        </div>

        <div class="stat-card">
          <div class="flex justify-between items-center">
            <span class="stat-label">Solar System</span>
            ${renderDataBadge('Historical', 'Verified')}
          </div>
          <div class="stat-value">${stats.planetsCount} Planets</div>
          <div class="stat-meta">NASA NSSDC Planetary Fact Sheet data</div>
        </div>

        <div class="stat-card">
          <div class="flex justify-between items-center">
            <span class="stat-label">Space Missions</span>
            ${renderDataBadge('Historical')}
          </div>
          <div class="stat-value">${stats.missionsCount} Flagships</div>
          <div class="stat-meta">Apollo, Voyager, JWST, Hubble, Artemis &amp; more</div>
        </div>

        <div class="stat-card">
          <div class="flex justify-between items-center">
            <span class="stat-label">Achievements</span>
            ${renderDataBadge(state.user ? 'Cached' : 'Demonstration', 'Badges')}
          </div>
          <div class="stat-value">${progressSummary ? progressSummary.achievements.length : 0} / 6</div>
          <div class="stat-meta">Earned through verified lesson &amp; quiz completion</div>
        </div>
      </section>

      <!-- NASA APOD & Continue Learning -->
      <section class="grid-2 mb-6">
        <article class="card">
          <div class="card-header">
            <div>
              <div class="page-eyebrow">Featured Astronomy Briefing</div>
              <h2 class="card-title">NASA Astronomy Picture of the Day</h2>
            </div>
            ${renderDataBadge(apod.dataStatus)}
          </div>
          <div class="card-media">
            ${renderSpaceImage({
              src: apod.url,
              alt: apod.title,
              title: apod.title,
              palette: ['#1D3557', '#35D6F2', '#07111F'],
              variant: 'nebula'
            })}
          </div>
          <h3 style="font-size:1.05rem;">${escapeHtml(apod.title)}</h3>
          <p class="text-xs text-muted mb-2">${escapeHtml(apod.date)} • Credit: ${escapeHtml(apod.copyright || 'NASA')}</p>
          <p class="text-sm text-secondary">${escapeHtml((apod.explanation || '').slice(0, 260))}${(apod.explanation || '').length > 260 ? '…' : ''}</p>
          <div class="mt-4 flex flex-wrap gap-2">
            <a href="${escapeHtml(apod.sourceUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">Official NASA APOD</a>
            <a href="#gallery" class="btn btn-ghost btn-sm">Open Space Gallery</a>
          </div>
        </article>

        <div class="flex" style="flex-direction:column;gap:var(--space-5);">
          <article class="card">
            <div class="card-header">
              <div>
                <div class="page-eyebrow">Active Learning Path</div>
                <h2 class="card-title">${escapeHtml(currentPath.title)}</h2>
              </div>
              <span class="badge badge-cyan">${currentPathProgress.percent}%</span>
            </div>
            <p class="text-sm text-muted mb-3">${escapeHtml(currentPath.description)}</p>
            <div class="progress-track mb-3">
              <div class="progress-fill" style="width:${currentPathProgress.percent}%;"></div>
            </div>
            <p class="text-xs text-muted mb-4">
              ${currentPathProgress.completedLessons} of ${currentPathProgress.totalLessons} lessons completed in this path.
            </p>
            <div class="flex flex-wrap gap-2">
              <a href="#lesson/${escapeHtml(continueLesson.id)}" class="btn btn-primary btn-sm">Resume: ${escapeHtml(continueLesson.title)}</a>
              <a href="#learning-paths" class="btn btn-secondary btn-sm">All Learning Paths</a>
            </div>
          </article>

          <article class="card">
            <div class="card-header">
              <h2 class="card-title">Quick Navigation</h2>
            </div>
            <div class="grid-2" style="gap:var(--space-3);">
              <a href="#solar-system" class="btn btn-secondary">3D Solar System</a>
              <a href="#simulator" class="btn btn-secondary">Gravity Simulator</a>
              <a href="#satellites" class="btn btn-secondary">Satellite Tracker</a>
              <a href="#deep-space" class="btn btn-secondary">Deep Space</a>
            </div>
          </article>
        </div>
      </section>

      <!-- Scientific Chart & JPL Near-Earth Reference -->
      <section class="grid-2 mb-6">
        <article class="card">
          <div class="card-header">
            <div>
              <h2 class="card-title">Planetary Surface Gravity (m/s²)</h2>
              <p class="text-xs text-muted" style="margin:0;">Source: NASA NSSDC Planetary Fact Sheet</p>
            </div>
            ${renderDataBadge('Historical')}
          </div>
          <div class="chart-box">
            <canvas id="dashboard-gravity-chart" aria-label="Bar chart of surface gravity for the eight planets"></canvas>
          </div>
        </article>

        <article class="card">
          <div class="card-header">
            <div>
              <h2 class="card-title">Near-Earth Object Reference</h2>
              <p class="text-xs text-muted" style="margin:0;">${escapeHtml(jpl.sourceName)}</p>
            </div>
            ${renderDataBadge(jpl.dataStatus)}
          </div>
          <p class="text-xs text-muted mb-3">${escapeHtml(jpl.note)}</p>
          <div class="table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Object</th>
                  <th>Date</th>
                  <th>Distance</th>
                  <th>Rel. Speed</th>
                </tr>
              </thead>
              <tbody>
                ${jpl.records.map((r) => `
                  <tr>
                    <td class="font-semibold">${escapeHtml(r.designation)}</td>
                    <td class="mono text-xs">${escapeHtml(r.date)}</td>
                    <td class="text-xs">${escapeHtml(r.distanceLd)}</td>
                    <td class="mono text-xs">${escapeHtml(r.velocityKmS)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          <div class="mt-3">
            <a href="${escapeHtml(jpl.sourceUrl)}" target="_blank" rel="noopener noreferrer" class="text-xs">View NASA JPL CNEOS Documentation →</a>
          </div>
        </article>
      </section>

      <!-- Recently Explored Objects -->
      <section class="card">
        <div class="card-header">
          <h2 class="card-title">Recently Explored Objects</h2>
          <a href="#favorites" class="text-sm">View All Activity →</a>
        </div>
        ${recentItems.length ? `
          <div class="grid-3">
            ${recentItems.map((item) => `
              <a href="${escapeHtml(item.route)}" class="card card-interactive" style="padding:var(--space-3);text-decoration:none;">
                <span class="badge badge-neutral mb-2">${escapeHtml(item.entityType)}</span>
                <div class="font-semibold text-sm" style="color:var(--text-primary);">${escapeHtml(item.title)}</div>
              </a>
            `).join('')}
          </div>
        ` : `
          <p class="text-sm text-muted">No recently explored items yet. Visit <a href="#planets">Planet Explorer</a>, <a href="#missions">Space Missions</a>, or <a href="#deep-space">Deep Space</a> to build your exploration log.</p>
        `}
      </section>
    </div>
  `;

  attachImageFallbacks(container);
  refreshIcons();

  // Render Chart.js planetary gravity chart (with safe fallback if CDN offline)
  const canvas = container.querySelector('#dashboard-gravity-chart');
  if (canvas) {
    if (activeChart) {
      activeChart.destroy();
      activeChart = null;
    }
    if (window.Chart) {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      const tickColor = isLight ? '#566B85' : '#8EA1B7';
      const gridColor = isLight ? 'rgba(11,23,40,0.08)' : 'rgba(200,211,223,0.1)';
      activeChart = new window.Chart(canvas, {
        type: 'bar',
        data: {
          labels: PLANETS.map((p) => p.name),
          datasets: [{
            label: 'Gravity (m/s²)',
            data: PLANETS.map((p) => p.gravityMs2),
            backgroundColor: PLANETS.map((p) => p.colorHex),
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { ticks: { color: tickColor }, grid: { display: false } },
            y: { ticks: { color: tickColor }, grid: { color: gridColor } }
          }
        }
      });
    } else {
      const ctx = canvas.getContext('2d');
      canvas.width = canvas.clientWidth || 500;
      canvas.height = 240;
      ctx.fillStyle = '#8EA1B7';
      ctx.font = '13px Inter, sans-serif';
      ctx.fillText('Planetary Surface Gravity (m/s²) — Offline Chart View', 12, 24);
      const maxG = 25;
      const barW = Math.max(24, (canvas.width - 60) / PLANETS.length - 10);
      PLANETS.forEach((p, idx) => {
        const h = (p.gravityMs2 / maxG) * 160;
        const x = 24 + idx * (barW + 10);
        const y = 205 - h;
        ctx.fillStyle = p.colorHex;
        ctx.fillRect(x, y, barW, h);
        ctx.fillStyle = '#C8D3DF';
        ctx.font = '10px Inter, sans-serif';
        ctx.fillText(p.name.slice(0, 3), x, 222);
      });
    }
  }

  return () => {
    if (activeChart) {
      activeChart.destroy();
      activeChart = null;
    }
  };
}
